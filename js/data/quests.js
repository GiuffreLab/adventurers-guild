// Rank order, quest definitions, and quest helpers.

// ── Rank Order ────────────────────────────────────────────────────────────────
export const RANK_ORDER = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'S+', 'S++'];

// ── Quests ────────────────────────────────────────────────────────────────────
export const QUESTS = {
  F_001: {
    id:'F_001', rank:'F', title:'Slime Extermination',
    description:"Clear the slimes from Farmer Dobbs' field before the harvest.",
    environment: { name: "Dobbs' Farmland", icon: '🌾', mood: 'pastoral' },
    enemies: ['Slime', 'Green Slime', 'Slime King'],
    duration:15, difficulty:0.5, recommendedPower:15,
    goldReward:{min:10,max:25}, expReward:{min:12,max:20}, rankPointReward:25,
    lootTable:[
      {itemId:'WORN_SWORD',    chance:0.12, quantity:[1,1]},
      {itemId:'LUCKY_CHARM',   chance:0.08, quantity:[1,1]},
    ],
    requiredGuildRank:'F', isRepeatable:true,
    narratives:{
      success:["The party swept through the field with ease. Farmer Dobbs wept with gratitude.",
               "A dozen slimes in ten minutes. The work was almost boring, but the pay is the pay."],
      failure:["The slimes kept splitting faster than the party could handle. Embarrassing, but everyone starts somewhere."],
    },
  },
  F_002: {
    id:'F_002', rank:'F', title:'Rat Catcher',
    description:"The Millhaven inn has a giant rat infestation in its cellar.",
    environment: { name: "Millhaven Inn Cellar", icon: '🏚', mood: 'dungeon' },
    enemies: ['Giant Rat', 'Plague Rat', 'Rat Swarm'],
    duration:18, difficulty:0.6, recommendedPower:18,
    goldReward:{min:15,max:30}, expReward:{min:15,max:25}, rankPointReward:30,
    lootTable:[
      {itemId:'CHAINMAIL',    chance:0.15, quantity:[1,1]},
      {itemId:'LUCKY_CHARM',  chance:0.10, quantity:[1,1]},
    ],
    requiredGuildRank:'F', isRepeatable:true,
    narratives:{
      success:["The cellar is clear. The innkeeper offered a round of drinks on the house.",
               "Giant rats — more dangerous than they sound, and smellier too."],
      failure:["The rats were everywhere at once. The party retreated, covered in bites."],
    },
  },
  F_003: {
    id:'F_003', rank:'F', title:'Escort: Millhaven Road',
    description:"Escort a merchant cart from Millhaven to the northern crossroads.",
    environment: { name: "Millhaven Road", icon: '🛤', mood: 'wilderness' },
    enemies: ['Goblin Scout', 'Goblin Archer', 'Goblin Ambusher'],
    duration:20, difficulty:0.8, recommendedPower:25,
    goldReward:{min:30,max:50}, expReward:{min:20,max:35}, rankPointReward:50,
    lootTable:[
      {itemId:'IRON_SWORD',  chance:0.08, quantity:[1,1]},
      {itemId:'WOODEN_SHIELD',chance:0.10, quantity:[1,1]},
    ],
    requiredGuildRank:'F', isRepeatable:true,
    narratives:{
      success:["Two goblin ambushes repelled. The merchant arrived safely and tipped well.",
               "A quiet road — until the goblins showed up. They didn't show up twice."],
      failure:["A larger ambush than expected forced the party back to town."],
    },
  },
  E_001: {
    id:'E_001', rank:'E', title:'Goblin Cave Clearance',
    description:"A goblin tribe has claimed a cave system near the town well. Clear them out.",
    environment: { name: "Goblin Caves", icon: '🕳', mood: 'dungeon' },
    enemies: ['Goblin Warrior', 'Goblin Shaman', 'Goblin Chieftain'],
    duration:22, difficulty:1.2, recommendedPower:45,
    goldReward:{min:50,max:90}, expReward:{min:35,max:55}, rankPointReward:90,
    lootTable:[
      {itemId:'IRON_SWORD',  chance:0.20, quantity:[1,1]},
      {itemId:'IRON_PLATE',  chance:0.20, quantity:[1,1]},
      {itemId:'STEEL_DAGGER',chance:0.10, quantity:[1,1]},
    ],
    requiredGuildRank:'E', isRepeatable:true,
    narratives:{
      success:["The cave reeked, but it's clear now. A goblin shaman at the back nearly turned things ugly.",
               "Three dozen goblins and their chieftain. Messy work, but worth every copper."],
      failure:["The shaman's hexes were more potent than expected. The party retreated with minor injuries."],
    },
  },
  E_002: {
    id:'E_002', rank:'E', title:'Wolf Pack Terror',
    description:"A pack of dire wolves has been attacking livestock west of Millhaven.",
    environment: { name: "Western Grazelands", icon: '🌙', mood: 'wilderness' },
    enemies: ['Dire Wolf', 'Shadow Wolf', 'Alpha Wolf'],
    duration:25, difficulty:1.4, recommendedPower:55,
    goldReward:{min:70,max:120}, expReward:{min:40,max:65}, rankPointReward:110,
    lootTable:[
      {itemId:'CHAINMAIL',   chance:0.15, quantity:[1,1]},
      {itemId:'RUSTY_DAGGER',chance:0.12, quantity:[1,1]},
    ],
    requiredGuildRank:'E', isRepeatable:true,
    narratives:{
      success:["The alpha wolf was enormous. Once it fell, the pack scattered.",
               "Twelve dire wolves dispatched. The farmers can sleep easy again."],
      failure:["The pack ambushed in a way that suggested intelligence. The party withdrew to regroup."],
    },
  },
  E_003: {
    id:'E_003', rank:'E', title:'Haunted Farmhouse',
    description:"Undead have risen in an abandoned farmhouse three miles out. Cleanse them.",
    environment: { name: "Abandoned Farmhouse", icon: '👻', mood: 'haunted' },
    enemies: ['Skeleton', 'Restless Spirit', 'Ghostly Knight'],
    duration:28, difficulty:1.6, recommendedPower:65,
    goldReward:{min:90,max:140}, expReward:{min:50,max:80}, rankPointReward:140,
    lootTable:[
      {itemId:'MAGE_ROBES',   chance:0.12, quantity:[1,1]},
      {itemId:'APPRENTICE_STAFF',chance:0.15,quantity:[1,1]},
      {itemId:'VITALITY_AMULET',chance:0.10,quantity:[1,1]},
    ],
    requiredGuildRank:'E', isRepeatable:false,
    narratives:{
      success:["A powerful ghost was anchoring the undead. Once banished, the skeletons crumbled to dust.",
               "Whatever happened in that farmhouse, it's at rest now."],
      failure:["The ghost's wail was paralyzing. The party fled, and the farmhouse remains haunted."],
    },
  },
  D_001: {
    id:'D_001', rank:'D', title:'Iron Tomb Dungeon',
    description:"Explore and clear the dungeon known as the Iron Tomb. Report on its contents.",
    environment: { name: "The Iron Tomb", icon: '⚰', mood: 'dungeon' },
    enemies: ['Skeleton Knight', 'Iron Golem', 'Ancient Lich'],
    duration:30, difficulty:2.2, recommendedPower:120,
    goldReward:{min:200,max:350}, expReward:{min:100,max:160}, rankPointReward:275,
    lootTable:[
      {itemId:'STEEL_SWORD',  chance:0.20, quantity:[1,1]},
      {itemId:'TEMPLAR_PLATE', chance:0.18, quantity:[1,1]},
      {itemId:'POWER_STONE',  chance:0.12, quantity:[1,1]},
    ],
    requiredGuildRank:'D', isRepeatable:true,
    narratives:{
      success:["The tomb held three floors and a lich at the bottom. The lich is ashes.",
               "Ancient traps, restless dead, and a very angry golem. A full dungeon run in one piece."],
      failure:["The golem on the second floor was beyond the party's current ability. Strategic withdrawal."],
    },
  },
  D_002: {
    id:'D_002', rank:'D', title:"Bandit King's Stronghold",
    description:"A bandit lord has fortified an old keep and is taxing merchant roads. Rout him.",
    environment: { name: "Ruined Keep", icon: '🏰', mood: 'fortress' },
    enemies: ['Bandit Thug', 'Bandit Lieutenant', 'The Bandit King'],
    duration:35, difficulty:2.5, recommendedPower:140,
    goldReward:{min:280,max:450}, expReward:{min:120,max:190}, rankPointReward:350,
    lootTable:[
      {itemId:'STEEL_SWORD',  chance:0.25, quantity:[1,1]},
      {itemId:'VENOM_FANG',   chance:0.15, quantity:[1,1]},
      {itemId:'SHADOW_CHAIN',chance:0.20,quantity:[1,1]},
      {itemId:'IRON_SHIELD',  chance:0.20, quantity:[1,1]},
      {itemId:'SWIFT_RING',   chance:0.15, quantity:[1,1]},
    ],
    requiredGuildRank:'D', isRepeatable:false,
    narratives:{
      success:["The Bandit King had over forty men. He has none now. The roads are safe.",
               "A brutal siege, but the party broke through. The merchant guilds will remember this."],
      failure:["The walls held and the defenders outnumbered the party two to one. Tactical retreat."],
    },
  },
  C_001: {
    id:'C_001', rank:'C', title:'Troll Bridge Menace',
    description:"A pair of stone trolls have blockaded the northern trade bridge. Remove them.",
    environment: { name: "Northern Trade Bridge", icon: '🌉', mood: 'wilderness' },
    enemies: ['Stone Troll', 'Elder Stone Troll'],
    duration:35, difficulty:3.5, recommendedPower:250,
    goldReward:{min:500,max:800}, expReward:{min:200,max:320}, rankPointReward:600,
    lootTable:[
      {itemId:'MYTHRIL_BLADE',chance:0.15, quantity:[1,1]},
      {itemId:'TEMPLAR_PLATE', chance:0.20, quantity:[1,1]},
      {itemId:'POWER_STONE',  chance:0.20, quantity:[1,1]},
    ],
    requiredGuildRank:'C', isRepeatable:true,
    narratives:{
      success:["Stone trolls don't feel pain, but they feel fire. With that established, they're gone.",
               "Two trolls, one bridge, no survivors — on the troll side. Trade can resume."],
      failure:["Stone troll regeneration is no joke. The party ran out of fire and ran out of luck."],
    },
  },
  C_002: {
    id:'C_002', rank:'C', title:'Cursed Forest',
    description:"A dark curse has twisted the Ashwood. Adventurers have gone missing inside.",
    environment: { name: "The Ashwood", icon: '🌳', mood: 'haunted' },
    enemies: ['Corrupted Treant', 'Shadow Stalker', 'Corrupted Dryad'],
    duration:40, difficulty:4.0, recommendedPower:300,
    goldReward:{min:700,max:1100}, expReward:{min:250,max:400}, rankPointReward:800,
    lootTable:[
      {itemId:'MYTHRIL_BLADE', chance:0.18, quantity:[1,1]},
      {itemId:'SHADOW_EDGE',   chance:0.12, quantity:[1,1]},
      {itemId:'STORMREND_BOW', chance:0.12, quantity:[1,1]},
      {itemId:'MYTHRIL_PLATE',chance:0.12,quantity:[1,1]},
      {itemId:'FOCUS_ORB',     chance:0.15, quantity:[1,1]},
    ],
    requiredGuildRank:'C', isRepeatable:false,
    narratives:{
      success:["The source was a corrupted dryad, twisted by old magic. She is at peace now.",
               "Three missing adventurers found and rescued. The curse is broken."],
      failure:["The forest's curse disoriented the party. They barely found their way out, empty-handed."],
    },
  },
  B_001: {
    id:'B_001', rank:'B', title:"Dragon's Foothold",
    description:"A young wyvern has claimed the mountain pass and is terrorizing caravans. Slay it.",
    environment: { name: "Stormcrest Pass", icon: '⛰', mood: 'mountain' },
    enemies: ['Mountain Drake', 'Wyvern Hatchling', 'Young Wyvern'],
    duration:45, difficulty:6.0, recommendedPower:500,
    goldReward:{min:1500,max:2500}, expReward:{min:500,max:800}, rankPointReward:1500,
    lootTable:[
      {itemId:'MYTHRIL_PLATE',chance:0.20,quantity:[1,1]},
      {itemId:'MYTHRIL_BLADE', chance:0.20, quantity:[1,1]},
    ],
    requiredGuildRank:'B', isRepeatable:true,
    narratives:{
      success:["A young wyvern — just a whelp, as dragons go — but terrifying all the same. The pass is open.",
               "The beast breathed fire, bit, clawed, and poisoned. The party answered with steel."],
      failure:["Wyvern venom is no joke. Two members incapacitated before the party could close distance."],
    },
  },
  A_001: {
    id:'A_001', rank:'A', title:'Demon Gate Incursion',
    description:"A dimensional rift has opened in the eastern wastes. Seal it before demons flood through.",
    environment: { name: "Eastern Wastes Rift", icon: '🌀', mood: 'demonic' },
    enemies: ['Lesser Demon', 'Hellfire Imp', 'Demon Commander'],
    duration:50, difficulty:10.0, recommendedPower:900,
    goldReward:{min:5000,max:8000}, expReward:{min:1200,max:2000}, rankPointReward:3500,
    lootTable:[
      {itemId:'MYTHRIL_BLADE', chance:0.30, quantity:[1,1]},
      {itemId:'MYTHRIL_PLATE',chance:0.30,quantity:[1,1]},
    ],
    requiredGuildRank:'A', isRepeatable:true,
    narratives:{
      success:["The gate is sealed. The demon lord on the other side looked surprised, then very, very small.",
               "Three hours of relentless fighting. The rift is closed. The eastern wastes are quiet."],
      failure:["The demon horde overwhelmed even the party's best efforts. The guild has sent for reinforcements."],
    },
  },
  S_001: {
    id:'S_001', rank:'S', title:'The Demon King',
    description:"The Demon King stirs in the Obsidian Citadel. This is the quest that legends are made of.",
    environment: { name: "Obsidian Citadel", icon: '🏯', mood: 'demonic' },
    enemies: ['Demon Elite Guard', 'Arch-Demon', 'The Demon King'],
    duration:60, difficulty:18.0, recommendedPower:1800,
    goldReward:{min:20000,max:30000}, expReward:{min:5000,max:8000}, rankPointReward:10000,
    lootTable:[],
    requiredGuildRank:'S', isRepeatable:true,
    narratives:{
      success:["The Demon King fell. The prophecy is fulfilled. You are no longer just adventurers — you are legends.",
               "Eight hours. Every trick, every skill, every ounce of strength. Victory. The world is saved."],
      failure:["The Demon King cannot be beaten by force alone. The party retreated to rethink their approach."],
    },
  },
};

export function getQuest(questId) {
  return QUESTS[questId] || null;
}

export function rankIndex(rank) {
  return RANK_ORDER.indexOf(rank);
}
