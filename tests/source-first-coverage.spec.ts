import {test,expect} from '@playwright/test';
import fs from 'node:fs';
test('source-first additions are reachable in the timeline and Closer Look',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#map');
 await expect(page.locator('.timeline-heading')).toContainText('1965–1966');
 const january=page.locator('.timeline-months span').filter({hasText:'JAN'});
 expect(await january.evaluate(el=>parseFloat((el as HTMLElement).style.left))).toBeGreaterThan(90);
 await page.getByRole('button',{name:/Show events for/}).click();
 await expect(page.locator('[data-timeline-event="cargo-loaded-january-8"]')).toBeVisible();
 await page.locator('[data-timeline-event="cargo-loaded-january-8"] button').click();
 await expect(page.locator('#deployment-loading')).toHaveAttribute('open','');
 await expect(page.locator('#panel-chronology [data-event-id="cargo-loaded-january-8"]')).toBeVisible();
 await page.locator('.story-actions').getByRole('button',{name:'Read the Source'}).click();
 await page.locator('#panel-chronology [data-event-id="cargo-loaded-january-8"] .inline-citation').click();
 await expect(page).toHaveURL(/#AUDIT-CARGO-LOADED-JANUARY-8$/);
 await expect(page.locator('.reviewed-ocr summary')).toContainText('page 8');
 expect(errors).toEqual([]);
});
test('coverage spans and published event memberships resolve',()=>{
 const audit=JSON.parse(fs.readFileSync('data/ocr-runs/SOURCE_FIRST_CH00_COVERAGE.json','utf8'));
 const root='data/units/5th_marines/2nd_battalion/research';
 const chapter=JSON.parse(fs.readFileSync(root+'/chapters/rebirth-1965.json','utf8'));
 const members=new Set(chapter.sections.flatMap((s:any)=>s.eventIds));
 for(const r of audit.rows){const d=JSON.parse(fs.readFileSync(`data/ocr-runs/approved-reading-copies/${r.documentId}.json`,'utf8'));const p=d.pages.find((p:any)=>p.page===r.page);expect(p.resolvedSha256).toBe(r.resolvedSha256);expect(p.text.slice(r.start,r.end)).toBe(r.quote);
 if(r.disposition==='published')for(const id of r.eventIds){const e=JSON.parse(fs.readFileSync(`${root}/events/${id}.json`,'utf8'));expect(e.chapterIds).toContain('rebirth-1965');expect(members.has(e.chronologyEventId??id),id).toBeTruthy();}
 }
});
