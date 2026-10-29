const IDENTITY={namespace:'magic-history',version:1,module:'apeuro'};
export function validHostOrigin(value){try{const u=new URL(value);return u.origin===value&&!u.username&&!u.password&&(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)));}catch{return false;}}
function command(item){return item&&item.kind==='study-card'&&typeof item.id==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,139}$/.test(item.id)?{id:item.id,kind:item.kind}:null;}
function metadata(item){if(!command(item)||typeof item.title!=='string'||!item.title.trim()||item.title.length>180||typeof item.subtitle!=='string'||item.subtitle.length>240||typeof item.unit!=='string'||item.unit.length>32)return null;return {id:item.id,kind:item.kind,title:item.title,subtitle:item.subtitle,unit:item.unit};}
export function mountEuroBridge({window:win,document:doc,ResizeObserver:Observer}){
 const params=new URLSearchParams(win.location.search),origin=params.get('hostOrigin')||params.get('parentOrigin'),embedded=win.parent!==win&&validHostOrigin(origin);
 let adapter,authorized=false,initialized=false,pendingInit,pendingSync,lastHeight=0,timer,imported=false;
 const noop=()=>{};if(!embedded)return {configure:noop,publish:noop,dispose:noop};
 doc.body.classList.add('is-module-embedded');
 const height=()=>{const bounds=doc.querySelector('.course-workspace')?.getBoundingClientRect();return Math.max(280,Math.min(30000,Math.ceil((bounds?.bottom||0)+(win.scrollY||0)+8)));};
 const send=(type,payload={})=>{if(authorized)win.parent.postMessage({...IDENTITY,type,...payload},origin);};
 const publishSize=(type='resize')=>{if(!authorized||!adapter)return;const next=height();if(type==='resize'&&next===lastHeight)return;lastHeight=next;send(type,{height:next});};
 const validItems=items=>(Array.isArray(items)?items:[]).slice(0,2000).map(metadata).filter(Boolean);
 function apply(items){adapter.onSync(validItems(items));}
 function initialize(data){if(!adapter){pendingInit=data;return;}const migrationKey='magic-history:apeuro:favorites-imported:'+origin;let previous=false;try{previous=win.localStorage.getItem(migrationKey)==='1';}catch{}
  if(!imported&&!previous){imported=true;try{win.localStorage.setItem(migrationKey,'1');}catch{}const items=validItems(adapter.getItems());if(items.length)send('favorites-import',{items});}
  initialized=true;apply(pendingSync??data.favorites??[]);pendingSync=undefined;pendingInit=undefined;publishSize('ready');
 }
 const receive=event=>{const data=event.data;if(event.source!==win.parent||event.origin!==origin||!data||data.namespace!==IDENTITY.namespace||data.version!==1||data.module!=='apeuro')return;
  if(data.type==='init'){authorized=true;initialize(data);return;}if(!authorized)return;
  if(data.type==='favorites-sync'){if(adapter&&initialized)apply(data.items);else pendingSync=data.items;return;}
  if(data.type==='open-favorite'&&adapter&&initialized){const item=command(data.item);if(!item)return;Promise.resolve().then(()=>adapter.onOpen(item)).then(ok=>send('favorite-opened',{...item,ok:ok===true})).catch(()=>send('favorite-opened',{...item,ok:false}));}
 };
 const schedule=()=>{win.clearTimeout(timer);timer=win.setTimeout(()=>publishSize(),80);};
 win.addEventListener('message',receive);win.addEventListener('resize',schedule);
 const observer=Observer?new Observer(schedule):null;observer?.observe(doc.querySelector('.course-workspace')||doc.documentElement);
 return {configure(value){adapter=value;if(pendingInit)initialize(pendingInit);},publish(action,item){const valid=metadata(item);if(valid&&initialized&&['add','remove'].includes(action))send('favorite-change',{action,item:valid});},dispose(){observer?.disconnect();win.clearTimeout(timer);win.removeEventListener('message',receive);win.removeEventListener('resize',schedule);}};
}
const bridge=typeof window!=='undefined'?mountEuroBridge({window,document,ResizeObserver:window.ResizeObserver}):null;
export function configureFavorites(adapter){bridge?.configure(adapter);}
export function publishFavorite(action,item){bridge?.publish(action,item);}
