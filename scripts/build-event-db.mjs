import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync,mkdirSync,renameSync,existsSync,unlinkSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const research=join(root,'data/units/5th_marines/2nd_battalion/research');
const parse=path=>{const raw=readFileSync(path,'utf8');if(path.endsWith('.json'))return {record:JSON.parse(raw),sha:createHash('sha256').update(raw).digest('hex')};const match=raw.match(/```json\s*([\s\S]*?)```/);if(!match)throw Error(`Missing record ${path}`);return {record:JSON.parse(match[1]),sha:createHash('sha256').update(raw).digest('hex')};};
const records=folder=>readdirSync(join(research,folder)).filter(n=>n.endsWith('.json')).map(n=>({...parse(join(research,folder,n)),path:`data/units/5th_marines/2nd_battalion/research/${folder}/${n}`}));
const chapters=records('chapters'),events=records('events');
const book=parse(join(research,'LANDING_BUILDUP_1965_EXTRACTIONS.md')).record;
const sources=[parse('data/geography/landmarks/USS_PRINCETON_SOURCE_ANCHORS.json').record,parse(join(research,'1965_SOURCE_ANCHORS.json')).record,...parse(join(research,'1966_ROAD_SOURCE_ANCHORS.json')).record];
const dir=join(root,'data/local');mkdirSync(dir,{recursive:true});const tmp=join(dir,'events.build.sqlite'),dest=join(dir,'events.sqlite');
if(existsSync(tmp))unlinkSync(tmp);
const db=new DatabaseSync(tmp);
try {
 db.exec(`PRAGMA foreign_keys=ON;
 CREATE TABLE chapters(id TEXT PRIMARY KEY,title TEXT NOT NULL,date_start TEXT NOT NULL,date_end TEXT NOT NULL);
 CREATE TABLE events(id TEXT PRIMARY KEY,title TEXT NOT NULL,date_start TEXT NOT NULL,date_end TEXT,precision TEXT NOT NULL,kind TEXT NOT NULL,category TEXT,map_destination TEXT,record_json TEXT NOT NULL,record_path TEXT NOT NULL,record_sha256 TEXT NOT NULL);
 CREATE TABLE event_chapters(event_id TEXT REFERENCES events(id),chapter_id TEXT REFERENCES chapters(id),PRIMARY KEY(event_id,chapter_id));
 CREATE TABLE documents(id TEXT PRIMARY KEY,record_json TEXT NOT NULL);
 CREATE TABLE source_anchors(document_id TEXT REFERENCES documents(id),anchor_id TEXT,record_json TEXT NOT NULL,PRIMARY KEY(document_id,anchor_id));
 CREATE TABLE event_sources(event_id TEXT REFERENCES events(id),document_id TEXT,anchor_id TEXT,PRIMARY KEY(event_id,document_id,anchor_id),FOREIGN KEY(document_id,anchor_id) REFERENCES source_anchors(document_id,anchor_id));
 CREATE TABLE research_assertions(id TEXT PRIMARY KEY,source_id TEXT NOT NULL,record_json TEXT NOT NULL,review_status TEXT NOT NULL);
 CREATE TABLE research_leads(id TEXT PRIMARY KEY,source_id TEXT NOT NULL,category TEXT NOT NULL,printed_page TEXT,record_json TEXT NOT NULL,review_status TEXT NOT NULL);
 CREATE INDEX event_dates ON events(date_start,date_end);
 BEGIN;`);
 for(const {record:c} of chapters)db.prepare('INSERT INTO chapters VALUES(?,?,?,?)').run(c.id,c.title,c.dateStart,c.dateEnd);
 for(const d of sources){db.prepare('INSERT INTO documents VALUES(?,?)').run(d.id,JSON.stringify(d));for(const a of d.anchors)db.prepare('INSERT INTO source_anchors VALUES(?,?,?)').run(d.id,a.id,JSON.stringify(a));}
 for(const {record:e,path,sha} of events){
  if(!Array.isArray(e.chapterIds)||!e.sources?.length)throw Error(`Missing chapter tags or citations: ${e.id}`);
  db.prepare('INSERT INTO events VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(e.id,e.title,e.date.start,e.date.end,e.date.precision,e.kind,e.category??null,e.mapDestination??null,JSON.stringify(e),path,sha);
  for(const chapter of e.chapterIds)db.prepare('INSERT INTO event_chapters VALUES(?,?)').run(e.id,chapter);
  for(const s of e.sources)db.prepare('INSERT INTO event_sources VALUES(?,?,?)').run(e.id,s.documentId,s.anchorId);
 }
 for(const a of book.assertions)db.prepare('INSERT INTO research_assertions VALUES(?,?,?,?)').run(a.id,book.source_id,JSON.stringify({...a,ocrSha256:book.ocr_sha256}),a.status);
 for(const [index,lead] of book.candidate_hits.entries())db.prepare('INSERT INTO research_leads VALUES(?,?,?,?,?,?)').run(`LB65-LEAD-${String(index+1).padStart(3,'0')}`,book.source_id,lead.category,lead.printed_page_label??null,JSON.stringify({...lead,ocrXmlSha256:book.ocr_xml_sha256}),lead.status);
 db.exec('COMMIT');
 if(db.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('SQLite integrity failed');
 console.log(db.prepare("SELECT chapter_id,COUNT(*) AS dated_events FROM event_chapters JOIN events ON events.id=event_id WHERE kind!='location-context' AND COALESCE(json_extract(record_json,'$.timelineHidden'),0)=0 GROUP BY chapter_id").all());
}finally{db.close();}
renameSync(tmp,dest);
console.log(`Built ${events.length} event/context records, ${book.assertions.length} book assertions and ${book.candidate_hits.length} book leads: ${dest}`);

