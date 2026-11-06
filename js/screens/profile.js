import {cfg,setCfg} from '../state.js';import {display,uid,logout,deleteAccount} from '../auth.js';import {icon,toast,confirmSheet,esc,shareText} from '../ui.js';import {applyTheme} from '../theme.js';import {APP} from '../config.js';
export default async function(el){
 const c=cfg(),m=c.moshaf,I=(n,t,s,h)=>`<${h?'a href="'+h+'"':'button'} class="item" ${h?'':`id="${n}"`}>${icon(n==='logout'?'logout':({hp:'headphones',dl:'download',ab:'info',sh:'share',del:'trash'}[n]||'info'),20)}<div class="grow"><b>${t}</b>${s?`<div class="sub">${s}</div>`:''}</div>${h?icon('chevL',18):''}</${h?'a':'button'}>`;
 el.innerHTML=`<div class="card row"><div class="avatar big">${esc((display()||'?')[0])}</div><div class="grow"><b>${esc(display())}</b><div class="sub">${uid()==='guest'?'وضع الزائر':'@'+esc(uid())}</div></div></div>
 <div class="sec"><h3>المظهر</h3></div><div class="seg">${[['auto','تلقائي'],['light','فاتح'],['dark','داكن']].map(([k,l])=>`<button data-t="${k}" class="${c.theme===k?'on':''}">${l}</button>`).join('')}</div>
 <div class="sec"><h3>القراءة</h3></div><div class="card"><label class="opt"><span>حجم الخط</span><input type="range" id="fs" min="20" max="46" value="${c.font}"></label>
 <label class="opt"><span>تلوين التجويد</span><input type="checkbox" id="tj" ${c.tajweed?'checked':''}></label><label class="opt"><span>الترجمة الإنجليزية</span><input type="checkbox" id="tr" ${c.tr?'checked':''}></label></div>
 <div class="sec"><h3>عام</h3></div><div class="card list">${I('hp','القارئ الحالي',m?esc(m.reciter):'لم يُختر بعد','#/audio')}${I('dl','التحميلات','النصوص والتلاوات للعمل بدون إنترنت','#/downloads')}${I('ab','عن مشكاة','الخصوصية والشروط والمصادر','#/about')}${I('sh','مشاركة التطبيق','')}</div>
 <div class="sec"><h3>الحساب والبيانات</h3></div><div class="card list">${I('logout','تسجيل الخروج','')}${I('del','حذف بيانات الحساب','العلامات والملاحظات والتقدّم والإعدادات').replace('class="item"','class="item dng"')}</div>
 <p class="sub tc">${APP.name} • الإصدار ${APP.version}</p>`;
 el.onclick=async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.t){setCfg({theme:b.dataset.t});applyTheme();el.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b))}
  if(b.id==='sh')await shareText(APP.name+' — تطبيق قرآني متكامل');
  if(b.id==='logout')confirmSheet('هل تريد تسجيل الخروج؟',()=>{logout();location.hash='';location.reload()},'تسجيل الخروج');
  if(b.id==='del')confirmSheet('سيتم حذف بيانات هذا الحساب (العلامات والملاحظات والتقدّم والإعدادات) من الجهاز نهائيًا.',()=>{deleteAccount();location.hash='';location.reload()},'حذف نهائيًا')};
 el.oninput=e=>{if(e.target.id==='fs')setCfg({font:+e.target.value})};
 el.onchange=e=>{if(e.target.id==='tj')setCfg({tajweed:e.target.checked});if(e.target.id==='tr')setCfg({tr:e.target.checked})};
}
