import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describeShareRecord, renderShareCard, shareMetadata, escape } from './share-cards.mjs';

const records = JSON.parse(await readFile(new URL('../examples/share-records.json', import.meta.url), 'utf8'));
const descriptors = records.map(describeShareRecord);
const cards = descriptors.map((d) => renderShareCard(d));
assert.equal(new Set(cards.map((c) => c.imageUrl)).size, 3);
for (let i = 0; i < descriptors.length; i++) {
  const d = descriptors[i], card = cards[i];
  const page = await readFile(new URL(`../examples/${d.type}/${d.identifier}/index.html`, import.meta.url), 'utf8');
  const liveImageUrl = /property="og:image" content="([^"]+)"/.exec(page)?.[1];
  assert.ok(liveImageUrl?.startsWith(`https://fittmatch.fit/assets/social/examples/${d.type}/${d.identifier}-`));
  assert.ok(page.includes(escape(d.title)));
  assert.ok(page.includes('name="twitter:image" content="' + liveImageUrl + '"'));
  const bytes = await readFile(new URL(`..${new URL(liveImageUrl).pathname}`, import.meta.url));
  assert.equal(bytes[0], 0xff); assert.equal(bytes[1], 0xd8);
  assert.ok(bytes.length < 300000);
}
const otherCoach = { ...records[0], identifier: 'rachel-green-1002' };
assert.notEqual(renderShareCard(describeShareRecord(otherCoach)).imageUrl, cards[0].imageUrl);
const changedJob = structuredClone(records[1]); changedJob.data.pay_min = 40;
assert.notEqual(renderShareCard(describeShareRecord(changedJob)).imageUrl, cards[1].imageUrl);
assert.ok(descriptors[1].badges.includes('$35–$50 / hour'));
const noPay = structuredClone(records[1]); delete noPay.data.pay_min; delete noPay.data.pay_max;
assert.ok(!describeShareRecord(noPay).description.includes('$0'));
const unsafe = structuredClone(records[0]); unsafe.data.profiles.full_name = '<script>alert(1)</script>';
const unsafeDescriptor = describeShareRecord(unsafe);
assert.ok(!renderShareCard(unsafeDescriptor).svg.includes('<script>'));
assert.ok(!shareMetadata(unsafeDescriptor, renderShareCard(unsafeDescriptor)).includes('<script>'));
assert.throws(() => describeShareRecord({ ...records[0], identifier: '../rachel-green-1001' }));
const privateData = structuredClone(records[0]); privateData.data.email = 'private@example.com'; privateData.data.profiles.email = 'private@example.com';
assert.ok(!JSON.stringify(describeShareRecord(privateData)).includes('private@example.com'));
console.log('Passed: unique cards by entity and ID, new image URL after content changes, matching static metadata, JPEG assets, pay formatting, escaping, safe paths, and public-field filtering.');
