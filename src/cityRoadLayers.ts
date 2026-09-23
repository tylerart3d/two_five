import pacificCities from '../data/geography/places/CHAPTER_01_CITIES.json';
import L from 'leaflet';
import data from '../data/geography/places/CHAPTER_00_ROADS_CITIES.json';
export function cityRoadLayers(pacific=false, map?:L.Map) {
 const orange='#df8b39';
 const position=([lat,lng]:number[])=>L.latLng(lat,(lng+360)%360);
 const centers=data.cities.map(c=>L.latLng(c.position[0],c.position[1]));
 const cityMarkers=[...data.cities,...(pacific?pacificCities.cities:[])].map(c=>({
   pacific:pacificCities.cities.some(p=>p.name===c.name),
   marker:L.circleMarker(position(c.position),{radius:4,color:orange,weight:1,fillColor:orange,fillOpacity:1}).bindTooltip(c.name,{permanent:true,direction:'right',offset:[7,0],className:'major-city-label'})
 }));
 const islandMarkers=pacific?[
   {name:'Hawaii',position:[23,-158]},
   {name:'Okinawa',position:[28,127.95]}
 ].map(c=>L.marker(position(c.position),{interactive:false,keyboard:false,icon:L.divIcon({className:'island-name-label',html:c.name,iconSize:[180,36],iconAnchor:[90,18]})})):[];
 const cities=L.layerGroup([...cityMarkers.map(c=>c.marker),...islandMarkers]);
 const updateLabels=()=>{
   if(!pacific||!map)return;
   const t=Math.max(0,Math.min(1,(map.getZoom()-5.5)/2.5));
   const alpha=t*t*(3-2*t);
   for(const c of cityMarkers)if(c.pacific){c.marker.setStyle({opacity:alpha,fillOpacity:alpha});c.marker.getTooltip()?.setOpacity(alpha);}
   for(const marker of islandMarkers)marker.setOpacity(1-alpha);
 };
 const attach=()=>{map?.on('zoom',updateLabels);updateLabels();};
 const detach=()=>{map?.off('zoom',updateLabels);};
 cities.on('add',attach).on('remove',detach);
 const dispose=()=>{detach();cities.off('add',attach).off('remove',detach);};
 const buckets:L.LatLng[][][]=Array.from({length:16},()=>[]);
 for(const road of data.roads) for(let i=1;i<road.coordinates.length;i++) {
  const a=L.latLng(road.coordinates[i-1][0],road.coordinates[i-1][1]),b=L.latLng(road.coordinates[i][0],road.coordinates[i][1]);
  const steps=Math.max(1,Math.ceil(a.distanceTo(b)/400));
  for(let j=0;j<steps;j++) {
   const at=(t:number)=>L.latLng(a.lat+(b.lat-a.lat)*t,a.lng+(b.lng-a.lng)*t);
   const mid=at((j+.5)/steps),distance=Math.min(...centers.map(c=>c.distanceTo(mid)));
   if(distance>=32186.88)continue;
   const fade=Math.min(1,(32186.88-distance)/16093.44);
   const bucket=Math.min(15,Math.floor(fade*16));
   buckets[bucket].push([position([at(j/steps).lat,at(j/steps).lng]),position([at((j+1)/steps).lat,at((j+1)/steps).lng])]);
  }
 }
 const roads=L.layerGroup(buckets.map((lines,i)=>L.polyline(lines,{color:orange,weight:1.4,opacity:.8*(i+.5)/16,interactive:false,smoothFactor:.5,lineCap:'round'})));
 return {cities,roads,dispose};
}
