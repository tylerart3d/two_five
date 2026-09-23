import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const base='data/units/5th_marines/2nd_battalion/';
const doc=JSON.parse(readFileSync(base+'research/1965_SOURCE_ANCHORS.json','utf8'));
const digest=(value: string|Buffer)=>createHash('sha256').update(value).digest('hex');
test.use({reducedMotion:'reduce'});

test('citation highlights its passage and retains its alignment review status',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/#post-return-transfers');
 await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy','false');
 await expect(page.getByTestId('source-highlight')).toBeVisible();
 await expect(page.locator('.excerpt')).toContainText('located by a local vision model; human review pending');
 const visible=await page.getByTestId('source-highlight').evaluate(el=>{
  const box=el.getBoundingClientRect(),port=el.closest('.pdf-viewport')!.getBoundingClientRect();
  return box.top>=port.top && box.bottom<=port.bottom;
 });
 expect(visible).toBe(true);
 await page.setViewportSize({width:1200,height:900});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 expect(errors).toEqual([]);
});

test('exercise explanation uses the approved reading and opens its highlighted source',async({page})=>{
 await page.goto('/#november-exercise');
 await expect(page.locator('.context-body')).toContainText('Golf Company');
 await expect(page.locator('#november-exercise')).toContainText('Tendertouch');
 await page.getByRole('button',{name:'Read the chronology · page 3 ↗'}).click();
 await expect(page.locator('.viewer-tools')).toContainText('Page 3 / 3');
 await expect(page.getByTestId('source-highlight')).toBeVisible();
 await expect(page.locator('.excerpt blockquote')).toContainText('TENDERTOUCH');
});

test('approved OCR preserves PDF, raw run, correction and resolved-text provenance',()=>{
 for(const id of ['1201048065','1201048066']){
  const reading=JSON.parse(readFileSync('data/ocr-runs/approved-reading-copies/'+id+'.json','utf8'));
  expect(digest(readFileSync(base+'chronologies/_files/'+id+'.pdf'))).toBe(reading.pdfSha256);
  for(const correction of reading.humanCorrections)expect(digest(readFileSync(correction.path))).toBe(correction.sha256);
  for(const p of reading.pages){
   expect(digest(readFileSync(reading.run+'/page-'+String(p.page).padStart(4,'0')+'.txt'))).toBe(p.rawSha256);
   expect(digest(p.text)).toBe(p.resolvedSha256);
  }
 }
});

test('scan renders and normalized highlight geometry survives zooming',async({page})=>{
 await page.goto('/#doherty-august');
 const canvas=page.locator('[data-pdf-page="2"] canvas');
 await expect(canvas).toBeVisible();
 const ink=await canvas.evaluate((c:HTMLCanvasElement)=>{
  const pixels=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;
  let dark=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]<80&&pixels[i+3]>0)dark++;return dark;
 });
 expect(ink).toBeGreaterThan(1000);
 const highlight=page.getByTestId('source-highlight');
 const before=(await highlight.boundingBox())!;
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();
 await expect.poll(async()=>(await highlight.boundingBox())!.width).toBeGreaterThan(before.width);
 const proportions=await highlight.evaluate(el=>{
  const r=el.getBoundingClientRect(),p=el.parentElement!.getBoundingClientRect();
  return [(r.x-p.x)/p.width,(r.y-p.y)/p.height,r.width/p.width,r.height/p.height];
 });
 const anchor=doc.anchors.find((a:any)=>a.id==='doherty-august');
 proportions.forEach((n,i)=>expect(n).toBeCloseTo(anchor.rect[i],2));
});

test('scrolling through the document retains highlights on their cited page',async({page})=>{
 await page.goto('/#doherty-august');
 const port=page.locator('.pdf-viewport');
 await expect(port).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
 await port.evaluate(el=>el.scrollTop=0);
 await expect(page.locator('.viewer-tools')).toContainText('Page 1 / 3');
 await expect(page.locator('[data-pdf-page="1"] .source-highlight')).toHaveCount(0);
 await expect(page.locator('[data-pdf-page="2"] .source-highlight')).toHaveCount(1);
 await page.getByRole('button',{name:'Return to cited page 2',exact:true}).click();
 await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
 await expect(page.getByTestId('source-highlight')).toBeInViewport();
});

test('fit width keeps the browsed page instead of returning to the citation',async({page})=>{
 await page.goto('/#camp-margarita');
 const port=page.locator('.pdf-viewport');
 await expect(port).toHaveAttribute('aria-busy','false');
 await expect(page.locator('.viewer-tools')).toContainText('Page 1 / 3');
 await port.evaluate(el=>{const sheet=el.querySelector<HTMLElement>('.pdf-sheet')!;el.scrollTop=sheet.offsetHeight+16;});
 await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();
 await expect(page.locator('.zoom-label')).toHaveText('125%');
 await page.getByRole('button',{name:'Fit width',exact:true}).click();
 await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
 await expect(page.locator('.zoom-label')).toHaveText('100%');
});

test('missing PDF keeps excerpt and external citation; retry recovers',async({page})=>{
 await page.route('**/evidence/1201048065.pdf',r=>r.fulfill({status:404,body:'Missing'}));
 await page.goto('/#doherty-december');
 await expect(page.getByRole('alert')).toBeVisible();
 const anchor=doc.anchors.find((a:any)=>a.id==='doherty-december');
 await expect(page.locator('blockquote')).toHaveText(anchor.quote);
 await expect(page.getByRole('link',{name:'Original PDF ↗',exact:true})).toHaveAttribute('href',doc.originalPdfUrl+'#page='+anchor.page);
 await expect(page.getByTestId('source-highlight')).toHaveCount(0);
 await page.unroute('**/evidence/1201048065.pdf');
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy','false');
 await expect(page.locator('[data-pdf-page="'+anchor.page+'"] canvas')).toBeVisible();
});

test('changed PDF is rejected instead of applying stale highlights',async({page})=>{
 await page.route('**/evidence/1201048065.pdf',r=>r.fulfill({status:200,contentType:'application/pdf',body:'different PDF'}));
 await page.goto('/#doherty-august');
 await expect(page.getByRole('alert')).toContainText('differs');
 await expect(page.getByTestId('source-highlight')).toHaveCount(0);
});

test('mobile keyboard source navigation works without page overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#doherty-august');
 await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy','false');
 const fit=page.getByRole('button',{name:'Fit height',exact:true});
 await fit.focus();await page.keyboard.press('Enter');
 await expect(fit).toHaveAttribute('aria-pressed','true');
 await expect(fit).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog',{name:'Source evidence',exact:true})).toHaveCount(0);
});
