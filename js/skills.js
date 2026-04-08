// ══════════════════════════════════════════════════════════════════════════════
// Skills & Masteries System
// ══════════════════════════════════════════════════════════════════════════════
//
// UNLOCK SCHEDULE (every 2 levels, alternating skill/mastery):
//   Lv 2  → Skill 1          Lv 4  → Mastery 1
//   Lv 6  → Skill 2          Lv 8  → Mastery 2
//   Lv 10 → Skill 3 (CLASS)  Lv 12 → Mastery 3 (PARTY)
//   Lv 14 → Skill 4          Lv 16 → Mastery 4
//   Lv 18 → Skill 5 (EPIC)   Lv 20 → Mastery 5 (EPIC)
//
// Skills  = proc-based (combat procs + always-active buffs). Distinct from item procs.
// Masteries = passive stat/role enhancements. #3 is party-wide, #5 is epic capstone.
// ══════════════════════════════════════════════════════════════════════════════

export const SKILLS = {

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ HERO — Balanced leader. Inspires the party, versatile in combat.        │
  // │ Role: All-rounder / party leader                                        │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Hero Skills ──
  HEROIC_STRIKE: {
    id: 'HEROIC_STRIKE', name: 'Heroic Strike', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 2,
    description: 'A powerful strike fueled by otherworldly resolve. 70% proc, +25% ATK.',
    icon: '⚔', effects: { atkBonus: 0.25 }, procChance: 0.70,
    narrative: 'unleashes a devastating Heroic Strike!',
  },
  RALLY_CRY: {
    id: 'RALLY_CRY', name: 'Rally Cry', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 6,
    description: 'A rallying shout that bolsters all allies. 60% proc, party ATK +12%, party DEF +8%.',
    icon: '📣', effects: { partyAtkBonus: 0.12, partyDefBonus: 0.08 }, procChance: 0.60,
    narrative: 'lets out a Rally Cry — the party fights with renewed vigor!',
  },
  AWAKENING: {
    id: 'AWAKENING', name: 'Awakening', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 10,
    description: 'CLASS SKILL — Taps into dormant otherworldly power. 50% proc, 1.6× power multiplier.',
    icon: '⭐', effects: { powerMultiplier: 1.6 }, procChance: 0.50,
    narrative: 'taps into their otherworldly power — Awakening!',
  },
  INSPIRING_PRESENCE: {
    id: 'INSPIRING_PRESENCE', name: 'Inspiring Presence', type: 'passive', source: 'class',
    classId: 'HERO', unlockLevel: 14,
    description: 'The Hero\'s presence inspires all. Party ATK +8%, party SPD +6%, self CRIT +8%, DODGE +7%.',
    icon: '✨', effects: { partyAtkBonus: 0.08, partySpdBonus: 0.06, critBonus: 0.08, dodgeBonus: 0.07 }, procChance: 1.0,
    narrative: null,
  },
  HERO_ULTIMA: {
    id: 'HERO_ULTIMA', name: 'Hero Ultima', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 18,
    description: 'EPIC — Channels all heroic might into one transcendent attack. 40% proc, 2.2× power, party ATK +15%.',
    icon: '🌟', effects: { powerMultiplier: 2.2, partyAtkBonus: 0.15 }, procChance: 0.40,
    narrative: 'channels all heroic might — HERO ULTIMA unleashed!',
  },

  // ── Hero Masteries ──
  HERO_M_VERSATILITY: {
    id: 'HERO_M_VERSATILITY', name: 'Versatility', type: 'passive', source: 'mastery',
    classId: 'HERO', unlockLevel: 4,
    description: 'ATK +8%, DEF +5%. A well-rounded foundation.',
    icon: '🎖', effects: { atkBonus: 0.08, defBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  HERO_M_BLADE_MASTERY: {
    id: 'HERO_M_BLADE_MASTERY', name: 'Blade Mastery', type: 'passive', source: 'mastery',
    classId: 'HERO', unlockLevel: 8,
    description: 'ATK +12%, crit chance +8%.',
    icon: '🗡', effects: { atkBonus: 0.12, critChance: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  HERO_M_LEADERS_AURA: {
    id: 'HERO_M_LEADERS_AURA', name: 'Leader\'s Aura', type: 'passive', source: 'mastery',
    classId: 'HERO', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +6% ATK and +4% DEF from the Hero\'s leadership.',
    icon: '👑', effects: { partyAtkBonus: 0.06, partyDefBonus: 0.04 }, procChance: 1.0,
    narrative: null,
  },
  HERO_M_BATTLE_INSTINCT: {
    id: 'HERO_M_BATTLE_INSTINCT', name: 'Battle Instinct', type: 'passive', source: 'mastery',
    classId: 'HERO', unlockLevel: 16,
    description: 'ATK +15%, SPD +10%, CRIT +5%, DODGE +5%.',
    icon: '⚡', effects: { atkBonus: 0.15, spdBonus: 0.10, critBonus: 0.05, dodgeBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  HERO_M_CHOSEN_ONE: {
    id: 'HERO_M_CHOSEN_ONE', name: 'The Chosen One', type: 'passive', source: 'mastery',
    classId: 'HERO', unlockLevel: 20,
    description: 'EPIC — All stats +12%. The Hero\'s destiny is fulfilled.',
    icon: '🌠', effects: { atkBonus: 0.12, defBonus: 0.12, spdBonus: 0.12, magBonus: 0.12, critBonus: 0.06, dodgeBonus: 0.06, maxHpBonus: 0.12 }, procChance: 1.0,
    narrative: null,
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ HERO SPECIALIZATIONS — Unlocked at Lv.10. Three tracks that layer on    │
  // │ top of existing Hero skills.                                            │
  // │   Vanguard: Full tank — intercept, bulk, survive                        │
  // │   Champion: Full DPS — execute, bloodlust, nuke                         │
  // │   Warden:   Support — emergency heal, aura, mass revive                 │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Vanguard (Tank) ──
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
    description: 'SPEC — Self DEF +25%, max HP +20%, party DEF +10%.',
    icon: '🏰', effects: { defBonus: 0.25, maxHpBonus: 0.20, partyDefBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  UNBREAKABLE_WILL: {
    id: 'UNBREAKABLE_WILL', name: 'Unbreakable Will', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'vanguard', unlockLevel: 18,
    description: 'EPIC SPEC — Survives a killing blow at 1 HP with 80% damage reduction for 2 rounds. 5-round cooldown.',
    icon: '💎', effects: { surviveKO: true, dmgReduction: 0.80, drDuration: 2 }, procChance: 1.0, reactive: true, cooldown: 5,
    narrative: 'refuses to fall — Unbreakable Will!',
  },

  // ── Champion (DPS) ──
  EXECUTIONERS_MARK: {
    id: 'EXECUTIONERS_MARK', name: 'Executioner\'s Mark', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'champion', unlockLevel: 10,
    description: 'SPEC — Reactive finishing strike when any enemy drops below 30% HP. Deals 2.0× ATK damage. 3-round cooldown.',
    icon: '🎯', effects: { executeThreshold: 0.30, executeMult: 2.0 }, procChance: 1.0, reactive: true, cooldown: 3,
    narrative: 'marks the weakened foe — Executioner\'s Mark!',
  },
  BLOODLUST: {
    id: 'BLOODLUST', name: 'Bloodlust', type: 'passive', source: 'spec',
    classId: 'HERO', specTrack: 'champion', unlockLevel: 14,
    description: 'SPEC — ATK +20%, CRIT chance +15%, SPD +12%. On kill, next attack deals 1.5× damage.',
    icon: '🩸', effects: { atkBonus: 0.20, critChance: 0.15, spdBonus: 0.12 }, procChance: 1.0,
    narrative: null,
  },
  HEROS_WRATH: {
    id: 'HEROS_WRATH', name: 'Hero\'s Wrath', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'champion', unlockLevel: 18,
    description: 'EPIC SPEC — Guaranteed 3.0× critical hit. 45% proc.',
    icon: '⚡', effects: { powerMultiplier: 3.0, guaranteedCrit: true }, procChance: 0.45,
    narrative: 'unleashes devastating fury — HERO\'S WRATH!',
  },

  // ── Warden (Support/Buffer) ──
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
    description: 'SPEC — Party aura: ATK +12%, DEF +10%, SPD +8%, CRIT +5%.',
    icon: '🚩', effects: { partyAtkBonus: 0.12, partyDefBonus: 0.10, partySpdBonus: 0.08, partyCritBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  SECOND_DAWN: {
    id: 'SECOND_DAWN', name: 'Second Dawn', type: 'active', source: 'spec',
    classId: 'HERO', specTrack: 'warden', unlockLevel: 18,
    description: 'EPIC SPEC — When 2+ allies are KO\'d, revives all fallen allies at 25% HP. Once per fight.',
    icon: '🌅', effects: { reviveAllPercent: 0.25, koThreshold: 2 }, procChance: 1.0, reactive: true, cooldown: 999,
    narrative: 'plants the banner and roars — LAST STAND! Fallen allies rise again!',
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ KNIGHT — Iron wall. Absorbs damage, protects the party.                 │
  // │ Role: Tank / party protector                                            │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Knight Skills ──
  SHIELD_WALL: {
    id: 'SHIELD_WALL', name: 'Shield Wall', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 2,
    description: 'Raises an impenetrable shield. 80% proc, DEF +30%.',
    icon: '🛡', effects: { defBonus: 0.30 }, procChance: 0.80,
    narrative: 'plants their shield firmly — Shield Wall!',
  },
  TAUNT: {
    id: 'TAUNT', name: 'Taunt', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 6,
    description: 'Draws enemy attention, reducing damage to allies. 65% proc, party DEF +12%, self DEF +15%.',
    icon: '😤', effects: { partyDefBonus: 0.12, defBonus: 0.15 }, procChance: 0.65,
    narrative: 'roars a challenge — all enemies focus on the Knight!',
  },
  BULWARK: {
    id: 'BULWARK', name: 'Bulwark', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 10,
    description: 'CLASS SKILL — Becomes an immovable fortress, absorbing hits meant for allies. 55% proc, self DEF +40%, MAX HP +15%.',
    icon: '🏰', effects: { defBonus: 0.40, maxHpBonus: 0.15 }, procChance: 0.55,
    narrative: 'becomes an immovable Bulwark — nothing gets through!',
  },
  LAST_STAND: {
    id: 'LAST_STAND', name: 'Last Stand', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 14,
    description: 'When heavily damaged, the Knight fights hardest. 50% proc, DEF +35%, ATK +20%.',
    icon: '⚒', effects: { defBonus: 0.35, atkBonus: 0.20 }, procChance: 0.50,
    narrative: 'digs in for their Last Stand — unbreakable resolve!',
  },
  UNBREAKABLE: {
    id: 'UNBREAKABLE', name: 'Unbreakable', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 18,
    description: 'EPIC — The Knight transcends mortal limits. 40% proc, 1.5× power, DEF +50%, party DEF +20%.',
    icon: '💎', effects: { powerMultiplier: 1.5, defBonus: 0.50, partyDefBonus: 0.20 }, procChance: 0.40,
    narrative: 'becomes absolutely Unbreakable — a wall of steel and will!',
  },

  // ── Knight Masteries ──
  KNIGHT_M_IRON_SKIN: {
    id: 'KNIGHT_M_IRON_SKIN', name: 'Iron Skin', type: 'passive', source: 'mastery',
    classId: 'KNIGHT', unlockLevel: 4,
    description: 'DEF +10%, MAX HP +8%.',
    icon: '🪨', effects: { defBonus: 0.10, maxHpBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  KNIGHT_M_SHIELD_MASTERY: {
    id: 'KNIGHT_M_SHIELD_MASTERY', name: 'Shield Mastery', type: 'passive', source: 'mastery',
    classId: 'KNIGHT', unlockLevel: 8,
    description: 'DEF +15%, reduces incoming damage further when a shield is equipped.',
    icon: '🛡', effects: { defBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  KNIGHT_M_IRON_AURA: {
    id: 'KNIGHT_M_IRON_AURA', name: 'Iron Aura', type: 'passive', source: 'mastery',
    classId: 'KNIGHT', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +8% DEF and +5% MAX HP from the Knight\'s protective presence.',
    icon: '🔰', effects: { partyDefBonus: 0.08, partyHpBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  KNIGHT_M_FORTIFICATION: {
    id: 'KNIGHT_M_FORTIFICATION', name: 'Fortification', type: 'passive', source: 'mastery',
    classId: 'KNIGHT', unlockLevel: 16,
    description: 'DEF +20%, MAX HP +15%. The Knight becomes a living fortress.',
    icon: '🏛', effects: { defBonus: 0.20, maxHpBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  KNIGHT_M_AEGIS_ETERNAL: {
    id: 'KNIGHT_M_AEGIS_ETERNAL', name: 'Aegis Eternal', type: 'passive', source: 'mastery',
    classId: 'KNIGHT', unlockLevel: 20,
    description: 'EPIC — DEF +30%, MAX HP +25%, ATK +10%. The ultimate defensive form.',
    icon: '⚜', effects: { defBonus: 0.30, maxHpBonus: 0.25, atkBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ MAGE — Glass cannon. Devastating magical damage.                        │
  // │ Role: Magic DPS / elemental destruction                                 │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Mage Skills ──
  MANA_SURGE: {
    id: 'MANA_SURGE', name: 'Mana Surge', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 2,
    description: 'Channels raw mana into an attack. 75% proc, MAG +30%.',
    icon: '🔵', effects: { magBonus: 0.30 }, procChance: 0.75,
    narrative: 'channels a Mana Surge through their form!',
  },
  SPELL_ECHO: {
    id: 'SPELL_ECHO', name: 'Spell Echo', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 6,
    description: 'Spells resonate and strike twice. 45% proc, 1.5× power.',
    icon: '🌀', effects: { powerMultiplier: 1.5 }, procChance: 0.45,
    narrative: 'casts with a resonating Spell Echo — the magic strikes twice!',
  },
  ARCANE_CATACLYSM: {
    id: 'ARCANE_CATACLYSM', name: 'Arcane Cataclysm', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 10,
    description: 'CLASS SKILL — Unleashes a devastating area-of-effect magical explosion. 50% proc, MAG +50%, 1.4× power.',
    icon: '💥', effects: { magBonus: 0.50, powerMultiplier: 1.4 }, procChance: 0.50,
    narrative: 'channels an Arcane Cataclysm — raw magical destruction!',
  },
  MANA_SHIELD: {
    id: 'MANA_SHIELD', name: 'Mana Shield', type: 'passive', source: 'class',
    classId: 'MAGE', unlockLevel: 14,
    description: 'Converts magical energy into a protective barrier. DEF +15%, MAG +10%.',
    icon: '🔮', effects: { defBonus: 0.15, magBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  METEOR_STORM: {
    id: 'METEOR_STORM', name: 'Meteor Storm', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 18,
    description: 'EPIC — Calls down an apocalyptic meteor storm. 35% proc, 2.5× power, MAG +40%.',
    icon: '☄', effects: { powerMultiplier: 2.5, magBonus: 0.40 }, procChance: 0.35,
    narrative: 'calls down a Meteor Storm — the sky itself falls!',
  },

  // ── Mage Masteries ──
  MAGE_M_ARCANE_FOCUS: {
    id: 'MAGE_M_ARCANE_FOCUS', name: 'Arcane Focus', type: 'passive', source: 'mastery',
    classId: 'MAGE', unlockLevel: 4,
    description: 'MAG +10%, SPD +5%. Sharper magical focus.',
    icon: '✧', effects: { magBonus: 0.10, spdBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  MAGE_M_SPELL_MASTERY: {
    id: 'MAGE_M_SPELL_MASTERY', name: 'Spell Mastery', type: 'passive', source: 'mastery',
    classId: 'MAGE', unlockLevel: 8,
    description: 'MAG +18%, crit chance +6%.',
    icon: '📖', effects: { magBonus: 0.18, critChance: 0.06 }, procChance: 1.0,
    narrative: null,
  },
  MAGE_M_ARCANE_EMPOWERMENT: {
    id: 'MAGE_M_ARCANE_EMPOWERMENT', name: 'Arcane Empowerment', type: 'passive', source: 'mastery',
    classId: 'MAGE', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +6% MAG and +4% SPD from arcane energy.',
    icon: '💫', effects: { partyMagBonus: 0.06, partySpdBonus: 0.04 }, procChance: 1.0,
    narrative: null,
  },
  MAGE_M_MYSTIC_CONVERGENCE: {
    id: 'MAGE_M_MYSTIC_CONVERGENCE', name: 'Mystic Convergence', type: 'passive', source: 'mastery',
    classId: 'MAGE', unlockLevel: 16,
    description: 'MAG +25%, SPD +10%. All spells intensify.',
    icon: '🌌', effects: { magBonus: 0.25, spdBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  MAGE_M_INFINITE_MANA: {
    id: 'MAGE_M_INFINITE_MANA', name: 'Infinite Mana', type: 'passive', source: 'mastery',
    classId: 'MAGE', unlockLevel: 20,
    description: 'EPIC — MAG +35%, crit chance +12%, SPD +8%. Bottomless magical reserves.',
    icon: '♾', effects: { magBonus: 0.35, critChance: 0.12, spdBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ ROGUE — Swift shadow. Crits, evasion, burst damage.                     │
  // │ Role: Physical DPS / crit specialist                                    │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Rogue Skills ──
  SHADOW_STRIKE: {
    id: 'SHADOW_STRIKE', name: 'Shadow Strike', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 2,
    description: 'Strikes from the shadows. 70% proc, ATK +30%, crit +15%.',
    icon: '🗡', effects: { atkBonus: 0.30, critChance: 0.15 }, procChance: 0.70,
    narrative: 'moves like a shadow and strikes with precision!',
  },
  EVASIVE_MANEUVER: {
    id: 'EVASIVE_MANEUVER', name: 'Evasive Maneuver', type: 'passive', source: 'class',
    classId: 'ROGUE', unlockLevel: 6,
    description: 'Dodge chance +18%, SPD +10%. Always one step ahead.',
    icon: '💨', effects: { dodgeChance: 0.18, spdBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  MARK_FOR_DEATH: {
    id: 'MARK_FOR_DEATH', name: 'Mark for Death', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 10,
    description: 'CLASS SKILL — Marks a target for annihilation. 55% proc, party ATK +15% against target, crit +20%.',
    icon: '🎯', effects: { partyAtkBonus: 0.15, critChance: 0.20 }, procChance: 0.55,
    narrative: 'exposes a critical weakness — the target is Marked for Death!',
  },
  SMOKE_BOMB: {
    id: 'SMOKE_BOMB', name: 'Smoke Bomb', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 14,
    description: 'Throws a smoke bomb, boosting evasion. 60% proc, dodge +25%, ATK +15%.',
    icon: '💣', effects: { dodgeChance: 0.25, atkBonus: 0.15 }, procChance: 0.60,
    narrative: 'vanishes in a cloud of smoke — impossible to pin down!',
  },
  ASSASSINATE: {
    id: 'ASSASSINATE', name: 'Assassinate', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 18,
    description: 'EPIC — A lethal strike from the void. 35% proc, 2.3× power, crit +40%.',
    icon: '💀', effects: { powerMultiplier: 2.3, critChance: 0.40 }, procChance: 0.35,
    narrative: 'emerges from the void — Assassinate! The target never saw it coming!',
  },

  // ── Rogue Masteries ──
  ROGUE_M_NIMBLE_FINGERS: {
    id: 'ROGUE_M_NIMBLE_FINGERS', name: 'Nimble Fingers', type: 'passive', source: 'mastery',
    classId: 'ROGUE', unlockLevel: 4,
    description: 'SPD +8%, CRIT +5%, DODGE +3%.',
    icon: '🤏', effects: { spdBonus: 0.08, critBonus: 0.05, dodgeBonus: 0.03 }, procChance: 1.0,
    narrative: null,
  },
  ROGUE_M_CRITICAL_EDGE: {
    id: 'ROGUE_M_CRITICAL_EDGE', name: 'Critical Edge', type: 'passive', source: 'mastery',
    classId: 'ROGUE', unlockLevel: 8,
    description: 'ATK +10%, crit chance +12%.',
    icon: '🔪', effects: { atkBonus: 0.10, critChance: 0.12 }, procChance: 1.0,
    narrative: null,
  },
  ROGUE_M_SHADOW_NETWORK: {
    id: 'ROGUE_M_SHADOW_NETWORK', name: 'Shadow Network', type: 'passive', source: 'mastery',
    classId: 'ROGUE', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +5% SPD, +3% CRIT and +2% DODGE from the Rogue\'s connections.',
    icon: '🕸', effects: { partySpdBonus: 0.05, partyCritBonus: 0.03, partyDodgeBonus: 0.02 }, procChance: 1.0,
    narrative: null,
  },
  ROGUE_M_LETHALITY: {
    id: 'ROGUE_M_LETHALITY', name: 'Lethality', type: 'passive', source: 'mastery',
    classId: 'ROGUE', unlockLevel: 16,
    description: 'ATK +18%, crit chance +10%, SPD +8%.',
    icon: '☠', effects: { atkBonus: 0.18, critChance: 0.10, spdBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  ROGUE_M_DEATH_DEALER: {
    id: 'ROGUE_M_DEATH_DEALER', name: 'Death Dealer', type: 'passive', source: 'mastery',
    classId: 'ROGUE', unlockLevel: 20,
    description: 'EPIC — ATK +25%, crit chance +18%, dodge +15%. The ultimate assassin.',
    icon: '🃏', effects: { atkBonus: 0.25, critChance: 0.18, dodgeChance: 0.15 }, procChance: 1.0,
    narrative: null,
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ CLERIC — Holy healer. Keeps the party alive, bolsters defense.          │
  // │ Role: Healer / support                                                  │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Cleric Skills ──
  HOLY_LIGHT: {
    id: 'HOLY_LIGHT', name: 'Holy Light', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 2,
    description: 'Heals the party with holy energy. 80% proc, party heal 15%, MAG +10%.',
    icon: '✨', effects: { partyHealPct: 0.15, magBonus: 0.10 }, procChance: 0.80,
    narrative: 'calls down Holy Light — wounds close and spirits lift!',
  },
  DIVINE_INTERVENTION: {
    id: 'DIVINE_INTERVENTION', name: 'Divine Intervention', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 6,
    description: 'Intercepts a killing blow on an ally, saving them at 1 HP. 4-round cooldown.',
    icon: '🕊', effects: { savesAlly: true }, procChance: 1.0, cooldown: 4,
    narrative: 'calls upon Divine Intervention — a holy light shields {target} from death!',
  },
  DIVINE_SHIELD: {
    id: 'DIVINE_SHIELD', name: 'Divine Shield', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 10,
    description: 'CLASS SKILL — Wraps the entire party in divine protection. 55% proc, party DEF +18%, party heal 10%.',
    icon: '⛑', effects: { partyDefBonus: 0.18, partyHealPct: 0.10 }, procChance: 0.55,
    narrative: 'calls forth a Divine Shield — holy light protects all!',
  },
  RESURRECTION: {
    id: 'RESURRECTION', name: 'Resurrection', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 14,
    description: 'Revives a fallen party member at 40% HP. 3-round cooldown.',
    icon: '🌟', effects: { revivePct: 0.40 }, procChance: 1.0, cooldown: 3,
    narrative: 'channels holy power — {target} rises from the fallen!',
  },
  DIVINE_PRESENCE: {
    id: 'DIVINE_PRESENCE', name: 'Divine Presence', type: 'passive', source: 'class',
    classId: 'CLERIC', unlockLevel: 18,
    description: 'EPIC — A radiant aura surrounds the Cleric. Party MAG +15%, party DEF +12%, party MAX HP +10%, party heal +8%.',
    icon: '👼', effects: { partyMagBonus: 0.15, partyDefBonus: 0.12, partyHpBonus: 0.10, partyHealBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },

  // ── Cleric Masteries ──
  CLERIC_M_HOLY_DEVOTION: {
    id: 'CLERIC_M_HOLY_DEVOTION', name: 'Holy Devotion', type: 'passive', source: 'mastery',
    classId: 'CLERIC', unlockLevel: 4,
    description: 'MAG +8%, DEF +6%.',
    icon: '🙏', effects: { magBonus: 0.08, defBonus: 0.06 }, procChance: 1.0,
    narrative: null,
  },
  CLERIC_M_DIVINE_GRACE: {
    id: 'CLERIC_M_DIVINE_GRACE', name: 'Divine Grace', type: 'passive', source: 'mastery',
    classId: 'CLERIC', unlockLevel: 8,
    description: 'MAG +12%, MAX HP +10%. Grace under pressure.',
    icon: '🌿', effects: { magBonus: 0.12, maxHpBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  CLERIC_M_SANCTUARY: {
    id: 'CLERIC_M_SANCTUARY', name: 'Sanctuary', type: 'passive', source: 'mastery',
    classId: 'CLERIC', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +6% MAX HP and +4% DEF from the Cleric\'s sanctuary.',
    icon: '☀', effects: { partyHpBonus: 0.06, partyDefBonus: 0.04 }, procChance: 1.0,
    narrative: null,
  },
  CLERIC_M_INNER_LIGHT: {
    id: 'CLERIC_M_INNER_LIGHT', name: 'Inner Light', type: 'passive', source: 'mastery',
    classId: 'CLERIC', unlockLevel: 16,
    description: 'MAG +20%, DEF +12%, MAX HP +10%.',
    icon: '💡', effects: { magBonus: 0.20, defBonus: 0.12, maxHpBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  CLERIC_M_DIVINE_VESSEL: {
    id: 'CLERIC_M_DIVINE_VESSEL', name: 'Divine Vessel', type: 'passive', source: 'mastery',
    classId: 'CLERIC', unlockLevel: 20,
    description: 'EPIC — MAG +30%, DEF +15%, MAX HP +20%. A conduit of divine power.',
    icon: '🏆', effects: { magBonus: 0.30, defBonus: 0.15, maxHpBonus: 0.20 }, procChance: 1.0,
    narrative: null,
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ RANGER — Skilled marksman. Excels in wilderness, high ATK and SPD.      │
  // │ Role: Ranged physical DPS / utility                                     │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Ranger Skills ──
  PRECISION_SHOT: {
    id: 'PRECISION_SHOT', name: 'Precision Shot', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 2,
    description: 'A carefully aimed shot. 70% proc, ATK +25%, crit +15%.',
    icon: '🏹', effects: { atkBonus: 0.25, critChance: 0.15 }, procChance: 0.70,
    narrative: 'draws their bow and releases a Precision Shot!',
  },
  NATURE_BOND: {
    id: 'NATURE_BOND', name: 'Nature Bond', type: 'passive', source: 'class',
    classId: 'RANGER', unlockLevel: 6,
    description: 'Bond with nature grants +12% gold, +12% exp, SPD +8%.',
    icon: '🌲', effects: { goldBonus: 0.12, expBonus: 0.12, spdBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  VOLLEY: {
    id: 'VOLLEY', name: 'Volley', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 10,
    description: 'CLASS SKILL — Rains arrows on all enemies. 50% proc, ATK +35%, 1.3× power.',
    icon: '🎯', effects: { atkBonus: 0.35, powerMultiplier: 1.3 }, procChance: 0.50,
    narrative: 'launches a Volley — arrows rain down on every foe!',
  },
  CAMOUFLAGE: {
    id: 'CAMOUFLAGE', name: 'Camouflage', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 14,
    description: 'Blends into surroundings for a devastating ambush. 55% proc, ATK +25%, dodge +20%.',
    icon: '🍃', effects: { atkBonus: 0.25, dodgeChance: 0.20 }, procChance: 0.55,
    narrative: 'vanishes into the terrain — Camouflage ambush!',
  },
  ARROW_STORM: {
    id: 'ARROW_STORM', name: 'Arrow Storm', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 18,
    description: 'EPIC — Darkens the sky with arrows. 35% proc, 2.0× power, ATK +40%.',
    icon: '🌧', effects: { powerMultiplier: 2.0, atkBonus: 0.40 }, procChance: 0.35,
    narrative: 'darkens the sky — Arrow Storm rains devastation!',
  },

  // ── Ranger Masteries ──
  RANGER_M_KEEN_EYE: {
    id: 'RANGER_M_KEEN_EYE', name: 'Keen Eye', type: 'passive', source: 'mastery',
    classId: 'RANGER', unlockLevel: 4,
    description: 'ATK +8%, CRIT +6%.',
    icon: '👁', effects: { atkBonus: 0.08, critBonus: 0.06 }, procChance: 1.0,
    narrative: null,
  },
  RANGER_M_WILDERNESS_MASTERY: {
    id: 'RANGER_M_WILDERNESS_MASTERY', name: 'Wilderness Mastery', type: 'passive', source: 'mastery',
    classId: 'RANGER', unlockLevel: 8,
    description: 'ATK +12%, SPD +10%, +15% gold and exp.',
    icon: '🐺', effects: { atkBonus: 0.12, spdBonus: 0.10, goldBonus: 0.15, expBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
  RANGER_M_SCOUTS_ADVANTAGE: {
    id: 'RANGER_M_SCOUTS_ADVANTAGE', name: 'Scout\'s Advantage', type: 'passive', source: 'mastery',
    classId: 'RANGER', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +5% ATK and +4% SPD from the Ranger\'s recon.',
    icon: '🔭', effects: { partyAtkBonus: 0.05, partySpdBonus: 0.04 }, procChance: 1.0,
    narrative: null,
  },
  RANGER_M_HUNTER_INSTINCT: {
    id: 'RANGER_M_HUNTER_INSTINCT', name: 'Hunter Instinct', type: 'passive', source: 'mastery',
    classId: 'RANGER', unlockLevel: 16,
    description: 'ATK +18%, SPD +12%, crit +8%.',
    icon: '🦅', effects: { atkBonus: 0.18, spdBonus: 0.12, critChance: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  RANGER_M_APEX_PREDATOR: {
    id: 'RANGER_M_APEX_PREDATOR', name: 'Apex Predator', type: 'passive', source: 'mastery',
    classId: 'RANGER', unlockLevel: 20,
    description: 'EPIC — ATK +25%, SPD +15%, crit +12%, +20% gold/exp. Top of the food chain.',
    icon: '🐻', effects: { atkBonus: 0.25, spdBonus: 0.15, critChance: 0.12, goldBonus: 0.20, expBonus: 0.20 }, procChance: 1.0,
    narrative: null,
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ BARD — Silver-tongued performer. Buffs the party, luck and speed.       │
  // │ Role: Buffer / party utility                                            │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Bard Skills ──
  INSPIRING_SONG: {
    id: 'INSPIRING_SONG', name: 'Inspiring Song', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 2,
    description: 'An uplifting melody. 75% proc, party ATK +10%, party SPD +8%.',
    icon: '🎵', effects: { partyAtkBonus: 0.10, partySpdBonus: 0.08 }, procChance: 0.75,
    narrative: 'plays an Inspiring Song that lifts all spirits!',
  },
  DISCORD: {
    id: 'DISCORD', name: 'Discord', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 6,
    description: 'A jarring melody that devastates enemies. Reduces enemy ATK by 20%, 25% chance enemies fumble attacks, and deals sonic damage each round. Lasts 3 rounds, 4-round cooldown.',
    icon: '🎸', effects: { enemyAtkReduction: 0.20, fumbleChance: 0.25, sonicDot: true }, procChance: 1.0, cooldown: 4,
    narrative: 'strikes a jarring Discord — enemies stagger and falter!',
  },
  MAGNUM_OPUS: {
    id: 'MAGNUM_OPUS', name: 'Magnum Opus', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 10,
    description: 'CLASS SKILL — A legendary performance that empowers every ally. 50% proc, party ATK +15%, party DEF +10%, party SPD +10%.',
    icon: '🎼', effects: { partyAtkBonus: 0.15, partyDefBonus: 0.10, partySpdBonus: 0.10 }, procChance: 0.50,
    narrative: 'performs their Magnum Opus — the entire party transcends their limits!',
  },
  CRESCENDO: {
    id: 'CRESCENDO', name: 'Crescendo', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 14,
    description: 'An inspiring surge that pushes an ally to their absolute limit. Grants the next party attack a guaranteed devastating critical hit (2.5× damage). 3-round cooldown.',
    icon: '🎶', effects: { devastatingCrit: true }, procChance: 1.0, cooldown: 3,
    narrative: 'builds to a Crescendo — the next strike will be devastating!',
  },
  SYMPHONY_OF_WAR: {
    id: 'SYMPHONY_OF_WAR', name: 'Symphony of War', type: 'passive', source: 'class',
    classId: 'BARD', unlockLevel: 18,
    description: 'EPIC — A relentless war anthem empowers the party. Party ATK +15%, party SPD +12%, party CRIT +8%.',
    icon: '🎻', effects: { partyAtkBonus: 0.15, partySpdBonus: 0.12, partyCritBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },

  // ── Bard Masteries ──
  BARD_M_CHARM: {
    id: 'BARD_M_CHARM', name: 'Charm', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 4,
    description: 'CRIT +5%, DODGE +7%, gold +8%. Natural charisma.',
    icon: '💝', effects: { critBonus: 0.05, dodgeBonus: 0.07, goldBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_PERFECT_PITCH: {
    id: 'BARD_M_PERFECT_PITCH', name: 'Perfect Pitch', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 8,
    description: 'MAG +10%, CRIT +4%, DODGE +6%, SPD +8%.',
    icon: '🎤', effects: { magBonus: 0.10, critBonus: 0.04, dodgeBonus: 0.06, spdBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_FORTISSIMO: {
    id: 'BARD_M_FORTISSIMO', name: 'Fortissimo', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +5% ATK, +5% SPD, +2% CRIT and +3% DODGE from the Bard\'s performance.',
    icon: '🔊', effects: { partyAtkBonus: 0.05, partySpdBonus: 0.05, partyCritBonus: 0.02, partyDodgeBonus: 0.03 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_VIRTUOSO: {
    id: 'BARD_M_VIRTUOSO', name: 'Virtuoso', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 16,
    description: 'MAG +15%, CRIT +6%, DODGE +9%, SPD +10%, gold +12%.',
    icon: '🎹', effects: { magBonus: 0.15, critBonus: 0.06, dodgeBonus: 0.09, spdBonus: 0.10, goldBonus: 0.12 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_LEGEND_OF_SONG: {
    id: 'BARD_M_LEGEND_OF_SONG', name: 'Legend of Song', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 20,
    description: 'EPIC — MAG +20%, CRIT +10%, DODGE +15%, SPD +15%, gold +20%. Songs echo through eternity.',
    icon: '🏅', effects: { magBonus: 0.20, critBonus: 0.10, dodgeBonus: 0.15, spdBonus: 0.15, goldBonus: 0.20 }, procChance: 1.0,
    narrative: null,
  },

  // ┌──────────────────────────────────────────────────────────────────────────┐
  // │ MONK — Martial arts master. Balanced, fast, self-sustaining.            │
  // │ Role: Hybrid melee / self-sufficient fighter                            │
  // └──────────────────────────────────────────────────────────────────────────┘

  // ── Monk Skills ──
  SWIFT_PALM: {
    id: 'SWIFT_PALM', name: 'Swift Palm', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 2,
    description: 'A lightning-fast combo. 70% proc, ATK +25%, SPD +15%.',
    icon: '👊', effects: { atkBonus: 0.25, spdBonus: 0.15 }, procChance: 0.70,
    narrative: 'executes a Swift Palm combo!',
  },
  KI_BARRIER: {
    id: 'KI_BARRIER', name: 'Ki Barrier', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 6,
    description: 'Channels ki into a protective aura. 65% proc, DEF +20%, dodge +12%.',
    icon: '🔮', effects: { defBonus: 0.20, dodgeChance: 0.12 }, procChance: 0.65,
    narrative: 'surrounds themselves with a shimmering Ki Barrier!',
  },
  INNER_FOCUS: {
    id: 'INNER_FOCUS', name: 'Inner Focus', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 10,
    description: 'CLASS SKILL — Achieves perfect inner focus. 50% proc, all stats +15%, dodge +15%.',
    icon: '☯', effects: { atkBonus: 0.15, defBonus: 0.15, spdBonus: 0.15, magBonus: 0.15, dodgeBonus: 0.15, dodgeChance: 0.15 }, procChance: 0.50,
    narrative: 'enters a state of perfect Inner Focus — mind, body, and spirit align!',
  },
  COUNTER_STANCE: {
    id: 'COUNTER_STANCE', name: 'Counter Stance', type: 'passive', source: 'class',
    classId: 'MONK', unlockLevel: 14,
    description: 'Turns defense into offense. ATK +12%, DEF +12%, crit +10%.',
    icon: '🤺', effects: { atkBonus: 0.12, defBonus: 0.12, critChance: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  FISTS_OF_FURY: {
    id: 'FISTS_OF_FURY', name: 'Fists of Fury', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 18,
    description: 'EPIC — An unstoppable barrage of ki-infused strikes. 35% proc, 2.0× power, ATK +30%, SPD +20%.',
    icon: '🔥', effects: { powerMultiplier: 2.0, atkBonus: 0.30, spdBonus: 0.20 }, procChance: 0.35,
    narrative: 'enters a trance and unleashes Fists of Fury — a storm of blows!',
  },

  // ── Necromancer ──
  RAISE_DEAD: {
    id: 'RAISE_DEAD', name: 'Raise Dead', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 2,
    description: 'Tears a fallen enemy from death\'s embrace, raising it as a thrall. The minion attacks each round as a living DoT and can absorb hits. 2-round cooldown.',
    icon: '💀', effects: { raiseMinion: true }, procChance: 0.70,
    cooldown: 2, reactive: true,
    narrative: null,
  },
  LIFE_TAP: {
    id: 'LIFE_TAP', name: 'Life Tap', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 6,
    description: 'Drains life force from an enemy, dealing MAG-scaled damage and healing the Necromancer for a portion of damage dealt. 55% proc.',
    icon: '🩸', effects: { magBonus: 0.35, lifesteal: 0.40 }, procChance: 0.55,
    narrative: 'drains the life force from {target}, dark energy flowing back!',
  },
  BLIGHT: {
    id: 'BLIGHT', name: 'Blight', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 10,
    description: 'CLASS SKILL — Unleashes a wave of necrotic decay across all enemies. Deals MAG-scaled AoE DoT over 3 rounds. 45% proc.',
    icon: '☠', effects: { necroticDot: true, powerMultiplier: 1.2 }, procChance: 0.45,
    cooldown: 4,
    narrative: 'unleashes a wave of Blight — necrotic decay spreads through the enemy ranks!',
  },
  FORGO_DEATH: {
    id: 'FORGO_DEATH', name: 'Forgo Death', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 14,
    description: 'When the Necromancer takes a killing blow and a raised minion exists, the minion is destroyed instead and the Necromancer survives at 20% HP.',
    icon: '🛡', effects: { minionSacrifice: true, survivePercent: 0.20 }, procChance: 1.0,
    reactive: true,
    narrative: null,
  },
  ARMY_OF_THE_DAMNED: {
    id: 'ARMY_OF_THE_DAMNED', name: 'Army of the Damned', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 18,
    description: 'EPIC — All fallen enemies rise as one, attacking for 3 rounds and spreading Blight. 35% proc, 2.5× power.',
    icon: '👻', effects: { raiseArmy: true, powerMultiplier: 2.5, necroticDot: true }, procChance: 0.35,
    cooldown: 5,
    narrative: 'tears open the veil — the fallen rise as one in an Army of the Damned!',
  },

  // ── Monk Masteries ──
  MONK_M_BALANCE: {
    id: 'MONK_M_BALANCE', name: 'Balance', type: 'passive', source: 'mastery',
    classId: 'MONK', unlockLevel: 4,
    description: 'ATK +5%, DEF +5%, SPD +5%, MAG +5%, DODGE +5%. The path to balance begins.',
    icon: '⚖', effects: { atkBonus: 0.05, defBonus: 0.05, spdBonus: 0.05, magBonus: 0.05, dodgeBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  MONK_M_IRON_BODY: {
    id: 'MONK_M_IRON_BODY', name: 'Iron Body', type: 'passive', source: 'mastery',
    classId: 'MONK', unlockLevel: 8,
    description: 'ATK +10%, DEF +10%, dodge +8%.',
    icon: '🏋', effects: { atkBonus: 0.10, defBonus: 0.10, dodgeChance: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  MONK_M_KI_RESONANCE: {
    id: 'MONK_M_KI_RESONANCE', name: 'Ki Resonance', type: 'passive', source: 'mastery',
    classId: 'MONK', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +4% ATK, +4% DEF, and +4% SPD from the Monk\'s ki.',
    icon: '🧘', effects: { partyAtkBonus: 0.04, partyDefBonus: 0.04, partySpdBonus: 0.04 }, procChance: 1.0,
    narrative: null,
  },
  MONK_M_ENLIGHTENMENT: {
    id: 'MONK_M_ENLIGHTENMENT', name: 'Enlightenment', type: 'passive', source: 'mastery',
    classId: 'MONK', unlockLevel: 16,
    description: 'ATK +10%, DEF +10%, SPD +10%, MAG +10%, DODGE +10%.',
    icon: '🪷', effects: { atkBonus: 0.10, defBonus: 0.10, spdBonus: 0.10, magBonus: 0.10, dodgeBonus: 0.10, dodgeChance: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  MONK_M_TRANSCENDENCE: {
    id: 'MONK_M_TRANSCENDENCE', name: 'Transcendence', type: 'passive', source: 'mastery',
    classId: 'MONK', unlockLevel: 20,
    description: 'EPIC — All core stats +15%, dodge +15%. Perfect martial enlightenment.',
    icon: '🌅', effects: { atkBonus: 0.15, defBonus: 0.15, spdBonus: 0.15, magBonus: 0.15, dodgeBonus: 0.15, dodgeChance: 0.15 }, procChance: 1.0,
    narrative: null,
  },

  // ── Necromancer Masteries ──
  NECRO_M_GRAVE_CHILL: {
    id: 'NECRO_M_GRAVE_CHILL', name: 'Grave Chill', type: 'passive', source: 'mastery',
    classId: 'NECROMANCER', unlockLevel: 4,
    description: 'MAG +8%, SPD +5%. Early power ramp — the cold of the grave seeps into every spell.',
    icon: '🥶', effects: { magBonus: 0.08, spdBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  NECRO_M_SOUL_HARVEST: {
    id: 'NECRO_M_SOUL_HARVEST', name: 'Soul Harvest', type: 'passive', source: 'mastery',
    classId: 'NECROMANCER', unlockLevel: 8,
    description: 'MAG +12%, CRIT +8%. Feeding on the energy of fallen souls.',
    icon: '👁', effects: { magBonus: 0.12, critChance: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  NECRO_M_SHROUD_OF_DECAY: {
    id: 'NECRO_M_SHROUD_OF_DECAY', name: 'Shroud of Decay', type: 'passive', source: 'mastery',
    classId: 'NECROMANCER', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +6% MAG, +4% CRIT. Enemies that strike party members take necrotic reflect damage scaled from the Necromancer\'s MAG.',
    icon: '💜', effects: { partyMagBonus: 0.06, partyCritBonus: 0.04, necroticReflect: true }, procChance: 1.0,
    narrative: null,
  },
  NECRO_M_UNDYING_WILL: {
    id: 'NECRO_M_UNDYING_WILL', name: 'Undying Will', type: 'passive', source: 'mastery',
    classId: 'NECROMANCER', unlockLevel: 16,
    description: 'MAG +18%, DEF +10%, maxHP +8%. Growing harder to put down.',
    icon: '🦴', effects: { magBonus: 0.18, defBonus: 0.10, maxHpBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  NECRO_M_LORD_OF_THE_DEAD: {
    id: 'NECRO_M_LORD_OF_THE_DEAD', name: 'Lord of the Dead', type: 'passive', source: 'mastery',
    classId: 'NECROMANCER', unlockLevel: 20,
    description: 'EPIC — MAG +30%, CRIT +12%, ATK +10%, maxHP +10%. Raised minions deal 25% more damage.',
    icon: '👑', effects: { magBonus: 0.30, critChance: 0.12, atkBonus: 0.10, maxHpBonus: 0.10, minionDamageBonus: 0.25 }, procChance: 1.0,
    narrative: null,
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // EQUIPMENT-GRANTED SKILLS (item procs — completely separate from class skills)
  // ══════════════════════════════════════════════════════════════════════════════

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
    description: 'Venom Fang coats attacks in deadly poison.',
    icon: '🐍', effects: { atkBonus: 0.45, critChance: 0.15 }, procChance: 0.55,
    narrative: 'coats the Venom Fang in deadly poison and strikes!',
  },
  DUAL_THRUST: {
    id: 'DUAL_THRUST', name: 'Dual Thrust', type: 'active', source: 'equipment',
    itemId: 'SHADOW_EDGE', unlockLevel: null,
    description: 'Shadow Edge strikes twice in a single heartbeat.',
    icon: '⚔', effects: { atkBonus: 0.80, spdBonus: 0.20, critChance: 0.30 }, procChance: 0.50,
    narrative: 'thrusts the Shadow Edge twice in the blink of an eye!',
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
    description: 'Flamberge cleaves through armor with devastating force.',
    icon: '⚔', effects: { atkBonus: 0.75, defPierce: 0.30 }, procChance: 0.50,
    narrative: 'brings the Flamberge down in a devastating Cleaving Strike!',
  },
  DRAGON_FIST: {
    id: 'DRAGON_FIST', name: 'Dragon Fist', type: 'active', source: 'equipment',
    itemId: 'DRAGON_CLAW', unlockLevel: null,
    description: 'Dragon Claw channels draconic ki into a devastating strike.',
    icon: '🐉', effects: { atkBonus: 0.80, spdBonus: 0.25, critChance: 0.25 }, procChance: 0.50,
    narrative: 'channels draconic ki and unleashes a Dragon Fist!',
  },
  HEAVENLY_PALM: {
    id: 'HEAVENLY_PALM', name: 'Heavenly Palm', type: 'active', source: 'equipment',
    itemId: 'CELESTIAL_BO', unlockLevel: null,
    description: 'Celestial Bo channels heavenly force into a thunderous palm strike.',
    icon: '✨', effects: { atkBonus: 0.85, spdBonus: 0.20, defBonus: 0.15 }, procChance: 0.50,
    narrative: 'channels the heavens and strikes with a Heavenly Palm!',
  },
  DIVINE_GRACE_EQ: {
    id: 'DIVINE_GRACE_EQ', name: 'Staff of Grace', type: 'active', source: 'equipment',
    itemId: 'DIVINE_STAFF', unlockLevel: null,
    description: 'The Divine Staff channels holy energy, bolstering the party.',
    icon: '🌟', effects: { magBonus: 0.40, healBonus: 0.25 }, procChance: 0.55,
    narrative: 'channels the Staff of Grace — holy energy surges forth!',
  },
  HOLY_SMITE: {
    id: 'HOLY_SMITE', name: 'Holy Smite', type: 'active', source: 'equipment',
    itemId: 'TEMPLARS_FLAIL', unlockLevel: null,
    description: 'Calls down holy wrath through the flail.',
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
  // ── Mid-tier equipment procs ──
  GUARDIAN_SLASH: {
    id: 'GUARDIAN_SLASH', name: 'Guardian Slash', type: 'active', source: 'equipment',
    itemId: 'GUARDIAN_BLADE', unlockLevel: null,
    description: 'Strikes with a guardian\'s resolve, balancing offense and defense.',
    icon: '🛡', effects: { atkBonus: 0.30, defBonus: 0.25, maxHpBonus: 0.05 }, procChance: 0.45,
    narrative: 'strikes with a guardian\'s resolve!',
  },
  BULWARK_CLEAVE: {
    id: 'BULWARK_CLEAVE', name: 'Bulwark Cleave', type: 'active', source: 'equipment',
    itemId: 'FLAMBERGE', unlockLevel: null,
    description: 'Brings down a devastating defensive cleave.',
    icon: '⚔', effects: { atkBonus: 0.40, defBonus: 0.30, maxHpBonus: 0.08 }, procChance: 0.45,
    narrative: 'brings down a devastating defensive cleave!',
  },
  VENOM_STRIKE: {
    id: 'VENOM_STRIKE', name: 'Venom Strike', type: 'active', source: 'equipment',
    itemId: 'SHADOW_EDGE', unlockLevel: null,
    description: 'Coats the blade in deadly venom and strikes with precision.',
    icon: '🐍', effects: { atkBonus: 0.55, critChance: 0.20, spdBonus: 0.15 }, procChance: 0.45,
    narrative: 'coats the blade in deadly venom and strikes!',
  },
  EVASIVE_STRIKE: {
    id: 'EVASIVE_STRIKE', name: 'Evasive Strike', type: 'active', source: 'equipment',
    itemId: 'SHADOW_EDGE', unlockLevel: null,
    description: 'Weaves through danger and strikes from the shadows.',
    icon: '💨', effects: { atkBonus: 0.30, dodgeChance: 0.25, defBonus: 0.15 }, procChance: 0.45,
    narrative: 'weaves through danger and strikes from the shadows!',
  },
  IRON_BODY: {
    id: 'IRON_BODY', name: "Dragon's Fortitude", type: 'active', source: 'equipment',
    itemId: 'DRAGON_CLAW', unlockLevel: null,
    description: 'The Dragon Claw channels draconic toughness, hardening the body and countering with force.',
    icon: '🪨', effects: { atkBonus: 0.30, defBonus: 0.30, dodgeChance: 0.15 }, procChance: 0.45,
    narrative: "channels Dragon's Fortitude — skin hardens like scales!",
  },
  MOUNTAIN_STANCE: {
    id: 'MOUNTAIN_STANCE', name: 'Mountain Stance', type: 'active', source: 'equipment',
    itemId: 'CELESTIAL_BO', unlockLevel: null,
    description: 'Roots into an immovable and powerful stance.',
    icon: '⛰', effects: { defBonus: 0.40, atkBonus: 0.25, maxHpBonus: 0.08 }, procChance: 0.45,
    narrative: 'roots into Mountain Stance — immovable and powerful!',
  },
  NATURE_WARD: {
    id: 'NATURE_WARD', name: 'Nature Ward', type: 'active', source: 'equipment',
    itemId: 'STORMREND_BOW', unlockLevel: null,
    description: 'Calls upon nature\'s protection while firing arrows.',
    icon: '🌿', effects: { atkBonus: 0.35, defBonus: 0.20, healBonus: 0.10 }, procChance: 0.45,
    narrative: 'calls upon nature\'s protection while firing!',
  },
  // ── Ranger Quiver procs ──
  QUICK_DRAW: {
    id: 'QUICK_DRAW', name: 'Quick Draw', type: 'active', source: 'equipment',
    itemId: 'WINDRUNNER_QUIVER', unlockLevel: null,
    description: 'Wind-enchanted quiver feeds arrows faster, boosting attack speed.',
    icon: '💨', effects: { spdBonus: 0.30, atkBonus: 0.15, critChance: 0.10 }, procChance: 0.40,
    narrative: 'draws arrows with blinding speed from the Windrunner Quiver!',
  },
  SHADOW_SHOT: {
    id: 'SHADOW_SHOT', name: 'Shadow Shot', type: 'active', source: 'equipment',
    itemId: 'SHADOWSTRIKE_QUIVER', unlockLevel: null,
    description: 'Fires a shadow-infused arrow that strikes before the enemy can react.',
    icon: '🌑', effects: { atkBonus: 0.40, critChance: 0.25, spdBonus: 0.15 }, procChance: 0.45,
    narrative: 'fires a shadow-infused arrow from the Shadowstrike Quiver!',
  },
  GALE_BARRAGE: {
    id: 'GALE_BARRAGE', name: 'Gale Barrage', type: 'active', source: 'equipment',
    itemId: 'GALE_QUIVER', unlockLevel: null,
    description: 'Unleashes a storm-charged volley of arrows that tears through the enemy ranks.',
    icon: '🌪', effects: { atkBonus: 0.55, spdBonus: 0.25, critChance: 0.20, defPierce: 0.15 }, procChance: 0.50,
    narrative: 'unleashes a Gale Barrage — arrows scream through the air like a storm!',
  },
  SIREN_SONG: {
    id: 'SIREN_SONG', name: 'Siren Song', type: 'active', source: 'equipment',
    itemId: 'SIREN_HARP', unlockLevel: null,
    description: 'Plays a mesmerizing Siren Song that enchants and heals.',
    icon: '🎵', effects: { magBonus: 0.55, healBonus: 0.15, critBonus: 0.06, dodgeBonus: 0.09 }, procChance: 0.50,
    narrative: 'plays a mesmerizing Siren Song!',
  },
  BATTLE_MARCH: {
    id: 'BATTLE_MARCH', name: 'Battle March', type: 'active', source: 'equipment',
    itemId: 'THUNDERDRUM', unlockLevel: null,
    description: 'Beats a rousing Battle March that rallies allies.',
    icon: '🥁', effects: { magBonus: 0.35, defBonus: 0.20, healBonus: 0.15 }, procChance: 0.50,
    narrative: 'beats a rousing Battle March!',
  },
  TEMPLAR_MIGHT: {
    id: 'TEMPLAR_MIGHT', name: 'Templar Might', type: 'active', source: 'equipment',
    itemId: 'TEMPLAR_PLATE', unlockLevel: null,
    description: 'Channels the might of ancient templars.',
    icon: '✦', effects: { atkBonus: 0.20, defBonus: 0.15 }, procChance: 0.45,
    narrative: 'channels the might of ancient templars!',
  },
  CHAIN_WARD: {
    id: 'CHAIN_WARD', name: 'Chain Ward', type: 'active', source: 'equipment',
    itemId: 'SHADOW_CHAIN', unlockLevel: null,
    description: 'Activates a protective Chain Ward.',
    icon: '🔗', effects: { defBonus: 0.25, dodgeChance: 0.10 }, procChance: 0.45,
    narrative: 'activates a Chain Ward!',
  },
  TIGER_SPIRIT: {
    id: 'TIGER_SPIRIT', name: 'Tiger Spirit', type: 'active', source: 'equipment',
    itemId: 'TIGER_HIDE', unlockLevel: null,
    description: 'Channels the tiger\'s ferocity for deadly speed.',
    icon: '🐯', effects: { atkBonus: 0.25, spdBonus: 0.15 }, procChance: 0.45,
    narrative: 'channels the tiger\'s ferocity!',
  },
  DIAMOND_SKIN: {
    id: 'DIAMOND_SKIN', name: 'Diamond Skin', type: 'active', source: 'equipment',
    itemId: 'STONE_SKIN_VEST', unlockLevel: null,
    description: 'Activates hardened Diamond Skin for unbreakable defense.',
    icon: '💎', effects: { defBonus: 0.35, dodgeChance: 0.10 }, procChance: 0.45,
    narrative: 'activates Diamond Skin!',
  },
  ARCANE_SURGE: {
    id: 'ARCANE_SURGE', name: 'Arcane Surge', type: 'active', source: 'equipment',
    itemId: 'ARCANE_VESTMENTS', unlockLevel: null,
    description: 'Unleashes an Arcane Surge of magical power.',
    icon: '✨', effects: { magBonus: 0.25, critChance: 0.15 }, procChance: 0.45,
    narrative: 'unleashes an Arcane Surge!',
  },
  DIVINE_WARD: {
    id: 'DIVINE_WARD', name: 'Divine Ward', type: 'active', source: 'equipment',
    itemId: 'SANCTIFIED_VESTMENTS', unlockLevel: null,
    description: 'Weaves a Divine Ward of holy protection.',
    icon: '🙏', effects: { defBonus: 0.25, magBonus: 0.15 }, procChance: 0.45,
    narrative: 'weaves a Divine Ward!',
  },
  SHIELD_BASH: {
    id: 'SHIELD_BASH', name: 'Shield Bash', type: 'active', source: 'equipment',
    itemId: 'SPIKED_SHIELD', unlockLevel: null,
    description: 'Bashes with shield force, combining offense and defense.',
    icon: '🎯', effects: { atkBonus: 0.20, defBonus: 0.15 }, procChance: 0.45,
    narrative: 'bashes with their shield!',
  },
  VOID_BURST: {
    id: 'VOID_BURST', name: 'Void Burst', type: 'active', source: 'equipment',
    itemId: 'VOID_ORB', unlockLevel: null,
    description: 'Unleashes a Void Burst of unstable magic.',
    icon: '🌀', effects: { magBonus: 0.40, critChance: 0.20 }, procChance: 0.45,
    narrative: 'unleashes a Void Burst!',
  },
  SANCTUARY: {
    id: 'SANCTUARY', name: 'Holy Sanctuary', type: 'active', source: 'equipment',
    itemId: 'HOLY_ORB', unlockLevel: null,
    description: 'The Holy Orb creates a sanctuary of light for protection and healing.',
    icon: '☀', effects: { defBonus: 0.30, healBonus: 0.20 }, procChance: 0.50,
    narrative: 'calls forth a Holy Sanctuary — light shields the party!',
  },
  DRAGON_SPIRIT: {
    id: 'DRAGON_SPIRIT', name: 'Dragon Spirit', type: 'active', source: 'equipment',
    itemId: 'DRAGON_GI', unlockLevel: null,
    description: 'Channels the Dragon Spirit for fierce power.',
    icon: '🐲', effects: { atkBonus: 0.35, spdBonus: 0.25, critChance: 0.15 }, procChance: 0.55,
    narrative: 'channels the Dragon Spirit!',
  },
  INNER_PEACE: {
    id: 'INNER_PEACE', name: 'Inner Peace', type: 'active', source: 'equipment',
    itemId: 'NIRVANA_SHROUD', unlockLevel: null,
    description: 'Achieves Inner Peace becoming serene and unbreakable.',
    icon: '☮', effects: { defBonus: 0.45, dodgeChance: 0.20, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'achieves Inner Peace — serene and unbreakable!',
  },
  AEGIS_AURA: {
    id: 'AEGIS_AURA', name: 'Aegis Aura', type: 'active', source: 'equipment',
    itemId: 'AMULET_OF_AGES', unlockLevel: null,
    description: 'Radiates an Aegis Aura of protective power.',
    icon: '✦', effects: { defBonus: 0.40, maxHpBonus: 0.15 }, procChance: 0.55,
    narrative: 'radiates an Aegis Aura!',
  },

  // ── Legendary equipment procs ──
  RADIANT_STRIKE: {
    id: 'RADIANT_STRIKE', name: 'Radiant Strike', type: 'active', source: 'equipment',
    itemId: 'EXCALIBUR', unlockLevel: null,
    description: 'Channels blinding radiance into a devastating strike.',
    icon: '☀', effects: { atkBonus: 0.70, critChance: 0.30, defPierce: 0.15 }, procChance: 0.60,
    narrative: 'channels blinding radiance into a devastating strike!',
  },
  DIVINE_OATH: {
    id: 'DIVINE_OATH', name: 'Divine Oath', type: 'active', source: 'equipment',
    itemId: 'OATHKEEPER', unlockLevel: null,
    description: 'Swears a Divine Oath where power and protection surge.',
    icon: '✝', effects: { atkBonus: 0.45, defBonus: 0.40, maxHpBonus: 0.15 }, procChance: 0.60,
    narrative: 'swears a Divine Oath — power and protection surge!',
  },
  WORLD_CLEAVE: {
    id: 'WORLD_CLEAVE', name: 'World Cleave', type: 'active', source: 'equipment',
    itemId: 'RAGNAROK', unlockLevel: null,
    description: 'Cleaves with the force to split the world.',
    icon: '🌍', effects: { atkBonus: 1.00, defPierce: 0.40, critChance: 0.20 }, procChance: 0.55,
    narrative: 'cleaves with the force to split the world!',
  },
  ASSASSINATION: {
    id: 'ASSASSINATION', name: 'Assassination', type: 'active', source: 'equipment',
    itemId: 'DEATHS_WHISPER', unlockLevel: null,
    description: 'Strikes from the void in an instant kill attempt.',
    icon: '💀', effects: { atkBonus: 0.85, critChance: 0.40, dodgeChance: 0.20 }, procChance: 0.55,
    narrative: 'strikes from the void — an instant kill attempt!',
  },
  ASURA_FURY: {
    id: 'ASURA_FURY', name: 'Asura Fury', type: 'active', source: 'equipment',
    itemId: 'ASURA_CLAW', unlockLevel: null,
    description: 'Enters Asura Fury for a storm of devastating blows.',
    icon: '👹', effects: { atkBonus: 0.90, spdBonus: 0.30, critChance: 0.30 }, procChance: 0.55,
    narrative: 'enters Asura Fury — a storm of devastating blows!',
  },
  MONKEY_KING: {
    id: 'MONKEY_KING', name: 'Monkey King', type: 'active', source: 'equipment',
    itemId: 'RUYI_JINGU', unlockLevel: null,
    description: 'Channels the Monkey King\'s legendary power.',
    icon: '🐵', effects: { atkBonus: 0.95, spdBonus: 0.25, defBonus: 0.20 }, procChance: 0.55,
    narrative: 'channels the Monkey King\'s legendary power!',
  },
  CELESTIAL_VOLLEY: {
    id: 'CELESTIAL_VOLLEY', name: 'Celestial Volley', type: 'active', source: 'equipment',
    itemId: 'ARTEMIS_BOW', unlockLevel: null,
    description: 'Fires a Celestial Volley of arrows made of pure starlight.',
    icon: '🌠', effects: { atkBonus: 0.80, spdBonus: 0.25, critChance: 0.30 }, procChance: 0.55,
    narrative: 'fires a Celestial Volley — arrows of pure starlight!',
  },
  ARCANE_CATACLYSM_EQ: {
    id: 'ARCANE_CATACLYSM_EQ', name: 'Cataclysm: Staff of Ages', type: 'active', source: 'equipment',
    itemId: 'STAFF_OF_AGES', unlockLevel: null,
    description: 'The Staff of Ages unleashes a devastating Arcane Cataclysm.',
    icon: '💥', effects: { magBonus: 0.85, critChance: 0.25, defPierce: 0.20 }, procChance: 0.55,
    narrative: 'unleashes an Arcane Cataclysm!',
  },
  WORLD_BLESSING: {
    id: 'WORLD_BLESSING', name: 'World Blessing', type: 'active', source: 'equipment',
    itemId: 'STAFF_OF_DAWN', unlockLevel: null,
    description: 'Channels the World Blessing as divine power flows.',
    icon: '✧', effects: { magBonus: 0.55, healBonus: 0.40, defBonus: 0.20 }, procChance: 0.60,
    narrative: 'channels the World Blessing — divine power flows!',
  },
  ORPHIC_HYMN: {
    id: 'ORPHIC_HYMN', name: 'Orphic Hymn', type: 'active', source: 'equipment',
    itemId: 'ORPHEUS_LYRE', unlockLevel: null,
    description: 'Performs the legendary Orphic Hymn with divine power.',
    icon: '🎼', effects: { magBonus: 0.75, healBonus: 0.30, critBonus: 0.10, dodgeBonus: 0.15 }, procChance: 0.60,
    narrative: 'performs the legendary Orphic Hymn!',
  },
  ETERNAL_RHYTHM: {
    id: 'ETERNAL_RHYTHM', name: 'Eternal Rhythm', type: 'active', source: 'equipment',
    itemId: 'DRUMS_OF_ETERNITY', unlockLevel: null,
    description: 'Beats the Eternal Rhythm as timeless power resonates.',
    icon: '🎶', effects: { magBonus: 0.50, defBonus: 0.30, healBonus: 0.30 }, procChance: 0.60,
    narrative: 'beats the Eternal Rhythm — timeless power resonates!',
  },
  DRAGON_FURY: {
    id: 'DRAGON_FURY', name: 'Dragon Fury', type: 'active', source: 'equipment',
    itemId: 'DRAGON_PLATE', unlockLevel: null,
    description: 'Channels the fury of dragons.',
    icon: '🐉', effects: { atkBonus: 0.35, defBonus: 0.20, critChance: 0.15 }, procChance: 0.55,
    narrative: 'channels the fury of dragons!',
  },
  ADAMANTINE_WALL: {
    id: 'ADAMANTINE_WALL', name: 'Adamantine Wall', type: 'active', source: 'equipment',
    itemId: 'ADAMANTINE_PLATE', unlockLevel: null,
    description: 'Becomes an Adamantine Wall of impenetrable defense.',
    icon: '🏔', effects: { defBonus: 0.50, maxHpBonus: 0.15 }, procChance: 0.55,
    narrative: 'becomes an Adamantine Wall!',
  },
  SHADOW_DANCE: {
    id: 'SHADOW_DANCE', name: 'Shadow Dance', type: 'active', source: 'equipment',
    itemId: 'PHANTOM_CHAIN', unlockLevel: null,
    description: 'Enters a Shadow Dance becoming untouchable.',
    icon: '💃', effects: { dodgeChance: 0.45, critChance: 0.20 }, procChance: 0.55,
    narrative: 'enters a Shadow Dance — untouchable!',
  },
  CELESTIAL_AEGIS: {
    id: 'CELESTIAL_AEGIS', name: 'Celestial Aegis', type: 'active', source: 'equipment',
    itemId: 'CELESTIAL_CHAIN', unlockLevel: null,
    description: 'Activates a Celestial Aegis of heavenly protection.',
    icon: '🛡', effects: { defBonus: 0.40, dodgeChance: 0.15, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'activates a Celestial Aegis!',
  },
  NIRVANA_AURA: {
    id: 'NIRVANA_AURA', name: 'Nirvana Aura', type: 'active', source: 'equipment',
    itemId: 'NIRVANA_SHROUD', unlockLevel: null,
    description: 'Radiates the Nirvana Aura — transcendent peace and power.',
    icon: '☮', effects: { defBonus: 0.45, dodgeChance: 0.20, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'radiates the Nirvana Aura — transcendent peace!',
  },
  CELESTIAL_WARD: {
    id: 'CELESTIAL_WARD', name: 'Celestial Ward', type: 'active', source: 'equipment',
    itemId: 'CELESTIAL_ROBES', unlockLevel: null,
    description: 'Celestial Robes weave a ward of starlight.',
    icon: '⭐', effects: { defBonus: 0.30, magBonus: 0.20 }, procChance: 0.50,
    narrative: 'weaves a Celestial Ward of starlight!',
  },
  ETERNAL_WARD: {
    id: 'ETERNAL_WARD', name: 'Eternal Ward', type: 'active', source: 'equipment',
    itemId: 'ROBES_OF_ETERNITY', unlockLevel: null,
    description: 'Weaves an Eternal Ward of timeless power.',
    icon: '🌀', effects: { defBonus: 0.40, magBonus: 0.20, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'weaves an Eternal Ward!',
  },
  AEGIS_COUNTER: {
    id: 'AEGIS_COUNTER', name: 'Aegis Counter', type: 'active', source: 'equipment',
    itemId: 'AEGIS', unlockLevel: null,
    description: 'Counters with overwhelming Aegis power.',
    icon: '⚡', effects: { atkBonus: 0.30, defBonus: 0.25, critChance: 0.15 }, procChance: 0.55,
    narrative: 'counters with the Aegis!',
  },
  ETERNAL_GUARD: {
    id: 'ETERNAL_GUARD', name: 'Eternal Guard', type: 'active', source: 'equipment',
    itemId: 'WALL_OF_AGES', unlockLevel: null,
    description: 'Raises the Eternal Guard where nothing gets through.',
    icon: '🔰', effects: { defBonus: 0.65, maxHpBonus: 0.20 }, procChance: 0.55,
    narrative: 'raises the Eternal Guard — nothing gets through!',
  },
  TEMPORAL_FLUX: {
    id: 'TEMPORAL_FLUX', name: 'Temporal Flux', type: 'active', source: 'equipment',
    itemId: 'ROBES_OF_ETERNITY', unlockLevel: null,
    description: 'The Robes of Eternity distort time itself, accelerating spellcasting and amplifying magic.',
    icon: '⏳', effects: { magBonus: 0.40, spdBonus: 0.25, critChance: 0.15 }, procChance: 0.55,
    narrative: 'warps the flow of time — spells arrive before they are cast!',
  },
  MYTHRIL_REFLEX: {
    id: 'MYTHRIL_REFLEX', name: 'Mythril Reflex', type: 'active', source: 'equipment',
    itemId: 'MYTHRIL_CHAIN', unlockLevel: null,
    description: 'The Mythril Chain reacts to danger, hardening on impact and boosting evasion.',
    icon: '⚡', effects: { dodgeChance: 0.30, defBonus: 0.25, spdBonus: 0.15 }, procChance: 0.55,
    narrative: 'triggers Mythril Reflex — the armor shimmers and hardens on impact!',
  },
  GENESIS_WARD: {
    id: 'GENESIS_WARD', name: 'Genesis Ward', type: 'active', source: 'equipment',
    itemId: 'ORB_OF_CREATION', unlockLevel: null,
    description: 'Creates a Genesis Ward of primordial power.',
    icon: '🌅', effects: { defBonus: 0.40, magBonus: 0.30, healBonus: 0.25 }, procChance: 0.55,
    narrative: 'creates a Genesis Ward of primordial power!',
  },
  ETERNITY_PULSE: {
    id: 'ETERNITY_PULSE', name: 'Eternity Pulse', type: 'active', source: 'equipment',
    itemId: 'ORB_OF_ETERNITY', unlockLevel: null,
    description: 'Pulses with the power of eternity.',
    icon: '💫', effects: { magBonus: 0.45, critChance: 0.20, spdBonus: 0.10 }, procChance: 0.55,
    narrative: 'pulses with the power of eternity!',
  },
  BATTLE_FURY: {
    id: 'BATTLE_FURY', name: 'Battle Fury', type: 'active', source: 'equipment',
    itemId: 'AMULET_OF_FURY', unlockLevel: null,
    description: 'Enters a state of Battle Fury for overwhelming power.',
    icon: '🔥', effects: { powerMultiplier: 1.6, critChance: 0.15 }, procChance: 0.55,
    narrative: 'enters a state of Battle Fury!',
  },
  AGELESS_WISDOM: {
    id: 'AGELESS_WISDOM', name: 'Ageless Wisdom', type: 'active', source: 'equipment',
    itemId: 'AMULET_OF_AGES', unlockLevel: null,
    description: 'Channels ageless wisdom for balanced power.',
    icon: '📿', effects: { defBonus: 0.30, magBonus: 0.20, maxHpBonus: 0.10 }, procChance: 0.55,
    narrative: 'channels ageless wisdom!',
  },
  ARCANE_OVERFLOW: {
    id: 'ARCANE_OVERFLOW', name: 'Arcane Overflow', type: 'active', source: 'equipment',
    itemId: 'AMULET_OF_ARCANA', unlockLevel: null,
    description: 'Overflows with Arcane power for magical devastation.',
    icon: '💫', effects: { magBonus: 0.45, critChance: 0.20, spdBonus: 0.10 }, procChance: 0.55,
    narrative: 'overflows with Arcane power!',
  },
  GRACE_ETERNAL: {
    id: 'GRACE_ETERNAL', name: 'Grace Eternal', type: 'active', source: 'equipment',
    itemId: 'AMULET_OF_GRACE', unlockLevel: null,
    description: 'Channels Grace Eternal for divine protection and healing.',
    icon: '🕊', effects: { defBonus: 0.30, healBonus: 0.35, magBonus: 0.15 }, procChance: 0.55,
    narrative: 'channels Grace Eternal!',
  },

  // ── Necromancer Equipment Procs ──
  WHISPER_DRAIN: {
    id: 'WHISPER_DRAIN', name: 'Whisper Drain', type: 'active', source: 'equipment',
    itemId: 'STAFF_OF_WHISPERS', unlockLevel: null,
    description: 'Staff of Whispers siphons life from the target. Deals MAG damage and heals.',
    icon: '🌑', effects: { magBonus: 0.40, lifesteal: 0.30 }, procChance: 0.45,
    narrative: 'channels the Staff of Whispers — life force flows from the wound!',
  },
  DEATHRATTLE: {
    id: 'DEATHRATTLE', name: 'Deathrattle', type: 'active', source: 'equipment',
    itemId: 'DEATHRATTLE_STAFF', unlockLevel: null,
    description: 'Deathrattle Staff unleashes a death scream that damages all enemies.',
    icon: '📯', effects: { magBonus: 0.50, powerMultiplier: 1.3 }, procChance: 0.45,
    narrative: 'slams the Deathrattle Staff — a piercing death scream echoes across the battlefield!',
  },
  SOUL_REAP: {
    id: 'SOUL_REAP', name: 'Soul Reap', type: 'active', source: 'equipment',
    itemId: 'SOUL_HARVESTER', unlockLevel: null,
    description: 'Soul Harvester reaps a sliver of the target\'s soul for devastating damage.',
    icon: '👤', effects: { magBonus: 0.55, critChance: 0.20 }, procChance: 0.45,
    narrative: 'reaps with the Soul Harvester — a ghostly echo tears free from the target!',
  },
  ABYSSAL_HARVEST: {
    id: 'ABYSSAL_HARVEST', name: 'Abyssal Harvest', type: 'active', source: 'equipment',
    itemId: 'ABYSSAL_SCYTHE', unlockLevel: null,
    description: 'Abyssal Scythe tears open a rift, dealing massive damage and draining life.',
    icon: '🌀', effects: { magBonus: 0.60, lifesteal: 0.35, powerMultiplier: 1.4 }, procChance: 0.45,
    narrative: 'sweeps the Abyssal Scythe — reality tears open and devours the target!',
  },
  SKULL_WHISPER: {
    id: 'SKULL_WHISPER', name: 'Skull Whisper', type: 'passive', source: 'equipment',
    itemId: 'WHISPERING_SKULL', unlockLevel: null,
    description: 'Whispering Skull grants +12% MAG and +6% CRIT.',
    icon: '💬', effects: { magBonus: 0.12, critChance: 0.06 }, procChance: 1.0,
    narrative: null,
  },
  SOUL_SIPHON: {
    id: 'SOUL_SIPHON', name: 'Soul Siphon', type: 'active', source: 'equipment',
    itemId: 'GRIMOIRE_OF_SOULS', unlockLevel: null,
    description: 'Grimoire of Souls siphons soul energy for a burst of dark power.',
    icon: '📖', effects: { magBonus: 0.45, spdBonus: 0.15 }, procChance: 0.45,
    narrative: 'opens the Grimoire of Souls — spectral chains lash out and drain the target!',
  },
  DAMNED_CHORUS: {
    id: 'DAMNED_CHORUS', name: 'Damned Chorus', type: 'active', source: 'equipment',
    itemId: 'SKULL_OF_THE_DAMNED', unlockLevel: null,
    description: 'Skull of the Damned unleashes a chorus of anguished souls.',
    icon: '🗣', effects: { magBonus: 0.50, critChance: 0.15, powerMultiplier: 1.3 }, procChance: 0.45,
    narrative: 'raises the Skull of the Damned — a chorus of anguished souls wails across the battlefield!',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ██ CELESTIAL EQUIPMENT PROCS — God-tier set bonuses ████████████████████
  // ══════════════════════════════════════════════════════════════════════════

  // ── HERO "Ascendant" Set Procs ──────────────────────────────────────────
  CEL_ASCENDANT_WRATH: {
    id: 'CEL_ASCENDANT_WRATH', name: 'Ascendant Wrath', type: 'active', source: 'equipment',
    itemId: 'CEL_DAWNBREAKER', unlockLevel: null,
    description: 'Dawnbreaker erupts with the fury of the first sunrise, dealing catastrophic radiant damage.',
    icon: '🌅', effects: { atkBonus: 0.40, critChance: 0.25, powerMultiplier: 1.8 }, procChance: 0.55,
    narrative: 'unleashes Ascendant Wrath — Dawnbreaker blazes with the fury of the first sunrise!',
  },
  CEL_ASCENDANT_AEGIS: {
    id: 'CEL_ASCENDANT_AEGIS', name: 'Ascendant Aegis', type: 'active', source: 'equipment',
    itemId: 'CEL_ASCENDANT_PLATE', unlockLevel: null,
    description: 'The Ascendant Plate channels divine light, creating an impervious barrier.',
    icon: '✨', effects: { defBonus: 0.50, maxHpBonus: 0.30 }, procChance: 0.50,
    narrative: 'activates the Ascendant Aegis — divine light forms an impervious barrier!',
  },
  CEL_ASCENDANT_RALLY: {
    id: 'CEL_ASCENDANT_RALLY', name: 'Ascendant Rally', type: 'active', source: 'equipment',
    itemId: 'CEL_ASCENDANT_WARD', unlockLevel: null,
    description: 'The Ascendant Ward radiates courage, pushing every ally beyond their limits.',
    icon: '🏴', effects: { partyAtkBonus: 0.20, partyDefBonus: 0.15, partySpdBonus: 0.10 }, procChance: 0.45,
    narrative: 'raises the Ascendant Ward — the entire party surges with divine courage!',
  },
  CEL_DESTINY_AURA: {
    id: 'CEL_DESTINY_AURA', name: "Destiny's Mantle", type: 'passive', source: 'equipment',
    itemId: 'CEL_CROWN_OF_THE_CHOSEN', unlockLevel: null,
    description: 'The Crown of the Chosen bathes the hero in the light of destiny, elevating all abilities.',
    icon: '👑', effects: { atkBonus: 0.20, defBonus: 0.20, spdBonus: 0.20, magBonus: 0.15, critBonus: 0.10, dodgeBonus: 0.10, maxHpBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },

  // ── HERO "Ascendant" 2H Greatsword Procs (Champion alternative) ────────
  CEL_WORLDSPLITTER: {
    id: 'CEL_WORLDSPLITTER', name: 'Worldsplitter', type: 'active', source: 'equipment',
    itemId: 'CEL_GODSLAYER', unlockLevel: null,
    description: 'The Godslayer cleaves through reality itself, delivering a cataclysmic blow that can end any foe.',
    icon: '💥', effects: { atkBonus: 0.50, critChance: 0.30, powerMultiplier: 2.0 }, procChance: 0.50,
    narrative: 'swings the Godslayer with world-ending force — reality cracks beneath the blow!',
  },
  CEL_SLAYERS_FERVOR: {
    id: 'CEL_SLAYERS_FERVOR', name: "Slayer's Fervor", type: 'passive', source: 'equipment',
    itemId: 'CEL_GODSLAYER', unlockLevel: null,
    description: 'The Godslayer demands total commitment. In return, it sharpens the wielder into a perfect weapon.',
    icon: '🔥', effects: { atkBonus: 0.20, critChance: 0.15, spdBonus: 0.12 }, procChance: 1.0,
    narrative: null,
  },

  // ── KNIGHT "Eternal Bastion" Set Procs ─────────────────────────────────
  CEL_BASTION_SMITE: {
    id: 'CEL_BASTION_SMITE', name: 'Bastion Smite', type: 'active', source: 'equipment',
    itemId: 'CEL_OATHSWORN', unlockLevel: null,
    description: 'Oathsworn channels the weight of an unbreakable vow into a devastating strike.',
    icon: '⚔', effects: { atkBonus: 0.35, defBonus: 0.20, powerMultiplier: 1.6 }, procChance: 0.55,
    narrative: 'delivers the Bastion Smite — Oathsworn strikes with the weight of an eternal vow!',
  },
  CEL_BASTION_FORTRESS: {
    id: 'CEL_BASTION_FORTRESS', name: 'Living Fortress', type: 'active', source: 'equipment',
    itemId: 'CEL_ETERNAL_BASTION', unlockLevel: null,
    description: 'The Eternal Bastion hardens to a substance beyond diamond, absorbing all punishment.',
    icon: '🏰', effects: { defBonus: 0.60, maxHpBonus: 0.40 }, procChance: 0.50,
    narrative: 'becomes a Living Fortress — the Eternal Bastion absorbs catastrophic punishment!',
  },
  CEL_BASTION_WARD: {
    id: 'CEL_BASTION_WARD', name: 'Infinite Aegis', type: 'active', source: 'equipment',
    itemId: 'CEL_INFINITUM_SHIELD', unlockLevel: null,
    description: 'The Infinitum Shield extends its protection across all allies simultaneously.',
    icon: '🛡', effects: { partyDefBonus: 0.25, partyHpBonus: 0.15 }, procChance: 0.45,
    narrative: 'raises the Infinite Aegis — the Infinitum Shield extends divine protection to all allies!',
  },
  CEL_IMMOVABLE_AURA: {
    id: 'CEL_IMMOVABLE_AURA', name: 'The Immovable', type: 'passive', source: 'equipment',
    itemId: 'CEL_SENTINELS_ETERNITY', unlockLevel: null,
    description: "The Sentinel's Eternity makes the wearer an immovable anchor of divine protection.",
    icon: '⛰', effects: { defBonus: 0.30, maxHpBonus: 0.25, partyDefBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },

  // ── MAGE "Arcanum Infinitum" Set Procs ─────────────────────────────────
  CEL_ARCANUM_CATACLYSM: {
    id: 'CEL_ARCANUM_CATACLYSM', name: 'Infinite Cataclysm', type: 'active', source: 'equipment',
    itemId: 'CEL_INFINITY_STAFF', unlockLevel: null,
    description: 'The Infinity Staff tears open reality itself, unleashing a cataclysm of pure arcane energy.',
    icon: '💥', effects: { magBonus: 0.45, critChance: 0.20, powerMultiplier: 2.0 }, procChance: 0.55,
    narrative: 'channels Infinite Cataclysm — the Infinity Staff tears reality apart with impossible power!',
  },
  CEL_VOID_BARRIER: {
    id: 'CEL_VOID_BARRIER', name: 'Void Barrier', type: 'active', source: 'equipment',
    itemId: 'CEL_ROBES_OF_THE_VOID', unlockLevel: null,
    description: 'The Robes of the Void redirect all incoming damage through a dimensional rift.',
    icon: '🌀', effects: { defBonus: 0.40, magBonus: 0.30 }, procChance: 0.50,
    narrative: 'activates the Void Barrier — attacks phase through into nothingness!',
  },
  CEL_ARCANUM_RESONANCE: {
    id: 'CEL_ARCANUM_RESONANCE', name: 'Arcanum Resonance', type: 'active', source: 'equipment',
    itemId: 'CEL_SINGULARITY_ORB', unlockLevel: null,
    description: 'The Singularity Orb amplifies all magical energy nearby to devastating levels.',
    icon: '🔮', effects: { partyMagBonus: 0.25, partyCritBonus: 0.10 }, procChance: 0.45,
    narrative: 'pulses with Arcanum Resonance — the Singularity Orb amplifies all magic nearby!',
  },
  CEL_OMNISCIENCE_AURA: {
    id: 'CEL_OMNISCIENCE_AURA', name: 'Omniscience', type: 'passive', source: 'equipment',
    itemId: 'CEL_DIADEM_OF_OMNISCIENCE', unlockLevel: null,
    description: 'The Diadem reveals all futures. Spells are cast with perfect foresight.',
    icon: '👁', effects: { magBonus: 0.25, spdBonus: 0.20, critChance: 0.18, critBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },

  // ── ROGUE "Voidwalker" Set Procs ───────────────────────────────────────
  CEL_VOIDWALKER_STRIKE: {
    id: 'CEL_VOIDWALKER_STRIKE', name: 'Voidwalker Strike', type: 'active', source: 'equipment',
    itemId: 'CEL_VOIDFANG', unlockLevel: null,
    description: 'Voidfang phases through all defenses, striking directly at the target\'s essence.',
    icon: '🗡', effects: { atkBonus: 0.35, critChance: 0.30, powerMultiplier: 1.9 }, procChance: 0.60,
    narrative: 'executes the Voidwalker Strike — Voidfang phases through armor and strikes the soul!',
  },
  CEL_PHASE_SHIFT: {
    id: 'CEL_PHASE_SHIFT', name: 'Phase Shift', type: 'active', source: 'equipment',
    itemId: 'CEL_WRAITHWEAVE', unlockLevel: null,
    description: 'Wraithweave shifts the rogue between dimensions, making them temporarily untouchable.',
    icon: '👻', effects: { spdBonus: 0.45, defBonus: 0.35 }, procChance: 0.55,
    narrative: 'Phase Shifts — flickering between dimensions, completely untouchable!',
  },
  CEL_VOID_ECHO: {
    id: 'CEL_VOID_ECHO', name: 'Void Echo', type: 'active', source: 'equipment',
    itemId: 'CEL_NULLBLADE', unlockLevel: null,
    description: 'Nullblade resonates through the void, sharpening every ally\'s senses and reflexes.',
    icon: '🌑', effects: { partySpdBonus: 0.20, partyCritBonus: 0.09, partyDodgeBonus: 0.06 }, procChance: 0.45,
    narrative: 'triggers Void Echo — Nullblade\'s resonance sharpens every ally\'s reflexes!',
  },
  CEL_SHADOW_DIMENSION: {
    id: 'CEL_SHADOW_DIMENSION', name: 'Shadow Dimension', type: 'passive', source: 'equipment',
    itemId: 'CEL_ECLIPSE_PENDANT', unlockLevel: null,
    description: 'The Eclipse Pendant anchors the rogue partially in the shadow dimension. Always half-invisible.',
    icon: '🌘', effects: { spdBonus: 0.25, critBonus: 0.15, dodgeBonus: 0.10, critChance: 0.20, atkBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },

  // ── CLERIC "Divine Radiance" Set Procs ─────────────────────────────────
  CEL_DIVINE_JUDGEMENT: {
    id: 'CEL_DIVINE_JUDGEMENT', name: "Dawn's Judgement", type: 'active', source: 'equipment',
    itemId: 'CEL_SCEPTER_OF_DAWN', unlockLevel: null,
    description: 'The Scepter of Dawn channels the wrath of the heavens, passing judgement upon the unworthy.',
    icon: '⚡', effects: { magBonus: 0.35, atkBonus: 0.20, powerMultiplier: 1.7 }, procChance: 0.55,
    narrative: "calls down Dawn's Judgement — the Scepter of Dawn sears evil with holy radiance!",
  },
  CEL_DIVINE_SHIELD: {
    id: 'CEL_DIVINE_SHIELD', name: 'Radiant Aegis', type: 'active', source: 'equipment',
    itemId: 'CEL_VESTMENTS_OF_GRACE', unlockLevel: null,
    description: 'The Vestments of Grace form a radiant aegis that heals as it protects.',
    icon: '🛐', effects: { defBonus: 0.45, maxHpBonus: 0.35, healBonus: 0.20 }, procChance: 0.50,
    narrative: 'manifests a Radiant Aegis — wounds heal as quickly as they are made!',
  },
  CEL_MIRACULOUS_BLESSING: {
    id: 'CEL_MIRACULOUS_BLESSING', name: 'Miraculous Blessing', type: 'active', source: 'equipment',
    itemId: 'CEL_TOME_OF_MIRACLES', unlockLevel: null,
    description: 'The Tome of Miracles opens, showering the entire party with divine protection and power.',
    icon: '📖', effects: { partyDefBonus: 0.20, partyHpBonus: 0.15, partyMagBonus: 0.10 }, procChance: 0.45,
    narrative: 'opens the Tome and unleashes a Miraculous Blessing — miracles wash over the entire party!',
  },
  CEL_RESURRECTION_AURA: {
    id: 'CEL_RESURRECTION_AURA', name: 'Resurrection Aura', type: 'passive', source: 'equipment',
    itemId: 'CEL_HALO_OF_THE_BLESSED', unlockLevel: null,
    description: 'The Halo radiates constant divine energy. The wounded are mended, the weary are restored.',
    icon: '😇', effects: { magBonus: 0.25, defBonus: 0.20, maxHpBonus: 0.20, healBonus: 0.25 }, procChance: 1.0,
    narrative: null,
  },

  // ── RANGER "Starfall" Set Procs ────────────────────────────────────────
  CEL_CELESTIAL_BARRAGE: {
    id: 'CEL_CELESTIAL_BARRAGE', name: 'Celestial Barrage', type: 'active', source: 'equipment',
    itemId: 'CEL_STARFALL_BOW', unlockLevel: null,
    description: 'The Starfall Bow fires a barrage of star-forged arrows that rain from the heavens.',
    icon: '🌠', effects: { atkBonus: 0.40, spdBonus: 0.25, powerMultiplier: 1.8 }, procChance: 0.55,
    narrative: 'unleashes a Celestial Barrage — stars fall from the heavens, each one a devastating arrow!',
  },
  CEL_STELLAR_CLOAK: {
    id: 'CEL_STELLAR_CLOAK', name: 'Stellar Cloak', type: 'active', source: 'equipment',
    itemId: 'CEL_STARHIDE_MANTLE', unlockLevel: null,
    description: 'The Starhide Mantle blazes with starlight, deflecting attacks into the void between stars.',
    icon: '🌟', effects: { defBonus: 0.40, spdBonus: 0.30 }, procChance: 0.50,
    narrative: 'activates the Stellar Cloak — starlight deflects all attacks into the cosmic void!',
  },
  CEL_STARFIRE_VOLLEY: {
    id: 'CEL_STARFIRE_VOLLEY', name: 'Starfire Volley', type: 'active', source: 'equipment',
    itemId: 'CEL_CONSTELLATION_QUIVER', unlockLevel: null,
    description: 'The Constellation Quiver supplies starfire arrows to every ally, raining celestial destruction.',
    icon: '🎆', effects: { partyAtkBonus: 0.20, partySpdBonus: 0.15 }, procChance: 0.45,
    narrative: 'fires a Starfire Volley — the Constellation Quiver arms every ally with celestial arrows!',
  },
  CEL_NORTH_STAR_AURA: {
    id: 'CEL_NORTH_STAR_AURA', name: 'North Star', type: 'passive', source: 'equipment',
    itemId: 'CEL_POLARIS_PENDANT', unlockLevel: null,
    description: 'Guided by the North Star. Every shot finds its mark. Every step finds its path.',
    icon: '⭐', effects: { atkBonus: 0.25, spdBonus: 0.20, critBonus: 0.20, critChance: 0.15 }, procChance: 1.0,
    narrative: null,
  },

  // ── BARD "Harmony of Spheres" Set Procs ────────────────────────────────
  CEL_SONG_OF_CREATION: {
    id: 'CEL_SONG_OF_CREATION', name: 'Song of Creation', type: 'active', source: 'equipment',
    itemId: 'CEL_LYRE_OF_CREATION', unlockLevel: null,
    description: 'The Lyre plays the melody that created the universe. Reality reshapes at its command.',
    icon: '🎵', effects: { magBonus: 0.30, critBonus: 0.10, dodgeBonus: 0.15, powerMultiplier: 1.7 }, procChance: 0.55,
    narrative: 'plays the Song of Creation — the melody that birthed the universe reshapes the battlefield!',
  },
  CEL_COSMIC_HARMONY: {
    id: 'CEL_COSMIC_HARMONY', name: 'Cosmic Harmony', type: 'active', source: 'equipment',
    itemId: 'CEL_VESTMENTS_OF_COSMOS', unlockLevel: null,
    description: 'The cosmos harmonizes around the wearer, turning all discord into protection.',
    icon: '🪐', effects: { defBonus: 0.35, magBonus: 0.30 }, procChance: 0.50,
    narrative: 'enters Cosmic Harmony — the fabric of the cosmos shields against all harm!',
  },
  CEL_RHYTHM_OF_WORLDS: {
    id: 'CEL_RHYTHM_OF_WORLDS', name: 'Rhythm of Worlds', type: 'active', source: 'equipment',
    itemId: 'CEL_DRUM_OF_ETERNITY', unlockLevel: null,
    description: 'The Drum beats with the heartbeat of infinite worlds, synchronizing and empowering all allies.',
    icon: '🥁', effects: { partyAtkBonus: 0.18, partyDefBonus: 0.18, partyMagBonus: 0.18, partySpdBonus: 0.18, powerMultiplier: 1.5 }, procChance: 0.50,
    narrative: 'strikes the Rhythm of Worlds — the heartbeat of infinite worlds empowers every ally!',
  },

  // ── BARD "Eternal Cadence" 2H Drum Passive (Drum of Eternity dual-proc) ─
  CEL_ETERNAL_CADENCE: {
    id: 'CEL_ETERNAL_CADENCE', name: 'Eternal Cadence', type: 'passive', source: 'equipment',
    itemId: 'CEL_DRUM_OF_ETERNITY', unlockLevel: null,
    description: 'The Drum of Eternity resonates with an unbreakable cadence. Its rhythm steadies every heartbeat, mending wounds and hardening resolve.',
    icon: '💫', effects: { magBonus: 0.15, defBonus: 0.18, healBonus: 0.15, maxHpBonus: 0.10, partyDefBonus: 0.06, partyMaxHpBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  CEL_SYMPHONY_AURA: {
    id: 'CEL_SYMPHONY_AURA', name: 'Eternal Symphony', type: 'passive', source: 'equipment',
    itemId: 'CEL_MAESTROS_SIGNET', unlockLevel: null,
    description: 'The grand symphony plays eternally. All who hear it are elevated beyond mortal limits.',
    icon: '🎶', effects: { magBonus: 0.18, critBonus: 0.09, dodgeBonus: 0.13, spdBonus: 0.18, atkBonus: 0.10, defBonus: 0.10, partyCritBonus: 0.05, partyDodgeBonus: 0.07 }, procChance: 1.0,
    narrative: null,
  },

  // ── BARD "Cosmic Harmony" 2H Lyre Passive (Lyre of Creation dual-proc) ─
  CEL_MUSES_INSPIRATION: {
    id: 'CEL_MUSES_INSPIRATION', name: "Muse's Inspiration", type: 'passive', source: 'equipment',
    itemId: 'CEL_LYRE_OF_CREATION', unlockLevel: null,
    description: 'The Lyre of Creation hums with the voice of the First Muse. Songs heal deeper, chords strike truer, and the music never falters.',
    icon: '✨', effects: { magBonus: 0.18, healBonus: 0.20, spdBonus: 0.15, dodgeBonus: 0.12, critBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },

  // ── MONK "Transcendence" Set Procs ─────────────────────────────────────
  CEL_TRANSCENDENT_STRIKE: {
    id: 'CEL_TRANSCENDENT_STRIKE', name: 'Transcendent Strike', type: 'active', source: 'equipment',
    itemId: 'CEL_FISTS_OF_NIRVANA', unlockLevel: null,
    description: 'The Fists of Nirvana strike with the accumulated weight of ten thousand years of meditation.',
    icon: '👊', effects: { atkBonus: 0.40, spdBonus: 0.25, powerMultiplier: 1.9 }, procChance: 0.60,
    narrative: 'delivers the Transcendent Strike — fists blur with the speed and weight of enlightenment!',
  },
  CEL_ABSOLUTE_FLOW: {
    id: 'CEL_ABSOLUTE_FLOW', name: 'Absolute Flow', type: 'active', source: 'equipment',
    itemId: 'CEL_GI_OF_THE_ABSOLUTE', unlockLevel: null,
    description: 'The Gi of the Absolute allows the monk to flow around every attack with perfect precision.',
    icon: '🌊', effects: { defBonus: 0.40, spdBonus: 0.35 }, procChance: 0.50,
    narrative: 'enters Absolute Flow — moving like water, bending around every attack with impossible grace!',
  },
  CEL_INFINITE_PALM: {
    id: 'CEL_INFINITE_PALM', name: 'Infinite Palm', type: 'active', source: 'equipment',
    itemId: 'CEL_PALM_OF_THE_INFINITE', unlockLevel: null,
    description: 'The Palm radiates chi across the battlefield, quickening and strengthening every ally.',
    icon: '🤲', effects: { partySpdBonus: 0.20, partyAtkBonus: 0.15, partyDefBonus: 0.10 }, procChance: 0.45,
    narrative: 'opens the Infinite Palm — chi radiates outward, quickening and empowering every ally!',
  },
  CEL_NIRVANA_AURA: {
    id: 'CEL_NIRVANA_AURA', name: 'Nirvana', type: 'passive', source: 'equipment',
    itemId: 'CEL_CHAKRA_OF_ENLIGHTENMENT', unlockLevel: null,
    description: 'True enlightenment achieved. Body, mind, and spirit in absolute harmony.',
    icon: '☯', effects: { atkBonus: 0.20, defBonus: 0.20, spdBonus: 0.20, maxHpBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },

  // ── NECROMANCER "Dominion of the Dead" Set Procs ────────────────────────
  CEL_SIPHON_OF_SOULS: {
    id: 'CEL_SIPHON_OF_SOULS', name: 'Siphon of Souls', type: 'active', source: 'equipment',
    itemId: 'CEL_SOULWEAVER', unlockLevel: null,
    description: 'The Soulweaver drains the life force of enemies and channels it back to the caster, dealing enhanced necrotic damage with potent lifesteal.',
    icon: '🩸', effects: { magBonus: 0.35, lifesteal: 0.50, powerMultiplier: 1.5 }, procChance: 0.55,
    narrative: 'channels the Soulweaver — threads of stolen life surge from the enemy into the caster!',
  },
  CEL_DEATHS_DOMINION: {
    id: 'CEL_DEATHS_DOMINION', name: "Death's Dominion", type: 'active', source: 'equipment',
    itemId: 'CEL_MORTALITYS_END', unlockLevel: null,
    description: "Mortality's End scythes through the boundary between life and death, dealing catastrophic necrotic damage to all enemies.",
    icon: '💀', effects: { magBonus: 0.50, powerMultiplier: 2.0, critChance: 0.25 }, procChance: 0.50,
    narrative: "sweeps Mortality's End through the veil — Death's Dominion claims the battlefield!",
  },
  CEL_REAPERS_PRESENCE: {
    id: 'CEL_REAPERS_PRESENCE', name: "Reaper's Presence", type: 'passive', source: 'equipment',
    itemId: 'CEL_MORTALITYS_END', unlockLevel: null,
    description: "The scythe's mere presence weakens the boundary between life and death. MAG +25%, CRIT +15%, party MAG +8%.",
    icon: '⚰', effects: { magBonus: 0.25, critChance: 0.15, partyMagBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  CEL_LICHBORNE: {
    id: 'CEL_LICHBORNE', name: 'Lichborne', type: 'active', source: 'equipment',
    itemId: 'CEL_SHROUD_OF_THE_LICH', unlockLevel: null,
    description: 'The Shroud remembers undeath. Grants massive DEF and HP, channeling lich-like resilience.',
    icon: '🧟', effects: { defBonus: 0.45, maxHpBonus: 0.30, magBonus: 0.15 }, procChance: 0.50,
    narrative: 'wraps in the Shroud of the Lich — flesh hardens, eyes glow with undying power!',
  },
  CEL_ETERNAL_WHISPER: {
    id: 'CEL_ETERNAL_WHISPER', name: 'Eternal Whisper', type: 'active', source: 'equipment',
    itemId: 'CEL_SKULL_OF_ETERNAL_WHISPERS', unlockLevel: null,
    description: 'The Skull reveals the exact moment of each enemy\'s death, dealing devastating targeted damage.',
    icon: '👁', effects: { magBonus: 0.60, critChance: 0.30, powerMultiplier: 1.6 }, procChance: 0.50,
    narrative: 'holds aloft the Skull of Eternal Whispers — it speaks the true name of death!',
  },
  CEL_SOUL_ANCHOR: {
    id: 'CEL_SOUL_ANCHOR', name: 'Soul Anchor', type: 'passive', source: 'equipment',
    itemId: 'CEL_PHYLACTERY_OF_SOULS', unlockLevel: null,
    description: 'The Phylactery anchors the Necromancer\'s soul. MAG +20%, maxHP +15%, DEF +10%. Minion damage +15%.',
    icon: '⚓', effects: { magBonus: 0.20, maxHpBonus: 0.15, defBonus: 0.10, minionDamageBonus: 0.15 }, procChance: 1.0,
    narrative: null,
  },
};

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
        // Normalize: 'maxhp' → 'maxHp', 'healpct' → 'heal'
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
        // Flat dodge chance bonus — accumulate for combat sim (distinct from dodgeBonus)
        stats.dodgeChance = (stats.dodgeChance || 0) + value;
        continue;
      }
      if (key === 'critChance') {
        // Flat crit chance bonus — accumulate for combat sim
        stats.critChance = (stats.critChance || 0) + value;
        continue;
      }
      if (key === 'healBonus') {
        // Accumulate heal bonus for the combat sim to consume
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
      // goldBonus, expBonus tracked separately by quest system
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
