// Personnel fields preserve the 2_5_roster contract; unknown values remain null.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
export function buildPersonnel(db,research) {
 const personnel=JSON.parse(readFileSync(join(research,'personnel.json'),'utf8'));
 const ledger={entries:['leadership-1965.json','leadership-1966.json'].flatMap(file=>JSON.parse(readFileSync(join(research,file),'utf8')).entries)};
 db.exec(`CREATE TABLE personnel(id TEXT PRIMARY KEY,name TEXT NOT NULL,identity_status TEXT NOT NULL);
 CREATE TABLE personnel_observations(
 id TEXT PRIMARY KEY,person_id TEXT NOT NULL REFERENCES personnel(id),effective_date TEXT NOT NULL,
 observation_kind TEXT NOT NULL CHECK(observation_kind IN ('appointment','snapshot')),role TEXT NOT NULL,
 grade TEXT,name TEXT NOT NULL,svcno TEXT,comp TEXT,mos TEXT,str_cat TEXT,rtd TEXT,audit1 TEXT,audit2 TEXT,audit3 TEXT,
 event_id TEXT NOT NULL REFERENCES events(id),document_id TEXT NOT NULL,anchor_id TEXT NOT NULL,
 record_json TEXT NOT NULL,FOREIGN KEY(document_id,anchor_id) REFERENCES source_anchors(document_id,anchor_id));
 CREATE INDEX personnel_history ON personnel_observations(person_id,effective_date);`);
 for(const p of personnel.people)db.prepare('INSERT INTO personnel VALUES(?,?,?)').run(p.id,p.name,p.identityStatus);
 const grades={LtCol:'O5',Maj:'O4',Capt:'O3','1stLt':'O2',GySgt:'E7'};
 for(const e of ledger.entries){
  const event=JSON.parse(db.prepare('SELECT record_json FROM events WHERE id=?').get(e.eventId).record_json);
  const source=event.sources.find(s=>s.anchorId===e.anchorId);
  if(!source||event.date.start!==e.date)throw Error('Invalid personnel source '+e.eventId);
  const p=personnel.people.find(p=>p.id===e.personId);if(!p)throw Error('Missing person '+e.personId);
  const row={grade:grades[e.name.split(' ')[0]]??null,name:p.name,svcno:null,comp:null,mos:null,str_cat:null,rtd:null,audit1:null,audit2:null,audit3:null};
  db.prepare('INSERT INTO personnel_observations VALUES('+Array(19).fill('?').join(',')+')').run(e.eventId+'-'+e.role+'-'+e.personId,e.personId,e.date,e.kind,e.role,...Object.values(row),e.eventId,source.documentId,e.anchorId,JSON.stringify({...e,fields:row,derivation:'Cited leadership record; roster-only fields unknown. Rank code mapped from explicit rank label.'}));
 }
 console.log(`Personnel: ${personnel.people.length} people, ${ledger.entries.length} dated observations`);
}
