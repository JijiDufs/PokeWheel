import { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════ TYPE CHART ═══════════════ */
var SE: Record<string, Record<string, number>> = {
  Normal: { Roche: 0.5, Acier: 0.5, Spectre: 0 },
  Feu: { Feu: 0.5, Eau: 0.5, Plante: 2, Glace: 2, Insecte: 2, Roche: 0.5, Dragon: 0.5, Acier: 2 },
  Eau: { Feu: 2, Eau: 0.5, Plante: 0.5, Sol: 2, Roche: 2, Dragon: 0.5 },
  Plante: { Feu: 0.5, Eau: 2, Plante: 0.5, Poison: 0.5, Sol: 2, Vol: 0.5, Insecte: 0.5, Roche: 2, Dragon: 0.5, Acier: 0.5 },
  "Électrik": { Eau: 2, Plante: 0.5, "Électrik": 0.5, Sol: 0, Vol: 2, Dragon: 0.5 },
  Glace: { Feu: 0.5, Eau: 0.5, Plante: 2, Glace: 0.5, Sol: 2, Vol: 2, Dragon: 2, Acier: 0.5 },
  Combat: { Normal: 2, Glace: 2, Poison: 0.5, Vol: 0.5, Psy: 0.5, Insecte: 0.5, Roche: 2, Spectre: 0, "Ténèbres": 2, Acier: 2, "Fée": 0.5 },
  Poison: { Plante: 2, Poison: 0.5, Sol: 0.5, Roche: 0.5, Spectre: 0.5, Acier: 0, "Fée": 2 },
  Sol: { Feu: 2, Plante: 0.5, "Électrik": 2, Poison: 2, Vol: 0, Insecte: 0.5, Roche: 2, Acier: 2 },
  Vol: { Plante: 2, "Électrik": 0.5, Combat: 2, Insecte: 2, Roche: 0.5, Acier: 0.5 },
  Psy: { Combat: 2, Poison: 2, Psy: 0.5, "Ténèbres": 0, Acier: 0.5 },
  Insecte: { Feu: 0.5, Plante: 2, Combat: 0.5, Poison: 0.5, Vol: 0.5, Psy: 2, Spectre: 0.5, "Ténèbres": 2, Acier: 0.5, "Fée": 0.5 },
  Roche: { Feu: 2, Glace: 2, Combat: 0.5, Sol: 0.5, Vol: 2, Insecte: 2, Acier: 0.5 },
  Spectre: { Normal: 0, Psy: 2, Spectre: 2, "Ténèbres": 0.5 },
  Dragon: { Dragon: 2, Acier: 0.5, "Fée": 0 },
  "Ténèbres": { Combat: 0.5, Psy: 2, Spectre: 2, "Ténèbres": 0.5, "Fée": 0.5 },
  Acier: { Feu: 0.5, Eau: 0.5, "Électrik": 0.5, Glace: 2, Roche: 2, Acier: 0.5, "Fée": 2 },
  "Fée": { Feu: 0.5, Poison: 0.5, Combat: 2, Dragon: 2, "Ténèbres": 2, Acier: 0.5 }
};

interface Pokemon {
  id: number;
  n: string;
  t: string[];
  e: number | null;
}

interface FoePokemon {
  n: string;
  t: string[];
}

function calcWin(team: Pokemon[], foes: FoePokemon[], diff: number) {
  if (!team.length) return 0.15;
  var typeScore = 0;
  team.forEach(function (p) {
    foes.forEach(function (o) {
      p.t.forEach(function (a) {
        var m = 1;
        o.t.forEach(function (d) { if (SE[a] && SE[a][d] !== undefined) m *= SE[a][d]; });
        if (m >= 2) typeScore += 12; else if (m > 1) typeScore += 6; else if (m < 1 && m > 0) typeScore -= 5; else if (m === 0) typeScore -= 8;
      });
    });
  });
  var teamBST = 0;
  team.forEach(function (p) { teamBST += (BST[p.id] || 300); });
  teamBST = teamBST / team.length;
  var foeBST = 0;
  foes.forEach(function (o) { foeBST += (NBST[o.n] || (BST as Record<string, number>)[(o as unknown as Pokemon).id] || 400); });
  foeBST = foeBST / foes.length;
  var statBonus = (teamBST - foeBST) / 1000;
  var sizeBonus = (team.length - foes.length) * 0.04;
  return Math.max(0.10, Math.min(0.92, 0.50 + typeScore / 100 + statBonus + sizeBonus - (diff || 0)));
}

/* ═══════════════ POKEMON ═══════════════ */
var PD: [number, string, string[], number][] = [
  [387,"Tortipouss",["Plante"],388],[388,"Boskara",["Plante"],389],[389,"Torterra",["Plante","Sol"],0],
  [390,"Ouisticram",["Feu"],391],[391,"Chimpenfeu",["Feu","Combat"],392],[392,"Simiabraz",["Feu","Combat"],0],
  [393,"Tiplouf",["Eau"],394],[394,"Prinplouf",["Eau"],395],[395,"Pingoléon",["Eau","Acier"],0],
  [396,"Étourmi",["Normal","Vol"],397],[397,"Étourvol",["Normal","Vol"],398],[398,"Étouraptor",["Normal","Vol"],0],
  [399,"Keunotor",["Normal"],400],[400,"Castorno",["Normal","Eau"],0],
  [401,"Crikzik",["Insecte"],402],[402,"Mélokrik",["Insecte"],0],
  [403,"Lixy",["Électrik"],404],[404,"Luxio",["Électrik"],405],[405,"Luxray",["Électrik"],0],
  [406,"Rozbouton",["Plante","Poison"],315],[315,"Rosélia",["Plante","Poison"],407],[407,"Roserade",["Plante","Poison"],0],
  [408,"Kranidos",["Roche"],409],[409,"Charkos",["Roche"],0],
  [410,"Dinoclier",["Roche","Acier"],411],[411,"Bastiodon",["Roche","Acier"],0],
  [415,"Apitrini",["Insecte","Vol"],416],[416,"Apireine",["Insecte","Vol"],0],
  [417,"Pachirisu",["Électrik"],0],
  [418,"Mustébouée",["Eau"],419],[419,"Mustéflott",["Eau"],0],
  [420,"Ceribou",["Plante"],421],[421,"Ceriflor",["Plante"],0],
  [422,"Sancoki",["Eau"],423],[423,"Tritosor",["Eau","Sol"],0],
  [425,"Baudrive",["Spectre","Vol"],426],[426,"Grodrive",["Spectre","Vol"],0],
  [427,"Laporeille",["Normal"],428],[428,"Lockpin",["Normal"],0],
  [431,"Chaglam",["Normal"],432],[432,"Chaffreux",["Normal"],0],
  [434,"Moufouette",["Poison","Ténèbres"],435],[435,"Moufflair",["Poison","Ténèbres"],0],
  [436,"Archéomire",["Acier","Psy"],437],[437,"Archéodong",["Acier","Psy"],0],
  [441,"Pijako",["Normal","Vol"],0],[442,"Spiritomb",["Spectre","Ténèbres"],0],
  [443,"Griknot",["Dragon","Sol"],444],[444,"Carmache",["Dragon","Sol"],445],[445,"Carchacrok",["Dragon","Sol"],0],
  [446,"Goinfrex",["Normal"],143],[143,"Ronflex",["Normal"],0],
  [447,"Riolu",["Combat"],448],[448,"Lucario",["Combat","Acier"],0],
  [449,"Hippopotas",["Sol"],450],[450,"Hippodocus",["Sol"],0],
  [451,"Rapion",["Poison","Insecte"],452],[452,"Drascore",["Poison","Ténèbres"],0],
  [453,"Cradopaud",["Poison","Combat"],454],[454,"Coatox",["Poison","Combat"],0],
  [455,"Vortente",["Plante"],0],
  [459,"Blizzi",["Plante","Glace"],460],[460,"Blizzaroi",["Plante","Glace"],0],
  [461,"Dimoret",["Ténèbres","Glace"],0],[462,"Magnézone",["Électrik","Acier"],0],
  [464,"Rhinastoc",["Sol","Roche"],0],[466,"Élekable",["Électrik"],0],[467,"Maganon",["Feu"],0],
  [468,"Togekiss",["Fée","Vol"],0],[469,"Yanméga",["Insecte","Vol"],0],
  [470,"Phyllali",["Plante"],0],[471,"Givrali",["Glace"],0],
  [472,"Scorvol",["Sol","Vol"],0],[473,"Mammochon",["Glace","Sol"],0],
  [475,"Gallame",["Psy","Combat"],0],[477,"Noctunoir",["Spectre"],0],
  [478,"Momartik",["Glace","Spectre"],0],[479,"Motisma",["Électrik","Spectre"],0],
  [41,"Nosferapti",["Poison","Vol"],42],[42,"Nosferalto",["Poison","Vol"],169],[169,"Nostenfer",["Poison","Vol"],0],
  [63,"Abra",["Psy"],64],[64,"Kadabra",["Psy"],65],[65,"Alakazam",["Psy"],0],
  [66,"Machoc",["Combat"],67],[67,"Machopeur",["Combat"],68],[68,"Mackogneur",["Combat"],0],
  [74,"Racaillou",["Roche","Sol"],75],[75,"Gravalanch",["Roche","Sol"],76],[76,"Grolem",["Roche","Sol"],0],
  [77,"Ponyta",["Feu"],78],[78,"Galopa",["Feu"],0],
  [92,"Fantominus",["Spectre","Poison"],93],[93,"Spectrum",["Spectre","Poison"],94],[94,"Ectoplasma",["Spectre","Poison"],0],
  [95,"Onix",["Roche","Sol"],208],[208,"Steelix",["Acier","Sol"],0],
  [129,"Magicarpe",["Eau"],130],[130,"Léviator",["Eau","Vol"],0],
  [133,"Évoli",["Normal"],0],
  [54,"Psykokwak",["Eau"],55],[55,"Akwakwak",["Eau"],0],
  [72,"Tentacool",["Eau","Poison"],73],[73,"Tentacruel",["Eau","Poison"],0],
  [25,"Pikachu",["Électrik"],26],[26,"Raichu",["Électrik"],0],
  [172,"Pichu",["Électrik"],25],[175,"Togepi",["Fée"],176],[176,"Togetic",["Fée","Vol"],468],
  [307,"Méditikka",["Combat","Psy"],308],[308,"Charmina",["Combat","Psy"],0],
  [215,"Farfuret",["Ténèbres","Glace"],461],[123,"Insécateur",["Insecte","Vol"],0],
  [190,"Capumain",["Normal"],424],[424,"Capidextre",["Normal"],0],
  [198,"Cornèbre",["Ténèbres","Vol"],430],[430,"Corboss",["Ténèbres","Vol"],0],
  [200,"Feuforêve",["Spectre"],429],[429,"Magirêve",["Spectre"],0],
  [438,"Manzaï",["Roche"],185],[185,"Simularbre",["Roche"],0],
  [111,"Rhinocorne",["Sol","Roche"],112],[112,"Rhinoféros",["Sol","Roche"],464],
  [440,"Ptiravi",["Normal"],113],[113,"Leveinard",["Normal"],242],[242,"Leuphorie",["Normal"],0],
  [349,"Barpau",["Eau"],350],[350,"Milobellus",["Eau"],0],
  [339,"Barloche",["Eau","Sol"],340],[340,"Barbicha",["Eau","Sol"],0],
  [456,"Écayon",["Eau"],457],[457,"Luminéon",["Eau"],0],
  [458,"Babimanta",["Eau","Vol"],226],[226,"Démanta",["Eau","Vol"],0],
  [433,"Korillon",["Psy"],358],[358,"Éoko",["Psy"],0],
  [114,"Saquedeneu",["Plante"],465],[465,"Bouldeneu",["Plante"],0],
  [125,"Élektek",["Électrik"],466],[126,"Magmar",["Feu"],467],
  [361,"Stalgamin",["Glace"],362],[362,"Oniglali",["Glace"],0],
  [355,"Skelénox",["Spectre"],356],[356,"Téraclope",["Spectre"],477],
  [280,"Tarsal",["Psy","Fée"],281],[281,"Kirlia",["Psy","Fée"],282],[282,"Gardevoir",["Psy","Fée"],0],
  [220,"Marcacrin",["Glace","Sol"],221],[221,"Cochignon",["Glace","Sol"],473],
  [108,"Excelangue",["Normal"],463],[463,"Coudlangue",["Normal"],0]
];

var PM: Record<number, Pokemon> = {};
PD.forEach(function (a) { PM[a[0]] = { id: a[0], n: a[1], t: a[2], e: a[3] || null }; });
var LEGS: [number, string, string[]][] = [[483,"Dialga",["Acier","Dragon"]],[484,"Palkia",["Eau","Dragon"]],[487,"Giratina",["Spectre","Dragon"]],[480,"Créhelf",["Psy"]],[481,"Créfollet",["Psy"]],[482,"Créfadet",["Psy"]],[485,"Heatran",["Feu","Acier"]],[488,"Cresselia",["Psy"]]];
LEGS.forEach(function (a) { PM[a[0]] = { id: a[0], n: a[1], t: a[2], e: null }; });
function gp(id: number): Pokemon { return PM[id]; }

var BST: Record<number, number> = {
  387:318,388:405,389:525,390:309,391:405,392:534,393:314,394:405,395:530,
  396:245,397:340,398:485,399:250,400:410,401:194,402:384,403:263,404:363,405:523,
  406:280,315:400,407:515,408:350,409:495,410:350,411:495,415:244,416:474,417:405,
  418:330,419:495,420:275,421:450,422:325,423:475,425:348,426:498,427:350,428:480,
  431:310,432:452,434:329,435:479,436:300,437:500,441:411,442:485,
  443:300,444:410,445:600,446:390,143:540,447:285,448:525,449:330,450:525,
  451:330,452:500,453:300,454:490,455:454,459:334,460:494,461:510,462:535,
  464:535,466:540,467:540,468:545,469:515,470:525,471:525,472:510,473:530,
  475:518,477:525,478:480,479:440,
  41:245,42:455,169:535,63:310,64:400,65:500,66:305,67:405,68:505,
  74:300,75:390,76:495,77:410,78:500,92:310,93:405,94:500,95:385,208:510,
  129:200,130:540,133:325,54:320,55:500,72:335,73:515,25:320,26:485,
  172:205,175:245,176:405,307:280,308:410,215:430,123:500,
  190:360,424:482,198:405,430:505,200:435,429:495,438:290,185:410,
  111:345,112:485,440:220,113:450,242:540,349:200,350:540,339:288,340:468,
  456:330,457:460,458:345,226:485,433:285,358:455,114:435,465:535,
  125:490,126:495,361:300,362:480,355:295,356:455,280:198,281:278,282:518,
  220:250,221:450,108:385,463:515,
  483:680,484:680,487:680,480:580,481:580,482:580,485:600,488:580
};

var NBST: Record<string, number> = {
  "Racaillou":300,"Onix":385,"Kranidos":350,"Ceribou":275,"Rosélia":400,"Roserade":515,
  "Méditikka":280,"Machopeur":405,"Lucario":525,"Mustéflott":495,"Akwakwak":500,"Léviator":540,
  "Baudrive":348,"Magirêve":495,"Ectoplasma":500,"Archéodong":500,"Steelix":510,"Bastiodon":495,
  "Farfuret":430,"Blizzi":334,"Charmina":410,"Blizzaroi":494,"Raichu":485,"Luxray":523,"Élekable":540,
  "Nosferapti":245,"Chaffreux":452,"Nosferalto":455,"Moufflair":479,"Coatox":490,
  "Nostenfer":535,"Dimoret":510,"Corboss":505,"Carchacrok":600,
  "Yanméga":515,"Drascore":500,"Apireine":474,"Insécateur":500,
  "Rhinoféros":485,"Hippodocus":525,"Tritosor":475,"Grolem":495,
  "Simiabraz":534,"Galopa":500,"Maganon":540,
  "Alakazam":500,"Gardevoir":518,"Gallame":518,
  "Spiritomb":485,"Togekiss":545,"Milobellus":540,
  "Keunotor":250,"Étourmi":245,"Étourvol":340,"Étouraptor":485,
  "Ponyta":410,"Luxio":363,"Torterra":525,"Pingoléon":530,"Boskara":405,
  "Chimpenfeu":405,"Prinplouf":405,"Tortipouss":318,"Ouisticram":309,"Tiplouf":314
};

var CATCH_IDS = PD.map(function (p) { return p[0]; }).filter(function (id) { return [387,388,389,390,391,392,393,394,395].indexOf(id) === -1; });
var FISH_IDS = PD.filter(function (p) { return p[2].indexOf("Eau") !== -1; }).map(function (p) { return p[0]; });
var BABY_IDS = [172, 175, 433, 438, 440, 446, 447, 406];

/* ═══════════════ TRAINERS ═══════════════ */
interface Gym { nm: string; ct: string; bd: string; tp: string; spr: string; df: number; tm: FoePokemon[]; }
var GYMS: Gym[] = [
  { nm: "Pierrick", ct: "Charbourg", bd: "Charbon", tp: "Roche", spr: "roark", df: -0.10, tm: [{ n: "Racaillou", t: ["Roche","Sol"] }, { n: "Onix", t: ["Roche","Sol"] }, { n: "Kranidos", t: ["Roche"] }] },
  { nm: "Flo", ct: "Vestigion", bd: "Forêt", tp: "Plante", spr: "gardenia", df: -0.05, tm: [{ n: "Ceribou", t: ["Plante"] }, { n: "Rosélia", t: ["Plante","Poison"] }, { n: "Roserade", t: ["Plante","Poison"] }] },
  { nm: "Mélina", ct: "Voilaroc", bd: "Pavé", tp: "Combat", spr: "maylene", df: 0, tm: [{ n: "Méditikka", t: ["Combat","Psy"] }, { n: "Machopeur", t: ["Combat"] }, { n: "Lucario", t: ["Combat","Acier"] }] },
  { nm: "Lovis", ct: "Verchamps", bd: "Marais", tp: "Eau", spr: "crasherwake", df: 0, tm: [{ n: "Mustéflott", t: ["Eau"] }, { n: "Akwakwak", t: ["Eau"] }, { n: "Léviator", t: ["Eau","Vol"] }] },
  { nm: "Kiméra", ct: "Unionpolis", bd: "Relique", tp: "Spectre", spr: "fantina", df: 0.03, tm: [{ n: "Baudrive", t: ["Spectre","Vol"] }, { n: "Magirêve", t: ["Spectre"] }, { n: "Ectoplasma", t: ["Spectre","Poison"] }] },
  { nm: "Charles", ct: "Joliberges", bd: "Mine", tp: "Acier", spr: "byron", df: 0.05, tm: [{ n: "Archéodong", t: ["Acier","Psy"] }, { n: "Steelix", t: ["Acier","Sol"] }, { n: "Bastiodon", t: ["Roche","Acier"] }] },
  { nm: "Gladys", ct: "Frimapic", bd: "Glaçon", tp: "Glace", spr: "candice", df: 0.08, tm: [{ n: "Farfuret", t: ["Ténèbres","Glace"] }, { n: "Blizzi", t: ["Plante","Glace"] }, { n: "Charmina", t: ["Combat","Psy"] }, { n: "Blizzaroi", t: ["Plante","Glace"] }] },
  { nm: "Tanguy", ct: "Rivamar", bd: "Phare", tp: "Électrik", spr: "volkner", df: 0.10, tm: [{ n: "Raichu", t: ["Électrik"] }, { n: "Luxray", t: ["Électrik"] }, { n: "Élekable", t: ["Électrik"] }] }
];

interface TrainerCtx { nm: string; spr: string; tm: FoePokemon[]; }
var GAL: TrainerCtx[] = [
  { nm: "Mars", spr: "mars", tm: [{ n: "Nosferapti", t: ["Poison","Vol"] }, { n: "Chaffreux", t: ["Normal"] }] },
  { nm: "Jupiter", spr: "jupiter", tm: [{ n: "Nosferalto", t: ["Poison","Vol"] }, { n: "Moufflair", t: ["Poison","Ténèbres"] }] },
  { nm: "Saturne", spr: "saturn", tm: [{ n: "Nosferalto", t: ["Poison","Vol"] }, { n: "Coatox", t: ["Poison","Combat"] }] },
  { nm: "Hélio", spr: "cyrus", tm: [{ n: "Nostenfer", t: ["Poison","Vol"] }, { n: "Dimoret", t: ["Ténèbres","Glace"] }, { n: "Corboss", t: ["Ténèbres","Vol"] }, { n: "Carchacrok", t: ["Dragon","Sol"] }] }
];
var E4: (TrainerCtx & { tp: string })[] = [
  { nm: "Aaron", tp: "Insecte", spr: "aaron", tm: [{ n: "Yanméga", t: ["Insecte","Vol"] }, { n: "Drascore", t: ["Poison","Ténèbres"] }, { n: "Apireine", t: ["Insecte","Vol"] }] },
  { nm: "Bertha", tp: "Sol", spr: "bertha", tm: [{ n: "Rhinoféros", t: ["Sol","Roche"] }, { n: "Hippodocus", t: ["Sol"] }, { n: "Tritosor", t: ["Eau","Sol"] }] },
  { nm: "Adrien", tp: "Feu", spr: "flint", tm: [{ n: "Simiabraz", t: ["Feu","Combat"] }, { n: "Galopa", t: ["Feu"] }, { n: "Maganon", t: ["Feu"] }] },
  { nm: "Lucio", tp: "Psy", spr: "lucian", tm: [{ n: "Alakazam", t: ["Psy"] }, { n: "Gardevoir", t: ["Psy","Fée"] }, { n: "Gallame", t: ["Psy","Combat"] }] }
];
var CYN = { nm: "Cynthia", spr: "cynthia-gen4", tm: [{ n: "Spiritomb", t: ["Spectre","Ténèbres"] }, { n: "Roserade", t: ["Plante","Poison"] }, { n: "Togekiss", t: ["Fée","Vol"] }, { n: "Lucario", t: ["Combat","Acier"] }, { n: "Milobellus", t: ["Eau"] }, { n: "Carchacrok", t: ["Dragon","Sol"] }] };

function rivTm(sid: number | null, st: number): FoePokemon[] {
  var rid = ({ 387: 393, 390: 387, 393: 390 } as Record<number, number>)[sid ?? 393] || 393;
  var s1 = gp(rid), s2 = (s1 && s1.e) ? gp(s1.e) : s1, s3 = (s2 && s2.e) ? gp(s2.e) : s2;
  var ts = [[s1, gp(396)], [s2, gp(397), gp(77)], [s2, gp(398), gp(78), gp(404)], [s3, gp(398), gp(78), gp(405), gp(448)]];
  return (ts[Math.min(st, 3)] || ts[0]).filter(Boolean).map(function (p) { return { n: p.n, t: p.t }; });
}

/* ═══════════════ STORY ═══════════════ */
interface StoryEvent { y: string; x?: string; s?: number; p?: number; i?: number; }
var STORY: StoryEvent[] = [
  { y: "m", x: "Tu te réveilles à Bonaugure, dans la région de Sinnoh. Ton rival Barry t'attend — direction le Lac Vérité !" },
  { y: "m", x: "Des Pokémon sauvages attaquent ! La mallette du Professeur Sorbier contient 3 Pokémon..." },
  { y: "s" }, { y: "r", s: 0 },
  { y: "m", x: "Le Professeur Sorbier te confie le Pokédex. L'aventure commence !" },
  { y: "R", p: 1, x: "Route 202 — Vers Charbourg !" }, { y: "g", i: 0 },
  { y: "m", x: "Badge Charbon obtenu ! La Team Galaxie rôde à Féli-Cité..." },
  { y: "R", p: 1, x: "Route 205 — Vers Vestigion !" }, { y: "g", i: 1 }, { y: "r", s: 1 },
  { y: "R", p: 2, x: "Route 206 — Vers Voilaroc !" }, { y: "g", i: 2 },
  { y: "m", x: "La Team Galaxie vole des Pokémon !" }, { y: "G", i: 2 },
  { y: "R", p: 2, x: "Route 212 — Vers Verchamps !" }, { y: "g", i: 3 },
  { y: "R", p: 2, x: "Route 209 — Vers Unionpolis !" }, { y: "g", i: 4 }, { y: "r", s: 2 },
  { y: "R", p: 2, x: "Route 218 — Cap sur Joliberges !" }, { y: "g", i: 5 },
  { y: "m", x: "💥 EXPLOSION au Lac Courage ! La Team Galaxie attaque !" },
  { y: "G", i: 2 }, { y: "G", i: 0 },
  { y: "R", p: 3, x: "Route 216 — Tempête de neige vers Frimapic !" }, { y: "g", i: 6 },
  { y: "m", x: "Ton rival a perdu contre Jupiter... Direction le QG Galaxie !" },
  { y: "G", i: 1 }, { y: "G", i: 3 },
  { y: "m", x: "Pokémon des lacs libérés ! Hélio est au Pilier Lance !" }, { y: "S" },
  { y: "R", p: 3, x: "Route 222 — Dernière arène à Rivamar !" }, { y: "g", i: 7 },
  { y: "m", x: "🎉 8 Badges ! La Ligue Pokémon t'attend !" }, { y: "r", s: 3 },
  { y: "R", p: 3, x: "Route Victoire — Dernière ligne droite !" },
  { y: "4", i: 0 }, { y: "4", i: 1 }, { y: "4", i: 2 }, { y: "4", i: 3 },
  { y: "C" }, { y: "W" }
];

/* ═══════════════ COLORS ═══════════════ */
var TC: Record<string, string> = { Normal: "#A8A878", Feu: "#F08030", Eau: "#6890F0", Plante: "#78C850", "Électrik": "#F8D030", Glace: "#98D8D8", Combat: "#C03028", Poison: "#A040A0", Sol: "#E0C068", Vol: "#A890F0", Psy: "#F85888", Insecte: "#A8B820", Roche: "#B8A038", Spectre: "#705898", Dragon: "#7038F8", "Ténèbres": "#705848", Acier: "#B8B8D0", "Fée": "#EE99AC" };
var WCOLS = ["#e74c3c", "#e67e22", "#f1c40f", "#27ae60", "#1abc9c", "#3498db", "#9b59b6", "#e91e63", "#00bcd4", "#8bc34a", "#ff9800", "#607d8b"];

/* ═══════════════ WHEEL ═══════════════ */
interface WheelItem {
  n?: string; label?: string; id?: number; t?: string[]; e?: number | null;
  val?: boolean; k?: string; a?: string;
}

interface WheelProps {
  items: WheelItem[];
  winIdx: number;
  onDone: (item: WheelItem) => void;
  label?: string;
  colFn?: (item: WheelItem, i: number) => string;
  sizes?: number[] | null;
  sz?: number;
}

function Wheel(props: WheelProps) {
  var { items, winIdx, onDone, label, colFn, sizes, sz = 360 } = props;
  var ref = useRef<HTMLCanvasElement>(null);
  var angRef = useRef(0);
  var animRef = useRef<number | null>(null);
  var [spinning, setSpinning] = useState(false);
  var [done, setDone] = useState(false);

  function getArcs() {
    var n = items.length;
    var totalSz = 0;
    var szArr: number[] = [];
    for (var i = 0; i < n; i++) {
      var s = (sizes && sizes[i]) ? sizes[i] : 1;
      szArr.push(s);
      totalSz += s;
    }
    var arcs: { start: number; size: number }[] = [];
    var cum = 0;
    for (var j = 0; j < n; j++) {
      var a = (szArr[j] / totalSz) * 2 * Math.PI;
      arcs.push({ start: cum, size: a });
      cum += a;
    }
    return arcs;
  }

  var draw = useCallback(function (angle: number) {
    var c = ref.current;
    if (!c) return;
    var ctx = c.getContext("2d");
    if (!ctx) return;
    var W = c.width, H = c.height, cx = W / 2, cy = H / 2, R = Math.min(cx, cy) - 14;
    ctx.clearRect(0, 0, W, H);
    var n = items.length;
    var arcs = getArcs();
    for (var i = 0; i < n; i++) {
      var a0 = angle + arcs[i].start;
      var a1 = a0 + arcs[i].size;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a0, a1);
      ctx.closePath();
      ctx.fillStyle = colFn ? colFn(items[i], i) : WCOLS[i % WCOLS.length];
      ctx.fill();
      ctx.strokeStyle = "#0f0c29";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a0 + arcs[i].size / 2);
      ctx.fillStyle = "#fff";
      var fs = Math.max(10, Math.min(16, Math.floor(320 / n)));
      ctx.font = "bold " + fs + "px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      var lb = items[i].n || items[i].label || "";
      var ml = n > 12 ? 10 : 18;
      ctx.fillText(lb.length > ml ? lb.slice(0, ml - 1) + "…" : lb, R - 18, 0);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.moveTo(cx + R + 10, cy);
    ctx.lineTo(cx + R - 14, cy - 16);
    ctx.lineTo(cx + R - 14, cy + 16);
    ctx.closePath();
    ctx.fillStyle = "#f1c40f";
    ctx.fill();
    ctx.strokeStyle = "#0f0c29";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#f1c40f";
    ctx.fill();
  }, [items, colFn, sizes]);

  useEffect(function () { draw(angRef.current); }, [draw]);

  function spin() {
    if (spinning || done) return;
    setSpinning(true);
    var arcs = getArcs();
    var targetCenter = arcs[winIdx].start + arcs[winIdx].size / 2;
    var target = -targetCenter + Math.PI * 2 * (5 + Math.floor(Math.random() * 3));
    var startAngle = angRef.current;
    var totalRot = target - startAngle;
    var duration = 2800 + Math.random() * 600;
    var t0 = performance.now();
    function animate(now: number) {
      var p = Math.min((now - t0) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 4);
      var cur = startAngle + totalRot * ease;
      angRef.current = cur;
      draw(cur);
      if (p < 1) { animRef.current = requestAnimationFrame(animate); }
      else { setSpinning(false); setDone(true); }
    }
    animRef.current = requestAnimationFrame(animate);
  }

  useEffect(function () { return function () { if (animRef.current) cancelAnimationFrame(animRef.current); }; }, []);

  var resLabel = done ? (items[winIdx].n || items[winIdx].label || "") : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {label && <div style={{ fontSize: 18, fontWeight: 800, color: "#f0e6d3", textAlign: "center" }}>{label}</div>}
      <canvas ref={ref} width={sz} height={sz} style={{ maxWidth: "100%" }} />
      {!spinning && !done && (
        <button onClick={spin} style={btnStyle("#e74c3c", "#c0392b")}>🎰 Tourner la roue !</button>
      )}
      {done && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ background: "rgba(46,204,113,.15)", border: "2px solid #2ecc71", borderRadius: 10, padding: "10px 24px", fontSize: 20, fontWeight: 800, color: "#2ecc71" }}>{"✨ " + resLabel}</div>
          <button onClick={function () { onDone(items[winIdx]); }} style={btnStyle("#3498db", "#2980b9")}>▶️ Continuer</button>
        </div>
      )}
    </div>
  );
}

function btnStyle(c1: string, c2: string): React.CSSProperties {
  return { padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg," + c1 + "," + c2 + ")", color: "#fff", border: "none", borderRadius: 10, boxShadow: "0 4px 16px rgba(0,0,0,.3)", letterSpacing: 0.5, minHeight: 48, touchAction: "manipulation" };
}

/* ═══════════════ HELPERS ═══════════════ */
function sampleArr(arr: number[], n: number): number[] {
  var s: Record<number, boolean> = {}, r: number[] = [];
  while (r.length < Math.min(n, arr.length)) {
    var v = arr[Math.floor(Math.random() * arr.length)];
    if (!s[v]) { s[v] = true; r.push(v); }
  }
  return r;
}
function sprUrl(id: number) { return "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/" + id + ".png"; }
function trainerSpr(name: string) { return "https://cdn.jsdelivr.net/gh/smogon/sprites@master/sprites/trainers/" + name + ".png"; }
function weightedIdx(items: { w: number }[]) {
  var tw = 0;
  for (var i = 0; i < items.length; i++) tw += (items[i].w || 1);
  var r = Math.random() * tw;
  for (var j = 0; j < items.length; j++) { r -= (items[j].w || 1); if (r <= 0) return j; }
  return 0;
}

/* ═══════════════ ROUTE OPTIONS ═══════════════ */
interface RouteOpt { label: string; w: number; a: string; }
var ROPTS: RouteOpt[] = [
  { label: "Capturer un Pokémon", w: 30, a: "catch" },
  { label: "Aller pêcher", w: 12, a: "fish" },
  { label: "Combat de dresseur", w: 18, a: "trainer" },
  { label: "Aller au shop", w: 15, a: "shop" },
  { label: "Événement spécial", w: 10, a: "special" },
  { label: "Rien, on avance", w: 10, a: "nothing" },
  { label: "Rencontre mystérieuse", w: 5, a: "mystery" }
];
var SPECIAL_EVENTS = [
  { label: "Fossile trouvé !", a: "fo" },
  { label: "Œuf mystérieux", a: "eg" },
  { label: "Légendaire rare !", a: "lg" },
  { label: "Objet rare", a: "it" },
  { label: "Échange PNJ", a: "tr" },
  { label: "Dresseur secret", a: "sc" }
];

interface CombatCtx { nm: string; foes: FoePokemon[]; d: number; ctx: string; gi?: number; spr?: string; }
interface SwapData { poke: Pokemon; afterMsg: string; afterFn: () => void; }
interface WheelCfg { items: WheelItem[]; winIdx: number; label: string; colFn: (item: WheelItem, i: number) => string; onDone: (item: WheelItem) => void; sizes: number[] | null; }
interface InvState { p: number; sp: number; b: number; r: number; }

/* ═══════════════ MAIN APP ═══════════════ */
export default function App() {
  var [team, setTeam] = useState<Pokemon[]>([]);
  var [badges, setBadges] = useState<string[]>([]);
  var [inv, setInv] = useState<InvState>({ p: 1, sp: 0, b: 0, r: 0 });
  var [sid, setSid] = useState<number | null>(null);
  var [step, setStep] = useState(0);
  var [phase, setPhase] = useState("proc");
  var [wCfg, setWCfg] = useState<WheelCfg | null>(null);
  var [msg, setMsg] = useState("");
  var [rSpins, setRSpins] = useState(0);
  var [cCtx, setCCtx] = useState<CombatCtx | null>(null);
  var [ww, setWw] = useState(window.innerWidth);
  useEffect(function () {
    function onResize() { setWw(window.innerWidth); }
    window.addEventListener("resize", onResize);
    return function () { window.removeEventListener("resize", onResize); };
  }, []);
  var mob = ww < 640;
  var [extra, setExtra] = useState("");
  var [wheelKey, setWheelKey] = useState(0);
  var [swapData, setSwapData] = useState<SwapData | null>(null);
  var [retriesLeft, setRetriesLeft] = useState(0);

  function reset() {
    setTeam([]); setBadges([]); setInv({ p: 1, sp: 0, b: 0, r: 0 });
    setSid(null); setStep(0); setPhase("proc"); setWCfg(null);
    setMsg(""); setRSpins(0); setCCtx(null); setExtra(""); setWheelKey(0); setSwapData(null); setRetriesLeft(0);
  }

  function addPoke(pk: Pokemon) {
    setTeam(function (prev) { return prev.concat([{ id: pk.id, n: pk.n, t: pk.t, e: pk.e }]); });
    setExtra(pk.n + " rejoint ton équipe !");
  }

  function capturePoke(pk: Pokemon, afterMsg: string, afterFn: () => void) {
    if (team.length < 6) {
      addPoke(pk); setMsg(afterMsg); afterFn();
    } else {
      setSwapData({ poke: { id: pk.id, n: pk.n, t: pk.t, e: pk.e }, afterMsg, afterFn });
      setMsg(pk.n + " veut rejoindre ton équipe, mais elle est pleine !");
      setPhase("swap");
    }
  }

  function nextStep() { setStep(function (s) { return s + 1; }); setPhase("proc"); setExtra(""); }

  function showWheel(items: WheelItem[], winIdx: number, label: string, colFn: (item: WheelItem, i: number) => string, onDone: (item: WheelItem) => void, sizes?: number[] | null) {
    setWCfg({ items, winIdx, label, colFn, onDone, sizes: sizes || null });
    setWheelKey(function (k) { return k + 1; });
    setPhase("wheel");
  }

  useEffect(function () {
    if (phase !== "proc") return;
    var ev = STORY[step];
    if (!ev) return;
    if (ev.y === "m") { setMsg(ev.x!); setPhase("msg"); }
    else if (ev.y === "s") {
      setMsg("La mallette s'ouvre...");
      var starters = [gp(387), gp(390), gp(393)];
      var wi = Math.floor(Math.random() * 3);
      showWheel(starters, wi, "🔥 Quel starter vas-tu obtenir ?",
        function (it) { return TC[it.t![0]]; },
        function (res) { setSid(res.id!); addPoke(res as Pokemon); setMsg((res.n || "") + " te choisit !"); setPhase("msg"); }
      );
    }
    else if (ev.y === "r") {
      var rt = rivTm(sid, ev.s!);
      setMsg("⚔️ Barry te défie !");
      var rivDiff = [-0.10, -0.05, 0, 0.05];
      setCCtx({ nm: "Barry (Rival)", foes: rt, d: rivDiff[Math.min(ev.s!, 3)] || 0, ctx: "rival", spr: "barry" });
      setPhase("cpre");
    }
    else if (ev.y === "g") {
      var g = GYMS[ev.i!];
      setMsg("🏟️ Arène de " + g.ct + " — " + g.nm);
      setCCtx({ nm: g.nm, foes: g.tm, d: g.df, ctx: "gym", gi: ev.i!, spr: g.spr }); setPhase("cpre");
    }
    else if (ev.y === "G") {
      var c = GAL[ev.i!];
      setMsg("👾 Team Galaxie — Commandant " + c.nm);
      setCCtx({ nm: "Cmd. " + c.nm, foes: c.tm, d: 0, ctx: "gal", spr: c.spr }); setPhase("cpre");
    }
    else if (ev.y === "R") { setMsg(ev.x!); setRSpins(ev.p!); setPhase("route"); }
    else if (ev.y === "S") {
      setMsg("⛰️ Pilier Lance — Hélio invoque un légendaire !");
      setCCtx({ nm: "Hélio", foes: GAL[3].tm, d: 0.10, ctx: "spear", spr: "cyrus" }); setPhase("cpre");
    }
    else if (ev.y === "4") {
      var e = E4[ev.i!];
      setMsg("🏛️ Conseil 4 — " + e.nm + " (" + e.tp + ")");
      setCCtx({ nm: e.nm, foes: e.tm, d: 0.10, ctx: "e4", spr: e.spr }); setPhase("cpre");
    }
    else if (ev.y === "C") {
      setMsg("👑 Cynthia — Championne de Sinnoh !");
      setCCtx({ nm: "Cynthia", foes: CYN.tm, d: 0.15, ctx: "champ", spr: CYN.spr }); setPhase("cpre");
    }
    else if (ev.y === "W") { setMsg("🏆 FÉLICITATIONS ! Tu es le nouveau Maître de Sinnoh ! 🏆"); setPhase("win"); }
  }, [phase, step]);

  function doCombat() {
    if (!cCtx) return;
    var chance = calcWin(team, cCtx.foes, cCtx.d);
    var pct = Math.round(chance * 100);
    var won = Math.random() < chance;
    var combatItems: WheelItem[] = [{ label: "Victoire ! (" + pct + "%)", val: true }, { label: "Défaite... (" + (100 - pct) + "%)", val: false }];
    var wi = won ? 0 : 1;
    setMsg("⚔️ " + cCtx.nm + " — " + pct + "% de chances\n" + cCtx.foes.map(function (f) { return f.n; }).join(", "));
    showWheel(combatItems, wi, "Combat : " + cCtx.nm,
      function (it) { return it.val ? "#2ecc71" : "#e74c3c"; },
      function (res) { if (res.val) { handleWin(); } else { handleLoss(); } },
      [pct, 100 - pct]
    );
  }

  function handleWin() {
    var isRoute = cCtx?.ctx === "rt";
    if (cCtx?.ctx === "gym") {
      var gym = GYMS[cCtx.gi!];
      setBadges(function (b) { return b.concat([gym.bd]); });
      setMsg("🎉 Victoire ! Badge " + gym.bd + " obtenu !");
    } else if (cCtx?.ctx === "spear") {
      setMsg("🎉 Hélio vaincu ! Le légendaire apparaît...");
      setCCtx(null); setPhase("sleg"); return;
    } else {
      setMsg("🎉 Victoire contre " + cCtx?.nm + " !");
    }
    if (isRoute) {
      var rewards = [{ k: "p", label: "Potion" }, { k: "p", label: "Potion" }, { k: "sp", label: "Super Potion" }, { k: "r", label: "Rappel" }];
      var reward = rewards[Math.floor(Math.random() * rewards.length)];
      setInv(function (v) { var nv = { ...v }; nv[reward.k as keyof InvState]++; return nv; });
      setExtra("🎁 Le dresseur te donne : " + reward.label + " !");
    }
    setCCtx(null);
    var evolvable = team.filter(function (p) { return p.e; });
    if (evolvable.length === 0) { if (isRoute) { finRoute(); } else { setPhase("msg"); } return; }
    var evoRate = badges.length <= 2 ? 0.40 : badges.length <= 5 ? 0.50 : 0.60;
    var evoPct = Math.round(evoRate * 100);
    var willEvolve = Math.random() < evoRate;
    var evoCheckItems: WheelItem[] = [{ label: "Évolution ! (" + evoPct + "%)", val: true }, { label: "Pas d'évolution", val: false }];
    showWheel(evoCheckItems, willEvolve ? 0 : 1, "🧬 Un Pokémon évolue-t-il ?",
      function (it) { return it.val ? "#f39c12" : "#7f8c8d"; },
      function (res) {
        if (!res.val) { if (isRoute) { finRoute(); } else { setPhase("msg"); } return; }
        var pickIdx = Math.floor(Math.random() * evolvable.length);
        var evoItems: WheelItem[] = evolvable.map(function (p) { return { label: p.n, id: p.id, e: p.e, n: p.n, t: p.t }; });
        showWheel(evoItems, pickIdx, "🧬 Qui évolue ?",
          function (it) { return TC[it.t![0]] || "#888"; },
          function (res2) {
            var evo = gp(res2.e as number);
            if (evo) {
              setTeam(function (t) { return t.map(function (p) { return p.id === res2.id ? { id: evo.id, n: evo.n, t: evo.t, e: evo.e } : p; }); });
              setMsg((res2.n || "") + " évolue en " + evo.n + " !");
              setExtra("🌟 Évolution réussie !");
            }
            if (isRoute) { finRoute(); } else { setPhase("msg"); }
          }
        );
      },
      [evoPct, 100 - evoPct]
    );
  }

  function handleLoss() {
    if (retriesLeft > 0) {
      setRetriesLeft(function (r) { return r - 1; });
      setMsg("💀 Défaite... Encore une tentative !"); setPhase("retry");
    } else if (inv.sp > 0) {
      setInv(function (v) { return { ...v, sp: v.sp - 1 }; });
      setRetriesLeft(1);
      setMsg("💀 Défaite... Super Potion utilisée ! (2 tentatives)"); setPhase("retry");
    } else if (inv.p > 0) {
      setInv(function (v) { return { ...v, p: v.p - 1 }; });
      setMsg("💀 Défaite... Potion utilisée !"); setPhase("retry");
    } else if (inv.r > 0) {
      setInv(function (v) { return { ...v, r: v.r - 1 }; });
      setMsg("💀 Défaite... Rappel utilisé ! Ton équipe se relève !");
      if (cCtx?.ctx === "gym") {
        var gym = GYMS[cCtx.gi!];
        setBadges(function (b) { return b.concat([gym.bd]); });
        setExtra("Badge " + gym.bd + " obtenu grâce au Rappel !");
      }
      var isRoute = cCtx?.ctx === "rt";
      setCCtx(null);
      if (isRoute) { finRoute(); } else { setPhase("msg"); }
    } else { setMsg("💀 Défaite contre " + cCtx?.nm + "..."); setPhase("go"); }
  }

  function finRoute() {
    setRSpins(function (s) {
      if (s - 1 <= 0) { setTimeout(nextStep, 500); return 0; }
      setPhase("route"); return s - 1;
    });
  }

  var ROPTS_E4: RouteOpt[] = [
    { label: "Combat de dresseur", w: 25, a: "trainer" },
    { label: "Aller au shop", w: 25, a: "shop" },
    { label: "Événement spécial", w: 20, a: "special" },
    { label: "Rien, on avance", w: 30, a: "nothing" }
  ];

  function doRoute() {
    var opts = badges.length >= 8 ? ROPTS_E4 : ROPTS;
    var wi = weightedIdx(opts);
    showWheel(opts, wi, badges.length >= 8 ? "🏛️ Route Victoire" : "🎯 Que se passe-t-il ?",
      function (it) {
        var cols: Record<string, string> = { catch: "#e74c3c", fish: "#3498db", trainer: "#e67e22", shop: "#2ecc71", special: "#9b59b6", nothing: "#7f8c8d", mystery: "#f1c40f" };
        return cols[it.a || ""] || "#888";
      },
      function (res) { doRouteAction(res.a || ""); }
    );
  }

  function doRouteAction(a: string) {
    if (a === "catch") {
      var pool = sampleArr(CATCH_IDS, 10).map(gp).filter(Boolean);
      var wi = Math.floor(Math.random() * pool.length);
      showWheel(pool, wi, "🎯 Quel Pokémon apparaît ?",
        function (it) { return TC[it.t![0]] || "#888"; },
        function (res) { capturePoke(res as Pokemon, (res.n || "") + " capturé !", finRoute); }
      );
    } else if (a === "fish") {
      var fpool = sampleArr(FISH_IDS, 8).map(gp).filter(Boolean);
      var fwi = Math.floor(Math.random() * fpool.length);
      showWheel(fpool, fwi, "🎣 Tu lances ta canne...",
        function () { return "#3498db"; },
        function (res) { capturePoke(res as Pokemon, (res.n || "") + " pêché !", finRoute); }
      );
    } else if (a === "trainer") {
      var rt: FoePokemon[] = [];
      for (var i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
        var rp = gp(CATCH_IDS[Math.floor(Math.random() * CATCH_IDS.length)]);
        if (rp) rt.push({ n: rp.n, t: rp.t });
      }
      if (!rt.length) rt.push({ n: "Keunotor", t: ["Normal"] });
      setCCtx({ nm: "Dresseur", foes: rt, d: -0.05, ctx: "rt", spr: "acetrainer-gen4" });
      setMsg("Un dresseur te défie !"); setPhase("cpre");
    } else if (a === "shop") {
      var its = badges.length >= 8
        ? [{ label: "Potion", k: "p" }, { label: "Super Potion", k: "sp" }, { label: "Rappel", k: "r" }]
        : [{ label: "Potion", k: "p" }, { label: "Super Potion", k: "sp" }, { label: "Pokéball", k: "b" }, { label: "Rappel", k: "r" }];
      var swi = Math.floor(Math.random() * its.length);
      showWheel(its, swi, "🛒 Que trouves-tu au shop ?",
        function (_, i) { return ["#e74c3c", "#e67e22", "#3498db", "#f1c40f"][i]; },
        function (res) {
          setInv(function (v) { var nv = { ...v }; nv[res.k as keyof InvState]++; return nv; });
          setMsg((res.label || "") + " obtenue !"); finRoute();
        }
      );
    } else if (a === "special") {
      var evts = badges.length >= 8
        ? [{ label: "Objet rare", a: "it" }, { label: "Dresseur secret", a: "sc" }, { label: "Œuf mystérieux", a: "eg" }]
        : SPECIAL_EVENTS;
      var swi2 = Math.floor(Math.random() * evts.length);
      showWheel(evts, swi2, "⭐ Événement spécial !",
        function (_, i) { return ["#f1c40f", "#e91e63", "#9b59b6", "#00bcd4", "#ff5722", "#4caf50"][i]; },
        function (res) { doSpecial(res.a || ""); }
      );
    } else if (a === "nothing") {
      setMsg("Rien de spécial sur cette route..."); finRoute();
    } else if (a === "mystery") {
      var rares = PD.filter(function (p) { return p[2].some(function (t) { return t === "Dragon" || t === "Spectre" || t === "Acier"; }); });
      var pk = gp(rares[Math.floor(Math.random() * rares.length)][0]);
      if (pk) { capturePoke(pk, "✨ " + pk.n + " mystérieux capturé !", finRoute); return; }
      finRoute();
    }
  }

  function doSpecial(a: string) {
    if (a === "fo") {
      var f = gp(Math.random() > 0.5 ? 408 : 410);
      if (f) { capturePoke(f, "Fossile restauré : " + f.n + " !", finRoute); return; }
      finRoute();
    } else if (a === "eg") {
      var b = gp(BABY_IDS[Math.floor(Math.random() * BABY_IDS.length)]);
      if (b) { capturePoke(b, "L'œuf éclot : " + b.n + " !", finRoute); return; }
      finRoute();
    } else if (a === "lg") {
      var ml = LEGS.filter(function (l) { return [483, 484, 487].indexOf(l[0]) === -1; });
      var l = ml[Math.floor(Math.random() * ml.length)];
      var p = gp(l[0]);
      if (p && Math.random() < 0.35) { capturePoke(p, "🌟 " + p.n + " capturé !!", finRoute); return; }
      else if (p) { setMsg(p.n + " s'enfuit..."); }
      finRoute();
    } else if (a === "it") {
      setInv(function (v) { return { ...v, sp: v.sp + 2 }; });
      setMsg("2 Super Potions trouvées !"); finRoute();
    } else if (a === "tr") {
      if (team.length > 0) {
        var ri = Math.floor(Math.random() * team.length);
        var old = team[ri];
        var np = gp(CATCH_IDS[Math.floor(Math.random() * CATCH_IDS.length)]);
        if (np) {
          setTeam(function (t) { var c = t.slice(); c[ri] = { id: np.id, n: np.n, t: np.t, e: np.e }; return c; });
          setMsg("Échange : " + old.n + " → " + np.n + " !");
        }
      }
      finRoute();
    } else if (a === "sc") {
      var st: FoePokemon[] = [{ n: "Carchacrok", t: ["Dragon","Sol"] }, { n: "Lucario", t: ["Combat","Acier"] }];
      setCCtx({ nm: "Dresseur mystérieux", foes: st, d: 0.05, ctx: "rt", spr: "acetrainer-gen4dp" });
      setMsg("Un dresseur mystérieux apparaît !"); setPhase("cpre");
    }
  }

  function doLeg() {
    var legs = [gp(483), gp(484)].filter(Boolean);
    var lwi = Math.floor(Math.random() * legs.length);
    showWheel(legs, lwi, "🌟 Quel légendaire apparaît ?",
      function (it) { return it.id === 483 ? "#4a90d9" : "#d94a8c"; },
      function (res) {
        setMsg((res.n || "") + " apparaît ! Tentative de capture (40%)...");
        var caught = Math.random() < 0.4;
        var captureItems: WheelItem[] = [{ label: "Capturé ! (40%)", val: true }, { label: "Enfui... (60%)", val: false }];
        showWheel(captureItems, caught ? 0 : 1, "Capture de " + (res.n || "") + " !",
          function (it) { return it.val ? "#f1c40f" : "#e74c3c"; },
          function (cres) {
            if (cres.val) { capturePoke(res as Pokemon, "🌟🌟🌟 " + (res.n || "") + " capturé !!! 🌟🌟🌟", function () { setPhase("msg"); }); }
            else { setMsg((res.n || "") + " s'enfuit..."); }
            setPhase("msg");
          },
          [40, 60]
        );
      }
    );
  }

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f0c29,#1a1a2e 50%,#16213e)", fontFamily: "'Trebuchet MS', sans-serif", color: "#f0e6d3", display: "flex", flexDirection: "column" }}>

      <div style={{ background: "rgba(0,0,0,0.4)", borderBottom: "3px solid #e74c3c", padding: mob ? "8px 12px" : "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12 }}>
          <span style={{ fontSize: mob ? 22 : 30 }}>⚡</span>
          <div>
            <div style={{ fontSize: mob ? 16 : 22, fontWeight: 900, letterSpacing: 1 }}>POKÉMON SINNOH</div>
            <div style={{ fontSize: mob ? 9 : 12, color: "#e74c3c", fontWeight: 700, letterSpacing: mob ? 2 : 4 }}>RANDOMIZER</div>
          </div>
        </div>
        <button onClick={reset} style={{ padding: mob ? "8px 14px" : "10px 24px", fontSize: mob ? 12 : 14, fontWeight: 700, cursor: "pointer", background: "#e74c3c", color: "#fff", border: "none", borderRadius: 8 }}>🔄 Reset</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, padding: mob ? 12 : 24, display: "flex", flexDirection: "column", alignItems: "center", gap: mob ? 10 : 16, overflowY: "auto" }}>

          {msg && (
            <div style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: mob ? 10 : 14, padding: mob ? "12px 14px" : "18px 28px", maxWidth: 500, width: "100%", whiteSpace: "pre-line", fontSize: mob ? 14 : 16, lineHeight: 1.7, textAlign: "center" }}>{msg}</div>
          )}

          {extra && (
            <div style={{ fontSize: 15, color: "#2ecc71", fontWeight: 700, textAlign: "center", padding: "8px 16px", background: "rgba(46,204,113,.1)", borderRadius: 10 }}>{extra}</div>
          )}

          {phase === "wheel" && wCfg && (
            <div style={{ display: "flex", alignItems: "center", gap: mob ? 10 : 20, flexWrap: "wrap", justifyContent: "center" }}>
              {cCtx && cCtx.spr && (
                <img src={trainerSpr(cCtx.spr)} alt="" style={{ width: mob ? 80 : 140, height: mob ? 80 : 140, imageRendering: "pixelated" }} onError={function (e) { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <Wheel key={wheelKey} items={wCfg.items} winIdx={wCfg.winIdx} onDone={wCfg.onDone} label={wCfg.label} colFn={wCfg.colFn} sizes={wCfg.sizes} sz={mob ? 260 : 360} />
            </div>
          )}

          {phase === "msg" && (
            <button onClick={nextStep} style={btnStyle("#3498db", "#2980b9")}>▶️ Continuer l'aventure</button>
          )}

          {phase === "cpre" && cCtx && (
            <div style={{ textAlign: "center", maxWidth: 460, width: "100%" }}>
              {cCtx.spr && (
                <img src={trainerSpr(cCtx.spr)} alt={cCtx.nm} style={{ width: mob ? 80 : 120, height: mob ? 80 : 120, imageRendering: "pixelated", marginBottom: 8 }} onError={function (e) { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <div style={{ fontSize: mob ? 14 : 16, marginBottom: 12, lineHeight: 1.8 }}>
                {"⚔️ " + cCtx.nm}<br />
                {"Adversaires : " + cCtx.foes.map(function (f) { return f.n; }).join(", ")}<br />
                <span style={{ color: "#f1c40f", fontWeight: 800 }}>{"Chances de victoire : " + Math.round(calcWin(team, cCtx.foes, cCtx.d) * 100) + "%"}</span>
              </div>
              <button onClick={doCombat} style={btnStyle("#e74c3c", "#c0392b")}>⚔️ Combattre !</button>
            </div>
          )}

          {phase === "retry" && (
            <button onClick={doCombat} style={btnStyle("#e67e22", "#d35400")}>🔄 Retenter le combat !</button>
          )}

          {phase === "go" && (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#e74c3c" }}>💀 GAME OVER 💀</div>
              <button onClick={function () {
                if (cCtx && cCtx.ctx === "gym") {
                  var gym = GYMS[cCtx.gi!];
                  setBadges(function (b) { return b.concat([gym.bd]); });
                  setMsg("Badge " + gym.bd + " obtenu ! Tu continues l'aventure !");
                } else { setMsg("Tu continues l'aventure !"); }
                var isRoute = cCtx?.ctx === "rt";
                var evoR = badges.length <= 2 ? 0.40 : badges.length <= 5 ? 0.50 : 0.60;
                var evolvable = team.filter(function (p) { return p.e; });
                if (evolvable.length > 0 && Math.random() < evoR) {
                  var pick = evolvable[Math.floor(Math.random() * evolvable.length)];
                  var evo = gp(pick.e!);
                  if (evo) {
                    setTeam(function (t) { return t.map(function (p) { return p.id === pick.id ? { id: evo.id, n: evo.n, t: evo.t, e: evo.e } : p; }); });
                    setExtra("🌟 " + pick.n + " évolue en " + evo.n + " !");
                  }
                }
                setCCtx(null);
                if (isRoute) { finRoute(); } else { setPhase("msg"); }
              }} style={btnStyle("#2ecc71", "#27ae60")}>▶️ Continuer quand même</button>
              {team.length > 1 && (
                <button onClick={function () {
                  var ri = Math.floor(Math.random() * team.length);
                  setExtra(team[ri].n + " a été perdu...");
                  setTeam(function (t) { return t.filter(function (_, idx) { return idx !== ri; }); });
                  setPhase("cpre");
                }} style={btnStyle("#e67e22", "#d35400")}>Continuer avec malus (-1 Pokémon)</button>
              )}
              <button onClick={reset} style={btnStyle("#e74c3c", "#c0392b")}>Recommencer la partie</button>
            </div>
          )}

          {phase === "swap" && swapData && (
            <div style={{ textAlign: "center", maxWidth: 500, width: "100%" }}>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>{"Remplacer un Pokémon par " + swapData.poke.n + " ?"}</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 4, justifyContent: "center" }}>
                {swapData.poke.t.map(function (tp) {
                  return <span key={tp} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: TC[tp], color: "#fff", fontWeight: 600 }}>{tp}</span>;
                })}
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,.1)", color: "#f0e6d3" }}>{"BST: " + (BST[swapData.poke.id] || "?")}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 8, margin: "12px 0" }}>
                {team.map(function (p, i) {
                  return (
                    <button key={i} onClick={function () {
                      var removed = team[i];
                      setTeam(function (t) { var c = t.slice(); c[i] = swapData.poke; return c; });
                      setExtra(swapData.poke.n + " remplace " + removed.n + " !");
                      setMsg(swapData.afterMsg);
                      var fn = swapData.afterFn;
                      setSwapData(null);
                      fn();
                    }} style={{ padding: "10px 8px", background: "rgba(255,255,255,.07)", border: "2px solid rgba(255,255,255,.15)", borderRadius: 10, cursor: "pointer", color: "#f0e6d3", textAlign: "center", borderLeft: "4px solid " + (TC[p.t[0]] || "#888") }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.n}</div>
                      <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 3 }}>
                        {p.t.map(function (tp) { return <span key={tp} style={{ fontSize: 8, padding: "1px 4px", borderRadius: 3, background: TC[tp], color: "#fff" }}>{tp}</span>; })}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginTop: 2 }}>{"BST: " + (BST[p.id] || "?")}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={function () {
                setMsg(swapData.afterMsg);
                setExtra(swapData.poke.n + " n'a pas été ajouté.");
                var fn = swapData.afterFn;
                setSwapData(null);
                fn();
              }} style={btnStyle("#7f8c8d", "#6c7a89")}>❌ Refuser le Pokémon</button>
            </div>
          )}

          {phase === "route" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#f0e6d3", marginBottom: 12, fontSize: 16, fontWeight: 600 }}>{"🗺️ Tours de roue restants : " + rSpins}</div>
              <button onClick={doRoute} style={btnStyle("#3498db", "#2980b9")}>🎯 Tourner la roue de route !</button>
            </div>
          )}

          {phase === "sleg" && (
            <button onClick={doLeg} style={btnStyle("#f1c40f", "#e67e22")}>🌟 Capturer le légendaire !</button>
          )}

          {phase === "win" && (
            <div style={{ background: "linear-gradient(135deg,rgba(241,196,15,.12),rgba(231,76,60,.12))", border: "2px solid #f1c40f", borderRadius: mob ? 12 : 16, padding: mob ? 16 : 32, textAlign: "center", maxWidth: 480, width: "100%" }}>
              <div style={{ fontSize: mob ? 40 : 52, marginBottom: mob ? 8 : 12 }}>🏆</div>
              <div style={{ fontSize: mob ? 20 : 26, fontWeight: 900, color: "#f1c40f", marginBottom: 10 }}>MAÎTRE DE SINNOH !</div>
              <div style={{ fontSize: 15, marginBottom: 20 }}>{"Cynthia vaincue avec " + team.length + " Pokémon et " + badges.length + " badges !"}</div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 20 }}>
                {team.map(function (p, i) {
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(0,0,0,.3)", borderRadius: 10, padding: 8 }}>
                      <img src={sprUrl(p.id)} alt="" style={{ width: 56, height: 56, imageRendering: "pixelated" }} onError={function (e) { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{p.n}</div>
                    </div>
                  );
                })}
              </div>
              <button onClick={reset} style={btnStyle("#f1c40f", "#e67e22")}>🔄 Nouvelle partie</button>
            </div>
          )}
        </div>

        <div style={{ background: "rgba(0,0,0,.45)", borderTop: "3px solid #e74c3c", padding: mob ? "10px 8px" : "16px 24px", display: "flex", gap: mob ? 10 : 24, alignItems: mob ? "stretch" : "flex-start", flexWrap: "wrap", justifyContent: "center", flexDirection: mob ? "column" : "row" }}>

          {mob && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>🧢</span>
              <div style={{ flex: 1 }}>
                <div style={{ height: 6, background: "rgba(255,255,255,.1)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: Math.round(step / STORY.length * 100) + "%", background: "linear-gradient(90deg,#e74c3c,#f1c40f)", borderRadius: 3, transition: "width .5s" }} />
                </div>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", whiteSpace: "nowrap" }}>{step + "/" + STORY.length}</div>
            </div>
          )}

          {!mob && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 80 }}>
              <div style={{ fontSize: 40 }}>🧢</div>
              <div style={{ fontSize: 12, fontWeight: 800 }}>Dresseur</div>
              <div style={{ width: 80, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 3, overflow: "hidden", marginTop: 2 }}>
                <div style={{ height: "100%", width: Math.round(step / STORY.length * 100) + "%", background: "linear-gradient(90deg,#e74c3c,#f1c40f)", borderRadius: 3, transition: "width .5s" }} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>{step + "/" + STORY.length}</div>
            </div>
          )}

          {!mob && <div style={{ width: 2, height: 100, background: "rgba(255,255,255,.1)", borderRadius: 1, flexShrink: 0 }} />}

          {mob && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 4, color: "#f1c40f" }}>{"🏅 " + badges.length + "/8"}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
                  {GYMS.map(function (g, i) {
                    var has = badges.indexOf(g.bd) !== -1;
                    return (
                      <div key={i} style={{ borderRadius: 4, padding: "2px 1px", display: "flex", flexDirection: "column", alignItems: "center", fontSize: has ? 11 : 7, fontWeight: 700, background: has ? TC[g.tp] : "rgba(255,255,255,.05)", color: has ? "#fff" : "rgba(255,255,255,.2)", border: has ? "1px solid #f1c40f" : "1px solid rgba(255,255,255,.08)" }}>
                        {has ? "⭐" : "—"}
                        <div style={{ fontSize: 6, opacity: has ? 1 : 0.3 }}>{g.bd}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 4, color: "#2ecc71" }}>🎒</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                  {([["🧪", inv.p], ["💊", inv.sp], ["⭕", inv.b], ["💫", inv.r]] as [string, number][]).map(function (item, i) {
                    return (
                      <div key={i} style={{ background: "rgba(255,255,255,.06)", borderRadius: 5, padding: "3px 6px", textAlign: "center", display: "flex", alignItems: "center", gap: 3 }}>
                        <span style={{ fontSize: 12 }}>{item[0]}</span>
                        <span style={{ fontSize: 13, fontWeight: 800 }}>{item[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!mob && (
            <div style={{ minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: "#f1c40f", textAlign: "center" }}>{"🏅 Badges (" + badges.length + "/8)"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
                {GYMS.map(function (g, i) {
                  var has = badges.indexOf(g.bd) !== -1;
                  return (
                    <div key={i} title={g.nm} style={{ borderRadius: 6, padding: "4px 2px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: has ? 14 : 8, fontWeight: 700, background: has ? TC[g.tp] : "rgba(255,255,255,.05)", color: has ? "#fff" : "rgba(255,255,255,.2)", border: has ? "2px solid #f1c40f" : "1px solid rgba(255,255,255,.08)" }}>
                      {has ? "⭐" : "—"}
                      <div style={{ fontSize: 8, marginTop: 1, opacity: has ? 1 : 0.4 }}>{g.bd}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!mob && <div style={{ width: 2, height: 100, background: "rgba(255,255,255,.1)", borderRadius: 1, flexShrink: 0 }} />}

          <div style={{ flex: 1, minWidth: mob ? 0 : 200, width: mob ? "100%" : "auto" }}>
            <div style={{ fontSize: mob ? 11 : 13, fontWeight: 800, marginBottom: mob ? 4 : 6, color: "#3498db", textAlign: "center" }}>{"👥 Équipe (" + team.length + "/6)"}</div>
            <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3,1fr)" : "repeat(6,1fr)", gap: mob ? 4 : 6 }}>
              {[0, 1, 2, 3, 4, 5].map(function (i) {
                var p = team[i];
                if (!p) {
                  return <div key={"empty-" + i} style={{ height: mob ? 44 : 60, borderRadius: 6, background: "rgba(255,255,255,.03)", border: "1px dashed rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "rgba(255,255,255,.15)" }}>vide</div>;
                }
                return (
                  <div key={p.id + "-" + i} style={{ background: "rgba(255,255,255,.07)", borderRadius: 6, padding: mob ? "3px" : "4px", borderBottom: "3px solid " + (TC[p.t[0]] || "#888"), textAlign: "center" }}>
                    <div style={{ fontSize: mob ? 10 : 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.n}</div>
                    <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 1 }}>
                      {p.t.map(function (tp) { return <span key={tp} style={{ fontSize: mob ? 6 : 7, padding: "1px 3px", borderRadius: 3, background: TC[tp], color: "#fff", fontWeight: 600 }}>{tp}</span>; })}
                    </div>
                    <div style={{ fontSize: mob ? 8 : 9, color: "rgba(255,255,255,.4)", marginTop: 1 }}>{"BST " + (BST[p.id] || "?")}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {!mob && <div style={{ width: 2, height: 100, background: "rgba(255,255,255,.1)", borderRadius: 1, flexShrink: 0 }} />}

          {!mob && (
            <div style={{ minWidth: 140 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6, color: "#2ecc71", textAlign: "center" }}>🎒 Inventaire</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[{ icon: "🧪", val: inv.p, label: "Potions" }, { icon: "💊", val: inv.sp, label: "Super P." }, { icon: "⭕", val: inv.b, label: "Pokéballs" }, { icon: "💫", val: inv.r, label: "Rappels" }].map(function (item) {
                  return (
                    <div key={item.label} style={{ background: "rgba(255,255,255,.06)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                      <div style={{ fontSize: 20 }}>{item.icon}</div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{item.val}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)" }}>{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
