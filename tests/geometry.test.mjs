import test from 'node:test';import assert from 'node:assert/strict';
import {project,screenPoint,layoutLabels,overlap} from '../src/geometry.mjs';
test('projection and screen coordinates preserve the basemap reference system',()=>{
 assert.deepEqual(project(0,0),{x:800,y:400});assert.deepEqual(project(-180,90),{x:0,y:0});
 assert.deepEqual(screenPoint({x:800,y:400},{x:0,y:0,w:1600,h:800},800,500),{x:400,y:250});
});
test('dense labels stay within bounds and avoid each other plus zoom controls',()=>{
 for(const width of [320,390,780]){
  const obstacle={x:width-60,y:10,w:48,h:150};
  const pts=Array.from({length:12},(_,i)=>({id:String(i),x:width/2+i%3*5,y:130+Math.floor(i/3)*5,w:width<500?44:110,h:44}));
  const {placed,hidden}=layoutLabels(pts,width,350,[obstacle]);assert.equal(placed.length+hidden.length,12);assert.ok(placed.length>=5);
  for(const a of placed){assert.ok(a.x>=8&&a.y>=8&&a.x+a.w<=width-8&&a.y+a.h<=342);assert.ok(!overlap(a,obstacle));}
  for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++)assert.ok(!overlap(placed[i],placed[j]));
 }
});
