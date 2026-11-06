import {src} from './offline.js';import {cfg,setCfg,S} from './state.js';import {flat,styleOf} from './api.js';import {sname} from './names.js';
const a=new Audio();let obj;
// Picks a sensible default reciter (Mishary Alafasy, murattal) the first time audio is needed.
export async function ensureMoshaf(){
 if(cfg().moshaf)return;
 const all=await flat(),mur=all.filter(x=>styleOf(x.name)==='murattal');
 const pick=mur.find(x=>x.reciter.includes('العفاسي'))||mur[0]||all[0];
 if(pick)setCfg({moshaf:pick});
}
export const P={surah:null,m:null,on:[],always:[],loop:false,times:1,done:0,err:'',sleepAt:0,a,
 // play(n): user's reciter. play(n,moshaf): a specific recitation (Hifz).
 async play(n,mo){
  let m=mo||cfg().moshaf;
  if(!m){try{await ensureMoshaf()}catch{}m=cfg().moshaf}
  if(!m){P.err='اختر قارئًا أولًا (يحتاج إنترنت أول مرة)';P.emit();return}
  if(!m.list.includes(n)){P.err='هذه السورة غير متوفرة بهذه التلاوة';P.emit();return}
  if(!mo){P.times=1;P.rate(1)}
  P.m=m;P.surah=n;P.err='';P.done=0;S.set('lastplay',n);
  const o=await src(m,n);a.src=o;if(obj)URL.revokeObjectURL(obj);obj=o;a.playbackRate=a.defaultPlaybackRate;
  a.play().catch(()=>{});P.meta();P.emit()},
 toggle(){a.src&&(a.paused?a.play():a.pause())},
 step(d){const m=P.m||cfg().moshaf;if(!m)return;const l=m.list,x=l[l.indexOf(P.surah)+d];if(x)P.play(x,m.__h?m:undefined)},
 rate(x){a.defaultPlaybackRate=x;a.playbackRate=x},
 seek(f){if(a.duration)a.currentTime=f*a.duration},
 sleep(min){clearTimeout(P._s);P.sleepAt=min?Date.now()+min*6e4:0;if(min)P._s=setTimeout(()=>{a.pause();P.sleepAt=0;P.emit()},min*6e4);P.emit()},
 meta(){if(!('mediaSession' in navigator)||typeof MediaMetadata==='undefined')return;
  try{const ms=navigator.mediaSession;ms.metadata=new MediaMetadata({title:'سورة '+sname(P.surah),artist:P.m.reciter,album:'مشكاة'});
   ms.setActionHandler('play',()=>a.play());ms.setActionHandler('pause',()=>a.pause());
   ms.setActionHandler('previoustrack',()=>P.step(-1));ms.setActionHandler('nexttrack',()=>P.step(1))}catch{}},
 emit(){P.on.forEach(f=>f());P.always.forEach(f=>f())}};
a.onended=()=>{if(P.loop||++P.done<P.times){a.currentTime=0;a.play()}else{P.done=0;P.step(1)}};
a.onerror=()=>{if(!a.src)return;P.err='السورة غير محمّلة ولا يوجد اتصال بالإنترنت';P.emit()};
['play','pause','timeupdate','loadedmetadata'].forEach(e=>a.addEventListener(e,()=>P.emit()));
