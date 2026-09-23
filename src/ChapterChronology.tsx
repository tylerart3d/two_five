import { eventRecords, type Chapter, type EventRecord } from './chronology';
import { anchors } from './evidence';

function EventText({event,onSource}: {event:EventRecord;onSource?: (id:string)=>void}) {
  return <>
    {event.paragraphs.map((paragraph,i)=><p key={i}>{paragraph.map((segment,j)=>onSource && segment.source!==undefined ? <a key={j} className="inline-citation" href={`#${event.sources[segment.source!].anchorId}`} onClick={e=>{e.preventDefault();onSource(event.sources[segment.source!].anchorId);}}>{segment.text}</a> : <span key={j}>{segment.text}</span>)}</p>)}
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
    <div className="chronology-section-body">
    {section.intro && <p>{section.intro}</p>}
    {section.groups ? section.groups.map(group=><details key={group.id} id={group.id} className="leadership-entry command-group">
      <summary>{group.title}</summary>
      {group.subgroups ? group.subgroups.map(subgroup=><section key={subgroup.title} className="company-leadership"><h3>{subgroup.title}</h3><ul className="closer-look-list">{subgroup.entries.map((entry,index)=>{const event=eventRecords.get(entry.eventId)!;return <li key={index} data-event-id={entry.eventId}><h4 className="event-heading"><span>{event.date.label}</span></h4><EventText event={{...event,paragraphs:[[{text:entry.text,source:0}]],notes:[]}} onSource={onSource}/></li>;})}</ul></section>) : <ul className="closer-look-list">{group.eventIds.map(id=>{const event=eventRecords.get(id)!;return <li key={id} data-event-id={id}><h3 className="event-heading"><span>{event.date.label}</span>{event.title}</h3><EventText event={event} onSource={onSource}/></li>;})}</ul>}
      {group.note&&<p className="editorial-note">{group.note}</p>}
    </details>) : ['preparation','road-okinawa'].includes(section.id) ? <>
      {section.eventIds.filter(id=>eventRecords.get(id)!.kind==='location-context').map(id=><div key={id} data-event-id={id}><EventText event={eventRecords.get(id)!} onSource={onSource}/></div>)}
      <ul className="closer-look-list">{section.eventIds.filter(id=>eventRecords.get(id)!.kind!=='location-context').map(id=>{const event=eventRecords.get(id)!;return <li key={id} data-event-id={id}>{chapter.showEventDates && <h3 className="event-heading"><span>{event.date.label}</span>{event.title}</h3>}<EventText event={event} onSource={onSource}/></li>;})}</ul>
    </> : section.eventIds.map(id=>{ const event=eventRecords.get(id)!; return section.collapsible ? <details key={id} className="leadership-entry" data-event-id={id}><summary>{event.date.label} · {event.title}</summary><EventText event={event} onSource={onSource} /></details> : <div key={id} data-event-id={id}>{chapter.showEventDates && <h3 className="event-heading"><span>{event.date.label}</span>{event.title}</h3>}<EventText event={event} onSource={onSource} /></div>; })}
    {section.note && <p className="editorial-note">{section.note}</p>}
    </div>
  </div>)}</>;
}
