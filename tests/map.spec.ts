import { test, expect } from '@playwright/test';

test('map opens first, focuses the camp and connects to the historical source', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('region', { name: '1965 chapter map', exact: true })).toBeVisible();
  await expect(page.locator('.evidence-panel')).toHaveCount(0);
  const before = await page.locator('.leaflet-control-scale-line').first().innerText();
  await page.locator('.map-scopes').getByRole('button', { name: 'Go to Camp Margarita' }).click();
  await expect(page.locator('.leaflet-control-scale-line').first()).not.toHaveText(before);
  await page.getByRole('button', { name: 'Read the Source' }).click();
  await expect(page.locator('.viewer-tools')).toContainText('Page 1 / 3');
  await page.getByText('Sources & map references', {exact:true}).click();
  await expect(page.locator('.map-provenance')).toContainText('present-day geography');
  await expect(page.getByRole('dialog', {name:'Source evidence',exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', {name:'Read the Source'})).toBeFocused();
  await expect(page.locator('.map-canvas')).toBeVisible();
});

test('mobile map remains usable with unavailable tiles and keyboard controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route(/(tile.openstreetmap.org|server.arcgisonline.com|tiles.stadiamaps.com)/, route => route.abort());
  await page.goto('/');
  await expect(page.locator('.map-error')).toBeVisible();
  const button = page.locator('.map-scopes').getByRole('button', { name: 'Go to Camp Margarita' });
  await button.focus(); await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Read the Source', exact: false }).click();
  await expect(page.locator('.evidence-panel')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

 test('map fills the shell and retains its camera behind evidence', async ({ page }) => {
 await page.goto('/');
 const stage = await page.locator('.map-stage').boundingBox();
 const map = await page.locator('.map-canvas').boundingBox();
 expect(map).toEqual(stage);
 await page.locator('.map-scopes').getByRole('button', {name:'Go to Camp Margarita'}).click();
 await expect(page.locator('.map-scopes').getByRole('button', {name:'Go to Camp Margarita'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button', {name:'Read the Source',exact:false}).click();
 await expect(page.locator('.map-canvas')).toBeVisible();
 await page.getByRole('button', {name:'Close source evidence',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(page.locator('.map-scopes').getByRole('button', {name:'Go to Camp Margarita'})).toHaveAttribute('aria-pressed','true');
 expect(await page.locator('.story').evaluate(el=>getComputedStyle(el, '::before').backdropFilter)).toContain('blur');
 });

test('missing high resolution relief crops a parent tile and overzooms without unavailable tiles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const levels: number[] = [];
  await page.route('**/World_Hillshade/MapServer/tile/**', route => {
    const z = Number(route.request().url().match(/tile\/(\d+)/)![1]); levels.push(z);
    return z > 14 ? route.fulfill({status:404}) : route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#789567"/></svg>'});
  });
  await page.route('**/tiles.stadiamaps.com/**', route => route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"/>'}));
  await page.goto('/');
  await page.locator('.map-scopes').getByRole('button', {name:'Go to Camp Margarita'}).click();
  await page.locator('.map-canvas').focus();
  for(let i=0;i<10;i++) await page.keyboard.press('Equal');
  await expect(page.locator('.leaflet-control-zoom')).toHaveCount(0);
  await expect(page.locator('.leaflet-tile-loaded img').first()).toBeVisible();
  expect(Math.max(...levels)).toBe(16);
  await expect.poll(()=>page.locator('.leaflet-tile-loaded img').evaluateAll(imgs=>imgs.some(img=>(img as HTMLImageElement).src.includes('/tile/14/')))).toBe(true);
  await expect(page.locator('.map-error')).toHaveCount(0);
});
