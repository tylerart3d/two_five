import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { checkExternalResearch } from './import-external-research.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = path.join(root, 'data');
const manifestPath = path.join(data, 'IMPORT_MANIFEST.md');
const slash = p => p.split(path.sep).join('/');
const hash = b => createHash('sha256').update(b).digest('hex');
const exists = async p => { try { await fs.access(p); return true; } catch { return false; } };
const write = async (p, text) => { await fs.mkdir(path.dirname(p), { recursive: true }); await fs.writeFile(p, text.trimEnd() + '\n'); };
const link = p => slash(p).split('/').map(encodeURIComponent).join('/');
const cell = s => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ');
async function walk(dir) {
  if (!await exists(dir)) return [];
  const result = [];
  for (const e of (await fs.readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isSymbolicLink()) throw new Error(`Symlink not accepted: ${p}`);
    if (e.isDirectory()) result.push(...await walk(p)); else if (e.isFile()) result.push(p);
  }
  return result;
}
async function readManifest() {
  if (!await exists(manifestPath)) return null;
  const text = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(text.match(/```json\n([\s\S]*?)\n```/)[1]);
}
function safeDestination(relative) {
  const p = path.resolve(root, relative);
  if (!p.startsWith(data + path.sep)) throw new Error(`Path outside data: ${relative}`);
  return p;
}
const previous = await readManifest();
if (process.argv.includes('--check')) {
  if (!previous) throw new Error('No import manifest');
  for (const f of previous.files) {
    const bytes = await fs.readFile(safeDestination(f.destination));
    if (bytes.length !== f.bytes || hash(bytes) !== f.sha256) throw new Error(`Integrity mismatch: ${f.destination}`);
  }
  console.log(`Verified ${previous.files.length} copied files against SHA-256 manifest.`);
  await checkExternalResearch();
  process.exit(0);
}
const sourceArg = process.argv[2];
if (!sourceArg) throw new Error('Usage: node scripts/import-research.mjs <legacy-research-root> or --check');
const source = path.resolve(sourceArg);
if (source === root || source.startsWith(root + path.sep)) throw new Error('Import source must be outside this repo');
if (!await exists(path.join(source, 'source_documents', '5th_Marines'))) throw new Error('Expected research source layout missing');
if (previous && previous.source_root !== source) throw new Error('Source root differs from recorded import');

const mappings = [
  ['source_documents/5th_Marines/chronologies', 'units/5th_marines/chronologies'],
  ['source_documents/5th_Marines/1st_Battalion/chronologies', 'units/5th_marines/1st_battalion/chronologies'],
  ['source_documents/5th_Marines/2nd_Battalion/chronologies', 'units/5th_marines/2nd_battalion/chronologies'],
  ['source_documents/5th_Marines/2nd_Battalion/rosters', 'units/5th_marines/2nd_battalion/rosters'],
  ['source_documents/5th_Marines/3rd_Battalion/chronologies', 'units/5th_marines/3rd_battalion/chronologies'],
  ['source_documents/5th_Marines/3rd_Battalion/after_action_reports', 'units/5th_marines/3rd_battalion/after_action_reports'],
  ['source_documents/1st_Marines', 'units/1st_marines/documents'],
  ['source_documents/7th_Marines', 'units/7th_marines/documents'],
  ['source_documents/9th_Marines', 'units/9th_marines/documents'],
  ['source_documents/task_force_hotel', 'task_forces/task_force_hotel/documents'],
  ['source_documents/aviation', 'supporting/aviation/documents'],
  ['source_documents/operations', 'shared/operations'],
  ['source_documents/overlays', 'shared/overlays'],
  ['source_documents/casualties', 'shared/casualties'],
  ['source_documents/reference', 'shared/reference'],
  ['source_documents/personnel', 'shared/personnel_references'],
  ['source_documents/an_hoa_photos', 'media/an_hoa', 'all'],
  ['staging/chronologies', 'units/5th_marines/2nd_battalion/extractions', 'all'],
  ['database/corrections', 'corrections', 'all'],
  ['maps/source', 'geography/source_maps', 'all'],
  ['maps/osm', 'geography/geographic_inputs', 'all'],
  ['docs', 'reference/legacy_design', 'md'],
];
const plans = [], excluded = [];
for (const [from, to, mode] of mappings) {
  for (const p of await walk(path.join(source, from))) {
    const rel = slash(path.relative(path.join(source, from), p));
    const name = path.basename(p);
    const include = mode === 'all' || (mode === 'md' ? name.endsWith('.md') :
      /\.pdf$/i.test(name) || /_vision_ocr\.txt$/i.test(name) ||
      (from.endsWith('/personnel') && /\.txt$/i.test(name)));
    const obsolete = /(?:^|\/)(?:archive|gemini_ocr_archive)(?:\/|$)/i.test(rel) || /gemini|_vision_ocr_part|_chunk\d|_part\d/i.test(name);
    if (!include || obsolete) { excluded.push(slash(path.relative(source, p))); continue; }
    plans.push({ source: slash(path.relative(source,p)), destination: `data/${to}/_files/${rel}`, collection: to, local: rel });
  }
}
// Preserve the exact live schema, unit seed, and authored geometry SQL as references.
for (const p of await walk(path.join(source, 'database'))) {
  if (path.dirname(p) === path.join(source, 'database') && p.endsWith('.sql')) {
    plans.push({ source: slash(path.relative(source,p)), destination: `data/reference/legacy_database/_files/${path.basename(p)}`, collection: 'reference/legacy_database', local: path.basename(p) });
  }
}
const seen = new Set();
for (const p of plans) {
  if (seen.has(p.destination)) throw new Error(`Duplicate destination ${p.destination}`);
  seen.add(p.destination);
}
const files = [];
let copied = 0;
for (const [i,p] of plans.entries()) {
  const bytes = await fs.readFile(path.join(source,p.source));
  const sha256 = hash(bytes);
  const dest = safeDestination(p.destination);
  if (await exists(dest)) {
    if (hash(await fs.readFile(dest)) !== sha256) throw new Error(`Refusing to overwrite changed evidence: ${p.destination}`);
  } else {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(path.join(source,p.source), dest, fs.constants.COPYFILE_EXCL);
    copied++;
  }
  if (hash(await fs.readFile(dest)) !== sha256) throw new Error(`Copy verification failed: ${p.destination}`);
  files.push({ ...p, bytes: bytes.length, sha256 });
  if ((i+1)%100 === 0) console.log(`Verified ${i+1}/${plans.length} files`);
}
// Retain previously imported files if later removed from the legacy workspace.
for (const old of previous?.files ?? []) if (!seen.has(old.destination)) {
  if (hash(await fs.readFile(safeDestination(old.destination))) !== old.sha256) throw new Error(`Modified retained evidence: ${old.destination}`);
  files.push(old);
}
files.sort((a,b) => a.destination.localeCompare(b.destination));
const collections = new Map();
for (const f of files) {
  if (!collections.has(f.collection)) collections.set(f.collection, []);
  collections.get(f.collection).push(f);
}
const inventory = [];
for (const [collection, entries] of collections) {
  const groups = new Map();
  for (const f of entries) {
    const stem = f.local.replace(/_vision_ocr\.txt$/i,'').replace(/\.[^.]+$/,'');
    if (!groups.has(stem)) groups.set(stem, []);
    groups.get(stem).push(f);
  }
  const rows = [];
  for (const [stem, entries] of groups) {
    const record = `records/${stem}.md`;
    const recordPath = path.join(data,collection,record);
    const archiveIds = [...new Set(entries.flatMap(f => f.local.match(/(?<!\d)\d{10}(?!\d)/g) ?? []))];
    const ocr = entries.find(f => f.local.endsWith('_vision_ocr.txt'));
    const body = [`# ${stem}`, '', '<!-- Generated inventory metadata. Put editorial work in NOTES.md or research records, not this file. -->', '',
      `- Collection: ${collection}`, `- Archive identifier: ${archiveIds.join(', ') || 'Not established from filename'}`,
      '- Review status: imported; historical claims not revalidated',
      '- Original archive item/PDF URL: retain source metadata where supplied; verification pending',
      `- Vision OCR: ${ocr ? 'present (file presence does not prove completeness)' : 'not included for this record'}`,
      '- Publication: local research reference; rights and source-link review required', '', '## Evidence files', ''];
    for (const f of entries) {
      const relative = path.relative(path.dirname(recordPath), safeDestination(f.destination));
      body.push(`- [${cell(f.local)}](${link(relative)}) — ${f.bytes} bytes; SHA-256: \`${f.sha256}\``, `  - Original path: \`${f.source}\``);
    }
    await write(recordPath, body.join('\n'));
    rows.push(`| [${cell(stem)}](${link(record)}) | ${entries.length} | ${ocr ? 'Present' : 'Not included'} |`);
  }
  await write(path.join(data,collection,'INDEX.md'), `# ${collection}\n\nGenerated by the research importer. Source records are imported, not newly reviewed.\nOriginal files are local-only under _files/. Add editorial notes separately.\n\n| Record | Files | Vision OCR |\n| --- | ---: | --- |\n${rows.join('\n')}\n`);
  inventory.push(`| [${collection}](${link(collection+'/INDEX.md')}) | ${groups.size} | ${entries.length} |`);
}
await write(path.join(data,'INVENTORY.md'), `# Research inventory\n\nGenerated from imported files. Counts measure files and catalog groups, not unique events or verified completeness.\n\n| Collection | Catalog records | Files |\n| --- | ---: | ---: |\n${inventory.join('\n')}\n\nTotal files: ${files.length}. Bytes: ${files.reduce((n,f)=>n+f.bytes,0)}.\n`);
const manifest = { version: 1, source_root: source, files };
await write(manifestPath, '# Import manifest\n\nMachine-readable JSON inside Markdown. SHA-256 hashes identify unchanged source bytes.\nGenerated; use separate notes for editorial work.\n\n```json\n'+JSON.stringify(manifest,null,2)+'\n```');
await write(path.join(data,'EXCLUSIONS.md'), '# Import exclusions\n\nSuperseded archive/ and source_documents/gemini_ocr_archive/ are excluded entirely.\nRendered OCR pages, experimental roster outputs, processed TIFFs, and generated map tiles remain in the legacy workspace. Source maps and geographic inputs are copied instead.\nNo credentials, live database, dump, obsolete application, or external roster project was copied.\nCurrent import does not infer that absent files are unavailable elsewhere.\n\n## Filtered files within selected source collections\n\n'+excluded.map(p=>`- \`${p}\``).join('\n'));
console.log(`Import complete: ${copied} new files; ${files.length} total verified; ${collections.size} collections.`);
