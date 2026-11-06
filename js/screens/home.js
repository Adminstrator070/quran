import {surah,cut} from '../api.js';import {S,lastRead} from '../state.js';import {display} from '../auth.js';import {icon,toAr,esc,tiles,sect} from '../ui.js';import {sname} from '../names.js';import {nextPrayer} from '../prayerutil.js';
let tk;
export default async function render(el){
 clearInterval(tk);
 const now=new Date();let hij='';try{hij=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{dateStyle:'full'}).format(now)}catch{}
 const L=lastRead(),nm=display(),hf=S.get('hifz',[]).length,kh=S.get('khatma',[]).length;
 el.innerHTML=`<div class="hero"><div class="sub">${hij}</div><h2>السلام عليكم${nm&&nm!=='زائر'?'، '+esc(nm):''}</h2><a href="#/prayer" class="nextp" id="nxt"></a></div>
 ${L?`<a class="card row tap" href="#/read/${L.n}/${L.a}"><div class="num">${toAr(L.n)}</div><div class="grow"><b>أكمل القراءة</b><div class="sub">سورة ${sname(L.n)} • آية ${toAr(L.a)}</div></div>${icon('chevL',18)}</a>`:''}
 <div id="vd"></div>
 ${sect('القرآن الكريم','book',tiles([['#/library','book','المصحف'],['#/search','search','البحث'],['#/tafsir','note','التفسير'],['#/bookmarks','bookmark','المحفوظات']],4),['#/library','عرض الكل'])}
 ${sect('الاستماع والحفظ','headphones',tiles([['#/audio','headphones','الاستماع'],['#/hifz','hifz','التحفيظ'],['#/recite','mic','التصحيح'],['#/downloads','download','التحميلات']],4),['#/audio','عرض الكل'])}
 ${sect('العبادة','clock',tiles([['#/prayer','clock','مواقيت الصلاة'],['#/qibla','compass','القبلة'],['#/azkar','beads','الأذكار'],['#/duas','heart','الأدعية'],['#/tasbih','beads','المسبحة'],['#/ramadan','moon','رمضان']],3),['#/worship','عرض الكل'])}
 ${sect('تقدّمك','check',`<div class="stats"><a class="card" href="#/hifz"><div class="sub">الحفظ</div><b>${toAr(hf)} / ${toAr(114)}</b><div class="pb"><i style="width:${hf/114*100}%"></i></div></a><a class="card" href="#/ramadan"><div class="sub">الختمة</div><b>${toAr(kh)} / ${toAr(30)}</b><div class="pb"><i style="width:${kh/30*100}%"></i></div></a></div>`)}`;
 const tick=()=>{const b=el.querySelector('#nxt');if(!b){clearInterval(tk);return}const np=nextPrayer();
  b.innerHTML=np?`<div><div class="sub">الصلاة القادمة</div><b>${np.name}</b></div><div class="big">${np.time}</div><div class="sub">${np.text}</div>`:`<div><div class="sub">مواقيت الصلاة</div><b>حدّد موقعك لعرضها</b></div>${icon('chevL',18)}`};
 tick();tk=setInterval(tick,30000);
 try{const doy=Math.floor((now-new Date(now.getFullYear(),0,0))/864e5),n=(doy*7)%114+1,[u]=await surah(n),a=u.ayahs[doy%u.ayahs.length],box=el.querySelector('#vd');
  if(box)box.innerHTML=`<a class="card tap" href="#/read/${n}/${a.numberInSurah}" style="display:block;border-color:var(--gold)"><div class="sub">آية اليوم</div><div class="quran" style="--fs:24px;--lh:2.1;text-align:center">${cut(n,a,a.text)} <span class="end">﴿${toAr(a.numberInSurah)}﴾</span></div><div class="sub tc">سورة ${sname(n)}</div></a>`}catch{}
}
