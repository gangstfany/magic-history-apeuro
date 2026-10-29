import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {coreGroups,directoryMarkup,primaryLinksFor,openCorePlace} from '../src/study-directory.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const course=JSON.parse(read('data/course.json')),places=JSON.parse(read('data/places.json')),anchors=JSON.parse(read('data/study-anchors.json'));
test('every card has one valid explicit primary anchor and no duplicate directory membership',()=>{
 assert.deepEqual(Object.keys(anchors.cards).sort(),course.cards.map(c=>c.id).sort());
 const valid=new Set(places.map(p=>p.id));for(const c of course.cards){assert.ok(valid.has(anchors.cards[c.id]));assert.ok(anchors.units[String(c.unit)].includes(anchors.cards[c.id]));}
 const groups=coreGroups(course.cards,anchors,places,'all');
 assert.equal(groups.length,9);
 for(const group of groups){assert.ok(group.places.length>=4&&group.places.length<=14);const ids=group.places.flatMap(p=>p.cards.map(c=>c.id));assert.deepEqual(ids.sort(),course.cards.filter(c=>c.unit===group.unit).map(c=>c.id).sort());assert.equal(new Set(ids).size,ids.length);}
 assert.ok(coreGroups(course.cards,anchors,places,1)[0].places.length<15);
 const links=primaryLinksFor(anchors);for(const c of course.cards)assert.equal(links[c.id].length,1);
});
test('APWH-style directory scopes only by Unit, has stable numbers and escapes markup',()=>{
 const groups=coreGroups(course.cards,anchors,places,1),markup=directoryMarkup(groups,{lang:'en'});
 assert.match(markup,/study-place-list/);assert.match(markup,/data-study-unit="1"/);assert.doesNotMatch(markup,/Unit 2/);
 const all=directoryMarkup(coreGroups(course.cards,anchors,places,'all'),{lang:'zh'});assert.equal((all.match(/study-directory-unit/g)||[]).length,9);
 const malicious=directoryMarkup([{unit:1,places:[{id:'x',number:1,nameEn:'<img>',nameZh:'<img>',cards:[{}]}]}],{lang:'en'});assert.ok(malicious.includes('&lt;img&gt;'));assert.ok(!malicious.includes('<img>'));
});
test('directory selection clears incompatible filters and selects correct unit and place',()=>{
 const next=openCorePlace({unit:1,search:'Gutenberg',theme:'CID',skill:'COMP',block:'x',queue:'saved',selectedCard:'old',mode:'chain'},2,'wittenberg');
 assert.equal(next.unit,2);assert.equal(next.mode,'map');assert.equal(next.selectedPlace,'wittenberg');assert.equal(next.selectedCard,null);for(const k of ['search','theme','skill','block','queue'])assert.equal(next[k],'');
});
test('directory uses APWH toolbar frame and responsive size rules, retains related links separately',()=>{
 const html=read('index.html'),js=read('src/app.mjs'),css=read('styles.css');
 assert.ok(html.indexOf('id="studyDirectory"')<html.indexOf('id="workspace"'));
 assert.match(html,/<details class="euro-study-directory" id="studyDirectory">/);
 assert.doesNotMatch(js,/class="place-index"/);
 assert.match(js,/coreGroups\(course.cards/);
 assert.match(css,/\.euro-study-directory \.study-place-list[^}]*repeat\(4/);
 assert.match(css,/max-height:260px/);
 assert.match(css,/@media\s*\(max-width:450px\)/);
 assert.match(js,/const locs=\(links\[card.id\]/);
});
