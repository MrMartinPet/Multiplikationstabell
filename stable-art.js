/* Raster character rendering. Coordinates are masks over commissioned artwork,
   not replacement drawings. Every equipped item shares the same art space. */
(function(global){
'use strict';
const W=1448,H=1086,ROOT='assets/';
const clothing={
 top:{base:'#7fa38b',light:132,polygons:[[[344,336],[360,340],[361,352],[397,352],[399,337],[409,341],[417,359],[442,365],[465,383],[468,350],[501,270],[522,280],[505,320],[490,354],[487,377],[498,395],[483,421],[502,423],[514,429],[511,443],[503,456],[480,474],[468,491],[467,520],[472,549],[463,558],[443,562],[376,566],[326,577],[328,562],[321,551],[321,534],[329,513],[316,487],[307,454],[299,422],[302,398],[310,385],[323,375],[338,364]]]},
 bottom:{base:'#384a64',light:48,polygons:[[[326,578],[374,570],[417,564],[455,560],[463,571],[465,604],[462,644],[450,685],[438,729],[431,766],[423,801],[398,798],[374,786],[377,750],[386,710],[391,673],[377,697],[364,737],[349,773],[341,795],[329,803],[303,785],[307,764],[313,729],[314,688],[310,648],[313,610]]]},
 shoes:{base:'#6a4932',light:55,polygons:[[[292,777],[310,790],[329,804],[342,802],[337,835],[326,875],[316,918],[315,945],[329,961],[340,984],[337,1008],[306,1017],[278,1013],[251,999],[253,970],[264,936],[265,886],[275,825]],[[376,786],[399,800],[424,801],[421,837],[414,884],[414,928],[424,956],[449,972],[471,985],[470,997],[445,1005],[414,1001],[387,991],[357,989],[357,961],[364,931],[364,882],[365,837]]]},
};
// Each piece clips the raster atlas to the item's outline; the atlas background
// and unrelated parts never enter the visible scene.
const gear={
 pad:{light:192,pieces:[{poly:[[891,371],[908,379],[937,398],[971,412],[1007,416],[1045,411],[1081,397],[1117,391],[1131,398],[1143,420],[1155,457],[1167,504],[1171,543],[1167,573],[1159,596],[1145,610],[1119,619],[1038,624],[964,626],[934,620],[915,605],[905,584],[899,550],[897,483],[899,428],[897,395]],box:[886,367,291,263],dest:[891,348,267,225]}]},
 wraps:{light:167,pieces:[
 {poly:[[710,855],[728,861],[761,861],[765,868],[758,905],[755,935],[746,975],[734,977],[688,962],[687,952],[696,920],[702,881]] ,box:[684,852,85,129],dest:[735,781,47,112]},
 {poly:[[813,868],[836,871],[865,866],[869,878],[867,918],[870,953],[865,980],[848,979],[827,975],[808,975],[807,963],[811,919]] ,box:[803,862,70,123],dest:[828,786,48,116]},
 {poly:[[1094,831],[1117,836],[1139,835],[1141,846],[1135,882],[1131,912],[1128,935],[1114,937],[1078,925],[1080,899],[1087,862]] ,box:[1074,827,71,114],dest:[1090,789,48,111]},
 {poly:[[1210,838],[1232,841],[1258,836],[1263,845],[1264,881],[1267,916],[1264,941],[1252,945],[1227,943],[1209,937],[1208,906],[1209,872]] ,box:[1204,832,68,119],dest:[1182,784,45,118]}
 ]},
 bridle:{light:92,leather:true,pieces:[
 {poly:[[524,169],[529,161],[548,157],[569,159],[591,166],[617,177],[614,190],[588,180],[565,172],[543,171],[525,182]],box:[460,151,174,236],dest:[490,179,174,236]},
 {poly:[[612,193],[620,201],[610,220],[598,244],[581,272],[563,302],[545,329],[535,336],[530,327],[549,302],[568,270],[588,239],[599,215]],box:[460,151,174,236],dest:[490,179,174,236]},
 {poly:[[467,301],[478,294],[491,295],[510,304],[530,319],[539,330],[531,338],[517,326],[498,313],[482,308],[473,311],[465,324]],box:[460,151,174,236],dest:[490,179,174,236]},
 {poly:[[616,236],[625,236],[625,283],[616,283]],box:[614,234,14,52],dest:[647,207,10,77]},
 {poly:[[616,231],[627,231],[627,267],[627,308],[622,327],[614,334],[584,343],[555,360],[548,379],[537,380],[533,370],[542,358],[563,347],[588,338],[613,327],[617,305]],box:[460,151,174,236],dest:[490,179,174,236]},
 {poly:[[530,327],[540,328],[549,338],[552,349],[549,357],[540,364],[530,362],[523,355],[520,345],[522,335]],hole:[[530,336],[527,345],[529,353],[536,356],[541,353],[543,346],[539,339]],box:[460,151,174,236],dest:[490,179,174,236]}
 ]},
 accessory:{light:194,pieces:[{poly:[[624,160],[638,155],[651,159],[661,166],[668,179],[668,194],[662,207],[669,234],[688,272],[677,270],[675,286],[661,280],[654,290],[648,282],[635,289],[630,279],[624,287],[628,260],[628,232],[623,211],[615,202],[610,189],[612,175]],box:[608,152,84,142],dest:[668,164,62,105]}]}
};
const crops={top:[290,259,248,330],bottom:[291,549,191,270],shoes:[239,768,241,260],pad:[864,335,316,245],wraps:[700,751,214,208],bridle:[465,140,265,290],accessory:[637,133,125,165]};
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
let base,atlas,ready,serial=0;
const layers=new Map(),paintCache=new Map();
function path(ctx,points){ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath()}
function load(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('Bilden kunde inte laddas'));i.src=ROOT+src})}
function init(){return ready||(ready=Promise.all([load('stable-base-trimmed.webp'),load('equipment-atlas.webp')]).then(([b,a])=>{base=b;atlas=a}))}
function rgb(hex){return [1,3,5].map(n=>parseInt(hex.slice(n,n+2),16))}
function tint(canvas,color,reference,leather){const ctx=canvas.getContext('2d'),im=ctx.getImageData(0,0,W,H),p=im.data,c=rgb(color);for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const max=Math.max(p[i],p[i+1],p[i+2]),min=Math.min(p[i],p[i+1],p[i+2]);if(leather&&max-min<18)continue;let l=(p[i]*.2126+p[i+1]*.7152+p[i+2]*.0722)/reference;l=Math.min(1.75,l);for(let j=0;j<3;j++)p[i+j]=Math.min(255,c[j]*l)}ctx.putImageData(im,0,0);return canvas}
function clothingLayer(key,color){const cacheKey=key+color;if(layers.has(cacheKey))return layers.get(cacheKey);const c=make(),ctx=c.getContext('2d');ctx.save();ctx.beginPath();clothing[key].polygons.forEach(p=>path(ctx,p));ctx.clip();ctx.drawImage(base,0,0,W,H);ctx.restore();if(key==="top"){const im=ctx.getImageData(0,0,W,H),d=im.data;for(let i=0;i<d.length;i+=4)if(d[i+1]<d[i]*.93||d[i+1]<d[i+2]*1.02)d[i+3]=0;ctx.putImageData(im,0,0)}tint(c,color,clothing[key].light);if(layers.size>=5)layers.delete(layers.keys().next().value);layers.set(cacheKey,c);return c}
function gearLayer(key,color){const cacheKey=key+color;if(layers.has(cacheKey))return layers.get(cacheKey);const c=make(),ctx=c.getContext('2d');for(const piece of gear[key].pieces){const cut=make(),cx=cut.getContext('2d');cx.save();cx.beginPath();path(cx,piece.poly);if(piece.hole)path(cx,piece.hole);cx.clip('evenodd');cx.drawImage(atlas,0,0,W,H);cx.restore();ctx.drawImage(cut,...piece.box,...piece.dest)}tint(c,color,gear[key].light,gear[key].leather);if(layers.size>=5)layers.delete(layers.keys().next().value);layers.set(cacheKey,c);return c}
function compose(colors){const key=JSON.stringify(colors);if(paintCache.has(key))return paintCache.get(key);const c=make(),ctx=c.getContext('2d');ctx.drawImage(base,0,0,W,H);for(const k of ['top','bottom','shoes'])if(/^#[0-9a-f]{6}$/i.test(colors[k]||''))ctx.drawImage(clothingLayer(k,colors[k]),0,0);for(const k of ['pad','wraps','bridle','accessory'])if(colors[k]&&colors[k]!=='transparent')ctx.drawImage(gearLayer(k,colors[k]),0,0);
// The original forelock and mane naturally lie above the pad's leading edge.
if(colors.pad&&colors.pad!=='transparent'){ctx.save();ctx.beginPath();path(ctx,[[854,340],[884,375],[906,403],[917,423],[915,440],[910,432],[914,452],[906,444],[904,453],[896,441],[888,437],[879,416]]);ctx.clip();ctx.drawImage(base,0,0,W,H);ctx.restore()}
if(paintCache.size>=3)paintCache.delete(paintCache.keys().next().value);paintCache.set(key,c);return c}
function escape(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function schedule(id,colors,crop){queueMicrotask(()=>{init().then(()=>{const target=document.getElementById(id);if(!target)return;const ctx=target.getContext('2d');ctx.clearRect(0,0,target.width,target.height);const source=compose(colors);if(crop){const [x,y,w,h]=crop;ctx.drawImage(source,x,y,w,h,0,0,target.width,target.height)}else ctx.drawImage(source,0,0,target.width,target.height)}).catch(()=>{const el=document.getElementById(id);if(el&&!crop){const status=document.createElement('span');status.className='scene-status';status.textContent='Bilden kunde inte laddas. Ladda om sidan.';el.parentElement.append(status)}})})}
function render(options){const id='stable-canvas-'+(++serial),colors={};for(const k of [...Object.keys(clothing),...Object.keys(gear)]){const item=options.find(options.equipped[k]);colors[k]=item?.c||'transparent'}schedule(id,colors);return `<canvas id="${id}" class="stable-paint" width="${W}" height="${H}" role="img" aria-label="${escape(options.playerName)} och ${escape(options.horseName)} i stallet, med dina valda kläder och tillbehör" style="background:center/cover url('${ROOT}stable-base-trimmed.webp')"></canvas><div class="stable-title">♥ ${escape(options.stallName)} ♥</div>`}
function thumbnail(category,item){if(item.c==='transparent')return '<span class="empty-preview" aria-hidden="true">∅</span>';const id='item-canvas-'+(++serial),crop=crops[category],colors={};colors[category]=item.c;schedule(id,colors,crop);return `<canvas id="${id}" class="item-preview" width="${Math.round(180*crop[2]/crop[3])}" height="180" aria-hidden="true"></canvas>`}
global.StableArt={render,thumbnail,ready:init,compose,_masks:{clothing,gear},_size:[W,H]};
})(window);
