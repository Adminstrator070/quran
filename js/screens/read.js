import {surah,tj,cut,surahUrl} from '../api.js';import {purge} from '../offline.js';import {S,cfg,setCfg,lastRead} from '../state.js';import {P} from '../player.js';import {icon,toAr,esc,toast,sheet,shareText,scrollToEl} from '../ui.js';import {sname} from '../names.js';
const BIS='بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';
export default async function render(el,arg,arg2){
 el._off?.();P.on.length=0;
 const n=Math.min(114,Math.max(1,+arg||lastRead()?.n||1)),c=cfg();
 const [u,t,en]=await surah(n),bms=S.get('abm',[]);
 const hasBis=cut(n,u.ayahs[0],u.ayahs[0].text)!==u.ayahs[0].text,badCount=u.ayahs.length!==u.numberOfAyahs;
 const body=u.ayahs.map((a,i)=>{const raw=cut(n,a,c.tajweed?t.ayahs[i].text:a.text),k=a.numberInSurah;
  return `<span class="ay${bms.some(b=>b.n===n&&b.a===k)?' bm':''}" id="a${k}" data-a="${k}">${c.tajweed?tj(raw):raw}<span class="end">﴿${toAr(k)}﴾</span></span> ${c.tr?`<div class="tr">${esc(en.ayahs[i].text)}</div>`:''}`}).join('');
 el.innerHTML=`<div class="bar sticky"><button class="iconbtn" data-go="${n-1}" ${n===1?'disabled':''} aria-label="السورة السابقة">${icon('chevR')}</button><div class="grow tc"><b>${sname(n)}</b></div>
 <button class="iconbtn" data-act="play" aria-label="تشغيل">${icon('play',20)}</button><button class="iconbtn" data-act="opt" aria-label="خيارات القراءة">${icon('sliders',20)}</button>
 <button class="iconbtn" data-go="${n+1}" ${n===114?'disabled':''} aria-label="السورة التالية">${icon('chevL')}</button></div>
 ${badCount?`<div class="card" style="border-color:var(--err)"><b>تنبيه: عدد آيات هذه السورة غير مطابق</b><div class="sub">أعد تحميل نص السورة لإصلاح المشكلة.</div><button class="btn sm" data-act="fix" style="margin-top:8px">إعادة تحميل السورة</button></div>`:''}
 <div class="shead"><div class="sub">${u.revelationType==='Meccan'?'مكية':'مدنية'} • ${toAr(u.numberOfAyahs)} آية</div><div class="sname">${sname(n)}</div>${hasBis?`<div class="quran bis" style="--fs:${c.font}px">${BIS}</div>`:''}</div>
 <div class="mushaf"><div class="quran" id="q" style="--fs:${c.font}px;--lh:${c.lh}">${body}</div></div>
 <a class="btn tonal block" style="margin-top:18px" href="#/tafsir/${n}">${icon('note',18)} تفسير السورة</a>`;
 const q=el.querySelector('#q');
 // open at a given ayah, then keep the last-read position up to date while scrolling
 if(arg2){const x=el.querySelector('#a'+arg2);if(x){scrollToEl(x,'center');x.classList.add('flash');S.set('last',{n,a:+arg2})}}
 const vis=new Set();let tm;
 if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>{es.forEach(x=>{const a=+x.target.dataset.a;x.isIntersecting?vis.add(a):vis.delete(a)});clearTimeout(tm);tm=setTimeout(()=>{if(vis.size)S.set('last',{n,a:Math.min(...vis)})},1200)},{root:document.getElementById('view'),rootMargin:'0px 0px -60% 0px'});
  q.querySelectorAll('.ay').forEach(x=>io.observe(x));
  el._off=()=>{io.disconnect();clearTimeout(tm)};
 }
 // approximate follow-along while this surah is playing
 const W=u.ayahs.map(a=>cut(n,a,a.text).split(' ').length);if(hasBis)W[0]+=4;const tot=W.reduce((x,y)=>x+y,0);let last=-1;
 P.on.push(()=>{if(!cfg().follow||P.surah!==n||!P.a.duration)return;let f=P.a.currentTime/P.a.duration*tot,i=0;while(i<W.length-1&&f>=W[i]){f-=W[i];i++}
  if(i!==last){last=i;const s=q.querySelectorAll('.ay');s.forEach((x,k)=>x.classList.toggle('cur',k===i));scrollToEl(s[i],'center',true)}});
 const ayahSheet=a=>{
  const ay=u.ayahs[a-1],text=`${cut(n,ay,ay.text)} ﴿${toAr(a)}﴾\n— سورة ${sname(n)}`,has=S.get('abm',[]).some(b=>b.n===n&&b.a===a),node=q.querySelector('#a'+a);
  node.classList.add('sel');
  const sh=sheet(`<div class="shtitle">سورة ${sname(n)} • آية ${toAr(a)}</div><div class="quran sheetq">${cut(n,ay,ay.text)}</div>
  <div class="acts-list"><button data-x="copy">${icon('copy',20)} نسخ الآية</button><button data-x="share">${icon('share',20)} مشاركة</button>
  <button data-x="bm">${icon('bookmark',20)} ${has?'إزالة العلامة المرجعية':'إضافة علامة مرجعية'}</button><button data-x="pos">${icon('check',20)} حفظ موضع القراءة هنا</button><button data-x="tf">${icon('note',20)} تفسير الآية</button></div>`,()=>node.classList.remove('sel'));
  sh.el.onclick=async e=>{const x=e.target.closest('[data-x]')?.dataset.x;if(!x)return;
   if(x==='copy'){try{await navigator.clipboard.writeText(text);toast('تم النسخ')}catch{toast('تعذر النسخ')}}
   if(x==='share'){await shareText(text)}
   if(x==='bm'){const o=S.get('abm',[]),i=o.findIndex(b=>b.n===n&&b.a===a);i<0?o.push({n,a}):o.splice(i,1);S.set('abm',o);node.classList.toggle('bm',i<0);toast(i<0?'تمت إضافة العلامة':'أُزيلت العلامة')}
   if(x==='pos'){S.set('last',{n,a});toast('تم حفظ موضع القراءة')}
   if(x==='tf')location.hash=`#/tafsir/${n}/${a}`;
   sh.close()};
 };
 const options=()=>{const c=cfg(),sh=sheet(`<div class="shtitle">خيارات القراءة</div>
  <label class="opt"><span>حجم الخط</span><input type="range" id="fs" min="20" max="46" value="${c.font}"></label>
  <label class="opt"><span>تباعد الأسطر</span><input type="range" id="lh" min="1.8" max="3.2" step=".1" value="${c.lh}"></label>
  <label class="opt"><span>تلوين التجويد</span><input type="checkbox" id="tj" ${c.tajweed?'checked':''}></label>
  <label class="opt"><span>الترجمة الإنجليزية</span><input type="checkbox" id="tr" ${c.tr?'checked':''}></label>
  <label class="opt"><span>متابعة الآيات أثناء التلاوة (تقريبية)</span><input type="checkbox" id="fw" ${c.follow?'checked':''}></label>
  <button class="btn ghost block" id="fix2" style="margin-top:8px">إعادة تحميل نص السورة (لإصلاح أي خلل)</button><div class="legend"><span class="t-n">مدّ</span><span class="t-q">قلقلة</span><span class="t-g">غنّة / إخفاء / إدغام</span><span class="t-i">إقلاب</span><span class="t-h">لا يُنطق</span></div>`);
  sh.el.onclick=async e=>{if(e.target.closest('#fix2')){await purge(surahUrl(n));sh.close();toast('جارٍ إعادة التحميل');render(el,n,arg2)}};
  sh.el.oninput=e=>{const v=+e.target.value;if(e.target.id==='fs'){setCfg({font:v});q.style.setProperty('--fs',v+'px')}if(e.target.id==='lh'){setCfg({lh:v});q.style.setProperty('--lh',v)}};
  sh.el.onchange=e=>{const i=e.target.id,k=e.target.checked;
   if(i==='fw'){setCfg({follow:k});if(!k)q.querySelectorAll('.ay.cur').forEach(x=>x.classList.remove('cur'))}
   if(i==='tj'||i==='tr'){setCfg(i==='tj'?{tajweed:k}:{tr:k});sh.close();render(el,n,arg2)}};
 };
 el.onclick=async e=>{const g=e.target.closest('[data-go]'),b=e.target.closest('[data-act]'),a=e.target.closest('.ay');
  if(g){if(!g.disabled)location.hash='#/read/'+g.dataset.go;return}
  if(b?.dataset.act==='play'){await P.play(n);toast(P.err||'جارٍ تشغيل سورة '+sname(n));return}
  if(b?.dataset.act==='opt'){options();return}
  if(b?.dataset.act==='fix'){await purge(surahUrl(n));toast('جارٍ إعادة التحميل');render(el,n,arg2);return}
  if(a)ayahSheet(+a.dataset.a)};
}
