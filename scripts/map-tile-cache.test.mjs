import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mapTileCache } from './map-tile-cache.mjs';

const png = Buffer.from('89504e470d0a1a0a00000000','hex');
async function request(middleware, url='/map-tiles/osm/2/1/1.png') {
  const headers={}; let body;
  const res={statusCode:200,setHeader:(key,value)=>headers[key]=value,end:value=>{body=value;}};
  await middleware({url,method:'GET',headers:{referer:'http://reader/'}},res,()=>{throw new Error('unexpected next');});
  return {status:res.statusCode,headers,body};
}
test('disk cache survives recreation, deduplicates requests and conditionally refreshes expired tiles', async()=>{
  const directory=await mkdtemp(join(tmpdir(),'two-five-tiles-'));
  let clock=100000,calls=0;
  const fetchTile=async(url,{headers})=>{
    calls++;
    assert.equal(url,'https://tile.openstreetmap.org/2/1/1.png');
    assert.equal(headers.Referer,'http://reader/');
    assert.match(headers['User-Agent'],/TwoFiveResearchArchive/);
    if(calls===2){assert.equal(headers['If-None-Match'],'test-tag');return new Response(null,{status:304,headers:{'cache-control':'max-age=60'}});}
    return new Response(png,{headers:{'content-type':'image/png','cache-control':'max-age=60',etag:'test-tag'}});
  };
  const make=()=>mapTileCache({directory,fetchTile,now:()=>clock});
  try {
    const middleware=make();
    await Promise.all([request(middleware),request(middleware)]);
    assert.equal(calls,1);
    assert.equal((await request(make())).headers['X-Tile-Cache'],'HIT');
    assert.equal(calls,1);
    clock+=61000;
    assert.equal((await request(make())).headers['X-Tile-Cache'],'REVALIDATED');
    assert.equal(calls,2);
  } finally {await rm(directory,{recursive:true,force:true});}
});
test('provider errors are never cached and invalid paths never reach the provider', async()=>{
  const directory=await mkdtemp(join(tmpdir(),'two-five-tiles-'));
  let calls=0;
  const middleware=mapTileCache({directory,fetchTile:async()=>{calls++;return new Response(png,{status:429,headers:{'content-type':'image/png'}});}});
  try {
    assert.equal((await request(middleware)).status,502);
    assert.equal((await request(middleware)).status,502);
    assert.equal(calls,2);
    for(const path of ['/map-tiles/osm/2/4/1.png','/map-tiles/osm/99/1/1.png','/map-tiles/../../secret']) assert.equal((await request(middleware,path)).status,400);
    assert.equal(calls,2);
  } finally {await rm(directory,{recursive:true,force:true});}
});
