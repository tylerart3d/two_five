import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base = 'data/units/5th_marines/2nd_battalion/';
const doc = JSON.parse(readFileSync(base+'research/1965_SOURCE_ANCHORS.json','utf8'));

test('McPartlin citation highlights its passage and identifies model alignment', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Read the Source' }).click();
  await page.getByRole('button', { name: /McPartlin/i }).click();
  await expect(page.locator('.pdf-viewport[aria-busy="false"]')).toBeVisible();
  await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
  await expect(page.getByTestId('source-highlight')).toBeVisible();
  await expect(page.locator('.excerpt')).toContainText('human review pending');
  const visible = await page.getByTestId('source-highlight').evaluate(el => {
    const box=el.getBoundingClientRect(), port=el.closest('.pdf-viewport')!.getBoundingClientRect();
    return box.top >= port.top && box.bottom <= port.bottom;
  });
  expect(visible).toBe(true);
});
test('exercise explanation preserves uncertainty and opens a page-only citation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Read the Source'}).click();
  await page.locator('.operation-context summary').click();
  await expect(page.locator('.context-body')).toContainText('Golf Company');
  await expect(page.locator('.source-caution')).toContainText('TIMBERTORCH');
  await expect(page.locator('.source-caution')).toContainText('TENDERTOUCH');
  await page.getByRole('button',{name:'Read the chronology · page 3 ↗'}).click();
  await expect(page.locator('.viewer-tools')).toContainText('Page 3 / 3');
  await expect(page.getByTestId('source-highlight')).toHaveCount(0);
  await expect(page.locator('.excerpt')).toContainText('Page reference only');
});
test('anchors retain the exact immutable OCR excerpts and PDF version', async () => {
  const ocr=readFileSync(base+'chronologies/_files/1201048065_vision_ocr.txt');
  expect(createHash('sha256').update(ocr).digest('hex')).toBe(doc.ocrSha256);
  expect(createHash('sha256').update(readFileSync(base+'chronologies/_files/1201048065.pdf')).digest('hex')).toBe(doc.pdfSha256);
  for(const a of doc.anchors) expect(ocr.subarray(a.ocrStart,a.ocrEnd).toString('utf8')).toBe(a.quote);
});
test('scan really renders; citations choose correct pages and preserve rectangles while zooming', async ({ page }) => {
  const errors: string[]=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#doherty-august');
  const ready=page.locator('.pdf-viewport[aria-busy="false"]'); await expect(ready).toBeVisible();
  const ink = await page.locator('canvas').evaluate((c: HTMLCanvasElement)=> {
    const pixels=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;
    let dark=0;for(let i=0;i<pixels.length;i+=4) if(pixels[i]<80 && pixels[i+3]>0)dark++;
    return dark;
  });
  expect(ink).toBeGreaterThan(1000);
  for(const [label,id] of [['19 July 1965','redesignation'],['December roster','doherty-december'],['Camp Margarita, Camp Pendleton','camp-margarita'],['helicopter movement from USS Princeton','princeton-exercise'],['First Lieutenant J. J. Doherty','doherty-august']]) {
    const a=doc.anchors.find((a:any)=>a.id===id);
    await page.getByRole('button',{name:label,exact:true}).click();await expect(ready).toBeVisible();
    await expect(page.locator('.viewer-tools')).toContainText(`Page ${a.page} / 3`);
    await expect(page.locator('blockquote')).toHaveText(a.quote);
    const before=await page.getByTestId('source-highlight').boundingBox();
    await page.locator('.evidence-panel').getByRole('button',{name:'Zoom in',exact:true}).click();await expect(ready).toBeVisible();
    const after=await page.getByTestId('source-highlight').boundingBox();expect(after!.width).toBeGreaterThan(before!.width);
    const proportions=await page.getByTestId('source-highlight').evaluate(el=>{
      const r=el.getBoundingClientRect(),p=el.parentElement!.getBoundingClientRect();
      return [(r.x-p.x)/p.width,(r.y-p.y)/p.height,r.width/p.width,r.height/p.height];
    });
    proportions.forEach((n,i)=>expect(n).toBeCloseTo(a.rect[i],2));
  }
  expect(errors).toEqual([]);
});
test('page navigation hides irrelevant highlights and returns to citation', async ({ page }) => {
  await page.goto('/#doherty-august'); await expect(page.locator('.pdf-viewport[aria-busy="false"]')).toBeVisible();
  await page.getByRole('button',{name:'Previous PDF page'}).click();
  await expect(page.getByTestId('source-highlight')).toHaveCount(0);
  await page.getByRole('button',{name:'Return to cited page 2'}).click();
  await expect(page.getByTestId('source-highlight')).toBeVisible();
});
test('fit width keeps the browsed page instead of returning to the citation', async ({ page }) => {
  await page.goto('/#camp-margarita');
  const ready = page.locator('.pdf-viewport[aria-busy="false"]');
  await expect(ready).toBeVisible();
  await page.getByRole('button', { name: 'Next PDF page' }).click();
  await expect(ready).toBeVisible();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('.zoom-label')).toHaveText('125%');
  await expect(ready).toBeVisible();
  await page.getByRole('button', { name: 'Fit width', exact: true }).click();
  await expect(ready).toBeVisible();
  await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
  await expect(page.locator('.zoom-label')).toHaveText('100%');
  await expect(page.getByTestId('source-highlight')).toHaveCount(0);
});

test('missing PDF keeps excerpt and external citation; retry recovers', async ({ page }) => {
  await page.route('**/evidence/1201048065.pdf',r=>r.fulfill({status:404,body:'Missing'}));
  await page.goto('/#doherty-december');await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('blockquote')).toHaveText('1stLt J.J. DOHERTY');
  await expect(page.getByRole('link',{name:'Original PDF ↗',exact:true})).toHaveAttribute('href',doc.originalPdfUrl+'#page=1');
  await expect(page.getByTestId('source-highlight')).toHaveCount(0);
  await page.unroute('**/evidence/1201048065.pdf');await page.getByRole('button',{name:'Try again'}).click();
  await expect(page.locator('.verified')).toBeVisible();await expect(page.locator('.pdf-viewport[aria-busy="false"]')).toBeVisible();
});
test('changed PDF is rejected instead of applying stale highlights', async ({ page }) => {
  await page.route('**/evidence/1201048065.pdf',r=>r.fulfill({status:200,contentType:'application/pdf',body:'different PDF'}));
  await page.goto('/#doherty-august');await expect(page.getByRole('alert')).toContainText('differs');
  await expect(page.getByTestId('source-highlight')).toHaveCount(0);
  await expect(page.locator('.verified')).toHaveCount(0);
});
test('mobile keyboard citation works without page overflow', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#doherty-august');await expect(page.locator('.pdf-viewport[aria-busy="false"]')).toBeVisible();
  await page.getByRole('button',{name:'December roster',exact:true}).focus();await page.keyboard.press('Enter');
  await expect(page.getByRole('button',{name:'December roster',exact:true})).toBeFocused();
  await expect(page.locator('.viewer-tools')).toContainText('Page 1 / 3');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
