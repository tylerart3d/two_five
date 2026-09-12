import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { ChapterTimeline, type ChapterEvent } from './ChapterTimeline';
import { SourceWindow } from './SourceWindow';
import { ChapterMap } from './ChapterMap';
import { anchors } from './evidence';
import { ChapterNarrative } from './ChapterNarrative';
import { Chronology } from './ChapterChronology';
import { chapters, eventsFor } from './chronology';

import { ScrollAffordances } from './ScrollAffordances';
import './styles.css';
function App() {
  const [chapterIndex,setChapterIndex]=useState(() => {
    const hash=location.hash.slice(1);
    return Math.max(0,chapters.findIndex(c=>hash==='chapter/'+c.id || eventsFor(c).some(e=>e.sourceAnchor===hash)));
  });
  const chapter=chapters[chapterIndex];
  const [mapRequest,setMapRequest]=useState<{destination:string;sequence:number}|null>(null);
  function changeChapter(index:number) {
    if (index<0 || index>=chapters.length) return;
    setMapRequest(null); setChapterIndex(index); setStoryView('narrative'); setSourceWindow(null);
    setSelected(anchors.find(a=>a.id===eventsFor(chapters[index])[0].sourceAnchor)!);
    document.querySelector('.story-body')?.scrollTo({top:0});
    history.replaceState(null,'','#chapter/'+chapters[index].id);
    requestAnimationFrame(()=>document.getElementById('chapter-title')?.focus({preventScroll:true}));
  }
  const [storyView, setStoryView] = useState<'narrative' | 'chronology'>(() => anchors.some(a=>a.id===location.hash.slice(1)) ? 'chronology' : 'narrative');
  const [selected, setSelected] = useState(() => anchors.find(a=>a.id===location.hash.slice(1)) ?? anchors[1]);
  const [sourceWindow, setSourceWindow] = useState<{id: string; origin: HTMLElement | null} | null>(() => {
    const anchor = anchors.find(a => a.id === location.hash.slice(1));
    return anchor ? {id: anchor.id, origin: null} : null;
  });
  function select(id: string) {
    const anchor = anchors.find(a => a.id === id);
    if (!anchor) return;
    setStoryView('chronology');
    setSelected(anchor);
    setSourceWindow(current => ({ id, origin: current ? current.origin : (document.activeElement instanceof HTMLElement ? document.activeElement : null) }));
    history.replaceState(null, '', '#'+id);
  }
  function visitEvent(event: ChapterEvent) {
    if(event.record.mapDestination) setMapRequest(current=>({destination:event.record.mapDestination!,sequence:(current?.sequence??0)+1}));
    if(!event.section) return;
    flushSync(() => setStoryView('chronology'));
    const section = document.querySelector<HTMLElement>(`[data-event-id="${CSS.escape(event.record.chronologyEventId??event.id)}"]`) ?? document.getElementById(event.section);
    if (section instanceof HTMLDetailsElement) section.open = true;
    for(let parent=section?.parentElement;parent;parent=parent.parentElement) {
      if(parent instanceof HTMLDetailsElement) parent.open=true;
    }
    section?.querySelectorAll('details').forEach(details => { details.open = true; });
    const body = document.querySelector<HTMLElement>('.story-body');
    if (section && body) {
      body.scrollTo({ top: body.scrollTop + section.getBoundingClientRect().top - body.getBoundingClientRect().top - 16, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    setSelected(anchors.find(a => a.id === event.sourceAnchor)!);
    if (sourceWindow) select(event.sourceAnchor);
  }
  return <main className={sourceWindow ? 'reading-source' : undefined}>
    <ScrollAffordances />
    <header><a className="brand" href="#" onClick={e=>{e.preventDefault();history.replaceState(null,'','#map');}}>TWO <span>/</span> FIVE</a><span className="header-label">HOTEL COMPANY · RESEARCH ARCHIVE</span><span className="prototype-label">{chapter.year} / SOURCE STUDY</span></header>
    <div className="map-stage"><ChapterMap mapRequest={mapRequest} road={chapterIndex===1} onSource={sourceWindow ? select : undefined} /><div className="window-layer">
    <div className="research-layout">
      <article className="story">
        <div className="story-tabs" role="tablist" aria-label="Chapter view" onKeyDown={event => {
          if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 'narrative' : event.key === 'End' ? 'chronology' : storyView === 'narrative' ? 'chronology' : 'narrative';
          setStoryView(next);
          document.getElementById(`tab-${next}`)?.focus();
        }}>
          {(['narrative','chronology'] as const).map(view => <button key={view} id={`tab-${view}`} role="tab" aria-selected={storyView===view} aria-controls={`panel-${view}`} tabIndex={storyView===view ? 0 : -1} onClick={()=>setStoryView(view)}>{view==='narrative' ? 'Narrative' : 'Chronology'}</button>)}
        </div>
        <div className="story-body">
        <h1 id="chapter-title" tabIndex={-1}>{chapter.title}</h1>
        <p className="dek">{chapter.subtitle}</p>
        <div id="panel-narrative" role="tabpanel" aria-labelledby="tab-narrative" tabIndex={0} hidden={storyView!=='narrative'}><ChapterNarrative chapter={chapter} /></div>
        <div id="panel-chronology" role="tabpanel" aria-labelledby="tab-chronology" tabIndex={0} hidden={storyView!=='chronology'}>
        <Chronology chapter={chapter} onSource={sourceWindow ? select : undefined} />
        <div className="selected-claim"><p className="eyebrow">INSPECTING · {selected.kind}</p><p>{selected.claim}</p></div>
        </div>
        </div><div className="story-actions"><button className="context-source" onClick={()=>select(chapterIndex===0 ? 'camp-margarita' : eventsFor(chapter)[0].sourceAnchor)}>Read the Source ↗</button><p className="instructions">{sourceWindow ? 'Select an underlined passage to locate it in the source.' : 'Read the Source to explore the original record behind this chapter.'}</p></div>
      </article>
    </div>
    </div><ChapterTimeline key={chapter.id} chapter={chapter} index={chapterIndex} total={chapters.length} onChapter={changeChapter} onEvent={visitEvent} /></div><footer className="site-footer"><img className="footer-emblem" src="/brand/marine-corps-emblem.svg" alt="Marine Corps Eagle, Globe and Anchor" width="36" height="40" /><span>© 2026 Brent Tyler · Original code: all rights reserved.</span></footer>
    {sourceWindow && <SourceWindow anchor={anchors.find(a => a.id === sourceWindow.id)!} origin={sourceWindow.origin} onClose={() => {setSourceWindow(null); history.replaceState(null, '', chapterIndex===0 ? '#map' : '#chapter/'+chapter.id);}} />}
  </main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
