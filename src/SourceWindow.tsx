import { useEnhancedPhotos, setEnhancedPhotos } from './photoPreferences';
import { useLayoutEffect, useRef, useState } from 'react';
import { EvidenceViewer } from './EvidenceViewer';
import { documentFor, documents, type Anchor } from './evidence';

export function SourceWindow({ anchor, origin, onClose }: { anchor: Anchor; origin: HTMLElement | null; onClose: () => void }) {
  const enhancedPhotos=useEnhancedPhotos();
  const [activeAnchor,setActiveAnchor] = useState(anchor);
  useLayoutEffect(()=>setActiveAnchor(anchor),[anchor]);
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const frames = useRef<Keyframe[]>([]);
  useLayoutEffect(() => {
    const el = dialog.current!;
    el.show();
    const box = el.getBoundingClientRect();
    const button = origin?.getBoundingClientRect();
    const dx = button ? button.x + button.width / 2 - (box.x + box.width / 2) : 0;
    const dy = button ? button.y + button.height / 2 - (box.y + box.height / 2) : 70;
    frames.current = [
      { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(.12, .035)`, clipPath: 'polygon(35% 0,65% 0,100% 100%,0 100%)', offset: 0 },
      { opacity: .85, transform: `translate(${dx * .4}px, ${dy * .5}px) scale(.35, .6)`, clipPath: 'polygon(0 0,100% 0,72% 100%,28% 100%)', offset: .4 },
      { opacity: 1, transform: 'translate(0, 0) scale(1.015, 1)', clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', offset: .85 },
      { opacity: 1, transform: 'translate(0, 0) scale(1)', clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', offset: 1 }
    ];
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) animation.current = el.animate(frames.current, { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
    return () => { animation.current?.cancel(); el.close(); };
  }, [origin]);
  async function close() {
    if (closing.current) return;
    closing.current = true;
    animation.current?.cancel();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animation.current = dialog.current!.animate(frames.current, { duration: 420, direction: 'reverse', easing: 'cubic-bezier(.4,0,.8,.3)', fill: 'forwards' });
      await animation.current.finished.catch(() => {});
    }
    dialog.current?.close();
    onClose();
    origin?.focus({ preventScroll: true });
  }
  useLayoutEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') {event.preventDefault(); void close();} };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  });
  return <dialog ref={dialog} className="source-window" aria-label="Source evidence" onCancel={e => { e.preventDefault(); void close(); }}>
    <div className="source-window-bar"><span>ORIGINAL RECORD · SOURCE EVIDENCE</span><button autoFocus onClick={() => void close()} aria-label="Close source evidence">Close ×</button></div>
    <label className="source-document-picker">Source <select value={documentFor(activeAnchor).id} onChange={e=>setActiveAnchor(documents.find(doc=>doc.id===e.target.value)!.anchors[0])}>{documents.map(doc=><option key={doc.id} value={doc.id}>{doc.title}</option>)}</select></label>
    <label style={{padding:"0 18px 10px", display:"flex", gap:8, alignItems:"center"}}><input type="checkbox" role="switch" checked={enhancedPhotos} onChange={e=>setEnhancedPhotos(e.target.checked)}/>Enhanced Photos</label>
    <EvidenceViewer key={documentFor(activeAnchor).id} anchor={activeAnchor} />
  </dialog>;
}
