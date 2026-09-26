
(function(){
'use strict';

const css = document.createElement('style');
css.textContent = [
'.navin{grid-template-columns:repeat(3,1fr)}',
'.clock-card{overflow:hidden}',
'.clock-levels{display:grid;grid-template-columns:1fr 1fr;gap:7px}',
'.clock-level{min-height:64px;border:1px solid var(--line);border-radius:16px;background:#fffdf9;text-align:left;padding:10px;font-weight:900}',
'.clock-level small{display:block;color:var(--muted);font-size:10px;margin-top:3px}',
'.clock-level.active{background:var(--sage2);border-color:#a9c0ae}',
'.clock-task{text-align:center;padding:12px 8px 4px}',
'.clock-task small{display:block;color:var(--muted);font-weight:800}',
'.clock-target{font:700 28px Georgia,serif;margin:5px 0 4px}',
'.clock-tip{font-size:11px;color:var(--muted);min-height:32px}',
'.clock-stage{display:grid;place-items:center;margin:4px auto 7px;max-width:390px}',
'#clockFace{width:min(86vw,360px);height:auto;touch-action:none;filter:drop-shadow(0 8px 18px #50371f18)}',
'.clock-digital{font-variant-numeric:tabular-nums;font-size:34px;font-weight:950;letter-spacing:2px;background:#2f342f;color:#eef5ec;border-radius:14px;padding:8px 18px;margin-top:-2px;box-shadow:inset 0 0 0 2px #ffffff12}',
'.clock-period{display:grid;grid-template-columns:1fr 1fr;gap:7px;width:min(330px,100%);margin:8px auto 0}',
'.clock-period button{min-height:42px;border:1px solid var(--line);border-radius:13px;background:#fffdf9;font-weight:900}',
'.clock-period button.active{background:var(--sage2);border-color:#9eb8a4}',
'.clock-adjust{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:10px 0}',
'.clock-adjust button{min-height:44px;border:1px solid var(--line);border-radius:13px;background:#fffdf9;font-weight:900}',
'.clock-actions{display:grid;grid-template-columns:1fr .45fr;gap:7px}',
'.clock-feedback{min-height:38px;margin:8px 0 0;border-radius:13px;padding:9px 10px;font-size:12px;font-weight:850;background:#f3ecdf}',
'.clock-feedback.good{background:#dfeee1;color:#35583d}',
'.clock-feedback.bad{background:#f5dddd;color:#7f3836}',
'.clock-score{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:var(--muted);margin-top:7px}',
'.clock-help{font-size:12px;line-height:1.5;color:var(--muted)}',
'@media(max-width:360px){.clock-target{font-size:24px}.clock-level{padding:8px}.clock-digital{font-size:29px}}'
].join('');

document.head.appendChild(css);

const section = document.createElement('section');
section.className = 'screen';
section.id = 'clock';
section.innerHTML =
'<div class="wrap">'+
  '<div class="card clock-card">'+
    '<div class="head"><div><h2>Träna klockan</h2><p>Vrid visarna själv och koppla ihop analog och digital tid.</p></div></div>'+
    '<div class="clock-levels" id="clockLevels"></div>'+
  '</div>'+
  '<div class="card">'+
    '<div class="clock-task"><small>STÄLL KLOCKAN PÅ</small><div class="clock-target" id="clockTarget">klockan sju</div><div class="clock-tip" id="clockTip"></div></div>'+
    '<div class="clock-stage">'+
      '<svg id="clockFace" viewBox="0 0 320 320" role="img" aria-label="Interaktiv analog klocka"></svg>'+
      '<div class="clock-digital" id="clockDigital">07:00</div>'+
    '</div>'+
    '<div class="clock-period" id="clockPeriod">'+
      '<button type="button" data-period="am" class="active">00–11</button>'+
      '<button type="button" data-period="pm">12–23</button>'+
    '</div>'+
    '<div class="clock-adjust" id="clockAdjust">'+
      '<button type="button" data-step="-5">−5 min</button>'+
      '<button type="button" data-step="-1">−1 min</button>'+
      '<button type="button" data-step="1">+1 min</button>'+
      '<button type="button" data-step="5">+5 min</button>'+
    '</div>'+
    '<div class="clock-actions"><button class="btn primary" id="clockCheck">OK ✓</button><button class="btn" id="clockNew">Ny tid</button></div>'+
    '<div class="clock-feedback" id="clockFeedback">Dra direkt i tim- eller minutvisaren. Använd knapparna för finjustering.</div>'+
    '<div class="clock-score"><span id="clockScore">Rätt: 0</span><span id="clockQuestionNo">Uppgift 1</span></div>'+
  '</div>'+
  '<div class="card clock-help"><b>Så tränar du smart:</b> börja med hela timmar. Gå sedan vidare till halv, kvart, fem minuter och sist exakta minuter. Den digitala tiden under klockan ändras samtidigt som du vrider visarna.</div>'+
'</div>';

document.querySelector('main').appendChild(section);

const nav = document.querySelector('.navin');
const clockNav = document.createElement('button');
clockNav.className = 'navbtn';
clockNav.dataset.go = 'clock';
clockNav.innerHTML = '◷<br>Klockan';
const stableNav = nav.querySelector('[data-go="stable"]');
nav.insertBefore(clockNav, stableNav);

const $c = id => document.getElementById(id);
const levels = [
 {id:'hour',title:'1. Hela timmar',sub:'Minutvisaren på 12',tip:'Börja med timvisaren och hela timmar.'},
 {id:'half',title:'2. Halv',sub:'Hela och halva timmar',tip:'Kom ihåg: halv åtta är 07:30.'},
 {id:'quarter',title:'3. Kvart',sub:'Kvart över och kvart i',tip:'3 = kvart över, 6 = halv, 9 = kvart i.'},
 {id:'five',title:'4. 5 minuter',sub:'Räkna fem steg i taget',tip:'Varje siffra runt urtavlan motsvarar 5 minuter.'},
 {id:'minute',title:'5. Exakta minuter',sub:'Till närmaste minut',tip:'De små strecken är en minut vardera.'},
 {id:'24h',title:'6. 24-timmar',sub:'Till exempel 20:07',tip:'20:07 ser ut som 08:07 analogt. Välj också rätt halva av dygnet.'},
 {id:'mixed',title:'7. Blandat',sub:'Ord + digital tid',tip:'Nu blandas allt: ord, exakt tid och 24-timmarsformat.'}
];

let level = 'hour', hour24 = 6, minute = 0, target = null, drag = null, correct = 0, qno = 0, waitingNext = false;

function mod(n,m){return ((n%m)+m)%m}
function pad(n){return String(n).padStart(2,'0')}
function h12(h){const x=mod(h,12);return x===0?12:x}
function hourWord(h){return ['tolv','ett','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva'][mod(h,12)]}
function swedishTime(h,m){
 h=mod(h,12);m=mod(m,60);
 const next=hourWord(h+1), now=hourWord(h);
 if(m===0)return 'klockan '+now;
 if(m===5)return 'fem över '+now;
 if(m===10)return 'tio över '+now;
 if(m===15)return 'kvart över '+now;
 if(m===20)return 'tjugo över '+now;
 if(m===25)return 'fem i halv '+next;
 if(m===30)return 'halv '+next;
 if(m===35)return 'fem över halv '+next;
 if(m===40)return 'tjugo i '+next;
 if(m===45)return 'kvart i '+next;
 if(m===50)return 'tio i '+next;
 if(m===55)return 'fem i '+next;
 return pad(h12(h))+':'+pad(m);
}
function digital(h,m){return pad(mod(h,24))+':'+pad(m)}
function rand(n){return Math.floor(Math.random()*n)}

function makeFace(){
 const svg=$c('clockFace'), ns='http://www.w3.org/2000/svg';
 svg.innerHTML='';
 const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx','160');circle.setAttribute('cy','160');circle.setAttribute('r','146');circle.setAttribute('fill','#fffdf9');circle.setAttribute('stroke','#bda98f');circle.setAttribute('stroke-width','5');svg.appendChild(circle);
 for(let i=0;i<60;i++){
   const a=(i*6-90)*Math.PI/180, r1=i%5===0?126:134, r2=141;
   const line=document.createElementNS(ns,'line');
   line.setAttribute('x1',160+Math.cos(a)*r1);line.setAttribute('y1',160+Math.sin(a)*r1);
   line.setAttribute('x2',160+Math.cos(a)*r2);line.setAttribute('y2',160+Math.sin(a)*r2);
   line.setAttribute('stroke',i%5===0?'#6e5b4b':'#c9bbab');line.setAttribute('stroke-width',i%5===0?'3':'1.5');line.setAttribute('stroke-linecap','round');svg.appendChild(line);
 }
 for(let n=1;n<=12;n++){
   const a=(n*30-90)*Math.PI/180, t=document.createElementNS(ns,'text');
   t.setAttribute('x',160+Math.cos(a)*108);t.setAttribute('y',166+Math.sin(a)*108);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','23');t.setAttribute('font-weight','800');t.setAttribute('fill','#3a2d25');t.textContent=n;svg.appendChild(t);
 }
 const hg=document.createElementNS(ns,'g');hg.id='hourHand';
 hg.innerHTML='<line x1="160" y1="160" x2="160" y2="86" stroke="#3a2d25" stroke-width="11" stroke-linecap="round"/><line x1="160" y1="160" x2="160" y2="92" stroke="transparent" stroke-width="34" stroke-linecap="round"/>';
 svg.appendChild(hg);
 const mg=document.createElementNS(ns,'g');mg.id='minuteHand';
 mg.innerHTML='<line x1="160" y1="166" x2="160" y2="48" stroke="#789b83" stroke-width="7" stroke-linecap="round"/><line x1="160" y1="160" x2="160" y2="48" stroke="transparent" stroke-width="30" stroke-linecap="round"/>';
 svg.appendChild(mg);
 const pin=document.createElementNS(ns,'circle');pin.setAttribute('cx','160');pin.setAttribute('cy','160');pin.setAttribute('r','9');pin.setAttribute('fill','#dfb36d');pin.setAttribute('stroke','#6e5b4b');pin.setAttribute('stroke-width','2');svg.appendChild(pin);
 updateHands();
}

function updateHands(){
 const ha=(mod(hour24,12)+minute/60)*30, ma=minute*6;
 $c('hourHand').setAttribute('transform','rotate('+ha+' 160 160)');
 $c('minuteHand').setAttribute('transform','rotate('+ma+' 160 160)');
 $c('clockDigital').textContent=digital(hour24,minute);
 document.querySelectorAll('#clockPeriod button').forEach(b=>b.classList.toggle('active',(b.dataset.period==='pm')===(hour24>=12)));
}

function point(ev){
 const r=$c('clockFace').getBoundingClientRect();
 return {x:(ev.clientX-r.left)/r.width*320,y:(ev.clientY-r.top)/r.height*320};
}
function endpoint(angle,len){
 const a=(angle-90)*Math.PI/180;
 return {x:160+Math.cos(a)*len,y:160+Math.sin(a)*len};
}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function angleAt(p){return mod(Math.atan2(p.y-160,p.x-160)*180/Math.PI+90,360)}

function startDrag(ev){
 const p=point(ev), mh=endpoint(minute*6,112), hh=endpoint((mod(hour24,12)+minute/60)*30,74);
 drag=dist(p,mh)<=dist(p,hh)?'minute':'hour';
 $c('clockFace').setPointerCapture(ev.pointerId);
 moveDrag(ev);
 ev.preventDefault();
}
function moveDrag(ev){
 if(!drag)return;
 const a=angleAt(point(ev));
 if(drag==='minute'){
   minute=mod(Math.round(a/6),60);
 }else{
   const raw=a/30-minute/60;
   const h=mod(Math.round(raw),12);
   hour24=h+(hour24>=12?12:0);
 }
 waitingNext=false;$c('clockCheck').textContent='OK ✓';
 $c('clockFeedback').className='clock-feedback';
 updateHands();
 ev.preventDefault();
}
function endDrag(){drag=null}

function setLevel(id){
 level=id;
 document.querySelectorAll('.clock-level').forEach(b=>b.classList.toggle('active',b.dataset.level===id));
 correct=0;qno=0;
 $c('clockScore').textContent='Rätt: 0';
 newQuestion();
}
function levelInfo(){return levels.find(x=>x.id===level)||levels[0]}

function buildLevels(){
 const box=$c('clockLevels');
 box.innerHTML=levels.map(x=>'<button class="clock-level'+(x.id===level?' active':'')+'" data-level="'+x.id+'"><span>'+x.title+'</span><small>'+x.sub+'</small></button>').join('');
 box.querySelectorAll('button').forEach(b=>b.onclick=()=>setLevel(b.dataset.level));
}

function makeTarget(){
 let h=rand(12),m=0,kind='words',require24=false;
 if(level==='hour')m=0;
 else if(level==='half')m=[0,30][rand(2)];
 else if(level==='quarter')m=[0,15,30,45][rand(4)];
 else if(level==='five')m=rand(12)*5;
 else if(level==='minute'){m=rand(60);kind='digital12';}
 else if(level==='24h'){h=rand(24);m=rand(60);kind='digital24';require24=true;}
 else {
   const type=rand(3);
   if(type===0){m=rand(12)*5;kind='words';}
   else if(type===1){m=rand(60);kind='digital12';}
   else {h=rand(24);m=rand(60);kind='digital24';require24=true;}
 }
 return {h:h,m:m,kind:kind,require24:require24};
}
function promptText(t){
 if(t.kind==='words')return swedishTime(t.h,t.m);
 if(t.kind==='digital24')return digital(t.h,t.m);
 return digital(h12(t.h)%12,t.m).replace(/^00:/,'12:');
}
function newQuestion(){
 target=makeTarget();qno++;waitingNext=false;
 $c('clockTarget').textContent=promptText(target);
 $c('clockTip').textContent=levelInfo().tip;
 $c('clockQuestionNo').textContent='Uppgift '+qno;
 $c('clockCheck').textContent='OK ✓';
 $c('clockFeedback').className='clock-feedback';
 $c('clockFeedback').textContent='Dra i visarna. Den digitala tiden följer med.';
 const base=rand(12);
 hour24=target.require24?(rand(2)?base:base+12):base;
 minute=[0,5,15,30,45][rand(5)];
 if(mod(hour24,12)===mod(target.h,12)&&minute===target.m)minute=mod(minute+5,60);
 updateHands();
}
function check(){
 if(waitingNext){newQuestion();return}
 const sameMin=minute===target.m, same12=mod(hour24,12)===mod(target.h,12), same24=hour24===target.h;
 if(sameMin&&(target.require24?same24:same12)){
   correct++;waitingNext=true;
   $c('clockScore').textContent='Rätt: '+correct;
   $c('clockFeedback').className='clock-feedback good';
   const full=digital(target.require24?target.h:mod(target.h,12),target.m);
   $c('clockFeedback').textContent='Rätt! '+swedishTime(target.h,target.m)+' = '+full+(target.require24?' i 24-timmarsformat.':'.');
   $c('clockCheck').textContent='Nästa →';
 }else{
   $c('clockFeedback').className='clock-feedback bad';
   let hint='';
   if(!sameMin)hint='Minutvisaren är inte rätt ännu.';
   else if(target.require24&&!same24)hint='Visarna är rätt, men välj rätt halva av dygnet.';
   else hint='Kontrollera timvisaren.';
   $c('clockFeedback').textContent=hint;
 }
}

$c('clockFace').addEventListener('pointerdown',startDrag);
$c('clockFace').addEventListener('pointermove',moveDrag);
$c('clockFace').addEventListener('pointerup',endDrag);
$c('clockFace').addEventListener('pointercancel',endDrag);

$c('clockPeriod').querySelectorAll('button').forEach(b=>b.onclick=()=>{
 const twelve=mod(hour24,12);
 hour24=twelve+(b.dataset.period==='pm'?12:0);
 waitingNext=false;$c('clockCheck').textContent='OK ✓';updateHands();
});
$c('clockAdjust').querySelectorAll('button').forEach(b=>b.onclick=()=>{
 let total=hour24*60+minute+Number(b.dataset.step);
 total=mod(total,24*60);hour24=Math.floor(total/60);minute=total%60;
 waitingNext=false;$c('clockCheck').textContent='OK ✓';updateHands();
});
$c('clockCheck').onclick=check;
$c('clockNew').onclick=newQuestion;

clockNav.onclick=()=>{
 show('clock');
 if(typeof header==='function')header();
 $c('sub').textContent='Analog & digital klocka';
};

buildLevels();
makeFace();
newQuestion();

window.ClockTrainer={open:function(){
 if(typeof header==='function')header();
 $c('sub').textContent='Analog & digital klocka';
 updateHands();
}};
})();
