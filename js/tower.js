// ── Tower Climb Game Mode ──────────────────────────────────────────────
// Escalating difficulty dungeon unlocked at S-rank.
// Party climbs floors, fighting increasingly difficult enemies.
// Every 10 floors: rest room (continue or exit).
// On exit/death: recap screen with loot based on floors cleared.
// Tracks best floor reached + party composition.

import { RANK_ORDER, EQUIPMENT, LOOT_ITEMS, getItem, rankIndex, randInt } from './data.js';
import { getSkill } from './skills.js';
import { calculateMemberStrength, calculatePartyStrength, DIFFICULTY_TIERS } from './questgen.js';

// ── Tower Configuration ────────────────────────────────────────────────

const TOWER_CONFIG = {
  REST_INTERVAL: 10,        // rest room every N floors
  BASE_DIFFICULTY: 18.0,    // starting difficulty (S-rank baseline)
  DIFF_PER_FLOOR: 1.2,      // additive difficulty increase per floor
  DIFF_SCALE_FACTOR: 1.04,  // multiplicative scaling per floor (compounds)
  FLOOR_DURATION: 45,       // seconds per floor combat
  STAT_SCALE_PER_FLOOR: 0.06, // +6% enemy HP/ATK per floor above 1
  MAX_FLOOR: 100,             // hard cap — Floor 100 is the final boss
  BOSS_FLOORS: [10, 20, 30, 50, 75, 100], // floors with tower bosses

  // Loot thresholds (floors reached → rewards)
  GEM_BAG_THRESHOLDS: [
    { floor: 10, itemId: 'TOWER_GEM_BAG_MINOR', chance: 0.8 },
    { floor: 20, itemId: 'TOWER_GEM_BAG_MINOR', chance: 1.0 },
    { floor: 30, itemId: 'TOWER_GEM_BAG_MAJOR', chance: 0.7 },
    { floor: 40, itemId: 'TOWER_GEM_BAG_MAJOR', chance: 1.0 },
    { floor: 50, itemId: 'TOWER_GEM_BAG_SUPREME', chance: 0.6 },
    { floor: 75, itemId: 'TOWER_GEM_BAG_SUPREME', chance: 1.0 },
    { floor: 100, itemId: 'TOWER_GEM_BAG_SUPREME', chance: 1.0 },
  ],

  // Celestial drop scaling: every 10 floors increases chance and quantity
  CELESTIAL_BASE_CHANCE: 0.03,     // 3% base at floor 10
  CELESTIAL_CHANCE_PER_10: 0.04,   // +4% per 10 floors
  CELESTIAL_MAX_CHANCE: 0.50,      // 50% cap
  CELESTIAL_MAX_ITEMS: 5,          // max celestial items per tower run

  // Gold and EXP per floor
  GOLD_PER_FLOOR: { base: 3000, scale: 500 },
  EXP_PER_FLOOR: { base: 1500, scale: 250 },
};

// ── Tower Enemies by Floor Tier ────────────────────────────────────────

const TOWER_ENEMIES = {
  tier1: { // Floors 1-10
    names: ['Tower Sentry', 'Stairwell Lurker', 'Vault Guardian', 'Iron Sentinel'],
    bossName: 'The Gatekeeper',
  },
  tier2: { // Floors 11-20
    names: ['Shadow Warden', 'Flame Sentinel', 'Frost Guardian', 'Storm Watcher'],
    bossName: 'The Warden of Storms',
  },
  tier3: { // Floors 21-30
    names: ['Void Sentinel', 'Reality Bender', 'Temporal Watcher', 'Chaos Knight'],
    bossName: 'The Architect\'s Shadow',
  },
  tier4: { // Floors 31-50
    names: ['Primordial Shade', 'Entropy Walker', 'Oblivion Scout', 'Star Hunter'],
    bossName: 'The Primordial Warden',
  },
  tier5: { // Floors 51-75
    names: ['Celestial Horror', 'God Fragment', 'World Eater Spawn', 'Infinity Shard'],
    bossName: 'The Hand of Creation',
  },
  tier6: { // Floors 76-99
    names: ['Concept of Violence', 'Abstraction of Ruin', 'The Inevitable', 'Beyond Understanding'],
    bossName: 'The Tower Itself',
  },
  apex: { // Floor 100 — final boss
    names: ['Echo of Infinity', 'Shard of the Absolute', 'Memory of All Worlds', 'The Last Thought'],
    bossName: 'The Architect',
  },
};

function getFloorTier(floor) {
  if (floor >= TOWER_CONFIG.MAX_FLOOR) return TOWER_ENEMIES.apex;
  if (floor <= 10) return TOWER_ENEMIES.tier1;
  if (floor <= 20) return TOWER_ENEMIES.tier2;
  if (floor <= 30) return TOWER_ENEMIES.tier3;
  if (floor <= 50) return TOWER_ENEMIES.tier4;
  if (floor <= 75) return TOWER_ENEMIES.tier5;
  return TOWER_ENEMIES.tier6;
}

function isRestFloor(floor) {
  return floor > 0 && floor % TOWER_CONFIG.REST_INTERVAL === 0;
}

function isBossFloor(floor) {
  return TOWER_CONFIG.BOSS_FLOORS.includes(floor);
}

// ── Floor Quest Generation ─────────────────────────────────────────────

export function generateFloorQuest(floor) {
  // Cap at MAX_FLOOR — floor 100 is the apex encounter
  const clampedFloor = Math.min(floor, TOWER_CONFIG.MAX_FLOOR);
  const tier = getFloorTier(clampedFloor);
  const isBoss = isBossFloor(clampedFloor);
  const isApex = clampedFloor >= TOWER_CONFIG.MAX_FLOOR;

  // Difficulty scales both linearly and exponentially (display / recommended power)
  const linearDiff = TOWER_CONFIG.BASE_DIFFICULTY + (clampedFloor * TOWER_CONFIG.DIFF_PER_FLOOR);
  const expScale = Math.pow(TOWER_CONFIG.DIFF_SCALE_FACTOR, clampedFloor);
  const difficulty = Math.round(linearDiff * expScale * 100) / 100;

  // Tower floor multiplier — applied to enemy HP/ATK in combat.
  // +6% per floor above 1, so Floor 1 = 1.0×, Floor 10 ≈ 1.54×, Floor 50 ≈ 3.94×.
  const towerFloorMult = 1 + (clampedFloor - 1) * TOWER_CONFIG.STAT_SCALE_PER_FLOOR;

  const enemies = isBoss
    ? [...tier.names.slice(0, 2), tier.bossName]
    : tier.names.slice(0, 3);

  const title = isApex
    ? `Tower Apex — ${tier.bossName}`
    : isBoss
      ? `Tower Floor ${clampedFloor} — ${tier.bossName}`
      : `Tower Floor ${clampedFloor}`;

  const env = isApex
    ? { name: 'The Apex — Beyond the Sky', icon: '👁', mood: 'cosmic' }
    : [
        { name: `Floor ${clampedFloor} — The Ascent`, icon: '🗼', mood: 'dungeon' },
        { name: `Floor ${clampedFloor} — Spiral Stair`, icon: '🗼', mood: 'dungeon' },
        { name: `Floor ${clampedFloor} — The Vault`, icon: '🗼', mood: 'fortress' },
        { name: `Floor ${clampedFloor} — Shadow Hall`, icon: '🗼', mood: 'haunted' },
      ][clampedFloor % 4];

  return {
    id: `TOWER_F${clampedFloor}`,
    rank: 'S',
    title,
    description: isApex
      ? 'The summit of the Endless Tower. The Architect awaits — the being who built this place, and everything beyond it. This is the hardest fight in the world.'
      : isBoss
        ? `The tower's guardian awaits on floor ${clampedFloor}. Defeat it to continue the ascent.`
        : `Floor ${clampedFloor} of the Endless Tower. The enemies grow stronger with every step.`,
    environment: env,
    enemies,
    duration: TOWER_CONFIG.FLOOR_DURATION,
    difficulty,
    recommendedPower: Math.floor(difficulty * 25),
    goldReward: { min: 0, max: 0 }, // gold calculated on exit
    expReward: { min: 0, max: 0 },  // exp calculated on exit
    rankPointReward: 0,
    lootTable: [],  // loot calculated on exit
    requiredGuildRank: 'S',
    isRepeatable: true,
    rarity: isApex ? 'celestial' : isBoss ? 'legendary' : (clampedFloor >= 50 ? 'rare' : 'common'),
    boss: isBoss,
    raidBoss: isApex, // The Architect uses raid-tier multipliers — hardest fight in the game
    bossName: isBoss ? tier.bossName : null,
    towerFloor: clampedFloor,
    towerFloorMult,
    narratives: {
      success: isApex
        ? ['The Architect falls. The tower dissolves into light. You have conquered the unconquerable.', 'At the top of all things, silence. The Architect crumbles — the tower is complete.']
        : isBoss
          ? [`The guardian of floor ${clampedFloor} falls. The way above opens.`, `Floor ${clampedFloor} is cleared. The tower shudders — but stands.`]
          : [`Floor ${clampedFloor} cleared. The stairway spirals upward.`, `The enemies on floor ${clampedFloor} lie defeated. Onward and upward.`],
      failure: isApex
        ? ['The Architect simply looks at you, and you cease to be. Perhaps next time.', 'Even at the summit, the tower wins. The Architect endures.']
        : [`The tower claims another party. Floor ${clampedFloor} proved too much.`, `Defeated on floor ${clampedFloor}. The tower is merciless.`],
    },
  };
}

// ── Celestial Item Pool ────────────────────────────────────────────────

const CELESTIAL_ITEMS = [
  'CEL_DAWNBREAKER', 'CEL_ASCENDANT_PLATE', 'CEL_ASCENDANT_WARD', 'CEL_CROWN_OF_THE_CHOSEN',
  'CEL_GODSLAYER',
  'CEL_OATHSWORN', 'CEL_ETERNAL_BASTION', 'CEL_INFINITUM_SHIELD', 'CEL_SENTINELS_ETERNITY',
  'CEL_INFINITY_STAFF', 'CEL_ROBES_OF_THE_VOID', 'CEL_SINGULARITY_ORB', 'CEL_DIADEM_OF_OMNISCIENCE',
  'CEL_VOIDFANG', 'CEL_WRAITHWEAVE', 'CEL_NULLBLADE', 'CEL_ECLIPSE_PENDANT',
  'CEL_SCEPTER_OF_DAWN', 'CEL_VESTMENTS_OF_GRACE', 'CEL_TOME_OF_MIRACLES', 'CEL_HALO_OF_THE_BLESSED',
  'CEL_STARFALL_BOW', 'CEL_STARHIDE_MANTLE', 'CEL_CONSTELLATION_QUIVER', 'CEL_POLARIS_PENDANT',
  'CEL_LYRE_OF_CREATION', 'CEL_VESTMENTS_OF_COSMOS', 'CEL_DRUM_OF_ETERNITY', 'CEL_MAESTROS_SIGNET',
  'CEL_FISTS_OF_NIRVANA', 'CEL_GI_OF_THE_ABSOLUTE', 'CEL_PALM_OF_THE_INFINITE', 'CEL_CHAKRA_OF_ENLIGHTENMENT',
  'CEL_SOULWEAVER', 'CEL_MORTALITYS_END', 'CEL_SHROUD_OF_THE_LICH', 'CEL_SKULL_OF_ETERNAL_WHISPERS', 'CEL_PHYLACTERY_OF_SOULS',
];

// ── Tower Run Loot Calculation ─────────────────────────────────────────

export function calculateTowerLoot(floorsCleared) {
  const loot = [];

  // Gold: cumulative per floor
  let totalGold = 0;
  for (let f = 1; f <= floorsCleared; f++) {
    totalGold += TOWER_CONFIG.GOLD_PER_FLOOR.base + (f * TOWER_CONFIG.GOLD_PER_FLOOR.scale);
  }

  // EXP: cumulative per floor
  let totalExp = 0;
  for (let f = 1; f <= floorsCleared; f++) {
    totalExp += TOWER_CONFIG.EXP_PER_FLOOR.base + (f * TOWER_CONFIG.EXP_PER_FLOOR.scale);
  }

  // Gem bags: check each threshold
  for (const threshold of TOWER_CONFIG.GEM_BAG_THRESHOLDS) {
    if (floorsCleared >= threshold.floor) {
      if (Math.random() < threshold.chance) {
        loot.push({ itemId: threshold.itemId, quantity: 1 });
      }
    }
  }

  // Celestials: scaling chance every 10 floors
  const checkpoints = Math.floor(floorsCleared / 10);
  let celestialsDropped = 0;
  for (let cp = 1; cp <= checkpoints; cp++) {
    const chance = Math.min(
      TOWER_CONFIG.CELESTIAL_MAX_CHANCE,
      TOWER_CONFIG.CELESTIAL_BASE_CHANCE + (cp * TOWER_CONFIG.CELESTIAL_CHANCE_PER_10)
    );
    if (Math.random() < chance && celestialsDropped < TOWER_CONFIG.CELESTIAL_MAX_ITEMS) {
      const itemId = CELESTIAL_ITEMS[Math.floor(Math.random() * CELESTIAL_ITEMS.length)];
      loot.push({ itemId, quantity: 1 });
      celestialsDropped++;
    }
  }

  // Rank points based on floors cleared
  const rankPoints = Math.floor(floorsCleared * 500 + Math.pow(floorsCleared, 1.5) * 100);

  return { gold: totalGold, exp: totalExp, rankPoints, loot };
}

// ── Tower State Helpers ────────────────────────────────────────────────

export function getDefaultTowerState() {
  return {
    bestFloor: 0,
    bestParty: null,      // { members: [{name, class, level}], floor }
    totalRuns: 0,
    active: null,         // null or { floor, startedAt, partySnapshot, atRest, floorsCleared }
  };
}

export function isTowerUnlocked(guildRank) {
  return rankIndex(guildRank) >= rankIndex('S');
}

export { TOWER_CONFIG, isRestFloor, isBossFloor, getFloorTier };
