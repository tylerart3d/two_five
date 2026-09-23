import type { Chapter } from './chronology';
const files=import.meta.glob('../data/units/5th_marines/2nd_battalion/research/*_NARRATIVE.md',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
export function ChapterNarrative({chapter,onSource}: {chapter:Chapter;onSource?:(id:string)=>void}) {
const raw=files[`../data/units/5th_marines/2nd_battalion/research/${chapter.narrative}`];
if (!raw) throw new Error(`Missing chapter narrative: ${chapter.narrative}`);
const narrative = JSON.parse(raw.match(/```json\s*([\s\S]*?)```/)![1]) as {paragraphs: {text: string; sources: number[]}[]; sources: {id: number; title: string; url?: string; anchorId?: string}[]};

  return <section className="chapter-narrative" aria-label="Chapter narrative">
    {narrative.paragraphs.map((paragraph,index)=>onSource ? <details key={index} className="narrative-passage-sources"><summary>{paragraph.text}</summary><div>{paragraph.sources.map(id=>{const source=narrative.sources.find(s=>s.id===id)!;return source.anchorId ? <button key={id} className="context-source" onClick={()=>onSource(source.anchorId!)}>{source.title} ↗</button> : source.url ? <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a> : <span key={id}>{source.title}</span>;})}</div></details> : <p key={index}>{paragraph.text}</p>)}

  </section>;
}
