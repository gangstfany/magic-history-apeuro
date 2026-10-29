export function dockLayout(width,height){
 if(width<600){const h=Math.min(230,height*.42),dock={x:12,y:height-h-12,w:width-24,h};return {side:'bottom',dock,target:{x:width/2,y:Math.max(110,(dock.y+55)/2)}};}
 const w=Math.min(300,Math.max(220,width*.37)),h=Math.min(420,height-105),dock={x:16,y:Math.max(75,(height-h)/2),w,h};
 return {side:'left',dock,target:{x:(dock.x+dock.w+width-66)/2,y:height/2}};
}
export function viewForDock(base,anchor,width,height,layout){const h=Math.max(base.h,base.w*height/width),w=h*width/height;return {x:anchor.x-layout.target.x/width*w,y:anchor.y-layout.target.y/height*h,w,h};}
export function anchorNumber(id,unit,anchors,groups,step){if(Number.isInteger(step))return step+1;const index=(anchors.units[String(unit)]||[]).indexOf(id);return (index>=0?index:Math.max(0,groups.findIndex(p=>p.id===id)))+1;}
// Modern outlines provide context only; these are representative highlights, not historical borders.
const COUNTRIES={florence:['ITA'],rome:['ITA'],italy:['ITA'],mainz:['DEU'],wittenberg:['DEU'],worms:['DEU'],augsburg:['DEU'],germany:['DEU'],berlin:['DEU'],prussia:['DEU'],england:['GBR'],britain:['GBR'],london:['GBR'],'new-lanark':['GBR'],ireland:['IRL'],france:['FRA'],paris:['FRA'],versailles:['FRA'],spain:['ESP'],portugal:['PRT'],netherlands:['NLD'],amsterdam:['NLD'],poland:['POL'],austria:['AUT'],vienna:['AUT'],geneva:['CHE'],zurich:['CHE'],trent:['ITA'],westphalia:['DEU'],'holy-roman-empire':['DEU','AUT'],russia:['RUS'],'st-petersburg':['RUS'],moscow:['RUS'],'soviet-union':['RUS'],prague:['CZE'],hungary:['HUN'],maastricht:['NLD'],haiti:['HTI'],crimea:['UKR'],congo:['COD'],india:['IND'],china:['CHN'],sarajevo:['BIH'],stalingrad:['RUS'],auschwitz:['POL'],waterloo:['BEL'],yugoslavia:['SRB','HRV','BIH'],'western-front':['FRA','BEL']};
export function focusCountries(id){return COUNTRIES[id]||[];}
