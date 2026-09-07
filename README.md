# Two / Five

A map-led history and research archive of the 2nd Battalion, 5th Marines,
with a focus on Hotel Company during the Vietnam War.

The project serves veterans, families, casual readers, and researchers through
a guided narrative backed by inspectable archival evidence.

## Current status

Repository foundation only. React and TypeScript starter with Vite; no research
data has been imported and no Cloudflare deployment has been created.

The first release is intended for the October 2026 reunion and focuses on
1965–1966. Phase-one stages and acceptance criteria are the next planning task.

## Development

Use Node.js 22.12+ (or Node.js 24 LTS) and npm.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

The starter is a foundation page, not the final timeline or visual design.

## Direction

- React and TypeScript for the new application.
- SQLite for research storage; Cloudflare hosting is the deployment target.
- Exact database hosting, API, deployment, and extraction arrangements remain
  decisions for phase-one planning.
- Develop one real, source-backed period through the full experience before
  scaling ingestion across the corpus.

## Project documents

- [Project brief](docs/PROJECT_BRIEF.md)
- [Research provenance and source attribution](SOURCES.md)
- [Code ownership](LICENSE)
- [Repository working instructions](AGENTS.md)

The earlier research workspace is retained separately. No legacy application,
database, or bulk asset directory was copied into this repository.

## Rights

Copyright © 2026 Brent Tyler. Original project code: all rights reserved.
This is a public, source-visible repository, not an open-source license grant.
Dependencies retain their own licenses. Research points back to original
archival sources under their applicable rights; see [SOURCES.md](SOURCES.md).
