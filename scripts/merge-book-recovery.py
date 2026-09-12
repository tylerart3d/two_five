"""Merge reviewed-boundary local-model page recovery without altering source OCR."""
from pathlib import Path
import difflib
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data/shared/official_histories/_files/landing_buildup_1965'
WORK = ROOT / 'data/local/book-recovery'
OUT = ROOT / 'data/corrections/landing_buildup_1965'
digest = lambda b: hashlib.sha256(b).hexdigest()
raw = (SOURCE / 'ia_ocr.txt').read_bytes()
text = raw.decode('utf-8')
objects = ET.parse(SOURCE / 'ia_ocr.xml').findall('.//OBJECT')
scan = ET.parse(SOURCE / 'ia_scandata.xml')
official_hash = digest((SOURCE / 'official.pdf').read_bytes())

def existing_page(number):
    entries = [p for p in scan.findall('.//pageData/page') if p.findtext('pageNumber') == str(number)]
    assert len(entries) == 1, f'Missing/ambiguous metadata for {number}'
    leaf = int(entries[0].get('leafNum'))
    obj = [o for o in objects if int(o.get('usemap').rsplit('_',1)[1].split('.')[0]) == leaf]
    assert len(obj) == 1
    words = ' '.join(''.join(w.itertext()) for w in obj[0].findall('.//WORD')).split()
    matches = list(re.finditer(r'\s+'.join(re.escape(w) for w in words),text))
    assert len(matches) == 1, f'Unable to match existing page {number} exactly'
    return matches[0], leaf

before, before_leaf = existing_page(202)
after, after_leaf = existing_page(211)
assert not text[before.end():after.start()].strip(), 'Unexpected content at insertion boundary'
assert after_leaf == before_leaf + 1, 'Scan leaves are not adjacent'
for n in range(203,211):
    assert not any(p.findtext('pageNumber')==str(n) for p in scan.findall('.//pageData/page')), f'Page {n} already present'

pages = {}
for pdf_page in range(218,228):
    record = json.loads((WORK / f'page-{pdf_page}.json').read_text(encoding='utf-8'))
    assert record['printed_page']==pdf_page-16 and record['finishReason']=='stop'
    assert len(record['text']) > 100
    assert digest((WORK / f'response-{pdf_page}.json').read_bytes()) == record['responseSha256']
    pages[pdf_page-16] = record

def normalize(value):
    # Ignore whitespace, case and punctuation for scan/OCR alignment only.
    return re.sub(r'[^a-z0-9]', '', value.lower())

alignment = []
for number, match in [(202,before),(211,after)]:
    ratio = difflib.SequenceMatcher(None,normalize(match.group()),normalize(pages[number]['text']),autojunk=False).ratio()
    assert ratio >= .70, f'Boundary page {number} needs review: similarity {ratio:.3f}'
    alignment.append({'printedPage':number,'officialPdfPage':number+16,'existingOcrSimilarity':round(ratio,4),'action':'Calibration only; existing OCR retained byte-for-byte.'})

insert_at = len(text[:after.start()].encode('utf-8'))
blocks = []
offset = insert_at
spans = []
for number in range(203,211):
    record=pages[number]
    block=(f'\n\n[Recovered printed page {number} | official PDF page {number+16} | local Qwen vision OCR]\n\n'+record['text'].strip()+'\n\n').encode('utf-8')
    blocks.append(block)
    spans.append({'printedPage':number,'officialPdfPage':number+16,'mergedByteStart':offset,'mergedByteEndExclusive':offset+len(block),'textSha256':digest(record['text'].encode('utf-8')),'responseSha256':record['responseSha256'],'imageSha256':record['imageSha256'],'model':record['model'],'fingerprint':record.get('fingerprint'),'generatedUnixTime':record.get('created'),'uncertainties':record['uncertainties']})
    offset += len(block)
inserted=b''.join(blocks)
merged=raw[:insert_at]+inserted+raw[insert_at:]
assert merged[:insert_at]+merged[insert_at+len(inserted):] == raw
merged_path=WORK/'merged_ocr.txt'
merged_path.write_bytes(merged)
OUT.mkdir(parents=True,exist_ok=True)
for row in spans:
    number=row['printedPage']
    (OUT/f'page-{number}.md').write_text(f'# Recovered printed page {number}\n\nSource: official Marine Corps PDF, physical page {number+16}.\nStatus: local-model transcription; no human visual review. Original IA OCR unchanged.\n\n```json\n'+json.dumps(row,ensure_ascii=False,indent=2)+'\n```\n\n## Transcription\n\n'+pages[number]['text']+'\n',encoding='utf-8')
manifest={'sourceId':'usmc-history-1965-pcn19000307600','officialPdfSha256':official_hash,'originalOcrSha256':digest(raw),'mergedOcrPath':'data/local/book-recovery/merged_ocr.txt','mergedOcrSha256':digest(merged),'insertAtOriginalByte':insert_at,'insertedBytes':len(inserted),'boundaryChecks':alignment,'recoveredPages':spans,'reviewStatus':'Model transcription; preserves flagged uncertainties; not human-verified.'}
(OUT/'README.md').write_text('# Landing and Buildup 1965 — recovered pages\n\nPrinted pages 203–210 recovered from the official USMC PDF (physical pages 219–226) using Qwen vision through AgentRelay. Printed pages 202 and 211 were independently transcribed as alignment checks, then left unchanged in the merged OCR. Existing IA scan metadata jumps from 202 to 211 on adjacent leaves.\n\nThe merged text is a derived, mixed-scan reading copy. Removing the inserted byte range reproduces the original IA OCR exactly. Original PDFs, OCR, XML, byte-offset citations and source manifests remain unchanged. New citations should reference a recovered page record and its official PDF page; do not use merged offsets against the original IA OCR.\n\nRegenerate with `python scripts/merge-book-recovery.py` after the retained local model responses are available. Page images were rendered with Poppler at 2200 pixels on the long edge. Prompts, image hashes and complete responses remain under ignored data/local/book-recovery/. No Codex visual inspection was used.\n\n'+''.join(f'- [Printed page {n}](page-{n}.md)\n' for n in range(203,211))+'\n```json\n'+json.dumps(manifest,ensure_ascii=False,indent=2)+'\n```\n',encoding='utf-8')
print(json.dumps({'pagesAdded':8,'boundaryChecks':alignment,'mergedBytes':len(merged),'mergedSha256':digest(merged)}))
