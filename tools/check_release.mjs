// Build and backend checks only. This does not inspect browser rendering.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';

// Consume each response and close the connection; PHP's development server is single-process.
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = request(url, { method: options.method || 'GET', headers: { ...options.headers, Connection: 'close', ...(options.body ? { 'Content-Length': Buffer.byteLength(options.body) } : {}) } }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve({ status: response.statusCode, text: async () => body, json: async () => JSON.parse(body) });
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy(new Error('HTTP check timed out')));
    req.end(options.body);
  });
}

const base = 'http://127.0.0.1:4174';
const results = [];
const response = await fetch(base);
assert.equal(response.status, 200);
const html = await response.text();
assert.ok(html.includes('A home worth'));
assert.ok(html.includes('Fire &amp; flood'));
assert.equal((html.match(/<h1\b/g) || []).length, 1);
results.push('PHP serves prerendered page content with one h1.');
const assets = [...new Set([...html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)].map(m => m[1]).filter(x => /\.(webp|png|woff2|css|js|svg)$/.test(x)))];
for (const asset of assets) assert.equal((await fetch(base + asset)).status, 200, asset);
const cssFile = /href="(\/assets\/[^\"]+\.css)"/.exec(html)[1];
const css = await (await fetch(base + cssFile)).text();
for (const [, asset] of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) assert.equal((await fetch(base + asset)).status, 200, asset);
results.push('HTML and CSS asset references resolve, including local fonts.');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor), anchor);
assert.equal(ids.length, new Set(ids).size);
results.push('Internal anchors resolve and IDs are unique.');
const mailLinks = (html.match(/href="mailto:/g) || []).length;
assert.ok(mailLinks >= 5);
results.push('Primary enquiry links have email fallbacks without JavaScript.');
assert.equal((await fetch(base + '/api/enquiry.php')).status, 405);
const valid = { name: 'Local validation fixture', email: 'test@example.invalid', phone: '', postcode: 'HA1 2UF', service: 'Renovation', message: 'Local validation only; no delivery should occur.', website: '' };
async function post(data, expected, headers = {}) {
  const r = await fetch(base + '/api/enquiry.php', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(data) });
  assert.equal(r.status, expected);
  const body = await r.json(); assert.equal(body.success, false);
}
await post({ ...valid, email: 'invalid' }, 422);
await post({ ...valid, service: 'Unlisted service' }, 422);
await post({ ...valid, name: '' }, 422);
await post({ ...valid, website: 'bot' }, 422);
await post({ ...valid, message: 'x'.repeat(17000) }, 413);
await post(valid, 403, { Origin: 'https://example.invalid' });
// Run this script only against the preview started with LRD_MAIL_ENABLED=0.
await post(valid, 503);
results.push('PHP rejects invalid fields, bots, oversized requests and other origins.');
results.push('Mail-disabled preview returns 503, never a false success. No email sent.');
assert.equal((await fetch(base + '/package.json')).status, 404);
assert.equal((await fetch(base + '/research/original-site/archive.json')).status, 404);
results.push('Project configuration and migration research are outside the public root.');
const report = { checkedAt: new Date().toISOString(), checks: results, limitations: ['Browser access was declined. Responsive rendering, hydration interactions, keyboard navigation and screen-reader behaviour are not runtime verified.', 'Live mail delivery is not configured or tested.'] };
writeFileSync('research/validation.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
