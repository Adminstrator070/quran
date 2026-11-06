import {icon} from '../ui.js';
const SL=[['book','المصحف كاملًا','بتلوين التجويد وخيارات قراءة مريحة، والتفسير تحت كل آية.'],['headphones','استمع واحفظ وصحّح','تلاوات متعددة، وتحفيظ بالمصحف المعلم، وتصحيح تلاوتك كلمةً بكلمة.'],['clock','عبادتك في مكان واحد','مواقيت الصلاة والقبلة والأذكار ورمضان، مع تنبيهات وعمل بدون إنترنت.']];
export default function onboarding(done){
 const a=document.getElementById('auth');a.hidden=false;let i=0;
 const fin=()=>{a.hidden=true;a.innerHTML='';done()};
 const draw=()=>{const [ic,t,d]=SL[i],last=i===SL.length-1;
  a.innerHTML=`<div class="auth ob"><div class="obic">${icon(ic,56)}</div><h2>${t}</h2><p class="muted">${d}</p>
  <div class="dots">${SL.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div>
  <button class="btn block" id="nx">${last?'ابدأ الآن':'التالي'}</button>${last?'':'<button class="btn ghost block" id="sk">تخطّي</button>'}</div>`};
 draw();
 a.onclick=e=>{const id=e.target.closest('button')?.id;if(id==='nx'){i<SL.length-1?(i++,draw()):fin()}if(id==='sk')fin()};
}
