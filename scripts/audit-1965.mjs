// Research-only audit. Never writes to the site's events/ directory.
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const research=join(root,'data/units/5th_marines/2nd_battalion/research');
const out=join(research,'event-drafts/audit-1965');mkdirSync(out,{recursive:true});
const save=(name,value)=>writeFileSync(join(out,name),JSON.stringify(value,null,2)+'\n');
const hash=b=>createHash('sha256').update(b).digest('hex');
const original=readFileSync(join(research,'../chronologies/_files/1201048065_vision_ocr.txt'));
const raw=original.toString('utf8');
const correctionLayers=['agent','manual'].map(layer=>{
 const bytes=readFileSync(join(root,`data/corrections/_files/${layer}_corrections.json`));
 const records=JSON.parse(bytes);const applicable=records.filter(c=>c.archive_id==='1201048065');
 // Fail closed rather than bypass future corrections. A general resolver is separate work.
 if(applicable.length)throw Error(`Resolve ${layer} corrections for 1201048065 before rebuilding this audit`);
 return {layer:layer==='manual'?'human':'agent',sha256:hash(bytes),applicableCount:0};
});
const existing=readdirSync(join(research,'events')).filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync(join(research,'events',n),'utf8')));
const assertions=[],events=[],ledger=[];
function anchor(id,start,end,page){
 const a={id,documentId:'1201048065',ocrSha256:hash(original),ocrUtf8ByteStart:Buffer.byteLength(raw.slice(0,start)),ocrUtf8ByteEndExclusive:Buffer.byteLength(raw.slice(0,end)),excerpt:raw.slice(start,end),pdfPage:page,printedPageLabel:`C-14-${page}`,highlight:null,reviewStatus:'needs_review',method:'Existing OCR; no PDF inspection or new OCR; source-specific correction check found no applicable fixes.'};
 if(original.subarray(a.ocrUtf8ByteStart,a.ocrUtf8ByteEndExclusive).toString('utf8')!==a.excerpt)throw Error(id);
 assertions.push(a);return a;
}
function draft(id,title,date,category,a,summary,related=[],notes=[]){
 const e={schemaVersion:1,id,title,visibility:'research_only',reviewStatus:'needs_review',chapterIds:['rebirth-1965'],date,kind:category==='context'?'context':'event',category,units:['2/5'],people:[],locations:[],sources:[{documentId:a.documentId,anchorId:a.id}],paragraphs:[[{text:summary,source:0}]],notes,relatedExistingEventIds:related,researchStatus:'OCR-backed draft; not human verified; not approved for site inclusion.',revisions:[{date:'2026-09-07',note:'Source passage filed in research-only coverage audit; original OCR unchanged.'}]};
 events.push(e);save(id+'.json',e);return e;
}
const month={JULY:'07',AUGUST:'08',SEPTEMBER:'09',NOVEMBER:'11',DECEMBER:'12'};
const matches=[...raw.matchAll(/^(\d{1,2})(?:-(\d{1,2}))? (JULY|AUGUST|SEPTEMBER|NOVEMBER|DECEMBER) 1965[ \t]+/gm)];
const titles=['3/9 redesignated 2/5 under McPartlin','Battalion returns to San Diego','Command relief and eight billet assignments','Catt becomes CO; Ram becomes XO','SEATO combined fire-support demonstration','Bulger becomes XO; Ram takes H&S','Waller becomes CO; Catt becomes S-3','Pape becomes S-3; Catt transfers out','S-2 assignment and Golf command relief','Foxtrot command relief','Golf reinforced platoon participates in TIMBERTORCH','H&S command relief; Ram transfers out','Helicopter PHIBLEX from USS Princeton','Golf command relief; Garrett transfers out','Burns relieves Parenti at H&S','December command and staff changes and transfers','Moore relieves Slocum as S-2','Uskurait becomes CO; Waller XO; Pape S-3'];
if(matches.length!==titles.length)throw Error(`Unexpected chronology entries ${matches.length}`);
for(const [i,m] of matches.entries()){
 const end=matches[i+1]?.index??raw.length;const page=m.index>raw.indexOf('[Page 3]')?3:2;
 const a=anchor(`CC65-ENTRY-${i+1}`,m.index,end,page);
 const start=`1965-${month[m[3]]}-${m[1].padStart(2,'0')}`,finish=`1965-${month[m[3]]}-${(m[2]??m[1]).padStart(2,'0')}`;
 const related=existing.filter(e=>e.sources.some(s=>s.documentId==='1201048065')&&e.date.start===start&&e.kind!=='location-context').map(e=>e.id);
 const clean=m.input.slice(m.index+m[0].length,end).replace(/\[Page \d\]|DECLASSIFIED|UNCLASSIFIED|ENCLOSURE \(4\)|C-14-\d|DATE\s+EVENT/g,'').replace(/\s+/g,' ').trim();
 const category=[4,10,12].includes(i)?'training':i===1?'movement':i===0?'organization':'leadership';
 const e=draft(`cc65-${start}-${i+1}`,titles[i],{label:m[0].trim(),start,end:finish,precision:m[2]?'range':'day'},category,a,clean,related,['Description is whitespace-normalized OCR, not a corrected transcription. Same-date billet changes remain grouped; source excerpt retains all named actions.']);
 ledger.push({sourceAnchor:a.id,disposition:related.length?'existing_event_detail_reconciliation':'new_event_draft',draftId:e.id,existingEventIds:related});
}
function passage(id,from,to,title,date,category,summary,related=[],notes=[]){
 const start=raw.indexOf(from);if(start<0)throw Error(from);const end=raw.indexOf(to,start);if(end<0)throw Error(to);
 const a=anchor(id,start,end,1);const e=draft(id.toLowerCase(),title,date,category,a,summary,related,notes);ledger.push({sourceAnchor:a.id,disposition:'context_or_new_detail',draftId:e.id,existingEventIds:related});
}
const unknown={label:'After return; precise transfer dates not stated',start:'1965-08-08',end:null,precision:'after'};
passage('CC65-TRANSFERS','The majority of officers','On 16 September','Majority of returning personnel transferred within the division',unknown,'personnel','After the return to San Diego, the majority of officers and men were transferred to other units throughout the division. No individual dates or numerical total are given.',['return-san-diego']);
passage('CC65-SPECIAL-TRAINING','On 15 November 1965','                                                              UNCLASSIFIED','RLT-5 special training program begins',{label:'15 Nov 1965',start:'1965-11-15',end:'1965-11-15',precision:'day'},'training','The RLT-5 special training program began on 15 November. Training was very limited by school TAD, higher-authority commitments, and approximately 50% on-board strength.');
passage('CC65-ROSTER','IV.      ASSIGNMENTS','                        COMMANDER','Battalion billet roster recorded as of December 20',{label:'As of 20 Dec 1965',start:'1965-12-20',end:'1965-12-20',precision:'record-date'},'personnel','Roster: CO R.H. Uskurait; XO L.W.T. Waller II; S-1 D.R. West; S-2 A.H. Moore; S-3 R.A. Pape; S-4 H.T. Winston; H&S R.D. Hughes; Echo D.E. Marcum; Foxtrot R.A. Hickethier; Golf J.F. O’Rourke; Hotel J.J. Doherty.',['doherty-december','command-december-20'],['Roster is an observation, not eleven appointment dates. November 26 names R.D. Burns at H&S; this roster reads R.D. Hughes. No intervening relief is recorded. S-4 also differs from August; transition date unknown. Preserve OCR names pending review.']);
passage('CC65-ORGANIZATION','I.       ATTACHMENTS','IV.      ASSIGNMENTS','Report location, attachments and reporting period',{label:'July–December 1965 report context',start:'1965-07-01',end:'1965-12-31',precision:'chapter-context'},'context','The report lists no attachments and places the battalion at Camp Margarita, Camp Pendleton, California. Reporting period: July 1–December 31, 1965.',['camp-margarita'],['The report location does not prove uninterrupted presence there throughout the reporting period.']);
// Retain the complete narrative, including details not repeated in dated entries.
passage('CC65-NARRATIVE','         On 8 August 1965','                                                              UNCLASSIFIED','Commander narrative summary',{label:'July–December 1965 summary',start:'1965-07-01',end:'1965-12-31',precision:'chapter-context'},'context','The narrative repeats the return, SEATO demonstration, Golf aggressor exercise, and Princeton PHIBLEX. It adds post-return transfers, limited training, and understrength companies.',['return-san-diego','november-exercise','princeton-exercise'],['Narrative says mid-November PHIBLEX; detailed entry gives November 19. Approximately 50% battalion strength in the narrative differs in scope from approximately 40% participating company manning in the PHIBLEX entry. Keep these distinct.']);
save('source-assertions.json',{schemaVersion:1,visibility:'research_only',documentId:'1201048065',correctionLayers,assertions});
save('coverage.json',{schemaVersion:1,visibility:'research_only',documentId:'1201048065',ocrSha256:hash(original),status:'OCR passage inventory complete; historical review and atomic-event reconciliation pending',dateEntryCount:matches.length,ledger,limits:['Headings and classification markings are metadata.','Grouped entries retain multiple actions; they are not a count of atomic historical events.','No original PDF inspected. No general correction resolver implemented; audit fails if applicable corrections appear.']});
// Reuse existing book assertions, preserving their evidence and uncertainty.
const b=JSON.parse(readFileSync(join(research,'LANDING_BUILDUP_1965_EXTRACTIONS.md'),'utf8').match(/```json\s*([\s\S]*?)```/)[1]);
save('book-assertions.json',{schemaVersion:1,visibility:'research_only',sourceId:b.source_id,ocrSha256:b.ocr_sha256,assertions:b.assertions,method:'Reuses existing assertions unchanged; no fresh OCR extraction or correction bypass.'});
const dispositions={
 'LB65-001':{type:'context',relatedExistingEventIds:['redesignation'],note:'Outward-bound 2/5 became replacement 3/9. Do not assign its end-June arrival to returning 3/9. Chronology separately dates returning battalion redesignation July 19.'},
 'LB65-002':{type:'personnel_background',relatedExistingEventIds:['command-august','redesignation'],note:'McPartlin’s 1932 enlistment, 1942 commission, WWII/Korea combat; not evidence of 3/9 returning from Korea in 1965.'},
 'LB65-003':{type:'predecessor_event_needs_review',relatedExistingEventIds:['return-san-diego'],note:'Page 49 states June 11 relief and return to Okinawa. June 17 appendix claim must remain separate; no invented resolution.'},
 'LB65-004':{type:'regimental_context',relatedExistingEventIds:[],note:'5th Marines remaining at Pendleton is regimental context, not an independent location observation of every subordinate unit.'},
 'LB65-005':{type:'replacement_system_context',relatedExistingEventIds:[],note:'MIX-MASTER concerns units in Vietnam. Do not create a 2/5 Pendleton participation event.'},
 'LB65-006':{type:'identity_and_date_conflict',relatedExistingEventIds:['redesignation'],note:'McPartlin command period and June 17 departure apply to predecessor; later Tunnell/Taylor command periods belong to replacement 3/9.'}
};
save('book-coverage.json',{schemaVersion:1,visibility:'research_only',status:'Incomplete full-book review',assertions:b.assertions.map(a=>({sourceAssertionId:a.id,...dispositions[a.id]})),candidates:b.candidate_hits.map((c,i)=>({id:`LB65-LEAD-${String(i+1).padStart(3,'0')}`,source:c,status:'pending_full_passage_and_identity_review'})),outstanding:['Review all 89 search candidates against full passages, not snippets.','Audit recovered pages 203–210 and indirect/name variants.','Resolve human > agent > OCR reading layers before new extraction.','Reconcile relief/departure dates without collapsing distinct actions.']});
console.log(`Wrote ${events.length} research draft records, ${assertions.length} byte-verified assertions, ${matches.length} dated entry mappings, and a separate book reconciliation ledger. No site writes.`);
