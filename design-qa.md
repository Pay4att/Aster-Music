# Design QA

## Comparison Target

- Source visual truth: `/Users/pay4att/.codex/generated_images/019f5e2d-f812-73e1-84d9-17cefba2a66b/exec-c1c3a778-6e58-4466-9f8c-12998c701a3f.png`
- Browser-rendered implementation: `/Users/pay4att/Documents/AppleWeb/aster-music/prototype-desktop-routes-final.png`
- Full-view side-by-side evidence: `/Users/pay4att/Documents/AppleWeb/aster-music/design-qa-comparison-routes-final.png`
- Additional routed-page evidence: `/Users/pay4att/Documents/AppleWeb/aster-music/prototype-album-page-final.png`
- Viewport: `1487 × 1058`
- Compared state: desktop homepage at rest. The supporting-cover rail is deliberately softened and offset before its requested scroll-release interaction runs.

## Comparison History

### Iteration 1 — initial homepage

**Findings**

- [P1] Supporting-cover rail sat too low below the fold.
  Location: below the featured `BLUE HOUR` image.
  Evidence: the source begins its three cover crops directly beneath the hero; the early implementation inserted a visible section heading and delayed that surface.
  Impact: it changed above-the-fold density.
  Fix: removed the heading and tightened the section-top spacing.

### Iteration 2 — interaction pass

**Findings**

- No actionable P0, P1, or P2 differences remained after matching the hero, CTA pair, cover-rail placement, 200ms card lift, and the requested scroll-release motion.

### Iteration 3 — routed-page expansion

**Findings**

- No actionable P0, P1, or P2 differences were found in the final same-viewport home comparison. The information hierarchy, white-space rhythm, rounded visual surfaces, compact navigation, blue primary action, and cover rail remain aligned with the selected source.
- [P3] The final hero artwork uses a more diagonal architectural crop than the reference's circular opening. This was already an accepted generated-asset variation and preserves the subject, blue/stone palette, and left-aligned copy area.

## Required Fidelity Surfaces

- Fonts and typography: SF-style system stack with Chinese fallbacks retains the oversized near-black display headline, compact navigation labels, subdued supporting copy, and tight Apple-like tracking.
- Spacing and layout rhythm: retained the 74px header, centered title/action group, broad rounded hero, 24px hero radius, 18px cover radii, restrained shadows, and the immediate cover-rail placement from the source.
- Colors and visual tokens: white and warm near-white surfaces, near-black text, quiet grays, and the single `#0071e3` action/brand accent match the source palette.
- Image quality and asset fidelity: all hero and cover imagery is bespoke raster artwork. It is sharp at the inspected viewport and has no placeholders, CSS-drawn imagery, or handmade SVG substitutes.
- Copy and content: the selected homepage copy is retained; expanded destination pages use consistent fictional Aster catalog data and meaningful labels.

## Interaction Checks

- `开始播放` was clicked from the homepage and opened `/now-playing?track=blue-hour` with the expected player state.
- All primary destination families rendered successfully: new releases, moods, library, search, playlists, a playlist detail, an album detail, profile, and settings.
- The search input and submit control were each unique; searching `Moon` updated the query URL and returned exactly the `月球来信` result.
- Homepage, album, playlist, player, search, profile, and settings actions all have routed destinations; no core action remains static chrome.
- The previous hover-lift and scroll-release behavior remains in the shared homepage styles, with `prefers-reduced-motion` support.
- Final in-app browser console check: no warnings or errors from the prototype.

## Focused Region Comparison

The saved side-by-side comparison keeps the navigation, headline, CTA pair, hero image, and start of the cover rail visible at the same scale. The album-page capture was also checked to confirm the route expansion retains the same visual system away from the homepage.

## Implementation Checklist

- [x] Keep all navigation and primary CTAs routed.
- [x] Add functional search/query state.
- [x] Verify destination pages, search, player entry, and browser console.
- [x] Re-run the visual comparison at the desktop source viewport.

## Follow-up Polish

- If another asset pass is desired, regenerate the hero with the performer positioned closer to the center of a circular concrete opening.

final result: passed

---

# Design QA — Solid Quick-search Buttons

## Comparison Target

- Source direction: the user's explicit correction to remove the quick-search-button gradient and make the controls direct and sharp.
- Browser-rendered implementation: Chrome capture of `http://localhost:5173/`, dream theme, desktop viewport.

## Findings

- [P2, fixed] Quick-search buttons still had a vertical gradient, which made their surface read as soft rather than direct.
  - Fix: replaced both resting and hover gradients with solid fills while retaining the single 1px muted-lavender rim.

## Required Fidelity Surfaces

- Fonts and typography: unchanged compact labels and chevrons remain legible.
- Spacing and layout rhythm: unchanged refined card dimensions and three-column grid.
- Colors and visual tokens: computed browser style confirms `background-image: none`, solid `rgb(36, 32, 57)` fill, and `1px solid rgb(93, 77, 124)` border.
- Image quality and asset fidelity: no imagery changed.
- Copy and content: no copy changed.

## Interaction Checks

- Selected dream theme and confirmed all six routed quick-search cards render with solid fills.

final result: passed

---

# Design QA — Refined Discovery Scale Correction

## Comparison Target

- Source visual truth: the same two supplied dream-theme references, interpreted at their source device density rather than using their raster pixel sizes as CSS dimensions.
- Browser-rendered implementation: Chrome capture of `http://localhost:5173/`, dream theme, 1800 × 1043 desktop viewport.
- Focused-region evidence: mood cards and the six quick-search cards were visible in one Chrome capture after the correction.

## Comparison History

- [P1, fixed] The preceding desktop pass treated the reference raster pixels as CSS pixels, producing oversized headings, 682px-high mood cards, and 98px-high quick-search cards.
  - Fix: removed the wide-screen scale override entirely while retaining the reference's material treatment.

## Required Fidelity Surfaces

- Fonts and typography: compact display hierarchy is restored; headings no longer dominate the screen.
- Spacing and layout rhythm: verified mood lead card is 787 × 335px and quick-search cards are 436 × 72px, restoring the existing refined layout density.
- Colors and visual tokens: cards retain the source-inspired single muted-lavender border and simple deep-violet vertical fill.
- Image quality and asset fidelity: original artwork keeps its sharp crop and restrained rounded presentation.
- Copy and content: no copy changes were made.

## Interaction Checks

- Selected dream theme through the header picker.
- Confirmed six routed quick-search cards and two routed mood cards remain rendered.

## Implementation Checklist

- [x] Remove the oversized desktop overrides.
- [x] Preserve the corrected quick-card material.
- [x] Rebuild and browser-check the compact discovery layout.

final result: passed

---

# Design QA — Wide Discovery Rail and Quick-search Grid

## Comparison Target

- Source visual truth: `/var/folders/jz/9yfnmwvd1kj5c0401l1hnqd40000gn/T/codex-clipboard-5aec17fe-4a9a-42df-98f0-57d0b7fdcf8d.png` for the wide mood rail, and `/var/folders/jz/9yfnmwvd1kj5c0401l1hnqd40000gn/T/codex-clipboard-f7b5d745-fe0b-4089-9f22-a988a2c237d3.png` for the quick-search grid.
- Browser-rendered implementation: Chrome capture of `http://localhost:5173/`, dream theme, 1800 × 1043 desktop viewport.
- Full-view evidence: the mood rail was captured with its first card and the cropped beginning of the second card visible; the quick-search section was captured at the same viewport.
- Focused-region evidence: a single comparison image was rendered from the supplied quick-search reference (top) and the Chrome capture (bottom).

## Comparison History

- [P1, fixed] The prior discovery page constrained every section to a narrow maximum width and used a conventional two-column mood grid. It did not match the source's oversized lead card and horizontal continuation.
  - Fix: wide desktop mood rail now begins at the source-like left inset, uses a 85.3vw / 1600px lead-card cap, and clips the second card at the viewport edge.
- [P2, fixed] The prior quick-search cards had extra inset highlights and a more complex glass treatment than the source.
  - Fix: cards now use the source-like single muted-lavender rim and simple vertical deep-violet gradient, with three 98px-high cards per row at desktop width.

## Required Fidelity Surfaces

- Fonts and typography: display headings retain the heavy compact system face; wide desktop headings scale to the source's oversized hierarchy without wrapping.
- Spacing and layout rhythm: the verified capture measures the lead mood card at 1535 × 682px and quick cards at 544 × 98px, with the reference's spacious three-column cadence.
- Colors and visual tokens: the quick cards retain the near-black dream canvas, deep-violet fill, and one crisp muted-lavender border without glow or inner highlight.
- Image quality and asset fidelity: the supplied mood imagery remains the same sharp artwork, enlarged rather than replaced or stretched.
- Copy and content: existing Chinese labels and mood titles are preserved; no placeholder copy was introduced.

## Interaction Checks

- Selected dream theme using the header theme picker.
- Confirmed all six quick-search cards remain routed links.
- Confirmed the horizontal mood rail retains both clickable mood cards while intentionally clipping the continuation at desktop viewport edge.

## Implementation Checklist

- [x] Restore the wide mood-rail composition.
- [x] Match quick-search material and desktop density to the supplied crop.
- [x] Build and browser-check dream-theme desktop rendering.

final result: passed

---

# Design QA — Dream Quick-search Card Texture

## Comparison Target

- Source visual truth: user-provided reference crop at `/var/folders/jz/9yfnmwvd1kj5c0401l1hnqd40000gn/T/codex-clipboard-820764fe-467a-4cbb-b4be-6f809825554f.png`.
- Browser-rendered implementation: `http://localhost:5173/`, dream theme, desktop viewport.
- Focused region: the two-row, three-column “快速找到新声音” card grid.

## Findings

- [P2, fixed] The initial cards read as flat purple controls rather than the supplied deep-violet glass material.
- Corrected surface: two-layer interior gradient, subtle cool top highlight, soft lavender border, 18px radius, inset edge light, and restrained shadow. The density stays at six cards in a 3×2 grid with 14px gaps.

## Required Fidelity Surfaces

- Colors and materials: cards now settle from muted violet into near-black while retaining the reference's clearer top and edge separation.
- Typography and spacing: labels and chevrons remain high-contrast, with an intentionally compact 72px card height.
- Interaction: hover intensifies the same material and lifts only 2px, preserving the quiet treatment.

## Interaction Checks

- Selected dream theme through the header picker.
- Confirmed six quick-search card links render with the intended layered gradient and `18px` radius.
- Confirmed the Chrome screenshot matches the reference's deep-violet glass direction.

final result: passed

---

# Design QA — Expanded Player Addition

## Comparison Target

- Source visual truth: user-provided Chrome screenshot of the Aster library page and persistent mini player, plus the requested Apple Music–inspired expanded-player direction. No pixel-exact Apple Music screen was supplied, so this is a quality and interaction comparison rather than a clone assessment.
- Browser-rendered implementation: `http://localhost:5173/player`.
- Viewport and state: desktop, authenticated library user, `Cruel Summer` selected and playing.
- Full-view evidence: a Chrome capture during this pass shows a soft artwork-derived ambient background, album art, title/artist, transport, scrubber, and lyric-preview panel all above the fold.
- Focused-region evidence: the persistent mini-player DOM was checked before expansion. Its cover/title is a single clear expand target, a dedicated expand button is reachable, and the former sixth control no longer wraps into a lower-left second row.

## Findings

- No actionable P0/P1/P2 issues found for the requested expanded-player flow.
- [P3] The lyric preview uses original synchronised interface copy rather than track lyrics.
  - Location: expanded player lyric panel.
  - Evidence: the selected public preview has no lyric licence in the app.
  - Impact: retains the intended rhythm and focus treatment without presenting unlicensed lyrics.
  - Fix: when a licensed lyrics provider is added, map its timed lyric data into the existing lyric-preview presentation.

## Required Fidelity Surfaces

- Fonts and typography: SF-style system fallback is retained; track title, timing, and lyric hierarchy are legible with no truncation in the verified state.
- Spacing and layout rhythm: artwork, playback controls, and lyrics form three balanced columns; the narrow mini-player grid keeps every control on one row.
- Colors and visual tokens: the dark translucent surface and desaturated artwork wash maintain contrast for white controls and highlighted lyric text.
- Image quality and asset fidelity: existing album artwork is used as both sharp cover art and blurred ambient backdrop; no placeholder imagery was introduced.
- Copy and content: song metadata remains intact; the lyric-preview notice distinguishes interface copy from song lyrics.

## Interaction Checks

- Started the saved track from the library.
- Opened the full player through the explicit mini-player expand control.
- Confirmed the `/player` route, timing slider, play/pause state, and lyric-preview region render.
- Collapsed the player back to the library and confirmed the mini-player remains available.
- Checked Chrome console errors: none.

## Implementation Checklist

- [x] Fix mini-player control wrapping.
- [x] Make the mini-player and explicit affordance open the full player.
- [x] Add a routed full-screen player with transport and scrubbing.
- [x] Add progress-synchronised lyric-preview presentation.

## Follow-up Polish

- Add licensed timed lyrics and queue navigation when their data sources are available.

## Comparison History

- Expanded-player initial pass: no P0/P1/P2 discrepancies against the supplied Aster baseline and requested Apple Music–inspired behaviour; no corrective visual iteration required.

final result: passed
