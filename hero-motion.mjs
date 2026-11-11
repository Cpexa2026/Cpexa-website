/**
 * Mount on the .hero-photo.motion-fit element. Call the returned destroy()
 * function when a component unmounts. No dependencies, network calls or video.
 */
export function mountCpexaHeroMotion(stage) {
  const canvas=stage.querySelector('.motion-art');
  const button=stage.querySelector('.motion-play');
  const g=canvas?.getContext('2d');
  if(!canvas || !button || !g) return {destroy(){}};
  const embed=true;
const W=1280,H=720,D=9,TAU=Math.PI*2, cx=640,cy=319;
const clamp=x=>Math.max(0,Math.min(1,x)), mix=(a,b,u)=>a+(b-a)*u;
const smooth=(a,b,t)=>{const x=clamp((t-a)/(b-a));return x*x*(3-2*x)};
const ease=x=>1-Math.pow(1-clamp(x),3);
const rr=(x,y,w,h,r)=>{g.beginPath();g.roundRect(x,y,w,h,r)};
const line=(x,y,X,Y)=>{g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.stroke()};
const dot=(x,y,r)=>{g.beginPath();g.arc(x,y,r,0,TAU);g.fill()};
function radial(x,y,r,stops){
 const p=g.createRadialGradient(x,y,0,x,y,r);stops.forEach(([a,c])=>p.addColorStop(a,c));return p;
}
function linear(x,y,X,Y,stops){
 const p=g.createLinearGradient(x,y,X,Y);stops.forEach(([a,c])=>p.addColorStop(a,c));return p;
}
function spaced(s,x,y,size,color,tracking=3){
 g.font='500 '+size+'px sans-serif';g.fillStyle=color;
 for(const c of s){g.fillText(c,x,y);x+=g.measureText(c).width+tracking}
}
function vec(u,v,a,b,s,x,y,z=0){
 const X=u*Math.cos(a)+z*Math.sin(a),Z=-u*Math.sin(a)+z*Math.cos(a);
 const Y=v*Math.cos(b)-Z*Math.sin(b),zz=v*Math.sin(b)+Z*Math.cos(b);
 const f=1060/(1060-zz);return [x+X*s*f,y+Y*s*f,zz];
}
const rnd=i=>{let n=Math.sin(i*127.1+311.7)*43758.5453123;return n-Math.floor(n)};
const particles=Array.from({length:380},(_,i)=>{
 let x,y;
 if(i<260){
  const u=i/260*4,j=Math.floor(u),k=u%1;
  [x,y]=[[mix(-197,197,k),-123],[197,mix(-123,123,k)],[mix(197,-197,k),123],[-197,mix(123,-123,k)]][j];
  if(Math.abs(x)>178&&Math.abs(y)>104){const a=Math.atan2((Math.abs(y)-104),(Math.abs(x)-178));x=Math.sign(x)*(178+19*Math.cos(a));y=Math.sign(y)*(104+19*Math.sin(a))}
 }else{x=(rnd(i+12)-.5)*373;y=(rnd(i+42)-.5)*224}
 const h=1-2*(i+.5)/380;
 return {x,y,h,a:i*2.3999632297,n:rnd(i+2),m:rnd(i+81)};
});
function pose(t,gold){
 if(!gold){
  const u=ease((t-.05)/2.35),d=smooth(1.9,3.05,t);
  return [-.44+.65*u-.25*d,.24-.34*u+.14*d,.61+.46*u+.025*d,cx,cy+42*(1-u)-5*d];
 }
 const u=smooth(5.6,7.75,t);
 return [.42-.58*u,-.23+.31*u,.91+.16*u,cx,cy+8*(1-u)];
}
function frame(t){
 t=Math.max(0,Math.min(D,t));
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);
 g.setTransform(1,0,0,1,-232,-46);
 const forming=smooth(1.85,3.32,t),unforming=smooth(5.25,7.08,t);
 const ai=forming*(1-unforming), golden=smooth(5.46,7.44,t);
 if(!embed){
  g.fillStyle=linear(0,0,W,H,[[0,'#061b2b'],[.56,'#0a293d'],[1,'#07121d']]);g.fillRect(0,0,W,H);
  g.fillStyle=radial(cx,cy,530,[[0,'rgba(19,76,108,.65)'],[.58,'rgba(11,48,70,.3)'],[1,'rgba(4,16,29,0)']]);g.fillRect(0,0,W,H);
 }
 g.fillStyle=radial(cx,cy,410,[[0,'rgba(42,121,157,'+(.22+ai*.25)+')'],[1,'rgba(12,51,77,0)']]);g.fillRect(0,0,W,H);
 g.fillStyle=radial(cx+90,cy+44,380,[[0,'rgba(179,126,42,'+(golden*.24)+')'],[1,'rgba(179,126,42,0)']]);g.fillRect(0,0,W,H);
 g.save();
 if(embed){g.translate(640,360);g.scale(1.34,1.34);g.translate(-640,-319)}
 // Dim registration marks and a shallow floor give the object a physical stage.
 if(!embed){
  g.save();g.strokeStyle='rgba(137,185,205,.11)';
  for(let x=160;x<=1120;x+=80)for(let y=140;y<=500;y+=60){line(x-2,y,x+2,y);line(x,y-2,x,y+2)}
  g.restore();
 }
 g.fillStyle=radial(cx,cy+160,248,[[0,'rgba(0,6,13,.45)'],[1,'rgba(0,6,13,0)']]);
 g.save();g.translate(cx,cy+160);g.scale(1,.19);g.translate(-cx,-cy-160);g.fillRect(370,cy-120,540,560);g.restore();
 const inA=1-smooth(1.96,2.98,t),outA=smooth(5.88,7.17,t);
 const p=pose(t,false),q=pose(t,true);
 if(inA>.001)card(false,p,inA,t);
 if(outA>.001)card(true,q,outA,t);
 g.save();g.translate(cx,cy);
 const halo=ai*smooth(2.35,3.45,t);
 if(halo>.001){
  g.fillStyle=radial(0,0,198,[[0,'rgba(94,207,237,'+(halo*.27)+')'],[.7,'rgba(58,157,201,'+(halo*.10)+')'],[1,'rgba(58,157,201,0)']]);g.fillRect(-200,-200,400,400);
  for(let j=0;j<3;j++){
   g.save();g.rotate([-.54,.56,1.57][j]+.06*Math.sin(t*1.7+j));
   g.lineWidth=1.05;g.strokeStyle='rgba(135,214,230,'+(halo*.33)+')';g.beginPath();g.ellipse(0,0,196-j*10,52+j*10,0,0,TAU);g.stroke();
   const a=t*(1.13+j*.2)+j*2;g.shadowColor='#7ddbf0';g.shadowBlur=10;g.fillStyle='rgba(214,250,250,'+(halo*.94)+')';dot((196-j*10)*Math.cos(a),(52+j*10)*Math.sin(a),3.2);
   g.restore();
  }
  for(let r=120;r<=174;r+=54){g.strokeStyle='rgba(116,190,213,'+(halo*.17)+')';g.setLineDash([2,7]);g.beginPath();g.arc(0,0,r,0,TAU);g.stroke()}
  g.setLineDash([]);
 }
 g.restore();
 if(t>1.83&&t<7.38){
  const f=smooth(1.83,2.5,t)*(1-smooth(6.53,7.38,t));
  const turn=(t-2.5)*.78;
  for(const e of particles){
   const start=vec(e.x,e.y,...p),end=vec(e.x,e.y,...q);
   const r=Math.sqrt(1-e.h*e.h)*(119+e.n*32),a=e.a+turn,z=r*Math.sin(a);
   const orb=[cx+r*Math.cos(a)*1.04,cy+e.h*(129+e.m*20)+z*.16];
   const A=clamp((t-1.82-e.n*.36)/1.32),B=clamp((t-5.18-e.m*.42)/1.52);
   const u=A*A*(3-2*A),v=B*B*(3-2*B);
   const drift=Math.sin(Math.PI*u)*(e.m-.5)*77 +Math.sin(Math.PI*v)*(e.n-.5)*76;
   const x=mix(mix(start[0],orb[0],u),end[0],v)+drift;
   const y=mix(mix(start[1],orb[1],u),end[1],v)+drift*.72;
   const opacity=f*(.34+e.n*.6)*(.76+.24*z/152);
   g.fillStyle=t>5.24&&e.n<golden+.25?'rgba(255,214,133,'+opacity+')':'rgba(152,225,240,'+opacity+')';
   dot(x,y,(.66+e.m*1.17)*(.87+.23*u));
  }
 }
 if(halo>.001)core(t,halo);
 g.restore();
 if(!embed)titles(t);
}
function card(isGold,p,alpha,t){
 const [a,b,s,x,y]=p;
 g.save();g.globalAlpha=alpha;
 // Project the card plane with a shallow turn and a visible edge.
 g.translate(x,y);g.scale(s,s);
 g.transform(Math.cos(a),Math.sin(a)*Math.sin(b),.08*Math.sin(b),Math.cos(b),0,0);
 g.shadowColor=isGold?'rgba(240,193,97,.28)':'rgba(44,155,198,.27)';g.shadowBlur=31;
 rr(-198,-124,396,248,20);g.fillStyle=isGold?'#aa7633':'#123b52';g.fill();
 g.shadowBlur=0;
 rr(-198,-124,396,248,20);g.clip();
 g.fillStyle=isGold?linear(-205,130,183,-170,[[0,'#9e6f2f'],[.27,'#e9bd68'],[.53,'#ffe9ab'],[.77,'#c08c40'],[1,'#f6d482']]):linear(-174,134,170,-145,[[0,'#061824'],[.48,'#103347'],[1,'#20516a']]);
 g.fillRect(-200,-126,400,252);
 for(let i=0;i<195;i++){
  const y=-122+i*1.27;g.strokeStyle=isGold?'rgba(100,65,20,'+(rnd(i)*.09)+')':'rgba(152,224,249,'+(rnd(i)*.042)+')';g.lineWidth=.55;line(-199,y,200,y);
 }
 g.strokeStyle=isGold?'rgba(101,64,24,.24)':'rgba(125,202,224,.23)';g.lineWidth=.9;
 for(let i=0;i<8;i++){g.beginPath();g.ellipse(204,49,93+i*12,51+i*10,-.55,0,TAU);g.stroke()}
 const ink=isGold?'#292117':'#f7f2df',sub=isGold?'#4c351c':'#b9d7e0';
 g.strokeStyle=isGold?'#54401d':'#e7c376';g.lineWidth=1.35;
 g.beginPath();g.moveTo(-168,-78);g.lineTo(-160,-92);g.lineTo(-152,-78);g.lineTo(-160,-82);g.closePath();g.stroke();
 spaced('CPEXA',-142,-78,21,ink,2.5);
 rr(-166,-24,43,32,6);g.fillStyle=isGold?'#805625':'#c19d58';g.fill();
 rr(-164,-22,39,28,5);g.fillStyle=linear(-164,6,-128,-25,[[0,'#ab7637'],[.48,'#f6dd9b'],[1,'#c69a53']]);g.fill();
 g.lineWidth=.8;g.strokeStyle='#8b622c';line(-164,-13,-125,-13);line(-164,-3,-125,-3);line(-149,-22,-149,6);line(-139,-22,-139,6);
 g.strokeStyle=sub;g.lineWidth=1.4;
 for(let i=0;i<3;i++){g.beginPath();g.arc(-109,-8,5+4*i,-.64,.64);g.stroke()}
 spaced(isGold?'EXPERTISE IN MOTION':'COMMERCIAL PURCHASING',-167,82,11,ink,1.45);
 spaced('CPEXA  /  CONCEPT CARD',-167,103,7.8,sub,1.45);
 const swipe=isGold?smooth(6.69,8.17,t):smooth(.35,2.25,t);
 const sx=mix(-435,430,swipe);
 g.fillStyle=linear(sx-78,0,sx+78,0,[[0,'rgba(255,255,255,0)'],[.5,isGold?'rgba(255,250,216,.3)':'rgba(167,231,247,.14)'],[1,'rgba(255,255,255,0)']]);
 g.save();g.transform(1,0,-.5,1,0,0);g.fillRect(sx-79,-130,158,260);g.restore();
 rr(-197,-123,394,246,19);
 g.strokeStyle=isGold?linear(-175,110,180,-120,[[0,'#ba8744'],[.56,'#ffe9ab'],[1,'#fff3cc']]):linear(-193,124,187,-124,[[0,'#28566b'],[.59,'#80bbce'],[1,'#cce8ee']]);g.lineWidth=2;g.stroke();
 rr(-189,-115,378,230,14);g.strokeStyle=isGold?'rgba(90,61,19,.32)':'rgba(160,218,232,.18)';g.lineWidth=.7;g.stroke();
 g.restore();
}
function core(t,a){
 g.save();g.translate(cx,cy);g.globalAlpha=a;
 const pulse=.5+.5*Math.sin(t*4.3);
 g.strokeStyle='rgba(172,229,240,.47)';g.lineWidth=1;
 g.beginPath();g.arc(0,0,61+pulse*1.8,0,TAU);g.stroke();
 g.rotate(.18*Math.sin(t*1.9));
 g.beginPath();for(let i=0;i<6;i++){let k=i*TAU/6;let x=53*Math.cos(k),y=53*Math.sin(k);i?g.lineTo(x,y):g.moveTo(x,y)}g.closePath();
 g.fillStyle='rgba(9,47,68,.91)';g.fill();g.strokeStyle='#92d8e8';g.stroke();
 g.shadowColor='#94e7fc';g.shadowBlur=18+pulse*7;g.fillStyle='#d6f8f8';
 g.beginPath();g.moveTo(0,-30);g.quadraticCurveTo(5,-5,27,0);g.quadraticCurveTo(5,5,0,30);g.quadraticCurveTo(-5,5,-27,0);g.quadraticCurveTo(-5,-5,0,-30);g.fill();
 g.shadowBlur=0;g.fillStyle='#f4d18a';dot(21,-20,2.4);dot(-22,20,1.7);
 g.restore();
}


  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let at=0,start=null,req=0,playing=false,userPaused=false;
  function seek(t){at=t;frame(t)}
  function halt(){
    playing=false;cancelAnimationFrame(req);
    button.textContent=userPaused?'Play motion':'Pause motion';
  }
  function step(now){
    if(!playing)return;
    if(start===null)start=now-at*1000;
    let t=(now-start)/1000;
    if(t>=D){t%=D;start=now-t*1000}
    seek(t);
    req=requestAnimationFrame(step);
  }
  function play(){
    if(reduced.matches||userPaused)return;
    if(at>=D)seek(0);
    playing=true;start=null;button.textContent='Pause motion';
    req=requestAnimationFrame(step);
  }
  function onClick(){
    if(reduced.matches)return;
    if(playing){userPaused=true;halt()}
    else{userPaused=false;play()}
  }
  function onPreference(){
    if(reduced.matches){userPaused=false;seek(D);halt();button.textContent='Play motion'}
  }
  function onVisibility(){
    if(document.hidden){if(playing)halt()}
    else if(!userPaused&&!reduced.matches)play();
  }
  button.addEventListener('click',onClick);
  reduced.addEventListener('change',onPreference);
  document.addEventListener('visibilitychange',onVisibility);
  seek(reduced.matches?D:0);
  if(reduced.matches){halt();button.textContent='Play motion'}
  const observer=new IntersectionObserver(([entry])=>{
    if(entry.isIntersecting&&!userPaused&&!reduced.matches&&!document.hidden)play();
    else if(!entry.isIntersecting&&playing)halt();
  },{threshold:.22});
  observer.observe(canvas);
  return {destroy(){
    halt();observer.disconnect();
    button.removeEventListener('click',onClick);
    reduced.removeEventListener('change',onPreference);
    document.removeEventListener('visibilitychange',onVisibility);
  }};
}
