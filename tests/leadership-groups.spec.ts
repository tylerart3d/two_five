import {test,expect} from '@playwright/test';

test('individual leadership actions share dates and navigate to summary or roster',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#chapter/rebirth-1965');
 await page.getByRole('tab',{name:'Chronology',exact:true}).click();
 await expect(page.locator('#command-assignments')).toContainText('02 / COMMAND RESTRUCTURING');
 await expect(page.locator('.command-group')).toHaveCount(2);
 for(const group of await page.locator('.command-group').all()) await expect(group).not.toHaveAttribute('open');
 await page.getByRole('button',{name:'Show events for Rebirth of the 2/5'}).click();
 const list=page.locator('.timeline-event-list');
 await expect(list.locator('.timeline-date-group').filter({hasText:/^1 Dec 1965$/})).toHaveCount(1);
 await list.getByRole('button',{name:/T. E. Bulger transfers out/}).click();
 await expect(page.getByRole('tab',{name:'Chronology',exact:true})).toHaveAttribute('aria-selected','true');
 await expect(page.locator('#staff-company-leadership')).toHaveAttribute('open','');
 await list.getByRole('button',{name:/Battalion billet roster recorded/}).click();
 const roster=page.locator('[data-event-id="assignments-roster-december"]');
 await expect(roster).toBeVisible();
 await expect(roster).toContainText('Hughes');
 await expect(roster).toContainText('not eleven appointment dates');
 await expect(list.getByRole('button',{name:/Doherty listed in the December roster/})).toHaveCount(0);
});
