import {test,expect} from '@playwright/test';
test('Chapter 1 leadership follows roster dates and links its source page',async({page})=>{
 await page.goto('/#chapter/road-1966');await page.getByRole('tab',{name:'Leadership',exact:true}).click();
 const slider=page.getByRole('slider',{name:'Leadership date',exact:true});
 const date=async(d:string)=>slider.fill(String((Date.parse(d)-Date.parse('1966-01-01'))/86400000));
 await expect(page.locator('[data-leadership-role="CO"]')).toContainText('Uskurait');
 await date('1966-01-03');await expect(page.locator('[data-leadership-role="S-2"]')).toContainText('Not yet established');
 await date('1966-02-22');await expect(page.locator('[data-leadership-role="S-2"]')).toContainText('Hemenez');await expect(page.locator('[data-leadership-role="Foxtrot"]')).toContainText('Hickethier');
 await date('1966-03-17');await expect(page.locator('[data-leadership-role="Echo"]')).toContainText('Marcum');
 await date('1966-03-18');await expect(page.locator('[data-leadership-role="Echo"]')).toContainText('Cooper');await expect(page.locator('[data-leadership-role="Foxtrot"]')).toContainText('Burgett');
 await page.locator('[data-leadership-role="Echo"] button').click();await page.locator('.story-actions').getByRole('button',{name:'Read the Source'}).click();
 await page.locator('.officer-history').getByRole('button',{name:'Recorded April 5, 1966',exact:true}).click();await expect(page).toHaveURL(/#ROAD-LEADERSHIP-1966-04-05$/);await expect(page.locator('.source-window')).toContainText('PDF page 2');
});
test('Pearl Harbor travel has three attributed ship photos',async({page})=>{
 await page.goto('/#chapter/road-1966');await page.getByRole('button',{name:'Travel to Pearl Harbor',exact:true}).click();
 const album=page.locator('.location-album');await expect(album).toContainText('Bexar');await expect(album).toContainText('1 / 3');
 await album.getByRole('button',{name:'Next photo'}).click();await expect(album).toContainText('Mathews');await expect(album).toContainText('before 1968');
 await album.getByRole('button',{name:'Next photo'}).click();await expect(album).toContainText('Belle Grove');await album.getByRole('button',{name:'Open photo album'}).click();await expect(page.getByRole('dialog',{name:'Location photo album'})).toBeVisible();
});
