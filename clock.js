(function(){
'use strict';

const css=document.createElement('style');
css.textContent=[
'.navin{grid-template-columns:repeat(3,1fr)}',
'.clock-card{overflow:hidden}',
'.clock-levels{display:grid;grid-template-columns:1fr 1fr;gap:7px}',
'.clock-level{min-height:64px;border:1px solid var(--line);border-radius:16px;background:#fffdf9;text-align:left;padding:10px;font-weight:900}',
'.clock-level small{display:block;color:var(--muted);font-size:10px;margin-top:3px}',
'.clock-level.active{background:var(--sage2);border-color:#a9c0ae}',
'.clock-task{text-align:center;padding:10px 8px 0}',
'.clock-task small{display:block;color:var(--muted);font-weight:800}',
'.clock-target{font:700 29px Georgia,serif;margin:5px 0 4px}',
'.clock-tip{font-size:12px;color:var(--muted);min-height:34px}',
'.clock-stage{display:grid;place-items:center;margin:0 auto 8px;max-width:390px}',
'#clockFace{width:min(88vw,370px);height:auto;touch-action:none;user-select:none;-webkit-user-select:none;filter:drop-shadow(0 8px 18px #50371f18);cursor:grab}',
'#clockFace.dragging{cursor:grabbing}',
'.clock-digital{font-variant-numeric:tabular-nums;font-size:35px;font-weight:950;letter-spacing:2px;background:#2f342f;color:#eef5ec;border-radius:14px;padding:8px 18px;margin-top:-4px;box-shadow:inset 0 0 0 2px #ffffff12}',
'.clock-instruction{text-align:center;color:var(--muted);font-size:12px;font-weight:800;margin:8px 0 11px}',
'.clock-actions{display:grid;grid-template-columns:1fr .45fr;gap:7px}',
'.clock-feedback{min-height:40px;margin:8px 0 0;border-radius:13px;padding:9px 10px;font-size:12px;font-weight:850;background:#f3ecdf}',
'.clock-feedback.good{background:#dfeee1;color:#35583d}',
'.clock-feedback.bad{background:#f5dddd;color:#7f3836}',
'.clock-score{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:var(--muted);margin-top:7px}',
'.clock-help{font-size:12px;line-height:1.5;color:var(--muted)}',
'@media(max-width:360px){.clock-target{font-size:24px}.clock-level{padding:8px}.clock-digital{font-size:29px}}'
].join('');
document.head.appendChild(css);

const section=document.createElement('section');
section.className='screen';
section.id='clock';
section.innerHTML=
'<div class="wrap">'+
 '<div class="card clock-card">'+
  '<div class="head"><div><h2>Träna klockan</h2><p>Vrid bara den långa visaren. Timvisaren följer automatiskt.</p></div></div>'+
  '<div class="clock-levels" id="clockLevels"></div>'+
 '</div>'+
 '<div class="card">'+
  '<div class="clock-task"><small>STÄLL KLOCKAN PÅ</small><div class="clock-target" id="clockTarget"></div><div class="clock-tip" id="clockTip"></div></div>'+
  '<div class="clock-stage">'+
   '<svg id="clockFace" viewBox="0 0 320 320" role="img" aria-label="Interaktiv analog klocka. Vrid minutvisaren."></svg>'+
   '<div class="clock-digital" id="clockDigital">07:00</div>'+
  '</div>'+
  '<div class="clock-instruction">↻ Dra den långa visaren runt hur många varv du vill</div>'+
  '<div class="clock-actions"><button class="btn primary" id="clockCheck">OK ✓</button><button class="btn" id="clockNew">Ny tid</button></div>'+
  '<div class="clock-feedback" id="clockFeedback">Minutvisaren styr hela klockan. Timvisaren går med automatiskt.</div>'+
  '<div class="clock-score"><span id="clockScore">Rätt: 0</span><span id="clockQuestionNo">Uppgift 1</span></div>'+
 '</div>'+
 '<div class="card clock-help"><b>Så fungerar den:</b> det finns bara ett sätt att ställa klockan. Dra den långa minutvisaren framåt eller bakåt. När den passerar 12 fortsätter timvisaren automatiskt till nästa eller föregående timme.</div>'+
'</div>';
document.querySelector('main').appendChild(section);

const nav=document.querySelector('.navin');
const clockNav=document.createElement('button');
clockNav.className='navbtn';
clockNav.dataset.go='clock';
clockNav.innerHTML='◷<br>Klockan';
nav.insertBefore(clockNav,nav.querySelector('[data-go="stable"]'));

const $c=id=>document.getElementById(id);
const levels=[
 {id:'hour',title:'1. Hela timmar',sub:'Lär dig var timmarna sitter',tip:'Vrid minutvisaren tills timvisaren hamnar rätt.'},
 {id:'half',title:'2. Halv',sub:'Hela och halva timmar',tip:'Halv åtta betyder 07:30 eller 19:30.'},
 {id:'quarter',title:'3. Kvart',sub:'Kvart över och kvart i',tip:'3 = kvart över, 6 = halv, 9 = kvart i.'},
 {id:'five',title:'4. 5 minuter',sub:'Fem minuter per siffra',tip:'Varje stor siffra runt klockan är fem minuter.'},
 {id:'minute',title:'5. Exakta minuter',sub:'Till närmaste minut',tip:'Varje litet streck är en minut.'},
 {id:'24h',title:'6. 24-timmar',sub:'Till exempel 20:07',tip:'Fortsätt vrida genom 12 tills den digitala tiden visar rätt dygnshalva.'},
 {id:'mixed',title:'7. Blandat',sub:'Ord och digital tid',tip:'Här blandas alla typer av uppgifter.'}
];

let level='hour',target=null,correct=0,qno=0,waitingNext=false;
let totalMinutes=7*60;      // får medvetet gå under 0 och över 24 h
let drag=false,lastAngle=0,dragPointer=null;

function mod(n,m){return((n%m)+m)%m}
function pad(n){return String(n).padStart(2,'0')}
function displayTotal(){return mod(Math.round(totalMinutes),1440)}
function displayHour(){return Math.floor(displayTotal()/60)}
function displayMinute(){return displayTotal()%60}
function h12(h){const x=mod(h,12);return x===0?12:x}
function hourWord(h){return['tolv','ett','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva'][mod(h,12)]}
function digital(h,m){return pad(mod(h,24))+':'+pad(m)}
function rand(n){return Math.floor(Math.random()*n)}
function swedishTime(h,m){
 h=mod(h,12);m=mod(m,60);const now=hourWord(h),next=hourWord(h+1);
 if(m===0)return'klockan '+now;
 if(m===5)return'fem över '+now;
 if(m===10)return'tio över '+now;
 if(m===15)return'kvart över '+now;
 if(m===20)return'tjugo över '+now;
 if(m===25)return'fem i halv '+next;
 if(m===30)return'halv '+next;
 if(m===35)return'fem över halv '+next;
 if(m===40)return'tjugo i '+next;
 if(m===45)return'kvart i '+next;
 if(m===50)return'tio i '+next;
 if(m===55)return'fem i '+next;
 return digital(h12(h)%12,m).replace(/^00:/,'12:');
}

function makeFace(){
 const svg=$c('clockFace'),ns='http://www.w3.org/2000/svg';svg.innerHTML='';
 const circle=document.createElementNS(ns,'circle');
 Object.entries({cx:160,cy:160,r:146,fill:'#fffdf9',stroke:'#bda98f','stroke-width':5}).forEach(([k,v])=>circle.setAttribute(k,v));svg.appendChild(circle);
 for(let i=0;i<60;i++){
  const a=(i*6-90)*Math.PI/180,r1=i%5===0?126:134,r2=141,line=document.createElementNS(ns,'line');
  line.setAttribute('x1',160+Math.cos(a)*r1);line.setAttribute('y1',160+Math.sin(a)*r1);
  line.setAttribute('x2',160+Math.cos(a)*r2);line.setAttribute('y2',160+Math.sin(a)*r2);
  line.setAttribute('stroke',i%5===0?'#6e5b4b':'#c9bbab');line.setAttribute('stroke-width',i%5===0?'3':'1.5');line.setAttribute('stroke-linecap','round');svg.appendChild(line);
 }
 for(let n=1;n<=12;n++){
  const a=(n*30-90)*Math.PI/180,t=document.createElementNS(ns,'text');
  t.setAttribute('x',160+Math.cos(a)*108);t.setAttribute('y',166+Math.sin(a)*108);
  t.setAttribute('text-anchor','middle');t.setAttribute('font-size','23');t.setAttribute('font-weight','800');t.setAttribute('fill','#3a2d25');t.textContent=n;svg.appendChild(t);
 }
 const hg=document.createElementNS(ns,'g');hg.id='hourHand';hg.style.pointerEvents='none';
 hg.innerHTML='<line x1="160" y1="160" x2="160" y2="88" stroke="#3a2d25" stroke-width="11" stroke-linecap="round"/>';
 svg.appendChild(hg);
 const mg=document.createElementNS(ns,'g');mg.id='minuteHand';mg.style.pointerEvents='none';
 mg.innerHTML='<line x1="160" y1="166" x2="160" y2="43" stroke="#789b83" stroke-width="7" stroke-linecap="round"/><circle cx="160" cy="52" r="10" fill="#789b83"/>';
 svg.appendChild(mg);
 const pin=document.createElementNS(ns,'circle');
 pin.setAttribute('cx','160');pin.setAttribute('cy','160');pin.setAttribute('r','9');pin.setAttribute('fill','#dfb36d');pin.setAttribute('stroke','#6e5b4b');pin.setAttribute('stroke-width','2');pin.style.pointerEvents='none';svg.appendChild(pin);
 updateHands();
}

function updateHands(){
 const raw=totalMinutes;
 const minuteAngle=raw*6;
 const hourAngle=raw*.5;
 $c('minuteHand').setAttribute('transform','rotate('+minuteAngle+' 160 160)');
 $c('hourHand').setAttribute('transform','rotate('+hourAngle+' 160 160)');
 $c('clockDigital').textContent=digital(displayHour(),displayMinute());
}

function pointAngle(ev){
 const r=$c('clockFace').getBoundingClientRect();
 const x=(ev.clientX-r.left)/r.width*320-160,y=(ev.clientY-r.top)/r.height*320-160;
 return mod(Math.atan2(y,x)*180/Math.PI+90,360);
}
function shortestDelta(a,b){
 let d=a-b;if(d>180)d-=360;if(d<-180)d+=360;return d;
}
function startDrag(ev){
 if(ev.button!==undefined&&ev.button!==0)return;
 drag=true;dragPointer=ev.pointerId;lastAngle=pointAngle(ev);
 $c('clockFace').classList.add('dragging');
 try{$c('clockFace').setPointerCapture(ev.pointerId)}catch{}
 waitingNext=false;$c('clockCheck').textContent='OK ✓';
 $c('clockFeedback').className='clock-feedback';
 $c('clockFeedback').textContent='Fortsätt vrida. Du kan gå runt hur många varv som helst.';
 ev.preventDefault();
}
function moveDrag(ev){
 if(!drag||ev.pointerId!==dragPointer)return;
 const a=pointAngle(ev),delta=shortestDelta(a,lastAngle);
 // Ett helt varv = 60 minuter. Delta används i stället för absolut vinkel,
 // därför finns ingen spärr vid 12/00 och inga hopp mellan 59 och 00.
 totalMinutes+=delta/6;
 lastAngle=a;updateHands();ev.preventDefault();
}
function endDrag(ev){
 if(!drag)return;
 if(ev&&dragPointer!==null&&ev.pointerId!==dragPointer)return;
 totalMinutes=Math.round(totalMinutes); // minutprecision först när fingret släpps
 drag=false;dragPointer=null;$c('clockFace').classList.remove('dragging');updateHands();
}

function makeTarget(){
 let h=rand(12),m=0,kind='words',require24=false;
 if(level==='hour')m=0;
 else if(level==='half')m=[0,30][rand(2)];
 else if(level==='quarter')m=[0,15,30,45][rand(4)];
 else if(level==='five')m=rand(12)*5;
 else if(level==='minute'){m=rand(60);kind='digital12';}
 else if(level==='24h'){h=rand(24);m=rand(60);kind='digital24';require24=true;}
 else{
  const t=rand(3);
  if(t===0){m=rand(12)*5;kind='words';}
  else if(t===1){m=rand(60);kind='digital12';}
  else{h=rand(24);m=rand(60);kind='digital24';require24=true;}
 }
 return{h,m,kind,require24};
}
function promptText(t){
 if(t.kind==='words')return swedishTime(t.h,t.m);
 if(t.kind==='digital24')return digital(t.h,t.m);
 return pad(h12(t.h))+':'+pad(t.m);
}
function levelInfo(){return levels.find(x=>x.id===level)||levels[0]}
function seedNearTarget(t){
 const base=t.require24?t.h*60+t.m:mod(t.h,12)*60+t.m;
 let offset=(rand(361)-180);
 if(Math.abs(offset)<35)offset+=offset<0?-70:70;
 if(t.require24){
  totalMinutes=base+offset;
 }else{
  const half=rand(2)*720;
  totalMinutes=base+half+offset;
 }
 totalMinutes=Math.round(totalMinutes);updateHands();
}
function newQuestion(){
 target=makeTarget();qno++;waitingNext=false;
 $c('clockTarget').textContent=promptText(target);
 $c('clockTip').textContent=levelInfo().tip;
 $c('clockQuestionNo').textContent='Uppgift '+qno;
 $c('clockCheck').textContent='OK ✓';
 $c('clockFeedback').className='clock-feedback';
 $c('clockFeedback').textContent='Dra den långa visaren. Timvisaren följer med.';
 seedNearTarget(target);
}
function check(){
 if(waitingNext){newQuestion();return}
 endDrag();
 const h=displayHour(),m=displayMinute();
 const rightMinute=m===target.m;
 const rightHour=target.require24?h===target.h:mod(h,12)===mod(target.h,12);
 if(rightMinute&&rightHour){
  correct++;waitingNext=true;$c('clockScore').textContent='Rätt: '+correct;
  $c('clockFeedback').className='clock-feedback good';
  $c('clockFeedback').textContent='Rätt! '+swedishTime(target.h,target.m)+(target.require24?' = '+digital(target.h,target.m):'.');
  $c('clockCheck').textContent='Nästa →';
  if(typeof Sound!=='undefined')Sound.play('correct');
 }else{
  $c('clockFeedback').className='clock-feedback bad';
  $c('clockFeedback').textContent=!rightMinute?'Minuterna är inte rätt ännu. Fortsätt vrida den långa visaren.':'Rätt minuter, men fortsätt till rätt timme.';
  if(typeof Sound!=='undefined')Sound.play('wrong');
 }
}
function setLevel(id){
 level=id;correct=0;qno=0;$c('clockScore').textContent='Rätt: 0';
 document.querySelectorAll('.clock-level').forEach(b=>b.classList.toggle('active',b.dataset.level===id));
 newQuestion();
}
function buildLevels(){
 $c('clockLevels').innerHTML=levels.map(x=>'<button class="clock-level'+(x.id===level?' active':'')+'" data-level="'+x.id+'"><span>'+x.title+'</span><small>'+x.sub+'</small></button>').join('');
 $c('clockLevels').querySelectorAll('button').forEach(b=>b.onclick=()=>setLevel(b.dataset.level));
}

$c('clockFace').addEventListener('pointerdown',startDrag);
$c('clockFace').addEventListener('pointermove',moveDrag);
$c('clockFace').addEventListener('pointerup',endDrag);
$c('clockFace').addEventListener('pointercancel',endDrag);
$c('clockFace').addEventListener('lostpointercapture',()=>endDrag());
$c('clockCheck').onclick=check;
$c('clockNew').onclick=newQuestion;

clockNav.onclick=()=>{
 show('clock');
 if(typeof header==='function')header();
 $c('sub').textContent='Analog & digital klocka';
 updateHands();
};
buildLevels();makeFace();newQuestion();

window.ClockTrainer={open:function(){
 if(typeof header==='function')header();
 $c('sub').textContent='Analog & digital klocka';
 updateHands();
}};
})();