import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";

/* ═══════════════ TYPE CHART ═══════════════ */
const SE: Record<string, Record<string, number>> = {
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

interface Pokemon { id: number; n: string; t: string[]; e: number | null; bstMod?: number; }
interface FoePokemon { n: string; t: string[]; }

/* ═══════════════ POKEMON DATA ═══════════════ */
const PD: [number, string, string[], number][] = [
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

const PM: Record<number, Pokemon> = {};
PD.forEach(function (a) { PM[a[0]] = { id: a[0], n: a[1], t: a[2], e: a[3] || null, bstMod: 1 }; });
const LEGS: [number, string, string[]][] = [[483,"Dialga",["Acier","Dragon"]],[484,"Palkia",["Eau","Dragon"]],[487,"Giratina",["Spectre","Dragon"]],[480,"Créhelf",["Psy"]],[481,"Créfollet",["Psy"]],[482,"Créfadet",["Psy"]],[485,"Heatran",["Feu","Acier"]],[488,"Cresselia",["Psy"]]];
LEGS.forEach(function (a) { PM[a[0]] = { id: a[0], n: a[1], t: a[2], e: null, bstMod: 1 }; });
function gp(id: number): Pokemon { return PM[id]; }

const BST: Record<number, number> = {
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

const NBST: Record<string, number> = {
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

function getEffBst(p: Pokemon): number { return Math.round((BST[p.id] || 300) * (p.bstMod || 1)); }

function calcWin(team: Pokemon[], foes: FoePokemon[], diff: number): number {
  if (!team.length) return 0.15;
  let typeScore = 0;
  team.forEach(p => {
    foes.forEach(o => {
      p.t.forEach(a => {
        let m = 1;
        o.t.forEach(d => { if (SE[a] && SE[a][d] !== undefined) m *= SE[a][d]; });
        if (m >= 2) typeScore += 12; else if (m > 1) typeScore += 6; else if (m < 1 && m > 0) typeScore -= 5; else if (m === 0) typeScore -= 8;
      });
    });
  });
  let teamBST = 0; team.forEach(p => { teamBST += getEffBst(p); }); teamBST /= team.length;
  let foeBST = 0; foes.forEach(o => { foeBST += (NBST[o.n] || 400); }); foeBST /= foes.length;
  return Math.max(0.10, Math.min(0.92, 0.50 + typeScore / 100 + (teamBST - foeBST) / 1000 + (team.length - foes.length) * 0.04 - (diff || 0)));
}

const CATCH_IDS = PD.map(p => p[0]).filter(id => [387,388,389,390,391,392,393,394,395].indexOf(id) === -1);
const FISH_IDS = PD.filter(p => p[2].indexOf("Eau") !== -1).map(p => p[0]);
const BABY_IDS = [172, 175, 433, 438, 440, 446, 447, 406];

/* ═══════════════ TRAINERS ═══════════════ */
interface Gym { nm: string; ct: string; bd: string; tp: string; spr: string; df: number; tm: FoePokemon[]; }
const GYMS: Gym[] = [
  { nm:"Pierrick",ct:"Charbourg",bd:"Charbon",tp:"Roche",spr:"roark",df:-0.10,tm:[{n:"Racaillou",t:["Roche","Sol"]},{n:"Onix",t:["Roche","Sol"]},{n:"Kranidos",t:["Roche"]}] },
  { nm:"Flo",ct:"Vestigion",bd:"Forêt",tp:"Plante",spr:"gardenia",df:-0.05,tm:[{n:"Ceribou",t:["Plante"]},{n:"Rosélia",t:["Plante","Poison"]},{n:"Roserade",t:["Plante","Poison"]}] },
  { nm:"Mélina",ct:"Voilaroc",bd:"Pavé",tp:"Combat",spr:"maylene",df:0,tm:[{n:"Méditikka",t:["Combat","Psy"]},{n:"Machopeur",t:["Combat"]},{n:"Lucario",t:["Combat","Acier"]}] },
  { nm:"Lovis",ct:"Verchamps",bd:"Marais",tp:"Eau",spr:"crasherwake",df:0,tm:[{n:"Mustéflott",t:["Eau"]},{n:"Akwakwak",t:["Eau"]},{n:"Léviator",t:["Eau","Vol"]}] },
  { nm:"Kiméra",ct:"Unionpolis",bd:"Relique",tp:"Spectre",spr:"fantina",df:0.03,tm:[{n:"Baudrive",t:["Spectre","Vol"]},{n:"Magirêve",t:["Spectre"]},{n:"Ectoplasma",t:["Spectre","Poison"]}] },
  { nm:"Charles",ct:"Joliberges",bd:"Mine",tp:"Acier",spr:"byron",df:0.05,tm:[{n:"Archéodong",t:["Acier","Psy"]},{n:"Steelix",t:["Acier","Sol"]},{n:"Bastiodon",t:["Roche","Acier"]}] },
  { nm:"Gladys",ct:"Frimapic",bd:"Glaçon",tp:"Glace",spr:"candice",df:0.08,tm:[{n:"Farfuret",t:["Ténèbres","Glace"]},{n:"Blizzi",t:["Plante","Glace"]},{n:"Charmina",t:["Combat","Psy"]},{n:"Blizzaroi",t:["Plante","Glace"]}] },
  { nm:"Tanguy",ct:"Rivamar",bd:"Phare",tp:"Électrik",spr:"volkner",df:0.10,tm:[{n:"Raichu",t:["Électrik"]},{n:"Luxray",t:["Électrik"]},{n:"Élekable",t:["Électrik"]}] }
];
const GAL = [
  { nm:"Mars",spr:"mars",tm:[{n:"Nosferapti",t:["Poison","Vol"]},{n:"Chaffreux",t:["Normal"]}] },
  { nm:"Jupiter",spr:"jupiter",tm:[{n:"Nosferalto",t:["Poison","Vol"]},{n:"Moufflair",t:["Poison","Ténèbres"]}] },
  { nm:"Saturne",spr:"saturn",tm:[{n:"Nosferalto",t:["Poison","Vol"]},{n:"Coatox",t:["Poison","Combat"]}] },
  { nm:"Hélio",spr:"cyrus",tm:[{n:"Nostenfer",t:["Poison","Vol"]},{n:"Dimoret",t:["Ténèbres","Glace"]},{n:"Corboss",t:["Ténèbres","Vol"]},{n:"Carchacrok",t:["Dragon","Sol"]}] }
];
const E4 = [
  { nm:"Aaron",tp:"Insecte",spr:"aaron",tm:[{n:"Yanméga",t:["Insecte","Vol"]},{n:"Drascore",t:["Poison","Ténèbres"]},{n:"Apireine",t:["Insecte","Vol"]}] },
  { nm:"Bertha",tp:"Sol",spr:"bertha",tm:[{n:"Rhinoféros",t:["Sol","Roche"]},{n:"Hippodocus",t:["Sol"]},{n:"Tritosor",t:["Eau","Sol"]}] },
  { nm:"Adrien",tp:"Feu",spr:"flint",tm:[{n:"Simiabraz",t:["Feu","Combat"]},{n:"Galopa",t:["Feu"]},{n:"Maganon",t:["Feu"]}] },
  { nm:"Lucio",tp:"Psy",spr:"lucian",tm:[{n:"Alakazam",t:["Psy"]},{n:"Gardevoir",t:["Psy","Fée"]},{n:"Gallame",t:["Psy","Combat"]}] }
];
const CYN = { nm:"Cynthia",spr:"cynthia",tm:[{n:"Spiritomb",t:["Spectre","Ténèbres"]},{n:"Roserade",t:["Plante","Poison"]},{n:"Togekiss",t:["Fée","Vol"]},{n:"Lucario",t:["Combat","Acier"]},{n:"Milobellus",t:["Eau"]},{n:"Carchacrok",t:["Dragon","Sol"]}] };

function rivTm(sid: number | null, st: number): FoePokemon[] {
  const rid = ({387:393,390:387,393:390} as Record<number,number>)[sid ?? 393] || 393;
  const s1 = gp(rid), s2 = s1?.e ? gp(s1.e) : s1, s3 = s2?.e ? gp(s2.e) : s2;
  const ts = [[s1,gp(396)],[s2,gp(397),gp(77)],[s2,gp(398),gp(78),gp(404)],[s3,gp(398),gp(78),gp(405),gp(448)]];
  return (ts[Math.min(st,3)]||ts[0]).filter(Boolean).map(p => ({n:p.n,t:p.t}));
}

/* ═══════════════ STORY ═══════════════ */
interface StoryEvent { y: string; x?: string; s?: number; p?: number; i?: number; }
const STORY: StoryEvent[] = [
  {y:"m",x:"Jules, tu te réveilles à Bonaugure.\nTon rival Barry t'attend !"},
  {y:"m",x:"Des Pokémon sauvages attaquent !\nChoisis dans la mallette..."},
  {y:"s"},{y:"r",s:0},
  {y:"m",x:"Le Professeur Sorbier te confie le Pokédex.\nL'aventure commence !"},
  {y:"R",p:1,x:"Route 202 — Vers Charbourg !"},{y:"g",i:0},
  {y:"m",x:"Badge Charbon obtenu !\nLa Team Galaxie rôde..."},
  {y:"R",p:1,x:"Route 205 — Vers Vestigion !"},{y:"g",i:1},{y:"r",s:1},
  {y:"R",p:2,x:"Route 206 — Vers Voilaroc !"},{y:"g",i:2},
  {y:"m",x:"La Team Galaxie vole des Pokémon !"},{y:"G",i:2},
  {y:"R",p:2,x:"Route 212 — Vers Verchamps !"},{y:"g",i:3},
  {y:"R",p:2,x:"Route 209 — Vers Unionpolis !"},{y:"g",i:4},{y:"r",s:2},
  {y:"R",p:2,x:"Route 218 — Vers Joliberges !"},{y:"g",i:5},
  {y:"m",x:"💥 EXPLOSION au Lac Courage !\nLa Team Galaxie attaque !"},
  {y:"G",i:2},{y:"G",i:0},
  {y:"R",p:3,x:"Route 216 — Tempête vers Frimapic !"},{y:"g",i:6},
  {y:"m",x:"Barry a perdu contre Jupiter...\nDirection le QG Galaxie !"},
  {y:"G",i:1},{y:"G",i:3},
  {y:"m",x:"Lacs libérés ! Hélio est au Pilier Lance !"},{y:"S"},
  {y:"R",p:3,x:"Route 222 — Arène à Rivamar !"},{y:"g",i:7},
  {y:"m",x:"🎉 8 Badges !\nLa Ligue Pokémon t'attend !"},{y:"r",s:3},
  {y:"R",p:3,x:"Route Victoire — Dernière ligne droite !"},
  {y:"4",i:0},{y:"4",i:1},{y:"4",i:2},{y:"4",i:3},
  {y:"C"},{y:"W"}
];

/* ═══════════════ COLORS & ASSETS ═══════════════ */
const TC: Record<string,string> = {Normal:"#A8A878",Feu:"#F08030",Eau:"#6890F0",Plante:"#78C850","Électrik":"#F8D030",Glace:"#98D8D8",Combat:"#C03028",Poison:"#A040A0",Sol:"#E0C068",Vol:"#A890F0",Psy:"#F85888",Insecte:"#A8B820",Roche:"#B8A038",Spectre:"#705898",Dragon:"#7038F8","Ténèbres":"#705848",Acier:"#B8B8D0","Fée":"#EE99AC"};
const WCOLS = ["#e74c3c","#e67e22","#f1c40f","#27ae60","#1abc9c","#3498db","#9b59b6","#e91e63","#00bcd4","#8bc34a","#ff9800","#607d8b"];
const FALLBACK_IMG = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

/* ═══════════════ WHEEL (Refactored) ═══════════════ */
interface WheelItem { n?: string; label?: string; id?: number; t?: string[]; e?: number | null; val?: boolean; k?: string; a?: string; bstMod?: number; }
interface WheelProps { items: WheelItem[]; winIdx: number; onDone: (item: WheelItem) => void; label?: string; colFn?: (item: WheelItem, i: number) => string; sizes?: number[] | null; sz?: number; onStateChange?: (spinning: boolean, done: boolean) => void; }
export interface WheelRef { spin: () => void; }

const Wheel = forwardRef<WheelRef, WheelProps>(({ items, winIdx, onDone, label, colFn, sizes, sz = 360, onStateChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);

  function getArcs() {
    const n = items.length; let totalSz = 0; const szArr: number[] = [];
    for (let i = 0; i < n; i++) { const s = sizes?.[i] ?? 1; szArr.push(s); totalSz += s; }
    const arcs: { start: number; size: number }[] = []; let cum = 0;
    for (let j = 0; j < n; j++) { const a = (szArr[j] / totalSz) * 2 * Math.PI; arcs.push({ start: cum, size: a }); cum += a; }
    return arcs;
  }

  const draw = useCallback((angle: number) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.width, H = c.height, cx = W/2, cy = H/2, R = Math.min(cx,cy) - 10;
    ctx.clearRect(0,0,W,H);
    const n = items.length; const arcs = getArcs();
    for (let i = 0; i < n; i++) {
      const a0 = angle + arcs[i].start, a1 = a0 + arcs[i].size;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,R,a0,a1); ctx.closePath();
      ctx.fillStyle = colFn ? colFn(items[i],i) : WCOLS[i % WCOLS.length]; ctx.fill();
      ctx.strokeStyle = "#333"; ctx.lineWidth = 3; ctx.stroke();
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(a0 + arcs[i].size/2);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#000"; ctx.shadowBlur = 4;
      const fs = Math.max(12, Math.min(18, Math.floor(320/n)));
      ctx.font = `bold ${fs}px 'Courier New', Courier, monospace`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      const lb = items[i].n || items[i].label || ""; const ml = n > 12 ? 12 : 20;
      ctx.fillText(lb.length > ml ? lb.slice(0,ml-1)+"…" : lb, R-18, 0); ctx.restore();
    }
    // Flèche et centre style Pokéball
    ctx.beginPath(); ctx.moveTo(cx+R+10,cy); ctx.lineTo(cx+R-14,cy-16); ctx.lineTo(cx+R-14,cy+16); ctx.closePath();
    ctx.fillStyle="#f8f8f8"; ctx.fill(); ctx.strokeStyle="#333"; ctx.lineWidth=3; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,18,0,2*Math.PI); ctx.fillStyle="#f8f8f8"; ctx.fill(); ctx.strokeStyle="#333"; ctx.lineWidth=4; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,8,0,2*Math.PI); ctx.fillStyle="#e53935"; ctx.fill();
  }, [items, colFn, sizes, sz]);

  useEffect(() => { draw(angRef.current); }, [draw]);

  const spin = () => {
    if (spinning || done) return;
    setSpinning(true); onStateChange?.(true, false);
    const arcs = getArcs(); const seg = arcs[winIdx];
    const margin = seg.size * 0.15; const randomOffset = margin + Math.random() * (seg.size - 2 * margin);
    const targetAngle = seg.start + randomOffset;
    const target = -targetAngle + Math.PI * 2 * (5 + Math.floor(Math.random() * 3));
    const startAngle = angRef.current; const totalRot = target - startAngle;
    const duration = 2800 + Math.random() * 600; const t0 = performance.now();
    function animate(now: number) {
      const p = Math.min((now - t0) / duration, 1); const ease = 1 - Math.pow(1 - p, 4);
      const cur = startAngle + totalRot * ease; angRef.current = cur; draw(cur);
      if (p < 1) { animRef.current = requestAnimationFrame(animate); }
      else { setSpinning(false); setDone(true); onStateChange?.(false, true); }
    }
    animRef.current = requestAnimationFrame(animate);
  };

  useImperativeHandle(ref, () => ({ spin }));
  useEffect(() => { return () => { if (animRef.current) cancelAnimationFrame(animRef.current); }; }, []);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,width:"100%", height:"100%", maxHeight:"100%", justifyContent:"center"}}>
      {label && <div style={{fontSize:16,fontWeight:800,color:"#333",textAlign:"center",background:"#fff",border:"2px solid #333",padding:"4px 14px",borderRadius:12}}>{label}</div>}
      <canvas 
        ref={canvasRef} width={sz} height={sz} onClick={spin} 
        style={{maxWidth:"100%", maxHeight:"100%", objectFit:"contain", cursor: (!spinning && !done) ? "pointer" : "default"}} 
      />
    </div>
  );
});

/* ═══════════════ STYLES & UI ═══════════════ */
const panelStyle: React.CSSProperties = {
  background: "#f8f8f8", border: "4px solid #505050", borderRadius: 8,
  boxShadow: "inset 0 0 0 2px #e0e0e0, 0 4px 6px rgba(0,0,0,0.1)",
  color: "#333", fontFamily: "'Courier New', Courier, monospace", fontWeight: "bold"
};

function btnStyle(c1: string, c2: string): React.CSSProperties {
  return {padding:"10px 24px",fontSize:15,fontFamily:"'Courier New', Courier, monospace",fontWeight:"bold",cursor:"pointer",background:`linear-gradient(180deg,${c1},${c2})`,color:"#fff",border:"2px solid #333",borderRadius:6,boxShadow:"0 2px 0 rgba(0,0,0,.2)",whiteSpace:"nowrap", display:"flex", alignItems:"center", justifyContent:"center", minWidth: 120};
}

/* ═══════════════ HELPERS ═══════════════ */
function sampleArr(arr: number[], n: number): number[] {
  const s: Record<number,boolean> = {}; const r: number[] = [];
  while (r.length < Math.min(n, arr.length)) { const v = arr[Math.floor(Math.random()*arr.length)]; if (!s[v]) { s[v]=true; r.push(v); } }
  return r;
}
function sprUrl(id: number) { return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`; }
// Nouvelle source pour les dresseurs (Pokémon Showdown a une db robuste pour la Gen 4)
function trainerSpr(name: string) { return `https://play.pokemonshowdown.com/sprites/trainers/${name}.png`; }
function weightedIdx(items: {w:number}[]) {
  let tw = 0; for (let i=0;i<items.length;i++) tw += items[i].w||1;
  let r = Math.random()*tw;
  for (let j=0;j<items.length;j++) { r -= items[j].w||1; if (r<=0) return j; }
  return 0;
}

/* ═══════════════ ROUTE OPTIONS ═══════════════ */
interface RouteOpt { label: string; w: number; a: string; }
const ROPTS: RouteOpt[] = [ {label:"Capturer un Pokémon",w:30,a:"catch"},{label:"Aller pêcher",w:12,a:"fish"}, {label:"Combat de dresseur",w:18,a:"trainer"},{label:"Aller au shop",w:15,a:"shop"}, {label:"Événement spécial",w:10,a:"special"},{label:"Rien, on avance",w:10,a:"nothing"}, {label:"Rencontre mystérieuse",w:5,a:"mystery"} ];
const SPECIAL_EVENTS = [ {label:"Fossile trouvé !",a:"fo"},{label:"Œuf mystérieux",a:"eg"},{label:"Légendaire rare !",a:"lg"}, {label:"Objet rare",a:"it"},{label:"Échange PNJ",a:"tr"},{label:"Dresseur secret",a:"sc"} ];
interface CombatCtx { nm:string; foes:FoePokemon[]; d:number; ctx:string; gi?:number; spr?:string; }
interface SwapData { poke:Pokemon; afterMsg:string; afterFn:()=>void; }
interface WheelCfg { items:WheelItem[]; winIdx:number; label:string; colFn:(item:WheelItem,i:number)=>string; onDone:(item:WheelItem)=>void; sizes:number[]|null; }
interface InvState { p:number; sp:number; b:number; r:number; }

/* ═══════════════ MAIN APP ═══════════════ */
export default function App() {
  const [team, setTeam] = useState<Pokemon[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [inv, setInv] = useState<InvState>({p:1,sp:0,b:0,r:0});
  const [sid, setSid] = useState<number|null>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("proc");
  const [wCfg, setWCfg] = useState<WheelCfg|null>(null);
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
  const mob = ww < 850;

  function reset() {
    setTeam([]); setBadges([]); setInv({p:1,sp:0,b:0,r:0}); setSid(null); setStep(0); setPhase("proc");
    setWCfg(null); setWheelState({ spinning: false, done: false }); setMsg(""); setRSpins(0);
    setCCtx(null); setWheelKey(0); setSwapData(null); setRetriesLeft(0); setMenuOpen(false);
  }
  function makePoke(pk: Pokemon): Pokemon { return { id:pk.id, n:pk.n, t:pk.t, e:pk.e, bstMod: pk.bstMod || 1 }; }
  function addPoke(pk: Pokemon) { setTeam(prev => [...prev, makePoke(pk)]); }
  function capturePoke(pk: Pokemon, afterMsg: string, afterFn: () => void) {
    if (team.length < 6) { addPoke(pk); setMsg(afterMsg); afterFn(); }
    else { setSwapData({ poke: makePoke(pk), afterMsg, afterFn }); setMsg(pk.n + " veut te rejoindre !\nL'équipe est pleine."); setPhase("swap"); }
  }
  function boostTeamBst() { setTeam(t => t.map(p => ({ ...p, bstMod: (p.bstMod || 1) * 1.03 }))); }
  function nextStep() { setStep(s => s+1); setPhase("proc"); }
  
  function showWheel(items: WheelItem[], winIdx: number, label: string, colFn: (item:WheelItem,i:number)=>string, onDone: (item:WheelItem)=>void, sizes?: number[]|null) {
    setWCfg({items, winIdx, label, colFn, onDone, sizes: sizes||null});
    setWheelState({ spinning: false, done: false }); setWheelKey(k => k+1); setPhase("wheel");
  }

  // Process step
  useEffect(() => {
    if (phase !== "proc") return;
    const ev = STORY[step]; if (!ev) return;
    if (ev.y === "m") { setMsg(ev.x!); setPhase("msg"); }
    else if (ev.y === "s") {
      setMsg("La mallette s'ouvre...");
      const starters = [gp(387),gp(390),gp(393)];
      showWheel(starters, Math.floor(Math.random()*3), "🔥 Starter ?", it => TC[it.t![0]], res => { setSid(res.id!); addPoke(res as Pokemon); setMsg(res.n+" te choisit !"); setPhase("msg"); });
    }
    else if (ev.y === "r") {
      const rt = rivTm(sid, ev.s!); setMsg("⚔️ Barry te défie !");
      setCCtx({nm:"Barry (Rival)",foes:rt,d:[-0.10,-0.05,0,0.05][Math.min(ev.s!,3)]||0,ctx:"rival",spr:"barry"}); setPhase("cpre");
    }
    else if (ev.y === "g") { const g = GYMS[ev.i!]; setMsg("🏟️ "+g.nm+" ("+g.ct+")"); setCCtx({nm:g.nm,foes:g.tm,d:g.df,ctx:"gym",gi:ev.i!,spr:g.spr}); setPhase("cpre"); }
    else if (ev.y === "G") { const c = GAL[ev.i!]; setMsg("👾 Cmd. "+c.nm); setCCtx({nm:"Cmd. "+c.nm,foes:c.tm,d:0,ctx:"gal",spr:c.spr}); setPhase("cpre"); }
    else if (ev.y === "R") { setMsg(ev.x!); setRSpins(ev.p!); setPhase("route"); }
    else if (ev.y === "S") { setMsg("⛰️ Pilier Lance !"); setCCtx({nm:"Hélio",foes:GAL[3].tm,d:0.10,ctx:"spear",spr:"cyrus"}); setPhase("cpre"); }
    else if (ev.y === "4") { const e = E4[ev.i!]; setMsg("🏛️ "+e.nm); setCCtx({nm:e.nm,foes:e.tm,d:0.10,ctx:"e4",spr:e.spr}); setPhase("cpre"); }
    else if (ev.y === "C") { setMsg("👑 Cynthia !"); setCCtx({nm:"Cynthia",foes:CYN.tm,d:0.15,ctx:"champ",spr:CYN.spr}); setPhase("cpre"); }
    else if (ev.y === "W") { setMsg("🏆 FÉLICITATIONS !\nTu es le nouveau Maître ! 🏆"); setPhase("win"); }
  }, [phase, step]);

  function doCombat() {
    if (!cCtx) return; const chance = calcWin(team, cCtx.foes, cCtx.d); const pct = Math.round(chance*100);
    setMsg("⚔️ Combat contre "+cCtx.nm+" !\n"+cCtx.foes.map(f=>f.n).join(", "));
    showWheel([{label:"Victoire ! ("+pct+"%)",val:true},{label:"Défaite... ("+(100-pct)+"%)",val:false}], Math.random()<chance?0:1, "Combat", it=>it.val?"#2ecc71":"#e74c3c", res=>{ if (res.val) handleWin(); else handleLoss(); }, [pct, 100-pct]);
  }

  function handleWin() {
    const isRt = cCtx?.ctx === "rt";
    let wMsg = "🎉 Victoire !";
    if (cCtx?.ctx === "gym") { const gym = GYMS[cCtx.gi!]; setBadges(b => [...b, gym.bd]); wMsg = "🎉 Badge "+gym.bd+" obtenu ! (BST +)"; boostTeamBst(); }
    else if (cCtx?.ctx === "spear") { setMsg("🎉 Hélio vaincu !"); setCCtx(null); setPhase("sleg"); return; }
    
    if (isRt) {
      const rw = [{k:"p",l:"Potion"},{k:"p",l:"Potion"},{k:"sp",l:"Super Potion"},{k:"r",l:"Rappel"}][Math.floor(Math.random()*4)];
      setInv(v => { const nv = {...v}; nv[rw.k as keyof InvState]++; return nv; }); wMsg += "\n🎁 "+rw.l+" obtenue !";
    }
    setCCtx(null);
    const evos = team.filter(p => p.e); if (!evos.length) { setMsg(wMsg); if (isRt) finRoute(); else setPhase("msg"); return; }
    const evoR = badges.length <= 2 ? 0.40 : badges.length <= 5 ? 0.50 : 0.60; const pct = Math.round(evoR*100);
    showWheel([{label:"Évolution ("+pct+"%)",val:true},{label:"Rien",val:false}], Math.random()<evoR?0:1, "🧬 Évolution ?", it=>it.val?"#f39c12":"#7f8c8d", res => {
      if (!res.val) { setMsg(wMsg); if (isRt) finRoute(); else setPhase("msg"); return; }
      showWheel(evos.map(p => ({label:p.n,id:p.id,e:p.e,n:p.n,t:p.t,bstMod:p.bstMod})), Math.floor(Math.random()*evos.length), "Qui évolue ?", it => TC[it.t![0]]||"#888", res2 => {
        const evo = gp(res2.e as number); if (evo) { setTeam(t => t.map(p => p.id===res2.id ? {...evo, bstMod: p.bstMod||1} : p)); setMsg(wMsg+"\n🌟 "+(res2.n||"")+" évolue en "+evo.n+" !"); }
        if (isRt) finRoute(); else setPhase("msg");
      });
    }, [pct, 100-pct]);
  }

  function handleLoss() {
    if (retriesLeft > 0) { setRetriesLeft(r => r-1); setMsg("💀 Encore une tentative !"); setPhase("retry"); }
    else if (inv.sp > 0) { setInv(v => ({...v,sp:v.sp-1})); setRetriesLeft(1); setMsg("💀 Super Potion utilisée ! (2 essais)"); setPhase("retry"); }
    else if (inv.p > 0) { setInv(v => ({...v,p:v.p-1})); setMsg("💀 Potion utilisée !"); setPhase("retry"); }
    else if (inv.r > 0) {
      setInv(v => ({...v,r:v.r-1})); setMsg("💀 Rappel utilisé !\nTu fuis le combat.");
      if (cCtx?.ctx==="gym") { const gym=GYMS[cCtx.gi!]; setBadges(b=>[...b,gym.bd]); boostTeamBst(); }
      const isRt = cCtx?.ctx==="rt"; setCCtx(null); if (isRt) finRoute(); else setPhase("msg");
    } else { setMsg("💀 Défaite totale..."); setPhase("go"); }
  }

  function finRoute() { setRSpins(s => { if (s-1<=0) { setTimeout(nextStep,400); return 0; } setPhase("route"); return s-1; }); }

  function doRoute() {
    const opts = badges.length >= 8 ? [{label:"Combat",w:25,a:"trainer"},{label:"Shop",w:25,a:"shop"},{label:"Événement",w:20,a:"special"},{label:"Rien",w:30,a:"nothing"}] : ROPTS;
    showWheel(opts, weightedIdx(opts), badges.length>=8?"🏛️ Victoire":"🎯 Action ?", it => ({catch:"#e74c3c",fish:"#3498db",trainer:"#e67e22",shop:"#2ecc71",special:"#9b59b6",nothing:"#7f8c8d",mystery:"#f1c40f"} as Record<string,string>)[it.a||""]||"#888", res => {
      const a=res.a;
      if (a==="catch") { const pool = sampleArr(CATCH_IDS,10).map(gp).filter(Boolean); showWheel(pool, Math.floor(Math.random()*pool.length), "🎯 Capture !", it=>TC[it.t![0]]||"#888", res2=>capturePoke(res2 as Pokemon, "✨ "+res2.n+" capturé !", finRoute)); }
      else if (a==="fish") { const pool = sampleArr(FISH_IDS,8).map(gp).filter(Boolean); showWheel(pool, Math.floor(Math.random()*pool.length), "🎣 Pêche !", ()=>"#3498db", res2=>capturePoke(res2 as Pokemon, "🎣 "+res2.n+" pêché !", finRoute)); }
      else if (a==="trainer") {
        const rt: FoePokemon[] = []; for (let i=0;i<Math.floor(Math.random()*2)+1;i++) { const rp=gp(CATCH_IDS[Math.floor(Math.random()*CATCH_IDS.length)]); if(rp)rt.push({n:rp.n,t:rp.t}); }
        if(!rt.length) rt.push({n:"Keunotor",t:["Normal"]}); setCCtx({nm:"Dresseur",foes:rt,d:-0.05,ctx:"rt",spr:"acetrainer-gen4"}); setMsg("Un Dresseur te défie !"); setPhase("cpre");
      }
      else if (a==="shop") {
        // CORRECTION SHOP ICI (label)
        const its = badges.length>=8 ? [{label:"Potion",k:"p"},{label:"Super Potion",k:"sp"},{label:"Rappel",k:"r"}] : [{label:"Potion",k:"p"},{label:"Super Potion",k:"sp"},{label:"Pokéball",k:"b"},{label:"Rappel",k:"r"}];
        showWheel(its, Math.floor(Math.random()*its.length), "🛒 Shop !", (_,i) => ["#e74c3c","#e67e22","#3498db","#f1c40f"][i], res2 => { setInv(v=>{const nv={...v}; nv[res2.k as keyof InvState]++; return nv;}); setMsg("🎁 "+res2.label+" obtenue !"); finRoute(); });
      }
      else if (a==="special") {
        const evts = badges.length>=8 ? [{label:"Objet",a:"it"},{label:"Dresseur secret",a:"sc"},{label:"Œuf",a:"eg"}] : SPECIAL_EVENTS;
        showWheel(evts, Math.floor(Math.random()*evts.length), "⭐ Événement !", (_,i) => ["#f1c40f","#e91e63","#9b59b6","#00bcd4","#ff5722","#4caf50"][i], res2 => {
          const sa=res2.a;
          if (sa==="fo") { const f=gp(Math.random()>0.5?408:410); if(f) capturePoke(f,"🦴 Fossile "+f.n+" !",finRoute); else finRoute(); }
          else if (sa==="eg") { const b=gp(BABY_IDS[Math.floor(Math.random()*BABY_IDS.length)]); if(b) capturePoke(b,"🥚 Œuf "+b.n+" !",finRoute); else finRoute(); }
          else if (sa==="lg") { const ml=LEGS.filter(l=>[483,484,487].indexOf(l[0])===-1); const l=ml[Math.floor(Math.random()*ml.length)]; const p=gp(l[0]); if(p&&Math.random()<0.35) capturePoke(p,"🌟 "+p.n+" !",finRoute); else { setMsg("S'enfuit..."); finRoute(); } }
          else if (sa==="it") { setInv(v=>({...v,sp:v.sp+2})); setMsg("🎁 2 Super Potions !"); finRoute(); }
          else if (sa==="tr") { if(team.length>0){const ri=Math.floor(Math.random()*team.length);const np=gp(CATCH_IDS[Math.floor(Math.random()*CATCH_IDS.length)]);if(np){setTeam(t=>{const c=[...t];c[ri]=makePoke(np);return c;});setMsg("🔄 Échange mystère :\n"+np.n+" reçu !");}} finRoute(); }
          else if (sa==="sc") { setCCtx({nm:"Mystère",foes:[{n:"Carchacrok",t:["Dragon","Sol"]},{n:"Lucario",t:["Combat","Acier"]}],d:0.05,ctx:"rt",spr:"acetrainer-gen4dp"}); setMsg("Dresseur d'élite !"); setPhase("cpre"); }
        });
      }
      else if (a==="mystery") { const rares = PD.filter(p => p[2].some(t => ["Dragon","Spectre","Acier"].includes(t))); const pk = gp(rares[Math.floor(Math.random()*rares.length)][0]); if (pk) capturePoke(pk, "✨ "+pk.n+" !", finRoute); else finRoute(); }
      else { setMsg("Rien à signaler..."); finRoute(); }
    });
  }

  function doLeg() {
    const legs = [gp(483),gp(484)].filter(Boolean);
    showWheel(legs, Math.floor(Math.random()*legs.length), "🌟 Légendaire ?", it => it.id===483?"#4a90d9":"#d94a8c", res => {
      setMsg(res.n+" apparaît ! (40% capture)");
      showWheel([{label:"Capturé !",val:true},{label:"Enfui...",val:false}], Math.random()<0.4?0:1, "Capture", it=>it.val?"#f1c40f":"#e74c3c", c => {
        if(c.val) capturePoke(res as Pokemon,"🌟 "+res.n+" capturé !",()=>setPhase("msg")); else {setMsg("Il s'enfuit...");setPhase("msg");}
      }, [40,60]);
    });
  }

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div style={{height:"100dvh",backgroundColor:"#e0e0e0",backgroundImage:"radial-gradient(#c0c0c0 1px, transparent 1px)",backgroundSize:"20px 20px",fontFamily:"'Courier New', Courier, monospace",color:"#333",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      
      {/* HEADER THEME */}
      <div style={{background:"#e53935",borderBottom:"4px solid #b71c1c",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,zIndex:10,color:"#fff",boxShadow:"0 2px 10px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22,textShadow:"1px 1px 0 #b71c1c"}}>⚡</span>
          <div>
            <div style={{fontSize:18,fontWeight:900,textShadow:"1px 1px 0 #b71c1c"}}>POKÉMON</div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,color:"#ffcdd2"}}>RANDOMIZER</div>
          </div>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{padding:"4px 8px",fontSize:18,cursor:"pointer",background:"#c62828",color:"#fff",border:"2px solid #b71c1c",borderRadius:6,fontWeight:"bold"}}>☰</button>
        {menuOpen && (
          <div style={{...panelStyle, position:"absolute",right:16,top:56,zIndex:20,padding:12}}>
            <button onClick={() => { reset(); setMenuOpen(false); }} style={btnStyle("#e53935","#b71c1c")}>🔄 Reset Partie</button>
          </div>
        )}
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{position:"fixed",inset:0,zIndex:9}} />}

      {/* ZONE CENTRALE */}
      <div style={{flex:1,display:"flex",flexDirection:mob?"column":"row",overflow:"hidden",padding:mob?4:12,gap:mob?4:12}}>
        
        {/* PANNEAU GAUCHE (Desktop) / TOP (Mobile) */}
        <div style={{...panelStyle, width: mob ? "100%" : 240, flexShrink: 0, padding: mob ? "6px 10px" : "16px", display:"flex", flexDirection: "column", gap: mob ? 6 : 20, zIndex: 5, overflowY: mob?"visible":"auto"}}>
          
          {mob ? (
            // Mobile: 1 Ligne compacte Info + 1 scroll horizontal équipe
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12}}>
                <div style={{color:"#f39c12"}}>🏅 {badges.length}/8</div>
                <div style={{color:"#27ae60"}}>🧪{inv.p} 💊{inv.sp} ⭕{inv.b} 💫{inv.r}</div>
                <div style={{color:"#333"}}>📍 {step}/{STORY.length}</div>
              </div>
              <div style={{display:"flex",overflowX:"auto",gap:8,paddingBottom:4}}>
                {[0,1,2,3,4,5].map(i => team[i] ? (
                  <div key={i} style={{flexShrink:0,border:`2px solid ${TC[team[i].t[0]]||"#ccc"}`,borderRadius:8,background:"#fff",padding:4,display:"flex",alignItems:"center",gap:6,minWidth:120}}>
                    <img src={sprUrl(team[i].id)} alt="" style={{width:36,height:36,imageRendering:"pixelated"}} onError={(e)=>{(e.target as HTMLImageElement).src=FALLBACK_IMG}} />
                    <div style={{overflow:"hidden"}}>
                      <div style={{fontSize:11,fontWeight:"bold",whiteSpace:"nowrap"}}>{team[i].n}</div>
                      <div style={{fontSize:9,color:"#666"}}>BST {getEffBst(team[i])}</div>
                    </div>
                  </div>
                ) : <div key={i} style={{flexShrink:0,width:120,height:48,border:"2px dashed #ccc",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#aaa"}}>Vide</div>)}
              </div>
            </>
          ) : (
            // Desktop: Vertical stats
            <>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:14,color:"#333",marginBottom:4}}>Progression ({step}/{STORY.length})</div>
                <div style={{width:"100%",height:8,background:"#ddd",borderRadius:4,border:"1px solid #aaa"}}><div style={{height:"100%",width:`${(step/STORY.length)*100}%`,background:"#e53935",borderRadius:3}}/></div>
              </div>
              <div>
                <div style={{fontSize:14,marginBottom:8,color:"#f39c12",textAlign:"center"}}>🏅 Badges ({badges.length}/8)</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>
                  {GYMS.map((g,i) => <div key={i} style={{borderRadius:4,padding:"4px 0",textAlign:"center",fontSize:11,background:badges.includes(g.bd)?TC[g.tp]:"#eee",color:badges.includes(g.bd)?"#fff":"#aaa",border:"1px solid #ccc"}}>{badges.includes(g.bd)?"⭐":"—"}</div>)}
                </div>
              </div>
              <div>
                <div style={{fontSize:14,marginBottom:8,color:"#27ae60",textAlign:"center"}}>🎒 Inventaire</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {[{i:"🧪",v:inv.p,l:"Pots"},{i:"💊",v:inv.sp,l:"Super"},{i:"⭕",v:inv.b,l:"Balls"},{i:"💫",v:inv.r,l:"Rappels"}].map((it,i) => (
                    <div key={i} style={{background:"#eee",border:"1px solid #ccc",borderRadius:6,padding:"6px",textAlign:"center",display:"flex",flexDirection:"column",gap:2}}>
                      <span style={{fontSize:14}}>{it.i} {it.v}</span><span style={{fontSize:10,color:"#666"}}>{it.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* PANNEAU CENTRAL (Jeu & Roue) */}
        <div style={{...panelStyle, flex:1, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden", padding: mob?8:16}}>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            
            {/* Combat Sprites */}
            {phase !== "wheel" && phase !== "swap" && phase !== "win" && (
              <div style={{display:"flex",alignItems:"flex-end",gap:mob?20:60,justifyContent:"center"}}>
                <img src={trainerSpr("lucas")} style={{width:mob?100:140,transform:"scaleX(-1)",imageRendering:"pixelated"}} alt="Jules" onError={(e)=>{(e.target as HTMLImageElement).src=FALLBACK_IMG}} />
                {cCtx?.spr && <img src={trainerSpr(cCtx.spr)} style={{width:mob?100:140,imageRendering:"pixelated"}} alt={cCtx.nm} onError={(e)=>{(e.target as HTMLImageElement).src=FALLBACK_IMG}} />}
              </div>
            )}

            {/* Roue Responsive (Zéro Scroll garanti) */}
            {phase === "wheel" && wCfg && (
              <div style={{height:"100%", width:"100%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                 <Wheel ref={wheelRef} key={wheelKey} items={wCfg.items} winIdx={wCfg.winIdx} onDone={wCfg.onDone} label={wCfg.label} colFn={wCfg.colFn} sizes={wCfg.sizes} sz={mob?260:380} onStateChange={(s,d) => setWheelState({spinning:s, done:d})} />
              </div>
            )}

            {/* Swap */}
            {phase === "swap" && swapData && (
              <div style={{textAlign:"center",width:"100%",maxWidth:400}}>
                <div style={{fontSize:16,marginBottom:12}}>Remplacer par <strong style={{color:TC[swapData.poke.t[0]]}}>{swapData.poke.n}</strong> ?</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:12}}>
                  {team.map((p,i) => (
                    <button key={i} onClick={() => {
                      const removed = team[i]; setTeam(t=>{const c=[...t];c[i]=swapData.poke;return c;});
                      setMsg("Remplacement effectué :\n"+swapData.poke.n+" rejoint l'équipe !"); setSwapData(null); swapData.afterFn();
                    }} style={{padding:6,background:"#fff",border:`2px solid ${TC[p.t[0]]||"#888"}`,borderRadius:6,cursor:"pointer"}}>
                      <img src={sprUrl(p.id)} alt="" style={{width:40,height:40}} onError={(e)=>{(e.target as HTMLImageElement).src=FALLBACK_IMG}}/>
                      <div style={{fontSize:11,fontWeight:"bold"}}>{p.n}</div>
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <button onClick={() => { setMsg("Tu as refusé "+swapData.poke.n+"."); setSwapData(null); swapData.afterFn(); }} style={btnStyle("#95a5a6","#7f8c8d")}>❌ Garder l'équipe</button>
                </div>
              </div>
            )}

            {/* Win */}
            {phase === "win" && (
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:mob?60:80}}>🏆</div>
                <div style={{fontSize:mob?22:30,color:"#f39c12"}}>MAÎTRE POKÉMON !</div>
              </div>
            )}
          </div>
        </div>

        {/* PANNEAU DROIT (Desktop: Équipe) */}
        {!mob && (
          <div style={{...panelStyle, width: 260, flexShrink: 0, padding: 16, display:"flex", flexDirection: "column", zIndex: 5}}>
            <div style={{fontSize:14,marginBottom:12,color:"#3498db",textAlign:"center"}}>👥 Équipe ({team.length}/6)</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,flex:1,overflowY:"auto"}}>
              {[0,1,2,3,4,5].map(i => team[i] ? (
                <div key={i} style={{background:"#fff",border:`2px solid ${TC[team[i].t[0]]||"#ccc"}`,borderRadius:8,padding:"6px",display:"flex",alignItems:"center",gap:10}}>
                  <img src={sprUrl(team[i].id)} style={{width:48,height:48,imageRendering:"pixelated"}} alt="" onError={(e)=>{(e.target as HTMLImageElement).src=FALLBACK_IMG}}/>
                  <div style={{overflow:"hidden"}}>
                    <div style={{fontSize:14,whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{team[i].n}</div>
                    <div style={{fontSize:11,color:"#666"}}>BST {getEffBst(team[i])}</div>
                  </div>
                </div>
              ) : <div key={i} style={{height:64,background:"#eee",border:"2px dashed #ccc",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#aaa"}}>Vide</div>)}
            </div>
          </div>
        )}
      </div>

      {/* PANNEAU DU BAS : Actions & Boîte de Dialogue (Fixe & Centré) */}
      <div style={{padding:mob?"8px 8px calc(8px + env(safe-area-inset-bottom))":"16px",background:"#fff",borderTop:"4px solid #505050",display:"flex",flexDirection:"column",gap:10,flexShrink:0,zIndex:10,boxShadow:"0 -4px 10px rgba(0,0,0,0.05)"}}>
        
        {/* BOUTONS (Centrés sur Desktop) */}
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",minHeight:42,alignItems:"center"}}>
          
          {phase === "wheel" && (
            <button 
              onClick={() => {
                if (!wheelState.spinning && !wheelState.done) wheelRef.current?.spin();
                else if (wheelState.done && wCfg) { setMsg(msg); wCfg.onDone(wCfg.items[wCfg.winIdx]); }
              }} 
              disabled={wheelState.spinning}
              style={{...btnStyle(wheelState.done ? "#3498db" : "#e53935", wheelState.done ? "#2980b9" : "#b71c1c"), opacity: wheelState.spinning ? 0.5 : 1}}
            >
              {wheelState.spinning ? "🎰 Rotation..." : wheelState.done ? "▶️ Continuer" : "🎰 Tourner la roue"}
            </button>
          )}

          {phase === "msg" && <button onClick={nextStep} style={btnStyle("#3498db","#2980b9")}>▶️ Continuer</button>}
          
          {phase === "cpre" && cCtx && (
            <>
              <div style={{fontSize:14,padding:"8px 16px",background:"#f8f8f8",border:"2px solid #ccc",borderRadius:6,display:"flex",alignItems:"center"}}>
                Victoire : <strong style={{color:"#e53935",marginLeft:6}}>{Math.round(calcWin(team,cCtx.foes,cCtx.d)*100)}%</strong>
              </div>
              <button onClick={doCombat} style={btnStyle("#e53935","#b71c1c")}>⚔️ Combattre</button>
            </>
          )}
          
          {phase === "retry" && <button onClick={doCombat} style={btnStyle("#f39c12","#d35400")}>🔄 Retenter</button>}
          
          {phase === "go" && (
            <>
              <button onClick={() => { const isRt = cCtx?.ctx==="rt"; setCCtx(null); if(isRt) finRoute(); else setPhase("msg"); }} style={btnStyle("#27ae60","#2ecc71")}>Continuer quand même</button>
              <button onClick={reset} style={btnStyle("#e53935","#b71c1c")}>Recommencer</button>
            </>
          )}
          
          {phase === "route" && (
            <>
              <div style={{fontSize:14,padding:"8px 16px",background:"#f8f8f8",border:"2px solid #ccc",borderRadius:6,display:"flex",alignItems:"center"}}>
                Tours : <strong style={{marginLeft:6}}>{rSpins}</strong>
              </div>
              <button onClick={doRoute} style={btnStyle("#3498db","#2980b9")}>🎯 Avancer</button>
            </>
          )}
          
          {phase === "sleg" && <button onClick={doLeg} style={btnStyle("#f1c40f","#f39c12")}>🌟 Approcher</button>}
          {phase === "win" && <button onClick={reset} style={btnStyle("#f1c40f","#f39c12")}>🔄 Rejouer</button>}
        </div>

        {/* POKEBOX DE DIALOGUE (Fixe) */}
        <div style={{background:"#fff",border:"4px solid #505050",borderRadius:8,padding:"10px 14px",minHeight:mob?64:80,display:"flex",alignItems:"center",boxShadow:"inset 0 0 0 2px #e0e0e0"}}>
          <div style={{fontSize:mob?14:16,whiteSpace:"pre-line",lineHeight:1.5,width:"100%"}}>
            {msg || "\u00A0"}
          </div>
        </div>
      </div>
    </div>
  );
}
