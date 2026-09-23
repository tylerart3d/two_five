import {test,expect} from '@playwright/test';
test('leadership follows the date slider, preserves unknowns and opens evidence',async({page})=>{
 await page.goto('/#map');
 await page.getByRole('tab',{name:'Leadership',exact:true}).click();
 const slider=page.getByRole('slider',{name:'Leadership date',exact:true});
 await expect(slider).toBeVisible();
 const co=page.locator('[data-leadership-role="CO"]');
 await expect(co).toContainText('Not yet established');
 const date=async(value:string)=>{const offset=(Date.parse(value)-Date.parse('1965-07-01'))/86400000;await slider.fill(String(offset));};
 await date('1965-08-19');await expect(co).toContainText('C. H. Ram');
 await date('1965-09-08');await expect(co).toContainText('J. R. Catt');
 await date('1965-09-18');await expect(co).toContainText('Waller');
 await date('1965-11-26');await expect(page.locator('[data-leadership-role="H&S"]')).toContainText('Hughes');
 await date('1965-12-20');await expect(co).toContainText('Uskurait');
 await expect(page.locator('[data-leadership-role="Hotel"]')).toContainText('Recorded December 20');
 await co.getByRole('button').click();
 await expect(page.locator('.officer-history button')).toHaveCount(0);
 await page.locator('.story-actions').getByRole('button',{name:'Read the Source'}).click();
 await page.locator('.officer-history').getByRole('button',{name:'Appointed December 20, 1965',exact:true}).click();
 await expect(page).toHaveURL(/#command-december-20$/);
 await expect(page.locator('.source-window')).toBeVisible();await expect(page.getByRole('tab',{name:'Leadership',exact:true})).toHaveAttribute('aria-selected','true');
});
test('tabs use three-way keyboard navigation',async({page})=>{
 await page.goto('/#map');await page.getByRole('tab',{name:'Narrative',exact:true}).focus();await page.keyboard.press('End');await expect(page.getByRole('tab',{name:'Leadership',exact:true})).toBeFocused();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'Narrative',exact:true})).toBeFocused();
});

test('selected officer history follows the person across billets',async({page})=>{
 await page.goto('/#map');await page.getByRole('tab',{name:'Leadership',exact:true}).click();
 const slider=page.getByRole('slider',{name:'Leadership date',exact:true});
 await slider.fill(String((Date.parse('1965-08-19')-Date.parse('1965-07-01'))/86400000));
 await page.locator('[data-leadership-role="CO"] button').click();
 const history=page.locator('.officer-history');
 await expect(history).toContainText('CO · Capt C. H. Ram');await expect(history).toContainText('XO · Capt C. H. Ram');await expect(history).toContainText('H&S · Capt C. H. Ram');
 await slider.fill('109');await expect(page.locator('.officer-details h3')).toContainText('C. H. Ram');
});
