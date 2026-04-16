export interface Pokemon { id: number; n: string; t: string[]; e: number | null; bstMod?: number; }
export interface FoePokemon { n: string; t: string[]; }

export interface Gym { nm: string; ct: string; bd: string; tp: string; spr: string; df: number; tm: FoePokemon[]; }
export interface StoryEvent { y: string; x?: string; s?: number; p?: number; i?: number; }

export interface GameData {
  id: string;
  name: string;
  themeColor: string;
  SE: Record<string, Record<string, number>>;
  PD: [number, string, string[], number][];
  PM: Record<number, Pokemon>;
  BST: Record<number, number>;
  NBST: Record<string, number>;
  LEGS: [number, string, string[]][];
  GYMS: Gym[];
  EVIL_TEAM: { nm: string; spr: string; tm: FoePokemon[] }[];
  E4: { nm: string; tp: string; spr: string; tm: FoePokemon[] }[];
  CHAMP: { nm: string; spr: string; tm: FoePokemon[] };
  STORY: StoryEvent[];
  CATCH_IDS: number[];
  FISH_IDS: number[];
  BABY_IDS: number[];
  getRivTm: (sid: number | null, st: number) => FoePokemon[];
}

export interface WheelItem { n?: string; label?: string; id?: number; t?: string[]; e?: number | null; val?: boolean; k?: string; a?: string; bstMod?: number; }
export interface InvState { p: number; sp: number; b: number; r: number; }
export interface CombatCtx { nm: string; foes: FoePokemon[]; d: number; ctx: string; gi?: number; spr?: string; }
export interface SwapData { poke: Pokemon; afterMsg: string; afterFn: () => void; }
