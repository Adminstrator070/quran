import {dhikrCats,dhikrOf,expandIds} from '../api.js';import {S} from '../state.js';import {icon,toAr,esc,toast,shareText} from '../ui.js';
export default async function render(el,arg,arg2){
 const ids=expandIds(arg),label=arg2?decodeURIComponent(arg2):'';
 let cats=[];try{cats=await dhikrCats()}catch{}
 const name=id=>cats.find(c=>String(c.number)===id)?.ar||('باب '+toAr(id));
 const parts=await Promise.all(ids.map(async id=>({id,list:await dhikrOf(id)})));
 document.getElementById('ttl').textContent=label||(ids[0]?name(ids[0]):'الأذكار');
 const day=new Date().toLocaleDateString('en-CA');let dc=S.get('dc',{d:day,c:{}});if(dc.d!==day)dc={d:day,c:{}};
 const favs=()=>S.get('afav',[]),isFav=k=>favs().some(f=>f.k===k);
 const txt=t=>esc(t||'').replace(/\n{2,}/g,'\n').replace(/\n/g,'<br>');
 el.innerHTML=parts.map(({id,list})=>`${parts.length>1?`<div class="sec"><h3>${esc(name(id))}</h3></div>`:''}${list.map(d=>{const k=`${id}:${d.n}`,n=dc.c[k]||0;
  return `<div class="card lite dk${d.r&&n>=d.r?' done':''}" data-k="${k}" data-c="${esc(name(id))}"><div class="dk-t">${txt(d.t)}</div>${d.r?`<div class="sub">التكرار: ${toAr(d.r)}</div>`:''}${d.s?`<div class="sub">${esc(d.s)}</div>`:''}
  <div class="dk-a"><button class="cnt" data-a="c" aria-label="عدّاد">${toAr(n)}${d.r?' / '+toAr(d.r):''}</button><button class="iconbtn" data-a="r" aria-label="تصفير">${icon('repeat',18)}</button><span class="grow"></span>
  <button class="iconbtn ${isFav(k)?'fav-on':''}" data-a="f" aria-label="مفضلة">${icon('heart',20)}</button><button class="iconbtn" data-a="cp" aria-label="نسخ">${icon('copy',20)}</button><button class="iconbtn" data-a="sh" aria-label="مشاركة">${icon('share',20)}</button></div></div>`}).join('')}`).join('')
  ||'<div class="empty">لا توجد أذكار في هذا الباب</div>';
 el.insertAdjacentHTML('beforeend','<p class="src">المصدر: حصن المسلم من أذكار الكتاب والسنة للشيخ سعيد بن علي القحطاني. راجع الكتاب المحقق عند الحاجة.</p>');
 const reqs=new Map();parts.forEach(({id,list})=>list.forEach(d=>reqs.set(`${id}:${d.n}`,d.r)));
 el.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const card=b.closest('.dk'),k=card.dataset.k,t=card.querySelector('.dk-t').textContent.trim(),a=b.dataset.a;
  if(a==='c'){dc.c[k]=(dc.c[k]||0)+1;S.set('dc',dc);const r=reqs.get(k);b.textContent=toAr(dc.c[k])+(r?' / '+toAr(r):'');navigator.vibrate?.(dc.c[k]===r?[40,40,40]:10);card.classList.toggle('done',!!r&&dc.c[k]>=r)}
  if(a==='r'){dc.c[k]=0;S.set('dc',dc);const r=reqs.get(k);card.querySelector('.cnt').textContent=toAr(0)+(r?' / '+toAr(r):'');card.classList.remove('done')}
  if(a==='f'){const o=favs(),i=o.findIndex(f=>f.k===k);i<0?o.push({k,t,c:card.dataset.c}):o.splice(i,1);S.set('afav',o);b.classList.toggle('fav-on',i<0);toast(i<0?'تمت الإضافة إلى المفضلة':'أُزيلت من المفضلة')}
  if(a==='cp'){try{await navigator.clipboard.writeText(t);toast('تم النسخ')}catch{toast('تعذّر النسخ')}}
  if(a==='sh'){await shareText(t)}};
}
