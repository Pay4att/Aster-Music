import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import express from "express";
import { createServer as createViteServer } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, "data");
const posterDir = path.join(dataDir, "posters");
await fs.mkdir(posterDir, { recursive: true });

const db = new Database(path.join(dataDir, "aster.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
    name TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY, user_id INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER NOT NULL, track_id TEXT NOT NULL, track_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id, track_id)
  );
  CREATE TABLE IF NOT EXISTS playlists (
    id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS playlist_tracks (
    playlist_id INTEGER NOT NULL, track_id TEXT NOT NULL, track_json TEXT NOT NULL,
    added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (playlist_id, track_id)
  );
`);

const app = express();
app.use(express.json({ limit: "120kb" }));
app.use("/media/posters", express.static(posterDir, { immutable: true, maxAge: "30d" }));

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}
function userFromRequest(req) {
  const token = req.get("x-session-token");
  if (!token) return null;
  return db.prepare("SELECT users.id, users.email, users.name FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ?").get(token);
}
function requireUser(req, res) {
  const user = userFromRequest(req);
  if (!user) { res.status(401).json({ error: "请先登录" }); return null; }
  return user;
}
function newSession(userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, userId);
  return token;
}

app.post("/api/auth/register", (req, res) => {
  const { email = "", password = "", name = "" } = req.body || {};
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return res.status(400).json({ error: "请输入有效邮箱和至少 6 位密码" });
  try {
    const result = db.prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)").run(email.trim().toLowerCase(), hashPassword(password), name.trim() || "Aster 听众");
    const user = { id: result.lastInsertRowid, email: email.trim().toLowerCase(), name: name.trim() || "Aster 听众" };
    res.status(201).json({ token: newSession(user.id), user });
  } catch (error) {
    res.status(error.code === "SQLITE_CONSTRAINT_UNIQUE" ? 409 : 500).json({ error: error.code === "SQLITE_CONSTRAINT_UNIQUE" ? "这个邮箱已经注册过了" : "注册失败，请稍后再试" });
  }
});
app.post("/api/auth/login", (req, res) => {
  const { email = "", password = "" } = req.body || {};
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase());
  if (!user || !checkPassword(password, user.password_hash)) return res.status(401).json({ error: "邮箱或密码不正确" });
  res.json({ token: newSession(user.id), user: { id: user.id, email: user.email, name: user.name } });
});
app.get("/api/auth/me", (req, res) => {
  const user = userFromRequest(req);
  if (!user) return res.status(401).json({ error: "未登录" });
  res.json({ user });
});
app.post("/api/auth/logout", (req, res) => { const token = req.get("x-session-token"); if (token) db.prepare("DELETE FROM sessions WHERE token = ?").run(token); res.status(204).end(); });

async function cachePoster(remoteUrl) {
  if (!remoteUrl || !/^https?:\/\//i.test(remoteUrl)) return remoteUrl;
  const filename = `${crypto.createHash("sha256").update(remoteUrl).digest("hex")}.jpg`;
  const target = path.join(posterDir, filename);
  try { await fs.access(target); return `/media/posters/${filename}`; } catch { /* download below */ }
  try {
    const response = await fetch(remoteUrl, { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "Aster-Music/1.0" } });
    const size = Number(response.headers.get("content-length") || 0);
    if (!response.ok || (size && size > 8_000_000)) throw new Error("invalid artwork response");
    const body = Buffer.from(await response.arrayBuffer());
    if (body.length > 8_000_000) throw new Error("artwork too large");
    await fs.writeFile(target, body, { flag: "wx" }).catch((error) => { if (error.code !== "EEXIST") throw error; });
    return `/media/posters/${filename}`;
  } catch { return remoteUrl; }
}

async function neteaseSearch(query) {
  const base = process.env.MUSIC_API_BASE?.replace(/\/$/, "");
  if (!base) return null;
  const response = await fetch(`${base}/cloudsearch?keywords=${encodeURIComponent(query)}&limit=18`, { signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error("Music API unavailable");
  const payload = await response.json();
  const songs = payload.result?.songs || [];
  return Promise.all(songs.map(async (song) => ({
    id: `netease:${song.id}`,
    title: song.name,
    artist: song.ar?.map((artist) => artist.name).join(" / ") || "未知艺人",
    album: song.al?.name || "单曲",
    artwork: await cachePoster(song.al?.picUrl),
    previewUrl: `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`,
    source: "NetEase Cloud Music API",
  })));
}
async function itunesSearch(query) {
  const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=18&country=US`, { signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error("试听服务暂时不可用");
  const payload = await response.json();
  return Promise.all((payload.results || []).filter((song) => song.previewUrl).map(async (song) => ({
    id: `itunes:${song.trackId}`,
    title: song.trackName,
    artist: song.artistName,
    album: song.collectionName || "单曲",
    artwork: await cachePoster((song.artworkUrl100 || "").replace("100x100", "600x600")),
    previewUrl: song.previewUrl,
    source: "iTunes preview",
  })));
}
app.get("/api/music/search", async (req, res) => {
  const query = String(req.query.q || "").trim();
  if (!query) return res.status(400).json({ error: "请输入搜索词" });
  try {
    const tracks = await neteaseSearch(query).catch(() => null) || await itunesSearch(query);
    res.json({ tracks, source: process.env.MUSIC_API_BASE ? "netease" : "itunes" });
  } catch (error) { res.status(502).json({ error: error.message || "音乐服务暂时不可用" }); }
});
app.get("/api/favorites", (req, res) => {
  const user = requireUser(req, res); if (!user) return;
  const tracks = db.prepare("SELECT track_json FROM favorites WHERE user_id = ? ORDER BY created_at DESC").all(user.id).map((row) => JSON.parse(row.track_json));
  res.json({ tracks });
});
app.post("/api/favorites", (req, res) => {
  const user = requireUser(req, res); if (!user) return;
  const track = req.body?.track;
  if (!track?.id || !track?.title || !track?.previewUrl) return res.status(400).json({ error: "无效曲目" });
  db.prepare("INSERT INTO favorites (user_id, track_id, track_json) VALUES (?, ?, ?) ON CONFLICT(user_id, track_id) DO UPDATE SET track_json = excluded.track_json, created_at = CURRENT_TIMESTAMP").run(user.id, track.id, JSON.stringify(track));
  res.status(201).json({ track });
});
app.delete("/api/favorites/:id", (req, res) => { const user = requireUser(req, res); if (!user) return; db.prepare("DELETE FROM favorites WHERE user_id = ? AND track_id = ?").run(user.id, req.params.id); res.status(204).end(); });

function playlistSummary(row) {
  return { ...row, trackCount: Number(row.track_count || 0), cover: row.cover ? JSON.parse(row.cover).artwork || JSON.parse(row.cover).image : null };
}
function readPlaylist(userId, id) {
  const row = db.prepare(`SELECT p.*, COUNT(pt.track_id) AS track_count, (SELECT track_json FROM playlist_tracks WHERE playlist_id = p.id ORDER BY added_at DESC LIMIT 1) AS cover FROM playlists p LEFT JOIN playlist_tracks pt ON pt.playlist_id = p.id WHERE p.user_id = ? AND p.id = ? GROUP BY p.id`).get(userId, id);
  return row ? playlistSummary(row) : null;
}
app.get("/api/playlists", (req, res) => {
  const user = requireUser(req, res); if (!user) return;
  const rows = db.prepare(`SELECT p.*, COUNT(pt.track_id) AS track_count, (SELECT track_json FROM playlist_tracks WHERE playlist_id = p.id ORDER BY added_at DESC LIMIT 1) AS cover FROM playlists p LEFT JOIN playlist_tracks pt ON pt.playlist_id = p.id WHERE p.user_id = ? GROUP BY p.id ORDER BY p.created_at DESC, p.id DESC`).all(user.id);
  res.json({ playlists: rows.map(playlistSummary) });
});
app.post("/api/playlists", (req, res) => {
  const user = requireUser(req, res); if (!user) return;
  const name = String(req.body?.name || "").trim(); const description = String(req.body?.description || "").trim();
  if (!name || name.length > 48 || description.length > 180) return res.status(400).json({ error: "请填写 1–48 个字的歌单名，描述不超过 180 字" });
  const result = db.prepare("INSERT INTO playlists (user_id, name, description) VALUES (?, ?, ?)").run(user.id, name, description);
  res.status(201).json({ playlist: readPlaylist(user.id, result.lastInsertRowid) });
});
app.get("/api/playlists/:id", (req, res) => {
  const user = requireUser(req, res); if (!user) return;
  const playlist = readPlaylist(user.id, req.params.id); if (!playlist) return res.status(404).json({ error: "歌单不存在或无权访问" });
  const tracks = db.prepare("SELECT track_json FROM playlist_tracks WHERE playlist_id = ? ORDER BY added_at DESC").all(playlist.id).map((row) => JSON.parse(row.track_json));
  res.json({ playlist, tracks });
});
app.post("/api/playlists/:id/tracks", (req, res) => {
  const user = requireUser(req, res); if (!user) return;
  const playlist = readPlaylist(user.id, req.params.id); if (!playlist) return res.status(404).json({ error: "歌单不存在或无权访问" });
  const track = req.body?.track;
  if (!track?.id || !track?.title || !track?.previewUrl) return res.status(400).json({ error: "无效曲目" });
  db.prepare("INSERT INTO playlist_tracks (playlist_id, track_id, track_json) VALUES (?, ?, ?) ON CONFLICT(playlist_id, track_id) DO UPDATE SET track_json = excluded.track_json, added_at = CURRENT_TIMESTAMP").run(playlist.id, track.id, JSON.stringify(track));
  res.status(201).json({ playlist: readPlaylist(user.id, playlist.id) });
});
app.delete("/api/playlists/:id", (req, res) => {
  const user = requireUser(req, res); if (!user) return;
  const playlist = readPlaylist(user.id, req.params.id); if (!playlist) return res.status(404).json({ error: "歌单不存在或无权访问" });
  db.transaction(() => { db.prepare("DELETE FROM playlist_tracks WHERE playlist_id = ?").run(playlist.id); db.prepare("DELETE FROM playlists WHERE id = ?").run(playlist.id); })();
  res.status(204).end();
});

const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: "spa" });
app.use(vite.middlewares);
const port = Number(process.env.PORT || 5173);
app.listen(port, "0.0.0.0", () => console.log(`Aster is running at http://localhost:${port}`));
