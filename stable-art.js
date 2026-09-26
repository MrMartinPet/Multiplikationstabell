/* Layered stable renderer. Horse body, mane and tail are recolored independently
   from the original commissioned raster so markings, eyes, tack and shading remain intact. */
(function(global){
'use strict';
const W=1448,H=1086,ROOT='assets/';
const clothing={
 top:{light:132,polygons:[[[337,329],[425,333],[468,377],[515,420],[511,465],[478,510],[482,562],[411,577],[345,581],[309,590],[260,550],[247,514],[254,475],[291,391]]]},
 bottom:{light:48,polygons:[[[326,578],[374,570],[417,564],[455,560],[463,571],[465,604],[462,644],[450,685],[438,729],[431,766],[423,801],[398,798],[374,786],[377,750],[386,710],[391,673],[377,697],[364,737],[349,773],[341,795],[329,803],[303,785],[307,764],[313,729],[314,688],[310,648],[313,610]]]},
 shoes:{light:55,polygons:[[[292,777],[310,790],[329,804],[342,802],[337,835],[326,875],[316,918],[315,945],[329,961],[340,984],[337,1008],[306,1017],[278,1013],[251,999],[253,970],[264,936],[265,886],[275,825]],[[376,786],[399,800],[424,801],[421,837],[414,884],[414,928],[424,956],[449,972],[471,985],[470,997],[445,1005],[414,1001],[387,991],[357,989],[357,961],[364,931],[364,882],[365,837]]]}
};
const gear={
 pad:{light:156,pieces:[]},
 wraps:{light:167,pieces:[
  {poly:[[710,855],[728,861],[761,861],[765,868],[758,905],[755,935],[746,975],[734,977],[688,962],[687,952],[696,920],[702,881]],box:[684,852,85,129],dest:[731,804,48,111]},
  {poly:[[813,868],[836,871],[865,866],[869,878],[867,918],[870,953],[865,980],[848,979],[827,975],[808,975],[807,963],[811,919]],box:[803,862,70,123],dest:[831,811,47,113]},
  {poly:[[1094,831],[1117,836],[1139,835],[1141,846],[1135,882],[1131,912],[1128,935],[1114,937],[1078,925],[1080,899],[1087,862]],box:[1074,827,71,114],dest:[1087,798,47,109]},
  {poly:[[1210,838],[1232,841],[1258,836],[1263,845],[1264,881],[1267,916],[1264,941],[1252,945],[1227,943],[1209,937],[1208,906],[1209,872]],box:[1204,832,68,119],dest:[1180,799,46,113]}
 ]},
 bridle:{light:92,leather:true,pieces:[
  {poly:[[524,169],[529,161],[548,157],[569,159],[591,166],[617,177],[614,190],[588,180],[565,172],[543,171],[525,182]],box:[460,151,174,236],dest:[488,172,170,233]},
  {poly:[[612,193],[620,201],[610,220],[598,244],[581,272],[563,302],[545,329],[535,336],[530,327],[549,302],[568,270],[588,239],[599,215]],box:[460,151,174,236],dest:[488,172,170,233]},
  {poly:[[467,301],[478,294],[491,295],[510,304],[530,319],[539,330],[531,338],[517,326],[498,313],[482,308],[473,311],[465,324]],box:[460,151,174,236],dest:[488,172,170,233]},
  {poly:[[616,236],[625,236],[625,283],[616,283]],box:[614,234,14,52],dest:[637,200,10,77]},
  {poly:[[616,231],[627,231],[627,267],[627,308],[622,327],[614,334],[584,343],[555,360],[548,379],[537,380],[533,370],[542,358],[563,347],[588,338],[613,327],[617,305]],box:[460,151,174,236],dest:[488,172,170,233]},
  {poly:[[530,327],[540,328],[549,338],[552,349],[549,357],[540,364],[530,362],[523,355],[520,345],[522,335]],hole:[[530,336],[527,345],[529,353],[536,356],[541,353],[543,346],[539,339]],box:[460,151,174,236],dest:[488,172,170,233]}
 ]},
 accessory:{light:194,pieces:[{poly:[[624,160],[638,155],[651,159],[661,166],[668,179],[668,194],[662,207],[669,234],[688,272],[677,270],[675,286],[661,280],[654,290],[648,282],[635,289],[630,279],[624,287],[628,260],[628,232],[623,211],[615,202],[610,189],[612,175]],box:[608,152,84,142],dest:[668,164,62,105]}]}
};

const regions={
 coat:[
  [[472,278],[488,229],[522,194],[547,147],[551,83],[566,66],[581,82],[587,125],[603,147],[609,75],[622,60],[637,74],[645,128],[681,153],[710,193],[721,247],[709,306],[682,347],[644,378],[604,394],[558,386],[518,366],[486,335]],
  [[619,282],[680,266],[741,285],[798,324],[850,353],[927,355],[1013,343],[1102,352],[1181,375],[1239,412],[1272,462],[1284,520],[1270,579],[1242,628],[1193,667],[1124,691],[1040,701],[951,694],[874,674],[814,646],[758,618],[704,594],[662,553],[635,501],[627,429]],
  [[681,551],[746,558],[760,647],[752,744],[744,842],[730,917],[694,918],[687,846],[691,762],[685,675]],
  [[776,570],[842,577],[857,659],[848,744],[847,836],[832,930],[797,927],[789,848],[793,752],[783,667]],
  [[1041,589],[1111,586],[1130,661],[1126,738],[1118,821],[1105,914],[1072,912],[1061,832],[1065,747],[1051,671]],
  [[1152,584],[1220,577],[1242,655],[1241,742],[1235,824],[1224,913],[1188,910],[1180,826],[1184,740],[1163,660]]
 ],
 mane:[[[556,103],[600,113],[641,132],[680,159],[716,192],[748,234],[773,281],[797,334],[824,383],[846,423],[832,457],[794,471],[757,448],[724,408],[699,367],[678,329],[655,291],[627,254],[597,226],[568,205],[544,178]]],
 tail:[[[1158,392],[1195,406],[1234,438],[1262,486],[1280,545],[1294,606],[1318,660],[1348,722],[1361,785],[1355,845],[1337,899],[1303,948],[1264,966],[1236,948],[1230,914],[1245,875],[1260,831],[1259,780],[1245,730],[1225,682],[1208,635],[1197,589],[1188,535],[1172,481]]]
};

const crops={
 top:[239,329,289,277],bottom:[291,549,191,270],shoes:[239,768,241,260],
 pad:[844,317,304,281],wraps:[700,751,214,208],bridle:[465,140,265,290],accessory:[637,133,125,165],
 coat:[458,62,905,910],mane:[535,70,340,445],maneColor:[535,70,340,445],tailColor:[1130,370,270,610],hair:[175,150,325,430]
};
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
let base,atlas,saddleSet,hairAtlas,ready,serial=0;
const layers=new Map(),paintCache=new Map();

function path(ctx,pts){ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath()}
function clipPolys(ctx,polys){ctx.beginPath();polys.forEach(p=>path(ctx,p));ctx.clip()}
function load(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('Bilden kunde inte laddas'));i.src=ROOT+src})}
function init(){return ready||(ready=Promise.all([load('stable-base-corrected.webp'),load('equipment-atlas.webp'),load('saddle-set.webp'),load('hairstyles-atlas.png')]).then(([b,a,s,h])=>{base=b;atlas=a;saddleSet=s;hairAtlas=h}))}
function rgb(hex){return[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16))}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function hsv(r,g,b){
 r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;
 if(d){if(mx===r)h=60*mod6((g-b)/d);else if(mx===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4)}
 return[h,mx?d/mx:0,mx];
}
function mod6(x){return((x%6)+6)%6}
function tonePixel(d,i,target,kind){
 const r=d[i],g=d[i+1],b=d[i+2],lum=(r*.2126+g*.7152+b*.0722),[h,s]=hsv(r,g,b);
 let keep=false;
 if(kind==='coat')keep=lum>42&&s>.16&&h>14&&h<65&&r>b*1.10&&g>b*.98;
 else keep=lum>92&&s<.38&&r>112&&g>105&&b>92;
 if(!keep){d[i+3]=0;return}
 const shade=kind==='coat'?clamp((lum-35)/180,.18,1.16):clamp((lum-70)/175,.18,1.12);
 const hi=clamp((lum-185)/70,0,.18);
 for(let j=0;j<3;j++){
  const baseC=target[j]*(.38+.78*shade);
  d[i+j]=clamp(baseC+(255-baseC)*hi,0,255);
 }
}
function regionLayer(key,item){
 if(!item||item.original||!/^#[0-9a-f]{6}$/i.test(item.c||''))return null;
 const cacheKey='region-'+key+'-'+item.c;if(layers.has(cacheKey))return layers.get(cacheKey);
 const c=make(),ctx=c.getContext('2d');ctx.save();clipPolys(ctx,regions[key]);ctx.drawImage(base,0,0,W,H);ctx.restore();
 const im=ctx.getImageData(0,0,W,H),d=im.data,target=rgb(item.c),kind=key==='coat'?'coat':'hair';
 for(let i=0;i<d.length;i+=4)if(d[i+3])tonePixel(d,i,target,kind);
 ctx.putImageData(im,0,0);
 if(layers.size>12)layers.delete(layers.keys().next().value);layers.set(cacheKey,c);return c;
}
function tint(canvas,color,reference,leather){
 const ctx=canvas.getContext('2d'),im=ctx.getImageData(0,0,W,H),p=im.data,c=rgb(color);
 for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const max=Math.max(p[i],p[i+1],p[i+2]),min=Math.min(p[i],p[i+1],p[i+2]);if(leather===true&&max-min<18)continue;if(leather==='saddle'&&!(p[i+1]>p[i]*1.015&&p[i+2]>p[i]*.60))continue;let l=(p[i]*.2126+p[i+1]*.7152+p[i+2]*.0722)/reference;l=Math.min(1.75,l);for(let j=0;j<3;j++)p[i+j]=Math.min(255,c[j]*l)}
 ctx.putImageData(im,0,0);return canvas
}
function clothingLayer(key,color){
 const cacheKey=key+color;if(layers.has(cacheKey))return layers.get(cacheKey);
 const c=make(),ctx=c.getContext('2d');ctx.save();clipPolys(ctx,clothing[key].polygons);ctx.drawImage(base,0,0,W,H);ctx.restore();
 if(key==='top'||key==='bottom'){const im=ctx.getImageData(0,0,W,H),d=im.data;for(let i=0;i<d.length;i+=4)if(key==='top'?(d[i+1]<d[i]*.93||d[i+1]<d[i+2]*1.02):(d[i]>d[i+2]*1.12&&d[i]>d[i+1]*1.12))d[i+3]=0;ctx.putImageData(im,0,0)}
 tint(c,color,clothing[key].light);if(layers.size>12)layers.delete(layers.keys().next().value);layers.set(cacheKey,c);return c
}
function gearLayer(key,color){
 const cacheKey=key+color;if(layers.has(cacheKey))return layers.get(cacheKey);
 const c=make(),ctx=c.getContext('2d');if(key==='pad')ctx.drawImage(saddleSet,858,337);
 for(const piece of gear[key].pieces){const cut=make(),cx=cut.getContext('2d');cx.save();cx.beginPath();path(cx,piece.poly);if(piece.hole)path(cx,piece.hole);cx.clip('evenodd');cx.drawImage(atlas,0,0,W,H);cx.restore();ctx.drawImage(cut,...piece.box,...piece.dest)}
 tint(c,color,gear[key].light,key==='pad'?'saddle':gear[key].leather);if(layers.size>12)layers.delete(layers.keys().next().value);layers.set(cacheKey,c);return c
}

const hairCrops=[[78,235,315,385],[795,260,175,360],[186,729,432,505],[812,732,408,506]];
const hairDest=[[187,260,159,272],[208,266,110,260],[679,192,252,294],[684,187,250,310]];
function atlasHairLayer(style,color){
 if(style==null||style<0||!/^#[0-9a-f]{6}$/i.test(color||''))return null;
 const cacheKey='hair-'+style+'-'+color;if(layers.has(cacheKey))return layers.get(cacheKey);
 const c=make(),ctx=c.getContext('2d');ctx.drawImage(hairAtlas,...hairCrops[style],...hairDest[style]);
 const im=ctx.getImageData(0,0,W,H),d=im.data,target=rgb(color);
 for(let i=0;i<d.length;i+=4){
  if(!d[i+3])continue;
  const warmth=d[i]-d[i+2];if(warmth<5){d[i+3]=0;continue}
  const lum=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722)/(style<2?105:215);
  for(let j=0;j<3;j++)d[i+j]=Math.min(255,target[j]*lum);
  d[i+3]*=Math.min(1,(warmth-5)/10);
 }
 ctx.putImageData(im,0,0);
 const [dx,dy,dw,dh]=hairDest[style];ctx.globalCompositeOperation='destination-in';
 const fade=ctx.createLinearGradient(0,dy,0,dy+38);fade.addColorStop(0,'transparent');fade.addColorStop(1,'black');ctx.fillStyle=fade;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';
 if(layers.size>12)layers.delete(layers.keys().next().value);layers.set(cacheKey,c);return c
}

function compose(colors){
 const key=JSON.stringify(colors);if(paintCache.has(key))return paintCache.get(key);
 const c=make(),ctx=c.getContext('2d');ctx.drawImage(base,0,0,W,H);
 // Hästen behåller alltid originalfärgen från grundillustrationen.
 for(const k of ['top','bottom','shoes'])if(/^#[0-9a-f]{6}$/i.test(colors[k]||''))ctx.drawImage(clothingLayer(k,colors[k]),0,0);
 for(const k of ['pad','wraps','bridle','accessory'])if(colors[k]&&colors[k]!=='transparent')ctx.drawImage(gearLayer(k,colors[k]),0,0);
 if(colors.playerHair&&colors.playerHair.c!=='transparent'){const l=atlasHairLayer(colors.playerHair.style,colors.playerHair.c);if(l)ctx.drawImage(l,0,0)}
 if(colors.maneStyle&&colors.maneStyle.style>=2){
  const l=atlasHairLayer(colors.maneStyle.style,'#f2e7cf');if(l)ctx.drawImage(l,0,0);
 }
 if(paintCache.size>5)paintCache.delete(paintCache.keys().next().value);paintCache.set(key,c);return c
}
function escape(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function schedule(id,colors,crop){
 queueMicrotask(()=>{init().then(()=>{const target=document.getElementById(id);if(!target)return;const ctx=target.getContext('2d');ctx.clearRect(0,0,target.width,target.height);const source=compose(colors);if(crop){const [x,y,w,h]=crop;ctx.drawImage(source,x,y,w,h,0,0,target.width,target.height)}else ctx.drawImage(source,0,0,target.width,target.height)}).catch(()=>{const el=document.getElementById(id);if(el&&!crop){const status=document.createElement('span');status.className='scene-status';status.textContent='Bilden kunde inte laddas. Ladda om sidan.';el.parentElement.append(status)}})})
}
function render(options){
 const id='stable-canvas-'+(++serial),colors={};
 colors.maneStyle=options.find(options.equipped.mane);
 colors.playerHair=options.find(options.equipped.hair);
 for(const k of Object.keys(clothing)){const item=options.find(options.equipped[k]);colors[k]=item?.c||'transparent'}
 for(const k of Object.keys(gear)){const item=options.find(options.equipped[k]);colors[k]=item?.c||'transparent'}
 schedule(id,colors);
 return '<canvas id="'+id+'" class="stable-paint" width="'+W+'" height="'+H+'" role="img" aria-label="'+escape(options.playerName)+' och '+escape(options.horseName)+' i stallet, med dina valda kläder och hästfärger" style="background:center/cover url(\''+ROOT+'stable-base-corrected.webp\')"></canvas><div class="stable-title">♥ '+escape(options.stallName)+' ♥</div>'
}
function thumbnail(category,item){
 const id='item-canvas-'+(++serial),crop=crops[category]||[500,110,455,385],colors={};
 if(category==='mane'){
  colors.maneStyle=item;
 }else if(category==='hair')colors.playerHair=item;
 else colors[category]=item.c;
 schedule(id,colors,crop);
 return '<canvas id="'+id+'" class="item-preview" width="'+Math.round(180*crop[2]/crop[3])+'" height="180" aria-hidden="true"></canvas>'
}
global.StableArt={render,thumbnail,ready:init,compose,_regions:regions,_size:[W,H]};
})(window);