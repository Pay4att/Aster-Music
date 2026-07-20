# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Prototype Decisions

- The selected visual target is the rounded-corner Aster music recommendation homepage with a large “BLUE HOUR” hero and three supporting album covers.
- Hero and album artwork use a brief 200ms hover: `translateY(-4px) scale(1.025)` with restrained soft elevation; it must not read as a dramatic zoom.
- The next music surface should enter on scroll only after it reaches the lower viewport: slow initial travel, then a brief overshoot and settle. Respect `prefers-reduced-motion` by rendering it immediately.
- The prototype now requires routed pages for navigation, search, profile/settings, albums, playlists, the player, and every primary action; avoid static navigation controls without destinations.
- Authentication, favorites, and poster caching are local-first; music search uses a self-hosted NeteaseCloudMusicApi when configured and a playable public-preview fallback otherwise. Search opens with a generic Dream pop starter set and quick genre/artist prompts; personalized recommendation ranking is explicitly out of scope.
- User-created playlists are local-first SQLite records: users can create, view, delete, and add their saved tracks; playback starts from the first saved track. Keep any future playlist work compatible with this ownership model.
- Keep implementation details such as SQLite out of listener-facing music-library copy. Aster supports light, night, and dream (indigo/purple/pink) themes through the header picker and remembers the listener's chosen theme locally.
- Theme background color must be applied to the root `html` layer, and vertical overscroll must be disabled so aggressive scroll gestures never reveal white browser bounce space.
- In the dream theme, the six quick-search cards use a deep-violet glass surface: a restrained upper highlight, gradual violet-to-near-black interior, and a crisp lavender rim at an 18px radius. They must not regress to flat purple controls or soft/blurred edge treatment.
- The discovery page's dream-theme reference informs material rather than scale: keep the existing refined, compact layout while using three quick-search cards per row with a solid deep-violet fill and a single crisp muted-lavender rim—no gradients, inner highlight, or glow.
- The persistent mini player must offer a clearly clickable full-screen player route. The expanded player follows an Apple Music–inspired treatment: softened artwork ambient background, centered transport controls, scrubber, and a progress-synchronised lyric-preview panel; do not display unlicensed verbatim song lyrics.
