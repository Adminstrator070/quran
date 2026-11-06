// Prayer reminders (Android app only): schedules the next 7 days of prayer-time notifications.
import {S} from './state.js';import {isNative,plugin} from './cap.js';
const LN=isNative()?plugin('LocalNotifications'):null;
export const supported=!!LN;
const N=[['Fajr','الفجر'],['Dhuhr','الظهر'],['Asr','العصر'],['Maghrib','المغرب'],['Isha','العشاء']];
const month=async(loc,method,y,m)=>{
 const key=JSON.stringify([loc,method,y,m]),c=S.get('pcal',{});
 if(c.key===key)return c.days;
 const q=loc.city?`calendarByCity/${y}/${m}?city=${encodeURIComponent(loc.city)}&country=${encodeURIComponent(loc.country)}&method=${method}`:`calendar/${y}/${m}?latitude=${loc.lat}&longitude=${loc.lon}&method=${method}`;
 const r=await fetch('https://api.aladhan.com/v1/'+q);if(!r.ok)throw Error(r.status);
 const days=(await r.json()).data.map(d=>({date:d.date.gregorian.date,t:Object.fromEntries(N.map(([k])=>[k,d.timings[k].slice(0,5)]))}));
 S.set('pcal',{key,days});return days;
};
async function cancelAll(){const {notifications}=await LN.getPending();if(notifications.length)await LN.cancel({notifications:notifications.map(n=>({id:n.id}))})}
export async function enable(on){
 if(!LN)return false;
 if(!on){await cancelAll();S.set('adhan',false);return false}
 const p=await LN.requestPermissions();if(p.display!=='granted')return false;
 S.set('adhan',true);await sync();return true;
}
export async function sync(){
 if(!LN||!S.get('adhan',false))return;
 const loc=S.get('ploc',null),method=S.get('pmethod',5);if(!loc)return;
 try{
  const now=new Date(),end=new Date(+now+7*864e5);let days=await month(loc,method,now.getFullYear(),now.getMonth()+1);
  if(end.getMonth()!==now.getMonth()){const e=await month(loc,method,end.getFullYear(),end.getMonth()+1).catch(()=>[]);days=days.concat(e)}
  const list=[];let id=1000;
  for(const d of days){const [dd,mm,yy]=d.date.split('-').map(Number);
   for(const [k,ar] of N){const [h,mi]=d.t[k].split(':').map(Number),at=new Date(yy,mm-1,dd,h,mi);
    if(at>now&&at<end)list.push({id:id++,title:'مشكاة',body:`حان الآن موعد صلاة ${ar}`,schedule:{at,allowWhileIdle:true}})}}
  await cancelAll();if(list.length)await LN.schedule({notifications:list});
 }catch{}
}
