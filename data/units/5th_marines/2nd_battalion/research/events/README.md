# Editable chronology events

This directory is the source of truth for cataloged event content. It currently
contains 32 dated records and one location-context record, spanning two chapters.
This is not a claim that every archival event has been extracted.
The website loads the JSON directly; published changes require a rebuild.

## Editing an existing event

For example, edit [command-august.json](command-august.json) to revise the McPartlin–Ram
entry. Keep its `id` stable so timeline navigation and references keep working.
The .json file is the machine-readable record; keep it valid JSON.

- `title` and `date.label` appear in the timeline and collapsible entries.
- `date.start` / `date.end` use ISO dates; precision distinguishes exact days,
  ranges, record dates, and chapter context. Do not infer an appointment date
  from a roster observation.
- `paragraphs` contains paragraphs made of text segments. A segment's optional
  `source: 0` points to the first item in `sources`, `source: 1` to the second,
  and so on. It becomes a citation only in Read the Source mode.
- `sources` links to original-document IDs and stable source-anchor IDs. Source
  quotes, PDF pages, hashes, and highlight rectangles remain in
  [the evidence record](../1965_SOURCE_ANCHORS.md), not duplicated here.
- `notes`, `researchStatus`, and `revisions` preserve uncertainty and the history
  of editorial changes. Add a revision rather than silently removing a disputed
  reading. Also update data/CHANGELOG.md.
- `units`, `people`, and `locations` are expandable entity references. The
  migration sets the issuing battalion and a few established associations;
  empty arrays mean not yet cataloged, not that no people/places were involved.
- Optional `context` provides the longer exercise explanation. Keep this
  explanation with its event so it cannot drift from a separate copy.

## Adding and arranging events

Start new research with `data/templates/EVENT.md` in the sibling
`event-drafts/` directory, outside the site's import. Only move it here when
deliberately approved for site inclusion. Existing JSON extractions stay in
the research collection; they are not automatically promoted.
The chapter timeline includes all dated records carrying its ID in `chapterIds`,
sorted oldest first. Chapter assignment is explicit, not dependent on a narrative section. Events spanning a chapter boundary
appear in both chapters without duplicating records. Location-context is excluded.

Only add the event to a chapter section when it belongs in the left chronology.
`timelineGroups` are retained as legacy editorial metadata; they no longer limit
which records appear. Timeline-only events leave the left panel untouched.

Optional `mapDestination` names a supported contextual map view (`camp`, `schwab`,
`long-beach-pier-e`, `pearl-harbor`). Supply it only when supported by evidence;
absence leaves the map stationary. These views are not exact event coordinates.
`category` stores editorial classification for a future filtered view.

Hover/focus previews dates on the chapter bar; selection retains the highlight.
The full filtered timeline is deferred to a separate future window.

Event IDs and source-anchor IDs are separate references, even though migrated
entries mostly share the same spelling. Multiple citations per event are
supported. The current viewer resolves the single 1965 chronology document;
another document requires registration in the evidence loader, not a fabricated
anchor or a pasted unverified URL.

## Relationship to other data

[1965_NARRATIVE.md](../1965_NARRATIVE.md) remains editorial chapter prose with
its own citations. It is not automatically generated from event descriptions.
The chapter composition connects the narrative file to this shared event set.
The old event, leadership, and training-context files are compatibility indexes,
not parallel copies to edit. Original OCR and PDFs remain immutable and local.

SQLite is a local derived index. JSON remains the editable source of truth.

After editing, run `npm run check`, `npm run build`, and `npm test`. The app
validates event IDs, chapter membership and source references when loading.
`npm run data:check` separately verifies original source-file hashes.

## Two-chapter update

There are now 31 records: 20 dated 1965 entries, Camp Margarita context, and
ten road-* records for chapter 01. Both chapter files under ../chapters/ use
the same event loader. Four source documents are registered, including the
three 1966 documents in ../1966_ROAD_SOURCE_ANCHORS.md. Those newer documents
are viewable locally; verified public URLs and highlights remain pending.
The Kin Beach exercise uses precision "before" with a navigation envelope;
its bounds are not asserted as the actual exercise dates.

## SQLite catalog

`npm run data:events` rebuilds `data/local/events.sqlite` from editorial JSON. Tables retain events, chapter tags, documents, citation anchors, event-source links, and separate book assertions/research leads. Startup and build refresh this local derived index. The browser still consumes the same JSON, not a database API. Edit JSON and rebuild; direct SQLite edits are not retained. This is not an OCR correction resolver.

## Leadership detail update

There are now 64 event/context/summary records across both chapters. Chapter 00
shows 42 timeline entries. `timelineHidden` keeps combined chronology summaries
out of the timeline; individual actions use `chronologyEventId` to navigate to
their summary. Same-date timeline rows share a date heading. The full December
roster is a distinct record-date snapshot with a page-only source anchor.

## Training update

Chapter 00 now shows 44 timeline entries; the shared catalog has 66 records
including chronology summaries. SEATO and special-training start are included.
Princeton company manning and special-program battalion strength remain distinct.
New evidence is page-only; existing verified highlight regions are unchanged.

## Open-ended personnel dates

Post-return transfers use precision `after`, start August 8 as an earliest bound,
and null end in JSON/SQLite. The timeline sorts at the bound, labels dates unknown,
and uses a small dashed marker on list hover. It does not treat transfers as
occurring on August 8 or continuously through December in date-bar hit testing.
Chapter 00 now has 45 entries; the full catalog contains 67 records including
chronology summaries.

Princeton exercise now includes a page-level ship-log source and shipboard sequence; specific 2/5 flight identification remains unresolved.

## Approved OCR audit — September 13
All 67 editorial records reviewed; `ocrReview` records the layer-2 audit scope and applicable layer-3 correction IDs. These IDs do not imply human approval of every word. Dates and source references validated; the SQLite index rebuilt. See data/ocr-runs/APPROVED_OCR_CONTENT_AUDIT.md for findings.

September 13 editorial update: removed the displayed transfer-date positioning note from `post-return-transfers.json` at Brent’s request.

September 13: Closer Look groups staff/company leadership by company using chapter presentation excerpts; original event records and timeline dates remain intact.

September 13: removed the duplicate standalone Hotel Company presentation section. Doherty event records are retained; company leadership includes the August and December references.

Leadership presentation: `../leadership-1965.json` maps dated appointments and roster observations to original event/source IDs. It powers the Leadership tab without adding timeline events.

### Okinawa training breakdown — September 22, 2026

ROAD-06 supports road-training (counterguerrilla), road-weapons-training, road-mine-demolition-school and road-jungle-lanes. ROAD-07 supports road-combined-training (helicopters) and road-lvt-training. ROAD-08 supports road-battalion-exercises. All use boundsOnly navigation windows; course durations do not establish calendar dates.
