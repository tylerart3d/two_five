import { useEnhancedPhotos } from './photoPreferences';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Photo = {url:string; title:string; note:string; source:string; credit:string; rights:string; enhancedUrl?:string};
export function LocationAlbum({photos, children}: {photos:Photo[]; children:ReactNode}) {
  const album=useRef<HTMLElement>(null);
  const [index,setIndex]=useState(0);
  const [imageShape,setImageShape]=useState<{url:string;ratio:number}>();
  const dialog=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLButtonElement>(null);
  const photo=photos[index];
  const enhanced=useEnhancedPhotos();
  const imageUrl=enhanced && photo?.enhancedUrl ? photo.enhancedUrl : photo?.url;
  useEffect(()=>{
    const panel=album.current?.closest<HTMLElement>('.map-place');
    const map=panel?.closest<HTMLElement>('.chapter-map');
    const setting=map?.querySelector<HTMLElement>('.map-info');
    if(!photos.length || !panel || !map || !setting)return;
    const update=()=>panel.style.setProperty('--album-panel-top', (setting.getBoundingClientRect().bottom-map.getBoundingClientRect().top+12)+'px');
    panel.classList.add('has-photos');
    let layoutFrame=0;
    const observer=new ResizeObserver(()=>{cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(update);});
    observer.observe(setting);observer.observe(map);
    window.addEventListener('resize',update);update();
    return ()=>{cancelAnimationFrame(layoutFrame);observer.disconnect();window.removeEventListener('resize',update);panel.classList.remove('has-photos');panel.style.removeProperty('--album-panel-top');};
  },[photos.length]);
  const step=(delta:number)=>setIndex(i=>(i+delta+photos.length)%photos.length);
  const close=()=>{dialog.current?.close();opener.current?.focus();};
  const caption=photo && <div className="album-caption"><strong>{photo.title}</strong>{enhanced && photo.enhancedUrl && <span> · Photo Enhanced</span>}<p>{photo.note}</p>{photo.source ? <a href={photo.source} target="_blank" rel="noreferrer">{photo.credit}</a> : <span>{photo.credit}</span>}<span> · {photo.rights}</span><div aria-live="polite">{index+1} / {photos.length}</div></div>;
  const arrows=<><button className="album-prev" aria-label="Previous photo" onClick={()=>step(-1)}>‹</button><button className="album-next" aria-label="Next photo" onClick={()=>step(1)}>›</button></>;
  return <>
    {photo ? <figure ref={album} className="location-album"><div className="album-image" style={{aspectRatio:imageShape?.url===imageUrl ? imageShape.ratio : 16/9}}><button ref={opener} className="album-open" aria-label="Open photo album" onClick={()=>dialog.current?.showModal()}><img src={imageUrl} alt={photo.title} onLoad={e=>{const img=e.currentTarget;if(img.naturalHeight)setImageShape({url:imageUrl!,ratio:img.naturalWidth/img.naturalHeight});}}/></button>{arrows}</div><figcaption className="album-text" tabIndex={0} aria-label="Photo details and location description">{caption}{children}</figcaption></figure> : children}
    {photo && createPortal(<dialog ref={dialog} className="album-dialog" aria-label="Location photo album" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}}}>
      <button className="album-close" aria-label="Close photo album" autoFocus onClick={close}>×</button>
      <figure><div className="album-image"><img src={imageUrl} alt={photo.title}/>{arrows}</div><figcaption>{caption}</figcaption></figure>
    </dialog>,document.body)}
  </>;
}
