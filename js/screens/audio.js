import {P} from '../player.js';import {flat,styleOf} from '../api.js';import {cfg,setCfg} from '../state.js';import {icon,toAr,esc,sheet,toast,plain,MARK,empty,skel} from '../ui.js';import {NAMES,sname} from '../names.js';
const tm=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
const STY=[['','الكل'],['murattal','مرتّل'],['mujawwad','مجوّد'],['muallim','المصحف المعلّم'],['other','روايات أخرى']],RATES=[0.75,1,1.25,1.5];
let sty='';
export default async function render(el){
 el._off?.();P.on.length=0;
 let m=cfg().moshaf,all=[];const $=s=>el.querySelector(s);
 el.innerHTML=`<div class="np card"><div class="art">${MARK(84)}</div><div class="np-t" id="nt"></div><div class="sub" id="nr"></div>
 <div class="seek"><input type="range" id="sk" min="0" max="1000" value="0" aria-label="التقدّم"><div class="row between sub"><span id="t1">0:00</span><span id="t2">0:00</span></div></div>
 <div class="ctl"><button class="iconbtn" id="lp" aria-label="تكرار">${icon('repeat',22)}</button><button class="iconbtn" id="pv" aria-label="السابق">${icon('prev',26)}</button><button class="playbig" id="pl" aria-label="تشغيل/إيقاف"></button><button class="iconbtn" id="nx" aria-label="التالي">${icon('next',26)}</button><button class="iconbtn" id="sl" aria-label="مؤقّت النوم">${icon('moon',22)}</button></div>
 <div class="row between"><button class="chip" id="sp"></button><button class="chip" id="pk">${icon('list',16)} اختيار سورة</button></div><div class="err tc" id="er"></div></div>
 <div class="chips"><a class="chip" href="#/hifz">${icon('hifz',16)} التحفيظ</a><a class="chip" href="#/recite">${icon('mic',16)} التلاوة والتصحيح</a><a class="chip" href="#/downloads">${icon('download',16)} التحميلات</a></div>
 <div class="sec"><h3>القرّاء</h3></div>
 <div class="chips">${STY.map(([k,l])=>`<button class="chip" data-s="${k}">${l}</button>`).join('')}</div>
 <label class="field">${icon('search',20)}<input id="q" type="search" placeholder="ابحث عن قارئ" autocomplete="off"></label><div id="rl" class="card list">${skel(3)}</div>`;
 const rate=()=>P.a.defaultPlaybackRate||1;
 const u=()=>{const a=P.a;
  $('#nt').textContent=P.surah?'سورة '+sname(P.surah):'اختر سورة للاستماع';
  $('#nr').textContent=(P.m||m)?esc((P.m||m).reciter)+' — '+(P.m||m).name:'لم يتم اختيار قارئ بعد';
  $('#pl').innerHTML=icon(a.paused?'play':'pause',30);$('#lp').style.color=P.loop?'var(--p)':'';
  $('#sk').value=a.duration?a.currentTime/a.duration*1000:0;$('#t1').textContent=tm(a.currentTime);$('#t2').textContent=tm(a.duration);
  $('#sp').textContent='السرعة '+toAr(rate())+'×';$('#er').textContent=P.err;
  $('#sl').style.color=P.sleepAt?'var(--p)':''};
 P.on.push(u);u();
 const draw=()=>{const q=plain($('#q').value.trim()),f=all.filter(x=>(!sty||styleOf(x.name)===sty)&&(!q||plain(x.reciter).includes(q)));
  el.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===sty));
  $('#rl').innerHTML=(f.slice(0,80).map(x=>`<div class="item" data-i="${x.id}"><div class="ava">${esc(x.reciter.trim()[0]||'')}</div><div class="grow"><b>${esc(x.reciter)}</b><div class="sub">${esc(x.name)} • ${toAr(x.list.length)} سورة</div></div>${m?.id===x.id?icon('check',20):''}</div>`).join('')||empty('search','لا توجد نتائج'))+(f.length>80?`<p class="sub tc">+${toAr(f.length-80)} قارئ آخر، استخدم البحث</p>`:'')};
 flat().then(x=>{all=x;draw()}).catch(()=>{$('#rl').innerHTML=empty('alert','تعذّر تحميل قائمة القرّاء','تحتاج إنترنت أول مرة فقط')});
 el.querySelectorAll('[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s===sty));
 $('#sk').oninput=e=>P.seek(e.target.value/1000);$('#q').oninput=draw;
 el.onclick=async e=>{const id=e.target.closest('button')?.id,r=e.target.closest('[data-i]'),s=e.target.closest('[data-s]');
  if(id==='pl')P.surah?P.toggle():toast('اختر سورة أولًا');
  if(id==='pv')P.step(-1);if(id==='nx')P.step(1);if(id==='lp'){P.loop=!P.loop;u()}
  if(id==='sp'){const i=RATES.indexOf(rate());P.rate(RATES[(i+1)%RATES.length]);u()}
  if(id==='sl'){const sh=sheet(`<div class="shtitle">مؤقّت النوم</div><div class="acts-list">${[15,30,45,60].map(x=>`<button data-m="${x}">${icon('moon',20)} بعد ${toAr(x)} دقيقة</button>`).join('')}<button data-m="0">${icon('close',20)} إلغاء المؤقّت</button></div>`);
   sh.el.onclick=ev=>{const b=ev.target.closest('[data-m]');if(!b)return;P.sleep(+b.dataset.m);toast(+b.dataset.m?`سيتوقف التشغيل بعد ${toAr(b.dataset.m)} دقيقة`:'تم إلغاء المؤقّت');sh.close()}}
  if(id==='pk'){const sh=sheet(`<div class="shtitle">اختيار سورة</div><label class="field">${icon('search',20)}<input id="sq" placeholder="ابحث" autocomplete="off"></label><div class="list" id="sl2"></div>`);
   const dr=()=>{const q=plain(sh.el.querySelector('#sq').value.trim());sh.el.querySelector('#sl2').innerHTML=NAMES.filter(x=>!q||plain(x.name).includes(q)||String(x.number)===q).map(x=>`<div class="item" data-n="${x.number}"><div class="num">${toAr(x.number)}</div><b class="grow">${sname(x.number)}</b></div>`).join('')};
   dr();sh.el.querySelector('#sq').oninput=dr;
   sh.el.onclick=async ev=>{const it=ev.target.closest('[data-n]');if(!it)return;sh.close();await P.play(+it.dataset.n)}}
  if(s){sty=s.dataset.s;draw()}
  if(r){const x=all.find(y=>String(y.id)===r.dataset.i);if(x){m=x;setCfg({moshaf:x});if(P.surah)await P.play(P.surah);draw();u();toast('تم اختيار القارئ')}}};
}
