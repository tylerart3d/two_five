import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
const base='data/units/5th_marines/2nd_battalion/research/';
const read=(path:string)=>JSON.parse(readFileSync(base+path,'utf8'));

test('JSON events preserve source references and chapter coverage',()=>{
  const chapter=read('chapters/rebirth-1965.json');
  const sources=[read('1965_SOURCE_ANCHORS.json'),...read('1966_ROAD_SOURCE_ANCHORS.json')];
  const records=readdirSync(base+'events').filter(f=>f.endsWith('.json')&&f!=='README.json').map(f=>read('events/'+f));
  expect(records).toHaveLength(33);
  expect(new Set(records.map(e=>e.id)).size).toBe(records.length);
  for(const event of records){
    expect(event.revisions.length).toBeGreaterThan(0);
    expect(event.researchStatus).toBeTruthy();
    for(const citation of event.sources){
      expect(sources.some(doc=>doc.id===citation.documentId && doc.anchors.some((a:any)=>a.id===citation.anchorId))).toBe(true);
    }
  }
  const membership=[chapter,read('chapters/road-1966.json')].flatMap(c=>c.sections.flatMap((s:any)=>s.eventIds));
  expect(membership.every((id:string)=>records.some(e=>e.id===id))).toBe(true);
  const timeline=chapter.timelineGroups.flatMap((g:any)=>g.eventIds);
  expect(timeline).toHaveLength(20);
  expect(timeline).not.toContain('camp-margarita');
  expect(records.find(e=>e.id==='doherty-december').date.precision).toBe('record-date');
});

test('timeline opens the corresponding JSON event and its source',async({page})=>{
  await page.goto('/#map');
  await page.getByRole('button',{name:/Rebirth of the 2/}).click();
  await page.getByRole('button',{name:/17 Sep 1965/}).click();
  const event=page.locator('[data-event-id="xo-september-17"]');
  await expect(event).toHaveAttribute('open','');
  await expect(event).toContainText('Bulger');
  await expect(page.locator('.source-window')).toHaveCount(0);
  await page.getByRole('button',{name:'Read the Source'}).click();
  await page.getByRole('button',{name:/17 Sep 1965/}).click();
  await expect(page).toHaveURL(/#xo-september-17$/);
  await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
});
