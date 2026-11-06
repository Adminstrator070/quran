import {S,lastRead} from '../state.js';import {icon,toAr,esc,empty} from '../ui.js';import {sname} from '../names.js';
export default async function render(el){
 const fav=S.get('afav',[]),L=lastRead(),bm=S.get('abm',[]),notes=Object.entries(S.get('notes',{})).filter(([,v])=>v&&v.trim());
 el.innerHTML=`${L?`<div class="card lite row tap" data-h="#/read/${L.n}/${L.a}"><div class="num">${toAr(L.n)}</div><div class="grow"><b>آخر موضع قراءة</b><div class="sub">سورة ${sname(L.n)} • آية ${toAr(L.a)}</div></div>${icon('chevL',18)}</div>`:''}
 <div class="sec"><h3>العلامات المرجعية</h3></div>${bm.length?bm.map((b,i)=>`<div class="card lite row tap" data-h="#/read/${b.n}/${b.a}"><div class="num">${toAr(b.a)}</div><div class="grow"><b>سورة ${sname(b.n)}</b><div class="sub">آية ${toAr(b.a)}</div></div><button class="iconbtn" data-rm="${i}" aria-label="حذف">${icon('trash',18)}</button></div>`).join(''):empty('bookmark','لا توجد علامات بعد','اضغط على أي آية أثناء القراءة ثم "إضافة علامة"')}
 <div class="sec"><h3>الأذكار والأدعية المفضلة</h3></div>${fav.length?fav.map((f,i)=>`<div class="card lite"><div class="sub">${esc(f.c||'')}</div><div class="dk-t">${esc(f.t).replace(/\n/g,'<br>')}</div><div class="dk-a"><span class="grow"></span><button class="iconbtn" data-fr="${i}" aria-label="حذف">${icon('trash',18)}</button></div></div>`).join(''):empty('heart','لا توجد مفضّلة','اضغط على القلب في أي ذكر أو دعاء')}
 <div class="sec"><h3>ملاحظاتي</h3></div>${notes.length?notes.map(([k,v])=>{const [n,a]=k.split(':');return `<div class="card lite tap" data-h="#/tafsir/${n}/${a}"><div class="sub">سورة ${sname(+n)} • آية ${toAr(a)}</div><p style="margin-top:4px">${esc(v)}</p></div>`}).join(''):empty('note','لا توجد ملاحظات','اكتب ملاحظاتك تحت أي آية في شاشة التفسير')}`;
 el.onclick=e=>{const r=e.target.closest('[data-rm]'),h=e.target.closest('[data-h]');
  const fr=e.target.closest('[data-fr]');if(fr){const o=S.get('afav',[]);o.splice(+fr.dataset.fr,1);S.set('afav',o);render(el);return}
  if(r){const o=S.get('abm',[]);o.splice(+r.dataset.rm,1);S.set('abm',o);render(el)}else if(h)location.hash=h.dataset.h};
}
