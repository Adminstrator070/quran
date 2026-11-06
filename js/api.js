// All data access lives here. Swap the source later without touching screens.
const B='https://api.alquran.cloud/v1';
export const RECITERS={'ar.alafasy':'مشاري العفاسي','ar.husary':'محمود الحصري','ar.minshawi':'محمد المنشاوي','ar.abdulbasitmurattal':'عبد الباسط','ar.mahermuaiqly':'ماهر المعيقلي'};
export const TAFSIRS={'ar.jalalayn':'الجلالين','ar.muyassar':'الميسر','ar.qurtubi':'القرطبي','ar.baghawi':'البغوي','ar.waseet':'الوسيط'};
// Every API response is cached in the Cache API ('noor-data'), so the app works offline in the browser AND inside the APK.
const DC='noor-data';
async function jfull(u){
 let c=null;try{c=await caches.open(DC)}catch{}
 const hit=c&&await c.match(u);if(hit)return hit.json();
 const r=await fetch(u);if(!r.ok)throw Error(r.status);
 if(c)c.put(u,r.clone()).catch(()=>{});
 return r.json();
}
const j=async u=>(await jfull(u)).data;
export const surahs=()=>j(B+'/surah');
export const surahUrl=n=>`${B}/surah/${n}/editions/quran-uthmani,quran-tajweed,en.sahih`;
export const surah=n=>j(surahUrl(n));
export const ayahText=async(n,a)=>(await j(`${B}/ayah/${n}:${a}/quran-uthmani`)).text; // -> [uthmani, tajweed, english]
export const tafsirOf=(n,ed)=>j(`${B}/surah/${n}/editions/quran-uthmani,${ed}`);
export const audioUrl=(r,id)=>`https://cdn.islamic.network/quran/audio/128/${r}/${id}.mp3`;
export const tj=t=>t.replace(/\[(\w)(?::\d+)?\[([^\]]*)\]/g,'<span class="t-$1">$2</span>').replace(/[\[\]]/g,'');
// Audio catalogue (mp3quran.net): reciters -> moshafs (each moshaf = one recitation style/riwaya with its own server)
export const reciters=async()=>(await jfull('https://www.mp3quran.net/api/v3/reciters?language=ar')).reciters;
export const styleOf=n=>/مجود/.test(n)?'mujawwad':/مرتل/.test(n)&&/حفص/.test(n)?'murattal':/معلم/.test(n)?'muallim':/مرتل/.test(n)?'other':'other';
// Some editions glue the basmala onto ayah 1 of every surah (except 1 and 9). Detect it in the text itself
// (markup and diacritics ignored) and cut its 4 words only when it is really there.
const flatTxt=s=>s.replace(/\[\w(?::\d+)?\[([^\]]*)\]/g,'$1').replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g,'').replace(/[أإآٱ]/g,'ا');
export const cut=(n,a,raw)=>(a.numberInSurah===1&&n!==1&&n!==9&&flatTxt(raw).startsWith('بسم الله الرحمن الرحيم'))?raw.split(' ').slice(4).join(' '):raw;
export const flat=async()=>(await reciters()).flatMap(r=>r.moshaf.map(x=>({reciter:r.name,id:x.id,name:x.name,server:x.server,list:x.surah_list.split(',').map(Number)})));
export const search=async q=>{const r=await fetch(`${B}/search/${encodeURIComponent(q)}/all/quran-simple`);if(r.status===404)return {count:0,matches:[]};if(!r.ok)throw Error(r.status);return (await r.json()).data};

// Adhkar & duas (Hisn al-Muslim). Prefers the bundled data/adhkar.json (see tools/fetch_adhkar.py), falls back to the public API.
const DK='https://api.islamic.app/v1/dhikr';
let _loc;
export async function adhkarData(){if(_loc!==undefined)return _loc;try{const r=await fetch('data/adhkar.json');_loc=r.ok?await r.json():null}catch{_loc=null}return _loc}
export async function dhikrCats(){const d=await adhkarData();if(d)return d.c;return (await j(DK)).categories}
export async function dhikrOf(num){const d=await adhkarData();if(d&&d.d[num])return d.d[num];
 return (await j(`${DK}/${num}`)).duas.map(x=>({n:x.number,t:(x.ar&&x.ar.text)||'',r:x.repeatCount,s:x.source&&x.source.ar}))}
export const expandIds=s=>String(s||'').split(',').flatMap(p=>{const m=p.match(/^(\d+)-(\d+)$/);return m?Array.from({length:+m[2]-+m[1]+1},(_,i)=>String(+m[1]+i)):[p]}).filter(x=>/^\d+$/.test(x)&&+x>=1&&+x<=132);
