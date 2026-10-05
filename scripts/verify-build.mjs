import fs from 'node:fs';
import assert from 'node:assert/strict';
const index = JSON.parse(fs.readFileSync('public/geo/countries.json'));
assert.equal(new Set(index.map(x => x.code)).size, index.length);
for (const { code } of index) {
  for (const ring of JSON.parse(fs.readFileSync('public/geo/countries/' + code + '.json'))) {
    assert.ok(ring.length >= 4);
    for (const [lon, lat] of ring) {
      assert.ok(Number.isFinite(lon) && lon >= -180 && lon <= 180);
      assert.ok(Number.isFinite(lat) && lat >= -90 && lat <= 90);
    }
  }
}
const html = fs.readFileSync('dist/index.html', 'utf8');
for (const anchor of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes('id="' + anchor[1] + '"'));
assert.ok(!html.includes('tuusuario') && !html.includes('tucorreo'));
assert.ok(!fs.existsSync('dist/__qa.html'));
console.log(index.length + ' contornos válidos; anclas válidas; sin enlaces de ejemplo ni QA en producción.');
