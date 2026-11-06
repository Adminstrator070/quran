import {isNative,plugin} from '../cap.js';
import {surahs,surah,cut} from '../api.js';import {S} from '../state.js';import {icon,toAr,esc,toast} from '../ui.js';import {sname} from '../names.js';
// Word-level recitation check: speech-to-text -> compared with the Quran text. It does NOT judge tajweed.
export const norm=s=>s.replace(/[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g,'').replace(/[آأإٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[^\u0621-\u064A\s]/g,' ').replace(/\s+/g,' ').trim();
const lev=(a,b)=>{const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]};
const sim=(a,b)=>a===b?0:lev(a,b)/Math.max(a.length,b.length)<=.34?.4:1;
export function align(E,H){
 const n=E.length,m=H.length,d=Array.from({length:n+1},()=>Array(m+1).fill(0)),st=Array(n).fill(0);
 for(let i=1;i<=n;i++)d[i][0]=i;for(let j=1;j<=m;j++)d[0][j]=j;
 for(let i=1;i<=n;i++)for(let j=1;j<=m;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+sim(E[i-1],H[j-1]));
 let i=n,j=m;const eq=(x,y)=>Math.abs(x-y)<1e-9;
 while(i>0&&j>0){const c=sim(E[i-1],H[j-1]);
  if(eq(d[i][j],d[i-1][j-1]+c)){st[i-1]=c===0?2:c<1?1:0;i--;j--}else if(eq(d[i][j],d[i-1][j]+1))i--;else j--}
 return st}
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const NAT=isNative()?plugin('SpeechRecognition'):null;
export default async function render(el){
 el._off?.();
 const l=await surahs().catch(()=>[]);
 const rc=S.get('rc',{n:1,f:1,t:5}),cnt=l[rc.n-1]?.numberOfAyahs||7;rc.t=Math.min(rc.t,cnt);rc.f=Math.min(rc.f,rc.t);
 const opt=v=>Array.from({length:cnt},(_,i)=>`<option value="${i+1}" ${i+1===v?'selected':''}>${toAr(i+1)}</option>`).join('');
 el.innerHTML=`<div class="card"><select class="sel" id="sr">${(l.length?l:[{number:1}]).map(s=>`<option value="${s.number}" ${s.number===rc.n?'selected':''}>${toAr(s.number)}. ${sname(s.number)}</option>`).join('')}</select>
 <div class="row"><span class="sub">من آية</span><select class="sel" id="fa" style="margin:0">${opt(rc.f)}</select><span class="sub">إلى</span><select class="sel" id="ta" style="margin:0">${opt(rc.t)}</select></div></div>
 <div class="card"><div id="tx" class="quran" style="--fs:28px;--lh:2.3">…</div></div>
 <div class="tc"><button class="playbig" id="mic" style="width:84px;height:84px;margin:6px auto" aria-label="ابدأ التلاوة">${icon('mic',34)}</button><div class="sub" id="ms">اضغط وابدأ القراءة</div></div>
 <div class="row" style="justify-content:center;margin:12px 0"><button class="btn tonal sm" id="rec">${icon('mic',16)} تسجيل صوتي</button><button class="btn ghost sm" id="pb" hidden>${icon('play',16)} إعادة الاستماع</button></div>
 <div id="res" class="card" hidden></div>
 <p class="sub tc">يقارن التطبيق كلماتك بنص القرآن كلمةً بكلمة، ولا يقيّم أحكام التجويد. يحتاج إنترنت في المتصفح. راجع معلّمًا أو مقرئًا للتأكد.</p>`;
 const $=s=>el.querySelector(s);let W=[],txt='',running=false,sr,mr,url;
 try{const [u]=await surah(rc.n);W=u.ayahs.filter(a=>a.numberInSurah>=rc.f&&a.numberInSurah<=rc.t).flatMap(a=>cut(rc.n,a,a.text).split(/\s+/).map(raw=>({raw,n:norm(raw)}))).filter(w=>w.n);
  $('#tx').innerHTML=W.map((w,i)=>`<span id="w${i}">${w.raw}</span>`).join(' ')}catch{$('#tx').textContent='النص يحتاج إنترنت أول مرة'}
 const show=h=>{$('#res').hidden=false;$('#res').innerHTML=h};
 const paint=fin=>{const H=norm(txt).split(/\s+/).filter(Boolean);if(!H.length&&!fin)return;
  const st=align(W.map(w=>w.n),H),last=fin?W.length:st.reduce((a,s,i)=>s>0?i+1:a,0);
  st.forEach((s,i)=>{const x=$('#w'+i);if(x)x.className=i<last?['w-miss','w-near','w-ok'][s]:''});
  const ok=st.filter(s=>s===2).length,nr=st.filter(s=>s===1).length,sc=W.length?Math.round((ok+.6*nr)/W.length*100):0;
  if(fin)show(`<div class="tc"><div class="bigdeg">${toAr(sc)}%</div><div class="sub">النتيجة</div></div><div class="legend" style="justify-content:center"><span class="w-ok">صحيحة ${toAr(ok)}</span><span class="w-near">قريبة ${toAr(nr)}</span><span class="w-miss">ناقصة أو خاطئة ${toAr(W.length-ok-nr)}</span></div><p class="sub" style="margin-top:10px">ما سمعه التطبيق: ${esc(txt||'—')}</p>`)};
 const ui=on=>{$('#mic').innerHTML=icon(on?'stop':'mic',34);$('#mic').classList.toggle('pulse',on);$('#ms').textContent=on?'جارٍ الاستماع… اضغط للإيقاف':'اضغط وابدأ القراءة'};
 const stop=fin=>{if(!running)return;running=false;try{sr?.stop()}catch{}if(NAT){NAT.stop().catch(()=>{});NAT.removeAllListeners()}ui(false);if(fin)paint(true)};
 const err=m=>{stop(false);show('<span class="err">تعذّر التعرّف على الصوت: '+esc(m)+'</span>')};
 const start=async()=>{txt='';running=true;ui(true);$('#res').hidden=true;
  try{
   if(NAT){await NAT.requestPermissions();await NAT.addListener('partialResults',d=>{txt=d.matches?.[0]||'';paint(false)});await NAT.start({language:'ar-SA',maxResults:1,partialResults:true,popup:false})}
   else if(SR){sr=new SR();sr.lang='ar-SA';sr.continuous=true;sr.interimResults=true;sr.onresult=e=>{txt=[...e.results].map(x=>x[0].transcript).join(' ');paint(false)};sr.onend=()=>stop(true);sr.onerror=ev=>err(ev.error);sr.start()}
   else err('المتصفح لا يدعم التعرّف على الصوت')
  }catch(e){err(e.message||'')}};
 el._off=()=>{stop(false);if(mr?.state==='recording')mr.stop()};
 el.onclick=async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.id==='mic')running?stop(true):start();
  if(b.id==='rec'){
   if(mr?.state==='recording'){mr.stop();return}
   try{const s=await navigator.mediaDevices.getUserMedia({audio:true}),ch=[];mr=new MediaRecorder(s);
    mr.ondataavailable=x=>ch.push(x.data);mr.onstop=()=>{s.getTracks().forEach(t=>t.stop());url=URL.createObjectURL(new Blob(ch));$('#pb').hidden=false;b.innerHTML=icon('mic',16)+' تسجيل صوتي'};
    mr.start();b.innerHTML=icon('stop',16)+' إيقاف التسجيل'}catch{toast('تعذّر الوصول إلى الميكروفون')}}
  if(b.id==='pb'&&url)new Audio(url).play()};
 el.onchange=e=>{const i=e.target.id,v=+e.target.value;
  if(i==='sr')S.set('rc',{n:v,f:1,t:Math.min(5,l[v-1]?.numberOfAyahs||5)});
  if(i==='fa')S.set('rc',{...rc,f:v,t:Math.max(v,rc.t)});if(i==='ta')S.set('rc',{...rc,t:v,f:Math.min(v,rc.f)});
  if(['sr','fa','ta'].includes(i)){el._off();render(el)}};
}
