# Event title

Copy this template into the issuing unit's `research/event-drafts/` directory.
Replace placeholders with evidence-backed values. This directory is outside the
site's event import. Do not move a draft into `events/` until deliberately
approved for site inclusion. Chapter tags alone do not publish a draft.

Template: [EVENT.json](EVENT.json). Copy and edit the JSON file.

## Field contract

- Keep `id` stable when wording changes. Use one event with multiple sources
  when several documents describe the same occurrence.
- `visibility`: `research_only` or `site`. `reviewStatus`: `draft`,
  `needs_review`, or `reviewed`. Review and publication are separate decisions.
- `chapterIds`: for example `rebirth-1965` or `road-1966`. Assign explicitly;
  an event may span chapters. Left-panel section membership stays in chapter files.
- Dates use ISO `YYYY-MM-DD`; unknown bounds are null in drafts. Point events
  use the same start and end. For month/year precision, bounds are navigation
  envelopes, not claims of continuous activity. Preserve `before` and
  `record-date` semantics. Never invent an end date to fill a gap.
- Optional `date.timeStart`, `date.timeEnd` use `HH:MM[:SS]`; optional
  `date.timeZone` is only supplied when established by the source.
- Optional `parentEventId` links an occurrence to its operation or larger event.
  Optional `tags` supports finer classification without altering source wording.
- `sources`: objects with `documentId` and `anchorId`. Supporting text, original
  PDF page, printed page label, OCR hash/version, immutable offsets, confidence,
  and correction trail belong to the separate source assertion/anchor record.
  Missing page alignment stays missing; do not invent a highlight rectangle.
- `paragraphs`: arrays of text segments, e.g.
  `[[{"text":"Supported statement.","source":0}]]`; source indexes refer to
  this event's `sources` array.
- Optional `mapDestination` points to an established map view, not an inferred
  exact coordinate. Preserve original MGRS and coordinate uncertainty in source
  evidence until normalized location records exist.
- `revisions`: dated objects with `date` and `note`. Record correction authors
  and source versions in evidence correction records; human fixes take precedence.

## Publication boundary

The current site only imports `research/events/*.json`; templates and
`event-drafts/` are not imported. The SQLite builder likewise currently indexes
the existing `events/` records, not drafts or legacy extraction JSON. These
directory boundaries enforce separation today; the `visibility` field alone
is not an implemented publication filter.

Before promotion, resolve citations, supply valid supported date bounds, check
chapter links, set `visibility` to `site`, and deliberately move the file into
`events/`. Existing live records are unchanged by this template. Keep research
drafts outside that directory even if they have chapter tags.
