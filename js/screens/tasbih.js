import {S} from '../state.js';import {toAr} from '../ui.js';
const PH=['سبحان الله','الحمد لله','الله أكبر','لا إله إلا الله','أستغفر الله','سبحان الله وبحمده','لا حول ولا قوة إلا بالله','اللهم صلِّ وسلّم على نبينا محمد'];
const pr=(c,g)=>g?(c>0&&c%g===0?100:(c%g)/g*100):0;
export default async function render(el){
 const cnt=S.get('tasbih',{}),cur=S.get('tphrase',0),goal=S.get('tgoal',33);
 el.innerHTML=`<div class="chips">${PH.map((p,i)=>`<button class="chip ${i===cur?'on':''}" data-p="${i}">${p}</button>`).join('')}</div>
 <div class="card tc"><div class="sub">${PH[cur]}</div><button class="tasbtn" id="tap" style="--pr:${pr(cnt[cur]||0,goal)}" aria-label="تسبيح"><span id="n">${toAr(cnt[cur]||0)}</span><small>${goal?'الهدف '+toAr(goal):'بلا حدّ'}</small></button>
 <div class="chips" style="justify-content:center">${[33,100,0].map(g=>`<button class="chip ${g===goal?'on':''}" data-g="${g}">${g?toAr(g):'∞'}</button>`).join('')}<button class="chip" id="rs">تصفير</button></div></div>`;
 el.onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.p!==undefined){S.set('tphrase',+b.dataset.p);render(el)}
  if(b.dataset.g!==undefined){S.set('tgoal',+b.dataset.g);render(el)}
  if(b.id==='rs'){const c=S.get('tasbih',{});c[cur]=0;S.set('tasbih',c);render(el)}
  if(b.id==='tap'){const c=S.get('tasbih',{});c[cur]=(c[cur]||0)+1;S.set('tasbih',c);el.querySelector('#n').textContent=toAr(c[cur]);b.style.setProperty('--pr',pr(c[cur],goal));navigator.vibrate?.(goal&&c[cur]%goal===0?[40,40,40]:12)}};
}
