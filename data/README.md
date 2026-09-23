# Research data

This is the working research collection for Two / Five. Markdown is the catalog
and editorial record format. Original PDFs, OCR text, JSON extractions, images,
and geographic inputs remain byte-for-byte evidence under local `_files/`
directories. They are ignored by Git. The local evidence proof serves one
explicitly allowlisted PDF; the rest of the raw corpus is not served.

- [Military hierarchy](HIERARCHY.md)
- [Collection inventory](INVENTORY.md)
- [Import manifest and SHA-256 hashes](IMPORT_MANIFEST.md)
- [Excluded and deferred material](EXCLUSIONS.md)
- [Change log](CHANGELOG.md)
- [Event filing and source coverage](units/5th_marines/2nd_battalion/research/EVENT_COVERAGE.md)
- [Research record template](templates/RECORD.md)
- [Structured event template and publication boundary](templates/EVENT.md)
- [Official histories and external-source imports](shared/official_histories/README.md)
- [1965 official history OCR page recovery](corrections/landing_buildup_1965/README.md)
- [Photo record template](templates/PHOTO.md)

## Organization

```
units/
  5th_marines/
    chronologies/
    1st_battalion/chronologies/
    2nd_battalion/
      chronologies/
      extractions/
      rosters/
      companies/{hotel,golf,foxtrot,echo,headquarters_and_service}/
    3rd_battalion/{chronologies,after_action_reports}/
  {1st_marines,7th_marines,9th_marines}/documents/
task_forces/task_force_hotel/documents/
supporting/aviation/documents/
shared/{operations,overlays,casualties,reference,personnel_references}/
media/an_hoa/
geography/{source_maps,geographic_inputs}/
corrections/
reference/{legacy_design,legacy_database}/
```

Keep each source with its issuing unit or source collection, not every unit it
mentions. Link Hotel research to battalion source records instead of duplicating
reports. Shared operations and unclassified aviation sources stay separate until
their issuing unit is established. Directory ownership is not proof of event
participation. This hierarchy preserves the old seed's organization and IDs;
it does not assert a timeless operational chain of command.

## Maintenance

To import new files from the original workspace and regenerate source catalogs:

```powershell
npm run data:import -- 'P:\projects-code\hotel_two_five'
npm run data:check
```

The importer skips identical files, verifies SHA-256 hashes, refuses to overwrite
changed evidence, and retains earlier imported files if removed from the source.
It regenerates INVENTORY.md, IMPORT_MANIFEST.md, collection INDEX.md files,
records/ metadata, and EXCLUSIONS.md. Do not edit those generated files manually.
Write research in separate NOTES.md files or company research directories using
the templates. Record meaningful imports and editorial updates in CHANGELOG.md.

For future research that does not come from the old workspace, first extend the
importer/catalog workflow to record its actual source. Never bypass the manifest
by dropping untracked originals into `_files/`.

Catalog source URLs as unverified until checked. File presence is not evidence
of complete OCR or historical accuracy. Raw OCR is immutable; apply corrections
in a separate layer with manual corrections taking precedence over agent ones.

The initial import deliberately excludes archived Gemini material and generated
assets. See EXCLUSIONS.md. Original research material remains untouched.
No data is published automatically: reviewed public exports and the SQLite
application model will be built separately.

## Editorial map records

- [1965 Camp Margarita map](units/5th_marines/2nd_battalion/research/1965_MAP.md):
  modern locator and historical-source cross-reference.

- [Camp Pendleton geometry](geography/places/CAMP_PENDLETON.md): SanGIS modern jurisdiction outline and editorial label location.

- [1965 chapter event index](units/5th_marines/2nd_battalion/research/1965_EVENTS.md)

- [Shared landmark catalog](geography/landmarks/README.md): Camp Pendleton, Da Nang, and An Hoa; stable place identities for chapters, maps, and future albums.

- [The Birth of the 2/5 chapter notes](units/5th_marines/2nd_battalion/research/1965_CHAPTER.md)

- [1965 staff and company leadership](units/5th_marines/2nd_battalion/research/1965_LEADERSHIP.md)

- [1965 leadership photograph candidates](units/5th_marines/2nd_battalion/research/LEADERSHIP_PHOTO_CANDIDATES.md): first-pass online leads, identity evidence, rights status, and unresolved names; no photographs acquired or published.

- [Rebirth narrative and web research](units/5th_marines/2nd_battalion/research/1965_NARRATIVE.md)

- [1965 source alignment and model review status](units/5th_marines/2nd_battalion/research/1965_ALIGNMENT.md)
- [Editable chronology event records and workflow](units/5th_marines/2nd_battalion/research/events/README.md)
- [Next chapter outline: The Road to Vietnam](units/5th_marines/2nd_battalion/research/1966_ROAD_CHAPTER.md)

## Versioned OCR

An individual allowlist in [OCR_PUBLICATION.json](OCR_PUBLICATION.json) now tracks the raw July–December 1965 2/5 chronology OCR in its existing hierarchy. This is an exception to the general `_files/` exclusion above. Original bytes and page markers are preserved; Git text conversion is disabled for the file. Model/date metadata remain unknown rather than inferred. Other OCR, PDFs and local databases remain ignored. This does not change website ingestion. Agent and human corrections remain separate from immutable OCR.

- [Personnel schema and command history](units/5th_marines/2nd_battalion/research/PERSONNEL.md)

- [Active OCR versions and archive policy](ocr-runs/OCR_TRANSITION.md)
