# 5th Marines history: full-book OCR started — 2026-09-08

At Brent's request, started all 85 PDF pages of *A Brief History of the 5th
Marines*, revised 1968, on Agent Relay's M1 Pro with Qwen vision. Immutable
page images, raw responses, transcriptions, uncertainties and hashes are stored
locally as layer 1 evidence. Source PDF unchanged. Completion is tracked in
`shared/official_histories/FIFTH_MARINES_1968_OCR.md`; this entry records launch,
not a completed transcription. No event ingestion or website change.

# Camp Pendleton label — 2026-09-08

Lowered the display label to latitude 33.3546 and centered its icon anchor
vertically, replacing the upward screen offset. Boundary geometry unchanged.

# Camp Pendleton display — 2026-09-08

Omitted two detached eastern areas in a derived map boundary; retained main
outline/interior rings and original source geometry. Applies to both chapters.

# Command Restructuring layout — 2026-09-08

Merged Chapter 00 battalion-command and staff/company sections under 02 Command
Restructuring with a two-sentence introduction and two initially collapsed groups.
Hotel remains section 03; preparation becomes 04. All event records and citations
retained. Timeline selection opens the containing group before scrolling. Build
and leadership/timeline interaction tests passed.

# Exercise explanation edit — 2026-09-08

Removed “Where it fits in the story” from the November exercise context at
Brent’s request. Source references and remaining explanation unchanged.

# Post-return personnel transfers — 2026-09-07

Added a sourced aggregate transfer event to Chapter 00. Preserved null end date
in JSON and SQLite; added explicit after-date handling to the timeline without
inventing a duration. Added exact OCR page-only source citation and tested
uncertainty display/navigation. Chapter 00: 45 timeline entries.

# Chapter 00 training update — 2026-09-07

Added September 16 SEATO demonstration and November 15 RLT-5 special training
start to Chapter 00. Expanded Golf platoon/Jaffke/Army participation and Princeton
company manning details with source references. Kept the exercise-name uncertainty
and unnamed rifle companies explicit. Added three page-only source anchors from
verified immutable OCR spans; no new highlights invented. Chapter 00 now has 44
timeline entries; SQLite retains 66 event/context/summary records overall.

# Chapter 00 leadership update — 2026-09-07

Implemented approved individual leadership actions with same-date timeline headings:
30 detail records and one full December roster snapshot. Retained existing chronology
summaries, suppressed duplicate timeline summaries, and linked child navigation to
parent summaries. Shortened predecessor narrative per Brent; July–December bounds
unchanged. Chapter 00 now has 42 timeline entries. Added exact OCR roster anchor
without invented highlights. No book predecessor or 1967 events promoted.

# Consolidated 1965 audit report — 2026-09-07

Merged chronology and book audit README content into event-drafts/audit-1965/README.md.
Replaced the separate book README with a link to the consolidated report; retained
all supporting JSON paths. Removed stale pending-book status from the report and
added a 14-point discussion queue with an empty decision log. No source, event,
site, or SQLite data changed.

# Structured JSON migration — 2026-09-07

Converted 33 event/context records, two chapter compositions, and two source-anchor collections to JSON, verifying parsed content equality. Markdown companions retain notes and link to the JSON; narratives remain unchanged. Updated application and SQLite loaders and supplied EVENT.json for research drafts. No 1967 extractions or research drafts were promoted. Removed timeline hover instruction and enlarged its title.

# Research change log

## 2026-09-07 — Chapter-tagged SQLite event catalog and book indexing

- Added explicit chapterIds to existing event records; the chapter timeline now
  uses those tags independently of written chronology membership.
- Added a rebuildable local SQLite catalog with foreign-key-checked chapter and
  citation links. It contains 32 dated events plus one location-context record;
  Chapter 00 has 22 dated events, Chapter 01 has 11 (one shared range).
- Indexed all six existing book assertions and 89 existing book search leads
  in separate tables, preserving their review states and provenance. Candidates
  are not promoted to events or treated as verified 2/5 participation.
- Added a coverage ledger with explicit outstanding audits. Browser data remains
  Markdown-backed; the SQLite catalog is local and is not a deployed API.

## 2026-09-07 — Interactive chapter date bar

- Moved chapter title into the heading and year to the right. The blank date bar previews daily events on hover or keyboard navigation; selection uses existing map and chronology links. Multiple matches present an event choice and empty days are explicit.
- Blank space in the timeline panel expands or collapses the list. Navigation, date controls, event buttons, and text selection retain their own behavior. The dedicated toggle remains keyboard-accessible.


## 2026-09-07 — Chapter timeline dates and independent events

- Timeline now lists all cataloged dated events overlapping explicit chapter dates, oldest first, independently of left-panel section membership. Range events can appear across chapter boundaries.
- Added hover/focus date highlights and retained click selection on the chapter bar. Single days have a minimum visible marker; uncertain precision uses a dashed band.
- Added December 17 BLT planning designation and December 20–January 8 personnel buildup from existing ROAD-01/02 evidence. Chapter 00 now contains 22 cataloged events; archival coverage is not complete.
- Added editorial categories and sourced contextual map destinations. Selection navigates the left panel only when a section exists; missing map destinations do not cause guessed movement.
- Full Timeline controls and filters are deferred at Brent’s request; that view will be a separate future window.


## 2026-09-07 — Henoko ammunition-area stripes

- Added subdued orange 45-degree stripes to Henoko Ammunition Supply Point at 28% fill opacity, with a matching orange outline and compact callout color. Training-area green/yellow stripes and source geometry unchanged.


## 2026-09-07 — Map label placement and reference notes

- Moved the Central Training Area display label southeast to 26.505, 127.96, checked inside the combined polygon. Source geometry unchanged.
- Consolidated newer-boundary and approximate-position notices into the bottom-right location box, with visible summary and expandable sources. Added Pendleton and merged-training-area qualifications to the Pacific view; removed redundant qualifiers from top map text and Schwab tag.


## 2026-09-07 — Central Training Area hatch styling

- Applied a screen-space 45-degree alternating green/yellow stripe fill to Central Training Area at 28% opacity, retaining its outline and compact/sub-area behavior. Main base and ammunition area styling remain distinct. Geometry unchanged.


## 2026-09-07 — Unified Central Training Area display

- Preserved the six original source polygons and added a separately documented display outline joining narrow gaps via a 25m buffer/unbuffer operation.
- Removed internal separations and simplified the resulting exterior by 2m. The combined shape is cartographic presentation, not a new surveyed boundary.


## 2026-09-07 — 20px map boundary cutoff

- Raised the compact-callout cutoff from 12 to 20 screen pixels for base and port boundaries. Camp Schwab sub-area visibility follows the same parent cutoff.


## 2026-09-07 — Long Beach port-area outline

- Added USACE Ports feature 220 (port ID 4110, data year 2020), preserving GeoJSON rings and recording source attributes and response hash in Markdown.
- Replaced Pier E point display with the broader port outline, including land and water. Find Long Beach Pier E frames the port, with one compact callout below 12 pixels.
- Retained the separate Pier E departure assertion and avoided claiming a historical dock shoreline.


## 2026-09-07 — Animated map tag transitions

- Raised the compact-boundary cutoff from 4 to 12 screen pixels (both dimensions). Camp Schwab sub-areas follow the new parent cutoff.
- Added eased 420 ms label movement when switching representations; reduced-motion preference uses immediate changes. Source geometry remains unchanged.


## 2026-09-07 — Pearl Harbor naval complex outline

- Added modern OSM joint-base land (7407001) and harbor-water (7378187) polygons with holes preserved, source versions, snapshot hash, and ODbL attribution.
- Replaced the harbor point display with a full complex outline; Find Pearl Harbor frames it, and overview scale retains one callout. Includes Hickam and is explicitly not a verified 1966 perimeter.


## 2026-09-07 — Pacific departure and transit stops

- Added Pier E and Pearl Harbor sourced reference-point records and map callouts, retaining chronology 1201048066 as historical movement evidence. Neither point asserts a verified berth.
- Reused Pendleton geometry in the 1966 chapter as the starting place, with separate Find controls for all three stops and staggered California labels. Source coordinates remain unchanged; display uses the Pacific world copy.
- No voyage tracks or new historical boundaries inferred.


## 2026-09-07 — Camp Schwab display sub-areas

- Grouped the two associated areas under Camp Schwab in the map display. Their outlines and labels hide when the parent boundary enters its under-4px compact state, and return when zooming in.
- Individual source geometry and historical identity limits remain unchanged.

## 2026-09-07 — Camp Schwab associated map areas

- Added separate modern OpenStreetMap polygons for Central Training Area
  (relation 5962647, 1685 vertices) and Henoko Ammunition Supply Point
  (relation 5973046, 234 vertices), with provenance-bearing Markdown records.
- Find Camp Schwab now frames all three areas. Associated areas use a slightly
  yellow-green tint (#69733c); the coastal base retains Marine green. Outline
  opacity remains 50% and fill 10% throughout.
- Preserved geographic identities and distinguished Central from Northern
  Training Area. No historical ownership or 1966 boundary claim is made.

## 2026-09-07 — Camp Schwab modern reference boundary

- Retrieved OpenStreetMap relation 5973045 and joined 21 outer ways into a
  closed 213-vertex ring without simplification. Recorded source, retrieval,
  relation version, response hash, coordinate order, and ODbL attribution in Markdown.
- Added a shared landmark and a Find Camp Schwab map view to the 1966 chapter,
  with the existing Marine green, 50% outline and 10% fill styling.
- Labeled the geometry as a modern coastal-base reference; surrounding training
  and ammunition areas remain separate and no 1966 perimeter is asserted.
- No source PDFs inspected, OCR run, or historical barracks coordinates inferred.

## 2026-09-07 — Expand official-history use in the Rebirth narrative

- Added a sourced paragraph explaining the wider regimental and personnel
  setting from the official history's printed p. 117 (LB65-004 and LB65-005).
  Retained the distinction between MIX-MASTER in Vietnam and 2/5 at Pendleton.
- Added a dedicated SOURCES entry and a Markdown chapter-use matrix linking
  narrative subjects to existing assertions, including designation and biography.
- Kept the 1966 itinerary attributed to its contemporary chronologies and
  preserved unresolved relief dates and replacement-battalion identities.
- Editorial update only: no new OCR, source-byte edits, invented highlights,
  or raw-corpus publication. No correction resolver is claimed by this change.

## 2026-09-07 — Recover missing official-history pages

- Used AgentRelay's M1 Pro Qwen vision profile to transcribe printed pages
  203–210 from official PDF pages 219–226. Also transcribed printed pages 202
  and 211 for boundary checks; normalized text similarity to existing OCR was
  99.58% and 99.76%, respectively. These are alignment checks, not accuracy scores.
- Added eight Markdown page records and a recovery manifest under
  `corrections/landing_buildup_1965/`, retaining model uncertainty notes,
  edition/page mappings, response and image hashes, and transcription provenance.
- Created the local derived `data/local/book-recovery/merged_ocr.txt`, inserting
  only the eight missing pages. Verified that removing the insertion reproduces
  the original OCR bytes exactly. Original PDFs, OCR/XML, and citation offsets
  remain unchanged; no whole-book completeness claim is made.
- Added reproducible rendering-input OCR and merge scripts. Local model output
  awaits human review; Codex did not visually inspect source pages. Verified
  all 794 legacy and five external assets with `npm run data:check`.

## 2026-09-07 — Official 1965 history import and initial 2/5 parsing

- Added the official PCN 19000307600 PDF and a separately identified Internet
  Archive scan, existing OCR text/XML, and scan metadata (five local assets).
- Added an external-source importer and separate Markdown checksum manifest;
  `npm run data:check` now verifies external evidence as well as legacy imports.
- Cataloged actual source URLs, rights, editions, and the OCR scan's missing
  printed pages 203–210. Kept originals unchanged and Git-ignored.
- Parsed existing text into six traceable excerpts and 89 contextual search
  leads, with immutable UTF-8 offsets and metadata-derived printed page labels.
- Preserved designation/relief-date discrepancies and kept other Company H
  references unassigned. No new OCR, PDF inspection, UI change, or publication.

## 2026-09-07 — Expandable training explanation

- Added a Markdown-backed explanation of the 3–5 November exercise, including
  Golf Company's role, Army organizer, and limits of the available evidence.
- Preserved TIMBERTORCH/TENDERTOUCH as unresolved readings. No new OCR, PDF
  inspection, or change to original transcription was performed.
- Added a page-only citation using the existing OCR page marker and exact byte
  offsets. No bounding box is fabricated; the viewer suppresses highlights for
  citations that await alignment by Brent's local model.

## 2026-09-07 — 1965 evidence-viewer proof

- Added five source anchors in 2/5 research Markdown: redesignation date,
  Doherty's August and December appearances, Camp Margarita, and the Princeton
  exercise. Kept source OCR bytes and PDF unchanged.
- Visually located passage rectangles across all three scanned pages and
  retained precise OCR excerpt offsets and PDF/OCR hashes.
- Verified the Texas Tech item route and remote PDF; remote bytes match local.
- Built and tested the local click-to-citation viewer; public cross-origin PDF
  delivery requires a separate route. No PDFs were published or committed.
- Original page 2 visually reads H. T. WINSTON in the August S-4 line. The old
  OCR conflict noted in LEGACY_ASSESSMENT.md remains a transcription issue to
  record in the appropriate correction layer; raw OCR was not edited.

## 2026-09-07 — Initial structured import

- Copied 794 files (2,197,244,245 bytes) into 23 collections in the new repo.
- Preserved the legacy unit hierarchy and IDs, with Hotel Company beneath 2/5
  and Task Force Hotel separate.
- Added Markdown collection indexes, source records, hierarchy, templates,
  exclusions, and a machine-readable SHA-256 manifest in Markdown.
- Copied current PDFs/Vision OCR, available staging JSON and corrections,
  photo references, source maps/geographic inputs, and design/schema references.
- Excluded archived Gemini material, regenerated image pages, experimental
  roster outputs, processed TIFFs, map tiles, credentials, and database dumps.
- Verified all copied files by SHA-256. A repeat import copied zero new files.
- Original evidence stays local in Git-ignored _files/ folders. No publication
  or historical-validation status was granted by this import.
- Recorded the requested click-to-source-page-and-region experience in
  docs/SOURCE_VIEWING.md. Exact PDF region mapping remains future work.

## 2026-09-07 — Chapter map

- Added 1965_MAP.md with a modern Camp Margarita locator, coordinate provenance,
  precision limits and link to the existing historical source anchor.
- Map and evidence now have separate chapter companion views. No routes or
  historical boundaries invented; raw sources unchanged.

## 2026-09-07 — Legacy terrain map presentation

- Restored terrain/water composition and modern layer choices from legacy
  web/public/js/map.js in the full-background React map. Historical locator
  evidence unchanged. Vietnam L7014 tiles/alignment tooling remain deferred.

## 2026-09-07 — Camp Pendleton outline

- Added sourced SanGIS jurisdiction rings and name-label placement in geography/places/CAMP_PENDLETON.md. Modern reference only; 1965–72 boundary not verified.
- Outline toggle added to the map; historical overview and slideshow remain planned.

## 2026-09-07 — Expandable chapter events

Added 1965_EVENTS.md as an editorial index of five already-sourced chapter events. Roster entries remain record observations. Timeline expands upward and selects story passages; evidence navigation is active only in source-reading mode.

## 2026-09-07 — Shared landmark catalog

- Registered Camp Pendleton, Da Nang, and An Hoa with stable IDs in geography/landmarks.
- Linked existing Pendleton geometry without duplication; retained its modern-reference limitation.
- Da Nang and An Hoa await source/geometry review; no coordinates or unit-presence dates inferred.
- Added fields for future sourced unit associations, chapters, events and photo albums.

## 2026-09-07 — The Birth of the 2/5

Renamed chapter; grouped events into Formation, Leadership and Training. Added five page-only anchors from existing OCR with exact byte ranges, including San Diego return and four CO successions. No PDFs inspected or OCR generated; new name readings await review. Narrative scope recorded in 1965_CHAPTER.md.

## 2026-09-07 — Battalion-wide leadership coverage

Added ten staff/company assignment entries and exact page-only OCR anchors covering August–December 1965. Expanded Leadership timeline and narrative details to H&S, Echo, Foxtrot, Golf and battalion staff, retaining Hotel and CO succession. Preserved unresolved S-4 reading and Burns/Hughes roster discrepancy; no invented transition dates.

## 2026-09-07 — Rebirth narrative

Renamed chapter to Rebirth of the 2/5. Added four-paragraph narrative with official-history, regimental-history, base-history and chronology sources. Corrected proposed Korea context to the documented Vietnam/Okinawa background. Preserved replacement-system dating limitations in 1965_NARRATIVE.md. Narrative is hidden in source mode; numbered sections remain.

## 2026-09-07 — Local-model source alignment and McPartlin biography

Added six page-two passage highlights using Gemma vision matches to measured scan regions, including McPartlin's command-transfer sentence. Existing OCR and PDF bytes remain unchanged. Model-aligned regions display a human-review-pending note; ten citations remain page-only after the M1 Pro vision profile disappeared during processing. Rejected coordinate estimates are not published. Method, accepted mappings and local response hashes are in 1965_ALIGNMENT.md.

Added the four-sentence McPartlin biography requested through the parallel conversation, with LB65-002 and chronology provenance. His Korean service is distinguished from the battalion's Vietnam/Okinawa route; first commander refers only to the redesignated battalion.

## 2026-09-07 — Shared Markdown chronology records

Migrated 20 dated entries and Camp Margarita context into research/events/*.md. Added chapters/rebirth-1965.md to control section membership, order and timeline groups. Chronology prose, leadership entries and exercise context now render from shared event records instead of React literals. Original source anchors, PDF/OCR bytes and uncertainties are preserved; old event/leadership/training files are compatibility indexes. Added explicit date precision, source arrays, entity placeholders, review status and revision history. SQLite remains planned.

## 2026-09-07 — The Road to Vietnam chapter outline

Reviewed existing non-archived vision OCR for 1201048066–68. Drafted January 1–April 13 coverage with a December bridge: Long Beach, Pearl Harbor, Camp Schwab/Northern Training Area on Okinawa, Kin Beach, and Chu Lai. Recorded 11 exact excerpts with UTF-8 byte offsets and source hashes in 1966_ROAD_EVIDENCE.md. Preserved split February ship arrivals, January embarkation/sailing wording differences, and undated training intervals. Outline, map/photo slots and review gaps live in 1966_ROAD_CHAPTER.md; no live chapter or PDF alignment added.

## 2026-09-07 — Road chapter preview and timeline navigation

Connected The Road to Vietnam as chapter 01 (January–13 April 1966), with four narrative blocks and ten Markdown events. Added slim previous/next chapter controls and deep links. The map changes to a Pacific regional overview; no precise voyage tracks or unverified training-site markers are drawn. Registered 1201048066–68 for local-only PDF viewing with hashes and page-only OCR references; public URLs and highlights remain pending. Source-document changes remount the viewer to avoid stale pages. The Kin Beach date interval is explicitly a navigation envelope, not an inferred four-day schedule.
# Legacy JSON discovery — 2026-09-07

Located three non-archived chronology staging JSON files in the old workspace:
166 event objects covering May–July 1967. Verified their existing local copies
by SHA-256; no recopy or event promotion performed. Recorded fields, correction
requirements, and the absence of located 1965–1966 staging JSON in
`units/5th_marines/2nd_battalion/extractions/NOTES.md`. Book events are a separate
extraction task, as confirmed by Brent.
# Event authoring format — 2026-09-07

Retained Markdown with fenced JSON for editable event records. Added
`templates/EVENT.md` defining dates, source assertions, chapter links, review
status, and publication intent. Created a separate `event-drafts/` directory
outside application and SQLite imports. No legacy events or new book events
were ingested into the site. Publication separation currently uses directories,
not an implemented visibility-field filter.

## 2026-09-07 - Three additional official histories acquired

Imported An Expanding War 1966, 5th Marines revised 1968, and 9th Marines revised 1967 through the external importer, preserving source URLs, retrieval timestamps and SHA-256 hashes. Added source specifications, rights notes, catalog links and OCR_AUDIT_2026-09-07.md. Audited every existing PDF text layer; no visual scan review or new OCR. 1966: 406 PDF pages, 50 without text. 5th Marines: 85 pages, all without embedded text. 9th Marines: 38 pages, four without text; pdfplumber recovers word spacing better than pypdf. Blank/illustration status and transcription accuracy remain unverified. Derived extraction copies are local-only under data/local/official-history-audit. No app or event data changed.

## 2026-09-08 - Clarified 1966 book text audit

User-authorized M1 Qwen vision spot check identifies PDF pages 26 and 53 as maps with readable labels. Cross-checked their empty embedded text with PDF.js and all 50 initially empty pages with pdfplumber. Preserved local raw responses, image/request/source hashes, and findings under data/local/official-history-audit/vision-spotcheck. Clarified that extraction gaps do not establish missing book pages or a need to OCR all 50. No source bytes or event records changed.
# 1965 research-only audit — 2026-09-07

Added `scripts/audit-1965.mjs` and `event-drafts/audit-1965/`: 18 dated OCR entries
and five narrative/roster/context records, with 23 verified immutable byte spans.
Checked imported correction layers: none apply to 1201048065; script fails closed
if applicable fixes appear. Recorded missing SEATO/training/transfer details and
H&S roster discrepancy without inventing transition dates. Reconciled six existing
book assertions and preserved 89 pending candidates in a separate ledger; full
book review remains incomplete. No site or SQLite event promotion occurred.
# Battalion-wide 1965 book candidate audit — 2026-09-07

Added research-only `event-drafts/book-1965-review/` and reproducible audit script:
89 candidate dispositions, 21 unpublished proposals, 19 source-page records,
three predecessor photo leads and eight recovered-page term screenings. Scope
includes the whole battalion, companies and supporting relationships, not only
Hotel. Preserved June relief discrepancy and separated outgoing 2/5/replacement
3/9 from returning 3/9. Full-book semantic completeness remains pending. No site
or SQLite event promotion, PDF inspection, new OCR, or original-source changes.
# 1965 book follow-up and independent reviews — 2026-09-07

Completed two bounded sub-agent reviews: all eight recovered page transcriptions
and indirect/index references. Added April 12 command/April 18 higher-headquarters
proposals, unresolved photo A185897, and March 3/9 command-diary lead. Main audit
added actual March 12 unloading completion, structured participant roles and
planned/actual time distinctions. Cleared definite casualty unit attribution where
the text is ambiguous. Combined total: 24 event/context proposals and four photo
leads, all research-only. Recovered pages establish no additional target event.
Validated proposal/source links and source hashes; data:check verified 794 legacy
and eight external files unchanged. Full-book historical completeness is not
certified; canonical-event reconciliation remains pending. No site/DB promotion.

## Command subsection indentation — 2026-09-08

Indented the two Command Restructuring detail groups by 16px.


## Command indentation refinement — 2026-09-08

Moved the 16px indentation from command groups to their contents only;
collapsible titles remain aligned with the surrounding section.

## Location source wording — 2026-09-08

Named the 2nd Battalion, 5th Marines command chronology for July–December 1965
in the Camp Margarita location sentence. Citation preserved.

## Location wording refinement — 2026-09-08

Shortened the Camp Margarita sentence to “The command chronology places the
battalion at Camp Margarita, Camp Pendleton.” Source reference unchanged.

## Margarita label — 2026-09-08

Switched Camp Margarita to shared circle/leader/title callout; retained Find
action. No area geometry added: current evidence provides only a locator.

## Margarita zoom visibility — 2026-09-08

Nested Margarita under Pendleton’s display layer and reused its existing 20px
compact threshold to hide/restore the complete callout.

## Margarita sources and map note — 2026-09-08

Moved the 1965 map-reference note inside the collapsed source details. Added
CAMP_MARGARITA_RESEARCH.md with official HTML sources and clearly unreviewed
period-photo/publication leads. No new historical prose or images published.


# Margarita context and Pendleton setting — 2026-09-08

Added sourced Margarita paragraph to Battalion Location, stored in 1965_MAP.md.
Official 1964 company-office caption and modern 33 Area identification are linked
in the collapsed sources area; metadata date discrepancy recorded in the Margarita
research inventory. Added Pendleton setting label and whole-base Find control.
Removed duplicate compact-overlay registration so Margarita visibility has one
controlling handler.

# Chapter 00 Location panel — 2026-09-11

Separate sourced descriptions for overview and Pendleton, with Margarita context
retained. Find controls and compact labels update the Location panel through
camera selection state, without changing narrative or chronology. Sources reset
collapsed on selection. Editable content: geography/places/CHAPTER_00_LOCATIONS.json.

# Location prose — 2026-09-11

Removed chapter framing from Southern California and Pendleton descriptions.
Describe places and battalion experience directly; existing sources retained.
Editorial direction: interactive exploration of lived history, without prose
that describes the visitor as reading a book or explains a location's chapter role.

# MCRD landmark — 2026-09-11
Added sourced MCRD San Diego landmark, point callout, Find control and Location
panel. No individual attendance or 2/5 movement inferred.
2026-09-11: Added sourced MCRD boundary with 50% outline and 10% fill, shared 20px compact-label behavior and source attribution.

# Pendleton location description — 2026-09-12
Replaced Margarita residence sentence with base training context and attributed
Gregory Lake recollection; added official article source. Removed the duplicate
Margarita chronology sentence from Pendleton's panel.
2026-09-12: Located NARA November 1965 Princeton deck log (173486702); source lead recorded in geography/landmarks/USS_PRINCETON_RESEARCH.md. November 19 position remains unverified.
2026-09-12: Prepared Princeton log M1 Qwen OCR; original and raw responses retained separately under data/local/princeton-1965-11.
2026-09-12: Dark-blue Princeton carrier symbol added to 1965 map; explicitly illustrative position, clickable provenance panel.
2026-09-12: Princeton 50%-size silhouette, Go to setting control and attributed period photograph in Location panel.

- 2026-09-12: Recorded Brent-supplied National Naval Aviation Museum caption for the second Princeton photo (1962, UH-34 formation). Preserved attachment locally and provenance in USS_PRINCETON_PHOTO_1962.json; exact date, original post link and rights remain unverified. No exercise association inferred.
- 2026-09-12: Added Apollo 10 recovery context and credited May 1969 Princeton photo; NASA mission source and Commons museum metadata preserved.
- 2026-09-12: Princeton landing scan narrowed to user-identified PDF pages 35–40; existing raw OCR preserved.
- 2026-09-12: Reviewed Princeton PDF pages 35–40 OCR; documented date alignment, flight activity, Long Beach berth and uncertain position readings. Preserved raw OCR and separated interpretation; no site ingestion.

- 2026-09-12: User-directed Princeton placement 4100 yards southwest of estimated Pendleton beach midpoint (33.30,-117.49). Estimated display position, not a verified ship fix. Construction recorded in data/geography/landmarks/USS_PRINCETON_POSITION.json.

- Tagged both user-supplied Princeton photographs Rights unverified and preserved the deck photograph locally. Existing verified Navy photo metadata unchanged.

- Added three sourced helicopter photos to Princeton album: user-linked 1966 HMM-362 lift-off, 1960 HMM-261 deck preparation, and 1963 HMM-163 UH-34D. Dates, credits, rights statements and source links in USS_PRINCETON_HELICOPTER_PHOTOS.json. All period context.

- Added Princeton November 1965 deck log to source reader, opening at PDF page 39 with page-only citation. Local PDF allowlisted explicitly; original NARA URL and SHA-256 recorded in USS_PRINCETON_SOURCE_ANCHORS.json.

- Expanded November 19 Princeton exercise with three sentences from deck-log page 39, retaining uncertainty about which flights carried 2/5.

- Moved the three added Princeton shipboard sentences from chronology to the location panel, per user clarification.
