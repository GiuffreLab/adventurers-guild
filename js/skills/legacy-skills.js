// Legacy skills — retired but kept for save-compat lookups (source: legacy)

export const LEGACY_SKILLS = {
  KI_BARRIER: {
    id: 'KI_BARRIER', name: 'Ki Barrier', type: 'active', source: 'legacy',
    classId: 'MONK', unlockLevel: 99,
    description: '[Retired] Channels ki into a protective aura. Flavor preserved via the Ki Barrier Resurgence talent — see Pressure Point.',
    icon: '🔮', effects: { defBonus: 0.20, dodgeChance: 0.12 }, procChance: 0.65,
    narrative: 'surrounds themselves with a shimmering Ki Barrier!',
  },
  INNER_FOCUS: {
    id: 'INNER_FOCUS', name: 'Inner Focus', type: 'active', source: 'legacy',
    classId: 'MONK', unlockLevel: 99,
    description: '[Retired] All-stats self buff. Flavor preserved by the Enlightenment (L16) and Transcendence (L20) masteries.',
    icon: '☯', effects: { atkBonus: 0.15, defBonus: 0.15, spdBonus: 0.15, magBonus: 0.15, dodgeBonus: 0.15, dodgeChance: 0.15 }, procChance: 0.50,
    narrative: 'enters a state of perfect Inner Focus — mind, body, and spirit align!',
  },
  COUNTER_STANCE: {
    id: 'COUNTER_STANCE', name: 'Counter Stance', type: 'passive', source: 'legacy',
    classId: 'MONK', unlockLevel: 99,
    description: '[Retired] Counter-focused stance. Flavor preserved via the Iron Stance talent — see Flowing Strike.',
    icon: '🤺', effects: { atkBonus: 0.12, defBonus: 0.12, critChance: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  DARK_PACT: {
    id: 'DARK_PACT', name: 'Dark Pact', type: 'active', source: 'legacy',
    classId: 'NECROMANCER', unlockLevel: 99,
    description: '[Retired] Party retaliation + life siphon. Flavor migrated into Shadow Bolt (party leech) and Shroud of Decay (necrotic reflect).',
    icon: '🩸', effects: { darkPact: true, pactDuration: 3 }, procChance: 0.55,
    narrative: 'weaves a Dark Pact — dark energy binds the party to their foes!',
  },
};
