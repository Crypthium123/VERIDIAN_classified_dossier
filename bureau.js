/* VERIDIAN — Poste de lecture 07.
   Interface « système d'exploitation » du Bureau. Les pages d'origine s'ouvrent dans des fenêtres :
   aucune énigme, aucun texte et aucune donnée chiffrée n'est modifié ici. */
(()=>{
"use strict";
const V=window.VRD;if(!V)return;
const {S,get,put,esc,rings,pieces}=V;
const doc=document,$=s=>doc.querySelector(s),$$=s=>[...doc.querySelectorAll(s)],wait=t=>new Promise(r=>setTimeout(r,t));
const scr=$("#screen"),desk=$("#desk"),wins=$("#wins"),bar=$("#bar"),phase=$("#phase"),notes=$("#notes");
const MOBILE=()=>innerWidth<=760;

/* ═════════ ICÔNES ═════════ */
const P=d=>`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I={
  doc:P('<path d="M8 3h11l6 6v20H8z"/><path d="M19 3v6h6M12 15h9M12 19h9M12 23h6"/>'),
  charte:P('<path d="M7 4h18v24H7z"/><path d="M11 9h10M11 13h10M11 17h6"/><circle cx="20" cy="22" r="3"/><path d="M18.5 24.5 17 28l3-1.5 3 1.5-1.5-3.5"/>'),
  reg:P('<path d="M5 6h22v20H5z"/><path d="M5 11h22M11 6v20M5 16h22M5 21h22"/>'),
  search:P('<circle cx="14" cy="14" r="8"/><path d="m20 20 7 7M10 14h8M14 10v8" opacity=".5"/>'),
  map:P('<path d="M4 8l8-3 8 3 8-3v19l-8 3-8-3-8 3z"/><path d="M12 5v19M20 8v19"/><circle cx="16" cy="15" r="2"/>'),
  mail:P('<path d="M4 8h24v16H4z"/><path d="m4 9 12 9 12-9"/>'),
  note:P('<path d="M8 3h15a2 2 0 0 1 2 2v24H10a2 2 0 0 1-2-2z"/><path d="M8 25a2 2 0 0 1 2-2h15M12 8h9M12 12h6"/>'),
  folder:P('<path d="M3 8h9l3 3h14v15H3z"/><path d="M3 13h26"/>'),
  img:P('<path d="M5 6h22v20H5z"/><circle cx="16" cy="16" r="5"/><circle cx="16" cy="16" r="2"/>'),
  tape:P('<rect x="3" y="8" width="26" height="16" rx="2"/><circle cx="11" cy="16" r="3"/><circle cx="21" cy="16" r="3"/><path d="M11 13h10M8 24l2-4h12l2 4"/>'),
  cam:P('<path d="M4 10h17v12H4z"/><path d="m21 14 7-4v12l-7-4"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/>'),
  radar:P('<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="7"/><path d="M16 16 25 8"/><circle cx="22" cy="19" r="1.2" fill="currentColor"/>'),
  trash:P('<path d="M7 9h18M12 9V5h8v4M9 9l1.5 18h11L23 9"/><path d="M14 13v10M18 13v10"/>'),
  text:P('<path d="M6 7h20M16 7v20M11 27h10"/>'),
  power:P('<path d="M16 4v11"/><path d="M9 8a10 10 0 1 0 14 0"/>'),
  term:P('<rect x="3" y="5" width="26" height="22"/><path d="m8 12 4 4-4 4M14 21h8"/>'),
  lock:P('<rect x="7" y="14" width="18" height="13"/><path d="M11 14V9a5 5 0 0 1 10 0v5"/>')};

/* ═════════ CONTENU DU POSTE ═════════ */
const PG=Object.fromEntries(V.PAGES);PG.plan="Plan du site";PG.observatoire="Poste de veille 5";PG.veille="Caméra 14";
const FOLDERS={
  personnel:["Personnel",["hierarchie","agents","civils","recrutement"]],
  terrain:["Terrain",["incidents","terrain","lieux","poles","ecrans"]],
  doc:["Documentation",["chronologie","lexique","protocoles","medical","sciences","finances","bibliotheque","contradictions","plan"]],
  ext:["Sources extérieures",["presse","temoignages","rumeurs","faq","contact"]],
  priv:["Pièces sensibles",["journal","correspondance"]]};
const CLASSIF={journal:"NOCTURN",correspondance:"NOCTURN",agents:"FEUILLE",ecrans:"FEUILLE",finances:"FEUILLE",contradictions:"FEUILLE",incidents:"ARBRE",protocoles:"ARBRE",medical:"ARBRE",sciences:"ARBRE",archives:"ARBRE",rumeurs:"NON CLASSÉ",observatoire:"POSTE 5",veille:"CAM 14"};
const ICO_PAGE={index:"charte",registre:"reg",archives:"search",observatoire:"radar",veille:"cam"};

const DESK=()=>{const n=pieces(),L=[
  {k:"index",n:"Charte fondatrice",i:"charte",o:()=>page("index")},
  {k:"registre",n:"Registre des anomalies",i:"reg",o:()=>page("registre")},
  {k:"archives",n:"Index de recherche",i:"search",o:()=>page("archives")},
  {k:"carte",n:"Carte des dossiers",i:"map",o:carte},
  {k:"mail",n:"Messagerie",i:"mail",o:mail,bd:unread()},
  {k:"carnet",n:"Carnet de lecture",i:"note",o:()=>V.carnet(true)},
  ...Object.entries(FOLDERS).map(([k,[t]])=>({k:"f-"+k,n:t,i:"folder",o:()=>folder(k)})),
  {k:"cachet",n:"cachet-1947.png",i:"img",o:cachet}];
  if(n>=4)L.push({k:"bande",n:"Bande signal-14",i:"tape",o:bande,cls:"amber"});
  if(n>=6){L.push({k:"observatoire",n:"Poste de veille 5",i:"radar",o:()=>page("observatoire"),cls:"amber"},{k:"veille",n:"Caméra 14",i:"cam",o:()=>page("veille"),cls:"amber"})}
  if(get("vrd-term",0))L.push({k:"terminal",n:"Terminal",i:"term",o:terminal});
  get("vrd-seve",[]).forEach(i=>L.push({k:"seve"+i,n:"sans titre "+(i+1),i:"note",o:()=>seveNote(i,false)}));
  L.push({k:"corbeille",n:"Corbeille",i:"trash",o:corbeille});return L};

/* Messages : uniquement des phrases déjà présentes dans les archives publiques. */
const MAILS=[
  {id:"m0",need:0,de:"Bureau d'Archivage Permanent",obj:"Accusé de réception",d:"aujourd'hui",b:"Votre demande de consultation est enregistrée.\n\nToute demande est traitée dans un délai de soixante-dix-neuf ans.\n\nLes pièces sont consultables sur place. Il n'existe pas de place.",ty:1},
  {id:"m1",need:0,de:"Archives — note de service",obj:"Méthode de lecture",d:"non daté",b:"Le Bureau lit ses archives comme on remonte un fleuve : par l'embouchure. Le dernier dossier ouvert est le premier lu. Chaque dossier est une personne avant d'être un numéro.\n\n« Nous avons appris à compter les gens à l'envers. C'est plus humain : on finit par le premier. »"},
  {id:"m2",need:0,de:"POUSSE-17",obj:"(sans objet)",d:"non daté",b:"Si quelqu'un lit ça depuis l'extérieur : armoire 3, classeur bleu, pôle d'Oslo.",ty:1},
  {id:"m3",need:1,de:"RACINE-3",obj:"FOND-002 — déclassifié par erreur",d:"2018",b:"Ce n'est pas une progression. C'est une phrase. Nous en sommes au milieu."},
  {id:"m4",need:2,de:"TRONC-9",obj:"Note",d:"2020",b:"La distribution des dossiers actifs suit un modèle. Je ne sais pas si le Bureau le sait."},
  {id:"m5",need:3,de:"Pôle de Tbilissi",obj:"Message reçu",d:"2002",b:"Nous sommes toujours ici. Ne venez pas.",ty:1},
  {id:"m6",need:4,de:"ÉCRAN-5 — Karachi",obj:"Relevé atmosphérique",d:"en cours",b:"Un poste de veille y fonctionne sans interruption depuis la fondation."},
  {id:"m7",need:5,de:"RACINE-2 → RACINE-4",obj:"PROC-OBS-02",d:"14 novembre 2019",b:"La révision de PROC-OBS-02 ne peut plus attendre. Si SÈVE n'est pas informée, quelqu'un doit le faire. Je ne sais pas comment la joindre.\n\n— Réponse du 15 novembre : « Je pensais que tu savais. »",ty:1},
  {id:"m8",need:6,de:"(expéditeur inconnu)",obj:"03h17",d:"7 janvier 2024",b:"Vous avez documenté 1 847 phénomènes. Nous en comptons 1 848."}];
const readSet=()=>new Set(get("vrd-lus",[]));
function unread(){const n=pieces(),r=readSet();return MAILS.filter(m=>m.need<=n&&!r.has(m.id)).length}

/* ═════════ GESTIONNAIRE DE FENÊTRES ═════════ */
let Z=10,seq=0,lastO=null;const W=new Map();
function win({key,title,icon="doc",cls="",w=760,h=540,body,onClose}){
  if(key&&W.has(key)){const o=W.get(key);o.el.classList.remove("min");focus(o);S.tick();return o}
  const el=doc.createElement("div"),id="w"+(++seq);el.className="win";el.id=id;
  const R=wins.getBoundingClientRect(),ww=Math.min(w,R.width-(R.width>1000?260:24)),hh=Math.min(h,R.height-24),off=(W.size%7)*28;
  Object.assign(el.style,{width:ww+"px",height:hh+"px",left:Math.max(8,(R.width-ww)/2-90+off)+"px",top:Math.max(8,(R.height-hh)/2-40+off)+"px"});
  el.innerHTML=`<div class="wt">${I[icon]||I.doc}<span class="wn">${esc(title)}</span>${cls?`<span class="wc">${esc(cls)}</span>`:""}<button class="mn" title="Réduire">—</button><button class="mx" title="Agrandir">□</button><button class="x" title="Fermer">✕</button></div><div class="wb"></div><div class="wr"></div>`;
  wins.appendChild(el);if(lastO){const rr=el.getBoundingClientRect();el.style.setProperty("--ox",(lastO[0]-rr.left)+"px");el.style.setProperty("--oy",(lastO[1]-rr.top)+"px");lastO=null}const o={id,key,el,title,icon,onClose};W.set(key||id,o);
  const wb=el.querySelector(".wb");if(typeof body==="function")body(wb,o);else if(body)wb.innerHTML=body;
  const tb=el.querySelector(".wt");
  el.addEventListener("pointerdown",()=>focus(o),true);
  tb.querySelector(".x").onclick=e=>{e.stopPropagation();close(o)};
  tb.querySelector(".mn").onclick=e=>{e.stopPropagation();el.classList.add("min");S.whoosh();refocus()};
  tb.querySelector(".mx").onclick=e=>{e.stopPropagation();el.classList.toggle("max");S.click()};
  tb.addEventListener("dblclick",e=>{if(!e.target.closest("button")){el.classList.toggle("max");S.click()}});
  drag(tb,el,"move");drag(el.querySelector(".wr"),el,"size");
  focus(o);S.whoosh();taskbar();return o}
function drag(h,el,mode){h.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest("button")||MOBILE()||el.classList.contains("max"))return;e.preventDefault();
  const sx=e.clientX,sy=e.clientY,r=el.getBoundingClientRect(),R=wins.getBoundingClientRect();wins.classList.add("drag");h.setPointerCapture(e.pointerId);
  const mv=ev=>{const dx=ev.clientX-sx,dy=ev.clientY-sy;
    if(mode==="move"){el.style.left=Math.min(R.width-80,Math.max(-r.width+120,r.left-R.left+dx))+"px";el.style.top=Math.min(R.height-34,Math.max(0,r.top-R.top+dy))+"px"}
    else{el.style.width=Math.max(300,r.width+dx)+"px";el.style.height=Math.max(180,r.height+dy)+"px"}};
  const up=()=>{wins.classList.remove("drag");h.removeEventListener("pointermove",mv);h.removeEventListener("pointerup",up);h.removeEventListener("pointercancel",up)};
  h.addEventListener("pointermove",mv);h.addEventListener("pointerup",up);h.addEventListener("pointercancel",up)})}
function focus(o){if(!o||o.el.classList.contains("fo"))return;$$(".win.fo").forEach(w=>w.classList.remove("fo"));o.el.style.zIndex=++Z;o.el.classList.add("fo");taskbar()}
function refocus(){const v=[...W.values()].filter(o=>!o.el.classList.contains("min")).sort((a,b)=>b.el.style.zIndex-a.el.style.zIndex);$$(".win.fo").forEach(w=>w.classList.remove("fo"));if(v[0])focus(v[0]);else taskbar()}
function close(o){o.el.classList.add("closing");S.click();if(o.onClose)o.onClose();W.delete(o.key||o.id);setTimeout(()=>{o.el.remove();refocus()},190)}

/* page d'archive dans une fenêtre */
function page(k){const o=win({key:"p-"+k,title:PG[k]||k,icon:ICO_PAGE[k]||"doc",cls:CLASSIF[k]||"ÉCORCE",w:k==="registre"||k==="archives"?900:780,h:620,
  body:wb=>{wb.innerHTML=`<div class="ld">OUVERTURE DU DOSSIER<i></i></div>`;const f=doc.createElement("iframe");f.title=PG[k]||k;f.src=k+".html";wb.appendChild(f);
    f.addEventListener("load",()=>{wb.querySelector(".ld").classList.add("done");try{const cw=f.contentWindow;["pointermove","keydown","scroll","touchstart","pointerdown"].forEach(t=>cw.addEventListener(t,act,{passive:true}));
      cw.addEventListener("pointerdown",()=>{const oo=W.get("p-"+k);if(oo)focus(oo);menu(false)});
      const t=cw.document.title.replace(/ — VERIDIAN$/,"");const oo=W.get("p-"+k);if(oo&&t){oo.title=t;oo.el.querySelector(".wn").textContent=t;taskbar()}}catch(e){}})}});
  return o}

/* explorateur de dossiers */
function folder(k){const[t,list]=FOLDERS[k];win({key:"f-"+k,title:t,icon:"folder",w:620,h:400,body:wb=>{const vu=new Set(get("vrd-vu",[]));
  wb.innerHTML=`<div class="pad" style="padding:0"><div class="path"><span>/VRD/PUBLIC/${esc(t.toUpperCase())}</span><span>${list.length} PIÈCES</span></div><div class="fold">${list.map(p=>`<div class="ico${vu.has(p)?" vu":""}" tabindex="0" data-p="${p}">${I.doc}<span>${esc(PG[p]||p)}</span><small>${p}.html</small></div>`).join("")}</div></div>`;
  wb.querySelectorAll(".ico").forEach(ic=>openable(ic,()=>{page(ic.dataset.p);ic.classList.add("vu")}))}})}

/* ═════════ MESSAGERIE ═════════ */
function mail(){win({key:"mail",title:"Messagerie interne",icon:"mail",cls:"ÉCORCE",w:820,h:520,body:(wb,o)=>{
  wb.innerHTML=`<div class="mail"><ul></ul><div class="mread"><div class="em">AUCUN MESSAGE SÉLECTIONNÉ</div></div></div>`;o.render=()=>{
    const ul=wb.querySelector("ul"),n=pieces(),r=readSet();
    ul.innerHTML=MAILS.slice().reverse().map(m=>m.need<=n?`<li data-id="${m.id}" class="${r.has(m.id)?"":"un"}"><b>${esc(m.de)}</b><small>${esc(m.obj)} · ${esc(m.d)}</small></li>`:`<li class="lock"><b>▒▒▒▒▒▒▒▒</b><small>Message chiffré · habilitation insuffisante</small></li>`).join("");
    ul.querySelectorAll("li[data-id]").forEach(li=>li.onclick=()=>{const m=MAILS.find(x=>x.id===li.dataset.id),rs=readSet();rs.add(m.id);put("vrd-lus",[...rs]);S.click();
      ul.querySelectorAll("li").forEach(x=>x.classList.toggle("on",x===li));li.classList.remove("un");
      wb.querySelector(".mread").innerHTML=`<div class="hd">DE : <b>${esc(m.de)}</b><br>OBJET : <b>${esc(m.obj)}</b><br>DATE : ${esc(m.d)}</div><div class="bd${m.ty?" ty":""}">${esc(m.b).replace(/\n/g,"<br>")}</div>`;desktop()})};o.render()}})}

/* ═════════ CARTE TACTIQUE ═════════ */
const GEO={"Gand":[51.05,3.72],"Genève":[46.2,6.14],"Lyon":[45.76,4.84],"Madrid":[40.42,-3.7],"Liège":[50.63,5.57],"Turin":[45.07,7.69],"Paris":[48.86,2.35],"Rotterdam":[51.92,4.48],"Gdansk":[54.35,18.65],"Nantes":[47.22,-1.55],"Lausanne":[46.52,6.63],"Lugano":[46.0,8.95],"Amsterdam":[52.37,4.9],"Budapest":[47.5,19.04],"Naples":[40.85,14.27],"Porto":[41.15,-8.61],"Prague":[50.08,14.44],"Annecy":[45.9,6.13],"Ljubljana":[46.06,14.51],"Dublin":[53.35,-6.26],"Anvers":[51.22,4.4],"Oslo":[59.91,10.75],"Salamanque":[40.97,-5.66],"Brest":[48.39,-4.49],"Lille":[50.63,3.06],"Namur":[50.47,4.87],"Séville":[37.39,-5.98],"Tromsø":[69.65,18.96],"Cracovie":[50.06,19.94],"Valence":[39.47,-.38],"Bruxelles":[50.85,4.35],"Bruges":[51.21,3.22],"Lisbonne":[38.72,-9.14]};
const SITES=[["Chambésy — siège",46.24,6.15],["Berne — ÉCRAN-1",46.95,7.45],["Simplon-Gondo",46.2,8.03],["Kiruna",67.85,20.22],["Ballenberg",46.75,8.08],["Tbilissi — pôle muet",41.72,44.78],["Oslo — salle 4",59.91,10.75]];
const CC={I:"#8a918c",II:"#d9a54a",III:"#c27a3a",IV:"#c4473b",V:"#e8e2d0"};
function carte(){if(typeof D==="undefined")return;win({key:"carte",title:"Carte des dossiers",icon:"map",cls:"BRANCHE",w:1000,h:640,body:(wb,o)=>{
  wb.innerHTML=`<div class="map"><canvas></canvas><div class="mside"><h4>COUCHES</h4><div class="lay"><label><input type="checkbox" data-l="dos" checked>Dossiers du registre</label><label><input type="checkbox" data-l="sites" checked>Sites répertoriés</label><label><input type="checkbox" data-l="motif">Motif de TRONC-9</label><label><input type="checkbox" data-l="sweep" checked>Balayage</label></div><div class="card"><div class="id">SÉLECTION</div><p class="m">Survolez ou touchez un point.</p></div><div class="off"></div></div></div>`;
  const cv=wb.querySelector("canvas"),x=cv.getContext("2d"),card=wb.querySelector(".card"),L={dos:1,sites:1,motif:0,sweep:1};
  const off=D.filter(d=>!GEO[d[4]]&&d[4]!=="Europe centrale");
  wb.querySelector(".off").innerHTML="HORS CARTE<br>"+off.map(d=>`VRD-${esc(d[0])} · ${esc(d[1])} · ${esc(d[4])}`).join("<br>");
  wb.querySelectorAll(".lay input").forEach(i=>i.onchange=()=>{L[i.dataset.l]=i.checked?1:0;S.click()});
  const LON0=-11,LON1=46,LAT0=35,LAT1=71.5,KX=.64;let w=0,h=0,sc=1,ox=0,oy=0,pts=[],hov=null,sel=null,ang=0,live=true;
  const pj=(la,lo)=>[ox+(lo-LON0)*KX*sc,oy+(LAT1-la)*sc];
  const size=()=>{const r=cv.getBoundingClientRect(),dp=Math.min(2,devicePixelRatio||1);w=r.width;h=r.height;cv.width=w*dp;cv.height=h*dp;x.setTransform(dp,0,0,dp,0,0);
    sc=Math.min(w/((LON1-LON0)*KX),h/(LAT1-LAT0))*.94;ox=(w-(LON1-LON0)*KX*sc)/2;oy=(h-(LAT1-LAT0)*sc)/2;
    pts=D.map(d=>{const g=GEO[d[4]];return g?{d,p:pj(g[0],g[1])}:null}).filter(Boolean);
    const seen={};pts.forEach(q=>{const k=q.d[4];seen[k]=(seen[k]||0)+1;if(seen[k]>1){const a=seen[k]*2.1;q.p=[q.p[0]+Math.cos(a)*7*Math.sqrt(seen[k]-1),q.p[1]+Math.sin(a)*7*Math.sqrt(seen[k]-1)]}})};
  const ro=new ResizeObserver(size);ro.observe(cv);size();
  const pick=(mx,my)=>{let b=null,bd=13;pts.forEach(q=>{const dd=Math.hypot(q.p[0]-mx,q.p[1]-my);if(dd<bd){bd=dd;b=q}});return b};
  const show=q=>{if(!q)return;const d=q.d;card.innerHTML=`<div class="id">VRD-${esc(d[0])} · CLASSE ${esc(d[2])}</div><div class="t">${esc(d[1])}</div><div class="mt">${esc(d[3])} · ${esc(d[4])} · ${esc(d[5])}</div><p>${esc(d[6])}</p>`};
  cv.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect(),q=pick(e.clientX-r.left,e.clientY-r.top);if(q!==hov){hov=q;if(q){S.tick();if(!sel)show(q)}}cv.style.cursor=q?"pointer":"crosshair"});
  cv.addEventListener("pointerdown",e=>{const r=cv.getBoundingClientRect(),q=pick(e.clientX-r.left,e.clientY-r.top);sel=q;if(q){show(q);S.click()}});
  const draw=t=>{if(!live)return;x.clearRect(0,0,w,h);x.fillStyle="#040605";x.fillRect(0,0,w,h);
    x.font="9px IBM Plex Mono, monospace";x.lineWidth=1;
    for(let lo=-10;lo<=45;lo+=5){const[a]=pj(0,lo);x.strokeStyle=lo%10?"rgba(127,211,154,.04)":"rgba(127,211,154,.09)";x.beginPath();x.moveTo(a,oy);x.lineTo(a,oy+(LAT1-LAT0)*sc);x.stroke();if(!(lo%10)){x.fillStyle="rgba(127,211,154,.3)";x.fillText(lo+"°",a+3,oy+10)}}
    for(let la=35;la<=70;la+=5){const[,b]=pj(la,0);x.strokeStyle=la%10?"rgba(127,211,154,.04)":"rgba(127,211,154,.09)";x.beginPath();x.moveTo(ox,b);x.lineTo(ox+(LON1-LON0)*KX*sc,b);x.stroke();if(!(la%10)){x.fillStyle="rgba(127,211,154,.3)";x.fillText(la+"°N",ox+3,b-3)}}
    const ec=pj(48.3,17.2);x.save();x.setLineDash([3,4]);x.strokeStyle="rgba(217,165,74,.35)";x.beginPath();x.ellipse(ec[0],ec[1],5*sc*KX,2.6*sc,0,0,7);x.stroke();x.restore();
    x.fillStyle="rgba(217,165,74,.45)";x.fillText("AUBE PERSISTANTE · LOCALISATION NON PRÉCISÉE",ec[0]-5*sc*KX,ec[1]+2.6*sc+12);
    if(L.motif){const c=pj(47.5,9.0),r=800/111*sc,pu=.5+.5*Math.sin(t/700);x.strokeStyle=`rgba(196,71,59,${.35+.3*pu})`;x.setLineDash([6,5]);x.beginPath();x.arc(c[0],c[1],r,0,7);x.stroke();x.setLineDash([]);
      x.fillStyle="rgba(196,71,59,.08)";x.fill();x.fillStyle="#c4473b";x.fillText("47,5° N · 9,0° E · 2027–2031 · NON RECOUPÉ",c[0]-r*.6,c[1]-r-6);x.beginPath();x.arc(c[0],c[1],3,0,7);x.fill()}
    const g=pj(46.24,6.15);ang=(t/4200)%(Math.PI*2);
    if(L.sweep){const gr=x.createConicGradient?x.createConicGradient(ang-.9,g[0],g[1]):null;if(gr){gr.addColorStop(0,"rgba(127,211,154,0)");gr.addColorStop(.14,"rgba(127,211,154,.13)");gr.addColorStop(.1432,"rgba(127,211,154,0)");x.fillStyle=gr;x.beginPath();x.arc(g[0],g[1],Math.max(w,h),0,7);x.fill()}}
    if(L.sites)SITES.forEach(([n,la,lo])=>{const[a,b]=pj(la,lo);x.strokeStyle="#7fd39a";x.beginPath();x.moveTo(a-5,b);x.lineTo(a+5,b);x.moveTo(a,b-5);x.lineTo(a,b+5);x.stroke();x.fillStyle="rgba(127,211,154,.6)";x.fillText(n.toUpperCase(),a+7,b-5)});
    if(L.dos)pts.forEach(q=>{const[a,b]=q.p,d=q.d,c=CC[d[2]]||"#888";let da=Math.atan2(b-g[1],a-g[0])-ang;da=((da%(2*Math.PI))+2*Math.PI)%(2*Math.PI);const lit=L.sweep&&da>2*Math.PI-.5?1-(2*Math.PI-da)/.5:0;
      if(d[3]==="ACTIF"){const pu=(t/1800+parseInt(d[0],10)*.37)%1;x.strokeStyle=`rgba(127,211,154,${(1-pu)*.6})`;x.beginPath();x.arc(a,b,4+pu*14,0,7);x.stroke()}
      x.fillStyle=c;x.globalAlpha=d[3]==="PERDU"?.45:1;x.beginPath();if(d[3]==="CLOS"){x.rect(a-2.5,b-2.5,5,5)}else x.arc(a,b,3.4,0,7);x.fill();x.globalAlpha=1;
      if(lit>0){x.fillStyle=`rgba(232,226,208,${lit*.9})`;x.beginPath();x.arc(a,b,5+lit*3,0,7);x.fill()}
      if(q===hov||q===sel){x.strokeStyle="#e8e2d0";x.beginPath();x.arc(a,b,8,0,7);x.stroke();x.fillStyle="#e8e2d0";x.fillText("VRD-"+d[0]+" "+d[1],a+11,b+3)}});
    x.fillStyle="rgba(127,211,154,.35)";x.fillText("PROJECTION DU BUREAU · LES CÔTES NE SONT PAS DOCUMENTÉES",10,h-10);
    requestAnimationFrame(draw)};requestAnimationFrame(draw);o.onClose=()=>{live=false;ro.disconnect()}}})}

/* ═════════ BANDE, CACHET, CORBEILLE ═════════ */
function bande(){win({key:"bande",title:"Lecteur de bandes — signal-14",icon:"tape",cls:"ARBRE",w:560,h:470,body:(wb,o)=>{
  wb.innerHTML=`<div class="tape"><div class="deck"><div class="lab">SIGNAL-14 · ORIGINAL</div><div class="reel l"></div><div class="reel r"></div></div><canvas width="840" height="140"></canvas><div class="ctl"><button type="button">▶ Lire</button><a href="signal-14.wav" download>Exporter la bande</a></div><p class="cap">« Ce que vous entendez n'est pas ce qui est dit. »</p></div>`;
  const tp=wb.querySelector(".tape"),bt=wb.querySelector("button"),cv=wb.querySelector("canvas"),x=cv.getContext("2d"),au=new Audio("signal-14.wav");let an=null,buf,live=true;
  bt.onclick=()=>{if(!an&&V.A.c){try{const s=V.A.c.createMediaElementSource(au);an=V.A.c.createAnalyser();an.fftSize=2048;buf=new Uint8Array(an.fftSize);s.connect(an);an.connect(V.A.c.destination);V.A.c.resume()}catch(e){}}
    if(au.paused){au.play();bt.textContent="❚❚ Pause";tp.classList.add("play")}else{au.pause();bt.textContent="▶ Lire";tp.classList.remove("play")}};
  au.onended=()=>{bt.textContent="▶ Lire";tp.classList.remove("play")};
  const draw=()=>{if(!live)return;x.fillStyle="rgba(3,5,4,.5)";x.fillRect(0,0,840,140);x.strokeStyle="#d9a54a";x.lineWidth=2;x.beginPath();
    if(an&&!au.paused){an.getByteTimeDomainData(buf);for(let i=0;i<840;i++){const v=buf[i*2|0]/128-1,y=70+v*60;i?x.lineTo(i,y):x.moveTo(i,y)}}else{x.moveTo(0,70);x.lineTo(840,70)}x.stroke();requestAnimationFrame(draw)};draw();
  o.onClose=()=>{live=false;au.pause()}}})}
function cachet(){win({key:"cachet",title:"Visionneuse — cachet-1947.png",icon:"img",cls:"ÉCORCE",w:560,h:480,body:wb=>{
  wb.innerHTML=`<div class="view"><div class="st"><img src="cachet-1947.png" alt="Cachet du Bureau, état 1947"></div><div class="tb"><span>ZOOM</span>${[1,2,4,8].map(z=>`<button type="button" data-z="${z}">×${z}</button>`).join("")}<a href="cachet-1947.png" download>Exporter l'original</a></div></div>`;
  const im=wb.querySelector("img"),zz=z=>{im.style.width=(im.naturalWidth||96)*z+"px"};im.onload=()=>zz(2);wb.querySelectorAll("[data-z]").forEach(b=>b.onclick=()=>zz(+b.dataset.z))}})}
function corbeille(){win({key:"corbeille",title:"Corbeille",icon:"trash",w:560,h:360,body:wb=>{
  wb.innerHTML=`<div class="pad" style="padding:0"><div class="path"><span>/VRD/CORBEILLE</span><span>2 ÉLÉMENTS · NON RESTAURABLES</span></div><div class="fold"><div class="ico" tabindex="0" data-f="0">${I.doc}<span>VRD-0271.del</span><small>2019</small></div><div class="ico" tabindex="0" data-f="1">${I.doc}<span>direction.lst</span><small>2022</small></div></div></div>`;
  const F=[["VRD-0271 — LE SILENCE","Formulaire d'extinction documentaire. Signataire : RACINE-2, 2019. Le signataire ne s'en souvient pas.<br><br>Quatorze demandes d'accès en 2023 : neuf refusées, quatre sans réponse, une a conduit à un décommissionnement définitif.<br><br>Contenu : <span class='bar'>████████████████████████</span>"],
    ["LISTE NOMINATIVE DE LA DIRECTION","Effectif : 7 d'après RACINE-4. 9 d'après RACINE-1.<br>Les deux entrées d'écart ont des noms, pas de numéros.<br><br><span class='bar'>██████ █████ ███████ ████ ██████</span>"]];
  wb.querySelectorAll(".ico").forEach(ic=>openable(ic,()=>{const f=F[ic.dataset.f];S.deny();win({key:"del"+ic.dataset.f,title:f[0],icon:"lock",cls:"EFFACÉ",w:520,h:380,body:`<div class="pad del"><h3>${f[0]}</h3>${f[1]}<br><span class="stp">SANS OBJET</span></div>`})}))}})}

/* ═════════ BUREAU & BARRE ═════════ */
function openable(el,fn0){const fn=()=>{const r=el.getBoundingClientRect();lastO=[r.left+r.width/2,r.top+r.height/2];fn0()};el.addEventListener("click",e=>{$$(".ico.sel").forEach(i=>i.classList.remove("sel"));el.classList.add("sel");S.tick();if(MOBILE()||e.detail===0)fn()});
  el.addEventListener("dblclick",fn);el.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();fn()}})}
let known=new Set(get("vrd-icones",[]));
function desktop(){let ic=desk.querySelector(".icons");if(!ic){desk.innerHTML=`<div class="wall">${rings(18,600,1947)}</div><div class="wall-t"><b>VERIDIAN</b>BUREAU D'ÉQUILIBRE NORMATIF<br>POSTE DE LECTURE 07 · NIVEAU ÉCORCE<br>« VERIDIAN NE S'EXPLIQUE PAS. VERIDIAN DOCUMENTE. »</div><div class="icons"></div>`;ic=desk.querySelector(".icons");
    desk.addEventListener("pointerdown",e=>{if(!e.target.closest(".ico"))$$(".ico.sel").forEach(i=>i.classList.remove("sel"));menu(false)})}
  const L=DESK(),first=!known.size;ic.innerHTML="";L.forEach(a=>{const d=doc.createElement("div");d.className="ico"+(a.cls?" "+a.cls:"")+(!first&&!known.has(a.k)?" new":"");d.tabIndex=0;
    d.innerHTML=`${I[a.i]}<span>${esc(a.n)}</span>${a.bd?`<i class="bd">${a.bd}</i>`:""}`;openable(d,()=>{d.classList.remove("new");known.add(a.k);put("vrd-icones",[...known]);a.o()});ic.appendChild(d)});
  if(first){L.forEach(a=>known.add(a.k));put("vrd-icones",[...known])}}
function taskbar(){const t=bar.querySelector(".tasks");if(!t)return;t.innerHTML="";W.forEach(o=>{const b=doc.createElement("button");b.className="tk"+(o.el.classList.contains("fo")&&!o.el.classList.contains("min")?" fo":"");
  b.innerHTML=`${I[o.icon]||I.doc}${esc(o.title)}`;b.onclick=()=>{if(o.el.classList.contains("fo")&&!o.el.classList.contains("min")){o.el.classList.add("min");refocus()}else{o.el.classList.remove("min");focus(o)}S.tick()};t.appendChild(b)})}
function buildBar(){const ag=get("vrd-agent","LECTEUR");bar.innerHTML=`<button class="st-b" type="button">${rings(6,40,7)}<span>VRD</span></button><div class="tasks"></div><div class="tray"><span class="ag">GRAINE · ${esc(ag)}</span><span class="fx-pieces"></span><button class="fx-ib" id="fx-snd" type="button"></button><span class="ck">--:--</span></div>`;
  const m=doc.createElement("div");m.id="menu";scr.appendChild(m);let t7=0,t7t;bar.querySelector(".st-b").onclick=()=>{t7++;clearTimeout(t7t);t7t=setTimeout(()=>t7=0,2500);if(t7===7){t7=0;menu(false);S.deny();terminal();return}menu(!m.classList.contains("on"))};
  const sb=$("#fx-snd"),upd=()=>{sb.innerHTML=V.A.on?V.IC.snd:V.IC.mute;sb.classList.toggle("off",!V.A.on)};upd();sb.onclick=()=>{V.aSet(!V.A.on);upd();S.click()};
  const ck=bar.querySelector(".ck"),tk=()=>{try{ck.textContent="BERNE "+new Date().toLocaleTimeString("fr-CH",{timeZone:"Europe/Zurich",hour:"2-digit",minute:"2-digit"})}catch(e){}};tk();setInterval(tk,10000);hud()}
function hud(){const h=bar.querySelector(".fx-pieces");if(!h)return;const n=pieces();h.innerHTML="";for(let i=0;i<6;i++){const d=doc.createElement("i");if(i<n)d.className="on";h.appendChild(d)}h.title="Pièces reçues : "+n+"/6"}
function menu(v){const m=$("#menu");if(!m)return;const b=bar.querySelector(".st-b");if(!v){m.classList.remove("on");b&&b.classList.remove("on");return}
  const ag=get("vrd-agent","LECTEUR");m.innerHTML=`<div class="mh"><b>VERIDIAN</b>SESSION : GRAINE · ${esc(ag)}<br>PIÈCES : ${pieces()}/6</div>`+
    DESK().map((a,i)=>`<button type="button" data-i="${i}">${I[a.i]}${esc(a.n)}</button>`).join("")+`<hr><button type="button" data-x="texte">${I.text}Version texte des archives</button><button type="button" data-x="out">${I.power}Fermer la session</button>`;
  const L=DESK();m.querySelectorAll("button").forEach(b=>b.onclick=()=>{menu(false);S.click();if(b.dataset.i)L[b.dataset.i].o();else if(b.dataset.x==="texte")location.href="index.html?texte";else{try{sessionStorage.removeItem("vrd-poste")}catch(e){}location.reload()}});
  m.classList.add("on");b.classList.add("on")}
addEventListener("keydown",e=>{if(e.key==="Escape")menu(false)});

/* notifications */
function notify(t,b,{c="",from="SYSTÈME",onclick,ms=8000}={}){const n=doc.createElement("div");n.className="nt "+c;n.innerHTML=`<small>${esc(from)}</small><b>${esc(t)}</b>${b?`<p>${esc(b)}</p>`:""}`;
  notes.prepend(n);S.relay();const k=()=>{n.classList.add("out");setTimeout(()=>n.remove(),350)};n.onclick=()=>{k();onclick&&onclick()};setTimeout(k,ms)}

/* ═════════ PROGRESSION ═════════ */
let lastN=pieces();
function progress(){const n=pieces();if(n===lastN)return;const prev=lastN;lastN=n;hud();V.buildTour();if(n<prev){desktop();return}
  V.stamp(n);setTimeout(()=>{desktop();const fresh=MAILS.filter(m=>m.need>prev&&m.need<=n);
    fresh.forEach((m,i)=>setTimeout(()=>notify(m.obj,"De : "+m.de,{from:"MESSAGERIE · NOUVEAU MESSAGE",onclick:mail}),i*900));
    if(prev<4&&n>=4)setTimeout(()=>notify("Lecteur de bandes connecté","Une bande a été versée au poste.",{c:"am",onclick:bande}),1500);
    if(prev<6&&n>=6)setTimeout(()=>notify("Deux postes s'ouvrent","L'un écoute, l'autre regarde.",{c:"am",ms:12000}),1800);
    const mw=W.get("mail");if(mw&&mw.render)mw.render();seveCheck()},3300)}
addEventListener("storage",e=>{if(e.key==="vrd"||e.key===null)progress()});setInterval(progress,1500);
addEventListener("message",e=>{if(e.origin!==location.origin||!e.data||e.data.vrd!=="finale")return;
  const o=[...W.values()].find(w=>{const f=w.el.querySelector("iframe");return f&&f.contentWindow===e.source});
  if(o){o.el.classList.add("max","fin");o.el.classList.remove("min");focus(o)}scr.classList.add("finale");menu(false)});

/* ═════════ VEILLE, MURMURES, 03h17 ═════════ */
let la=Date.now();const act=()=>{la=Date.now();const s=$("#saver");if(s&&s.classList.contains("on")){s.classList.remove("on");S.relay()}};
["pointermove","keydown","pointerdown","wheel","touchstart"].forEach(t=>addEventListener(t,act,{passive:true}));
function ambience(){const sv=doc.createElement("div");sv.id="saver";sv.innerHTML=rings(22,600,79)+"<p>POSTE EN VEILLE · 1 847 PHÉNOMÈNES DOCUMENTÉS</p>";scr.appendChild(sv);
  setInterval(()=>{if(Date.now()-la>180000&&!W.has("p-observatoire")&&!scr.classList.contains("finale")&&!sv.classList.contains("on")){sv.classList.add("on");sv.querySelector("svg").classList.add("draw");V.setLen(sv)}},5000);
  const gl=()=>{if(doc.visibilityState==="visible"&&!scr.classList.contains("finale")){scr.classList.add("glitch");S.ticks();setTimeout(()=>scr.classList.remove("glitch"),520)}setTimeout(gl,60000+Math.random()*90000)};setTimeout(gl,45000);
  const wh=()=>{if(doc.visibilityState==="visible"&&!scr.classList.contains("finale"))V.whisper(V.MURMURES[Math.random()*V.MURMURES.length|0]);setTimeout(wh,120000+Math.random()*120000)};setTimeout(wh,90000);
  let n317=false;setInterval(()=>{const d=new Date(),on=d.getHours()===3&&d.getMinutes()===17;if(on&&!n317){n317=true;S.thump();notify("Un document rejoint le registre","Personne ne l'a écrit.",{c:"rd",from:"03H17 · EXPÉDITEUR INCONNU"})}if(!on)n317=false},15000)}

/* ═════════ ALLUMAGE, BIOS, IDENTIFICATION ═════════ */
function power(){return new Promise(res=>{phase.innerHTML=`<div class="pw" tabindex="0" role="button"><div class="led"></div><b>VERIDIAN</b>POSTE DE LECTURE 07<br><br>▮ TOUCHER POUR METTRE SOUS TENSION</div>`;
  const go=()=>{removeEventListener("keydown",kk);V.aSet(V.A.on);S.boot();scr.classList.remove("on");void scr.offsetWidth;scr.classList.add("on");res()};
  const kk=e=>{if(e.key==="Enter"||e.key===" ")go()};phase.querySelector(".pw").onclick=go;addEventListener("keydown",kk)})}
async function bios(){const n=pieces();phase.innerHTML=`<pre class="bios"></pre>`;const pre=phase.querySelector("pre");let skip=false;const sk=()=>skip=true;phase.addEventListener("pointerdown",sk);addEventListener("keydown",sk,{once:true});
  const line=async(t,c="",d=140)=>{pre.insertAdjacentHTML("beforeend",`<span class="${c}">${t}</span>\n`);if(!skip){S.relay();await wait(d)}};
  await line("VRD-BIOS RÉV. 7.2 · BUREAU D'ÉQUILIBRE NORMATIF · 1947–2026","h",300);await line("");
  const mem=pre.appendChild(doc.createElement("span"));for(let k=0;k<=1847&&!skip;k+=97){mem.textContent=`CONTRÔLE MÉMOIRE ......... ${Math.min(k,1847)} Ko`;await wait(18)}mem.textContent="CONTRÔLE MÉMOIRE ......... 1847 Ko";pre.append("\n");
  await line("RELAIS DE BERNE .......... ÉTABLI");await line("CHIFFREMENT .............. AES-256 · PBKDF2");
  await line("LECTEUR DE BANDES ........ "+(n>=4?"CONNECTÉ":"AUCUNE BANDE"),n>=4?"w":"");await line("CAMÉRA 14 ................ "+(n>=6?"SIGNAL DISPONIBLE":"SIGNAL CHIFFRÉ"),n>=6?"w":"");
  await line("POSTE DE VEILLE 5 ........ "+(n>=6?"OUVERT":"FERMÉ"),n>=6?"w":"");await line("PIÈCES EN MÉMOIRE LOCALE . "+n+"/6");await line("");
  if(!skip){await wait(400);mem.innerHTML=`CONTRÔLE MÉMOIRE ......... <span class="r">1848 Ko</span>`;S.deny();await wait(800)}
  await line("CHARGEMENT DE L'ENVIRONNEMENT DE LECTURE…","w",500);phase.removeEventListener("pointerdown",sk)}
function login(){return new Promise(res=>{const ag=get("vrd-agent","");
  phase.innerHTML=`<form class="login" autocomplete="off">${rings(11,160,1947,"draw")}<h2>VERIDIAN</h2><p>Identification du lecteur</p>${ag?`<button type="submit" class="go">Reprendre la session · ${esc(ag)}</button><button type="button" class="alt">Changer de lecteur</button>`:`<label for="ag">NOM OU MATRICULE</label><input id="ag" maxlength="18" spellcheck="false" placeholder="—"><button type="submit">S'identifier</button>`}<div class="msg"></div></form>`;
  V.setLen(phase);const f=phase.querySelector("form"),inp=f.querySelector("input");if(inp)setTimeout(()=>inp.focus(),100);
  const alt=f.querySelector(".alt");if(alt)alt.onclick=()=>{put("vrd-agent","");login().then(res)};
  f.onsubmit=async e=>{e.preventDefault();let v=ag;if(inp){v=inp.value.trim().toUpperCase().replace(/[^A-Z0-9ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜ' -]/g,"").slice(0,18);if(!v){f.querySelector(".msg").textContent="LE BUREAU NE CONSULTE PAS LES ANONYMES.";S.deny();return}}
    put("vrd-agent",v);S.chime();const msg=f.querySelector(".msg");f.querySelectorAll("button,input").forEach(x=>x.disabled=true);
    for(const t of["VÉRIFICATION…","LECTEUR NON DÉCLARÉ.","ADMIS · HABILITATION ÉCORCE"]){msg.textContent=t;S.relay();await wait(650)}res()}})}


/* ═════════ SÈVE : une présence dans le poste ═════════
   Aucune phrase nouvelle : elle ne « dit » que des annotations déjà présentes dans les archives publiques. */
const SEVE=[{need:1,t:"On ne protège rien. On retarde. C'est différent."},{need:3,t:"À l'endroit, on lit des événements. À l'envers, on lit des gens."},{need:6,t:"Un poste ne s'ouvre qu'à celui qui reste présent."}];
let ghostBusy=false;
async function ghost(to){if(ghostBusy||scr.classList.contains("finale"))return;ghostBusy=true;
  let g=$("#ghost");if(!g){g=doc.createElement("div");g.id="ghost";g.innerHTML='<svg viewBox="0 0 20 24"><path d="M2 2v17l4.5-4.2 3.2 7 3-1.4-3.2-6.8H16z"/></svg>';scr.appendChild(g)}
  const R=scr.getBoundingClientRect(),pts=[],ic=$("#desk .icons .ico");
  pts.push([R.width*(.2+Math.random()*.6),R.height+20]);
  for(let i=0;i<2&&ic.length;i++){const el=ic[Math.random()*ic.length|0],e=el.getBoundingClientRect();pts.push([e.left-R.left+e.width/2,e.top-R.top+e.height/2,el])}
  pts.push(to||[R.width*(.3+Math.random()*.5),R.height*(.3+Math.random()*.4)]);
  g.style.opacity=0;g.style.transform=`translate(${pts[0][0]}px,${pts[0][1]}px)`;await wait(60);g.style.opacity=.75;
  for(let i=1;i<pts.length;i++){const[a,b]=pts[i-1],[c,d,el]=pts[i],mx=(a+c)/2+(Math.random()-.5)*200,my=(b+d)/2+(Math.random()-.5)*160,dur=1400+Math.random()*900,t0=performance.now();
    await new Promise(res=>{const f=now=>{let k=Math.min(1,(now-t0)/dur);k=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
      const x=(1-k)*(1-k)*a+2*(1-k)*k*mx+k*k*c,y=(1-k)*(1-k)*b+2*(1-k)*k*my+k*k*d;g.style.transform=`translate(${x}px,${y}px)`;k<1?requestAnimationFrame(f):res()};requestAnimationFrame(f)});
    if(el){el.classList.add("sel");S.tick();await wait(700);el.classList.remove("sel")}else await wait(500)}
  if(!to){g.style.opacity=0;await wait(900)}ghostBusy=false}
function seveCheck(){const n=pieces(),done=new Set(get("vrd-seve",[]));const s=SEVE.findIndex((x,i)=>x.need<=n&&!done.has(i));if(s<0||scr.classList.contains("finale"))return;
  done.add(s);put("vrd-seve",[...done]);setTimeout(async()=>{const R=scr.getBoundingClientRect();await ghost([R.width/2,R.height/2]);seveNote(s,true);
    setTimeout(()=>{const g=$("#ghost");if(g)g.style.opacity=0;ghostBusy=false},2500)},4200)}
function seveNote(i,typing){const s=SEVE[i],now=new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
  win({key:"seve"+i,title:"sans titre "+(i+1),icon:"note",cls:"NON SIGNÉ",w:520,h:330,body:wb=>{wb.innerHTML=`<div class="pad sv"><p class="svt"></p><p class="svm">AUTEUR : (champ vide) · AUCUN COMPTE OUVERT À ${now}</p></div>`;
    const p=wb.querySelector(".svt");if(!typing){p.textContent=s.t;return}let k=0;
    const ty=()=>{if(k>s.t.length)return;p.textContent=s.t.slice(0,k);if(k%2===0)S.key();k++;setTimeout(ty,s.t[k-1]===" "?140:55+Math.random()*90)};setTimeout(ty,600)}});
  desktop()}

/* ═════════ TERMINAL (retiré, mais toujours là) ═════════ */
let sev7=0,sev7t;
addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("input,textarea"))return;if(e.key==="7"){sev7++;clearTimeout(sev7t);sev7t=setTimeout(()=>sev7=0,2500);if(sev7===7){sev7=0;S.deny();terminal()}}});
const ALIAS={charte:"index",bureau:"index",index:"archives",recherche:"archives",structure:"hierarchie",courrier:"correspondance",versions:"contradictions",forum:"rumeurs"};
const DIRS={personnel:"personnel",terrain:"terrain",documentation:"doc",doc:"doc",exterieur:"ext",sources:"ext",sensibles:"priv",prive:"priv"};
function terminal(){put("vrd-term",1);desktop();win({key:"term",title:"Terminal — VRD-07",icon:"term",cls:"RÉV. 7.2",w:740,h:470,body:(wb,o)=>{
  wb.innerHTML=`<div class="term"><div class="to"></div><label class="tl"><span class="tp">graine@vrd-07:~$</span><input spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Commande"></label></div>`;
  const out=wb.querySelector(".to"),inp=wb.querySelector("input"),box=wb.querySelector(".term"),H=[];let hi=0;
  const p=(t,c="")=>{const d=doc.createElement("div");if(c)d.className=c;d.textContent=t;out.appendChild(d);box.scrollTop=box.scrollHeight};
  box.addEventListener("pointerup",()=>{if(!getSelection().toString())inp.focus()});setTimeout(()=>inp.focus(),300);
  ["VRD-07 · INTERPRÉTEUR DE COMMANDES · RÉV. 7.2","Ce terminal a été retiré de la version publique. Il fonctionne quand même.","Tapez « aide »."].forEach((l,i)=>p(l,i?"dim":"hd"));p("");
  const n=()=>pieces(),norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/\.html?$/,"").replace(/\/$/,"").trim();
  const resolve=a=>{const k=norm(a);if(!k)return null;if(k==="carte")return carte;if(/^(messagerie|mail|courriels?)$/.test(k))return mail;if(k==="carnet")return()=>V.carnet(true);
    if(/^cachet/.test(k))return cachet;if(k==="corbeille")return corbeille;if(/^(bande|signal)/.test(k))return n()>=4?bande:"aucune bande dans le lecteur.";
    if(k==="observatoire"||k==="veille")return n()>=6?()=>page(k):(k==="veille"?"flux chiffré.":"poste fermé.");
    if(DIRS[k])return()=>folder(DIRS[k]);const pk=ALIAS[k]||k;if(PG[pk])return()=>page(pk);return null};
  const C={
    aide:()=>["COMMANDES DISPONIBLES","  ls [dossier]        lister le poste ou un dossier","  ouvrir <pièce>      ouvrir une pièce, un dossier, une application","  chercher <terme>    préparer une requête dans l'index","  historique          dernières requêtes adressées à l'index","  qui · date · pieces · son · effacer · quitter"].forEach((l,i)=>p(l,i?"":"hd")),
    ls:a=>{const k=norm(a||"");if(!k){p("charte  registre  index  carte  messagerie  carnet  cachet-1947.png  corbeille/");p("personnel/  terrain/  documentation/  exterieur/  sensibles/");if(n()>=4)p("signal-14.wav","am");if(n()>=6)p("observatoire  veille","am");return}
      const d=DIRS[k];if(!d)return p("ls : "+a+" : dossier introuvable","er");p(FOLDERS[d][1].map(x=>x+".html").join("  "))},
    ouvrir:a=>{if(!a)return p("ouvrir : préciser une pièce. exemple : ouvrir registre","er");const r=resolve(a);if(!r)return p("ouvrir : "+a+" : pièce non répertoriée","er");if(typeof r==="string")return p(r,"er");p("ouverture de "+norm(a)+"…","dim");r()},
    chercher:a=>{if(!a)return p("chercher : terme manquant","er");const o2=page("archives");p("requête transmise à l'index : « "+a+" »","dim");p("contrôle de présence requis. lisez le code dans le bruit.","am");
      const fill=()=>{try{const q=o2.el.querySelector("iframe").contentDocument.getElementById("q");if(q){q.value=a;return true}}catch(e){}return false};
      if(!fill())o2.el.querySelector("iframe").addEventListener("load",()=>setTimeout(fill,50),{once:true})},
    historique:()=>{const L=get("vrd-req",[]).slice(0,12);if(!L.length)return p("aucune requête enregistrée.","dim");L.forEach(e=>p("« "+e.q+" »  →  "+e.r,e.ok?"am":"dim"))},
    qui:()=>{p("GRAINE · "+get("vrd-agent","LECTEUR"));p("habilitation : ÉCORCE");p("pièces reçues : "+n()+"/6");p("statut : lecteur non déclaré","dim")},
    date:()=>{let t="";try{t=new Date().toLocaleString("fr-CH",{timeZone:"Europe/Zurich"})}catch(e){t=new Date().toLocaleString()}p("BERNE · "+t);p("le Bureau répond avec un délai fixe de soixante-dix-neuf jours.","dim")},
    pieces:()=>p("◆".repeat(n())+"◇".repeat(6-n())+"  "+n()+"/6",n()?"am":""),
    son:a=>{const v=/^(off|non|0)$/.test(norm(a||""))?false:/^(on|oui|1)$/.test(norm(a||""))?true:!V.A.on;V.aSet(v);p("son : "+(v?"activé":"coupé"));const sb=$("#fx-snd");if(sb){sb.innerHTML=v?V.IC.snd:V.IC.mute;sb.classList.toggle("off",!v)}},
    effacer:()=>{out.innerHTML=""},quitter:()=>close(o),
    sudo:()=>{p("SANCTION-01 — retrait temporaire.","er");S.deny();inp.disabled=true;setTimeout(()=>{inp.disabled=false;inp.focus();p("accès rétabli.","dim")},6000)},
    rm:()=>{p("PROC-URG-04 — extinction documentaire. jamais appliquée.","er");S.deny()},
    echo:a=>p(a||""),redemarrer:()=>{try{sessionStorage.removeItem("vrd-poste")}catch(e){}location.reload()}};
  Object.assign(C,{help:C.aide,dir:C.ls,open:C.ouvrir,lire:C.ouvrir,cat:C.ouvrir,cd:C.ouvrir,search:C.chercher,history:C.historique,whoami:C.qui,clear:C.effacer,cls:C.effacer,exit:C.quitter,su:C.sudo,del:C.rm,supprimer:C.rm,reboot:C.redemarrer,progression:C.pieces});
  inp.addEventListener("keydown",e=>{
    if(e.key==="ArrowUp"){e.preventDefault();if(hi>0)inp.value=H[--hi]||"";return}
    if(e.key==="ArrowDown"){e.preventDefault();hi=Math.min(H.length,hi+1);inp.value=H[hi]||"";return}
    if(e.key==="Tab"){e.preventDefault();const v=norm(inp.value),c=Object.keys(C).find(k=>k.startsWith(v));if(v&&c)inp.value=c+" ";return}
    if(e.key!=="Enter")return;const raw=inp.value.trim();inp.value="";p("graine@vrd-07:~$ "+raw,"cmd");if(!raw)return;H.push(raw);hi=H.length;
    const full=raw.toLowerCase().replace(/\s+/g," "),parts=raw.split(/\s+/),c0=parts[0],cmd=norm(c0),arg=parts.slice(1).join(" ");
    if(/^7{3,}$/.test(full))return p("terminal retiré · rév. 7.2. vous y êtes pourtant.","am");
    if(typeof K!=="undefined"&&K[full]){S.relay();return K[full].split("\n").forEach(l=>p(l,"am"))}
    if(C[cmd]){S.relay();return C[cmd](arg)}
    const r=resolve(raw);if(typeof r==="function"){p("ouverture de "+norm(raw)+"…","dim");return r()}
    S.deny();p(c0+" : commande inconnue. tapez « aide ».","er")})}})}

/* ═════════ ÉTAT DES PÔLES ═════════ */
const POLES=[["g","MONTRÉAL","SANS RÉPONSE DU BUREAU"],["o","LAGOS","3 AGENTS NON REVENUS"],["g","SINGAPOUR","LECTURE NOCTURNE 03:17"],["a","SÃO PAULO","SUSPENDU DEPUIS 2017"],["r","TBILISSI","MUET DEPUIS 1983"],["g","OSLO","SALLE 4 · VIDE"],["g","KARACHI","VEILLE CONTINUE"],["g","NAIROBI","AUCUN AGENT PERMANENT"],["x","PÔLES 18–19","RADIÉS EN 1989"]];
function poles(){if(desk.querySelector(".poles"))return;const w=doc.createElement("div");w.className="poles";
  w.innerHTML=`<div class="ph"><span>ÉTAT DES PÔLES</span><span>17 DÉCLARÉS · 9 CONSULTABLES</span></div>`+POLES.map(([s,n,t])=>`<div class="pr ${s}" data-n="${n}"><i></i><b>${n}</b><span>${t}</span></div>`).join("");
  desk.appendChild(w);w.addEventListener("click",()=>{S.click();page("poles")});
  const tb=w.querySelector('[data-n="TBILISSI"]');setInterval(()=>{if(Math.random()<.25&&!scr.classList.contains("finale")){const sp=tb.querySelector("span");tb.classList.add("live");sp.textContent="SIGNAL ENTRANT…";S.ticks();setTimeout(()=>{tb.classList.remove("live");sp.textContent="MUET DEPUIS 1983"},2300)}},40000)}

async function start(){
  try{if(!sessionStorage.getItem("vrd-poste")){await power();await bios();await login();sessionStorage.setItem("vrd-poste","1")}}catch(e){}
  buildBar();desktop();poles();ambience();setTimeout(seveCheck,6000);
  const gh=()=>{if(doc.visibilityState==="visible"&&!W.has("p-observatoire"))ghost();setTimeout(gh,(300+Math.random()*240)*1000/(1+pieces()/3))};setTimeout(gh,150000);phase.classList.add("gone");setTimeout(()=>phase.innerHTML="",900);
  const r=readSet();if(!r.has("m0"))setTimeout(()=>notify("Accusé de réception","Bureau d'Archivage Permanent · 1 message non lu",{from:"MESSAGERIE",onclick:mail,ms:12000}),1600)}
start();
})();
