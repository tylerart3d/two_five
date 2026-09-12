import L from 'leaflet';

// Fixed-size illustrative symbol, deliberately not geographic ship geometry.
export const princetonPosition: [number,number] = [33.2761559829947,242.48148356453657];
export function princetonSymbol(map: L.Map, group: L.LayerGroup, onSelect:()=>void) {
  const button=document.createElement('button');
  button.type='button';
  button.className='princeton-symbol';
  button.setAttribute('aria-label','USS Princeton — illustrative position');
  button.innerHTML='<svg viewBox="0 0 100 240" aria-hidden="true"><path class="carrier-deck" d="M37 7 L61 7 L70 19 L73 38 L73 68 L79 73 L79 121 L73 126 L73 201 L67 227 L29 227 L23 209 L23 167 L17 167 L17 137 L23 137 L23 42 L27 21 Z"/><path class="carrier-detail" d="M33 26 H65 M33 215 H64 M47 30 V205" stroke-dasharray="5 5"/><path class="carrier-island" d="M66 74 H78 V119 H66 Z"/><path class="carrier-detail" d="M72 67 V126 M63 86 H83 M65 105 H81"/></svg><span>USS PRINCETON</span><small>Estimated position</small>';
  button.addEventListener('click',onSelect);
  L.DomEvent.disableClickPropagation(button);
  const marker = L.marker(princetonPosition,{icon:L.divIcon({className:'princeton-marker',html:button,iconSize:[160,100],iconAnchor:[80,36]}),interactive:false,keyboard:false}).addTo(group);

  const update=()=>{
    const y=map.getSize().y/2;
    const span=map.distance(map.containerPointToLatLng([0,y]),map.containerPointToLatLng([100,y]));
    button.classList.toggle('is-compact',span>=8046.72);
  };
  map.on('zoomend moveend resize',update);
  group.on('add',update);
  map.once('unload',()=>map.off('zoomend moveend resize',update));
  update();
  return marker;
}

