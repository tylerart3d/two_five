import {useEffect,useRef,useState} from 'react';
import {chapters,type Chapter} from './chronology';
const shortDate=(date:string)=>new Date(date+'T00:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'});
function ChapterLabel({chapter}:{chapter:Chapter}) {
 const first=chapter.dateStart.slice(0,4),last=chapter.dateEnd.slice(0,4);
 return <><strong>{first===last?first:first+'–'+last}</strong> <span>{shortDate(chapter.dateStart)} - {shortDate(chapter.dateEnd)}</span><span aria-hidden="true"> | </span><span>{chapter.title}</span></>;
}
export function ChapterPicker({index,onChange}:{index:number;onChange:(index:number)=>void}) {
 const [open,setOpen]=useState(false),[active,setActive]=useState(index);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!open)return;const dismiss=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',dismiss);return()=>document.removeEventListener('pointerdown',dismiss);},[open]);
 const choose=(next:number)=>{setOpen(false);if(next!==index)onChange(next);};
 return <div ref={root} className="chapter-picker" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}>
  <button type="button" className="chapter-picker-trigger" role="combobox" aria-label="Choose chapter" aria-expanded={open} aria-haspopup="listbox" aria-controls="chapter-options" aria-activedescendant={open?'chapter-option-'+active:undefined} onClick={()=>{setActive(index);setOpen(!open);}} onKeyDown={e=>{
   if(e.key==='Escape'){e.preventDefault();setOpen(false);return;}
   if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();setOpen(true);setActive(current=>e.key==='Home'?0:e.key==='End'?chapters.length-1:!open?index:Math.max(0,Math.min(chapters.length-1,current+(e.key==='ArrowDown'?1:-1))));}
   if(open&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose(active);}
  }}><span className="chapter-picker-label"><ChapterLabel chapter={chapters[index]}/></span><span aria-hidden="true">▾</span></button>
  {open&&<ul id="chapter-options" role="listbox" aria-label="Chapters">{chapters.map((chapter,i)=><li id={'chapter-option-'+i} key={chapter.id} role="option" aria-selected={i===index} data-active={i===active} onMouseEnter={()=>setActive(i)} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(i)}><ChapterLabel chapter={chapter}/></li>)}</ul>}
 </div>;
}
