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
    description: 'The Hero\'s presence inspires all. Party ATK +8%, party SPD +6%, self LCK +15%.',
    icon: '✨', effects: { partyAtkBonus: 0.08, partySpdBonus: 0.06, lckBonus: 0.15 }, procChance: 1.0,
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
    description: 'ATK +15%, SPD +10%, LCK +10%.',
    icon: '⚡', effects: { atkBonus: 0.15, spdBonus: 0.10, lckBonus: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  HERO_M_CHOSEN_ONE: {
    id: 'HERO_M_CHOSEN_ONE', name: 'The Chosen One', type: 'passive', source: 'mastery',
    classId: 'HERO', unlockLevel: 20,
    description: 'EPIC — All stats +12%. The Hero\'s destiny is fulfilled.',
    icon: '🌠', effects: { atkBonus: 0.12, defBonus: 0.12, spdBonus: 0.12, magBonus: 0.12, lckBonus: 0.12, maxHpBonus: 0.12 }, procChance: 1.0,
    narrative: null,
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
    description: 'SPD +8%, LCK +8%.',
    icon: '🤏', effects: { spdBonus: 0.08, lckBonus: 0.08 }, procChance: 1.0,
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
    description: 'PARTY MASTERY — All allies gain +5% SPD and +5% LCK from the Rogue\'s connections.',
    icon: '🕸', effects: { partySpdBonus: 0.05, partyLckBonus: 0.05 }, procChance: 1.0,
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
  PURIFY: {
    id: 'PURIFY', name: 'Purify', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 6,
    description: 'Cleanses and restores. 65% proc, party heal 12%, party DEF +8%.',
    icon: '💧', effects: { partyHealPct: 0.12, partyDefBonus: 0.08 }, procChance: 0.65,
    narrative: 'channels Purify — a wave of holy water washes over the party!',
  },
  DIVINE_SHIELD: {
    id: 'DIVINE_SHIELD', name: 'Divine Shield', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 10,
    description: 'CLASS SKILL — Wraps the entire party in divine protection. 55% proc, party DEF +18%, party heal 10%.',
    icon: '⛑', effects: { partyDefBonus: 0.18, partyHealPct: 0.10 }, procChance: 0.55,
    narrative: 'calls forth a Divine Shield — holy light protects all!',
  },
  SANCTIFY: {
    id: 'SANCTIFY', name: 'Sanctify', type: 'passive', source: 'class',
    classId: 'CLERIC', unlockLevel: 14,
    description: 'Holy presence strengthens all. MAG +15%, party DEF +6%, party heal +5%.',
    icon: '⛪', effects: { magBonus: 0.15, partyDefBonus: 0.06, partyHealPct: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  DIVINE_INTERVENTION: {
    id: 'DIVINE_INTERVENTION', name: 'Divine Intervention', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 18,
    description: 'EPIC — The heavens answer. 35% proc, 1.6× power, party heal 25%, party DEF +20%.',
    icon: '🕊', effects: { powerMultiplier: 1.6, partyHealPct: 0.25, partyDefBonus: 0.20 }, procChance: 0.35,
    narrative: 'calls upon Divine Intervention — the heavens answer!',
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
    description: 'ATK +8%, LCK +6%.',
    icon: '👁', effects: { atkBonus: 0.08, lckBonus: 0.06 }, procChance: 1.0,
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
    description: 'A discordant blast that weakens enemies. 60% proc, party ATK +12%, party DEF +8%.',
    icon: '🎸', effects: { partyAtkBonus: 0.12, partyDefBonus: 0.08 }, procChance: 0.60,
    narrative: 'strikes a jarring Discord — enemies stagger and falter!',
  },
  MAGNUM_OPUS: {
    id: 'MAGNUM_OPUS', name: 'Magnum Opus', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 10,
    description: 'CLASS SKILL — A legendary performance that empowers every ally. 50% proc, party ATK +15%, party DEF +10%, party SPD +10%.',
    icon: '🎼', effects: { partyAtkBonus: 0.15, partyDefBonus: 0.10, partySpdBonus: 0.10 }, procChance: 0.50,
    narrative: 'performs their Magnum Opus — the entire party transcends their limits!',
  },
  BATTLE_HYMN: {
    id: 'BATTLE_HYMN', name: 'Battle Hymn', type: 'passive', source: 'class',
    classId: 'BARD', unlockLevel: 14,
    description: 'An ongoing battle hymn. Party ATK +8%, party SPD +6%, LCK +12%.',
    icon: '🎶', effects: { partyAtkBonus: 0.08, partySpdBonus: 0.06, lckBonus: 0.12 }, procChance: 1.0,
    narrative: null,
  },
  SYMPHONY_OF_WAR: {
    id: 'SYMPHONY_OF_WAR', name: 'Symphony of War', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 18,
    description: 'EPIC — A symphony that drives the whole party to peak form. 35% proc, 1.8× power, party ATK +20%, party DEF +12%, party SPD +12%.',
    icon: '🎻', effects: { powerMultiplier: 1.8, partyAtkBonus: 0.20, partyDefBonus: 0.12, partySpdBonus: 0.12 }, procChance: 0.35,
    narrative: 'conducts the Symphony of War — the party becomes an unstoppable force!',
  },

  // ── Bard Masteries ──
  BARD_M_CHARM: {
    id: 'BARD_M_CHARM', name: 'Charm', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 4,
    description: 'LCK +12%, gold +8%. Natural charisma.',
    icon: '💝', effects: { lckBonus: 0.12, goldBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_PERFECT_PITCH: {
    id: 'BARD_M_PERFECT_PITCH', name: 'Perfect Pitch', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 8,
    description: 'MAG +10%, LCK +10%, SPD +8%.',
    icon: '🎤', effects: { magBonus: 0.10, lckBonus: 0.10, spdBonus: 0.08 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_FORTISSIMO: {
    id: 'BARD_M_FORTISSIMO', name: 'Fortissimo', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 12,
    description: 'PARTY MASTERY — All allies gain +5% ATK, +5% SPD, and +5% LCK from the Bard\'s performance.',
    icon: '🔊', effects: { partyAtkBonus: 0.05, partySpdBonus: 0.05, partyLckBonus: 0.05 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_VIRTUOSO: {
    id: 'BARD_M_VIRTUOSO', name: 'Virtuoso', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 16,
    description: 'MAG +15%, LCK +15%, SPD +10%, gold +12%.',
    icon: '🎹', effects: { magBonus: 0.15, lckBonus: 0.15, spdBonus: 0.10, goldBonus: 0.12 }, procChance: 1.0,
    narrative: null,
  },
  BARD_M_LEGEND_OF_SONG: {
    id: 'BARD_M_LEGEND_OF_SONG', name: 'Legend of Song', type: 'passive', source: 'mastery',
    classId: 'BARD', unlockLevel: 20,
    description: 'EPIC — MAG +20%, LCK +25%, SPD +15%, gold +20%. Songs echo through eternity.',
    icon: '🏅', effects: { magBonus: 0.20, lckBonus: 0.25, spdBonus: 0.15, goldBonus: 0.20 }, procChance: 1.0,
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
    icon: '☯', effects: { atkBonus: 0.15, defBonus: 0.15, spdBonus: 0.15, magBonus: 0.15, lckBonus: 0.15, dodgeChance: 0.15 }, procChance: 0.50,
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

  // ── Monk Masteries ──
  MONK_M_BALANCE: {
    id: 'MONK_M_BALANCE', name: 'Balance', type: 'passive', source: 'mastery',
    classId: 'MONK', unlockLevel: 4,
    description: 'All core stats +5%. The path to balance begins.',
    icon: '⚖', effects: { atkBonus: 0.05, defBonus: 0.05, spdBonus: 0.05, magBonus: 0.05, lckBonus: 0.05 }, procChance: 1.0,
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
    description: 'All core stats +10%, dodge +10%.',
    icon: '🪷', effects: { atkBonus: 0.10, defBonus: 0.10, spdBonus: 0.10, magBonus: 0.10, lckBonus: 0.10, dodgeChance: 0.10 }, procChance: 1.0,
    narrative: null,
  },
  MONK_M_TRANSCENDENCE: {
    id: 'MONK_M_TRANSCENDENCE', name: 'Transcendence', type: 'passive', source: 'mastery',
    classId: 'MONK', unlockLevel: 20,
    description: 'EPIC — All core stats +15%, dodge +15%. Perfect martial enlightenment.',
    icon: '🌅', effects: { atkBonus: 0.15, defBonus: 0.15, spdBonus: 0.15, magBonus: 0.15, lckBonus: 0.15, dodgeChance: 0.15 }, procChance: 1.0,
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
    id: 'DIVINE_GRACE_EQ', name: 'Divine Grace', type: 'active', source: 'equipment',
    itemId: 'DIVINE_STAFF', unlockLevel: null,
    description: 'Divine Staff channels holy energy, bolstering the party.',
    icon: '🌟', effects: { magBonus: 0.40, healBonus: 0.25 }, procChance: 0.55,
    narrative: 'channels Divine Grace through the holy staff!',
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
    id: 'IRON_BODY', name: 'Iron Body', type: 'active', source: 'equipment',
    itemId: 'DRAGON_CLAW', unlockLevel: null,
    description: 'Hardens the body like iron and counters with force.',
    icon: '🪨', effects: { atkBonus: 0.30, defBonus: 0.30, dodgeChance: 0.15 }, procChance: 0.45,
    narrative: 'hardens their body like iron and counters!',
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
  SIREN_SONG: {
    id: 'SIREN_SONG', name: 'Siren Song', type: 'active', source: 'equipment',
    itemId: 'SIREN_HARP', unlockLevel: null,
    description: 'Plays a mesmerizing Siren Song that enchants and heals.',
    icon: '🎵', effects: { magBonus: 0.55, healBonus: 0.15, lckBonus: 0.15 }, procChance: 0.50,
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
    id: 'SANCTUARY', name: 'Sanctuary', type: 'active', source: 'equipment',
    itemId: 'HOLY_ORB', unlockLevel: null,
    description: 'Creates a Sanctuary of light for protection and healing.',
    icon: '☀', effects: { defBonus: 0.30, healBonus: 0.20 }, procChance: 0.50,
    narrative: 'creates a Sanctuary of light!',
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
    id: 'ARCANE_CATACLYSM_EQ', name: 'Arcane Cataclysm', type: 'active', source: 'equipment',
    itemId: 'STAFF_OF_AGES', unlockLevel: null,
    description: 'Unleashes an Arcane Cataclysm of magical destruction.',
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
    icon: '🎼', effects: { magBonus: 0.75, healBonus: 0.30, lckBonus: 0.25 }, procChance: 0.60,
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

export function applyPassiveSkills(stats, member, party) {
  const passives = getMemberPassiveSkills(member, party);
  for (const skill of passives) {
    if (!skill.effects) continue;
    for (const [key, value] of Object.entries(skill.effects)) {
      // Skip party-wide bonuses here (applied separately)
      if (key.startsWith('party')) continue;
      if (key === 'powerMultiplier') continue;
      // Map effect key → stat key
      const statKey = key.replace(/Bonus$/, '').replace(/Chance$/, '');
      if (['atk', 'def', 'spd', 'mag', 'lck'].includes(statKey)) {
        stats[statKey] = Math.floor((stats[statKey] || 0) * (1 + value));
      } else if (statKey === 'maxHp') {
        stats.maxHp = Math.floor((stats.maxHp || 100) * (1 + value));
      }
      // dodgeChance, critChance, goldBonus, expBonus tracked separately by combat/quest system
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
