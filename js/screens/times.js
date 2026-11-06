import {S} from '../state.js';import {supported,enable,sync} from '../reminders.js';import {icon,toAr,esc,sheet,toast,empty} from '../ui.js';
const N=[['Fajr','الفجر'],['Sunrise','الشروق'],['Dhuhr','الظهر'],['Asr','العصر'],['Maghrib','المغرب'],['Isha','العشاء']];
const M={5:'الهيئة المصرية العامة للمساحة',4:'أم القرى (مكة المكرمة)',3:'رابطة العالم الإسلامي',2:'أمريكا الشمالية (ISNA)',1:'جامعة العلوم الإسلامية بكراتشي'};
const mins=x=>{const [h,m]=x.slice(0,5).split(':');return +h*60+ +m};
const f12=x=>{const [h,m]=x.slice(0,5).split(':').map(Number);return `${toAr(h%12||12)}:${toAr(String(m).padStart(2,'0'))} ${h<12?'ص':'م'}`};
let tk;
async function load(loc,method){
 const d=new Date(),day=`${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`,key=JSON.stringify([loc,method,day]),c=S.get('pcache',null);
 if(c&&c.key===key)return c;
 const q=loc.city?`timingsByCity/${day}?city=${encodeURIComponent(loc.city)}&country=${encodeURIComponent(loc.country)}&method=${method}`:`timings/${day}?latitude=${loc.lat}&longitude=${loc.lon}&method=${method}`;
 try{const r=await fetch('https://api.aladhan.com/v1/'+q);if(!r.ok)throw 0;const j=(await r.json()).data,h=j.date.hijri;
  const o={key,t:j.timings,h:`${toAr(h.day)} ${h.month.ar} ${toAr(h.year)} هـ`};S.set('pcache',o);return o}
 catch{if(c)return {...c,old:1};throw Error('offline')}
}
export default async function render(el){
 clearInterval(tk);
 const loc=S.get('ploc',null),method=S.get('pmethod',5);
 const locSheet=()=>{
  const sh=sheet(`<div class="shtitle">الموقع وطريقة الحساب</div>
  <button class="btn tonal block" id="gps">${icon('compass',18)} استخدام موقعي الحالي</button><div class="sub tc" style="margin:4px 0 8px">أو اكتب مدينتك بالإنجليزية</div>
  <label class="field"><input id="ct" placeholder="المدينة (مثال: Cairo)" dir="ltr"></label><label class="field"><input id="cn" placeholder="الدولة (مثال: Egypt)" dir="ltr"></label>
  <button class="btn block" id="ok">حفظ المدينة</button>
  <div class="sec"><h3>طريقة الحساب</h3></div><select class="sel" id="mt">${Object.entries(M).map(([k,v])=>`<option value="${k}" ${+k===method?'selected':''}>${v}</option>`).join('')}</select>
  <label class="opt"><span>تنبيهات مواعيد الصلاة${supported?'':' (في تطبيق أندرويد)'}</span><input type="checkbox" id="ad" ${S.get('adhan',false)?'checked':''} ${supported?'':'disabled'}></label>`);
  sh.el.onclick=e=>{const b=e.target.closest('button');if(!b)return;
   if(b.id==='gps'){if(!navigator.geolocation){toast('الموقع غير مدعوم');return}b.disabled=true;
    navigator.geolocation.getCurrentPosition(p=>{S.set('ploc',{lat:+p.coords.latitude.toFixed(3),lon:+p.coords.longitude.toFixed(3)});sh.close();sync();render(el)},()=>{b.disabled=false;toast('تعذّر تحديد الموقع، اكتب مدينتك')},{timeout:15000})}
   if(b.id==='ok'){const c=sh.el.querySelector('#ct').value.trim(),k=sh.el.querySelector('#cn').value.trim();if(!c||!k){toast('اكتب المدينة والدولة');return}S.set('ploc',{city:c,country:k});sh.close();sync();render(el)}};
  sh.el.onchange=async e=>{if(e.target.id==='mt'){S.set('pmethod',+e.target.value);sh.close();sync();render(el)}if(e.target.id==='ad'){e.target.checked=await enable(e.target.checked);toast(e.target.checked?'تم تفعيل التنبيهات':'تم إيقاف التنبيهات')}};
 };
 if(!loc){el.innerHTML=empty('clock','حدّد موقعك','لعرض مواقيت الصلاة بدقة')+'<button class="btn block" id="loc">تحديد الموقع</button>';el.onclick=e=>{if(e.target.closest('#loc'))locSheet()};return}
 let r;try{r=await load(loc,method)}catch{el.innerHTML=empty('alert','تعذّر تحميل المواقيت','يحتاج إنترنت أول مرة في كل يوم')+'<button class="btn block" id="rt">إعادة المحاولة</button><button class="btn ghost block" id="loc">تغيير الموقع</button>';el.onclick=e=>{if(e.target.closest('#rt'))render(el);if(e.target.closest('#loc'))locSheet()};return}
 const T=Object.fromEntries(N.map(([k])=>[k,r.t[k].slice(0,5)]));
 el.innerHTML=`<div class="hero"><div class="sub">${esc(loc.city?loc.city+'، '+loc.country:'موقعي الحالي')} • ${r.h}${r.old?' (مواقيت محفوظة)':''}</div><div class="sub" style="margin-top:8px">الصلاة القادمة</div><div style="font-size:30px;font-weight:700" id="nn"></div><div id="nt" style="font-size:15px"></div></div>
 <div class="card">${N.map(([k,a])=>`<div class="pt-row" data-k="${k}"><div class="grow">${a}</div><div>${f12(T[k])}</div></div>`).join('')}</div>
 <button class="btn tonal block" id="set">${icon('sliders',18)} الموقع وطريقة الحساب والتنبيهات</button>
 <a class="btn ghost block" href="#/qibla">${icon('compass',18)} اتجاه القبلة</a><a class="btn ghost block" href="#/azkar">${icon('beads',18)} الأذكار والأدعية</a><a class="btn ghost block" href="#/ramadan">${icon('moon',18)} رمضان</a>`;
 el.onclick=e=>{if(e.target.closest('#set'))locSheet()};
 const tick=()=>{if(!el.querySelector('#nn')){clearInterval(tk);return}
  const d=new Date(),cur=d.getHours()*60+d.getMinutes();let k=['Fajr','Dhuhr','Asr','Maghrib','Isha'].find(x=>mins(T[x])>cur),add=0;if(!k){k='Fajr';add=1440}
  const left=mins(T[k])+add-cur;
  el.querySelector('#nn').textContent=N.find(x=>x[0]===k)[1];el.querySelector('#nt').textContent=`بعد ${toAr(Math.floor(left/60))} ساعة و${toAr(left%60)} دقيقة`;
  el.querySelectorAll('.pt-row').forEach(x=>{x.classList.toggle('next',x.dataset.k===k);x.classList.toggle('past',x.dataset.k!==k&&mins(T[x.dataset.k])<=cur&&add===0)})};
 tick();tk=setInterval(tick,30000);
}
