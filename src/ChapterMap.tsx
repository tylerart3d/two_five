import kinBeach from '../data/geography/places/KIN_BEACH.json';
import {kinBeachMarker} from './kinBeachMarker';
import type {ChapterEvent} from './chronology';
import schwabTravel from '../data/geography/places/TRAVEL_TO_CAMP_SCHWAB.json';
import schwabTraining from '../data/geography/places/CAMP_SCHWAB_TRAINING.json';
import voyagePhotos from '../data/geography/landmarks/PEARL_HARBOR_VOYAGE_PHOTOS.json';
import pearlTravel from '../data/geography/places/TRAVEL_TO_PEARL_HARBOR.json';
import pacificCities from '../data/geography/places/CHAPTER_01_CITIES.json';
import {cityRoadLayers} from './cityRoadLayers';
import cityRoadData from '../data/geography/places/CHAPTER_00_ROADS_CITIES.json';
import movement from '../data/geography/places/PENDLETON_TO_LONG_BEACH.json';
import { movementArrow } from './movementArrow';
import { RetryTileLayer } from './RetryTileLayer';
import mcrdPhotos from '../data/geography/landmarks/MCRD_PHOTOS.json';
import pendletonPhotos from '../data/geography/landmarks/PENDLETON_PHOTOS.json';
import helicopterPhotos from '../data/geography/landmarks/USS_PRINCETON_HELICOPTER_PHOTOS.json';
import { LocationAlbum } from './LocationAlbum';
import apolloPhoto from '../data/geography/landmarks/USS_PRINCETON_APOLLO_PHOTO.json';
import princetonPhoto from '../data/geography/landmarks/USS_PRINCETON_PHOTO.json';
import { princetonSymbol, princetonPosition } from './princetonSymbol';
import mcrdBoundary from '../data/geography/places/MCRD_SAN_DIEGO_BOUNDARY.json';
import mcrd from '../data/geography/landmarks/MCRD_SAN_DIEGO.json';
import chapterLocations from '../data/geography/places/CHAPTER_00_LOCATIONS.json';
import longBeachBoundaryRaw from '../data/geography/places/LONG_BEACH_PORT.md?raw';
import pearlBoundaryRaw from '../data/geography/places/PEARL_HARBOR.md?raw';
import pierRaw from '../data/geography/landmarks/LONG_BEACH_PIER_E.md?raw';
import pearlRaw from '../data/geography/landmarks/PEARL_HARBOR.md?raw';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CoverageTileLayer } from './CoverageTileLayer';
import { compactMapLocation, mapPointCallout } from './compactMapLocation';
import 'leaflet/dist/leaflet.css';
import boundaryRaw from '../data/geography/places/CAMP_PENDLETON_DISPLAY.json?raw';
import schwabRaw from '../data/geography/places/CAMP_SCHWAB.md?raw';
import trainingRaw from '../data/geography/places/CENTRAL_TRAINING_AREA_DISPLAY.md?raw';
import henokoRaw from '../data/geography/places/HENOKO_AMMUNITION.md?raw';
import raw from '../data/units/5th_marines/2nd_battalion/research/1965_MAP.md?raw';
const place = JSON.parse(raw.match(/```json\s*([\s\S]*?)```/)![1]) as { name: string; coordinates: [number, number]; sourceAnchor: string; coordinateSource: string; precision: string; context: string; contextSources: {title:string;url:string}[] };

const boundary = JSON.parse(boundaryRaw) as { name: string; labelPosition: [number, number]; rings: [number, number][][]; source: string; precision: string; context: string; contextSources: {title:string;url:string}[] };
const longBeachBoundary = JSON.parse(longBeachBoundaryRaw.match(/```json\s*([\s\S]*?)```/)![1]) as typeof boundary;
const longBeachCoordinates = longBeachBoundary.rings.map(ring=>ring.map(([lng,lat])=>L.latLng(lat,((lng%360)+360)%360)));
const longBeachBounds = L.latLngBounds(longBeachCoordinates.flat());
const schwab = JSON.parse(schwabRaw.match(/```json\s*([\s\S]*?)```/)![1]) as typeof boundary;
const associatedAreas = [trainingRaw, henokoRaw].map(raw => JSON.parse(raw.match(/```json\s*([\s\S]*?)```/)![1]) as typeof boundary);
// Keep display coordinates in the same Pacific-centered world copy.
// California uses ~243 degrees east; Okinawa uses ~128, avoiding a 308-degree flight.
const pacificLongitude = (longitude: number) => ((longitude % 360) + 360) % 360;
const pacificPosition = ([lat, lng]: [number, number]): [number, number] => [lat, pacificLongitude(lng)];
const californiaPosition = pacificPosition(place.coordinates);
const schwabBounds = L.latLngBounds([schwab, ...associatedAreas].flatMap(area => area.rings.flatMap(ring => ring.map(([lng, lat]) => L.latLng(lat, pacificLongitude(lng))))));

const pearlBoundary = JSON.parse(pearlBoundaryRaw.match(/```json\s*([\s\S]*?)```/)![1]) as {name:string; labelPosition:[number,number]; polygons:[number,number][][][]; precision:string; sources:{url:string;name:string}[]};
const pearlCoordinates = pearlBoundary.polygons.map(polygon=>polygon.map(ring=>ring.map(([lng,lat])=>L.latLng(lat,pacificLongitude(lng)))));

const pierContext = JSON.parse(pierRaw.match(/```json\s*([\s\S]*?)```/)![1]) as {name:string; precision:string; paragraphs:typeof movement.paragraphs};
const routePlaces = [pierRaw, pearlRaw].map(raw => JSON.parse(raw.match(/```json\s*([\s\S]*?)```/)![1]) as {id:string; name:string; coordinates:[number,number]; source:string; precision:string});

// Frame the two ends of the journey against the actual overlay columns.
function pacificOverview(instance: L.Map, animate = true) {
  const size = instance.getSize();
  const canvas = instance.getContainer().getBoundingClientRect();
  const left = document.querySelector('.story')?.getBoundingClientRect();
  const right = document.querySelector('.map-info')?.getBoundingClientRect();
  const desktop = size.x > 760;
  const westX = desktop ? (left ? left.right-canvas.left : size.x*.25)+28 : size.x*.12;
  const eastX = desktop ? (right ? (right.left+right.right)/2-canvas.left : size.x*.875) : size.x*.88;
  const west = instance.project(pacificPosition(schwab.labelPosition), 0);
  const east = instance.project(californiaPosition, 0);
  const zoom = Math.log2(Math.max(100,eastX-westX)/(east.x-west.x));
  const scale = 2**zoom;
  const center = L.point(west.x*scale + size.x/2-westX, (west.y+east.y)*scale/2 + size.y*.05);
  instance.stop().flyTo(instance.unproject(center,zoom),zoom,{duration:1.8,animate:animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches});
}

export function ChapterMap({ road=false, onSource, mapRequest, selectedEvent, onLocationSelect }: { selectedEvent?:ChapterEvent|null; onLocationSelect?:()=>void; mapRequest?:{destination:string;sequence:number}|null; road?:boolean; onSource?: (id: string) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const california = useRef<L.LayerGroup | null>(null);
  const okinawa = useRef<L.LayerGroup | null>(null);
  const legend = useRef<HTMLDivElement>(null);
  const layersControl = useRef<L.Control.Layers | null>(null);
  const scaleHost = useRef<HTMLDivElement>(null);
  const [scope, setScope] = useState('region');
  const roadRef = useRef(road);
  roadRef.current = road;
  const [tileError, setTileError] = useState(false);
  useEffect(()=>{
    const host=legend.current,main=host?.closest('main');
    if(!host||!main)return;
    let observed:HTMLElement|null=null;
    const measure=()=>{const height=observed?.getBoundingClientRect().height;if(height&&height>0){host.style.setProperty('--timeline-height',height+'px');main.style.setProperty('--timeline-height',height+'px');}};
    const resize=new ResizeObserver(measure);
    const bind=()=>{const next=main.querySelector<HTMLElement>('.chapter-timeline');if(next!==observed){if(observed)resize.unobserve(observed);observed=next;if(next)resize.observe(next);}measure();};
    const mutations=new MutationObserver(bind);mutations.observe(main,{childList:true,subtree:true});bind();
    return()=>{resize.disconnect();mutations.disconnect();};
  },[]);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const instance = L.map(container.current!, { scrollWheelZoom: true, zoomControl: false, zoomSnap: 0, zoomAnimation: !reduced, fadeAnimation: false }).setView(road ? [25, 180] : californiaPosition, road ? 2 : 9);
    map.current = instance;
    const tile = (url: string, attribution: string, opacity = 1) => {
      const esri = url.includes('arcgisonline.com');
      const maxNativeZoom = url.includes('World_Hillshade') ? 16 : url.includes('stadiamaps') ? 20 : 19;
      // Keep recently viewed neighbors and reuse the current zoom during flights.
      // Independent fades in the two-layer terrain blend cause brightness pulses.
      const options = { maxZoom: 22, maxNativeZoom, attribution, opacity,
        keepBuffer: 4, updateWhenZooming: false, updateWhenIdle: false, updateInterval: 150 };
      const layer = esri ? new CoverageTileLayer(url + '?blankTile=false', options) : new RetryTileLayer(url, options);
      return layer.on('tileerror', () => setTileError(true));
    };
    const reliefUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}';
    const terrainUrl = 'https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}.png';
    const terrainCredit = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    const layers = {
      'Terrain + Water': L.layerGroup([tile(reliefUrl, 'Esri, USGS'), tile(terrainUrl, terrainCredit, 0.4)]),
      'Terrain Only': tile(terrainUrl, terrainCredit),
      'Relief (Hillshade)': tile(reliefUrl, 'Esri, USGS'),
      'Relief (Dark)': tile('https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}', 'Esri, USGS'),
      'Satellite': tile('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'Esri, Maxar, Earthstar Geographics'),
      'Street Map': tile('https://tile.openstreetmap.org/{z}/{x}/{y}.png', '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>')
    };
    layers['Terrain + Water'].addTo(instance);
    const layerControl = L.control.layers(layers, {}, { position: 'bottomright' }).addTo(instance);
    layersControl.current = layerControl;
    legend.current!.append(layerControl.getContainer()!);
    instance.on('baselayerchange', () => setTileError(false));
    const baseOutline = L.polygon(boundary.rings.map(ring => ring.map(([lng, lat]) => L.latLng(lat, pacificLongitude(lng)))), {
      color: '#3b4a32', weight: 2, opacity: .5, fillColor: '#3b4a32', fillOpacity: .1,
      className: 'pendleton-boundary', interactive: true
    }).addTo(instance);
    baseOutline.on('click', () => focus('pendleton'));
    const pendletonTag = document.createElement('button');
    pendletonTag.type = 'button';
    pendletonTag.className = 'pendleton-map-button';
    pendletonTag.setAttribute('aria-label', 'Go to Camp Pendleton');
    pendletonTag.title = 'Go to Camp Pendleton';
    pendletonTag.innerHTML = '<span>CAMP PENDLETON</span><small>SETTING · MARINE CORPS BASE</small>';
    pendletonTag.addEventListener('click', () => focus('pendleton'));
    L.DomEvent.disableClickPropagation(pendletonTag);
    const baseLabel = L.marker(pacificPosition(boundary.labelPosition), {
      icon: L.divIcon({ className: 'base-name-tag', html: pendletonTag, iconSize: [190, 46], iconAnchor: [95, 23] }),
      interactive: false, keyboard: false
    }).addTo(instance);
    instance.attributionControl.addAttribution('<a href="'+boundary.source+'">Boundary: SanGIS</a>');
    const boundaryOverlay = L.layerGroup([baseOutline, baseLabel]).addTo(instance);

    layerControl.addOverlay(boundaryOverlay, 'Camp Pendleton outline');
    const campMarker = L.layerGroup();
    mapPointCallout(instance, campMarker, californiaPosition, 'Camp Margarita', 0, ()=>focus('camp'));
    boundaryOverlay.addLayer(campMarker);
    compactMapLocation(instance, boundaryOverlay, baseOutline, baseLabel, boundary.name, '#3b4a32', 1, campMarker, ()=>focus('pendleton'));
    const depot = L.layerGroup().addTo(instance);
    const depotOutline = L.polygon(mcrdBoundary.rings.map(ring=>ring.map(([lng,lat])=>L.latLng(lat,pacificLongitude(lng)))),{color:'#3b4a32',weight:2,opacity:.5,fillColor:'#3b4a32',fillOpacity:.1,interactive:true}).addTo(depot);
    depotOutline.on('click',()=>focus('mcrd'));
    const depotButton=document.createElement('button');
    depotButton.type='button';depotButton.className='pendleton-map-button';depotButton.setAttribute('aria-label','Go to MCRD San Diego');depotButton.innerHTML='<span>MCRD SAN DIEGO</span><small>RECRUIT DEPOT</small>';
    depotButton.addEventListener('click',event=>{event.stopPropagation();focus('mcrd');});
    const depotLabel = L.marker(pacificPosition(mcrd.coordinates as [number,number]),{icon:L.divIcon({className:'base-name-tag',html:depotButton,iconSize:[190,46],iconAnchor:[95,23]}),interactive:false,keyboard:false}).addTo(depot);
    compactMapLocation(instance,depot,depotOutline,depotLabel,mcrd.name,'#3b4a32',0,undefined,()=>focus('mcrd'));
    instance.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright">MCRD boundary: © OpenStreetMap contributors · ODbL</a>');
    const ship = L.layerGroup().addTo(instance);
    princetonSymbol(instance,ship,()=>focus('princeton'));
    california.current = L.layerGroup([boundaryOverlay,depot,ship]);
    const schwabOutline = L.polygon(schwab.rings.map(ring => ring.map(([lng, lat]) => L.latLng(lat, pacificLongitude(lng)))), {
      color: '#3b4a32', weight: 2, opacity: .5, fillColor: '#3b4a32', fillOpacity: .1,
      className: 'schwab-boundary', interactive: false
    });
    const schwabLabel = L.marker(pacificPosition(schwab.labelPosition), {
      icon: L.divIcon({className: 'base-name-tag', html: '<span>CAMP SCHWAB</span><small>SETTING · MARINE CORPS BASE</small>', iconSize: [210, 46], iconAnchor: [105, 20]}),
      interactive: false, keyboard: false
    });
    okinawa.current = L.layerGroup([schwabOutline, schwabLabel]);
    okinawa.current.addLayer(boundaryOverlay);
    const kinGroup=L.layerGroup().addTo(okinawa.current);
    kinBeachMarker(instance,kinGroup,()=>focusDestination('kin-beach'));
    const portOutline=L.polygon(longBeachCoordinates,{color:'#3b4a32',weight:2,opacity:.5,fillColor:'#3b4a32',fillOpacity:.1,className:'long-beach-boundary',interactive:false});
    const portLabel=L.marker(pacificPosition(longBeachBoundary.labelPosition),{icon:L.divIcon({className:'base-name-tag',html:'<span>PORT OF LONG BEACH</span><small>PIER E · DEPARTURE</small>',iconSize:[210,46],iconAnchor:[105,55]}),interactive:false,keyboard:false});
    const portGroup=L.layerGroup([portOutline,portLabel]).addTo(okinawa.current);
    compactMapLocation(instance,portGroup,portOutline,portLabel,'Long Beach · Pier E','#3b4a32',-1,undefined,()=>focusDestination('long-beach-pier-e'));
    instance.attributionControl.addAttribution('<a href="'+longBeachBoundary.source+'">Long Beach boundary: USACE</a>');
    const pearlOutline=L.polygon(pearlCoordinates,{color:'#3b4a32',weight:2,opacity:.5,fillColor:'#3b4a32',fillOpacity:.1,className:'pearl-harbor-boundary',interactive:false});
    const pearlLabel=L.marker(pacificPosition(pearlBoundary.labelPosition),{icon:L.divIcon({className:'base-name-tag',html:'<span>PEARL HARBOR</span><small>NAVAL COMPLEX</small>',iconSize:[210,46],iconAnchor:[105,55]}),interactive:false,keyboard:false});
    const pearlGroup=L.layerGroup([pearlOutline,pearlLabel]).addTo(okinawa.current);
    compactMapLocation(instance,pearlGroup,pearlOutline,pearlLabel,'Pearl Harbor','#3b4a32',0,undefined,()=>focusDestination('pearl-harbor'));
    instance.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright">Pearl Harbor boundary: © OpenStreetMap contributors · ODbL</a>');
    const schwabSubAreas = L.layerGroup();
    associatedAreas.forEach((area, index) => {
      const areaColor = index === 0 ? '#69733c' : '#aa713d';
      const outline = L.polygon(area.rings.map(ring => ring.map(([lng, lat]) => L.latLng(lat, pacificLongitude(lng)))), {
        color: areaColor, weight: 2, opacity: .5, fillColor: areaColor, fillOpacity: .28,
        className: 'schwab-associated-boundary', interactive: false
      }).addTo(schwabSubAreas);
      {
        // Anchor the hatch in screen pixels so it stays legible at every zoom.
        const patternId = `training-hatch-${L.Util.stamp(outline)}`;
        outline.on('add', () => {
          const path = outline.getElement();
          const svg = path?.closest('svg');
          if (!path || !svg) return;
          if (!svg.querySelector(`#${patternId}`)) {
            const ns = 'http://www.w3.org/2000/svg';
            const defs = document.createElementNS(ns, 'defs');
            const pattern = document.createElementNS(ns, 'pattern');
            pattern.id = patternId;
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', '12');
            pattern.setAttribute('height', '12');
            pattern.setAttribute('patternTransform', 'rotate(45)');
            const background = document.createElementNS(ns, 'rect');
            background.setAttribute('width', '12');
            background.setAttribute('height', '12');
            background.setAttribute('fill', index === 0 ? '#b6ae52' : '#e9c18b');
            const stripe = document.createElementNS(ns, 'rect');
            stripe.setAttribute('width', '6');
            stripe.setAttribute('height', '12');
            stripe.setAttribute('fill', index === 0 ? '#52643b' : '#c48645');
            pattern.append(background, stripe);
            defs.append(pattern);
            svg.prepend(defs);
          }
          path.setAttribute('fill', `url(#${patternId})`);
          path.setAttribute('fill-opacity', '.28');
          path.classList.add(index === 0 ? 'training-area-hatched' : 'ammunition-area-hatched');
        });
      }
      const label = document.createElement('span');
      label.textContent = area.name.toUpperCase();
      const marker = L.marker(pacificPosition(area.labelPosition), {
        icon: L.divIcon({className: 'base-name-tag sub-area-name-tag', html: label, iconSize: [210, 46], iconAnchor: [105, 10]}),
        interactive: false, keyboard: false
      }).addTo(schwabSubAreas);
      compactMapLocation(instance, schwabSubAreas, outline, marker, area.name, areaColor, index === 0 ? -1 : 1);
    });
    compactMapLocation(instance, okinawa.current, schwabOutline, schwabLabel, schwab.name, '#3b4a32', 0, schwabSubAreas, ()=>focusDestination('schwab'));
    instance.attributionControl.addAttribution('<a href="https://www.openstreetmap.org/copyright">Schwab boundary: © OpenStreetMap contributors · ODbL</a>');
    const scale = L.control.scale({ imperial: true, metric: true }).addTo(instance);
    scaleHost.current!.append(scale.getContainer()!);
    const timeline = document.querySelector<HTMLElement>('.chapter-timeline');
    let resizeFrame = 0;
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
      instance.invalidateSize();
      if (timeline) {
        if (timeline.isConnected && timeline.offsetHeight > 0) legend.current?.style.setProperty('--timeline-height', `${timeline.offsetHeight}px`);
        timeline.closest('main')?.style.setProperty('--timeline-height', `${timeline.offsetHeight}px`);
      }
      });
    });
    if (timeline) resize.observe(timeline);
    resize.observe(container.current!);
    return () => { resize.disconnect(); cancelAnimationFrame(resizeFrame); instance.remove(); map.current = null; };
  }, []);
  useEffect(()=>{
    const instance=map.current,control=layersControl.current;
    if(!instance||!control)return;
    const {cities,roads,dispose}=cityRoadLayers(road,instance);
    if(!road)roads.addTo(instance);cities.addTo(instance);
    control.addOverlay(cities,'Major Cities');if(!road)control.addOverlay(roads,'Major Roads');
    return()=>{dispose();control.removeLayer(cities);control.removeLayer(roads);instance.removeLayer(cities);instance.removeLayer(roads);};
  },[road]);
  useEffect(() => {
    const instance=map.current;
    if (!instance) return;
    setScope('region');
    if (!road && okinawa.current) instance.removeLayer(okinawa.current);
    if (california.current) {
      if (road) california.current.eachLayer(layer=>instance.removeLayer(layer));
      else california.current.eachLayer(layer=>instance.addLayer(layer));
    }
    if (okinawa.current) {
      if (road) instance.addLayer(okinawa.current);
      else instance.removeLayer(okinawa.current);
    }
    if (road) pacificOverview(instance);
    else instance.stop().flyTo(californiaPosition,9,{duration:1.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
  }, [road]);
  useEffect(()=>{
    if(!mapRequest) return;
    if(['camp','pendleton','region','mcrd'].includes(mapRequest.destination)) focus(mapRequest.destination,true);
    else {
      if(okinawa.current && map.current) map.current.addLayer(okinawa.current);
      focusDestination(mapRequest.destination,true);
    }
  },[mapRequest]);
  useEffect(() => {
    const instance = map.current;
    if (!instance || !road || scope !== 'pendleton') return;
    const arrow = movementArrow(pacificPosition(boundary.labelPosition), pacificPosition(routePlaces[0].coordinates), [...boundary.rings.map(ring => ring.map(([lng,lat]) => L.latLng(lat,pacificLongitude(lng)))), ...longBeachCoordinates]).addTo(instance);
    return () => { instance.removeLayer(arrow); };
  }, [road, scope]);
  useEffect(() => {
    const root = container.current?.closest<HTMLElement>('.chapter-map');
    const setting = root?.querySelector<HTMLElement>('.map-info');
    const panel = root?.querySelector<HTMLElement>('.map-place');
    if (!root || !setting || !panel) return;
    const update = () => panel.style.setProperty('--location-panel-top', Math.max(0, setting.getBoundingClientRect().bottom - root.getBoundingClientRect().top + 12) + 'px');
    const observer = new ResizeObserver(update);
    observer.observe(setting);
    observer.observe(root);
    update();
    return () => { observer.disconnect(); panel.style.removeProperty('--location-panel-top'); };
  }, [scope, road, selectedEvent]);
  function focusDestination(id: string, fromEvent=false) {
    if(!fromEvent) onLocationSelect?.();
    setScope(id);
    if(id==='kin-beach'){const timelineHeight=document.querySelector('.chapter-timeline')?.getBoundingClientRect().height??160;map.current?.stop().flyToBounds(L.latLng(kinBeach.coordinates as [number,number]).toBounds(600),{maxZoom:14,paddingTopLeft:[window.innerWidth*.25+30,100],paddingBottomRight:[window.innerWidth*.25+30,timelineHeight+50],duration:1.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});return;}
    const bounds = id === 'travel-schwab' ? L.latLngBounds([pacificPosition(routePlaces[1].coordinates),pacificPosition(schwab.labelPosition)]) : id === 'schwab' ? schwabBounds : id === 'pearl-harbor' ? L.latLngBounds(routePlaces.map(place=>pacificPosition(place.coordinates))) : longBeachBounds;
    map.current?.stop().flyToBounds(bounds, {paddingTopLeft:[window.innerWidth*.25+30,100],paddingBottomRight:[window.innerWidth*.25+30,240],duration:1.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
  }
  function focus(scope: string, fromEvent=false) {
    if(!fromEvent) onLocationSelect?.();
    setScope(scope);
    if (scope === 'princeton') {
      map.current?.stop().flyTo(princetonPosition,12,{duration:1.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
      return;
    }
    if (scope === 'mcrd') {
      map.current?.stop().flyTo(pacificPosition(mcrd.coordinates as [number,number]),14,{duration:1.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
      return;
    }
    if (scope === 'pendleton' && roadRef.current) {
      const bounds = L.latLngBounds([pacificPosition(boundary.labelPosition), pacificPosition(routePlaces[0].coordinates)]);
      map.current?.stop().flyToBounds(bounds, {paddingTopLeft:[window.innerWidth*.25+30,100],paddingBottomRight:[window.innerWidth*.25+30,180],duration:1.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
      return;
    }
    if (scope === 'pendleton') {
      const bounds = L.latLngBounds(boundary.rings.flatMap(ring => ring.map(([lng,lat]) => L.latLng(lat,pacificLongitude(lng)))));
      map.current?.stop().flyToBounds(bounds, {paddingTopLeft:[window.innerWidth*.25+30,100],paddingBottomRight:[window.innerWidth*.25+30,240],duration:1.8,animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
      return;
    }
    // Stop an in-progress flight so a new selection responds immediately.
    // Leaflet's curved flight interpolates both scale and position continuously.
    map.current?.stop().flyTo(californiaPosition, scope === 'camp' ? 13 : 9, { duration: 1.8, animate: !matchMedia('(prefers-reduced-motion: reduce)').matches });
  }
  useEffect(() => {
    const instance=map.current;
    if(!instance || !road || !['pearl-harbor','travel-schwab'].includes(scope)) return;
    const route=(scope==='travel-schwab' ? movementArrow(pacificPosition(routePlaces[1].coordinates),pacificPosition(schwab.labelPosition),[...pearlCoordinates.flat(),...schwab.rings.map(ring=>ring.map(([lng,lat])=>L.latLng(lat,pacificLongitude(lng))))],true) : movementArrow(pacificPosition(routePlaces[0].coordinates),pacificPosition(routePlaces[1].coordinates),[...longBeachCoordinates,...pearlCoordinates.flat()],true)).addTo(instance);
    return ()=>{instance.removeLayer(route);};
  },[road,scope]);
  const movementContext = scope === 'travel-schwab' ? schwabTravel : scope === 'schwab' ? schwabTraining : scope === 'pearl-harbor' ? pearlTravel : scope === 'long-beach-pier-e' ? {title:pierContext.name, paragraphs:pierContext.paragraphs, precision:pierContext.precision} : movement;
  const location = scope === 'camp' ? {
    name: place.name, description: place.context, sources: place.contextSources,
    precision: place.precision
  } : scope === 'princeton' ? {
    name:'USS Princeton · LPH-5',
    description:'On November 19, 1965, Marines of 2/5 moved by helicopter from USS Princeton to Camp Pendleton during a landing exercise. Princeton’s deck log records flight quarters at 05:00 and the start of flight operations at 05:56 that morning, as the ship maneuvered offshore during amphibious refresher training. Later that day, the ship received ammunition from USS Mount Baker before returning to Long Beach. Helicopter activity aboard Princeton during the November 17–19 training period included CH-46A Sea Knights and UH-34 Seahorses, the troop-carrying aircraft used by Marine helicopter units. Later, on May 26, 1969, Princeton served as the prime recovery ship for Apollo 10 following its return from the Moon.',
    precision:'This silhouette is an illustrative Essex-class carrier symbol, not a measured plan. Placed approximately 4,100 yards offshore from the estimated midpoint of Pendleton’s beach, using the deck-log distance as a guide. This is an estimated location, not a verified November 19 position; heading and size are illustrative.',
    sources:[{title:'NASA · Apollo 10',url:apolloPhoto.historySource},{title:'Princeton · November 1965 deck log',url:'https://catalog.archives.gov/id/173486702'}]
  } : scope === 'mcrd' ? mcrd : chapterLocations[scope === 'pendleton' ? 'pendleton' : 'region'];
  return <section className="chapter-map" aria-label={road ? '1966 chapter map' : '1965 chapter map'}>
    {road ? <div className="map-info glass"><div className="map-heading"><p className="eyebrow">THE SETTING · 1966</p><h2>Across the Pacific</h2><p>Pendleton → Long Beach → Pearl Harbor → Okinawa → Chu Lai</p></div><div className="map-scopes"><button aria-pressed={scope==='region'} onClick={()=>{onLocationSelect?.();setScope('region');if (map.current) pacificOverview(map.current);}}>Pacific overview</button><button onClick={()=>focus('pendleton')}>Pendleton to Long Beach</button>{routePlaces.map(place=><button key={place.id} onClick={()=>focusDestination(place.id)}>{place.id==='pearl-harbor' ? 'Travel to Pearl Harbor' : `Go to ${place.name}`}</button>)}<button aria-pressed={scope==='travel-schwab'} onClick={()=>focusDestination('travel-schwab')}>Travel to Camp Schwab, Okinawa</button><button aria-pressed={scope==='schwab'} onClick={()=>focusDestination('schwab')}>Go to Camp Schwab</button><button aria-pressed={scope==='kin-beach'} onClick={()=>focusDestination('kin-beach')}>Go to Kin Beach</button></div></div> : <div className="map-info glass"><div className="map-heading"><p className="eyebrow">THE SETTING · 1965</p><h2>Southern California</h2><p>Camp Pendleton and the coast before Vietnam.</p></div>
    <div className="map-scopes" aria-label="Map views"><button aria-pressed={scope==='region'} onClick={()=>focus('region')}>Regional overview</button><button aria-pressed={scope==='pendleton'} onClick={()=>focus('pendleton')}>Go to Camp Pendleton</button><button aria-pressed={scope==='camp'} onClick={()=>focus('camp')}>Go to Camp Margarita</button><button aria-pressed={scope==='mcrd'} onClick={()=>focus('mcrd')}>Go to MCRD San Diego</button><button aria-pressed={scope==='princeton'} onClick={()=>focus('princeton')}>Go to USS Princeton</button></div>
    </div>}<div ref={container} className="map-canvas" role="region" aria-label={`Interactive modern map of ${road ? 'the Pacific' : 'Camp Pendleton'}. Use arrow keys to pan and plus or minus to zoom.`} />
    <div ref={legend} className="map-legend" aria-label="Map layer legend" />
    <div ref={scaleHost} className="map-distance" aria-label="Map distance scale" />
    {tileError && <p className="map-error" role="status">Some map tiles could not load. Try another layer using the map layer control.</p>}
    {selectedEvent ? <div className="map-place event-details" role="region" aria-label="Selected timeline event"><p className="eyebrow">{selectedEvent.date}</p><h3>{selectedEvent.title}</h3>{selectedEvent.record.paragraphs.map((paragraph,i)=><p key={i}>{paragraph.map((segment,j)=>{const source=selectedEvent.record.sources[segment.source??0];return onSource&&source ? <button key={j} className="inline-citation" onClick={()=>onSource(source.anchorId)}>{segment.text}</button> : <span key={j}>{segment.text}</span>;})}</p>)}</div> : road && scope==='kin-beach' ? <div className="map-place" role="region" aria-label="Location panel"><p className="eyebrow">AMPHIBIOUS TRAINING · 1966</p><h3>Kin Beach, Okinawa</h3><p>{onSource ? <button className="inline-citation" onClick={()=>onSource(kinBeach.anchorId)}>{kinBeach.description}</button> : kinBeach.description}</p>{onSource&&<details className="map-provenance"><summary>Sources &amp; map references</summary><p>{kinBeach.precision}</p><a href={kinBeach.source} target="_blank" rel="noreferrer">Kin Beach · supplied map location ↗</a></details>}</div> : road && (scope === 'pendleton' || scope === 'long-beach-pier-e' || scope === 'pearl-harbor' || scope === 'travel-schwab' || scope === 'schwab') ? <div className="map-place" role="region" aria-label="Location panel"><p className="eyebrow">{scope==='schwab' ? 'TRAINING · FEBRUARY–APRIL 1966' : scope==='travel-schwab' ? 'MOVEMENT · JANUARY–FEBRUARY 1966' : 'MOVEMENT · JANUARY 1966'}</p><h3>{movementContext.title}</h3><LocationAlbum key={scope} photos={scope==='pearl-harbor'||scope==='travel-schwab'?voyagePhotos:[]}>{movementContext.paragraphs.map((paragraph,i)=><p key={i}>{paragraph.map((segment,j)=>onSource ? <button key={j} className="inline-citation" onClick={()=>onSource(segment.anchorId)}>{segment.text}</button> : <span key={j}>{segment.text}</span>)}</p>)}{scope==='travel-schwab' && <button className="context-source" onClick={()=>focusDestination('schwab')}>Explore training at Camp Schwab →</button>}{scope==='schwab' && schwabTraining.training.map(item=><section key={item.title}><h4>{item.title}</h4><p>{onSource ? <button className="inline-citation" onClick={()=>onSource(item.anchorId)}>{item.text}</button> : item.text}</p></section>)}{scope==='pearl-harbor' && <div className="voyage-ships">{pearlTravel.ships.map(ship=><p key={ship.name}><strong>{onSource ? <a className="inline-citation" href={ship.url} target="_blank" rel="noreferrer">{ship.name}</a> : ship.name}</strong> — {ship.text}</p>)}</div>}{onSource && <details className="map-provenance"><summary>Sources &amp; map references</summary>{onSource && <p><button className="context-source" onClick={()=>onSource(scope==='schwab'?"ROAD-04":scope==='pearl-harbor'||scope==='travel-schwab'?"ROAD-03":"ROAD-LOAD-P3")}>Read the command chronology ↗</button></p>}<p>{movementContext.precision}</p>{(scope==='schwab'||scope==='travel-schwab') && <><p><a href={schwab.source} target="_blank" rel="noreferrer">Camp Schwab · map boundary source ↗</a></p>{associatedAreas.map(area=><p key={area.name}><a href={area.source} target="_blank" rel="noreferrer">{area.name} · map boundary source ↗</a></p>)}</>}</details>}</LocationAlbum></div> : road ? <div className="map-place"><p className="eyebrow">02 · TRAINING & TRANSIT</p><h3>{scope==='schwab' ? 'Camp Schwab, Okinawa' : 'Okinawa to Vietnam'}</h3><p>Camp Schwab and the Northern Training Area were central to the battalion’s preparation.</p><p>{onSource ? <button className="inline-citation" onClick={()=>onSource('ROAD-10')}>The battalion left Okinawa on April 8 and arrived at Chu Lai on April 13, 1966.</button> : 'The battalion left Okinawa on April 8 and arrived at Chu Lai on April 13, 1966.'}</p>{onSource && <details className="map-provenance"><summary>Map boundaries &amp; position sources</summary>{pacificCities.cities.map(city=><p key={city.name}><a href={city.source} target="_blank" rel="noreferrer">{city.name} · city reference ↗</a></p>)}<p className="map-era">Map reference: boundaries use newer geographic data; label positions are approximate and do not identify historical berths, barracks, or training sites.</p><p>Pendleton uses a modern SanGIS jurisdiction outline and an approximate Camp Margarita reference point. Central Training Area uses a combined display outline bridging narrow gaps in the original sections.</p><p><a href={boundary.source} target="_blank" rel="noreferrer">Pendleton · SanGIS boundary ↗</a></p><p><a href={place.coordinateSource} target="_blank" rel="noreferrer">Camp Margarita · coordinate source ↗</a></p><p>Camp Schwab, the Central Training Area, and Henoko Ammunition Supply Point are shown as separate modern reference areas. These outlines do not establish 1966 boundaries, historical camp ownership, or 2/5’s barracks and training sites. The Central Training Area is distinct from the Northern Training Area described in the narrative. Long Beach shows the USACE port limits (2020), including land and water; this is not a 1966 dock shoreline. Pier E remains the recorded departure location. Pearl Harbor shows the modern Pearl Harbor–Hickam land area and harbor waters, including Hickam; its 1966 perimeter and berths are unverified.</p>{routePlaces.map(place=><p key={place.id}><a href={place.source} target="_blank" rel="noreferrer">{place.name} · coordinate source ↗</a></p>)}<a href={schwab.source} target="_blank" rel="noreferrer">OpenStreetMap boundary source ↗</a><p><a href={longBeachBoundary.source} target="_blank" rel="noreferrer">Port of Long Beach · USACE boundary ↗</a></p>{pearlBoundary.sources.map(source=><p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name} · boundary source ↗</a></p>)}{associatedAreas.map(area=><p key={area.name}><a href={area.source} target="_blank" rel="noreferrer">{area.name} · boundary source ↗</a></p>)}</details>}</div> : <div className="map-place" role="region" aria-label="Location panel" key={scope}>
      <p className="eyebrow">LOCATION</p><h3>{location.name}</h3>
      <LocationAlbum photos={scope==='princeton' ? [princetonPhoto,...helicopterPhotos,apolloPhoto] : scope==='pendleton' && import.meta.env.DEV ? pendletonPhotos : scope==='mcrd' && import.meta.env.DEV ? mcrdPhotos : []}>
      <p>{location.description}</p>

      {onSource && <details className="map-provenance"><summary>Sources &amp; map references</summary>
        {location.sources.map(source=><p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></p>)}
        <p>{location.precision}</p><p>{cityRoadData.precision} Freeways fade between 10 and 20 miles from each city.</p><p><a href={cityRoadData.source} target="_blank" rel="noreferrer">Major roads · Census TIGER reference ↗</a></p>
        <p>The basemap shows present-day geography. Exercise sites and the Princeton flight route have not been established here.</p>
        <p><a href={boundary.source} target="_blank" rel="noreferrer">Pendleton boundary · SanGIS ↗</a></p>
        {scope==='camp' && <p><a href={place.coordinateSource} target="_blank" rel="noreferrer">Margarita coordinate reference · Wikimedia Commons ↗</a></p>}
      </details>}
      </LocationAlbum>
    </div>}
  </section>;
}











