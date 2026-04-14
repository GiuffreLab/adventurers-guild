# The Adventurers Guild

A browser-based idle RPG where you manage a guild of adventurers, send them on quests, and climb the ranks from a fledgling F-Rank guild to legendary S-Rank.

This is a project built purely for fun — a pick-up-and-play RPG that runs in any browser on any device with zero installs, accounts, or downloads. Open it in a tab, check in when you feel like it, and let your guild grow over time. If you enjoy it, consider giving the repo a star — it helps others find the game and keeps the motivation going.

**[Play Now](https://giuffrelab.github.io/adventurers-guild/)**

[![pages-build-deployment](https://github.com/GiuffreLab/adventurers-guild/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/GiuffreLab/adventurers-guild/actions/workflows/pages/pages-build-deployment)

## How to Play

You start by creating your character — a Hero — and registering with the guild. From there, the game revolves around four main tabs:

**Guild Hall** — Your home base. See your guild's rank, roster, active quest progress, and recent event log. This is where you monitor how things are going at a glance.

**Quest Board** — Pick from available quests suited to your guild's rank. Each quest shows enemies, difficulty, rewards, and recommended party power. Hit "Send Party" and watch the combat play out event by event. As you complete more quests, your party builds synergy bonuses that improve gold, XP, damage, healing, and more. Once you unlock auto-battle, you can queue up repeated runs with different strategies (safe, balanced, or push).

**Party** — Recruit new members, manage your roster, equip gear, and assign active party slots. All nine classes are available from the start — build whatever party composition you want. Recruitment costs scale with party size: your first few recruits are cheap (50–150g) to get a base party going, while later slots ramp up (500–1500g) as a long-term gold sink. Maximum roster is 8 members.

**Shop** — Buy and sell equipment. The shop restocks periodically with gear appropriate to your rank. Higher rarity items appear less frequently but offer stronger stat bonuses.

**Compendium** — The in-game encyclopedia. If you want to understand how anything works — stats, classes, skills, equipment procs, combat formulas, party synergy, or the ranking system — the Compendium has it all. It pulls live data from the game, so class stats, skill descriptions, item proc tables, and your current synergy progress are always up to date. Start here if you're new, and come back whenever you need to plan your next build or understand a mechanic.

## Core Systems

### Combat Simulation

Quests run a full deterministic battle simulation. Your party fights enemies in real time until one side falls. Events play out every 1.5 seconds (faster with ATK speed synergy bonuses), showing attacks, skills, healing, enemy knockouts, and reinforcements. Every stat on your characters matters in combat:

- **ATK** — Scales physical damage for melee and ranged classes. The primary damage stat for Heroes, Knights, Rogues, Rangers, and Monks.
- **MAG** — Scales magic damage for caster classes and also scales heal strength. The primary stat for Mages, Clerics, Bards, and Necromancers.
- **DEF** — Reduces incoming damage with diminishing returns. Knights with 200+ DEF shrug off hits that would flatten a Mage.
- **SPD** — Determines how often a character gets selected to act. High-SPD characters like Rogues and Rangers attack significantly more often than slow tanks.
- **CRIT** — Chance to land a critical hit for 1.5x damage. Scales with diminishing returns — Rogues and Mages have the highest crit rates.
- **DODGE** — Chance to completely avoid an incoming enemy attack. Monks and Bards dodge most frequently.

### Skill Round-Robin

Each class learns active and passive skills as they level up, and legendary/celestial equipment grants additional active procs. In combat, the sim uses a round-robin cooldown system — after a skill fires, it goes on a short cooldown, forcing variety and ensuring every active ability gets used across a fight. Passive skills are filtered out of the combat pool since they're always-on buffs, so only real combat actions compete for skill turns.

### Guild Rank

Completing quests earns rank points. Accumulate enough and your guild promotes through the ranks: F, E, D, C, B, A, and finally S. Higher ranks unlock harder quests, better loot, and stronger shop inventory.

### Party Synergy

The more quests your party completes together, the stronger they become. Synergy bonuses unlock progressively across eight categories: Gold/XP, Damage, Damage Reduction, ATK Speed, Healing Efficiency, Item Find, Boss Encounter Chance, and Rank Points. Auto-battle also unlocks through synergy milestones.

### Quest Results & Battle Highlights

After each quest, the results screen shows a combat performance breakdown with damage bars per member, plus a Battle Highlights section featuring the fight's standout moments: biggest hit, biggest heal, biggest block, most kills, crit machine, and untouchable (dodges). A "Copy Fight Log" button exports the full battle data — party composition, gear, stats, skill activations, and every combat event — for analysis and balance troubleshooting.

## Classes

Every class brings a unique signature ability to the party. All nine classes are available from the start — build your dream roster from day one.

**Hero** — Your starting character (free). A balanced all-rounder with solid stats across the board. Signature: **Rally Cry** — when any ally drops below 30% HP, the Hero rallies them with a burst heal and attack buff. **Sword Dance** cleaves all enemies, and the capstone **Starfall Slash** delivers devastating burst. At Level 10, the Hero chooses a **Specialization** (Vanguard, Champion, or Warden) that adds 3 new skills on top of existing abilities, defining their combat identity for the rest of the game. Respec available for gold.

**Knight** — The iron wall. Massive HP and DEF make the Knight the party's frontline. Signature: **Bulwark** — every 3 rounds, the Knight intercepts an attack aimed at an ally and absorbs the damage. **Sweeping Blow** provides AoE, **Last Stand** triggers a defensive surge when wounded, and the capstone **Unbreakable** survives killing blows. Improved base SPD means Knights now contribute more consistently to the ATB rotation rather than sitting idle between their defensive triggers.

**Mage** — Glass cannon. Devastating arcane damage with the highest sustained magic DPS in the game. Signature: **Arcane Construct** — a summoned pet that pulses AoE damage each round. **Blizzard** and **Meteor Storm** provide powerful AoE, and **Arcane Aftershock** triggers bonus damage on spell casts. Mage-only weapons from Epic tier onward all carry AoE damage procs (Void Burst, Cataclysm, Arcanum Cataclysm), making the Mage one of the two primary AoE classes alongside the Ranger. Offhand orbs provide buff and aura procs that empower spell potency.

**Rogue** — Swift and deadly. Highest SPD in the game means Rogues act constantly. High ATK and CRIT make every hit dangerous. Signature: **Mark for Death** — the Rogue marks a target so ALL party members deal +20% damage to it for 2 rounds. **Fan of Knives** applies AoE poison and exposure, **Riposte** counter-strikes when hit, and **Smoke Bomb** grants party-wide dodge. Class-exclusive offhand daggers from Rare tier onward deliver escalating poison DoTs (Envenom, Deadly Toxin, Neurotoxin) that corrode enemy ATK while ticking damage — pairing burst crits with sustained pressure.

**Cleric** — The party's lifeline. Heals scale off MAG, making a well-geared Cleric's group heals massive. Signature: **Divine Intervention** — saves allies from killing blows. **Consecration** deals AoE damage while buffing the party, **Guardian's Grasp** negates incoming hits entirely, and the capstone **Righteous Burn** adds fire DoT to the Cleric's arsenal. Improved base SPD means the Cleric now heals more frequently in the ATB rotation, and class weapons carry SPD bonuses from Epic tier onward. The Celestial weapon grants **Sanctified Radiance** — a persistent party regen at ~70% of base Regen Song potency, giving the Cleric their own sustained healing layer. **Sanctuary** provides universal stats (HP, DEF, SPD, CRIT) so every party member benefits.

**Ranger** — Precision archer with keen survival instincts. Second-highest SPD and ATK in the game. Signature: **Volley** — fires a rain of arrows that strikes ALL enemies at once. **Camouflage** grants a 40% dodge buff, **Piercing Arrow** shreds defense, and the capstone **Arrow Storm** is the most devastating ranged AoE. Ranger-only bows from Epic tier onward all carry AoE damage procs (Storm Volley, Celestial Volley, Celestial Barrage), making the Ranger one of the two primary AoE classes alongside the Mage. Offhand quivers provide buff and aura procs — speed, precision, and party-wide empowerment. **Nature Bond** gives party-wide dodge and bonus gold/exp, making Rangers the best class for farming.

**Bard** — The ultimate support with a dual weapon identity. Signature: **Regen Song** — the only class that provides persistent HP regeneration each round. **Discord** debuffs enemy ATK and applies sonic DoT, **Crescendo** grants guaranteed devastating crits to allies, and **Cadence** buffs the whole party's damage and crit. The capstone **Sonic Boom** delivers the Bard's own burst. The Bard offers a true gear identity fork: Lutes for the **Songweaver** path (amplified Regen Song potency and a party heal received bonus that empowers Cleric heals too), or Drums for the **Wardrum** path (amplified Discord DoT damage, stronger ATK reduction, and higher fumble chance — a debuff specialist that cripples enemy output). High DODGE makes them surprisingly survivable — they're the strongest "always include" after the Hero.

**Monk** — Martial arts master with perfectly balanced stats and the game's deepest reactive combat loop. Signature: **Flowing Strike** — counter-attacks on dodge, triggering **Iron Stance** for bonus DEF and dodge. **Hundred Fists** pummels all enemies, **Pressure Point** debuffs enemy speed and defense while generating Ki Shields, and the capstone **Fists of Fury** delivers devastating burst with bonus strikes. The Monk offers a true gear identity fork: 1H Claws + Offhand Claws for aggressive pressure (damage procs + chi burn DoTs that slow enemy ATB), or 2H Quarterstaves for the **Flowing Defense** path (deflect incoming attacks, reflect damage back, and at Celestial tier extend that protection to the whole party). **Ki Resonance** gives the party an equal spread of ATK, DEF, SPD, and CRIT.

**Necromancer** — Summoner with a dual weapon identity that defines two distinct playstyles. Signature: **Raise Dead** — when an enemy dies, the Necromancer tears it from death's embrace as a thrall that deals automatic damage each round. **Forgo Death** sacrifices the thrall to survive a killing blow. **Shadow Bolt** blasts a single target while healing every ally for 6% of their max HP. **Blight** corrodes all enemies with a 3-round AoE DoT, and the capstone **Army of the Damned** raises every fallen enemy at once for devastating multi-round carnage. The Necromancer offers a true gear identity fork: 1H Staves + Offhand Skulls/Grimoires for the **Drain Caster** path (lifetap weapon procs, skull/grimoire buff procs, stronger personal spell damage, thralls serve as a Forgo Death safety net), or 2H Scythes for the **Death Lord** path (deterministic passive auras that empower thralls with bonus damage and HP, amplify Blight ticks, and at Celestial tier grant thrall AoE attacks that hit all enemies). Their party aura **Shroud of Decay** reflects MAG-scaled necrotic damage back at enemies who strike allies. Best paired with a Cleric — group heals keep the thrall alive longer, extending the Forgo Death safety net.

## Hero Specializations

At Level 10, the Hero unlocks a choice between three specialization tracks. Spec skills layer on top of the Hero's existing class skills and masteries — you keep everything you already have and gain 3 additional abilities at levels 10, 14, and 18.

**Vanguard (Tank)** — Intercepts hits for allies with damage reduction, bulks up with massive DEF/HP buffs, and survives killing blows. The party's second frontline behind the Knight, but trades raw absorption for damage mitigation and clutch survival.

**Champion (DPS)** — Executes weakened enemies, gains stacking damage from kills, and unleashes devastating critical strikes. Turns the Hero from a balanced all-rounder into a kill-chaining damage machine.

**Warden (Support)** — Emergency heals for critically wounded allies, a powerful party-wide aura buffing ATK/DEF/SPD/CRIT, and a once-per-fight mass revival when things go wrong. The safety net that turns near-wipes into comeback victories.

Respec costs scale with guild rank (75% of gem bag sale value): F: 7,500g through S: 187,500g.

## Equipment

Gear comes in six rarities and four slots (Weapon, Armor, Accessory, Offhand):

- **Common** — Basic starting gear. Stats only.
- **Magic** — Modest stat upgrades. Available early in the shop.
- **Rare** — Solid mid-game gear with broader stat spreads.
- **Epic** — Strong endgame options. Some grant equipment skills.
- **Legendary** — Best-in-slot non-celestial gear. Every legendary item grants a unique active skill proc when equipped.
- **Celestial** — God-tier S-Rank drops. Each class has a full 4-piece celestial set (weapon, armor, offhand, accessory) with massive stats and powerful celestial skill procs that get special visual effects in combat.

Two-handed weapons (Bard instruments, Hero greatswords, Monk staves) carry ~1.5x the stat budget of one-handed weapons to compensate for the lost offhand slot.

### Loot by Guild Rank

Each guild rank drops equipment from specific rarity tiers. Normal quests draw from the rank's pool, while boss quests skip the current tier entirely and reward gear from the next tier up (with a chance at two tiers up), plus a small chance at celestial drops regardless of rank.

| Rank | Normal Quest Drops | Boss Drops |
|------|-------------------|------------|
| F | Common | Magic, Magic+Rare, Celestial |
| E | Magic | Magic+Rare, Rare, Celestial |
| D | Magic, Rare | Rare, Rare+Epic, Celestial |
| C | Rare | Rare+Epic, Epic+Legendary, Celestial |
| B | Rare, Epic | Epic+Legendary, Legendary+Celestial |
| A | Epic, Legendary | Legendary+Celestial |
| S | Legendary, Celestial | Legendary, Celestial (increased) |
| S+ | Legendary, Celestial (increased) | Legendary, Celestial (highest) |
| S++ | Legendary, Celestial (highest) | Legendary, Celestial (highest) |

Celestial drop rates from bosses are very low at early ranks but scale significantly at S and above.

## Save Management

Game progress is saved automatically in your browser's local storage. To back up your save or move it to another device, use the Export and Import buttons in the Guild Hall. Export downloads your save as a JSON file, and Import loads one back in. Importing a save will overwrite your current progress — your existing save is backed up automatically and restored if the import fails.

## Running Locally

No build step required. Just serve the static files:

```bash
node serve.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech

Pure vanilla JavaScript with ES modules. No frameworks, no bundler, no dependencies. Game state persists in localStorage. Combat is fully deterministic via seeded random number generation — replaying the same quest seed produces identical results.
