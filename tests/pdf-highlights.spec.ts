import {test,expect} from '@playwright/test';
test('cross-page source keeps all three yellow regions and navigates between them',async({page})=>{
 await page.goto('/#ROAD-07');
 await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('[data-pdf-page="5"] .source-highlight')).toHaveCount(2);
 await expect(page.locator('[data-pdf-page="6"] .source-highlight')).toHaveCount(1);
 await page.getByRole('button',{name:'Passage 3 · page 6',exact:true}).click();
 await expect(page.locator('.viewer-tools')).toContainText('Page 6 /');
});

test('summary citation renders its formerly missing region',async({page})=>{
 await page.goto('/#post-return-transfers');
 await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('[data-pdf-page="1"] .source-highlight')).toHaveCount(1);
 await expect(page.locator('.excerpt')).toContainText('transferred to new commands');
});

test('each narrative document target has bounded highlight geometry',async()=>{
 const fs=await import('node:fs');
 const base='data/units/5th_marines/2nd_battalion/research/';
 const docs=[JSON.parse(fs.readFileSync(base+'1965_SOURCE_ANCHORS.json','utf8')), ...JSON.parse(fs.readFileSync(base+'1966_ROAD_SOURCE_ANCHORS.json','utf8')), JSON.parse(fs.readFileSync('data/shared/official_histories/1965_BOOK_SOURCE_ANCHORS.json','utf8'))];
 for(const file of ['1965_NARRATIVE.md','1966_ROAD_NARRATIVE.md']){
  const raw=fs.readFileSync(base+file,'utf8');
  const narrative=JSON.parse(raw.split('\x60\x60\x60json')[1].split('\x60\x60\x60')[0]);
  for(const source of narrative.sources.filter((s:{anchorId?:string})=>s.anchorId)){
   const doc=docs.find(d=>d.anchors.some((a:{id:string})=>a.id===source.anchorId));
   expect(doc,source.anchorId).toBeTruthy();
   const a=doc.anchors.find((a:{id:string})=>a.id===source.anchorId);
   const regions=a.regions??(a.rect?[{page:a.page,rect:a.rect}]:[]);
   expect(regions.length,source.anchorId).toBeGreaterThan(0);
   for(const r of regions){expect(r.page).toBeGreaterThan(0);expect(r.page).toBeLessThanOrEqual(doc.pageCount);expect(r.rect[0]+r.rect[2]).toBeLessThanOrEqual(1);expect(r.rect[1]+r.rect[3]).toBeLessThanOrEqual(1);}
  }
 }
});
