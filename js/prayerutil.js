import {S} from './state.js';import {toAr} from './ui.js';
const N=[['Fajr','الفجر'],['Dhuhr','الظهر'],['Asr','العصر'],['Maghrib','المغرب'],['Isha','العشاء']];
const mins=x=>{const [h,m]=x.slice(0,5).split(':');return +h*60+ +m};
export const f12=x=>{const [h,m]=x.slice(0,5).split(':').map(Number);return `${toAr(h%12||12)}:${toAr(String(m).padStart(2,'0'))} ${h<12?'ص':'م'}`};
// Next prayer from today's saved timings (null when no location / no timings saved yet).
export function nextPrayer(){
 const now=new Date(),day=`${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`,pc=S.get('pcache',null);
 if(!pc||JSON.parse(pc.key)[2]!==day)return null;
 const T=pc.t,cur=now.getHours()*60+now.getMinutes();let k=N.find(([x])=>mins(T[x])>cur),add=0;if(!k){k=N[0];add=1440}
 const left=mins(T[k[0]])+add-cur;
 return {name:k[1],time:f12(T[k[0]]),text:`بعد ${toAr(Math.floor(left/60))} س ${toAr(left%60)} د`};
}
