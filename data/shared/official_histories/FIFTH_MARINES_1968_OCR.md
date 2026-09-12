# 5th Marines history: complete-book M1 OCR run

Started 2026-09-08 at Brent's request. Scope: all 85 physical PDF pages of
*A Brief History of the 5th Marines*, revised 1968. Source PDF remains unchanged.

Model: `m1-pro/qwen3.8-flash-next-iq4xs` through local Agent Relay.
Each page is rendered to PNG with a maximum dimension of 2400 pixels; only the
local model reads the images. Output allowance is 14,000 tokens per page.
Responses ending for a reason other than `stop` are not accepted as complete.

Local source collection:
`_files/fifth_marines_1968/ocr/2026-09-08-m1-qwen/`

- `run.json`: original PDF hash, model, render settings and exact prompt.
- `page-NNN.png`: page image supplied to the model.
- `response-NNN-attempt.json`: immutable raw responses, including failed attempts.
- `page-NNN.json`: parsed OCR, physical and model-read printed page labels,
  uncertainties, timestamps, usage and source/image/response/text hashes.
- `reading-copy.txt` and `manifest.json`: produced only after all 85 pages finish.

Status: **needs attention**. See `data/local/fifth-marines-ocr/validation.json` for the completion-check result. Saved OCR pages remain available. Current machine-readable progress is in
`data/local/fifth-marines-ocr/status.json`. Resume script:
`node data/local/fifth-marines-ocr/run.mjs` from the repository root.
Do not start a second instance while the first is running.

This is layer 1 raw model OCR, not an agent correction or a human-reviewed
transcription. Original scans, OCR, agent fixes and human fixes stay separate.
Blank pages are retained as page records; printed page labels are not assumed
to equal PDF indices. Uncertainty remains visible. Completion means every page
received a structurally valid model response, not certified transcription accuracy.
No site event ingestion, public release, or original evidence replacement.
