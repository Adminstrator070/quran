// Offline storage: audio lives in the Cache API ('noor-audio'); text/tafsir are cached by sw.js when fetched.
import {surah,tafsirOf,dhikrCats,dhikrOf} from './api.js';
const AC='noor-audio';
const cache=()=>caches.open(AC);
export const url=(m,n)=>m.server+String(n).padStart(3,'0')+'.mp3';
export async function save(m,n){
 const u=url(m,n),r=await fetch(u);if(!r.ok)throw Error(r.status);
 await (await cache()).put(u,r);navigator.storage?.persist?.();
}
export const remove=async(m,n)=>(await cache()).delete(url(m,n));
export async function src(m,n){const r=await (await cache()).match(url(m,n));return r?URL.createObjectURL(await r.blob()):url(m,n)}
export async function done(m){const ks=new Set((await (await cache()).keys()).map(r=>r.url));return new Set(m.list.filter(n=>ks.has(url(m,n))))}
export async function usage(){const e=await navigator.storage?.estimate?.();return e?Math.round(e.usage/1048576):0}
export async function purge(url){for(const k of await caches.keys())if(k.startsWith('noor-v')||k==='noor-data')await (await caches.open(k)).delete(url)}
const FONT_CSS='https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Tajawal:wght@400;500;700&display=swap';
async function fonts(){try{const css=await (await fetch(FONT_CSS)).text();for(const m of css.matchAll(/url\((https:[^)]+)\)/g))await fetch(m[1])}catch{}}
// Downloads the whole Quran text (or a tafsir) and verifies it: every surah must contain its declared number of ayahs.
export async function text(prog,tafsir){
 navigator.storage?.persist?.();
 let total=0,bad=0,fail=0;if(!tafsir)await fonts();
 for(let n=1;n<=114;n++){prog(n);try{const s=(await (tafsir?tafsirOf(n,tafsir):surah(n)))[0];total+=s.ayahs.length;if(s.ayahs.length!==s.numberOfAyahs)bad++}catch{fail++}}
 return {total,bad,fail};
}
export async function adhkar(prog){
 navigator.storage?.persist?.();let fail=0;const cats=await dhikrCats();
 for(let i=0;i<cats.length;i++){prog(i+1,cats.length);try{await dhikrOf(String(cats[i].number))}catch{fail++}}
 return {fail,total:cats.length};
}
