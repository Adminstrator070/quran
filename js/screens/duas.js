import {ayahText} from '../api.js';import {S} from '../state.js';import {icon,toAr,esc,sheet,toast,shareText} from '../ui.js';import {sname} from '../names.js';
// Duas of the Qur'an: exact ayah text is fetched from the Quran data itself. [title, surah, from, to]
const D=[['دعاء الحسنة في الدنيا والآخرة',2,201,201],['دعاء إبراهيم وإسماعيل: قبول العمل',2,127,128],['دعاء الصبر والثبات',2,250,250],['خواتيم سورة البقرة',2,285,286],
['دعاء الثبات على الهداية',3,8,8],['دعاء المغفرة والوقاية من النار',3,16,16],['دعاء الثبات وتجنّب الإسراف',3,147,147],['دعاء أولي الألباب',3,191,194],['دعاء زكريا: الذرية الصالحة',3,38,38],
['دعاء آدم وحواء',7,23,23],['دعاء الصبر وحسن الخاتمة',7,126,126],['دعاء أصحاب موسى: التوكل',10,85,86],['دعاء يوسف',12,101,101],['دعاء إبراهيم: إقامة الصلاة والمغفرة',14,40,41],
['دعاء بر الوالدين',17,24,24],['دعاء أصحاب الكهف',18,10,10],['دعاء موسى: شرح الصدر وتيسير الأمر',20,25,28],['دعاء زيادة العلم',20,114,114],['دعاء أيوب',21,83,83],
['دعاء زكريا',21,89,89],['دعاء يونس',21,87,87],['الاستعاذة من همزات الشياطين',23,97,98],['دعاء المغفرة والرحمة',23,118,118],['الاستعاذة من عذاب جهنم',25,65,66],
['دعاء قرّة العين والذرية',25,74,74],['دعاء موسى: الافتقار إلى الله',28,24,24],['دعاء سليمان: شكر النعمة',27,19,19],['دعاء حملة العرش للمؤمنين',40,7,9],
['دعاء الشكر وبر الوالدين',46,15,15],['دعاء الأخوّة وسلامة الصدر',59,10,10],['دعاء إتمام النور',66,8,8],['دعاء نوح',71,28,28]];
export default async function(el){
 el.innerHTML=`<p class="sub" style="margin:0 2px 10px">أدعية وردت في القرآن الكريم، ويُعرض نص الآيات كما في المصحف.</p><div class="card list">${D.map(([t,s,a,z],i)=>`<button class="item" data-i="${i}"><div class="num">${toAr(i+1)}</div><div class="grow"><b>${t}</b><div class="sub">سورة ${sname(s)} • ${a===z?'آية '+toAr(a):'الآيات '+toAr(a)+'–'+toAr(z)}</div></div>${icon('chevL',18)}</button>`).join('')}</div>`;
 el.onclick=async e=>{const b=e.target.closest('[data-i]');if(!b)return;const [t,s,a,z]=D[+b.dataset.i];
  const sh=sheet(`<div class="shtitle">${t}</div><div class="quran" id="dq" style="--fs:26px;--lh:2.2">…</div><div class="sub tc" style="margin:8px 0">سورة ${sname(s)} • ${a===z?'آية '+toAr(a):'الآيات '+toAr(a)+'–'+toAr(z)}</div>
   <div class="row" style="justify-content:center"><button class="iconbtn" data-x="f" aria-label="مفضلة">${icon('heart',22)}</button><button class="iconbtn" data-x="cp" aria-label="نسخ">${icon('copy',22)}</button><button class="iconbtn" data-x="sh" aria-label="مشاركة">${icon('share',22)}</button></div>`);
  let text='';
  try{const parts=[];for(let k=a;k<=z;k++)parts.push(`${await ayahText(s,k)} ﴿${toAr(k)}﴾`);text=parts.join(' ');sh.el.querySelector('#dq').innerHTML=esc(text)}
  catch{sh.el.querySelector('#dq').textContent='يحتاج إنترنت أول مرة لعرض الآيات'}
  const key=`q:${s}:${a}-${z}`,full=`${text}\n— سورة ${sname(s)}`;
  const fv=sh.el.querySelector('[data-x=f]'),on=()=>S.get('afav',[]).some(f=>f.k===key);fv.classList.toggle('fav-on',on());
  sh.el.onclick=async ev=>{const x=ev.target.closest('[data-x]')?.dataset.x;if(!x||!text)return;
   if(x==='cp'){try{await navigator.clipboard.writeText(full);toast('تم النسخ')}catch{toast('تعذّر النسخ')}}
   if(x==='sh'){await shareText(full)}
   if(x==='f'){const o=S.get('afav',[]),i=o.findIndex(f=>f.k===key);i<0?o.push({k:key,t:full,c:t}):o.splice(i,1);S.set('afav',o);fv.classList.toggle('fav-on',i<0);toast(i<0?'تمت الإضافة إلى المفضلة':'أُزيلت من المفضلة')}}};
}
