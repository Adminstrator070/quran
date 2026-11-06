// Every feature is its own screen: js/screens/x.js exports default async (el,arg,arg2)=>{...}.
// Register it in ROUTES + TITLE here, and add a tile in screens/home.js. Open with location.hash='#/x/arg/arg2'.
import {P} from './player.js';import {S} from './state.js';import {uid,display} from './auth.js';
import {icon,empty,skel,toast} from './ui.js';import {applyTheme} from './theme.js';import {loadNames,sname} from './names.js';import {sync} from './reminders.js';import {initNative} from './native.js';
import showLogin from './screens/login.js';import onboarding from './screens/onboarding.js';
import home from './screens/home.js';import library from './screens/library.js';import read from './screens/read.js';
import audio from './screens/audio.js';import tafsir from './screens/tafsir.js';import downloads from './screens/downloads.js';
import times from './screens/times.js';import azkar from './screens/azkar.js';import ramadan from './screens/ramadan.js';
import bookmarks from './screens/bookmarks.js';import hifz from './screens/hifz.js';import recite from './screens/recite.js';
import dhikr from './screens/dhikr.js';import duas from './screens/duas.js';import tasbih from './screens/tasbih.js';
import worship from './screens/worship.js';
import qibla from './screens/qibla.js';import search from './screens/search.js';import about from './screens/about.js';import profile from './screens/profile.js';
const ROUTES={home,worship,library,read,audio,tafsir,downloads,prayer:times,azkar,dhikr,duas,tasbih,ramadan,bookmarks,hifz,recite,qibla,search,about,profile};
const TABS=[['home','الرئيسية','home'],['library','القرآن','book'],['audio','الاستماع','headphones'],['worship','العبادة','moon'],['profile','حسابي','user']];
const TITLE={home:'مشكاة',worship:'العبادة',library:'القرآن الكريم',read:'القراءة',audio:'الاستماع',tafsir:'التفسير',downloads:'التحميلات',prayer:'مواقيت الصلاة',azkar:'الأذكار والأدعية',dhikr:'الأذكار',duas:'الأدعية من القرآن',tasbih:'المسبحة',ramadan:'رمضان',bookmarks:'المحفوظات',hifz:'التحفيظ',recite:'التلاوة والتصحيح',qibla:'اتجاه القبلة',search:'البحث في القرآن',about:'عن مشكاة',profile:'حسابي'};
const UP={read:'library',tafsir:'library',search:'library',bookmarks:'library',downloads:'audio',hifz:'audio',recite:'audio',prayer:'worship',azkar:'worship',dhikr:'worship',duas:'worship',tasbih:'worship',ramadan:'worship',qibla:'worship',about:'profile'};
const $=i=>document.getElementById(i),view=$('view'),nav=$('nav'),mb=$('menu'),mini=$('mini');
nav.innerHTML=TABS.map(([id,l,i])=>`<button data-id="${id}" aria-label="${l}"><span class="pill">${icon(i,22)}</span>${l}</button>`).join('');
nav.onclick=e=>{const b=e.target.closest('button');if(b)location.hash='#/'+b.dataset.id};
$('srch').innerHTML=icon('search',22);mb.onclick=()=>history.back();
$('av').onclick=()=>location.hash='#/profile';$('srch').onclick=()=>location.hash='#/search';
// mini player (stays visible on every screen except Audio)
mini.innerHTML=`<div class="mi"><b id="mt"></b><span class="sub" id="ms"></span></div><button class="iconbtn" data-m="pv" aria-label="السابق">${icon('prev',20)}</button><button class="iconbtn solid" data-m="pl" id="mp" aria-label="تشغيل/إيقاف"></button><button class="iconbtn" data-m="nx" aria-label="التالي">${icon('next',20)}</button><i id="mb"></i>`;
let lastPaused=null;
function paintMini(){
 if(!P.surah||location.hash.startsWith('#/audio')){mini.hidden=true;document.body.classList.remove('has-mini');return}
 mini.hidden=false;document.body.classList.add('has-mini');$('mt').textContent='سورة '+sname(P.surah);$('ms').textContent=P.m?.reciter||'';
 if(lastPaused!==P.a.paused){lastPaused=P.a.paused;$('mp').innerHTML=icon(P.a.paused?'play':'pause',20)}
 $('mb').style.width=(P.a.duration?P.a.currentTime/P.a.duration*100:0)+'%';
}
mini.onclick=e=>{const b=e.target.closest('[data-m]');if(!b){location.hash='#/audio';return}({pv:()=>P.step(-1),pl:()=>P.toggle(),nx:()=>P.step(1)})[b.dataset.m]()};
P.always.push(paintMini);
const off=()=>$('offline').hidden=navigator.onLine;addEventListener('online',off);addEventListener('offline',off);off();
let booted=false;
async function go(){
 if(!uid()||!booted)return;
 const [,id0,arg,arg2]=location.hash.split('/'),id=ROUTES[id0]?id0:'home',r=ROUTES[id],isTab=TABS.some(t=>t[0]===id);
 view._cur?._off?.();P.on.length=0;$('sheetroot').innerHTML='';
 nav.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.id===(UP[id]||id)));
 mb.innerHTML=isTab?'':icon('chevR',24);mb.style.visibility=isTab?'hidden':'visible';
 $('ttl').textContent=TITLE[id];$('srch').style.visibility=id==='search'?'hidden':'visible';
 paintMini();
 const el=document.createElement('div');el.className='page';el.innerHTML=skel(5);view.textContent='';view.appendChild(el);view._cur=el;view.scrollTop=0;
 try{await r(el,arg,arg2)}catch(e){console.error(e);el.innerHTML=empty('alert','تعذر تحميل الصفحة','تأكد من الاتصال بالإنترنت ثم حاول مرة أخرى')+'<button class="btn block" id="rt">إعادة المحاولة</button>';el.onclick=ev=>{if(ev.target.closest('#rt'))go()}}
}
async function boot(){
 booted=true;applyTheme();$('av').textContent=(display()||'?')[0];
 await Promise.race([loadNames(),new Promise(r=>setTimeout(r,2500))]);
 if(location.hash!=='#/home')location.hash='#/home';else go();
 setTimeout(()=>$('splash').classList.add('hide'),300);sync();window.__ok=1;
}
function start(){
 if(!uid()){$('splash').classList.add('hide');showLogin(start);window.__ok=1;return}
 if(!S.get('onb',false)){$('splash').classList.add('hide');onboarding(()=>{S.set('onb',true);boot()});window.__ok=1;return}
 boot();
}
addEventListener('hashchange',go);
try{applyTheme();start();initNative()}catch(e){window.__err=String(e&&e.stack||e)}
if('serviceWorker' in navigator&&!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()))navigator.serviceWorker.register('sw.js').catch(()=>{});

window.MishkatBackup = {
  exportData: function() {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mishkat_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },
  importData: function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, data[key]);
        });
        alert('تم استعادة البيانات بنجاح، سيتم إعادة تشغيل التطبيق.');
        location.reload();
      } catch(err) {
        alert('فشل استعادة البيانات، الملف غير صالح.');
      }
    };
    reader.readAsText(file);
  }
};

window.highlightAyah = function(ayahId) {
  document.querySelectorAll('.ayah-item, [data-ayah-id]').forEach(el => {
    el.classList.remove('active-ayah', 'active');
  });
  const target = document.querySelector(`[data-ayah-id="${ayahId}"], #ayah-${ayahId}`);
  if (target) {
    target.classList.add('active-ayah');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// حل نهائي لمنع تعليق التطبيق على شاشة البداية
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const splash = document.querySelector('.splash-screen, #splash, [id*="splash"], [class*="splash"]');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 500);
    }
  }, 1500);
});
