# Necromancer Class Design Document — Adventurers Guild

## Context for New Chat

You are helping me build the Necromancer class for "Adventurers Guild," a browser-based idle RPG. The codebase lives in the mounted workspace folder. Key files:

- `js/data.js` — Class definitions (CLASS_DEFS), equipment items, stat budgets
- `js/skills.js` — All skill definitions, `applyPassiveSkills()`, `collectPartyAuras()`, `getMemberActiveSkills()`, `rollActiveSkills()`
- `js/game.js` — Core engine: `effectiveStats()`, equip/unequip, save/load, `getItemGrantedSkills()` helper
- `js/ui/party.js` — Party management UI, character sheets, skill display
- `js/ui/combatlog.js` — Combat simulation engine (round-by-round idle combat)
- `js/ui/compendium.js` — In-game encyclopedia
- `js/ui/quests.js` — Quest UI and active quest rendering
- `js/ui/hall.js` — Guild hall overview
- `style.css` — All styling

The game uses ES modules (import/export). No build tools, no framework — vanilla JS.

---

## Existing Class Design Pattern

Every class follows this structure:

**CLASS_DEFS entry:**
```
{
  id, label, sigil (3-letter), description,
  baseStats: { maxHp, atk, def, spd, mag, crit, dodge },
  growthRates: { same 7 stats },
  recruitCost: true/null, unlockRank: null
}
```

**Skills — 5 class + 5 mastery:**
- Lv 2: Active skill (~70% proc)
- Lv 4: Mastery passive (individual stat boost)
- Lv 6: Active skill (~45-65% proc)
- Lv 8: Mastery passive (enhanced stats)
- Lv 10: CLASS SKILL — Active (~40-55% proc, defines identity)
- Lv 12: Mastery passive — PARTY aura (partyStatBonus keys)
- Lv 14: Active or Passive skill
- Lv 16: Mastery passive (substantial boost)
- Lv 18: EPIC skill — Active (~35% proc, powerMultiplier 1.5-3.0x)
- Lv 20: EPIC mastery passive (capstone, multi-stat)

**No spec tracks** — only Hero has specializations. Necromancer follows standard pattern.

**Equipment per class:** 5 tiers (T1-T5) + celestial (T6). Each class gets 4 celestial items (weapon, armor, offhand, accessory), each granting a unique skill.

**Celestial 2H weapons** get dual granted skills: one active proc + one passive aura (via `grantedSkills` array). 1H celestials get a single `grantedSkill` string.

**Stat budget convention:** 2H weapons match combined stats of 1H + offhand at same tier, but offense-shifted (more ATK/MAG/CRIT/SPD, less DEF/HP).

---

## Necromancer — Agreed Design

### Identity
Hybrid summoner/drain caster. Raises defeated enemies as minions, uses DoTs and life drain for sustained damage and self-healing. Fragile but hard to kill thanks to minion sacrifice mechanic. Fights get better over time as more enemies fall and get raised.

### Stat Profile — "Fragile Puppeteer"
- **maxHp:** 80 base / 11 growth (fragile, between Mage 70/10 and Bard 85/11)
- **atk:** 5 / 0.6 (minimal physical)
- **def:** 5 / 0.8 (paper-thin)
- **spd:** 9 / 1.3 (moderate, methodical)
- **mag:** 16 / 3.0 (strong caster, below Mage 18/3.5 since power is partly in summons)
- **crit:** 7 / 1.2 (decent, dark magic finds weak points)
- **dodge:** 4 / 0.5 (low, they don't dodge — they drain)
- **Sigil:** NCR
- **Armor class:** Robes (shared with Mage/Cleric/Bard)

### Weapons
- **1H path:** Dark Staff + Skull/Grimoire offhand
- **2H path:** Scythe (`twoHanded: true`)
- Scythes are the signature weapon; staves are the budget/early option

### Class Skills (5)

**Lv 2 — Raise Dead** (Active, 2-round cooldown)
- Raises a fallen enemy as a thrall that joins the party temporarily
- The minion has HP (derived from the enemy it was raised from), can be targeted by enemies, attacks each round dealing MAG-scaled damage
- If minion dies naturally, it's gone; Necromancer must wait for cooldown to raise another
- This is a NEW MECHANIC requiring minion state tracking in combatlog.js
- Combat log flavor: "{name} tears a fallen {enemy} from death's embrace — it rises as a thrall!"

**Lv 6 — Life Tap** (Active, ~55% proc)
- Deals MAG-scaled damage to an enemy and heals the Necromancer for a portion of damage dealt
- Core sustain tool, keeps them alive between minion cycles
- Combat log flavor: "{name} drains the life force from {enemy}, dark energy flowing back!"

**Lv 10 — Blight** (CLASS SKILL, Active, ~45% proc)
- AoE DoT: applies a decaying curse to all enemies, dealing MAG-scaled damage over 3 rounds
- This is what differentiates Necromancer from Mage — Mages nuke, Necromancers corrode
- Also a new-ish mechanic (DoT already exists for Discord skill on Bard, so pattern exists)
- Combat log flavor: "{name} unleashes a wave of Blight — necrotic decay spreads through the enemy ranks!"

**Lv 14 — Forgo Death** (Reactive/Passive)
- When the Necromancer would receive a killing blow AND a raised minion exists, the minion is destroyed instead and the Necromancer survives at ~20% HP
- Works as long as a minion is alive — not once-per-fight like Unbreakable Will
- If no minion exists, the Necromancer dies normally
- Creates meaningful gameplay loop: Raise Dead → minion fights → minion saves you → need to raise another
- Combat log flavor: "{minion} hurls itself before the killing blow — it crumbles to dust, but {name} endures!"

**Lv 18 — Army of the Damned** (EPIC, Active, ~35% proc)
- Raises ALL fallen enemies simultaneously for a massive damage burst
- powerMultiplier: 2.5-3.0
- The ultimate "the battlefield belongs to me" moment
- Combat log flavor: "{name} tears open the veil — the fallen rise as one in an Army of the Damned!"

### Mastery Skills (5)

**Lv 4 — Grave Chill** (Passive)
- MAG +8%, SPD +5%
- Early power ramp

**Lv 8 — Soul Harvest** (Passive)
- MAG +12%, CRIT +8%
- Feeding on fallen energy

**Lv 12 — Shroud of Decay** (PARTY AURA)
- Party MAG +6%, party CRIT +4%
- NEW: Damage reflect — enemies that hit party members take necrotic feedback damage (X% of damage dealt reflected back)
- The Necromancer's mere presence is toxic to enemies
- Reflect is a new mechanic for collectPartyAuras / combat sim

**Lv 16 — Undying Will** (Passive)
- MAG +18%, DEF +10%, maxHP +8%
- Growing harder to put down

**Lv 20 — Lord of the Dead** (EPIC Passive)
- MAG +30%, CRIT +12%, ATK +10%, maxHP +10%
- Raised minions deal increased damage (needs a new effect key like `minionDamageBonus: 0.25` or similar)
- Capstone that makes the entire kit hit harder

### Equipment Progression

**Scythes (2H):**
| Tier | Name | Notes |
|------|------|-------|
| T1 | Rusty Scythe | Starter 2H |
| T2 | Bone Scythe | |
| T3 | Grave Reaper | |
| T4 | Soul Harvester | |
| T5 | Abyssal Scythe | |
| T6 | Mortality's End | Celestial, dual grantedSkills (proc + passive aura) |

**Dark Staves (1H):**
| Tier | Name | Notes |
|------|------|-------|
| T1 | Blighted Wand | Starter 1H |
| T2 | Bone Staff | |
| T3 | Hexwood Staff | |
| T4 | Staff of Whispers | |
| T5 | Deathrattle Staff | |
| T6 | — | (celestial is the scythe, no celestial 1H staff) |

**Offhands (Skulls/Grimoires):**
| Tier | Name | Notes |
|------|------|-------|
| T1 | Cracked Skull | |
| T2 | Tome of Shadows | |
| T3 | Whispering Skull | |
| T4 | Grimoire of Souls | |
| T5 | Skull of the Damned | |
| T6 | Skull of Eternal Whispers | Celestial offhand |

**Robes:** Follow existing robe tier structure (shared pool or necro-themed variants)

**Celestial Set — "Dominion of the Dead":**
- Mortality's End (2H scythe) — dual skills: active proc + passive aura
- Shroud of the Lich (robes) — celestial armor
- Skull of Eternal Whispers (offhand) — celestial offhand
- Phylactery of Souls (accessory) — celestial accessory

### New Mechanics Required

1. **Minion system in combat sim** — Raised enemies become party-side combatants with HP, attack per round, can be targeted. This is the biggest new system.
2. **Forgo Death reactive trigger** — Similar to existing reactive skills (Guardian Spirit, Executioner's Mark) but conditional on minion state.
3. **Damage reflect in party auras** — New `reflect` key in collectPartyAuras, applied in combat sim when party members take hits.
4. **Minion damage bonus** — Lord of the Dead's `minionDamageBonus` effect key, consumed by combat sim.
5. **2-round cooldown tracking** — Raise Dead needs per-skill cooldown state in combat rounds.

### Design Questions Still Open

- Exact damage reflect percentage for Shroud of Decay
- How minion HP scales (flat from enemy stats? percentage of enemy max HP?)
- Can the Necromancer have more than one minion at a time? (Probably cap at 1 for balance, Army of the Damned being the exception as a burst)
- Exact stat budgets for scythe/staff/skull equipment tiers (need to match existing cross-class averages)
- Whether Raise Dead can target boss enemies or only adds/minions
- Equipment proc skills for T3-T5 weapons (each non-celestial weapon with a proc needs a skill in skills.js)

---

## How to Start

1. First, read the existing combat sim in `js/ui/combatlog.js` to understand the round-by-round system, how skills proc, how reactive skills trigger, and how DoTs already work (Bard's Discord skill).
2. Read `js/skills.js` for the full skill definition pattern and `applyPassiveSkills` / `collectPartyAuras`.
3. Read `js/data.js` for CLASS_DEFS structure and equipment stat budget patterns.
4. Then we can discuss implementation approach for the minion system before writing any code.
