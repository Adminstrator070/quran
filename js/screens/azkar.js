import {dhikrCats} from '../api.js';import {icon,toAr,esc,plain,empty,skel,tiles,sect} from '../ui.js';
// Hub: organised sections, then every chapter of Hisn al-Muslim. A tile = [chapters, label, icon]; ranges/lists load together.
const e=encodeURIComponent,D=(id,t,i)=>[`#/dhikr/${id}/${e(t)}`,i,t];
export default async function render(el){
 el.innerHTML=`${sect('أذكار يومية','sun',tiles([D('27','الصباح والمساء','sun'),D('25','بعد الصلاة','check'),D('28','النوم','moon'),D('1','الاستيقاظ','sun')],4))}
 ${sect('أحوال وأدعية','heart',tiles([D('34-35','الكرب والهمّ','heart'),D('129-130','الاستغفار','repeat'),D('38,39,45,48,88,128','الحماية','info')],3))}
 ${sect('أماكن ومناسبات','compass',tiles([D('96-105','السفر','compass'),D('69-76','الطعام والشراب','book'),D('12-14','المسجد','home'),D('10-11','المنزل','home'),D('115-121','الحج والعمرة','compass')],3))}
 ${sect('المزيد','beads',tiles([['#/duas','heart','الأدعية القرآنية'],['#/tasbih','beads','المسبحة'],['#/bookmarks','bookmark','مفضّلتي']],3))}
 ${sect('جميع الأبواب','list',`<label class="field">${icon('search',20)}<input id="q" type="search" placeholder="ابحث في أبواب الأذكار" autocomplete="off"></label><div id="l" class="card list">${skel(2)}</div>`)}`;
 let cats=[];const l=el.querySelector('#l');
 const draw=()=>{const q=plain(el.querySelector('#q').value.trim());
  l.innerHTML=cats.filter(c=>!q||plain(c.ar||'').includes(q)).map(c=>`<a class="item" href="#/dhikr/${c.number}"><div class="num">${toAr(c.number)}</div><div class="grow"><b>${esc(c.ar||c.en)}</b><div class="sub">${toAr(c.count)} ${c.count>10?'ذكرًا':'أذكار'}</div></div>${icon('chevL',18)}</a>`).join('')||empty('search','لا توجد نتائج')};
 try{cats=await dhikrCats();draw();el.querySelector('#q').oninput=draw}
 catch{l.innerHTML=empty('alert','تعذّر تحميل الأبواب','تحتاج إنترنت أول مرة. يمكنك تحميلها للعمل بدون إنترنت من شاشة التحميلات.')}
}
