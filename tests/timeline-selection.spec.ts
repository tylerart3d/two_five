import {test,expect} from '@playwright/test';
test.use({reducedMotion:'reduce'});
for(const item of [
 {chapter:'rebirth-1965',event:'post-return-transfers',anchor:'post-return-transfers',next:'princeton-exercise',nextAnchor:'princeton-exercise'},
 {chapter:'road-1966',event:'road-combined-training',anchor:'ROAD-07',next:'road-training',nextAnchor:'ROAD-06'}
]) test(item.chapter+' timeline retains selection and opens highlighted evidence',async({page})=>{
 await page.goto('/#chapter/'+item.chapter);
 await page.locator('.timeline-list-toggle').click();
 const row=page.locator('[data-timeline-event="'+item.event+'"] button');
 await row.click();
 await expect(page.getByRole('region',{name:'Selected timeline event'})).toBeVisible();
 await expect(row).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.timeline-list-toggle')).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.source-window')).toHaveCount(0);
 await page.locator('.story-actions').getByRole('button',{name:'Read the Source'}).click();
 await expect(page).toHaveURL(new RegExp('#'+item.anchor+'$'));
 await expect(page.getByTestId('source-highlight').first()).toBeVisible();
 await page.locator('[data-timeline-event="'+item.next+'"] button').click();
 await expect(page).toHaveURL(new RegExp('#'+item.nextAnchor+'$'));
 await expect(page.getByTestId('source-highlight').first()).toBeVisible();
 await expect(page.locator('.timeline-list-toggle')).toHaveAttribute('aria-expanded','true');
});
test('Chapter 1 events without Closer Look membership still open their evidence',async({page})=>{
 await page.goto('/#chapter/road-1966');
 await page.locator('.story-actions').getByRole('button',{name:'Read the Source'}).click();
 await page.locator('.timeline-list-toggle').click();
 await page.locator('[data-timeline-event="leadership-change-1966-03-10"] button').click();
 await expect(page).toHaveURL(/#ROAD-COMMAND-1966-03-10$/);
 await expect(page.getByRole('region',{name:'Selected timeline event'})).toBeVisible();
 await expect(page.locator('.timeline-list-toggle')).toHaveAttribute('aria-expanded','true');
});

test('mouse press near bottom of event list does not scroll the target out from under the click',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/#chapter/road-1966');
 await page.locator('.timeline-list-toggle').click();
 await page.locator('.timeline-event-reveal').evaluate(async el=>{await new Promise(requestAnimationFrame);await Promise.all(el.getAnimations().map(animation=>animation.finished));});
 const row=page.locator('[data-timeline-event="late-supplies-january-7"] button');
 await row.evaluate(el=>el.scrollIntoView({block:'end'}));
 const box=(await row.boundingBox())!;
 await page.mouse.move(box.x+100,box.y+box.height/2);
 await page.mouse.down();
 // Hold long enough to catch a focus-triggered smooth scroll before mouseup.
 await page.waitForTimeout(350);
 await page.mouse.up();
 await expect(row).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.timeline-list-toggle')).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('region',{name:'Selected timeline event'})).toContainText('Back-ordered supplies still arriving');
 await page.locator('.story-actions').getByRole('button',{name:'Read the Source'}).click();
 await expect(page.getByTestId('source-highlight').first()).toBeVisible();
 await row.focus();
 await page.keyboard.press('ArrowDown');
 await expect(page.locator('.timeline-list-toggle')).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.timeline-event-list button[aria-pressed=true]')).not.toContainText('Back-ordered supplies still arriving');
});
