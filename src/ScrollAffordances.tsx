import { useEffect } from 'react';

// Track actual overflow so short panels and the end of a document stay clear.
export function ScrollAffordances() {
  useEffect(() => {
    const selector = '.story-body, .timeline-event-scroll, .map-place, .map-info, .leaflet-control-layers-list, .pdf-viewport, .source-window .evidence-panel';
    const tracked = new Map<HTMLElement, () => void>();
    let frame = 0;
    function sync() {
      for (const [el, dispose] of tracked) if (!el.isConnected) { dispose(); tracked.delete(el); }
      document.querySelectorAll<HTMLElement>(selector).forEach(el => {
        if (tracked.has(el)) return;
        el.classList.add('quiet-scroll');
        const text = !el.matches('.pdf-viewport, .evidence-panel');
        let timer: ReturnType<typeof setTimeout>;
        const update = () => el.classList.toggle('has-more-below', text && el.clientHeight > 0 && el.scrollHeight - el.clientHeight - el.scrollTop > 3);
        const onScroll = () => {
          update(); el.classList.add('is-scrolling'); clearTimeout(timer);
          timer = setTimeout(() => el.classList.remove('is-scrolling'), 900);
        };
        let resizeFrame = 0;
        const resize = new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(update); });
        resize.observe(el);
        const watchChildren = () => { resize.disconnect(); resize.observe(el); [...el.children].forEach(child => resize.observe(child)); update(); };
        const content = new MutationObserver(watchChildren);
        content.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open'] });
        watchChildren();
        el.addEventListener('scroll', onScroll, { passive: true });
        tracked.set(el, () => { clearTimeout(timer); cancelAnimationFrame(resizeFrame); resize.disconnect(); content.disconnect(); el.removeEventListener('scroll', onScroll); el.classList.remove('quiet-scroll', 'has-more-below', 'is-scrolling'); });
      });
    }
    const observer = new MutationObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(sync); });
    observer.observe(document.body, { childList: true, subtree: true });
    sync();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); tracked.forEach(dispose => dispose()); };
  }, []);
  return null;
}
