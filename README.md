# The Adventurers Guild

A browser-based idle RPG where you manage a guild of adventurers, send them on quests, and climb the ranks from a fledgling F-Rank guild to legendary S-Rank.

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

**Equipment** — Gear comes in five rarities (Common, Magic, Rare, Epic, Legendary) and four slots (Weapon, Armor, Accessory, Offhand). Equipping items boosts your party members' stats and affects combat outcomes.

## Running Locally

No build step required. Just serve the static files:

```bash
node serve.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech

Pure vanilla JavaScript with ES modules. No frameworks, no bundler, no dependencies. Game state persists in localStorage.
