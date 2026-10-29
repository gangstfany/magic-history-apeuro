import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as model from '../src/model.mjs';
import * as geometry from '../src/geometry.mjs';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const data=p=>JSON.parse(read('data/'+p));
function harness(){
 const elements=new Map(),published=[];let favorites;
 const element=selector=>{if(!elements.has(selector))elements.set(selector,{textContent:'',handlers:{},addEventListener(name,fn){this.handlers[name]=fn;},focus(){this.focused=true;}});return elements.get(selector);};
 const context=vm.createContext({...model,...geometry,document:{querySelector:element,querySelectorAll:()=>[]},localStorage:{setItem(){}},publishFavorite:(...args)=>published.push(args),configureFavorites:options=>{favorites=options;}});
 const source=read('src/app.mjs').replace(/^import .*;\n/gm,'').replace(/init\(\);\s*$/,'');
 vm.runInContext(source,context);
 context.fixture={course:data('course.json'),places:data('places.json'),links:data('card-locations.json').links,chains:data('chains.json')};
 vm.runInContext("({course,places,links,chains}=fixture);progress={seen:[],saved:[],review:[],mastered:[]};world='<svg></svg>';render=()=>{};",context);
 return {run:code=>vm.runInContext(code,context),elements,published,get favorites(){return favorites;}};
}
test('course shell follows APWH title/chain/map/practice order without a standalone hero',()=>{
 const html=read('index.html');assert.match(html,/class="course-workspace"/);assert.match(html,/History Europe Map/);
 assert.ok(html.indexOf('data-mode="chain"')<html.indexOf('data-mode="map"'));assert.ok(html.indexOf('data-mode="map"')<html.indexOf('data-mode="practice"'));
 assert.doesNotMatch(html,/class="intro"|progress-summary|01 <span>/);assert.ok(html.indexOf('id="unit"')>html.indexOf('class="map-card"'));
});
test('mode round trip restores selected map card/place, filters and viewport',()=>{
 const h=harness();h.run("state={...state,selectedCard:course.cards[0].id,selectedPlace:'florence',search:'Medici',theme:'SOP',block:'topic',queue:'saved',view:{x:12,y:24,w:300,h:200}};globalThis.before=JSON.stringify(state);switchMode('chain');");
 assert.equal(h.run('state.mode'),'chain');assert.equal(h.run('state.search'),'');h.run("switchMode('practice');switchMode('map');");assert.equal(h.run('JSON.stringify(state)'),h.run('before'));
});
test('explicit Unit change invalidates the suspended map selection',()=>{
 const h=harness();h.run("switchMode('chain');chooseUnit('2');switchMode('map');");assert.equal(h.run('Number(state.unit)'),2);assert.equal(h.run('state.selectedCard'),null);
});
test('favorites publish canonical bilingual metadata and can remove the same card',()=>{
 const h=harness();h.run('saveCard(course.cards[0].id)');const [action,item]=h.published[0];assert.equal(action,'add');assert.equal(item.kind,'study-card');assert.ok(item.id&&item.title&&item.subtitle&&item.unit);assert.equal(typeof item.unit,'string');assert.equal(h.run('progress.saved.length'),1);
 h.run('saveCard(course.cards[0].id)');assert.equal(h.published[1][0],'remove');assert.equal(h.run('progress.saved.length'),0);
});
test('host favorites sync validates IDs and opening a favorite clears incompatible map filters',()=>{
 const h=harness();h.run('setupFavorites()');const id=h.run('course.cards.at(-1).id'),unit=h.run('course.cards.at(-1).unit');
 h.favorites.onSync([{id,kind:'study-card'},{id,kind:'study-card'},{id:'unknown',kind:'study-card'},{id:h.run('course.cards[0].id'),kind:'event'}]);assert.equal(h.run('progress.saved.length'),1);assert.equal(h.favorites.getItems()[0].id,id);
 h.run("state={...state,mode:'practice',search:'conflict',theme:'SOP',skill:'comparison',queue:'saved',block:'incompatible'};");assert.equal(h.favorites.onOpen({id:'unknown',kind:'study-card'}),false);assert.equal(h.favorites.onOpen({id,kind:'event'}),false);assert.equal(h.favorites.onOpen({id}),false);assert.equal(h.favorites.onOpen({id,kind:'study-card'}),true);assert.equal(h.run('state.mode'),'map');assert.equal(h.run('state.unit'),unit);assert.equal(h.run('state.selectedCard'),id);for(const key of ['search','theme','skill','queue','block'])assert.equal(h.run('state.'+key),'');assert.ok(h.elements.get('#detail-heading').focused);
});
test('location-first index, topic helpers and unit review retain all teaching aids',()=>{
 const h=harness();const map=h.run('mapMarkup()');assert.match(map,/details open><summary>Study points/);
 const overview=h.run('overviewMarkup(selection())');assert.match(overview,/点击地图/);assert.match(overview,/比较、论证与速记/);assert.match(overview,/英文论证示例 · 教师编写/);assert.match(overview,/Unit 总复习与论证提示/);assert.doesNotMatch(overview,/class="story"/);
 for(let unit=1;unit<=9;unit++){h.run(`state.unit=${unit};`);const content=h.run('overviewMarkup(selection())');assert.match(content,/英文论证示例/);const tables=h.run('unitNow().blocks.reduce((n,b)=>n+b.comparisons.length,0)');assert.equal((content.match(/<table>/g)||[]).length,tables);}
});

test('chain selection stays in the right learning panel and resets the step and place',()=>{
 const h=harness();h.run("wireMap=()=>{};renderChain();");const html=h.elements.get('#workspace').innerHTML;assert.ok(html.indexOf('class="map-column"')<html.indexOf('id="chain-picker"'));assert.ok(html.indexOf('class="side-panel chain-side"')<html.indexOf('id="chain-picker"'));assert.equal((html.match(/<option /g)||[]).length,3);
 const next=h.run('chains.filter(c=>c.unit===1)[1].id');h.run("state.chainIndex=4;state.selectedPlace='florence';");h.elements.get('#chain-picker').handlers.change({target:{value:next}});assert.equal(h.run('state.chainId'),next);assert.equal(h.run('state.chainIndex'),0);assert.equal(h.run('state.selectedPlace'),null);
});
