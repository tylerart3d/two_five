# Initial legacy evidence-model assessment

Read-only inspection on September 7, 2026. No legacy files or databases changed.
Paths below are relative to the separate hotel_two_five research workspace.

## Source-authority correction

Brent clarified that archive folders contain superseded material, including
extractions associated with Gemini OCR truncated at 4096 tokens. The archived
counts and conflicts below describe obsolete snapshots only. They are not
evidence of gaps or errors in the current corpus and are not migration inputs.
Old schemas remain useful design references. Consult SOURCE_LAYOUT.md for the
active folder map established from the seven legacy design documents.

## Reuse recommendation

Adapt the current schema rather than designing the evidence model from scratch.
Use the older schema for design reference only; do not recover research content
from archived JSON or assume the old SQLite snapshot represents the current corpus.

| Inspected input | Useful features or observed contents |
| --- | --- |
| database/schema.sql | Units, documents, dated/nested events, locations, multi-unit participation, event-source excerpts, OCR offsets, page numbers, source review, personnel history, aggregates, and media joins. |
| archive/database/schema.sql | Explicit document source URLs, direct command-assignment citations, field_sources concept, and period summaries. |
| archive/database/hotel_25.db | Actual read-only SQLite snapshot: 7 documents, 7 events, 5 command assignments, and 179 casualty records. Its stored schema predates the neighboring SQL file in several respects. |
| archive/data/chronologies_archive/2-5 | 64 JSON files, all parseable; 64 distinct archive identifiers; 770 combined events/timeline_events entries. Counts are entries, not verified unique historical events. |
| archive/data/chronologies/2-5/ARCHIVE | 62 JSON files, all parseable; 62 distinct archive identifiers; 684 combined events/timeline_events entries. An overlapping extraction generation, not an additional independent corpus. |
| staging/chronologies | Only 3 JSON files in this directory during inspection. This directory alone is not the complete extraction source. |

The project MySQL container was not running during the earlier review. Its
current stored contents have not been inspected. These counts do not disprove
Brent's report that extraction is largely complete; they establish the need to
locate and reconcile the latest stored version before migration.

## Preserve and extend

- Preserve source identifiers, raw excerpts, confidence, date precision, unit
  relationships, and correction layers.
- Add verified item and PDF URLs, PDF page indexes distinct from printed page
  labels, and immutable OCR version/hash references. Define offset units once.
- Attach evidence to individual assertions and assignments. A source attached
  only to a person or whole narrative does not identify which statement it proves.
- Model chapters and their cited claims separately from events. A chapter can
  draw on many events, and an event can appear in multiple narratives.
- Distinguish extracted, reviewed, inferred, and unresolved assertions. Avoid
  carrying old default 'confirmed' labels forward as completed human review.
- Preserve reported aggregate values and their sources; do not silently turn
  missing casualty counts into zero or overwrite differing reports.
- Extend media beyond caption/date/credit: source identifier, original caption,
  rights, date range, location and identity evidence, units, and usage category.
- Preserve source-local IDs and import fingerprints for repeatable migration.
  Resolve people through evidence rather than surname plus first initial.

## 1965 sample findings

Two versions of archive 1201048065 contain different extraction depth. The
1965-07.json version has 4 timeline entries and 9 command assignments; the
1965-07_1965-12.json version has 19 timeline entries and 29 assignments. Both
contain 3 operation entries. Do not combine these lists without reconciliation.

Old narrative text sometimes adds generic Vietnam/combat framing to stateside
events, or explanatory claims beyond the attached excerpt. Reuse the factual
extraction candidates, then review narrative claims against source passages.

One concrete conflict for review: the local raw OCR lists H. C. WINCH as S-4 on
19 August, while an archived event description says Winston; the December
assignment list names H. T. WINSTON. Check the original page and transition
evidence rather than choosing a name globally. This is an unresolved conflict,
not an authorized correction to raw OCR.
