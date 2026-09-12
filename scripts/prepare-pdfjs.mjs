import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(`${root}/public/pdfjs`, { recursive: true });
for (const name of ['wasm', 'standard_fonts']) {
  await cp(`${root}/node_modules/pdfjs-dist/${name}`, `${root}/public/pdfjs/${name}`, { recursive: true });
}
await cp(`${root}/node_modules/pdfjs-dist/LICENSE`, `${root}/public/pdfjs/LICENSE`);
