export const THEMES={INT:'Europe & the World',ECD:'Economic Development',CID:'Cultural & Intellectual Life',SOP:'States & Power',SCD:'Society',NEI:'National & European Identity',TSI:'Technology & Science'};
export const SKILLS={CAUS:'Causation',COMP:'Comparison',CC:'Continuity & Change'};
export function normalize(value){return String(value??'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[‘’ʼ]/g,"'").replace(/\s+/g,' ').trim();}
export function filterCards(cards,{unit='all',search='',theme='',skill='',block=''}={}){
 const tokens=normalize(search).split(' ').filter(Boolean);
 return cards.filter(card=>(unit==='all'||card.unit===Number(unit))&&(!theme||card.themes.includes(theme))&&(!skill||card.skill===skill)&&(!block||card.blockId===block)&&tokens.every(token=>normalize([card.title.zh,card.title.en,card.summary.zh,card.summary.en,card.detail.zh,card.detail.en,card.date,card.topicIds.join(' ')].join(' ')).includes(token)));
}
export function cardsAtPlace(cards,links,placeId){return cards.filter(card=>(links[card.id]||[]).includes(placeId));}
export function checksForUnit(course,unit){return course.units.filter(u=>unit==='all'||u.id===Number(unit)).flatMap(u=>u.blocks.flatMap(b=>b.checks.map(q=>({...q,unit:u.id,blockId:b.id,blockTitle:b.title}))));}
export function parseProgress(raw,validIds){
 const clean={seen:[],saved:[],review:[],mastered:[]};
 try{const source=JSON.parse(raw);if(!source||typeof source!=='object')return clean;for(const key of Object.keys(clean)){if(Array.isArray(source[key]))clean[key]=[...new Set(source[key].filter(id=>typeof id==='string'&&validIds.has(id)))];}}catch{}
 return clean;
}
export function transitionUnit(state,unit){return {...state,unit:unit==='all'?'all':Number(unit),selectedCard:null,selectedPlace:null,search:'',theme:'',skill:'',block:'',queue:'',practiceIndex:0,chainId:null,chainIndex:0};}
export function sourceLabel(course,source){const entry=course.sources.find(s=>s.id===source.sourceId);return {title:entry?.title||source.sourceId,url:entry?.url||'',locator:source.locator};}
export function groupedPlaces(cards,links,places){return places.map(place=>({...place,cards:cardsAtPlace(cards,links,place.id)})).filter(place=>place.cards.length);}
export function safeStoredProgress(storage,key,validIds){try{return parseProgress(storage.getItem(key),validIds);}catch{return parseProgress(null,validIds);}}
export function assessQuestion(progress,id,kind){if(!['mastered','review'].includes(kind))throw new Error('Invalid assessment');const next={...progress,mastered:progress.mastered.filter(x=>x!==id),review:progress.review.filter(x=>x!==id)};next[kind].push(id);return next;}

export function resolveChain(chains,unit,chainId){const group=chains.filter(c=>c.unit===Number(unit));return group.find(c=>c.id===chainId)||group[0]||null;}
export function transitionChain(state,chains,chainId){const chain=chains.find(c=>c.unit===Number(state.unit)&&c.id===chainId);if(!chain)return state;return {...state,chainId:chain.id,chainIndex:0,selectedCard:null,selectedPlace:null};}
