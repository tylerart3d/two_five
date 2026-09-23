import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';

// Only tiles requested by readers are fetched. Never prefetch geographic areas.
export function mapTileCache({ directory, fetchTile = fetch, now = Date.now }) {
  const pending = new Map();
  async function load(key, referer) {
    const file = join(directory, key.replaceAll('/', '-') + '.json');
    let saved;
    try { saved = JSON.parse(await readFile(file, 'utf8')); } catch { /* first visit */ }
    if (saved?.expires > now()) return { ...saved, hit: 'HIT' };
    const headers = { 'User-Agent': 'TwoFiveResearchArchive/0.1 (+https://github.com/tylerart3d/two_five)' };
    if (referer) headers.Referer = referer;
    if (saved?.etag) headers['If-None-Match'] = saved.etag;
    if (saved?.modified) headers['If-Modified-Since'] = saved.modified;
    const response = await fetchTile(`https://tile.openstreetmap.org/${key}.png`, { headers, signal: AbortSignal.timeout(15000) });
    if (response.status !== 304 && !response.ok) throw new Error(`Tile provider returned ${response.status}`);
    if (response.status === 304 && !saved) throw new Error('Unexpected conditional response');
    const control = response.headers.get('cache-control') ?? saved?.control ?? '';
    const maxAge = control.match(/(?:^|,)\s*max-age=(\d+)/i)?.[1];
    const age = Number(response.headers.get('age') ?? 0) * 1000;
    const expiresHeader = Date.parse(response.headers.get('expires') ?? '');
    const lifetime = /no-cache/i.test(control) ? 0 : maxAge !== undefined ? Math.max(0, Number(maxAge)*1000-age)
      : Number.isFinite(expiresHeader) ? Math.max(0, expiresHeader-now()) : 7*86400000;
    const type = response.headers.get('content-type') ?? saved?.type;
    if (type?.split(';')[0] !== 'image/png') throw new Error('Unexpected tile content');
    const bytes = response.status === 304 ? Buffer.from(saved.body, 'base64') : Buffer.from(await response.arrayBuffer());
    if (bytes.length > 1048576 || bytes.subarray(0,8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Invalid PNG tile');
    const entry = { body: bytes.toString('base64'), type, control, expires: now()+lifetime,
      etag: response.headers.get('etag') ?? saved?.etag,
      modified: response.headers.get('last-modified') ?? saved?.modified };
    if (!/no-store|private/i.test(control)) {
      await mkdir(directory, { recursive: true });
      await writeFile(file+'.tmp', JSON.stringify(entry));
      await rename(file+'.tmp', file);
    }
    return { ...entry, hit: response.status === 304 ? 'REVALIDATED' : 'MISS' };
  }
  return async (req, res, next) => {
    const path = req.url?.split('?')[0] ?? '';
    if (!path.startsWith('/map-tiles/')) return next();
    const match = path.match(/^\/map-tiles\/osm\/(\d+)\/(\d+)\/(\d+)\.png$/);
    if (!match || Number(match[1]) > 19 || Number(match[2]) >= 2**Number(match[1]) || Number(match[3]) >= 2**Number(match[1])) {
      res.statusCode=400; res.end('Invalid tile'); return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode=405; res.end(); return; }
    const key = match.slice(1).map(Number).join('/');
    try {
      if (!pending.has(key)) pending.set(key, load(key, req.headers.referer).finally(()=>pending.delete(key)));
      const result = await pending.get(key);
      res.setHeader('Content-Type', result.type);
      res.setHeader('Cache-Control', /no-store|private/i.test(result.control) ? 'no-store' : `public, max-age=${Math.max(0,Math.floor((result.expires-now())/1000))}`);
      res.setHeader('X-Tile-Cache', result.hit);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(req.method === 'HEAD' ? undefined : Buffer.from(result.body, 'base64'));
    } catch (error) {
      console.warn('[map-cache]', error.message);
      res.statusCode=502; res.setHeader('Cache-Control','no-store'); res.end('Map tile temporarily unavailable');
    }
  };
}
