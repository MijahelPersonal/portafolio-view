import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const source = JSON.parse(readFileSync('scripts/countries-source.geojson', 'utf8'));
// Radial simplification retains the closing point and small island outlines.
function simplify(ring) {
  const result = [ring[0]];
  for (let i = 1; i < ring.length - 1; i++) {
    const previous = result.at(-1);
    if (Math.hypot(ring[i][0] - previous[0], ring[i][1] - previous[1]) > 0.18) result.push(ring[i]);
  }
  result.push(ring.at(-1));
  return (result.length >= 4 ? result : ring).map(point => point.map(value => +value.toFixed(3)));
}
mkdirSync('public/geo/countries', { recursive: true });
const index = [];
for (const feature of source.features) {
  const code = feature.properties['ISO3166-1-Alpha-2'];
  if (!/^[A-Z]{2}$/.test(code)) continue;
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  const rings = polygons.map(polygon => simplify(polygon[0]));
  writeFileSync('public/geo/countries/' + code + '.json', JSON.stringify(rings));
  index.push({ code, name: feature.properties.name });
}
writeFileSync('public/geo/countries.json', JSON.stringify(index));
console.log('Prepared', index.length, 'country boundaries.');
