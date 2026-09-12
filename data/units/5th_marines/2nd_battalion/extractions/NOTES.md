# Legacy parsed event inventory

Checked 2026-09-07 against `P:\projects-code\hotel_two_five`.

The non-archived `staging/chronologies/` directory contains:

| JSON file | Reporting period | Event objects |
| --- | --- | ---: |
| 1201048086_staging.json | May 1967 | 34 |
| 1201048089_staging.json | June 1967 | 61 |
| 1201048090_staging.json | July 1967 | 71 |

All three already exist byte-for-byte in this collection's local `_files/`
directory; SHA-256 comparisons matched. No additional copy was necessary.
There are 166 event objects, plus separate command-assignment, strength, and
other structured sections. These are imported source extractions, not yet
normalized into the new application's event database or chapter timelines.

Event fields include dates and end dates, time, temporal precision, description,
category, tags, significance, units, personnel, location name, MGRS, parent title,
source excerpt, OCR offsets, and extraction confidence. Preserve these fields
and original records during migration. Confidence labels in the JSON do not
constitute a fresh historical review.

Legacy agent and manual correction JSON files are separate under
`database/corrections/`; apply human corrections after agent corrections without
changing originals. Validate source offsets and page mappings before exposing
new source links. The new correction resolver is not yet implemented.

A non-archived JSON and parsed/staging/event filename search found no equivalent
1965–1966 event JSON in this workspace. This does not rule out other exports or
records stored only in the legacy live database. Do not infer that completed OCR
means completed structured event extraction.

Brent confirms the book's events are absent from these legacy files. Extract
and reconcile *The Landing and the Buildup, 1965* separately, preserving its
own source provenance and distinguishing predecessor 3/9 from replacement 3/9.
