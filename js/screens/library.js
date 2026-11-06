import {surahs} from '../api.js';import {P} from '../player.js';import {icon,toAr,plain,toast} from '../ui.js';import {sname} from '../names.js';
const JUZ=[[1,1],[2,142],[2,253],[3,93],[4,24],[4,148],[5,82],[6,111],[7,88],[8,41],[9,93],[11,6],[12,53],[15,1],[17,1],[18,75],[21,1],[23,1],[25,21],[27,56],[29,46],[33,31],[36,28],[39,32],[41,47],[46,1],[51,31],[58,1],[67,1],[78,1]];
let tab='s';
export default async function(el){
 const l=await surahs();
 el.innerHTML=`<div class="chips"><a class="chip" href="#/search">${icon('search',16)} بحث في القرآن</a><a class="chip" href="#/tafsir">${icon('note',16)} التفسير</a><a class="chip" href="#/bookmarks">${icon('bookmark',16)} المحفوظات</a></div>
 <div class="seg"><button data-t="s">السور</button><button data-t="j">الأجزاء</button></div>
 <label class="field" id="fd">${icon('search',20)}<input id="q" type="search" placeholder="ابحث باسم السورة أو رقمها" autocomplete="off"></label><div id="l" class="card list"></div>`;
 const draw=()=>{
  el.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  el.querySelector('#fd').style.display=tab==='s'?'flex':'none';
  const q=el.querySelector('#q').value.trim(),pq=plain(q).toLowerCase();
  el.querySelector('#l').innerHTML=tab==='s'
   ?l.filter(s=>!q||plain(s.name).includes(pq)||s.englishName.toLowerCase().includes(pq)||String(s.number)===q).map(s=>
    `<div class="item" data-n="${s.number}"><div class="num">${toAr(s.number)}</div><div class="grow"><b>${sname(s.number)}</b><div class="sub">${s.revelationType==='Meccan'?'مكية':'مدنية'} • ${toAr(s.numberOfAyahs)} آية</div></div><button class="iconbtn" data-p="${s.number}" aria-label="تشغيل">${icon('play',18)}</button></div>`).join('')||'<div class="empty">لا توجد نتائج</div>'
   :JUZ.map(([n,a],i)=>`<a class="item" href="#/read/${n}/${a}"><div class="num">${toAr(i+1)}</div><div class="grow"><b>الجزء ${toAr(i+1)}</b><div class="sub">من سورة ${sname(n)} • آية ${toAr(a)}</div></div>${icon('chevL',18)}</a>`).join('')};
 draw();
 el.onclick=async e=>{
  const t=e.target.closest('[data-t]'),p=e.target.closest('[data-p]'),c=e.target.closest('[data-n]');
  if(t){tab=t.dataset.t;draw()}
  else if(p){const n=+p.dataset.p;await P.play(n);toast(P.err||'جارٍ تشغيل سورة '+sname(n))}
  else if(c)location.hash='#/read/'+c.dataset.n};
 el.oninput=draw;
}
