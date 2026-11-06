import {cfg} from './state.js';
const mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
export function applyTheme(){
 const t=cfg().theme,d=t==='dark'||(t==='auto'&&!!mq?.matches);
 document.documentElement.dataset.theme=d?'dark':'light';
 const m=document.querySelector('meta[name=theme-color]');if(m)m.content=d?'#06100c':'#d3e7de';
}
mq?.addEventListener?.('change',applyTheme);
