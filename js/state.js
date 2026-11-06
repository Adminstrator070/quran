// Every user (and the guest) gets a separate storage namespace.
const id=()=>localStorage['noor:session']||'guest';
const k=x=>`noor:u:${id()}:${x}`;
export const S={
 get(x,d){try{const v=localStorage[k(x)];return v===undefined?d:JSON.parse(v)}catch{return d}},
 set(x,v){try{localStorage[k(x)]=JSON.stringify(v)}catch{}}
};
export const cfg=()=>{const sv=S.get('cfg',{}),c={font:28,lh:2.2,tajweed:false,tr:false,follow:false,theme:'auto',tafsir:'ar.jalalayn',...sv};if(sv.v!==2)c.tajweed=false;return c};
export const setCfg=o=>S.set('cfg',{...cfg(),v:2,...o});
export const lastRead=()=>{const L=S.get('last',null);return L&&typeof L==='object'?L:L?{n:L,a:1}:null};
