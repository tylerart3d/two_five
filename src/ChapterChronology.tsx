import { eventRecords, type Chapter, type EventRecord } from './chronology';
import { anchors } from './evidence';

function EventText({event,onSource}: {event:EventRecord;onSource?: (id:string)=>void}) {
  return <>
    {event.paragraphs.map((paragraph,i)=><p key={i}>{paragraph.map((segment,j)=>onSource && segment.source!==undefined ? <button key={j} className="inline-citation" onClick={()=>onSource(event.sources[segment.source!].anchorId)}>{segment.text}</button> : <span key={j}>{segment.text}</span>)}</p>)}
    {event.context && <div className="operation-context"><details id={event.id} open={location.hash===`#${event.id}`}>
      <summary><span>{event.context.title}</span><span className="context-prompt">{event.context.prompt}</span></summary>
      <div className="context-body"><p className="eyebrow">{event.context.date}</p>
        {event.context.sections.map(section=><div key={section.heading}><h3>{section.heading}</h3><p>{section.text}</p></div>)}
        <p className="source-caution">{event.context.uncertainty}</p>
        {onSource && <button className="context-source" onClick={()=>onSource(event.sources[event.context!.source].anchorId)}>Read the chronology · page {anchors.find(a=>a.id===event.sources[event.context!.source].anchorId)!.page} ↗</button>}
      </div>
    </details></div>}
    {event.notes.map(note=><p key={note} className="editorial-note">{note}</p>)}
    {onSource && event.sources.length>1 && <div className="event-sources">{event.sources.map((source,i)=><button key={`${source.documentId}/${source.anchorId}`} className="context-source" onClick={()=>onSource(source.anchorId)}>Source {i+1} · {anchors.find(a=>a.id===source.anchorId)!.label}</button>)}</div>}
  </>;
}
export function Chronology({chapter,onSource}: {chapter:Chapter;onSource?: (id:string)=>void}) {
  return <>{chapter.sections.map((section,index)=><div key={section.id} id={section.id} className="story-section">
    <span className="section-number">{String(index+1).padStart(2,'0')} / {section.title}</span>
    {section.intro && <p>{section.intro}</p>}
    {section.groups ? section.groups.map(group=><details key={group.id} id={group.id} className="leadership-entry command-group">
      <summary>{group.title}</summary>
      {group.eventIds.map(id=>{const event=eventRecords.get(id)!;return <div key={id} data-event-id={id}><h3 className="event-heading"><span>{event.date.label}</span>{event.title}</h3><EventText event={event} onSource={onSource}/></div>;})}
      {group.note&&<p className="editorial-note">{group.note}</p>}
    </details>) : section.eventIds.map(id=>{ const event=eventRecords.get(id)!; return section.collapsible ? <details key={id} className="leadership-entry" data-event-id={id}><summary>{event.date.label} · {event.title}</summary><EventText event={event} onSource={onSource} /></details> : <div key={id} data-event-id={id}>{chapter.showEventDates && <h3 className="event-heading"><span>{event.date.label}</span>{event.title}</h3>}<EventText event={event} onSource={onSource} /></div>; })}
    {section.note && <p className="editorial-note">{section.note}</p>}
  </div>)}</>;
}
