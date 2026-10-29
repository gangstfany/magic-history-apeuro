import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {dockLayout,viewForDock,anchorNumber,focusCountries} from '../src/map-presentation.mjs';
import {screenPoint,overlap} from '../src/geometry.mjs';
test('side/bottom docks keep real geographic anchor outside card and zoom controls at desktop and mobile sizes',()=>{
 for(const [width,height] of [[320,570],[390,570],[615,620],[800,620],[1280,700]]){
  const layout=dockLayout(width,height),anchor={x:880,y:185};
  const view=viewForDock({x:795,y:130,w:170,h:110},anchor,width,height,layout);
  const p=screenPoint(anchor,view,width,height),marker={x:p.x-24,y:p.y-24,w:48,h:48};
  assert.ok(layout.dock.x>=8&&layout.dock.y>=8);assert.ok(layout.dock.x+layout.dock.w<=width-8);assert.ok(layout.dock.y+layout.dock.h<=height-8);
  assert.ok(!overlap(marker,layout.dock,12));assert.ok(!overlap(marker,{x:width-66,y:0,w:66,h:175},8));assert.ok(marker.x>=8&&marker.y>=60&&marker.x+48<=width-8&&marker.y+48<=height-8);
 }
});
test('map numbers use stable Unit order and chain numbers use active step, never zero',()=>{
 const anchors={units:{1:['florence','europe','mainz']}};const groups=[{id:'mainz'}];
 assert.equal(anchorNumber('mainz',1,anchors,groups),3);assert.equal(anchorNumber('mainz','all',anchors,groups),3);assert.equal(anchorNumber('mainz',1,anchors,groups,4),5);
});
test('visual layer replaces alternating country fills and text bubbles, preserves accessible labels and learning helpers',()=>{
 const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'),base=read('styles.css'),css=read('assets/apwh-visual.css'),html=read('index.html'),app=read('src/app.mjs');
 assert.doesNotMatch(base,/\.map-base path:nth-child/);assert.match(css,/#efe7d6/);assert.match(css,/border-radius:50%/);assert.match(css,/\.dock-body[^}]*overflow-y:auto/);assert.match(html,/assets\/apwh-visual.css/);assert.match(app,/anchorNumber\(/);assert.match(app,/aria-label=/);assert.match(app,/helpersMarkup\(/);
});

test('focus highlights use only existing modern country geometries, leaving broad anchors neutral',()=>{
 const course=JSON.parse(fs.readFileSync(new URL('../data/study-anchors.json',import.meta.url))),svg=fs.readFileSync(new URL('../assets/world.svg',import.meta.url),'utf8');
 for(const id of new Set(Object.values(course.cards)))for(const code of focusCountries(id))assert.ok(svg.includes(`data-country="${code}"`),`${id}: ${code}`);
 assert.deepEqual(focusCountries('atlantic'),[]);assert.deepEqual(focusCountries('florence'),['ITA']);
});

test('All Units map pin numbers match the same places in every Unit directory',()=>{
 const load=p=>JSON.parse(fs.readFileSync(new URL('../data/'+p,import.meta.url)));const anchors=load('study-anchors.json');const global=[...new Set(Object.values(anchors.units).flat())];
 for(const [unit,ids] of Object.entries(anchors.units))for(const id of ids){const groups=global.map(id=>({id}));assert.equal(anchorNumber(id,'all',anchors,groups),anchorNumber(id,unit,anchors,groups),id);}
});
