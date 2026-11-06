import {register,login,guest,hasUsers} from '../auth.js';import {MARK} from '../ui.js';import {APP} from '../config.js';
export default function showLogin(done){
 const a=document.getElementById('auth');a.hidden=false;let reg=!hasUsers(),busy=false;
 const draw=()=>a.innerHTML=`<div class="auth"><div class="brand">${MARK(76)}</div><h1 class="brandname">${APP.name}</h1><p class="sub tc">${APP.tagline}</p>
 <div class="seg"><button data-m="0" class="${reg?'':'on'}">تسجيل الدخول</button><button data-m="1" class="${reg?'on':''}">حساب جديد</button></div>
 ${reg?'<label class="field"><input id="dn" placeholder="الاسم" autocomplete="name"></label>':''}
 <label class="field"><input id="un" placeholder="اسم المستخدم (إنجليزي)" autocapitalize="none" autocomplete="username" dir="ltr"></label>
 <label class="field"><input id="pw" type="password" placeholder="كلمة المرور" autocomplete="${reg?'new-password':'current-password'}" dir="ltr"></label>
 <div class="err tc" id="er"></div>
 <button class="btn block" id="go">${reg?'إنشاء الحساب':'دخول'}</button>
 <button class="btn ghost block" id="gs">المتابعة كزائر</button>
 <p class="sub tc">الحسابات محفوظة على جهازك فقط ولا تُرسل إلى أي خادم.</p></div>`;
 draw();
 const fin=()=>{a.hidden=true;a.innerHTML='';done()};
 const v=i=>a.querySelector(i)?.value||'';
 const submit=async()=>{if(busy)return;busy=true;try{reg?await register(v('#un'),v('#dn'),v('#pw')):await login(v('#un'),v('#pw'));fin()}catch(x){a.querySelector('#er').textContent=x.message}busy=false};
 a.onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.m!==undefined){reg=b.dataset.m==='1';draw()}
  if(b.id==='gs'){guest();fin()}
  if(b.id==='go')submit()};
 a.onkeydown=e=>{if(e.key==='Enter')submit()};
}
