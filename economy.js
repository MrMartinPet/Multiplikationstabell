/* Economy v2: completed maths rounds fund the stable. Existing possessions survive. */
const Economy={
 extend(PC,HC){
  for(const catalog of [PC,HC])for(const items of Object.values(catalog))for(const item of items)item.price=item.legend?900:item.price*10;
  PC.hair=[{id:'hair-original',name:'Vanlig hästsvans',c:'transparent',price:0},...['Långt vågigt hår','Flätad hästsvans'].flatMap((name,style)=>[['Kastanj','#85502b'],['Mörkbrun','#4b2c20'],['Koppar','#bd703b'],['Blond','#dcba79']].map(([color,c],n)=>({id:'hair-'+style+'-'+n,name:name+' · '+color,c,style,price:240+style*100+n*80})))];
  HC.mane=[{id:'mane-original',name:'Naturlig man',c:'transparent',price:0},...['Flätad man','Böljande man'].flatMap((name,style)=>[['Elfenben','#f4e3bf'],['Guld','#d4b16b'],['Silver','#c7c7d3'],['Rosa','#e8a5cd']].map(([color,c],n)=>({id:'mane-'+style+'-'+n,name:name+' · '+color,c,style:style+2,price:300+style*100+n*90})))];
  const sets=[['ocean','Hav','#287eab'],['purple','Ametist','#8952ba'],['cherry','Körsbär','#b83257'],['mint','Mint','#58c9b3'],['sun','Solros','#e4b52d'],['ice','Isblå','#a0dce9'],['forest','Skog','#325b43'],['pearl','Pärla','#eee4ec'],['night','Midnatt','#333958'],['coral','Korall','#ef7965'],['royal','Kunglig','#604f9e'],['candy','Sockervadd','#f599cc']];
  const names={top:'ridtröja',bottom:'ridbyxor',shoes:'stövlar',pad:'sadel & schabrak',wraps:'benskydd',bridle:'träns',accessory:'rosett'};
  for(const [key,items] of Object.entries({...PC,...HC}).filter(([key])=>names[key]))sets.forEach(([id,name,c],n)=>items.push({id:key+'-'+id,name:name+' · '+names[key],c,price:180+n*55+(key==='pad'?180:0),legend:0}));
 },
 migrate(s){
  if(s.economyVersion!==2){s.economyVersion=2;s.care={piles:1,lastPoop:Date.now(),rounds:0,tool:'hands',tools:['hands'],food:{carrot:0,apple:0,hay:0},manure:0,paint:0,art:[],tickets:0,feeds:0};}
  for(const [key,id] of [['hair','hair-original'],['mane','mane-original']]){if(!s.owned.includes(id))s.owned.push(id);if(!s.equipped[key])s.equipped[key]=id;}
  return s;
 },
 reward(mode,correct,first,passed){return Math.floor(correct/2)+(passed?(first?15:7):0);}
};
const Food={carrot:{name:'Morot',icon:'🥕',price:8},apple:{name:'Äpple',icon:'🍎',price:12},hay:{name:'Höportion',icon:'🌾',price:5}};
function careTick(){const c=S.care;if(screen==='game')return;if(Date.now()-c.lastPoop>=240000){c.piles=Math.min(3,c.piles+1);c.lastPoop=Date.now();save();}}
function careGate(){careTick();if(S.care.piles){show('stable');toast('Mocka först, sedan kan du spela!');return false;}return true;}
function careAfterRound(){const c=S.care;c.rounds++;c.tickets=Math.min(6,c.tickets+1);if(c.rounds%2===0){c.piles=Math.min(3,c.piles+1);c.lastPoop=Date.now();}}
function careRender(){
 careTick();const c=S.care;
 for(const id of ['homeCare','stableCare']){
 const el=$(id);if(!el)continue;const marketOpen=el.querySelector(".market")?.open;
 el.innerHTML=`<h2>Sköt om ${esc(S.horseName||'din ponny')}</h2><p>${c.piles?'💩 '.repeat(c.piles)+'Mocka innan nästa tabell.':'✨ Rent i stallet – redo att träna!'}</p><p class="care-note">Händer: tvätt kostar upp till 3 mynt per hög. Spade: 1 mynt. Grep: gratis, gödseln sparas.</p><div class="care-buttons">${[['hands','🙌 Händer'],['shovel','🥄 Liten spade'],['fork','🔱 Grep']].map(([key,label])=>`<button class="btn ${c.tool===key?'soft':''}" data-tool="${key}">${label}${c.tools.includes(key)?(c.tool===key?' ✓':''):' · '+(key==='shovel'?90:300)+' 🪙'}</button>`).join('')}</div><button class="btn primary" data-clean ${c.piles?'':'disabled'}>Mocka en hög${c.piles?' 💩':''}</button><h3>Matförråd</h3><div class="care-food">${Object.entries(Food).map(([key,f])=>`<div><b>${f.icon} ${f.name} · ${c.food[key]} st</b><button class="btn" data-food-buy="${key}">Köp · ${f.price} 🪙</button><button class="btn soft" data-feed="${key}" ${c.food[key]?'':'disabled'}>Mata</button></div>`).join('')}</div><p>Matat ${c.feeds} gånger ♥</p>`;
 if(id==='stableCare')el.innerHTML+=`<details class="market" ${marketOpen?"open":""}><summary>🎨 Gödselateljén & marknaden</summary><p>👨🏻‍🌾 Hans & 👨🏼‍🌾 Klaus från Tyskland ropar utanför stallet: ”Wir kaufen Kunst! Vi köper din gödselkonst!”</p><p>Gödsel: ${c.manure} · Färgportioner: ${c.paint} · Beställningar: ${c.tickets}</p><p class="care-note">Varje färdig tabell ger en beställning (max 6). Sälj en hög för 2 mynt eller måla en figur och sälj för 6. Färg kostar 2 mynt.</p><div class="care-buttons"><button class="btn" data-paint-buy>Köp färg · 2 🪙</button><button class="btn" data-sell-raw ${c.manure&&c.tickets?'':'disabled'}>Sälj gödsel · +2 🪙</button></div><label>Figur <select id="artShape"><option value="✿">Blomma</option><option value="★">Stjärna</option><option value="♥">Hjärta</option><option value="♞">Häst</option></select></label><label>Färg <select id="artColor"><option value="#d45a98">Rosa</option><option value="#4694cf">Blå</option><option value="#d6ae32">Guld</option><option value="#7c57bc">Lila</option></select></label><button class="btn soft" data-craft ${c.manure&&c.paint&&c.art.length<12?'':'disabled'}>Forma & måla</button><div class="art-shelf">${c.art.map((a,n)=>`<button class="btn" style="border-color:${a.color}" data-sell-art="${n}" ${c.tickets?'':'disabled'}><span style="color:${a.color};font-size:30px">${a.shape}</span><br>Sälj · +6 🪙</button>`).join('')}</div></details>`;
 el.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>careAction('tool',b.dataset.tool));
 el.querySelector('[data-clean]').onclick=()=>careAction('clean');
 el.querySelectorAll('[data-food-buy]').forEach(b=>b.onclick=()=>careAction('food',b.dataset.foodBuy));
 el.querySelectorAll('[data-feed]').forEach(b=>b.onclick=()=>careAction('feed',b.dataset.feed));
 el.querySelector('[data-paint-buy]')?.addEventListener('click',()=>careAction('paint'));
 el.querySelector('[data-sell-raw]')?.addEventListener('click',()=>careAction('raw'));
 el.querySelector('[data-craft]')?.addEventListener('click',()=>careAction('craft'));
 el.querySelectorAll('[data-sell-art]').forEach(b=>b.onclick=()=>careAction('art',Number(b.dataset.sellArt)));
 }
}
function careAction(action,key){
 const c=S.care;let message='';const pay=n=>{if(S.coins<n){toast('Träna fler tabeller för att tjäna mynt.');return false;}S.coins-=n;return true;};
 if(action==='tool'){if(!['hands','shovel','fork'].includes(key))return;if(!c.tools.includes(key)){if(!pay(key==='shovel'?90:300))return;c.tools.push(key);}c.tool=key;}
 if(action==='clean'){if(!c.piles)return;c.piles--;const cost=Math.min(S.coins,c.tool==='hands'?3:c.tool==='shovel'?1:0);S.coins-=cost;if(c.tool==='fork')c.manure++;message=c.tool==='fork'?'Rent! Gödseln ligger i förrådet.':`Rent och nytvättat! −${cost} mynt.`;c.lastPoop=Date.now();}
 if(action==='food'){if(!Food[key]||c.food[key]>=99||!pay(Food[key].price))return;c.food[key]++;}
 if(action==='feed'){if(!Food[key]||!c.food[key])return;c.food[key]--;c.feeds++;message=`${S.horseName||'Ponnyn'} mumsar ${Food[key].name.toLowerCase()}! ♥`;Sound.play('horse');}
 if(action==='paint'){if(c.paint>=99||!pay(2))return;c.paint++;}
 if(action==='raw'){if(!c.manure||!c.tickets)return;c.manure--;c.tickets--;S.coins+=2;message='Danke! +2 mynt';}
 if(action==='craft'){if(!c.manure||!c.paint||c.art.length>=12)return;c.manure--;c.paint--;c.art.push({shape:$('artShape').value,color:$('artColor').value});message='Din figur är klar att sälja!';}
 if(action==='art'){if(!c.art[key]||!c.tickets)return;c.art.splice(key,1);c.tickets--;S.coins+=6;message='Wunderbar! Såld för 6 mynt.';}
 save();header();careRender();for(const id of ['homeScene','stableScene'])$(id).innerHTML=scene();if(message)toast(message);
}

setInterval(()=>{if(typeof S==='undefined'||!['home','stable'].includes(screen))return;const before=S.care.piles;careTick();if(before!==S.care.piles){careRender();for(const id of ['homeScene','stableScene'])$(id).innerHTML=scene();}},30000);
