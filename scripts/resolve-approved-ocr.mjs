import fs from 'node:fs';
import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex');
export function resolveApprovedOcr() {
 const registry=JSON.parse(fs.readFileSync('data/ocr-runs/ACTIVE_OCR.json'));
 const readings=[];
 for(const doc of registry.documents){
  if(!['1201048065','1201048066'].includes(doc.documentId))throw Error('Document needs its own reviewed transition checks');
  if(hash(fs.readFileSync('data/units/5th_marines/2nd_battalion/chronologies/_files/'+doc.documentId+'.pdf'))!==doc.pdfSha256)throw Error('PDF changed');
  const registered=new Set(doc.humanCorrections.map(c=>c.path));
  for(const f of fs.readdirSync('data/corrections/human').filter(f=>f.endsWith('.json'))){const path='data/corrections/human/'+f;const c=JSON.parse(fs.readFileSync(path));if(c.documentId===doc.documentId&&!registered.has(path))throw Error('New human correction requires OCR transition review: '+path);}
  const corrections=doc.humanCorrections.map(c=>{const bytes=fs.readFileSync(c.path);if(hash(bytes)!==c.sha256)throw Error('Human correction changed: '+c.path);return JSON.parse(bytes);});
  const pages=[];
  for(let page=1;page<=doc.pages.length;page++){
   const stem=doc.run+'/page-'+String(page).padStart(4,'0');const provenance=JSON.parse(fs.readFileSync(stem+'-provenance.json'));const bytes=fs.readFileSync(stem+'.txt');
   if(hash(bytes)!==doc.pages.find(p=>p.page===page)?.sha256||hash(bytes)!==provenance.textSha256||provenance.pdfSha256!==doc.pdfSha256)throw Error('OCR/PDF version mismatch');
   let text=bytes.toString('utf8');const applied=[];
   for(const c of corrections.filter(c=>c.status==='human-confirmed'&&c.page===page&&c.ocrSha256===provenance.textSha256).sort((a,b)=>b.ocrStart-a.ocrStart)){
    if(c.originalReading===c.replacement)continue;
    if(!c.originalReading||!c.replacement||text.slice(c.ocrStart,c.ocrEnd)!==c.originalReading)throw Error('Human span mismatch: '+c.id);
    text=text.slice(0,c.ocrStart)+c.replacement+text.slice(c.ocrEnd);applied.push(c.id);
   }
   // The reviewed transition already incorporates these older-source corrections in Qwen.
   const normalized=text.toUpperCase().replace(/[^A-Z0-9]/g,'');
   const expected=doc.documentId==='1201048066' ? ({1:['CINCPACFL 180547Z','COMPHIBPAC 182117Z','CGFMFPAC 212011Z','CGFMFPAC 190257Z','172006Z','302357Z','111900Z','110700Z','1480358Z','0028-66'],5:['93% of its operating stocks','98% of its mount out'],7:['010001U'],8:['WYZSMIRSKI','H K NOE','ENCLOSURE 1']}[page]??[]) : page===1?['transferred to new commands','During September a Combined Fire Support Exercise','TENDERTOUCH','was implemented','Jul-Dec 65']:page===2?['H T WINSTON','D H HERING','ENCLOSURE 1']:['W W JEFFERY','L W FAHRNI','R D HUGHES','TENDERTOUCH','ENCLOSURE 1'];
   for(const phrase of expected)if(!normalized.includes(phrase.toUpperCase().replace(/[^A-Z0-9]/g,'')))throw Error('Approved reading missing: '+phrase);
   pages.push({page,text,rawSha256:provenance.textSha256,resolvedSha256:hash(text),appliedHumanCorrections:applied});
  }
  readings.push({...doc,unresolvedCorrections:corrections.filter(c=>c.status!=='human-confirmed').map(c=>({id:c.id,page:c.page,originalReading:c.originalReading,candidates:c.candidates,status:c.status})),pages});
 }
 fs.mkdirSync('data/ocr-runs/approved-reading-copies',{recursive:true});
 for(const r of readings)fs.writeFileSync('data/ocr-runs/approved-reading-copies/'+r.documentId+'.json',JSON.stringify(r,null,2)+'\n');
 return readings;
}
