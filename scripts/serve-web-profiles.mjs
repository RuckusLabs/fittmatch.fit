import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, extname, resolve, sep } from 'node:path';
import { createWebProfileHandler } from './web-profile-handler.mjs';
import { createShareMediaLoader } from './share-media.mjs';

const { default: sharp } = await import(process.env.SHARE_CARD_SHARP_MODULE || 'sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const base = process.env.WEB_PROFILE_SUPABASE_URL;
const publicKey = process.env.WEB_PROFILE_SUPABASE_ANON_KEY;
if (!base || !publicKey || new URL(base).protocol !== 'https:') throw new Error('Set the public Supabase URL and anonymous key for web profiles.');

const profile = createWebProfileHandler({
  loadMedia: createShareMediaLoader({ sharp, allowedHosts: [new URL(base).hostname, 'images.unsplash.com', ...(process.env.WEB_PROFILE_MEDIA_HOSTS || '').split(',').map(v => v.trim()).filter(Boolean)] }),
  loadRecord: async (type, identifier) => {
    const response = await fetch(new URL('/rest/v1/rpc/get_public_web_profile', base), {
      method: 'POST', headers: { apikey: publicKey, Authorization: `Bearer ${publicKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ p_type: type, p_identifier: identifier }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Public profile lookup unavailable.');
    return response.json();
  },
  rasterize: (svg) => sharp(Buffer.from(svg)).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toBuffer(),
});
const mime = { '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.html': 'text/html' };
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { allow: 'GET, HEAD' }); return res.end(); }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const result = await profile(pathname);
    if (result) { res.writeHead(result.status, result.headers); return res.end(req.method === 'HEAD' ? undefined : result.body); }
    // Never expose scripts, data snapshots, static production profile assets, or
    // a leftover /p/ page as fallback when the dynamic profile route fails.
    const allowed = ['/', '/index.html', '/styles.css', '/profile.css', '/main.js', '/profile.js', '/favicon.png', '/privacy.html', '/terms.html', '/.well-known/apple-app-site-association'];
    if (!allowed.includes(pathname) && !pathname.startsWith('/assets/icons/') && pathname !== '/assets/app-icon.png') { res.writeHead(404); return res.end(); }
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) { res.writeHead(404); return res.end(); }
    const bytes = await readFile(file);
    res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/json', 'x-content-type-options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(503, { 'content-type': 'text/plain', 'cache-control': 'no-store' });
    res.end('This page is temporarily unavailable. Please try again.');
  }
});
server.listen(Number(process.env.WEB_PROFILE_PORT || 4176), process.env.WEB_PROFILE_HOST || '127.0.0.1', () => {
  console.log(`Web profile server: http://${process.env.WEB_PROFILE_HOST || '127.0.0.1'}:${process.env.WEB_PROFILE_PORT || 4176}`);
});
