import type { HSL } from "./types.js";

/**
 * Mood/theme keyword -> base hue & saturation. Curated by hand rather than
 * derived, so additions should stay consistent with neighboring hues
 * (e.g. keep all "warm/fire" words in the 0-40 range).
 */
export const KEYWORD_DICTIONARY: Record<string, HSL> = {
  // warm / fire
  sunset: { h: 18, s: 82, l: 55 },
  desert: { h: 28, s: 60, l: 55 },
  fire: { h: 14, s: 88, l: 52 },
  autumn: { h: 24, s: 70, l: 48 },
  terracotta: { h: 12, s: 55, l: 50 },
  rust: { h: 16, s: 60, l: 42 },
  coral: { h: 6, s: 78, l: 62 },
  amber: { h: 38, s: 85, l: 55 },
  mustard: { h: 45, s: 70, l: 48 },
  gold: { h: 46, s: 75, l: 55 },
  crimson: { h: 348, s: 78, l: 45 },
  ruby: { h: 350, s: 72, l: 45 },
  cozy: { h: 20, s: 55, l: 50 },
  warm: { h: 25, s: 65, l: 55 },
  energetic: { h: 8, s: 80, l: 55 },
  playful: { h: 330, s: 70, l: 60 },
  tropical: { h: 350, s: 75, l: 58 },
 
  // cool / water / ice
  ocean: { h: 200, s: 70, l: 48 },
  sea: { h: 195, s: 65, l: 45 },
  ice: { h: 195, s: 40, l: 70 },
  winter: { h: 205, s: 35, l: 60 },
  arctic: { h: 200, s: 45, l: 68 },
  cool: { h: 205, s: 45, l: 55 },
  calm: { h: 200, s: 35, l: 55 },
  navy: { h: 220, s: 55, l: 30 },
  midnight: { h: 230, s: 45, l: 22 },
  indigo: { h: 245, s: 55, l: 45 },
  denim: { h: 210, s: 40, l: 42 },
  cyberpunk: { h: 285, s: 85, l: 55 },
  neon: { h: 300, s: 90, l: 58 },
  electric: { h: 260, s: 85, l: 55 },
 
  // nature / earth
  forest: { h: 140, s: 45, l: 32 },
  jungle: { h: 130, s: 50, l: 30 },
  sage: { h: 110, s: 22, l: 55 },
  mint: { h: 155, s: 45, l: 65 },
  emerald: { h: 150, s: 65, l: 40 },
  spring: { h: 100, s: 45, l: 55 },
  summer: { h: 45, s: 65, l: 60 },
  earthy: { h: 30, s: 35, l: 40 },
  organic: { h: 95, s: 30, l: 42 },
  botanical: { h: 135, s: 40, l: 35 },
  moss: { h: 95, s: 35, l: 32 },
  clay: { h: 20, s: 40, l: 45 },
  stone: { h: 210, s: 8, l: 60 },
  ash: { h: 210, s: 5, l: 45 },
  smoke: { h: 220, s: 8, l: 50 },
 
  // pastel / soft
  pastel: { h: 320, s: 45, l: 78 },
  blush: { h: 350, s: 55, l: 80 },
  rose: { h: 340, s: 55, l: 68 },
  lavender: { h: 265, s: 45, l: 75 },
  plum: { h: 300, s: 40, l: 38 },
  soft: { h: 280, s: 30, l: 75 },
  dreamy: { h: 270, s: 50, l: 75 },
 
  // corporate / trust / luxury
  corporate: { h: 215, s: 45, l: 40 },
  fintech: { h: 215, s: 55, l: 38 },
  trustworthy: { h: 210, s: 50, l: 42 },
  professional: { h: 212, s: 35, l: 38 },
  finance: { h: 150, s: 40, l: 32 },
  banking: { h: 215, s: 45, l: 35 },
  tech: { h: 230, s: 60, l: 50 },
  startup: { h: 250, s: 65, l: 55 },
  minimal: { h: 210, s: 12, l: 45 },
  clean: { h: 205, s: 15, l: 50 },
  luxury: { h: 45, s: 40, l: 35 },
  elegant: { h: 260, s: 25, l: 32 },
  premium: { h: 40, s: 35, l: 32 },
  bold: { h: 350, s: 80, l: 45 },
  monochrome: { h: 220, s: 5, l: 40 },
 
  // retro / vintage
  vintage: { h: 30, s: 40, l: 50 },
  retro: { h: 20, s: 60, l: 55 },
  nostalgic: { h: 35, s: 45, l: 55 },
 
  // romance / emotion
  romance: { h: 340, s: 65, l: 60 },
  romantic: { h: 340, s: 65, l: 60 },
  love: { h: 345, s: 70, l: 55 },
  loving: { h: 345, s: 65, l: 60 },
  passion: { h: 350, s: 80, l: 48 },
  passionate: { h: 350, s: 80, l: 48 },
  tender: { h: 335, s: 45, l: 72 },
  sweet: { h: 335, s: 55, l: 72 },
  valentine: { h: 348, s: 75, l: 52 },
  wedding: { h: 335, s: 35, l: 82 },
  bridal: { h: 335, s: 30, l: 84 },
  feminine: { h: 330, s: 45, l: 72 },
  whimsical: { h: 285, s: 55, l: 72 },
  cheerful: { h: 40, s: 80, l: 60 },
  joyful: { h: 45, s: 85, l: 58 },
 
  // sun / beach / light
  sunny: { h: 48, s: 88, l: 58 },
  sunshine: { h: 50, s: 90, l: 60 },
  bright: { h: 50, s: 80, l: 58 },
  golden: { h: 42, s: 78, l: 55 },
  radiant: { h: 40, s: 82, l: 56 },
  glow: { h: 35, s: 75, l: 60 },
  beach: { h: 40, s: 55, l: 68 },
  sand: { h: 38, s: 40, l: 68 },
  island: { h: 175, s: 55, l: 55 },
  paradise: { h: 165, s: 60, l: 52 },
  coastal: { h: 195, s: 45, l: 60 },
  nautical: { h: 212, s: 55, l: 38 },
 
  // food / dessert
  citrus: { h: 55, s: 85, l: 55 },
  lemon: { h: 55, s: 85, l: 62 },
  peach: { h: 20, s: 75, l: 72 },
  cherry: { h: 355, s: 75, l: 45 },
  berry: { h: 325, s: 60, l: 42 },
  strawberry: { h: 350, s: 72, l: 55 },
  chocolate: { h: 22, s: 45, l: 28 },
  coffee: { h: 25, s: 40, l: 30 },
  mocha: { h: 24, s: 35, l: 35 },
  vanilla: { h: 45, s: 45, l: 82 },
  cream: { h: 42, s: 40, l: 85 },
  candy: { h: 320, s: 70, l: 68 },
  bubblegum: { h: 325, s: 75, l: 70 },
  honey: { h: 42, s: 80, l: 55 },
  mango: { h: 35, s: 90, l: 58 },
  watermelon: { h: 350, s: 70, l: 60 },
  matcha: { h: 85, s: 40, l: 45 },
  avocado: { h: 75, s: 35, l: 40 },
 
  // floral / garden
  floral: { h: 320, s: 55, l: 65 },
  blossom: { h: 330, s: 50, l: 72 },
  bloom: { h: 325, s: 55, l: 68 },
  garden: { h: 115, s: 40, l: 45 },
  meadow: { h: 90, s: 42, l: 48 },
 
  // sky / night / cosmic
  sky: { h: 200, s: 60, l: 65 },
  cloud: { h: 210, s: 20, l: 82 },
  storm: { h: 220, s: 25, l: 32 },
  galaxy: { h: 265, s: 60, l: 30 },
  cosmic: { h: 270, s: 65, l: 35 },
  moon: { h: 230, s: 20, l: 55 },
 
  // material / texture
  velvet: { h: 300, s: 45, l: 30 },
  silk: { h: 300, s: 15, l: 80 },
  royal: { h: 255, s: 60, l: 35 },
  regal: { h: 270, s: 55, l: 32 },
  rustic: { h: 25, s: 35, l: 38 },
  industrial: { h: 210, s: 8, l: 35 },
 
  // basic colors — the most common thing someone will actually type
  red: { h: 0, s: 75, l: 50 },
  orange: { h: 25, s: 85, l: 55 },
  yellow: { h: 50, s: 90, l: 60 },
  green: { h: 130, s: 50, l: 40 },
  blue: { h: 215, s: 70, l: 50 },
  purple: { h: 275, s: 55, l: 45 },
  violet: { h: 270, s: 55, l: 55 },
  pink: { h: 330, s: 65, l: 70 },
  brown: { h: 25, s: 40, l: 32 },
  black: { h: 0, s: 0, l: 10 },
  white: { h: 0, s: 0, l: 97 },
  gray: { h: 0, s: 0, l: 55 },
  teal: { h: 180, s: 50, l: 40 },
  cyan: { h: 185, s: 70, l: 55 },
  magenta: { h: 310, s: 75, l: 55 },
  maroon: { h: 0, s: 55, l: 30 },
  turquoise: { h: 174, s: 60, l: 50 },
  silver: { h: 0, s: 0, l: 75 },
  olive: { h: 60, s: 35, l: 35 },
 
  // dark / mood
  dark: { h: 250, s: 20, l: 15 },
  moody: { h: 255, s: 30, l: 22 },
  gothic: { h: 280, s: 35, l: 18 },
  mysterious: { h: 265, s: 35, l: 25 },
  spooky: { h: 270, s: 45, l: 20 },
  serene: { h: 190, s: 35, l: 65 },
  peaceful: { h: 190, s: 30, l: 70 },
  chaotic: { h: 350, s: 70, l: 45 },
  danger: { h: 0, s: 85, l: 45 },
  toxic: { h: 90, s: 80, l: 45 },
  radioactive: { h: 80, s: 90, l: 55 },
 
  // holidays
  christmas: { h: 150, s: 55, l: 30 },
  festive: { h: 350, s: 70, l: 50 },
  halloween: { h: 25, s: 85, l: 45 },
  easter: { h: 280, s: 40, l: 78 },
  thanksgiving: { h: 28, s: 60, l: 45 },
 
  // tech / AI
  ai: { h: 250, s: 75, l: 55 },
  crypto: { h: 35, s: 85, l: 52 },
  blockchain: { h: 230, s: 60, l: 45 },
  futuristic: { h: 270, s: 80, l: 55 },
  gaming: { h: 280, s: 80, l: 55 },
  esports: { h: 265, s: 80, l: 52 },
 
  // gemstones / precious materials
  sapphire: { h: 220, s: 70, l: 40 },
  amethyst: { h: 270, s: 50, l: 45 },
  topaz: { h: 35, s: 75, l: 50 },
  opal: { h: 200, s: 20, l: 85 },
  pearl: { h: 40, s: 15, l: 90 },
  diamond: { h: 200, s: 10, l: 92 },
  bronze: { h: 30, s: 45, l: 38 },
  copper: { h: 20, s: 55, l: 45 },
  platinum: { h: 210, s: 5, l: 80 },
 
  // weather / atmosphere
  rain: { h: 210, s: 30, l: 50 },
  thunder: { h: 250, s: 30, l: 25 },
  fog: { h: 210, s: 10, l: 75 },
  snow: { h: 200, s: 15, l: 92 },
  humid: { h: 150, s: 25, l: 55 },
  breeze: { h: 190, s: 30, l: 75 },
  frost: { h: 195, s: 30, l: 80 },
 
  // wellness / spa
  zen: { h: 170, s: 20, l: 55 },
  spa: { h: 165, s: 25, l: 70 },
  yoga: { h: 150, s: 20, l: 60 },
  meditation: { h: 250, s: 20, l: 40 },
  tranquil: { h: 195, s: 25, l: 70 },
  wellness: { h: 150, s: 30, l: 55 },
  balance: { h: 180, s: 20, l: 55 },
 
  // animals / wildlife
  flamingo: { h: 340, s: 65, l: 70 },
  peacock: { h: 190, s: 60, l: 35 },
  tiger: { h: 30, s: 80, l: 50 },
  zebra: { h: 0, s: 0, l: 20 },
  safari: { h: 35, s: 45, l: 45 },
  owl: { h: 35, s: 25, l: 35 },
  fox: { h: 22, s: 70, l: 48 },
  wolf: { h: 220, s: 10, l: 40 },
  raven: { h: 250, s: 15, l: 12 },
  swan: { h: 200, s: 10, l: 92 },
  butterfly: { h: 300, s: 65, l: 62 },
  hummingbird: { h: 150, s: 60, l: 42 },
  koi: { h: 15, s: 75, l: 55 },
  chameleon: { h: 120, s: 55, l: 45 },
  parrot: { h: 130, s: 65, l: 45 },
  toucan: { h: 40, s: 85, l: 52 },
  jellyfish: { h: 280, s: 45, l: 72 },
  seahorse: { h: 40, s: 45, l: 55 },
  deer: { h: 25, s: 35, l: 42 },
  bear: { h: 20, s: 30, l: 25 },
  panther: { h: 260, s: 20, l: 10 },
  lynx: { h: 30, s: 30, l: 45 },
  falcon: { h: 25, s: 30, l: 35 },
  dove: { h: 210, s: 8, l: 88 },
  cardinal: { h: 355, s: 80, l: 45 },
  bluejay: { h: 215, s: 65, l: 50 },
  goldfinch: { h: 50, s: 85, l: 55 },
  cat: { h: 30, s: 15, l: 45 },
  dog: { h: 35, s: 50, l: 45 },
  rabbit: { h: 350, s: 20, l: 88 },
  lion: { h: 40, s: 65, l: 50 },
 
  // wood / rustic materials
  oak: { h: 30, s: 35, l: 35 },
  walnut: { h: 20, s: 35, l: 25 },
  mahogany: { h: 10, s: 45, l: 25 },
  pine: { h: 40, s: 35, l: 60 },
  birch: { h: 40, s: 20, l: 80 },
  driftwood: { h: 35, s: 15, l: 55 },
 
  // music / genre vibe
  jazz: { h: 270, s: 35, l: 30 },
  rock: { h: 0, s: 5, l: 20 },
  punk: { h: 330, s: 80, l: 40 },
  lofi: { h: 280, s: 25, l: 55 },
  disco: { h: 300, s: 80, l: 50 },
  acoustic: { h: 35, s: 30, l: 45 },
 
  // celebrations
  birthday: { h: 320, s: 70, l: 65 },
  carnival: { h: 350, s: 75, l: 52 },
  celebration: { h: 340, s: 70, l: 55 },
  party: { h: 300, s: 75, l: 58 },
  
  // legumes
  lentil: { h: 15, s: 45, l: 42 },
  chickpea: { h: 42, s: 35, l: 70 },
  soybean: { h: 70, s: 30, l: 65 },
  edamame: { h: 100, s: 45, l: 45 },
  pea: { h: 105, s: 50, l: 50 },
  hummus: { h: 45, s: 30, l: 75 },
  tofu: { h: 50, s: 10, l: 92 },
  peanut: { h: 30, s: 40, l: 55 },
  lupin: { h: 50, s: 60, l: 60 },
  carob: { h: 20, s: 40, l: 25 },
 
  // vegetables
  tomato: { h: 5, s: 75, l: 50 },
  cucumber: { h: 100, s: 35, l: 45 },
  carrot: { h: 28, s: 80, l: 52 },
  potato: { h: 35, s: 30, l: 55 },
  onion: { h: 300, s: 20, l: 65 },
  garlic: { h: 45, s: 10, l: 90 },
  pepper: { h: 110, s: 55, l: 40 },
  broccoli: { h: 120, s: 40, l: 28 },
  cauliflower: { h: 50, s: 15, l: 92 },
  spinach: { h: 130, s: 50, l: 25 },
  kale: { h: 140, s: 45, l: 30 },
  zucchini: { h: 110, s: 35, l: 32 },
  eggplant: { h: 285, s: 45, l: 28 },
  beet: { h: 335, s: 60, l: 32 },
  radish: { h: 345, s: 65, l: 52 },
  celery: { h: 85, s: 30, l: 55 },
  corn: { h: 50, s: 80, l: 60 },
};

/** Hash a string deterministically into a 0-360 hue for inputs with no keyword match. */
export function hashToHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}
