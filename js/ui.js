import {isNative,plugin} from './cap.js';
const I={
home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
book:'<path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v14"/>',
headphones:'<path d="M4 15v-3a8 8 0 0116 0v3"/><path d="M4 15h3v5H5a1 1 0 01-1-1z"/><path d="M20 15h-3v5h2a1 1 0 001-1z"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
play:'<path d="M7 4l13 8-13 8z"/>',pause:'<path d="M7 4h3v16H7zM14 4h3v16h-3z"/>',stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',
next:'<path d="M18 5v14"/><path d="M5 5l10 7-10 7z"/>',prev:'<path d="M6 5v14"/><path d="M19 5l-10 7 10 7z"/>',
repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 013-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 01-3 3H3"/>',
bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',download:'<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
chevR:'<path d="M9 6l6 6-6 6"/>',chevL:'<path d="M15 6l-6 6 6 6"/>',
mic:'<path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z"/><path d="M5 11a7 7 0 0014 0"/><path d="M12 18v3"/>',
check:'<path d="M5 12l5 5 9-10"/>',trash:'<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5v.5"/>',alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 16.5v.5"/>',
beads:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
hifz:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/>',
share:'<path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>',
note:'<path d="M5 3h14v18H5z"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h3"/>',
moon:'<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
sliders:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
logout:'<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',heart:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z"/>'};
const FILL=new Set(['play','pause','stop']);
export const ICONS=Object.keys(I);
export const icon=(n,s=22)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${FILL.has(n)?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||''}</svg>`;
export const MARK=(s=64)=>`<svg width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true"><path d="M16 54V28a16 16 0 0132 0v26z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M24 54V31a8 8 0 0116 0v23" fill="none" stroke="currentColor" stroke-width="2" opacity=".55"/><path d="M32 31c-3.5 4-3.5 8 0 10 3.5-2 3.5-6 0-10z" fill="#c79a2b"/><path d="M11 57h42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`;
export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const toAr=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
export const plain=s=>String(s).replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
let tt;
export function toast(m){const t=document.getElementById('toast');t.textContent=m;t.hidden=false;requestAnimationFrame(()=>t.classList.add('show'));clearTimeout(tt);tt=setTimeout(()=>{t.classList.remove('show');setTimeout(()=>{if(!t.classList.contains('show'))t.hidden=true},300)},2400)}
export function sheet(html,onclose){
 const r=document.getElementById('sheetroot');
 r.innerHTML=`<div class="scrim"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
 const close=()=>{r.innerHTML='';onclose?.()};
 r.querySelector('.scrim').onclick=close;
 return {el:r.querySelector('.sheet'),close};
}
export function confirmSheet(msg,yes,label='تأكيد'){
 const s=sheet(`<div class="shtitle">${msg}</div><div class="row" style="margin-top:14px"><button class="btn danger grow" id="y">${label}</button><button class="btn ghost grow" id="n">إلغاء</button></div>`);
 s.el.querySelector('#n').onclick=s.close;s.el.querySelector('#y').onclick=()=>{s.close();yes()};
}
export const skel=(n=4)=>Array.from({length:n},()=>'<div class="skel"></div>').join('');
export const empty=(i,t,s='')=>`<div class="empty">${icon(i,42)}<b>${t}</b><div class="sub">${s}</div></div>`;
export async function shareText(text){
 try{const Sh=isNative()?plugin('Share'):null;if(Sh){await Sh.share({text});return}}catch{}
 try{if(navigator.share){await navigator.share({text});return}}catch(e){if(e&&e.name==='AbortError')return}
 try{await navigator.clipboard.writeText(text);toast('تم النسخ')}catch{toast('تعذّرت المشاركة')}
}
// Organised sections: sect(title, icon, body, [href,label]) wraps tiles(...) or any markup.
export const tiles=(items,cols=3)=>`<div class="tiles2 c${cols}">${items.map(([h,i,t,s])=>`<a class="tl" href="${h}"><span class="tli">${icon(i,cols>3?22:24)}</span><b>${t}</b>${s?`<small>${s}</small>`:''}</a>`).join('')}</div>`;
export const sect=(t,i,body,more)=>`<section class="sx"><div class="sxh"><span class="sxi">${icon(i,17)}</span><h3>${t}</h3>${more?`<a href="${more[0]}">${more[1]}</a>`:''}</div>${body}</section>`;
export function scrollToEl(x,block='center',smooth=false){
 const v=document.getElementById('view');if(!x||!v)return;
 const r=x.getBoundingClientRect(),vr=v.getBoundingClientRect(),top=r.top-vr.top+v.scrollTop;
 const t=Math.max(0,block==='center'?top-(vr.height-r.height)/2:top-110);
 if(v.scrollTo)v.scrollTo({top:t,behavior:smooth?'smooth':'auto'});else v.scrollTop=t;
}
