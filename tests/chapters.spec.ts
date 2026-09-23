import { test, expect } from '@playwright/test';

test('timeline arrows change chapter and source documents, and preserve deep links',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#map');
  await expect(page.getByRole('button',{name:'Previous chapter',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Next chapter',exact:true}).click();
  await expect(page.locator('h1')).toHaveText('The Road to Vietnam');
  await expect(page.locator('.chapter-narrative')).toContainText('Pearl Harbor');
  await expect(page.locator('.map-info')).toContainText('Across the Pacific');
  await expect(page.getByRole('button',{name:'Next chapter',exact:true})).toBeDisabled();
  await page.reload();
  await expect(page.locator('h1')).toHaveText('The Road to Vietnam');
  await page.getByRole('button',{name:'Read the Source'}).click();
  await expect(page.locator('.pdf-viewport[aria-busy="false"]')).toBeVisible();
  await expect(page.locator('.citation-meta')).toContainText('1201048066');
  await expect(page.locator('.viewer-tools')).toContainText('Page 5 / 8');
  await page.getByRole('button',{name:/The Road to Vietnam/}).click();
  await page.locator('.timeline-event-list button').filter({hasText:'Arrival at Chu Lai'}).click();
  await expect(page.locator('.pdf-viewport[aria-busy="false"]')).toBeVisible();
  await expect(page.locator('.citation-meta')).toContainText('1201048068');
  await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 78');
  await expect(page.getByTestId('source-highlight')).toBeVisible();
  await page.getByRole('button',{name:'Previous chapter',exact:true}).click();
  await expect(page.locator('h1')).toHaveText('Rebirth of the 2/5');
  await expect(page.locator('.source-window')).toHaveCount(0);
  await expect(page.getByRole('tab',{name:'Narrative',exact:true})).toHaveAttribute('aria-selected','true');
});
