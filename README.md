# Two / Five

A map-led history and research archive of the 2nd Battalion, 5th Marines,
with a focus on Hotel Company during the Vietnam War.

The project serves veterans, families, casual readers, and researchers through
a guided narrative backed by inspectable archival evidence.

## Current status

React/TypeScript chapter map and evidence viewer for the 1965 chronology, plus a local
research collection and Markdown catalogs in [data/](data/README.md). A local
SQLite index is rebuilt from editorial records with `npm run data:events`;
the browser still reads Markdown. No Cloudflare deployment has been created.

The first release is intended for the October 2026 reunion and focuses on
1965–1966. Phase-one stages and acceptance criteria are the next planning task.

## Development

Use Node.js 22.12+ (or Node.js 24 LTS) and npm.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

The page demonstrates five source citations with original-PDF region highlights.
Run with `npm run dev` to view the local PDF. The public build contains no PDFs;
its cross-site delivery route remains to be built. `npm test` runs browser
checks using installed Google Chrome and the locally imported source file.
See [source-viewer status](docs/SOURCE_VIEWING.md). The chapter opens with a modern OpenStreetMap basemap and a sourced Camp Margarita
locator. Citations switch to the evidence viewer; Chapter map returns to the map.
Historical overlays, movement routes, and the full timeline remain future work.
Map provenance lives in data/units/5th_marines/2nd_battalion/research/1965_MAP.md.

## Direction

- React and TypeScript for the new application.
- SQLite for research storage; Cloudflare hosting is the deployment target.
- Exact database hosting, API, deployment, and extraction arrangements remain
  decisions for phase-one planning.
- Develop one real, source-backed period through the full experience before
  scaling ingestion across the corpus.

## Project documents

- [Project brief](docs/PROJECT_BRIEF.md)
- [Research provenance and source attribution](SOURCES.md)
- [Code ownership](LICENSE)
- [Repository working instructions](AGENTS.md)

The earlier research workspace is retained separately and unchanged. Selected
evidence collections have been copied locally with integrity checks. The legacy
application and live database have not been migrated.

## Rights

Copyright © 2026 Brent Tyler. Original project code: all rights reserved.
This is a public, source-visible repository, not an open-source license grant.
Dependencies retain their own licenses. Research points back to original
archival sources under their applicable rights; see [SOURCES.md](SOURCES.md).

## Full-map chapter layout

The map fills the viewport between solid header and footer bars. Story and source
windows use frosted glass and scroll independently. The map remains mounted when
citations open. Restored the legacy web/public/js/map.js Terrain + Water default
(Esri hillshade plus Stamen/Stadia terrain at 40% opacity), and terrain, relief,
dark relief, satellite, and street layer choices. Provider attribution is retained.
Stadia production authentication/domain setup still needs checking before deployment.
The legacy Vietnam L7014 tiles and alignment tuner are not ported into this
California chapter; their local tile delivery and alignment review remain pending.

Map zoom extends to level 22 by enlarging native tiles (relief 16, terrain 20,
street/imagery 19). Esri coverage gaps retry parent tiles with the correct crop;
blankTile=false prevents successful placeholder responses from hiding gaps.

Read the location source opens a centered modal PDF window with a tapered
genie-inspired expansion from the trigger and reverse close animation. Escape
closes it and restores trigger focus. Reduced motion disables both animations.

Map tile transitions disable independent layer fades and retain four rows/columns
of already loaded neighboring tiles. Animated zooms reuse the current tiles until
the flight ends, avoiding intermediate zoom downloads. Panning updates are
throttled to 150 ms. This is retention, not speculative adjacent-zoom prefetch.

A floating chapter strip above the footer shows the current July–December 1965
coverage. Its working title remains Before the departure; additional chapter
names, ranges, and navigation await narrative planning.

All narrative citations, exercise source buttons, location source buttons, and
direct source hashes now use the same centered Source evidence modal. The small
companion viewer and Map/Source switch have been removed. Closing restores trigger
focus without moving or remounting the story and map.

The story window has a persistent bottom-left Read the Source action opening
the chapter chronology at its first page (location anchor). The lower-right
location panel holds descriptive context and provenance, without a duplicate
source button. Story text scrolls independently above the pinned action.

Source reading now uses a nonmodal workspace: Read the Source reveals narrative
and location citations while opening the document beside the text. Closing hides
those citation controls again. Deep source hashes enter this mode directly.

Desktop columns are 25% story / 50% center / 25% location panels. The floating
timeline and source-reading window align with the center half.

The chapter timeline expands upward to show five sourced events below its chapter
bar. Event selection scrolls the story; in source-reading mode it also selects
the corresponding PDF citation. This is the current chapter index, not a complete
chronology extraction.

Distance scale is aligned above the timeline and follows its measured height
as events expand; attribution has a translucent background that strengthens
on hover or keyboard focus.

Rebirth of the 2/5 includes a Markdown-backed four-paragraph introduction and
a compact source list before the numbered evidence sections. The introduction
is hidden while reading the source; the numbered sections remain accessible.

The left panel now has Narrative and Chronology tabs. Narrative is the default;
source reading and timeline event selection activate Chronology. Tabs support
arrow-key navigation. Scrollbars fade when inactive, and overflowing text panels
fade at the bottom until the reader reaches the end. PDF pages keep their full
contrast for evidence inspection.

Chronology and timeline now share individual Markdown event records under
`data/units/5th_marines/2nd_battalion/research/events/`. Chapter composition lives
in `research/chapters/rebirth-1965.md`; edit its arrays to arrange events. See the
event directory README for the editing workflow and source-reference contract.

The timeline's previous/next arrows now navigate two chapters: Rebirth of the
2/5 and The Road to Vietnam. Chapter links survive reloads. The latter uses a
Pacific regional map overview and ten draft, source-backed entries. Local PDF
viewing is allowlisted for 1201048065–68; the newer three have page-only OCR
references and no verified public URL or highlight alignment yet.
