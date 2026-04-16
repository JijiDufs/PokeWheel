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
  [41,"Nosferapti",["Poison","Vol"],42],[42,"Nosferalto",["Poison","Vol"],169],[169,"Nostenfer",["Poison","Vol"],0],
  [74,"Racaillou",["Roche","Sol"],75],[75,"Gravalanch",["Roche","Sol"],76],[76,"Grolem",["Roche","Sol"],0],
  [447,"Riolu",["Combat"],448],[448,"Lucario",["Combat","Acier"],0],
  [443,"Griknot",["Dragon","Sol"],444],[444,"Carmache",["Dragon","Sol"],445],[445,"Carchacrok",["Dragon","Sol"],0]
];

const PM_GEN4: Record<number, Pokemon> = {};
PD_GEN4.forEach(a => { PM_GEN4[a[0]] = { id: a[0], n: a[1], t: a[2], e: a[3] || null, bstMod: 1 }; });
const LEGS_GEN4: [number, string, string[]][] = [[483,"Dialga",["Acier","Dragon"]],[484,"Palkia",["Eau","Dragon"]],[487,"Giratina",["Spectre","Dragon"]]];
LEGS_GEN4.forEach(a => { PM_GEN4[a[0]] = { id: a[0], n: a[1], t: a[2], e: null, bstMod: 1 }; });

const BST_GEN4: Record<number, number> = {
  387:318,388:405,389:525,390:309,391:405,392:534,393:314,394:405,395:530,
  396:245,397:340,398:485,399:250,400:410,401:194,402:384,403:263,404:363,405:523,
  41:245,42:455,169:535,74:300,75:390,76:495,447:285,448:525,443:300,444:410,445:600,
  483:680,484:680,487:680
};

const NBST_GEN4: Record<string, number> = { "Keunotor":250,"Étourmi":245,"Nosferapti":245,"Racaillou":300,"Lucario":525,"Carchacrok":600 };

const GYMS_GEN4: Gym[] = [
  { nm:"Pierrick",ct:"Charbourg",bd:"Charbon",tp:"Roche",spr:"roark",df:-0.10,tm:[{n:"Racaillou",t:["Roche","Sol"]}] },
  { nm:"Mélina",ct:"Voilaroc",bd:"Pavé",tp:"Combat",spr:"maylene",df:0,tm:[{n:"Lucario",t:["Combat","Acier"]}] }
];

const GAL = [
  { nm:"Hélio",spr:"cyrus",tm:[{n:"Nostenfer",t:["Poison","Vol"]},{n:"Carchacrok",t:["Dragon","Sol"]}] }
];

const E4_GEN4 = [
  { nm:"Aaron",tp:"Insecte",spr:"aaron",tm:[{n:"Drascore",t:["Poison","Ténèbres"]}] }
];

const CHAMP_GEN4 = { nm:"Cynthia",spr:"cynthia",tm:[{n:"Lucario",t:["Combat","Acier"]},{n:"Carchacrok",t:["Dragon","Sol"]}] };

const STORY_GEN4: StoryEvent[] = [
  {y:"m",x:"Tu te réveilles à Bonaugure.\nTon rival Barry t'attend !"},
  {y:"s"},{y:"r",s:0},
  {y:"m",x:"Le Professeur Sorbier te confie le Pokédex.\nL'aventure commence !"},
  {y:"R",p:1,x:"Route 202 — Vers Charbourg !"},{y:"g",i:0},
  {y:"m",x:"Badge Charbon obtenu !\nLa Team Galaxie rôde..."},
  {y:"G",i:0},
  {y:"m",x:"Lacs libérés ! Hélio est au Pilier Lance !"},{y:"S"},
  {y:"m",x:"🎉 8 Badges !\nLa Ligue Pokémon t'attend !"},{y:"r",s:3},
  {y:"R",p:3,x:"Route Victoire — Dernière ligne droite !"},
  {y:"4",i:0},
  {y:"C"},{y:"W"}
];

function getRivTmGen4(sid: number | null, st: number): FoePokemon[] {
  const ts = [[{n:"Étourmi",t:["Normal","Vol"]}], [{n:"Carchacrok",t:["Dragon","Sol"]}]];
  return ts[Math.min(st,1)];
}

export const gen4Data: GameData = {
  id: "gen4", name: "Sinnoh (Génération 4)", themeColor: "#E3350D",
  SE: SE_GEN4, PD: PD_GEN4, PM: PM_GEN4, BST: BST_GEN4, NBST: NBST_GEN4,
  LEGS: LEGS_GEN4, GYMS: GYMS_GEN4, EVIL_TEAM: GAL, E4: E4_GEN4, CHAMP: CHAMP_GEN4,
  STORY: STORY_GEN4, CATCH_IDS: [396,399,401,403,41,74,447,443], FISH_IDS: [393], BABY_IDS: [],
  getRivTm: getRivTmGen4
};
