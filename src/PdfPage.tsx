import {useEffect,useRef,useState, type RefObject} from 'react';
import type {PDFDocumentProxy} from 'pdfjs-dist';
import {highlightRegions, type Anchor} from './evidence';
export function PdfPage({pdf,page,width,height,anchor,root}:{pdf:PDFDocumentProxy;page:number;width:number;height:number;anchor:Anchor;root:RefObject<HTMLDivElement|null>}) {
 const element=useRef<HTMLDivElement>(null), canvas=useRef<HTMLCanvasElement>(null);
 const [visible,setVisible]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{root:root.current,rootMargin:'700px 0px'});if(element.current)observer.observe(element.current);return()=>observer.disconnect();},[root]);
 useEffect(()=>{
  if(!visible){if(canvas.current){canvas.current.width=0;canvas.current.height=0;}setReady(false);return;}
  let stopped=false;let task:ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']>|undefined;
  setReady(false);setError(false);
  void (async()=>{try{const p=await pdf.getPage(page);if(stopped)return;const view=p.getViewport({scale:width/p.getViewport({scale:1}).width});const ratio=Math.min(devicePixelRatio||1,2);const buffer=document.createElement('canvas');buffer.width=Math.ceil(view.width*ratio);buffer.height=Math.ceil(view.height*ratio);task=p.render({canvas:buffer,viewport:view,transform:[ratio,0,0,ratio,0,0]});await task.promise;if(stopped||!canvas.current)return;canvas.current.width=buffer.width;canvas.current.height=buffer.height;canvas.current.getContext('2d')!.drawImage(buffer,0,0);setReady(true);}catch{if(!stopped)setError(true);}})();
  return()=>{stopped=true;task?.cancel();};
 },[visible,pdf,page,width]);
 return <div ref={element} className="pdf-sheet" data-pdf-page={page} style={{width,height,marginBottom:16}} aria-label={`PDF page ${page}`}>
  <canvas ref={canvas} style={{visibility:ready?'visible':'hidden'}} role="img" aria-label={`Scanned source page ${page}`} />
  {!ready&&<span className="pdf-page-loading">{error?'Unable to render':'Loading'} page {page}…</span>}
  {highlightRegions(anchor).filter(region=>region.page===page).map((region,index)=><div key={index} className="source-highlight" data-testid="source-highlight" title={anchor.label} style={{left:region.rect[0]*100+'%',top:region.rect[1]*100+'%',width:region.rect[2]*100+'%',height:region.rect[3]*100+'%'}}/>)}
 </div>;
}
