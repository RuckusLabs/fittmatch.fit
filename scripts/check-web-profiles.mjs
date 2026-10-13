import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createWebProfileHandler } from './web-profile-handler.mjs';
import { describeShareRecord, renderShareCard } from './share-cards.mjs';
import { renderWebProfile, isWebProfileVisible, mediaUrl } from './profile-pages.mjs';
const records = JSON.parse(await readFile(new URL('../examples/share-records.json', import.meta.url), 'utf8'));
for (const record of records) {
  const page = renderWebProfile(record, renderShareCard(describeShareRecord(record)));
  assert.ok(page.includes('web-gallery'));
  assert.ok(page.includes(record.data.bio || record.data.description));
  const privateRecord = structuredClone(record); privateRecord.data.email = 'private@example.com';
  assert.ok(!renderWebProfile(privateRecord, renderShareCard(describeShareRecord(privateRecord))).includes('private@example.com'));
}
const coach = structuredClone(records[0]); coach.example = false;
const live = renderWebProfile(coach, renderShareCard(describeShareRecord(coach)));
for (const field of ['<video', 'controls playsinline', 'Specialties', 'Other qualifications', 'Availability', 'Reviews', 'Verified by FittMatch']) assert.ok(live.includes(field));
let current = coach;
const handler = createWebProfileHandler({ loadRecord: async () => current, rasterize: async () => Buffer.from('jpeg') });
const path = `/p/coach/${coach.identifier}/`;
assert.equal((await handler(path)).status, 200);
assert.equal((await handler(path + 'og.jpg')).status, 200);
for (const value of [false, null, undefined]) {
  current = structuredClone(coach); current.data.profiles.open_to_offers = value;
  assert.equal(isWebProfileVisible(current), false);
  assert.throws(() => describeShareRecord(current));
  const closed = await handler(path), image = await handler(path + 'og.jpg');
  assert.equal(closed.status, 404); assert.equal(image.status, 404);
  assert.ok(!closed.body.includes(coach.data.profiles.full_name));
  assert.ok(!closed.body.includes('<video') && !closed.body.includes('og:image'));
  assert.equal(closed.headers['cache-control'], 'private, no-store');
  assert.equal((await handler('/p/coach/00000000-0000-4000-8000-000000000001/')).status, 404);
}
current = coach; assert.equal((await handler(path)).status, 200);
assert.equal(mediaUrl('javascript:alert(1)'), null); assert.equal(mediaUrl('http://example.com/photo.jpg'), null);
assert.equal(mediaUrl('https://user:password@example.com/photo.jpg'), null);
const unsafe = structuredClone(coach); unsafe.data.bio = '<script>alert(1)</script>'; unsafe.data.photos = [{url:'javascript:alert(1)'}];
const escaped = renderWebProfile(unsafe, renderShareCard(describeShareRecord(unsafe)));
assert.ok(!escaped.includes('<script>alert(1)</script>') && !escaped.includes('javascript:'));
console.log('Passed full public pages: media/details, qualifications/reviews, private-field omission, fail-closed coach visibility, live page/card opt-out, legacy URL denial, restoration, and safe media/HTML.');
