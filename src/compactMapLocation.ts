import L from 'leaflet';

/** Substitute a legible callout when both projected boundary dimensions are <20px. */
export function compactMapLocation(map: L.Map, group: L.LayerGroup, polygon: L.Polygon, label: L.Marker, name: string, color: string, lane = 0, subAreas?: L.LayerGroup, onFocus?: () => void) {
  const originalIcon = label.options.icon!;
  const position = label.getLatLng();
  const circle = L.circleMarker(position, {
    radius: 6, color, weight: 2, opacity: .5, fill: false,
    interactive: false, className: 'compact-location-circle'
  });
  const connector = L.polyline([], {color, weight: 1, opacity: .5, interactive: false, className: 'compact-location-connector'});
  const text = document.createElement(onFocus ? 'button' : 'span');
  if (text instanceof HTMLButtonElement) {
    text.type = 'button';
    text.setAttribute('aria-label', `Find ${name} on map`);
    text.addEventListener('click', event => { event.stopPropagation(); onFocus?.(); });
    L.DomEvent.disableClickPropagation(text);
  }
  text.className = 'compact-location-text';
  text.textContent = name.toUpperCase();
  text.style.color = color;
  const icon = L.divIcon({className: 'compact-location-label', html: text, iconSize: [230, 32], iconAnchor: [0, 16]});
  let compact: boolean | undefined;
  let tagAnimation: Animation | undefined;
  const update = () => {
    const bounds = polygon.getBounds();
    const a = map.latLngToLayerPoint(bounds.getNorthWest());
    const b = map.latLngToLayerPoint(bounds.getSouthEast());
    const small = Math.max(Math.abs(a.x-b.x), Math.abs(a.y-b.y)) < 20;
    const changed = compact !== small;
    const previous = changed && compact !== undefined && map.hasLayer(label)
      ? label.getElement()?.getBoundingClientRect() : undefined;
    if (compact !== small) {
      tagAnimation?.cancel();
      compact = small;
      if (small) {
        if (subAreas) group.removeLayer(subAreas);
        group.removeLayer(polygon);
        group.addLayer(circle);
        group.addLayer(connector);
        label.setIcon(icon);
      } else {
        if (subAreas) group.addLayer(subAreas);
        group.removeLayer(circle);
        group.removeLayer(connector);
        group.addLayer(polygon);
        label.setIcon(originalIcon).setLatLng(position);
      }
    }
    if (small) {
      const point = map.latLngToLayerPoint(position);
      const end = point.add(L.point(40, lane * 48));
      const direction = end.subtract(point);
      const start = point.add(direction.multiplyBy(6 / direction.distanceTo(L.point(0, 0))));
      connector.setLatLngs([map.layerPointToLatLng(start), map.layerPointToLatLng(end)]);
      label.setLatLng(map.layerPointToLatLng(end.add(L.point(6, 0))));
    }
    if (changed) {
      // Animate the contents only: Leaflet owns the marker's outer transform.
      const element = label.getElement();
      if (element) {
        const content = document.createElement('div');
        content.className = 'location-tag-motion';
        content.append(...Array.from(element.childNodes));
        element.append(content);
        if (previous && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const next = element.getBoundingClientRect();
          tagAnimation = content.animate([
            {transform: `translate(${previous.x-next.x}px, ${previous.y-next.y}px) scale(.92)`, opacity: .65},
            {transform: 'translate(0, 0) scale(1)', opacity: 1}
          ], {duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)'});
        }
      }
    }
  };
  const cancel = () => tagAnimation?.cancel();
  map.on('zoomstart unload', cancel);
  group.on('remove', cancel);
  map.on('zoomend moveend resize', update);
  group.on('add', update);
  update();
}

/** Point callouts never imply a geographic boundary. */
export function mapPointCallout(map: L.Map, group: L.LayerGroup, position: L.LatLngExpression, name: string, lane = 0, onSelect?:()=>void) {
  const origin = L.latLng(position), color = '#3b4a32';
  L.circleMarker(origin, {radius:6,color,weight:2,opacity:.5,fill:false,interactive:false,className:'route-location-circle'}).addTo(group);
  const text=document.createElement(onSelect?'button':'span'); if(onSelect){(text as HTMLButtonElement).type='button';text.addEventListener('click',onSelect);text.setAttribute('aria-label',`Find ${name}`);} text.className='compact-location-text'; text.textContent=name.toUpperCase(); text.style.color=color;
  const label=L.marker(origin,{icon:L.divIcon({className:'compact-location-label',html:text,iconSize:[230,32],iconAnchor:[0,16]}),interactive:false,keyboard:false}).addTo(group);
  const line=L.polyline([],{color,weight:1,opacity:.5,interactive:false}).addTo(group);
  const update=()=>{
    const p=map.latLngToLayerPoint(origin), end=p.add(L.point(40,lane*48)), delta=end.subtract(p);
    line.setLatLngs([map.layerPointToLatLng(p.add(delta.multiplyBy(6/delta.distanceTo(L.point(0,0))))),map.layerPointToLatLng(end)]);
    label.setLatLng(map.layerPointToLatLng(end.add(L.point(6,0))));
  };
  map.on('zoomend moveend resize',update); group.on('add',update); update();
}
