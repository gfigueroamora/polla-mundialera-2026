import { useState, useEffect, useMemo, useCallback } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

// ── FIREBASE ──────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAWH7QquD-HpvJO41WdidB2gX1UKe9jfvQ",
  authDomain: "pollamundialera-2026.firebaseapp.com",
  projectId: "pollamundialera-2026",
  storageBucket: "pollamundialera-2026.firebasestorage.app",
  messagingSenderId: "773048136664",
  appId: "1:773048136664:web:374bad7a51eef800d778ad"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ── ADMIN ─────────────────────────────────────────────────────────────────────
// Para cambiar: modificar ADMIN_CODE y ADMIN_PIN
const ADMIN_CODE = "GUSTAVO";
const ADMIN_PIN  = "7787";

// ── DATOS ─────────────────────────────────────────────────────────────────────
const GROUPS = {
  A:["México","Sudáfrica","Corea del Sur","Rep. Checa"],
  B:["Canadá","Qatar","Suiza","Bosnia y Herz."],
  C:["Brasil","Marruecos","Haití","Escocia"],
  D:["Estados Unidos","Paraguay","Australia","Turquía"],
  E:["Alemania","Curazao","Costa de Marfil","Ecuador"],
  F:["Países Bajos","Japón","Suecia","Túnez"],
  G:["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H:["España","Cabo Verde","Arabia Saudita","Uruguay"],
  I:["Francia","Senegal","Irak","Noruega"],
  J:["Argentina","Argelia","Austria","Jordania"],
  K:["Portugal","RD Congo","Uzbekistán","Colombia"],
  L:["Inglaterra","Croacia","Ghana","Panamá"],
};

const BASE_MATCHES = [
  {id:"g01",group:"A",home:"México",away:"Sudáfrica",date:"11 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g02",group:"A",home:"Corea del Sur",away:"Rep. Checa",date:"11 Jun",time:"22:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g03",group:"B",home:"Canadá",away:"Bosnia y Herz.",date:"12 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g04",group:"D",home:"Estados Unidos",away:"Paraguay",date:"12 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g05",group:"B",home:"Qatar",away:"Suiza",date:"13 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g06",group:"C",home:"Brasil",away:"Marruecos",date:"13 Jun",time:"18:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g07",group:"C",home:"Haití",away:"Escocia",date:"13 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g08",group:"D",home:"Australia",away:"Turquía",date:"14 Jun",time:"00:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g09",group:"E",home:"Alemania",away:"Curazao",date:"14 Jun",time:"13:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g10",group:"F",home:"Países Bajos",away:"Japón",date:"14 Jun",time:"16:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g11",group:"E",home:"Costa de Marfil",away:"Ecuador",date:"14 Jun",time:"19:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g12",group:"F",home:"Suecia",away:"Túnez",date:"14 Jun",time:"22:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g13",group:"H",home:"España",away:"Cabo Verde",date:"15 Jun",time:"12:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g14",group:"G",home:"Bélgica",away:"Egipto",date:"15 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g15",group:"H",home:"Arabia Saudita",away:"Uruguay",date:"15 Jun",time:"18:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g16",group:"G",home:"Irán",away:"Nueva Zelanda",date:"15 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g17",group:"I",home:"Francia",away:"Senegal",date:"16 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g18",group:"I",home:"Irak",away:"Noruega",date:"16 Jun",time:"18:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g19",group:"J",home:"Argentina",away:"Argelia",date:"16 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g20",group:"J",home:"Austria",away:"Jordania",date:"17 Jun",time:"00:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g21",group:"K",home:"Portugal",away:"RD Congo",date:"17 Jun",time:"13:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g22",group:"L",home:"Inglaterra",away:"Croacia",date:"17 Jun",time:"16:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g23",group:"L",home:"Ghana",away:"Panamá",date:"17 Jun",time:"19:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g24",group:"K",home:"Uzbekistán",away:"Colombia",date:"17 Jun",time:"22:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g25",group:"A",home:"Rep. Checa",away:"Sudáfrica",date:"18 Jun",time:"12:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g26",group:"B",home:"Suiza",away:"Bosnia y Herz.",date:"18 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g27",group:"B",home:"Canadá",away:"Qatar",date:"18 Jun",time:"18:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g28",group:"A",home:"México",away:"Corea del Sur",date:"18 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g29",group:"D",home:"Estados Unidos",away:"Australia",date:"19 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g30",group:"C",home:"Escocia",away:"Marruecos",date:"19 Jun",time:"18:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g31",group:"C",home:"Brasil",away:"Haití",date:"19 Jun",time:"20:30",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g32",group:"D",home:"Turquía",away:"Paraguay",date:"20 Jun",time:"00:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g33",group:"F",home:"Países Bajos",away:"Suecia",date:"20 Jun",time:"13:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g34",group:"E",home:"Alemania",away:"Costa de Marfil",date:"20 Jun",time:"16:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g35",group:"E",home:"Ecuador",away:"Curazao",date:"20 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g36",group:"F",home:"Túnez",away:"Japón",date:"21 Jun",time:"00:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g37",group:"H",home:"España",away:"Arabia Saudita",date:"21 Jun",time:"12:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g38",group:"G",home:"Bélgica",away:"Irán",date:"21 Jun",time:"15:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g39",group:"H",home:"Uruguay",away:"Cabo Verde",date:"21 Jun",time:"18:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g40",group:"G",home:"Nueva Zelanda",away:"Egipto",date:"21 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g41",group:"J",home:"Argentina",away:"Austria",date:"22 Jun",time:"13:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g42",group:"I",home:"Francia",away:"Irak",date:"22 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g43",group:"I",home:"Noruega",away:"Senegal",date:"22 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g44",group:"J",home:"Jordania",away:"Argelia",date:"23 Jun",time:"00:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g45",group:"K",home:"Portugal",away:"Uzbekistán",date:"23 Jun",time:"13:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g46",group:"L",home:"Inglaterra",away:"Ghana",date:"23 Jun",time:"16:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g47",group:"L",home:"Panamá",away:"Croacia",date:"23 Jun",time:"19:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g48",group:"K",home:"Colombia",away:"RD Congo",date:"23 Jun",time:"22:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g49",group:"A",home:"Sudáfrica",away:"Corea del Sur",date:"24 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g50",group:"A",home:"Rep. Checa",away:"México",date:"24 Jun",time:"21:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g51",group:"B",home:"Bosnia y Herz.",away:"Canadá",date:"25 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g52",group:"B",home:"Suiza",away:"Qatar",date:"25 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g53",group:"C",home:"Marruecos",away:"Brasil",date:"25 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g54",group:"C",home:"Escocia",away:"Haití",date:"25 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g55",group:"D",home:"Paraguay",away:"Australia",date:"26 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g56",group:"D",home:"Turquía",away:"Estados Unidos",date:"26 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g57",group:"E",home:"Curazao",away:"Alemania",date:"26 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g58",group:"E",home:"Ecuador",away:"Costa de Marfil",date:"26 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g59",group:"F",home:"Japón",away:"Países Bajos",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g60",group:"F",home:"Túnez",away:"Suecia",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g61",group:"G",home:"Egipto",away:"Bélgica",date:"27 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g62",group:"G",home:"Nueva Zelanda",away:"Irán",date:"27 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g63",group:"H",home:"Cabo Verde",away:"España",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g64",group:"H",home:"Uruguay",away:"Arabia Saudita",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g65",group:"I",home:"Senegal",away:"Francia",date:"27 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g66",group:"I",home:"Noruega",away:"Irak",date:"27 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g67",group:"J",home:"Argelia",away:"Austria",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g68",group:"J",home:"Jordania",away:"Argentina",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g69",group:"K",home:"RD Congo",away:"Portugal",date:"27 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g70",group:"K",home:"Colombia",away:"Uzbekistán",date:"27 Jun",time:"20:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g71",group:"L",home:"Croacia",away:"Inglaterra",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
  {id:"g72",group:"L",home:"Panamá",away:"Ghana",date:"27 Jun",time:"17:00",status:"upcoming",homeScore:null,awayScore:null},
];

const KO_ROUNDS = ["16avos","8vos","Cuartos","Semis","Final"];
const KO_PTS = {"16avos":4,"8vos":6,"Cuartos":8,"Semis":10,"Final":15};
const CHAMPION_BONUS = 20;
const BET = 10000;
const AVATARS = ["⚽","🦁","🐺","🦊","🐯","🦅","🐲","🦈","🦋","🔥","⚡","🌟","🎯","👑","🦁","🐉","🌊","⭐","🎪","🏹"];
const ALL_TEAMS = [...new Set(Object.values(GROUPS).flat())].sort();
const COMPANY_EMOJIS = ["🏢","🚛","🛒","🏭","🏪","🏦","🍕","⚽","🎯","🔥","💼","🌟"];
const COMPANY_COLORS = ["#3b82f6","#16a34a","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#64748b"];
const REACTIONS = ["🔥","😂","😭","👏","🤯","💪","😤","🎯"];
const INITIAL_COMPANIES = [
  {id:"c1",name:"Amigos",code:"AMIGOS",pin:"1111",color:"#3b82f6",emoji:"👥",players:[],allowedNames:[],betAmount:10000},
  {id:"c2",name:"Transportes Figueroa",code:"FIGUEROA",pin:"2222",color:"#f59e0b",emoji:"🚛",players:[],allowedNames:[],betAmount:10000},
  {id:"c3",name:"Comercial Khatar",code:"KHATAR",pin:"3333",color:"#16a34a",emoji:"🛒",players:[],allowedNames:[],betAmount:10000},
];

// ── TIEMPO ────────────────────────────────────────────────────────────────────
const MONTH_MAP = {"Jun":5,"Jul":6};
function matchDateTime(date, time) {
  if(!date||!time) return null;
  const [day, mon] = date.split(" ");
  const [h, m] = time.split(":").map(Number);
  const month = MONTH_MAP[mon];
  if(month === undefined) return null;
  return new Date(2026, month, parseInt(day), h, m, 0);
}
function isMatchClosed(match) {
  if(match.status === "finished" || match.status === "live") return true;
  const dt = matchDateTime(match.date, match.time);
  if(!dt) return false;
  return new Date() >= new Date(dt.getTime() - 15 * 60 * 1000);
}
function getCountdown(match) {
  const dt = matchDateTime(match.date, match.time);
  if(!dt) return null;
  const closeTime = new Date(dt.getTime() - 15 * 60 * 1000);
  const diff = closeTime - new Date();
  if(diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return { diff, h, m };
}
function isToday(match) {
  const dt = matchDateTime(match.date, match.time);
  if(!dt) return false;
  const now = new Date();
  return dt.getDate()===now.getDate() && dt.getMonth()===now.getMonth();
}

// ── PUNTOS ────────────────────────────────────────────────────────────────────
function calcPts(pred, match) {
  if(!pred || match.homeScore === null) return null;
  const isKO = !!match.round;
  const base = isKO ? (KO_PTS[match.round]||4) : 0;
  if(pred.home===match.homeScore && pred.away===match.awayScore) return isKO?base+3:3;
  const pw=pred.home>pred.away?"H":pred.home<pred.away?"A":"D";
  const rw=match.homeScore>match.awayScore?"H":match.homeScore<match.awayScore?"A":"D";
  if(pw===rw) return isKO?base+1:1;
  return isKO?base:0;
}
function getStats(player, predictions, allMatches, actualChampion) {
  let total=0,exact=0,winner=0,miss=0,played=0;
  allMatches.forEach(m=>{
    if(m.status!=="finished") return;
    const pred=predictions[player.id]?.[m.id];
    if(!pred) return;
    played++;
    const pts=calcPts(pred,m);
    total+=pts;
    if(pts>=3) exact++; else if(pts>0) winner++; else miss++;
  });
  const champBonus=(actualChampion&&player.champion===actualChampion)?CHAMPION_BONUS:0;
  return {total:total+champBonus,exact,winner,miss,played,pct:played?Math.round(((exact+winner)/played)*100):0,champBonus};
}
function calcGroupTable(groupKey, matches) {
  const teams=GROUPS[groupKey], table={};
  teams.forEach(t=>{table[t]={pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,pts:0};});
  matches.filter(m=>m.group===groupKey&&m.status==="finished").forEach(m=>{
    const h=table[m.home],a=table[m.away];
    if(!h||!a) return;
    h.pj++;a.pj++;h.gf+=m.homeScore;h.gc+=m.awayScore;a.gf+=m.awayScore;a.gc+=m.homeScore;
    if(m.homeScore>m.awayScore){h.pg++;h.pts+=3;a.pp++;}
    else if(m.homeScore<m.awayScore){a.pg++;a.pts+=3;h.pp++;}
    else{h.pe++;h.pts++;a.pe++;a.pts++;}
  });
  return Object.entries(table).map(([name,s])=>({name,...s,dif:s.gf-s.gc}))
    .sort((a,b)=>b.pts-a.pts||b.dif-a.dif||b.gf-a.gf);
}
function fmtCLP(n){return "$"+n.toLocaleString("es-CL");}
function shareWA(player,rank,total,companyName,players){
  const txt=`⚽ *Polla Mundialera 2026*\n🏢 ${companyName}\n${player.avatar} ${player.name} — #${rank} de ${players.length}\n💯 ${total} puntos\n¡A pronosticar! 🔥`;
  window.open(`https://wa.me/?text=${encodeURIComponent(txt)}`,"_blank");
}

// ── COUNTDOWN COMPONENT ───────────────────────────────────────────────────────
function Countdown({match}){
  const [cd, setCd] = useState(()=>getCountdown(match));
  useEffect(()=>{
    const t = setInterval(()=>setCd(getCountdown(match)), 30000);
    return ()=>clearInterval(t);
  },[match]);
  if(!cd) return null;
  const urgent = cd.diff < 30*60*1000;
  const warn   = cd.diff < 60*60*1000;
  return(
    <span style={{
      fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:999,
      background: urgent?"#450a0a":warn?"#431407":"#0f172a",
      color: urgent?"#f87171":warn?"#fb923c":"#4ade80",
      border:`1px solid ${urgent?"#dc2626":warn?"#ea580c":"#16a34a"}`
    }}>
      {urgent&&"⚠️ "}Cierra en {cd.h>0?`${cd.h}h `:""}{cd.m}min
    </span>
  );
}

// ── MATCH CARD ────────────────────────────────────────────────────────────────
function MatchCard({match,prediction,onPredict,allPlayers,allPredictions,reactions,onReact,currentPlayerId,companyColor}){
  const [h,setH]=useState(prediction?.home??"");
  const [a,setA]=useState(prediction?.away??"");
  const [showAll,setShowAll]=useState(false);
  const [saved,setSaved]=useState(false);
  const closed = isMatchClosed(match);
  const pts=prediction&&match.status==="finished"?calcPts(prediction,match):null;
  const isDone=match.status==="finished", isLive=match.status==="live";
  const todayMatch=isToday(match);

  useEffect(()=>{ if(prediction){setH(prediction.home??"");setA(prediction.away??"");} },[prediction]);

  function handleSave(){
    if(h===""||a==="") return;
    onPredict(match.id,parseInt(h)||0,parseInt(a)||0);
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  }

  const matchReactions = reactions?.[match.id]||{};

  return(
    <div style={{
      background: todayMatch&&!isDone?"#1a2744":"#1e293b",
      borderRadius:12,padding:"12px 14px",marginBottom:8,
      border: isLive?"1.5px solid #ef4444":todayMatch&&!isDone?`1.5px solid ${companyColor}`:"1.5px solid #334155"
    }}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
        <span style={{fontSize:11,color:"#64748b"}}>{match.date} {match.time} CHI · {match.group?"Gr."+match.group:match.round}</span>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {todayMatch&&!isDone&&!isLive&&<span style={{fontSize:10,fontWeight:700,color:companyColor}}>HOY</span>}
          {isLive&&<span style={{fontSize:11,fontWeight:800,color:"#ef4444"}}>🔴 EN VIVO</span>}
          {isDone&&<span style={{fontSize:11,fontWeight:700,color:"#4ade80"}}>✓ Final</span>}
          {!isDone&&!isLive&&<Countdown match={match}/>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"space-between"}}>
        <span style={{flex:1,fontWeight:700,fontSize:13,color:"#f1f5f9",textAlign:"right"}}>{match.home}</span>
        {isDone||isLive?(
          <span style={{background:"#0f172a",border:"1px solid #475569",borderRadius:8,
            padding:"4px 12px",fontWeight:900,fontSize:18,color:"#f8fafc",minWidth:56,textAlign:"center"}}>
            {match.homeScore}–{match.awayScore}
          </span>
        ):(
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <input type="number" min="0" max="20" value={h} onChange={e=>setH(e.target.value)} disabled={closed}
              style={{width:38,textAlign:"center",background:"#0f172a",border:"1px solid #475569",
                borderRadius:6,color:closed?"#475569":"#f1f5f9",padding:"4px 0",fontSize:16,fontWeight:700}}/>
            <span style={{color:"#475569",fontWeight:700}}>–</span>
            <input type="number" min="0" max="20" value={a} onChange={e=>setA(e.target.value)} disabled={closed}
              style={{width:38,textAlign:"center",background:"#0f172a",border:"1px solid #475569",
                borderRadius:6,color:closed?"#475569":"#f1f5f9",padding:"4px 0",fontSize:16,fontWeight:700}}/>
          </div>
        )}
        <span style={{flex:1,fontWeight:700,fontSize:13,color:"#f1f5f9"}}>{match.away}</span>
      </div>

      {!isDone&&!isLive&&closed&&(
        <div style={{marginTop:6,textAlign:"center",fontSize:11,color:"#475569"}}>🔒 Pronósticos cerrados</div>
      )}

      {!closed&&!isDone&&!isLive&&(
        <button onClick={handleSave} style={{
          marginTop:8,width:"100%",
          background:saved?"#065f46":h===""||a===""?"#334155":"#16a34a",
          color:"#fff",border:"none",borderRadius:8,padding:"7px 0",fontWeight:700,fontSize:13,
          cursor:h===""||a===""?"not-allowed":"pointer",
          transition:"background 0.3s"
        }}>
          {saved?"✅ Pronóstico guardado":prediction?"✓ Actualizar pronóstico":"Guardar pronóstico"}
        </button>
      )}

      {prediction&&isDone&&(
        <div style={{marginTop:6,display:"flex",justifyContent:"space-between",
          background:"#0f172a",borderRadius:8,padding:"5px 12px",alignItems:"center"}}>
          <span style={{fontSize:12,color:"#94a3b8"}}>Tu pronóstico: <b style={{color:"#cbd5e1"}}>{prediction.home}–{prediction.away}</b></span>
          {pts!==null&&<span style={{fontWeight:900,fontSize:14,color:pts>=3?"#4ade80":pts>0?"#fbbf24":"#f87171"}}>{pts>0?`+${pts}`:pts} pts</span>}
        </div>
      )}

      {/* Reacciones */}
      {(isDone||isLive)&&(
        <div style={{marginTop:8}}>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {REACTIONS.map(r=>{
              const count = Object.values(matchReactions).filter(v=>v===r).length;
              const mine = matchReactions[currentPlayerId]===r;
              return(
                <button key={r} onClick={()=>onReact(match.id,r)} style={{
                  background:mine?"#1d4ed8":"#0f172a",
                  border:`1px solid ${mine?"#3b82f6":"#334155"}`,
                  borderRadius:999,padding:"3px 8px",cursor:"pointer",
                  fontSize:12,color:"#f1f5f9",display:"flex",alignItems:"center",gap:3
                }}>
                  {r}{count>0&&<span style={{fontSize:10,color:"#94a3b8"}}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isDone&&allPlayers&&allPlayers.length>0&&(
        <div style={{marginTop:6}}>
          <button onClick={()=>setShowAll(p=>!p)} style={{background:"none",border:"none",color:"#60a5fa",fontSize:12,cursor:"pointer",padding:0}}>
            {showAll?"▲ Ocultar":"▼ Ver pronósticos de todos"}
          </button>
          {showAll&&(
            <div style={{marginTop:5,display:"flex",flexDirection:"column",gap:3}}>
              {allPlayers.map(pl=>{
                const pr=allPredictions[pl.id]?.[match.id];
                const p=pr?calcPts(pr,match):null;
                return(
                  <div key={pl.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    background:"#0f172a",borderRadius:6,padding:"4px 10px"}}>
                    <span style={{fontSize:13}}>{pl.avatar} <span style={{color:"#cbd5e1"}}>{pl.name}</span></span>
                    <span style={{fontSize:12,color:"#94a3b8"}}>{pr?`${pr.home}–${pr.away}`:"—"}</span>
                    {p!==null&&<span style={{fontWeight:800,fontSize:12,color:p>=3?"#4ade80":p>0?"#fbbf24":"#f87171"}}>{p>0?`+${p}`:p}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GroupTable({groupKey,matches}){
  const table=calcGroupTable(groupKey,matches);
  const hasPlayed=table.some(t=>t.pj>0);
  return(
    <div style={{background:"#1e293b",borderRadius:12,padding:"10px 12px",marginBottom:10,border:"1px solid #334155"}}>
      <div style={{fontWeight:800,color:"#f59e0b",fontSize:12,marginBottom:8}}>GRUPO {groupKey}</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{color:"#64748b"}}>
              {["#","Equipo","PJ","G","E","P","GF","GC","Dif","Pts"].map(h=>(
                <th key={h} style={{textAlign:h==="Equipo"?"left":"center",padding:"2px 4px",fontWeight:600}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((t,i)=>(
              <tr key={t.name} style={{borderTop:"1px solid #0f172a"}}>
                <td style={{padding:"4px",color:i<2?"#4ade80":"#64748b",fontWeight:700,textAlign:"center"}}>{i+1}</td>
                <td style={{padding:"4px",color:"#e2e8f0",fontWeight:600,whiteSpace:"nowrap"}}>{t.name}</td>
                {[t.pj,t.pg,t.pe,t.pp,t.gf,t.gc].map((v,j)=>(
                  <td key={j} style={{textAlign:"center",padding:"4px",color:"#94a3b8"}}>{hasPlayed?v:"-"}</td>
                ))}
                <td style={{textAlign:"center",padding:"4px",color:t.dif>0?"#4ade80":t.dif<0?"#f87171":"#94a3b8"}}>
                  {hasPlayed?(t.dif>0?`+${t.dif}`:t.dif):"-"}
                </td>
                <td style={{textAlign:"center",padding:"4px",fontWeight:900,color:"#f8fafc"}}>{hasPlayed?t.pts:"-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App(){
  const [loading,setLoading]=useState(true);
  const [companies,setCompanies]=useState([]);
  const [matches,setMatches]=useState(BASE_MATCHES);
  const [koMatches,setKoMatches]=useState([]);
  const [predictions,setPredictions]=useState({});
  const [reactions,setReactions]=useState({});
  const [actualChampion,setActualChampion]=useState(null);
  const [feed,setFeed]=useState([]);

  const [screen,setScreen]=useState("company");
  const [currentCompany,setCurrentCompany]=useState(null);
  const [currentPlayer,setCurrentPlayer]=useState(null);

  // Login
  const [compCode,setCompCode]=useState("");
  const [compPin,setCompPin]=useState("");
  const [compError,setCompError]=useState("");
  const [regMode,setRegMode]=useState(false);
  const [playerName,setPlayerName]=useState("");
  const [playerPin,setPlayerPin]=useState("");
  const [playerAvatar,setPlayerAvatar]=useState("⚽");
  const [playerChampion,setPlayerChampion]=useState("");
  const [playerError,setPlayerError]=useState("");
  const [tab,setTab]=useState("ranking");
  const [filterGroup,setFilterGroup]=useState("all");
  const [prevRanks,setPrevRanks]=useState({});

  // Admin
  const [adminSection,setAdminSection]=useState("results");
  const [adminMsg,setAdminMsg]=useState("");
  const [adminMatchId,setAdminMatchId]=useState("");
  const [adminH,setAdminH]=useState("");
  const [adminA,setAdminA]=useState("");
  const [adminMatchStatus,setAdminMatchStatus]=useState("finished");
  const [adminKORound,setAdminKORound]=useState("16avos");
  const [adminKOHome,setAdminKOHome]=useState("");
  const [adminKOAway,setAdminKOAway]=useState("");
  const [adminKODate,setAdminKODate]=useState("");
  const [adminKOTime,setAdminKOTime]=useState("");
  const [adminChampion,setAdminChampion]=useState("");
  const [newCompName,setNewCompName]=useState("");
  const [newCompCode,setNewCompCode]=useState("");
  const [newCompPin,setNewCompPin]=useState("");
  const [newCompEmoji,setNewCompEmoji]=useState("🏢");
  const [newCompColor,setNewCompColor]=useState("#3b82f6");
  const [newCompBet,setNewCompBet]=useState("10000");
  const [newAllowedName,setNewAllowedName]=useState("");
  const [selectedCompanyId,setSelectedCompanyId]=useState("");
  const [resetPlayerPin,setResetPlayerPin]=useState("");

  // Firebase sync
  useEffect(()=>{
    const unsub=onSnapshot(doc(db,"global","state"),(snap)=>{
      if(snap.exists()){
        const d=snap.data();
        setCompanies(d.companies||INITIAL_COMPANIES);
        setMatches(d.matches||BASE_MATCHES);
        setKoMatches(d.koMatches||[]);
        setPredictions(d.predictions||{});
        setReactions(d.reactions||{});
        setActualChampion(d.actualChampion||null);
        setFeed(d.feed||[]);
      } else {
        persist({companies:INITIAL_COMPANIES,matches:BASE_MATCHES,koMatches:[],predictions:{},reactions:{},actualChampion:null,feed:[]});
      }
      setLoading(false);
    });
    return()=>unsub();
  },[]);

  useEffect(()=>{
    if(currentCompany){
      const updated=companies.find(c=>c.id===currentCompany.id);
      if(updated) setCurrentCompany(updated);
    }
  },[companies]);

  async function persist(patch){ await updateDoc(doc(db,"global","state"),patch); }
  async function persistInit(data){ await setDoc(doc(db,"global","state"),data,{merge:true}); }

  function addFeedItem(text){
    const item={id:Date.now(),text,time:new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"})};
    const newFeed=[item,...(feed||[])].slice(0,30);
    persist({feed:newFeed});
  }

  const allMatches=useMemo(()=>[...matches,...koMatches],[matches,koMatches]);
  const compPlayers=currentCompany?.players||[];
  const compBet = currentCompany?.betAmount || 10000;
  const pot=compPlayers.length*compBet;

  function showAdminMsg(msg){setAdminMsg(msg);setTimeout(()=>setAdminMsg(""),3000);}

  // Ranking con tendencia
  const rankingData=useMemo(()=>{
    const data=compPlayers.map(p=>({
      player:p,stats:getStats(p,predictions,allMatches,actualChampion)
    })).sort((a,b)=>b.stats.total-a.stats.total);
    return data.map((r,i)=>({
      ...r,
      rank:i+1,
      prevRank:prevRanks[r.player.id]||i+1,
      trend:(prevRanks[r.player.id]||i+1)-(i+1)
    }));
  },[compPlayers,predictions,allMatches,actualChampion]);

  useEffect(()=>{
    const newPrevRanks={};
    rankingData.forEach(r=>{ newPrevRanks[r.player.id]=r.rank; });
    setTimeout(()=>setPrevRanks(newPrevRanks),5000);
  },[rankingData]);

  const myRank=rankingData.findIndex(r=>r.player.id===currentPlayer?.id)+1;
  const myStats=currentPlayer?getStats(currentPlayer,predictions,allMatches,actualChampion):null;
  const groupKeys=Object.keys(GROUPS);

  const todayMatches=allMatches.filter(m=>isToday(m)&&m.status!=="finished");
  const visibleMatches=filterGroup==="all"?allMatches:filterGroup==="ko"?koMatches:filterGroup==="today"?todayMatches:allMatches.filter(m=>m.group===filterGroup);

  // Company login
  function handleCompanyLogin(){
    if(compCode.toUpperCase()===ADMIN_CODE&&compPin===ADMIN_PIN){
      setScreen("admin");setCompError("");return;
    }
    const c=companies.find(c=>c.code.toUpperCase()===compCode.toUpperCase()&&c.pin===compPin);
    if(c){setCurrentCompany(c);setScreen("playerLogin");setCompError("");}
    else setCompError("Código o clave incorrectos");
  }

  // Player login
  function handlePlayerLogin(){
    const p=compPlayers.find(p=>p.name.toLowerCase()===playerName.toLowerCase()&&p.pin===playerPin);
    if(p){setCurrentPlayer(p);setScreen("home");setPlayerError("");}
    else setPlayerError("Nombre o PIN incorrecto");
  }

  async function handlePlayerRegister(){
    if(!playerName.trim()||playerPin.length!==4){setPlayerError("Nombre y PIN de 4 dígitos requeridos");return;}
    const allowed=currentCompany.allowedNames||[];
    if(allowed.length>0&&!allowed.map(n=>n.toLowerCase()).includes(playerName.trim().toLowerCase())){
      setPlayerError("Tu nombre no está en la lista de esta polla. Contacta a tu admin.");return;
    }
    if(compPlayers.find(p=>p.name.toLowerCase()===playerName.toLowerCase())){setPlayerError("Ese nombre ya existe");return;}
    const np={id:"p"+Date.now(),name:playerName.trim(),pin:playerPin,avatar:playerAvatar,champion:playerChampion||null};
    const updatedCompanies=companies.map(c=>c.id===currentCompany.id?{...c,players:[...c.players,np]}:c);
    await persist({companies:updatedCompanies});
    addFeedItem(`${playerAvatar} ${playerName.trim()} se unió a ${currentCompany.name}`);
    setCurrentPlayer(np);setScreen("home");setPlayerError("");
  }

  async function handlePredict(matchId,home,away){
    if(!currentPlayer) return;
    const m=allMatches.find(x=>x.id===matchId);
    const updatedPredictions={...predictions,[currentPlayer.id]:{...(predictions[currentPlayer.id]||{}),[matchId]:{home,away}}};
    await persist({predictions:updatedPredictions});
    if(m) addFeedItem(`${currentPlayer.avatar} ${currentPlayer.name} pronosticó ${m.home} ${home}–${away} ${m.away}`);
  }

  async function handleReact(matchId,reaction){
    if(!currentPlayer) return;
    const updatedReactions={...reactions,[matchId]:{...(reactions[matchId]||{}),[currentPlayer.id]:reaction}};
    await persist({reactions:updatedReactions});
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if(loading) return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{fontSize:64,marginBottom:8,animation:"pulse 1s infinite"}}>⚽</div>
      <div style={{color:"#f8fafc",fontWeight:900,fontSize:20,marginBottom:4}}>Polla Mundialera</div>
      <div style={{color:"#f59e0b",fontWeight:800,fontSize:14,letterSpacing:2,marginBottom:16}}>2026</div>
      <div style={{display:"flex",gap:6}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6",
            opacity:0.3+i*0.35}}/>
        ))}
      </div>
      <div style={{color:"#475569",fontSize:12,marginTop:12}}>Conectando...</div>
    </div>
  );

  // ── COMPANY LOGIN ──────────────────────────────────────────────────────────
  if(screen==="company") return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",padding:20}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:60,marginBottom:8}}>⚽</div>
        <h1 style={{color:"#f8fafc",fontSize:28,fontWeight:900,margin:0,letterSpacing:-1}}>Polla Mundialera</h1>
        <div style={{color:"#f59e0b",fontWeight:800,fontSize:16,letterSpacing:3,marginTop:4}}>2026</div>
        <div style={{color:"#475569",fontSize:12,marginTop:8}}>USA · CANADÁ · MÉXICO · 11 Jun – 19 Jul</div>
      </div>
      <div style={{background:"#1e293b",borderRadius:16,padding:24,width:"100%",maxWidth:380,border:"1px solid #334155"}}>
        <div style={{fontWeight:800,color:"#f8fafc",fontSize:15,marginBottom:4}}>Bienvenido</div>
        <div style={{color:"#64748b",fontSize:12,marginBottom:16}}>Ingresa el código y clave de tu empresa</div>
        <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>USUARIO / EMPRESA</label>
        <input value={compCode} onChange={e=>setCompCode(e.target.value.toUpperCase())}
          placeholder="Código de empresa" onKeyDown={e=>e.key==="Enter"&&handleCompanyLogin()}
          style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
            color:"#f1f5f9",padding:"10px 12px",fontSize:15,marginBottom:12,
            boxSizing:"border-box",letterSpacing:1}}/>
        <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>CLAVE</label>
        <input type="password" maxLength={4} value={compPin} onChange={e=>setCompPin(e.target.value)}
          placeholder="••••" onKeyDown={e=>e.key==="Enter"&&handleCompanyLogin()}
          style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
            color:"#f1f5f9",padding:"10px 12px",fontSize:20,letterSpacing:8,marginBottom:16,boxSizing:"border-box"}}/>
        {compError&&<div style={{color:"#f87171",fontSize:13,marginBottom:12}}>{compError}</div>}
        <button onClick={handleCompanyLogin} style={{width:"100%",background:"#3b82f6",color:"#fff",
          border:"none",borderRadius:10,padding:"13px 0",fontWeight:800,fontSize:16,cursor:"pointer"}}>
          Continuar →
        </button>
        <div style={{marginTop:14,textAlign:"center",color:"#334155",fontSize:11}}>
          ¿No tienes código? Contacta al organizador de tu polla
        </div>
      </div>
    </div>
  );

  // ── PLAYER LOGIN ───────────────────────────────────────────────────────────
  if(screen==="playerLogin") return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",fontFamily:"'Inter',system-ui,sans-serif",padding:20}}>
      <div style={{background:currentCompany.color,borderRadius:16,padding:"14px 24px",
        marginBottom:20,textAlign:"center",maxWidth:340,width:"100%"}}>
        <div style={{fontSize:36,marginBottom:4}}>{currentCompany.emoji}</div>
        <div style={{fontWeight:900,fontSize:20,color:"#fff"}}>{currentCompany.name}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:2}}>
          {compPlayers.length} jugador{compPlayers.length!==1?"es":""} · Pozo {fmtCLP(compPlayers.length*(currentCompany?.betAmount||10000))}
        </div>
      </div>
      <div style={{background:"#1e293b",borderRadius:16,padding:24,width:"100%",maxWidth:340,border:"1px solid #334155"}}>
        <div style={{display:"flex",marginBottom:16,background:"#0f172a",borderRadius:10,padding:3}}>
          {["Entrar","Registrarse"].map((t,i)=>(
            <button key={t} onClick={()=>{setRegMode(i===1);setPlayerError("");}} style={{
              flex:1,padding:"8px 0",borderRadius:8,border:"none",
              background:regMode===(i===1)?currentCompany.color:"transparent",
              color:regMode===(i===1)?"#fff":"#64748b",fontWeight:700,fontSize:14,cursor:"pointer"
            }}>{t}</button>
          ))}
        </div>
        {!regMode?(
          <>
            <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>TU NOMBRE</label>
            <input value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="Tu nombre"
              onKeyDown={e=>e.key==="Enter"&&handlePlayerLogin()}
              style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
                color:"#f1f5f9",padding:"10px 12px",fontSize:15,marginBottom:12,boxSizing:"border-box"}}/>
            <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>TU PIN</label>
            <input type="password" maxLength={4} value={playerPin} onChange={e=>setPlayerPin(e.target.value)}
              placeholder="••••" onKeyDown={e=>e.key==="Enter"&&handlePlayerLogin()}
              style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
                color:"#f1f5f9",padding:"10px 12px",fontSize:20,letterSpacing:8,marginBottom:14,boxSizing:"border-box"}}/>
            {playerError&&<div style={{color:"#f87171",fontSize:13,marginBottom:10}}>{playerError}</div>}
            <button onClick={handlePlayerLogin} style={{width:"100%",background:currentCompany.color,
              color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontWeight:800,fontSize:16,cursor:"pointer"}}>
              Entrar →
            </button>
          </>
        ):(
          <>
            <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>TU NOMBRE</label>
            <input value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="Tu nombre"
              style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
                color:"#f1f5f9",padding:"10px 12px",fontSize:15,marginBottom:12,boxSizing:"border-box"}}/>
            <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>TU PIN (4 dígitos)</label>
            <input type="password" maxLength={4} value={playerPin} onChange={e=>setPlayerPin(e.target.value)} placeholder="••••"
              style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
                color:"#f1f5f9",padding:"10px 12px",fontSize:20,letterSpacing:8,marginBottom:12,boxSizing:"border-box"}}/>
            <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:6}}>AVATAR</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
              {AVATARS.map(av=>(
                <button key={av} onClick={()=>setPlayerAvatar(av)} style={{
                  fontSize:20,background:playerAvatar===av?currentCompany.color:"#0f172a",
                  border:playerAvatar===av?"2px solid #fff":"1px solid #475569",
                  borderRadius:8,padding:"4px 7px",cursor:"pointer"
                }}>{av}</button>
              ))}
            </div>
            <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>
              🏆 CAMPEÓN <span style={{color:"#f59e0b"}}>(+{CHAMPION_BONUS} pts)</span>
            </label>
            <select value={playerChampion} onChange={e=>setPlayerChampion(e.target.value)}
              style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
                color:playerChampion?"#f1f5f9":"#64748b",padding:"10px 12px",fontSize:13,
                marginBottom:14,boxSizing:"border-box"}}>
              <option value="">Seleccionar campeón...</option>
              {ALL_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            {playerError&&<div style={{color:"#f87171",fontSize:13,marginBottom:10}}>{playerError}</div>}
            <button onClick={handlePlayerRegister} style={{width:"100%",background:"#16a34a",
              color:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontWeight:800,fontSize:16,cursor:"pointer"}}>
              Registrarme →
            </button>
          </>
        )}
        <button onClick={()=>{setScreen("company");setCompPin("");setCurrentCompany(null);}} style={{
          marginTop:12,width:"100%",background:"transparent",color:"#475569",border:"none",
          fontSize:13,cursor:"pointer",textDecoration:"underline"
        }}>← Cambiar empresa</button>
      </div>
    </div>
  );

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  if(screen==="admin"){
    const pendingMatches=allMatches.filter(m=>m.status!=="finished");
    const selCompany=companies.find(c=>c.id===selectedCompanyId);
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",fontFamily:"'Inter',system-ui,sans-serif",maxWidth:480,margin:"0 auto",paddingBottom:40}}>
        <div style={{background:"#7c3aed",padding:"12px 16px",display:"flex",justifyContent:"space-between",
          alignItems:"center",position:"sticky",top:0,zIndex:10}}>
          <div>
            <div style={{fontWeight:900,fontSize:15,color:"#fff"}}>⚙️ Panel Admin · {ADMIN_CODE}</div>
            <div style={{fontSize:11,color:"#ddd6fe"}}>Polla Mundialera 2026 · Firebase ✓</div>
          </div>
          <button onClick={()=>{setScreen("company");setCompPin("");}}
            style={{background:"#6d28d9",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Salir</button>
        </div>
        <div style={{display:"flex",background:"#1e1b4b",borderBottom:"1px solid #4c1d95",overflowX:"auto"}}>
          {[{id:"results",l:"Resultados",i:"📋"},{id:"ko",l:"Eliminat.",i:"⚔️"},{id:"champion",l:"Campeón",i:"🏆"},{id:"companies",l:"Empresas",i:"🏢"},{id:"players",l:"Jugadores",i:"👤"},{id:"export",l:"Exportar",i:"📊"}].map(s=>(
            <button key={s.id} onClick={()=>setAdminSection(s.id)} style={{
              flexShrink:0,padding:"9px 12px",border:"none",background:"transparent",
              borderBottom:adminSection===s.id?"2px solid #a78bfa":"2px solid transparent",
              color:adminSection===s.id?"#a78bfa":"#6d28d9",fontWeight:700,fontSize:11,cursor:"pointer"
            }}>{s.i} {s.l}</button>
          ))}
        </div>
        <div style={{padding:"14px"}}>
          {adminMsg&&<div style={{background:"#1e293b",borderRadius:10,padding:"10px 14px",marginBottom:12,color:"#4ade80",fontWeight:700,fontSize:13}}>{adminMsg}</div>}

          {/* RESULTADOS */}
          {adminSection==="results"&&(
            <div style={{background:"#1e293b",borderRadius:14,padding:"16px",border:"1px solid #334155"}}>
              <div style={{fontWeight:800,color:"#f8fafc",fontSize:14,marginBottom:12}}>Ingresar Resultado</div>
              <select value={adminMatchId} onChange={e=>setAdminMatchId(e.target.value)}
                style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,
                  color:"#f1f5f9",padding:"9px 12px",fontSize:12,marginBottom:10,boxSizing:"border-box"}}>
                <option value="">Seleccionar partido...</option>
                {pendingMatches.map(m=>(
                  <option key={m.id} value={m.id}>[{m.group||m.round}] {m.home} vs {m.away} · {m.date} {m.time}</option>
                ))}
              </select>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{flex:1}}>
                  <label style={{color:"#94a3b8",fontSize:11,display:"block",marginBottom:3}}>
                    {adminMatchId?allMatches.find(m=>m.id===adminMatchId)?.home||"LOCAL":"LOCAL"}
                  </label>
                  <input type="number" min="0" max="20" value={adminH} onChange={e=>setAdminH(e.target.value)}
                    placeholder="0" style={{width:"100%",background:"#0f172a",border:"1px solid #475569",
                      borderRadius:8,color:"#f1f5f9",padding:"10px",fontSize:22,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
                </div>
                <div style={{display:"flex",alignItems:"flex-end",paddingBottom:10,color:"#475569",fontWeight:900,fontSize:22}}>–</div>
                <div style={{flex:1}}>
                  <label style={{color:"#94a3b8",fontSize:11,display:"block",marginBottom:3}}>
                    {adminMatchId?allMatches.find(m=>m.id===adminMatchId)?.away||"VISITA":"VISITA"}
                  </label>
                  <input type="number" min="0" max="20" value={adminA} onChange={e=>setAdminA(e.target.value)}
                    placeholder="0" style={{width:"100%",background:"#0f172a",border:"1px solid #475569",
                      borderRadius:8,color:"#f1f5f9",padding:"10px",fontSize:22,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                {["finished","live"].map(s=>(
                  <button key={s} onClick={()=>setAdminMatchStatus(s)} style={{
                    flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,
                    background:adminMatchStatus===s?(s==="finished"?"#16a34a":"#ef4444"):"#334155",color:"#fff"
                  }}>{s==="finished"?"✓ Finalizado":"🔴 En vivo"}</button>
                ))}
              </div>
              <button onClick={async()=>{
                const id=adminMatchId.trim();
                if(!id||adminH===""||adminA===""){showAdminMsg("❌ Completa todos los campos");return;}
                const m=allMatches.find(x=>x.id===id);
                if(m?.status==="finished"&&!window.confirm(`⚠️ Este partido ya está finalizado.\n¿Seguro que quieres modificar el resultado de ${m.home} vs ${m.away}?\n\nEsto recalculará los puntos de todos.`)) return;
                const updatedM=matches.map(x=>x.id===id?{...x,homeScore:parseInt(adminH),awayScore:parseInt(adminA),status:adminMatchStatus}:x);
                const updatedKO=koMatches.map(x=>x.id===id?{...x,homeScore:parseInt(adminH),awayScore:parseInt(adminA),status:adminMatchStatus}:x);
                await persist({matches:updatedM,koMatches:updatedKO});
                if(m&&adminMatchStatus==="finished") addFeedItem(`✅ Resultado: ${m.home} ${adminH}–${adminA} ${m.away}`);
                setAdminMatchId("");setAdminH("");setAdminA("");
                showAdminMsg("✅ Resultado guardado y sincronizado");
              }} style={{width:"100%",background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                Guardar resultado
              </button>
              {/* Resumen empresas */}
              <div style={{marginTop:16,borderTop:"1px solid #334155",paddingTop:14}}>
                <div style={{fontWeight:700,color:"#94a3b8",fontSize:12,marginBottom:8}}>RESUMEN EMPRESAS</div>
                {companies.map(c=>{
                  const top=c.players.map(p=>({p,s:getStats(p,predictions,allMatches,actualChampion)})).sort((a,b)=>b.s.total-a.s.total).slice(0,3);
                  return(
                    <div key={c.id} style={{background:"#0f172a",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:top.length?6:0}}>
                        <span style={{fontSize:18}}>{c.emoji}</span>
                        <span style={{fontWeight:700,color:"#f1f5f9",flex:1}}>{c.name}</span>
                        <span style={{fontSize:12,color:"#64748b"}}>{c.players.length} jug. · {fmtCLP(c.players.length*(c.betAmount||10000))}</span>
                      </div>
                      {top.map(({p,s},i)=>(
                        <div key={p.id} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 0"}}>
                          <span style={{fontSize:11,color:"#64748b",minWidth:16}}>#{i+1}</span>
                          <span>{p.avatar}</span>
                          <span style={{fontSize:12,color:"#cbd5e1",flex:1}}>{p.name}</span>
                          <span style={{fontSize:12,fontWeight:800,color:"#4ade80"}}>{s.total} pts</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ELIMINATORIAS */}
          {adminSection==="ko"&&(
            <div style={{background:"#1e293b",borderRadius:14,padding:"16px",border:"1px solid #334155"}}>
              <div style={{fontWeight:800,color:"#f8fafc",fontSize:14,marginBottom:12}}>Agregar Partido Eliminatoria</div>
              <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>RONDA</label>
              <select value={adminKORound} onChange={e=>setAdminKORound(e.target.value)}
                style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:"#f1f5f9",padding:"9px 12px",fontSize:13,marginBottom:10,boxSizing:"border-box"}}>
                {KO_ROUNDS.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1}}>
                  <label style={{color:"#94a3b8",fontSize:11,marginBottom:3,display:"block"}}>EQUIPO 1</label>
                  <select value={adminKOHome} onChange={e=>setAdminKOHome(e.target.value)}
                    style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:adminKOHome?"#f1f5f9":"#64748b",padding:"9px 8px",fontSize:12,boxSizing:"border-box"}}>
                    <option value="">Seleccionar...</option>
                    {ALL_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{flex:1}}>
                  <label style={{color:"#94a3b8",fontSize:11,marginBottom:3,display:"block"}}>EQUIPO 2</label>
                  <select value={adminKOAway} onChange={e=>setAdminKOAway(e.target.value)}
                    style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:adminKOAway?"#f1f5f9":"#64748b",padding:"9px 8px",fontSize:12,boxSizing:"border-box"}}>
                    <option value="">Seleccionar...</option>
                    {ALL_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <div style={{flex:1}}>
                  <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>FECHA</label>
                  <input value={adminKODate} onChange={e=>setAdminKODate(e.target.value)} placeholder="ej: 29 Jun"
                    style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:"#f1f5f9",padding:"9px 12px",fontSize:13,boxSizing:"border-box"}}/>
                </div>
                <div style={{flex:1}}>
                  <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>HORA (Chile)</label>
                  <input value={adminKOTime} onChange={e=>setAdminKOTime(e.target.value)} placeholder="ej: 18:00"
                    style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:"#f1f5f9",padding:"9px 12px",fontSize:13,boxSizing:"border-box"}}/>
                </div>
              </div>
              <button onClick={async()=>{
                if(!adminKOHome||!adminKOAway){showAdminMsg("❌ Selecciona ambos equipos");return;}
                const newKO=[...koMatches,{id:"ko"+Date.now(),round:adminKORound,home:adminKOHome,away:adminKOAway,date:adminKODate||"Por definir",time:adminKOTime||"",status:"upcoming",homeScore:null,awayScore:null}];
                await persist({koMatches:newKO});
                setAdminKOHome("");setAdminKOAway("");setAdminKODate("");setAdminKOTime("");
                showAdminMsg("✅ Partido eliminatoria agregado");
              }} style={{width:"100%",background:"#0369a1",color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                Agregar partido
              </button>
              {koMatches.length>0&&(
                <div style={{marginTop:12}}>
                  <div style={{color:"#64748b",fontSize:12,marginBottom:6}}>Partidos ({koMatches.length}):</div>
                  {koMatches.map(m=>(
                    <div key={m.id} style={{background:"#0f172a",borderRadius:8,padding:"7px 10px",marginBottom:6,fontSize:12,color:"#94a3b8"}}>
                      [{m.round}] {m.home} vs {m.away} · {m.date} {m.time}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CAMPEÓN */}
          {adminSection==="champion"&&(
            <div style={{background:"#1e293b",borderRadius:14,padding:"16px",border:"1px solid #334155"}}>
              <div style={{fontWeight:800,color:"#f8fafc",fontSize:14,marginBottom:4}}>Registrar Campeón Real</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>
                Activa +{CHAMPION_BONUS} pts bonus
                {actualChampion&&<span style={{color:"#f59e0b",fontWeight:700}}> · Actual: {actualChampion}</span>}
              </div>
              <select value={adminChampion} onChange={e=>setAdminChampion(e.target.value)}
                style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:adminChampion?"#f1f5f9":"#64748b",padding:"10px 12px",fontSize:13,marginBottom:12,boxSizing:"border-box"}}>
                <option value="">Seleccionar campeón...</option>
                {ALL_TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={async()=>{
                if(!adminChampion){showAdminMsg("❌ Selecciona un equipo");return;}
                await persist({actualChampion:adminChampion});
                addFeedItem(`🏆 Campeón del Mundial: ${adminChampion}`);
                showAdminMsg("✅ Campeón registrado: "+adminChampion);
              }} style={{width:"100%",background:"#b45309",color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                Confirmar campeón
              </button>
            </div>
          )}

          {/* EMPRESAS */}
          {adminSection==="companies"&&(
            <>
              <div style={{background:"#1e293b",borderRadius:14,padding:"16px",border:"1px solid #334155",marginBottom:12}}>
                <div style={{fontWeight:800,color:"#f8fafc",fontSize:14,marginBottom:12}}>Crear Nueva Empresa</div>
                <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>NOMBRE</label>
                <input value={newCompName} onChange={e=>setNewCompName(e.target.value)} placeholder="ej: Mi Empresa"
                  style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:"#f1f5f9",padding:"9px 12px",fontSize:14,marginBottom:10,boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <div style={{flex:1}}>
                    <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>CÓDIGO</label>
                    <input value={newCompCode} onChange={e=>setNewCompCode(e.target.value.toUpperCase())} placeholder="ej: EMPRESA"
                      style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:"#f1f5f9",padding:"9px 12px",fontSize:13,letterSpacing:1,boxSizing:"border-box"}}/>
                  </div>
                  <div style={{flex:1}}>
                    <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>CLAVE</label>
                    <input type="password" maxLength={4} value={newCompPin} onChange={e=>setNewCompPin(e.target.value)} placeholder="••••"
                      style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:"#f1f5f9",padding:"9px 12px",fontSize:18,letterSpacing:6,boxSizing:"border-box"}}/>
                  </div>
                </div>
                <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:6}}>EMOJI</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                  {COMPANY_EMOJIS.map(e=>(
                    <button key={e} onClick={()=>setNewCompEmoji(e)} style={{fontSize:20,background:newCompEmoji===e?"#334155":"#0f172a",border:newCompEmoji===e?"2px solid #60a5fa":"1px solid #475569",borderRadius:8,padding:"4px 8px",cursor:"pointer"}}>{e}</button>
                  ))}
                </div>

                <button onClick={async()=>{
                  if(!newCompName.trim()||!newCompCode.trim()||newCompPin.length!==4){showAdminMsg("❌ Completa todos los campos");return;}
                  if(companies.find(c=>c.code.toUpperCase()===newCompCode.toUpperCase())){showAdminMsg("❌ Ese código ya existe");return;}
                  const newC={id:"c"+Date.now(),name:newCompName.trim(),code:newCompCode.trim(),pin:newCompPin,color:newCompColor,emoji:newCompEmoji,players:[],allowedNames:[],betAmount:parseInt(newCompBet)||10000};
                  await persist({companies:[...companies,newC]});
                  setNewCompName("");setNewCompCode("");setNewCompPin("");
                  showAdminMsg("✅ Empresa creada: "+newCompName);
                }} style={{width:"100%",background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                  Crear empresa
                </button>
              </div>
              {companies.map(c=>(
                <div key={c.id} style={{background:"#1e293b",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid #334155"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{background:c.color,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{c.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14}}>{c.name}</div>
                      <div style={{fontSize:11,color:"#64748b"}}>
                        <b style={{color:"#94a3b8",letterSpacing:1}}>{c.code}</b> · {c.players.length} jugadores · {fmtCLP(c.players.length*(c.betAmount||10000))}
                      </div>
                    </div>
                    <button onClick={async()=>{
                      if(!window.confirm(`⚠️ ¿Eliminar "${c.name}"?\n\nSe borrarán todos sus jugadores y pronósticos.\nEsta acción no se puede deshacer.`)) return;
                      await persist({companies:companies.filter(x=>x.id!==c.id)});
                      showAdminMsg("✅ Empresa eliminada: "+c.name);
                    }} style={{background:"#450a0a",color:"#f87171",border:"1px solid #dc2626",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* JUGADORES */}
          {adminSection==="players"&&(
            <>
              <div style={{background:"#1e293b",borderRadius:14,padding:"16px",border:"1px solid #334155",marginBottom:12}}>
                <div style={{fontWeight:800,color:"#f8fafc",fontSize:14,marginBottom:12}}>Gestión de Jugadores</div>
                <label style={{color:"#94a3b8",fontSize:12,fontWeight:600,display:"block",marginBottom:4}}>SELECCIONAR EMPRESA</label>
                <select value={selectedCompanyId} onChange={e=>setSelectedCompanyId(e.target.value)}
                  style={{width:"100%",background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:selectedCompanyId?"#f1f5f9":"#64748b",padding:"9px 12px",fontSize:13,marginBottom:14,boxSizing:"border-box"}}>
                  <option value="">Seleccionar empresa...</option>
                  {companies.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                </select>

                {selCompany&&(
                  <>
                    {/* Lista de nombres permitidos */}
                    <div style={{marginBottom:14}}>
                      <div style={{fontWeight:700,color:"#f59e0b",fontSize:12,marginBottom:8}}>
                        NOMBRES PERMITIDOS {selCompany.allowedNames?.length>0?`(${selCompany.allowedNames.length})`:"· Sin restricción"}
                      </div>
                      <div style={{display:"flex",gap:8,marginBottom:8}}>
                        <input value={newAllowedName} onChange={e=>setNewAllowedName(e.target.value)}
                          placeholder="Nombre a agregar" onKeyDown={e=>e.key==="Enter"&&(async()=>{
                            if(!newAllowedName.trim()) return;
                            const updated=companies.map(c=>c.id===selCompany.id?{...c,allowedNames:[...(c.allowedNames||[]),newAllowedName.trim()]}:c);
                            await persist({companies:updated});
                            setNewAllowedName("");showAdminMsg("✅ Nombre agregado");
                          })()}
                          style={{flex:1,background:"#0f172a",border:"1px solid #475569",borderRadius:8,color:"#f1f5f9",padding:"8px 12px",fontSize:13,boxSizing:"border-box"}}/>
                        <button onClick={async()=>{
                          if(!newAllowedName.trim()) return;
                          const updated=companies.map(c=>c.id===selCompany.id?{...c,allowedNames:[...(c.allowedNames||[]),newAllowedName.trim()]}:c);
                          await persist({companies:updated});
                          setNewAllowedName("");showAdminMsg("✅ Nombre agregado");
                        }} style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                          + Agregar
                        </button>
                      </div>
                      {(selCompany.allowedNames||[]).map((n,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                          background:"#0f172a",borderRadius:8,padding:"6px 12px",marginBottom:4}}>
                          <span style={{color:"#e2e8f0",fontSize:13}}>👤 {n}</span>
                          <button onClick={async()=>{
                            const updated=companies.map(c=>c.id===selCompany.id?{...c,allowedNames:(c.allowedNames||[]).filter((_,j)=>j!==i)}:c);
                            await persist({companies:updated});
                            showAdminMsg("✅ Nombre eliminado");
                          }} style={{background:"#450a0a",color:"#f87171",border:"none",borderRadius:6,padding:"3px 10px",fontSize:12,cursor:"pointer"}}>
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Jugadores registrados */}
                    <div style={{borderTop:"1px solid #334155",paddingTop:12}}>
                      <div style={{fontWeight:700,color:"#94a3b8",fontSize:12,marginBottom:8}}>
                        JUGADORES REGISTRADOS ({selCompany.players.length})
                      </div>
                      {selCompany.players.length===0&&(
                        <div style={{color:"#475569",fontSize:13,textAlign:"center",padding:"10px 0"}}>Sin jugadores aún</div>
                      )}
                      {selCompany.players.map(p=>{
                        const s=getStats(p,predictions,allMatches,actualChampion);
                        return(
                          <div key={p.id} style={{background:"#0f172a",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                              <span style={{fontSize:20}}>{p.avatar}</span>
                              <div style={{flex:1}}>
                                <div style={{color:"#f1f5f9",fontWeight:700,fontSize:13}}>{p.name}</div>
                                <div style={{color:"#64748b",fontSize:11}}>{s.total} pts · {s.played} partidos</div>
                              </div>
                              <button onClick={async()=>{
                                if(!window.confirm(`¿Eliminar a ${p.name}?`)) return;
                                const updated=companies.map(c=>c.id===selCompany.id?{...c,players:c.players.filter(x=>x.id!==p.id)}:c);
                                await persist({companies:updated});
                                showAdminMsg("✅ Jugador eliminado");
                              }} style={{background:"#450a0a",color:"#f87171",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer"}}>
                                Eliminar
                              </button>
                            </div>
                            {/* Reset PIN */}
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              <input type="password" maxLength={4} placeholder="Nuevo PIN"
                                value={resetPlayerPin} onChange={e=>setResetPlayerPin(e.target.value)}
                                style={{flex:1,background:"#1e293b",border:"1px solid #475569",borderRadius:6,color:"#f1f5f9",padding:"5px 8px",fontSize:14,letterSpacing:4}}/>
                              <button onClick={async()=>{
                                if(resetPlayerPin.length!==4){showAdminMsg("❌ PIN debe tener 4 dígitos");return;}
                                const updated=companies.map(c=>c.id===selCompany.id?{...c,players:c.players.map(x=>x.id===p.id?{...x,pin:resetPlayerPin}:x)}:c);
                                await persist({companies:updated});
                                setResetPlayerPin("");
                                showAdminMsg(`✅ PIN de ${p.name} actualizado`);
                              }} style={{background:"#0369a1",color:"#fff",border:"none",borderRadius:6,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>
                                Reset PIN
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* EXPORTAR */}
          {adminSection==="export"&&(
            <div style={{background:"#1e293b",borderRadius:14,padding:"16px",border:"1px solid #334155"}}>
              <div style={{fontWeight:800,color:"#f8fafc",fontSize:14,marginBottom:4}}>📊 Exportar datos a Excel</div>
              <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>Descarga toda la información de la polla en un archivo Excel</div>

              {/* Ranking general */}
              <button onClick={()=>{
                const rows=[["Empresa","Jugador","Avatar","Puntos","Exactos","Ganador","Fallos","% Acierto","Campeón","Bonus Campeón"]];
                companies.forEach(c=>{
                  c.players.forEach(p=>{
                    const s=getStats(p,predictions,allMatches,actualChampion);
                    rows.push([c.name,p.name,p.avatar,s.total,s.exact,s.winner,s.miss,s.pct+"%",p.champion||"—",s.champBonus]);
                  });
                });
                const csv=rows.map(r=>r.join(",")).join("\n");
                const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
                const url=URL.createObjectURL(blob);
                const a=document.createElement("a");
                a.href=url;a.download="ranking_polla_2026.csv";a.click();
                URL.revokeObjectURL(url);
              }} style={{width:"100%",background:"#16a34a",color:"#fff",border:"none",borderRadius:10,
                padding:"12px 0",fontWeight:800,fontSize:14,cursor:"pointer",marginBottom:10}}>
                🥇 Descargar Ranking General
              </button>

              {/* Pronósticos */}
              <button onClick={()=>{
                const rows=[["Empresa","Jugador","Partido","Equipo Local","Equipo Visita","Pronóstico Local","Pronóstico Visita","Resultado Real","Puntos"]];
                allMatches.filter(m=>m.status==="finished").forEach(m=>{
                  companies.forEach(c=>{
                    c.players.forEach(p=>{
                      const pred=predictions[p.id]?.[m.id];
                      const pts=pred?calcPts(pred,m):null;
                      rows.push([
                        c.name,p.name,
                        `${m.home} vs ${m.away}`,
                        m.home,m.away,
                        pred?pred.home:"—",pred?pred.away:"—",
                        `${m.homeScore}-${m.awayScore}`,
                        pts!==null?pts:"Sin pronóstico"
                      ]);
                    });
                  });
                });
                const csv=rows.map(r=>r.join(",")).join("\n");
                const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
                const url=URL.createObjectURL(blob);
                const a=document.createElement("a");
                a.href=url;a.download="pronosticos_polla_2026.csv";a.click();
                URL.revokeObjectURL(url);
              }} style={{width:"100%",background:"#0369a1",color:"#fff",border:"none",borderRadius:10,
                padding:"12px 0",fontWeight:800,fontSize:14,cursor:"pointer",marginBottom:10}}>
                ⚽ Descargar Pronósticos
              </button>

              {/* Empresas */}
              <button onClick={()=>{
                const rows=[["Empresa","Código","Jugadores","Cuota","Pozo Total","Líder","Puntos Líder"]];
                companies.forEach(c=>{
                  const bet=c.betAmount||10000;
                  const ranking=c.players.map(p=>({p,s:getStats(p,predictions,allMatches,actualChampion)})).sort((a,b)=>b.s.total-a.s.total);
                  const lider=ranking[0];
                  rows.push([c.name,c.code,c.players.length,fmtCLP(bet),fmtCLP(c.players.length*bet),lider?lider.p.name:"—",lider?lider.s.total:"—"]);
                });
                const csv=rows.map(r=>r.join(",")).join("\n");
                const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
                const url=URL.createObjectURL(blob);
                const a=document.createElement("a");
                a.href=url;a.download="empresas_polla_2026.csv";a.click();
                URL.revokeObjectURL(url);
              }} style={{width:"100%",background:"#7c3aed",color:"#fff",border:"none",borderRadius:10,
                padding:"12px 0",fontWeight:800,fontSize:14,cursor:"pointer",marginBottom:10}}>
                🏢 Descargar Resumen Empresas
              </button>

              <div style={{background:"#0f172a",borderRadius:8,padding:"10px 12px",fontSize:11,color:"#64748b",marginTop:4}}>
                💡 Los archivos se descargan en formato CSV que se abre directamente en Excel o Google Sheets
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── HOME ───────────────────────────────────────────────────────────────────
  const tabs=[
    {id:"ranking",label:"Ranking",icon:"🏆"},
    {id:"grupos",label:"Grupos",icon:"📋"},
    {id:"partidos",label:"Partidos",icon:"⚽"},
    {id:"feed",label:"Feed",icon:"📣"},
    {id:"stats",label:"Yo",icon:"📊"},
  ];

  return(
    <div style={{minHeight:"100vh",background:"#0f172a",fontFamily:"'Inter',system-ui,sans-serif",maxWidth:480,margin:"0 auto"}}>
      <div style={{background:"#1e293b",borderBottom:"1px solid #334155",padding:"10px 14px",
        display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:16}}>{currentCompany.emoji}</span>
            <span style={{fontWeight:900,fontSize:14,color:"#f8fafc"}}>{currentCompany.name}</span>
          </div>
          <div style={{fontSize:11,color:"#64748b"}}>
            {currentPlayer?.avatar} {currentPlayer?.name} · #{myRank||"–"} · {myStats?.total||0} pts
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:"#64748b"}}>Pozo</div>
          <div style={{fontWeight:800,fontSize:14,color:"#4ade80"}}>{fmtCLP(pot)}</div>
        </div>
      </div>
      <div style={{height:3,background:currentCompany.color}}/>
      <div style={{display:"flex",background:"#1e293b",borderBottom:"1px solid #334155",position:"sticky",top:55,zIndex:9}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:"9px 0",border:"none",background:"transparent",
            borderBottom:tab===t.id?`2px solid ${currentCompany.color}`:"2px solid transparent",
            color:tab===t.id?"#f1f5f9":"#64748b",fontWeight:700,fontSize:10,cursor:"pointer"
          }}>{t.icon}<br/>{t.label}</button>
        ))}
      </div>

      <div style={{padding:"14px 12px",paddingBottom:40}}>

        {/* RANKING */}
        {tab==="ranking"&&(
          <>
            <div style={{background:`linear-gradient(135deg,${currentCompany.color}cc,${currentCompany.color}66)`,
              borderRadius:14,padding:"14px 18px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:900,fontSize:22,color:"#fff"}}>{fmtCLP(pot)}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.75)"}}>{compPlayers.length} jugadores × {fmtCLP(compBet)}</div>
                {actualChampion&&<div style={{fontSize:11,color:"rgba(255,255,255,0.85)",marginTop:2}}>🏆 Campeón: {actualChampion}</div>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Premios</div>
                <div style={{fontWeight:800,fontSize:14,color:"#fff"}}>🥇 {fmtCLP(Math.round(pot*0.7))}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>🥈 {fmtCLP(Math.round(pot*0.2))} · 🥉 {fmtCLP(Math.round(pot*0.1))}</div>
              </div>
            </div>
            {rankingData.length===0&&(
              <div style={{textAlign:"center",color:"#475569",padding:"30px 0",fontSize:13}}>Aún no hay jugadores</div>
            )}
            {rankingData.map((r,i)=>(
              <div key={r.player.id} style={{
                display:"flex",alignItems:"center",gap:10,
                background:r.player.id===currentPlayer?.id?"#1e3a5f":"#1e293b",
                border:r.player.id===currentPlayer?.id?`1.5px solid ${currentCompany.color}`:"1.5px solid #334155",
                borderRadius:12,padding:"12px 14px",marginBottom:8
              }}>
                <span style={{fontSize:18,minWidth:24,textAlign:"center"}}>
                  {i===0?"🥇":i===1?"🥈":i===2?"🥉":<span style={{color:"#64748b",fontWeight:700,fontSize:12}}>#{i+1}</span>}
                </span>
                <span style={{fontSize:22}}>{r.player.avatar}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                    {r.player.name}
                    {r.player.id===currentPlayer?.id&&<span style={{fontSize:10,color:"#60a5fa"}}>(tú)</span>}
                    {r.trend>0&&<span style={{fontSize:10,color:"#4ade80"}}>↑{r.trend}</span>}
                    {r.trend<0&&<span style={{fontSize:10,color:"#f87171"}}>↓{Math.abs(r.trend)}</span>}
                  </div>
                  <div style={{fontSize:11,color:"#64748b"}}>
                    ✨{r.stats.exact} · ✓{r.stats.winner} · ✗{r.stats.miss} · {r.stats.pct}%
                    {r.player.champion&&<span style={{color:"#f59e0b"}}> · 🏆{r.player.champion}</span>}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:900,fontSize:20,color:"#4ade80"}}>{r.stats.total}</div>
                  {i===0
                    ?<div style={{fontSize:10,color:"#f59e0b",fontWeight:700}}>LÍDER</div>
                    :<div style={{fontSize:10,color:"#f87171",fontWeight:700}}>–{rankingData[0].stats.total-r.stats.total} pts</div>
                  }
                </div>
              </div>
            ))}
            <div style={{background:"#1e293b",borderRadius:12,padding:"12px 14px",marginTop:4,border:"1px solid #334155"}}>
              <div style={{fontWeight:700,color:"#94a3b8",fontSize:11,marginBottom:8}}>SISTEMA DE PUNTOS</div>
              <div style={{display:"flex",gap:6,marginBottom:6}}>
                {[{l:"Exacto",v:"3pts",c:"#4ade80"},{l:"Ganador",v:"1pt",c:"#fbbf24"},{l:"Fallo",v:"0",c:"#f87171"}].map(r=>(
                  <div key={r.l} style={{flex:1,background:"#0f172a",borderRadius:8,padding:"7px 4px",textAlign:"center"}}>
                    <div style={{fontWeight:900,fontSize:15,color:r.c}}>{r.v}</div>
                    <div style={{fontSize:10,color:"#64748b"}}>{r.l}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:10,color:"#475569"}}>
                Elim: base por ronda (+4/6/8/10/15) + exacto/ganador · Campeón: +{CHAMPION_BONUS} pts
              </div>
            </div>
          </>
        )}

        {/* GRUPOS */}
        {tab==="grupos"&&(
          <>
            <div style={{fontSize:12,color:"#64748b",marginBottom:10,textAlign:"center"}}>Top 2 por grupo + 8 mejores terceros → 16avos</div>
            {groupKeys.map(g=><GroupTable key={g} groupKey={g} matches={matches}/>)}
          </>
        )}

        {/* PARTIDOS */}
        {tab==="partidos"&&(
          <>
            <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:8,marginBottom:10}}>
              {["all","today","ko",...groupKeys].map(g=>(
                <button key={g} onClick={()=>setFilterGroup(g)} style={{
                  flexShrink:0,padding:"5px 10px",borderRadius:999,border:"1px solid",
                  fontSize:11,fontWeight:700,cursor:"pointer",
                  borderColor:filterGroup===g?currentCompany.color:"#334155",
                  background:filterGroup===g?currentCompany.color+"33":"#1e293b",
                  color:filterGroup===g?"#fff":"#94a3b8"
                }}>{g==="all"?"Todos":g==="today"?"Hoy 🔴":g==="ko"?"Elim.":`Gr.${g}`}</button>
              ))}
            </div>
            {filterGroup==="ko"&&koMatches.length===0&&(
              <div style={{textAlign:"center",color:"#475569",padding:"40px 20px",fontSize:13}}>
                Los partidos eliminatorias aparecerán aquí cuando terminen los grupos.
              </div>
            )}
            {filterGroup==="today"&&todayMatches.length===0&&(
              <div style={{textAlign:"center",color:"#475569",padding:"40px 20px",fontSize:13}}>
                No hay partidos pendientes hoy.
              </div>
            )}
            {visibleMatches.map(m=>(
              <MatchCard key={m.id} match={m}
                prediction={predictions[currentPlayer?.id]?.[m.id]}
                onPredict={handlePredict}
                allPlayers={compPlayers}
                allPredictions={predictions}
                reactions={reactions}
                onReact={handleReact}
                currentPlayerId={currentPlayer?.id}
                companyColor={currentCompany.color}/>
            ))}
          </>
        )}

        {/* FEED */}
        {tab==="feed"&&(
          <>
            <div style={{fontWeight:800,color:"#f8fafc",fontSize:14,marginBottom:12}}>📣 Actividad reciente</div>
            {(!feed||feed.length===0)&&(
              <div style={{textAlign:"center",color:"#475569",padding:"40px 20px",fontSize:13}}>
                Aún no hay actividad. ¡Ingresa tu primer pronóstico!
              </div>
            )}
            {(feed||[]).map(item=>(
              <div key={item.id} style={{background:"#1e293b",borderRadius:10,padding:"10px 14px",
                marginBottom:8,border:"1px solid #334155",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <span style={{color:"#e2e8f0",fontSize:13,flex:1}}>{item.text}</span>
                <span style={{color:"#475569",fontSize:11,marginLeft:8,flexShrink:0}}>{item.time}</span>
              </div>
            ))}
          </>
        )}

        {/* MIS STATS */}
        {tab==="stats"&&myStats&&currentPlayer&&(
          <>
            <div style={{background:"#1e293b",borderRadius:14,padding:"16px",marginBottom:12,
              border:"1px solid #334155",textAlign:"center"}}>
              <div style={{fontSize:48}}>{currentPlayer.avatar}</div>
              <div style={{fontWeight:900,fontSize:20,color:"#f8fafc",marginTop:4}}>{currentPlayer.name}</div>
              <div style={{fontSize:13,color:"#64748b"}}>{currentCompany.emoji} {currentCompany.name} · #{myRank} de {compPlayers.length}</div>
              {currentPlayer.champion&&(
                <div style={{marginTop:8,display:"inline-block",background:"#451a03",
                  border:"1px solid #b45309",borderRadius:999,padding:"3px 12px",
                  fontSize:12,color:"#f59e0b",fontWeight:700}}>
                  🏆 {currentPlayer.champion}
                  {actualChampion&&(currentPlayer.champion===actualChampion
                    ?<span style={{color:"#4ade80"}}> ✓ +{CHAMPION_BONUS}pts</span>
                    :<span style={{color:"#f87171"}}> ✗</span>)}
                </div>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[
                {l:"Puntos",v:myStats.total,c:"#4ade80",i:"🏆"},
                {l:"% Acierto",v:`${myStats.pct}%`,c:"#60a5fa",i:"🎯"},
                {l:"Exactos",v:myStats.exact,c:"#f59e0b",i:"✨"},
                {l:"Ganador",v:myStats.winner,c:"#a78bfa",i:"✓"},
                {l:"Fallos",v:myStats.miss,c:"#f87171",i:"✗"},
                {l:"Jugados",v:myStats.played,c:"#94a3b8",i:"⚽"},
              ].map(s=>(
                <div key={s.l} style={{background:"#1e293b",borderRadius:12,padding:"12px 10px",border:"1px solid #334155",textAlign:"center"}}>
                  <div style={{fontSize:20}}>{s.i}</div>
                  <div style={{fontWeight:900,fontSize:22,color:s.c,marginTop:2}}>{s.v}</div>
                  <div style={{fontSize:11,color:"#64748b"}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#1e293b",borderRadius:12,padding:"12px 14px",border:"1px solid #334155",marginBottom:12}}>
              <div style={{fontWeight:700,color:"#94a3b8",fontSize:11,marginBottom:8}}>VS OTROS</div>
              {rankingData.filter(r=>r.player.id!==currentPlayer.id).map(r=>{
                const diff=myStats.total-r.stats.total;
                return(
                  <div key={r.player.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #0f172a"}}>
                    <span>{r.player.avatar}</span>
                    <span style={{color:"#f1f5f9",fontWeight:600,flex:1,paddingLeft:8,fontSize:14}}>{r.player.name}</span>
                    <span style={{fontWeight:800,fontSize:14,color:diff>0?"#4ade80":diff<0?"#f87171":"#64748b"}}>
                      {diff>0?`+${diff}`:diff} pts
                    </span>
                  </div>
                );
              })}
            </div>
            <button onClick={()=>shareWA(currentPlayer,myRank,myStats.total,currentCompany.name,compPlayers)}
              style={{width:"100%",background:"#16a34a",color:"#fff",border:"none",borderRadius:10,
                padding:"12px 0",fontWeight:800,fontSize:15,cursor:"pointer",marginBottom:10}}>
              📲 Compartir en WhatsApp
            </button>
            <button onClick={()=>{setCurrentPlayer(null);setScreen("company");setCompPin("");setCurrentCompany(null);}}
              style={{width:"100%",background:"#334155",color:"#94a3b8",border:"none",borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:14,cursor:"pointer"}}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
