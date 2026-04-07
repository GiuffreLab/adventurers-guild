// Comprehensive Skills & Abilities System
// Includes class skills, equipment skills, and mastery skills

export const SKILLS = {
  // ── HERO CLASS SKILLS ──────────────────────────────────────────────────────
  HEROIC_STRIKE: {
    id: 'HEROIC_STRIKE', name: 'Heroic Strike', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 3,
    description: 'A powerful strike fueled by otherworldly determination.',
    icon: '⚔', effects: { atkBonus: 0.15 }, procChance: 1.0,
    narrative: 'unleashes a devastating Heroic Strike!',
  },
  RALLY_CRY: {
    id: 'RALLY_CRY', name: 'Rally Cry', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 5,
    description: 'When any ally drops below 30% HP, the Hero rallies them — restoring 15% HP and granting +10% ATK for 3 rounds.',
    icon: '📣', effects: { rallyTrigger: true, rallyHealPct: 0.15, rallyAtkBuff: 0.10 }, procChance: 1.0, cooldown: 4,
    narrative: 'lets out a Rally Cry — the party fights on with renewed vigor!',
  },
  LEADERS_AURA: {
    id: 'LEADERS_AURA', name: 'Leader\'s Aura', type: 'passive', source: 'class',
    classId: 'HERO', unlockLevel: 8,
    description: 'Party gains +5% ATK and +3% DEF.',
    icon: '✨', effects: { partyAtkBonus: 0.05, partyDefBonus: 0.03 }, procChance: 1.0,
    narrative: null,
  },
  BLADE_MASTERY: {
    id: 'BLADE_MASTERY', name: 'Blade Mastery', type: 'passive', source: 'class',
    classId: 'HERO', unlockLevel: 12,
    description: 'Grants +15% ATK.',
    icon: '🗡', effects: { atkBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  AWAKENING: {
    id: 'AWAKENING', name: 'Awakening', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 15,
    description: 'Taps into otherworldly power for a devastating 1.8× boost. 40% proc.',
    icon: '⭐', effects: { powerMultiplier: 1.8 }, procChance: 0.40,
    narrative: 'taps into their otherworldly power for a devastating boost!',
  },

  // ── KNIGHT CLASS SKILLS ────────────────────────────────────────────────────
  SHIELD_WALL: {
    id: 'SHIELD_WALL', name: 'Shield Wall', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 3,
    description: 'Raises DEF by 25% for the quest.',
    icon: '🛡', effects: { defBonus: 0.25 }, procChance: 1.0,
    narrative: 'plants their shield firmly and braces for impact!',
  },
  IRON_CONSTITUTION: {
    id: 'IRON_CONSTITUTION', name: 'Iron Constitution', type: 'passive', source: 'class',
    classId: 'KNIGHT', unlockLevel: 6,
    description: 'DEF +20%, MAX HP +25%.',
    icon: '🪨', effects: { defBonus: 0.20, hpBonus: 0.25 }, procChance: 1.0,
    narrative: null,
  },
  LAST_STAND: {
    id: 'LAST_STAND', name: 'Last Stand', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 10,
    description: 'Reduces damage taken by 30% when heavily damaged. 50% proc.',
    icon: '⚒', effects: { defBonus: 0.30 }, procChance: 0.50,
    narrative: 'digs in for their Last Stand!',
  },
  BULWARK: {
    id: 'BULWARK', name: 'Bulwark', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 14,
    description: 'Every 3 rounds, intercepts an attack aimed at an ally and absorbs the damage.',
    icon: '🛡', effects: { bulwark: true }, procChance: 1.0, cooldown: 3,
    narrative: 'raises their shield and absorbs the blow for an ally!',
  },
  UNBREAKABLE: {
    id: 'UNBREAKABLE', name: 'Unbreakable', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 15,
    description: 'Becomes an immovable fortress, absorbing damage for the party. 1.6× power. 35% proc.',
    icon: '🏰', effects: { powerMultiplier: 1.6, defBonus: 0.50 }, procChance: 0.35,
    narrative: 'becomes an Unbreakable wall of steel and will!',
  },

  // ── MAGE CLASS SKILLS ──────────────────────────────────────────────────────
  MANA_SURGE: {
    id: 'MANA_SURGE', name: 'Mana Surge', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 3,
    description: 'Boosts MAG by 30% for the quest.',
    icon: '🔵', effects: { magBonus: 0.30 }, procChance: 1.0,
    narrative: 'channels a Mana Surge through their form!',
  },
  ARCANE_MASTERY: {
    id: 'ARCANE_MASTERY', name: 'Arcane Mastery', type: 'passive', source: 'class',
    classId: 'MAGE', unlockLevel: 5,
    description: 'Grants +25% MAG.',
    icon: '✧', effects: { magBonus: 0.25 }, procChance: 1.0,
    narrative: null,
  },
  SPELL_ECHO: {
    id: 'SPELL_ECHO', name: 'Spell Echo', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 9,
    description: 'Spells hit twice! 35% proc chance.',
    icon: '🌀', effects: { powerMultiplier: 1.6 }, procChance: 0.35,
    narrative: 'casts with a resonating Spell Echo!',
  },
  MYSTIC_CONVERGENCE: {
    id: 'MYSTIC_CONVERGENCE', name: 'Mystic Convergence', type: 'passive', source: 'class',
    classId: 'MAGE', unlockLevel: 13,
    description: 'MAG +35%, SPD +10%.',
    icon: '💫', effects: { magBonus: 0.35, spdBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  METEOR_STORM: {
    id: 'METEOR_STORM', name: 'Meteor Storm', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 15,
    description: 'Calls down a cataclysmic meteor storm. 2.0× power. 30% proc.',
    icon: '☄', effects: { powerMultiplier: 2.0 }, procChance: 0.30,
    narrative: 'calls down a Meteor Storm that obliterates everything in its path!',
  },

  // ── ROGUE CLASS SKILLS ─────────────────────────────────────────────────────
  SHADOW_STRIKE: {
    id: 'SHADOW_STRIKE', name: 'Shadow Strike', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 2,
    description: 'Swift attack with 60% bonus damage and high crit.',
    icon: '🗡', effects: { atkBonus: 0.60, critChance: 0.25 }, procChance: 0.70,
    narrative: 'moves like a shadow and strikes with precision!',
  },
  EVASION: {
    id: 'EVASION', name: 'Evasion', type: 'passive', source: 'class',
    classId: 'ROGUE', unlockLevel: 4,
    description: 'Grants +15% dodge chance.',
    icon: '💨', effects: { dodgeChance: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  MARK_FOR_DEATH: {
    id: 'MARK_FOR_DEATH', name: 'Mark for Death', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 8,
    description: 'On crit, marks the target — all party members deal +20% damage to it for 2 rounds.',
    icon: '🎯', effects: { markDmgAmp: 0.20, markDuration: 2 }, procChance: 1.0,
    narrative: 'exposes a critical weakness — the target is Marked for Death!',
  },
  ACROBATICS: {
    id: 'ACROBATICS', name: 'Acrobatics', type: 'passive', source: 'class',
    classId: 'ROGUE', unlockLevel: 12,
    description: 'SPD +25%, Dodge +20%.',
    icon: '🤸', effects: { spdBonus: 0.25, dodgeChance: 0.20 }, procChance: 1.0,
    narrative: null,
  },
  ASSASSINATE: {
    id: 'ASSASSINATE', name: 'Assassinate', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 15,
    description: 'Strikes from the shadows for massive single-target damage. 1.9× power. 30% proc.',
    icon: '💀', effects: { powerMultiplier: 1.9, critChance: 0.50 }, procChance: 0.30,
    narrative: 'emerges from nowhere — Assassinate! The target never saw it coming!',
  },

  // ── CLERIC CLASS SKILLS ────────────────────────────────────────────────────
  HOLY_LIGHT: {
    id: 'HOLY_LIGHT', name: 'Holy Light', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 3,
    description: 'Heals all party members during combat, reducing injuries by 20%.',
    icon: '✨', effects: { partyHealPct: 0.20 }, procChance: 1.0,
    narrative: 'calls down Holy Light upon the party!',
  },
  BLESSING: {
    id: 'BLESSING', name: 'Blessing', type: 'passive', source: 'class',
    classId: 'CLERIC', unlockLevel: 5,
    description: 'Party gains +8% DEF and +5% MAX HP.',
    icon: '🙏', effects: { partyDefBonus: 0.08, partyHpBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  PURIFY: {
    id: 'PURIFY', name: 'Purify', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 7,
    description: 'Cleanses negative effects and restores party vigor. Reduces injuries by 15%. 70% proc.',
    icon: '💧', effects: { partyHealPct: 0.15, partyDefBonus: 0.05 }, procChance: 0.70,
    narrative: 'channels Purify — a wave of holy water washes over the party!',
  },
  DIVINE_SHIELD: {
    id: 'DIVINE_SHIELD', name: 'Divine Shield', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 10,
    description: 'Shields an ally, absorbing damage. 50% proc.',
    icon: '⛑', effects: { defBonus: 0.35 }, procChance: 0.50,
    narrative: 'summons a Divine Shield to protect!',
  },
  SANCTITY: {
    id: 'SANCTITY', name: 'Sanctity', type: 'passive', source: 'class',
    classId: 'CLERIC', unlockLevel: 13,
    description: 'MAG +20%, Party DEF +10%.',
    icon: '⛪', effects: { magBonus: 0.20, partyDefBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  DIVINE_INTERVENTION: {
    id: 'DIVINE_INTERVENTION', name: 'Divine Intervention', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 15,
    description: 'Calls upon divine power to massively heal and shield the entire party. 1.5× power. 35% proc.',
    icon: '🕊', effects: { powerMultiplier: 1.5, partyHealPct: 0.30, partyDefBonus: 0.20 }, procChance: 0.35,
    narrative: 'calls upon Divine Intervention — the heavens answer!',
  },

  // ── RANGER CLASS SKILLS ────────────────────────────────────────────────────
  PRECISION_SHOT: {
    id: 'PRECISION_SHOT', name: 'Precision Shot', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 3,
    description: 'Accurate shot with guaranteed crit. 50% proc.',
    icon: '🏹', effects: { atkBonus: 0.40, critChance: 0.50 }, procChance: 0.50,
    narrative: 'draws their bow and releases a Precision Shot!',
  },
  WILDERNESS_MASTERY: {
    id: 'WILDERNESS_MASTERY', name: 'Wilderness Mastery', type: 'passive', source: 'class',
    classId: 'RANGER', unlockLevel: 6,
    description: '+20% gold and exp from quests.',
    icon: '🌲', effects: { goldBonus: 0.20, expBonus: 0.20 }, procChance: 1.0,
    narrative: null,
  },
  VOLLEY: {
    id: 'VOLLEY', name: 'Volley', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 10,
    description: 'Fires a rain of arrows that strikes ALL enemies for 60% damage each. 40% proc.',
    icon: '🎯', effects: { volleyAoe: true, volleyDmgPct: 0.60 }, procChance: 0.40,
    narrative: 'launches a Volley — arrows rain down on every foe!',
  },
  HUNTER_INSTINCT: {
    id: 'HUNTER_INSTINCT', name: 'Hunter Instinct', type: 'passive', source: 'class',
    classId: 'RANGER', unlockLevel: 14,
    description: 'ATK +18%, SPD +15%, Gold +25%, Exp +25%.',
    icon: '🐺', effects: { atkBonus: 0.18, spdBonus: 0.15, goldBonus: 0.25, expBonus: 0.25 }, procChance: 1.0,
    narrative: null,
  },
  ARROW_STORM: {
    id: 'ARROW_STORM', name: 'Arrow Storm', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 15,
    description: 'Blankets the battlefield in a storm of arrows. 1.7× power. 35% proc.',
    icon: '🌧', effects: { powerMultiplier: 1.7, atkBonus: 0.30 }, procChance: 0.35,
    narrative: 'darkens the sky — Arrow Storm rains devastation on every foe!',
  },

  // ── BARD CLASS SKILLS ──────────────────────────────────────────────────────
  INSPIRING_SONG: {
    id: 'INSPIRING_SONG', name: 'Inspiring Song', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 3,
    description: 'Uplifting song boosts the entire party — ATK +12%, SPD +10%.',
    icon: '🎵', effects: { partyAtkBonus: 0.12, partySpdBonus: 0.10 }, procChance: 1.0,
    narrative: 'plays an Inspiring Song that lifts all spirits!',
  },
  CHARM: {
    id: 'CHARM', name: 'Charm', type: 'passive', source: 'class',
    classId: 'BARD', unlockLevel: 5,
    description: 'Natural charisma grants +30% LUCK and +15% gold rewards.',
    icon: '💝', effects: { lckBonus: 0.30, goldBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  WAR_DRUM: {
    id: 'WAR_DRUM', name: 'War Drum', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 8,
    description: 'Pounding rhythm that drives the party to fight harder. Party ATK +15%, DEF +10%. 65% proc.',
    icon: '🥁', effects: { partyAtkBonus: 0.15, partyDefBonus: 0.10 }, procChance: 0.65,
    narrative: 'beats the War Drum — the party fights with renewed ferocity!',
  },
  BALLAD_OF_FORTITUDE: {
    id: 'BALLAD_OF_FORTITUDE', name: 'Ballad of Fortitude', type: 'passive', source: 'class',
    classId: 'BARD', unlockLevel: 12,
    description: 'Ongoing ballad bolsters the party — Party DEF +8%, Party SPD +8%, LCK +15%.',
    icon: '🎶', effects: { partyDefBonus: 0.08, partySpdBonus: 0.08, lckBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  MAGNUM_OPUS: {
    id: 'MAGNUM_OPUS', name: 'Magnum Opus', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 15,
    description: 'A legendary performance that empowers every ally to peak form. 1.5× party power. 30% proc.',
    icon: '🎼', effects: { powerMultiplier: 1.5, partyAtkBonus: 0.20, partyDefBonus: 0.15, partySpdBonus: 0.15 }, procChance: 0.30,
    narrative: 'performs their Magnum Opus — the entire party transcends their limits!',
  },

  // ── MONK CLASS SKILLS ──────────────────────────────────────────────────────
  SWIFT_PALM: {
    id: 'SWIFT_PALM', name: 'Swift Palm', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 3,
    description: 'Lightning-fast combo strike. 55% proc.',
    icon: '👊', effects: { atkBonus: 0.50, spdBonus: 0.20 }, procChance: 0.55,
    narrative: 'executes a Swift Palm combo!',
  },
  BALANCE: {
    id: 'BALANCE', name: 'Balance', type: 'passive', source: 'class',
    classId: 'MONK', unlockLevel: 5,
    description: 'All stats +8%, SPD +12%.',
    icon: '⚖', effects: { atkBonus: 0.08, defBonus: 0.08, spdBonus: 0.12, magBonus: 0.08, lckBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  KI_BARRIER: {
    id: 'KI_BARRIER', name: 'Ki Barrier', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 9,
    description: 'Channels ki to heal 25% of damage dealt back as HP. Lasts the entire battle.',
    icon: '🔮', effects: { kiBarrier: true, lifeStealPct: 0.25 }, procChance: 1.0,
    narrative: 'surrounds themselves with a shimmering Ki Barrier!',
  },
  ENLIGHTENMENT: {
    id: 'ENLIGHTENMENT', name: 'Enlightenment', type: 'passive', source: 'class',
    classId: 'MONK', unlockLevel: 13,
    description: 'All core stats +15%, Dodge +15%. Perfectly balanced power.',
    icon: '☯', effects: { atkBonus: 0.15, defBonus: 0.15, spdBonus: 0.15, magBonus: 0.15, lckBonus: 0.15, dodgeChance: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  FISTS_OF_FURY: {
    id: 'FISTS_OF_FURY', name: 'Fists of Fury', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 15,
    description: 'Unleashes a rapid barrage of strikes channeling pure ki. 1.7× power. 35% proc.',
    icon: '👊', effects: { powerMultiplier: 1.7, atkBonus: 0.30, spdBonus: 0.20 }, procChance: 0.35,
    narrative: 'enters a trance and unleashes Fists of Fury — a storm of blows!',
  },

  // ── EQUIPMENT-GRANTED SKILLS ──────────────────────────────────────────────
  STARLIGHT_SLASH: {
    id: 'STARLIGHT_SLASH', name: 'Starlight Slash', type: 'active', source: 'equipment',
    itemId: 'MYTHRIL_BLADE', unlockLevel: null,
    description: 'Mythril Blade grants a chance for bonus damage.',
    icon: '⚡', effects: { atkBonus: 0.50, critChance: 0.20 }, procChance: 0.45,
    narrative: 'slashes with starlight from the Mythril Blade!',
  },
  MANA_OVERLOAD: {
    id: 'MANA_OVERLOAD', name: 'Mana Overload', type: 'active', source: 'equipment',
    itemId: 'CRYSTAL_STAFF', unlockLevel: null,
    description: 'Crystal Staff overloads with mana for massive damage.',
    icon: '💥', effects: { magBonus: 0.60 }, procChance: 0.50,
    narrative: 'channels a Mana Overload through the Crystal Staff!',
  },
  VANISH: {
    id: 'VANISH', name: 'Vanish', type: 'active', source: 'equipment',
    itemId: 'SHADOW_CHAIN', unlockLevel: null,
    description: 'Shadow Chainmail grants a chance to avoid all damage.',
    icon: '👻', effects: { dodgeChance: 0.30 }, procChance: 0.40,
    narrative: 'vanishes into the shadows!',
  },
  MYTHRIL_BARRIER: {
    id: 'MYTHRIL_BARRIER', name: 'Mythril Barrier', type: 'active', source: 'equipment',
    itemId: 'MYTHRIL_PLATE', unlockLevel: null,
    description: 'Mythril Plate creates a protective barrier.',
    icon: '🛡', effects: { defBonus: 0.35 }, procChance: 0.50,
    narrative: 'activates a Mythril Barrier!',
  },
  ARCANE_RESONANCE: {
    id: 'ARCANE_RESONANCE', name: 'Arcane Resonance', type: 'passive', source: 'equipment',
    itemId: 'CRYSTAL_ORB', unlockLevel: null,
    description: 'Crystal Orb grants +15% MAG and +8% accuracy.',
    icon: '✦', effects: { magBonus: 0.15, atkBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  POWER_SURGE: {
    id: 'POWER_SURGE', name: 'Power Surge', type: 'active', source: 'equipment',
    itemId: 'POWER_STONE', unlockLevel: null,
    description: 'Power Stone releases a surge of raw energy.',
    icon: '⚡', effects: { powerMultiplier: 1.5 }, procChance: 0.55,
    narrative: 'unleashes a Power Surge from the stone!',
  },
  POISON_BLADE: {
    id: 'POISON_BLADE', name: 'Poison Blade', type: 'active', source: 'equipment',
    itemId: 'VENOM_FANG', unlockLevel: null,
    description: 'Venom Fang coats attacks in deadly poison, dealing bonus damage over time.',
    icon: '🐍', effects: { atkBonus: 0.45, critChance: 0.15 }, procChance: 0.55,
    narrative: 'coats the Venom Fang in deadly poison and strikes!',
  },
  DUAL_THRUST: {
    id: 'DUAL_THRUST', name: 'Dual Thrust', type: 'active', source: 'equipment',
    itemId: 'SHADOW_EDGE', unlockLevel: null,
    description: 'Shadow Edge strikes twice in a single heartbeat. Devastating burst damage.',
    icon: '⚔', effects: { atkBonus: 0.80, spdBonus: 0.20, critChance: 0.30 }, procChance: 0.50,
    narrative: 'thrusts the Shadow Edge twice in the blink of an eye!',
  },
  WIND_SHOT: {
    id: 'WIND_SHOT', name: 'Wind Shot', type: 'active', source: 'equipment',
    itemId: 'GALEWIND_BOW', unlockLevel: null,
    description: 'Galewind Bow fires a wind-charged arrow that never misses.',
    icon: '🌬', effects: { atkBonus: 0.55, spdBonus: 0.15 }, procChance: 0.50,
    narrative: 'fires a wind-charged arrow that streaks across the battlefield!',
  },
  STORM_VOLLEY: {
    id: 'STORM_VOLLEY', name: 'Storm Volley', type: 'active', source: 'equipment',
    itemId: 'STORMREND_BOW', unlockLevel: null,
    description: 'Stormrend Bow unleashes a volley of lightning-charged arrows.',
    icon: '⚡', effects: { atkBonus: 0.70, spdBonus: 0.20, critChance: 0.25 }, procChance: 0.50,
    narrative: 'unleashes a Storm Volley — lightning crackles from every arrow!',
  },
  CLEAVING_STRIKE: {
    id: 'CLEAVING_STRIKE', name: 'Cleaving Strike', type: 'active', source: 'equipment',
    itemId: 'FLAMBERGE', unlockLevel: null,
    description: 'Flamberge cleaves through armor with a devastating two-handed strike.',
    icon: '⚔', effects: { atkBonus: 0.75, defPierce: 0.30 }, procChance: 0.50,
    narrative: 'brings the Flamberge down in a devastating Cleaving Strike!',
  },
  TIGER_STRIKE: {
    id: 'TIGER_STRIKE', name: 'Tiger Strike', type: 'active', source: 'equipment',
    itemId: 'TIGER_FANG', unlockLevel: null,
    description: 'Tiger Fang claws rake with feral fury.',
    icon: '🐯', effects: { atkBonus: 0.50, spdBonus: 0.20, critChance: 0.20 }, procChance: 0.50,
    narrative: 'strikes with the ferocity of a great tiger!',
  },
  DRAGON_FIST: {
    id: 'DRAGON_FIST', name: 'Dragon Fist', type: 'active', source: 'equipment',
    itemId: 'DRAGON_CLAW', unlockLevel: null,
    description: 'Dragon Claw channels draconic ki into a devastating strike.',
    icon: '🐉', effects: { atkBonus: 0.80, spdBonus: 0.25, critChance: 0.25 }, procChance: 0.50,
    narrative: 'channels draconic ki and unleashes a Dragon Fist!',
  },
  WHIRLWIND_STRIKE: {
    id: 'WHIRLWIND_STRIKE', name: 'Whirlwind Strike', type: 'active', source: 'equipment',
    itemId: 'JADE_BO', unlockLevel: null,
    description: 'Jade Bo spins in a devastating whirlwind attack.',
    icon: '🌀', effects: { atkBonus: 0.55, defBonus: 0.15 }, procChance: 0.50,
    narrative: 'spins the Jade Bo in a devastating Whirlwind Strike!',
  },
  HEAVENLY_PALM: {
    id: 'HEAVENLY_PALM', name: 'Heavenly Palm', type: 'active', source: 'equipment',
    itemId: 'CELESTIAL_BO', unlockLevel: null,
    description: 'Celestial Bo channels heavenly force into a thunderous palm strike.',
    icon: '✨', effects: { atkBonus: 0.85, spdBonus: 0.20, defBonus: 0.15 }, procChance: 0.50,
    narrative: 'channels the heavens and strikes with a Heavenly Palm!',
  },
  DIVINE_GRACE: {
    id: 'DIVINE_GRACE', name: 'Divine Grace', type: 'active', source: 'equipment',
    itemId: 'DIVINE_STAFF', unlockLevel: null,
    description: 'Divine Staff channels holy energy, bolstering the party.',
    icon: '🌟', effects: { magBonus: 0.40, healBonus: 0.25 }, procChance: 0.55,
    narrative: 'channels Divine Grace through the holy staff!',
  },
  KI_BARRIER: {
    id: 'KI_BARRIER', name: 'Ki Barrier', type: 'active', source: 'equipment',
    itemId: 'DRAGON_GI', unlockLevel: null,
    description: 'Dragon Gi channels inner ki into a protective barrier.',
    icon: '🔮', effects: { defBonus: 0.40, dodgeChance: 0.20 }, procChance: 0.50,
    narrative: 'channels ki into a protective barrier!',
  },
  CELESTIAL_WARD: {
    id: 'CELESTIAL_WARD', name: 'Celestial Ward', type: 'active', source: 'equipment',
    itemId: 'CELESTIAL_ROBES', unlockLevel: null,
    description: 'Celestial Robes weave a ward of starlight, reducing incoming damage.',
    icon: '⭐', effects: { defBonus: 0.30, magBonus: 0.20 }, procChance: 0.50,
    narrative: 'weaves a Celestial Ward of starlight!',
  },
  DIVINE_GUARD: {
    id: 'DIVINE_GUARD', name: 'Divine Guard', type: 'active', source: 'equipment',
    itemId: 'MYTHRIL_SHIELD', unlockLevel: null,
    description: 'Mythril Shield raises an impenetrable divine guard.',
    icon: '🛡', effects: { defBonus: 0.50, maxHpBonus: 0.10 }, procChance: 0.50,
    narrative: 'raises the Mythril Shield in a Divine Guard!',
  },
  VENOM_STRIKE: {
    id: 'VENOM_STRIKE', name: 'Venom Strike', type: 'active', source: 'equipment',
    itemId: 'EPIC_DAGGER', unlockLevel: null,
    description: 'Coats the blade in deadly venom and strikes with precision.',
    icon: '🐍', effects: { atkBonus: 0.55, critChance: 0.20, spdBonus: 0.15 }, procChance: 0.45,
    narrative: 'coats the blade in deadly venom and strikes!',
  },
  GUARDIAN_SLASH: {
    id: 'GUARDIAN_SLASH', name: 'Guardian Slash', type: 'active', source: 'equipment',
    itemId: 'EPIC_SWORD', unlockLevel: null,
    description: 'Strikes with a guardian\'s resolve, balancing offense and defense.',
    icon: '🛡', effects: { atkBonus: 0.30, defBonus: 0.25, maxHpBonus: 0.05 }, procChance: 0.45,
    narrative: 'strikes with a guardian\'s resolve!',
  },
  BULWARK_CLEAVE: {
    id: 'BULWARK_CLEAVE', name: 'Bulwark Cleave', type: 'active', source: 'equipment',
    itemId: 'EPIC_GREATSWORD', unlockLevel: null,
    description: 'Brings down a devastating defensive cleave.',
    icon: '⚔', effects: { atkBonus: 0.40, defBonus: 0.30, maxHpBonus: 0.08 }, procChance: 0.45,
    narrative: 'brings down a devastating defensive cleave!',
  },
  HOLY_SMITE: {
    id: 'HOLY_SMITE', name: 'Holy Smite', type: 'active', source: 'equipment',
    itemId: 'TEMPLARS_FLAIL', unlockLevel: null,
    description: 'Calls down holy wrath through the flail, smiting the wicked.',
    icon: '✝', effects: { atkBonus: 0.35, defBonus: 0.20, maxHpBonus: 0.05 }, procChance: 0.45,
    narrative: 'calls down holy wrath and smites the enemy!',
  },
  DIVINE_JUDGEMENT: {
    id: 'DIVINE_JUDGEMENT', name: 'Divine Judgement', type: 'active', source: 'equipment',
    itemId: 'JUDGEMENT', unlockLevel: null,
    description: 'Delivers the final verdict — a crushing blow of divine authority.',
    icon: '⚖', effects: { atkBonus: 0.45, defBonus: 0.30, maxHpBonus: 0.10, critBonus: 0.15 }, procChance: 0.60,
    narrative: 'delivers divine judgement with devastating force!',
  },
  GUARDIAN_AURA: {
    id: 'GUARDIAN_AURA', name: 'Guardian Aura', type: 'active', source: 'equipment',
    itemId: 'BLESSED_MACE', unlockLevel: null,
    description: 'Radiates a protective aura that shields the entire party.',
    icon: '🛡', effects: { defBonus: 0.35, maxHpBonus: 0.15, atkBonus: 0.10 }, procChance: 0.45,
    narrative: 'radiates a guardian aura, shielding the party!',
  },
  SANCTUM_BARRIER: {
    id: 'SANCTUM_BARRIER', name: 'Sanctum Barrier', type: 'active', source: 'equipment',
    itemId: 'SANCTUM_HAMMER', unlockLevel: null,
    description: 'Erects an impenetrable holy barrier around allies.',
    icon: '🏛', effects: { defBonus: 0.45, maxHpBonus: 0.25, atkBonus: 0.15, critBonus: 0.05 }, procChance: 0.60,
    narrative: 'erects the Sanctum Barrier — an unbreakable wall of light!',
  },
  EVASIVE_STRIKE: {
    id: 'EVASIVE_STRIKE', name: 'Evasive Strike', type: 'active', source: 'equipment',
    itemId: 'EPIC_DAGGER', unlockLevel: null,
    description: 'Weaves through danger and strikes from the shadows.',
    icon: '💨', effects: { atkBonus: 0.30, dodgeChance: 0.25, defBonus: 0.15 }, procChance: 0.45,
    narrative: 'weaves through danger and strikes from the shadows!',
  },
  IRON_BODY: {
    id: 'IRON_BODY', name: 'Iron Body', type: 'active', source: 'equipment',
    itemId: 'EPIC_CLAWS', unlockLevel: null,
    description: 'Hardens the body like iron and counters with force.',
    icon: '🪨', effects: { atkBonus: 0.30, defBonus: 0.30, dodgeChance: 0.15 }, procChance: 0.45,
    narrative: 'hardens their body like iron and counters!',
  },
  MOUNTAIN_STANCE: {
    id: 'MOUNTAIN_STANCE', name: 'Mountain Stance', type: 'active', source: 'equipment',
    itemId: 'EPIC_BO_STAFF', unlockLevel: null,
    description: 'Roots into an immovable and powerful stance.',
    icon: '⛰', effects: { defBonus: 0.40, atkBonus: 0.25, maxHpBonus: 0.08 }, procChance: 0.45,
    narrative: 'roots into Mountain Stance — immovable and powerful!',
  },
  NATURE_WARD: {
    id: 'NATURE_WARD', name: 'Nature Ward', type: 'active', source: 'equipment',
    itemId: 'EPIC_BOW', unlockLevel: null,
    description: 'Calls upon nature\'s protection while firing arrows.',
    icon: '🌿', effects: { atkBonus: 0.35, defBonus: 0.20, healBonus: 0.10 }, procChance: 0.45,
    narrative: 'calls upon nature\'s protection while firing!',
  },
  SIREN_SONG: {
    id: 'SIREN_SONG', name: 'Siren Song', type: 'active', source: 'equipment',
    itemId: 'EPIC_INSTRUMENT', unlockLevel: null,
    description: 'Plays a mesmerizing Siren Song that enchants and heals.',
    icon: '🎵', effects: { magBonus: 0.55, healBonus: 0.15, lckBonus: 0.15 }, procChance: 0.50,
    narrative: 'plays a mesmerizing Siren Song!',
  },
  BATTLE_MARCH: {
    id: 'BATTLE_MARCH', name: 'Battle March', type: 'active', source: 'equipment',
    itemId: 'EPIC_INSTRUMENT', unlockLevel: null,
    description: 'Beats a rousing Battle March that rallies allies.',
    icon: '🥁', effects: { magBonus: 0.35, defBonus: 0.20, healBonus: 0.15 }, procChance: 0.50,
    narrative: 'beats a rousing Battle March!',
  },
  TEMPLAR_MIGHT: {
    id: 'TEMPLAR_MIGHT', name: 'Templar Might', type: 'active', source: 'equipment',
    itemId: 'EPIC_PLATE', unlockLevel: null,
    description: 'Channels the might of ancient templars.',
    icon: '✦', effects: { atkBonus: 0.20, defBonus: 0.15 }, procChance: 0.45,
    narrative: 'channels the might of ancient templars!',
  },
  CHAIN_WARD: {
    id: 'CHAIN_WARD', name: 'Chain Ward', type: 'active', source: 'equipment',
    itemId: 'EPIC_CHAIN', unlockLevel: null,
    description: 'Activates a protective Chain Ward.',
    icon: '🔗', effects: { defBonus: 0.25, dodgeChance: 0.10 }, procChance: 0.45,
    narrative: 'activates a Chain Ward!',
  },
  TIGER_SPIRIT: {
    id: 'TIGER_SPIRIT', name: 'Tiger Spirit', type: 'active', source: 'equipment',
    itemId: 'EPIC_LEATHER', unlockLevel: null,
    description: 'Channels the tiger\'s ferocity for deadly speed.',
    icon: '🐯', effects: { atkBonus: 0.25, spdBonus: 0.15 }, procChance: 0.45,
    narrative: 'channels the tiger\'s ferocity!',
  },
  DIAMOND_SKIN: {
    id: 'DIAMOND_SKIN', name: 'Diamond Skin', type: 'active', source: 'equipment',
    itemId: 'EPIC_LEATHER', unlockLevel: null,
    description: 'Activates hardened Diamond Skin for unbreakable defense.',
    icon: '💎', effects: { defBonus: 0.35, dodgeChance: 0.10 }, procChance: 0.45,
    narrative: 'activates Diamond Skin!',
  },
  ARCANE_SURGE: {
    id: 'ARCANE_SURGE', name: 'Arcane Surge', type: 'active', source: 'equipment',
    itemId: 'EPIC_ROBES', unlockLevel: null,
    description: 'Unleashes an Arcane Surge of magical power.',
    icon: '✨', effects: { magBonus: 0.25, critChance: 0.15 }, procChance: 0.45,
    narrative: 'unleashes an Arcane Surge!',
  },
  DIVINE_WARD: {
    id: 'DIVINE_WARD', name: 'Divine Ward', type: 'active', source: 'equipment',
    itemId: 'EPIC_ROBES', unlockLevel: null,
    description: 'Weaves a Divine Ward of holy protection.',
    icon: '🙏', effects: { defBonus: 0.25, magBonus: 0.15 }, procChance: 0.45,
    narrative: 'weaves a Divine Ward!',
  },
  SHIELD_BASH: {
    id: 'SHIELD_BASH', name: 'Shield Bash', type: 'active', source: 'equipment',
    itemId: 'EPIC_SHIELD', unlockLevel: null,
    description: 'Bashes with shield force, combining offense and defense.',
    icon: '🎯', effects: { atkBonus: 0.20, defBonus: 0.15 }, procChance: 0.45,
    narrative: 'bashes with their shield!',
  },
  VOID_BURST: {
    id: 'VOID_BURST', name: 'Void Burst', type: 'active', source: 'equipment',
    itemId: 'EPIC_ORB', unlockLevel: null,
    description: 'Unleashes a Void Burst of unstable magic.',
    icon: '🌀', effects: { magBonus: 0.40, critChance: 0.20 }, procChance: 0.45,
    narrative: 'unleashes a Void Burst!',
  },
  SANCTUARY: {
    id: 'SANCTUARY', name: 'Sanctuary', type: 'active', source: 'equipment',
    itemId: 'EPIC_ORB', unlockLevel: null,
    description: 'Creates a Sanctuary of light for protection and healing.',
    icon: '☀', effects: { defBonus: 0.30, healBonus: 0.20 }, procChance: 0.50,
    narrative: 'creates a Sanctuary of light!',
  },
  GUARDIAN_AURA: {
    id: 'GUARDIAN_AURA', name: 'Guardian Aura', type: 'active', source: 'equipment',
    itemId: 'EPIC_ACCESSORY_DEF', unlockLevel: null,
    description: 'Activates a Guardian Aura for protective power.',
    icon: '⭐', effects: { defBonus: 0.25, maxHpBonus: 0.08 }, procChance: 0.50,
    narrative: 'activates a Guardian Aura!',
  },
  MANA_FLOW: {
    id: 'MANA_FLOW', name: 'Mana Flow', type: 'active', source: 'equipment',
    itemId: 'EPIC_ACCESSORY_OFF', unlockLevel: null,
    description: 'Channels a surge of Mana Flow for magical strikes.',
    icon: '💧', effects: { magBonus: 0.30, critChance: 0.15 }, procChance: 0.50,
    narrative: 'channels a surge of Mana Flow!',
  },
  DIVINE_AURA: {
    id: 'DIVINE_AURA', name: 'Divine Aura', type: 'active', source: 'equipment',
    itemId: 'EPIC_ACCESSORY_DEF', unlockLevel: null,
    description: 'Radiates a Divine Aura of healing and protection.',
    icon: '🌟', effects: { defBonus: 0.20, healBonus: 0.20 }, procChance: 0.50,
    narrative: 'radiates a Divine Aura!',
  },
  RADIANT_STRIKE: {
    id: 'RADIANT_STRIKE', name: 'Radiant Strike', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_SWORD', unlockLevel: null,
    description: 'Channels blinding radiance into a devastating strike.',
    icon: '☀', effects: { atkBonus: 0.70, critChance: 0.30, defPierce: 0.15 }, procChance: 0.60,
    narrative: 'channels blinding radiance into a devastating strike!',
  },
  WORLD_CLEAVE: {
    id: 'WORLD_CLEAVE', name: 'World Cleave', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_GREATSWORD', unlockLevel: null,
    description: 'Cleaves with the force to split the world.',
    icon: '🌍', effects: { atkBonus: 1.00, defPierce: 0.40, critChance: 0.20 }, procChance: 0.55,
    narrative: 'cleaves with the force to split the world!',
  },
  ASSASSINATION: {
    id: 'ASSASSINATION', name: 'Assassination', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_DAGGER', unlockLevel: null,
    description: 'Strikes from the void in an instant kill attempt.',
    icon: '💀', effects: { atkBonus: 0.85, critChance: 0.40, dodgeChance: 0.20 }, procChance: 0.55,
    narrative: 'strikes from the void — an instant kill attempt!',
  },
  ASURA_FURY: {
    id: 'ASURA_FURY', name: 'Asura Fury', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_CLAWS', unlockLevel: null,
    description: 'Enters Asura Fury for a storm of devastating blows.',
    icon: '👹', effects: { atkBonus: 0.90, spdBonus: 0.30, critChance: 0.30 }, procChance: 0.55,
    narrative: 'enters Asura Fury — a storm of devastating blows!',
  },
  MONKEY_KING: {
    id: 'MONKEY_KING', name: 'Monkey King', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_BO_STAFF', unlockLevel: null,
    description: 'Channels the Monkey King\'s legendary power.',
    icon: '🐵', effects: { atkBonus: 0.95, spdBonus: 0.25, defBonus: 0.20 }, procChance: 0.55,
    narrative: 'channels the Monkey King\'s legendary power!',
  },
  CELESTIAL_VOLLEY: {
    id: 'CELESTIAL_VOLLEY', name: 'Celestial Volley', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_BOW', unlockLevel: null,
    description: 'Fires a Celestial Volley of arrows made of pure starlight.',
    icon: '🌠', effects: { atkBonus: 0.80, spdBonus: 0.25, critChance: 0.30 }, procChance: 0.55,
    narrative: 'fires a Celestial Volley — arrows of pure starlight!',
  },
  ARCANE_CATACLYSM: {
    id: 'ARCANE_CATACLYSM', name: 'Arcane Cataclysm', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_STAFF', unlockLevel: null,
    description: 'Unleashes an Arcane Cataclysm of magical destruction.',
    icon: '💥', effects: { magBonus: 0.85, critChance: 0.25, defPierce: 0.20 }, procChance: 0.55,
    narrative: 'unleashes an Arcane Cataclysm!',
  },
  ORPHIC_HYMN: {
    id: 'ORPHIC_HYMN', name: 'Orphic Hymn', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_INSTRUMENT', unlockLevel: null,
    description: 'Performs the legendary Orphic Hymn with divine power.',
    icon: '🎼', effects: { magBonus: 0.75, healBonus: 0.30, lckBonus: 0.25 }, procChance: 0.60,
    narrative: 'performs the legendary Orphic Hymn!',
  },
  DIVINE_OATH: {
    id: 'DIVINE_OATH', name: 'Divine Oath', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_SWORD', unlockLevel: null,
    description: 'Swears a Divine Oath where power and protection surge.',
    icon: '✝', effects: { atkBonus: 0.45, defBonus: 0.40, maxHpBonus: 0.15 }, procChance: 0.60,
    narrative: 'swears a Divine Oath — power and protection surge!',
  },
  EARTHEN_GUARD: {
    id: 'EARTHEN_GUARD', name: 'Earthen Guard', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_GREATSWORD', unlockLevel: null,
    description: 'Channels the earth\'s unyielding defense.',
    icon: '🪨', effects: { atkBonus: 0.55, defBonus: 0.50, maxHpBonus: 0.20 }, procChance: 0.55,
    narrative: 'channels the earth\'s unyielding defense!',
  },
  PHANTOM_DANCE: {
    id: 'PHANTOM_DANCE', name: 'Phantom Dance', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_DAGGER', unlockLevel: null,
    description: 'Dances like a phantom — untouchable and deadly.',
    icon: '👻', effects: { atkBonus: 0.45, dodgeChance: 0.40, defBonus: 0.25 }, procChance: 0.55,
    narrative: 'dances like a phantom — untouchable and deadly!',
  },
  ENLIGHTENED_FIST: {
    id: 'ENLIGHTENED_FIST', name: 'Enlightened Fist', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_CLAWS', unlockLevel: null,
    description: 'Achieves enlightened combat with perfect balance.',
    icon: '☯', effects: { atkBonus: 0.45, defBonus: 0.45, dodgeChance: 0.25 }, procChance: 0.55,
    narrative: 'achieves enlightened combat — perfect offense and defense!',
  },
  HEAVENS_PILLAR: {
    id: 'HEAVENS_PILLAR', name: 'Heavens Pillar', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_BO_STAFF', unlockLevel: null,
    description: 'Becomes an immovable pillar of heavenly power.',
    icon: '🏛', effects: { defBonus: 0.55, atkBonus: 0.40, maxHpBonus: 0.15 }, procChance: 0.55,
    narrative: 'becomes an immovable pillar of heavenly power!',
  },
  WORLD_TREE_WARD: {
    id: 'WORLD_TREE_WARD', name: 'World Tree Ward', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_BOW', unlockLevel: null,
    description: 'Calls upon the World Tree\'s ancient protection.',
    icon: '🌳', effects: { atkBonus: 0.50, defBonus: 0.35, healBonus: 0.20 }, procChance: 0.55,
    narrative: 'calls upon the World Tree\'s ancient protection!',
  },
  WORLD_BLESSING: {
    id: 'WORLD_BLESSING', name: 'World Blessing', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_STAFF', unlockLevel: null,
    description: 'Channels the World Blessing as divine power flows.',
    icon: '✧', effects: { magBonus: 0.55, healBonus: 0.40, defBonus: 0.20 }, procChance: 0.60,
    narrative: 'channels the World Blessing — divine power flows!',
  },
  ETERNAL_RHYTHM: {
    id: 'ETERNAL_RHYTHM', name: 'Eternal Rhythm', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_INSTRUMENT', unlockLevel: null,
    description: 'Beats the Eternal Rhythm as timeless power resonates.',
    icon: '🎶', effects: { magBonus: 0.50, defBonus: 0.30, healBonus: 0.30 }, procChance: 0.60,
    narrative: 'beats the Eternal Rhythm — timeless power resonates!',
  },
  DRAGON_FURY: {
    id: 'DRAGON_FURY', name: 'Dragon Fury', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_PLATE', unlockLevel: null,
    description: 'Channels the fury of dragons.',
    icon: '🐉', effects: { atkBonus: 0.35, defBonus: 0.20, critChance: 0.15 }, procChance: 0.55,
    narrative: 'channels the fury of dragons!',
  },
  ADAMANTINE_WALL: {
    id: 'ADAMANTINE_WALL', name: 'Adamantine Wall', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_PLATE', unlockLevel: null,
    description: 'Becomes an Adamantine Wall of impenetrable defense.',
    icon: '🏔', effects: { defBonus: 0.50, maxHpBonus: 0.15 }, procChance: 0.55,
    narrative: 'becomes an Adamantine Wall!',
  },
  SHADOW_DANCE: {
    id: 'SHADOW_DANCE', name: 'Shadow Dance', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_CHAIN', unlockLevel: null,
    description: 'Enters a Shadow Dance becoming untouchable.',
    icon: '💃', effects: { dodgeChance: 0.45, critChance: 0.20 }, procChance: 0.55,
    narrative: 'enters a Shadow Dance — untouchable!',
  },
  CELESTIAL_AEGIS: {
    id: 'CELESTIAL_AEGIS', name: 'Celestial Aegis', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_CHAIN', unlockLevel: null,
    description: 'Activates a Celestial Aegis of heavenly protection.',
    icon: '🛡', effects: { defBonus: 0.40, dodgeChance: 0.15, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'activates a Celestial Aegis!',
  },
  DRAGON_SPIRIT: {
    id: 'DRAGON_SPIRIT', name: 'Dragon Spirit', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_LEATHER', unlockLevel: null,
    description: 'Channels the Dragon Spirit for fierce power.',
    icon: '🐲', effects: { atkBonus: 0.35, spdBonus: 0.25, critChance: 0.15 }, procChance: 0.55,
    narrative: 'channels the Dragon Spirit!',
  },
  INNER_PEACE: {
    id: 'INNER_PEACE', name: 'Inner Peace', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_LEATHER', unlockLevel: null,
    description: 'Achieves Inner Peace becoming serene and unbreakable.',
    icon: '☮', effects: { defBonus: 0.45, dodgeChance: 0.20, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'achieves Inner Peace — serene and unbreakable!',
  },
  ETERNAL_WARD: {
    id: 'ETERNAL_WARD', name: 'Eternal Ward', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_ROBES', unlockLevel: null,
    description: 'Weaves an Eternal Ward of timeless power.',
    icon: '🌀', effects: { defBonus: 0.40, magBonus: 0.20, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'weaves an Eternal Ward!',
  },
  AEGIS_COUNTER: {
    id: 'AEGIS_COUNTER', name: 'Aegis Counter', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_SHIELD', unlockLevel: null,
    description: 'Counters with overwhelming Aegis power.',
    icon: '⚡', effects: { atkBonus: 0.30, defBonus: 0.25, critChance: 0.15 }, procChance: 0.55,
    narrative: 'counters with the Aegis!',
  },
  ETERNAL_GUARD: {
    id: 'ETERNAL_GUARD', name: 'Eternal Guard', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_SHIELD', unlockLevel: null,
    description: 'Raises the Eternal Guard where nothing gets through.',
    icon: '🔰', effects: { defBonus: 0.65, maxHpBonus: 0.20 }, procChance: 0.55,
    narrative: 'raises the Eternal Guard — nothing gets through!',
  },
  GENESIS_WARD: {
    id: 'GENESIS_WARD', name: 'Genesis Ward', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_ORB', unlockLevel: null,
    description: 'Creates a Genesis Ward of primordial power.',
    icon: '🌅', effects: { defBonus: 0.40, magBonus: 0.30, healBonus: 0.25 }, procChance: 0.55,
    narrative: 'creates a Genesis Ward of primordial power!',
  },
  BATTLE_FURY: {
    id: 'BATTLE_FURY', name: 'Battle Fury', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_ACCESSORY_OFF', unlockLevel: null,
    description: 'Enters a state of Battle Fury for overwhelming power.',
    icon: '🔥', effects: { powerMultiplier: 1.6, critChance: 0.15 }, procChance: 0.55,
    narrative: 'enters a state of Battle Fury!',
  },
  AEGIS_AURA: {
    id: 'AEGIS_AURA', name: 'Aegis Aura', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_ACCESSORY_DEF', unlockLevel: null,
    description: 'Radiates an Aegis Aura of protective power.',
    icon: '✦', effects: { defBonus: 0.40, maxHpBonus: 0.15 }, procChance: 0.55,
    narrative: 'radiates an Aegis Aura!',
  },
  ARCANE_OVERFLOW: {
    id: 'ARCANE_OVERFLOW', name: 'Arcane Overflow', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_ACCESSORY_OFF', unlockLevel: null,
    description: 'Overflows with Arcane power for magical devastation.',
    icon: '💫', effects: { magBonus: 0.45, critChance: 0.20, spdBonus: 0.10 }, procChance: 0.55,
    narrative: 'overflows with Arcane power!',
  },
  GRACE_ETERNAL: {
    id: 'GRACE_ETERNAL', name: 'Grace Eternal', type: 'active', source: 'equipment',
    itemId: 'LEGENDARY_ACCESSORY_DEF', unlockLevel: null,
    description: 'Channels Grace Eternal for divine protection and healing.',
    icon: '🕊', effects: { defBonus: 0.30, healBonus: 0.35, magBonus: 0.15 }, procChance: 0.55,
    narrative: 'channels Grace Eternal!',
  },

  // ── MASTERY SKILLS ────────────────────────────────────────────────────────
  VETERANS_INSTINCT: {
    id: 'VETERANS_INSTINCT', name: 'Veteran\'s Instinct', type: 'passive', source: 'mastery',
    questsRequired: 5,
    description: 'Experience from 5 quests grants +8% LUCK.',
    icon: '🎖', effects: { lckBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  BATTLE_HARDENED: {
    id: 'BATTLE_HARDENED', name: 'Battle Hardened', type: 'passive', source: 'mastery',
    questsRequired: 15,
    description: 'After 15 quests, gain +10% DEF.',
    icon: '🗡', effects: { defBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  QUEST_MASTER: {
    id: 'QUEST_MASTER', name: 'Quest Master', type: 'passive', source: 'mastery',
    questsRequired: 30,
    description: 'After 30 quests, gain +15% gold and +12% exp.',
    icon: '👑', effects: { goldBonus: 0.15, expBonus: 0.12 }, procChance: 1.0,
    narrative: null,
  },
  LEGENDARY_ADVENTURER: {
    id: 'LEGENDARY_ADVENTURER', name: 'Legendary Adventurer', type: 'passive', source: 'mastery',
    questsRequired: 75,
    description: 'After 75 quests, legend status grants +20% all rewards.',
    icon: '⭐', effects: { goldBonus: 0.20, expBonus: 0.20, lckBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
};

// ── HELPER FUNCTIONS ───────────────────────────────────────────────────────

export function getSkill(skillId) {
  return SKILLS[skillId] || null;
}

export function getClassSkills(classId) {
  return Object.values(SKILLS).filter(s => s.source === 'class' && s.classId === classId).sort((a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0));
}

export function getUnlockedClassSkills(classId, level) {
  return getClassSkills(classId).filter(s => s.unlockLevel && s.unlockLevel <= level);
}

export function getNextClassSkill(classId, currentLevel) {
  return getClassSkills(classId).find(s => s.unlockLevel && s.unlockLevel > currentLevel) || null;
}

export function getEquipmentSkill(itemId) {
  return Object.values(SKILLS).find(s => s.source === 'equipment' && s.itemId === itemId) || null;
}

export function getMasterySkill(questsCompleted) {
  return Object.values(SKILLS)
    .filter(s => s.source === 'mastery' && s.questsRequired && s.questsRequired <= questsCompleted)
    .sort((a, b) => (b.questsRequired || 0) - (a.questsRequired || 0))[0] || null;
}

export function getAllMasterySkills() {
  return Object.values(SKILLS)
    .filter(s => s.source === 'mastery')
    .sort((a, b) => (a.questsRequired || 0) - (b.questsRequired || 0));
}

export function getNextMasterySkill(questsCompleted) {
  return Object.values(SKILLS)
    .filter(s => s.source === 'mastery' && s.questsRequired && s.questsRequired > questsCompleted)
    .sort((a, b) => (a.questsRequired || 0) - (b.questsRequired || 0))[0] || null;
}

export function getMemberActiveSkills(member, party) {
  if (!member || !member.skills) return [];
  return member.skills
    .map(skillId => getSkill(skillId))
    .filter(Boolean)
    .filter(skill => skill.type === 'active');
}

export function getMemberPassiveSkills(member, party) {
  if (!member || !member.skills) return [];
  return member.skills
    .map(skillId => getSkill(skillId))
    .filter(Boolean)
    .filter(skill => skill.type === 'passive');
}

export function applyPassiveSkills(stats, member, party) {
  const passives = getMemberPassiveSkills(member, party);
  for (const skill of passives) {
    if (!skill.effects) continue;
    for (const [key, value] of Object.entries(skill.effects)) {
      if (key === 'partyAtkBonus' || key === 'partyDefBonus' || key === 'partySpdBonus') continue;
      if (key === 'powerMultiplier') continue;
      const statKey = key.replace(/Bonus$/, '').toLowerCase();
      const baseKey = key.match(/([a-z]+)/i)[0];
      if (statKey === 'atk' || statKey === 'def' || statKey === 'spd' || statKey === 'mag' || statKey === 'lck' || statKey === 'hp') {
        stats[baseKey] = (stats[baseKey] || 0) * (1 + value);
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
