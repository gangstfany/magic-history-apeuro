export function project(lon,lat){return {x:(lon+180)*1600/360,y:(90-lat)*800/180};}
export function screenPoint(point,view,width,height){const scale=Math.min(width/view.w,height/view.h);return {x:(width-view.w*scale)/2+(point.x-view.x)*scale,y:(height-view.h*scale)/2+(point.y-view.y)*scale};}
export function overlap(a,b,gap=5){return a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;}
export function layoutLabels(points,width,height,obstacles=[]){
 const placed=[],hidden=[];
 for(const p of points){
  const choices=[{x:p.x-p.w/2,y:p.y-p.h/2}];
  for(let r=36;r<Math.hypot(width,height);r+=28)for(let a=0;a<Math.PI*2;a+=Math.PI/8)choices.push({x:p.x+Math.cos(a)*r-p.w/2,y:p.y+Math.sin(a)*r-p.h/2});
  const candidate=choices.map(c=>({...p,...c})).find(c=>c.x>=8&&c.y>=8&&c.x+c.w<=width-8&&c.y+c.h<=height-8&&![...placed,...obstacles].some(o=>overlap(c,o)));
  if(candidate)placed.push({...candidate,anchorX:p.x,anchorY:p.y});else hidden.push(p);
 }
 return {placed,hidden};
}
export const EUROPE_VIEW={x:685,y:55,w:450,h:280};
export const WORLD_VIEW={x:0,y:0,w:1600,h:800};
export function fitView(places,{width=800,height=500}={}){
 if(!places.length)return {...EUROPE_VIEW};const points=places.map(p=>project(p.lon,p.lat));
 let x=Math.min(...points.map(p=>p.x)),y=Math.min(...points.map(p=>p.y));
 let w=Math.max(...points.map(p=>p.x))-x,h=Math.max(...points.map(p=>p.y))-y;
 const pad=Math.max(26,w*.12,h*.12);x-=pad;y-=pad;w+=pad*2;h+=pad*2;
 w=Math.max(w,170);h=Math.max(h,110);const ratio=width/height;if(w/h<ratio){x-=(h*ratio-w)/2;w=h*ratio;}else{y-=(w/ratio-h)/2;h=w/ratio;}
 return {x:Math.max(-40,x),y:Math.max(-40,y),w:Math.min(1680,w),h:Math.min(880,h)};
}
