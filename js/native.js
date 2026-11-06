// Android app only: hardware back button closes sheets, goes back, and exits from Home.
import {isNative,plugin} from './cap.js';
export function initNative(){
 if(!isNative())return;
 try{const App=plugin('App');if(!App||!App.addListener)return;
  App.addListener('backButton',()=>{
   const sr=document.getElementById('sheetroot');
   if(sr&&sr.firstChild){sr.innerHTML='';return}
   if(location.hash&&location.hash!=='#/home'){history.length>1?history.back():(location.hash='#/home');return}
   if(App.exitApp)App.exitApp()})}catch{}
}
