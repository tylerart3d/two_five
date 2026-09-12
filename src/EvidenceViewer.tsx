import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { documentFor, type Anchor } from './evidence';
GlobalWorkerOptions.workerSrc = workerUrl;
export function EvidenceViewer({ anchor }: { anchor: Anchor }) {
  const evidence = documentFor(anchor);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [page, setPage] = useState(anchor.page);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(650);
  const [size, setSize] = useState({ width: 650, height: 840 });
  const [rendering, setRendering] = useState(true);
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => { setPage(anchor.page); setZoom(1); }, [anchor]);
  useEffect(() => {
    if (!viewport.current) return;
    let frame = 0;
    const observer = new ResizeObserver(entries => {
      const nextWidth = Math.max(1, Math.floor(entries[0].contentRect.width));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(nextWidth));
    });
    observer.observe(viewport.current); return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    let stopped = false;
    const controller = new AbortController();
    let task: ReturnType<typeof getDocument> | undefined;
    setPdf(null); setError('');
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
        if (!stopped) setPdf(loaded);
      } catch (e) {
        if (!stopped) setError(e instanceof Error && e.message.includes('differs') ? e.message : 'The PDF could not be loaded here. You can still read the preserved excerpt below.');
      } finally { clearTimeout(timeout); }
    }
    void load();
    return () => { stopped = true; controller.abort(); clearTimeout(timeout); void task?.destroy(); };
  }, [attempt, evidence]);
  useEffect(() => {
    if (!pdf) return;
    let stopped = false;
    let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined;
    setRendering(true);
    async function render() {
      try {
        const p = await pdf!.getPage(page);
        if (stopped || !canvas.current) return;
        const natural = p.getViewport({ scale: 1 });
        const view = p.getViewport({ scale: width / natural.width * zoom });
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const buffer = document.createElement('canvas');
        buffer.width = Math.ceil(view.width * ratio); buffer.height = Math.ceil(view.height * ratio);
        task = p.render({ canvas: buffer, viewport: view, transform: [ratio,0,0,ratio,0,0] });
        await task.promise;
        if (stopped || !canvas.current) return;
        canvas.current.width = buffer.width; canvas.current.height = buffer.height;
        canvas.current.getContext('2d')!.drawImage(buffer, 0, 0);
        setSize({ width: view.width, height: view.height }); setRendering(false);
      } catch { if (!stopped) { setError(`Unable to render page ${page}. Open the original to inspect it.`); setRendering(false); } }
    }
    void render(); return () => { stopped = true; task?.cancel(); };
  }, [pdf, page, zoom, width, anchor]);
  useEffect(() => {
    if (rendering || !pdf || !viewport.current) return;
    const port = viewport.current, rect = page === anchor.page ? anchor.rect : null;
    port.scrollTo({ top: rect ? Math.max(0,(rect[1]+rect[3]/2)*size.height-port.clientHeight/2+20) : 0,
      left: rect ? Math.max(0,(rect[0]+rect[2]/2)*size.width-port.clientWidth/2+20) : 0, behavior: 'instant' });
  }, [rendering, pdf, size, page, anchor]);
  return <aside className="evidence-panel" tabIndex={-1} aria-label="Source evidence">
    <div className="evidence-heading"><div><p className="eyebrow">THE ORIGINAL RECORD</p><h2>Read the evidence</h2></div>{pdf && !error && <span className="verified">SHA-256 checked</span>}</div>
    <div className="citation-meta"><strong>{evidence.title}</strong><span>Texas Tech Vietnam Archive · {evidence.id}</span></div>
    <div className="viewer-tools" aria-label="PDF controls">
      <button onClick={() => setPage(p=>p-1)} disabled={!pdf || page===1} aria-label="Previous PDF page">←</button><span>Page {page} / {evidence.pageCount}</span><button onClick={() => setPage(p=>p+1)} disabled={!pdf || page===evidence.pageCount} aria-label="Next PDF page">→</button>
      <div className="tool-divider" /><button onClick={() => setZoom(z=>Math.max(.75,z-.25))} disabled={!pdf || zoom<=.75} aria-label="Zoom out">−</button><span className="zoom-label">{Math.round(zoom*100)}%</span><button onClick={() => setZoom(z=>Math.min(4,z+.25))} disabled={!pdf || zoom>=4} aria-label="Zoom in">+</button><button className="fit-button" onClick={() => setZoom(1)}>Fit width</button>
    </div>
    <div ref={viewport} className="pdf-viewport" tabIndex={0} aria-label={`Original scan, page ${page}. Use controls to zoom or change pages.`} aria-busy={!error && (!pdf || rendering)}>
      {!error && (!pdf || rendering) && <div className="loading-note" role="status">{pdf ? 'Rendering page…' : 'Loading original scan…'}</div>}
      {error ? <div className="viewer-error" role="alert"><h3>Original unavailable in this viewer</h3><p>{error}</p><button onClick={()=>setAttempt(a=>a+1)}>Try again</button>{evidence.originalPdfUrl && <a href={`${evidence.originalPdfUrl}#page=${anchor.page}`} target="_blank" rel="noreferrer">Open original PDF ↗</a>}</div> :
        <div className="pdf-sheet" style={{width:size.width,height:size.height,visibility:pdf && !rendering?'visible':'hidden'}}>
          <canvas ref={canvas} role="img" aria-label={`Scanned source page ${page}. Relevant excerpt is transcribed below.`} />
          {page===anchor.page && anchor.rect && <div className="source-highlight" data-testid="source-highlight" title={anchor.label} style={{left:`${anchor.rect[0]*100}%`,top:`${anchor.rect[1]*100}%`,width:`${anchor.rect[2]*100}%`,height:`${anchor.rect[3]*100}%`}} />}
        </div>}
    </div>
    <div className="excerpt" aria-live="polite"><p className="eyebrow">SELECTED SOURCE · {anchor.pageLabel}</p><blockquote>{anchor.quote}</blockquote><p>{anchor.rect ? anchor.alignmentMethod === 'model' ? 'Highlighted passage region located by a local vision model; human review pending.' : 'Highlighted passage region, visually checked against the scan.' : 'Page reference only. Precise highlighting awaits alignment; the transcription retains its unresolved readings.'}</p>{page!==anchor.page && <button onClick={()=>setPage(anchor.page)}>Return to cited page {anchor.page}</button>}</div>
    <div className="source-footer">{evidence.originalItemUrl && <a href={evidence.originalItemUrl} target="_blank" rel="noreferrer">Texas Tech catalog ↗</a>}{evidence.originalPdfUrl && <a href={`${evidence.originalPdfUrl}#page=${anchor.page}`} target="_blank" rel="noreferrer">Original PDF ↗</a>}<span>{import.meta.env.DEV?'Viewing your preserved local copy':evidence.originalPdfUrl ? 'Loading from Texas Tech' : 'Original URL verification pending'}</span></div>
  </aside>;
}
