const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const primaryLinksFor=anchors=>Object.fromEntries(Object.entries(anchors.cards).map(([id,place])=>[id,[place]]));
export function coreGroups(cards,anchors,places,unit){
 const byPlace=new Map(places.map(p=>[p.id,p]));
 return Object.entries(anchors.units).filter(([id])=>unit==='all'||Number(id)===Number(unit)).map(([id,order])=>({unit:Number(id),places:order.map((place,index)=>({...byPlace.get(place),number:index+1,cards:cards.filter(c=>c.unit===Number(id)&&anchors.cards[c.id]===place)})).filter(p=>p.cards.length)}));
}
export function directoryMarkup(groups,{lang='zh',unit,place}={}){
 return groups.map(group=>`<section class="study-directory-unit">${groups.length>1?`<h3>Unit ${group.unit} · ${group.places.length} places</h3>`:''}<div class="study-place-list">${group.places.map(p=>`<button type="button" class="study-place" data-study-unit="${group.unit}" data-study-place="${esc(p.id)}" aria-pressed="${Number(unit)===group.unit&&place===p.id}"><span class="study-pin-number">${p.number}</span><span class="study-place-copy"><span class="study-place-name">${esc(lang==='zh'?p.nameZh:p.nameEn)}</span><span class="study-place-meta">${p.cards.length} study points →</span></span></button>`).join('')}</div></section>`).join('');
}
export function openCorePlace(state,unit,place){return {...state,unit:Number(unit),mode:'map',selectedPlace:place,selectedCard:null,search:'',theme:'',skill:'',block:'',queue:''};}
