import {test,expect} from '@playwright/test';
test('expanded timeline arrows select adjacent events and retain focus',async({page})=>{
 await page.goto('/#return-san-diego');
 await page.getByRole('button',{name:/Show events for/}).click();
 const buttons=page.locator('.timeline-event-list button');
 await page.keyboard.press('ArrowDown');
 await expect(buttons.first()).toBeFocused();await expect(buttons.first()).toHaveAttribute('aria-pressed','true');
 await page.keyboard.press('ArrowUp');await expect(buttons.first()).toBeFocused();
 await page.keyboard.press('ArrowDown');await expect(buttons.nth(1)).toBeFocused();await expect(buttons.nth(1)).toHaveAttribute('aria-pressed','true');
 const expected=await buttons.nth(1).locator('strong').innerText();expect(expected.length).toBeGreaterThan(0);
 await expect(page).toHaveURL(/#redesignation$/);
 await buttons.last().focus();await page.keyboard.press('ArrowDown');await expect(buttons.last()).toBeFocused();await expect(buttons.last()).toHaveAttribute('aria-pressed','true');
 await expect(page).toHaveURL(/#AUDIT-CARGO-LOADED-JANUARY-8$/);
 await page.getByRole('button',{name:/Hide events for/}).click();await page.keyboard.press('ArrowUp');
 await expect(page.getByRole('button',{name:/Show events for/})).toBeFocused();
});
