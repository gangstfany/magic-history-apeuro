import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import * as model from '../src/model.mjs';import * as geometry from '../src/geometry.mjs';import * as presentation from '../src/map-presentation.mjs';import * as directory from '../src/study-directory.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8'),data=p=>JSON.parse(read('data/'+p));
function mapHarness(){
 const nodes=new Map(),size={width:822,height:620};let resize;
 const element=selector=>{if(!nodes.has(selector)){const e={style:{},dataset:{},attrs:{},innerHTML:'',textContent:'',querySelectorAll:()=>[],setAttribute(k,v){this.attrs[k]=String(v);},addEventListener(){}};Object.defineProperties(e,{clientWidth:{get:()=>selector==='.map'?size.width:0},clientHeight:{get:()=>selector==='.map'?size.height:0},offsetLeft:{get:()=>parseFloat(e.style.left)||0},offsetTop:{get:()=>parseFloat(e.style.top)||0},offsetWidth:{get:()=>parseFloat(e.style.width)||0},offsetHeight:{get:()=>parseFloat(e.style.height)||0}});nodes.set(selector,e);}return nodes.get(selector);};
 const context=vm.createContext({...model,...geometry,...presentation,...directory,document:{querySelector:element,querySelectorAll:()=>[]},ResizeObserver:class{constructor(fn){resize=fn;}observe(){}},configureFavorites(){},publishFavorite(){}});
 vm.runInContext(read('src/app.mjs').replace(/^import .*;\n/gm,'').replace(/init\(\);\s*$/,''),context);
 context.fixture={course:data('course.json'),places:data('places.json'),links:data('card-locations.json').links,anchors:data('study-anchors.json'),chains:data('chains.json')};
 vm.runInContext("({course,places,links,anchors,chains}=fixture);primaryLinks=primaryLinksFor(anchors);state.mode='chain';resetView();wireMap([course.cards[0]],true);",context);
 return {resize(w,h){size.width=w;size.height=h;resize();},logical:()=>vm.runInContext('JSON.stringify(state.view)',context),view:()=>element('.map-base>svg').attrs.viewBox};
}
test('hidden iframe dimensions preserve logical camera and restore finite visible pins camera',()=>{
 const h=mapHarness(),logical=h.logical(),visible=h.view();h.resize(0,0);assert.equal(h.logical(),logical);h.resize(822,620);assert.equal(h.view(),visible);assert.doesNotMatch(h.view(),/NaN|Infinity/);
});
test('desktop/mobile round trips do not accumulate aspect expansion in the logical camera',()=>{
 const h=mapHarness(),logical=h.logical(),desktop=h.view();for(let i=0;i<4;i++){h.resize(368,570);h.resize(822,620);assert.equal(h.view(),desktop);assert.equal(h.logical(),logical);}
});
