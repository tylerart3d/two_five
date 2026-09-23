import {test,expect} from '@playwright/test';
test('individual leadership actions share dates and navigate to their company or roster',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#chapter/rebirth-1965');
 await page.getByRole('tab',{name:'Closer Look',exact:true}).click();
 await expect(page.locator('.command-group').first()).not.toHaveAttribute('open');
 await page.locator('.timeline-list-toggle').click();
 const list=page.locator('.timeline-event-list');
 await expect(list.locator('.timeline-date-group').filter({hasText:/^1 Dec 1965$/})).toHaveCount(1);
 await list.getByRole('button',{name:/T. E. Bulger transfers out/}).click();
 await expect(page.getByRole('tab',{name:'Closer Look',exact:true})).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('region',{name:'Selected timeline event'})).toContainText('Bulger');
 await list.getByRole('button',{name:/Battalion billet roster recorded/}).click();
 const roster=page.getByRole('region',{name:'Selected timeline event'});
 await expect(roster).toContainText('Hughes');
 await expect(list.getByRole('button',{name:/Doherty listed in the December roster/})).toHaveCount(0);
});
