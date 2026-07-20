import {
  ArrowLeft, CaretRight, Heart, MagnifyingGlass, Pause, Play, Queue,
  SignOut, SkipBack, SkipForward, StarFour, UserCircle, X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const featured = [
  { title: "BLUE HOUR", artist: "Sora Lin", image: "/assets/blue-hour-hero.jpg" },
  { title: "水晶花园", artist: "Ava Miro", image: "/assets/crystal-flower-cover.jpg" },
  { title: "火星午后", artist: "Cian Vale", image: "/assets/ember-dunes-cover.jpg" },
];
const authHeaders = () => ({ "Content-Type": "application/json", "x-session-token": localStorage.getItem("aster-session") || "" });
async function readApi(response) {
  const body = await response.text();
  try { return body ? JSON.parse(body) : {}; } catch { return { error: "服务返回了无法识别的数据，请刷新页面后重试" }; }
}

function navigate(to) { window.history.pushState({}, "", to); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo({ top: 0, behavior: "smooth" }); }
function RouteLink({ to, children, ...props }) { return <a href={to} {...props} onClick={(event) => { props.onClick?.(event); if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey) { event.preventDefault(); navigate(to); } }}>{children}</a>; }
function useLocation() { const [value, setValue] = useState(`${location.pathname}${location.search}`); useEffect(() => { const sync = () => setValue(`${location.pathname}${location.search}`); addEventListener("popstate", sync); return () => removeEventListener("popstate", sync); }, []); return value; }

function Poster({ track, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  return <img className={`poster ${loaded ? "is-loaded" : ""} ${className}`} src={track.artwork || track.image} alt={`${track.title} 封面`} onLoad={() => setLoaded(true)} />;
}

function LoginPage({ onAuth }) {
  const [mode, setMode] = useState("login"); const [form, setForm] = useState({ name: "", email: "", password: "" }); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [switching, setSwitching] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await readApi(response); if (!response.ok) throw new Error(data.error || "登录服务暂时不可用，请稍后重试");
      localStorage.setItem("aster-session", data.token); onAuth(data.user);
    } catch (err) { setError(err.message || "连接失败，请稍后重试"); } finally { setBusy(false); }
  }
  function switchMode() { if (switching) return; setSwitching(true); window.setTimeout(() => { setMode((value) => value === "login" ? "register" : "login"); setError(""); setSwitching(false); }, 145); }
  return <main className="auth-page">
    <div className="auth-art auth-art-one" /><div className="auth-art auth-art-two" />
    <section className="auth-card">
      <RouteLink className="brand auth-brand" to="/"><StarFour size={27} weight="fill" /> Aster</RouteLink>
      <div className={switching ? "auth-content is-leaving" : "auth-content"} key={mode}>
        <p className="auth-kicker">YOUR QUIET CORNER</p><h1>{mode === "login" ? "回来听歌" : "从这里开始"}</h1><p className="auth-copy">把喜欢的声音，安放在属于你的音乐库。</p>
        <form onSubmit={submit}>
        {mode === "register" && <label>昵称<input required value={form.name} placeholder="怎么称呼你" onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}
        <label>邮箱<input required type="email" autoComplete="email" value={form.email} placeholder="you@example.com" onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>密码<input required minLength="6" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={form.password} placeholder="至少 6 位" onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <p className="form-error">{error}</p>}<button className="auth-submit" disabled={busy}>{busy ? "正在连接…" : mode === "login" ? "登录 Aster" : "创建帐户"}</button>
        </form>
        <button className="switch-auth" onClick={switchMode}>{mode === "login" ? "还没有帐户？创建一个" : "已有帐户？去登录"}</button>
      </div>
    </section>
  </main>;
}

function Header({ pathname, user, onLogout }) { return <header className="site-header"><nav className="site-nav"><RouteLink className="brand" to="/"><StarFour size={28} weight="fill" /> Aster</RouteLink><div className="nav-links"><RouteLink className={pathname === "/" ? "nav-link is-active" : "nav-link"} to="/">发现</RouteLink><RouteLink className={pathname === "/search" ? "nav-link is-active" : "nav-link"} to="/search">搜索音乐</RouteLink><RouteLink className={pathname === "/library" ? "nav-link is-active" : "nav-link"} to="/library">你的音乐库</RouteLink></div><div className="nav-actions"><RouteLink className="icon-link" aria-label="搜索" to="/search"><MagnifyingGlass size={23} /></RouteLink><button className="account-button" onClick={onLogout} title="退出登录"><UserCircle size={25} /><span>{user.name}</span><SignOut size={16} /></button></div></nav></header>; }

function HomePage() { return <main><section className="intro"><p className="home-overline">Aster · 你的声音角落</p><h1>今天，听点新的</h1><p>先从一段真实可试听的音乐开始</p><div className="intro-actions"><RouteLink className="button button-primary" to="/search">搜索并播放</RouteLink><RouteLink className="button button-secondary" to="/library">查看收藏</RouteLink></div></section><section className="feature-wrap"><div className="feature-card"><img src={featured[0].image} alt="BLUE HOUR 专辑封面" /><span className="feature-copy"><span className="eyebrow">ASTER SELECTS</span><strong>BLUE HOUR</strong><span>Sora Lin</span><small>在搜索中找到下一首真正可以播放的歌</small></span></div></section><section className="album-section"><p className="section-label">留给以后</p><div className="album-grid">{featured.slice(1).map((album) => <RouteLink className="album-card" to="/search" key={album.title}><img src={album.image} alt={`${album.title} 封面`} /><span className="album-overlay"><span><strong>{album.title}</strong><small>{album.artist}</small></span><Play size={19} weight="fill" /></span></RouteLink>)}</div></section></main>; }

function SearchPage({ onPlay, favorites, toggleFavorite }) {
  const initial = new URLSearchParams(location.search).get("q") || ""; const [query, setQuery] = useState(initial); const [tracks, setTracks] = useState([]); const [state, setState] = useState(initial ? "loading" : "idle"); const [source, setSource] = useState("");
  useEffect(() => { if (initial) search(initial); }, []);
  async function search(value = query) { const clean = value.trim(); if (!clean) return; setState("loading"); try { const response = await fetch(`/api/music/search?q=${encodeURIComponent(clean)}`); const data = await readApi(response); if (!response.ok) throw new Error(data.error || "音乐服务暂时不可用"); setTracks(data.tracks); setSource(data.source); setState("done"); navigate(`/search?q=${encodeURIComponent(clean)}`); } catch (error) { setState(error.message); } }
  return <main className="inner-page search-page"><section className="page-intro"><p>OPEN MUSIC SEARCH</p><h1>找一首，现在就听</h1><span>搜索会自动获取并缓存海报；每首结果都有可播放的试听片段。</span></section><form className="search-form" onSubmit={(e) => { e.preventDefault(); search(); }}><MagnifyingGlass size={23} /><input autoFocus value={query} placeholder="歌名、歌手或专辑" onChange={(e) => setQuery(e.target.value)} /><button type="submit">搜索</button></form>{state === "loading" && <p className="search-status">正在寻找声音，也在下载海报…</p>}{typeof state === "string" && !["idle", "loading", "done"].includes(state) && <p className="form-error search-status">{state}</p>}{state === "done" && <><p className="result-count">{tracks.length} 首可试听的结果 · {source === "netease" ? "NetEase Cloud Music API" : "公开试听源"}</p><section className="track-results">{tracks.map((track) => <TrackCard key={track.id} track={track} onPlay={onPlay} saved={favorites.some((item) => item.id === track.id)} onFavorite={toggleFavorite} />)}</section>{!tracks.length && <p className="search-status">没有找到可试听的结果，换一个关键词试试。</p>}</>}</main>;
}

function TrackCard({ track, onPlay, saved, onFavorite }) { return <article className="track-card"><Poster track={track} /><div className="track-meta"><strong>{track.title}</strong><span>{track.artist}</span><small>{track.album}</small></div><div className="track-actions"><button className="round-button play-button" aria-label={`播放 ${track.title}`} onClick={() => onPlay(track)}><Play size={20} weight="fill" /></button><button className={saved ? "round-button favorite is-saved" : "round-button favorite"} aria-label={saved ? "取消收藏" : "收藏"} onClick={() => onFavorite(track)}><Heart size={20} weight={saved ? "fill" : "regular"} /></button></div></article>; }

function LibraryPage({ favorites, onPlay, toggleFavorite }) { return <main className="inner-page"><section className="page-intro"><p>你的收藏</p><h1>陪你久一点的音乐</h1><span>收藏保存在本机 SQLite 数据库中，下次登录仍会在这里。</span></section><section className="library-layout"><div className="library-stat"><Heart size={25} weight="fill" /><strong>{favorites.length}</strong><span>已收藏曲目</span></div><div className="library-stat"><Queue size={25} /><strong>∞</strong><span>可播放试听</span></div><div className="library-stat"><StarFour size={25} weight="fill" /><strong>Aster</strong><span>你的音乐库</span></div></section>{favorites.length ? <section className="track-results">{favorites.map((track) => <TrackCard key={track.id} track={track} onPlay={onPlay} saved onFavorite={toggleFavorite} />)}</section> : <section className="empty-library"><Heart size={34} /><h2>还没有收藏</h2><p>搜索一首歌，点亮心形按钮，它就会留在这里。</p><RouteLink className="button button-primary" to="/search">去搜索音乐</RouteLink></section>}</main>; }

function Player({ track, playing, onToggle, onClose }) { if (!track) return null; return <aside className="mini-player"><Poster track={track} /><div><strong>{track.title}</strong><span>{track.artist}</span></div><button className="round-button" aria-label="上一首"><SkipBack size={19} weight="fill" /></button><button className="player-toggle" onClick={onToggle} aria-label={playing ? "暂停" : "播放"}>{playing ? <Pause size={21} weight="fill" /> : <Play size={21} weight="fill" />}</button><button className="round-button" aria-label="下一首"><SkipForward size={19} weight="fill" /></button><button className="close-player" onClick={onClose} aria-label="关闭播放器"><X size={19} /></button></aside>; }

export function App() {
  const route = useLocation(); const [pathname] = route.split("?"); const [user, setUser] = useState(null); const [ready, setReady] = useState(false); const [favorites, setFavorites] = useState([]); const [current, setCurrent] = useState(null); const [playing, setPlaying] = useState(false); const audio = useRef(null);
  useEffect(() => { const token = localStorage.getItem("aster-session"); if (!token) return setReady(true); fetch("/api/auth/me", { headers: authHeaders() }).then((r) => r.ok ? r.json() : Promise.reject()).then((data) => { setUser(data.user); }).catch(() => localStorage.removeItem("aster-session")).finally(() => setReady(true)); }, []);
  useEffect(() => { if (!user) return; fetch("/api/favorites", { headers: authHeaders() }).then((r) => r.json()).then((data) => setFavorites(data.tracks || [])).catch(() => {}); }, [user]);
  useEffect(() => { if (!audio.current || !current) return; audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }, [current]);
  function play(track) { setCurrent(track); }
  function togglePlayback() { if (!audio.current) return; if (audio.current.paused) audio.current.play().then(() => setPlaying(true)); else { audio.current.pause(); setPlaying(false); } }
  async function toggleFavorite(track) { const saved = favorites.some((item) => item.id === track.id); const response = await fetch(`/api/favorites${saved ? `/${encodeURIComponent(track.id)}` : ""}`, { method: saved ? "DELETE" : "POST", headers: authHeaders(), body: saved ? undefined : JSON.stringify({ track }) }); if (!response.ok) return; setFavorites((items) => saved ? items.filter((item) => item.id !== track.id) : [track, ...items]); }
  async function logout() { await fetch("/api/auth/logout", { method: "POST", headers: authHeaders() }); localStorage.removeItem("aster-session"); setUser(null); setFavorites([]); setCurrent(null); navigate("/"); }
  if (!ready) return <main className="loading-page"><StarFour size={34} weight="fill" /> 正在准备 Aster…</main>;
  if (!user) return <LoginPage onAuth={setUser} />;
  const page = pathname === "/search" ? <SearchPage onPlay={play} favorites={favorites} toggleFavorite={toggleFavorite} /> : pathname === "/library" ? <LibraryPage favorites={favorites} onPlay={play} toggleFavorite={toggleFavorite} /> : <HomePage />;
  return <div className="app-shell"><Header pathname={pathname} user={user} onLogout={logout} /><div className="page-transition" key={route}>{page}</div><audio ref={audio} src={current?.previewUrl} onEnded={() => setPlaying(false)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><Player track={current} playing={playing} onToggle={togglePlayback} onClose={() => { audio.current?.pause(); setCurrent(null); setPlaying(false); }} /></div>;
}
