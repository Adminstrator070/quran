import {tafsirOf,TAFSIRS,cut} from '../api.js';import {S,cfg,setCfg,lastRead} from '../state.js';import {icon,toAr,esc,toast,scrollToEl} from '../ui.js';import {sname} from '../names.js';
export default async function render(el,arg,arg2){
 const n=Math.min(114,Math.max(1,+arg||lastRead()?.n||1)),c=cfg(),notes=S.get('notes',{});
 const [q,t]=await tafsirOf(n,c.tafsir);
 el.innerHTML=`<div class="bar sticky"><button class="iconbtn" data-go="${n-1}" ${n===1?'disabled':''} aria-label="السابقة">${icon('chevR')}</button><div class="grow tc"><b>تفسير سورة ${sname(n)}</b></div><button class="iconbtn" data-go="${n+1}" ${n===114?'disabled':''} aria-label="التالية">${icon('chevL')}</button></div>
 <div class="chips">${Object.entries(TAFSIRS).map(([k,v])=>`<button class="chip ${k===c.tafsir?'on':''}" data-t="${k}">${v}</button>`).join('')}</div>`+
 q.ayahs.map((a,i)=>`<div class="card lite" id="t${a.numberInSurah}"><div class="quran" style="--fs:22px;--lh:2.1">${cut(n,a,a.text)} <span class="end">﴿${toAr(a.numberInSurah)}﴾</span></div>
  <p style="margin:8px 0;line-height:1.9;text-align:justify">${esc(t.ayahs[i].text)}</p>
  <textarea rows="2" data-k="${n}:${a.numberInSurah}" placeholder="ملاحظتي على هذه الآية">${esc(notes[n+':'+a.numberInSurah]||'')}</textarea></div>`).join('');
 if(arg2){const x=el.querySelector('#t'+arg2);if(x){scrollToEl(x,'start');x.style.borderColor='var(--gold)'}}
 el.onclick=e=>{const g=e.target.closest('[data-go]'),b=e.target.closest('[data-t]');
  if(g&&!g.disabled)location.hash='#/tafsir/'+g.dataset.go;
  if(b){setCfg({tafsir:b.dataset.t});render(el,n,arg2)}};
 el.onchange=e=>{const k=e.target.dataset?.k;if(!k)return;const o=S.get('notes',{});if(e.target.value.trim())o[k]=e.target.value;else delete o[k];S.set('notes',o);toast('تم حفظ الملاحظة')};
}
