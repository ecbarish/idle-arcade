'use strict';
const KEY='realmbound-save-v1';
const $=s=>document.querySelector(s);
const {fmt,fmtI,fmtTime}=window.Arcade;
const R=Math.random, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rint=(a,b)=>a+Math.floor(R()*(b-a+1)), pick=a=>a[Math.floor(R()*a.length)];
let uidN=Date.now()%1e6;const uid=()=>++uidN;
const LEVEL_CAP=45;

