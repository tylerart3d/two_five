import { useEffect, useRef, useState } from 'react';
import { eventsFor, type Chapter, type ChapterEvent } from './chronology';
export type { ChapterEvent } from './chronology';
const day=86400000;
const time=(value:string)=>Date.parse(value+'T00:00:00Z');
export function ChapterTimeline({chapter,index,total,onChapter,onEvent}: {chapter:Chapter;index:number;total:number;onChapter:(index:number)=>void;onEvent:(event:ChapterEvent)=>void}) {
  const [expanded,setExpanded]=useState(false);
  const [active,setActive]=useState<string|null>(null),[hover,setHover]=useState<string|null>(null),[focused,setFocused]=useState<string|null>(null);
  const [scrub,setScrub]=useState<number|null>(null);
  const scrollBox=useRef<HTMLDivElement>(null);
  const events=eventsFor(chapter);
  const start=time(chapter.dateStart), end=time(chapter.dateEnd)+day;
  const dayEvents=(offset:number)=>events.filter(e=>e.record.date.end!==null&&time(e.record.date.start)<=start+offset*day&&time(e.record.date.end??e.record.date.start)+day>start+offset*day);
  // Prefer the encompassing activity when a day also has point milestones.
  // All overlapping milestones remain individually selectable in the list.
  const eventAtDay=(offset:number)=>dayEvents(offset).sort((a,b)=>(time(b.record.date.end??b.record.date.start)-time(b.record.date.start))-(time(a.record.date.end??a.record.date.start)-time(a.record.date.start)))[0];
  const selected=scrub!==null?eventAtDay(scrub):events.find(e=>e.id===(hover??focused??active));
  const distance=(event:ChapterEvent)=>Math.max(time(event.record.date.start)-(start+(scrub??0)*day),(start+(scrub??0)*day)-time(event.record.date.end??event.record.date.start),0);
  const scrollTarget=scrub===null?undefined:(selected??[...events].sort((a,b)=>distance(a)-distance(b))[0])?.id;
  useEffect(()=>{
    if(!expanded||!scrollTarget) return;
    const frame=requestAnimationFrame(()=>{
      const box=scrollBox.current;
      const row=box?.querySelector<HTMLElement>(`[data-timeline-event="${CSS.escape(scrollTarget)}"]`);
      if(!box||!row) return;
      const target=box.scrollTop+row.getBoundingClientRect().top-box.getBoundingClientRect().top-(box.clientHeight-row.offsetHeight)/2;
      box.scrollTo({top:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    });
    return ()=>cancelAnimationFrame(frame);
  },[expanded,scrollTarget]);
  const intersects=selected&&time(selected.record.date.start)<end&&time(selected.record.date.end??selected.record.date.start)+day>start;
  const left=intersects?100*(Math.max(start,time(selected.record.date.start))-start)/(end-start):0;
  const width=intersects&&selected.record.date.end!==null?100*(Math.min(end,time(selected.record.date.end??selected.record.date.start)+day)-Math.max(start,time(selected.record.date.start)))/(end-start):0;
  const approximate=selected&&!['day','range','record'].includes(selected.record.date.precision);
  const days=Math.round((end-start)/day);
  const previewDay=scrub;
  const dayLabel=(offset:number)=>new Date(start+offset*day).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
  const pointerDay=(x:number,el:HTMLElement)=>{const r=el.getBoundingClientRect();return Math.max(0,Math.min(days-1,Math.floor((x-r.left)/r.width*days)));};
  const choose=(event:ChapterEvent)=>{setActive(event.id);onEvent(event);};
  const activateDay=(offset:number)=>{const event=eventAtDay(offset);if(event)choose(event);};
  return <section className="chapter-timeline" aria-label="Chapter timeframe" onClick={event=>{
    const target=event.target as HTMLElement;
    if(target.closest('button, a, input, select, textarea, [role="slider"], .timeline-day-events')) return;
    if(window.getSelection()?.toString()) return;
    setExpanded(value=>!value);
  }}>
    <button className="chapter-arrow previous" aria-label="Previous chapter" disabled={index===0} onClick={()=>onChapter(index-1)}><svg viewBox="0 0 16 32" aria-hidden="true"><path d="M12 4 3 16l9 12"/></svg></button>
    <button className="chapter-arrow next" aria-label="Next chapter" disabled={index===total-1} onClick={()=>onChapter(index+1)}><svg viewBox="0 0 16 32" aria-hidden="true"><path d="m4 4 9 12-9 12"/></svg></button>
    <div className="timeline-heading"><span className="eyebrow">{chapter.title}</span><span>{chapter.year}</span></div>
    <div className="timeline-date-preview" aria-live="polite">{intersects?(scrub!==null?`${selected.date} · ${selected.title}`:selected.date):scrub!==null?`${dayLabel(scrub)} · No cataloged event`:''}</div>
    <div className="timeline-months" aria-hidden="true">{chapter.months.map(month=>{
      const months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const date=time(`${chapter.year}-${String(months.indexOf(month)+1).padStart(2,'0')}-01`);
      return <span key={month} style={{position:'absolute',left:`${100*(date-start)/(end-start)}%`}}>{month}</span>;
    })}</div>
    <div className="timeline-scrub-area" onMouseLeave={()=>setScrub(null)}>
      <div className="chapter-time-span timeline-scrubber" role="slider" tabIndex={0} aria-label="Explore chapter dates" aria-valuemin={0} aria-valuemax={days-1} aria-valuenow={previewDay??0} aria-valuetext={`${dayLabel(previewDay??0)}: ${dayEvents(previewDay??0).length} events`} onMouseMove={e=>setScrub(pointerDay(e.clientX,e.currentTarget))} onClick={e=>activateDay(pointerDay(e.clientX,e.currentTarget))} onFocus={()=>setScrub(current=>current??0)} onBlur={()=>setScrub(null)} onKeyDown={e=>{
        const current=previewDay??0;
        if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();setScrub(e.key==='Home'?0:e.key==='End'?days-1:Math.max(0,Math.min(days-1,current+(e.key==='ArrowRight'?1:-1))));}
        if(e.key==='Enter'||e.key===' '){e.preventDefault();activateDay(current);}
        if(e.key==='Escape'){setScrub(null);}
      }}>
        {intersects&&<span data-testid="event-time-highlight" className={`event-time-highlight${approximate?' approximate':''}`} style={{left:`${left}%`,width:`max(4px, ${width}%)`}}/>}
      </div>
    </div>
    <button className="timeline-list-toggle" aria-label={`${expanded?'Hide':'Show'} events for ${chapter.title}`} aria-expanded={expanded} aria-controls="chapter-events" onClick={()=>setExpanded(!expanded)}>{expanded?'Hide events ▾':`${events.length} events ▴`}</button>
    <div className={`timeline-event-reveal${expanded?' is-expanded':''}`} inert={!expanded} aria-hidden={!expanded} id="chapter-events"><div className="timeline-event-scroll" ref={scrollBox}>
      <p className="timeline-event-note">{events.length} cataloged events · oldest first</p>
      <ol className="timeline-event-list">{events.map((event,index)=><li key={event.id} data-timeline-event={event.id}>
        {(index===0||event.record.date.start!==events[index-1].record.date.start||event.record.date.end!==events[index-1].record.date.end)&&<h3 className="timeline-date-group">{event.date}</h3>}
        <button data-preview={selected?.id===event.id} aria-pressed={active===event.id} onMouseEnter={()=>{setScrub(null);setHover(event.id);}} onMouseLeave={()=>setHover(null)} onFocus={()=>setFocused(event.id)} onBlur={()=>setFocused(null)} onClick={()=>{setActive(event.id);onEvent(event);}}><span>{event.date}</span><strong>{event.title}</strong></button>
      </li>)}</ol>
      {!events.length&&<p role="status">No cataloged events in this chapter.</p>}
      {active&&!events.find(e=>e.id===active)?.record.mapDestination&&<p className="timeline-event-note" role="status">No mapped destination is assigned to this event; the map stays in place.</p>}
    </div></div>
  </section>;
}
