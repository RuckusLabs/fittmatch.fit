import { describeShareRecord, renderShareCard } from './share-cards.mjs';
import { isWebProfileVisible, renderWebProfile, unavailablePage } from './profile-pages.mjs';

// Both page and card requests re-check the live record. Never serve a saved
// profile/card before checking visibility; opting out must invalidate old links.
export function createWebProfileHandler({ loadRecord, rasterize, loadMedia = async () => ({}) }) {
  return async function handleProfile(pathname) {
    const match = /^\/p\/(coach|client|job)\/([a-z0-9-]{1,80})(?:\/(og\.jpg))?\/?$/i.exec(pathname);
    if (!match) return null;
    const headers = { 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' };
    const hidden = () => ({ status: 404, headers: { ...headers, 'x-robots-tag': 'noindex, nofollow', 'content-type': 'text/html; charset=utf-8' }, body: unavailablePage() });
    const record = await loadRecord(match[1].toLowerCase(), match[2]);
    if (!isWebProfileVisible(record)) return hidden();
    const descriptor = describeShareRecord(record);
    const card = renderShareCard(descriptor, await loadMedia(record));
    // A live endpoint, not a permanently public static image, so old OG URLs
    // are subject to the same current visibility decision as profile pages.
    card.imageUrl = `${descriptor.url}og.jpg?v=${card.imagePath.split('-').at(-1).replace('.jpg', '')}`;
    if (match[3]) {
      return { status: 200, headers: { ...headers, 'content-type': 'image/jpeg' }, body: await rasterize(card.svg) };
    }
    if (pathname !== new URL(descriptor.url).pathname) {
      return { status: 302, headers: { ...headers, location: new URL(descriptor.url).pathname }, body: '' };
    }
    return { status: 200, headers: { ...headers, 'content-type': 'text/html; charset=utf-8' }, body: renderWebProfile(record, card) };
  };
}
