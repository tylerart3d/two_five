import { defineConfig } from 'vite';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const allowed = new Set(['1201048065','1201048066','1201048067','1201048068','princeton-1965-11']);
export default defineConfig({
  server: { fs: { deny: ['.env', '.env.*', '**/.git/**', '**/_files/**', '**/data/local/**'] } },
  plugins: [{ name: 'local-evidence-proof', configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if(req.url?.split('?')[0]==='/review-photos/pendleton-gate.png'){
        res.setHeader('Content-Type','image/png');
        const stream=createReadStream(fileURLToPath(new URL('./data/local/pendleton-photos/gate-photo.png',import.meta.url)));
        stream.on('error',()=>{res.statusCode=404;res.end();});stream.pipe(res);return;
      }
      if(req.url?.split('?')[0]==='/review-photos/hubina-1965.jpg'){
        res.setHeader('Content-Type','image/jpeg');
        const stream=createReadStream(fileURLToPath(new URL('./data/local/pendleton-photos/hubina-1965.jpg',import.meta.url)));
        stream.on('error',()=>{res.statusCode=404;res.end();});stream.pipe(res);return;
      }
      if(req.url?.split('?')[0]==='/review-photos/mcrd-aerial.jpg'){
        res.setHeader('Content-Type','image/jpeg');
        const stream=createReadStream(fileURLToPath(new URL('./data/local/pendleton-photos/mcrd-aerial.jpg',import.meta.url)));
        stream.on('error',()=>{res.statusCode=404;res.end();});stream.pipe(res);return;
      }
      if(req.url?.split('?')[0]==='/review-photos/mcrd-inspection-1960.jpg'){
        res.setHeader('Content-Type','image/jpeg');
        const stream=createReadStream(fileURLToPath(new URL('./data/local/pendleton-photos/mcrd-inspection-1960.jpg',import.meta.url)));
        stream.on('error',()=>{res.statusCode=404;res.end();});stream.pipe(res);return;
      }
      const id = req.url?.split('?')[0].match(/^\/evidence\/([a-z0-9-]+)\.pdf$/)?.[1];
      if (!id || !allowed.has(id)) return next();
      const file = id === 'princeton-1965-11' ? fileURLToPath(new URL('./data/local/princeton-1965-11/original.pdf', import.meta.url)) : fileURLToPath(new URL(`./data/units/5th_marines/2nd_battalion/chronologies/_files/${id}.pdf`, import.meta.url));
      if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.end(); return; }
      try {
        const info = await stat(file);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', info.size);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        if (req.method === 'HEAD') { res.end(); return; }
        const stream = createReadStream(file);
        stream.on('error', () => res.destroy()); res.on('close', () => stream.destroy()); stream.pipe(res);
      } catch { res.statusCode = 404; res.end('Local evidence unavailable. Run the research import.'); }
    });
  }}],
});
