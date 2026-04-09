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
  tier6: { // Floors 76+
    names: ['Concept of Violence', 'Abstraction of Ruin', 'The Inevitable', 'Beyond Understanding'],
    bossName: 'The Tower Itself',
  },
};

function getFloorTier(floor) {
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
  const tier = getFloorTier(floor);
  const isBoss = isBossFloor(floor);

  // Difficulty scales both linearly and exponentially
  const linearDiff = TOWER_CONFIG.BASE_DIFFICULTY + (floor * TOWER_CONFIG.DIFF_PER_FLOOR);
  const expScale = Math.pow(TOWER_CONFIG.DIFF_SCALE_FACTOR, floor);
  const difficulty = Math.round(linearDiff * expScale * 100) / 100;

  const enemies = isBoss
    ? [...tier.names.slice(0, 2), tier.bossName]
    : tier.names.slice(0, 3);

  const title = isBoss
    ? `Tower Floor ${floor} — ${tier.bossName}`
    : `Tower Floor ${floor}`;

  const environments = [
    { name: `Floor ${floor} — The Ascent`, icon: '🗼', mood: 'dungeon' },
    { name: `Floor ${floor} — Spiral Stair`, icon: '🗼', mood: 'dungeon' },
    { name: `Floor ${floor} — The Vault`, icon: '🗼', mood: 'fortress' },
    { name: `Floor ${floor} — Shadow Hall`, icon: '🗼', mood: 'haunted' },
  ];
  const env = environments[floor % environments.length];

  return {
    id: `TOWER_F${floor}`,
    rank: 'S',
    title,
    description: isBoss
      ? `The tower's guardian awaits on floor ${floor}. Defeat it to continue the ascent.`
      : `Floor ${floor} of the Endless Tower. The enemies grow stronger with every step.`,
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
    rarity: isBoss ? 'legendary' : (floor >= 50 ? 'rare' : 'common'),
    boss: isBoss,
    raidBoss: false,
    bossName: isBoss ? tier.bossName : null,
    towerFloor: floor,
    narratives: {
      success: isBoss
        ? [`The guardian of floor ${floor} falls. The way above opens.`, `Floor ${floor} is cleared. The tower shudders — but stands.`]
        : [`Floor ${floor} cleared. The stairway spirals upward.`, `The enemies on floor ${floor} lie defeated. Onward and upward.`],
      failure: [`The tower claims another party. Floor ${floor} proved too much.`, `Defeated on floor ${floor}. The tower is merciless.`],
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
