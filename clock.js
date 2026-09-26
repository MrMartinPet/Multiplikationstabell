(function(){
'use strict';

const css=document.createElement('style');
css.textContent=[
'.navin{grid-template-columns:repeat(3,1fr)}',
'#clock .wrap{max-width:520px;padding-top:6px}',
'.clock-onepage{padding:12px 13px 14px;min-height:calc(100dvh - 150px)}',
'.clock-controls{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:10px}',
'.clock-mode{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:4px;border:1px solid var(--line);border-radius:15px;background:#f3ecdf}',
'.clock-mode button{min-height:38px;border:0;border-radius:11px;background:transparent;font-weight:900;font-size:13px}',
'.clock-mode button.on{background:#fffdf9;box-shadow:0 2px 8px #50371f18}',
'.clock-select{width:100%;min-height:46px;border:1px solid var(--line);border-radius:15px;background:#fffdf9;padding:0 10px;font-weight:850}',
'.clock-question{text-align:center;padding:8px 4px 4px}',
'.clock-question small{display:block;color:var(--muted);font-size:10px;font-weight:900;letter-spacing:.08em}',
'.clock-target{font:700 clamp(28px,8vw,40px) Georgia,serif;line-height:1.05;margin:8px 0 5px}',
'.clock-subline{min-height:20px;color:var(--muted);font-size:12px;font-weight:750}',
'.clock-stage{display:grid;place-items:center;margin:2px auto 8px}',
'#clockFace{width:min(86vw,355px);height:auto;touch-action:none;user-select:none;-webkit-user-select:none;filter:drop-shadow(0 8px 16px #50371f18);cursor:grab}',
'#clockFace.dragging{cursor:grabbing}',
'.clock-digital{font-variant-numeric:tabular-nums;font-size:30px;font-weight:950;letter-spacing:2px;background:#2f342f;color:#eef5ec;border-radius:13px;padding:7px 16px;margin-top:-5px;box-shadow:inset 0 0 0 2px #ffffff12}',
'.clock-digital[hidden]{display:none!important}',
'.clock-check{width:100%;min-height:57px;border:0;border-radius:17px;font-size:21px;font-weight:950;background:var(--sage);color:white;transition:background .16s,transform .12s}',
'.clock-check:active{transform:scale(.99)}',
'.clock-check.good{background:var(--good)}',
'.clock-check.bad{background:var(--bad)}',
'.clock-feedback{min-height:38px;text-align:center;padding:9px 8px 2px;font-size:14px;font-weight:900}',
'.clock-feedback.good{color:var(--good)}',
'.clock-feedback.bad{color:var(--bad)}',
'.clock-bottom{display:flex;justify-content:space-between;gap:8px;align-items:center;border-top:1px solid var(--line);margin-top:7px;padding-top:9px;color:var(--muted);font-size:11px;font-weight:800}',
'.clock-bottom b{color:var(--ink)}',
'.clock-progress{height:6px;background:#ece3d9;border-radius:99px;overflow:hidden;margin:4px 0 3px}',
'.clock-progress i{display:block;height:100%;background:var(--sage);width:0;transition:width .2s}',
'.clock-mode-note{text-align:center;color:var(--muted);font-size:10px;margin:-2px 0 5px}',
'@media(max-width:380px){.clock-controls{grid-template-columns:1fr}.clock-onepage{padding:10px}.clock-target{font-size:29px}#clockFace{width:min(91vw,335px)}}'
].join('');
document.head.appendChild(css);

const levels=[
 {id:'hour',name:'Hela timmar',tip:'Timvisaren ska peka exakt på rätt timme.'},
 {id:'half',name:'Halv',tip:'Halv åtta betyder 07:30.'},
 {id:'quarter',name:'Kvart',tip:'Kvart över = 15 min. Kvart i = 45 min.'},
 {id:'five',name:'5 minuter',tip:'Varje stor siffra motsvarar 5 minuter.'},
 {id:'minute',name:'Exakta minuter',tip:'Varje litet streck är 1 minut.'},
 {id:'24h',name:'24-timmar',tip:'Öva kopplingen mellan 20:07 och den analoga klockan.'},
 {id:'mixed',name:'Blandat',tip:'Alla typer av tider blandas.'}
];

const section=document.createElement('section');
section.className='screen';
section.id='clock';
section.innerHTML=
'<div class="wrap"><div class="card clock-onepage">'+
 '<div class="clock-controls">'+
  '<div class="clock-mode" id="clockMode">'+
   '<button type="button" data-mode="practice" class="on">Öva</button>'+
   '<button type="button" data-mode="challenge">Nivåprov</button>'+
  '</div>'+
  '<select class="clock-select" id="clockLevel" aria-label="Välj klocknivå">'+
   levels.map(x=>'<option value="'+x.id+'">'+x.name+'</option>').join('')+
  '</select>'+
 '</div>'+
 '<div class="clock-mode-note" id="clockModeNote">Digital tid visas medan du övar.</div>'+
 '<div class="clock-progress"><i id="clockProgress"></i></div>'+
 '<div class="clock-question">'+
  '<small id="clockQuestionNo">ÖVNING</small>'+
  '<div class="clock-target" id="clockTarget">klockan sju</div>'+
  '<div class="clock-subline" id="clockTip"></div>'+
 '</div>'+
 '<div class="clock-stage">'+
  '<svg id="clockFace" viewBox="0 0 320 320" role="img" aria-label="Analog klocka. Dra den långa minutvisaren."></svg>'+
  '<div class="clock-digital" id="clockDigital">07:00</div>'+
 '</div>'+
 '<button type="button" class="clock-check" id="clockCheck">OK ✓</button>'+
 '<div class="clock-feedback" id="clockFeedback" role="status" aria-live="polite">Dra den långa visaren och tryck OK.</div>'+
 '<div class="clock-bottom"><span id="clockScore">Rätt: <b>0</b></span><span id="clockCoins">Mynt: <b>0</b></span></div>'+
'</div></div>';
document.querySelector('main').appendChild(section);

const nav=document.querySelector('.navin');
const clockNav=document.createElement('button');
clockNav.className='navbtn';
clockNav.dataset.go='clock';
clockNav.innerHTML='◷<br>Klockan';
nav.insertBefore(clockNav,nav.querySelector('[data-go="stable"]'));

const $c=id=>document.getElementById(id);
let mode='practice',level='hour',target=null,totalMinutes=7*60;
let drag=false,lastAngle=0,dragPointer=null;
let practiceCorrect=0,questionNo=0,questionRewarded=false;
let testIndex=0,testMistakes=0,testFirstTryCorrect=0,testQuestionMistake=false,testFinished=false;
let feedbackTimer=null;

function mod(n,m){return((n%m)+m)%m}
function pad(n){return String(n).padStart(2,'0')}
function rand(n){return Math.floor(Math.random()*n)}
function displayTotal(){return mod(Math.round(totalMinutes),1440)}
function displayHour(){return Math.floor(displayTotal()/60)}
function displayMinute(){return displayTotal()%60}
function h12(h){const x=mod(h,12);return x===0?12:x}
function hourWord(h){return['tolv','ett','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva'][mod(h,12)]}
function digital(h,m){return pad(mod(h,24))+':'+pad(m)}
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
 return pad(h12(h))+':'+pad(m);
}
function ensureState(){
 if(typeof S==='undefined')return;
 if(!S.clock||typeof S.clock!=='object')S.clock={};
 if(!S.clock.passed||typeof S.clock.passed!=='object')S.clock.passed={};
 if(!Number.isFinite(S.clock.rounds))S.clock.rounds=0;
 if(!Number.isFinite(S.clock.correct))S.clock.correct=0;
}
function persist(){
 ensureState();
 if(typeof save==='function')save();
 if(typeof header==='function')header();
 updateCoinLabel();
}
function updateCoinLabel(){
 const coins=typeof S!=='undefined'&&Number.isFinite(S.coins)?S.coins:0;
 $c('clockCoins').innerHTML='Mynt: <b>'+coins+'</b>';
}
function addCoins(n){
 if(typeof S==='undefined'||!n)return;
 S.coins=(Number(S.coins)||0)+n;
 persist();
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
 mg.innerHTML='<line x1="160" y1="166" x2="160" y2="43" stroke="#789b83" stroke-width="7" stroke-linecap="round"/><circle cx="160" cy="48" r="9" fill="#789b83"/>';
 svg.appendChild(mg);
 const pin=document.createElementNS(ns,'circle');pin.setAttribute('cx','160');pin.setAttribute('cy','160');pin.setAttribute('r','9');pin.setAttribute('fill','#dfb36d');pin.setAttribute('stroke','#6e5b4b');pin.setAttribute('stroke-width','2');pin.style.pointerEvents='none';svg.appendChild(pin);
 updateHands();
}
function updateHands(){
 $c('minuteHand').setAttribute('transform','rotate('+(totalMinutes*6)+' 160 160)');
 $c('hourHand').setAttribute('transform','rotate('+(totalMinutes*.5)+' 160 160)');
 $c('clockDigital').textContent=digital(displayHour(),displayMinute());
}
function pointAngle(ev){
 const r=$c('clockFace').getBoundingClientRect();
 const x=(ev.clientX-r.left)/r.width*320-160,y=(ev.clientY-r.top)/r.height*320-160;
 return mod(Math.atan2(y,x)*180/Math.PI+90,360);
}
function shortestDelta(a,b){let d=a-b;if(d>180)d-=360;if(d<-180)d+=360;return d}
function startDrag(ev){
 if(ev.button!==undefined&&ev.button!==0)return;
 if(testFinished)return;
 drag=true;dragPointer=ev.pointerId;lastAngle=pointAngle(ev);
 $c('clockFace').classList.add('dragging');
 try{$c('clockFace').setPointerCapture(ev.pointerId)}catch{}
 resetCheckVisual();
 ev.preventDefault();
}
function moveDrag(ev){
 if(!drag||ev.pointerId!==dragPointer)return;
 const a=pointAngle(ev);
 totalMinutes+=shortestDelta(a,lastAngle)/6;
 lastAngle=a;updateHands();ev.preventDefault();
}
function endDrag(ev){
 if(!drag)return;
 if(ev&&dragPointer!==null&&ev.pointerId!==dragPointer)return;
 totalMinutes=Math.round(totalMinutes);
 drag=false;dragPointer=null;$c('clockFace').classList.remove('dragging');updateHands();
}

function makeTarget(){
 let h=rand(12),m=0,kind='words',is24=false;
 if(level==='hour')m=0;
 else if(level==='half')m=[0,30][rand(2)];
 else if(level==='quarter')m=[0,15,30,45][rand(4)];
 else if(level==='five')m=rand(12)*5;
 else if(level==='minute'){m=rand(60);kind='digital12';}
 else if(level==='24h'){h=rand(24);m=rand(60);kind='digital24';is24=true;}
 else{
  const t=rand(3);
  if(t===0){m=rand(12)*5;kind='words';}
  else if(t===1){m=rand(60);kind='digital12';}
  else{h=rand(24);m=rand(60);kind='digital24';is24=true;}
 }
 return{h,m,kind,is24};
}
function promptText(t){
 if(t.kind==='words')return swedishTime(t.h,t.m);
 if(t.kind==='digital24')return digital(t.h,t.m);
 return pad(h12(t.h))+':'+pad(t.m);
}
function seedClock(t){
 const base=(t.is24?t.h:mod(t.h,12))*60+t.m;
 let offset=rand(301)-150;if(Math.abs(offset)<25)offset+=offset<0?-55:55;
 totalMinutes=base+offset+(mode==='practice'&&t.is24?0:rand(2)*720);
 totalMinutes=Math.round(totalMinutes);
 updateHands();
}
function resetCheckVisual(){
 clearTimeout(feedbackTimer);
 const b=$c('clockCheck');b.className='clock-check';b.textContent='OK ✓';
 $c('clockFeedback').className='clock-feedback';
}
function updateModeUI(){
 document.querySelectorAll('#clockMode button').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode));
 $c('clockDigital').hidden=mode==='challenge';
 $c('clockModeNote').textContent=mode==='practice'
   ?'Öva: den digitala tiden visas live så du kan koppla ihop analog och digital tid.'
   :'Nivåprov: den digitala klockan är dold. 10 frågor – försök få alla rätt direkt.';
 $c('clockQuestionNo').textContent=mode==='challenge'?'FRÅGA '+Math.min(testIndex+1,10)+' AV 10':'ÖVNING';
 $c('clockProgress').style.width='';
}
function nextQuestion(){
 target=makeTarget();questionNo++;questionRewarded=false;testQuestionMistake=false;
 $c('clockTarget').textContent=promptText(target);
 $c('clockTip').textContent=levels.find(x=>x.id===level).tip;
 $c('clockQuestionNo').textContent=mode==='challenge'?'FRÅGA '+(testIndex+1)+' AV 10':'ÖVNING';
 $c('clockProgress').style.width=(mode==='challenge'?(testIndex/10*100):0)+'%';
 $c('clockScore').innerHTML=mode==='challenge'
   ?'Rätt direkt: <b>'+testFirstTryCorrect+'/10</b>'
   :'Rätt: <b>'+practiceCorrect+'</b>';
 resetCheckVisual();
 $c('clockFeedback').textContent='Dra den långa visaren och tryck OK.';
 seedClock(target);
}
function currentIsRight(){
 const h=displayHour(),m=displayMinute();
 if(m!==target.m)return false;
 // I nivåprov döljs digital tid; analog klocka kan inte skilja 08:07 från 20:07.
 if(mode==='challenge')return mod(h,12)===mod(target.h,12);
 return target.is24?h===target.h:mod(h,12)===mod(target.h,12);
}
function markButton(ok){
 const b=$c('clockCheck');
 b.className='clock-check '+(ok?'good':'bad');
 b.textContent=ok?'Rätt! ✓':'Fel ✕';
 $c('clockFeedback').className='clock-feedback '+(ok?'good':'bad');
}
function practiceAnswer(ok){
 if(ok){
  markButton(true);
  practiceCorrect++;
  if(!questionRewarded){questionRewarded=true;addCoins(1)}
  $c('clockScore').innerHTML='Rätt: <b>'+practiceCorrect+'</b>';
  $c('clockFeedback').textContent='Rätt! +1 mynt';
  if(typeof Sound!=='undefined')Sound.play('correct');
  feedbackTimer=setTimeout(nextQuestion,850);
 }else{
  markButton(false);
  $c('clockFeedback').textContent='Inte rätt ännu. Justera klockan och försök igen.';
  if(typeof Sound!=='undefined')Sound.play('wrong');
  feedbackTimer=setTimeout(()=>{resetCheckVisual();$c('clockFeedback').textContent='Försök igen.'},900);
 }
}
function challengeAnswer(ok){
 if(ok){
  markButton(true);
  if(!testQuestionMistake)testFirstTryCorrect++;
  $c('clockFeedback').textContent='Rätt!';
  if(typeof Sound!=='undefined')Sound.play('correct');
  testIndex++;
  $c('clockProgress').style.width=(testIndex/10*100)+'%';
  if(testIndex>=10){
   feedbackTimer=setTimeout(finishTest,800);
  }else feedbackTimer=setTimeout(nextQuestion,800);
 }else{
  testMistakes++;testQuestionMistake=true;
  markButton(false);
  $c('clockFeedback').textContent='Fel – justera klockan och försök igen.';
  if(typeof Sound!=='undefined')Sound.play('wrong');
  feedbackTimer=setTimeout(()=>{resetCheckVisual();$c('clockFeedback').textContent='Försök igen.'},900);
 }
 $c('clockScore').innerHTML='Rätt direkt: <b>'+testFirstTryCorrect+'/10</b>';
}
function finishTest(){
 ensureState();testFinished=true;
 const passed=testMistakes===0&&testFirstTryCorrect===10;
 const first=passed&&!S.clock.passed[level];
 let reward=passed?(first?20:12):5;
 if(passed)S.clock.passed[level]=true;
 S.clock.rounds++;S.clock.correct+=testFirstTryCorrect;
 S.coins=(Number(S.coins)||0)+reward;
 if(typeof careAfterRound==='function')careAfterRound();
 persist();
 $c('clockProgress').style.width='100%';
 $c('clockQuestionNo').textContent='NIVÅPROV KLART';
 $c('clockTarget').textContent=passed?'Nivån är klar!':'Bra tränat!';
 $c('clockTip').textContent=passed?'10 av 10 rätt på första försöket.':'Du kan köra nivån igen och försöka få 10 av 10 direkt.';
 const b=$c('clockCheck');b.className='clock-check '+(passed?'good':'');b.textContent='Kör igen';
 $c('clockFeedback').className='clock-feedback '+(passed?'good':'');
 $c('clockFeedback').textContent=(passed?'Godkänt':'Klart')+' · +'+reward+' mynt';
 $c('clockScore').innerHTML='Rätt direkt: <b>'+testFirstTryCorrect+'/10</b>';
 if(typeof Sound!=='undefined')Sound.play(passed?'win':'finish');
}
function startTest(){
 testIndex=0;testMistakes=0;testFirstTryCorrect=0;testQuestionMistake=false;testFinished=false;
 nextQuestion();
}
function check(){
 if(testFinished){startTest();return}
 endDrag();
 const ok=currentIsRight();
 if(mode==='practice')practiceAnswer(ok);else challengeAnswer(ok);
}
function setMode(next){
 if(mode===next)return;
 mode=next;clearTimeout(feedbackTimer);testFinished=false;
 updateModeUI();
 if(mode==='challenge')startTest();else nextQuestion();
}
function setLevel(next){
 level=next;clearTimeout(feedbackTimer);testFinished=false;
 if(mode==='challenge')startTest();else nextQuestion();
}

$c('clockFace').addEventListener('pointerdown',startDrag);
$c('clockFace').addEventListener('pointermove',moveDrag);
$c('clockFace').addEventListener('pointerup',endDrag);
$c('clockFace').addEventListener('pointercancel',endDrag);
$c('clockFace').addEventListener('lostpointercapture',()=>endDrag());
$c('clockCheck').onclick=check;
$c('clockLevel').onchange=e=>setLevel(e.target.value);
$c('clockMode').querySelectorAll('button').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));

clockNav.onclick=()=>{
 show('clock');
 ensureState();
 if(typeof header==='function')header();
 $c('sub').textContent='Klockträning';
 updateCoinLabel();
 updateModeUI();
};

ensureState();makeFace();updateModeUI();nextQuestion();updateCoinLabel();

window.ClockTrainer={open:function(){
 ensureState();updateCoinLabel();updateModeUI();updateHands();
}};
})();