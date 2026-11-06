import {icon,tiles,sect} from '../ui.js';import {nextPrayer} from '../prayerutil.js';
const e=encodeURIComponent,dk=(id,t)=>`#/dhikr/${id}/${e(t)}`;
let tk;
export default async function(el){
 clearInterval(tk);
 el.innerHTML=`<a class="hero nextp-card" href="#/prayer" style="display:block"><div class="sub">الصلاة</div><div id="wn"></div></a>
 ${sect('الصلاة','clock',tiles([['#/prayer','clock','مواقيت الصلاة'],['#/qibla','compass','اتجاه القبلة'],['#/ramadan','moon','رمضان']],3))}
 ${sect('الأذكار اليومية','sun',tiles([[dk('27','الصباح والمساء'),'sun','الصباح والمساء'],[dk('25','بعد الصلاة'),'check','بعد الصلاة'],[dk('28','النوم'),'moon','النوم'],[dk('1','الاستيقاظ'),'sun','الاستيقاظ']],4),['#/azkar','كل الأذكار'])}
 ${sect('الأدعية','heart',tiles([['#/duas','heart','أدعية من القرآن'],[dk('34-35','الكرب والهمّ'),'heart','الكرب والهمّ'],[dk('129-130','الاستغفار'),'repeat','الاستغفار'],[dk('96-105','السفر'),'compass','السفر'],[dk('69-76','الطعام والشراب'),'book','الطعام والشراب'],[dk('38,39,45,48,88,128','الحماية'),'info','الحماية']],3))}
 ${sect('أدوات','beads',tiles([['#/tasbih','beads','المسبحة'],['#/bookmarks','bookmark','المفضّلة'],['#/azkar','list','أبواب الأذكار']],3))}`;
 const tick=()=>{const b=el.querySelector('#wn');if(!b){clearInterval(tk);return}const np=nextPrayer();
  b.innerHTML=np?`<div style="font-size:26px;font-weight:700">${np.name} • ${np.time}</div><div class="sub">${np.text}</div>`:`<b>حدّد موقعك لعرض مواقيت الصلاة</b>`};
 tick();tk=setInterval(tick,30000);
}
