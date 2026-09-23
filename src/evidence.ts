import book1965 from '../data/shared/official_histories/1965_BOOK_SOURCE_ANCHORS.json';
import princetonLog from '../data/geography/landmarks/USS_PRINCETON_SOURCE_ANCHORS.json';
import raw from '../data/units/5th_marines/2nd_battalion/research/1965_SOURCE_ANCHORS.json?raw';
import roadRaw from '../data/units/5th_marines/2nd_battalion/research/1966_ROAD_SOURCE_ANCHORS.json?raw';
export interface Anchor {
  id: string; label: string; kind: string; page: number; pageLabel: string;
  rect: [number, number, number, number] | null; quote: string; claim: string;
  regions?: {page:number;rect:[number,number,number,number]}[];
  ocrStart: number; ocrEnd: number; alignment: string;
  alignmentMethod?: 'model';
  alignmentReview?: {status: string; author: string; date: string; record: string};
}
export interface EvidenceDocument {
  id: string; title: string; unit: string; pdfSha256: string; ocrSha256: string;
  pageCount: number; originalItemUrl?: string; originalPdfUrl?: string; anchors: Anchor[];
}
export const evidence = JSON.parse(raw) as EvidenceDocument;
export const documents: EvidenceDocument[] = [evidence, book1965 as EvidenceDocument, ...JSON.parse(roadRaw), princetonLog as unknown as EvidenceDocument];
export const anchors = documents.flatMap(doc=>doc.anchors);
export function documentFor(anchor: Anchor) { return documents.find(doc=>doc.anchors.some(a=>a.id===anchor.id))!; }
export function highlightRegions(anchor: Anchor) {
  return anchor.regions ?? (anchor.rect ? [{page:anchor.page,rect:anchor.rect}] : []);
}
for (const doc of documents) for (const a of doc.anchors) {
  for (const region of highlightRegions(a)) {
    const [x,y,w,h] = region.rect;
    if (!Number.isInteger(region.page) || region.page < 1 || region.page > doc.pageCount || [x,y,w,h].some(n => !Number.isFinite(n) || n < 0) || x+w>1 || y+h>1 || w===0 || h===0) throw new Error(`Invalid source anchor: ${a.id}`);
  }
}
