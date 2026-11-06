import {surahs} from './api.js';
export let NAMES=[];
export const loadNames=async()=>{try{NAMES=await surahs()}catch{}return NAMES};
export const sname=n=>NAMES[n-1]?NAMES[n-1].name.replace(/^\S+\s+/,''):'سورة '+n;
