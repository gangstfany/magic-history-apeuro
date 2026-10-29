import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const file = new URL('../data/course.json', import.meta.url);
const course = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
test('course contains the nine authored units, 36 blocks, 205 cards and all 88 current CED topics', () => {
  assert.ok(course, 'course.json has not been generated');
  assert.equal(course.version, 1);
  assert.equal(course.units.length, 9);
  assert.equal(course.units.flatMap(u => u.blocks).length, 36);
  assert.equal(course.cards.length, 205);
  const topics = course.units.flatMap(u => u.topics);
  assert.equal(topics.length, 88);
  assert.equal(new Set(topics.map(t => t.id)).size, 88);
  assert.equal(topics.find(t => t.id === '1.2').titleEn, 'Italian Renaissance');
  assert.equal(topics.find(t => t.id === '9.15').titleEn, 'Continuity and Change in the 20th and 21st Centuries');
});
test('every bilingual authored card retains valid group alignment and three traceable sources', () => {
  assert.ok(course, 'course.json has not been generated');
  const sourceIds = new Set(course.sources.map(s => s.id));
  const ids = new Set();
  for (const unit of course.units) {
    for (const pair of [unit.title, ...unit.story]) for (const lang of ['zh', 'en']) assert.ok(pair[lang]);
    for (const block of unit.blocks) {
      assert.ok(block.topicIds.length);
      for (const id of block.cardIds) {
        const card = course.cards.find(c => c.id === id);
        assert.ok(card); assert.equal(card.unit, unit.id); assert.equal(card.blockId, block.id);
        assert.ok(!ids.has(id)); ids.add(id);
        assert.deepEqual(card.topicIds, block.topicIds);
        assert.ok(['CAUS', 'COMP', 'CC'].includes(card.skill));
        assert.equal(card.sources.length, 3);
        for (const field of ['title', 'summary', 'detail']) for (const lang of ['zh', 'en']) assert.ok(card[field][lang]);
        for (const source of card.sources) { assert.ok(sourceIds.has(source.sourceId)); assert.ok(source.locator); }
        assert.match(card.sources[0].locator, /^block\d+,row\d+$/);
        assert.match(card.sources[1].locator, /block-level alignment/);
      }
    }
  }
  assert.equal(ids.size, course.cards.length);
});
test('public content excludes private paths, markup and excluded materials', () => {
  assert.ok(course, 'course.json has not been generated');
  const strings = value => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
  const text = strings(course).join('\n');
  assert.doesNotMatch(text, /\/Users\/|Desktop\/|reading-index|\.pdf\b|<\/?[a-z][^>]*>|\{\{|\}\}|&#\d+;/i);
  assert.doesNotMatch(JSON.stringify(course.sources), /32节课|Syllabus|Teacher.?Script/i);
  assert.equal(course.sources.filter(s => s.id.startsWith('cards-u')).length, 9);
});

test('authored teaching aids remain paired, bilingual and explicitly non-official', () => {
  assert.ok(course);
  for (const unit of course.units) {
    assert.ok(unit.finalReview.length);
    for (const block of unit.blocks) {
      assert.ok(block.checks.length >= 4);
      assert.ok(block.essayEvidence.length);
      for (const check of block.checks) {
        assert.equal(check.origin, 'user-authored');
        for (const lang of ['zh', 'en']) { assert.ok(check.question[lang]); assert.ok(check.answer[lang]); }
      }
      for (const comparison of block.comparisons) {
        assert.ok(comparison.caption.en); assert.ok(comparison.headers.length); assert.ok(comparison.rows.length);
      }
    }
  }
});

test('reviewed content revisions apply reproducibly with precise field targets and evidence limits', () => {
  const ledgerFile = new URL('../data/content-revisions.json', import.meta.url);
  assert.ok(fs.existsSync(ledgerFile), 'revision ledger must exist');
  const ledger = JSON.parse(fs.readFileSync(ledgerFile));
  assert.ok(ledger.revisions.length >= 20);
  const entities = new Map();
  function index(value) {
    if (Array.isArray(value)) value.forEach(index);
    else if (value && typeof value === 'object') {
      if (value.id) entities.set(typeof value.id === 'number' ? `unit:${value.id}` : value.id, value);
      Object.values(value).forEach(index);
    }
  }
  index(course);
  for (const revision of ledger.revisions) {
    assert.ok(revision.reason); assert.ok(revision.evidence.length);
    const actual = revision.field.split('.').reduce((v, key) => v[key], entities.get(revision.targetId));
    assert.equal(actual, revision.after, `${revision.targetId}.${revision.field}`);
    assert.notEqual(revision.before, revision.after);
    for (const evidence of revision.evidence) { assert.ok(evidence.sourceId); assert.ok(evidence.locator); }
  }
  const machiavelli = course.cards.find(c => c.id === 'u1-b1-c3').summary.en;
  assert.match(machiavelli, /cannot.*both/i); assert.match(machiavelli, /hatred/i);
  const westphalia = course.cards.find(c => c.id === 'u2-b3-c6').summary.en;
  assert.doesNotMatch(westphalia, /near-total sovereignty|HRE became hollow|start of the modern sovereign-state/i);
});

test('Trent revisions distinguish abuses from abolition of indulgence doctrine', () => {
  const card = course.cards.find(c => c.id === 'u2-b3-c2');
  const block = course.units[1].blocks.find(b => b.id === 'u2-b3');
  assert.match(card.summary.zh, /滥用/);
  assert.match(card.summary.en, /abuses/);
  assert.match(block.checks[1].answer.zh, /滥用/);
  assert.doesNotMatch(block.checks[1].answer.zh, /禁止赎罪券/);
  const ledger = JSON.parse(fs.readFileSync(new URL('../data/content-revisions.json', import.meta.url)));
  const machiavelli = ledger.revisions.find(r => r.targetId === 'u1-b1-c3');
  assert.match(machiavelli.corroboration[0].url, /gutenberg.*chap17/);
  assert.equal(machiavelli.corroboration[0].role, 'corrective corroboration; not a curriculum source');
  assert.equal(course.sources.length, 11);
});

test('material chronology and scope corrections retain dates and practice parallels', () => {
  const card = id => course.cards.find(c => c.id === id);
  assert.match(card('u1-b4-c5').summary.en, /unexpected inflation.*debtors.*creditors/i);
  assert.match(course.units[0].blocks[3].checks[4].answer.en, /fixed nominal/);
  assert.match(card('u1-b2-c2').summary.en, /1478/);
  assert.match(card('u6-b2-c3').summary.en, /boys under 10/);
  assert.match(course.units[5].finalReview[5].answer.en, /boys under 10/);
  assert.match(card('u6-b2-c3').date, /1847/);
  assert.doesNotMatch(card('u8-b4-c4').summary.en, /first great defeat/);
  assert.match(card('u8-b4-c4').summary.en, /El Alamein \(1942\)/);
});

test('screened historical overstatements are conditionally scoped in both languages', () => {
  const card = id => course.cards.find(c => c.id === id);
  assert.match(card('u1-b2-c4').detail.en, /1547/);
  assert.doesNotMatch(card('u1-b3-c4').detail.en, /rest of Latin America/);
  assert.doesNotMatch(card('u3-b1-c2').summary.en, /first public/);
  assert.doesNotMatch(card('u4-b1-c1').detail.en, /only on his deathbed/);
  assert.match(card('u5-b2-c2').detail.en, /if.*voted together/i);
  assert.match(card('u6-b2-c5').detail.en, /property/);
  assert.match(card('u9-b1-c1').summary.en, /1945/);
  assert.match(card('u9-b3-c1').summary.en, /partly free/);
});

test('French royal appointment powers do not erase Protestant reform in France', () => {
  const card = course.cards.find(c => c.id === 'u1-b2-c3');
  assert.doesNotMatch(card.summary.zh, /因此不需要宗教改革/);
  assert.match(card.summary.zh, /不意味着法国没有新教改革/);
  assert.match(card.summary.en, /did not prevent Protestant reform/);
});
