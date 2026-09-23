# Personnel storage and command history

The personnel observation fields follow `P:/projects-code/2_5_roster/ocr_pipeline/config.py` and its workbook headers: `grade`, `name`, `svcno`, `comp`, `mos`, `str_cat`, `rtd`, `audit1`, `audit2`, `audit3`.

`personnel.json` holds stable person IDs and known names. `leadership-1965.json` links those IDs to dated, sourced appointments and roster snapshots. These build into the local SQLite `personnel` and `personnel_observations` tables alongside events and source anchors. Observations retain the ten roster fields; unavailable values are NULL. Identifiers, MOS and date codes use TEXT so prefixes and leading zeroes survive.

The first population is 25 people and 39 observations from existing cited 1965 leadership records. No legacy roster rows, service numbers, or OCR have been imported. Identity links are scoped to these command records; they do not establish matches to truncated names in the legacy roster. No fuzzy automatic person merges are used. Rank codes derive from explicit rank labels; other roster fields are not inferred.

Appointment dates and roster observation dates remain distinct. The selected officer panel lists recorded roles, observations and the next recorded holder, with source links. Later records are labeled when they fall after the timeline selection. Unknown start/end dates are not fabricated. This is the documented history currently available, not a complete service biography.

SQLite remains a derived local database. The website reads the same editorial leadership JSON; it does not query SQLite at runtime. Raw scans/OCR, agent work and human corrections remain separate. Legacy import and field-level review integration remain future work.
