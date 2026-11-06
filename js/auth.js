// Local accounts: stored on this device only (no server). To get cloud accounts later, replace these functions.
const enc=new TextEncoder();
const hash=async s=>crypto.subtle?[...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join(''):btoa(unescape(encodeURIComponent(s)));
const users=()=>{try{return JSON.parse(localStorage['noor:users']||'{}')}catch{return{}}};
export const hasUsers=()=>Object.keys(users()).length>0;
export const uid=()=>localStorage['noor:session']||'';
export const display=()=>uid()==='guest'?'زائر':users()[uid()]?.display||'';
export async function register(id,name,pw){
 id=id.trim().toLowerCase();
 if(!/^[a-z0-9_.]{3,20}$/.test(id))throw Error('اسم المستخدم: 3 إلى 20 حرفًا إنجليزيًا أو أرقامًا');
 if(pw.length<4)throw Error('كلمة السر 4 أحرف على الأقل');
 const u=users();if(u[id])throw Error('اسم المستخدم مستخدم بالفعل');
 const salt=Math.random().toString(36).slice(2)+Date.now();
 u[id]={display:name.trim()||id,salt,hash:await hash(salt+pw)};
 localStorage['noor:users']=JSON.stringify(u);localStorage['noor:session']=id;
}
export async function login(id,pw){
 id=id.trim().toLowerCase();const x=users()[id];
 if(!x)throw Error('لا يوجد حساب بهذا الاسم. اختر «حساب جديد» لإنشاء حساب، أو تابع كزائر.');
 if(x.hash!==await hash(x.salt+pw))throw Error('كلمة المرور غير صحيحة');
 localStorage['noor:session']=id;
}
export const guest=()=>localStorage['noor:session']='guest';
export const logout=()=>localStorage.removeItem('noor:session');
export function deleteAccount(){
 const id=uid(),u=users();delete u[id];localStorage['noor:users']=JSON.stringify(u);
 Object.keys(localStorage).filter(k=>k.startsWith(`noor:u:${id}:`)).forEach(k=>localStorage.removeItem(k));
 localStorage.removeItem('noor:session');
}
