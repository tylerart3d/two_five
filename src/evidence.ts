import princetonLog from '../data/geography/landmarks/USS_PRINCETON_SOURCE_ANCHORS.json';
import raw from '../data/units/5th_marines/2nd_battalion/research/1965_SOURCE_ANCHORS.json?raw';
import roadRaw from '../data/units/5th_marines/2nd_battalion/research/1966_ROAD_SOURCE_ANCHORS.json?raw';
export interface Anchor {
  id: string; label: string; kind: string; page: number; pageLabel: string;
  rect: [number, number, number, number] | null; quote: string; claim: string;
  ocrStart: number; ocrEnd: number; alignment: string;
  alignmentMethod?: 'model';
}
export interface EvidenceDocument {
  id: string; title: string; unit: string; pdfSha256: string; ocrSha256: string;
  pageCount: number; originalItemUrl?: string; originalPdfUrl?: string; anchors: Anchor[];
}
export const evidence = JSON.parse(raw) as EvidenceDocument;
export const documents: EvidenceDocument[] = [evidence, ...JSON.parse(roadRaw), princetonLog as EvidenceDocument];
export const anchors = documents.flatMap(doc=>doc.anchors);
export function documentFor(anchor: Anchor) { return documents.find(doc=>doc.anchors.some(a=>a.id===anchor.id))!; }
for (const doc of documents) for (const a of doc.anchors) {
  if (a.rect === null) continue;
  const [x,y,w,h] = a.rect;
  if (a.page < 1 || a.page > doc.pageCount || [x,y,w,h].some(n => !Number.isFinite(n) || n < 0) || x+w>1 || y+h>1 || w===0 || h===0) throw new Error(`Invalid source anchor: ${a.id}`);
}
