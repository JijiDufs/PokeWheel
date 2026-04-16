import { GameData, Pokemon, FoePokemon, StoryEvent, Gym } from "../types";

const SE_GEN1: Record<string, Record<string, number>> = {
  Normal: { Roche: 0.5, Spectre: 0 },
  Feu: { Feu: 0.5, Eau: 0.5, Plante: 2, Glace: 2, Insecte: 2, Roche: 0.5, Dragon: 0.5 },
  Eau: { Feu: 2, Eau: 0.5, Plante: 0.5, Sol: 2, Roche: 2, Dragon: 0.5 },
  Plante: { Feu: 0.5, Eau: 2, Plante: 0.5, Poison: 0.5, Sol: 2, Vol: 0.5, Insecte: 0.5, Roche: 2, Dragon: 0.5 },
  "Électrik": { Eau: 2, Plante: 0.5, "Électrik": 0.5, Sol: 0, Vol: 2, Dragon: 0.5 },
  Glace: { Eau: 0.5, Plante: 2, Glace: 0.5, Sol: 2, Vol: 2, Dragon: 2 },
  Combat: { Normal: 2, Glace: 2, Poison: 0.5, Vol: 0.5, Psy: 0.5, Insecte: 0.5, Roche: 2, Spectre: 0 },
  Poison: { Plante: 2, Poison: 0.5, Sol: 0.5, Roche: 0.5, Insecte: 2, Spectre: 0.5 },
  Sol: { Feu: 2, Plante: 0.5, "Électrik": 2, Poison: 2, Vol: 0, Insecte: 0.5, Roche: 2 },
  Vol: { Plante: 2, "Électrik": 0.5, Combat: 2, Insecte: 2, Roche: 0.5 },
  Psy: { Combat: 2, Poison: 2, Psy: 0.5 },
  Insecte: { Feu: 0.5, Plante: 2, Combat: 0.5, Poison: 2, Vol: 0.5, Psy: 2, Spectre: 0.5 },
  Roche: { Feu: 2, Glace: 2, Combat: 0.5, Sol: 0.5, Vol: 2, Insecte: 2 },
  Spectre: { Normal: 0, Psy: 0, Spectre: 2 },
  Dragon: { Dragon: 2 }
};

const PD_GEN1: [number, string, string[], number][] = [
  [1,"Bulbizarre",["Plante","Poison"],2],[2,"Herbizarre",["Plante","Poison"],3],[3,"Florizarre",["Plante","Poison"],0],
  [4,"Salamèche",["Feu"],5],[5,"Reptincel",["Feu"],6],[6,"Dracaufeu",["Feu","Vol"],0],
  [7,"Carapuce",["Eau"],8],[8,"Carabaffe",["Eau"],9],[9,"Tortank",["Eau"],0],
  [16,"Roucool",["Normal","Vol"],17],[17,"Roucoups",["Normal","Vol"],18],[18,"Roucarnage",["Normal","Vol"],0],
  [19,"Rattata",["Normal"],20],[20,"Rattatac",["Normal"],0],
  [25,"Pikachu",["Électrik"],26],[26,"Raichu",["Électrik"],0],
  [41,"Nosferapti",["Poison","Vol"],42],[42,"Nosferalto",["Poison","Vol"],0], // Pas de Nostenfer
  [63,"Abra",["Psy"],64],[64,"Kadabra",["Psy"],65],[65,"Alakazam",["Psy"],0],
  [66,"Machoc",["Combat"],67],[67,"Machopeur",["Combat"],68],[68,"Mackogneur",["Combat"],0],
  [74,"Racaillou",["Roche","Sol"],75],[75,"Gravalanch",["Roche","Sol"],76],[76,"Grolem",["Roche","Sol"],0],
  [81,"Magnéti",["Électrik"],82],[82,"Magnéton",["Électrik"],0], // Pas Acier en Gen 1
  [92,"Fantominus",["Spectre","Poison"],93],[93,"Spectrum",["Spectre","Poison"],94],[94,"Ectoplasma",["Spectre","Poison"],0],
  [129,"Magicarpe",["Eau"],130],[130,"Léviator",["Eau","Vol"],0],
  [133,"Évoli",["Normal"],0],
  [143,"Ronflex",["Normal"],0],
  [147,"Minidraco",["Dragon"],148],[148,"Draco",["Dragon"],149],[149,"Dracolosse",["Dragon","Vol"],0]
];

const PM_GEN1: Record<number, Pokemon> = {};
PD_GEN1.forEach(a => { PM_GEN1[a[0]] = { id: a[0], n: a[1], t: a[2], e: a[3] || null, bstMod: 1 }; });
const LEGS_GEN1: [number, string, string[]][] = [[144,"Artikodin",["Glace","Vol"]],[145,"Électhor",["Électrik","Vol"]],[146,"Sulfura",["Feu","Vol"]],[150,"Mewtwo",["Psy"]],[151,"Mew",["Psy"]]];
LEGS_GEN1.forEach(a => { PM_GEN1[a[0]] = { id: a[0], n: a[1], t: a[2], e: null, bstMod: 1 }; });

const BST_GEN1: Record<number, number> = {
  1:318,2:405,3:525,4:309,5:405,6:534,7:314,8:405,9:530,
  16:251,17:349,18:479,19:253,20:413,25:320,26:485,41:245,42:455,
  63:310,64:400,65:500,66:305,67:405,68:505,74:300,75:390,76:495,
  81:325,82:465,92:310,93:405,94:500,129:200,130:540,133:325,
  143:540,147:300,148:420,149:600,144:580,145:580,146:580,150:680,151:600
};

const NBST_GEN1: Record<string, number> = { "Bulbizarre":318,"Salamèche":309,"Carapuce":314,"Rattata":253,"Roucool":251,"Nosferapti":245,"Racaillou":300,"Abra":310,"Machoc":305,"Fantominus":310 };

const GYMS_GEN1: Gym[] = [
  { nm:"Pierre",ct:"Argenta",bd:"Roche",tp:"Roche",spr:"brock",df:-0.10,tm:[{n:"Racaillou",t:["Roche","Sol"]},{n:"Onix",t:["Roche","Sol"]}] },
  { nm:"Ondine",ct:"Azuria",bd:"Cascade",tp:"Eau",spr:"misty",df:-0.05,tm:[{n:"Stari",t:["Eau"]},{n:"Staross",t:["Eau","Psy"]}] },
  { nm:"Major Bob",ct:"Carmin s/Mer",bd:"Foudre",tp:"Électrik",spr:"ltsurge",df:0,tm:[{n:"Voltorbe",t:["Électrik"]},{n:"Raichu",t:["Électrik"]}] },
  { nm:"Erika",ct:"Céladopole",bd:"Prisme",tp:"Plante",spr:"erika",df:0,tm:[{n:"Empiflor",t:["Plante","Poison"]},{n:"Rafflesia",t:["Plante","Poison"]}] },
  { nm:"Koga",ct:"Parmanie",bd:"Âme",tp:"Poison",spr:"koga",df:0.03,tm:[{n:"Smogo",t:["Poison"]},{n:"Grotadmorv",t:["Poison"]},{n:"Smogogo",t:["Poison"]}] },
  { nm:"Morgane",ct:"Safrania",bd:"Marais",tp:"Psy",spr:"sabrina",df:0.05,tm:[{n:"Kadabra",t:["Psy"]},{n:"Alakazam",t:["Psy"]}] },
  { nm:"Auguste",ct:"Cramois'Île",bd:"Volcan",tp:"Feu",spr:"blaine",df:0.08,tm:[{n:"Caninos",t:["Feu"]},{n:"Arcanin",t:["Feu"]}] },
  { nm:"Giovanni",ct:"Jadielle",bd:"Terre",tp:"Sol",spr:"giovanni",df:0.10,tm:[{n:"Rhinocorne",t:["Sol","Roche"]},{n:"Nidoqueen",t:["Poison","Sol"]},{n:"Nidoking",t:["Poison","Sol"]},{n:"Rhinoféros",t:["Sol","Roche"]}] }
];

const ROCKET = [
  { nm:"Sbire",spr:"rocketgrunt",tm:[{n:"Nosferapti",t:["Poison","Vol"]},{n:"Rattatac",t:["Normal"]}] },
  { nm:"Jessie & James",spr:"jessie",tm:[{n:"Abo",t:["Poison"]},{n:"Smogo",t:["Poison"]}] },
  { nm:"Giovanni",spr:"giovanni",tm:[{n:"Kangourex",t:["Normal"]},{n:"Nidoqueen",t:["Poison","Sol"]},{n:"Rhinoféros",t:["Sol","Roche"]}] }
];

const E4_GEN1 = [
  { nm:"Olga",tp:"Glace",spr:"lorelei",tm:[{n:"Crustabri",t:["Eau","Glace"]},{n:"Lokhlass",t:["Eau","Glace"]}] },
  { nm:"Aldo",tp:"Combat",spr:"bruno",tm:[{n:"Tygnon",t:["Combat"]},{n:"Mackogneur",t:["Combat"]}] },
  { nm:"Agatha",tp:"Spectre",spr:"agatha",tm:[{n:"Nosferalto",t:["Poison","Vol"]},{n:"Ectoplasma",t:["Spectre","Poison"]}] },
  { nm:"Peter",tp:"Dragon",spr:"lance",tm:[{n:"Ptéra",t:["Roche","Vol"]},{n:"Dracolosse",t:["Dragon","Vol"]}] }
];

const CHAMP_GEN1 = { nm:"Blue",spr:"blue",tm:[{n:"Roucarnage",t:["Normal","Vol"]},{n:"Alakazam",t:["Psy"]},{n:"Rhinoféros",t:["Sol","Roche"]},{n:"Léviator",t:["Eau","Vol"]},{n:"Arcanin",t:["Feu"]},{n:"Florizarre",t:["Plante","Poison"]}] };

const STORY_GEN1: StoryEvent[] = [
  {y:"m",x:"Tu te réveilles à Bourg Palette.\nTon rival Blue t'attend !"},
  {y:"s"},{y:"r",s:0},
  {y:"m",x:"Le Professeur Chen te confie le Pokédex.\nC'est parti !"},
  {y:"R",p:1,x:"Route 2 — Vers Argenta !"},{y:"g",i:0},
  {y:"m",x:"La Team Rocket bloque le Mont Sélénite !"},{y:"G",i:0},
  {y:"R",p:1,x:"Route 24 — Le Pont Pépite !"},{y:"r",s:1},{y:"g",i:1},
  {y:"R",p:2,x:"Route 6 — Vers Carmin sur Mer"},{y:"g",i:2},
  {y:"R",p:2,x:"Grotte Sombre — Vers Lavanville"},
  {y:"m",x:"Un fantôme bloque la Tour Pokémon..."},{y:"g",i:3},
  {y:"G",i:1},{y:"m",x:"Tu obtiens le Scope Sylphe !"},
  {y:"R",p:2,x:"Piste Cyclable — Vers Parmanie"},{y:"g",i:4},
  {y:"G",i:2},{y:"r",s:2},{y:"g",i:5},
  {y:"R",p:3,x:"Chenal 20 — Vers Cramois'Île"},{y:"g",i:6},
  {y:"m",x:"L'arène de Jadielle est ouverte !"},{y:"g",i:7},
  {y:"R",p:3,x:"Route Victoire — Dernière ligne droite !"},{y:"r",s:3},
  {y:"4",i:0},{y:"4",i:1},{y:"4",i:2},{y:"4",i:3},
  {y:"C"},{y:"W"}
];

function getRivTmGen1(sid: number | null, st: number): FoePokemon[] {
  const ts = [
    [{n:"Salamèche",t:["Feu"]}],
    [{n:"Reptincel",t:["Feu"]},{n:"Roucoups",t:["Normal","Vol"]},{n:"Rattatac",t:["Normal"]}],
    [{n:"Dracaufeu",t:["Feu","Vol"]},{n:"Roucarnage",t:["Normal","Vol"]},{n:"Kadabra",t:["Psy"]}],
    [{n:"Dracaufeu",t:["Feu","Vol"]},{n:"Roucarnage",t:["Normal","Vol"]},{n:"Alakazam",t:["Psy"]},{n:"Rhinoféros",t:["Sol","Roche"]}]
  ];
  return ts[Math.min(st,3)];
}

export const gen1Data: GameData = {
  id: "gen1", name: "Kanto (Génération 1)", themeColor: "#3498DB",
  SE: SE_GEN1, PD: PD_GEN1, PM: PM_GEN1, BST: BST_GEN1, NBST: NBST_GEN1,
  LEGS: LEGS_GEN1, GYMS: GYMS_GEN1, EVIL_TEAM: ROCKET, E4: E4_GEN1, CHAMP: CHAMP_GEN1,
  STORY: STORY_GEN1, CATCH_IDS: [16,19,25,41,63,66,74,81,92,133,147], FISH_IDS: [7,129,147], BABY_IDS: [],
  getRivTm: getRivTmGen1
};
