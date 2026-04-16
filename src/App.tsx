import { useState, useRef, useEffect } from "react";
import { GameData, Pokemon, FoePokemon, InvState, CombatCtx, SwapData, WheelItem } from "./types";
import { Wheel, WheelRef } from "./components/Wheel";
import { gen1Data } from "./data/gen1";
import { gen2Data } from "./data/gen2";
import { gen4Data } from "./data/gen4";

const FALLBACK_IMG = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
const TC: Record<string, string> = { Normal: "#A8A878", Feu: "#F08030", Eau: "#6890F0", Plante: "#78C850", "Électrik": "#F8D030", Glace: "#98D8D8", Combat: "#C03028", Poison: "#A040A0", Sol: "#E0C068", Vol: "#A890F0", Psy: "#F85888", Insecte: "#A8B820", Roche: "#B8A038", Spectre: "#705898", Dragon: "#7038F8", "Ténèbres": "#705848", Acier: "#B8B8D0", "Fée": "#EE99AC" };

// THÈMES DYNAMIQUES SELON LA GÉNÉRATION
const THEMES: Record<string, any> = {
  gen1: { bg: "#9bbc0f", panelBg: "#e0f8d0", border: "#0f380f", font: "'Courier New', Courier, monospace", btnBg: "#8bac0f", text: "#0f380f" },
  gen2: { bg: "#D4AF37", panelBg: "#FFFDD0", border: "#8A6327", font: "'Courier New', Courier, monospace", btnBg: "#B8860B", text: "#4A3511" },
  gen4: { bg: "#D6EAF8", panelBg: "#FFFFFF", border: "#2980B9", font: "Arial, Helvetica, sans-serif", btnBg: "#3498DB", text: "#2C3E50" }
};

function getPanelStyle(theme: any): React.CSSProperties { return { background: theme.panelBg, border: `4px solid ${theme.border}`, borderRadius: 8, boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.5), 0 4px 0 rgba(0,0,0,0.15)`, color: theme.text, fontFamily: theme.font, fontWeight: "bold" }; }
function btnStyle(theme: any, overrideBg?: string, shadow?: string): React.CSSProperties { return { padding: "10px 24px", fontSize: 15, fontFamily: theme.font, fontWeight: "bold", cursor: "pointer", background: overrideBg || theme.btnBg, color: "#fff", border: `2px solid ${theme.border}`, borderRadius: 6, boxShadow: `0 4px 0 ${shadow || theme.border}`, whiteSpace: "nowrap", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 120, textTransform: "uppercase" }; }

function sampleArr(arr: number[], n: number): number[] { const s: Record<number, boolean> = {}; const r: number[] = []; while (r.length < Math.min(n, arr.length)) { const v = arr[Math.floor(Math.random() * arr.length)]; if (!s[v]) { s[v] = true; r.push(v); } } return r; }
function trainerSpr(name: string) { return `https://play.pokemonshowdown.com/sprites/trainers/${name}.png`; }
function weightedIdx(items: { w: number }[]) { let tw = 0; for (let i = 0; i < items.length; i++) tw += items[i].w || 1; let r = Math.random() * tw; for (let j = 0; j < items.length; j++) { r -= items[j].w || 1; if (r <= 0) return j; } return 0; }

const ROPTS = [{ label: "Capture", w: 30, a: "catch" }, { label: "Pêche", w: 12, a: "fish" }, { label: "Dresseur", w: 18, a: "trainer" }, { label: "Boutique", w: 15, a: "shop" }, { label: "Événement", w: 10, a: "special" }, { label: "Avancer", w: 10, a: "nothing" }, { label: "Mystère", w: 5, a: "mystery" }];
const SPECIAL_EVENTS = [{ label: "Fossile", a: "fo" }, { label: "Œuf", a: "eg" }, { label: "Légende", a: "lg" }, { label: "Objet", a: "it" }, { label: "Échange", a: "tr" }, { label: "D. Élite", a: "sc" }];

export default function App() {
  const [gen, setGen] = useState<GameData | null>(null);
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [inv, setInv] = useState<InvState>({ p: 1, sp: 0, b: 0, r: 0 });
  const [sid, setSid] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("proc");
  const [wCfg, setWCfg] = useState<{ items: WheelItem[]; winIdx: number; label: string; colFn: (item: WheelItem, i: number) => string; onDone: (item: WheelItem) => void; sizes: number[] | null } | null>(null);
  const [wheelState, setWheelState] = useState({ spinning: false, done: false });
  const wheelRef = useRef<WheelRef>(null);
  const [msg, setMsg] = useState("");
  const [rSpins, setRSpins] = useState(0);
  const [cCtx, setCCtx] = useState<CombatCtx | null>(null);
  const [wheelKey, setWheelKey] = useState(0);
  const [swapData, setSwapData] = useState<SwapData | null>(null);
  const [retriesLeft, setRetriesLeft] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ww, setWw] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);

  useEffect(() => {
    function onResize() { setWw(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mob = ww < 850;

  // DÉFINITION DU NOM DU JOUEUR SELON LA GÉNÉRATION
  const playerName = gen?.id === "gen1" ? "Red" : gen?.id === "gen2" ? "Gold" : "Lucas";

  function sprUrl(id: number) {
    if (gen?.id === "gen1") return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${id}.png`;
    // Retourne les sprites normaux pour Gen 2 et Gen 4
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  useEffect(() => {
    if (!gen) return;
    if (phase !== "proc") return;
    
    const ev = gen.STORY[step]; 
    if (!ev) return;

    // Remplacement du mot "Jules" par le vrai nom du personnage dans les textes de l'histoire
    const txt = ev.x ? ev.x.replace(/Jules/g, playerName) : "";

    if (ev.y === "m") { 
      setMsg(txt); 
      setPhase("msg"); 
    }
    else if (ev.y === "s") {
      setMsg("La mallette s'ouvre...");
      // SÉLECTION STRICTE DES STARTERS SELON LA GÉNÉRATION
      let starters: Pokemon[] = [];
      if (gen.id === "gen1") starters = [gen.PM[1], gen.PM[4], gen.PM[7]];
      else if (gen.id === "gen2") starters = [gen.PM[152], gen.PM[155], gen.PM[158]];
      else starters = [gen.PM[387], gen.PM[390], gen.PM[393]];
      
      showWheel(starters, Math.floor(Math.random() * 3), "🔥 Starter ?", it => TC[it.t![0]], res => { 
        setSid(res.id!); 
        addPoke(res as Pokemon); 
        setMsg(res.n + ` choisit ${playerName} !`); 
        setPhase("msg"); 
      });
    }
    else if (ev.y === "r") { 
      const rt = gen.getRivTm(sid, ev.s!); 
      setMsg(`⚔️ Le Rival défie ${playerName} !`); 
      setCCtx({ nm: "Rival", foes: rt, d: [-0.10, -0.05, 0, 0.05][Math.min(ev.s!, 3)] || 0, ctx: "rival", spr: "blue" }); 
      setPhase("cpre"); 
    }
    else if (ev.y === "g") { 
      const g = gen.GYMS[ev.i!]; 
      setMsg("🏟️ " + g.nm + " (" + g.ct + ")"); 
      setCCtx({ nm: g.nm, foes: g.tm, d: g.df, ctx: "gym", gi: ev.i!, spr: g.spr }); 
      setPhase("cpre"); 
    }
    else if (ev.y === "G") { 
      const c = gen.EVIL_TEAM[ev.i!]; 
      setMsg("👾 " + c.nm); 
      setCCtx({ nm: c.nm, foes: c.tm, d: 0, ctx: "evil", spr: c.spr }); 
      setPhase("cpre"); 
    }
    else if (ev.y === "R") { 
      setMsg(txt); 
      setRSpins(ev.p!); 
      setPhase("route"); 
    }
    else if (ev.y === "S") { 
      const boss = ev.i === 1 && gen.FINAL_BOSS ? gen.FINAL_BOSS : gen.EVIL_TEAM[gen.EVIL_TEAM.length - 1]; 
      setMsg(`⛰️ ${boss.nm} !`); 
      setCCtx({ nm: boss.nm, foes: boss.tm, d: 0.15, ctx: "spear", spr: boss.spr }); 
      setPhase("cpre"); 
    }
    else if (ev.y === "4") { 
      const e = gen.E4[ev.i!]; 
      setMsg("🏛️ " + e.nm); 
      setCCtx({ nm: e.nm, foes: e.tm, d: 0.10, ctx: "e4", spr: e.spr }); 
      setPhase("cpre"); 
    }
    else if (ev.y === "C") { 
      setMsg("👑 Maître !"); 
      setCCtx({ nm: gen.CHAMP.nm, foes: gen.CHAMP.tm, d: 0.15, ctx: "champ", spr: gen.CHAMP.spr }); 
      setPhase("cpre"); 
    }
    else if (ev.y === "choice") { 
      setMsg(txt); 
      setPhase("choice"); 
    }
    else if (ev.y === "W") { 
      setMsg(`🏆 FÉLICITATIONS !\n${playerName} est le nouveau Maître ! 🏆`); 
      setPhase("win"); 
    }
  }, [phase, step, gen, sid, playerName]);

  function reset() { setTeam([]); setBadges([]); setInv({ p: 1, sp: 0, b: 0, r: 0 }); setSid(null); setStep(0); setPhase("proc"); setWCfg(null); setWheelState({ spinning: false, done: false }); setMsg(""); setRSpins(0); setCCtx(null); setWheelKey(0); setSwapData(null); setRetriesLeft(0); setMenuOpen(false); }
  function backToMenu() { setGen(null); reset(); }

  function getEffBst(p: Pokemon): number { return Math.round((gen!.BST[p.id] || 300) * (p.bstMod || 1)); }
  function makePoke(pk: Pokemon): Pokemon { return { id: pk.id, n: pk.n, t: pk.t, e: pk.e, bstMod: pk.bstMod || 1 }; }
  function addPoke(pk: Pokemon) { setTeam(prev => [...prev, makePoke(pk)]); }
  function capturePoke(pk: Pokemon, afterMsg: string, afterFn: () => void) { 
    if (team.length < 6) { 
      addPoke(pk); setMsg(afterMsg); afterFn(); 
    } else { 
      setSwapData({ poke: makePoke(pk), afterMsg, afterFn }); 
      setMsg(`${pk.n} veut rejoindre ${playerName} !\nL'équipe est pleine.`); 
      setPhase("swap"); 
    } 
  }
  function boostTeamBst() { setTeam(t => t.map(p => ({ ...p, bstMod: (p.bstMod || 1) * 1.03 }))); }
  function nextStep() { setStep(s => s + 1); setPhase("proc"); }
  function showWheel(items: WheelItem[], winIdx: number, label: string, colFn: (item: WheelItem, i: number) => string, onDone: (item: WheelItem) => void, sizes?: number[] | null) { setWCfg({ items, winIdx, label, colFn, onDone, sizes: sizes || null }); setWheelState({ spinning: false, done: false }); setWheelKey(k => k + 1); setPhase("wheel"); }

  function doCombat() {
    if (!cCtx) return;
    let chance = 0.15;
    if (team.length) {
      let ts = 0, teamBST = 0, foeBST = 0;
      team.forEach(p => { 
        cCtx.foes.forEach(o => { 
          p.t.forEach(a => { 
            let m = 1; 
            o.t.forEach(d => { if (gen!.SE[a] && gen!.SE[a][d] !== undefined) m *= gen!.SE[a][d]; }); 
            if (m >= 2) ts += 12; else if (m > 1) ts += 6; else if (m < 1 && m > 0) ts -= 5; else if (m === 0) ts -= 8; 
          }); 
        }); 
        teamBST += getEffBst(p); 
      });
      teamBST /= team.length; 
      cCtx.foes.forEach(o => { foeBST += (gen!.NBST[o.n] || 400); }); 
      foeBST /= cCtx.foes.length;
      chance = Math.max(0.10, Math.min(0.92, 0.50 + ts / 100 + (teamBST - foeBST) / 1000 + (team.length - cCtx.foes.length) * 0.04 - cCtx.d));
    }
    const pct = Math.round(chance * 100);
    setMsg("⚔️ Combat contre " + cCtx.nm + " !\n" + cCtx.foes.map(f => f.n).join(", "));
    showWheel([{ label: "Victoire", val: true }, { label: "Défaite", val: false }], Math.random() < chance ? 0 : 1, "Combat", it => it.val ? "#2ecc71" : "#e74c3c", res => { if (res.val) handleWin(); else handleLoss(); }, [pct, 100 - pct]);
  }

  function handleWin() {
    const isRt = cCtx?.ctx === "rt"; 
    let wMsg = "🎉 Victoire !";
    
    if (cCtx?.ctx === "gym") { 
      const gym = gen!.GYMS[cCtx.gi!]; 
      setBadges(b => [...b, gym.bd]); 
      wMsg = "🎉 Badge " + gym.bd + " ! (BST +)"; 
      boostTeamBst(); 
    }
    else if (cCtx?.ctx === "spear") { 
      setMsg("🎉 Boss vaincu !"); setCCtx(null); setPhase("sleg"); return; 
    }
    
    if (isRt) { 
      const rw = [{ k: "p", l: "Potion" }, { k: "sp", l: "S. Potion" }, { k: "r", l: "Rappel" }][Math.floor(Math.random() * 3)]; 
      setInv(v => { const nv = { ...v }; nv[rw.k as keyof InvState]++; return nv; }); 
      wMsg += "\n🎁 " + rw.l + " !"; 
    }
    
    setCCtx(null);
    const evos = team.filter(p => p.e); 
    if (!evos.length) { setMsg(wMsg); if (isRt) finRoute(); else setPhase("msg"); return; }
    
    const evoR = badges.length <= 2 ? 0.40 : badges.length <= 5 ? 0.50 : 0.60; 
    const pct = Math.round(evoR * 100);
    
    showWheel([{ label: "Évolution", val: true }, { label: "Rien", val: false }], Math.random() < evoR ? 0 : 1, "🧬 Évolution ?", it => it.val ? "#E67E22" : "#7F8C8D", res => {
      if (!res.val) { setMsg(wMsg); if (isRt) finRoute(); else setPhase("msg"); return; }
      showWheel(evos.map(p => ({ label: p.n, id: p.id, e: p.e, n: p.n, t: p.t, bstMod: p.bstMod })), Math.floor(Math.random() * evos.length), "Qui évolue ?", it => TC[it.t![0]] || "#888", res2 => {
        const evo = gen!.PM[res2.e as number]; 
        if (evo) { 
          setTeam(t => t.map(p => p.id === res2.id ? { ...evo, bstMod: p.bstMod || 1 } : p)); 
          setMsg(wMsg + "\n🌟 " + (res2.n || "") + " évolue en " + evo.n + " !"); 
        }
        if (isRt) finRoute(); else setPhase("msg");
      });
    }, [pct, 100 - pct]);
  }

  function handleLoss() {
    if (retriesLeft > 0) { setRetriesLeft(r => r - 1); setMsg("💀 Encore une tentative !"); setPhase("retry"); }
    else if (inv.sp > 0) { setInv(v => ({ ...v, sp: v.sp - 1 })); setRetriesLeft(1); setMsg("💀 S. Potion utilisée ! (2 essais)"); setPhase("retry"); }
    else if (inv.p > 0) { setInv(v => ({ ...v, p: v.p - 1 })); setMsg("💀 Potion utilisée !"); setPhase("retry"); }
    else if (inv.r > 0) { 
      setInv(v => ({ ...v, r: v.r - 1 })); 
      setMsg("💀 Rappel utilisé !\nFuite du combat."); 
      if (cCtx?.ctx === "gym") { const gym = gen!.GYMS[cCtx.gi!]; setBadges(b => [...b, gym.bd]); boostTeamBst(); } 
      const isRt = cCtx?.ctx === "rt"; setCCtx(null); if (isRt) finRoute(); else setPhase("msg"); 
    }
    else { setMsg("💀 Défaite totale..."); setPhase("go"); }
  }

  function finRoute() { setRSpins(s => { if (s - 1 <= 0) { setTimeout(nextStep, 400); return 0; } setPhase("route"); return s - 1; }); }

  function doRoute() {
    const opts = badges.length >= 8 ? [{ label: "Dresseur", w: 25, a: "trainer" }, { label: "Boutique", w: 25, a: "shop" }, { label: "Événement", w: 20, a: "special" }, { label: "Avancer", w: 30, a: "nothing" }] : ROPTS;
    showWheel(opts, weightedIdx(opts), badges.length >= 8 ? "🏛️ Victoire" : "🎯 Action ?", it => ({ catch: "#E74C3C", fish: "#3498DB", trainer: "#E67E22", shop: "#2ECC71", special: "#9B59B6", nothing: "#7F8C8D", mystery: "#F1C40F" } as Record<string, string>)[it.a || ""] || "#888", res => {
      const a = res.a;
      if (a === "catch") { const pool = sampleArr(gen!.CATCH_IDS, 10).map(id => gen!.PM[id]).filter(Boolean); showWheel(pool, Math.floor(Math.random() * pool.length), "🎯 Capture !", it => TC[it.t![0]] || "#888", res2 => capturePoke(res2 as Pokemon, "✨ " + res2.n + " capturé !", finRoute)); }
      else if (a === "fish") { const pool = sampleArr(gen!.FISH_IDS, 8).map(id => gen!.PM[id]).filter(Boolean); showWheel(pool, Math.floor(Math.random() * pool.length), "🎣 Pêche !", () => "#3498DB", res2 => capturePoke(res2 as Pokemon, "🎣 " + res2.n + " pêché !", finRoute)); }
      else if (a === "trainer") {
        const rt: FoePokemon[] = []; for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) { const rp = gen!.PM[gen!.CATCH_IDS[Math.floor(Math.random() * gen!.CATCH_IDS.length)]]; if (rp) rt.push({ n: rp.n, t: rp.t }); }
        if (!rt.length) rt.push({ n: "Pikachu", t: ["Électrik"] }); setCCtx({ nm: "Dresseur", foes: rt, d: -0.05, ctx: "rt", spr: "acetrainer-gen4" }); setMsg(`Un Dresseur défie ${playerName} !`); setPhase("cpre");
      }
      else if (a === "shop") {
        const its = badges.length >= 8 ? [{ label: "Potion", k: "p" }, { label: "S. Potion", k: "sp" }, { label: "Rappel", k: "r" }] : [{ label: "Potion", k: "p" }, { label: "S. Potion", k: "sp" }, { label: "Pokéball", k: "b" }, { label: "Rappel", k: "r" }];
        showWheel(its, Math.floor(Math.random() * its.length), "🛒 Boutique !", (_, i) => ["#E74C3C", "#E67E22", "#3498DB", "#F1C40F"][i], res2 => { setInv(v => { const nv = { ...v }; nv[res2.k as keyof InvState]++; return nv; }); setMsg("🎁 " + res2.label + " !"); finRoute(); });
      }
      else if (a === "special") {
        const evts = badges.length >= 8 ? [{ label: "Objet", a: "it" }, { label: "D. Élite", a: "sc" }, { label: "Œuf", a: "eg" }] : SPECIAL_EVENTS;
        showWheel(evts, Math.floor(Math.random() * evts.length), "⭐ Événement !", (_, i) => ["#F1C40F", "#E91E63", "#9B59B6", "#00BCD4", "#FF5722", "#4CAF50"][i], res2 => {
          const sa = res2.a;
          if (sa === "fo") { setMsg("Rien trouvé..."); finRoute(); }
          else if (sa === "eg") { const b = sampleArr(gen!.BABY_IDS, 1)[0]; if (b) capturePoke(gen!.PM[b], "🥚 Œuf éclos !", finRoute); else { setMsg("Œuf vide..."); finRoute(); } }
          else if (sa === "lg") { setMsg("Le Pokémon s'enfuit..."); finRoute(); }
          else if (sa === "it") { setInv(v => ({ ...v, sp: v.sp + 2 })); setMsg("🎁 2 S. Potions !"); finRoute(); }
          else if (sa === "tr") { if (team.length > 0) { const ri = Math.floor(Math.random() * team.length); const np = gen!.PM[gen!.CATCH_IDS[Math.floor(Math.random() * gen!.CATCH_IDS.length)]]; if (np) { setTeam(t => { const c = [...t]; c[ri] = makePoke(np); return c; }); setMsg("🔄 Échange :\n" + np.n + " reçu !"); } } finRoute(); }
          else if (sa === "sc") { setCCtx({ nm: "Mystère", foes: [{ n: gen!.CHAMP.tm[0].n, t: gen!.CHAMP.tm[0].t }], d: 0.05, ctx: "rt", spr: "acetrainer-gen4dp" }); setMsg("Dresseur d'élite !"); setPhase("cpre"); }
        });
      }
      else { setMsg("Rien à signaler..."); finRoute(); }
    });
  }

  function doLeg() {
    const legs = gen!.LEGS.map(l => gen!.PM[l[0]]).filter(Boolean);
    if (!legs.length) { setPhase("msg"); return; }
    showWheel(legs, Math.floor(Math.random() * legs.length), "🌟 Légendaire ?", it => "#5DADE2", res => {
      setMsg(res.n + " apparaît ! (40% capture)");
      showWheel([{ label: "Capturé !", val: true }, { label: "Enfui...", val: false }], Math.random() < 0.4 ? 0 : 1, "Capture", it => it.val ? "#F1C40F" : "#E74C3C", c => {
        if (c.val) capturePoke(res as Pokemon, "🌟 " + res.n + " capturé !", () => setPhase("msg")); else { setMsg("Il s'enfuit..."); setPhase("msg"); }
      }, [40, 60]);
    });
  }

  // ECRAN D'ACCUEIL : SÉLECTION DES CARTOUCHES
  if (!gen) {
    return (
      <div style={{ height: "100dvh", background: "#2C3E50", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Courier New', monospace", color: "#FFF", padding: 20 }}>
        <h1 style={{ textShadow: "2px 2px 0 #000", marginBottom: 40, textAlign: "center" }}>POKÉMON RANDOMIZER<br /><span style={{ fontSize: 16, color: "#F1C40F" }}>Choix de la version</span></h1>

        <div style={{ display: "flex", gap: mob ? 30 : 60, flexDirection: mob ? "column" : "row", alignItems: "center" }}>

          <div onClick={() => setGen(gen1Data)} style={{ cursor: "pointer", width: 160, height: 220, background: "#B0B0B0", borderRadius: "10px 10px 0 0", position: "relative", boxShadow: "2px 4px 10px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", border: "2px solid #888" }}>
            <div style={{ width: "80%", height: 12, borderBottom: "2px solid #808080", marginTop: 10, borderRadius: 20 }} />
            <div style={{ width: "80%", height: 5, borderBottom: "2px solid #808080", marginTop: 2, borderRadius: 20 }} />
            <div style={{ marginTop: 20, width: 130, height: 120, background: "#FFF", borderRadius: 4, padding: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid #888", boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)" }}>
              <div style={{ color: "#E3350D", fontWeight: "bold", fontSize: 20, textAlign: "center" }}>ROUGE</div>
              <div style={{ color: "#333", fontSize: 10, marginTop: 4 }}>KANTO</div>
              <div style={{ color: "#888", fontSize: 8, marginTop: 15 }}>151 Pokémon</div>
            </div>
            <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "12px solid #808080", position: "absolute", bottom: 10 }} />
          </div>

          <div onClick={() => setGen(gen2Data)} style={{ cursor: "pointer", width: 160, height: 230, background: "rgba(212,175,55,0.9)", borderRadius: "10px 10px 0 0", position: "relative", boxShadow: "2px 4px 10px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", border: "2px solid #A67C00", borderTop: "8px solid #A67C00" }}>
            <div style={{ width: "60%", height: 8, borderBottom: "2px solid #A67C00", marginTop: 5, borderRadius: 20 }} />
            <div style={{ marginTop: 20, width: 130, height: 130, background: "#FFF", borderRadius: 4, padding: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid #888", boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)" }}>
              <div style={{ color: "#D4AF37", fontWeight: "bold", fontSize: 22, textAlign: "center", textShadow: "1px 1px 0 #000" }}>OR</div>
              <div style={{ color: "#333", fontSize: 10, marginTop: 4 }}>JOHTO</div>
              <div style={{ color: "#888", fontSize: 8, marginTop: 15 }}>251 Pokémon</div>
            </div>
          </div>

          <div onClick={() => setGen(gen4Data)} style={{ cursor: "pointer", width: 140, height: 160, background: "#333", borderRadius: "8px 8px 30px 8px", position: "relative", boxShadow: "2px 4px 10px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #222" }}>
            <div style={{ width: 40, height: 4, background: "#222", marginTop: 0 }} />
            <div style={{ marginTop: 15, width: 120, height: 110, background: "#FFF", borderRadius: 4, padding: 8, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid #111" }}>
              <div style={{ color: "#3498DB", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>DIAMANT</div>
              <div style={{ color: "#333", fontSize: 10, marginTop: 4 }}>SINNOH</div>
              <div style={{ color: "#888", fontSize: 8, marginTop: 15 }}>Mécanique Mod.</div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // THEME ACTIF
  const th = THEMES[gen.id] || THEMES.gen4;

  return (
    <div style={{ height: "100dvh", backgroundColor: th.bg, fontFamily: th.font, color: th.text, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(180deg, ${th.btnBg} 0%, ${th.border} 100%)`, borderBottom: `4px solid ${th.border}`, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, zIndex: 10, color: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 22 }}>⚡</span><div><div style={{ fontSize: 18, fontWeight: 900 }}>POKÉMON</div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#FFF" }}>{gen.name}</div></div></div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ padding: "4px 8px", fontSize: 18, cursor: "pointer", background: "rgba(0,0,0,0.2)", color: "#fff", border: `2px solid ${th.border}`, borderRadius: 6, fontWeight: "bold" }}>☰</button>
        {menuOpen && (<div style={{ ...getPanelStyle(th), position: "absolute", right: 16, top: 56, zIndex: 20, padding: 12 }}><button onClick={backToMenu} style={btnStyle(th, "#E74C3C")}>🏠 Changer de jeu</button><button onClick={() => { reset(); setMenuOpen(false); }} style={{ ...btnStyle(th, "#E74C3C"), marginTop: 8 }}>🔄 Reset Partie</button></div>)}
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9 }} />}

      {/* PANNEAUX */}
      <div style={{ flex: 1, display: "flex", flexDirection: mob ? "column" : "row", overflow: "hidden", padding: mob ? 4 : 12, gap: mob ? 4 : 12 }}>
        <div style={{ ...getPanelStyle(th), width: mob ? "100%" : 240, flexShrink: 0, padding: mob ? "6px 10px" : "16px", display: "flex", flexDirection: "column", gap: mob ? 6 : 20, zIndex: 5, overflowY: mob ? "visible" : "auto" }}>
          {mob ? (
            <><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}><div>🏅 {badges.length}/{gen.GYMS.length}</div><div>🧪{inv.p} 💊{inv.sp} ⭕{inv.b} 💫{inv.r}</div><div>📍 {step}/{gen.STORY.length}</div></div><div style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 4 }}>{[0, 1, 2, 3, 4, 5].map(i => team[i] ? (<div key={i} style={{ flexShrink: 0, border: `2px solid ${th.border}`, borderRadius: 8, background: "rgba(255,255,255,0.5)", padding: 4, display: "flex", alignItems: "center", gap: 6, minWidth: 120 }}><img src={sprUrl(team[i].id)} alt="" style={{ width: 36, height: 36, imageRendering: "pixelated" }} onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} /><div style={{ overflow: "hidden" }}><div style={{ fontSize: 11, fontWeight: "bold", whiteSpace: "nowrap" }}>{team[i].n}</div><div style={{ fontSize: 9, opacity: 0.7 }}>BST {getEffBst(team[i])}</div></div></div>) : <div key={i} style={{ flexShrink: 0, width: 120, height: 48, border: `2px dashed ${th.border}`, opacity: 0.5, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>Vide</div>)}</div></>
          ) : (
            <><div style={{ textAlign: "center" }}><div style={{ fontSize: 14, marginBottom: 4 }}>Progression ({step}/{gen.STORY.length})</div><div style={{ width: "100%", height: 8, background: "rgba(0,0,0,0.1)", borderRadius: 4, border: `1px solid ${th.border}` }}><div style={{ height: "100%", width: `${(step / gen.STORY.length) * 100}%`, background: th.btnBg, borderRadius: 3 }} /></div></div><div><div style={{ fontSize: 14, marginBottom: 8, textAlign: "center" }}>🏅 Badges ({badges.length}/{gen.GYMS.length})</div><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>{gen.GYMS.map((g, i) => <div key={i} style={{ borderRadius: 4, padding: "4px 0", textAlign: "center", fontSize: 11, background: badges.includes(g.bd) ? th.btnBg : "rgba(0,0,0,0.1)", color: badges.includes(g.bd) ? "#fff" : th.text, border: `1px solid ${th.border}` }}>{badges.includes(g.bd) ? "⭐" : "—"}</div>)}</div></div><div><div style={{ fontSize: 14, marginBottom: 8, textAlign: "center" }}>🎒 Inventaire</div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{[{ i: "🧪", v: inv.p, l: "Pots" }, { i: "💊", v: inv.sp, l: "Super" }, { i: "⭕", v: inv.b, l: "Balls" }, { i: "💫", v: inv.r, l: "Rappels" }].map((it, i) => (<div key={i} style={{ background: "rgba(255,255,255,0.5)", border: `2px solid ${th.border}`, borderRadius: 6, padding: "6px", textAlign: "center", display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 14 }}>{it.i} {it.v}</span><span style={{ fontSize: 10, opacity: 0.7 }}>{it.l}</span></div>))}</div></div></>
          )}
        </div>

        <div style={{ ...getPanelStyle(th), flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", padding: mob ? 8 : 16 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {phase !== "wheel" && phase !== "swap" && phase !== "win" && phase !== "choice" && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: mob ? 20 : 60, justifyContent: "center" }}>
                <img src={trainerSpr(gen.id === "gen1" ? "red" : gen.id === "gen2" ? "ethan" : "lucas")} style={{ width: mob ? 100 : 140, transform: "scaleX(-1)", imageRendering: "pixelated" }} alt="Héros" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} />
                {cCtx?.spr && <img src={trainerSpr(cCtx.spr)} style={{ width: mob ? 100 : 140, imageRendering: "pixelated" }} alt={cCtx.nm} onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} />}
              </div>
            )}

            {phase === "choice" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>🚢</div>
                <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
                  <button onClick={nextStep} style={btnStyle(th, "#27AE60")}>▶️ Vers Kanto !</button>
                  <button onClick={() => setPhase("win")} style={btnStyle(th, "#E74C3C")}>⏹️ Finir le jeu</button>
                </div>
              </div>
            )}

            {phase === "wheel" && wCfg && (
              <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: mob ? "column" : "row", alignItems: "center", justifyContent: "center", gap: mob ? 12 : 24 }}>
                {!mob && wCfg.label === "Combat" && wCfg.sizes && (<div style={{ fontSize: 24, fontWeight: 900, textAlign: "center" }}>Victoire<br />{wCfg.sizes[0]}%</div>)}
                <Wheel ref={wheelRef} key={wheelKey} items={wCfg.items} winIdx={wCfg.winIdx} onDone={wCfg.onDone} label={wCfg.label} colFn={wCfg.colFn} sizes={wCfg.sizes} sz={mob ? 260 : 380} onStateChange={(s, d) => setWheelState({ spinning: s, done: d })} />
                {mob && wCfg.label === "Combat" && wCfg.sizes && (<div style={{ fontSize: 20, fontWeight: 900, textAlign: "center" }}>Victoire : {wCfg.sizes[0]}%</div>)}
              </div>
            )}
            {phase === "swap" && swapData && (
              <div style={{ textAlign: "center", width: "100%", maxWidth: 400 }}>
                <div style={{ fontSize: 16, marginBottom: 12 }}>Remplacer par <strong>{swapData.poke.n}</strong> ?</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 12 }}>
                  {team.map((p, i) => (<button key={i} onClick={() => { setTeam(t => { const c = [...t]; c[i] = swapData.poke; return c; }); setMsg("Remplacement :\n" + swapData.poke.n + " rejoint l'équipe !"); setSwapData(null); swapData.afterFn(); }} style={{ padding: 6, background: "rgba(255,255,255,0.8)", border: `2px solid ${th.border}`, borderRadius: 6, cursor: "pointer" }}><img src={sprUrl(p.id)} alt="" style={{ width: 40, height: 40 }} onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} /><div style={{ fontSize: 11, fontWeight: "bold", color: th.text }}>{p.n}</div></button>))}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}><button onClick={() => { setMsg("Refus de " + swapData.poke.n + "."); setSwapData(null); swapData.afterFn(); }} style={btnStyle(th, "#7F8C8D", "#34495E")}>❌ Garder l'équipe</button></div>
              </div>
            )}
            {phase === "win" && (<div style={{ textAlign: "center" }}><div style={{ fontSize: mob ? 60 : 80 }}>🏆</div><div style={{ fontSize: mob ? 22 : 30 }}>MAÎTRE POKÉMON !</div></div>)}
          </div>
        </div>

        {!mob && (
          <div style={{ ...getPanelStyle(th), width: 260, flexShrink: 0, padding: 16, display: "flex", flexDirection: "column", zIndex: 5 }}>
            <div style={{ fontSize: 14, marginBottom: 12, textAlign: "center" }}>👥 Équipe ({team.length}/6)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, overflowY: "auto" }}>
              {[0, 1, 2, 3, 4, 5].map(i => team[i] ? (<div key={i} style={{ background: "rgba(255,255,255,0.5)", border: `2px solid ${th.border}`, borderRadius: 8, padding: "6px", display: "flex", alignItems: "center", gap: 10 }}><img src={sprUrl(team[i].id)} style={{ width: 48, height: 48, imageRendering: "pixelated" }} alt="" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG }} /><div style={{ overflow: "hidden" }}><div style={{ fontSize: 14, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{team[i].n}</div><div style={{ fontSize: 11, opacity: 0.7 }}>BST {getEffBst(team[i])}</div></div></div>) : <div key={i} style={{ height: 64, border: `2px dashed ${th.border}`, opacity: 0.5, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>Vide</div>)}
            </div>
          </div>
        )}
      </div>

      {/* BOUTONS ACTIONS */}
      <div style={{ padding: mob ? "8px 8px calc(8px + env(safe-area-inset-bottom))" : "16px", background: th.panelBg, borderTop: `4px solid ${th.border}`, display: "flex", flexDirection: "column", gap: 10, flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", minHeight: 42, alignItems: "center" }}>

          {phase === "wheel" && (
            <button onClick={() => { if (!wheelState.spinning && !wheelState.done) wheelRef.current?.spin(); else if (wheelState.done && wCfg) { setMsg(msg); wCfg.onDone(wCfg.items[wCfg.winIdx]); } }} disabled={wheelState.spinning} style={{ ...btnStyle(th, wheelState.done ? undefined : "#E3350D"), opacity: wheelState.spinning ? 0.6 : 1 }}>
              {wheelState.spinning ? "🎰 Rotation..." : wheelState.done ? "▶️ Continuer" : "🎰 Tourner la roue"}
            </button>
          )}

          {phase === "msg" && <button onClick={nextStep} style={btnStyle(th)}>▶️ Continuer</button>}
          {phase === "cpre" && cCtx && (<button onClick={doCombat} style={btnStyle(th, "#E3350D")}>⚔️ Combattre</button>)}
          {phase === "retry" && <button onClick={doCombat} style={btnStyle(th, "#F39C12")}>🔄 Retenter</button>}
          {phase === "go" && (<><button onClick={() => { const isRt = cCtx?.ctx === "rt"; setCCtx(null); if (isRt) finRoute(); else setPhase("msg"); }} style={btnStyle(th)}>Avancer quand même</button><button onClick={reset} style={btnStyle(th, "#E3350D")}>Recommencer</button></>)}
          {phase === "route" && (<><div style={{ fontSize: 14, padding: "8px 16px", background: "rgba(255,255,255,0.5)", border: `2px solid ${th.border}`, borderRadius: 6, display: "flex", alignItems: "center", color: th.text }}>Tours : <strong style={{ marginLeft: 6 }}>{rSpins}</strong></div><button onClick={doRoute} style={btnStyle(th)}>🎯 Avancer</button></>)}
          {phase === "sleg" && <button onClick={doLeg} style={btnStyle(th, "#F1C40F")}>🌟 Approcher</button>}
          {phase === "win" && <button onClick={reset} style={btnStyle(th, "#F1C40F")}>🔄 Rejouer</button>}
        </div>

        {/* DIALOGUE */}
        <div style={{ background: "rgba(255,255,255,0.8)", border: `4px solid ${th.border}`, borderRadius: 8, padding: "12px 16px", minHeight: mob ? 64 : 80, display: "flex", alignItems: "center", boxShadow: `inset 0 0 0 3px ${th.btnBg}` }}>
          <div style={{ fontSize: mob ? 14 : 16, whiteSpace: "pre-line", lineHeight: 1.5, width: "100%", fontWeight: "bold", color: th.text }}>{msg || "\u00A0"}</div>
        </div>
      </div>
    </div>
  );
}
