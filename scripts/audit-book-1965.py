"""Research-only review of existing book OCR. No PDF access or new OCR."""
from pathlib import Path
import json, re, hashlib, xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parents[1]
R = ROOT/'data/units/5th_marines/2nd_battalion/research'
OUT = R/'event-drafts/book-1965-review'
OUT.mkdir(parents=True, exist_ok=True)
S = ROOT/'data/shared/official_histories/_files/landing_buildup_1965'
sha = lambda b: hashlib.sha256(b).hexdigest()
save = lambda name, value: (OUT/name).write_text(json.dumps(value, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
book = json.loads(re.search(r'```json\s*([\s\S]*?)```', (R/'LANDING_BUILDUP_1965_EXTRACTIONS.md').read_text(encoding='utf-8')).group(1))
layers = []
for name in ['agent','manual']:
    path = ROOT/f'data/corrections/_files/{name}_corrections.json'
    raw = path.read_bytes()
    fixes = json.loads(raw)
    # Known imported correction files use archive_id. Unknown layouts fail closed.
    for fix in fixes:
        if not fix.get('archive_id'): raise ValueError('Unrecognized correction target; resolve before audit')
        if fix['archive_id'] in [book['source_id'],'landing_buildup_1965','19000307600']:
            raise ValueError('Book correction requires resolution before this audit')
    layers.append({'layer':'human' if name=='manual' else 'agent','sha256':sha(raw),'applicableCount':0})
xml = (S/'ia_ocr.xml').read_bytes()
scanbytes = (S/'ia_scandata.xml').read_bytes()
scan = ET.fromstring(scanbytes)
pages = {}
for i,obj in enumerate(ET.fromstring(xml).findall('.//OBJECT')):
    file = obj.get('usemap'); leaf = int(file.rsplit('_',1)[1].split('.')[0])
    entry = scan.find(f'.//pageData/page[@leafNum="{leaf}"]')
    label = entry.findtext('pageNumber') if entry is not None else None
    if label:
        pages[label] = {'text': re.sub(r'\s+',' ',' '.join(''.join(w.itertext()).strip() for w in obj.findall('.//WORD'))).strip(), 'objectIndex':i, 'pageFile':file, 'leaf':leaf}

# Editorial conclusions after reading passages; no heuristic promotion to site.
company = {'25':('H/2/3','Clement and 2/3 landing context'), '56':('H/2/9','Explicit photo caption'),
 '71':('H/2/4','Fisher battalion STARLITE plan'), '72':('H/2/4','STARLITE landing sequence'),
 **{str(n):('H/2/4','Jenkins company during STARLITE; explicit confirmation in Paul citation p.243') for n in range(75,79)},
 '91':('H/2/7','Utter battalion, STOMP context pp.90–91'), '108':('H/2/9 and H/2/7','Footnote distinguishes attached H/2/9 from H/2/7 on mortar security'),
 '160':('H/2/3','Clement/Moore MIDNIGHT context pp.159–160'), '243':('H/2/4','Explicit Joe Paul citation'), '244':('H/2/9','Explicit Barnum citation')}
ledger=[]
for i,c in enumerate(book['candidate_hits']):
    page=c['printed_page_label']; category=c['category']; note=''; disposition='retained_predecessor_evidence'
    if category=='company_lead_unassigned':
        unit,note=company[page]; disposition='excluded_other_company'; note=f'{unit}: {note}. Not Hotel 2/5.'
    elif page in ['61','65','71','126','129','140','238','220']:
        disposition='excluded_replacement_3_9'; note='Later 1965 replacement battalion or its source notes; not the returning McPartlin battalion.'
    elif page=='55':
        disposition='designation_exchange_context'; note='Outward-bound 2/5 became new 3/9; retain distinction from returning 3/9. No June arrival assigned to returning battalion.'
    elif page in ['70','117','228']:
        disposition='broader_context'; note='Regimental/leadership or replacement-system background; no direct 2/5 participation established.'
    elif page in ['255','257']:
        disposition='index_cross_reference'; note='Navigation aid, not independent event evidence.'
    elif page in ['49','229','237']:
        disposition='identity_or_date_reconciliation'; note='June 11 relief claim versus June 17 relief/departure; appendix also contains replacement commanders. Preserve distinct claims.'
    ledger.append({'id':f'LB65-LEAD-{i+1:03}','printedPage':page,'category':category,'match':c['match'],'disposition':disposition,'note':note,'reviewStatus':'agent_text_review; not human/PDF verified','sourceCandidate':c})
save('candidate-review.json',{'sourceId':book['source_id'],'visibility':'research_only','correctionChecks':layers,'candidates':ledger})

# Each entry is a research proposal, with supporting complete page text kept separately.
# Dates are intentionally null when the passage supplies no exact event date.
items=[
 ('company-l-roster','Company L roster under Marine Unit Vietnam','1965-01-01','1965-01-23','record-period',['227'],'The command appendix lists Company L, 3/9, under Captain John J. Sheridan for January 1–23. This is a roster interval, not an inferred appointment date.','personnel'),
 ('afloat','3/9 embarked with the Seventh Fleet',None,None,'early-year',['3'],'BLT 3/9 was afloat in the South China Sea from the beginning of 1965 and part of the two-BLT 9th MEB under Karch on January 22.','context'),
 ('alert-relaxed','3/9 returns to normal operations','1965-01-23','1965-01-23','day',['3'],'The approved relaxation of 9th MEB alert status returned BLT 3/9 to normal operations.','organization'),
 ('off-da-nang','BLT 3/9 reaches station off Da Nang','1965-01-29','1965-01-29','day',['3'],'Embarked in Task Group 76.7, BLT 3/9 reached its assigned station off Da Nang.','movement'),
 ('subic','BLTs depart for Subic Bay','1965-01-31','1965-01-31','day',['4'],'BLTs 1/9 and 3/9 departed for Subic Bay; 3/9 remained on 72-hour reaction time for Vietnam.','movement'),
 ('february-station','BLT 3/9 back off Da Nang',None,None,'by-late-february',['7','10'],'The book places BLT 3/9 back at its offshore station by the February discussions; page 10 describes it as there since early February. Exact return date not stated.','movement'),
 ('beach-recon','Reconnaissance selects RED Beach 2','1965-02-23','1965-02-27','range',['172'],'1st Force Reconnaissance Subunit 1 and UDT 12 reconnoitered RED Beaches 1 and 2 from USS Cook. RED Beach 2 was selected for BLT 3/9. This was supporting-unit activity, not a 3/9 patrol.','supporting-context'),
 ('warning-order','Warning order for administrative landing','1965-03-04','1965-03-04','day',['10'],'Following the March 3 reconnaissance, Karch issued the next-day warning order to McPartlin: land at RED Beach 2 and move along Route 1 to airfield defensive positions.','planning'),
 ('landing-plan','Traffic and landing arrangements','1965-03-07','1965-03-07','day',['11'],'Karch told McPartlin Route 1 would close to civilians for 36 hours. The plan set H-hour at 0800 on March 8 and unloading completion at 1600 March 9. These are planned times, not actual completion claims. Companies I and K were to secure the beach; M was reserve.','planning'),
 ('landing','BLT 3/9 lands at RED Beach 2','1965-03-08','1965-03-08','day',['10','11','12','235'],'Heavy seas delayed H-hour from 0800 to 0900. The first assault wave landed three minutes after the revised hour, and the final assault wave at 0918. Company L began moving inland at 0945; I, artillery and K followed, while M secured unloading.','movement'),
 ('unloading','9th MEB general unloading completed','1965-03-12','1965-03-12','day',['15'],'General unloading of the 9th MEB was completed on March 12. After a March 8–9 firefight between VC and Vietnamese troops north of RED Beach, the amphibious ships shifted anchorage toward the Song Han mouth; unloading then continued upriver. This is brigade-level logistical context, not a claim that each 3/9 company remained aboard until March 12.','supporting-context'),
 ('recon-attachment','Reconnaissance platoon attached to BLT 3/9','1965-03-08','1965-04-13','range',['174'],'A platoon of Company A, 3d Reconnaissance Battalion, landed attached to BLT 3/9. On April 13, the in-country reconnaissance platoons were regrouped as a new Company D.','organization'),
 ('strength','BLT 3/9 strength recorded','1965-03-23','1965-03-23','record-date',['235'],'The March 23 brigade composition lists BLT 3/9 at 1,115. This is a reported strength snapshot, not a personnel-join event.','personnel'),
 ('logistics','3/9 rations support the brigade',None,None,'first-weeks',['16','17'],'The initial brigade supply crisis was met with the 15 days of rations landed with McPartlin’s battalion and an emergency airlift from Saigon. This describes brigade logistics, not 15 days without resupply.','logistics'),
 ('hills','3/9 takes hill-mass defensive positions',None,None,'first-weeks',['18'],'McPartlin’s 3/9 moved to hill mass 268–327 west of the airfield, protecting the base and Battery B of the LAAM battalion on Hill 327. Exact move date is not supplied.','movement'),
 ('patrols','Patrols into hills west of Da Nang',None,None,'first-weeks',['19'],'The account says McPartlin’s patrols west into the hills encountered no Viet Cong during this initial period. Do not generalize beyond the passage.','patrol'),
 ('friendly-fire','Listening-post fatal shooting',None,None,'unknown',['19'],'The book describes two men mortally wounded by their remaining listening-post partner after approaching from behind. Names, date and precise company are unstated; battalion attribution from surrounding McPartlin passage remains a review issue.','casualty'),
 ('pf-checkpoint','Attempt to establish a joint PF checkpoint',None,None,'first-weeks',['19','20'],'McPartlin’s battalion attempted a joint checkpoint with Popular Forces; the account says the PF personnel arrived and then left. Preserve this as an attributed account.','coordination'),
 ('arvn-fire','Inadvertent fire from nearby ARVN training',None,None,'first-weeks',['20'],'The book reports ARVN recruits southeast of the battalion inadvertently firing toward Marine positions. Exact dates are not stated.','incident'),
 ('chu-lai-security','Company K helps secure Chu Lai beach','1965-05-06','1965-05-06','day',['33'],'Company K, 3/9, came from Da Nang to reinforce ARVN 2d Division troops securing the Chu Lai landing area. Do not infer participation by the whole battalion.','movement'),
 ('relief','1/9 relieves the predecessor 3/9',None,None,'disputed',['49','229','237'],'Page 49 dates arrival/relief to June 11; page 237 dates relief to June 17, and page 229 gives June 17 departure. Keep both date assertions rather than manufacture a six-day operation.','movement'),
 ('mcpartlin-command','McPartlin command roster intervals','1965-03-08','1965-06-17','record-period',['227','229'],'Appendices list McPartlin for March 8–May 6 and May 6–June 17 under different task-organization sections. May 6 is not evidence of a new appointment.','personnel')]
assertions=[]
used=sorted({p for x in items for p in x[5]},key=int)
for label in used:
    p=pages[label]
    assertions.append({'id':'LB65-PAGE-'+label,'sourceId':book['source_id'],'printedPage':label,'officialPdfPage':None,'highlight':None,'ocrXmlSha256':sha(xml),'scanMetadataSha256':sha(scanbytes),'objectIndex':p['objectIndex'],'pageFile':p['pageFile'],'archiveLeaf':p['leaf'],'text':p['text'],'locatorType':'XML OBJECT index and pageFile; whitespace-normalized WORD text, not raw UTF-8 offsets','textSha256':sha(p['text'].encode()),'reviewStatus':'agent_text_review; no visual verification'})
for key,title,start,end,precision,refs,summary,category in items:
    event={'schemaVersion':1,'id':'lb65-'+key,'title':title,'visibility':'research_only','reviewStatus':'needs_review','chapterIds':[], 'proposedChapterIds':['rebirth-1965'],'placementNote':'Pre-July predecessor/background material; chapter coverage must be deliberately decided before publication.','date':{'label':precision if not start else start,'start':start,'end':end,'precision':precision},'kind':'context' if 'context' in category else 'event','category':category,'units':['3/9 (predecessor of returning 2/5)'] if category!='supporting-context' else ['1st Force Reconnaissance Company, Subunit 1','UDT 12'],'people':[],'locations':[],'sources':[{'documentId':book['source_id'],'anchorId':'LB65-PAGE-'+p} for p in refs],'paragraphs':[[{'text':summary}]],'notes':['Source references support the whole proposal; normalized OCR is not a human correction.'], 'researchStatus':'Draft, text-based source review only','revisions':[{'date':'2026-09-07','note':'Filed during 1965 book candidate audit; not published.'}]}
    # Structured participants distinguish involvement from contextual mention.
    event['participants']=[{'unit':'3/9','identity':'returning predecessor of 2/5','role':'subject','confidence':'text-supported'}]
    if key=='company-l-roster':
        event['participants']=[{'unit':'L/3/9','role':'subject','confidence':'explicit'}]
        event['people']=['Captain John J. Sheridan']
    if key=='chu-lai-security':
        event['participants']=[{'unit':'K/3/9','role':'additional beach security','confidence':'explicit'},{'unit':'ARVN 2d Division elements','role':'existing beach security','confidence':'explicit'}]
    if key=='beach-recon':
        event['participants']=[{'unit':'1st Force Reconnaissance Company, Subunit 1','role':'reconnaissance','confidence':'explicit'},{'unit':'UDT 12','role':'reconnaissance','confidence':'explicit'},{'unit':'BLT 3/9','role':'intended landing force; beneficiary','confidence':'explicit'}]
    if key=='unloading':
        event['units']=['9th MEB'];event['participants']=[{'unit':'9th MEB','role':'subject','confidence':'explicit'},{'unit':'BLT 3/9','role':'subordinate unit; context only','confidence':'contextual'}]
    if key=='recon-attachment':
        event['participants']=[{'unit':'BLT 3/9','role':'receiving landing team','confidence':'explicit'},{'unit':'Company A, 3d Reconnaissance Battalion (one platoon)','role':'attached','confidence':'explicit'}]
    if key=='landing':
        event['participants'] += [{'unit':f'{c}/3/9','role':role,'confidence':'explicit'} for c,role in [('L','first inland echelon'),('I','motor march'),('K','rear guard of motor march'),('M','beach security')]]
        event['timeAssertions']=[{'time':'08:00','type':'initial planned H-hour'},{'time':'09:00','type':'revised planned H-hour'},{'time':'09:03','type':'first wave; derived from three minutes late'},{'time':'09:18','type':'final assault wave'},{'time':'09:45','type':'Company L begins inland movement'}]
        event['notes'].append('Times as reported locally; no UTC offset established. Do not treat plans as actual actions.')
    if key=='friendly-fire':
        event['units']=[];event['participants']=[{'unit':'3/9','role':'possible battalion attribution','confidence':'uncertain; narrative context only'}]
        event['notes'].append('No confirmed participant assignment until corroborated. The surrounding discussion covers both infantry battalions.')
    if key=='warning-order':event['date']['derivation']='March 4 inferred from the next day after explicit March 3; not a directly printed date in this sentence.'
    if key=='relief':event['dateAssertions']=[{'date':'1965-06-11','action':'arrival and relief','sourceAnchor':'LB65-PAGE-49'},{'date':'1965-06-17','action':'relief','sourceAnchor':'LB65-PAGE-237'},{'date':'1965-06-17','action':'departure','sourceAnchor':'LB65-PAGE-229'}]
    save(event['id']+'.json',event)
save('source-assertions.json',{'visibility':'research_only','correctionChecks':layers,'assertions':assertions})
save('photo-leads.json',{'visibility':'research_only','reviewStatus':'caption reviewed; image not inspected','photos':[{'printedPage':p,'photoId':i,'description':d,'relationship':'predecessor 3/9; not yet 2/5 designation','rightsReview':'Check individual image credit before publication'} for p,i,d in [('10','A183676','BLT 3/9 landing at RED Beach 2 on March 8'),('11','A183798','BLT 3/9 continuing across RED Beach 2'),('18','A183859','Krulak, McPartlin, Karch and Muir viewing terrain from Hill 327')]]})
recovery=[]
for n in range(203,211):
    raw=(ROOT/f'data/corrections/landing_buildup_1965/page-{n}.md').read_bytes();text=raw.decode().split('## Transcription',1)[1]
    found=re.findall(r'3/9|2/5|McPartlin|5th Marines|9th Marines|Company H',text,re.I)
    recovery.append({'printedPage':n,'recordSha256':sha(raw),'screening':'target-term screening only; no relevant match' if not found else 'review matches','matches':found,'layer':'raw supplemental model OCR, not an agent correction','completeSemanticReview':False})
save('recovery-screening.json',recovery)
print(f'{len(ledger)} candidate dispositions; {len(items)} unpublished proposals; {len(assertions)} source-page records; 3 photo leads; 8 recovered pages term-screened.')
