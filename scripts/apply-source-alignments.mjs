import fs from 'node:fs';
import {createHash} from 'node:crypto';
const run=process.argv[2];if(!run)throw Error('Provide alignment run directory');
const paths=['data/units/5th_marines/2nd_battalion/research/1965_SOURCE_ANCHORS.json','data/units/5th_marines/2nd_battalion/research/1966_ROAD_SOURCE_ANCHORS.json','data/geography/landmarks/USS_PRINCETON_SOURCE_ANCHORS.json'];
const files=paths.map(path=>({path,value:JSON.parse(fs.readFileSync(path,'utf8'))}));
const report=[];for(const file of fs.readdirSync(run).filter(f=>f.endsWith('-proposals.json'))){const proposal=JSON.parse(fs.readFileSync(run+'/'+file));const request=JSON.parse(fs.readFileSync(run+'/'+file.replace('-proposals','-request')));const hash=createHash('sha256').update(fs.readFileSync(run+'/'+file.replace('-proposals','-response'))).digest('hex');const owner=files.find(f=>(Array.isArray(f.value)?f.value:[f.value]).some(d=>d.id===proposal.documentId));const doc=(Array.isArray(owner.value)?owner.value:[owner.value]).find(d=>d.id===proposal.documentId);if(doc.pdfSha256!==request.pdfSha256)throw Error('Hash mismatch');
for(const r of proposal.results){const a=doc.anchors.find(a=>a.id===r.id);if(!a||a.page!==proposal.page)throw Error('Unknown target');const valid=r.found && r.confidence>=.85 && Array.isArray(r.rect)&&r.rect.length===4&&r.rect.every(n=>Number.isFinite(n)&&n>=0)&&r.rect[2]>0&&r.rect[3]>0&&r.rect[0]+r.rect[2]<=1&&r.rect[1]+r.rect[3]<=1;
report.push({documentId:doc.id,page:a.page,anchorId:a.id,status:valid?'model-aligned; human review pending':'needs review',note:r.note,visibleText:r.visibleText,responseSha256:hash});if(!valid||a.rect)continue;
a.rect=r.rect;a.alignmentMethod='model';a.alignment='Located by M1 Qwen vision; normalized page coordinates validated. Human review pending. '+r.note;a.alignmentProvenance={model:request.model,date:'2026-09-12',pdfSha256:doc.pdfSha256,responseSha256:hash,run,confidence:r.confidence,reviewStatus:'agent-validated; human review pending'};
}}
for(const f of files)fs.writeFileSync(f.path,JSON.stringify(f.value,null,2)+'\n');
fs.mkdirSync('data/corrections/source-alignments',{recursive:true});fs.writeFileSync('data/corrections/source-alignments/2026-09-12.json',JSON.stringify(report,null,2)+'\n');console.log(report.length+' reviewed proposals; '+report.filter(r=>r.status.startsWith('model')).length+' model-aligned');
