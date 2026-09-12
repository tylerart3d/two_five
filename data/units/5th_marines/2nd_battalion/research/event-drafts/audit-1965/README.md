# Consolidated 1965 audit and review

Updated 2026-09-07. This is the authoritative combined report for the command
chronology and *The Landing and the Buildup, 1965*. It merges the two audit
README reports; supporting JSON stays in its existing directories.

Research only. No draft is imported into the site or current SQLite event index.
Original scans, raw OCR, agent fixes and human fixes remain separate and unchanged.
Scope: all of 2/5, its returning predecessor 3/9, and evidenced cooperating units.

## Coverage at a glance

| Collection | Current result | Limit |
| --- | --- | --- |
| Chronology 1201048065 | 18 dated-entry drafts plus five supplementary/context drafts | 23 records, mostly reconciling existing events; not 23 new events |
| 1965 book | 24 event/context proposals across main and indirect reviews; four photo leads | Unpublished proposals, not accepted atomic-event totals |
| Initial book search | All 89 candidates have recorded dispositions | Candidate review does not certify complete book coverage |
| Recovered printed pages 203–210 | All eight transcriptions read in full | No additional target event established; OCR accuracy not visually certified |

The older book-coverage.json in this directory is a historical pending-work
snapshot. Use the linked candidate and follow-up reviews below for current status.
Do not total chronology drafts and book proposals as distinct historical events.

## Discussion queue

All items below are pending discussion; recommendations are not user approvals.
We will record decisions here as we go, without treating narrative decisions as
transcription corrections or permission to publish.

1. **Redesignation and scope:** distinguish returning 3/9 from outgoing 2/5; decide
   whether January–June predecessor events belong in Chapter 00 or separate background.
2. **January deployments and Company L:** distinguish roster intervals from
   appointments and readiness changes from movements.
3. **March landing:** preserve planned versus actual dates/times and company roles.
4. **Defense, logistics and supporting units:** include battalion activity and
   attachments; leave uncertain casualty attribution unresolved.
5. **April command relationships:** distinguish operational control from a new
   battalion CO or redesignation; include reconnaissance regrouping.
6. **May 6 Chu Lai:** Company K participation, not an assumed whole-battalion move.
7. **June relief:** retain conflicting June 11/17 claims separately.
8. **August return and transfers:** retain uncertain individual transfer dates.
9. **Leadership:** split or group same-day billet changes without duplicating them.
10. **September 16 SEATO:** add the omitted combined fire-support demonstration.
11. **November training:** TIMBERTORCH, special training, Princeton PHIBLEX;
    distinguish company 40% manning from battalion approximately 50% strength.
12. **December roster and strength:** snapshots, unresolved Burns/Hughes and S-4
    transitions, and cross-year personnel totals.
13. **Photographs and further sources:** four leads, with one unresolved identity;
    March 3/9 diary retrieval without an invented archive identifier.
14. **Reconciliation and release:** decide canonical event granularity, entity
    references and chapter placement before any draft is promoted.

## Decision log

- Brent: keep the timeline July–December. Exclude predecessor 3/9 event detail
  from chapter narrative/timeline; retain only a brief earlier-service mention.
- Brent: individual leadership actions in research/timeline, visually grouped
  by date; readable combined summaries in Chronology. December roster remains
  a recorded snapshot, not inferred appointment dates.
- Implemented: 30 individual action records plus full December roster; original
  summaries retained with timelineHidden. Chapter 00 shows 42 timeline entries.
  Book predecessor drafts and legacy 1967 extractions remain unpublished.

## Chronology 1201048065

The three-page existing OCR has been inventoried into 18 dated-entry records
and five additional records for transfers, training, the December roster,
organizational context, and the commander's narrative. These are **23 draft
records, not 23 newly discovered events**: most reconcile or supplement live
entries. Do not append all of them to the timeline as duplicates.

[coverage.json](coverage.json) maps each dated entry and substantive report
section to a draft and existing event IDs where applicable.
[source-assertions.json](source-assertions.json) preserves exact source excerpts,
SHA-256, end-exclusive UTF-8 offsets, OCR page labels, and correction-file hashes.
All 23 byte spans were checked against the unchanged OCR. The imported agent
and human correction files contain no fixes for this document. The audit script
refuses to regenerate if applicable corrections are added; it is not a general
correction resolver.

### Findings requiring reconciliation

- September 16: SEATO combined fire-support demonstration, with 2/5 providing
  the ground maneuver element, needs an event in the eventual published catalog.
- November 15: RLT-5 special training program inauguration, with limited
  training due to school TAD, other commitments and approximately 50% strength.
- After August 8: majority of officers and men transferred within the division;
  individual transfer dates are unstated, so the draft end date remains null.
- December 20 roster: retain all eleven billets as observations, not eleven
  appointment dates. H&S reads R.D. Hughes, while November 26 records R.D. Burns;
  S-4 also differs from August. No transition dates are supplied.
- TIMBERTORCH: the detailed entry identifies 1st Platoon (reinforced), Golf,
  2ndLt W.W. Jaffke and the Army's 3rd Brigade, 5th Infantry Division (Mechanized).
- Princeton PHIBLEX: three rifle companies and H&S elements participated at
  approximately 40% company manning. Do not merge that figure with the narrative's
  approximately 50% battalion strength. The dated entry is November 19; narrative
  wording is mid-November.

The **OCR passage inventory** is complete for this short chronology. Historical
verification, splitting grouped billet actions when useful, and reconciling the
drafts into canonical events remain pending. This does not establish that OCR
captured every mark in the original scan. No PDF inspection or new OCR was done.

## Official history: current findings

Updated 2026-09-07. Scope is the whole 2/5 and its returning predecessor 3/9,
including every company, headquarters, attachments and cooperating units.
Hotel is a focus, never an inclusion filter. Supporting-unit actions retain
their actual participants and relationship to the battalion.

This audit adds **22 unpublished proposals**, supported by 20 source-page
records, and three photograph leads. The 89 original search candidates each
have a disposition in [candidate-review.json](../book-1965-review/candidate-review.json). These
are agent text-review results, not human verification or a full-book
completeness certification. Earlier pending ledgers remain historical snapshots;
this directory records the subsequent candidate review.

## Independent follow-up reviews

Two sub-agent reviews added the following, consolidated without site promotion:

- [Indirect/index review](../book-1965-review/indirect-review/README.md): two more event/context
  proposals (April 12 command relationship and April 18 higher-headquarters
  reorganization), one unresolved photograph, and a March 3/9 command-diary
  retrieval lead. Total across this directory and that review: **24 proposals
  and four photo leads**, not a count of approved or necessarily atomic events.
- [Recovered-page semantic review](../book-1965-review/recovered-semantic/README.md): all eight
  full transcriptions, printed 203–210, checked including footnotes and captions.
  No additional target-battalion event established. Vietnamese Marine battalions,
  2/7 at BLUE MARLIN and Marine Support Battalion Company L remain distinct.

The command-diary lead has no invented Texas Tech identifier. Photo A185897
remains undated with uncertain returning/replacement-battalion identity.

## Useful additions

- January offshore deployments and readiness changes.
- Company L's January roster and Captain John J. Sheridan.
- March warning order, traffic arrangements and actual landing sequence.
- Actual March 12 brigade unloading completion, distinct from planned March 9.
- March 23 BLT strength of 1,115, as a snapshot rather than a join total.
- Airfield and hill-mass defense, logistics, patrols and local coordination.
- Reconnaissance platoon attachment and April regrouping.
- Company K's May 6 move to secure the Chu Lai landing area.
- June relief/departure accounts, retaining conflicting dates.

Proposals before July have empty `chapterIds` and a separate proposed Chapter 00
placement. They will not silently extend the current July–December timeline.
Structured `participants` now distinguish company activity, supporting units,
contextual involvement and uncertain attribution. Canonical entity IDs still
need normalization before promotion.

## Identity and uncertainty findings

The outgoing 2/5 described on p.55 became the replacement 3/9. Its end-June
Okinawa arrival is not a returning-battalion date discrepancy with the July 19
redesignation. Those passages concern different sides of the exchange.

By contrast, p.49's June 11 relief and p.237's June 17 relief are a genuine
unresolved source discrepancy; p.229 separately reports June 17 departure.
The draft keeps dates null at event level and retains the conflicting assertions.

Company H references in the candidate set concern other battalions, including
2/3, 2/4, 2/7 and 2/9. Later replacement-3/9 operations remain excluded from
returning-2/5 events but recorded for identity context. This does not exclude
other units when evidence establishes cooperation with the subject battalion.

The listening-post fatal shooting on p.19 has no names or date in the passage;
its `units` array is empty, and possible 3/9 attribution is explicitly uncertain
in `participants`. The surrounding account discusses both infantry battalions.
Planned unloading times are not asserted as actual completion times.

## Photograph leads

[photo-leads.json](../book-1965-review/photo-leads.json) identifies A183676 (p.10), A183798 (p.11),
and A183859 (p.18): predecessor landing images and McPartlin on Hill 327.
Only captions were read. No images were inspected, downloaded separately, or
published; individual image rights and labels require review.

## Provenance and remaining work

Source-page text derives from immutable IA XML WORD elements, referenced by
XML hash, OBJECT index, page-file identity, archive leaf and printed page label.
Normalized character text is explicitly not an immutable raw-byte offset.
Official PDF page numbers and highlights remain null. Imported correction files
contain no identified book corrections; the script fails if an applicable or
unrecognized correction target appears. This limited check is not a general
correction resolver or proof that no uncataloged corrections exist.

All eight recovered pages (203–210) have now received full text-based semantic
review in the separate report above. This supersedes the older term-screening
limitation. Supplemental Qwen transcriptions stay raw OCR, with original
uncertainty metadata preserved; no PDF/transcription accuracy certification.

Remaining work: reconcile proposals into canonical event records and chapter
placement; normalize entity IDs; obtain precise passage-level anchors
where page-level evidence is insufficient. No completeness claim is made for
every 2/5-related statement in the book.

`python scripts/audit-book-1965.py` regenerates these proposals. Preserve human
review separately; do not edit generated JSON in place. The site and its SQLite
event index do not import this directory. Nothing has been promoted.

## Chronology regeneration

`node scripts/audit-1965.mjs` regenerates chronology JSON and the older initial
book snapshot. `python scripts/audit-book-1965.py` regenerates main book proposals.
Neither script rewrites this merged README. Keep human review separately from
generated JSON. Existing links and files retain source identities and provenance.

## Implemented training follow-up

The September 16 SEATO demonstration and November 15 special training start
have been promoted as source-backed Chapter 00 events under `research/events/`.
TIMBERTORCH and Princeton entries were enriched in place, preserving unresolved
name readings and company identities. Chapter 00 now shows 44 timeline entries.
Draft files remain audit records and are not directly imported; the opening
research-only note refers to this audit directory, not the promoted copies.

## Post-return transfer follow-up

Added the aggregate personnel transfer statement to Chapter 00, with null end
and explicit earliest-bound positioning after August 8. No exact transfer date,
individual recipient unit or numerical total inferred. Timeline now 45 entries.
