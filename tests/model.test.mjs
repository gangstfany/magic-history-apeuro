import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterCards,cardsAtPlace,checksForUnit,parseProgress,transitionUnit} from '../src/model.mjs';
const course=JSON.parse(readFileSync(new URL('../data/course.json',import.meta.url)));
test('multilingual AND facets keep source content immutable',()=>{
 const before=JSON.stringify(course.cards);
 assert.equal(filterCards(course.cards,{unit:1}).length,23);
 assert.ok(filterCards(course.cards,{unit:1,search:'印刷'}).length>0);
 const q=filterCards(course.cards,{unit:1,search:'Gutenberg',theme:'CID',skill:'CAUS'});
 assert.ok(q.some(c=>c.title.en.includes('printing')));
 assert.equal(filterCards(course.cards,{unit:1,search:'no-such-text-xyz'}).length,0);
 assert.equal(JSON.stringify(course.cards),before);
});
test('location lookup and unit transition cannot leak incompatible selections',()=>{
 const links={a:['paris'],b:[]};assert.deepEqual(cardsAtPlace([{id:'a'},{id:'b'}],links,'paris'),[{id:'a'}]);
 const next=transitionUnit({unit:1,selectedCard:'old',selectedPlace:'paris',search:'old',theme:'CID',skill:'COMP',block:'old',mode:'map'},9);
 assert.equal(next.unit,9);assert.equal(next.selectedCard,null);assert.equal(next.search,'');assert.equal(next.theme,'');assert.equal(next.block,'');
});
test('retrieval practice uses supplied answer pairs, never fabricates official scoring',()=>{
 const qs=checksForUnit(course,1);assert.ok(qs.length>10);assert.ok(qs.every(q=>q.origin==='user-authored'&&q.question.en&&q.answer.en));
 assert.equal(checksForUnit(course,1).length,course.units[0].blocks.reduce((n,b)=>n+b.checks.length,0));
});
test('malformed or foreign local progress cannot poison valid IDs',()=>{
 assert.deepEqual(parseProgress('{bad',new Set(['a'])),{seen:[],saved:[],review:[],mastered:[]});
 assert.deepEqual(parseProgress(JSON.stringify({saved:['a','x','a'],seen:'oops'}),new Set(['a'])),{seen:[],saved:['a'],review:[],mastered:[]});
});
test('mastering a review question keeps the next remaining question at the same index',async()=>{const {assessQuestion}=await import('../src/model.mjs');const p={seen:[],saved:[],mastered:[],review:['q1','q2','q3']};const result=assessQuestion(p,'q1','mastered');assert.deepEqual(result.review,['q2','q3']);assert.equal(result.review[0],'q2');assert.deepEqual(result.mastered,['q1']);assert.deepEqual(p.review,['q1','q2','q3']);assert.deepEqual(assessQuestion(result,'q1','review').mastered,[]);});
