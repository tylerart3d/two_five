# Research source layout

Read September 7, 2026: all seven Markdown documents in the legacy docs folder.

Application root: `P:\projects-code\two_five`

Existing research root: `P:\projects-code\hotel_two_five`

## Active inputs

Paths below are relative to the research root.

| Path | Role |
| --- | --- |
| source_documents/5th_Marines/2nd_Battalion/chronologies/ | Primary 2/5 PDFs and matching `{archive_id}_vision_ocr.txt` files. |
| source_documents/5th_Marines/chronologies/ | Regimental documents for higher-level context. |
| source_documents/5th_Marines/1st_Battalion/chronologies/ | Sister-battalion source documents. |
| source_documents/5th_Marines/3rd_Battalion/chronologies/ | Sister-battalion source documents. |
| source_documents/operations/ | Operation after-action reports and transcriptions. |
| source_documents/task_force_hotel/ | Separate Task Force Hotel sources; do not equate with Hotel Company 2/5. |
| staging/chronologies/ | Documented destination for current structured extraction JSON. Only three files were present during initial inspection; current database/export coverage remains unverified. |
| database/schema.sql and seed.sql | Active schema and unit seed definitions for the previous MySQL app. |
| database/corrections/ | Agent corrections first, researcher-directed manual corrections second. Preserve manual precedence. |
| maps/ and web/public/tiles/ | Map source/cache assets and generated tiles. |
| source_documents/an_hoa_photos/ | Photo research catalogs and references, largely for later periods. |

Roster work is documented as a separate `P:\projects-code\2_5_roster` project,
to be integrated separately. It has not been inspected in this review.

## Authority and preservation

- Use current Vision OCR alongside original PDFs. Never edit raw OCR in place.
- Brent identifies archived content as superseded, including truncated Gemini
  output. Exclude archive folders from migration inputs and completeness audits.
- Preserve exact source excerpts and UTF-8 byte offsets; add verified PDF page
  anchors for the new evidence viewer.
- Keep documents, transcription, structured extraction, and reviewed publication
  as distinct processing states. File presence alone does not prove completeness.
- Design-document examples and expected counts are specifications, not verified
  historical records or measurements of the current database.

## Observed file presence versus older documentation

| Folder | PDFs | Matching-name Vision OCR file count |
| --- | ---: | ---: |
| 2/5 chronologies | 63 | 63 |
| Regimental chronologies | 62 | 62 |
| Operations | 8 | 8 |
| 1/5 chronologies | 64 | 0 |
| 3/5 chronologies | 61 | 0 |
| Task Force Hotel | 6 | 0 |

Counts cover immediate files with the documented suffix only. Zero does not
establish that no transcription exists elsewhere or under another naming scheme.
This was not a page-completeness audit. Regimental and operations Vision files
demonstrate that the old documents' pending-OCR labels are out of date.

## Design carried forward

Documents 01–05 establish source provenance, precision/confidence, hierarchical
events, personnel relationships, and the correction workflow. Document 07 maps
AO geometry to cached inputs and distinguishes calibrated boundaries from
placeholders. Retain that lineage when reusing polygons.

Document 06 describes the former WordPress/Hostinger deployment. Brent's agreed
React/TypeScript, SQLite, and Cloudflare direction supersedes it. The newer
chapter/day/evidence experience also supersedes the old UI as a fixed design.
