// Class skills — active/passive skills granted by class level-ups (source: class)

export const CLASS_SKILLS = {
  QUICK_SLASH: {
    id: 'QUICK_SLASH', name: 'Quick Slash', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 1,
    description: 'A trained opening strike every hero learns on day one. 55% proc, 1.0× power (routed through the standard 1.25× skill path).',
    icon: '⚔', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'steps forward with a Quick Slash!',
  },
  HEROIC_STRIKE: {
    id: 'HEROIC_STRIKE', name: 'Heroic Strike', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 2,
    description: 'A powerful strike fueled by otherworldly resolve. 70% proc, +25% ATK.',
    icon: '⚔', effects: { atkBonus: 0.25 }, procChance: 0.70,
    narrative: 'unleashes a devastating Heroic Strike!',
  },
  SWORD_DANCE: {
    id: 'SWORD_DANCE', name: 'Sword Dance', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 6,
    description: 'A flowing blade-form that sweeps every enemy. 50% proc, 1.3× AoE power, hits all foes.',
    icon: '⚔', effects: { powerMultiplier: 1.3 }, procChance: 0.50,
    narrative: 'flows into a Sword Dance — steel sweeps every foe!',
  },
  RALLY_CRY: {
    // LIFTED to Hero L8 mastery per §4.2. Still an active skill, granted via mastery track now.
    id: 'RALLY_CRY', name: 'Rally Cry', type: 'active', source: 'mastery',
    classId: 'HERO', unlockLevel: 8,
    description: 'A rallying shout that heals a wounded ally for 15% of their max HP. Reactive — triggers when an ally drops below 30% HP. 4-round cooldown.',
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
  SECOND_WIND: {
    id: 'SECOND_WIND', name: 'Second Wind', type: 'reactive', source: 'class',
    classId: 'HERO', unlockLevel: 14,
    description: 'REACTIVE — When HP drops below 35%, the Hero gains +20% ATK for 2 rounds. 4-round cooldown.',
    icon: '💨', effects: { atkBonus: 0.20 },
    narrative: 'catches a Second Wind — renewed vigor fills their limbs!',
  },
  WHIRLWIND_DANCE: {
    // RETIRED to legacy — replaced by Second Wind at L14. Kept for save compatibility and talent hooks.
    id: 'WHIRLWIND_DANCE', name: 'Whirlwind Dance (Legacy)', type: 'legacy', source: 'legacy',
    classId: 'HERO', unlockLevel: 99,
    description: 'LEGACY — Retired Hero L14 AoE. No longer learnable; kept for save compatibility.',
    icon: '🌀', effects: { powerMultiplier: 1.0, atkBonus: 0.20 }, procChance: 0.50,
    narrative: 'becomes a Whirlwind Dance — steel flashes in every direction!',
  },
  HERO_ULTIMA: {
    id: 'HERO_ULTIMA', name: 'Starfall Slash', type: 'active', source: 'class',
    classId: 'HERO', unlockLevel: 18,
    description: 'EPIC — Calls down a blade of starlight in one transcendent strike. 40% proc, 2.2× power, party ATK +15%.',
    icon: '🌠', effects: { powerMultiplier: 2.2, partyAtkBonus: 0.15 }, procChance: 0.40,
    narrative: 'calls down a blade of starlight — STARFALL SLASH!',
  },
  SHIELD_BASH: {
    id: 'SHIELD_BASH', name: 'Shield Bash', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 1,
    description: 'A trained shield strike that doubles as an offensive opener. 55% proc, 1.0× power. Partially scales with DEF.',
    icon: '🛡', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'smashes forward with a Shield Bash!',
  },
  SHIELD_CHARGE: {
    id: 'SHIELD_CHARGE', name: 'Shield Charge', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 2,
    description: 'Knight presses forward and crushes a foe with their shield. 70% proc, 1.25× power, ATK +25%. Partially scales with DEF.',
    icon: '🛡', effects: { powerMultiplier: 1.25, atkBonus: 0.25 }, procChance: 0.70,
    narrative: 'barrels forward with a Shield Charge!',
  },
  BULWARK: {
    id: 'BULWARK', name: 'Bulwark', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 6,
    description: 'CLASS SKILL — Reactive cover/intercept. When any ally would take damage, the Knight steps in and absorbs the hit (full damage, redirected to self). 3-round cooldown. Class-defining by L6.',
    icon: '🏰', effects: { intercept: true }, procChance: 1.0, reactive: true, cooldown: 3,
    narrative: 'becomes an immovable Bulwark — nothing gets through!',
  },
  SWEEPING_BLOW: {
    id: 'SWEEPING_BLOW', name: 'Sweeping Blow', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 10,
    description: 'CLASS SKILL — A wide arc that hits all enemies. 55% proc, 1.25× power, ATK +20%. Partially scales with DEF.',
    icon: '⚔', effects: { powerMultiplier: 1.25, atkBonus: 0.20 }, procChance: 0.55,
    narrative: 'swings in a wide arc — Sweeping Blow cleaves the line!',
  },
  LAST_STAND: {
    id: 'LAST_STAND', name: 'Last Stand', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 14,
    description: 'REACTIVE — When the Knight\'s HP falls below 35%, they gain +40% DEF and +20% ATK for 3 rounds. 4-round cooldown.',
    icon: '⚒', effects: { defBonus: 0.40, atkBonus: 0.20, lastStandThreshold: 0.35, lastStandDuration: 3 }, procChance: 1.0, reactive: true, cooldown: 4,
    narrative: 'digs in for their Last Stand — unbreakable resolve!',
  },
  UNBREAKABLE: {
    id: 'UNBREAKABLE', name: 'Unbreakable', type: 'active', source: 'class',
    classId: 'KNIGHT', unlockLevel: 18,
    description: 'EPIC — The Knight transcends mortal limits. 40% proc, 1.5× power, DEF +50%. Scales with DEF.',
    icon: '💎', effects: { powerMultiplier: 1.5, defBonus: 0.50 }, procChance: 0.40,
    narrative: 'becomes absolutely Unbreakable — a wall of steel and will!',
  },
  SHIELD_WALL: {
    // LIFTED to Knight L8 mastery per §4.2. Active group-buff: party -15% dmg for 3 rounds.
    id: 'SHIELD_WALL', name: 'Shield Wall', type: 'active', source: 'mastery',
    classId: 'KNIGHT', unlockLevel: 8,
    description: 'MASTERY — The Knight raises a massive shield, granting the party -15% incoming damage for 3 rounds. 80% proc.',
    icon: '🛡', effects: { partyDefBonus: 0.15 }, procChance: 0.80,
    narrative: 'raises their Shield Wall — the party braces behind an impenetrable guard!',
  },
  TAUNT: {
    // LIFTED to Knight L16 mastery per §4.2. Replaces Fortification. Marks all enemies for
    // KNT_TAUNT_AURA (+10% dmg taken) for 2 rounds.
    id: 'TAUNT', name: 'Taunt', type: 'active', source: 'mastery',
    classId: 'KNIGHT', unlockLevel: 16,
    description: 'MASTERY — The Knight bellows a challenge, drawing enemy focus. All enemies are marked for 2 rounds (synergizes with Oppressive Presence talent for +10% dmg taken). 65% proc.',
    icon: '😤', effects: {}, procChance: 0.65,
    narrative: 'bellows a furious Taunt — every enemy\'s eye snaps to the Knight!',
  },
  ARCANE_BOLT: {
    id: 'ARCANE_BOLT', name: 'Arcane Bolt', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 1,
    description: 'A basic magical projectile every apprentice learns. 55% proc, 1.0× power (routed through the standard 1.25× skill path).',
    icon: '💠', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'hurls an Arcane Bolt!',
  },
  // L2 — Frostbolt (new). MAG-scaled ST workhorse replacing Mana Surge.
  // Mana Surge now lives on as the Mage L8 mastery passive (§4.2).
  FROSTBOLT: {
    id: 'FROSTBOLT', name: 'Frostbolt', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 2,
    description: 'A hard-hitting shard of ice. 70% proc, 1.3× power, MAG +15%.',
    icon: '❄', effects: { powerMultiplier: 1.3, magBonus: 0.15 }, procChance: 0.70,
    narrative: 'hurls a Frostbolt — frozen shards tear the air!',
  },
  // L6 — Arcane Construct (swapped with Blizzard for early Mage survivability).
  ARCANE_CONSTRUCT: {
    id: 'ARCANE_CONSTRUCT', name: 'Arcane Construct', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 6,
    description: 'CLASS SKILL — Summons a permanent Arcane Construct (150% MAG as HP and DEF) that bodyguards the Mage (absorbs all hits aimed at the Mage). It attacks each round and fires an Arcane Pulse AoE every 2 rounds. Re-summons after 2-round cooldown if destroyed.',
    icon: '🔮', effects: { summon: true }, procChance: 1.0,
    reactive: true,
    narrative: 'conjures an Arcane Construct — crystallized magic takes form!',
  },
  // L10 — Blizzard. MAG-scaled AoE (swapped with Arcane Construct for early survivability).
  BLIZZARD: {
    id: 'BLIZZARD', name: 'Blizzard', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 10,
    description: 'A frigid storm engulfs every foe. 55% proc, 1.3× AoE power, MAG +25%.',
    icon: '🌨', effects: { powerMultiplier: 1.3, magBonus: 0.25 }, procChance: 0.55,
    narrative: 'conjures a roaring Blizzard — every foe freezes in the gale!',
  },
  // Legacy — Arcane Cataclysm replaced by Arcane Construct (L10 pet).
  // Entry preserved for old save compatibility.
  ARCANE_CATACLYSM: {
    id: 'ARCANE_CATACLYSM', name: 'Arcane Cataclysm (Legacy)', type: 'legacy', source: 'legacy',
    classId: 'MAGE', unlockLevel: 99,
    description: 'LEGACY — Arcane Cataclysm was replaced by Arcane Construct in the Mage rework.',
    icon: '💥', effects: { magBonus: 0.50, powerMultiplier: 1.4 }, procChance: 0.0,
    narrative: '',
  },
  // L14 — Arcane Aftershock (NEW, reactive). Renamed and rewired from the
  // old L6 Spell Echo: now triggers when ANY party member lands a killing blow
  // rather than when the mage casts. Primes 2 rounds of 1.5× spell damage on
  // the mage; 3-round internal cooldown. The SPELL_ECHO id is retained for
  // save compatibility (mages with the old skill auto-upgrade on load).
  SPELL_ECHO: {
    id: 'SPELL_ECHO', name: 'Arcane Aftershock', type: 'reactive', source: 'class',
    classId: 'MAGE', unlockLevel: 14,
    description: 'REACTIVE — Triggers when an ally lands a killing blow. Primes the Mage for 2 rounds of 1.5× spell damage. 3-round cooldown.',
    icon: '🌀', effects: { powerMultiplier: 1.5 },
    narrative: 'resonates with an Arcane Aftershock — their next spells will strike with devastating force!',
  },
  // Legacy — Mana Surge kept in table for old saves that reference the id.
  // Not offered by the class progression any longer (now a mastery passive).
  MANA_SURGE: {
    id: 'MANA_SURGE', name: 'Mana Surge (Legacy)', type: 'legacy', source: 'legacy',
    classId: 'MAGE', unlockLevel: 99,
    description: 'LEGACY — Mana Surge is now the Mage L8 mastery passive (§4.2). This entry exists only for old save compatibility.',
    icon: '🔵', effects: { magBonus: 0.30 }, procChance: 0.0,
    narrative: '',
  },
  // Legacy — Frostbite retired from the class progression (its AoE role is
  // covered by the new L6 Blizzard). Entry preserved for old saves.
  FROSTBITE: {
    id: 'FROSTBITE', name: 'Frostbite (Legacy)', type: 'legacy', source: 'legacy',
    classId: 'MAGE', unlockLevel: 99,
    description: 'LEGACY — Frostbite was retired in the class rework; Blizzard (L6) is the new MAG-scaled AoE.',
    icon: '❄', effects: { powerMultiplier: 1.2, magBonus: 0.20, frostDebuff: true }, procChance: 0.0, cooldown: 4,
    narrative: '',
  },
  METEOR_STORM: {
    id: 'METEOR_STORM', name: 'Meteor Storm', type: 'active', source: 'class',
    classId: 'MAGE', unlockLevel: 18,
    description: 'EPIC — Calls down an apocalyptic meteor storm. 35% proc, 2.5× power, MAG +40%.',
    icon: '☄', effects: { powerMultiplier: 2.5, magBonus: 0.40 }, procChance: 0.35,
    narrative: 'calls down a Meteor Storm — the sky itself falls!',
  },
  QUICK_STAB: {
    id: 'QUICK_STAB', name: 'Quick Stab', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 1,
    description: 'A fast opening stab aimed at a vital point. 55% proc, 1.0× power (routed through the standard 1.25× skill path).',
    icon: '🗡', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'darts in with a Quick Stab!',
  },
  SHADOW_STRIKE: {
    id: 'SHADOW_STRIKE', name: 'Shadow Strike', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 2,
    description: 'Strikes from the shadows. 70% proc, ATK +30%, crit +15%.',
    icon: '🗡', effects: { atkBonus: 0.30, critChance: 0.15 }, procChance: 0.70,
    narrative: 'moves like a shadow and strikes with precision!',
  },
  FAN_OF_KNIVES: {
    id: 'FAN_OF_KNIVES', name: 'Fan of Knives', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 6,
    description: 'Hurls a fan of blades at all enemies. 55% proc, 0.85× AoE power, ATK +15%. Always poisons struck targets (7% max HP/round, 3 rounds) AND applies Exposed (+10% damage taken, 2 rounds).',
    icon: '🗡', effects: { powerMultiplier: 0.85, atkBonus: 0.15, appliesPoison: true, appliesExposed: true }, procChance: 0.55,
    narrative: 'spins and unleashes a Fan of Knives — blades fly in every direction!',
  },
  MARK_FOR_DEATH: {
    id: 'MARK_FOR_DEATH', name: 'Mark for Death', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 10,
    description: 'CLASS SKILL — Marks a target for annihilation. 55% proc, party ATK +15% against target, crit +20%.',
    icon: '🎯', effects: { partyAtkBonus: 0.15, critChance: 0.20 }, procChance: 0.55,
    narrative: 'exposes a critical weakness — the target is Marked for Death!',
  },
  RIPOSTE: {
    // §3.4 — new Rogue L14 class reactive. Counter-strikes on being hit.
    // Intentional exception to the 3-round default reactive cooldown —
    // Rogue identity is fast counter-strikes.
    id: 'RIPOSTE', name: 'Riposte', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 14,
    description: 'CLASS REACTIVE — When the Rogue is hit, counter-strike the attacker for 1.3× ATK with +15% crit. 2-round cooldown.',
    icon: '⚔', effects: { powerMultiplier: 1.3, critChance: 0.15 }, procChance: 1.0, cooldown: 2,
    narrative: 'snaps back with a lightning Riposte!',
  },
  SMOKE_BOMB: {
    // LIFTED to Rogue L16 mastery per §4.2. Was L14 class skill; now a mastery active group-buff.
    id: 'SMOKE_BOMB', name: 'Smoke Bomb', type: 'active', source: 'mastery',
    classId: 'ROGUE', unlockLevel: 16,
    description: 'MASTERY — Throws a smoke bomb, granting the party +30% dodge for 2 rounds. 60% proc.',
    icon: '💣', effects: { dodgeChance: 0.30 }, procChance: 0.60,
    narrative: 'vanishes in a cloud of smoke — impossible to pin down!',
  },
  ASSASSINATE: {
    id: 'ASSASSINATE', name: 'Assassinate', type: 'active', source: 'class',
    classId: 'ROGUE', unlockLevel: 18,
    description: 'EPIC — A lethal strike from the void. 35% proc, 2.3× power, crit +40%.',
    icon: '💀', effects: { powerMultiplier: 2.3, critChance: 0.40 }, procChance: 0.35,
    narrative: 'emerges from the void — Assassinate! The target never saw it coming!',
  },
  SMITE: {
    id: 'SMITE', name: 'Smite', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 2,
    description: 'A bolt of holy wrath channeled through the cleric\'s faith. 55% proc, 1.0× power (routed through the standard 1.25× skill path, scales with MAG).',
    icon: '✨', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'calls down divine wrath — Smite!',
  },
  HOLY_LIGHT: {
    id: 'HOLY_LIGHT', name: 'Holy Light', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 1,
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
  CONSECRATION: {
    // §3.5 — new Cleric L10 class skill. MAG-scaled AoE + "consecrated ground"
    // party buff (DEF +10%, HoT 5% max HP / round for 2 rounds). Intentional
    // exception to the "buffs go to mastery" rule because the buff is
    // thematically fused to the AoE strike.
    id: 'CONSECRATION', name: 'Consecration', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 10,
    description: 'CLASS SKILL — The cleric blesses the ground, calling down holy light on all enemies. 50% proc, 0.75× MAG-scaled AoE. Consecrated ground grants party DEF +10% and heal-over-time 5% max HP/round for 2 rounds.',
    icon: '🌅', effects: { powerMultiplier: 0.75, magBonus: 0.15, partyDefBonus: 0.10, appliesConsecration: true }, procChance: 0.50,
    narrative: 'calls down Consecration — the very ground beneath them is hallowed!',
  },
  DIVINE_SHIELD: {
    // LIFTED to Cleric L8 mastery per §4.2. Was L10 class skill.
    id: 'DIVINE_SHIELD', name: 'Divine Shield', type: 'active', source: 'mastery',
    classId: 'CLERIC', unlockLevel: 8,
    description: 'MASTERY — Wraps the entire party in divine protection. 55% proc, -15% incoming damage for 3 rounds.',
    icon: '⛑', effects: { partyDefBonus: 0.18, partyHealPct: 0.10 }, procChance: 0.55,
    narrative: 'calls forth a Divine Shield — holy light protects all!',
  },
  GUARDIAN_GRASP: {
    // §3.5 — new Cleric L14 class reactive. Pulls an ally out of harm's way on
    // any incoming damage, negating the attack entirely. NO HP-threshold gate.
    // 3-round default reactive cooldown. Phase 1 in §3.10 priority stack —
    // evaluated BEFORE Bulwark because it negates the hit entirely rather than
    // absorbing it.
    id: 'GUARDIAN_GRASP', name: "Guardian's Grasp", type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 14,
    description: "CLASS REACTIVE — When any ally takes damage, the cleric pulls them out of harm's way, negating the attack entirely. 3-round cooldown.",
    icon: '🤲', effects: { negatesHit: true }, procChance: 1.0, cooldown: 3,
    narrative: "reaches out with Guardian's Grasp — {target} is pulled from harm's way!",
  },
  RESURRECTION: {
    // LIFTED to Cleric L16 mastery per §4.2. Keeps Cleric at exactly 2 heals on the class track.
    id: 'RESURRECTION', name: 'Resurrection', type: 'active', source: 'mastery',
    classId: 'CLERIC', unlockLevel: 16,
    description: 'MASTERY — Revives a fallen party member at 40% HP. 3-round cooldown.',
    icon: '🌟', effects: { revivePct: 0.40 }, procChance: 1.0, cooldown: 3,
    narrative: 'channels holy power — {target} rises from the fallen!',
  },
  RIGHTEOUS_BURN: {
    id: 'RIGHTEOUS_BURN', name: 'Righteous Burn', type: 'active', source: 'class',
    classId: 'CLERIC', unlockLevel: 18,
    description: 'EPIC — Pillars of holy fire engulf every foe. 35% proc, 1.5× AoE power, MAG +40%. Applies a burning DoT (40% MAG per round, 3 rounds) to all struck enemies.',
    icon: '🔥', effects: { powerMultiplier: 1.5, magBonus: 0.40, appliesBurn: true }, procChance: 0.35,
    narrative: 'channels a Righteous Burn — pillars of sacred flame scorch the unworthy!',
  },
  AIMED_SHOT: {
    id: 'AIMED_SHOT', name: 'Aimed Shot', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 1,
    description: 'A carefully placed arrow. 55% proc, 1.0× power (routed through the standard 1.25× skill path).',
    icon: '🏹', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'lines up an Aimed Shot!',
  },
  PRECISION_SHOT: {
    id: 'PRECISION_SHOT', name: 'Precision Shot', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 2,
    description: 'A carefully aimed shot that marks the target — marked enemies take +10% damage from all sources for 2 rounds. 70% proc, ATK +25%, crit +15%.',
    icon: '🏹', effects: { atkBonus: 0.25, critChance: 0.15, markTarget: true, markDuration: 2, markDmgBonus: 0.10 }, procChance: 0.70,
    narrative: 'draws their bow and releases a Precision Shot!',
  },
  VOLLEY: {
    id: 'VOLLEY', name: 'Volley', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 6,
    description: 'CLASS SKILL — Rains arrows on all enemies. 55% proc, 1.3× power, ATK +30%. Class-defining AoE by L6.',
    icon: '🎯', effects: { atkBonus: 0.30, powerMultiplier: 1.3 }, procChance: 0.55,
    narrative: 'launches a Volley — arrows rain down on every foe!',
  },
  HUNTERS_MARK: {
    id: 'HUNTERS_MARK', name: 'Hunter\'s Mark', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 10,
    description: 'REACTIVE — When the Ranger scores a killing blow, their next arrow is a guaranteed 1.5× crit on the next target. 3-round cooldown.',
    icon: '🎯', effects: { huntersMark: true, markCritMult: 1.5 }, procChance: 1.0, reactive: true, cooldown: 3,
    narrative: 'marks the next prey — Hunter\'s Mark!',
  },
  PIERCING_ARROW: {
    id: 'PIERCING_ARROW', name: 'Piercing Arrow', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 14,
    description: 'An arrow that punches through armor. 60% proc, 1.6× power, armor-ignoring single-target workhorse.',
    icon: '🏹', effects: { powerMultiplier: 1.6, atkBonus: 0.20, defPierce: true }, procChance: 0.60,
    narrative: 'looses a Piercing Arrow — it punches clean through armor!',
  },
  ARROW_STORM: {
    id: 'ARROW_STORM', name: 'Arrow Storm', type: 'active', source: 'class',
    classId: 'RANGER', unlockLevel: 18,
    description: 'EPIC — Darkens the sky with arrows. 42% proc, 2.0× power, ATK +40%.',
    icon: '🌧', effects: { powerMultiplier: 2.0, atkBonus: 0.40 }, procChance: 0.42,
    narrative: 'darkens the sky — Arrow Storm rains devastation!',
  },
  CAMOUFLAGE: {
    // LIFTED to Ranger L16 mastery per §4.2. Self-buff active — existing combatlog handler at
    // line ~2740 handles the dodge/ATK application.
    id: 'CAMOUFLAGE', name: 'Camouflage', type: 'active', source: 'mastery',
    classId: 'RANGER', unlockLevel: 16,
    description: 'MASTERY — The Ranger fades into cover, gaining self ATK +25% and DODGE +20% for 2 rounds. 55% proc.',
    icon: '🌿', effects: { atkBonus: 0.25, dodgeChance: 0.20 }, procChance: 0.55,
    narrative: 'fades into the shadows — Camouflage active!',
  },
  PIERCING_NOTE: {
    id: 'PIERCING_NOTE', name: 'Piercing Note', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 1,
    description: 'A sharp sonic burst that rattles a single foe. 55% proc, 1.0× power (routed through the standard 1.25× skill path, scales with MAG).',
    icon: '🎵', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'strikes a Piercing Note!',
  },
  REGEN_SONG: {
    id: 'REGEN_SONG', name: 'Regen Song', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 2,
    description: 'A sustained restorative melody that begins immediately when combat starts. Applies a persistent Regen HoT to the party (MAG-scaled). Re-rolls potency every 4 rounds and keeps the higher value. Persists for the rest of the fight.',
    icon: '🎵', effects: { regenHot: true }, procChance: 1.0, cooldown: 4,
    narrative: 'plays a Regen Song — vitality flows through the party!',
  },
  DISCORD: {
    id: 'DISCORD', name: 'Discord', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 6,
    description: 'A jarring melody that devastates enemies. Reduces enemy ATK by 20%, 25% chance enemies fumble attacks, and deals sonic damage each round. Lasts 3 rounds, 4-round cooldown.',
    icon: '🎸', effects: { enemyAtkReduction: 0.20, fumbleChance: 0.25, sonicDot: true }, procChance: 1.0, cooldown: 4,
    narrative: 'strikes a jarring Discord — enemies stagger and falter!',
  },
  CRESCENDO: {
    id: 'CRESCENDO', name: 'Crescendo', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 10,
    description: 'REACTIVE — When an ally lands a critical hit, the Bard builds to a Crescendo, guaranteeing the next party attack is a devastating critical (2.5× damage). 3-round cooldown.',
    icon: '🎶', effects: { devastatingCrit: true }, procChance: 1.0, cooldown: 3, reactive: true,
    narrative: 'builds to a Crescendo — the next strike will be devastating!',
  },
  CADENCE: {
    id: 'CADENCE', name: 'Cadence', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 14,
    description: 'A driving rhythm that quickens the party\'s tempo. 50% proc, party damage +15% and party CRIT +10% for 3 rounds, 4-round cooldown.',
    icon: '🎼', effects: { cadenceBuff: true, dmgBonus: 0.15, critBonus: 0.10 }, procChance: 0.50, cooldown: 4,
    narrative: 'sets a relentless Cadence — the party\'s tempo surges!',
  },
  SONIC_BOOM: {
    id: 'SONIC_BOOM', name: 'Sonic Boom', type: 'active', source: 'class',
    classId: 'BARD', unlockLevel: 18,
    description: 'EPIC — A thunderous sonic detonation that shatters a single foe. 35% proc, 2.2× power, MAG +40%.',
    icon: '🎻', effects: { powerMultiplier: 2.2, magBonus: 0.40 }, procChance: 0.35,
    narrative: 'unleashes a devastating Sonic Boom!',
  },
  MAGNUM_OPUS: {
    // NEW at Bard L16 mastery per §4.2. Bard's signature group-buff finisher — the party's
    // accumulated momentum resolves into a cathartic all-around amp for 2 rounds.
    id: 'MAGNUM_OPUS', name: 'Magnum Opus', type: 'active', source: 'mastery',
    classId: 'BARD', unlockLevel: 16,
    description: 'MASTERY — The Bard channels their Magnum Opus, empowering the entire party with +15% ATK, +15% MAG, and +10% CRIT for 2 rounds. 50% proc, 4-round cooldown.',
    icon: '🎼', effects: { partyAtkBonus: 0.15, partyMagBonus: 0.15, partyCritBonus: 0.10 }, procChance: 0.50, cooldown: 4,
    narrative: 'pours their soul into a Magnum Opus — the party is lifted by transcendent song!',
  },
  JAB: {
    id: 'JAB', name: 'Jab', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 1,
    description: 'A swift ki-infused jab — the first technique every monk learns. 55% proc, 1.0× power (routed through the standard 1.25× skill path).',
    icon: '👊', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'snaps out a lightning Jab!',
  },
  SWIFT_PALM: {
    id: 'SWIFT_PALM', name: 'Swift Palm', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 2,
    description: 'A lightning-fast combo. 70% proc, party +25% ATK, +15% SPD for 2 rounds.',
    icon: '👊', effects: { atkBonus: 0.25, spdBonus: 0.15 }, procChance: 0.70,
    narrative: 'executes a Swift Palm combo!',
  },
  HUNDRED_FISTS: {
    id: 'HUNDRED_FISTS', name: 'Hundred Fists', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 6,
    description: 'A flurry of rapid strikes that blurs past every enemy. 55% proc, 1.2× power, hits all enemies.',
    icon: '👊', effects: { powerMultiplier: 1.2, aoe: true }, procChance: 0.55,
    narrative: 'unleashes a blur of Hundred Fists — striking every foe in the span of a heartbeat!',
  },
  FLOWING_STRIKE: {
    id: 'FLOWING_STRIKE', name: 'Flowing Strike', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 10,
    description: 'CLASS SKILL — Reactive counter. On a successful dodge, the Monk flows into a 1.5× counter-attack. 3-round cooldown.',
    icon: '☯', effects: { powerMultiplier: 1.5, counterOnDodge: true }, procChance: 1.0,
    cooldown: 3, reactive: true,
    narrative: 'flows past the strike and answers with a devastating Flowing Strike!',
  },
  PRESSURE_POINT: {
    id: 'PRESSURE_POINT', name: 'Pressure Point', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 14,
    description: 'A precise strike at a nerve cluster. 60% proc, 1.7× power with +10% crit. On hit, target suffers SPD -20% and DEF -10% for 2 rounds.',
    icon: '🫳', effects: { powerMultiplier: 1.7, critChance: 0.10, pressurePointDebuff: true }, procChance: 0.60,
    narrative: 'strikes a pressure point — the enemy\'s movements falter!',
  },
  FISTS_OF_FURY: {
    id: 'FISTS_OF_FURY', name: 'Fists of Fury', type: 'active', source: 'class',
    classId: 'MONK', unlockLevel: 18,
    description: 'EPIC — An unstoppable barrage of ki-infused strikes. 35% proc, 2.0× power, ATK +30%, SPD +20%.',
    icon: '🔥', effects: { powerMultiplier: 2.0, atkBonus: 0.30, spdBonus: 0.20 }, procChance: 0.35,
    narrative: 'enters a trance and unleashes Fists of Fury — a storm of blows!',
  },
  BONE_SPIKE: {
    id: 'BONE_SPIKE', name: 'Bone Spike', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 1,
    description: 'A jagged bone shard launched from the earth. 55% proc, 1.0× power (routed through the standard 1.25× skill path, scales with MAG).',
    icon: '🦴', effects: { powerMultiplier: 1.0 }, procChance: 0.55,
    narrative: 'conjures a Bone Spike from the ground!',
  },
  RAISE_DEAD: {
    id: 'RAISE_DEAD', name: 'Raise Dead', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 2,
    description: 'The Necromancer\'s iconic signature. Tears a fallen enemy from death\'s embrace, raising it as a thrall that attacks each round as a living DoT and can absorb hits. Corpse-gated — requires an enemy corpse. 2-round cooldown.',
    icon: '💀', effects: { raiseMinion: true }, procChance: 0.70,
    cooldown: 2, reactive: true,
    narrative: null,
  },
  SHADOW_BOLT: {
    id: 'SHADOW_BOLT', name: 'Shadow Bolt', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 6,
    description: 'A bolt of siphoning shadow. 70% proc, 1.3× MAG-scaled damage. On proc, every living party member heals for 10% of their own max HP as dark energy flows back into the living.',
    icon: '🌑', effects: { powerMultiplier: 1.3, shadowBoltLeech: true, shadowBoltLeechPct: 0.10 }, procChance: 0.70,
    narrative: 'hurls a Shadow Bolt — dark energy surges back into the party!',
  },
  BLIGHT: {
    id: 'BLIGHT', name: 'Blight', type: 'active', source: 'class',
    classId: 'NECROMANCER', unlockLevel: 10,
    description: 'CLASS SKILL — Unleashes a wave of necrotic decay across all enemies. Deals 40% MAG as AoE DoT each round for 3 rounds. 55% proc.',
    icon: '☠', effects: { necroticDot: true, powerMultiplier: 1.2 }, procChance: 0.55,
    cooldown: 3,
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
    description: 'EPIC — All fallen enemies rise as one, attacking for 3 rounds and spreading Blight. 45% proc, 2.5× power.',
    icon: '👻', effects: { raiseArmy: true, powerMultiplier: 2.5, necroticDot: true }, procChance: 0.45,
    cooldown: 4,
    narrative: 'tears open the veil — the fallen rise as one in an Army of the Damned!',
  },
};
