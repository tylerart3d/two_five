"""Index existing OCR only; never opens PDFs or runs OCR. Standard library only."""
from pathlib import Path
import hashlib
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'data/shared/official_histories/_files/landing_buildup_1965'
OUT = ROOT / 'data/units/5th_marines/2nd_battalion/research/LANDING_BUILDUP_1965_EXTRACTIONS.md'
raw = (SOURCE / 'ia_ocr.txt').read_bytes()
text = raw.decode('utf-8')
xml_bytes = (SOURCE / 'ia_ocr.xml').read_bytes()
objects = ET.fromstring(xml_bytes).findall('.//OBJECT')
scan = ET.parse(SOURCE / 'ia_scandata.xml')
normalize = lambda value: re.sub(r'\s+', ' ', value).strip()
pages = []
for index, obj in enumerate(objects):
    pagefile = obj.get('usemap')
    leaf = int(pagefile.rsplit('_', 1)[1].split('.')[0])
    entry = scan.find(f'.//pageData/page[@leafNum="{leaf}"]')
    words = [''.join(word.itertext()).strip() for word in obj.findall('.//WORD')]
    pages.append({'ocr_object_index_0': index, 'ocr_page_file': pagefile,
                  'archive_leaf': leaf, 'printed_page_label': entry.findtext('pageNumber') if entry is not None else None,
                  'text': normalize(' '.join(words))})

# Context terms are leads, never automatic claims of 2/5 or Hotel participation.
patterns = {
    'direct_2_5': r'\b(?:2(?:d|nd)?\s+Battalion\s*,?\s*5th\s+Marines|Second\s+Battalion\s*,?\s*Fifth\s+Marines|2\s*/\s*5)\b',
    'predecessor_3_9': r'\b(?:3d\s+Battalion\s*,?\s*9th\s+Marines|3\s*/\s*9)\b',
    'regimental_context': r'\b5th\s+Marines\b',
    'leadership_lead': r'\b(?:McPartlin|Uskurait|Doherty|Waller|Catt)\b',
    'replacement_system': r'\btransplacement\b',
    'company_lead_unassigned': r'\b(?:Hotel\s+Company|Company\s+H)\b',
}
hits = []
for page in pages:
    for category, pattern in patterns.items():
        for match in re.finditer(pattern, page['text'], re.I):
            hits.append({**{k: v for k, v in page.items() if k != 'text'}, 'category': category,
                         'match': match.group(), 'normalized_character_start': match.start(),
                         'context': page['text'][max(0, match.start()-240):match.end()+500],
                         'status': 'candidate; entity identity and historical claim require review'})

# Exact raw OCR excerpts, anchored by unique regex spans; corrections stay separate.
selections = [
    ('LB65-001', r'Under\s+this\s+system,\s+a\s+battalion.*?became\s+the\s+3d\s+Battalion,\s+9th\s+Marines\.'),
    ('LB65-002', r'Lieutenant\s+Colonel\s+McPartlin\s+had\s+enlisted.*?both\s+World\s+War\s+II\s+and\s+Korea\.'),
    ('LB65-003', r'On\s+11\s+June,\s+1/9\s+arrived.*?be\s+considered\s+a\s+reinforcement\.'),
    ('LB65-004', r'Only\s+one\s+regiment\s+of\s+the\s+division.*?Pendleton\.'),
    ('LB65-005', r'The\s+end\s+of\s+the\s+battalion\s+rotation\s+between\s+East\s+Pac.*?over\s+several\s+months\.'),
    ('LB65-006', r'3/9\*\s+LtCol\s+Charles\s+E\.\s+McPartlin.*?returned\s+to\s+Vietnam\s+on\s+14Aug\.'),
]
assertions = []
for record_id, pattern in selections:
    matches = list(re.finditer(pattern, text, re.S))
    if len(matches) != 1:
        raise ValueError(f'{record_id}: expected one raw excerpt; got {len(matches)}')
    match = matches[0]
    excerpt = match.group()
    # Whitespace-only correspondence to existing XML, no repaired OCR or inferred PDF offset.
    corresponding = [page for page in pages if normalize(excerpt) in page['text']]
    start = len(text[:match.start()].encode('utf-8'))
    end = len(text[:match.end()].encode('utf-8'))
    assert raw[start:end].decode('utf-8') == excerpt
    assertions.append({'id': record_id, 'status': 'extracted; OCR not visually verified',
                       'ocr_utf8_byte_start': start, 'ocr_utf8_byte_end_exclusive': end,
                       'excerpt': excerpt, 'ocr_page_matches': [{k: v for k, v in p.items() if k != 'text'} for p in corresponding],
                       'official_pdf_page_index': None, 'verified_pdf_highlight': None})

result = {'source_id': 'usmc-history-1965-pcn19000307600',
          'method': 'regex over existing IA OCR; XML text search and scan metadata page labels; no model/OCR/PDF inspection',
          'ocr_sha256': hashlib.sha256(raw).hexdigest(), 'ocr_xml_sha256': hashlib.sha256(xml_bytes).hexdigest(),
          'ocr_objects': len(pages), 'patterns': patterns, 'assertions': assertions, 'candidate_hits': hits}
OUT.write_text('# Landing and Buildup 1965 — generated OCR extraction\n\n'
               'Regenerate with `python scripts/parse-landing-buildup-1965.py`. '
               'Editorial findings belong in LANDING_BUILDUP_1965.md.\n\n'
               'Offsets refer to immutable ia_ocr.txt UTF-8 bytes, end-exclusive. '
               'Candidate offsets are characters in whitespace-normalized XML text, not raw bytes. '
               'Printed labels come from scan metadata. OCR object and archive leaf IDs are not verified PDF page indices. '
               'No candidate is automatically an event or proof of Hotel participation.\n\n```json\n'
               + json.dumps(result, ensure_ascii=False, indent=2) + '\n```\n', encoding='utf-8')
print(json.dumps({'assertions': len(assertions), 'candidate_hits': len(hits),
                  'counts': {k: sum(h['category'] == k for h in hits) for k in patterns},
                  'page_labels': {a['id']: [p['printed_page_label'] for p in a['ocr_page_matches']] for a in assertions}}))
