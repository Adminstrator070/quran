import {search} from '../api.js';import {icon,toAr,esc,plain,empty,skel} from '../ui.js';import {sname} from '../names.js';
export default async function(el){
 el.innerHTML=`<label class="field">${icon('search',20)}<input id="q" type="search" placeholder="اكتب كلمة أو جزءًا من آية" autocomplete="off" enterkeyhint="search"></label><div id="r">${empty('search','ابحث في نص القرآن','اكتب كلمة ثم اضغط بحث')}</div>`;
 const r=el.querySelector('#r'),inp=el.querySelector('#q');let tm,seq=0;
 const run=async()=>{const q=plain(inp.value.trim());if(q.length<2){r.innerHTML=empty('search','ابحث في نص القرآن','اكتب كلمتين على الأقل');return}
  const my=++seq;r.innerHTML=skel(3);
  try{const d=await search(q);if(my!==seq)return;
   if(!d.count){r.innerHTML=empty('search','لا توجد نتائج','جرّب كلمة أخرى');return}
   const hl=s=>esc(s).split(esc(q)).join(`<mark>${esc(q)}</mark>`);
   r.innerHTML=`<div class="sub" style="margin:0 2px 8px">${toAr(d.count)} نتيجة${d.count>60?' (أول ٦٠)':''}</div>`+d.matches.slice(0,60).map(m=>`<a class="card lite tap" style="display:block" href="#/read/${m.surah.number}/${m.numberInSurah}"><div class="sub">سورة ${sname(m.surah.number)} • آية ${toAr(m.numberInSurah)}</div><div class="quran" style="--fs:21px;--lh:2">${hl(m.text)}</div></a>`).join('')}
  catch{if(my===seq)r.innerHTML=empty('alert','تعذر البحث','البحث يحتاج اتصالًا بالإنترنت')}};
 inp.oninput=()=>{clearTimeout(tm);tm=setTimeout(run,450)};inp.onkeydown=e=>{if(e.key==='Enter'){clearTimeout(tm);run()}};
 el._off=()=>clearTimeout(tm);inp.focus();
}
