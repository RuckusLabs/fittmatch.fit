import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { renderWebProfile, isWebProfileVisible } from './profile-pages.mjs';
import { describeShareRecord, renderShareCard, shareMetadata, escape } from './share-cards.mjs';
import { createShareMediaLoader } from './share-media.mjs';

// Supply an installed Sharp module path to use the bundled desktop runtime.
const { default: sharp } = await import(process.env.SHARE_CARD_SHARP_MODULE || 'sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const loadMedia = createShareMediaLoader({ sharp, allowedHosts: ['images.unsplash.com'] });
const records = JSON.parse(await readFile(join(root, 'examples/share-records.json'), 'utf8'));
for (const record of records.filter((r) => !isWebProfileVisible(r))) {
  if (!['coach', 'client', 'job'].includes(record.type) || !/^[a-z0-9-]{1,80}$/.test(record.identifier)) throw new Error('Invalid example target.');
  const path = join(root, 'examples', record.type, record.identifier, 'index.html');
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, renderWebProfile(record, null));
  const assetDir = join(root, 'assets/social/examples', record.type);
  for (const filename of await readdir(assetDir).catch(() => [])) {
    if (filename.startsWith(record.identifier + '-') && /^[a-f0-9]{16}\.(jpg|svg)$/.test(filename.slice(record.identifier.length + 1))) await unlink(join(assetDir, filename));
  }
}
const descriptors = records.filter(isWebProfileVisible).map(describeShareRecord);
const seen = new Set();
for (const d of descriptors) {
  if (!d.example) throw new Error('This builder only publishes fictional examples.');
  const key = `${d.type}/${d.identifier}`;
  if (seen.has(key)) throw new Error(`Duplicate share target: ${key}`);
  seen.add(key);
}

async function writeImmutable(path, bytes) {
  await mkdir(dirname(path), { recursive: true });
  try { await writeFile(path, bytes, { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    if (!Buffer.from(await readFile(path)).equals(Buffer.from(bytes))) throw new Error(`Refusing to overwrite a different sharing asset: ${path}`);
  }
}


const rendered = [];
for (const d of descriptors) {
  const record = records.find(r => r.type === d.type && r.identifier === d.identifier);
  const card = renderShareCard(d, await loadMedia(record));
  const imagePath = join(root, card.imagePath.slice(1));
  const jpeg = await sharp(Buffer.from(card.svg)).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toBuffer();
  await writeImmutable(imagePath, jpeg);
  const pagePath = join(root, 'examples', d.type, d.identifier, 'index.html');
  const html = renderWebProfile(records.find((r) => r.type === d.type && r.identifier === d.identifier), card);
  await mkdir(dirname(pagePath), { recursive: true });
  await writeFile(pagePath, html);
  rendered.push({ ...d, ...card });
}
const gallery = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Sharing card examples · FittMatch</title><link rel="stylesheet" href="/styles.css"><style>main{max-width:960px;margin:auto;padding:44px 24px}h1{font-size:38px}header p{margin:12px 0 35px;color:var(--ink3)}article{margin:0 0 34px}h2{font:500 13px Outfit,system-ui,sans-serif;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px}article img{width:100%;height:auto;border:1px solid var(--border);border-radius:16px}article a{display:block}article p{font-size:13px;margin-top:10px;color:var(--ink3)}</style></head><body><main><header><a class="wordmark" href="/">FittMatch</a><h1 style="margin-top:22px">A card for every kind of fit.</h1><p>Unique details. One familiar FittMatch look. These are fictional examples.</p></header>${rendered.map((d) => `<article><h2>${escape(d.label)}</h2><a href="/examples/${d.type}/${d.identifier}/"><img src="${d.imagePath}" width="1200" height="630" alt="${escape(d.imageAlt)}"></a><p>${escape(d.title)} · <a style="display:inline;text-decoration:underline" href="/examples/${d.type}/${d.identifier}/">Open example</a></p></article>`).join('')}</main></body></html>`;
await mkdir(join(root, 'examples/share-cards'), { recursive: true });
await writeFile(join(root, 'examples/share-cards/index.html'), gallery);
console.log(JSON.stringify(rendered.map(({ type, identifier, imagePath }) => ({ type, identifier, imagePath })), null, 2));
