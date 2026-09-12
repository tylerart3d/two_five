# Project brief

Status: direction updated September 7, 2026. See PHASE_ONE.md for the revised
stage outline and LEGACY_ASSESSMENT.md for the initial reuse assessment.

## Purpose

Build an archival research resource and an accessible narrative of 2/5 Marines,
especially Hotel Company. Give researchers access to detailed evidence while
helping veterans, families, and casual readers follow events in time and place.

## First-release boundary

Focus on 1965 and 1966 for the October 2026 reunion. The precise reunion date,
chapter selection, coverage goals, and release acceptance criteria remain to be
established. The archive can grow beyond this period later. Start the first
complete experience with 1965, centered on Camp Pendleton, reorganization,
command changes, and training, before expanding into 1966.

## Experience direction

Use connected chapter, day/event, and evidence views with a persistent map and
clear time navigation. Readers should be able to follow a story, expand its
daily or hourly detail, and inspect the original evidence. Researchers should
also enter through search and permanent links to entities and source records.

Prioritize readable typography, responsive navigation, map continuity, keyboard
access, and reduced-motion support. Animation should explain changes in time
and place. Do not assume that one dense timeline must serve every level.

## Evidence direction

Retain immutable source text, page-level PDF references, extraction metadata,
review states, and reproducible corrections. Distinguish what a document states
from interpretations and recollections. Preserve disagreements and gaps.

Brent reports that almost all extraction is already complete; remaining material
is largely garbled or unreadable even to human readers. Prioritize migration,
version reconciliation, provenance repair, and review over repeating extraction.
Retain unreadable material and add recoverable information incrementally. Local
vision tooling is for targeted recovery; no model is configured in this starter.

Photographs have two uses: primary imagery of 2/5, particularly Hotel Company,
and period-context imagery of relevant places or equipment. Preserve those
distinctions in metadata and captions. See PHOTO_RESEARCH.md.

## Technology direction

React, TypeScript, SQLite, GitHub, and Cloudflare. The application will not use
the earlier Python/WordPress application architecture. Backend, ingestion,
schema, hosting configuration, and map/timeline library choices are still open.

## Legacy reuse

Keep the original workspace intact as research/reference material. Selectively
reuse verified map data, source inventories, research, and useful behavior.
Do not bulk-copy credentials, database dumps, media, or obsolete applications.

## Next conversation

Plan the stages of phase one: scope and representative source period, evidence
model, extraction/review workflow, narrative and map interaction, implementation,
validation, and reunion release. Agree deliverables and completion criteria
before treating this list as an implementation schedule.
