import {
  ArrowLeft, CaretRight, Heart, MagnifyingGlass, Pause, Play, Queue,
  Moon, Plus, SignOut, SkipBack, SkipForward, StarFour, Sun, Trash, UserCircle, X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const featured = [
  { title: "BLUE HOUR", artist: "Sora Lin", image: "/assets/blue-hour-hero.jpg" },
  { title: "水晶花园", artist: "Ava Miro", image: "/assets/crystal-flower-cover.jpg" },
  { title: "火星午后", artist: "Cian Vale", image: "/assets/ember-dunes-cover.jpg" },
];
const discoveryCollections = [
  { eyebrow: "轻轻开始", title: "留白的早晨", description: "把节奏调慢一点，再开始今天。", image: "/assets/crystal-flower-cover.jpg", query: "morning" },
  { eyebrow: "傍晚驱动", title: "太阳落下以后", description: "给通勤和散步的一点亮度。", image: "/assets/ember-dunes-cover.jpg", query: "sunset" },
  { eyebrow: "深夜回声", title: "蓝色房间", description: "适合耳机里慢慢展开的声音。", image: "/assets/blue-hour-hero.jpg", query: "dream pop" },
];
const discoveryMoods = [
  { title: "不必急着抵达", copy: "Ambient · Piano · Soft electronic", image: "/assets/blue-hour-hero.jpg", query: "ambient" },
  { title: "把窗打开", copy: "Indie · Folk · Warm voices", image: "/assets/crystal-flower-cover.jpg", query: "indie folk" },
];
const starterSearches = ["Dream pop", "City pop", "Lo-fi", "雨天爵士", "Taylor Swift", "独立流行"];
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

function Header({ pathname, user, theme, onSetTheme, onLogout }) {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false); const themes = [{ value: "light", label: "浅色", Icon: Sun }, { value: "dark", label: "夜色", Icon: Moon }, { value: "dream", label: "梦境", Icon: StarFour }]; const ActiveThemeIcon = themes.find((item) => item.value === theme)?.Icon || Sun;
  return <header className="site-header"><nav className="site-nav"><RouteLink className="brand" to="/"><StarFour size={28} weight="fill" /> Aster</RouteLink><div className="nav-links"><RouteLink className={pathname === "/" ? "nav-link is-active" : "nav-link"} to="/">发现</RouteLink><RouteLink className={pathname === "/search" ? "nav-link is-active" : "nav-link"} to="/search">搜索音乐</RouteLink><RouteLink className={pathname === "/library" ? "nav-link is-active" : "nav-link"} to="/library">你的音乐库</RouteLink></div><div className="nav-actions"><RouteLink className="icon-link" aria-label="搜索" to="/search"><MagnifyingGlass size={23} /></RouteLink><div className="theme-picker"><button className="theme-toggle" onClick={() => setThemeMenuOpen((value) => !value)} aria-label="选择主题" aria-expanded={themeMenuOpen} title="选择主题"><ActiveThemeIcon size={19} weight="fill" /></button>{themeMenuOpen && <div className="theme-menu" role="menu" aria-label="主题选择">{themes.map(({ value, label, Icon }) => <button role="menuitemradio" aria-checked={theme === value} className={theme === value ? "is-selected" : ""} key={value} onClick={() => { onSetTheme(value); setThemeMenuOpen(false); }}><span className={`theme-swatch theme-swatch-${value}`}><Icon size={15} weight="fill" /></span><span>{label}</span>{theme === value && <StarFour size={13} weight="fill" />}</button>)}</div>}</div><button className="account-button" onClick={onLogout} title="退出登录"><UserCircle size={25} /><span>{user.name}</span><SignOut size={16} /></button></div></nav></header>;
}

function HomePage() {
  const supportingRef = useRef(null); const [isSupportingRevealed, setSupportingRevealed] = useState(false);
  useEffect(() => { const target = supportingRef.current; if (!target || matchMedia("(prefers-reduced-motion: reduce)").matches) return setSupportingRevealed(true); const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setSupportingRevealed(true); observer.disconnect(); } }, { rootMargin: "0px 0px -8%", threshold: .12 }); observer.observe(target); return () => observer.disconnect(); }, []);
  return <main className="discover-page">
    <section className="intro"><p className="home-overline">Aster · 你的声音角落</p><h1>今天，听点新的</h1><p>从一段可以慢慢展开的旋律开始。</p><div className="intro-actions"><RouteLink className="button button-primary" to="/search">搜索并播放</RouteLink><RouteLink className="button button-secondary" to="/library">查看收藏</RouteLink></div></section>
    <section className="feature-wrap"><RouteLink className="feature-card" to="/search?q=blue%20hour"><img src={featured[0].image} alt="BLUE HOUR 专辑封面" /><span className="feature-copy"><span className="eyebrow">ASTER SELECTS</span><strong>BLUE HOUR</strong><span>Sora Lin</span><small>在朦胧与清醒之间，留出一点空间。</small></span><span className="feature-play"><Play size={20} weight="fill" /></span></RouteLink></section>
    <section ref={supportingRef} className={`discover-section discover-collections scroll-reveal ${isSupportingRevealed ? "is-revealed" : ""}`}><div className="discover-heading"><div><p>今天的方向</p><h2>从感觉开始找歌</h2></div><RouteLink to="/search" className="text-link">查看全部 <CaretRight size={18} /></RouteLink></div><div className="collection-grid">{discoveryCollections.map((collection) => <RouteLink className="collection-card" to={`/search?q=${encodeURIComponent(collection.query)}`} key={collection.title}><img src={collection.image} alt="" /><span className="collection-shade" /><span className="collection-copy"><small>{collection.eyebrow}</small><strong>{collection.title}</strong><em>{collection.description}</em><span>去听听 <CaretRight size={17} weight="bold" /></span></span></RouteLink>)}</div></section>
    <section className="discover-section discovery-moods"><div className="discover-heading"><div><p>为此刻准备</p><h2>选一个心情</h2></div></div><div className="mood-feature-grid">{discoveryMoods.map((mood) => <RouteLink className="mood-feature" to={`/search?q=${encodeURIComponent(mood.query)}`} key={mood.title}><img src={mood.image} alt="" /><span><small>ASTER MOOD</small><strong>{mood.title}</strong><em>{mood.copy}</em><b>探索这个声音 <CaretRight size={17} weight="bold" /></b></span></RouteLink>)}</div></section>
    <section className="discover-section discover-quick"><div className="discover-heading"><div><p>再换一首</p><h2>快速找到新声音</h2></div></div><div className="quick-searches">{["City pop", "雨天", "爵士", "电影原声", "Chill", "独立流行"].map((query) => <RouteLink to={`/search?q=${encodeURIComponent(query)}`} key={query}>{query}<CaretRight size={16} /></RouteLink>)}</div></section>
  </main>;
}

function SearchPage({ onPlay, favorites, toggleFavorite }) {
  const initial = new URLSearchParams(location.search).get("q") || ""; const [query, setQuery] = useState(initial); const [tracks, setTracks] = useState([]); const [state, setState] = useState(initial ? "loading" : "starter-loading"); const [source, setSource] = useState(""); const [suggestionsOpen, setSuggestionsOpen] = useState(!initial);
  useEffect(() => { if (initial) search(initial, true); else loadStarter(); }, []);
  async function loadStarter() { setState("starter-loading"); try { const response = await fetch("/api/music/search?q=dream%20pop"); const data = await readApi(response); if (!response.ok) throw new Error(data.error || "音乐服务暂时不可用"); setTracks(data.tracks); setSource(data.source); setState("starter"); } catch (error) { setState(error.message); } }
  async function search(value = query, isRouteLoad = false) { const clean = value.trim(); if (!clean) return loadStarter(); setQuery(clean); setSuggestionsOpen(false); setState("loading"); try { const response = await fetch(`/api/music/search?q=${encodeURIComponent(clean)}`); const data = await readApi(response); if (!response.ok) throw new Error(data.error || "音乐服务暂时不可用"); setTracks(data.tracks); setSource(data.source); setState("done"); if (!isRouteLoad) navigate(`/search?q=${encodeURIComponent(clean)}`); } catch (error) { setState(error.message); } }
  const isTrackListVisible = state === "done" || state === "starter";
  return <main className="inner-page search-page"><section className="page-intro"><p>OPEN MUSIC SEARCH</p><h1>找一首，现在就听</h1><span>搜索框会先准备一组可试听的音乐，也可以从一个风格开始。</span></section><form className="search-form" onSubmit={(e) => { e.preventDefault(); search(); }}><MagnifyingGlass size={23} /><input autoFocus value={query} placeholder="歌名、歌手或专辑" onFocus={() => setSuggestionsOpen(true)} onChange={(e) => { setQuery(e.target.value); setSuggestionsOpen(true); }} /><button type="submit">搜索</button></form>{suggestionsOpen && <section className="search-suggestions" aria-label="搜索推荐"><p>不妨先听</p><div>{starterSearches.map((suggestion) => <button key={suggestion} type="button" onClick={() => search(suggestion)}>{suggestion}<CaretRight size={15} /></button>)}</div></section>}{state === "loading" || state === "starter-loading" ? <p className="search-status">正在准备可以试听的声音…</p> : null}{typeof state === "string" && !["idle", "loading", "done", "starter", "starter-loading"].includes(state) && <p className="form-error search-status">{state}</p>}{isTrackListVisible && <><div className="search-result-head"><p className="result-count">{state === "starter" ? "先从 Dream pop 开始" : `${tracks.length} 首可试听的结果`}<span> · {source === "netease" ? "NetEase Cloud Music API" : "公开试听源"}</span></p>{state === "starter" && <button type="button" onClick={() => search("dream pop")}>查看全部 <CaretRight size={16} /></button>}</div><section className="track-results">{tracks.map((track) => <TrackCard key={track.id} track={track} onPlay={onPlay} saved={favorites.some((item) => item.id === track.id)} onFavorite={toggleFavorite} />)}</section>{!tracks.length && <p className="search-status">没有找到可试听的结果，换一个关键词试试。</p>}</>}</main>;
}

function TrackCard({ track, onPlay, saved, onFavorite, onAddToPlaylist }) { return <article className="track-card"><Poster track={track} /><div className="track-meta"><strong>{track.title}</strong><span>{track.artist}</span><small>{track.album}</small></div><div className="track-actions"><button className="round-button play-button" aria-label={`播放 ${track.title}`} onClick={() => onPlay(track)}><Play size={20} weight="fill" /></button>{onAddToPlaylist && <button className="round-button add-to-playlist" aria-label={`将 ${track.title} 加入歌单`} onClick={() => onAddToPlaylist(track)}><Queue size={19} /></button>}<button className={saved ? "round-button favorite is-saved" : "round-button favorite"} aria-label={saved ? "取消收藏" : "收藏"} onClick={() => onFavorite(track)}><Heart size={20} weight={saved ? "fill" : "regular"} /></button></div></article>; }

function PlaylistComposer({ onCreate, onCancel }) {
  const [form, setForm] = useState({ name: "", description: "" }); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function submit(event) { event.preventDefault(); setBusy(true); setError(""); try { await onCreate(form); onCancel(); } catch (err) { setError(err.message || "创建失败，请稍后再试"); } finally { setBusy(false); } }
  return <form className="playlist-composer" onSubmit={submit}><div><label htmlFor="playlist-name">歌单名称</label><input id="playlist-name" autoFocus required maxLength="48" value={form.name} placeholder="给这段心情起个名字" onChange={(event) => setForm({ ...form, name: event.target.value })} /></div><div><label htmlFor="playlist-description">一句说明 <span>可选</span></label><input id="playlist-description" maxLength="180" value={form.description} placeholder="例如：晚风、散步和没有目的地的晚上" onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>{error && <p className="form-error">{error}</p>}<div className="composer-actions"><button type="button" onClick={onCancel}>取消</button><button className="button button-primary" disabled={busy}>{busy ? "正在创建…" : "创建歌单"}</button></div></form>;
}

function LibraryPage({ favorites, playlists, onPlay, toggleFavorite, onCreatePlaylist, onDeletePlaylist, onAddTrack }) {
  const [composerOpen, setComposerOpen] = useState(false); const [addingTrack, setAddingTrack] = useState(null); const [adding, setAdding] = useState(false); const [addError, setAddError] = useState("");
  async function addTrack(playlistId) { if (!addingTrack || adding) return; setAdding(true); setAddError(""); try { await onAddTrack(playlistId, addingTrack); setAddingTrack(null); } catch (err) { setAddError(err.message || "添加失败，请稍后重试"); } finally { setAdding(false); } }
  return <main className="inner-page library-page"><section className="page-intro"><p>你的收藏</p><h1>陪你久一点的音乐</h1><span>收藏和歌单，都留在这里，陪你慢慢听。</span></section><section className="library-layout"><div className="library-stat"><Heart size={25} weight="fill" /><strong>{favorites.length}</strong><span>已收藏曲目</span></div><div className="library-stat"><Queue size={25} /><strong>{playlists.length}</strong><span>你的歌单</span></div><div className="library-stat"><StarFour size={25} weight="fill" /><strong>Aster</strong><span>你的音乐库</span></div></section><section className="playlist-library"><div className="library-section-head"><div><p>你的歌单</p><h2>留住一段声音</h2></div><button className="create-playlist-button" onClick={() => setComposerOpen((value) => !value)}><Plus size={18} weight="bold" /> 新建歌单</button></div>{composerOpen && <PlaylistComposer onCreate={onCreatePlaylist} onCancel={() => setComposerOpen(false)} />}{playlists.length ? <div className="playlist-library-grid">{playlists.map((playlist) => <article className="user-playlist-card" key={playlist.id}><RouteLink to={`/playlist/${playlist.id}`}><span className="playlist-cover">{playlist.cover ? <img src={playlist.cover} alt="" /> : <StarFour size={31} weight="fill" />}</span><span><strong>{playlist.name}</strong><small>{playlist.trackCount} 首曲目{playlist.description ? ` · ${playlist.description}` : ""}</small></span></RouteLink><button className="delete-playlist" aria-label={`删除歌单 ${playlist.name}`} onClick={() => onDeletePlaylist(playlist.id)}><Trash size={17} /></button></article>)}</div> : !composerOpen && <button className="playlist-empty" onClick={() => setComposerOpen(true)}><Plus size={23} /><span><strong>创建第一张歌单</strong><small>把喜欢的歌，放进一个只属于你的名字里。</small></span></button>}</section>{addingTrack && <section className="playlist-picker"><div><p>加入歌单</p><h2>{addingTrack.title}</h2><button className="picker-close" onClick={() => setAddingTrack(null)} aria-label="关闭选择歌单"><X size={18} /></button></div>{playlists.length ? <div className="picker-options">{playlists.map((playlist) => <button disabled={adding} key={playlist.id} onClick={() => addTrack(playlist.id)}><span>{playlist.cover ? <img src={playlist.cover} alt="" /> : <StarFour size={18} weight="fill" />}</span><strong>{playlist.name}</strong><small>{playlist.trackCount} 首</small><Plus size={17} /></button>)}</div> : <p className="picker-empty">先创建一张歌单，再把这首歌放进去。</p>}{addError && <p className="form-error">{addError}</p>}</section>}<section className="library-songs"><div className="library-section-head"><div><p>已收藏</p><h2>喜欢的歌</h2></div></div>{favorites.length ? <section className="track-results">{favorites.map((track) => <TrackCard key={track.id} track={track} onPlay={onPlay} saved onFavorite={toggleFavorite} onAddToPlaylist={setAddingTrack} />)}</section> : <section className="empty-library"><Heart size={34} /><h2>还没有收藏</h2><p>搜索一首歌，点亮心形按钮，它就会留在这里。</p><RouteLink className="button button-primary" to="/search">去搜索音乐</RouteLink></section>}</section></main>;
}

function PlaylistDetailPage({ playlistId, onPlay, onBack }) {
  const [state, setState] = useState({ loading: true, playlist: null, tracks: [], error: "" });
  useEffect(() => { fetch(`/api/playlists/${encodeURIComponent(playlistId)}`, { headers: authHeaders() }).then(async (response) => { const data = await readApi(response); if (!response.ok) throw new Error(data.error || "加载歌单失败"); return data; }).then((data) => setState({ loading: false, playlist: data.playlist, tracks: data.tracks, error: "" })).catch((error) => setState({ loading: false, playlist: null, tracks: [], error: error.message })); }, [playlistId]);
  if (state.loading) return <main className="inner-page playlist-detail-page"><p className="search-status">正在打开歌单…</p></main>;
  if (state.error || !state.playlist) return <main className="inner-page playlist-detail-page"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> 返回音乐库</button><h1>找不到这张歌单</h1><p className="form-error">{state.error || "它可能已经被删除。"}</p></main>;
  const { playlist, tracks } = state;
  return <main className="detail-page playlist-detail-page"><button className="back-link" onClick={onBack}><ArrowLeft size={18} /> 返回音乐库</button><section className="playlist-detail"><div className="detail-playlist-cover">{playlist.cover ? <img src={playlist.cover} alt="" /> : <StarFour size={64} weight="fill" />}</div><div><p>你的歌单</p><h1>{playlist.name}</h1><span>{playlist.description || "把喜欢的声音收在这里。"}</span><button className="button button-primary" disabled={!tracks.length} onClick={() => tracks[0] && onPlay(tracks[0])}><Play size={18} weight="fill" /> 播放歌单</button></div></section><section className="track-list">{tracks.length ? tracks.map((track, index) => <button className="playlist-track-row" key={track.id} onClick={() => onPlay(track)}><span>{String(index + 1).padStart(2, "0")}</span><Poster track={track} /><div><strong>{track.title}</strong><small>{track.artist} · {track.album}</small></div><Play size={18} weight="fill" /></button>) : <p className="playlist-no-tracks">还没有曲目。回到音乐库，从收藏里把歌加入这张歌单。</p>}</section></main>;
}

const lyricPreview = [
  { at: 0, text: "现在，给这段旋律一点空间" },
  { at: 6, text: "让城市的声音慢慢退到身后" },
  { at: 13, text: "把今天没说完的话，留给夜色" },
  { at: 20, text: "我们沿着微光，继续向前" },
  { at: 27, text: "这一刻，只需要好好听歌" },
  { at: 34, text: "下一句，正在靠近" },
];

function formatTime(value) { if (!Number.isFinite(value)) return "0:00"; const minutes = Math.floor(value / 60); const seconds = Math.floor(value % 60).toString().padStart(2, "0"); return `${minutes}:${seconds}`; }

function Player({ track, playing, onToggle, onClose, onExpand }) {
  if (!track) return null;
  return <aside className="mini-player">
    <button className="mini-track" onClick={onExpand} aria-label={`展开 ${track.title} 的全屏播放器`}><Poster track={track} /><span><strong>{track.title}</strong><small>{track.artist}</small></span></button>
    <button className="round-button mini-skip" aria-label="上一首"><SkipBack size={19} weight="fill" /></button>
    <button className="player-toggle" onClick={onToggle} aria-label={playing ? "暂停" : "播放"}>{playing ? <Pause size={21} weight="fill" /> : <Play size={21} weight="fill" />}</button>
    <button className="round-button mini-skip" aria-label="下一首"><SkipForward size={19} weight="fill" /></button>
    <button className="expand-player" onClick={onExpand} aria-label="打开全屏播放器" title="打开全屏播放器"><CaretRight size={21} weight="bold" /></button>
    <button className="close-player" onClick={onClose} aria-label="关闭播放器"><X size={19} /></button>
  </aside>;
}

function PlayerPage({ track, playing, progress, duration, onSeek, onToggle, onClose, onBack }) {
  if (!track) return <main className="player-empty"><button className="player-back" onClick={onBack}><ArrowLeft size={21} /> 返回</button><StarFour size={38} weight="fill" /><h1>还没有正在播放的音乐</h1><p>从搜索或音乐库选择一首歌，播放器会在这里展开。</p><RouteLink className="button button-primary" to="/search">去搜索音乐</RouteLink></main>;
  const activeLyric = lyricPreview.reduce((index, line, currentIndex) => progress >= line.at ? currentIndex : index, 0);
  return <main className="full-player" style={{ "--cover-image": `url("${track.artwork || track.image}")` }}>
    <div className="player-ambient" aria-hidden="true" />
    <header className="full-player-top"><button className="player-back" onClick={onBack} aria-label="收起播放器"><ArrowLeft size={22} /></button><span>正在播放</span><button className="full-player-close" onClick={onClose} aria-label="关闭播放器"><X size={21} /></button></header>
    <section className="full-player-content">
      <div className="full-artwork"><Poster track={track} /><span className={playing ? "artwork-pulse is-playing" : "artwork-pulse"} /></div>
      <div className="full-player-main">
        <div className="full-track-title"><div><h1>{track.title}</h1><p>{track.artist}</p></div><button className="full-heart" aria-label="收藏此曲"><Heart size={23} /></button></div>
        <div className="full-progress"><input aria-label="播放进度" type="range" min="0" max={Math.max(duration || 30, 1)} step="0.1" value={Math.min(progress, Math.max(duration || 30, 1))} onChange={(event) => onSeek(Number(event.target.value))} style={{ "--progress": `${duration ? (progress / duration) * 100 : 0}%` }} /><div><span>{formatTime(progress)}</span><span>{formatTime(duration || 30)}</span></div></div>
        <div className="full-controls"><button className="full-control" aria-label="上一首"><SkipBack size={25} weight="fill" /></button><button className="full-play" onClick={onToggle} aria-label={playing ? "暂停" : "播放"}>{playing ? <Pause size={31} weight="fill" /> : <Play size={31} weight="fill" />}</button><button className="full-control" aria-label="下一首"><SkipForward size={25} weight="fill" /></button></div>
      </div>
      <section className="lyrics-panel" aria-label="歌词预览"><p>歌词预览</p><div className="lyrics-lines">{lyricPreview.map((line, index) => <span className={index === activeLyric ? "is-current" : index < activeLyric ? "is-past" : ""} key={line.at}>{line.text}</span>)}</div><small>试听歌曲暂无授权逐字歌词；这里随进度呈现歌词体验。</small></section>
    </section>
  </main>;
}

export function App() {
  const route = useLocation(); const [pathname] = route.split("?"); const [user, setUser] = useState(null); const [ready, setReady] = useState(false); const [favorites, setFavorites] = useState([]); const [playlists, setPlaylists] = useState([]); const [theme, setTheme] = useState(() => localStorage.getItem("aster-theme") || "light"); const [current, setCurrent] = useState(null); const [playing, setPlaying] = useState(false); const [progress, setProgress] = useState(0); const [duration, setDuration] = useState(0); const audio = useRef(null);
  useEffect(() => { const token = localStorage.getItem("aster-session"); if (!token) return setReady(true); fetch("/api/auth/me", { headers: authHeaders() }).then((r) => r.ok ? r.json() : Promise.reject()).then((data) => { setUser(data.user); }).catch(() => localStorage.removeItem("aster-session")).finally(() => setReady(true)); }, []);
  useEffect(() => { if (!user) return; fetch("/api/favorites", { headers: authHeaders() }).then((r) => r.json()).then((data) => setFavorites(data.tracks || [])).catch(() => {}); }, [user]);
  useEffect(() => { if (!user) return; fetch("/api/playlists", { headers: authHeaders() }).then((r) => r.json()).then((data) => setPlaylists(data.playlists || [])).catch(() => {}); }, [user]);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("aster-theme", theme); }, [theme]);
  useEffect(() => { if (!audio.current || !current) return; audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }, [current]);
  function play(track) { setProgress(0); setDuration(0); setCurrent(track); }
  function togglePlayback() { if (!audio.current) return; if (audio.current.paused) audio.current.play().then(() => setPlaying(true)); else { audio.current.pause(); setPlaying(false); } }
  function seekPlayback(value) { if (!audio.current) return; audio.current.currentTime = value; setProgress(value); }
  function leavePlayer() { if (history.length > 1) history.back(); else navigate("/"); }
  async function toggleFavorite(track) { const saved = favorites.some((item) => item.id === track.id); const response = await fetch(`/api/favorites${saved ? `/${encodeURIComponent(track.id)}` : ""}`, { method: saved ? "DELETE" : "POST", headers: authHeaders(), body: saved ? undefined : JSON.stringify({ track }) }); if (!response.ok) return; setFavorites((items) => saved ? items.filter((item) => item.id !== track.id) : [track, ...items]); }
  async function createPlaylist(payload) { const response = await fetch("/api/playlists", { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) }); const data = await readApi(response); if (!response.ok) throw new Error(data.error || "创建歌单失败"); setPlaylists((items) => [data.playlist, ...items]); return data.playlist; }
  async function deletePlaylist(id) { const response = await fetch(`/api/playlists/${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders() }); if (!response.ok) return; setPlaylists((items) => items.filter((playlist) => playlist.id !== id)); }
  async function addTrackToPlaylist(id, track) { const response = await fetch(`/api/playlists/${encodeURIComponent(id)}/tracks`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ track }) }); const data = await readApi(response); if (!response.ok) throw new Error(data.error || "添加曲目失败"); setPlaylists((items) => items.map((playlist) => playlist.id === data.playlist.id ? data.playlist : playlist)); }
  async function logout() { await fetch("/api/auth/logout", { method: "POST", headers: authHeaders() }); localStorage.removeItem("aster-session"); setUser(null); setFavorites([]); setPlaylists([]); setCurrent(null); navigate("/"); }
  if (!ready) return <main className="loading-page"><StarFour size={34} weight="fill" /> 正在准备 Aster…</main>;
  if (!user) return <LoginPage onAuth={setUser} />;
  const closePlayer = () => { audio.current?.pause(); setCurrent(null); setPlaying(false); setProgress(0); if (pathname === "/player") leavePlayer(); };
  const playlistId = pathname.match(/^\/playlist\/(\d+)$/)?.[1];
  const page = pathname === "/player" ? <PlayerPage track={current} playing={playing} progress={progress} duration={duration} onSeek={seekPlayback} onToggle={togglePlayback} onClose={closePlayer} onBack={leavePlayer} /> : playlistId ? <PlaylistDetailPage playlistId={playlistId} onPlay={play} onBack={() => navigate("/library")} /> : pathname === "/search" ? <SearchPage onPlay={play} favorites={favorites} toggleFavorite={toggleFavorite} /> : pathname === "/library" ? <LibraryPage favorites={favorites} playlists={playlists} onPlay={play} toggleFavorite={toggleFavorite} onCreatePlaylist={createPlaylist} onDeletePlaylist={deletePlaylist} onAddTrack={addTrackToPlaylist} /> : <HomePage />;
  return <div className="app-shell"><>{pathname !== "/player" && <Header pathname={pathname} user={user} theme={theme} onSetTheme={setTheme} onLogout={logout} />}</><div className="page-transition" key={route}>{page}</div><audio ref={audio} src={current?.previewUrl} onEnded={() => setPlaying(false)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} /><>{pathname !== "/player" && <Player track={current} playing={playing} onToggle={togglePlayback} onExpand={() => navigate("/player")} onClose={closePlayer} />}</></div>;
}
