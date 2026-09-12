import { test, expect } from '@playwright/test';

test('story tabs separate narrative and chronology with keyboard and source navigation', async ({ page }) => {
  await page.goto('/#map');
  const narrative = page.getByRole('tab', { name: 'Narrative', exact: true });
  const chronology = page.getByRole('tab', { name: 'Chronology', exact: true });
  await expect(narrative).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-chronology')).toBeHidden();
  await narrative.focus(); await page.keyboard.press('ArrowRight');
  await expect(chronology).toBeFocused();
  await expect(page.locator('#panel-narrative')).toBeHidden();
  await expect(page.locator('.source-window')).toHaveCount(0);
  await narrative.click();
  await page.getByRole('button', { name: 'Read the Source' }).click();
  await expect(chronology).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.source-window')).toBeVisible();
});

test('scroll fade clears at the end and updates when switching panels', async ({ page }) => {
  await page.goto('/#map');
  const body = page.locator('.story-body');
  await expect(body).toHaveClass(/has-more-below/);
  await body.evaluate(el => { el.scrollTop = el.scrollHeight; });
  await expect(body).not.toHaveClass(/has-more-below/);
  await body.evaluate(el => { el.scrollTop = 0; });
  await expect(body).toHaveClass(/has-more-below/);
  await page.getByRole('tab', { name: 'Chronology', exact: true }).click();
  await expect(body).toHaveClass(/has-more-below/);
  await body.evaluate(el => { el.scrollTop = el.scrollHeight; });
  await expect(body).not.toHaveClass(/has-more-below/);
});
