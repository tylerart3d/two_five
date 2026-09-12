import type { Chapter } from './chronology';
const files=import.meta.glob('../data/units/5th_marines/2nd_battalion/research/*_NARRATIVE.md',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
export function ChapterNarrative({chapter}: {chapter:Chapter}) {
const raw=files[`../data/units/5th_marines/2nd_battalion/research/${chapter.narrative}`];
if (!raw) throw new Error(`Missing chapter narrative: ${chapter.narrative}`);
const narrative = JSON.parse(raw.match(/```json\s*([\s\S]*?)```/)![1]) as {paragraphs: {text: string; sources: number[]}[]; sources: {id: number; title: string; url?: string}[]};

  return <section className="chapter-narrative" aria-label="Chapter narrative">
    {narrative.paragraphs.map((paragraph,index)=><p key={index}>{paragraph.text} <sup aria-label={`Sources ${paragraph.sources.join(', ')}`}>[{paragraph.sources.join(', ')}]</sup></p>)}
    <details className="narrative-sources"><summary className="eyebrow">SOURCES</summary><ol>{narrative.sources.map(source=><li key={source.id}>{source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a> : <span>{source.title}</span>}</li>)}</ol></details>
  </section>;
}
