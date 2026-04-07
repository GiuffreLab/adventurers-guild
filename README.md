# The Adventurers Guild

A browser-based idle RPG where you manage a guild of adventurers, send them on quests, and climb the ranks from a fledgling F-Rank guild to legendary S-Rank.

**[Play Now](https://giuffrelab.github.io/adventurers-guild/)**

[![pages-build-deployment](https://github.com/GiuffreLab/adventurers-guild/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/GiuffreLab/adventurers-guild/actions/workflows/pages/pages-build-deployment)

## How to Play

You start by creating your character — a Hero — and registering with the guild. From there, the game revolves around four main tabs:

**Guild Hall** — Your home base. See your guild's rank, roster, active quest progress, and recent event log. This is where you monitor how things are going at a glance.

**Quest Board** — Pick from available quests suited to your guild's rank. Each quest shows enemies, difficulty, rewards, and recommended party power. Hit "Send Party" and watch the combat play out event by event. As you complete more quests, your party builds synergy bonuses that improve gold, XP, damage, healing, and more. Once you unlock auto-battle, you can queue up repeated runs with different strategies (safe, balanced, or push).

**Party** — Recruit new members, manage your roster, equip gear, and assign active party slots. Each class plays differently — Knights tank, Mages deal magic damage, Rogues rely on speed and luck, Clerics heal, Rangers excel in ranged combat, Bards boost the whole party, and Monks are well-rounded late-game powerhouses. New classes unlock as your guild rank increases.

**Shop** — Buy and sell equipment. The shop restocks periodically with gear appropriate to your rank. Higher rarity items appear less frequently but offer stronger stat bonuses.

## Core Systems

**Combat** — Quests run a full battle simulation. Your party fights enemies in real time until one side falls. Events play out every 1.5 seconds (faster with ATK speed synergy bonuses), showing attacks, skills, healing, enemy knockouts, and reinforcements.

**Guild Rank** — Completing quests earns rank points. Accumulate enough and your guild promotes through the ranks: F, E, D, C, B, A, and finally S. Higher ranks unlock harder quests, better loot, new recruit classes, and stronger shop inventory.

**Party Synergy** — The more quests your party completes together, the stronger they become. Synergy bonuses unlock progressively across eight categories: Gold/XP, Damage, Damage Reduction, ATK Speed, Healing Efficiency, Item Find, Boss Encounter Chance, and Rank Points. Auto-battle also unlocks through synergy milestones.

**Skills** — Party members learn skills as they level up. Each class has a unique skill tree with passive and active abilities that can trigger during quests.

## Classes

Every class brings a unique signature ability to the party. Building a diverse roster lets you combine these strengths for harder content.

**Hero** — Your starting character. A balanced all-rounder with solid stats across the board. Signature: **Rally Cry** — when any ally drops below 30% HP, the Hero rallies them with a burst heal and attack buff. The insurance policy that keeps runs from falling apart.

**Knight** (Unlocks at F-Rank) — The iron wall. Massive HP and defense make the Knight the party's frontline. Signature: **Bulwark** — every 3 rounds, the Knight intercepts an attack aimed at an ally and absorbs the damage. Keeps your squishies alive.

**Mage** (Unlocks at F-Rank) — Glass cannon. Devastating arcane damage from ice shards, lightning bolts, and fire. Signature: **Spell Echo** — spells hit twice, and the capstone Meteor Storm deals the highest single-target damage in the game. Pure destruction.

**Rogue** (Unlocks at F-Rank) — Swift and deadly. High speed and luck mean frequent crits and backstabs. Signature: **Mark for Death** — on a critical hit, the Rogue marks the target so ALL party members deal +20% damage to it for 2 rounds. A force multiplier for the whole team.

**Cleric** (Unlocks at F-Rank) — The party's lifeline. Signature: **Group Heal** — the only class that can cast direct group heals, restoring HP to the entire party mid-combat. Also deals divine damage through smites and holy wrath.

**Ranger** (Unlocks at E-Rank) — Precision archer with keen survival instincts. Signature: **Volley** — fires a rain of arrows that strikes ALL enemies at once. The answer to swarm encounters with lots of weaker foes. Also boosts gold and XP gain through Wilderness Mastery.

**Bard** (Unlocks at C-Rank) — The ultimate support. Signature: **Regen Melody + Party Buffs** — the only class that provides persistent HP regeneration each round AND boosts the entire party's ATK, DEF, and SPD through songs. No direct damage — pure party amplification.

**Monk** (Unlocks at A-Rank) — Martial arts master with perfectly balanced stats. Signature: **Ki Barrier** — heals 25% of all damage dealt back as HP, making the Monk a self-sustaining frontliner who doesn't need a healer. A late-game powerhouse worth the wait.

**Equipment** — Gear comes in five rarities (Common, Magic, Rare, Epic, Legendary) and four slots (Weapon, Armor, Accessory, Offhand). Equipping items boosts your party members' stats and affects combat outcomes.

## Running Locally

No build step required. Just serve the static files:

```bash
node serve.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech

Pure vanilla JavaScript with ES modules. No frameworks, no bundler, no dependencies. Game state persists in localStorage.
