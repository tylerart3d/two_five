# Repository instructions

Read README.md, docs/PROJECT_BRIEF.md, and SOURCES.md before substantive work.

- This is the clean application repository; preserve the separate legacy
  research workspace and bring assets across selectively.
- Original project code is all rights reserved. Do not replace LICENSE with an
  open-source license. Preserve third-party licensing obligations.
- Link research to verified original records and PDF pages. Never invent
  sources, identifiers, historical claims, or missing facts.
- Preserve raw OCR; apply corrections separately with an audit trail.
- Preserve the four-layer research model: 0 = original scans, 1 = raw OCR,
  2 = agent fixes, 3 = human fixes. Original scans and each OCR run are
  immutable; fixes are separate records, never edits to the underlying text.
- Resolve reading copies with human fixes taking precedence over agent fixes,
  then fall back to raw OCR. Agents must never overwrite or supersede a human
  correction. Keep conflicting or uncertain agent proposals flagged for review.
- Each correction must identify the source document/version and page/location,
  original reading, replacement, author or model/version, date, and reason.
  Anchor corrections to immutable source spans, not offsets in a merged copy.
  New OCR of missing pages belongs in layer 1, not the agent-fix layer.
  Merged text is a derived reading copy with provenance back to these layers;
  do not describe a correction resolver as implemented until it exists.
- The website and derived research indexes must consume the resolved text
  above these layers (human fixes > agent fixes > raw OCR), rather than bypass
  corrections by reading raw OCR directly. Researchers must retain access to
  the original scan, raw transcription, and correction history. Keep narrative
  interpretation separate from transcription corrections.
- Distinguish extracted assertions, reviewed findings, and interpretation.
- Do not publish raw research corpora, private materials, credentials, local
  databases, or database dumps as an incidental part of a code commit.
- Use React and TypeScript for the application. SQLite and Cloudflare are the
  agreed direction; concrete backend decisions await phase-one planning.
- Maintain keyboard accessibility and respect prefers-reduced-motion.
- Run npm run check and npm run build for application changes.
- Keep documentation accurate about what is implemented versus planned.
- Brent supplies separate local models for OCR and page alignment. Do not
  inspect PDFs or run new OCR yourself; request model access when needed.
- Research lives in data/; read data/README.md and data/HIERARCHY.md before
  adding evidence. Maintain Markdown inventories and data/CHANGELOG.md with
  each data change. Preserve source bytes and never use archived Gemini data.
- Use the importer for source copying and npm run data:check for integrity.
  Keep editorial notes separate from generated catalog records. Do not publish
  local _files/ assets as an incidental Git change.
