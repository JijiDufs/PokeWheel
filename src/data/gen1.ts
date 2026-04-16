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
  [10,"Chenipan",["Insecte"],11],[11,"Chrysacier",["Insecte"],12],[12,"Papilusion",["Insecte","Vol"],0],
  [13,"Aspicot",["Insecte","Poison"],14],[14,"Coconfort",["Insecte","Poison"],15],[15,"Dardargnan",["Insecte","Poison"],0],
  [16,"Roucool",["Normal","Vol"],17],[17,"Roucoups",["Normal","Vol"],18],[18,"Roucarnage",["Normal","Vol"],0],
  [19,"Rattata",["Normal"],20],[20,"Rattatac",["Normal"],0],
  [21,"Piafabec",["Normal","Vol"],22],[22,"Rapasdepic",["Normal","Vol"],0],
  [23,"Abo",["Poison"],24],[24,"Arbok",["Poison"],0],
  [25,"Pikachu",["Électrik"],26],[26,"Raichu",["Électrik"],0],
  [27,"Sabelette",["Sol"],28],[28,"Sablaireau",["Sol"],0],
  [29,"Nidoran♀",["Poison"],30],[30,"Nidorina",["Poison"],31],[31,"Nidoqueen",["Poison","Sol"],0],
  [32,"Nidoran♂",["Poison"],33],[33,"Nidorino",["Poison"],34],[34,"Nidoking",["Poison","Sol"],0],
  [35,"Mélofée",["Normal"],36],[36,"Mélodelfe",["Normal"],0],
  [37,"Goupix",["Feu"],38],[38,"Feunard",["Feu"],0],
  [39,"Rondoudou",["Normal"],40],[40,"Grodoudou",["Normal"],0],
  [41,"Nosferapti",["Poison","Vol"],42],[42,"Nosferalto",["Poison","Vol"],0],
  [43,"Mystherbe",["Plante","Poison"],44],[44,"Ortide",["Plante","Poison"],45],[45,"Rafflesia",["Plante","Poison"],0],
  [46,"Paras",["Insecte","Plante"],47],[47,"Parasect",["Insecte","Plante"],0],
  [48,"Mimitoss",["Insecte","Poison"],49],[49,"Aéromite",["Insecte","Poison"],0],
  [50,"Taupiqueur",["Sol"],51],[51,"Triopikeur",["Sol"],0],
  [52,"Miaouss",["Normal"],53],[53,"Persian",["Normal"],0],
  [54,"Psykokwak",["Eau"],55],[55,"Akwakwak",["Eau"],0],
  [56,"Férosinge",["Combat"],57],[57,"Colossinge",["Combat"],0],
  [58,"Caninos",["Feu"],59],[59,"Arcanin",["Feu"],0],
  [60,"Ptitard",["Eau"],61],[61,"Têtarte",["Eau"],62],[62,"Tartard",["Eau","Combat"],0],
  [63,"Abra",["Psy"],64],[64,"Kadabra",["Psy"],65],[65,"Alakazam",["Psy"],0],
  [66,"Machoc",["Combat"],67],[67,"Machopeur",["Combat"],68],[68,"Mackogneur",["Combat"],0],
  [69,"Chétiflor",["Plante","Poison"],70],[70,"Boustiflor",["Plante","Poison"],71],[71,"Empiflor",["Plante","Poison"],0],
  [72,"Tentacool",["Eau","Poison"],73],[73,"Tentacruel",["Eau","Poison"],0],
  [74,"Racaillou",["Roche","Sol"],75],[75,"Gravalanch",["Roche","Sol"],76],[76,"Grolem",["Roche","Sol"],0],
  [77,"Ponyta",["Feu"],78],[78,"Galopa",["Feu"],0],
  [79,"Ramoloss",["Eau","Psy"],80],[80,"Flagadoss",["Eau","Psy"],0],
  [81,"Magnéti",["Électrik"],82],[82,"Magnéton",["Électrik"],0],
  [83,"Canarticho",["Normal","Vol"],0],
  [84,"Doduo",["Normal","Vol"],85],[85,"Dodrio",["Normal","Vol"],0],
  [86,"Otaria",["Eau"],87],[87,"Dewgong",["Eau","Glace"],0],
  [88,"Tadmorv",["Poison"],89],[89,"Grotadmorv",["Poison"],0],
  [90,"Kokiyas",["Eau"],91],[91,"Crustabri",["Eau","Glace"],0],
  [92,"Fantominus",["Spectre","Poison"],93],[93,"Spectrum",["Spectre","Poison"],94],[94,"Ectoplasma",["Spectre","Poison"],0],
  [95,"Onix",["Roche","Sol"],0],
  [96,"Soporifik",["Psy"],97],[97,"Hypnomade",["Psy"],0],
  [98,"Krabby",["Eau"],99],[99,"Krabboss",["Eau"],0],
  [100,"Voltorbe",["Électrik"],101],[101,"Électrode",["Électrik"],0],
  [102,"Noeunoeuf",["Plante","Psy"],103],[103,"Noadkoko",["Plante","Psy"],0],
  [104,"Osselait",["Sol"],105],[105,"Ossatueur",["Sol"],0],
  [106,"Kicklee",["Combat"],0],
  [107,"Tygnon",["Combat"],0],
  [108,"Excelangue",["Normal"],0],
  [109,"Smogo",["Poison"],110],[110,"Smogogo",["Poison"],0],
  [111,"Rhinocorne",["Sol","Roche"],112],[112,"Rhinoféros",["Sol","Roche"],0],
  [113,"Leveinard",["Normal"],0],
  [114,"Saquedeneu",["Plante"],0],
  [115,"Kangourex",["Normal"],0],
  [116,"Hypotrempe",["Eau"],117],[117,"Hypocéan",["Eau"],0],
  [118,"Poissirène",["Eau"],119],[119,"Poissoroy",["Eau"],0],
  [120,"Stari",["Eau"],121],[121,"Staross",["Eau","Psy"],0],
  [122,"M. Mime",["Psy"],0],
  [123,"Insécateur",["Insecte","Vol"],0],
  [124,"Lippoutou",["Glace","Psy"],0],
  [125,"Élektek",["Électrik"],0],
  [126,"Magmar",["Feu"],0],
  [127,"Scarabrute",["Insecte"],0],
  [128,"Tauros",["Normal"],0],
  [129,"Magicarpe",["Eau"],130],[130,"Léviator",["Eau","Vol"],0],
  [131,"Lokhlass",["Eau","Glace"],0],
  [132,"Métamorph",["Normal"],0],
  [133,"Évoli",["Normal"],0],
  [134,"Aquali",["Eau"],0],
  [135,"Voltali",["Électrik"],0],
  [136,"Pyroli",["Feu"],0],
  [137,"Porygon",["Normal"],0],
  [138,"Amonita",["Roche","Eau"],139],[139,"Amonistar",["Roche","Eau"],0],
  [140,"Kabuto",["Roche","Eau"],141],[141,"Kabutops",["Roche","Eau"],0],
  [142,"Ptéra",["Roche","Vol"],0],
  [143,"Ronflex",["Normal"],0],
  [147,"Minidraco",["Dragon"],148],[148,"Draco",["Dragon"],149],[149,"Dracolosse",["Dragon","Vol"],0]
];

const PM_GEN1: Record<number, Pokemon> = {};
PD_GEN1.forEach(a => { PM_GEN1[a[0]] = { id: a[0], n: a[1], t: a[2], e: a[3] || null, bstMod: 1 }; });

const LEGS_GEN1: [number, string, string[]][] = [[144,"Artikodin",["Glace","Vol"]],[145,"Électhor",["Électrik","Vol"]],[146,"Sulfura",["Feu","Vol"]],[150,"Mewtwo",["Psy"]],[151,"Mew",["Psy"]]];
LEGS_GEN1.forEach(a => { PM_GEN1[a[0]] = { id: a[0], n: a[1], t: a[2], e: null, bstMod: 1 }; });

const BST_GEN1: Record<number, number> = {
  1: 318, 2: 405, 3: 525, 4: 309, 5: 405, 6: 534, 7: 314, 8: 405, 9: 530,
  10: 195, 11: 205, 12: 395, 13: 195, 14: 205, 15: 395, 16: 251, 17: 349, 18: 479,
  19: 253, 20: 413, 21: 262, 22: 442, 23: 288, 24: 448, 25: 320, 26: 485,
  27: 300, 28: 450, 29: 275, 30: 365, 31: 505, 32: 273, 33: 365, 34: 505,
  35: 323, 36: 483, 37: 299, 38: 505, 39: 270, 40: 435, 41: 245, 42: 455,
  43: 320, 44: 395, 45: 490, 46: 285, 47: 405, 48: 305, 49: 450, 50: 265, 51: 425,
  52: 290, 53: 440, 54: 320, 55: 500, 56: 305, 57: 455, 58: 350, 59: 555,
  60: 300, 61: 385, 62: 510, 63: 310, 64: 400, 65: 500, 66: 305, 67: 405, 68: 505,
  69: 300, 70: 390, 71: 490, 72: 335, 73: 515, 74: 300, 75: 390, 76: 495,
  77: 410, 78: 500, 79: 315, 80: 490, 81: 325, 82: 465, 83: 377, 84: 310, 85: 470,
  86: 325, 87: 475, 88: 325, 89: 500, 90: 305, 91: 525, 92: 310, 93: 405, 94: 500,
  95: 385, 96: 328, 97: 483, 98: 325, 99: 475, 100: 330, 101: 490, 102: 325, 103: 530,
  104: 320, 105: 425, 106: 455, 107: 455, 108: 385, 109: 340, 110: 490, 111: 345, 112: 485,
  113: 450, 114: 435, 115: 490, 116: 295, 117: 440, 118: 320, 119: 450, 120: 340, 121: 520,
  122: 460, 123: 500, 124: 455, 125: 490, 126: 495, 127: 500, 128: 490, 129: 200, 130: 540,
  131: 535, 132: 288, 133: 325, 134: 525, 135: 525, 136: 525, 137: 395, 138: 355, 139: 495,
  140: 355, 141: 495, 142: 515, 143: 540, 144: 580, 145: 580, 146: 580, 147: 300, 148: 420,
  149: 600, 150: 680, 151: 600
};

// Utilisé pour la force des équipes adverses
const NBST_GEN1: Record<string, number> = {
  "Racaillou":300, "Onix":385, "Stari":340, "Staross":520, "Voltorbe":330, "Raichu":485,
  "Empiflor":490, "Rafflesia":490, "Smogo":340, "Grotadmorv":500, "Smogogo":490,
  "Kadabra":400, "Alakazam":500, "Caninos":350, "Arcanin":555, "Rhinocorne":345,
  "Nidoqueen":505, "Nidoking":505, "Rhinoféros":485, "Nosferapti":245, "Rattatac":413,
  "Abo":288, "Kangourex":490, "Crustabri":525, "Lokhlass":535, "Tygnon":455, "Mackogneur":505,
  "Nosferalto":455, "Ectoplasma":500, "Ptéra":515, "Dracolosse":600, "Roucarnage":479,
  "Léviator":540, "Florizarre":525, "Dracaufeu":534, "Tortank":530, "Roucoups":349
};

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
  STORY: STORY_GEN1, 
  // ID des Pokémon capturables dans les herbes
  CATCH_IDS: [10,13,16,19,21,23,25,27,29,32,35,37,39,41,43,46,48,50,52,56,58,63,66,69,74,77,81,83,84,88,92,96,100,102,104,108,109,111,113,114,115,122,123,124,125,126,127,128,132], 
  // ID des Pokémon pêchables
  FISH_IDS: [7,54,60,72,79,86,90,98,116,118,120,129,131,147], 
  BABY_IDS: [],
  getRivTm: getRivTmGen1
};
