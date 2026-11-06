import {S} from '../state.js';import {icon,toAr,toast,empty} from '../ui.js';
const K=[21.4225,39.8262]; // the Kaaba
export const bearing=(la,lo)=>{const r=Math.PI/180,p1=la*r,p2=K[0]*r,dl=(K[1]-lo)*r;
 return (Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl))/r+360)%360};
export default async function render(el){
 const p=S.get('ploc',null),q=S.get('qloc',null),loc=p&&p.lat!=null?p:q;
 if(!loc){el.innerHTML=empty('compass','حدّد موقعك لمعرفة اتجاه القبلة')+'<button class="btn block" id="gps">استخدام موقعي الحالي</button>';
  el.onclick=e=>{if(!e.target.closest('#gps'))return;navigator.geolocation?.getCurrentPosition(x=>{S.set('qloc',{lat:+x.coords.latitude.toFixed(4),lon:+x.coords.longitude.toFixed(4)});render(el)},()=>toast('تعذّر تحديد الموقع'))};return}
 const b=bearing(loc.lat,loc.lon);let heading=null,hit=false;
 el.innerHTML=`<div class="card tc"><div class="sub">اتجاه القبلة من موقعك</div><div class="bigdeg">${toAr(Math.round(b))}°</div>
 <div class="dial" id="dial"><span class="dn">ش</span><span class="ds">ج</span><span class="de">ق</span><span class="dw">غ</span></div>
 <div class="needle" style="position:relative;height:0"></div>
 <div id="msg" class="sub"></div></div>
 <p class="sub tc">ضع الهاتف أفقيًا وبعيدًا عن المعادن والأجهزة المغناطيسية. إن كانت القراءة غير دقيقة، حرّك الهاتف على شكل ٨ للمعايرة.</p>`;
 const dial=el.querySelector('#dial');dial.insertAdjacentHTML('beforeend','<div class="needle" id="nd"><i></i><b></b></div>');
 const draw=()=>{const h=heading??0;dial.style.transform=`rotate(${-h}deg)`;
  el.querySelector('#nd').style.transform=`rotate(${b}deg)`;
  const m=el.querySelector('#msg');
  if(heading==null){m.textContent='المستشعر غير متاح: السهم يبيّن الاتجاه بالنسبة للشمال عند توجيه أعلى الهاتف نحو الشمال';return}
  const diff=((b-heading+540)%360)-180;
  if(Math.abs(diff)<4){m.textContent='أنت متجه نحو القبلة ✓';m.className='sub ok-b';if(!hit){hit=true;navigator.vibrate?.(60)}}
  else{hit=false;m.className='sub';m.textContent=`أدر الهاتف ${toAr(Math.round(Math.abs(diff)))}° نحو ${diff>0?'اليمين':'اليسار'}`}};
 const on=e=>{let h=null;if(e.webkitCompassHeading!=null)h=e.webkitCompassHeading;else if(e.absolute&&e.alpha!=null)h=(360-e.alpha)%360;if(h==null)return;heading=h;draw()};
 addEventListener('deviceorientationabsolute',on,true);addEventListener('deviceorientation',on,true);
 el._off=()=>{removeEventListener('deviceorientationabsolute',on,true);removeEventListener('deviceorientation',on,true)};
 draw();
}
