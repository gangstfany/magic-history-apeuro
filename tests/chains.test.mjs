import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import * as model from '../src/model.mjs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/'+n,import.meta.url)));
const chains=read('chains.json'),course=read('course.json');
test('nine Units each offer three distinct question-led paths with source-linked mechanisms',()=>{
 assert.equal(chains.length,27);assert.equal(new Set(chains.map(c=>c.id)).size,27);
 for(let unit=1;unit<=9;unit++){
  const group=chains.filter(c=>c.unit===unit);assert.equal(group.length,3);assert.equal(new Set(group.map(c=>c.title.en)).size,3);
  for(const ch of group){assert.ok(ch.id.startsWith(`u${unit}-`));for(const key of ['title','question','takeaway'])for(const lang of ['zh','en'])assert.ok(ch[key]?.[lang]?.length>5,`${ch.id} missing ${key}.${lang}`);
   assert.ok(ch.steps.length>=5&&ch.steps.length<=7);assert.equal(new Set(ch.steps.map(x=>x.cardId)).size,ch.steps.length);
   for(const s of ch.steps){const card=course.cards.find(c=>c.id===s.cardId);assert.ok(card,`${ch.id}: missing ${s.cardId}`);assert.equal(card.unit,unit);assert.ok(card.sources.some(x=>x.sourceId==='ced-2026'));assert.ok(card.sources.some(x=>x.sourceId==='amsco'));assert.ok(s.connection.zh.length>15);assert.ok(s.connection.en.length>30);}
  }
 }
});
test('chain selection is scoped to Unit and clears stale steps/card/place without losing learning filters',()=>{
 assert.equal(typeof model.resolveChain,'function');assert.equal(typeof model.transitionChain,'function');
 const group=chains.filter(x=>x.unit===1),old={unit:1,chainId:group[0].id,chainIndex:4,selectedCard:'old',selectedPlace:'old',lang:'en',mode:'chain'};
 const next=model.transitionChain(old,chains,group[1].id);assert.equal(next.chainId,group[1].id);assert.equal(next.chainIndex,0);assert.equal(next.selectedCard,null);assert.equal(next.selectedPlace,null);assert.equal(next.lang,'en');assert.equal(old.chainIndex,4);
 assert.equal(model.resolveChain(chains,1,chains.find(c=>c.unit===2).id).id,group[0].id);assert.deepEqual(model.transitionChain(old,chains,chains.find(c=>c.unit===2).id),old);
 const reset=model.transitionUnit(next,2);assert.equal(reset.chainId,null);assert.equal(reset.chainIndex,0);assert.equal(model.resolveChain(chains,2,reset.chainId).unit,2);assert.equal(model.resolveChain(chains,'all',null),null);
});

test('each connection explicitly binds adjacent cards and distinguishes its historical relationship',()=>{
 const relations=new Set(['start','cause','condition','response','comparison','parallel','synthesis']);let edges=0;
 for(const chain of chains)for(let i=0;i<chain.steps.length;i++){
  const step=chain.steps[i];assert.ok(relations.has(step.relation),chain.id+':'+i);assert.equal(step.toCardId,step.cardId);
  assert.equal(step.fromCardId,i?chain.steps[i-1].cardId:null);assert.deepEqual(step.evidenceCardIds,i?[chain.steps[i-1].cardId,step.cardId]:[step.cardId]);
  if(i){edges++;assert.notEqual(step.relation,'start');}else assert.equal(step.relation,'start');
 }
 assert.equal(edges,123);
 assert.equal(chains.find(c=>c.id==='u1-state-building').steps[1].relation,'comparison');
 assert.equal(chains.find(c=>c.id==='u1-exchange').steps[1].relation,'condition');
});
