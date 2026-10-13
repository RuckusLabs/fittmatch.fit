const assert = require('node:assert/strict');
const fs = require('node:fs');
const { sharedTarget } = require('./share-link.js');
const id = '12345678-1234-1234-1234-123456789abc';
for (const type of ['coach', 'client', 'job']) assert.deepEqual(sharedTarget('/p/' + type + '/' + id), {type, id});
for (const path of ['/p/admin/' + id, '/p/coach/<script>', '/p/coach/' + id + '/extra', '/p/coach/../../', '/']) assert.equal(sharedTarget(path), null);
const a = JSON.parse(fs.readFileSync('.well-known/apple-app-site-association'));
assert(a.applinks.details[0].components.some(c => c['/'] === '/p/*'));
assert(a.applinks.details[0].appIDs.includes('HF4N9F3P5Q.com.fittmatch.app'));
assert(fs.readFileSync('404.html','utf8').includes('/share-link.js'));
console.log('PASS: three shared destinations, invalid-route rejection, native association and fallback assets');
for (const type of ['coach', 'client', 'job']) {
 assert.deepEqual(sharedTarget('/p/'+type+'/', '?id='+id), { type, id });
 const page=fs.readFileSync('p/'+type+'/index.html','utf8');
 assert(page.includes('property="og:image"'));
 assert(page.includes('/assets/social/generic/'+type+'.jpg'));
 assert(fs.existsSync('assets/social/generic/'+type+'.jpg'));
}
assert.deepEqual(sharedTarget('/p/coach/', '?id=damian-makki-0927-1-1070'),{type:'coach',id:'damian-makki-0927-1-1070'});
assert.deepEqual(sharedTarget('/p/coach/damian-makki-0927-1-1070'),{type:'coach',id:'damian-makki-0927-1-1070'});
assert.equal(sharedTarget('/p/job/', '?id=damian-makki-0927-1-1070'),null);
assert.equal(sharedTarget('/p/coach/', '?id=%3Cscript%3E'),null);
console.log('PASS: generic static OG pages, preserved UUID/slug targets and invalid query rejection');
