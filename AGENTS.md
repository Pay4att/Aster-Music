# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Prototype Decisions

- The selected visual target is the rounded-corner Aster music recommendation homepage with a large “BLUE HOUR” hero and three supporting album covers.
- Hero and album artwork use a brief 200ms hover: `translateY(-4px) scale(1.025)` with restrained soft elevation; it must not read as a dramatic zoom.
- The next music surface should enter on scroll only after it reaches the lower viewport: slow initial travel, then a brief overshoot and settle. Respect `prefers-reduced-motion` by rendering it immediately.
- The prototype now requires routed pages for navigation, search, profile/settings, albums, playlists, the player, and every primary action; avoid static navigation controls without destinations.
- Authentication, favorites, and poster caching are local-first; music search uses a self-hosted NeteaseCloudMusicApi when configured and a playable public-preview fallback otherwise. Recommendation ranking is explicitly out of scope.
