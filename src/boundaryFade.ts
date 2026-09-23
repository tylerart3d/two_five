import L from 'leaflet';
type XY={x:number;y:number};
type View={left:number;right:number;top:number;bottom:number};
function area(ring:XY[]) {let sum=0;for(let i=0,j=ring.length-1;i<ring.length;j=i++)sum+=ring[j].x*ring[i].y-ring[i].x*ring[j].y;return Math.abs(sum)/2;}
function clip(ring:XY[],view:View) {
 let points=ring;
 for(const [axis,edge,lower] of [['x',view.left,true],['x',view.right,false],['y',view.top,true],['y',view.bottom,false]] as const){
  const input=points;points=[];if(!input.length)break;
  const inside=(p:XY)=>lower?p[axis]>=edge:p[axis]<=edge;
  for(let i=0,j=input.length-1;i<input.length;j=i++){
   const a=input[j],b=input[i];if(inside(a)!==inside(b)){const t=(edge-a[axis])/(b[axis]-a[axis]);points.push({x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)});}if(inside(b))points.push(b);
  }
 }return points;
}
function contains(ring:XY[],p:XY){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[j],b=ring[i];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)inside=!inside;}return inside;}
export function boundaryCoverage(rings:XY[][],view:View){
 const total=(view.right-view.left)*(view.bottom-view.top);if(total<=0)return 0;
 // Even/odd nesting matches SVG fills: disjoint islands add; holes subtract.
 const covered=rings.reduce((sum,ring,i)=>{if(!ring.length)return sum;const depth=rings.filter((other,j)=>i!==j&&other.length&&contains(other,ring[0])).length;return sum+area(clip(ring,view))*(depth%2?-1:1);},0);
 return Math.max(0,Math.min(1,covered/total));
}
export const boundaryFillFactor=(coverage:number)=>Math.max(0,Math.min(1,(.7-coverage)/.3));
const managers=new WeakMap<L.Map,ReturnType<typeof createManager>>();
function createManager(map:L.Map){
 const polygons=new Map<L.Polygon,number>();let frame=0;
 const main=map.getContainer().closest('main')??map.getContainer();
 const selectors='.story,.map-info,.map-place,.chapter-timeline';
 const observed=new Set<Element>();
 const visible=(el:Element)=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).display!=='none'?r:null;};
 const update=()=>{
  frame=0;const box=map.getContainer().getBoundingClientRect();const view:View={left:0,right:box.width,top:0,bottom:box.height};
  const story=main.querySelector('.story');const timeline=main.querySelector('.chapter-timeline');
  if(box.width>760){if(story){const r=visible(story);if(r)view.left=Math.max(0,r.right-box.left);}main.querySelectorAll('.map-info,.map-place').forEach(el=>{const r=visible(el);if(r)view.right=Math.min(view.right,r.left-box.left);});}
  else if(story){const r=visible(story);if(r)view.bottom=Math.min(view.bottom,r.top-box.top);}
  if(timeline){const r=visible(timeline);if(r)view.bottom=Math.min(view.bottom,r.top-box.top);}
  for(const [polygon,opacity] of polygons){if(!map.hasLayer(polygon))continue;const path=polygon.getElement();if(!(path instanceof SVGElement))continue;
   const rings:XY[][]=[];const walk=(value:unknown)=>{if(!Array.isArray(value)||!value.length)return;if(value[0] instanceof L.LatLng)rings.push((value as L.LatLng[]).map(p=>map.latLngToContainerPoint(p)));else value.forEach(walk);};walk(polygon.getLatLngs());
   const coverage=boundaryCoverage(rings,view);path.style.fillOpacity=String(opacity*boundaryFillFactor(coverage));path.setAttribute('data-boundary-coverage',coverage.toFixed(3));
  }
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 const resize=new ResizeObserver(schedule);
 const sync=()=>{const current=new Set<Element>([map.getContainer(),...main.querySelectorAll(selectors)]);for(const el of observed)if(!current.has(el)){resize.unobserve(el);observed.delete(el);}for(const el of current)if(!observed.has(el)){resize.observe(el);observed.add(el);}schedule();};
 const mutation=new MutationObserver(sync);mutation.observe(main,{childList:true,subtree:true});sync();
 map.on('move zoom resize zoomend moveend',schedule);
 map.once('unload',()=>{cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();map.off('move zoom resize zoomend moveend',schedule);for(const polygon of polygons.keys())polygon.off('add',schedule);polygons.clear();managers.delete(map);});
 return {add(polygon:L.Polygon){if(polygons.has(polygon))return;polygons.set(polygon,polygon.options.fillOpacity??.2);polygon.on('add',schedule);schedule();}};
}
/** Fade interior only. Stroke, hit testing, labels, and hatch patterns stay intact. */
export function fadeBoundaryInterior(map:L.Map,polygon:L.Polygon){let manager=managers.get(map);if(!manager){manager=createManager(map);managers.set(map,manager);}manager.add(polygon);}
