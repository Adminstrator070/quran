// Offline: app files precached; own files network-first (so edits show up), everything else cache-first.
// Audio is NOT handled here (js/offline.js stores it in 'noor-audio'). Bump C when you change files.
const C='noor-v14';
const SHELL=["./", "index.html", "manifest.json", "css/style.css", "js/api.js", "js/app.js", "js/auth.js", "js/cap.js", "js/config.js", "js/names.js", "js/native.js", "js/offline.js", "js/player.js", "js/prayerutil.js", "js/reminders.js", "js/screens/about.js", "js/screens/audio.js", "js/screens/azkar.js", "js/screens/bookmarks.js", "js/screens/dhikr.js", "js/screens/downloads.js", "js/screens/duas.js", "js/screens/hifz.js", "js/screens/home.js", "js/screens/library.js", "js/screens/login.js", "js/screens/onboarding.js", "js/screens/profile.js", "js/screens/qibla.js", "js/screens/ramadan.js", "js/screens/read.js", "js/screens/recite.js", "js/screens/search.js", "js/screens/tafsir.js", "js/screens/tasbih.js", "js/screens/times.js", "js/screens/worship.js", "js/state.js", "js/theme.js", "js/ui.js"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('noor-v')&&k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||r.url.endsWith('.mp3')||r.headers.has('range'))return;
 const own=new URL(r.url).origin===location.origin;
 e.respondWith(caches.open(C).then(async c=>{
  const m=await c.match(r);
  const f=fetch(r).then(x=>{if(x.status===200||x.type==='opaque')c.put(r,x.clone());return x});
  if(own)return f.catch(()=>m);
  return m||f.catch(()=>m);
 }));
});
