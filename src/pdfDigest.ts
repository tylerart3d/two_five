import { sha256 } from '@noble/hashes/sha2.js';

// Direct Tailscale IP links use HTTP inside the encrypted tailnet. Browsers
// omit Web Crypto there, but the PDF version check must still run.
export async function pdfDigest(bytes: ArrayBuffer): Promise<string> {
  const digest = globalThis.crypto?.subtle
    ? new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes))
    : sha256(new Uint8Array(bytes));
  return Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
}
