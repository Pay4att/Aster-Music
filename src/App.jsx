import {
  ArrowLeft,
  CaretRight,
  Clock,
  GearSix,
  MagnifyingGlass,
  Play,
  Queue,
  StarFour,
  UserCircle,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

const albums = [
  {
    id: "blue-hour",
    title: "BLUE HOUR",
    artist: "Sora Lin",
    genre: "Alternative Pop",
    image: "/assets/blue-hour-hero.jpg",
    description: "在清澈的建筑回声里，把黄昏留得更久一点",
  },
  {
    id: "crystal-garden",
    title: "水晶花园",
    artist: "Ava Miro",
    genre: "Dream Pop",
    image: "/assets/crystal-flower-cover.jpg",
    description: "闪烁的合成器，像深夜里刚刚盛开的花",
  },
  {
    id: "ember-afternoons",
    title: "火星午后",
    artist: "Cian Vale",
    genre: "Ambient Folk",
    image: "/assets/ember-dunes-cover.jpg",
    description: "温热的砂砾、慢拍鼓点，和漫长的无所事事",
  },
  {
    id: "moon-letter",
    title: "月球来信",
    artist: "Darius Moon",
    genre: "Soul Electronica",
    image: "/assets/moonlight-portrait-cover.jpg",
    description: "为深夜写下的一封蓝色来信",
  },
];

const moods = [
  { id: "morning", title: "晨光慢行", note: "不必赶路的独立民谣", album: albums[2] },
  { id: "neon", title: "雨后霓虹", note: "把城市声音调低一点", album: albums[3] },
  { id: "daydream", title: "白日梦游", note: "轻盈、闪烁、没有边界", album: albums[1] },
  { id: "night", title: "深夜来信", note: "月光落下以后再开始", album: albums[0] },
];

const navItems = [
  { label: "发现", to: "/" },
  { label: "新歌", to: "/new" },
  { label: "心情", to: "/moods" },
  { label: "你的音乐库", to: "/library" },
];

function navigateTo(to) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function RouteLink({ to, className, children, onClick, ...props }) {
  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateTo(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function useLocation() {
  const [location, setLocation] = useState(() => `${window.location.pathname}${window.location.search}`);

  useEffect(() => {
    const syncLocation = () => setLocation(`${window.location.pathname}${window.location.search}`);
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, []);

  return location;
}

function SiteHeader({ pathname }) {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="主导航">
        <RouteLink className="brand" to="/" aria-label="Aster 首页">
          <StarFour aria-hidden="true" size={29} weight="fill" />
          <span>Aster</span>
        </RouteLink>

        <div className="nav-links">
          {navItems.map((item) => (
            <RouteLink className={pathname === item.to ? "nav-link is-active" : "nav-link"} key={item.to} to={item.to}>
              {item.label}
            </RouteLink>
          ))}
        </div>

        <div className="nav-actions">
          <RouteLink aria-label="搜索音乐" className="icon-link" to="/search">
            <MagnifyingGlass size={25} weight="regular" />
          </RouteLink>
          <RouteLink aria-label="个人资料" className="icon-link" to="/profile">
            <UserCircle size={28} weight="regular" />
          </RouteLink>
        </div>
      </nav>
    </header>
  );
}

function AlbumCard({ album, compact = false }) {
  return (
    <RouteLink className={compact ? "album-card compact" : "album-card"} to={`/album/${album.id}`}>
      <img alt={`${album.title}，${album.artist}的专辑封面`} src={album.image} />
      <span className="album-overlay">
        <span>
          <strong>{album.title}</strong>
          <small>{album.artist}</small>
        </span>
        <span className="album-play" aria-hidden="true"><Play size={17} weight="fill" /></span>
      </span>
    </RouteLink>
  );
}

function HomePage() {
  const [musicRevealed, setMusicRevealed] = useState(false);
  const musicSectionRef = useRef(null);
  const featured = albums[0];

  useEffect(() => {
    const section = musicSectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMusicRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMusicRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -32% 0px", threshold: 0.05 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="intro" id="top">
        <h1>今天，听点新的</h1>
        <p>为你挑选的声音，刚好适合此刻</p>
        <div className="intro-actions">
          <RouteLink className="button button-primary" to="/now-playing?track=blue-hour">开始播放</RouteLink>
          <RouteLink className="button button-secondary" to="/playlists">查看歌单</RouteLink>
        </div>
      </section>

      <section className="feature-wrap" aria-label="今日首选">
        <RouteLink className="feature-card" to={`/album/${featured.id}`}>
          <img alt="身穿钴蓝大衣的音乐人站在现代主义混凝土建筑中" src={featured.image} />
          <span className="feature-copy">
            <span className="eyebrow">你的首选</span>
            <strong>{featured.title}</strong>
            <span>{featured.artist}</span>
            <small>{featured.genre}</small>
          </span>
          <span className="feature-play" aria-hidden="true"><Play size={18} weight="fill" /></span>
        </RouteLink>
      </section>

      <section
        aria-label="继续探索"
        className={musicRevealed ? "album-section scroll-reveal is-revealed" : "album-section scroll-reveal"}
        id="more-music"
        ref={musicSectionRef}
      >
        <div className="album-grid">
          {albums.slice(1).map((album) => <AlbumCard album={album} key={album.id} />)}
        </div>
      </section>
    </>
  );
}

function PageIntro({ eyebrow, title, children }) {
  return (
    <section className="page-intro">
      {eyebrow && <p>{eyebrow}</p>}
      <h1>{title}</h1>
      {children}
    </section>
  );
}

function NewReleasesPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="本周精选" title="新歌，先听为快">
        <span>刚刚抵达的声音，已经为你排好队</span>
      </PageIntro>
      <section className="editorial-grid" aria-label="新发行专辑">
        {albums.map((album, index) => (
          <RouteLink className={index === 0 ? "editorial-card wide" : "editorial-card"} key={album.id} to={`/album/${album.id}`}>
            <img alt={`${album.title}专辑封面`} src={album.image} />
            <span><small>NEW RELEASE</small><strong>{album.title}</strong><em>{album.artist}</em></span>
          </RouteLink>
        ))}
      </section>
    </main>
  );
}

function MoodsPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="按此刻选择" title="给耳朵，换个世界">
        <span>选择一种心情，Aster 会从第一首开始陪你走</span>
      </PageIntro>
      <section className="mood-grid" aria-label="心情歌单">
        {moods.map((mood) => (
          <RouteLink className="mood-card" key={mood.id} to={`/playlist/${mood.id}`}>
            <img alt={`${mood.title}的歌单封面`} src={mood.album.image} />
            <span><strong>{mood.title}</strong><small>{mood.note}</small><CaretRight aria-hidden="true" size={21} /></span>
          </RouteLink>
        ))}
      </section>
    </main>
  );
}

function LibraryPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="你的收藏" title="陪你久一点的音乐">
        <span>你保存的专辑、歌单和最近播放都在这里</span>
      </PageIntro>
      <section className="library-layout">
        <div className="library-stat"><Clock aria-hidden="true" size={26} /><strong>42</strong><span>最近播放</span></div>
        <div className="library-stat"><StarFour aria-hidden="true" size={26} /><strong>18</strong><span>已收藏专辑</span></div>
        <div className="library-stat"><Queue aria-hidden="true" size={26} /><strong>6</strong><span>私人歌单</span></div>
      </section>
      <section className="collection-list" aria-label="收藏专辑">
        {albums.map((album) => (
          <RouteLink className="collection-row" key={album.id} to={`/album/${album.id}`}>
            <img alt="" src={album.image} />
            <span><strong>{album.title}</strong><small>{album.artist} · {album.genre}</small></span>
            <CaretRight aria-hidden="true" size={22} />
          </RouteLink>
        ))}
      </section>
    </main>
  );
}

function SearchPage({ search }) {
  const initialQuery = new URLSearchParams(search).get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  const normalized = query.trim().toLowerCase();
  const results = normalized ? albums.filter((album) => `${album.title} ${album.artist} ${album.genre}`.toLowerCase().includes(normalized)) : albums;

  return (
    <main className="inner-page search-page">
      <PageIntro eyebrow="搜索" title="你在找什么声音？" />
      <form className="search-form" onSubmit={(event) => { event.preventDefault(); navigateTo(`/search?q=${encodeURIComponent(query)}`); }}>
        <MagnifyingGlass aria-hidden="true" size={23} />
        <input aria-label="搜索歌手、专辑或歌单" autoFocus onChange={(event) => setQuery(event.target.value)} placeholder="搜索歌手、专辑或歌单" value={query} />
        <button type="submit">搜索</button>
      </form>
      <p className="result-count">{normalized ? `找到 ${results.length} 个结果` : "推荐从这里开始"}</p>
      <div className="album-grid search-results">
        {results.map((album) => <AlbumCard album={album} key={album.id} compact />)}
      </div>
      {normalized && results.length === 0 && <p className="empty-state">没有匹配的结果试试搜索 “Sora” 或 “Moon”</p>}
    </main>
  );
}

function AlbumPage({ album }) {
  if (!album) return <NotFoundPage />;
  return (
    <main className="detail-page">
      <RouteLink className="back-link" to="/"><ArrowLeft size={19} /> 回到发现</RouteLink>
      <section className="album-detail">
        <img alt={`${album.title}专辑封面`} src={album.image} />
        <div>
          <p>{album.genre}</p>
          <h1>{album.title}</h1>
          <h2>{album.artist}</h2>
          <span>{album.description}</span>
          <div className="detail-actions">
            <RouteLink className="button button-primary" to={`/now-playing?track=${album.id}`}>播放专辑</RouteLink>
            <RouteLink className="button button-secondary" to="/library">加入音乐库</RouteLink>
          </div>
        </div>
      </section>
      <TrackList album={album} />
    </main>
  );
}

function TrackList({ album }) {
  const tracks = ["开场白", "光的背面", "今天别太快", "最后一首"].map((name, index) => `${name} ${String(index + 1).padStart(2, "0")}`);
  return (
    <section className="track-list" aria-label={`${album.title}曲目`}>
      {tracks.map((track, index) => (
        <RouteLink className="track-row" key={track} to={`/now-playing?track=${album.id}&song=${index + 1}`}>
          <span>{String(index + 1).padStart(2, "0")}</span><strong>{track}</strong><small>{index % 2 ? "3:42" : "4:08"}</small><Play aria-hidden="true" size={16} weight="fill" />
        </RouteLink>
      ))}
    </section>
  );
}

function PlaylistsPage() {
  return (
    <main className="inner-page">
      <PageIntro eyebrow="为你编排" title="从第一首开始，刚刚好">
        <span>每张歌单都可以继续往下走</span>
      </PageIntro>
      <section className="playlist-grid">
        {moods.map((mood) => (
          <RouteLink className="playlist-card" key={mood.id} to={`/playlist/${mood.id}`}>
            <img alt="" src={mood.album.image} /><span><small>PLAYLIST</small><strong>{mood.title}</strong><em>{mood.note}</em></span>
          </RouteLink>
        ))}
      </section>
    </main>
  );
}

function PlaylistPage({ id }) {
  const mood = moods.find((item) => item.id === id) || moods[0];
  return (
    <main className="detail-page">
      <RouteLink className="back-link" to="/playlists"><ArrowLeft size={19} /> 所有歌单</RouteLink>
      <section className="playlist-detail">
        <img alt="" src={mood.album.image} />
        <div><p>ASTER PLAYLIST</p><h1>{mood.title}</h1><span>{mood.note}</span><RouteLink className="button button-primary" to={`/now-playing?track=${mood.album.id}`}>开始播放</RouteLink></div>
      </section>
      <TrackList album={mood.album} />
    </main>
  );
}

function NowPlayingPage({ search }) {
  const trackId = new URLSearchParams(search).get("track") || "blue-hour";
  const album = albums.find((item) => item.id === trackId) || albums[0];
  return (
    <main className="now-playing-page">
      <section className="now-playing-card">
        <img alt={`${album.title}专辑封面`} src={album.image} />
        <div className="playing-copy"><p>正在播放</p><h1>{album.title}</h1><span>{album.artist} · {album.genre}</span></div>
        <div className="player-progress"><span /><i /></div>
        <div className="player-actions">
          <RouteLink aria-label="上一首，返回歌单" className="player-link" to="/playlists"><ArrowLeft size={24} /></RouteLink>
          <RouteLink aria-label="查看专辑" className="player-main" to={`/album/${album.id}`}><Play size={25} weight="fill" /></RouteLink>
          <RouteLink aria-label="下一首，回到发现" className="player-link" to="/"><CaretRight size={27} /></RouteLink>
        </div>
      </section>
    </main>
  );
}

function ProfilePage() {
  return (
    <main className="inner-page profile-page">
      <section className="profile-hero"><UserCircle size={92} weight="thin" /><p>晚上好，</p><h1>Alex</h1><span>你的下一段声音旅程，已经准备好了</span></section>
      <div className="profile-links">
        <RouteLink to="/library"><Queue size={25} /><span><strong>我的音乐库</strong><small>收藏与最近播放</small></span><CaretRight size={21} /></RouteLink>
        <RouteLink to="/settings"><GearSix size={25} /><span><strong>偏好设置</strong><small>声音、动态效果与帐户</small></span><CaretRight size={21} /></RouteLink>
      </div>
    </main>
  );
}

function SettingsPage() {
  return (
    <main className="inner-page settings-page">
      <RouteLink className="back-link" to="/profile"><ArrowLeft size={19} /> 个人资料</RouteLink>
      <PageIntro eyebrow="偏好设置" title="把 Aster 调成你的样子" />
      <section className="settings-list">
        <RouteLink to="/moods"><span><strong>心情偏好</strong><small>更新推荐的情绪方向</small></span><CaretRight size={21} /></RouteLink>
        <RouteLink to="/playlists"><span><strong>自动播放</strong><small>选择新的接续方式</small></span><CaretRight size={21} /></RouteLink>
        <RouteLink to="/"><span><strong>动态效果</strong><small>遵从系统的减少动态效果偏好</small></span><CaretRight size={21} /></RouteLink>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return <main className="not-found"><p>404</p><h1>这里还没有音乐</h1><RouteLink className="button button-primary" to="/">回到发现</RouteLink></main>;
}

export function App() {
  const location = useLocation();
  const [pathname, search = ""] = location.split("?");
  const album = albums.find((item) => item.id === pathname.split("/").pop());
  const page = (() => {
    if (pathname === "/") return <HomePage />;
    if (pathname === "/new") return <NewReleasesPage />;
    if (pathname === "/moods") return <MoodsPage />;
    if (pathname === "/library") return <LibraryPage />;
    if (pathname === "/search") return <SearchPage search={search} />;
    if (pathname === "/playlists") return <PlaylistsPage />;
    if (pathname.startsWith("/playlist/")) return <PlaylistPage id={pathname.split("/").pop()} />;
    if (pathname.startsWith("/album/")) return <AlbumPage album={album} />;
    if (pathname === "/now-playing") return <NowPlayingPage search={search} />;
    if (pathname === "/profile") return <ProfilePage />;
    if (pathname === "/settings") return <SettingsPage />;
    return <NotFoundPage />;
  })();

  return <div className="app-shell"><SiteHeader pathname={pathname} />{page}</div>;
}
