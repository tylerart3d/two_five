import approved1965 from '../data/ocr-runs/approved-reading-copies/1201048065.json';
import approved1966 from '../data/ocr-runs/approved-reading-copies/1201048066.json';
import { PdfPage } from './PdfPage';
import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { documentFor, highlightRegions, type Anchor } from './evidence';
GlobalWorkerOptions.workerSrc = workerUrl;
export function EvidenceViewer({ anchor }: { anchor: Anchor }) {
  const evidence = documentFor(anchor);
  const target = highlightRegions(anchor)[0];
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [page, setPage] = useState(anchor.page);
  const reviewedPage = [approved1965, approved1966].find(d=>d.documentId===evidence.id)?.pages.find(p=>p.page===page);
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState<"width" | "height">("width");
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(650);
  const [pages, setPages] = useState<{width:number;height:number}[]>([]);
  const pendingPosition = useRef<{page:number;fraction:number}|null>(null);

  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => { setPage(anchor.page); setZoom(1); }, [anchor]);
  useEffect(() => {
    if (!viewport.current) return;
    let frame = 0;
    const observer = new ResizeObserver(entries => {
      const nextWidth = Math.max(1, Math.floor(entries[0].contentRect.width));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { setWidth(nextWidth); setHeight(Math.max(1, entries[0].contentRect.height)); });
    });
    observer.observe(viewport.current); return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    let stopped = false;
    const controller = new AbortController();
    let task: ReturnType<typeof getDocument> | undefined;
    setPdf(null); setPages([]); setError('');
    const timeout = setTimeout(() => controller.abort(), 15000);
    async function load() {
      try {
        const url = import.meta.env.DEV ? `/evidence/${evidence.id}.pdf` : evidence.originalPdfUrl;
        if (!url) throw new Error("Original URL pending verification");
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Document request failed (${response.status}).`);
        const bytes = await response.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        const hash = [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2,'0')).join('');
        if (hash !== evidence.pdfSha256) throw new Error('This PDF differs from the version used for these highlights. Alignment must be reviewed.');
        if (stopped) return;
        task = getDocument({ data: new Uint8Array(bytes), wasmUrl: '/pdfjs/wasm/', standardFontDataUrl: '/pdfjs/standard_fonts/' });
        const loaded = await task.promise;
        if (loaded.numPages !== evidence.pageCount) throw new Error('Page count changed');
        const dimensions=[];
        for(let n=1;n<=loaded.numPages;n++){if(stopped)return;const page=await loaded.getPage(n);const view=page.getViewport({scale:1});dimensions.push({width:view.width,height:view.height});}
        if (!stopped) { setPages(dimensions); setPdf(loaded); }
      } catch (e) {
        if (!stopped) setError(e instanceof Error && e.message.includes('differs') ? e.message : 'The PDF could not be loaded here. You can still read the preserved excerpt below.');
      } finally { clearTimeout(timeout); }
    }
    void load();
    return () => { stopped = true; controller.abort(); clearTimeout(timeout); void task?.destroy(); };
  }, [attempt, evidence]);
  const sizes=pages.map(p=>{const scale=(fit==='height'?height/p.height:width/p.width)*zoom;return {width:p.width*scale,height:p.height*scale};});
  const jump=(target:number,fraction=0,center=false)=>{const port=viewport.current;if(!port||!sizes.length)return;const offset=sizes.slice(0,target-1).reduce((sum,p)=>sum+p.height+16,0);port.scrollTo({top:Math.max(0,offset+fraction*sizes[target-1].height-(center?port.clientHeight/2:0)),left:0,behavior:'instant'});};
  useEffect(()=>{if(pdf && !pendingPosition.current)jump(anchor.page,target?target.rect[1]+target.rect[3]/2:0,!!target);},[pdf,anchor]);
  useEffect(()=>{const saved=pendingPosition.current;if(saved){jump(saved.page,saved.fraction);pendingPosition.current=null;}},[zoom,fit,width,height]);
  const remember=()=>{const port=viewport.current;if(!port)return;let offset=0;for(let i=0;i<sizes.length;i++){if(offset+sizes[i].height+16>port.scrollTop){pendingPosition.current={page:i+1,fraction:Math.max(0,(port.scrollTop-offset)/sizes[i].height)};break;}offset+=sizes[i].height+16;}};
  const trackPage=()=>{const port=viewport.current;if(!port)return;let offset=0;for(let i=0;i<sizes.length;i++){if(offset+sizes[i].height+16>port.scrollTop+port.clientHeight*.25){setPage(i+1);break;}offset+=sizes[i].height+16;}};
  return <aside className="evidence-panel" tabIndex={-1} aria-label="Source evidence">
    <div className="evidence-heading"><div><p className="eyebrow">Records</p></div></div>
    <div className="citation-meta"><strong>{evidence.title}</strong>{evidence.id.match(/^1201\d+$/) ? <a href={evidence.originalItemUrl ?? evidence.originalPdfUrl ?? `https://vva.vietnam.ttu.edu/images.php?img=/images/1201/${evidence.id}.pdf`} target="_blank" rel="noreferrer">Texas Tech Vietnam Archive · {evidence.id} ↗</a> : <span>{evidence.unit} · {evidence.id}</span>}</div>
    <div className="viewer-tools" aria-label="PDF controls">
      <span>Page {page} / {evidence.pageCount}</span>
      <div className="tool-divider" /><button onClick={() => { remember(); setZoom(z=>Math.max(.75,z-.25)); }} disabled={!pdf || zoom<=.75} aria-label="Zoom out">−</button><span className="zoom-label">{Math.round(zoom*100)}%</span><button onClick={() => { remember(); setZoom(z=>Math.min(4,z+.25)); }} disabled={!pdf || zoom>=4} aria-label="Zoom in">+</button><button className="fit-button" disabled={!pdf} aria-pressed={fit==="width" && zoom===1} onClick={() => { remember(); setFit("width"); setZoom(1); }}>Fit width</button><button className="fit-button" disabled={!pdf} aria-pressed={fit==="height" && zoom===1} onClick={() => { remember(); setFit("height"); setZoom(1); }}>Fit height</button>
    </div>
    <div ref={viewport} className="pdf-viewport" onScroll={trackPage} tabIndex={0} aria-label={`Original scan, page ${page}. Scroll to read the entire document.`} aria-busy={!error && !pdf}>
      {!error && !pdf && <div className="loading-note" role="status">Loading original scan…</div>}
      {error ? <div className="viewer-error" role="alert"><h3>Original unavailable in this viewer</h3><p>{error}</p><button onClick={()=>setAttempt(a=>a+1)}>Try again</button>{evidence.originalPdfUrl && <a href={`${evidence.originalPdfUrl}#page=${anchor.page}`} target="_blank" rel="noreferrer">Open original PDF ↗</a>}</div> :
        pdf && sizes.map((size,index)=><PdfPage key={index+1} pdf={pdf} page={index+1} width={size.width} height={size.height} anchor={anchor} root={viewport}/>)}

    </div>
    {highlightRegions(anchor).length>1 && <nav className="highlight-pages" aria-label="Highlighted passages">{highlightRegions(anchor).map((region,index)=><button key={index} onClick={()=>jump(region.page,region.rect[1]+region.rect[3]/2,true)}>Passage {index+1} · page {region.page}</button>)}</nav>}
    <div className="excerpt" aria-live="polite"><p className="eyebrow">SELECTED SOURCE · {anchor.pageLabel}</p><blockquote>{anchor.quote}</blockquote><p>{target ? anchor.alignmentReview?.status === 'human-confirmed' ? 'Highlighted passage region reviewed and confirmed.' : anchor.alignmentMethod === 'model' ? 'Highlighted passage region located by a local vision model; human review pending.' : 'Highlighted passage region, visually checked against the scan.' : 'Page reference only. Precise highlighting awaits alignment; the transcription retains its unresolved readings.'}</p>{page!==anchor.page && <button onClick={()=>jump(anchor.page,target?target.rect[1]+target.rect[3]/2:0,!!target)}>Return to cited page {anchor.page}</button>}</div>
    {reviewedPage&&<details className="reviewed-ocr"><summary>Reviewed transcription · page {page}</summary><pre>{reviewedPage.text}</pre>{evidence.id===approved1966.documentId && page===1 && <p>Review note: the middle character in the lower-right S&amp;C / SEC stamp remains uncertain.</p>}</details>}
    <div className="source-footer">{evidence.originalItemUrl && <a href={evidence.originalItemUrl} target="_blank" rel="noreferrer">Texas Tech catalog ↗</a>}{evidence.originalPdfUrl && <a href={`${evidence.originalPdfUrl}#page=${anchor.page}`} target="_blank" rel="noreferrer">Original PDF ↗</a>}<span>{import.meta.env.DEV?'Viewing your preserved local copy':evidence.originalPdfUrl ? 'Loading from Texas Tech' : 'Original URL verification pending'}</span></div>
  </aside>;
}
