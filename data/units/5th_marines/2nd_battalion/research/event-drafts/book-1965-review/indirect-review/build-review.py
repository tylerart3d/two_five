"""Bounded, research-only indirect-reference review; reads no PDFs."""
from pathlib import Path
import json, hashlib, re, xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parents[8]
OUT = Path(__file__).parent
SRC = ROOT/'data/shared/official_histories/_files/landing_buildup_1965'
sha = lambda b: hashlib.sha256(b).hexdigest()
checks=[]
for name in ['agent','manual']:
    path=ROOT/f'data/corrections/_files/{name}_corrections.json'
    raw=path.read_bytes()
    for fix in json.loads(raw):
        if not fix.get('archive_id'): raise ValueError('Unknown correction target')
        if fix['archive_id'] in ['usmc-history-1965-pcn19000307600','landing_buildup_1965','19000307600']:
            raise ValueError('Resolve applicable correction before extraction')
    checks.append({'layer':'human' if name=='manual' else 'agent','path':path.relative_to(ROOT).as_posix(),'sha256':sha(raw),'applicableCount':0})
xml=(SRC/'ia_ocr.xml').read_bytes(); scan=(SRC/'ia_scandata.xml').read_bytes()
metadata=ET.fromstring(scan); pages={}
for i,obj in enumerate(ET.fromstring(xml).findall('.//OBJECT')):
    file=obj.get('usemap'); leaf=int(file.rsplit('_',1)[1].split('.')[0])
    entry=metadata.find(f'.//pageData/page[@leafNum="{leaf}"]')
    label=entry.findtext('pageNumber') if entry is not None else None
    if label:
        text=re.sub(r'\s+',' ',' '.join(''.join(w.itertext()).strip() for w in obj.findall('.//WORD'))).strip()
        pages[label]={'printedPage':label,'objectIndex':i,'pageFile':file,'archiveLeaf':leaf,'text':text}
def anchor(page,phrase):
    p=pages[str(page)]; start=p['text'].index(phrase)
    return {k:v for k,v in p.items() if k!='text'} | {'sourceId':'usmc-history-1965-pcn19000307600','ocrXmlSha256':sha(xml),'scanMetadataSha256':sha(scan),'normalizedPageTextSha256':sha(p['text'].encode()),'normalizedCharacterStart':start,'normalizedCharacterEnd':start+len(phrase),'excerpt':phrase,'locatorType':'XML OBJECT and normalized WORD-text characters; not immutable byte offsets','officialPdfPage':None,'highlight':None,'ocrVersion':'Internet Archive DjVu XML WORD text; unchanged source','confidence':'agent text review; not scan verified'}
findings=[
 {'id':'lb65-indirect-april-command','kind':'event_proposal','title':'Wheeler assumes command of BLTs ashore','date':{'start':'1965-04-12','end':'1965-04-12','precision':'day'},'participants':[{'unit':'3d Marines / RLT-3','role':'command headquarters'},{'unit':'3/9 (returning predecessor of 2/5)','role':'subordinate BLT; established by accompanying roster'}],'summary':'The chronology says Wheeler assumed command of all BLTs ashore on April 12. The task organization places McPartlin’s 3/9 beneath 3d Marines. This concerns operational command, not redesignation of 3/9 or a new McPartlin appointment.','sources':[anchor(235,'12 Apr— The RLT-3 commander, Colonel Edwin B. Wheeler, and his headquarters arrived; he assumed command of all BLTs ashore.'),anchor(227,'3d Marines Col Edwin B. Wheeler 12Apr-6May 1/3 LtCol Herbert J. Bain 8Mar-27Apr LtCol William H. Lanagan, Jr 28Apr-6May 2/3 LtCol David A. Clement 10Apr-6May 3/9 LtCol Charles E. McPartlin, Jr 8Mar-6May')],'uncertainties':['Appendix describes Wheeler arriving with headquarters; narrative p25 says Wheeler himself arrived a week earlier. Event asserts assumption of command, not his personal arrival.']},
 {'id':'lb65-indirect-rlt-reorganization','kind':'context_proposal','title':'RLT reorganized as 3d Marines, Reinforced','date':{'start':'1965-04-18','end':'1965-04-18','precision':'day'},'summary':'Wheeler reorganized his RLT within the 9th MEB as 3d Marines, Reinforced. This is higher-headquarters context for the attached predecessor battalion, not a 3/9 name change.','sources':[anchor(26,'On the 18th, he reorganized his RLT under the 9th MEB structure as the 3d Marines, Reinforced.')],'uncertainties':['April follows surrounding narrative and p25; no independent 3/9 tasking is specified.']},
 {'id':'lb65-indirect-photo-a185897','kind':'photo_lead','title':'3/9 village photograph with unresolved battalion iteration','date':{'start':None,'end':None,'precision':'unknown'},'summary':'Index p256 directs 3/9 illustration to p120. Caption OCR reads 5d Battalion, 9th Marines and credit A185897. No date appears in caption; neighboring August narrative cannot establish image date. Do not assign to returning predecessor without image/archive metadata review.','sources':[anchor(120,'USMC Photo A185897 Marines from the 5d Battalion, 9th Marines move through a village south of Da Nang. The Vietnamese farmer continues with his hoeing, apparently ignoring the Marines.')],'uncertainties':['Raw 5d reading retained; 3d is an index-based interpretation, not an applied OCR correction.','Could depict replacement 3/9; identity unresolved.','No image inspection or rights verification.']},
 {'id':'lb65-indirect-command-diary-leads','kind':'source_lead','title':'March 1965 predecessor command diary in book notes','date':{'start':None,'end':None,'precision':'source-month'},'summary':'Book references identify March 1965 3/9 command diary, part II p5 and part III for landing account; chapter2 note11 also cites the March diary. Locate originals before making primary-source claims; these are bibliographic pointers only.','sources':[anchor(214,'20. 3/9ComdD,Mar65,ptII,p. 5. 21. Karch Intvw. 22. 3/9ComdD,Mar65,ptIII.'),anchor(214,'11. 3/9ComdD,Mar65.')],'uncertainties':['Book citation alone does not establish repository possession or Texas Tech identifier.']}
]
for f in findings: f.update({'visibility':'research_only','reviewStatus':'agent_text_review_needs_review','chapterIds':[]})
result={'schemaVersion':1,'sourceId':'usmc-history-1965-pcn19000307600','correctionChecks':checks,'findings':findings,'screening':{'allIndexedPagesSearchedFor':['Sheridan','McPartlin','3d Battalion 9th variants','2d Battalion 5th variants','Company L','3/9'],'indexPagesRead':[255,256,257,259],'adjoiningOrIndirectPagesRead':[6,9,14,24,25,26,28,36,37,120,214,227,235],'dispositions':[{'pages':[54,72,73,75,78,101,105],'finding':'Company L passages refer to other battalions; no assignment to L/3/9.'},{'pages':[211,226],'finding':'Company L Marine Support Battalion cryptologists are not L/3/9.'},{'pages':[227],'finding':'Sheridan only match in indexed OCR; existing roster proposal already covers it.'},{'pages':[220],'finding':'September3/9 OpO relates to replacement battalion; excluded.'},{'pages':[14],'finding':'1/3 concurrent airlift account; not a 3/9 movement.'},{'pages':[28],'finding':'April22 firefight names reconnaissance and Bain1/3; no 3/9 participation established.'},{'pages':[36,37],'finding':'III MAF command establishment is broad context; Le My operations identify Clement2/3.'}]},'limitations':['Bounded indirect-reference/index follow-up, not full semantic book audit.','Supplemental recovered203–210 not reviewed in this subtask.','No PDF visual checks or new OCR.','Imported correction files checked; no general correction resolver or guarantee against uncataloged fixes.','No records published or ingested into site.']}
(OUT/'findings.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(f'Wrote {len(findings)} research findings with exact normalized-page excerpt checks')

