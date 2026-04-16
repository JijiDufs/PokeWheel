import { GameData, Pokemon, FoePokemon, StoryEvent, Gym } from "../types";

const SE_GEN4: Record<string, Record<string, number>> = {
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

const PD_GEN4: [number, string, string[], number][] = [
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

const PM_GEN4: Record<number, Pokemon> = {};
PD_GEN4.forEach(a => { PM_GEN4[a[0]] = { id: a[0], n: a[1], t: a[2], e: a[3] || null, bstMod: 1 }; });
const LEGS_GEN4: [number, string, string[]][] = [[483,"Dialga",["Acier","Dragon"]],[484,"Palkia",["Eau","Dragon"]],[487,"Giratina",["Spectre","Dragon"]],[480,"Créhelf",["Psy"]],[481,"Créfollet",["Psy"]],[482,"Créfadet",["Psy"]],[485,"Heatran",["Feu","Acier"]],[488,"Cresselia",["Psy"]]];
LEGS_GEN4.forEach(a => { PM_GEN4[a[0]] = { id: a[0], n: a[1], t: a[2], e: null, bstMod: 1 }; });

const BST_GEN4: Record<number, number> = {
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

const NBST_GEN4: Record<string, number> = {
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

const GYMS_GEN4: Gym[] = [
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

const E4_GEN4 = [
  { nm:"Aaron",tp:"Insecte",spr:"aaron",tm:[{n:"Yanméga",t:["Insecte","Vol"]},{n:"Drascore",t:["Poison","Ténèbres"]},{n:"Apireine",t:["Insecte","Vol"]}] },
  { nm:"Bertha",tp:"Sol",spr:"bertha",tm:[{n:"Rhinoféros",t:["Sol","Roche"]},{n:"Hippodocus",t:["Sol"]},{n:"Tritosor",t:["Eau","Sol"]}] },
  { nm:"Adrien",tp:"Feu",spr:"flint",tm:[{n:"Simiabraz",t:["Feu","Combat"]},{n:"Galopa",t:["Feu"]},{n:"Maganon",t:["Feu"]}] },
  { nm:"Lucio",tp:"Psy",spr:"lucian",tm:[{n:"Alakazam",t:["Psy"]},{n:"Gardevoir",t:["Psy","Fée"]},{n:"Gallame",t:["Psy","Combat"]}] }
];

const CHAMP_GEN4 = { nm:"Cynthia",spr:"cynthia",tm:[{n:"Spiritomb",t:["Spectre","Ténèbres"]},{n:"Roserade",t:["Plante","Poison"]},{n:"Togekiss",t:["Fée","Vol"]},{n:"Lucario",t:["Combat","Acier"]},{n:"Milobellus",t:["Eau"]},{n:"Carchacrok",t:["Dragon","Sol"]}] };

const STORY_GEN4: StoryEvent[] = [
  {y:"m",x:"Tu te réveilles à Bonaugure.\nTon rival t'attend !"},
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
  {y:"m",x:"Ton rival a perdu contre Jupiter...\nDirection le QG Galaxie !"},
  {y:"G",i:1},{y:"G",i:3},
  {y:"m",x:"Lacs libérés ! Hélio est au Pilier Lance !"},{y:"S"},
  {y:"R",p:3,x:"Route 222 — Arène à Rivamar !"},{y:"g",i:7},
  {y:"m",x:"🎉 8 Badges !\nLa Ligue Pokémon t'attend !"},{y:"r",s:3},
  {y:"R",p:3,x:"Route Victoire — Dernière ligne droite !"},
  {y:"4",i:0},{y:"4",i:1},{y:"4",i:2},{y:"4",i:3},
  {y:"C"},{y:"W"}
];

function getRivTmGen4(sid: number | null, st: number): FoePokemon[] {
  const rid = ({387:393,390:387,393:390} as Record<number,number>)[sid ?? 393] || 393;
  const s1 = PM_GEN4[rid], s2 = s1?.e ? PM_GEN4[s1.e] : s1, s3 = s2?.e ? PM_GEN4[s2.e] : s2;
  const ts = [[s1,PM_GEN4[396]],[s2,PM_GEN4[397],PM_GEN4[77]],[s2,PM_GEN4[398],PM_GEN4[78],PM_GEN4[404]],[s3,PM_GEN4[398],PM_GEN4[78],PM_GEN4[405],PM_GEN4[448]]];
  return (ts[Math.min(st,3)]||ts[0]).filter(Boolean).map(p => ({n:p.n,t:p.t}));
}

export const gen4Data: GameData = {
  id: "gen4", name: "Sinnoh (Génération 4)", themeColor: "#E3350D",
  SE: SE_GEN4, PD: PD_GEN4, PM: PM_GEN4, BST: BST_GEN4, NBST: NBST_GEN4,
  LEGS: LEGS_GEN4, GYMS: GYMS_GEN4, EVIL_TEAM: GAL, E4: E4_GEN4, CHAMP: CHAMP_GEN4,
  STORY: STORY_GEN4, 
  CATCH_IDS: PD_GEN4.map(p => p[0]).filter(id => [387,388,389,390,391,392,393,394,395].indexOf(id) === -1), 
  FISH_IDS: PD_GEN4.filter(p => p[2].indexOf("Eau") !== -1).map(p => p[0]), 
  BABY_IDS: [172, 175, 433, 438, 440, 446, 447, 406],
  getRivTm: getRivTmGen4
};
