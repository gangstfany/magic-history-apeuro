import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const places = JSON.parse(read('data/places.json'));
const locations = JSON.parse(read('data/card-locations.json'));
const course = JSON.parse(read('data/course.json'));
const source = JSON.parse(read('assets/geography-source.json'));
const svg = read('assets/world.svg');

test('every card has a location list containing only defined unique IDs', () => {
  const ids = new Set(places.map(p => p.id));
  assert.equal(ids.size, places.length);
  assert.equal(locations.version, 1);
  assert.deepEqual(Object.keys(locations.links).sort(), course.cards.map(c => c.id).sort());
  for (const [cardId, linked] of Object.entries(locations.links)) {
    assert.ok(Array.isArray(linked), cardId);
    assert.equal(new Set(linked).size, linked.length, cardId);
    for (const id of linked) assert.ok(ids.has(id), `${cardId}: ${id}`);
  }
});

test('learning anchors have finite valid coordinates and explicit scope notes', () => {
  const project = p => ({x: (p.lon + 180) * 1600 / 360, y: (90 - p.lat) * 800 / 180});
  assert.deepEqual(project({lon: 0, lat: 0}), {x: 800, y: 400});
  assert.deepEqual(project({lon: -180, lat: 90}), {x: 0, y: 0});
  assert.deepEqual(project({lon: 180, lat: -90}), {x: 1600, y: 800});
  for (const p of places) {
    assert.ok(['city', 'region'].includes(p.kind));
    assert.ok(Number.isFinite(p.lon) && p.lon >= -180 && p.lon <= 180, p.id);
    assert.ok(Number.isFinite(p.lat) && p.lat >= -90 && p.lat <= 90, p.id);
    const {x,y} = project(p);
    assert.ok(x >= 0 && x <= 1600 && y >= 0 && y <= 800, p.id);
    assert.ok(p.noteEn.includes('learning anchor') && p.noteZh.includes('学习锚点'), p.id);
    assert.ok(Array.isArray(p.aliases) && p.nameEn && p.nameZh && p.region, p.id);
  }
});

test('offline SVG contains verified Natural Earth geometry and matching checksum', () => {
  assert.ok(svg.includes('viewBox="0 0 1600 800"'));
  assert.equal((svg.match(/<path /g) || []).length, source.featureCount);
  assert.ok(source.featureCount >= 170);
  assert.ok(svg.length > 100000);
  assert.equal(createHash('sha256').update(svg).digest('hex'), source.svgSha256);
  assert.equal(source.license, 'Public domain');
  assert.equal(source.licenseUrl, 'https://www.naturalearthdata.com/about/terms-of-use/');
  assert.match(source.sourceUrl, /^https:\/\/raw\.githubusercontent\.com\/nvkelso\/natural-earth-vector\//);
  assert.match(source.sourceSha256, /^[a-f0-9]{64}$/);
  assert.ok(!/<(?:script|image|foreignObject)\b|\bhref=/.test(svg));
  assert.ok(svg.includes('not historical boundaries'));
});

test('explicit names retain multiple contexts and person names do not infer locations', () => {
  const find = title => course.cards.find(c => c.title.en === title);
  assert.deepEqual(locations.links[find('Humanism').id], []);
  assert.deepEqual(locations.links[find('Women reformers & socialist feminists').id], []);
  assert.ok(locations.links[find('Why Italy first?').id].includes('florence'));
  assert.ok(locations.links[find('Why Italy first?').id].includes('constantinople'));
  assert.ok(locations.links[find('Why Italy first?').id].includes('italy'));
  assert.ok(Object.values(locations.links).some(a => a.length > 3));
  assert.ok(Object.values(locations.links).some(a => a.length === 0));
});

test('generator distinguishes nested historical regions and rejects adjective inference', () => {
  const code = `import importlib.util,json
spec=importlib.util.spec_from_file_location('geo','scripts/build_geography.py')
g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
def card(text): return {k:{'en':text if k=='summary' else ''} for k in ('title','summary','detail')}
texts=['East Germany and West Germany','France and Paris and Vienna','French, British, Russian, German','Florence Nightingale','St. Petersburg and Petrograd','Austria-Hungary','English East India Company','England and Britain and Prussia']
print(json.dumps([g.card_places(card(t),g.places()) for t in texts]))`;
  const run = spawnSync('python3', ['-B', '-c', code], {cwd:fileURLToPath(root),encoding:'utf8'});
  assert.equal(run.status, 0, run.stderr);
  assert.deepEqual(JSON.parse(run.stdout), [
    ['east-germany','west-germany'], ['france','paris','vienna'], [], [],
    ['st-petersburg'], ['austria-hungary'], [], ['britain','england','prussia']
  ]);
});
