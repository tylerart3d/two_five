import L from 'leaflet';
import beach from '../data/geography/places/KIN_BEACH.json';
/** Use Leaflet's 1/2/3/5/10 scale rounding, matching the 100px imperial scale. */
export function roundedScaleMiles(maxMiles:number) {
 const power=10**(String(Math.floor(maxMiles)).length-1),value=maxMiles/power;
 return power*(value>=10?10:value>=5?5:value>=3?3:value>=2?2:1);
}
export function kinBeachMarker(map:L.Map,parent:L.LayerGroup,onSelect:()=>void) {
 const position=beach.coordinates as [number,number], color='#276b9b';
 const point=L.circleMarker(position,{radius:6,color,weight:2,fillColor:color,fillOpacity:.85,className:'kin-beach-point'}).on('click',onSelect);
 const button=document.createElement('button');button.type='button';button.className='compact-location-text';button.textContent='KIN BEACH';button.style.color=color;button.setAttribute('aria-label','Go to Kin Beach');button.addEventListener('click',onSelect);L.DomEvent.disableClickPropagation(button);
 const label=L.marker(position,{icon:L.divIcon({className:'kin-beach-label',html:button,iconSize:[130,30],iconAnchor:[-12,15]}),interactive:false,keyboard:false});
 const visible=L.layerGroup([point,label]);
 const update=()=>{const y=map.getSize().y/2;const miles=map.distance(map.containerPointToLatLng([0,y]),map.containerPointToLatLng([100,y]))/1609.344;if(roundedScaleMiles(miles)<=beach.hideBeyondScaleMiles)parent.addLayer(visible);else parent.removeLayer(visible);};
 map.on('zoomend moveend resize',update);parent.on('add',update);update();
 map.once('unload',()=>{map.off('zoomend moveend resize',update);parent.off('add',update);});
}
