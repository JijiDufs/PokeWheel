import { GameData, Pokemon, FoePokemon, StoryEvent, Gym } from "../types";

const SE_GEN2: Record<string, Record<string, number>> = {
  Normal: { Roche: 0.5, Acier: 0.5, Spectre: 0 },
  Feu: { Feu: 0.5, Eau: 0.5, Plante: 2, Glace: 2, Insecte: 2, Roche: 0.5, Dragon: 0.5, Acier: 2 },
  Eau: { Feu: 2, Eau: 0.5, Plante: 0.5, Sol: 2, Roche: 2, Dragon: 0.5 },
  Plante: { Feu: 0.5, Eau: 2, Plante: 0.5, Poison: 0.5, Sol: 2, Vol: 0.5, Insecte: 0.5, Roche: 2, Dragon: 0.5, Acier: 0.5 },
  "Électrik": { Eau: 2, Plante: 0.5, "Électrik": 0.5, Sol: 0, Vol: 2, Dragon: 0.5 },
  Glace: { Feu: 0.5, Eau: 0.5, Plante: 2, Glace: 0.5, Sol: 2, Vol: 2, Dragon: 2, Acier: 0.5 },
  Combat: { Normal: 2, Glace: 2, Poison: 0.5, Vol: 0.5, Psy: 0.5, Insecte: 0.5, Roche: 2, Spectre: 0, "Ténèbres": 2, Acier: 2 },
  Poison: { Plante: 2, Poison: 0.5, Sol: 0.5, Roche: 0.5, Spectre: 0.5, Acier: 0 },
  Sol: { Feu: 2, Plante: 0.5, "Électrik": 2, Poison: 2, Vol: 0, Insecte: 0.5, Roche: 2, Acier: 2 },
  Vol: { Plante: 2, "Électrik": 0.5, Combat: 2, Insecte: 2, Roche: 0.5, Acier: 0.5 },
  Psy: { Combat: 2, Poison: 2, Psy: 0.5, "Ténèbres": 0, Acier: 0.5 },
  Insecte: { Feu: 0.5, Plante: 2, Combat: 0.5, Poison: 0.5, Vol: 0.5, Psy: 2, Spectre: 0.5, "Ténèbres": 2, Acier: 0.5 },
  Roche: { Feu: 2, Glace: 2, Combat: 0.5, Sol: 0.5, Vol: 2, Insecte: 2, Acier: 0.5 },
  Spectre: { Normal: 0, Psy: 2, Spectre: 2, "Ténèbres": 0.5 },
  Dragon: { Dragon: 2, Acier: 0.5 },
  "Ténèbres": { Combat: 0.5, Psy: 2, Spectre: 2, "Ténèbres": 0.5 },
  Acier: { Feu: 0.5, Eau: 0.5, "Électrik": 0.5, Glace: 2, Roche: 2, Acier: 0.5 }
};

const PD_GEN2: [number, string, string[], number][] = [
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
  [41,"Nosferapti",["Poison","Vol"],42],[42,"Nosferalto",["Poison","Vol"],169],
  [43,"Mystherbe",["Plante","Poison"],44],[44,"Ortide",["Plante","Poison"],45],[45,"Rafflesia",["Plante","Poison"],182],
  [46,"Paras",["Insecte","Plante"],47],[47,"Parasect",["Insecte","Plante"],0],
  [48,"Mimitoss",["Insecte","Poison"],49],[49,"Aéromite",["Insecte","Poison"],0],
  [50,"Taupiqueur",["Sol"],51],[51,"Triopikeur",["Sol"],0],
  [52,"Miaouss",["Normal"],53],[53,"Persian",["Normal"],0],
  [54,"Psykokwak",["Eau"],55],[55,"Akwakwak",["Eau"],0],
  [56,"Férosinge",["Combat"],57],[57,"Colossinge",["Combat"],0],
  [58,"Caninos",["Feu"],59],[59,"Arcanin",["Feu"],0],
  [60,"Ptitard",["Eau"],61],[61,"Têtarte",["Eau"],62],[62,"Tartard",["Eau","Combat"],186],
  [63,"Abra",["Psy"],64],[64,"Kadabra",["Psy"],65],[65,"Alakazam",["Psy"],0],
  [66,"Machoc",["Combat"],67],[67,"Machopeur",["Combat"],68],[68,"Mackogneur",["Combat"],0],
  [69,"Chétiflor",["Plante","Poison"],70],[70,"Boustiflor",["Plante","Poison"],71],[71,"Empiflor",["Plante","Poison"],0],
  [72,"Tentacool",["Eau","Poison"],73],[73,"Tentacruel",["Eau","Poison"],0],
  [74,"Racaillou",["Roche","Sol"],75],[75,"Gravalanch",["Roche","Sol"],76],[76,"Grolem",["Roche","Sol"],0],
  [77,"Ponyta",["Feu"],78],[78,"Galopa",["Feu"],0],
  [79,"Ramoloss",["Eau","Psy"],80],[80,"Flagadoss",["Eau","Psy"],199],
  [81,"Magnéti",["Électrik","Acier"],82],[82,"Magnéton",["Électrik","Acier"],0],
  [83,"Canarticho",["Normal","Vol"],0],[84,"Doduo",["Normal","Vol"],85],[85,"Dodrio",["Normal","Vol"],0],
  [86,"Otaria",["Eau"],87],[87,"Dewgong",["Eau","Glace"],0],
  [88,"Tadmorv",["Poison"],89],[89,"Grotadmorv",["Poison"],0],
  [90,"Kokiyas",["Eau"],91],[91,"Crustabri",["Eau","Glace"],0],
  [92,"Fantominus",["Spectre","Poison"],93],[93,"Spectrum",["Spectre","Poison"],94],[94,"Ectoplasma",["Spectre","Poison"],0],
  [95,"Onix",["Roche","Sol"],208],[96,"Soporifik",["Psy"],97],[97,"Hypnomade",["Psy"],0],
  [98,"Krabby",["Eau"],99],[99,"Krabboss",["Eau"],0],
  [100,"Voltorbe",["Électrik"],101],[101,"Électrode",["Électrik"],0],
  [102,"Noeunoeuf",["Plante","Psy"],103],[103,"Noadkoko",["Plante","Psy"],0],
  [104,"Osselait",["Sol"],105],[105,"Ossatueur",["Sol"],0],
  [106,"Kicklee",["Combat"],0],[107,"Tygnon",["Combat"],0],[108,"Excelangue",["Normal"],0],
  [109,"Smogo",["Poison"],110],[110,"Smogogo",["Poison"],0],
  [111,"Rhinocorne",["Sol","Roche"],112],[112,"Rhinoféros",["Sol","Roche"],0],
  [113,"Leveinard",["Normal"],242],[114,"Saquedeneu",["Plante"],0],[115,"Kangourex",["Normal"],0],
  [116,"Hypotrempe",["Eau"],117],[117,"Hypocéan",["Eau"],230],
  [118,"Poissirène",["Eau"],119],[119,"Poissoroy",["Eau"],0],
  [120,"Stari",["Eau"],121],[121,"Staross",["Eau","Psy"],0],
  [122,"M. Mime",["Psy"],0],[123,"Insécateur",["Insecte","Vol"],212],[124,"Lippoutou",["Glace","Psy"],0],
  [125,"Élektek",["Électrik"],0],[126,"Magmar",["Feu"],0],[127,"Scarabrute",["Insecte"],0],
  [128,"Tauros",["Normal"],0],[129,"Magicarpe",["Eau"],130],[130,"Léviator",["Eau","Vol"],0],
  [131,"Lokhlass",["Eau","Glace"],0],[132,"Métamorph",["Normal"],0],
  [133,"Évoli",["Normal"],134],[134,"Aquali",["Eau"],0],[135,"Voltali",["Électrik"],0],[136,"Pyroli",["Feu"],0],
  [137,"Porygon",["Normal"],233],[138,"Amonita",["Roche","Eau"],139],[139,"Amonistar",["Roche","Eau"],0],
  [140,"Kabuto",["Roche","Eau"],141],[141,"Kabutops",["Roche","Eau"],0],
  [142,"Ptéra",["Roche","Vol"],0],[143,"Ronflex",["Normal"],0],
  [147,"Minidraco",["Dragon"],148],[148,"Draco",["Dragon"],149],[149,"Dracolosse",["Dragon","Vol"],0],
  
  [152,"Germignon",["Plante"],153],[153,"Macronium",["Plante"],154],[154,"Méganium",["Plante"],0],
  [155,"Héricendre",["Feu"],156],[156,"Feurisson",["Feu"],157],[157,"Typhlosion",["Feu"],0],
  [158,"Kaiminus",["Eau"],159],[159,"Crocrodil",["Eau"],160],[160,"Aligatueur",["Eau"],0],
  [161,"Fouinette",["Normal","Vol"],162],[162,"Fouinar",["Normal","Vol"],0],
  [163,"Hoothoot",["Normal","Vol"],164],[164,"Noarfang",["Normal","Vol"],0],
  [165,"Coxy",["Insecte","Vol"],166],[166,"Coxyclaque",["Insecte","Vol"],0],
  [167,"Mimigal",["Insecte","Poison"],168],[168,"Migalos",["Insecte","Poison"],0],
  [169,"Nostenfer",["Poison","Vol"],0],[170,"Loupio",["Eau","Électrik"],171],[171,"Lanturn",["Eau","Électrik"],0],
  [172,"Pichu",["Électrik"],25],[173,"Mélo",["Normal"],35],[174,"Toudoudou",["Normal"],39],
  [175,"Togepi",["Normal"],176],[176,"Togetic",["Normal","Vol"],0],
  [177,"Natu",["Normal","Vol"],178],[178,"Xatu",["Normal","Vol"],0],
  [179,"Wattouat",["Électrik"],180],[180,"Lainergie",["Électrik"],181],[181,"Pharamp",["Électrik"],0],
  [182,"Joliflor",["Plante","Poison"],0],[183,"Marill",["Eau"],184],[184,"Azumarill",["Eau"],0],
  [185,"Simularbre",["Roche"],0],[186,"Tarpaud",["Eau"],0],
  [187,"Granivol",["Plante","Vol"],188],[188,"Floravol",["Plante","Vol"],189],[189,"Cotovol",["Plante","Vol"],0],
  [190,"Capumain",["Normal"],0],[191,"Tournegrin",["Plante"],0],
  [192,"Héliatronc",["Plante"],0],[193,"Yanma",["Insecte","Vol"],0],
  [194,"Axoloto",["Eau"],195],[195,"Maraiste",["Eau","Sol"],0],
  [196,"Mentali",["Psy"],0],[197,"Noctali",["Ténèbres"],0],
  [198,"Cornèbre",["Ténèbres","Vol"],0],[199,"Roigada",["Eau","Psy"],0],
  [200,"Feuforêve",["Spectre"],0],[201,"Zarbi",["Psy"],0],[202,"Qulbutoké",["Psy"],0],
  [203,"Girafarig",["Normal","Psy"],0],[204,"Pomdepik",["Insecte"],205],[205,"Foretress",["Insecte","Acier"],0],
  [206,"Insolourdo",["Normal"],0],[207,"Scorplane",["Sol","Vol"],0],
  [208,"Steelix",["Acier","Sol"],0],[209,"Snubbull",["Normal"],210],[210,"Granbull",["Normal"],0],
  [211,"Qwilfish",["Eau","Poison"],0],[212,"Cizayox",["Insecte","Acier"],0],
  [213,"Caratroc",["Insecte","Roche"],0],[214,"Scarhino",["Insecte","Combat"],0],
  [215,"Farfuret",["Ténèbres","Glace"],0],[216,"Teddiursa",["Normal"],217],[217,"Ursaring",["Normal"],0],
  [218,"Limagma",["Feu"],219],[219,"Volcaropod",["Feu","Roche"],0],
  [220,"Marcacrin",["Glace","Sol"],221],[221,"Cochignon",["Glace","Sol"],0],
  [222,"Corayon",["Eau","Roche"],0],[223,"Rémoraid",["Eau"],224],[224,"Octillery",["Eau"],0],
  [225,"Cadoizo",["Glace","Vol"],0],[226,"Démanta",["Eau","Vol"],0],
  [227,"Airmure",["Acier","Vol"],0],[228,"Malosse",["Ténèbres"],229],[229,"Démolosse",["Ténèbres","Feu"],0],
  [230,"Hyporoi",["Eau","Dragon"],0],[231,"Phanpy",["Sol"],232],[232,"Donphan",["Sol"],0],
  [233,"Porygon2",["Normal"],0],[234,"Cerfrousse",["Normal"],0],[235,"Queulorior",["Normal"],0],
  [236,"Debugant",["Combat"],0],[237,"Kapoera",["Combat"],0],[238,"Lippouti",["Glace","Psy"],124],
  [239,"Élekid",["Électrik"],125],[240,"Magby",["Feu"],126],[241,"Écrémeuh",["Normal"],0],
  [242,"Leuphorie",["Normal"],0],[246,"Embrylex",["Roche","Sol"],247],[247,"Ymphect",["Roche","Sol"],248],[248,"Tyranocif",["Roche","Ténèbres"],0]
];

const PM_GEN2: Record<number, Pokemon> = {};
PD_GEN2.forEach(a => { PM_GEN2[a[0]] = { id: a[0], n: a[1], t: a[2], e: a[3] || null, bstMod: 1 }; });

const LEGS_GEN2: [number, string, string[]][] = [
  [144,"Artikodin",["Glace","Vol"]],[145,"Électhor",["Électrik","Vol"]],[146,"Sulfura",["Feu","Vol"]],
  [150,"Mewtwo",["Psy"]],[151,"Mew",["Psy"]],
  [243,"Raikou",["Électrik"]],[244,"Entei",["Feu"]],[245,"Suicune",["Eau"]],
  [249,"Lugia",["Psy","Vol"]],[250,"Ho-Oh",["Feu","Vol"]],[251,"Celebi",["Psy","Plante"]]
];
LEGS_GEN2.forEach(a => { PM_GEN2[a[0]] = { id: a[0], n: a[1], t: a[2], e: null, bstMod: 1 }; });

const BST_GEN2: Record<number, number> = {
  1:318, 3:525, 4:309, 6:534, 7:314, 9:530, 25:320, 26:485, 65:500, 68:505, 76:495, 94:500, 130:540, 143:540, 149:600,
  152:318, 153:405, 154:525, 155:309, 156:405, 157:534, 158:314, 159:405, 160:530, 161:215, 162:415,
  163:262, 164:442, 165:265, 166:390, 167:250, 168:390, 169:535, 170:330, 171:460, 172:205, 173:218,
  174:210, 175:245, 176:405, 177:320, 178:470, 179:280, 180:365, 181:510, 182:490, 183:250, 184:420,
  185:410, 186:500, 187:250, 188:340, 189:460, 190:360, 191:180, 192:425, 193:390, 194:210, 195:430,
  196:525, 197:525, 198:405, 199:490, 200:435, 201:336, 202:405, 203:455, 204:290, 205:465, 206:415,
  207:430, 208:510, 209:300, 210:450, 211:430, 212:500, 213:505, 214:500, 215:430, 216:330, 217:500,
  218:250, 219:410, 220:250, 221:450, 222:380, 223:300, 224:480, 225:330, 226:465, 227:465, 228:330,
  229:500, 230:540, 231:330, 232:500, 233:515, 234:465, 235:250, 236:210, 237:455, 238:305, 239:360,
  240:365, 241:490, 242:540, 243:580, 244:580, 245:580, 246:300, 247:410, 248:600, 249:680, 250:680, 251:600
};

const NBST_GEN2: Record<string, number> = { 
  "Roucool":251, "Rattata":253, "Hoothoot":262, "Fouinette":215, "Mimigal":250, "Coxy":265, "Fantominus":310, "Racaillou":300, "Nosferapti":245, "Machoc":305,
  "Roucoups":349, "Lainergie":365, "Insécateur":500, "Écrémeuh":490, "Ectoplasma":500, "Tartard":510, "Steelix":510, "Cochignon":450, "Hyporoi":540, "Dracolosse":600,
  "Alakazam":500, "Mackogneur":505, "Mentali":525, "Noctali":525, "Démolosse":500, "Léviator":540, "Ronflex":540, "Florizarre":525, "Dracaufeu":534, "Tortank":530, "Pikachu":320 
};

const GYMS_GEN2: Gym[] = [
  { nm:"Albert",ct:"Mauville",bd:"Zéphyr",tp:"Vol",spr:"falkner",df:-0.10,tm:[{n:"Roucool",t:["Normal","Vol"]},{n:"Roucoups",t:["Normal","Vol"]}] },
  { nm:"Hector",ct:"Écorcia",bd:"Essaim",tp:"Insecte",spr:"bugsy",df:-0.05,tm:[{n:"Coconfort",t:["Insecte","Poison"]},{n:"Insécateur",t:["Insecte","Vol"]}] },
  { nm:"Blanche",ct:"Doublonville",bd:"Plaine",tp:"Normal",spr:"whitney",df:0.05,tm:[{n:"Mélofée",t:["Normal"]},{n:"Écrémeuh",t:["Normal"]}] },
  { nm:"Mortimer",ct:"Rosalia",bd:"Brumme",tp:"Spectre",spr:"morty",df:0.05,tm:[{n:"Fantominus",t:["Spectre","Poison"]},{n:"Ectoplasma",t:["Spectre","Poison"]}] },
  { nm:"Chuck",ct:"Irisia",bd:"Choc",tp:"Combat",spr:"chuck",df:0.05,tm:[{n:"Colossinge",t:["Combat"]},{n:"Tartard",t:["Eau","Combat"]}] },
  { nm:"Jasmine",ct:"Oliville",bd:"Minéral",tp:"Acier",spr:"jasmine",df:0.08,tm:[{n:"Magnéti",t:["Électrik","Acier"]},{n:"Steelix",t:["Acier","Sol"]}] },
  { nm:"Frédo",ct:"Acajou",bd:"Glacier",tp:"Glace",spr:"pryce",df:0.08,tm:[{n:"Otaria",t:["Eau"]},{n:"Cochignon",t:["Glace","Sol"]}] },
  { nm:"Sandra",ct:"Ébènelle",bd:"Lever",tp:"Dragon",spr:"clair",df:0.10,tm:[{n:"Draco",t:["Dragon"]},{n:"Hyporoi",t:["Eau","Dragon"]}] },
  { nm:"Major Bob",ct:"Carmin",bd:"Foudre",tp:"Électrik",spr:"ltsurge",df:0.12,tm:[{n:"Raichu",t:["Électrik"]},{n:"Électrode",t:["Électrik"]}] },
  { nm:"Morgane",ct:"Safrania",bd:"Marais",tp:"Psy",spr:"sabrina",df:0.12,tm:[{n:"Mentali",t:["Psy"]},{n:"Alakazam",t:["Psy"]}] },
  { nm:"Ondine",ct:"Azuria",bd:"Cascade",tp:"Eau",spr:"misty",df:0.12,tm:[{n:"Lokhlass",t:["Eau","Glace"]},{n:"Staross",t:["Eau","Psy"]}] },
  { nm:"Erika",ct:"Céladopole",bd:"Prisme",tp:"Plante",spr:"erika",df:0.12,tm:[{n:"Empiflor",t:["Plante","Poison"]},{n:"Joliflor",t:["Plante","Poison"]}] },
  { nm:"Jeannine",ct:"Parmanie",bd:"Âme",tp:"Poison",spr:"janine",df:0.12,tm:[{n:"Migalos",t:["Insecte","Poison"]},{n:"Nostenfer",t:["Poison","Vol"]}] },
  { nm:"Pierre",ct:"Argenta",bd:"Roche",tp:"Roche",spr:"brock",df:0.12,tm:[{n:"Gravalanch",t:["Roche","Sol"]},{n:"Onix",t:["Roche","Sol"]}] },
  { nm:"Auguste",ct:"Cramois'Île",bd:"Volcan",tp:"Feu",spr:"blaine",df:0.12,tm:[{n:"Volcaropod",t:["Feu","Roche"]},{n:"Magmar",t:["Feu"]}] },
  { nm:"Blue",ct:"Jadielle",bd:"Terre",tp:"Divers",spr:"blue",df:0.15,tm:[{n:"Roucarnage",t:["Normal","Vol"]},{n:"Rhinoféros",t:["Sol","Roche"]},{n:"Léviator",t:["Eau","Vol"]}] }
];

const ROCKET_GEN2: { nm: string; spr: string; tm: FoePokemon[] }[] = [
  { nm:"Sbire Rocket",spr:"rocketgrunt",tm:[{n:"Nosferapti",t:["Poison","Vol"]},{n:"Rattatac",t:["Normal"]}] },
  { nm:"Commandant Amos",spr:"rocketgrunt",tm:[{n:"Smogogo",t:["Poison"]},{n:"Nostenfer",t:["Poison","Vol"]}] },
  { nm:"Légende Red",spr:"red",tm:[{n:"Pikachu",t:["Électrik"]},{n:"Ronflex",t:["Normal"]},{n:"Florizarre",t:["Plante","Poison"]},{n:"Dracaufeu",t:["Feu","Vol"]},{n:"Tortank",t:["Eau"]}] }
];

const E4_GEN2 = [
  { nm:"Clément",tp:"Psy",spr:"will",tm:[{n:"Xatu",t:["Psy","Vol"]},{n:"Lippoutou",t:["Glace","Psy"]}] },
  { nm:"Koga",tp:"Poison",spr:"koga",tm:[{n:"Foretress",t:["Insecte","Acier"]},{n:"Nostenfer",t:["Poison","Vol"]}] },
  { nm:"Aldo",tp:"Combat",spr:"bruno",tm:[{n:"Kapoera",t:["Combat"]},{n:"Mackogneur",t:["Combat"]}] },
  { nm:"Marion",tp:"Ténèbres",spr:"karen",tm:[{n:"Noctali",t:["Ténèbres"]},{n:"Démolosse",t:["Ténèbres","Feu"]}] }
];

const CHAMP_GEN2 = { nm:"Peter",spr:"lance",tm:[{n:"Léviator",t:["Eau","Vol"]},{n:"Ptéra",t:["Roche","Vol"]},{n:"Dracolosse",t:["Dragon","Vol"]}] };

const STORY_GEN2: StoryEvent[] = [
  {y:"m",x:"Jules se réveille à Bourg Geon.\nUn garçon aux cheveux rouges rôde..."},
  {y:"s"},{y:"r",s:0},
  {y:"m",x:"Le Prof. Orme confie un Pokédex.\nL'aventure à Johto commence !"},
  {y:"R",p:1,x:"Route 29 — Vers Mauville !"},{y:"g",i:0},
  {y:"R",p:1,x:"Caves Jumelles — La Team Rocket est là !"},{y:"G",i:0},
  {y:"R",p:1,x:"Bois aux Chênes — Vers Écorcia"},{y:"r",s:1},{y:"g",i:1},
  {y:"m",x:"La Pension confie un Œuf Mystère..."},
  {y:"R",p:2,x:"Route 34 — Vers Doublonville !"},{y:"g",i:2},
  {y:"R",p:2,x:"Parc Naturel — Vers Rosalia"},{y:"g",i:3},
  {y:"m",x:"La Tour Cendrée brûle ! Un Pokémon légendaire s'enfuit."},
  {y:"R",p:2,x:"Route 39 — Vers Irisia"},{y:"g",i:4},
  {y:"m",x:"Le Phare d'Oliville a besoin d'aide !"},{y:"g",i:5},
  
  // ÉVÉNEMENTS SPÉCIAUX AJOUTÉS ICI
  {y:"R",p:2,x:"Le Lac Colère est agité..."},
  {y:"E",x:"Un Léviator Rouge scintille au centre du lac !", p: 130}, // Capture du Léviator
  
  {y:"G",i:1},{y:"g",i:6},
  {y:"m",x:"La Team Rocket a pris la Tour Radio !"},{y:"G",i:1},{y:"r",s:2},
  
  {y:"R",p:3,x:"Tu obtiens l'Arc-en-Ciel'Aile.\nDirection la Tour Ferraille !"},
  {y:"E",x:"Ho-Oh, le gardien des cieux, descend !", p: 250}, // Capture de Ho-Oh

  {y:"R",p:3,x:"Route de Glace — Vers Ébènelle !"},{y:"g",i:7},
  {y:"R",p:3,x:"Route Victoire — Vers le Plateau Indigo !"},{y:"r",s:3},
  {y:"4",i:0},{y:"4",i:1},{y:"4",i:2},{y:"4",i:3},
  {y:"C"},
  {y:"choice", x:"🏆 Ligue de Johto vaincue !\nPrendre le bateau pour Kanto ?"},
  {y:"R",p:2,x:"Le bateau arrive à Carmin-sur-Mer !"},{y:"g",i:8},
  {y:"R",p:1,x:"Route 6 — Vers Safrania"},{y:"g",i:9},{y:"g",i:10},
  {y:"R",p:1,x:"Route 7 — Vers Céladopole"},{y:"g",i:11},{y:"g",i:12},
  {y:"m",x:"La Cave Taupiqueur est débloquée !"},{y:"g",i:13},
  {y:"R",p:2,x:"Bourg Palette — Vers Cramois'Île"},{y:"g",i:14},{y:"g",i:15},
  {y:"m",x:"Les 16 Badges sont réunis !\nLe Mont Argenté est accessible."},
  {y:"R",p:3,x:"Mont Argenté — Froid extrême et Pokémon sauvages puissants..."},
  {y:"S"},
  {y:"W"}
];

function getRivTmGen2(sid: number | null, st: number): FoePokemon[] {
  const rid = sid === 152 ? 155 : sid === 155 ? 158 : 152;
  const s1 = PM_GEN2[rid], s2 = s1?.e ? PM_GEN2[s1.e] : s1, s3 = s2?.e ? PM_GEN2[s2.e] : s2;
  const ts = [
    [{n:s1.n,t:s1.t}],
    [{n:"Fantominus",t:["Spectre","Poison"]},{n:s2.n,t:s2.t}],
    [{n:"Nosferalto",t:["Poison","Vol"]},{n:"Spectrum",t:["Spectre","Poison"]},{n:s3.n,t:s3.t}],
    [{n:"Nostenfer",t:["Poison","Vol"]},{n:"Ectoplasma",t:["Spectre","Poison"]},{n:"Alakazam",t:["Psy"]},{n:s3.n,t:s3.t}]
  ];
  return ts[Math.min(st,3)];
}

export const gen2Data: GameData = {
  id: "gen2", name: "Johto (Génération 2)", themeColor: "#D4AF37",
  SE: SE_GEN2, PD: PD_GEN2, PM: PM_GEN2, BST: BST_GEN2, NBST: NBST_GEN2,
  LEGS: LEGS_GEN2, GYMS: GYMS_GEN2, EVIL_TEAM: ROCKET_GEN2, E4: E4_GEN2, CHAMP: CHAMP_GEN2,
  STORY: STORY_GEN2,
  CATCH_IDS: [16,19,41,63,66,74,92,152,155,158,161,163,165,167,177,179,187,193,198,206,207,216,220,227,228,231],
  FISH_IDS: [72,129,170,183,194,211,222,223,226],
  BABY_IDS: [172,173,174,175,236,238,239,240],
  getRivTm: getRivTmGen2
};
