# Source alignment review — September 12, 2026

Reviewed local M1 Qwen alignment outputs, not PDF scans directly. Original OCR is unchanged. Model findings are proposals, not human corrections.

- 33 requested passages across 14 PDF pages; 32 reported located.
- 31 geometrically valid boxes applied. ROAD-07 was rejected: its proposed rectangle exceeds the page width (x + width = 1.02) and its excerpt continues onto the next page. A focused two-page alignment is required.
- post-return-transfers remains unaligned: model reports "transferred to new commands" versus the older OCR's "to various units throughout the Division". Keep the conflicting readings for review.
- Princeton log page 39: model reports 0550 commencement of flight operations rather than the earlier OCR's 0556. Highlight identifies the watch block; time is unresolved and no historical text was overwritten.
- Other proposed reading differences: TENDERTOUCH vs TIMBERTORCH; JEFFERY vs JAFFKE; FAHRNI vs PARENTI; HUGHES vs BURNS; HERING vs EERING; implemented vs inaugurated; message 230005Z vs 238952. These need transcription review independently of geometric alignment.
- ROAD-LOAD page anchors highlight broad page bodies; passage-specific replacements remain to be aligned.
- The official book currently has document-level access only. Printed-page mapping and passage highlights remain outstanding.

Machine-readable review: [2026-09-12.json](2026-09-12.json). Immutable request/response evidence is retained under data/local/alignment-2026-09-12T20-39-57-164Z; records include response hashes. Existing non-null alignments were preserved.

September 12 follow-up: Brent confirmed Princeton 0550 (layer 3). The prior unresolved-time note above is superseded by `../human/princeton-0550.json`. Highlight width adjusted separately as a layer-2 geometry change; geometry review pending.

November 1 follow-up: Brent confirmed HERING rather than EERING. Human correction: `../human/hering-november1.json`. August references remain separately unverified.

November 3–5 follow-up: Brent confirmed TENDERTOUCH and JEFFERY. See `../human/tendertouch-jeffery.json`; earlier uncertainty is superseded for this passage.

November 5 follow-up: Brent confirmed FAHRNI. See `../human/fahrni-november5.json`. November 26 remains a separate pending review.

November 26 follow-up: Brent confirmed FAHRNI relieved by HUGHES and the highlight placement. See `../human/fahrni-hughes-november26.json`.

November 15 follow-up: Brent confirmed “was implemented.” See `../human/training-implemented.json`.

ROAD-09 follow-up: Brent confirmed message 230005Z on PDF page 6. See `../human/road09-message.json`.

## Narrative highlights — September 13, 2026

Narrative targets now include the approved transfers and September exercise summary wording, with new Qwen geometry. The viewer supports multiple regions across PDF pages, including ROAD-07 (pages 5–6). Book biography, transplacement and replacement citations have dedicated anchors on PDF pages 26, 71 and 133 (printed 10, 55 and 117), identified by Qwen. All new geometry remains layer 2, pending human review; raw responses and existing human corrections are preserved. See [alignment records](2026-09-13-narrative.json). Printed page 11 / PDF 27 was checked but its landing-plan passages were not added to the narrative.
