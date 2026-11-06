import {surahs,flat,styleOf,surah,cut} from '../api.js';import {S} from '../state.js';import {P} from '../player.js';import {save} from '../offline.js';import {icon,toAr,esc,toast,empty,sheet} from '../ui.js';import {sname} from '../names.js';
// Hifz: "المصحف المعلّم" (the sheikh recites, the children repeat). Defaults to Minshawi when present in the catalogue.
export default async function render(el,arg){
 el._off?.();P.on.length=0;
 let all=[];try{all=(await flat()).filter(x=>styleOf(x.name)==='muallim')}catch{}
 let m=S.get('hifzm',null);
 if(!m){m=all.find(x=>x.reciter.includes('المنشاوي'))||all[0]||null;if(m)S.set('hifzm',m)}
 if(!m){el.innerHTML=empty('hifz','التحفيظ بالمصحف المعلّم','يحتاج إنترنت أول مرة لتحميل قائمة التلاوات');return}
 const n=+arg||S.get('hifzn',m.list[0]),mem=S.get('hifz',[]);S.set('hifzn',n);
 const $=s=>el.querySelector(s),mine=()=>P.surah===n&&P.m?.id===m.id,go=k=>location.hash='#/hifz/'+k,rate=P.a.defaultPlaybackRate||1;
 el.innerHTML=`<div class="card row"><div class="ava">${icon('hifz',22)}</div><div class="grow"><b>المصحف المعلّم</b><div class="sub">${esc(m.reciter)} — الشيخ يقرأ والأطفال يردّدون</div></div><button class="btn tonal sm" id="ch">تغيير</button></div>
 <select class="sel" id="sr">${m.list.map(k=>`<option value="${k}" ${k===n?'selected':''}>${toAr(k)}. ${sname(k)}</option>`).join('')}</select>
 <div class="card tc"><div class="ctl"><button class="iconbtn" id="pv" aria-label="السابقة">${icon('prev',26)}</button><button class="playbig" id="pl" aria-label="تشغيل"></button><button class="iconbtn" id="nx" aria-label="التالية">${icon('next',26)}</button></div>
 <div class="sub">السرعة</div><div class="chips" style="justify-content:center">${[0.75,1,1.25].map(x=>`<button class="chip ${x===rate?'on':''}" data-sp="${x}">${toAr(x)}×</button>`).join('')}</div>
 <div class="sub">تكرار السورة</div><div class="chips" style="justify-content:center">${[1,3,5,10].map(x=>`<button class="chip ${x===P.times?'on':''}" data-rp="${x}">${toAr(x)}</button>`).join('')}</div><div class="err" id="er"></div>
 <button class="btn ghost sm" id="dl">${icon('download',16)} حفظ للاستخدام بدون إنترنت</button></div>
 <label class="opt card"><span>إخفاء النص لاختبار الحفظ</span><input type="checkbox" id="hd"></label>
 <div class="card"><div class="quran" id="tx" style="--fs:30px;--lh:2.3">…</div></div>
 <button class="btn ${mem.includes(n)?'':'tonal'} block" id="mk">${icon('check',18)} ${mem.includes(n)?'محفوظة ✓ (اضغط للتراجع)':'تم حفظ هذه السورة'}</button>
 <div class="sec"><h3>تقدّمك في الحفظ</h3><span class="sub">${toAr(mem.length)} من ${toAr(114)}</span></div><div class="pb"><i style="width:${mem.length/114*100}%"></i></div>
 <div class="grid" style="margin-top:12px">${m.list.map(k=>`<button data-s="${k}" class="${mem.includes(k)?'on':''}" ${k===n?'style="outline:2px solid var(--gold)"':''}>${toAr(k)}</button>`).join('')}</div>`;
 const u=()=>{$('#pl').innerHTML=icon(mine()&&!P.a.paused?'pause':'play',30);$('#er').textContent=P.err};P.on.push(u);u();
 surah(n).then(([x])=>{$('#tx').innerHTML=x.ayahs.map(a=>`${cut(n,a,a.text)} <span class="end">﴿${toAr(a.numberInSurah)}﴾</span>`).join(' ')}).catch(()=>{$('#tx').textContent='النص يحتاج إنترنت أول مرة'});
 el.onclick=async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.s)go(b.dataset.s);
  if(b.dataset.sp){P.rate(+b.dataset.sp);render(el,n)}if(b.dataset.rp){P.times=+b.dataset.rp;render(el,n)}
  if(b.id==='pl'){if(mine())P.toggle();else{m.__h=1;await P.play(n,m)}}
  if(b.id==='pv'||b.id==='nx'){const k=m.list[m.list.indexOf(n)+(b.id==='nx'?1:-1)];if(k)go(k)}
  if(b.id==='mk'){const o=S.get('hifz',[]),i=o.indexOf(n);i<0?o.push(n):o.splice(i,1);S.set('hifz',o);render(el,n);if(i<0)toast('بارك الله فيك، تم تسجيل الحفظ')}
  if(b.id==='dl'){b.disabled=true;try{await save(m,n);toast('تم الحفظ للاستخدام بدون إنترنت')}catch{toast('تعذّر التحميل')}b.disabled=false}
  if(b.id==='ch'){const sh=sheet(`<div class="shtitle">اختيار التلاوة</div><div class="list">${all.map(x=>`<div class="item" data-i="${x.id}"><div class="ava">${esc(x.reciter.trim()[0])}</div><div class="grow"><b>${esc(x.reciter)}</b><div class="sub">${esc(x.name)}</div></div>${x.id===m.id?icon('check',20):''}</div>`).join('')}</div>`);
   sh.el.onclick=ev=>{const it=ev.target.closest('[data-i]');if(!it)return;S.set('hifzm',all.find(x=>String(x.id)===it.dataset.i));sh.close();render(el)}}};
 el.onchange=e=>{if(e.target.id==='sr')go(e.target.value);if(e.target.id==='hd')$('#tx').style.filter=e.target.checked?'blur(9px)':''};
}
