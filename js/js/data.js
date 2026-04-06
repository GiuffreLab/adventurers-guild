// ── Rank Order ────────────────────────────────────────────────────────────────
export const RANK_ORDER = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

// ── Classes ───────────────────────────────────────────────────────────────────
export const CLASSES = {
  HERO: {
    id: 'HERO', label: 'Hero', sigil: 'H',
    description: 'Balanced warrior. High versatility, great all-rounder.',
    baseStats: { maxHp: 120, atk: 12, def: 8, spd: 8, mag: 2, lck: 6 },
    growthRates: { maxHp: 18, atk: 2.5, def: 1.5, spd: 1.2, mag: 0.3, lck: 0.8 },
    recruitCost: null, unlockRank: null,
  },
  KNIGHT: {
    id: 'KNIGHT', label: 'Knight', sigil: 'K',
    description: 'Iron wall. Massive HP and defense.',
    baseStats: { maxHp: 160, atk: 10, def: 16, spd: 5, mag: 0, lck: 4 },
    growthRates: { maxHp: 28, atk: 1.8, def: 3.0, spd: 0.6, mag: 0.0, lck: 0.5 },
    recruitCost: 120, unlockRank: 'F',
  },
  MAGE: {
    id: 'MAGE', label: 'Mage', sigil: 'M',
    description: 'Glass cannon. Devastating magic, fragile body.',
    baseStats: { maxHp: 70, atk: 4, def: 4, spd: 7, mag: 18, lck: 5 },
    growthRates: { maxHp: 10, atk: 0.5, def: 0.6, spd: 1.0, mag: 3.5, lck: 0.7 },
    recruitCost: 150, unlockRank: 'F',
  },
  ROGUE: {
    id: 'ROGUE', label: 'Rogue', sigil: 'R',
    description: 'Swift trickster. High speed and luck.',
    baseStats: { maxHp: 90, atk: 14, def: 6, spd: 16, mag: 1, lck: 14 },
    growthRates: { maxHp: 12, atk: 2.2, def: 0.8, spd: 2.8, mag: 0.2, lck: 2.5 },
    recruitCost: 130, unlockRank: 'F',
  },
  CLERIC: {
    id: 'CLERIC', label: 'Cleric', sigil: 'C',
    description: 'Holy healer. Bolsters the party with support magic.',
    baseStats: { maxHp: 100, atk: 6, def: 10, spd: 6, mag: 12, lck: 8 },
    growthRates: { maxHp: 15, atk: 0.8, def: 1.8, spd: 0.9, mag: 2.0, lck: 1.2 },
    recruitCost: 140, unlockRank: 'F',
  },
  RANGER: {
    id: 'RANGER', label: 'Ranger', sigil: 'A',
    description: 'Skilled archer. Excels in wilderness quests.',
    baseStats: { maxHp: 95, atk: 15, def: 7, spd: 13, mag: 3, lck: 10 },
    growthRates: { maxHp: 13, atk: 2.8, def: 1.0, spd: 2.0, mag: 0.5, lck: 1.8 },
    recruitCost: 220, unlockRank: 'E',
  },
  BARD: {
    id: 'BARD', label: 'Bard', sigil: 'B',
    description: 'Silver-tongued performer. Boosts party luck and speed.',
    baseStats: { maxHp: 85, atk: 8, def: 7, spd: 12, mag: 10, lck: 18 },
    growthRates: { maxHp: 11, atk: 1.2, def: 1.0, spd: 1.8, mag: 1.5, lck: 3.2 },
    recruitCost: 400, unlockRank: 'C',
  },
  MONK: {
    id: 'MONK', label: 'Monk', sigil: 'O',
    description: 'Martial arts master. Perfectly balanced, grows quickly.',
    baseStats: { maxHp: 110, atk: 13, def: 13, spd: 13, mag: 5, lck: 9 },
    growthRates: { maxHp: 16, atk: 2.2, def: 2.2, spd: 2.2, mag: 0.8, lck: 1.5 },
    recruitCost: 800, unlockRank: 'A',
  },
};

// ── Names ─────────────────────────────────────────────────────────────────────
export const NAMES = {
  first: ['Kael','Mira','Torben','Yuki','Aldric','Seraphine','Daxon','Lyra','Gareth','Nessa',
          'Bram','Isolde','Caden','Vex','Oryn','Thea','Ravik','Sable','Fenrick','Aela',
          'Zori','Hadley','Meryn','Colt','Tavish','Wren','Edric','Calyx','Petra','Oswin',
          'Brynn','Lucan','Sylva','Dorin','Kerris','Ash','Tomas','Ilwen','Corvus','Sona'],
  last:  ['Ironwood','Ashvale','Stormborn','Coldwell','Brightblade','Duskwood','Fernholt',
          'Greymoor','Holloway','Ironclad','Lightfoot','Mossgrove','Nighthollow','Oakhearth',
          'Quicksilver','Ravenwood','Swiftarrow','Thornwall','Underhill','Westmark'],
};

// ── Item Rarity ──────────────────────────────────────────────────────────────
// Rarity tiers affect item name color across all UI
export const ITEM_RARITIES = {
  common:    { id: 'common',    label: 'Common',    color: '#9a9aaa' },
  magic:     { id: 'magic',     label: 'Magic',     color: '#3498db' },
  rare:      { id: 'rare',      label: 'Rare',      color: '#f0c060' },
  epic:      { id: 'epic',      label: 'Epic',      color: '#9b59b6' },
  legendary: { id: 'legendary', label: 'Legendary', color: '#e74c3c' },
};

// ── Equipment ─────────────────────────────────────────────────────────────────
// slot: weapon | armor | accessory | offhand
// tier: 1=F, 2=E, 3=D, 4=C
// classReq: array of class IDs that can equip (null = any class)
// rarity: common | magic | rare | epic | legendary
// Special flags:
//   twoHanded: true — blocks offhand slot when equipped
//   dagger: true — Rogues can dual-wield in weapon + offhand
//   claw: true — Monks can dual-wield in weapon + offhand
//
// Armor classes:    Plate → Hero, Knight  |  Chain → Ranger, Rogue  |  Leather → Monk  |  Robes → Mage, Cleric, Bard
// Weapon loadouts:  Hero → 1h sword+shield or 2h sword  |  Knight → 1h sword+shield
//                   Rogue → dual daggers  |  Ranger → dual swords or bow (2h)
//                   Monk → claws (dual) or quarterstaff (2h)  |  Mage → staff+orb  |  Cleric → staff+shield or orb
export const EQUIPMENT = {
  // ── 1h Swords (Hero, Knight, Ranger) ─────────────────────────────────────
  WORN_SWORD:       { id:'WORN_SWORD',       name:'Worn Sword',        slot:'weapon',    tier:1, rarity:'common',    classReq:['HERO','KNIGHT','RANGER'],    statBonus:{atk:3},              sellPrice:5,   buyPrice:20,  shopMinRank:'F', desc:'A dull blade with a wrapped hilt.' },
  IRON_SWORD:       { id:'IRON_SWORD',       name:'Iron Sword',        slot:'weapon',    tier:2, rarity:'magic',     classReq:['HERO','KNIGHT','RANGER'],    statBonus:{atk:8,spd:1},        sellPrice:30,  buyPrice:80,  shopMinRank:'E', desc:'A well-balanced iron blade.' },
  STEEL_SWORD:      { id:'STEEL_SWORD',      name:'Steel Sword',       slot:'weapon',    tier:3, rarity:'rare',      classReq:['HERO','KNIGHT','RANGER'],    statBonus:{atk:16,def:2},       sellPrice:80,  buyPrice:200, shopMinRank:'D', desc:'A finely-crafted steel longsword.' },
  MYTHRIL_BLADE:    { id:'MYTHRIL_BLADE',    name:'Mythril Blade',     slot:'weapon',    tier:4, rarity:'legendary', classReq:['HERO','KNIGHT','RANGER'],    statBonus:{atk:28,spd:5},       sellPrice:200, buyPrice:500, shopMinRank:'C', desc:'Lightweight mythril, sharp as starlight.', grantedSkill:'STARLIGHT_SLASH' },

  // ── 2h Swords (Hero only) ────────────────────────────────────────────────
  IRON_GREATSWORD:  { id:'IRON_GREATSWORD',  name:'Iron Greatsword',   slot:'weapon',    tier:2, rarity:'magic',     classReq:['HERO'],                      statBonus:{atk:14},             sellPrice:40,  buyPrice:100, shopMinRank:'E', twoHanded:true, desc:'A hefty two-handed blade. Requires both hands.' },
  STEEL_GREATSWORD: { id:'STEEL_GREATSWORD', name:'Steel Greatsword',  slot:'weapon',    tier:3, rarity:'rare',      classReq:['HERO'],                      statBonus:{atk:26,def:3},       sellPrice:100, buyPrice:250, shopMinRank:'D', twoHanded:true, desc:'A masterwork greatsword with devastating reach.' },
  FLAMBERGE:        { id:'FLAMBERGE',        name:'Flamberge',         slot:'weapon',    tier:4, rarity:'legendary', classReq:['HERO'],                      statBonus:{atk:38,spd:3},       sellPrice:250, buyPrice:600, shopMinRank:'C', twoHanded:true, desc:'A wave-bladed greatsword that cuts through armor like butter.', grantedSkill:'CLEAVING_STRIKE' },

  // ── Daggers (Rogue) — dual-wield in weapon + offhand ─────────────────────
  RUSTY_DAGGER:     { id:'RUSTY_DAGGER',     name:'Rusty Dagger',      slot:'weapon',    tier:1, rarity:'common',    classReq:['ROGUE'],                     statBonus:{atk:2,spd:3},        sellPrice:4,   buyPrice:15,  shopMinRank:'F', dagger:true, desc:'A short blade, pitted with rust. Can be dual-wielded.' },
  STEEL_DAGGER:     { id:'STEEL_DAGGER',     name:'Steel Dagger',      slot:'weapon',    tier:2, rarity:'magic',     classReq:['ROGUE'],                     statBonus:{atk:6,spd:4,lck:2},  sellPrice:25,  buyPrice:70,  shopMinRank:'E', dagger:true, desc:'A slender blade, quick to draw. Can be dual-wielded.' },
  VENOM_FANG:       { id:'VENOM_FANG',       name:'Venom Fang',        slot:'weapon',    tier:3, rarity:'rare',      classReq:['ROGUE'],                     statBonus:{atk:14,spd:6,lck:4}, sellPrice:95,  buyPrice:230, shopMinRank:'D', dagger:true, desc:'A curved dagger that weeps poison. Can be dual-wielded.', grantedSkill:'POISON_BLADE' },
  SHADOW_EDGE:      { id:'SHADOW_EDGE',      name:'Shadow Edge',       slot:'weapon',    tier:4, rarity:'legendary', classReq:['ROGUE'],                     statBonus:{atk:22,spd:10,lck:6},sellPrice:220, buyPrice:550, shopMinRank:'C', dagger:true, desc:'A blade forged from condensed darkness. Can be dual-wielded.', grantedSkill:'DUAL_THRUST' },

  // ── Claws (Monk) — dual-wield in weapon + offhand ────────────────────────
  IRON_CLAW:        { id:'IRON_CLAW',        name:'Iron Claw',         slot:'weapon',    tier:1, rarity:'common',    classReq:['MONK'],                      statBonus:{atk:3,spd:2},        sellPrice:6,   buyPrice:22,  shopMinRank:'F', claw:true, desc:'A set of iron finger blades. Can be dual-wielded.' },
  STEEL_CLAW:       { id:'STEEL_CLAW',       name:'Steel Claw',        slot:'weapon',    tier:2, rarity:'magic',     classReq:['MONK'],                      statBonus:{atk:8,spd:4},        sellPrice:30,  buyPrice:85,  shopMinRank:'E', claw:true, desc:'Razor-sharp steel talons. Can be dual-wielded.' },
  TIGER_FANG:       { id:'TIGER_FANG',       name:'Tiger Fang',        slot:'weapon',    tier:3, rarity:'rare',      classReq:['MONK'],                      statBonus:{atk:16,spd:6,def:3}, sellPrice:100, buyPrice:240, shopMinRank:'D', claw:true, desc:'Claws forged in the likeness of a great tiger. Can be dual-wielded.', grantedSkill:'TIGER_STRIKE' },
  DRAGON_CLAW:      { id:'DRAGON_CLAW',      name:'Dragon Claw',       slot:'weapon',    tier:4, rarity:'legendary', classReq:['MONK'],                      statBonus:{atk:24,spd:8,def:5}, sellPrice:230, buyPrice:560, shopMinRank:'C', claw:true, desc:'Claws imbued with draconic ki. Can be dual-wielded.', grantedSkill:'DRAGON_FIST' },

  // ── Quarterstaves (Monk) — 2h ────────────────────────────────────────────
  OAK_STAFF:        { id:'OAK_STAFF',        name:'Oak Quarterstaff',  slot:'weapon',    tier:1, rarity:'common',    classReq:['MONK'],                      statBonus:{atk:4,def:2},        sellPrice:5,   buyPrice:18,  shopMinRank:'F', twoHanded:true, desc:'A sturdy oak staff. Requires both hands.' },
  IRONWOOD_STAFF:   { id:'IRONWOOD_STAFF',   name:'Ironwood Staff',    slot:'weapon',    tier:2, rarity:'magic',     classReq:['MONK'],                      statBonus:{atk:10,def:5,spd:2}, sellPrice:35,  buyPrice:90,  shopMinRank:'E', twoHanded:true, desc:'Dense ironwood that hits like a mace. Requires both hands.' },
  JADE_BO:          { id:'JADE_BO',          name:'Jade Bo Staff',     slot:'weapon',    tier:3, rarity:'epic',      classReq:['MONK'],                      statBonus:{atk:18,def:8,spd:4}, sellPrice:110, buyPrice:270, shopMinRank:'D', twoHanded:true, desc:'A jade-inlaid staff that channels inner ki.', grantedSkill:'WHIRLWIND_STRIKE' },
  CELESTIAL_BO:     { id:'CELESTIAL_BO',     name:'Celestial Bo',      slot:'weapon',    tier:4, rarity:'legendary', classReq:['MONK'],                      statBonus:{atk:30,def:12,spd:6},sellPrice:260, buyPrice:620, shopMinRank:'C', twoHanded:true, desc:'A staff blessed by the heavens, strikes with thunderous force.', grantedSkill:'HEAVENLY_PALM' },

  // ── Bows (Ranger) — 2h ───────────────────────────────────────────────────
  HUNTING_BOW:      { id:'HUNTING_BOW',      name:'Hunting Bow',       slot:'weapon',    tier:1, rarity:'common',    classReq:['RANGER'],                    statBonus:{atk:5,spd:3},        sellPrice:10,  buyPrice:30,  shopMinRank:'F', twoHanded:true, desc:'A simple recurve bow. Requires both hands.' },
  LONGBOW:          { id:'LONGBOW',          name:'Longbow',           slot:'weapon',    tier:2, rarity:'magic',     classReq:['RANGER'],                    statBonus:{atk:11,spd:3,lck:2}, sellPrice:40,  buyPrice:95,  shopMinRank:'E', twoHanded:true, desc:'A yew longbow with impressive range. Requires both hands.' },
  GALEWIND_BOW:     { id:'GALEWIND_BOW',     name:'Galewind Bow',      slot:'weapon',    tier:3, rarity:'epic',      classReq:['RANGER'],                    statBonus:{atk:18,spd:7,lck:3}, sellPrice:105, buyPrice:260, shopMinRank:'D', twoHanded:true, desc:'Arrows ride the wind itself. Requires both hands.', grantedSkill:'WIND_SHOT' },
  STORMREND_BOW:    { id:'STORMREND_BOW',    name:'Stormrend Bow',     slot:'weapon',    tier:4, rarity:'legendary', classReq:['RANGER'],                    statBonus:{atk:26,spd:10,lck:5},sellPrice:240, buyPrice:580, shopMinRank:'C', twoHanded:true, desc:'Arrows crackle with lightning. Requires both hands.', grantedSkill:'STORM_VOLLEY' },

  // ── Staves (Mage, Cleric) ────────────────────────────────────────────────
  APPRENTICE_STAFF: { id:'APPRENTICE_STAFF', name:'Apprentice Staff',  slot:'weapon',    tier:1, rarity:'common',    classReq:['MAGE','CLERIC','BARD'],      statBonus:{mag:6},              sellPrice:8,   buyPrice:25,  shopMinRank:'F', desc:'A gnarled staff channeling minor magic.' },
  MAGE_STAFF:       { id:'MAGE_STAFF',       name:'Mage Staff',        slot:'weapon',    tier:2, rarity:'magic',     classReq:['MAGE','CLERIC'],             statBonus:{mag:14,spd:2},       sellPrice:35,  buyPrice:90,  shopMinRank:'E', desc:'A staff humming with arcane energy.' },
  CRYSTAL_STAFF:    { id:'CRYSTAL_STAFF',    name:'Crystal Staff',     slot:'weapon',    tier:3, rarity:'epic',      classReq:['MAGE'],                      statBonus:{mag:22,lck:3},       sellPrice:90,  buyPrice:220, shopMinRank:'D', desc:'A staff topped with a pulsing crystal.', grantedSkill:'MANA_OVERLOAD' },
  DIVINE_STAFF:     { id:'DIVINE_STAFF',     name:'Divine Staff',      slot:'weapon',    tier:3, rarity:'epic',      classReq:['CLERIC'],                    statBonus:{mag:18,def:4,maxHp:15},sellPrice:95,buyPrice:230, shopMinRank:'D', desc:'A staff radiating holy light.', grantedSkill:'DIVINE_GRACE' },
  ARCHMAGE_STAFF:   { id:'ARCHMAGE_STAFF',   name:'Archmage Staff',    slot:'weapon',    tier:4, rarity:'legendary', classReq:['MAGE'],                      statBonus:{mag:32,spd:4,lck:4}, sellPrice:260, buyPrice:620, shopMinRank:'C', desc:'A staff of unimaginable power, crackling with raw mana.', grantedSkill:'MANA_OVERLOAD' },
  STAFF_OF_DAWN:    { id:'STAFF_OF_DAWN',    name:'Staff of Dawn',     slot:'weapon',    tier:4, rarity:'legendary', classReq:['CLERIC'],                    statBonus:{mag:24,def:8,maxHp:30},sellPrice:250,buyPrice:600,shopMinRank:'C', desc:'A golden staff blessed at the first sunrise.', grantedSkill:'DIVINE_GRACE' },

  // ── Plate Armor (Hero, Knight) ───────────────────────────────────────────
  IRON_PLATE:       { id:'IRON_PLATE',       name:'Iron Plate',        slot:'armor',     tier:1, rarity:'common',    classReq:['HERO','KNIGHT'],             statBonus:{def:6,maxHp:10},     sellPrice:10,  buyPrice:30,  shopMinRank:'F', desc:'Heavy iron plate offering solid protection.' },
  STEEL_PLATE:      { id:'STEEL_PLATE',      name:'Steel Plate',       slot:'armor',     tier:2, rarity:'magic',     classReq:['HERO','KNIGHT'],             statBonus:{def:14,maxHp:25},    sellPrice:50,  buyPrice:120, shopMinRank:'E', desc:'Reinforced steel plate, a knight\'s pride.' },
  TEMPLAR_PLATE:    { id:'TEMPLAR_PLATE',    name:'Templar Plate',     slot:'armor',     tier:3, rarity:'rare',      classReq:['HERO','KNIGHT'],             statBonus:{def:22,maxHp:40},    sellPrice:120, buyPrice:280, shopMinRank:'D', desc:'Heavy plate blessed by the order of templars.' },
  MYTHRIL_PLATE:    { id:'MYTHRIL_PLATE',    name:'Mythril Plate',     slot:'armor',     tier:4, rarity:'legendary', classReq:['HERO','KNIGHT'],             statBonus:{def:32,maxHp:60,spd:3},sellPrice:280,buyPrice:650,shopMinRank:'C', desc:'Full mythril plate — light as cloth, hard as diamond.', grantedSkill:'MYTHRIL_BARRIER' },

  // ── Chain Armor (Ranger, Rogue) ──────────────────────────────────────────
  CHAINMAIL:        { id:'CHAINMAIL',        name:'Chainmail',         slot:'armor',     tier:1, rarity:'common',    classReq:['RANGER','ROGUE'],            statBonus:{def:4,spd:1},        sellPrice:8,   buyPrice:25,  shopMinRank:'F', desc:'Interlocked rings that stop a blade.' },
  STEEL_CHAIN:      { id:'STEEL_CHAIN',      name:'Steel Chainmail',   slot:'armor',     tier:2, rarity:'magic',     classReq:['RANGER','ROGUE'],            statBonus:{def:10,spd:2,maxHp:10},sellPrice:40,buyPrice:100, shopMinRank:'E', desc:'Finely woven steel rings, flexible yet tough.' },
  SHADOW_CHAIN:     { id:'SHADOW_CHAIN',     name:'Shadow Chainmail',  slot:'armor',     tier:3, rarity:'epic',      classReq:['RANGER','ROGUE'],            statBonus:{def:14,spd:6,lck:5}, sellPrice:110, buyPrice:270, shopMinRank:'D', desc:'Dark-treated chain that blurs in shadow.', grantedSkill:'VANISH' },
  MYTHRIL_CHAIN:    { id:'MYTHRIL_CHAIN',    name:'Mythril Chain',     slot:'armor',     tier:4, rarity:'legendary', classReq:['RANGER','ROGUE'],            statBonus:{def:20,spd:8,lck:4,maxHp:20},sellPrice:250,buyPrice:600,shopMinRank:'C', desc:'Mythril chain — silent as the night, tough as steel.' },

  // ── Leather Armor (Monk) ─────────────────────────────────────────────────
  LEATHER_VEST:     { id:'LEATHER_VEST',     name:'Leather Vest',      slot:'armor',     tier:1, rarity:'common',    classReq:['MONK'],                      statBonus:{def:3,spd:2},        sellPrice:8,   buyPrice:22,  shopMinRank:'F', desc:'Supple leather allowing full range of motion.' },
  HARDENED_LEATHER: { id:'HARDENED_LEATHER', name:'Hardened Leather',  slot:'armor',     tier:2, rarity:'magic',     classReq:['MONK'],                      statBonus:{def:8,spd:4,maxHp:10},sellPrice:38, buyPrice:95,  shopMinRank:'E', desc:'Boiled leather hardened to deflect blows.' },
  TIGER_HIDE:       { id:'TIGER_HIDE',       name:'Tiger Hide Armor',  slot:'armor',     tier:3, rarity:'rare',      classReq:['MONK'],                      statBonus:{def:14,spd:6,atk:4}, sellPrice:105, buyPrice:260, shopMinRank:'D', desc:'Treated tiger hide imbued with feral grace.' },
  DRAGON_GI:        { id:'DRAGON_GI',        name:'Dragon Gi',         slot:'armor',     tier:4, rarity:'legendary', classReq:['MONK'],                      statBonus:{def:20,spd:10,atk:6,maxHp:25},sellPrice:260,buyPrice:620,shopMinRank:'C', desc:'A gi woven from dragon sinew, channeling inner power.', grantedSkill:'KI_BARRIER' },

  // ── Robes (Mage, Cleric, Bard) ───────────────────────────────────────────
  CLOTH_ROBES:      { id:'CLOTH_ROBES',      name:'Cloth Robes',       slot:'armor',     tier:1, rarity:'common',    classReq:['MAGE','CLERIC','BARD'],      statBonus:{mag:3,def:1},        sellPrice:6,   buyPrice:20,  shopMinRank:'F', desc:'Simple robes attuned to magic flow.' },
  MAGE_ROBES:       { id:'MAGE_ROBES',       name:'Mage Robes',        slot:'armor',     tier:2, rarity:'magic',     classReq:['MAGE','CLERIC','BARD'],      statBonus:{mag:8,def:3,spd:2},  sellPrice:35,  buyPrice:90,  shopMinRank:'E', desc:'Enchanted robes that amplify spellcasting.' },
  ARCANE_VESTMENTS: { id:'ARCANE_VESTMENTS', name:'Arcane Vestments',  slot:'armor',     tier:3, rarity:'epic',      classReq:['MAGE','CLERIC','BARD'],      statBonus:{mag:14,def:5,spd:3,maxHp:15},sellPrice:100,buyPrice:250,shopMinRank:'D', desc:'Vestments threaded with arcane sigils.' },
  CELESTIAL_ROBES:  { id:'CELESTIAL_ROBES',  name:'Celestial Robes',   slot:'armor',     tier:4, rarity:'legendary', classReq:['MAGE','CLERIC','BARD'],      statBonus:{mag:22,def:8,spd:4,maxHp:25},sellPrice:260,buyPrice:620,shopMinRank:'C', desc:'Robes woven from starlight, humming with cosmic power.', grantedSkill:'CELESTIAL_WARD' },

  // ── Accessories ───────────────────────────────────────────────────────────
  LUCKY_CHARM:      { id:'LUCKY_CHARM',      name:'Lucky Charm',       slot:'accessory', tier:1, rarity:'common',    classReq:null,                          statBonus:{lck:5},              sellPrice:12,  buyPrice:35,  shopMinRank:'F', desc:"A rabbit's foot. Questionably lucky." },
  SWIFT_RING:       { id:'SWIFT_RING',       name:'Swift Ring',        slot:'accessory', tier:2, rarity:'magic',     classReq:null,                          statBonus:{spd:6},              sellPrice:30,  buyPrice:80,  shopMinRank:'E', desc:'An enchanted band that quickens the wearer.' },
  VITALITY_AMULET:  { id:'VITALITY_AMULET',  name:'Vitality Amulet',   slot:'accessory', tier:2, rarity:'magic',     classReq:null,                          statBonus:{maxHp:30},           sellPrice:35,  buyPrice:90,  shopMinRank:'E', desc:'A warm gem pulsing with life energy.' },
  POWER_STONE:      { id:'POWER_STONE',      name:'Power Stone',       slot:'accessory', tier:3, rarity:'epic',      classReq:null,                          statBonus:{atk:8,mag:8},        sellPrice:90,  buyPrice:220, shopMinRank:'D', desc:'A crackling stone of raw magical power.', grantedSkill:'POWER_SURGE' },

  // ── Shields (Hero, Knight, Cleric) ────────────────────────────────────────
  WOODEN_SHIELD:    { id:'WOODEN_SHIELD',    name:'Wooden Shield',     slot:'offhand',   tier:1, rarity:'common',    classReq:['HERO','KNIGHT','CLERIC'],    statBonus:{def:5,maxHp:10},     sellPrice:6,   buyPrice:18,  shopMinRank:'F', desc:'A simple round shield bound with iron.' },
  IRON_SHIELD:      { id:'IRON_SHIELD',      name:'Iron Shield',       slot:'offhand',   tier:2, rarity:'rare',      classReq:['HERO','KNIGHT','CLERIC'],    statBonus:{def:12,maxHp:20},    sellPrice:40,  buyPrice:100, shopMinRank:'E', desc:'A heavy iron shield bearing a guild crest.' },
  TOWER_SHIELD:     { id:'TOWER_SHIELD',     name:'Tower Shield',      slot:'offhand',   tier:3, rarity:'epic',      classReq:['KNIGHT'],                    statBonus:{def:20,maxHp:35},    sellPrice:110, buyPrice:270, shopMinRank:'D', desc:'A massive shield that can cover the entire body.' },
  MYTHRIL_SHIELD:   { id:'MYTHRIL_SHIELD',   name:'Mythril Shield',    slot:'offhand',   tier:4, rarity:'legendary', classReq:['HERO','KNIGHT'],             statBonus:{def:18,maxHp:30,spd:3},sellPrice:240,buyPrice:580,shopMinRank:'C', desc:'A mythril shield, impossibly light and indestructible.', grantedSkill:'DIVINE_GUARD' },

  // ── Orbs (Mage, Cleric) ──────────────────────────────────────────────────
  FOCUS_ORB:        { id:'FOCUS_ORB',        name:'Focus Orb',         slot:'offhand',   tier:1, rarity:'common',    classReq:['MAGE','CLERIC','BARD'],      statBonus:{mag:4,lck:1},        sellPrice:8,   buyPrice:22,  shopMinRank:'F', desc:'A simple crystal orb that aids concentration.' },
  CRYSTAL_ORB:      { id:'CRYSTAL_ORB',      name:'Crystal Orb',       slot:'offhand',   tier:2, rarity:'magic',     classReq:['MAGE','CLERIC','BARD'],      statBonus:{mag:10,lck:3},       sellPrice:40,  buyPrice:100, shopMinRank:'E', desc:'A polished orb swirling with inner light.', grantedSkill:'ARCANE_RESONANCE' },
  VOID_ORB:         { id:'VOID_ORB',         name:'Void Orb',          slot:'offhand',   tier:3, rarity:'epic',      classReq:['MAGE'],                      statBonus:{mag:16,lck:4,spd:2}, sellPrice:110, buyPrice:270, shopMinRank:'D', desc:'An orb of pure darkness that amplifies destructive magic.' },
  HOLY_ORB:         { id:'HOLY_ORB',         name:'Holy Orb',          slot:'offhand',   tier:3, rarity:'epic',      classReq:['CLERIC'],                    statBonus:{mag:12,def:4,maxHp:20},sellPrice:105,buyPrice:260,shopMinRank:'D', desc:'An orb radiating divine warmth.' },
  ORB_OF_ETERNITY:  { id:'ORB_OF_ETERNITY',  name:'Orb of Eternity',   slot:'offhand',   tier:4, rarity:'legendary', classReq:['MAGE','CLERIC'],             statBonus:{mag:20,lck:6,spd:3}, sellPrice:260, buyPrice:620, shopMinRank:'C', desc:'An ancient orb pulsing with infinite magical potential.', grantedSkill:'ARCANE_RESONANCE' },
};

// Loot-only items (drop from quests, sell for gold)
export const LOOT_ITEMS = {
  SLIME_JELLY:   { id:'SLIME_JELLY',   name:'Slime Jelly',      sellPrice:3,   desc:'Gooey residue from a defeated slime.' },
  WOLF_PELT:     { id:'WOLF_PELT',     name:'Wolf Pelt',        sellPrice:8,   desc:'A coarse but valuable pelt.' },
  GOBLIN_EAR:    { id:'GOBLIN_EAR',    name:'Goblin Ear',       sellPrice:5,   desc:'Proof of a slain goblin. The guild pays bounties.' },
  SKELETON_BONE: { id:'SKELETON_BONE', name:'Skeleton Bone',    sellPrice:6,   desc:'A suspiciously articulated bone fragment.' },
  BANDIT_MASK:   { id:'BANDIT_MASK',   name:'Bandit Mask',      sellPrice:15,  desc:'Stripped from a defeated outlaw.' },
  OGRE_TOOTH:    { id:'OGRE_TOOTH',    name:"Ogre's Tooth",     sellPrice:25,  desc:'A fang the size of your forearm.' },
  MANA_CRYSTAL:  { id:'MANA_CRYSTAL',  name:'Mana Crystal',     sellPrice:40,  desc:'A small crystal dense with magical potential.' },
  DRAGON_SCALE:  { id:'DRAGON_SCALE',  name:'Dragon Scale',     sellPrice:200, desc:'An iridescent scale harder than steel.' },
};

// ── Quests ────────────────────────────────────────────────────────────────────
export const QUESTS = {
  F_001: {
    id:'F_001', rank:'F', title:'Slime Extermination',
    description:"Clear the slimes from Farmer Dobbs' field before the harvest.",
    environment: { name: "Dobbs' Farmland", icon: '🌾', mood: 'pastoral' },
    enemies: ['Slime', 'Green Slime', 'Slime King'],
    duration:15, difficulty:0.5, recommendedPower:15,
    goldReward:{min:10,max:25}, expReward:{min:12,max:20}, rankPointReward:50,
    lootTable:[
      {itemId:'SLIME_JELLY',   chance:0.70, quantity:[1,3]},
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
    goldReward:{min:15,max:30}, expReward:{min:15,max:25}, rankPointReward:60,
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
    goldReward:{min:30,max:50}, expReward:{min:20,max:35}, rankPointReward:100,
    lootTable:[
      {itemId:'GOBLIN_EAR',  chance:0.40, quantity:[1,3]},
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
    goldReward:{min:50,max:90}, expReward:{min:35,max:55}, rankPointReward:180,
    lootTable:[
      {itemId:'GOBLIN_EAR',  chance:0.80, quantity:[3,8]},
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
    goldReward:{min:70,max:120}, expReward:{min:40,max:65}, rankPointReward:220,
    lootTable:[
      {itemId:'WOLF_PELT',   chance:0.90, quantity:[2,5]},
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
    goldReward:{min:90,max:140}, expReward:{min:50,max:80}, rankPointReward:280,
    lootTable:[
      {itemId:'SKELETON_BONE',chance:0.70, quantity:[2,5]},
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
    goldReward:{min:200,max:350}, expReward:{min:100,max:160}, rankPointReward:550,
    lootTable:[
      {itemId:'SKELETON_BONE',chance:0.60, quantity:[3,7]},
      {itemId:'STEEL_SWORD',  chance:0.20, quantity:[1,1]},
      {itemId:'TEMPLAR_PLATE', chance:0.18, quantity:[1,1]},
      {itemId:'POWER_STONE',  chance:0.12, quantity:[1,1]},
      {itemId:'MANA_CRYSTAL', chance:0.30, quantity:[1,2]},
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
    goldReward:{min:280,max:450}, expReward:{min:120,max:190}, rankPointReward:700,
    lootTable:[
      {itemId:'BANDIT_MASK',  chance:0.90, quantity:[2,4]},
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
    goldReward:{min:500,max:800}, expReward:{min:200,max:320}, rankPointReward:1200,
    lootTable:[
      {itemId:'OGRE_TOOTH',   chance:0.50, quantity:[1,2]},
      {itemId:'MYTHRIL_BLADE',chance:0.15, quantity:[1,1]},
      {itemId:'TEMPLAR_PLATE', chance:0.20, quantity:[1,1]},
      {itemId:'POWER_STONE',  chance:0.20, quantity:[1,1]},
      {itemId:'MANA_CRYSTAL', chance:0.40, quantity:[2,4]},
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
    goldReward:{min:700,max:1100}, expReward:{min:250,max:400}, rankPointReward:1600,
    lootTable:[
      {itemId:'MANA_CRYSTAL',  chance:0.60, quantity:[2,5]},
      {itemId:'MYTHRIL_BLADE', chance:0.18, quantity:[1,1]},
      {itemId:'SHADOW_EDGE',   chance:0.12, quantity:[1,1]},
      {itemId:'GALEWIND_BOW',  chance:0.12, quantity:[1,1]},
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
    goldReward:{min:1500,max:2500}, expReward:{min:500,max:800}, rankPointReward:3000,
    lootTable:[
      {itemId:'DRAGON_SCALE',  chance:0.80, quantity:[1,3]},
      {itemId:'MYTHRIL_PLATE',chance:0.20,quantity:[1,1]},
      {itemId:'MYTHRIL_BLADE', chance:0.20, quantity:[1,1]},
      {itemId:'MANA_CRYSTAL',  chance:0.70, quantity:[3,6]},
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
    goldReward:{min:5000,max:8000}, expReward:{min:1200,max:2000}, rankPointReward:7000,
    lootTable:[
      {itemId:'DRAGON_SCALE',  chance:0.60, quantity:[2,5]},
      {itemId:'MANA_CRYSTAL',  chance:0.90, quantity:[5,10]},
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
    goldReward:{min:20000,max:30000}, expReward:{min:5000,max:8000}, rankPointReward:20000,
    lootTable:[
      {itemId:'DRAGON_SCALE',  chance:1.0, quantity:[5,10]},
      {itemId:'MANA_CRYSTAL',  chance:1.0, quantity:[10,20]},
    ],
    requiredGuildRank:'S', isRepeatable:true,
    narratives:{
      success:["The Demon King fell. The prophecy is fulfilled. You are no longer just adventurers — you are legends.",
               "Eight hours. Every trick, every skill, every ounce of strength. Victory. The world is saved."],
      failure:["The Demon King cannot be beaten by force alone. The party retreated to rethink their approach."],
    },
  },
};

// ── Helper functions ───────────────────────────────────────────────────────────

export function getItem(itemId) {
  return EQUIPMENT[itemId] || LOOT_ITEMS[itemId] || null;
}

export function canClassEquip(classId, item) {
  if (!item || !item.classReq) return true;  // null = any class
  return item.classReq.includes(classId);
}

export function getItemRarity(item) {
  if (!item) return ITEM_RARITIES.common;
  return ITEM_RARITIES[item.rarity] || ITEM_RARITIES.common;
}

export function getClass(classId) {
  return CLASSES[classId] || CLASSES.HERO;
}

export function getQuest(questId) {
  return QUESTS[questId] || null;
}

export function computeBaseStats(classId, level) {
  const def = getClass(classId);
  const stats = {};
  for (const [key, base] of Object.entries(def.baseStats)) {
    stats[key] = Math.floor(base + def.growthRates[key] * (level - 1));
  }
  stats.hp = stats.maxHp;
  return stats;
}

export function randomName() {
  const first = NAMES.first[Math.floor(Math.random() * NAMES.first.length)];
  const last  = NAMES.last[Math.floor(Math.random() * NAMES.last.length)];
  return `${first} ${last}`;
}

export function getAvailableClasses(guildRank) {
  const ri = RANK_ORDER.indexOf(guildRank);
  return Object.values(CLASSES).filter(c => c.unlockRank && RANK_ORDER.indexOf(c.unlockRank) <= ri);
}

export function rankIndex(rank) {
  return RANK_ORDER.indexOf(rank);
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
