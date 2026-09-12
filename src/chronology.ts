import rawChapter from '../data/units/5th_marines/2nd_battalion/research/chapters/rebirth-1965.json?raw';
import { documents } from './evidence';
import roadRaw from '../data/units/5th_marines/2nd_battalion/research/chapters/road-1966.json?raw';
export interface EventRecord {
  schemaVersion: number; id: string; title: string; chapterIds:string[];
  date: {label: string; start: string; end: string | null; precision: string};
  category?: string; mapDestination?: string; timelineHidden?: boolean; chronologyEventId?: string;
  kind: string; units: string[]; people: string[]; locations: string[];
  sources: {documentId: string; anchorId: string}[];
  paragraphs: {text: string; source?: number}[][]; notes: string[];
  researchStatus: string; revisions: {date: string; note: string}[];
  context?: {title: string; date: string; prompt: string; sections: {heading: string; text: string}[]; uncertainty: string; source: number};
}
export interface Chapter {
  schemaVersion: number; id: string; title: string; subtitle: string; showEventDates?: boolean;
  dateStart:string; dateEnd:string; dateLabel: string; year: number; months: string[]; narrative: string;
  sections: {id: string; title: string; intro: string; note: string; collapsible: boolean; eventIds: string[]; groups?: {id:string;title:string;eventIds:string[];note:string}[]}[];
  timelineGroups: {title: string; eventIds: string[]}[];
}
function parse<T>(raw: string, path: string): T {
  try { return JSON.parse(raw) as T; } catch { throw new Error(`Invalid JSON record: ${path}`); }
}
export const chapter = parse<Chapter>(rawChapter, 'rebirth-1965.json');
export const chapters = [chapter, parse<Chapter>(roadRaw, 'road-1966.json')];
const files = import.meta.glob('../data/units/5th_marines/2nd_battalion/research/events/*.json', {query:'?raw',import:'default',eager:true}) as Record<string,string>;
export const eventRecords = new Map<string, EventRecord>();
for (const [path,raw] of Object.entries(files)) {
  if (path.endsWith('/README.md')) continue;
  const event=parse<EventRecord>(raw,path);
  if (event.schemaVersion!==1 || !event.id || eventRecords.has(event.id)) throw new Error(`Invalid or duplicate event: ${path}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date.start) || (event.date.end!==null && (!/^\d{4}-\d{2}-\d{2}$/.test(event.date.end) || event.date.start>event.date.end)) || (event.date.end===null && event.date.precision!=='after')) throw new Error(`Invalid event dates: ${event.id}`);
  if (!Array.isArray(event.chapterIds)||event.chapterIds.some(id=>!chapters.some(c=>c.id===id))) throw new Error(`Invalid chapter tags: ${event.id}`);
  if (!event.sources.length) throw new Error(`Unsourced event: ${event.id}`);
  for (const source of event.sources) if (!documents.some(doc=>doc.id===source.documentId && doc.anchors.some(a=>a.id===source.anchorId))) throw new Error(`Unresolved source: ${event.id}/${source.anchorId}`);
  for (const segment of event.paragraphs.flat()) if (segment.source!==undefined && !event.sources[segment.source]) throw new Error(`Invalid paragraph source: ${event.id}`);
  if (event.context && !event.sources[event.context.source]) throw new Error(`Invalid context source: ${event.id}`);
  eventRecords.set(event.id,event);
}
export interface ChapterEvent {id:string;date:string;title:string;section?:string;group:string;sourceAnchor:string;record:EventRecord}
export function allTimelineEvents(chapter: Chapter): ChapterEvent[] {
  const memberships=new Map(chapter.sections.flatMap(section=>section.eventIds.map(id=>[id,section.id] as const)));
  return [...eventRecords.values()].filter(event=>event.kind!=='location-context'&&!event.timelineHidden).sort((a,b)=>a.date.start.localeCompare(b.date.start)||(a.date.end??a.date.start).localeCompare(b.date.end??b.date.start)||a.id.localeCompare(b.id)).map(record=>({id:record.id,date:record.date.label,title:record.title,section:memberships.get(record.chronologyEventId??record.id),group:record.category??'other',sourceAnchor:record.sources[0].anchorId,record}));
}
export function eventsFor(chapter: Chapter): ChapterEvent[] {
  return allTimelineEvents(chapter).filter(e=>e.record.chapterIds.includes(chapter.id));
}
for (const chapter of chapters) for(const section of chapter.sections) for(const id of section.eventIds) {
  if(!eventRecords.has(id)) throw new Error(`Unknown chapter event: ${id}`);
}
