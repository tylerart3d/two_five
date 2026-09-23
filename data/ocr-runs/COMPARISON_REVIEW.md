# Completed-document OCR comparison — review queue

Compared complete new OCR for 1201048065, 1201048066 and 1201048067 against the preserved non-archived OCR. Token-level differences are saved locally at data/local/ocr-1965-1966-qwen-20260912/token-differences.json. This is a preliminary review queue, not a completed audit of all 663 pages. Column reading order, page labels, spacing and punctuation create additional differences.

Human-confirmed passages remain authoritative. Only explicitly human-confirmed readings below are applied to the site.

| Source | Passage | Old | New Qwen | Status |
|---|---|---|---|---|
| 1201048065 PDF 2 | August 19 S-4 assignment | H. C. WINCH | H. T. WINSTON | Human-confirmed by Brent; applied with layer-3 correction |
| 1201048065 PDF 2 | August 19 Golf assignment | EERING | HERING | Human-confirmed by Brent; August correction applied |
| 1201048066 | Supply mount-out percentage | 93% | 98% | Human-confirmed by Brent; applied with layer-3 correction |
| 1201048066 | Advance-party property NCO | WYSHMIRKSKI | WYZSMIRSKI | Human-confirmed by Brent; applied with layer-3 correction |
| 1201048066 | Advance-party clerk | MOE | NOE | Human-confirmed by Brent; applied with layer-3 correction |
| 1201048067 | S-2 roster surname | HERENEZ | HEMENEZ | Human-confirmed by Brent; applied with layer-3 correction |
| 1201048066 PDF 1 | Reference messages | Several differing date-time groups | See token differences | Pending; do not assume new OCR is correct |

Additional spelling and possible redaction differences in the 1966 training pages remain for review. Already confirmed names and wording are excluded from repeated review only for their confirmed source passages. New OCR's changed wording is not proof of accuracy.

- Reference (c), 1201048066 PDF 1: Brent confirmed **172006Z** over old OCR **172245Z**. Applied through `corrections/human/road-ref-c.json`; remaining reference-message discrepancies are pending.

- Reference (d), 1201048066 PDF 1: Brent confirmed **302357Z** (final Z, not 2). Applied through `corrections/human/road-ref-d.json`.

- Reference (e), 1201048066 PDF 1: Brent confirmed **111900Z** over old OCR **111942Z**. Applied through `corrections/human/road-ref-e.json`.

- Reference (f), 1201048066 PDF 1: Brent confirmed **110700Z** over old OCR **110738Z**. Applied through `corrections/human/road-ref-f.json`.

- Reference (g), 1201048066 PDF 1: Brent selected **1480358Z** over **140515Z**, after the extra digit was noted. Literal reading preserved in `corrections/human/road-ref-g.json`; not normalized into a date-time.

Current full-rerun comparison review tally through reference (g): 11 selections for Qwen, 0 for old OCR. This counts the six named/percentage discrepancies and references (c)–(g), not earlier spot checks or overall OCR accuracy.

- Reference (h), 1201048066 PDF 1: Brent confirmed message number **180547Z** over **1804572**. Command abbreviation not reviewed. Applied through `corrections/human/road-ref-h.json`. Current comparison tally: Qwen 12, old OCR 0.

- 1965 PDF 1, commander’s summary: Brent confirmed “During September a Combined Fire Support Exercise” over “On 16 September a demonstration.” Saved `corrections/human/september-exercise-summary.json`. Separate September 16 dated entry unchanged.

- 1965 PDF 1, commander’s summary: Brent confirmed TENDERTOUCH, separately from the page 3 occurrence. See `corrections/human/tendertouch-narrative-summary.json`.

- 1965 PDF 1 footer: Brent confirmed ENCLOSURE (1), not (4). Saved `corrections/human/enclosure-page1.json`; other page footers not yet confirmed.

- 1965 PDF 1 marginal notes: Brent read **2/5** (upper right) and **Jul-Dec 65** (lower right), correcting Qwen’s 8/5 and Dec 1965. Separate human correction anchored to Qwen page text; original OCR omitted the notes.

- 1965 PDF 2 footer: Brent confirmed ENCLOSURE (1) and the UNCLASSIFIED stamp. Separate layer-3 records preserve each source span.

- 1965 PDF 3 footer: Brent confirmed ENCLOSURE (1) and standalone 3 above C-14-3; saved separate layer-3 records.

- 1965 PDF 2: Brent confirmed date/event associations July 19 redesignation, August 8 return, August 19 command change and assignments. Qwen column reading order is not loss of these dates.

- 1965 PDF 2: Brent confirmed September 8 command change, September 16 SEATO demonstration, and September 17 XO/H&S change date associations.

- 1965 PDF 2: Brent confirmed September 18 CO/S-3 change, September 22 S-3 change and transfer, and November 1 S-2/Golf changes. All nine page 2 date-to-event associations are now human-confirmed.

- 1965 PDF 3: Brent confirmed November 2 Foxtrot change, November 3–5 Tendertouch participation, and November 5 H&S change/transfer date associations.

- 1965 PDF 3: Brent confirmed November 19 Princeton exercise, November 20 Golf change/transfer, and November 26 H&S change date associations.

- 1965 PDF 3: Brent confirmed December 1, 15 and 20 date/event associations. All page 2–3 date/event associations presented in this review are confirmed.

## Date-order review rule (Brent, September 13)
Brent authorizes accepting Qwen’s chronological date ordering without requesting confirmation of each routine row. Record future inferred associations as layer-2 agent checks under this rule, not individual human visual confirmations. Preserve raw column text and provenance. Chronological order does not independently prove date accuracy or resolve missing/ambiguous row matches; flag conflicts, missing rows, and changed readings for review. Existing explicit human corrections take precedence.

- Reference (h), PDF 1: Brent supplied **CINCPACFL**, correcting old CINCPACLT and Qwen CINCACFL. Separate layer-3 record `road-ref-h-command.json`; previously confirmed 180547Z retained. Next: reference (i).

- Reference (i), 1201048066 PDF 1: Brent confirmed Qwen **COMPHIBPAC 182117Z**, over old COMHIBPAC 1821172. Layer-3 record: `road-ref-i.json`. Next: reference (j).

- Reference (j), 1201048066 PDF 1: Brent confirmed **CGFMFPAC 212011Z**. Separate layer-3 record `road-ref-j.json`. Next: reference (k), with its apparent date conflict retained.

- Reference (k), 1201048066 PDF 1: Brent confirmed **CGFMFPAC 190257Z**, matching Qwen. `road-ref-k.json` preserves the decision independently of the unresolved January / December 30 cross-reference. References (h)–(k) command/message readings have now been reviewed.

- Cover file number, 1201048066 PDF 1: Brent confirmed Qwen **0028-66**. Separate layer-3 record `road-cover-number.json`. Next: handwritten unit annotation beside reference (c), Qwen 8/5, omitted by old OCR.

- Handwritten unit annotation, 1201048066 PDF 1: Brent read **2/5**, written sideways, correcting Qwen 8/5. Separate layer-3 record `road-cover-annotation.json`; raw text unchanged. Next: right-edge handwritten date range.

- Handwritten date range, 1201048066 PDF 1: Brent confirmed **17 Dec 65 – 22 Feb 66**. Layer-3 record `road-cover-dates.json`. Next: PDF 8 footer spelling (metadata only).

- PDF 8 footer, 1201048066: Brent confirmed **ENCLOSURE (1)** over Qwen ENCLOSERE (1), matching old OCR. Separate layer-3 record `road-p8-footer.json`. Next: PDF 7 activation time glyphs.
