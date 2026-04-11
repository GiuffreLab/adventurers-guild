// ══════════════════════════════════════════════════════════════════════════════
// SKILLS — AGGREGATOR
// Thin re-export facade over ./skills/*. Other modules import from './skills.js'
// and get everything; the actual content lives in ./skills/class-skills.js,
// ./skills/masteries.js, ./skills/spec-skills.js, ./skills/legacy-skills.js,
// ./skills/equipment-skills.js, ./skills/talents.js, and ./skills/index.js.
// Edit those files directly — this aggregator should not need changes.
// ══════════════════════════════════════════════════════════════════════════════

export {
  SKILLS,
  CLASS_SKILLS,
  MASTERIES,
  SPEC_SKILLS,
  LEGACY_SKILLS,
  EQUIPMENT_SKILLS,
  TALENTS,
  HERO_SPECS,
  HERO_RESPEC_COSTS,
  HERO_SPEC_REPLACED_SKILLS,
  getSkill,
  getClassSkills,
  getUnlockedClassSkills,
  getNextClassSkill,
  getClassMasteries,
  getUnlockedClassMasteries,
  getNextClassMastery,
  getEquipmentSkill,
  getSpecSkills,
  getUnlockedSpecSkills,
  getNextSpecSkill,
  getAllClassUnlocks,
  getNextUnlock,
  getMasterySkill,
  getAllMasterySkills,
  getNextMasterySkill,
  getMemberActiveSkills,
  getMemberPassiveSkills,
  collectPartyAuras,
  applyPassiveSkills,
  rollActiveSkills,
} from './skills/index.js';
