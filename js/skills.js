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
    description: 'Rallies the party mid-combat, restoring HP to all allies. 60% proc.',
    icon: '📣', effects: { partyHealPct: 0.12 }, procChance: 0.60,
    narrative: 'lets out a Rally Cry — the party is reinvigorated!',
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
    description: 'Grants +20% MAX HP.',
    icon: '🪨', effects: { hpBonus: 0.20 }, procChance: 1.0,
    narrative: null,
  },
  LAST_STAND: {
    id: 'LAST_STAND', name: 'Last Stand', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 10,
    description: 'Reduces damage taken by 30% when heavily damaged. 50% proc.',
    icon: '⚒', effects: { defBonus: 0.30 }, procChance: 0.50,
    narrative: 'digs in for their Last Stand!',
  },
  SENTINEL: {
    id: 'SENTINEL', name: 'Sentinel', type: 'passive', source: 'class',
    classId: 'KNIGHT', unlockLevel: 14,
    description: 'DEF +20%, MAX HP +15%.',
    icon: '👑', effects: { defBonus: 0.20, hpBonus: 0.15 }, procChance: 1.0,
    narrative: null,
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
  BACKSTAB: {
    id: 'BACKSTAB', name: 'Backstab', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 8,
    description: 'Devastating backstab. 45% proc, high damage.',
    icon: '🔪', effects: { atkBonus: 1.0, critChance: 0.40 }, procChance: 0.45,
    narrative: 'finds the perfect moment for a Backstab!',
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
  MULTISHOT: {
    id: 'MULTISHOT', name: 'Multishot', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 10,
    description: 'Rain of arrows hits multiple times. 40% proc.',
    icon: '🎯', effects: { powerMultiplier: 1.5 }, procChance: 0.40,
    narrative: 'unleashes a Multishot barrage!',
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
  RISING_DRAGON_KICK: {
    id: 'RISING_DRAGON_KICK', name: 'Rising Dragon Kick', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 9,
    description: 'A devastating spinning kick that launches the enemy. 50% proc.',
    icon: '🦶', effects: { atkBonus: 0.70, spdBonus: 0.15, critChance: 0.20 }, procChance: 0.50,
    narrative: 'leaps into a Rising Dragon Kick — the enemy is sent flying!',
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
