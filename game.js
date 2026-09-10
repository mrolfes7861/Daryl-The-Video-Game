/* =====================================================================
   DARYL: THE VIDEO GAME
   One workday. One deal. A house closing, a wedding, and two dogs.

   ---------------------------------------------------------------
   EDIT THE NAMES BELOW, SAVE, PUSH. That is the whole customisation.
   --------------------------------------------------------------- */
const CONFIG = {
  hero:    'DARYL',
  fiancee: 'THE FIANCEE',   // <- her actual name goes here
  dogs:    ['BARLEY', 'MOOSE'], // <- the actual dog names go here
  helper:  'MICHAEL',
  arr:     '$47,000',
};

/* ===================== tuning ===================== */
const DAY_SECONDS = 240;      // real seconds for 9:00 AM -> 5:00 PM
const MAX_CARDS   = 3;

const T = {
  dealPerCard:      4.8,
  dealMichael:      9.0,
  dealCardMissed:  -1.4,
  dealDogTyping:   -4.0,

  compCardMissed:  -7,
  compMichael:     14,
  compBarkPerSec:  -3.0,
  compRegen:        1.6,

  anxPerSec:        0.20,
  anxIgnored:      20,
  anxAnswered:    -16,

  callHoldSeconds:  3.2,
  ringSeconds:      8.5,
  wifeSeconds:      9.0,
  barkSeconds:      8.0,
};

/* ===================== content ===================== */
const COMPANIES = ['Northwind Logistics','Halvorsen Mfg.','Pinnacle Dental','Blue Ridge Plumbing',
  'Meridian Staffing','Apex Roofing','Sterling Freight','Hartman & Sons','Lakeside Ortho',
  'Cornerstone Realty','Fairview Auto Group','Delta Pest Control'];

const WORK = [
  {k:'call',  tag:'INCOMING CALL',  act:'ANSWER',  t:'{co}', p:'They want to circle back on pricing. Again.'},
  {k:'call',  tag:'INCOMING CALL',  act:'ANSWER',  t:'{co}', p:'Second attempt. There is already a voicemail.'},
  {k:'call',  tag:'INCOMING CALL',  act:'ANSWER',  t:'{co}', p:'Your champion left the company. This is the new guy.'},
  {k:'call',  tag:'INCOMING CALL',  act:'ANSWER',  t:'{co}', p:'Caller ID says MOBILE. That is never good.'},
  {k:'teams', tag:'TEAMS',          act:'REPLY',   t:'Sales Manager', p:'Where are we on {co}? Asking for the forecast.'},
  {k:'teams', tag:'TEAMS',          act:'REPLY',   t:'Sales Manager', p:'Forecast call got moved up. Twenty minutes.'},
  {k:'teams', tag:'TEAMS',          act:'REPLY',   t:'Marketing',     p:'Can you repost the webinar thing? Pretty please.'},
  {k:'teams', tag:'TEAMS',          act:'REPLY',   t:'Finance',       p:'This expense report is from March.'},
  {k:'teams', tag:'TEAMS',          act:'REPLY',   t:'{co}',          p:'sorry to bug you again!! any update?'},
  {k:'teams', tag:'TEAMS',          act:'REPLY',   t:'A New SDR',     p:'hey quick q, whats a POC'},
  {k:'quote', tag:'APPROVAL NEEDED',act:'APPROVE', t:'Quote #4471',   p:'42% discount. You are, once again, at the edge of your authority.'},
  {k:'quote', tag:'ORDER FORM',     act:'FIX IT',  t:'Signature block wrong', p:'Legal name is Halvorsen Mfg. LLC. Not Halverson. Not Halvorson.'},
  {k:'quote', tag:'RENEWAL',        act:'SEND IT', t:'Expires in 4 days', p:'Nobody has spoken to this account since 2024.'},
  {k:'quote', tag:'CRM',            act:'CLEAR',   t:'14 overdue tasks',  p:'Your manager can see this. Your manager has seen this.'},
  {k:'quote', tag:'PROCUREMENT',    act:'RESPOND', t:'Security questionnaire', p:'311 questions. Due today. They found it in a drawer.'},
];

const MICHAEL_CARDS = [
  {t:'{helper}', p:'Daryl, I got this one.'},
  {t:'{helper}', p:'Already sent them the security doc. You are good.'},
  {t:'{helper}', p:'I will take the technical call. Go handle your realtor.'},
  {t:'{helper}', p:'Rebuilt the quote. Just needs your name on it.'},
  {t:'{helper}', p:'Told them the AS/400 thing is fine. It is not, but it is fine.'},
];

const TECH_Q = [
  'Does this integrate with our AS/400?',
  'Is it HIPAA compliant if we only use it on Fridays?',
  'Can you make it do what the other one does?',
  'Our IT guy left. Can it self-host? He had it on a boat.',
  'Does the AI part use the good AI or the regular AI?',
  'What is your SOC 2 posture on Novell NetWare?',
  'If we turn it off at night does it still cost money at night?',
  'Can we get a demo, but with all of our real data in it, by Thursday?',
];
const TECH_OPTS = [
  {label:'LOOP IN {helper}',  deal:7,  comp:6,  toast:['good','{helper} took it. {helper} always takes it.']},
  {label:'LET ME FIND OUT',   deal:3.5,comp:0,  toast:[null,null]},
  {label:'ABSOLUTELY, YES',   deal:-3, comp:-7, toast:['bad','You said yes. You have no idea what you said yes to.']},
];

const WIFE = [
  {q:'Did you call the photographer?', a:[
    ['YES', 4], ['I WILL TODAY, I PROMISE', 5],
    ['I THOUGHT YOU WERE DOING THAT', -13], ['WHAT PHOTOGRAPHER?', -28]]},
  {q:'Have you written your vows?', a:[
    ['ALMOST DONE', 4], ['THEY ARE IN MY HEAD', 1],
    ['I AM GOING TO WING IT', -13], ['ARE THOSE MANDATORY?', -28]]},
  {q:'The caterer needs a final headcount.', a:[
    ['I WILL SEND IT TONIGHT', 5], ['PUT ME DOWN FOR EXTRA', 2],
    ['CAN WE JUST DO PIZZA?', -13], ['HEADCOUNT OF WHAT?', -28]]},
  {q:'Did you book the honeymoon?', a:[
    ['BOOKED AND CONFIRMED', 5], ['I AM WATCHING FLIGHTS', 2],
    ['CAN WE PUSH IT TO Q1?', -13], ['HONEYMOON?', -28]]},
  {q:'Your mother called about the seating chart.', a:[
    ['I WILL HANDLE IT', 5], ['PUT HER NEAR THE BAR', 3],
    ['SHE CAN SIT WITH THE DOGS', -11], ['I AM ON A CALL', -22]]},
  {q:'Are you even listening to me?', a:[
    ['YES', 3], ['EVERY WORD', 4],
    ['CAN YOU REPEAT THAT?', -12], ['ONE SEC, CLOSING A DEAL', -28]]},
  {q:'What color did we land on for the napkins?', a:[
    ['SAGE', 5], ['WHATEVER YOU PICKED', 3],
    ['NAPKIN COLORED', -11], ['WE HAVE NAPKINS?', -20]]},
  {q:'The lender emailed me instead of you. Why?', a:[
    ['I WILL CALL HIM RIGHT NOW', 5], ['HE DOES THAT', 1],
    ['DID YOU OPEN IT?', -10], ['WHICH LENDER?', -22]]},
  {q:'Registry. Today. Please.', a:[
    ['ALREADY DONE', 5], ['I ADDED A GRILL', 3],
    ['CAN WE REGISTER FOR A BOAT?', -11], ['I AM ON A CALL', -22]]},
  {q:'Should we do a first look before the ceremony?', a:[
    ['THAT SOUNDS GREAT', 5], ['WHATEVER YOU WANT', 3],
    ['A FIRST WHAT?', -11], ['LET ME DISCOVERY-CALL THAT', -20]]},
  {q:'Who is walking your grandmother down the aisle?', a:[
    ['I HAVE A GUY', 4], ['I WILL ASK MY BROTHER', 5],
    ['SHE IS PRETTY MOBILE', -11], ['IS SHE COMING?', -28]]},
  {q:'My mom wants to know how long you are working today.', a:[
    ['UNTIL FIVE, THEN I AM YOURS', 5], ['NOT MUCH LONGER', 3],
    ['SHE CAN ASK ME HERSELF', -12], ['I LIVE HERE NOW', -20]]},
  {q:'Can you take the loud calls somewhere else?', a:[
    ['OF COURSE, SORRY', 5], ['I WILL USE THE GARAGE', 4],
    ['THEY ARE ALL LOUD', -11], ['THIS IS MY OFFICE', -22]]},
  {q:'My mom made you lunch. Specifically you.', a:[
    ['I WILL COME RIGHT DOWN', 5], ['TELL HER THANK YOU', 4],
    ['I ALREADY ATE', -12], ['IS IT THE TUNA ONE?', -20]]},
  {q:'The inspector wants access tomorrow at 10.', a:[
    ['I WILL MOVE MY CALLS', 5], ['I WILL BE THERE', 4],
    ['CAN HE LET HIMSELF IN?', -11], ['I HAVE A FORECAST CALL', -20]]},
];

/* Flavour only. No mechanic. This room is its own antagonist. */
const AMBIENT = [
  'Your mother-in-law is vacuuming directly outside the door.',
  'The TV downstairs is at volume 60. It is a game show.',
  '"DARYL? Do you want a sandwich?"',
  'Someone ran the garbage disposal. There was nothing in it.',
  'This door does not latch. You have made peace with that.',
  'Your laptop is propped on three of her Reader\'s Digests.',
  'The Wi-Fi password on the sticky note is the old Wi-Fi password.',
  'A cat you have never been introduced to is in the hallway.',
  '"DARYL? Is that a work call or a real call?"',
  'Week four in this bedroom. The closing date has moved twice.',
  'This chair is from the dining set. It was not built for eight hours.',
  'The room smells like potpourri. It will always smell like potpourri.',
  'Somebody opened the door, saw you on a call, and stayed to listen.',
  'Your second monitor is still in a box labelled MASTER BR.',
  'The ceiling fan has one setting and it is hurricane.',
  '"DARYL? The dogs got into the trash again."',
  'A framed photo of your fiancee at age nine is watching you work.',
];

const CALLERS = [
  ['REALTOR', 'Probably about the countertops'],
  ['LENDER', 'It is always one more document'],
  ['HOME INSPECTOR', 'He used the word moisture'],
  ['INSURANCE AGENT', 'A couple quick questions about the roof'],
  ['TITLE COMPANY', 'Needs a notary. Today.'],
  ['REALTOR (2nd)', 'You did not pick up the first time'],
  ['APPRAISER', 'Wants to reschedule for the third time'],
  ['MORTGAGE PROCESSOR', 'Cannot open the PDF you sent'],
  ['REALTOR (3rd)', 'She is not going to stop'],
  ['HOME WARRANTY GUY', 'Not affiliated. Somehow has your number.'],
  ['LENDER (AGAIN)', 'Needs the same pay stub, again'],
];
const IGNORED_MSG = [
  'Realtor left a voicemail. It is four minutes long.',
  'Lender needs one more pay stub. There is always one more pay stub.',
  'Inspector texted the word "moisture" and nothing else.',
  'Insurance agent left a voicemail about the roof. The roof is new.',
  'Title company needs a signature by 5. It is 5 somewhere.',
  'Missed call. Your closing date just got a little more theoretical.',
];
const ANSWERED_MSG = [
  'Realtor handled. Closing is still on.',
  'Sent the lender the pay stub. He will ask again tomorrow.',
  'Talked the inspector down. It was condensation.',
  'Insurance sorted. Roof is, in fact, new.',
  'Notary scheduled. You will be there. Probably.',
  'Ten minutes of your life, gone. Anxiety, also gone.',
];

/* ===================== sound ===================== */
const Snd = {
  ac:null, on:true,
  boot(){ if(!this.ac){ try{ this.ac = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } },
  tone(f, dur, type='sine', vol=.07, slide=0){
    if(!this.on || !this.ac) return;
    const t = this.ac.currentTime;
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f+slide), t+dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t+.012);
    g.gain.exponentialRampToValueAtTime(.0001, t+dur);
    o.connect(g); g.connect(this.ac.destination); o.start(t); o.stop(t+dur+.05);
  },
  ding(){ this.tone(880,.12,'sine',.05); setTimeout(()=>this.tone(1170,.16,'sine',.045),90); },
  ring(){ this.tone(420,.14,'square',.035); setTimeout(()=>this.tone(520,.16,'square',.03),150); },
  bark(){ this.tone(240,.11,'sawtooth',.05,-120); },
  good(){ this.tone(660,.1,'triangle',.05); setTimeout(()=>this.tone(990,.18,'triangle',.05),85); },
  bad(){ this.tone(200,.28,'sawtooth',.06,-90); },
  ouch(){ this.tone(130,.5,'square',.05,-60); },
};

/* ===================== state ===================== */
const S = {
  phase:'title', t:0, last:0,
  deal:0, anxiety:0, harmony:100, composure:100,
  cards:[], nextCard:2.0,
  call:null, nextCall:9,
  wife:null, nextWife:16,
  dogs:[], nextBark:11, nextWalk:46, nextAmbient:7,
  onCall:0, deskDog:null, shake:0, reaction:0,
  stats:{handled:0, missed:0, answered:0, ignored:0, hushed:0, blunders:0, michael:0},
};

const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// looked up once; these run every frame
const elWork   = $('#work'),   elPhone = $('#phone'),
      elWife   = $('#wifebox'), elToasts = $('#toasts'),
      elEnd    = $('#endscreen'), elClock = $('#clock');
const rnd  = a => a[Math.floor(Math.random()*a.length)];
const clamp = (v,a,b) => v<a?a:v>b?b:v;
const lerp = (a,b,p) => a+(b-a)*p;

function fill(str){
  return String(str)
    .replace(/\{co\}/g, S.currentCo || rnd(COMPANIES))
    .replace(/\{helper\}/g, CONFIG.helper)
    .replace(/\{hero\}/g, CONFIG.hero)
    .replace(/\{wife\}/g, CONFIG.fiancee);
}
const progress = () => clamp(S.t / DAY_SECONDS, 0, 1);

/* ===================== toasts ===================== */
function toast(kind, msg){
  const el = document.createElement('div');
  el.className = 'toast ' + (kind||'');
  el.innerHTML = fill(msg);
  elToasts.appendChild(el);
  setTimeout(()=>el.remove(), 3900);
  while(elToasts.children.length > 4) elToasts.firstChild.remove();
}

/* ===================== meters ===================== */
const METERS = $$('#meters .meter').map(m => ({
  k: m.dataset.k, el: m, fill: m.querySelector('.fill'), num: m.querySelector('b'), warn: false,
}));

function paintMeters(){
  const vals = {deal:S.deal, anxiety:S.anxiety, harmony:S.harmony, composure:S.composure};
  for(const m of METERS){
    const v = clamp(vals[m.k], 0, 100);
    m.fill.style.width = v + '%';
    m.num.textContent = Math.round(v) + '%';
    const danger = m.k === 'anxiety' ? v > 78 : m.k === 'deal' ? false : v < 24;
    if(danger !== m.warn){ m.el.classList.toggle('warn', danger); m.warn = danger; }
  }
  const hours = lerp(9,17,progress());
  const h = Math.floor(hours), mn = Math.floor(hours % 1 * 12) * 5;
  const hh = h > 12 ? h - 12 : h;
  elClock.innerHTML =
    `${hh}:${String(mn).padStart(2,'0')} <small>${h<12?'AM':'PM'} &middot; MONDAY</small>`;
}

/* ===================== work cards ===================== */
function spawnCard(){
  if(S.cards.length >= MAX_CARDS) return;
  S.currentCo = rnd(COMPANIES);
  const p = progress();
  const roll = Math.random();

  let ev;
  if(roll < 0.14){                                   // Michael saves the day
    const m = rnd(MICHAEL_CARDS);
    ev = {kind:'michael', tag:'TEAMS', act:'LET HIM', title:fill(m.t), body:fill(m.p),
          life: 9, max: 9};
  // one question card at a time: three of them stack past the phone
  } else if(roll < 0.34 && !S.cards.some(c => c.kind === 'tech')){
    ev = {kind:'tech', tag:'CUSTOMER QUESTION', title:S.currentCo, body:'"'+rnd(TECH_Q)+'"',
          opts:TECH_OPTS, life: 11, max: 11};
  } else {                                           // ordinary chaos
    const w = rnd(WORK);
    ev = {kind:w.k, tag:w.tag, act:w.act, title:fill(w.t), body:fill(w.p),
          life: lerp(11,7,p), max: lerp(11,7,p)};
  }

  ev.co = S.currentCo;
  ev.el = buildCard(ev);
  elWork.appendChild(ev.el);
  S.cards.push(ev);
  ev.kind === 'michael' ? Snd.good() : Snd.ding();
}

function buildCard(ev){
  const el = document.createElement('div');
  el.className = 'wcard' + (ev.kind==='michael' ? ' michael' : '') +
                 (ev.kind==='call' || ev.kind==='quote' ? ' urgent' : '');
  let inner = `<div class="tag"><span>${ev.tag}</span><span>${ev.kind==='michael'?'FREE WIN':''}</span></div>
    <h4>${ev.title}</h4><p>${ev.body}</p><div class="bar"><i></i></div>`;
  if(ev.opts){
    inner += '<div class="opts">' + ev.opts.map((o,i)=>
      `<button data-i="${i}">${fill(o.label)}</button>`).join('') + '</div>';
  } else {
    inner += `<button data-i="-1">${ev.act}</button>`;
  }
  el.innerHTML = inner;
  ev.bar = el.querySelector('.bar i');
  el.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', ()=> resolveCard(ev, parseInt(b.dataset.i,10)));
  });
  return el;
}

function resolveCard(ev, optIndex){
  if(ev.done || S.onCall > 0) return;
  ev.done = true;

  if(ev.kind === 'michael'){
    S.deal += T.dealMichael; S.composure += T.compMichael;
    S.stats.michael++; S.stats.handled++;
    toast('good', `${CONFIG.helper} handled it. No notes.`);
    Snd.good();
  } else if(ev.opts){
    const o = ev.opts[optIndex] || ev.opts[1];
    S.deal += o.deal; S.composure += o.comp;
    if(o.deal < 0){ S.stats.blunders++; Snd.bad(); } else { S.stats.handled++; Snd.good(); }
    if(o.toast[0]) toast(o.toast[0], fill(o.toast[1]));
  } else {
    S.deal += T.dealPerCard; S.composure += 1.5;
    S.stats.handled++; Snd.good();
  }
  killCard(ev);
  paintMeters();
}

function killCard(ev){
  ev.el.classList.add('dying');
  setTimeout(()=>ev.el.remove(), 300);
  S.cards = S.cards.filter(c=>c!==ev);
}

function expireCard(ev){
  ev.done = true;
  S.deal += T.dealCardMissed;
  S.composure += T.compCardMissed;
  S.stats.missed++;
  S.reaction = 1;
  const lines = {
    call:  'Missed the call from {co}. Straight to voicemail.',
    teams: 'Left that message on read. They noticed.',
    quote: 'That approval expired. Someone in Finance sighed.',
    tech:  '{co} never got an answer. They are googling competitors.',
  };
  toast('bad', fill(lines[ev.kind] || 'Something slipped through the cracks.'));
  Snd.bad();
  killCard(ev);
}

/* ===================== personal phone ===================== */
function startRing(){
  const [who, sub] = rnd(CALLERS);
  S.call = {who, sub, life:T.ringSeconds, max:T.ringSeconds};
  const p = elPhone;
  p.className = 'ring';
  p.innerHTML = `<div class="who">PERSONAL &middot; INCOMING</div>
    <div class="name">${who}</div><div class="sub">${sub}</div>
    <div class="btns"><button class="ans">ANSWER</button><button class="dec">LATER</button></div>
    <div class="ringbar"><i></i></div>`;
  S.phoneBar = p.querySelector('.ringbar i');
  p.querySelector('.ans').addEventListener('click', answerCall);
  p.querySelector('.dec').addEventListener('click', declineCall);
  Snd.ring();
}

function answerCall(){
  if(!S.call || S.onCall > 0) return;
  S.anxiety += T.anxAnswered;
  S.stats.answered++;
  S.onCall = T.callHoldSeconds;
  toast('house', rnd(ANSWERED_MSG));
  Snd.good();
  const p = elPhone;
  p.className = 'oncall';
  p.innerHTML = `<div class="who" style="color:var(--deal)">ON THE PHONE</div>
    <div class="name">${S.call.who}</div>
    <div class="sub">Work is piling up while you do this. That is the trade.</div>
    <div class="ringbar"><i style="background:var(--deal)"></i></div>`;
  S.phoneBar = p.querySelector('.ringbar i');
  S.call = null;
  paintMeters();
}

function declineCall(){ if(S.call) ringOut(); }

function ringOut(){
  S.anxiety += T.anxIgnored;
  S.stats.ignored++;
  toast('house', rnd(IGNORED_MSG));
  S.call = null;
  elPhone.className = 'hidden';
  paintMeters();
}

/* ===================== fiancee ===================== */
function startWife(){
  const q = rnd(WIFE.filter(w => !w.used)) || rnd(WIFE);
  q.used = true;
  const opts = q.a.slice().sort(()=>Math.random()-.5);
  S.wife = {q, opts, life:T.wifeSeconds, max:T.wifeSeconds, walk:0};
  const b = elWife;
  b.className = '';
  b.innerHTML = `<div class="bub"><div class="nm">${CONFIG.fiancee}</div>
    <div class="q">${q.q}</div>
    <div class="opts">${opts.map((o,i)=>`<button data-i="${i}">${o[0]}</button>`).join('')}</div>
    <div class="timer"><i></i></div></div>`;
  S.wifeBar = b.querySelector('.timer i');
  b.querySelectorAll('button').forEach(btn=>{
    btn.addEventListener('click', ()=> answerWife(parseInt(btn.dataset.i,10)));
  });
  Snd.ding();
}

function answerWife(i){
  if(!S.wife) return;
  const [text, val] = S.wife.opts[i];
  S.harmony += val;
  if(val <= -20){
    S.stats.blunders++; S.composure -= 6; S.reaction = 1;
    toast('bad', `You said "${text}". Out loud. To her face.`);
    Snd.ouch();
  } else if(val < 0){
    S.stats.blunders++;
    toast('bad', `"${text}" did not land the way you hoped.`);
    Snd.bad();
  } else {
    toast('good', `"${text}" bought you some time.`);
    Snd.good();
  }
  endWife();
  paintMeters();
}

function endWife(){ S.wife = null; elWife.className = 'hidden'; }

function wifeTimeout(){
  S.harmony -= 22;
  S.composure -= 4;
  S.stats.blunders++;
  toast('bad', 'You did not answer her. She watched you not answer her.');
  Snd.ouch();
  endWife();
}

/* ===================== dogs ===================== */
function makeDogs(){
  S.dogs = [
    {name:CONFIG.dogs[0], x:648, y:672, s:1.0,  coat:'#d9a441', ear:'#b8862c', flip:1,  bark:0, hits:0, bob:0},
    {name:CONFIG.dogs[1], x:846, y:682, s:0.88, coat:'#7b7671', ear:'#5e5a56', flip:-1, bark:0, hits:0, bob:1.7},
  ];
}
function startBark(){
  const quiet = S.dogs.filter(d=>d.bark<=0);
  if(!quiet.length) return;
  const d = rnd(quiet);
  d.bark = T.barkSeconds; d.hits = 0;
  Snd.bark();
}
function hitDog(d){
  if(d.bark <= 0) return;
  d.hits++;
  Snd.tone(520 + d.hits*110, .07, 'triangle', .04);
  if(d.hits >= 3){
    d.bark = 0; d.hits = 0;
    S.stats.hushed++;
    S.composure += 3;
    toast('dog', `${d.name} settles down. For now.`);
  }
}
function dogOnKeyboard(){
  if(S.deskDog) return;
  const d = rnd(S.dogs);
  S.deskDog = {dog:d, t:0};
  S.deal += T.dealDogTyping;
  S.stats.blunders++;
  const co = rnd(COMPANIES);
  toast('dog', `${d.name} walked across the keyboard. You sent <b>"aaaaaaaaaaaaaaaaaa"</b> to ${co}.`);
  later(()=> toast('dog', `${co} replied: "?"`), 2200);
  Snd.bad();
  paintMeters();
}

/* ===================== canvas scene ===================== */
const cv = $('#scene'), ctx = cv.getContext('2d');
(function hidpi(){
  const r = window.devicePixelRatio || 1;
  cv.width = 1280*r; cv.height = 720*r; ctx.scale(r,r);
})();

const FLOOR = 600, DESK_L = 268, DESK_R = 878, DESK_BACK = 505, DESK_EDGE = 566, DESK_BOT = 632;
const SKIN = '#e3ab84', SKIN_D = '#c98f68', SHIRT = '#3f6fa8', SHIRT_D = '#33598a';

function rr(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}

function drawRoom(){
  // dated wallpaper in a spare bedroom that was never meant to be an office
  const g = ctx.createLinearGradient(0,64,0,FLOOR);
  g.addColorStop(0,'#5d4a4a'); g.addColorStop(1,'#3e3335');
  ctx.fillStyle = g; ctx.fillRect(0,64,1280,FLOOR-64);
  ctx.fillStyle='rgba(214,186,172,.13)';
  for(let yy=88; yy<FLOOR; yy+=54){
    for(let xx=(yy/54%2?26:0); xx<1280; xx+=52){
      ctx.beginPath();
      for(let k=0;k<4;k++){
        const a = k/4*Math.PI*2;
        ctx.ellipse(xx+Math.cos(a)*5, yy+Math.sin(a)*5, 4.2, 2.6, a, 0, 7);
      }
      ctx.fill();
      ctx.beginPath(); ctx.arc(xx,yy,2,0,7); ctx.fill();
    }
  }
  // carpet + baseboard trim
  ctx.fillStyle = '#4a3d33'; ctx.fillRect(0,FLOOR,1280,720-FLOOR);
  ctx.fillStyle='rgba(0,0,0,.14)';
  for(let xx=0; xx<1280; xx+=9) if(xx%18===0) ctx.fillRect(xx,FLOOR,4,120);
  ctx.fillStyle = '#d8cdbd'; ctx.fillRect(0,FLOOR-16,1280,16);
  ctx.fillStyle = '#b3a795'; ctx.fillRect(0,FLOOR-2,1280,4);

  drawDoorway();
  drawNightstand();
  drawBoxes();

  // her mother's decorative plate arrangement
  [[792,158,20],[848,196,15],[796,232,13]].forEach(([px,py,pr])=>{
    ctx.fillStyle='#e6ddd0'; ctx.beginPath(); ctx.arc(px,py,pr,0,7); ctx.fill();
    ctx.strokeStyle='#9d8e7c'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#a8788c'; ctx.beginPath(); ctx.arc(px,py,pr*0.42,0,7); ctx.fill();
  });

  // cross-stitch, framed
  ctx.fillStyle='#6b4a30'; rr(316,120,156,116,3); ctx.fill();
  ctx.fillStyle='#efe7d8'; ctx.fillRect(326,130,136,96);
  ctx.fillStyle='#8a5a72'; ctx.font='900 15px Georgia, serif'; ctx.textAlign='center';
  ctx.fillText('BLESS', 394, 166); ctx.fillText('THIS HOME', 394, 190);
  ctx.fillStyle='#c1697c';
  ctx.beginPath(); ctx.arc(388,206,5,0,7); ctx.arc(400,206,5,0,7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(382,208); ctx.lineTo(394,220); ctx.lineTo(406,208); ctx.fill();
  ctx.textAlign='left';

  // wall clock, real game time
  const cx=618, cy=172, r=42;
  ctx.fillStyle='#c9a24a'; ctx.beginPath(); ctx.arc(cx,cy,r+5,0,7); ctx.fill();
  ctx.fillStyle='#f2ece0'; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.fill();
  ctx.fillStyle='#4a3f3a';
  for(let i=0;i<12;i++){ const a=i/12*Math.PI*2;
    ctx.fillRect(cx+Math.sin(a)*(r-9)-1.5, cy-Math.cos(a)*(r-9)-1.5, 3,3); }
  const hours = lerp(9,17,progress());
  const ha = (hours%12)/12*Math.PI*2, ma = (hours%1)*Math.PI*2;
  ctx.strokeStyle='#33292a'; ctx.lineWidth=4; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.sin(ha)*21, cy-Math.cos(ha)*21); ctx.stroke();
  ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.sin(ma)*31, cy-Math.cos(ma)*31); ctx.stroke();
  ctx.fillStyle='#c9a24a'; ctx.beginPath(); ctx.arc(cx,cy,4,0,7); ctx.fill();
}

// the hallway door that does not lock and never fully closes
function drawDoorway(){
  ctx.fillStyle='#efe7d8'; ctx.fillRect(18,138,156,FLOOR-138);
  ctx.fillStyle='#241d1e'; ctx.fillRect(30,150,132,FLOOR-150);
  const spill = ctx.createLinearGradient(30,150,162,FLOOR);
  spill.addColorStop(0,'rgba(240,200,130,.30)'); spill.addColorStop(1,'rgba(240,200,130,.05)');
  ctx.fillStyle=spill; ctx.fillRect(30,150,132,FLOOR-150);
  ctx.fillStyle='#c9bda9'; ctx.fillRect(150,150,12,FLOOR-150);
  ctx.fillStyle='rgba(240,200,130,.14)';
  ctx.beginPath(); ctx.moveTo(162,FLOOR); ctx.lineTo(30,FLOOR); ctx.lineTo(96,720); ctx.lineTo(300,720); ctx.fill();
}

// nightstand pressed into service as a filing cabinet
function drawNightstand(){
  ctx.fillStyle='#5a3f2c'; rr(186,470,84,130,4); ctx.fill();
  ctx.fillStyle='#6d4d36'; ctx.fillRect(192,486,72,44); ctx.fillRect(192,538,72,44);
  ctx.fillStyle='#c9a24a';
  ctx.beginPath(); ctx.arc(228,508,4,0,7); ctx.fill();
  ctx.beginPath(); ctx.arc(228,560,4,0,7); ctx.fill();
  // lace doily
  ctx.fillStyle='#efe7d8'; ctx.beginPath(); ctx.ellipse(228,470,46,10,0,0,7); ctx.fill();
  // framed engagement photo, the one thing in here that is theirs
  ctx.fillStyle='#c9a24a'; rr(196,404,64,58,3); ctx.fill();
  ctx.fillStyle='#5b7ea8'; ctx.fillRect(202,410,52,46);
  ctx.fillStyle=SKIN; ctx.beginPath(); ctx.arc(218,432,8,0,7); ctx.fill();
  ctx.beginPath(); ctx.arc(238,432,8,0,7); ctx.fill();
  ctx.fillStyle='#5b3b2c'; ctx.beginPath(); ctx.arc(238,428,9.5,Math.PI,0); ctx.fill();
  ctx.fillStyle='#3f6fa8'; ctx.fillRect(204,444,48,12);
}

// four weeks of their life, stacked and labelled
function drawBoxes(){
  const boxes = [[928,462,132,96,'KITCHEN'],[938,392,112,70,'FRAGILE'],[1064,486,116,72,'MASTER BR']];
  boxes.forEach(([bx,by,bw,bh,label])=>{
    ctx.fillStyle='#b08a5c'; ctx.fillRect(bx,by,bw,bh);
    ctx.fillStyle='#9b7549'; ctx.fillRect(bx,by,bw,10);
    ctx.strokeStyle='#7d5d38'; ctx.lineWidth=2; ctx.strokeRect(bx,by,bw,bh);
    ctx.fillStyle='#d9cbb4'; ctx.fillRect(bx+bw/2-9,by,18,bh);
    ctx.fillStyle='#4a3f3a'; ctx.font='800 11px Segoe UI, sans-serif'; ctx.textAlign='center';
    ctx.fillText(label, bx+bw/2, by+bh-14); ctx.textAlign='left';
  });
}

// a plastic folding table, because the real desk is in a storage unit
function drawDesk(){
  ctx.fillStyle='#8d8a83'; ctx.fillRect(DESK_L, DESK_BACK, DESK_R-DESK_L, DESK_EDGE-DESK_BACK);
  ctx.fillStyle='#c8c5bd'; ctx.fillRect(DESK_L, DESK_EDGE, DESK_R-DESK_L, 11);
  ctx.fillStyle='#a3a099'; ctx.fillRect(DESK_L, DESK_EDGE+11, DESK_R-DESK_L, 9);
  // thin steel legs
  ctx.strokeStyle='#6f6e6b'; ctx.lineWidth=7; ctx.lineCap='round';
  [DESK_L+40, DESK_R-40].forEach(lx=>{
    const dir = lx < 640 ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(lx, DESK_EDGE+18); ctx.lineTo(lx+dir*26, 706); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx+dir*26, DESK_EDGE+18); ctx.lineTo(lx, 706); ctx.stroke();
  });
  // a lace runner she insisted on leaving
  ctx.fillStyle='#efe7d8';
  ctx.fillRect(DESK_L+8, DESK_EDGE, 96, 11);
  ctx.beginPath();
  for(let i=0;i<8;i++) ctx.arc(DESK_L+16+i*12, DESK_EDGE+11, 6, 0, Math.PI);
  ctx.fill();
}

// laptop propped on library books, one borrowed monitor, one mug
function drawMonitor(){
  // stack of books acting as a stand
  ['#7d4a4a','#4a5d7d','#6b6248'].forEach((c,i)=>{
    ctx.fillStyle=c; ctx.fillRect(700+i*3, 494-i*13, 168-i*6, 13);
    ctx.fillStyle='rgba(0,0,0,.22)'; ctx.fillRect(700+i*3, 494-i*13, 168-i*6, 3);
  });
  // laptop screen
  ctx.fillStyle='#1b1f27'; rr(706,376,164,104,5); ctx.fill();
  ctx.strokeStyle='#3a4250'; ctx.lineWidth=3; ctx.stroke();
  const glow = ctx.createLinearGradient(706,376,706,480);
  glow.addColorStop(0,'rgba(90,169,240,.26)'); glow.addColorStop(1,'rgba(90,169,240,.04)');
  ctx.fillStyle=glow; rr(711,381,154,94,4); ctx.fill();
  ctx.fillStyle='rgba(233,237,245,.20)';
  for(let i=0;i<5;i++) ctx.fillRect(720, 394+i*15, 60+Math.random()*70, 5);
  // laptop base
  ctx.fillStyle='#c2c6cc'; rr(696,480,184,10,3); ctx.fill();
  // external keyboard on the table
  ctx.fillStyle='#e2e0da'; rr(452,524,186,30,4); ctx.fill();
  ctx.fillStyle='#c6c3bb';
  for(let r=0;r<3;r++) for(let c=0;c<11;c++) ctx.fillRect(460+c*15.9, 530+r*7.5, 12.5, 5);
  ctx.fillStyle='#e2e0da'; ctx.beginPath(); ctx.ellipse(664,538,15,20,0,0,7); ctx.fill();
  // mug, cold since 9:40
  ctx.fillStyle='#8a5a72'; rr(310,516,40,44,5); ctx.fill();
  ctx.strokeStyle='#8a5a72'; ctx.lineWidth=6;
  ctx.beginPath(); ctx.arc(356,536,12,-1.2,1.2); ctx.stroke();
  ctx.fillStyle='#4a3020'; ctx.beginPath(); ctx.ellipse(330,518,18,5,0,0,7); ctx.fill();
}

function drawDaryl(dt){
  const stress = clamp(1 - S.composure/100, 0, 1) * 0.7 + S.reaction * 0.3;
  const bob = Math.sin(S.t*2.1)*2.5 + (S.onCall>0 ? Math.sin(S.t*9)*1.2 : 0);
  const jitter = stress > .55 ? (Math.random()-.5)*stress*2.2 : 0;
  const x = 545, hy = 336 + bob + jitter;

  // a chair from her mother's dining set. his back knows.
  ctx.fillStyle='#5a3f2c';
  rr(x-92, 398, 184, 26, 9); ctx.fill();           // top rail
  rr(x-92, 470, 184, 15, 5); ctx.fill();           // mid rail
  rr(x-92, 412, 16, 210, 5); ctx.fill();           // left stile
  rr(x+76, 412, 16, 210, 5); ctx.fill();           // right stile
  ctx.fillStyle='#6d4d36';
  for(let i=0;i<5;i++){ rr(x-58 + i*27, 424, 9, 48, 4); ctx.fill(); }
  ctx.fillStyle='#4a3223'; rr(x-104, 596, 208, 20, 5); ctx.fill();

  // torso
  ctx.fillStyle = SHIRT;
  ctx.beginPath();
  ctx.moveTo(x-92, DESK_EDGE); ctx.lineTo(x-74, 434);
  ctx.quadraticCurveTo(x, 396, x+74, 434);
  ctx.lineTo(x+92, DESK_EDGE); ctx.closePath(); ctx.fill();
  ctx.fillStyle = SHIRT_D;
  ctx.beginPath(); ctx.moveTo(x-20,414); ctx.lineTo(x,446); ctx.lineTo(x+20,414);
  ctx.quadraticCurveTo(x,404,x-20,414); ctx.fill();
  ctx.fillStyle='#2b4a73';
  ctx.beginPath(); ctx.arc(x, 452, 3.2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(x, 486, 3.2, 0, 7); ctx.fill();

  // neck
  ctx.fillStyle = SKIN_D; rr(x-19, hy+44, 38, 42, 10); ctx.fill();

  // head, bald
  ctx.fillStyle = SKIN;
  ctx.beginPath(); ctx.ellipse(x, hy, 53, 61, 0, 0, 7); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.14)';
  ctx.beginPath(); ctx.ellipse(x-18, hy-30, 20, 13, -0.5, 0, 7); ctx.fill();
  ctx.fillStyle = SKIN_D;
  ctx.beginPath(); ctx.ellipse(x-54, hy+8, 8, 13, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+54, hy+8, 8, 13, 0, 0, 7); ctx.fill();

  // stubble beard
  ctx.save();
  ctx.beginPath(); ctx.ellipse(x, hy, 52, 60, 0, 0, 7); ctx.clip();
  ctx.fillStyle='rgba(74,58,46,.42)';
  ctx.beginPath();
  ctx.moveTo(x-52, hy+4);
  ctx.quadraticCurveTo(x-48, hy+58, x, hy+62);
  ctx.quadraticCurveTo(x+48, hy+58, x+52, hy+4);
  ctx.quadraticCurveTo(x+34, hy+28, x, hy+26);
  ctx.quadraticCurveTo(x-34, hy+28, x-52, hy+4);
  ctx.fill();
  ctx.fillStyle='rgba(56,42,32,.5)';
  for(let i=0;i<170;i++){
    const a = Math.random()*Math.PI, rr2 = 30 + Math.random()*26;
    const px = x + Math.cos(a)*rr2*1.5, py = hy + Math.sin(a)*rr2*0.95 + 8;
    if(py > hy+4) ctx.fillRect(px, py, 1.5, 1.5);
  }
  // faint moustache shadow
  ctx.fillStyle='rgba(56,42,32,.34)';
  ctx.beginPath(); ctx.ellipse(x, hy+27, 19, 7, 0, 0, 7); ctx.fill();
  ctx.restore();

  // eyebrows, angle with stress
  const brow = stress*7;
  ctx.strokeStyle='#4a3a2e'; ctx.lineWidth=5; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x-33, hy-19+brow); ctx.lineTo(x-13, hy-24-brow*0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+33, hy-19+brow); ctx.lineTo(x+13, hy-24-brow*0.4); ctx.stroke();

  // eyes widen with stress
  const ew = 8.5 + stress*3, eh = 6.5 + stress*5.5;
  [-22, 22].forEach(off=>{
    ctx.fillStyle='#fbfbfa';
    ctx.beginPath(); ctx.ellipse(x+off, hy-4, ew, eh, 0, 0, 7); ctx.fill();
    ctx.fillStyle='#2d2620';
    const dartX = Math.sin(S.t*1.6 + off)*2.2*stress;
    ctx.beginPath(); ctx.arc(x+off+dartX, hy-3, 3.6, 0, 7); ctx.fill();
  });

  // nose
  ctx.strokeStyle=SKIN_D; ctx.lineWidth=3.5;
  ctx.beginPath(); ctx.moveTo(x, hy-2); ctx.lineTo(x-4, hy+13);
  ctx.quadraticCurveTo(x, hy+17, x+4, hy+13); ctx.stroke();

  // mouth
  ctx.strokeStyle='#7a4a44'; ctx.lineWidth=3.5;
  ctx.beginPath();
  if(S.onCall > 0 || stress > .62){
    const open = 4 + Math.abs(Math.sin(S.t*8))*7;
    ctx.fillStyle='#5e332f';
    ctx.beginPath(); ctx.ellipse(x, hy+34, 12, open, 0, 0, 7); ctx.fill();
  } else if(stress > .3){
    ctx.moveTo(x-14, hy+35); ctx.lineTo(x+14, hy+35); ctx.stroke();
  } else {
    ctx.moveTo(x-13, hy+31); ctx.quadraticCurveTo(x, hy+39, x+13, hy+31); ctx.stroke();
  }

  // headset
  ctx.strokeStyle='#20252e'; ctx.lineWidth=8; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(x, hy-4, 58, Math.PI*1.16, Math.PI*1.84); ctx.stroke();
  ctx.fillStyle='#20252e';
  rr(x-70, hy-8, 18, 30, 7); ctx.fill();
  rr(x+52, hy-8, 18, 30, 7); ctx.fill();
  ctx.strokeStyle='#20252e'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(x-62, hy+20);
  ctx.quadraticCurveTo(x-52, hy+48, x-24, hy+44); ctx.stroke();
  ctx.fillStyle='#3b444f';
  ctx.beginPath(); ctx.ellipse(x-20, hy+44, 7, 5, 0, 0, 7); ctx.fill();

  // sweat
  if(stress > .45){
    ctx.fillStyle='rgba(140,200,245,.85)';
    const n = stress > .75 ? 3 : 2;
    for(let i=0;i<n;i++){
      const dy = ((S.t*46 + i*30) % 60);
      ctx.beginPath();
      ctx.ellipse(x - 46 + i*6, hy - 26 + dy, 3.2, 4.6, 0, 0, 7); ctx.fill();
    }
  }

  // forearms resting on the desk
  ctx.fillStyle = SHIRT;
  rr(x-108, DESK_EDGE-16, 72, 26, 12); ctx.fill();
  rr(x+36,  DESK_EDGE-16, 72, 26, 12); ctx.fill();
  ctx.fillStyle = SKIN;
  ctx.beginPath(); ctx.ellipse(x-108, DESK_EDGE-3, 17, 12, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+108, DESK_EDGE-3, 17, 12, 0, 0, 7); ctx.fill();
}

function drawDog(d, dt){
  const s = d.s;
  const barking = d.bark > 0;
  const shake = barking ? Math.sin(S.t*26)*2.4 : 0;
  const bx = d.x + shake, by = d.y + Math.sin(S.t*2 + d.bob)*1.6;

  ctx.save();
  ctx.translate(bx, by); ctx.scale(s*d.flip, s);

  // shadow
  ctx.fillStyle='rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.ellipse(0, 40, 46, 8, 0, 0, 7); ctx.fill();

  // tail, wags
  ctx.strokeStyle=d.coat; ctx.lineWidth=9; ctx.lineCap='round';
  const wag = Math.sin(S.t*(barking?14:5))*0.5;
  ctx.beginPath(); ctx.moveTo(-38,4);
  ctx.quadraticCurveTo(-58, -6 + wag*16, -60, -26 + wag*10); ctx.stroke();

  // legs
  ctx.fillStyle=d.ear;
  ctx.fillRect(-26,20,10,22); ctx.fillRect(-6,22,10,20);
  ctx.fillRect(16,20,10,22);  ctx.fillRect(32,22,10,20);

  // body
  ctx.fillStyle=d.coat;
  ctx.beginPath(); ctx.ellipse(0,4,42,26,0,0,7); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.12)';
  ctx.beginPath(); ctx.ellipse(-4,-6,30,13,0,0,7); ctx.fill();

  // head
  ctx.fillStyle=d.coat;
  ctx.beginPath(); ctx.ellipse(38,-18,25,23,0,0,7); ctx.fill();
  // snout
  ctx.fillStyle=d.coat;
  const jaw = barking ? 5 + Math.abs(Math.sin(S.t*22))*7 : 0;
  ctx.beginPath(); ctx.ellipse(58,-10,17,11,0,0,7); ctx.fill();
  if(barking){
    ctx.fillStyle='#5c2f36';
    ctx.beginPath(); ctx.ellipse(62,-4+jaw*0.3, 12, jaw*0.8, 0, 0, 7); ctx.fill();
  }
  ctx.fillStyle='#1e1a18';
  ctx.beginPath(); ctx.ellipse(72,-13,6,5,0,0,7); ctx.fill();
  // ear
  ctx.fillStyle=d.ear;
  ctx.beginPath(); ctx.ellipse(28,-26,10,19,0.35,0,7); ctx.fill();
  // eye
  ctx.fillStyle='#1e1a18';
  ctx.beginPath(); ctx.arc(46,-22, barking?4.4:3.4, 0, 7); ctx.fill();

  // collar
  ctx.fillStyle='#c14b52'; ctx.fillRect(22,-8,8,22);
  ctx.restore();

  // bark bubble
  if(barking){
    const need = 3 - d.hits;
    ctx.save();
    ctx.translate(bx + 46*d.flip*s, by - 66);
    ctx.fillStyle='#f4f1ea';
    rr(-46, -30, 92, 42, 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-8,12); ctx.lineTo(6,12); ctx.lineTo(-2,24); ctx.fill();
    ctx.fillStyle='#c14b52'; ctx.font='900 19px Segoe UI, sans-serif'; ctx.textAlign='center';
    ctx.fillText('WOOF!', 0, -10);
    ctx.fillStyle='#8d939e'; ctx.font='800 9px Segoe UI, sans-serif';
    ctx.fillText(need + ' MORE CLICK' + (need>1?'S':''), 0, 4);
    ctx.textAlign='left';
    ctx.restore();
  }

  // name tag
  ctx.fillStyle='rgba(233,237,245,.34)'; ctx.font='800 9px Segoe UI, sans-serif';
  ctx.textAlign='center'; ctx.fillText(d.name, d.x, d.y + 56); ctx.textAlign='left';
}

function drawDeskDog(){
  if(!S.deskDog) return;
  const p = S.deskDog.t / 3.4;
  const d = S.deskDog.dog;
  const x = lerp(DESK_L+40, DESK_R-60, p);
  ctx.save();
  ctx.translate(x, DESK_EDGE - 26);
  ctx.scale(0.62, 0.62);
  ctx.fillStyle=d.coat;
  ctx.beginPath(); ctx.ellipse(0,0,42,24,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(38,-22,25,23,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(58,-14,17,11,0,0,7); ctx.fill();
  ctx.fillStyle=d.ear;
  ctx.beginPath(); ctx.ellipse(28,-30,10,19,0.35,0,7); ctx.fill();
  ctx.fillStyle='#1e1a18';
  ctx.beginPath(); ctx.arc(46,-26,3.6,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(72,-17,6,5,0,0,7); ctx.fill();
  ctx.fillStyle=d.ear;
  ctx.fillRect(-22,18,10,16); ctx.fillRect(14,18,10,16);
  ctx.restore();
  ctx.fillStyle='#f2564f'; ctx.font='900 15px Segoe UI, sans-serif'; ctx.textAlign='center';
  ctx.fillText('aaaaaaaaaaaa', x, DESK_EDGE - 76); ctx.textAlign='left';
}

function drawWife(){
  if(!S.wife) return;
  const p = Math.min(1, S.wife.walk / 0.55);
  const x = lerp(46, 148, p*p*(3-2*p));
  const sway = Math.sin(S.t*2.4)*1.6;

  ctx.save();
  ctx.translate(x, sway);
  // legs
  ctx.fillStyle='#2f3a4c'; ctx.fillRect(-16, 596, 14, 112); ctx.fillRect(6, 596, 14, 112);
  // dress / top
  ctx.fillStyle='#8a5a72';
  ctx.beginPath();
  ctx.moveTo(-34, 604); ctx.lineTo(-26, 452);
  ctx.quadraticCurveTo(2, 428, 30, 452); ctx.lineTo(38, 604); ctx.closePath(); ctx.fill();
  // arms holding a binder
  ctx.fillStyle='#8a5a72';
  rr(-40, 470, 16, 78, 8); ctx.fill();
  rr(28, 470, 16, 78, 8); ctx.fill();
  ctx.fillStyle=SKIN;
  ctx.beginPath(); ctx.arc(-32, 552, 10, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(36, 552, 10, 0, 7); ctx.fill();
  // the binder
  ctx.fillStyle='#e8e6df'; rr(-34, 520, 70, 52, 4); ctx.fill();
  ctx.strokeStyle='#b9b3a6'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#8a5a72'; ctx.font='900 10px Segoe UI, sans-serif'; ctx.textAlign='center';
  ctx.fillText('WEDDING', 1, 543);
  ctx.fillText('BINDER', 1, 556); ctx.textAlign='left';
  // neck + head
  ctx.fillStyle=SKIN_D; rr(-8, 424, 16, 22, 6); ctx.fill();
  ctx.fillStyle=SKIN;
  ctx.beginPath(); ctx.ellipse(0, 400, 34, 39, 0, 0, 7); ctx.fill();
  // hair
  ctx.fillStyle='#5b3b2c';
  ctx.beginPath();
  ctx.moveTo(-34, 400);
  ctx.quadraticCurveTo(-40, 344, 0, 344);
  ctx.quadraticCurveTo(40, 344, 34, 400);
  ctx.quadraticCurveTo(44, 452, 34, 476);
  ctx.lineTo(22, 470);
  ctx.quadraticCurveTo(30, 430, 24, 392);
  ctx.quadraticCurveTo(0, 380, -24, 392);
  ctx.quadraticCurveTo(-30, 430, -22, 470);
  ctx.lineTo(-34, 476);
  ctx.quadraticCurveTo(-44, 452, -34, 400);
  ctx.fill();
  // face
  ctx.fillStyle='#fbfbfa';
  ctx.beginPath(); ctx.ellipse(-13, 396, 7, 6, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(13, 396, 7, 6, 0, 0, 7); ctx.fill();
  ctx.fillStyle='#2d2620';
  ctx.beginPath(); ctx.arc(-13, 397, 3.2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(13, 397, 3.2, 0, 7); ctx.fill();
  ctx.strokeStyle='#4a3a2e'; ctx.lineWidth=3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(-20, 384); ctx.lineTo(-6, 382); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, 384); ctx.lineTo(6, 382); ctx.stroke();
  ctx.strokeStyle='#a4576a'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(-9, 419); ctx.lineTo(9, 419); ctx.stroke();
  ctx.restore();
}

function render(dt){
  ctx.clearRect(0,0,1280,720);
  ctx.save();
  if(S.shake > 0){
    ctx.translate((Math.random()-.5)*S.shake*9, (Math.random()-.5)*S.shake*9);
  }
  drawRoom();
  drawDaryl(dt);
  drawDesk();
  drawMonitor();
  drawDeskDog();
  S.dogs.forEach(d=>drawDog(d, dt));
  drawWife();
  ctx.restore();
}

/* ===================== input ===================== */
cv.addEventListener('pointerdown', e=>{
  if(S.phase !== 'play') return;
  const r = cv.getBoundingClientRect();
  const mx = (e.clientX - r.left) / r.width * 1280;
  const my = (e.clientY - r.top) / r.height * 720;
  for(const d of S.dogs){
    if(d.bark <= 0) continue;
    const w = 92*d.s, h = 78*d.s;
    if(mx > d.x - w && mx < d.x + w && my > d.y - h && my < d.y + h*0.9){ hitDog(d); return; }
  }
});

$('#mute').addEventListener('click', ()=>{
  Snd.on = !Snd.on;
  $('#mute').textContent = Snd.on ? 'SOUND ON' : 'SOUND OFF';
});

/* ===================== loop ===================== */
// simulation only, no drawing, so it can be driven at any speed
function step(dt){
  if(S.phase !== 'play') return;

  S.t += dt;
  const p = progress();
  S.reaction = Math.max(0, S.reaction - dt*1.4);
  S.shake = Math.max(0, S.shake - dt*3);

  // ---- work cards
  S.nextCard -= dt;
  if(S.nextCard <= 0 && S.cards.length < MAX_CARDS){
    spawnCard();
    S.nextCard = lerp(8.4, 4.2, p) * (0.72 + Math.random()*0.6);
  }
  for(const c of S.cards.slice()){
    c.life -= dt;
    if(c.bar) c.bar.style.width = clamp(c.life/c.max,0,1)*100 + '%';
    if(c.life <= 0) expireCard(c);
  }
  elWork.style.pointerEvents = S.onCall > 0 ? 'none' : 'auto';
  elWork.style.opacity = S.onCall > 0 ? '.45' : '1';

  // ---- personal phone
  if(S.onCall > 0){
    S.onCall -= dt;
    const b = S.phoneBar;
    if(b) b.style.width = clamp(S.onCall/T.callHoldSeconds,0,1)*100 + '%';
    if(S.onCall <= 0) elPhone.className = 'hidden';
  } else if(S.call){
    S.call.life -= dt;
    const b = S.phoneBar;
    if(b) b.style.width = clamp(S.call.life/S.call.max,0,1)*100 + '%';
    if(S.call.life % 1.6 < dt) Snd.ring();
    if(S.call.life <= 0) ringOut();
  } else {
    S.nextCall -= dt;
    if(S.nextCall <= 0){
      startRing();
      S.nextCall = lerp(17, 11, p) * (0.8 + Math.random()*0.5) + T.ringSeconds;
    }
  }

  // ---- fiancee
  if(S.wife){
    S.wife.walk += dt;
    S.wife.life -= dt;
    const b = S.wifeBar;
    if(b) b.style.width = clamp(S.wife.life/S.wife.max,0,1)*100 + '%';
    if(S.wife.life <= 0) wifeTimeout();
  } else {
    S.nextWife -= dt;
    if(S.nextWife <= 0){
      startWife();
      S.nextWife = lerp(23, 17, p) * (0.82 + Math.random()*0.45) + T.wifeSeconds;
    }
  }

  // ---- dogs
  let barking = 0;
  for(const d of S.dogs){
    if(d.bark > 0){
      d.bark -= dt; barking++;
      if(Math.random() < dt*1.6) Snd.bark();
      if(d.bark <= 0) d.hits = 0;
    }
  }
  if(barking === 0){
    S.nextBark -= dt;
    if(S.nextBark <= 0){
      startBark();
      S.nextBark = lerp(13, 8.5, p) * (0.75 + Math.random()*0.6);
    }
  }
  S.nextWalk -= dt;
  if(S.nextWalk <= 0){ dogOnKeyboard(); S.nextWalk = lerp(58, 42, p) * (0.8+Math.random()*0.5); }
  if(S.deskDog){
    S.deskDog.t += dt;
    if(S.deskDog.t > 3.4) S.deskDog = null;
  }

  // ---- the house itself, chiming in
  S.nextAmbient -= dt;
  if(S.nextAmbient <= 0){
    const pool = AMBIENT.filter(a => !S.usedAmbient || !S.usedAmbient.includes(a));
    const line = rnd(pool.length ? pool : AMBIENT);
    (S.usedAmbient = S.usedAmbient || []).push(line);
    toast('', line);
    S.nextAmbient = 20 * (0.8 + Math.random()*0.6);
  }

  // ---- meters drift
  const barkMult = S.cards.length > 0 ? 1.45 : 1;
  S.composure += barking ? T.compBarkPerSec * barking * barkMult * dt : T.compRegen * dt;
  S.anxiety   += T.anxPerSec * dt;

  S.deal      = clamp(S.deal, 0, 100);
  S.anxiety   = clamp(S.anxiety, 0, 100);
  S.harmony   = clamp(S.harmony, 0, 100);
  S.composure = clamp(S.composure, 0, 100);
  paintMeters();

  // ---- endings
  if(S.anxiety   >= 100) return finish('anxiety');
  if(S.harmony   <= 0)   return finish('harmony');
  if(S.composure <= 0)   return finish('composure');
  if(S.t >= DAY_SECONDS) return finish(S.deal >= 100 ? 'win' : 'deal');
}

function tick(now){
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - S.last)/1000 || 0);
  S.last = now;
  step(dt);
  render(dt);
}

/* ===================== endings ===================== */
const ENDINGS = {
  anxiety: {t:'THE HOUSE FELL THROUGH', c:'#f2564f',
    s:'The lender needed one document. It was in a voicemail you never played. Somebody else is buying the house with the good kitchen.'},
  harmony: {t:'SHE CALLED HER MOTHER', c:'#e8749b',
    s:'Not to vent. To reschedule. The venue keeps the deposit either way.'},
  composure:{t:'DARYL.EXE HAS STOPPED RESPONDING', c:'#5aa9f0',
    s:'You are still at the desk. The headset is still on. Nothing is going in or out.'},
  deal:    {t:'SLIPPED TO NEXT QUARTER', c:'#f0913c',
    s:'You survived the day. The deal did not. Your manager typed "any color on this?" and then went home.'},
};

const endTimers = [];
function later(fn, ms){ endTimers.push(setTimeout(fn, ms)); }

function reset(){
  endTimers.splice(0).forEach(clearTimeout);
  Object.assign(S, {
    phase:'title', t:0, deal:0, anxiety:0, harmony:100, composure:100,
    cards:[], nextCard:2.0, call:null, nextCall:9, wife:null, nextWife:16,
    nextBark:11, nextWalk:46, nextAmbient:7, onCall:0, deskDog:null,
    shake:0, reaction:0, outcome:null, usedAmbient:[],
    stats:{handled:0, missed:0, answered:0, ignored:0, hushed:0, blunders:0, michael:0},
  });
  WIFE.forEach(w => { delete w.used; });
  makeDogs();
  elWork.innerHTML = '';
  elPhone.className = 'hidden';
  elWife.className = 'hidden';
  elEnd.className = 'screen hidden';
  const cs = document.getElementById('cutscene'); if(cs) cs.remove();
}

function finish(kind){
  if(S.phase === 'over') return;
  S.phase = 'over';
  S.outcome = kind;
  endWife();
  elPhone.className = 'hidden';
  S.cards.slice().forEach(c=>{ c.el.remove(); });
  S.cards = [];

  const st = S.stats;
  const statLine = `HANDLED ${st.handled} &middot; DROPPED ${st.missed} &middot; CALLS ANSWERED ${st.answered}
    &middot; IGNORED ${st.ignored}<br>DOGS SILENCED ${st.hushed} &middot; THINGS YOU SHOULD NOT HAVE SAID ${st.blunders}
    &middot; TIMES ${CONFIG.helper} SAVED YOU ${st.michael}`;

  const el = elEnd;
  el.className = 'screen';

  if(kind === 'win'){
    el.innerHTML = `<div class="etitle" style="color:var(--deal)">MISSION COMPLETE</div>
      <div id="endline">
        <div>${CONFIG.hero} GOT MARRIED</div>
        <div>${CONFIG.hero} BOUGHT A HOUSE</div>
        <div>${CONFIG.hero} CLOSED ${CONFIG.arr} IN ARR</div>
      </div>
      <div id="stats">${statLine}</div>`;
    Snd.good();
    const lines = $$('#endline div');
    lines.forEach((l,i)=> later(()=>{
      l.classList.add('show');
      Snd.tone(520 + i*160, .22, 'triangle', .06);
    }, 700 + i*900));
    later(cutscene, 700 + lines.length*900 + 1700);
  } else {
    const e = ENDINGS[kind];
    el.innerHTML = `<div class="etitle" style="color:${e.c}">${e.t}</div>
      <div class="esub">${e.s}</div>
      <div id="stats">${statLine}</div>
      <button class="bigbtn alt" onclick="location.reload()">TRY MONDAY AGAIN</button>`;
    Snd.ouch();
  }
}

function cutscene(){
  const cs = document.createElement('div');
  cs.id = 'cutscene';
  cs.innerHTML = `<div id="notif">
      <div class="hdr">TEAMS &middot; NOW</div>
      <div class="from">${CONFIG.helper}</div>
      <div class="msg">Hey man, quick question.</div>
    </div>
    <div id="fade"></div>
    <button class="bigbtn alt" id="replay">TRY MONDAY AGAIN</button>`;
  $('#stage').appendChild(cs);
  Snd.ding();
  later(()=>{ cs.querySelector('#fade').style.opacity = '1'; }, 2300);
  later(()=>{
    const r = cs.querySelector('#replay');
    r.style.opacity = '1';
    r.addEventListener('click', ()=>location.reload());
  }, 4600);
}

/* ===================== boot ===================== */
const elStage = $('#stage');
function scale(){
  const k = Math.min(window.innerWidth/1280, window.innerHeight/720);
  elStage.style.transform = `translate(-50%, -50%) scale(${k})`;
}
window.addEventListener('resize', scale);
scale();

$('#startBtn').addEventListener('click', ()=>{
  Snd.boot();
  if(Snd.ac && Snd.ac.state === 'suspended') Snd.ac.resume();
  $('#title').className = 'screen hidden';
  makeDogs();
  S.phase = 'play';
  S.last = performance.now();
  paintMeters();
});

makeDogs();
paintMeters();
requestAnimationFrame(tick);

/* debug harness. window.daryl.sim(0.85) plays a whole day headlessly. */
window.daryl = {
  get state(){ return S; },
  set(k,v){ S[k] = v; paintMeters(); },
  skipTo(p){ S.t = DAY_SECONDS * p; },
  win(){ S.deal = 100; S.t = DAY_SECONDS; },
  step, reset, cutscene, CONFIG, T,

  /* Headless playtest. Models a person, not a script: every item gets a
     reaction delay, some are never noticed at all, and only one thing can
     be clicked at a time. skill 0..1 spans flailing to unusually sharp. */
  sim(skill = 0.7, dt = 1/30){
    reset();
    S.phase = 'play';
    const expo = mean => -Math.log(1 - Math.random()*0.999) * mean;
    const newPlan = () => ({
      r: 0.5 + expo(1.0 + (1-skill)*4.2),
      skip: Math.random() < (1-skill)*0.5,
    });
    let cd = 0, guard = 0, peakAnx = 0, lowHarm = 100, lowComp = 100;

    while(S.phase === 'play' && guard++ < 40000){
      step(dt);
      cd -= dt;
      if(S.anxiety > peakAnx) peakAnx = S.anxiety;
      if(S.harmony < lowHarm) lowHarm = S.harmony;
      if(S.composure < lowComp) lowComp = S.composure;

      const ready = [];
      const consider = (obj, life, fire) => {
        if(!obj._plan) obj._plan = newPlan();
        if(obj._plan.skip) return;
        obj._plan.r -= dt;
        if(obj._plan.r <= 0) ready.push({life, fire});
      };

      for(const c of S.cards) if(!c.done) consider(c, c.life, ()=> resolveCard(c, c.opts ? 0 : -1));
      if(S.call) consider(S.call, S.call.life, answerCall);
      if(S.wife) consider(S.wife, S.wife.life, ()=>{
        let best = 0;
        S.wife.opts.forEach((o,i)=>{ if(o[1] > S.wife.opts[best][1]) best = i; });
        const right = Math.random() < 0.5 + skill*0.5;
        answerWife(right ? best : Math.floor(Math.random()*S.wife.opts.length));
      });
      for(const d of S.dogs){
        if(d.bark <= 0){ d._plan = null; continue; }
        consider(d, d.bark, ()=> hitDog(d));
      }

      if(cd <= 0 && ready.length){
        ready.sort((a,b)=> a.life - b.life);   // whatever is about to expire
        ready[0].fire();
        cd = 0.30 + (1-skill)*0.35;            // one pair of hands
      }
    }
    const out = {outcome:S.outcome, min:Math.round(S.t), deal:Math.round(S.deal),
      peakAnx:Math.round(peakAnx), lowHarm:Math.round(lowHarm), lowComp:Math.round(lowComp),
      stats:Object.assign({}, S.stats)};
    reset();
    return out;
  },

  // run sim() many times and report how often each ending fires
  bench(skill = 0.7, runs = 40){
    const tally = {}; const avg = {deal:0, peakAnx:0, lowHarm:0, lowComp:0};
    for(let i=0;i<runs;i++){
      const r = this.sim(skill);
      tally[r.outcome] = (tally[r.outcome]||0) + 1;
      for(const k in avg) avg[k] += r[k];
    }
    for(const k in avg) avg[k] = Math.round(avg[k]/runs);
    return {skill, runs, avg, tally};
  },
};
