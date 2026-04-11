// ══════════════════════════════════════════════════════════════════════════════
// DATA — AGGREGATOR
// Thin re-export facade over ./data/*. Other modules import from './data.js'
// and get everything; the actual content lives in ./data/classes.js,
// ./data/equipment.js, ./data/quests.js, and ./data/util.js.
// Edit those files directly — this aggregator should not need changes.
// ══════════════════════════════════════════════════════════════════════════════

export {
  CLASSES,
  NAMES,
  getClass,
  computeBaseStats,
  randomName,
  getAvailableClasses,
  getRecruitCost,
} from './data/classes.js';

export {
  ITEM_RARITIES,
  EQUIPMENT,
  LOOT_ITEMS,
  getItem,
  canClassEquip,
  getItemRarity,
} from './data/equipment.js';

export {
  RANK_ORDER,
  QUESTS,
  getQuest,
  rankIndex,
} from './data/quests.js';

export { randInt } from './data/util.js';
