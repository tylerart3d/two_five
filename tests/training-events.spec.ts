import {test,expect} from '@playwright/test';
test('training additions navigate and retain distinct strength statements',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#chapter/rebirth-1965');
 await page.getByRole('button',{name:'Show events for Rebirth of the 2/5'}).click();
 const list=page.locator('.timeline-event-list');
 await list.getByRole('button',{name:/SEATO combined/}).click();
 await expect(page.locator('[data-event-id="seato-demonstration"]')).toContainText('ground maneuver element');
 await list.getByRole('button',{name:/special training program begins/}).click();
 await expect(page.locator('[data-event-id="special-training-november"]')).toContainText('approximately 50%');
 await list.getByRole('button',{name:/Helicopter movement from USS Princeton/}).click();
 await expect(page.locator('[data-event-id="princeton-exercise"]')).toContainText('approximately 40%');
 await expect(page.locator('[data-event-id="princeton-exercise"]')).toContainText('does not identify the three rifle companies');
 await page.getByRole('button',{name:/Read the Source/}).click();
 await list.getByRole('button',{name:/SEATO combined/}).click();
 await expect(page.locator('.viewer-tools')).toContainText('Page 2 / 3');
});

