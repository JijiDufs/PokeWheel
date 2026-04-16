import { useState, useRef, useEffect } from "react";
import { GameData, Pokemon, FoePokemon, InvState, CombatCtx, SwapData, WheelItem } from "./types";
import { Wheel, WheelRef } from "./components/Wheel";
import { gen1Data } from "./data/gen1";
import { gen4Data } from "./data/gen4";

const FALLBACK_IMG = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
const TC: Record<string,string> = {Normal:"#A8A878",Feu:"#F08030",Eau:"#6890F0",Plante:"#78C850","Électrik":"#F8D030",Glace:"#98D8D8",Combat:"#C03028",Poison:"#A040A0",Sol:"#E0C068",Vol:"#A890F0",Psy:"#F85888",Insecte:"#A8B820",Roche:"#B8A038",Spectre:"#705898",Dragon:"#7038F8","Ténèbres":"#705848",Acier:"#B8B8D0","Fée":"#EE99AC"};

const panelStyle: React.CSSProperties = { background: "#F0ECD6", border: "4px solid #3A4A5A", borderRadius: 8, boxShadow: "inset 0 0 0 2px #FFF, 0 4px 0 rgba(0,0,0,0.15)", color: "#2C3E50", fontFamily: "'Courier New', Courier, monospace", fontWeight: "bold" };
function btnStyle(bg: string, shadow: string): React.CSSProperties { return { padding:"10px 24px",fontSize:15,fontFamily:"'Courier New', Courier, monospace",fontWeight:"bold", cursor:"pointer",background:bg,color:"#fff",border:"2px solid #2C3E50",borderRadius:6, boxShadow:`0 4px 0 ${shadow}`, whiteSpace:"nowrap", display:"flex", alignItems:"center", justifyContent:"center", minWidth: 120, textTransform:"uppercase" }; }

function sampleArr(arr: number[], n: number): number[] { const s: Record<number,boolean> = {}; const r: number[] = []; while (r.length < Math.min(n, arr.length)) { const v = arr[Math.floor(Math.random()*arr.length)]; if (!s[v]) { s[v]=true; r.push(v); } } return r; }
function sprUrl(id: number) { return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`; }
function trainerSpr(name: string) { return `https://play.pokemonshowdown.com/sprites/trainers/${name}.png`; }
function weightedIdx(items: {w:number}[]) { let tw = 0; for (let i=0;i<items.length;i++) tw += items[i].w||1; let r = Math.random()*tw; for (let j=0;j<items.length;j++) { r -= items[j].w||1; if (r<=0) return j; } return 0; }

const ROPTS = [ {label:"Capture",w:30,a:"catch"},{label:"Pêche",w:12,a:"fish"}, {label:"Dresseur",w:18,a:"trainer"},{label:"Boutique",w:15,a:"shop"}, {label:"Événement",w:10,a:"special"},{label:"Avancer",w:10,a:"nothing"}, {label:"Mystère",w:5,a:"mystery"} ];
const SPECIAL_EVENTS = [ {label:"Fossile",a:"fo"},{label:"Œuf",a:"eg"},{label:"Légende",a:"lg"}, {label:"Objet",a:"it"},{label:"Échange",a:"tr"},{label:"D. Élite",a:"sc"} ];

export default function App() {
  // TOUS LES HOOKS DOIVENT RESTER EN HAUT DE LA FONCTION
  const [gen, setGen] = useState<GameData | null>(null);
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [inv, setInv] = useState<InvState>({p:1,sp:0,b:0,r:0});
  const [sid, setSid] = useState<number|null>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("proc");
  const [wCfg, setWCfg] = useState<{items:WheelItem[]; winIdx:number; label:string; colFn:(item:WheelItem,i:number)=>string; onDone:(item:WheelItem)=>void; sizes:number[]|null}|null>(null);
  const [wheelState, setWheelState] = useState({ spinning: false, done: false });
  const wheelRef = useRef<WheelRef>(null);
  const [msg, setMsg] = useState("");
  const [rSpins, setRSpins] = useState(0);
  const [cCtx, setCCtx] = useState<CombatCtx|null>(null);
  const [wheelKey, setWheelKey] = useState(0);
  const [swapData, setSwapData] = useState<SwapData|null>(null);
  const [retriesLeft, setRetriesLeft] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ww, setWw] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  
  useEffect(() => {
    function onResize() { setWw(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Le useEffect est maintenant bien placé AVANT le "if (!gen)" et se coupe proprement si la génération n'est pas encore choisie.
  useEffect(() => {
    if (!gen) return; // Sécurité anti-crash
    if (phase !== "proc") return;
    const ev = gen.STORY[step]; if (!ev) return;
    if (ev.y === "m") { setMsg(ev.x!); setPhase("msg"); }
    else if (ev.y === "s") {
      setMsg("La mallette s'ouvre...");
      const starters = [gen.PM[gen.PD[0][0]], gen.PM[gen.PD[3][0]], gen.PM[gen.PD[6][0]]]; 
      showWheel(starters, Math.floor(Math.random()*3), "🔥 Starter ?", it => TC[it.t![0]], res => { setSid(res.id!); addPoke(res as Pokemon); setMsg(res.n+" te choisit !"); setPhase("msg"); });
    }
    else if (ev.y === "r") { const rt = gen.getRivTm(sid, ev.s!); setMsg("⚔️ Rival te défie !"); setCCtx({nm:"Rival",foes:rt,d:[-0.10,-0.05,0,0.05][Math.min(ev.s!,3)]||0,ctx:"rival",spr:"blue"}); setPhase("cpre"); }
    else if (ev.y === "g") { const g = gen.GYMS[ev.i!]; setMsg("🏟️ "+g.nm+" ("+g.ct+")"); setCCtx({nm:g.nm,foes:g.tm,d:g.df,ctx:"gym",gi:ev.i!,spr:g.spr}); setPhase("cpre"); }
    else if (ev.y === "G") { const c = gen.EVIL_TEAM[ev.i!]; setMsg("👾 "+c.nm); setCCtx({nm:c.nm,foes:c.tm,d:0,ctx:"evil",spr:c.spr}); setPhase("cpre"); }
    else if (ev.y === "R") { setMsg(ev.x!); setRSpins(ev.p!); setPhase("route"); }
    else if (ev.y === "S") { setMsg("⛰️ Boss Final Team !"); setCCtx({nm:gen.EVIL_TEAM[gen.EVIL_TEAM.length-1].nm,foes:gen.EVIL_TEAM[gen.EVIL_TEAM.length-1].tm,d:0.10,ctx:"spear",spr:gen.EVIL_TEAM[gen.EVIL_TEAM.length-1].spr}); setPhase("cpre"); }
    else if (ev.y === "4") { const e = gen.E4[ev.i!]; setMsg("🏛️ "+e.nm); setCCtx({nm:e.nm,foes:e.tm,d:0.10,ctx:"e4",spr:e.spr}); setPhase("cpre"); }
    else if (ev.y === "C") { setMsg("👑 Maître !"); setCCtx({nm:gen.CHAMP.nm,foes:gen.CHAMP.tm,d:0.15,ctx:"champ",spr:gen.CHAMP.spr}); setPhase("cpre"); }
    else if (ev.y === "W") { setMsg("🏆 FÉLICITATIONS !\nTu es le nouveau Maître ! 🏆"); setPhase("win"); }
  }, [phase, step, gen, sid]);

  const mob = ww < 850;

  function reset() { setTeam([]); setBadges([]); setInv({p:1,sp:0,b:0,r:0}); setSid(null); setStep(0); setPhase("proc"); setWCfg(null); setWheelState({ spinning: false, done: false }); setMsg(""); setRSpins(0); setCCtx(null); setWheelKey(0); setSwapData(null); setRetriesLeft(0); setMenuOpen(false); }
  function backToMenu() { setGen(null); reset(); }
  
  function getEffBst(p: Pokemon): number { return Math.round((gen!.BST[p.id] || 300) * (p.bstMod || 1)); }
  function makePoke(pk: Pokemon): Pokemon { return { id:pk.id, n:pk.n, t:pk.t, e:pk.e, bstMod: pk.bstMod || 1 }; }
  function addPoke(pk: Pokemon) { setTeam(prev => [...prev, makePoke(pk)]); }
  function capturePoke(pk: Pokemon, afterMsg: string, afterFn: () => void) { if (team.length < 6) { addPoke(pk); setMsg(afterMsg); afterFn(); } else { setSwapData({ poke: makePoke(pk), afterMsg, afterFn }); setMsg(pk.n + " veut te rejoindre !\nL'équipe est pleine."); setPhase("swap"); } }
  function boostTeamBst() { setTeam(t => t.map(p => ({ ...p, bstMod: (p.bstMod || 1) * 1.03 }))); }
  function nextStep() { setStep(s => s+1); setPhase("proc"); }
  function showWheel(items: WheelItem[], winIdx: number, label: string, colFn: (item:WheelItem,i:number)=>string, onDone: (item:WheelItem)=>void, sizes?: number[]|null) { setWCfg({items, winIdx, label, colFn, onDone, sizes: sizes||null}); setWheelState({ spinning: false, done: false }); setWheelKey(k => k+1); setPhase("wheel"); }

  function doCombat() {
    if (!cCtx) return; 
    let chance = 0.15;
    if (team.length) {
      let ts = 0, teamBST = 0, foeBST = 0;
      team.forEach(p => { cCtx.foes.forEach(o => { p.t.forEach(a => { let m = 1; o.t.forEach(d => { if (gen!.SE[a] && gen!.SE[a][d] !== undefined) m *= gen!.SE[a][d]; }); if (m >= 2) ts += 12; else if (m > 1) ts += 6; else if (m < 1 && m > 0) ts -= 5; else if (m === 0) ts -= 8; }); }); teamBST += getEffBst(p); });
      teamBST /= team.length; cCtx.foes.forEach(o => { foeBST += (gen!.NBST[o.n] || 400); }); foeBST /= cCtx.foes.length;
      chance = Math.max(0.10, Math.min(0.92, 0.50 + ts / 100 + (teamBST - foeBST) / 1000 + (team.length - cCtx.foes.length) * 0.04 - cCtx.d));
    }
    const pct = Math.round(chance*100);
    setMsg("⚔️ Combat contre "+cCtx.nm+" !\n"+cCtx.foes.map(f=>f.n).join(", "));
    showWheel([{label:"Victoire",val:true},{label:"Défaite",val:false}], Math.random()<chance?0:1, "Combat", it=>it.val?"#2ecc71":"#e74c3c", res=>{ if (res.val) handleWin(); else handleLoss(); }, [pct, 100-pct]);
  }

  function handleWin() {
    const isRt = cCtx?.ctx === "rt"; let wMsg = "🎉 Victoire !";
    if (cCtx?.ctx === "gym") { const gym = gen!.GYMS[cCtx.gi!]; setBadges(b => [...b, gym.bd]); wMsg = "🎉 Badge "+gym.bd+" ! (BST +)"; boostTeamBst(); }
    else if (cCtx?.ctx === "spear") { setMsg("🎉 Boss vaincu !"); setCCtx(null); setPhase("sleg"); return; }
    if (isRt) { const rw = [{k:"p",l:"Potion"},{k:"sp",l:"S. Potion"},{k:"r",l:"Rappel"}][Math.floor(Math.random()*3)]; setInv(v => { const nv = {...v}; nv[rw.k as keyof InvState]++; return nv; }); wMsg += "\n🎁 "+rw.l+" !"; }
    setCCtx(null);
    const evos = team.filter(p => p.e); if (!evos.length) { setMsg(wMsg); if (isRt) finRoute(); else setPhase("msg"); return; }
    const evoR = badges.length <= 2 ? 0.40 : badges.length <= 5 ? 0.50 : 0.60; const pct = Math.round(evoR*100);
    showWheel([{label:"Évolution",val:true},{label:"Rien",val:false}], Math.random()<evoR?0:1, "🧬 Évolution ?", it=>it.val?"#E67E22":"#7F8C8D", res => {
      if (!res.val) { setMsg(wMsg); if (isRt) finRoute(); else setPhase("msg"); return; }
      showWheel(evos.map(p => ({label:p.n,id:p.id,e:p.e,n:p.n,t:p.t,bstMod:p.bstMod})), Math.floor(Math.random()*evos.length), "Qui évolue ?", it => TC[it.t![0]]||"#888", res2 => {
        const evo = gen!.PM[res2.e as number]; if (evo) { setTeam(t => t.map(p => p.id===res2.id ? {...evo, bstMod: p.bstMod||1} : p)); setMsg(wMsg+"\n🌟 "+(res2.n||"")+" évolue en "+evo.n+" !"); }
        if (isRt) finRoute(); else setPhase("msg");
      });
    }, [pct, 100-
