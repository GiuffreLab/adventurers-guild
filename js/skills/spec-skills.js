// Specialization skills — granted by Hero spec tracks (source: spec)

export const SPEC_SKILLS = {
  VANGUARDS_OATH: {
    id: 'VANGUARDS_OATH', name: 'Vanguard\'s Oath', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'vanguard', unlockLevel: 10,
    description: 'SPEC — Reactive intercept. Absorbs a hit meant for an ally, reducing damage taken by 40%. 3-round cooldown.',
    icon: '🛡', effects: { dmgReduction: 0.40 }, procChance: 1.0, reactive: true, cooldown: 3,
    narrative: 'steps forward with an oath of protection — Vanguard\'s Oath!',
  },
  IRON_BASTION: {
    id: 'IRON_BASTION', name: 'Iron Bastion', type: 'passive', source: 'spec',
    classId: 'HERO', specTrack: 'vanguard', unlockLevel: 14,
    description: 'SPEC — Self DEF +20%, max HP +15%, party DEF +6%, party ATK +4%, party SPD +3%. The Vanguard\'s stand inspires the team.',
    icon: '🏰', effects: { defBonus: 0.20, maxHpBonus: 0.15, partyDefBonus: 0.06, partyAtkBonus: 0.04, partySpdBonus: 0.03 }, procChance: 1.0,
    narrative: null,
  },
  UNBREAKABLE_WILL: {
    id: 'UNBREAKABLE_WILL', name: 'Unbreakable Will', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'vanguard', unlockLevel: 18,
    description: 'EPIC SPEC — Survives a killing blow at 1 HP with 80% damage reduction for 2 rounds. 5-round cooldown.',
    icon: '💎', effects: { surviveKO: true, dmgReduction: 0.80, drDuration: 2 }, procChance: 1.0, reactive: true, cooldown: 5,
    narrative: 'refuses to fall — Unbreakable Will!',
  },
  EXECUTIONERS_MARK: {
    id: 'EXECUTIONERS_MARK', name: 'Executioner\'s Mark', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'champion', unlockLevel: 10,
    description: 'SPEC — When any enemy drops below 30% HP, marks them for the kill — all allies deal +10% damage to the marked target for 2 rounds. The Champion also strikes for 2.0× ATK. 3-round cooldown.',
    icon: '🎯', effects: { executeThreshold: 0.30, executeMult: 2.0, executeMarkBonus: 0.10, executeMarkDuration: 2 }, procChance: 1.0, reactive: true, cooldown: 3,
    narrative: 'marks the weakened foe — Executioner\'s Mark! The pack closes in!',
  },
  BLOODLUST: {
    id: 'BLOODLUST', name: 'Bloodlust', type: 'passive', source: 'spec',
    classId: 'HERO', specTrack: 'champion', unlockLevel: 14,
    description: 'SPEC — ATK +15%, CRIT +10%, SPD +10%, party CRIT +5%, party ATK +4%. On kill, next attack deals 1.5× damage. The Champion\'s bloodlust is contagious.',
    icon: '🩸', effects: { atkBonus: 0.15, critChance: 0.10, spdBonus: 0.10, partyCritBonus: 0.05, partyAtkBonus: 0.04 }, procChance: 1.0,
    narrative: null,
  },
  HEROS_WRATH: {
    id: 'HEROS_WRATH', name: 'Hero\'s Wrath', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'champion', unlockLevel: 18,
    description: 'EPIC SPEC — Guaranteed 3.0× critical hit. 45% proc.',
    icon: '⚡', effects: { powerMultiplier: 3.0, guaranteedCrit: true }, procChance: 0.45,
    narrative: 'unleashes devastating fury — HERO\'S WRATH!',
  },
  GUARDIAN_SPIRIT: {
    id: 'GUARDIAN_SPIRIT', name: 'Guardian Spirit', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'warden', unlockLevel: 10,
    description: 'SPEC — Reactive heal. When an ally drops below 25% HP, heals them for 30% of their max HP. 3-round cooldown.',
    icon: '💚', effects: { healThreshold: 0.25, healPercent: 0.30 }, procChance: 1.0, reactive: true, cooldown: 3,
    narrative: 'calls upon a Guardian Spirit — healing light washes over the wounded!',
  },
  WAR_BANNER: {
    id: 'WAR_BANNER', name: 'War Banner', type: 'passive', source: 'spec',
    classId: 'HERO', specTrack: 'warden', unlockLevel: 14,
    description: 'SPEC — Party aura: ATK +5%, DEF +4%, SPD +4%, CRIT +3%, MAX HP +3%. The Warden\'s banner touches every stat — breadth over depth.',
    icon: '🚩', effects: { partyAtkBonus: 0.05, partyDefBonus: 0.04, partySpdBonus: 0.04, partyCritBonus: 0.03, partyHpBonus: 0.03 }, procChance: 1.0,
    narrative: null,
  },
  SECOND_DAWN: {
    id: 'SECOND_DAWN', name: 'Second Dawn', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'warden', unlockLevel: 18,
    description: 'EPIC SPEC — When 2+ allies are KO\'d, revives all fallen allies at 25% HP. Once per fight.',
    icon: '🌅', effects: { reviveAllPercent: 0.25, koThreshold: 2 }, procChance: 1.0, reactive: true, cooldown: 999,
    narrative: 'plants the banner and roars — LAST STAND! Fallen allies rise again!',
  },
};
