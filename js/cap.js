// Safe access to Capacitor native plugins. Inside the APK the bridge only guarantees window.Capacitor.Plugins,
// so registerPlugin() is used only when it really exists. Never throws.
export const isNative=()=>{try{return !!(window.Capacitor&&typeof window.Capacitor.isNativePlatform==='function'&&window.Capacitor.isNativePlatform())}catch{return false}};
export function plugin(name){
 try{const C=window.Capacitor;if(!C)return null;
  if(typeof C.registerPlugin==='function')return C.registerPlugin(name);
  if(C.Plugins&&C.Plugins[name])return C.Plugins[name];
 }catch{}
 return null;
}
