---
name: site-images
description: Find, download and wire up licensed photos for the AMEPA website (water, sanitation, desalination). Use whenever a page, section or Sanity document needs an image or the user asks to search/download pictures.
---

# Site images — AMEPA

## Sources, in order of preference
1. **Images AMEPA provided** (in `assets/amepa/` or already in Sanity). Always use these first for hero, events, people, governance.
2. **Unsplash MCP** (`unsplash_search_photos`) for generic sector visuals: treatment plants, pipes, reservoirs, desalination, wastewater, water textures, Moroccan landscapes.
3. Never: images scraped from random websites, Google Images, news sites, member websites, or anything without a clear licence. Never AI images presented as real facilities or people. Never photos of identifiable public figures pulled from the web.

## Search
- Use concrete English queries: `water treatment plant`, `desalination plant`, `wastewater treatment aerial`, `water pipeline construction`, `water reservoir dam`, `water droplet macro blue`, `Morocco landscape water`.
- Prefer `orientation=landscape` for heroes/cards, `content_filter=high`.
- Pick images that fit the palette (blues, aqua, sand). Avoid clichés: glass of water, handshakes, fake dashboards, people in suits pointing at screens.
- Show the user 3–4 candidates (thumbnail + photographer) before downloading when the image is for a prominent spot (hero, section header).

## Download & store
1. Call `unsplash_track_download` for every photo actually used (Unsplash API rule).
2. Save the `regular` (≈1080px) size, or `full` for hero only, to `public/images/<section>/<short-name>.jpg`
   (sections: `hero`, `expertise`, `events`, `international`, `resources`, `backgrounds`).
3. Append a line to `public/images/CREDITS.md`:
   `| <file> | <photographer name> | <unsplash photo page URL> | <date> |`
4. If the image is content comms will manage later (domain cover, post cover), upload it to Sanity instead of `public/` and fill the `alt` field (French).

## Wiring
- Render with `next/image`, explicit `sizes`, `alt` in the current locale.
- Hero: `priority`, max ~250 KB after optimisation.
- Apply the shared blue overlay class (`.img-grade`) so stock photos look consistent.
- Show photographer credit in a small caption or on a `/credits` page linked from the footer.

## Checklist before finishing
- [ ] Every used photo tracked + listed in CREDITS.md
- [ ] Every `<Image>` has meaningful `alt` text (FR/AR/EN)
- [ ] No image > 400 KB in `public/`
- [ ] No stock photo labelled as an AMEPA facility, member or event
