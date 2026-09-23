import L from 'leaflet';
/** Illustrative curved ribbon; no claim to a historical road or ship track. */
export function movementArrow(start: L.LatLngExpression, end: L.LatLngExpression, boundaries: L.LatLngExpression[][] = [], scaleToDistance = false) {
  const a = L.CRS.EPSG3857.latLngToPoint(L.latLng(start), 10);
  const b = L.CRS.EPSG3857.latLngToPoint(L.latLng(end), 10);
  const d = b.subtract(a), length = d.distanceTo(L.point(0,0));
  const halfWidth = scaleToDistance ? Math.max(5, length * .006) : 5;
  const n = L.point(-d.y / length, d.x / length);
  const control = a.add(d.multiplyBy(.5)).add(n.multiplyBy(length * .22));
  const point = (t: number) => a.multiplyBy((1-t)**2).add(control.multiplyBy(2*(1-t)*t)).add(b.multiplyBy(t*t));
  const projected = boundaries.map(ring => ring.map(p => L.CRS.EPSG3857.latLngToPoint(L.latLng(p),10)));
  const clear = (p: L.Point) => projected.every(ring => {
    let inside = false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++) {
      const a=ring[j], b=ring[i], d=b.subtract(a), squared=d.x*d.x+d.y*d.y;
      const t=squared ? Math.max(0,Math.min(1,((p.x-a.x)*d.x+(p.y-a.y)*d.y)/squared)) : 0;
      if(p.distanceTo(a.add(d.multiplyBy(t))) < 20) return false;
      if((a.y>p.y)!==(b.y>p.y) && p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x) inside=!inside;
    }
    return !inside;
  });
  let from=0, to=1;
  while(from<1 && !clear(point(from))) from+=.002;
  while(to>from && !clear(point(to))) to-=.002;
  const tip=point(to), neckT=from+(to-from)*.9;
  const left: L.Point[] = [], right: L.Point[] = [];
  for(let i=0;i<=30;i++) {
    const t=from+(neckT-from)*i/30, p=point(t);
    const tangent=control.subtract(a).multiplyBy(1-t).add(b.subtract(control).multiplyBy(t));
    const normal=L.point(-tangent.y,tangent.x).divideBy(tangent.distanceTo(L.point(0,0)));
    left.push(p.add(normal.multiplyBy(halfWidth))); right.push(p.subtract(normal.multiplyBy(halfWidth)));
  }
  const neck=point(neckT), tangent=tip.subtract(neck), normal=L.point(-tangent.y,tangent.x).divideBy(tangent.distanceTo(L.point(0,0)));
  const ring=[...left,neck.add(normal.multiplyBy(halfWidth * 3)),tip,neck.subtract(normal.multiplyBy(halfWidth * 3)),...right.reverse()];
  return L.polygon(ring.map(p=>L.CRS.EPSG3857.pointToLatLng(p,10)),{color:'#b19a45',weight:1.5,opacity:.85,fillColor:'#d6b954',fillOpacity:.65,interactive:false,className:'movement-route-arrow'});
}
