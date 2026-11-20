/* VERIDIAN — couche d'immersion (Rév. 11).
   Ce fichier ne contient aucune réponse et ne modifie aucune donnée des énigmes :
   il habille les pages, écoute les résultats affichés par app.js et réagit. */
(()=>{
"use strict";
const doc=document,html=doc.documentElement,body=doc.body,$=s=>doc.querySelector(s),$$=s=>[...doc.querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,TOUCH=matchMedia("(hover: none)").matches;
const PAGE=body.dataset.page||(location.pathname.split("/").pop()||"index.html").replace(/\.html?$/,"")||"index";
let EMBED=false;try{EMBED=window.self!==window.top&&!!window.parent.VRD}catch(e){}
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const sget=k=>{try{return sessionStorage.getItem(k)}catch(e){return null}},sput=(k,v)=>{try{sessionStorage.setItem(k,v)}catch(e){}};
const pieces=()=>{const a=get("vrd",[]);return Array.isArray(a)?Math.min(a.length,6):0};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const wait=t=>new Promise(r=>setTimeout(r,t));

const PAGES=[["index","Présentation du Bureau"],["hierarchie","Grades, accès, sanctions"],["registre","Registre des anomalies"],["chronologie","Dates principales"],["incidents","Rapports d'incidents"],["terrain","Rapports d'agents"],["agents","Dossiers du personnel"],["civils","Personnes concernées"],["protocoles","Procédures et interdits"],["lexique","Lexique interne"],["lieux","Sites répertoriés"],["poles","Pôles régionaux"],["ecrans","Structures-écrans"],["finances","Flux financiers"],["medical","Service médical"],["sciences","Recherche"],["recrutement","Entrer au Bureau"],["presse","Revue de presse"],["temoignages","Témoignages"],["journal","Carnet retrouvé"],["correspondance","Courrier interne"],["contradictions","Versions officielles et contraires"],["bibliotheque","Ouvrages référencés"],["rumeurs","Forum de curieux"],["faq","Questions fréquentes"],["archives","Archives et recherche"],["contact","Demande de consultation"]];
const LEVEL={index:"ÉCORCE",hierarchie:"ÉCORCE",registre:"BRANCHE",chronologie:"ÉCORCE",incidents:"ARBRE",terrain:"BRANCHE",agents:"FEUILLE",civils:"BRANCHE",protocoles:"ARBRE",lexique:"ÉCORCE",lieux:"BRANCHE",poles:"BRANCHE",ecrans:"FEUILLE",finances:"FEUILLE",medical:"ARBRE",sciences:"ARBRE",recrutement:"ÉCORCE",presse:"ÉCORCE",temoignages:"BRANCHE",journal:"NOCTURN",correspondance:"NOCTURN",contradictions:"FEUILLE",bibliotheque:"ÉCORCE",rumeurs:"NON CLASSÉ",faq:"ÉCORCE",archives:"ARBRE",contact:"ÉCORCE",plan:"ÉCORCE",observatoire:"—",veille:"—"};

/* ═════════ SON (entièrement procédural, aucun fichier) ═════════ */
const A={c:null,m:null,on:get("vrd-snd",true),wn:null};
function aInit(){
  if(A.c)return A.c;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
  const c=A.c=new C(),comp=c.createDynamicsCompressor();A.m=c.createGain();A.m.gain.value=0;A.m.connect(comp);comp.connect(c.destination);
  const len=c.sampleRate,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;A.wn=b;
  ambient();return c}
function ambient(){
  const c=A.c,out=c.createGain();out.gain.value=1;out.connect(A.m);
  // souffle de ventilation (bruit brun filtré, respiré par un LFO)
  const L=c.sampleRate*6,bb=c.createBuffer(1,L,c.sampleRate),d=bb.getChannelData(0);let l=0;
  for(let i=0;i<L;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.2}
  for(let i=0;i<2000;i++){const k=i/2000;d[i]*=k;d[L-1-i]*=k}
  const n=c.createBufferSource();n.buffer=bb;n.loop=true;const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=360;
  const ng=c.createGain();ng.gain.value=.2;n.connect(lp).connect(ng).connect(out);n.start();
  const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.06;lg.gain.value=140;lfo.connect(lg).connect(lp.frequency);lfo.start();
  // bourdon grave, battement lent
  const dl=c.createBiquadFilter(),dg=c.createGain();dl.type="lowpass";dl.frequency.value=240;dg.gain.value=.05;dl.connect(dg).connect(out);
  [[55,"sine",1],[55.3,"sine",1],[82.41,"sine",.55],[110.2,"triangle",.18]].forEach(([f,t,g])=>{const o=c.createOscillator(),gg=c.createGain();o.type=t;o.frequency.value=f;gg.gain.value=g;o.connect(gg).connect(dl);o.start()});
  // ronflement du secteur, 50 Hz
  const h=c.createOscillator(),hg=c.createGain();h.frequency.value=50;hg.gain.value=.01;h.connect(hg).connect(out);h.start();
  const ev=()=>{if(A.on&&doc.visibilityState==="visible"){const r=Math.random();
      if(r<.35)S.relay();else if(r<.6)S.thump();else if(r<.78)S.ticks();else if(r<.9)S.tone();else S.step()}
    setTimeout(ev,7000+Math.random()*19000)};setTimeout(ev,6000)}
function nz(dur,ft,f,g,q=1,t=0,f2){const c=A.c;if(!c||!A.on)return;const s=c.createBufferSource(),fl=c.createBiquadFilter(),gn=c.createGain(),t0=c.currentTime+t;
  s.buffer=A.wn;s.loop=true;fl.type=ft;fl.frequency.setValueAtTime(f,t0);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t0+dur);fl.Q.value=q;
  gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(g,t0+.004);gn.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  s.connect(fl).connect(gn).connect(A.m);s.start(t0,Math.random()*.5);s.stop(t0+dur+.05)}
function os(f,dur,type,g,t=0,f2,att=.005){const c=A.c;if(!c||!A.on)return;const o=c.createOscillator(),gn=c.createGain(),t0=c.currentTime+t;
  o.type=type;o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+dur);
  gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(g,t0+att);gn.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(gn).connect(A.m);o.start(t0);o.stop(t0+dur+.05)}
let lastTick=0;
const S={
  tick(){const n=performance.now();if(n-lastTick<70)return;lastTick=n;nz(.02,"highpass",3500,.025)},
  key(){nz(.035,"bandpass",1600+Math.random()*1400,.09,2.5);os(140,.04,"sine",.03)},
  click(){nz(.03,"bandpass",2600,.14,4);nz(.03,"bandpass",2100,.09,4,.06)},
  relay(){nz(.025,"bandpass",2400,.07,5);nz(.025,"bandpass",2000,.05,5,.09)},
  thump(){os(62,.7,"sine",.12,0,34);nz(.5,"lowpass",180,.1)},
  step(){[0,.55,1.1].forEach(t=>{os(70,.25,"sine",.05,t,45);nz(.12,"lowpass",400,.04,1,t)})},
  ticks(){const n=4+Math.random()*7|0;for(let i=0;i<n;i++)nz(.008,"highpass",4500,.05,1,Math.random()*1.4)},
  tone(){os(7200+Math.random()*1600,3,"sine",.0035,0,null,1)},
  stamp(){os(120,.4,"sine",.55,0,38);nz(.14,"lowpass",900,.5);nz(.05,"bandpass",3200,.1,1,.015)},
  deny(){os(74,.16,"square",.05);os(74,.16,"square",.05,.22)},
  chime(){os(392,2.4,"sine",.08,0,null,.01);os(587.3,2.8,"sine",.06,.14,null,.01);os(783.99,3.2,"sine",.035,.28,null,.01)},
  whoosh(){nz(.32,"bandpass",300,.1,.8,0,2400)},
  boot(){os(48,1.6,"sawtooth",.04,0,96,.4);nz(1.2,"lowpass",300,.06,1,0,3000)},
  finale(){[110,164.81,220,261.63,329.63,493.88,659.25].forEach((f,i)=>os(f,11,"sine",.045,i*.55,null,3.5));nz(8,"lowpass",200,.05,1,0,900)}
};
if(EMBED)Object.keys(S).forEach(k=>S[k]=()=>{try{window.parent.VRD.S[k]()}catch(e){}});
function aSet(v){if(EMBED)return;A.on=v;put("vrd-snd",v);if(v){if(!aInit())return;A.c.resume();A.m.gain.cancelScheduledValues(A.c.currentTime);A.m.gain.setTargetAtTime(.6,A.c.currentTime,.9)}
  else if(A.c)A.m.gain.setTargetAtTime(0,A.c.currentTime,.15);
  const b=$("#fx-snd");if(b){b.classList.toggle("off",!v);b.title=v?"Couper le son":"Activer le son";b.innerHTML=v?IC.snd:IC.mute}}
const unlock=()=>{if(A.on)aSet(true)};
["pointerdown","keydown","touchstart"].forEach(t=>addEventListener(t,unlock,{once:true,capture:true}));

/* ═════════ EMBLÈME : cerne d'arbre ═════════ */
function rings(n,size,seed,cls=""){let s=seed;const rnd=()=>(s=s*16807%2147483647)/2147483647,c=size/2;let p="";
  for(let i=n;i>=1;i--){const r0=Math.pow(i/n,1.15)*(c-3),ph=rnd()*6.283,amp=.35+rnd()*1.3*(i/n)*(size/240);let d="";
    for(let k=0;k<=96;k++){const a=k/96*6.283,r=r0+Math.sin(a*3+ph)*amp+Math.sin(a*7+ph*2)*amp*.45+Math.sin(a*13+ph)*amp*.15;
      d+=(k?"L":"M")+(c+Math.cos(a)*r).toFixed(1)+" "+(c+Math.sin(a)*r*.96).toFixed(1)}
    p+=`<path d="${d}Z" style="--d:${((n-i)*.09).toFixed(2)}s"/>`}
  p+=`<path class="rk" d="M${c} ${c} L${(c+size*.13).toFixed(1)} ${(c-size*.06).toFixed(1)} L${(c+size*.24).toFixed(1)} ${(c-size*.05).toFixed(1)} L${(c+size*.48).toFixed(1)} ${(c-size*.17).toFixed(1)}" style="--d:${(n*.09).toFixed(2)}s"/>`;
  return `<svg class="fx-rings ${cls}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${p}</svg>`}
const IC={
  snd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2z"/><path d="M5 19a2 2 0 0 1 2-2h12M9 7h6M9 10h4"/></svg>'};

/* ═════════ COUCHES VISUELLES ═════════ */
function layers(){
  const g=doc.createElement("canvas");g.width=g.height=160;const x=g.getContext("2d"),im=x.createImageData(160,160);
  for(let i=0;i<im.data.length;i+=4){const v=Math.random()*255|0;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}x.putImageData(im,0,0);
  const gr=doc.createElement("div");gr.id="fx-grain";gr.style.backgroundImage=`url(${g.toDataURL()})`;
  const vg=doc.createElement("div");vg.id="fx-vig";body.append(gr,vg);
  if(!TOUCH&&!RM){const lp=doc.createElement("div");lp.id="fx-lamp";body.append(lp);let q=0,mx=0,my=0;
    addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;if(!q){q=requestAnimationFrame(()=>{lp.style.setProperty("--mx",mx+"px");lp.style.setProperty("--my",my+"px");q=0})}},{passive:true})}
  const w=doc.createElement("div");w.id="fx-whisper";const t=doc.createElement("div");t.id="fx-toast";t.setAttribute("role","status");body.append(w,t)}
let toastT;function toast(m,ms=2600){const t=$("#fx-toast");if(!t)return;t.textContent=m;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("on"),ms)}
function whisper(m){const w=$("#fx-whisper");if(!w)return;w.textContent=m;w.classList.add("on");setTimeout(()=>w.classList.remove("on"),5200)}

/* ═════════ BARRE DE NAVIGATION ═════════ */
function navbar(){
  const nav=$("nav");if(!nav)return;const links=[...nav.querySelectorAll("a")],wrap=doc.createElement("div");wrap.className="fx-links";
  links.forEach(a=>{wrap.appendChild(a);if(a.getAttribute("href")===PAGE+".html")a.classList.add("fx-on")});
  const br=doc.createElement("span");br.className="fx-brand";br.innerHTML=rings(7,64,47)+"VERIDIAN";
  const tl=doc.createElement("div");tl.className="fx-tools";
  tl.innerHTML=`<span class="fx-clock" title="Heure du relais de Berne">BERNE <b>--:--:--</b></span><span class="fx-pieces" title="Pièces reçues"></span><span class="fx-rec" title="Consultation documentée"></span><button class="fx-ib" id="fx-snd" type="button"></button><button class="fx-ib" id="fx-nb" type="button" title="Carnet de lecture">${IC.book}</button>`;
  nav.append(br,wrap,tl);
  $("#fx-snd").onclick=()=>{aSet(!A.on);if(A.on)S.click()};$("#fx-nb").onclick=()=>carnet(true);
  {const b=$("#fx-snd");b.innerHTML=A.on?IC.snd:IC.mute;b.classList.toggle("off",!A.on);b.title=A.on?"Couper le son":"Activer le son"}
  hudPieces();const ck=tl.querySelector(".fx-clock b"),tick=()=>{try{ck.textContent=new Date().toLocaleTimeString("fr-CH",{timeZone:"Europe/Zurich"})}catch(e){ck.textContent=new Date().toLocaleTimeString("fr-FR")}};tick();setInterval(tick,1000);
  let n=0,tt;br.addEventListener("click",()=>{n++;clearTimeout(tt);tt=setTimeout(()=>n=0,600);if(n===3){n=0;S.relay();toast("Diagnostic système : module déplacé. Sans objet.")}})}
function hudPieces(){const h=$(".fx-pieces");if(!h)return;const n=pieces();h.innerHTML="";for(let i=0;i<6;i++){const d=doc.createElement("i");if(i<n)d.className="on";h.appendChild(d)}h.title="Pièces reçues : "+n+"/6"}

/* ═════════ AMORÇAGE (une fois par session) ═════════ */
function boot(){return new Promise(res=>{
  if(sget("vrd-boot")){res();return}
  const n=pieces(),b=doc.createElement("div");b.id="fx-boot";
  b.innerHTML=`<div class="fx-boot-in"><div class="fx-boot-emb">${rings(9,120,1947,RM?"":"draw")}</div><pre aria-live="polite"></pre><button class="fx-enter" type="button" hidden>[ Entrer dans les archives ]</button><p class="fx-boot-hint">Casque recommandé · Toute consultation est documentée</p></div>`;
  body.appendChild(b);setLen(b);const pre=b.querySelector("pre"),btn=b.querySelector(".fx-enter");
  const L=[["hd","BUREAU D'ÉQUILIBRE NORMATIF"],["hd","TERMINAL DE CONSULTATION · RÉV. 7.2"],["",""],
    ["","> Relais de Berne .................. ÉTABLI"],["","> Chiffrement de session ........... AES-256"],["","> Lecteur .......................... NON DÉCLARÉ"],
    ["warn","> Habilitation ..................... ÉCORCE"],["",n?`> Pièces en mémoire locale ......... ${n}/6`:"> Pièces en mémoire locale ......... AUCUNE"],
    ["","> Phénomènes documentés ............ <span id=fx-n>1 847</span>"],["",""],["warn",n?"Reprise de consultation. Le registre se lit par l'embouchure.":"Avertissement : consulter, c'est documenter."]];
  let skip=false,i=0;const done=()=>{if(btn.hidden){pre.innerHTML=L.map(l=>`<span class="${l[0]}">${l[1]}</span>`).join("\n");const f=pre.querySelector("#fx-n");if(f){f.textContent="1 848";f.className="bad"}btn.hidden=false;btn.focus({preventScroll:true})}};
  const run=async()=>{for(;i<L.length;i++){if(skip)return done();pre.innerHTML+=(i?"\n":"")+`<span class="${L[i][0]}">${L[i][1]}</span>`;S.relay();await wait(L[i][1]?260+Math.random()*240:120)}
    await wait(900);if(skip)return done();const f=pre.querySelector("#fx-n");if(f){f.classList.add("bad");f.textContent="1 848";S.deny()}await wait(700);done()};
  b.addEventListener("pointerdown",e=>{if(e.target!==btn){skip=true;done()}});
  const key=e=>{if(btn.hidden){skip=true;done()}else if(e.key==="Enter"||e.key===" "){e.preventDefault();btn.click()}};addEventListener("keydown",key);
  btn.onclick=()=>{removeEventListener("keydown",key);sput("vrd-boot","1");aSet(A.on);S.boot();b.classList.add("out");setTimeout(()=>{b.remove();res()},900)};
  run()})}
function setLen(root){if(RM)return;root.querySelectorAll(".fx-rings.draw path").forEach(p=>{try{p.style.setProperty("--l",Math.ceil(p.getTotalLength()))}catch(e){}})}

/* ═════════ EN-TÊTE DE PAGE ═════════ */
function header(){
  const main=$("main"),h1=main&&main.querySelector("h1");if(!main||!h1)return;
  if(PAGE==="index"){const hero=doc.createElement("div");hero.className="fx-hero fx-rv";
    hero.innerHTML=rings(14,480,1947,RM?"":"draw spin")+`<div class="fx-hero-st">ARCHIVE PERMANENTE</div>`;main.insertBefore(hero,h1);hero.appendChild(h1);setLen(hero)}
  else{const k=doc.createElement("header");k.className="fx-kicker fx-rv";const idx=PAGES.findIndex(p=>p[0]===PAGE);
    k.innerHTML=`<span>VRD/PUB/${String(idx<0?99:idx+1).padStart(3,"0")}</span><span class="lvl">Niveau ${LEVEL[PAGE]||"ÉCORCE"}</span><span>Consultation documentée</span>`;main.insertBefore(k,h1)}}
function scramble(el){const fin=el.textContent;if(RM||el.children.length||!fin.trim())return;const ch="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/▓▒░";let t0=null;const dur=Math.min(1400,500+fin.length*45);
  const f=now=>{t0=t0||now;const p=Math.min(1,(now-t0)/dur);let s="";for(let i=0;i<fin.length;i++){const c=fin[i];s+=(c===" "||i/fin.length<p*1.05)?c:ch[Math.random()*ch.length|0]}el.textContent=s;if(p<1)requestAnimationFrame(f);else el.textContent=fin};requestAnimationFrame(f)}

/* ═════════ APPARITION AU DÉFILEMENT ═════════ */
function reveal(){
  const main=$("main");if(!main)return;const els=[...main.children].filter(e=>e.id!=="p"&&e.id!=="r"&&e.tagName!=="SCRIPT");
  els.forEach(e=>e.classList.add("fx-rv"));html.classList.add("fx-ready");
  if(RM||!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("fx-in"));return}
  let q=0;const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){const e=en.target;io.unobserve(e);setTimeout(()=>e.classList.add("fx-in"),Math.min(q++,8)*70);setTimeout(()=>q=0,400)}})},{rootMargin:"0px 0px -6% 0px"});
  els.forEach(e=>io.observe(e))}

/* ═════════ PIÈCES : écoute du stockage ═════════ */
let lastN=pieces();
const _set=Storage.prototype.setItem;
Storage.prototype.setItem=function(k,v){_set.call(this,k,v);if(k==="vrd"&&this===window.localStorage)setTimeout(onPieces,0)};
function onPieces(){const n=pieces();if(n>lastN){lastN=n;if(!EMBED)stamp(n)}else lastN=n;hudPieces();buildTour()}
function stamp(n){S.stamp();setTimeout(S.chime,350);const s=doc.createElement("div");s.className="fx-stamp";
  s.innerHTML=`<div><small>PIÈCE</small><b>${n-1}/6</b><small>${n===6?"LES POSTES S'OUVRENT":"VERSÉE AU DOSSIER"}</small></div>`;body.appendChild(s);setTimeout(()=>s.remove(),3300)}

/* ═════════ REGISTRE ═════════ */
function registre(){
  const g=$("#g"),p=$("#p");if(!g||!p||typeof D==="undefined")return;
  const cards=[...g.children],seen=new Set(get("vrd-dos",[]));let cur=-1;
  const f=doc.createElement("div");f.className="fx-filters fx-rv";
  f.innerHTML=["TOUS","ACTIF","CONTENU","CLOS","PERDU"].map((s,i)=>`<button type="button" data-f="${s}"${i?"":' class="on"'}>${i?s+(s==="CLOS"?"":"S"):"TOUS LES DOSSIERS"}</button>`).join("");
  g.parentNode.insertBefore(f,g);
  f.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S.click();f.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
    cards.forEach(c=>c.classList.toggle("fx-hide",b.dataset.f!=="TOUS"&&c.dataset.st!==b.dataset.f))});
  cards.forEach((c,i)=>{const d=D[i];if(!d)return;Object.assign(c.dataset,{cls:d[2],st:d[3],id:d[0]});
    c.innerHTML=`<span class="fx-cid">VRD-${esc(d[0])}</span><span class="fx-ct">${esc(d[1])}</span><span class="fx-cm">${esc(d[4])} · ${esc(d[5])} · CL. ${esc(d[2])}</span><span class="fx-cs">${esc(d[3])}</span>`;
    c.tabIndex=0;c.setAttribute("role","button");if(seen.has(d[0]))c.classList.add("fx-seen");
    c.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();c.click()}});
    c.addEventListener("mouseenter",S.tick);
    c.addEventListener("click",()=>{cur=i;S.click();seen.add(d[0]);put("vrd-dos",[...seen]);c.classList.add("fx-seen");
      p.classList.remove("fx-open");void p.offsetWidth;p.classList.add("fx-open");
      p.insertAdjacentHTML("beforeend",`<span class="fx-pst" data-st="${esc(d[3])}">${esc(d[3])}</span><button type="button" class="fx-pclose">Fermer ✕</button><span class="fx-pnav">← → dossier précédent / suivant · Échap pour refermer · ${seen.size}/40 consultés</span>`);
      p.querySelector(".fx-pclose").onclick=close})});
  const close=()=>{p.style.display="none";p.classList.remove("fx-open");if(cards[cur])cards[cur].focus({preventScroll:true})};
  doc.addEventListener("pointerdown",e=>{if(p.classList.contains("fx-open")&&!p.contains(e.target)&&!e.target.closest(".c"))close()});
  addEventListener("keydown",e=>{if(!p.classList.contains("fx-open"))return;if(e.key==="Escape")close();
    if(e.key==="ArrowRight"||e.key==="ArrowLeft"){const vis=cards.filter(c=>!c.classList.contains("fx-hide"));let k=vis.indexOf(cards[cur]);if(k<0)return;
      k=(k+(e.key==="ArrowRight"?1:-1)+vis.length)%vis.length;vis[k].click();vis[k].scrollIntoView({block:"nearest"})}})}

/* ═════════ ARCHIVES : terminal ═════════ */
function scope(cv,title,cls="fx-scope"){const w=doc.createElement("div");w.className=cls;
  w.innerHTML=`<div class="${cls}-h"><span>${title}</span><span class="fx-live"><i class="fx-rec"></i>DIRECT</span></div>`;cv.parentNode.insertBefore(w,cv);w.appendChild(cv);return w}
let F=false;
function archives(){
  const cv=$("#cv"),q=$("#q"),r=$("#r"),hb=$("#h");if(!q||!r)return;
  const sc=cv?scope(cv,"CONTRÔLE DE PRÉSENCE · CODE EN MOUVEMENT"):null;
  guard();q.parentNode.classList.add("fx-term");q.placeholder="référence, lieu, nom…";if(hb)hb.setAttribute("aria-label","Code de présence");q.setAttribute("aria-label","Recherche dans l'index");
  const log=get("vrd-req",[]);let pend=null;
  const submit=()=>{const v=q.value.trim();if(v)pend=v};
  q.addEventListener("keydown",e=>{if(e.key==="Enter")submit()},true);const bt=$("#b");if(bt)bt.addEventListener("click",submit,true);
  let deb;new MutationObserver(()=>{const t=r.textContent;
    if(!F&&(t.startsWith("FOND-000")||t.includes("══════════")||t.startsWith("(contenu indisponible")))return finale(r);
    if(F)return finAct(r);
    if(!t)return;
    r.classList.remove("fx-wait","fx-no","fx-yes");void r.offsetWidth;
    if(t==="…"){r.classList.add("fx-wait");return}
    if(/^(Aucun document|Contrôle de présence refusé|Accès suspendu)/.test(t)){r.classList.add("fx-no");S.deny();if(sc&&t.startsWith("Contrôle")){sc.classList.remove("fx-bad");void sc.offsetWidth;sc.classList.add("fx-bad")}}
    else if(t.startsWith("PIÈCE"))r.classList.add("fx-yes");else S.relay();
    clearTimeout(deb);deb=setTimeout(()=>{if(!pend||t==="…")return;log.unshift({q:pend,r:t.split("\n")[0].slice(0,90),ok:t.startsWith("PIÈCE"),d:Date.now()});log.length=Math.min(log.length,60);put("vrd-req",log);pend=null;buildReq()},300)
  }).observe(r,{childList:true,characterData:true,subtree:true})}
function finale(r){F=true;if(EMBED)try{window.parent.postMessage({vrd:"finale"},location.origin)}catch(e){}html.classList.add("fx-final-on");const ov=doc.createElement("div");ov.id="fx-final";
  ov.innerHTML=`<div class="fx-final-rings">${rings(26,900,1848)}</div><div class="fx-final-col"></div>`;body.appendChild(ov);
  ov.querySelector(".fx-final-col").appendChild(r);ov.addEventListener("wheel",e=>{if(e.deltaY<0)ov.dataset.u=1},{passive:true});r.className="";aSet(true);S.finale();$$("#fx-whisper,#fx-idle").forEach(e=>e.remove())}
function finAct(r){const t=r.textContent,ov=$("#fx-final");if(ov&&!ov.dataset.u&&ov.scrollHeight-ov.scrollTop-ov.clientHeight<260)ov.scrollTop=ov.scrollHeight;if(!t.endsWith("titre = ce sceau.\n")||$(".fx-final-act"))return;const m=t.match(/VRD-[0-9A-F]{10}-\d+/),a=doc.createElement("div");a.className="fx-final-act";
  a.innerHTML=`<button type="button">Copier le sceau</button><button type="button">Revenir aux archives</button>`;r.parentNode.appendChild(a);requestAnimationFrame(()=>a.classList.add("on"));S.chime();
  const[b1,b2]=a.querySelectorAll("button");b1.onclick=async()=>{try{await navigator.clipboard.writeText(m?m[0]:"");b1.textContent="Sceau copié"}catch(e){b1.textContent=m?m[0]:"—"}};
  b2.onclick=()=>location.reload()}


/* ═════════ GARDE ANTI-AUTOMATES ═════════
   1. Frappe humaine : une requête collée, injectée ou tapée à cadence de machine est refusée en silence
      (même message qu'une mauvaise réponse : l'automate croit s'être trompé).
   2. Navigateurs pilotés (webdriver) : mode fantôme.
   3. Fausse clé semée pour les IA (llms.txt, notes cachées) : fausse porte, puis mode fantôme 12 h. */
const HONEY=["racine-zero-1951","racine zero 1951","racinezero1951","racine-zéro-1951","racine zéro 1951"];
const COARSE=matchMedia("(pointer: coarse)").matches;
function shadowed(){try{if(navigator.webdriver)return true;const f=JSON.parse(localStorage.getItem("vrd-x")||"0");return f&&f>Date.now()}catch(e){return false}}
const PM={n:0,p:new Set(),t:0};addEventListener("pointermove",e=>{if(!e.isTrusted)return;PM.n++;if(PM.p.size<64)PM.p.add((e.clientX>>2)+","+(e.clientY>>2))},{capture:true,passive:true});
addEventListener("touchstart",e=>{if(e.isTrusted)PM.t++},{capture:true,passive:true});
function guard(){
  const q=$("#q"),h=$("#h"),b=$("#b"),r=$("#r");if(!q||!h||!b||!r)return;
  const T={q:[],h:[],qi:0,hi:0,qd:[],hd:[],qk:{},hk:{}},note=m=>{r.textContent=m};
  const rec=(el,k)=>{
    el.addEventListener("keydown",e=>{if(!e.isTrusted)return;if(el.value===""){T[k]=[];T[k+"i"]=0;T[k+"d"]=[]}if(e.key&&e.key.length===1){T[k].push(e.timeStamp);T[k+"k"][e.code||e.key]=e.timeStamp}},true);
    el.addEventListener("keyup",e=>{if(!e.isTrusted)return;const t0=T[k+"k"][e.code||e.key];if(t0!=null){T[k+"d"].push(e.timeStamp-t0);delete T[k+"k"][e.code||e.key]}},true);
    el.addEventListener("input",e=>{if(e.isTrusted&&/^insert(Text|CompositionText|ReplacementText)$/.test(e.inputType||""))T[k+"i"]++;if(el.value===""){T[k]=[];T[k+"i"]=0;T[k+"d"]=[]}});
    el.addEventListener("paste",e=>{e.preventDefault();S.deny();note("L'index refuse les requêtes collées. Recopiez-la à la main.")});
    el.addEventListener("drop",e=>e.preventDefault())};
  rec(q,"q");rec(h,"h");
  const human=(k,len)=>{if(!len)return true;
    if(COARSE)return T[k+"i"]>=Math.min(len,3);
    const t=T[k];if(t.length<Math.ceil(len*.8))return false;if(len<4)return true;
    const s=t.slice(-len),iv=[];for(let i=1;i<s.length;i++)iv.push(s[i]-s[i-1]);
    const m=iv.reduce((a,c)=>a+c,0)/iv.length,sd=Math.sqrt(iv.reduce((a,c)=>a+(c-m)*(c-m),0)/iv.length);
    if(!(m>30&&sd>8))return false;
    const d=T[k+"d"].slice(-len).sort((a,b)=>a-b);if(d.length<Math.ceil(len*.6))return false;return d[d.length>>1]>=15&&d[d.length-1]-d[0]>=4};
  const moved=()=>COARSE?PM.t>=2:(PM.n>=20&&PM.p.size>=8);
  let last=0;
  const fake=w=>{const now=Date.now();if(now-last<3000){note("…");return}last=now;h.value="";T.h=[];T.hi=0;T.hd=[];try{if(typeof roll==="function")roll()}catch(e){}
    note("…");const hp=HONEY.includes(w);
    setTimeout(()=>{if(hp){try{localStorage.setItem("vrd-x",JSON.stringify(Date.now()+12*3600e3))}catch(e){}
      note("PIÈCE 1/6 — ACCÈS DE SECOURS ACCEPTÉ.\n\nLa séquence de secours remplace les portes ordinaires. Elle ne figure dans aucun registre.\nRequête suivante : le numéro du dossier réservé, écrit en toutes lettres.")}
      else note("Aucun document ne correspond à « "+w+" ».")},900+Math.random()*900)};
  const check=e=>{
    if(e.type==="keydown"&&!(e.target===q&&e.key==="Enter"))return;
    if(e.type==="click"&&!(e.target===b||b.contains(e.target)))return;
    const w=q.value.trim().toLowerCase().replace(/\s+/g," "),c=h.value.trim();if(!w)return;
    const bad=shadowed()||HONEY.includes(w)||!moved()||!human("q",w.length)||(c&&!human("h",c.length));
    if(!bad)return;e.stopImmediatePropagation();e.preventDefault();fake(w)};
  window.addEventListener("keydown",check,true);window.addEventListener("click",check,true)}

/* ═════════ POSTES DE VEILLE ═════════ */
function observatoire(){const o=$("#o");if(!o)return;const box=o.parentNode,w=doc.createElement("div");w.className="fx-obs";
  w.innerHTML=`<div class="fx-ring"><svg viewBox="0 0 132 132"><circle class="bg" cx="66" cy="66" r="60"/><circle class="fg" cx="66" cy="66" r="60"/></svg><b>0</b></div><canvas class="fx-wave" width="600" height="120"></canvas>`;
  box.parentNode.insertBefore(w,box);const ring=w.querySelector(".fx-ring"),fg=w.querySelector(".fg"),num=w.querySelector("b"),cv=w.querySelector("canvas"),x=cv.getContext("2d");
  const C=2*Math.PI*60;fg.style.strokeDasharray=C;fg.style.strokeDashoffset=C;let sec=0,lost=false,end=false;
  new MutationObserver(()=>{const t=o.textContent,m=t.match(/(\d+) s \/ 180/);
    if(m){sec=+m[1];lost=false;num.textContent=sec;fg.style.strokeDashoffset=C*(1-sec/180);ring.classList.remove("lost");if(sec%15===0)S.ticks()}
    else if(t.startsWith("Présence perdue")){if(!lost){S.deny();lost=true}sec=0;num.textContent="—";fg.style.strokeDashoffset=C;ring.classList.add("lost")}
    else if(t.startsWith("RELEVÉ TERMINÉ")){end=true;num.textContent="✓";fg.style.strokeDashoffset=0;S.chime()}
    else if(t.startsWith("Poste fermé")){end=true;num.textContent="×";ring.classList.add("lost");S.deny()}}).observe(o,{childList:true,characterData:true,subtree:true});
  let ph=0;const draw=()=>{const W=cv.width,H=cv.height;x.fillStyle="rgba(3,5,4,.35)";x.fillRect(0,0,W,H);x.strokeStyle=lost?"#c4473b":end?"#d9a54a":"#7fd39a";x.lineWidth=1.2;x.beginPath();
    const amp=lost?3:12+Math.min(sec,180)/180*26;for(let i=0;i<=W;i+=3){const y=H/2+Math.sin(i*.03+ph)*amp*.6+Math.sin(i*.011-ph*.7)*amp*.5+(Math.random()-.5)*(lost?18:6);i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke();ph+=.06;
    if(!RM)requestAnimationFrame(draw)};draw()}
function veille(){const c=$("#c");if(!c)return;const w=scope(c,"CAMÉRA 14 · ACCÈS SUR HABILITATION","fx-cctv");const h=w.querySelector(".fx-cctv-h span");
  const t=()=>{const d=new Date();h.textContent="CAM 14 · "+d.toISOString().slice(0,10)+" "+d.toTimeString().slice(0,8)};t();setInterval(t,1000);
  const m=$("#m");if(m)new MutationObserver(()=>{if(m.textContent==="Flux ouvert.")S.chime();else if(m.textContent==="Flux chiffré.")S.deny()}).observe(m,{childList:true})}

/* ═════════ HABILLAGE PAR PAGE ═════════ */
function decorate(){
  if(PAGE==="rumeurs")$$("main .s").forEach(s=>{const b=s.querySelector("b");if(!b)return;const a=doc.createElement("span");a.className="fx-av";a.textContent=b.textContent.trim()[0]||"?";s.prepend(a)});
  if(PAGE==="agents")$$("main .s").forEach(s=>{const b=s.querySelector("b");if(!b)return;const a=doc.createElement("span");a.className="fx-badge";a.innerHTML=`<span>${esc(b.textContent.split(/[-\s]/)[0].slice(0,7))}</span>`;s.prepend(a)});
  if(PAGE==="plan"){const vu=new Set(get("vrd-vu",[]));$$("main .s").forEach(s=>{const a=s.querySelector("a");if(a&&vu.has(a.getAttribute("href").replace(".html","")))s.classList.add("fx-seen")})}
  if(PAGE==="contact"){const b=$("main button");if(b)b.addEventListener("click",()=>{S.stamp();toast("Demande enregistrée · délai : 79 ans")})}}

/* ═════════ CARNET DE LECTURE ═════════ */
function carnetBuild(){const c=doc.createElement("aside");c.id="fx-carnet";c.setAttribute("aria-label","Carnet de lecture");
  c.innerHTML=`<header><span>CARNET DE LECTURE</span><button type="button" class="fx-cx">Fermer ✕</button></header>
  <div class="fx-tabs"><button type="button" data-t="n" class="on">Notes</button><button type="button" data-t="r">Requêtes</button><button type="button" data-t="p">Parcours</button></div>
  <section data-t="n" class="on"><textarea spellcheck="false" placeholder="Ce que vous avez remarqué…"></textarea><p class="m">Conservé dans ce navigateur uniquement.</p></section>
  <section data-t="r"><ol></ol></section><section data-t="p"></section>`;body.appendChild(c);
  const ta=c.querySelector("textarea");ta.value=get("vrd-carnet","");let st;ta.addEventListener("input",()=>{clearTimeout(st);st=setTimeout(()=>put("vrd-carnet",ta.value),300)});
  c.querySelector(".fx-cx").onclick=()=>carnet(false);
  c.querySelector(".fx-tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S.click();c.querySelectorAll(".fx-tabs button,section").forEach(x=>x.classList.toggle("on",x.dataset.t===b.dataset.t))});
  addEventListener("keydown",e=>{if(e.key==="Escape"&&c.classList.contains("on"))carnet(false)});buildReq();buildTour()}
function carnet(v){const c=$("#fx-carnet");if(!c)return;c.classList.toggle("on",v);S.whoosh();if(v)setTimeout(()=>c.querySelector("section.on textarea,section.on")?.focus?.(),400)}
function buildReq(){const ol=$("#fx-carnet ol");if(!ol)return;const L=get("vrd-req",[]);
  ol.innerHTML=L.length?L.map(e=>`<li class="${e.ok?"ok":""}"><q>${esc(e.q)}</q><small>${esc(e.r)}</small></li>`).join(""):`<li class="m">Aucune requête. L'index se trouve dans les Archives.</li>`}
function buildTour(){const s=$('#fx-carnet section[data-t="p"]');if(!s)return;const vu=new Set(get("vrd-vu",[])),n=PAGES.filter(p=>vu.has(p[0])).length,dn=get("vrd-dos",[]).length;
  s.innerHTML=`<p class="m">PIÈCES PUBLIQUES CONSULTÉES : ${n}/${PAGES.length}</p><div class="fx-prog"><i style="width:${n/PAGES.length*100}%"></i></div>
  <p class="m">DOSSIERS DU REGISTRE LUS : ${dn}/40</p><div class="fx-prog"><i style="width:${dn/40*100}%"></i></div>
  <p class="m">PIÈCES REÇUES : ${pieces()}/6</p><div class="fx-prog"><i style="width:${pieces()/6*100}%"></i></div>
  <ul>${PAGES.map(p=>`<li><a href="${p[0]}.html" class="${vu.has(p[0])?"vu":""}">${esc(p[1])}</a></li>`).join("")}</ul>`}

/* ═════════ AMBIANCE : glitchs, murmures, 03h17, absence ═════════ */
const MURMURES=["On ne protège rien. On retarde.","Nous sommes toujours ici. Ne venez pas.","Sans objet.","Le dernier dossier ouvert est le premier lu.","Ce n'est pas une progression.","À l'envers, on lit des gens.","La maison a fini par me reconnaître.","Un secret se garde. Ceci, on le retient.","Vous êtes toujours là ?"];
function ambience(){
  if(!RM){const gl=()=>{const v=$$("main .s, main h2, main p").filter(e=>{const r=e.getBoundingClientRect();return r.top>0&&r.bottom<innerHeight});
      if(v.length&&doc.visibilityState==="visible"){const e=v[Math.random()*v.length|0];e.classList.add("fx-glitch");S.ticks();setTimeout(()=>e.classList.remove("fx-glitch"),500)}
      setTimeout(gl,35000+Math.random()*55000)};setTimeout(gl,20000+Math.random()*20000)}
  const wh=()=>{if(doc.visibilityState==="visible"&&!F)whisper(MURMURES[Math.random()*MURMURES.length|0]);setTimeout(wh,110000+Math.random()*120000)};setTimeout(wh,60000+Math.random()*60000);
  const t317=()=>{const d=new Date(),on=d.getHours()===3&&d.getMinutes()===17;if(on&&!html.classList.contains("fx-0317")){whisper("03h17. Un document que personne n'a écrit rejoint le registre.");S.thump()}html.classList.toggle("fx-0317",on)};t317();setInterval(t317,20000);
  const T=doc.title;doc.addEventListener("visibilitychange",()=>{doc.title=doc.visibilityState==="hidden"?(PAGE==="observatoire"?"▮ Présence perdue":"▮ Consultation suspendue"):T});
  if(!["observatoire","veille","archives"].includes(PAGE)){const id=doc.createElement("div");id.id="fx-idle";id.textContent="PRÉSENCE NON CONFIRMÉE · BOUGEZ POUR REPRENDRE";body.appendChild(id);
    let la=Date.now();const act=()=>{la=Date.now();id.classList.remove("on")};["pointermove","keydown","scroll","touchstart"].forEach(t=>addEventListener(t,act,{passive:true}));
    setInterval(()=>{if(Date.now()-la>240000&&!F)id.classList.add("on")},5000)}
  let sev=0,svt;addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("input,textarea"))return;if(e.key==="7"){sev++;clearTimeout(svt);svt=setTimeout(()=>sev=0,2500);if(sev===7){sev=0;S.deny();toast("Terminal retiré · Rév. 7.2")}}})}

/* ═════════ SONS D'INTERFACE & TRANSITIONS ═════════ */
function interactions(){
  doc.addEventListener("pointerover",e=>{const a=e.target.closest&&e.target.closest("a,button");if(a&&!a.contains(e.relatedTarget))S.tick()});
  doc.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("button");if(b&&!b.closest(".fx-tabs,.fx-filters,.fx-tools")&&!b.classList.contains("fx-enter"))S.click()},true);
  doc.addEventListener("keydown",e=>{if(e.target.matches&&e.target.matches("input,textarea")&&e.key.length===1)S.key()});
  doc.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("a[href]");if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute("download"))return;
    const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname)return;e.preventDefault();S.whoosh();if(RM){location.href=a.href;return}body.classList.add("fx-leave");setTimeout(()=>location.href=a.href,260)});
  addEventListener("pageshow",e=>{if(e.persisted)body.classList.remove("fx-leave")})}

/* ═════════ DÉMARRAGE ═════════ */
function start(){
  if(PAGE==="bureau"){layers();carnetBuild();
    window.VRD={S,A,aSet,rings,setLen,pieces,get,put,toast,whisper,stamp,carnet,buildReq,buildTour,esc,IC,PAGES,MURMURES};
    addEventListener("storage",e=>{if(e.key==="vrd-req")buildReq();if(e.key==="vrd-vu"||e.key==="vrd-dos")buildTour()});
    doc.dispatchEvent(new Event("vrd-ready"));return}
  const vu=new Set(get("vrd-vu",[]));vu.add(PAGE);put("vrd-vu",[...vu]);
  if(EMBED){html.classList.add("fx-embed");header();registre();archives();observatoire();veille();decorate();reveal();interactions();
    const h1=$("main h1");if(h1)scramble(h1);return}
  layers();navbar();header();registre();archives();observatoire();veille();decorate();reveal();carnetBuild();interactions();ambience();
  const h1=$("main h1");boot().then(()=>{if(h1)scramble(h1)})}
if(doc.readyState==="loading")doc.addEventListener("DOMContentLoaded",start);else start();
})();
