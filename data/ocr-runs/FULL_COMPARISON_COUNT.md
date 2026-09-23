# Full 1965–1966 OCR difference count

Compared all 663 new OCR pages across 11 PDFs against the original non-archived OCR, verifying original OCR SHA-256 and exactly one new output per page across four runs. Count: **11,642 contiguous difference blocks**. A block is one changed stretch in a document-level token alignment, not one error or one word.

Method: Python difflib.SequenceMatcher with autojunk=False; uppercase Unicode word tokens; ignore punctuation, whitespace, generated [Page N]/[PDF Page N] labels; join line-end hyphenated words. Raw OCR and human corrections remain untouched. This compares raw runs, not corrected display text. Reordered tables, missing content, headers and OCR substitutions can all contribute. This is not a count of historical errors or confirmed improvements.

| Document | Pages | Difference blocks |
|---|---:|---:|
| 1201048065 | 3 | 38 |
| 1201048066 | 8 | 22 |
| 1201048067 | 7 | 27 |
| 1201048068 | 78 | 1182 |
| 1201048069 | 199 | 2353 |
| 1201048070 | 55 | 1268 |
| 1201048071 | 25 | 793 |
| 1201048072 | 45 | 673 |
| 1201048073 | 2 | 15 |
| 1201048074 | 57 | 926 |
| 1201048075 | 184 | 4345 |

Detailed per-document changes and page provenance: `data/local/ocr-comparison-complete-20260913/`.
