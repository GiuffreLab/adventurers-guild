// ══════════════════════════════════════════════════════════════════════════════
// SKILLS — AGGREGATOR
// Merges class/mastery/spec/legacy/equipment/talent skill maps into one SKILLS
// registry and exposes helper lookup functions. Category files are the source
// of truth; edits should be made there, not in this index.
// ══════════════════════════════════════════════════════════════════════════════

import { CLASS_SKILLS } from './class-skills.js';
import { MASTERIES } from './masteries.js';
import { SPEC_SKILLS } from './spec-skills.js';
import { LEGACY_SKILLS } from './legacy-skills.js';
import { EQUIPMENT_SKILLS } from './equipment-skills.js';
import { TALENTS } from './talents.js';

export const SKILLS = {
  ...CLASS_SKILLS,
  ...MASTERIES,
  ...SPEC_SKILLS,
  ...LEGACY_SKILLS,
  ...EQUIPMENT_SKILLS,
  ...TALENTS,
};

// Re-export category maps so other modules can import them directly if needed.
export { CLASS_SKILLS, MASTERIES, SPEC_SKILLS, LEGACY_SKILLS, EQUIPMENT_SKILLS, TALENTS };

// ══════════════════════════════════════════════════════════════════════════════
// HERO SPECIALIZATIONS CONFIG
// ══════════════════════════════════════════════════════════════════════════════

export const HERO_SPECS = {
  vanguard: {
    id: 'vanguard', label: 'Vanguard', icon: '🛡',
    description: 'Full tank. Intercepts hits, boosts defense, survives lethal blows.',
    skills: ['VANGUARDS_OATH', 'IRON_BASTION', 'UNBREAKABLE_WILL'],
  },
  champion: {
    id: 'champion', label: 'Champion', icon: '⚔',
    description: 'Full DPS. Executes weakened foes, grows stronger with kills, devastating crits.',
    skills: ['EXECUTIONERS_MARK', 'BLOODLUST', 'HEROS_WRATH'],
  },
  warden: {
    id: 'warden', label: 'Warden', icon: '🚩',
    description: 'Support/buffer. Emergency heals, powerful party aura, mass revive.',
    skills: ['GUARDIAN_SPIRIT', 'WAR_BANNER', 'SECOND_DAWN'],
  },
};

// Respec costs scale with party rank (75% of gem bag sell value)
export const HERO_RESPEC_COSTS = {
  F: 7500, E: 13500, D: 22500, C: 37500, B: 56250, A: 90000, S: 187500,
};

// Baseline Hero class skills replaced by spec picks (§3.1.1).
// When a Hero selects a spec, these are stripped from their class skill list
// and the three spec skills take their L10/L14/L18 slots instead.
export const HERO_SPEC_REPLACED_SKILLS = ['AWAKENING', 'SECOND_WIND', 'HERO_ULTIMA'];

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

export function getSkill(skillId) {
  return SKILLS[skillId] || null;
}

// ── Class Skills ──

export function getClassSkills(classId) {
  return Object.values(SKILLS)
    .filter(s => s.source === 'class' && s.classId === classId)
    .sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
}

export function getUnlockedClassSkills(classId, level) {
  return getClassSkills(classId).filter(s => s.unlockLevel && s.unlockLevel <= level);
}

export function getNextClassSkill(classId, currentLevel) {
  return getClassSkills(classId).find(s => s.unlockLevel && s.unlockLevel > currentLevel) || null;
}

// ── Class Masteries ──

export function getClassMasteries(classId) {
  return Object.values(SKILLS)
    .filter(s => s.source === 'mastery' && s.classId === classId)
    .sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
}

export function getUnlockedClassMasteries(classId, level) {
  return getClassMasteries(classId).filter(s => s.unlockLevel && s.unlockLevel <= level);
}

export function getNextClassMastery(classId, currentLevel) {
  return getClassMasteries(classId).find(s => s.unlockLevel && s.unlockLevel > currentLevel) || null;
}

// ── Equipment Skills ──

export function getEquipmentSkill(itemId) {
  return Object.values(SKILLS).find(s => s.source === 'equipment' && s.itemId === itemId) || null;
}

// ── Specialization Skills ──

export function getSpecSkills(specTrack) {
  if (!specTrack || !HERO_SPECS[specTrack]) return [];
  return HERO_SPECS[specTrack].skills.map(id => SKILLS[id]).filter(Boolean)
    .sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
}

export function getUnlockedSpecSkills(specTrack, level) {
  return getSpecSkills(specTrack).filter(s => s.unlockLevel && s.unlockLevel <= level);
}

export function getNextSpecSkill(specTrack, currentLevel) {
  return getSpecSkills(specTrack).find(s => s.unlockLevel && s.unlockLevel > currentLevel) || null;
}

// ── Combined unlocks (for UI display) ──

export function getAllClassUnlocks(classId) {
  const skills = getClassSkills(classId).map(s => ({ ...s, unlockType: 'skill' }));
  const masteries = getClassMasteries(classId).map(s => ({ ...s, unlockType: 'mastery' }));
  return [...skills, ...masteries].sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
}

export function getNextUnlock(classId, currentLevel) {
  return getAllClassUnlocks(classId).find(s => s.unlockLevel && s.unlockLevel > currentLevel) || null;
}

// ── Legacy compatibility (old mastery system was quest-count-based) ──
// These are kept for backward compatibility but now return empty/null
export function getMasterySkill(_questsCompleted) { return null; }
export function getAllMasterySkills() { return []; }
export function getNextMasterySkill(_questsCompleted) { return null; }

// ── Skill computation helpers ──

export function getMemberActiveSkills(member, _party) {
  if (!member || !member.skills) return [];
  return member.skills
    .map(skillId => getSkill(skillId))
    .filter(Boolean)
    .filter(skill => skill.type === 'active');
}

export function getMemberPassiveSkills(member, _party) {
  if (!member || !member.skills) return [];
  return member.skills
    .map(skillId => getSkill(skillId))
    .filter(Boolean)
    .filter(skill => skill.type === 'passive');
}

/**
 * Collect all party-wide aura bonuses from all members' passive skills.
 * Returns an object like { atk: 0.15, def: 0.08, mag: 0.06, spd: 0.10, ... }
 * where each value is the total multiplicative bonus from all party auras.
 * Only considers passive skills (type === 'passive' or procChance === 1.0).
 */
export function collectPartyAuras(members) {
  const auras = { atk: 0, def: 0, mag: 0, spd: 0, crit: 0, dodge: 0, maxHp: 0, heal: 0 };
  if (!members || !Array.isArray(members)) return auras;
  for (const member of members) {
    if (!member || !member.skills) continue;
    const skills = member.skills.map(sid => getSkill(sid)).filter(Boolean);
    for (const skill of skills) {
      // Only passive skills contribute party auras (always-on)
      if (skill.type !== 'passive' && skill.procChance < 1.0) continue;
      if (!skill.effects) continue;
      for (const [key, value] of Object.entries(skill.effects)) {
        if (!key.startsWith('party')) continue;
        // Map partyAtkBonus → atk, partyDefBonus → def, etc.
        const stat = key.replace(/^party/, '').replace(/Bonus$/, '').replace(/Pct$/, '').toLowerCase();
        if (stat === 'atk') auras.atk += value;
        else if (stat === 'def') auras.def += value;
        else if (stat === 'mag') auras.mag += value;
        else if (stat === 'spd') auras.spd += value;
        else if (stat === 'crit') auras.crit += value;
        else if (stat === 'dodge') auras.dodge += value;
        else if (stat === 'hp' || stat === 'maxhp') auras.maxHp += value;
        else if (stat === 'heal') auras.heal += value;
      }
    }
  }
  return auras;
}

export function applyPassiveSkills(stats, member, party) {
  const passives = getMemberPassiveSkills(member, party);
  for (const skill of passives) {
    if (!skill.effects) continue;
    for (const [key, value] of Object.entries(skill.effects)) {
      // Skip party-wide bonuses here (applied separately)
      if (key.startsWith('party')) continue;
      if (key === 'powerMultiplier') continue;
      // Handle special keys before generic stat mapping
      if (key === 'dodgeChance') {
        stats.dodgeChance = (stats.dodgeChance || 0) + value;
        continue;
      }
      if (key === 'critChance') {
        stats.critChance = (stats.critChance || 0) + value;
        continue;
      }
      if (key === 'healBonus') {
        stats.healBonus = (stats.healBonus || 0) + value;
        continue;
      }
      // Map effect key → stat key (atkBonus→atk, defBonus→def, etc.)
      const statKey = key.replace(/Bonus$/, '').replace(/Chance$/, '');
      if (['atk', 'def', 'spd', 'mag', 'crit', 'dodge'].includes(statKey)) {
        stats[statKey] = Math.floor((stats[statKey] || 0) * (1 + value));
      } else if (statKey === 'maxHp') {
        stats.maxHp = Math.floor((stats.maxHp || 100) * (1 + value));
      }
    }
  }
  return stats;
}

export function rollActiveSkills(member, party) {
  const actives = getMemberActiveSkills(member, party);
  const triggered = [];
  for (const skill of actives) {
    if (Math.random() < (skill.procChance || 1.0)) {
      triggered.push(skill);
    }
  }
  return triggered;
}
