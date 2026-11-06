import {S} from '../state.js';import {icon,toAr} from '../ui.js';
// Hijri date comes from the browser's Umm al-Qura calendar (works offline). The real start depends on moon sighting (±1 day).
const F=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric'});
const hj=d=>{const o={};F.formatToParts(d).forEach(x=>o[x.type]=x.value);return {d:+o.day,m:+o.month}};
const HAB=[['sawm','الصيام'],['fajr','صلاة الفجر في وقتها'],['taraweeh','التراويح'],['quran','ورد القرآن'],['adhkar','الأذكار'],['sadaqa','الصدقة']];
const mins=x=>{const [a,b]=x.slice(0,5).split(':');return +a*60+ +b};
let rt;
export default async function render(el){
 clearInterval(rt);
 const now=new Date(),day=`${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`,dk=now.toLocaleDateString('en-CA');
 let h;try{h=hj(now)}catch{el.innerHTML='<p class="muted">المتصفح لا يدعم التقويم الهجري</p>';return}
 let hero;
 if(h.m===9)hero=`<h2 style="margin:0">رمضان • اليوم ${toAr(h.d)}</h2><div class="sub">تقبّل الله منا ومنكم</div>`;
 else{let n=0;for(let i=1;i<400&&!n;i++){const x=hj(new Date(+now+i*864e5));if(x.m===9&&x.d===1)n=i}
  hero=`<h2 style="margin:0">${toAr(n)} يومًا على رمضان</h2><div class="sub">التقدير تقريبي (±١ يوم) حسب رؤية الهلال</div>`}
 const pc=S.get('pcache',null),T=pc?.t,stale=pc&&JSON.parse(pc.key)[2]!==day;
 const kh=S.get('khatma',[]),hb=S.get('habits',{}),today=hb[dk]||[];
 el.innerHTML=`<div class="hero">${hero}</div>
 <div class="card tc">${T?`<div class="row" style="justify-content:space-around"><div><div class="sub">الإمساك (الفجر)</div><b style="font-size:22px">${toAr(T.Fajr.slice(0,5))}</b></div><div><div class="sub">الإفطار (المغرب)</div><b style="font-size:22px">${toAr(T.Maghrib.slice(0,5))}</b></div></div><div class="sub" id="cd" style="margin-top:8px"></div>${stale?'<div class="sub">هذه مواقيت محفوظة قديمة، حدّثها من شاشة الصلاة</div>':''}`:'<a class="btn tonal" href="#/prayer">حدّد موقعك لعرض الإمساك والإفطار</a>'}</div>
 <div class="sec"><h3>ختمة القرآن</h3><span class="sub">${toAr(kh.length)} من ${toAr(30)}</span></div>
 <div class="card"><div class="pb"><i style="width:${kh.length/30*100}%"></i></div>${h.m===9?`<p class="sub" style="margin:8px 0">هدف اليوم: الجزء ${toAr(Math.min(h.d,30))}</p>`:''}
 <div class="grid" style="margin-top:10px">${Array.from({length:30},(_,i)=>`<button data-j="${i+1}" class="${kh.includes(i+1)?'on':''}">${toAr(i+1)}</button>`).join('')}</div></div>
 <div class="sec"><h3>عبادات اليوم</h3></div><div class="card">${HAB.map(([k,a])=>`<label class="opt"><span>${a}</span><input type="checkbox" data-h="${k}" ${today.includes(k)?'checked':''}></label>`).join('')}</div>`;
 el.onclick=e=>{const b=e.target.closest('[data-j]');if(!b)return;const j=+b.dataset.j,k=S.get('khatma',[]),i=k.indexOf(j);i<0?k.push(j):k.splice(i,1);S.set('khatma',k);const y=el.scrollTop;render(el)};
 el.onchange=e=>{const k=e.target.dataset?.h;if(!k)return;const o=S.get('habits',{}),a=o[dk]||[],i=a.indexOf(k);i<0?a.push(k):a.splice(i,1);o[dk]=a;S.set('habits',o)};
 if(T){const tick=()=>{const c=el.querySelector('#cd');if(!c){clearInterval(rt);return}const l=mins(T.Maghrib)-(new Date().getHours()*60+new Date().getMinutes());c.textContent=l>0?`باقي على الإفطار ${toAr(Math.floor(l/60))} س ${toAr(l%60)} د`:'انتهى وقت الإفطار لهذا اليوم'};tick();rt=setInterval(tick,30000)}
}
