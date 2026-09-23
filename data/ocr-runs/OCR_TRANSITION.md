# Approved OCR transition — September 13, 2026

## Active version

`ACTIVE_OCR.json` explicitly approves document 1201048065 (three pages, July–December 1965) after the 38-difference review. It pins page hashes and the complete set of human correction records. This is not a claim that every unchanged character was individually checked. Document 1201048066 (eight pages) is also active with human corrections and a flagged stamp ambiguity following the review through January 8. The remaining nine documents, 1201048067–1201048075, remain pending; they are not automatically approved because the same model processed them.

`scripts/resolve-approved-ocr.mjs` produces `approved-reading-copies/1201048065.json` at build time. Raw Qwen remains immutable. The correction anchored to Qwen’s handwritten annotations changes 8/5 and Dec 1965 to the human-confirmed 2/5 and Jul-Dec 65. Other Qwen-anchored confirmations are unchanged. Older-source corrections are preserved as reviewed transition evidence; their confirmed changes are already present in Qwen, and are checked rather than blindly replaying entire old replacement blocks (which could restore other old errors).

The resolver is scoped to this reviewed transition, not a universal correction engine. New/modified human records, changed page hashes or changed PDFs fail the build until transition review is updated. Dates and events remain separately associated because Qwen reads table date and event columns separately.

## Consumers

SQLite stores the resolved pages in `ocr_reading_pages`, with raw and resolved hashes. The website exposes the same reading copy under **Reviewed transcription** in the source viewer. Existing cited excerpts and editorial narrative remain separate from transcription; original offsets and old OCR hashes on source anchors retain their original provenance and must not be interpreted as offsets into Qwen. The legacy audit script is disabled because its old line parser cannot safely parse Qwen’s column order.

## Old OCR archive

Byte-identical archived files and SHA-256 inventory: `data/local/ocr-archive/pre-qwen-20260913/`. All raw OCR is gitignored, including the formerly allowlisted 1965 file. Historical `_files/` copies remain locally for immutable import manifests and old correction anchors; they are no longer the active 1965 reading source. Nothing is deleted from Git history by this change.

## Editorial cleanup

The transfer title and text use “new commands.” Obsolete name warnings and the erroneous Burns/Hughes roster warning were removed. The duplicate Margarita sentence was removed from Closer Look; the underlying location record is retained.

## Source-first Chapter 00 coverage — 2026-09-13

Audited both resolved command chronologies passage by passage through January 8. Added 19 event/activity records, included January 1 activation in Chapter 00, and added grouped deployment details to Closer Look. Timeline has 65 visible records, including existing granular command changes; that count is not a count of unique source passages. Chapter 00 now ends January 8. New anchors use verified PDF pages, without invented region coordinates. See SOURCE_FIRST_CH00_COVERAGE.md and its exact-span JSON companion under data/ocr-runs.

1201048066 now resolves Qwen pages plus confirmed human corrections in descending immutable offset order. The ambiguous stamp is retained as an unresolved candidate, not applied as a confirmed correction. SQLite and the viewer use this reading copy. Older raw OCR remains archived locally; no source bytes changed.
