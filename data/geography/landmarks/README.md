# Shared landmarks

Persistent places reused across chapters, event records, maps and future albums.
Landmarks live outside the military hierarchy: units relate to them through dated,
sourced assertions, rather than owning the place record.

| Stable ID | Landmark | Current state |
| --- | --- | --- |
| camp-pendleton | [Camp Pendleton](CAMP_PENDLETON.md) | Existing modern geometry linked |
| camp-schwab | [Camp Schwab](CAMP_SCHWAB.md) | Modern coastal-base outline displayed in the 1966 chapter; historical boundary unverified |
| long-beach-pier-e | [Long Beach Pier E](LONG_BEACH_PIER_E.md) | Pier E reference with USACE port-area outline in the 1966 map |
| pearl-harbor | [Pearl Harbor](PEARL_HARBOR.md) | Harbor reference point in the 1966 map |
| da-nang | [Da Nang](DA_NANG.md) | Identity cataloged; source and geometry review pending |
| an-hoa | [An Hoa](AN_HOA.md) | Base-area cataloged; source and geometry review pending |

## Maintenance

- One stable landmark ID across chapters; do not duplicate a base for each event.
- Keep geometry in its own provenance-bearing record; link it here. Distinguish
  modern orientation, dated historical boundaries, and approximate locations.
- Label placement is cartographic presentation, not historical evidence.
- Source assertions should identify claim, document, page, anchor, date range,
  uncertainty and review status. Link unit presence with dates and supporting sources.
- Cities, airfields and bases are separate entities when needed; use explicit
  parent/related-place links instead of merging them under a familiar name.
- Future photos must link their catalog record, original source, rights status,
  date confidence and primary/period-context category. Do not add unsourced albums.
- Planned content periods describe editorial scope, not operating dates.
- Record additions and changes in ../../CHANGELOG.md.

The map renders Camp Pendleton in the 1965 chapter and Camp Schwab in the 1966 chapter.
Da Nang and An Hoa are catalog records only and are not plotted yet.
MCRD San Diego: [record and sources](MCRD_SAN_DIEGO.md), clickable modern point on the 1965 map.

USS Princeton: [research notes](USS_PRINCETON_RESEARCH.md) and [1962 museum photo metadata](USS_PRINCETON_PHOTO_1962.json); supplied image preserved locally, period context.
Princeton later service: [Apollo 10 photograph and source](USS_PRINCETON_APOLLO_PHOTO.json), shown in the location panel.
Princeton: [November 17–19 deck-log OCR review](USS_PRINCETON_LOG_REVIEW.md), agent findings with uncertainties; no map changes.

- 2026-09-12: User-directed Princeton placement 4100 yards southwest of estimated Pendleton beach midpoint (33.30,-117.49). Estimated display position, not a verified ship fix. Construction recorded in data/geography/landmarks/USS_PRINCETON_POSITION.json.

- Both user-supplied photos (USS_PRINCETON_PHOTO_1962.json and USS_PRINCETON_PHOTO_DECK.json) are retained locally with Rights unverified tags. Museum attribution does not establish permission.

- Added three sourced helicopter photos to Princeton album: user-linked 1966 HMM-362 lift-off, 1960 HMM-261 deck preparation, and 1963 HMM-163 UH-34D. Dates, credits, rights statements and source links in USS_PRINCETON_HELICOPTER_PHOTOS.json. All period context.

- Added Princeton November 1965 deck log to source reader, opening at PDF page 39 with page-only citation. Local PDF allowlisted explicitly; original NARA URL and SHA-256 recorded in USS_PRINCETON_SOURCE_ANCHORS.json.
