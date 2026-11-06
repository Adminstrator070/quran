import {cfg} from '../state.js';import {save,remove,done,usage,text,adhkar} from '../offline.js';import {TAFSIRS} from '../api.js';import {icon,toAr,toast,empty,esc} from '../ui.js';import {sname,NAMES} from '../names.js';
export default async function(el){
 const m=cfg().moshaf;let halt=false,busy=false;
 el.innerHTML=`<div class="card row"><div class="grow"><b>المساحة المستخدمة</b><div class="sub">للنصوص والتلاوات المحمّلة</div></div><b id="us">…</b></div>
 <div class="sec"><h3>النص والتفسير</h3></div><div class="card"><p class="sub" style="margin-bottom:10px">حمّل نص القرآن (بتلوين التجويد والترجمة) والتفسير لاستخدامهما بدون إنترنت.</p>
 <button class="btn tonal block" id="dq">${icon('download',18)} تحميل نص القرآن كاملًا</button>
 <select class="sel" id="ts">${Object.entries(TAFSIRS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
 <button class="btn tonal block" id="dt">${icon('download',18)} تحميل التفسير المختار</button><button class="btn tonal block" id="da">${icon('download',18)} تحميل الأذكار والأدعية</button><div class="pb" id="pg" hidden><i></i></div><div class="sub tc" id="st"></div></div>
 <div class="sec"><h3>التلاوات</h3></div><div id="au"></div>`;
 const $=s=>el.querySelector(s),us=()=>usage().then(x=>{const u=$('#us');if(u)u.textContent=toAr(x)+' م.ب'});us();
 const prog=(i,t)=>{$('#pg').hidden=false;$('#pg i').style.width=i/t*100+'%';$('#st').textContent=`${toAr(i)} من ${toAr(t)}`};
 el._off=()=>{halt=true};
 const text_=async tf=>{if(busy)return;busy=true;try{const r=await text(i=>prog(i,114),tf);toast(r.fail?`تعذّر تحميل ${toAr(r.fail)} سورة`:r.bad?`تم التحميل، لكن ${toAr(r.bad)} سورة غير مطابقة في عدد الآيات`:tf?'تم تحميل التفسير':`تم التحميل والتحقق من ${toAr(r.total)} آية`)}catch{toast('تعذّر التحميل')}busy=false;us()};
 const adk=async()=>{if(busy)return;busy=true;try{const r=await adhkar(prog);toast(r.fail?`تعذّر تحميل ${toAr(r.fail)} باب`:'تم تحميل الأذكار والأدعية')}catch{toast('تعذّر التحميل، تحقّق من الاتصال')}busy=false;us()};
 let d=new Set();
 const au=$('#au');
 const drawAudio=()=>{
  if(!m){au.innerHTML=empty('headphones','لم تختر قارئًا بعد','اختر قارئًا من شاشة الاستماع لتحميل تلاواته')+'<a class="btn block" href="#/audio">اختيار القارئ</a>';return}
  au.innerHTML=`<div class="card"><b>${esc(m.reciter)}</b><div class="sub">${esc(m.name)} • ${toAr(d.size)} من ${toAr(m.list.length)} محمّلة</div>
  <div class="row" style="margin-top:10px"><button class="btn tonal sm grow" id="all">تحميل الكل</button><button class="btn ghost sm grow" id="clr">حذف الكل</button></div><div class="pb" style="margin-top:10px" id="pa" hidden><i></i></div><div class="sub tc" id="sa"></div></div>
  <div class="card list">${m.list.map(n=>`<div class="item"><div class="num">${toAr(n)}</div><b class="grow">${sname(n)}</b><button class="iconbtn" data-n="${n}" aria-label="${d.has(n)?'حذف':'تحميل'}">${icon(d.has(n)?'check':'download',20)}</button></div>`).join('')}</div>`};
 if(m)d=await done(m);drawAudio();
 const get=async n=>{try{await save(m,n);d.add(n);return 1}catch{return 0}};
 el.onclick=async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.id==='da')adk();if(b.id==='dq')text_(null);if(b.id==='dt')text_($('#ts').value);
  if(b.dataset.n){const n=+b.dataset.n;if(d.has(n)){await remove(m,n);d.delete(n)}else if(!await get(n))toast('تعذّر التحميل، تحقّق من الاتصال');drawAudio();us()}
  if(b.id==='all'){if(busy)return;busy=true;halt=false;const todo=m.list.filter(n=>!d.has(n));let i=0,f=0;
   for(const n of todo){if(halt)break;const pa=$('#pa');if(pa){pa.hidden=false;pa.firstChild.style.width=(i/todo.length*100)+'%'}const s=$('#sa');if(s)s.textContent=`جارٍ التحميل ${toAr(++i)} من ${toAr(todo.length)}`;if(!await get(n))f++}
   busy=false;if(!halt){drawAudio();us();toast(f?`تعذّر تحميل ${toAr(f)} سورة`:'تم تحميل كل السور')}}
  if(b.id==='clr'){for(const n of [...d])await remove(m,n);d.clear();drawAudio();us()}};
}
