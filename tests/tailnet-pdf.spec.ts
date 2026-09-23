import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  // HTTP tailnet IPs have no SubtleCrypto. Emulate that browser capability
  // without tying the regression suite to one workstation or Tailscale IP.
  await page.addInitScript(()=>Object.defineProperty(window.crypto,'subtle',{value:undefined}));
});

test('PDF rendering and highlights work without Web Crypto',async({page})=>{
  await page.goto('/#camp-margarita');
  await expect(page.locator('.pdf-viewport')).toHaveAttribute('aria-busy','false');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('[data-pdf-page="1"] canvas')).toBeVisible();
  await expect(page.getByTestId('source-highlight')).toBeVisible();
});

test('fallback hashing still rejects a different PDF version',async({page})=>{
  await page.route('**/evidence/1201048065.pdf',route=>route.fulfill({status:200,contentType:'application/pdf',body:'different PDF'}));
  await page.goto('/#camp-margarita');
  await expect(page.getByRole('alert')).toContainText('differs');
  await expect(page.getByTestId('source-highlight')).toHaveCount(0);
});
