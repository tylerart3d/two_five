import {test,expect} from '@playwright/test';
test('source mode preserves list paragraph geometry',async({page})=>{
 await page.goto('/#map');await page.getByRole('tab',{name:'Closer Look',exact:true}).click();
 const paragraph=page.locator('#panel-chronology [data-event-id="seato-demonstration"] > p').first();
 const measure=()=>paragraph.evaluate(el=>{const rect=el.getBoundingClientRect();const li=el.closest('li')!.getBoundingClientRect();return {width:rect.width,height:rect.height,left:rect.left-li.left,top:rect.top-li.top};});
 const before=await measure();await page.locator('.story-actions').getByRole('button',{name:'Read the Source'}).click();
 await expect(paragraph.locator('.inline-citation')).toBeVisible();
 const after=await measure();for(const key of ['width','height','left','top'] as const)expect(Math.abs(after[key]-before[key])).toBeLessThan(1);
 await expect(paragraph.locator('.inline-citation')).toHaveCSS('display','inline');
 await paragraph.locator('.inline-citation').click();await expect(page).toHaveURL(/#seato-demonstration$/);
});
