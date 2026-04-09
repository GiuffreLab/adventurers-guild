// ── Rank Order ────────────────────────────────────────────────────────────────
export const RANK_ORDER = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'S+', 'S++'];

// ── Classes ───────────────────────────────────────────────────────────────────
export const CLASSES = {
  HERO: {
    id: 'HERO', label: 'Hero', sigil: 'HRO',
    description: 'Balanced warrior. High versatility, great all-rounder.',
    baseStats: { maxHp: 120, atk: 12, def: 8, spd: 10, mag: 2, crit: 4, dodge: 3 },
    growthRates: { maxHp: 18, atk: 2.5, def: 1.5, spd: 1.5, mag: 0.3, crit: 0.5, dodge: 0.3 },
    recruitCost: null, unlockRank: null,
  },
  KNIGHT: {
    id: 'KNIGHT', label: 'Knight', sigil: 'KNT',
    description: 'Iron wall. Massive HP and defense.',
    baseStats: { maxHp: 160, atk: 10, def: 16, spd: 5, mag: 0, crit: 1, dodge: 2 },
    growthRates: { maxHp: 28, atk: 1.8, def: 3.0, spd: 0.6, mag: 0.0, crit: 0.2, dodge: 0.3 },
    recruitCost: true, unlockRank: null,
  },
  MAGE: {
    id: 'MAGE', label: 'Mage', sigil: 'MAG',
    description: 'Glass cannon. Devastating magic, fragile body.',
    baseStats: { maxHp: 70, atk: 4, def: 4, spd: 7, mag: 18, crit: 9, dodge: 2 },
    growthRates: { maxHp: 10, atk: 0.5, def: 0.6, spd: 1.0, mag: 3.5, crit: 1.6, dodge: 0.2 },
    recruitCost: true, unlockRank: null,
  },
  ROGUE: {
    id: 'ROGUE', label: 'Rogue', sigil: 'ROG',
    description: 'Swift trickster. High speed and critical strikes.',
    baseStats: { maxHp: 90, atk: 14, def: 6, spd: 16, mag: 1, crit: 10, dodge: 6 },
    growthRates: { maxHp: 12, atk: 2.2, def: 0.8, spd: 2.8, mag: 0.2, crit: 1.8, dodge: 0.8 },
    recruitCost: true, unlockRank: null,
  },
  CLERIC: {
    id: 'CLERIC', label: 'Cleric', sigil: 'CLR',
    description: 'Holy healer. Bolsters the party with support magic.',
    baseStats: { maxHp: 100, atk: 6, def: 10, spd: 6, mag: 12, crit: 2, dodge: 4 },
    growthRates: { maxHp: 15, atk: 0.8, def: 1.8, spd: 0.9, mag: 2.0, crit: 0.3, dodge: 0.6 },
    recruitCost: true, unlockRank: null,
  },
  RANGER: {
    id: 'RANGER', label: 'Ranger', sigil: 'RNG',
    description: 'Skilled archer. Excels in precision and wilderness quests.',
    baseStats: { maxHp: 95, atk: 15, def: 7, spd: 13, mag: 3, crit: 8, dodge: 3 },
    growthRates: { maxHp: 13, atk: 2.8, def: 1.0, spd: 2.0, mag: 0.5, crit: 1.4, dodge: 0.4 },
    recruitCost: true, unlockRank: null,
  },
  BARD: {
    id: 'BARD', label: 'Bard', sigil: 'BRD',
    description: 'Silver-tongued performer. Nimble with sharp instincts.',
    baseStats: { maxHp: 85, atk: 8, def: 7, spd: 12, mag: 10, crit: 6, dodge: 10 },
    growthRates: { maxHp: 11, atk: 1.2, def: 1.0, spd: 1.8, mag: 1.5, crit: 1.0, dodge: 2.0 },
    recruitCost: true, unlockRank: null,
  },
  MONK: {
    id: 'MONK', label: 'Monk', sigil: 'MNK',
    description: 'Martial arts master. Perfectly balanced, highly evasive.',
    baseStats: { maxHp: 110, atk: 13, def: 13, spd: 13, mag: 5, crit: 4, dodge: 7 },
    growthRates: { maxHp: 16, atk: 2.2, def: 2.2, spd: 2.2, mag: 0.8, crit: 0.8, dodge: 1.2 },
    recruitCost: true, unlockRank: null,
  },
  NECROMANCER: {
    id: 'NECROMANCER', label: 'Necromancer', sigil: 'NEC',
    description: 'Hybrid summoner and drain caster. Raises the fallen as thralls and corrodes the living.',
    baseStats: { maxHp: 80, atk: 5, def: 5, spd: 9, mag: 16, crit: 7, dodge: 4 },
    growthRates: { maxHp: 11, atk: 0.6, def: 0.8, spd: 1.3, mag: 3.0, crit: 1.2, dodge: 0.5 },
    recruitCost: true, unlockRank: null,
  },
};

// ── Names ─────────────────────────────────────────────────────────────────────
export const NAMES = {
  // ── Shared first names (all classes draw from here, no repeats in active party) ──
  first: [
    'Kael','Mira','Torben','Yuki','Aldric','Seraphine','Daxon','Lyra','Gareth','Nessa',
    'Bram','Isolde','Caden','Vex','Oryn','Thea','Ravik','Sable','Fenrick','Aela',
    'Zori','Hadley','Meryn','Colt','Tavish','Wren','Edric','Calyx','Petra','Oswin',
    'Brynn','Lucan','Sylva','Dorin','Kerris','Ash','Tomas','Ilwen','Corvus','Sona',
    'Riven','Elara','Jorik','Fiora','Thane','Lina','Bastien','Neve','Caelum','Suri',
    'Rowan','Asha','Darian','Freya','Halden','Maren','Orin','Sage','Caius','Zia',
    'Lennox','Elowen','Holt','Vesper','Idris','Rhea','Caspian','Ember','Quillan','Nyx',
    'Cedric','Yara','Bran','Selene','Darrow','Lux','Tristan','Ivy','Magnus','Rune',
    'Soren','Jael','Leif','Kira','Theron','Maia','Cyrus','Gwynn','Torin','Liora',
  ],
  // ── Class-themed surname pools ──
  last: {
    HERO: [
      'Brightblade','Dawnstrider','Valorheart','Oathkeeper','Trueguard','Lionmane',
      'Goldcrest','Glorysword','Shieldborn','Stormheart','Ironvow','Crownwell',
      'Bravemark','Dawnforge','Proudhelm','Embervow','Steelhart','Gallantry',
      'Sundershield','Highcrest',
    ],
    KNIGHT: [
      'Ironwall','Stonecroft','Steelhold','Bulwark','Shieldrest','Hammerfall',
      'Greyfort','Rampart','Ironclad','Thornwall','Stonehelm','Bastionridge',
      'Coldwell','Holdfast','Wardstone','Anvilcrest','Dreadfort','Titanhold',
      'Wallguard','Siegeborn',
    ],
    MAGE: [
      'Starweave','Spellforge','Arcwright','Mysthaven','Runeglow','Crystalvane',
      'Flamecrest','Stormpeak','Frostwhisper','Voidwalker','Astralmark','Emberglow',
      'Moonscribe','Nethervane','Riftborn','Spellwick','Glyphward','Skyfire',
      'Aethersong','Dawnmantle',
    ],
    ROGUE: [
      'Shadowveil','Nighthollow','Quicksilver','Silentblade','Duskmantle','Blindside',
      'Knifewood','Ashvale','Darkwyn','Swiftfoot','Mistwalker','Hollowgrave',
      'Greymoor','Shadeborn','Vipercross','Ghostwalk','Shroudvane','Blackthorn',
      'Fadewell','Whisperwind',
    ],
    CLERIC: [
      'Lightward','Hollowell','Sunblest','Dawnpray','Gracewell','Faithhold',
      'Gentleheart','Solacemere','Brightveil','Stillwater','Ashworth','Chapelgard',
      'Mercythorn','Hallowed','Peacebinder','Verdanthart','Oakhearth','Silvergrace',
      'Mossgrove','Goldenleaf',
    ],
    RANGER: [
      'Swiftarrow','Deepwood','Hawkridge','Fernholt','Windrunner','Briarmark',
      'Greenthorn','Wolfsbane','Pathfinder','Wildmere','Trailforge','Eaglecrest',
      'Thornbrush','Longstride','Deerhollow','Ravenstrack','Underhill','Stormbow',
      'Barkhide','Highglen',
    ],
    BARD: [
      'Songweaver','Lyreheart','Goldentongue','Merryvale','Chordwyn','Bellsong',
      'Silverlute','Brightverse','Wandersong','Talespinner','Meadshire','Revelstoke',
      'Jinglemark','Moonsong','Balladeer','Harmoncroft','Rhythmvale','Echowell',
      'Strumhallow','Jesterfield',
    ],
    MONK: [
      'Ironpalm','Stillpeak','Stonefist','Cloudstep','Ashwind','Calmwater',
      'Thunderstrike','Jadecrest','Peakwalker','Silentgale','Ridgemonk','Emberfist',
      'Swifthand','Cranefall','Zenith','Templeborn','Gravelbane','Mistpeak',
      'Flareheart','Windrift',
    ],
    NECROMANCER: [
      'Gravewell','Bonehallow','Duskveil','Withermere','Ashcroft','Deathwhisper',
      'Darkhollow','Soulrend','Cryptmoor','Blight','Corpsemantle','Nightgrave',
      'Tombvane','Hollowbone','Rotfield','Plaguewind','Spiritcall','Shadowgrave',
      'Mourncrest','Grimthorn',
    ],
  },
};

// ── Item Rarity ──────────────────────────────────────────────────────────────
// Rarity tiers affect item name color across all UI
export const ITEM_RARITIES = {
  common:    { id: 'common',    label: 'Common',    color: '#9a9aaa' },
  magic:     { id: 'magic',     label: 'Magic',     color: '#3498db' },
  rare:      { id: 'rare',      label: 'Rare',      color: '#f0c060' },
  epic:      { id: 'epic',      label: 'Epic',      color: '#9b59b6' },
  legendary: { id: 'legendary', label: 'Legendary', color: '#e74c3c' },
  celestial: { id: 'celestial', label: 'Celestial', color: '#00e5c8' },
};

// ── Equipment ─────────────────────────────────────────────────────────────────
// slot: weapon | armor | accessory | offhand
// tier: 1=F, 2=E, 3=D, 4=C, 5=B
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
  // === SWORDS ===
  WORN_SWORD: {
    id: 'WORN_SWORD',
    name: 'Worn Sword',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 4 },
    sellPrice: 6,
    buyPrice: 20,
    shopMinRank: 'F',
    desc: 'A well-used blade, dull but serviceable.'
  },
  IRON_SWORD: {
    id: 'IRON_SWORD',
    name: 'Iron Sword',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 11, spd: 2, crit: 1, dodge: 1 },
    sellPrice: 32,
    buyPrice: 85,
    shopMinRank: 'E',
    desc: 'A reliable iron blade with a keen edge.'
  },
  STEEL_SWORD: {
    id: 'STEEL_SWORD',
    name: 'Steel Sword',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 19, spd: 4, crit: 4, dodge: 1, def: 2 },
    sellPrice: 95,
    buyPrice: 240,
    shopMinRank: 'D',
    desc: 'Forged from fine steel, this blade strikes true.'
  },
  MYTHRIL_BLADE: {
    id: 'MYTHRIL_BLADE',
    name: 'Mythril Blade',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 30, spd: 7, crit: 8, dodge: 3, def: 4, maxHp: 15 },
    sellPrice: 240,
    buyPrice: 600,
    shopMinRank: 'C',
    grantedSkill: 'STARLIGHT_SLASH',
    desc: 'A legendary sword gleaming with ethereal light and unmatched sharpness.'
  },
  EXCALIBUR: {
    id: 'EXCALIBUR',
    name: 'Excalibur',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 45, spd: 12, crit: 13, dodge: 4, def: 6, maxHp: 25 },
    sellPrice: 850,
    buyPrice: 2200,
    shopMinRank: 'B',
    grantedSkill: 'RADIANT_STRIKE',
    desc: 'The legendary blade of kings, inscribed with ancient runes of power.'
  },

  // === SWORDS (DEFENSIVE TRACK) ===
  RUSTY_BROADSWORD: {
    id: 'RUSTY_BROADSWORD',
    name: 'Rusty Broadsword',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 2, def: 2 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'A broad blade corroded with age, still sturdy enough to protect.'
  },
  IRON_BROADSWORD: {
    id: 'IRON_BROADSWORD',
    name: 'Iron Broadsword',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 8, def: 4, maxHp: 12 },
    sellPrice: 28,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'A sturdy iron blade favored by defensive warriors.'
  },
  STEEL_BROADSWORD: {
    id: 'STEEL_BROADSWORD',
    name: 'Steel Broadsword',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 14, def: 8, maxHp: 18 },
    sellPrice: 92,
    buyPrice: 230,
    shopMinRank: 'D',
    desc: 'A sturdy blade favored for its balanced protection.'
  },
  GUARDIAN_BLADE: {
    id: 'GUARDIAN_BLADE',
    name: 'Guardian Blade',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 28, def: 12, maxHp: 30, crit: 3 },
    sellPrice: 245,
    buyPrice: 610,
    shopMinRank: 'C',
    grantedSkill: 'GUARDIAN_SLASH',
    desc: 'A balanced blade that protects as well as it strikes.'
  },
  OATHKEEPER: {
    id: 'OATHKEEPER',
    name: 'Oathkeeper',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO', 'KNIGHT', 'RANGER'],
    statBonus: { atk: 38, def: 18, maxHp: 45, crit: 8 },
    sellPrice: 860,
    buyPrice: 2150,
    shopMinRank: 'B',
    grantedSkill: 'DIVINE_OATH',
    desc: 'A sacred blade that protects those who wield it with honor.'
  },

  // === 2-HANDED SWORDS (Hero only — Hero trades shield for raw power) ===
  BLUNT_SHIV: {
    id: 'BLUNT_SHIV',
    name: 'Rusty Greatsword',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['HERO'],
    statBonus: { atk: 8, def: 2, maxHp: 3 },
    sellPrice: 5,
    buyPrice: 16,
    shopMinRank: 'F',
    twoHanded: true,
    desc: 'A heavy, rust-pitted greatsword that requires both hands to swing.'
  },
  IRON_GREATSWORD: {
    id: 'IRON_GREATSWORD',
    name: 'Iron Greatsword',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['HERO'],
    statBonus: { atk: 18, spd: 4, crit: 3, def: 4, maxHp: 8 },
    sellPrice: 38,
    buyPrice: 95,
    shopMinRank: 'E',
    twoHanded: true,
    desc: 'A mighty iron sword that requires both hands.'
  },
  STEEL_GREATSWORD: {
    id: 'STEEL_GREATSWORD',
    name: 'Steel Greatsword',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['HERO'],
    statBonus: { atk: 34, spd: 7, crit: 8, def: 8, maxHp: 15 },
    sellPrice: 98,
    buyPrice: 245,
    shopMinRank: 'D',
    twoHanded: true,
    desc: 'A masterwork greatsword with devastating reach.'
  },
  FLAMBERGE: {
    id: 'FLAMBERGE',
    name: 'Flamberge',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['HERO'],
    statBonus: { atk: 55, spd: 12, crit: 18, dodge: 4, def: 16, maxHp: 36 },
    sellPrice: 255,
    buyPrice: 630,
    shopMinRank: 'C',
    twoHanded: true,
    grantedSkill: 'BULWARK_CLEAVE',
    desc: 'A wave-bladed greatsword that cuts through armor like butter.'
  },
  RAGNAROK: {
    id: 'RAGNAROK',
    name: 'Ragnarok',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO'],
    statBonus: { atk: 85, spd: 22, crit: 30, dodge: 8, def: 24, maxHp: 57 },
    sellPrice: 900,
    buyPrice: 2250,
    shopMinRank: 'B',
    twoHanded: true,
    grantedSkill: 'WORLD_CLEAVE',
    desc: 'The sword of the apocalypse, prophesied to split the world.'
  },

  // === FLAILS (Knight offensive 1H — pairs with shield) ===
  RUSTY_FLAIL: {
    id: 'RUSTY_FLAIL',
    name: 'Rusty Flail',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['KNIGHT'],
    statBonus: { atk: 4, def: 1 },
    sellPrice: 5,
    buyPrice: 16,
    shopMinRank: 'F',
    desc: 'A crude iron ball on a chain, unwieldy but punishing.'
  },
  IRON_FLAIL: {
    id: 'IRON_FLAIL',
    name: 'Iron Flail',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['KNIGHT'],
    statBonus: { atk: 12, def: 3, maxHp: 8 },
    sellPrice: 36,
    buyPrice: 90,
    shopMinRank: 'E',
    desc: 'A sturdy iron flail that strikes with crushing force.'
  },
  STEEL_FLAIL: {
    id: 'STEEL_FLAIL',
    name: 'Steel Flail',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['KNIGHT'],
    statBonus: { atk: 20, def: 5, maxHp: 12, crit: 2 },
    sellPrice: 95,
    buyPrice: 240,
    shopMinRank: 'D',
    desc: 'A well-crafted steel flail with devastating impact.'
  },
  TEMPLARS_FLAIL: {
    id: 'TEMPLARS_FLAIL',
    name: "Templar's Flail",
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['KNIGHT'],
    statBonus: { atk: 34, def: 8, maxHp: 20, crit: 4, spd: 3 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    grantedSkill: 'HOLY_SMITE',
    desc: 'A holy warrior\'s flail, blessed to smite the unrighteous.'
  },
  JUDGEMENT: {
    id: 'JUDGEMENT',
    name: 'Judgement',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['KNIGHT'],
    statBonus: { atk: 48, def: 12, maxHp: 30, crit: 8, spd: 5 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    grantedSkill: 'DIVINE_JUDGEMENT',
    desc: 'The legendary flail of divine judgement, feared by all who oppose the light.'
  },

  // === MACES (Knight defensive 1H — pairs with shield) ===
  WOODEN_MACE: {
    id: 'WOODEN_MACE',
    name: 'Wooden Mace',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['KNIGHT'],
    statBonus: { atk: 2, def: 3 },
    sellPrice: 5,
    buyPrice: 16,
    shopMinRank: 'F',
    desc: 'A simple club reinforced with iron bands, favored by watchmen.'
  },
  IRON_MACE: {
    id: 'IRON_MACE',
    name: 'Iron Mace',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['KNIGHT'],
    statBonus: { atk: 8, def: 6, maxHp: 15 },
    sellPrice: 36,
    buyPrice: 90,
    shopMinRank: 'E',
    desc: 'A solid iron mace favored by temple guardians.'
  },
  STEEL_MACE: {
    id: 'STEEL_MACE',
    name: 'Steel Mace',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['KNIGHT'],
    statBonus: { atk: 14, def: 10, maxHp: 22, crit: 1, dodge: 1 },
    sellPrice: 95,
    buyPrice: 240,
    shopMinRank: 'D',
    desc: 'A heavy steel mace that punishes any who challenge its wielder.'
  },
  BLESSED_MACE: {
    id: 'BLESSED_MACE',
    name: 'Blessed Mace',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['KNIGHT'],
    statBonus: { atk: 24, def: 14, maxHp: 35, crit: 5, dodge: 2 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    grantedSkill: 'GUARDIAN_AURA',
    desc: 'A mace anointed with holy oils, radiating protective light.'
  },
  SANCTUM_HAMMER: {
    id: 'SANCTUM_HAMMER',
    name: 'Sanctum Hammer',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['KNIGHT'],
    statBonus: { atk: 36, def: 20, maxHp: 50, crit: 9, dodge: 4 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    grantedSkill: 'SANCTUM_BARRIER',
    desc: 'The sacred hammer of the high temple, an unbreakable bastion of faith.'
  },

  // === DAGGERS ===
  RUSTY_DAGGER: {
    id: 'RUSTY_DAGGER',
    name: 'Rusty Dagger',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['ROGUE'],
    statBonus: { atk: 2, spd: 3, crit: 1, dodge: 1 },
    sellPrice: 4,
    buyPrice: 15,
    shopMinRank: 'F',
    dagger: true,
    desc: 'A short blade, pitted with rust. Can be dual-wielded.'
  },
  STEEL_DAGGER: {
    id: 'STEEL_DAGGER',
    name: 'Steel Dagger',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['ROGUE'],
    statBonus: { atk: 6, spd: 4, crit: 1, dodge: 1 },
    sellPrice: 25,
    buyPrice: 70,
    shopMinRank: 'E',
    dagger: true,
    desc: 'A slender blade, quick to draw. Can be dual-wielded.'
  },
  VENOM_FANG: {
    id: 'VENOM_FANG',
    name: 'Venom Fang',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['ROGUE'],
    statBonus: { atk: 14, spd: 6, crit: 2, dodge: 2, def: 1 },
    sellPrice: 95,
    buyPrice: 230,
    shopMinRank: 'D',
    dagger: true,
    grantedSkill: 'VENOM_STRIKE',
    desc: 'A curved dagger that weeps poison. Can be dual-wielded.'
  },
  SHADOW_EDGE: {
    id: 'SHADOW_EDGE',
    name: 'Shadow Edge',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['ROGUE'],
    statBonus: { atk: 22, spd: 10, crit: 9, dodge: 6 },
    sellPrice: 220,
    buyPrice: 550,
    shopMinRank: 'C',
    dagger: true,
    grantedSkill: 'EVASIVE_STRIKE',
    desc: 'A blade forged from condensed darkness. Can be dual-wielded.'
  },
  DEATHS_WHISPER: {
    id: 'DEATHS_WHISPER',
    name: "Death's Whisper",
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['ROGUE'],
    statBonus: { atk: 35, spd: 16, crit: 22, dodge: 15, dodgeChance: 0.15 },
    sellPrice: 870,
    buyPrice: 2180,
    shopMinRank: 'B',
    dagger: true,
    grantedSkill: 'ASSASSINATION',
    desc: 'A dagger whispered to by death itself. Instant kill attempts.'
  },

  // === CLAWS ===
  WRAPPED_FIST: {
    id: 'WRAPPED_FIST',
    name: 'Wrapped Fist',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['MONK'],
    statBonus: { atk: 2, spd: 2, def: 1 },
    sellPrice: 4,
    buyPrice: 14,
    shopMinRank: 'F',
    claw: true,
    desc: 'Cloth wrappings reinforced with leather. Can be dual-wielded.'
  },
  IRON_CLAW: {
    id: 'IRON_CLAW',
    name: 'Iron Claw',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['MONK'],
    statBonus: { atk: 8, spd: 3, def: 2 },
    sellPrice: 28,
    buyPrice: 75,
    shopMinRank: 'E',
    claw: true,
    desc: 'Iron finger blades that extend from leather wrappings. Can be dual-wielded.'
  },
  STEEL_CLAW: {
    id: 'STEEL_CLAW',
    name: 'Steel Claw',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['MONK'],
    statBonus: { atk: 16, spd: 6, def: 3, dodge: 2 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    claw: true,
    desc: 'Razor-sharp steel talons forged with precision. Can be dual-wielded.'
  },
  DRAGON_CLAW: {
    id: 'DRAGON_CLAW',
    name: 'Dragon Claw',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['MONK'],
    statBonus: { atk: 28, spd: 10, def: 6, crit: 5, maxHp: 15 },
    sellPrice: 240,
    buyPrice: 600,
    shopMinRank: 'C',
    claw: true,
    grantedSkill: 'IRON_BODY',
    desc: 'Claws imbued with draconic ki. Can be dual-wielded.'
  },
  ASURA_CLAW: {
    id: 'ASURA_CLAW',
    name: 'Asura Claw',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MONK'],
    statBonus: { atk: 45, spd: 18, def: 10, crit: 15, maxHp: 25 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    claw: true,
    grantedSkill: 'ASURA_FURY',
    desc: 'Legendary claws that channel the fury of a thousand demons.'
  },

  // === QUARTERSTAVES ===
  BAMBOO_STAFF: {
    id: 'BAMBOO_STAFF',
    name: 'Bamboo Staff',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['MONK'],
    statBonus: { atk: 5, def: 2, spd: 2, maxHp: 1 },
    sellPrice: 5,
    buyPrice: 16,
    shopMinRank: 'F',
    twoHanded: true,
    desc: 'A simple bamboo staff. Requires both hands.'
  },
  OAK_STAFF: {
    id: 'OAK_STAFF',
    name: 'Oak Quarterstaff',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['MONK'],
    statBonus: { atk: 10, def: 5, spd: 2, maxHp: 10 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    twoHanded: true,
    desc: 'A sturdy oak staff that packs a solid punch. Requires both hands.'
  },
  HARDWOOD_BO: {
    id: 'HARDWOOD_BO',
    name: 'Hardwood Bo',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['MONK'],
    statBonus: { atk: 22, def: 10, spd: 7, dodge: 2, maxHp: 13 },
    sellPrice: 105,
    buyPrice: 260,
    shopMinRank: 'D',
    twoHanded: true,
    desc: 'A dense hardwood bo staff with excellent balance.'
  },
  CELESTIAL_BO: {
    id: 'CELESTIAL_BO',
    name: 'Celestial Bo',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['MONK'],
    statBonus: { atk: 44, def: 20, spd: 16, crit: 12, dodge: 6, maxHp: 30 },
    sellPrice: 260,
    buyPrice: 650,
    shopMinRank: 'C',
    twoHanded: true,
    grantedSkill: 'MOUNTAIN_STANCE',
    desc: 'A staff blessed by the heavens with celestial energy.'
  },
  RUYI_JINGU: {
    id: 'RUYI_JINGU',
    name: "Ruyi Jingu Bang",
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MONK'],
    statBonus: { atk: 72, def: 28, spd: 28, crit: 24, dodge: 14, maxHp: 60 },
    sellPrice: 890,
    buyPrice: 2220,
    shopMinRank: 'B',
    twoHanded: true,
    grantedSkill: 'MONKEY_KING',
    desc: 'The legendary staff of the Monkey King, weightless yet devastating.'
  },

  // === BOWS ===
  SHORT_BOW: {
    id: 'SHORT_BOW',
    name: 'Short Bow',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['RANGER'],
    statBonus: { atk: 4, spd: 2, crit: 1 },
    sellPrice: 6,
    buyPrice: 20,
    shopMinRank: 'F',
    desc: 'A simple bow good for beginners. Requires both hands.'
  },
  HUNTING_BOW: {
    id: 'HUNTING_BOW',
    name: 'Hunting Bow',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['RANGER'],
    statBonus: { atk: 11, spd: 4, crit: 2, def: 1 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: 'A reliable bow favored by hunters. Requires both hands.'
  },
  COMPOSITE_BOW: {
    id: 'COMPOSITE_BOW',
    name: 'Composite Bow',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['RANGER'],
    statBonus: { atk: 18, spd: 7, crit: 3, def: 2 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'A composite bow with excellent draw weight distribution.'
  },
  STORMREND_BOW: {
    id: 'STORMREND_BOW',
    name: 'Stormrend Bow',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['RANGER'],
    statBonus: { atk: 32, spd: 12, crit: 11, maxHp: 10 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    grantedSkill: 'NATURE_WARD',
    desc: 'A bow that crackles with storm energy.'
  },
  ARTEMIS_BOW: {
    id: 'ARTEMIS_BOW',
    name: 'Artemis Bow',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['RANGER'],
    statBonus: { atk: 48, spd: 18, crit: 24, maxHp: 20 },
    sellPrice: 875,
    buyPrice: 2190,
    shopMinRank: 'B',
    grantedSkill: 'CELESTIAL_VOLLEY',
    desc: 'The bow of the goddess of the hunt, never misses.'
  },

  // === STAVES ===
  WILLOW_WAND: {
    id: 'WILLOW_WAND',
    name: 'Willow Wand',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['MAGE', 'CLERIC'],
    statBonus: { mag: 4, spd: 1 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'A simple wand of willow wood for basic spellcasting.'
  },
  APPRENTICE_STAFF: {
    id: 'APPRENTICE_STAFF',
    name: 'Apprentice Staff',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['MAGE', 'CLERIC'],
    statBonus: { mag: 10, spd: 2, def: 1 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'An apprentice mage staff, humble but functional.'
  },
  MAGE_STAFF: {
    id: 'MAGE_STAFF',
    name: 'Mage Staff',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['MAGE', 'CLERIC'],
    statBonus: { mag: 18, spd: 4, def: 2, crit: 1, dodge: 1 },
    sellPrice: 98,
    buyPrice: 245,
    shopMinRank: 'D',
    desc: 'A staff humming with arcane energy and power.'
  },
  ARCHMAGE_STAFF: {
    id: 'ARCHMAGE_STAFF',
    name: 'Archmage Staff',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['MAGE'],
    statBonus: { mag: 32, spd: 8, crit: 8, dodge: 3, maxHp: 15 },
    sellPrice: 260,
    buyPrice: 650,
    shopMinRank: 'C',
    grantedSkill: 'ARCANE_CATACLYSM_EQ',
    desc: 'A staff of immense power, crackling with raw mana.'
  },
  STAFF_OF_AGES: {
    id: 'STAFF_OF_AGES',
    name: 'Staff of Ages',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MAGE'],
    statBonus: { mag: 50, spd: 14, crit: 15, dodge: 5, maxHp: 25 },
    sellPrice: 895,
    buyPrice: 2240,
    shopMinRank: 'B',
    grantedSkill: 'WORLD_BLESSING',
    desc: 'An ancient staff that has channeled spells for millennia.'
  },

  // === DIVINE STAVES ===
  BLESSED_STAFF: {
    id: 'BLESSED_STAFF',
    name: 'Blessed Staff',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['CLERIC'],
    statBonus: { mag: 10, def: 3, maxHp: 15 },
    sellPrice: 33,
    buyPrice: 82,
    shopMinRank: 'E',
    desc: 'A staff blessed by the church, radiating holy power.'
  },
  CRYSTAL_STAFF: {
    id: 'CRYSTAL_STAFF',
    name: 'Crystal Staff',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['MAGE', 'CLERIC'],
    statBonus: { mag: 20, def: 3, crit: 2, dodge: 1, maxHp: 12 },
    sellPrice: 105,
    buyPrice: 260,
    shopMinRank: 'D',
    desc: 'A staff topped with a pulsing crystal of great power.'
  },
  DIVINE_STAFF: {
    id: 'DIVINE_STAFF',
    name: 'Divine Staff',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['CLERIC'],
    statBonus: { mag: 28, def: 7, maxHp: 30, crit: 5 },
    sellPrice: 245,
    buyPrice: 610,
    shopMinRank: 'C',
    grantedSkill: 'DIVINE_GRACE_EQ',
    desc: 'A staff radiating divine light and holy power.'
  },
  STAFF_OF_DAWN: {
    id: 'STAFF_OF_DAWN',
    name: 'Staff of Dawn',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['CLERIC'],
    statBonus: { mag: 42, def: 14, maxHp: 50, crit: 10 },
    sellPrice: 860,
    buyPrice: 2150,
    shopMinRank: 'B',
    grantedSkill: 'WORLD_BLESSING',
    desc: 'A golden staff blessed at the first sunrise of creation.'
  },

  // === INSTRUMENTS ===
  WORN_LUTE: {
    id: 'WORN_LUTE',
    name: 'Worn Lute',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['BARD'],
    statBonus: { mag: 6, spd: 3, crit: 1, dodge: 2, def: 1 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    twoHanded: true,
    desc: 'An old lute still capable of beautiful music.'
  },
  SILVER_LUTE: {
    id: 'SILVER_LUTE',
    name: 'Silver Lute',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['BARD'],
    statBonus: { mag: 20, spd: 8, crit: 4, dodge: 5, def: 2, maxHp: 2 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    twoHanded: true,
    desc: 'A silver lute that sings with magical resonance.'
  },
  ENCHANTED_LUTE: {
    id: 'ENCHANTED_LUTE',
    name: 'Enchanted Lute',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['BARD'],
    statBonus: { mag: 34, spd: 14, crit: 5, dodge: 8, def: 4, maxHp: 4 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    twoHanded: true,
    desc: 'A lute enchanted with powerful bardic magic.'
  },
  SIREN_HARP: {
    id: 'SIREN_HARP',
    name: 'Siren Harp',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['BARD'],
    statBonus: { mag: 52, spd: 20, crit: 10, dodge: 16, def: 4, maxHp: 20 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    twoHanded: true,
    grantedSkill: 'SIREN_SONG',
    desc: 'A harp that captivates with siren-like melodies.'
  },
  ORPHEUS_LYRE: {
    id: 'ORPHEUS_LYRE',
    name: 'Orpheus Lyre',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['BARD'],
    statBonus: { mag: 82, spd: 32, crit: 18, dodge: 30, def: 8, maxHp: 34 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    twoHanded: true,
    grantedSkill: 'ORPHIC_HYMN',
    desc: 'The legendary lyre of Orpheus, compelling as death itself.'
  },

  // === DRUMS ===
  CRACKED_DRUM: {
    id: 'CRACKED_DRUM',
    name: 'Cracked Drum',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['BARD'],
    statBonus: { mag: 5, def: 2, crit: 1, dodge: 1 },
    sellPrice: 4,
    buyPrice: 16,
    shopMinRank: 'F',
    twoHanded: true,
    desc: 'A cracked drum still capable of thunderous beats.'
  },
  IRON_DRUM: {
    id: 'IRON_DRUM',
    name: 'Iron Drum',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['BARD'],
    statBonus: { mag: 16, def: 6, spd: 4, crit: 2, dodge: 3, maxHp: 2 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    twoHanded: true,
    desc: 'An iron drum that booms with power.'
  },
  WAR_DRUM: {
    id: 'WAR_DRUM',
    name: 'War Drum',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['BARD'],
    statBonus: { mag: 28, def: 9, spd: 7, crit: 3, dodge: 5, maxHp: 3 },
    sellPrice: 98,
    buyPrice: 245,
    shopMinRank: 'D',
    twoHanded: true,
    desc: 'A war drum that rallies allies to battle.'
  },
  THUNDERDRUM: {
    id: 'THUNDERDRUM',
    name: 'Thunderdrum',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['BARD'],
    statBonus: { mag: 46, def: 14, spd: 12, crit: 8, dodge: 12, maxHp: 6 },
    sellPrice: 255,
    buyPrice: 630,
    shopMinRank: 'C',
    twoHanded: true,
    grantedSkill: 'BATTLE_MARCH',
    desc: 'A drum that rumbles like thunder when struck.'
  },
  DRUMS_OF_ETERNITY: {
    id: 'DRUMS_OF_ETERNITY',
    name: 'Drums of Eternity',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['BARD'],
    statBonus: { mag: 72, def: 20, spd: 18, crit: 15, dodge: 22, maxHp: 16 },
    sellPrice: 875,
    buyPrice: 2190,
    shopMinRank: 'B',
    twoHanded: true,
    grantedSkill: 'ETERNAL_RHYTHM',
    desc: 'Drums that have beaten since the world began.'
  },

  // === PLATE ARMOR ===
  RUSTY_MAIL: {
    id: 'RUSTY_MAIL',
    name: 'Rusty Mail',
    slot: 'armor',
    tier: 1,
    rarity: 'common',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 4, maxHp: 8 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'Rusty plate mail that still offers basic protection.'
  },
  HEAVY_MAIL: {
    id: 'HEAVY_MAIL',
    name: 'Heavy Mail',
    slot: 'armor',
    tier: 2,
    rarity: 'magic',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 11, maxHp: 18 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'Heavy mail offering solid protection.'
  },
  IRON_PLATE: {
    id: 'IRON_PLATE',
    name: 'Iron Plate',
    slot: 'armor',
    tier: 3,
    rarity: 'rare',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 18, maxHp: 28 },
    sellPrice: 98,
    buyPrice: 245,
    shopMinRank: 'D',
    desc: 'Heavy iron plate offering solid protection.'
  },
  TEMPLAR_PLATE: {
    id: 'TEMPLAR_PLATE',
    name: 'Templar Plate',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 30, maxHp: 45, spd: 1, crit: 3 },
    sellPrice: 245,
    buyPrice: 610,
    shopMinRank: 'C',
    grantedSkill: 'TEMPLAR_MIGHT',
    desc: 'Heavy plate blessed by the order of templars.'
  },
  MYTHRIL_PLATE: {
    id: 'MYTHRIL_PLATE',
    name: 'Mythril Plate',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 48, maxHp: 70, spd: 5, crit: 8 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    grantedSkill: 'ADAMANTINE_WALL',
    desc: 'Full mythril plate — light as cloth, hard as diamond.'
  },
  ADAMANTINE_PLATE: {
    id: 'ADAMANTINE_PLATE',
    name: 'Adamantine Plate',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 50, maxHp: 75, spd: 2, crit: 5 },
    sellPrice: 900,
    buyPrice: 2250,
    shopMinRank: 'B',
    grantedSkill: 'ADAMANTINE_WALL',
    desc: 'Armor forged from the hardest metal known to mortals.'
  },
  DRAGON_PLATE: {
    id: 'DRAGON_PLATE',
    name: 'Dragon Plate',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 52, maxHp: 80, spd: 4, crit: 10, atkBonus: 0.10 },
    sellPrice: 910,
    buyPrice: 2280,
    shopMinRank: 'B',
    grantedSkill: 'DRAGON_FURY',
    desc: 'Armor crafted from the scales of ancient dragons.'
  },
  STEEL_PLATE: {
    id: 'STEEL_PLATE',
    name: 'Steel Plate',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 28, maxHp: 40, spd: 2, crit: 4 },
    sellPrice: 240,
    buyPrice: 600,
    shopMinRank: 'C',
    desc: 'Reinforced steel plate, a knight is pride.'
  },
  FORTRESS_PLATE: {
    id: 'FORTRESS_PLATE',
    name: 'Fortress Plate',
    slot: 'armor',
    tier: 3,
    rarity: 'rare',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 22, maxHp: 35, crit: 3, dodge: 2 },
    sellPrice: 105,
    buyPrice: 260,
    shopMinRank: 'D',
    desc: 'Plate armor designed for fortification and defense.'
  },

  // === CHAIN ARMOR ===
  LIGHT_CHAIN: {
    id: 'LIGHT_CHAIN',
    name: 'Light Chain',
    slot: 'armor',
    tier: 1,
    rarity: 'common',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 3, spd: 2, maxHp: 6 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'Light chainmail that allows mobility.'
  },
  PADDED_CHAIN: {
    id: 'PADDED_CHAIN',
    name: 'Padded Chain',
    slot: 'armor',
    tier: 2,
    rarity: 'magic',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 9, spd: 3, maxHp: 12, crit: 1, dodge: 1 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'Chain with padding for added comfort and mobility.'
  },
  CHAINMAIL: {
    id: 'CHAINMAIL',
    name: 'Chainmail',
    slot: 'armor',
    tier: 3,
    rarity: 'rare',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 16, spd: 5, maxHp: 18, crit: 1, dodge: 1 },
    sellPrice: 98,
    buyPrice: 245,
    shopMinRank: 'D',
    desc: 'Interlocked rings that stop a blade.'
  },
  SHADOW_CHAIN: {
    id: 'SHADOW_CHAIN',
    name: 'Shadow Chain',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 26, spd: 10, maxHp: 20, crit: 3, dodge: 5, dodgeChance: 0.10 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    grantedSkill: 'CHAIN_WARD',
    desc: 'Dark-treated chain that blurs in shadow.'
  },
  PHANTOM_CHAIN: {
    id: 'PHANTOM_CHAIN',
    name: 'Phantom Chain',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 40, spd: 18, maxHp: 30, crit: 6, dodge: 10, dodgeChance: 0.20 },
    sellPrice: 875,
    buyPrice: 2190,
    shopMinRank: 'B',
    grantedSkill: 'SHADOW_DANCE',
    desc: 'Chain that makes the wearer disappear in shadow.'
  },
  STEEL_CHAIN: {
    id: 'STEEL_CHAIN',
    name: 'Steel Chain',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 24, spd: 8, maxHp: 18, crit: 2, dodge: 2 },
    sellPrice: 245,
    buyPrice: 610,
    shopMinRank: 'C',
    desc: 'Finely woven steel rings, flexible yet tough.'
  },
  REINFORCED_CHAIN: {
    id: 'REINFORCED_CHAIN',
    name: 'Reinforced Chain',
    slot: 'armor',
    tier: 3,
    rarity: 'rare',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 18, spd: 6, maxHp: 16, crit: 2, dodge: 1 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'Chain reinforced for added durability.'
  },
  ADAMANT_CHAIN: {
    id: 'ADAMANT_CHAIN',
    name: 'Adamant Chain',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 28, spd: 9, maxHp: 22, crit: 6, dodge: 3 },
    sellPrice: 255,
    buyPrice: 640,
    shopMinRank: 'C',
    desc: 'Chain made from adamantite, incredibly durable.'
  },
  CELESTIAL_CHAIN: {
    id: 'CELESTIAL_CHAIN',
    name: 'Celestial Chain',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 42, spd: 16, maxHp: 35, crit: 15, dodge: 8 },
    sellPrice: 890,
    buyPrice: 2220,
    shopMinRank: 'B',
    grantedSkill: 'CELESTIAL_AEGIS',
    desc: 'Chain woven from the fabric of the heavens.'
  },
  MYTHRIL_CHAIN: {
    id: 'MYTHRIL_CHAIN',
    name: 'Mythril Chain',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['RANGER', 'ROGUE'],
    statBonus: { def: 38, spd: 14, maxHp: 28, crit: 12, dodge: 4 },
    sellPrice: 870,
    buyPrice: 2180,
    shopMinRank: 'B',
    grantedSkill: 'MYTHRIL_REFLEX',
    desc: 'Mythril chain — silent as the night, tough as steel.'
  },

  // === LEATHER ARMOR ===
  THIN_VEST: {
    id: 'THIN_VEST',
    name: 'Thin Vest',
    slot: 'armor',
    tier: 1,
    rarity: 'common',
    classReq: ['MONK'],
    statBonus: { def: 2, spd: 3, maxHp: 5 },
    sellPrice: 4,
    buyPrice: 14,
    shopMinRank: 'F',
    desc: 'Thin leather allowing full mobility.'
  },
  ROUGH_TUNIC: {
    id: 'ROUGH_TUNIC',
    name: 'Rough Tunic',
    slot: 'armor',
    tier: 1,
    rarity: 'common',
    classReq: ['MONK'],
    statBonus: { def: 2, spd: 2, maxHp: 6 },
    sellPrice: 5,
    buyPrice: 16,
    shopMinRank: 'F',
    desc: 'Rough leather tunic for basic protection.'
  },
  LEATHER_VEST: {
    id: 'LEATHER_VEST',
    name: 'Leather Vest',
    slot: 'armor',
    tier: 2,
    rarity: 'magic',
    classReq: ['MONK'],
    statBonus: { def: 8, spd: 5, maxHp: 12 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'Supple leather allowing full range of motion.'
  },
  HARDENED_LEATHER: {
    id: 'HARDENED_LEATHER',
    name: 'Hardened Leather',
    slot: 'armor',
    tier: 3,
    rarity: 'rare',
    classReq: ['MONK'],
    statBonus: { def: 15, spd: 7, maxHp: 18 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'Boiled leather hardened to deflect blows.'
  },
  TIGER_HIDE: {
    id: 'TIGER_HIDE',
    name: 'Tiger Hide Armor',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['MONK'],
    statBonus: { def: 26, spd: 12, atkBonus: 0.10, maxHp: 25, crit: 5 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    grantedSkill: 'TIGER_SPIRIT',
    desc: 'Treated tiger hide imbued with feral grace.'
  },
  DRAGON_GI: {
    id: 'DRAGON_GI',
    name: 'Dragon Gi',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MONK'],
    statBonus: { def: 42, spd: 18, atkBonus: 0.20, maxHp: 40, crit: 10 },
    sellPrice: 890,
    buyPrice: 2220,
    shopMinRank: 'B',
    grantedSkill: 'DRAGON_SPIRIT',
    desc: 'A gi woven from dragon sinew, channeling inner power.'
  },
  STONE_SKIN_VEST: {
    id: 'STONE_SKIN_VEST',
    name: 'Stone Skin Vest',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['MONK'],
    statBonus: { def: 28, spd: 9, maxHp: 32, crit: 4 },
    sellPrice: 255,
    buyPrice: 630,
    shopMinRank: 'C',
    grantedSkill: 'DIAMOND_SKIN',
    desc: 'Leather hardened like stone for unbreakable defense.'
  },
  NIRVANA_SHROUD: {
    id: 'NIRVANA_SHROUD',
    name: 'Nirvana Shroud',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MONK'],
    statBonus: { def: 44, spd: 16, atkBonus: 0.15, maxHp: 36, dodgeChance: 0.10 },
    sellPrice: 885,
    buyPrice: 2210,
    shopMinRank: 'B',
    grantedSkill: 'INNER_PEACE',
    desc: 'A shroud of perfect enlightenment.'
  },

  // === ROBES ===
  TATTERED_ROBES: {
    id: 'TATTERED_ROBES',
    name: 'Tattered Robes',
    slot: 'armor',
    tier: 1,
    rarity: 'common',
    classReq: ['MAGE', 'CLERIC', 'BARD', 'NECROMANCER'],
    statBonus: { mag: 3, def: 1, maxHp: 5 },
    sellPrice: 4,
    buyPrice: 14,
    shopMinRank: 'F',
    desc: 'Worn robes that still channel magic adequately.'
  },
  WOOL_ROBES: {
    id: 'WOOL_ROBES',
    name: 'Wool Robes',
    slot: 'armor',
    tier: 1,
    rarity: 'common',
    classReq: ['MAGE', 'CLERIC', 'BARD', 'NECROMANCER'],
    statBonus: { mag: 3, def: 2, maxHp: 8 },
    sellPrice: 5,
    buyPrice: 16,
    shopMinRank: 'F',
    desc: 'Warm wool robes for apprentice spellcasters.'
  },
  CLOTH_ROBES: {
    id: 'CLOTH_ROBES',
    name: 'Cloth Robes',
    slot: 'armor',
    tier: 2,
    rarity: 'magic',
    classReq: ['MAGE', 'CLERIC', 'BARD', 'NECROMANCER'],
    statBonus: { mag: 9, def: 3, spd: 1, maxHp: 12 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'Simple robes attuned to magic flow.'
  },
  BLESSED_ROBES: {
    id: 'BLESSED_ROBES',
    name: 'Blessed Robes',
    slot: 'armor',
    tier: 2,
    rarity: 'magic',
    classReq: ['CLERIC'],
    statBonus: { mag: 10, def: 4, maxHp: 18, spd: 1 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: 'Robes blessed by holy magic for divine power.'
  },
  MONKS_ROBE: {
    id: 'MONKS_ROBE',
    name: "Monk's Robe",
    slot: 'armor',
    tier: 2,
    rarity: 'magic',
    classReq: ['CLERIC', 'BARD'],
    statBonus: { mag: 9, def: 3, crit: 1, dodge: 1, maxHp: 11 },
    sellPrice: 31,
    buyPrice: 78,
    shopMinRank: 'E',
    desc: 'A monk\'s simple robe with modest magical enhancement.'
  },
  MAGE_ROBES: {
    id: 'MAGE_ROBES',
    name: 'Mage Robes',
    slot: 'armor',
    tier: 3,
    rarity: 'rare',
    classReq: ['MAGE', 'CLERIC', 'BARD', 'NECROMANCER'],
    statBonus: { mag: 16, def: 5, spd: 2, maxHp: 16, crit: 1, dodge: 1 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'Enchanted robes that amplify spellcasting.'
  },
  WARD_ROBES: {
    id: 'WARD_ROBES',
    name: 'Ward Robes',
    slot: 'armor',
    tier: 3,
    rarity: 'rare',
    classReq: ['CLERIC'],
    statBonus: { mag: 16, def: 7, maxHp: 24, crit: 1, dodge: 1 },
    sellPrice: 105,
    buyPrice: 260,
    shopMinRank: 'D',
    desc: 'Robes that amplify healing and protective spells.'
  },
  ARCANE_VESTMENTS: {
    id: 'ARCANE_VESTMENTS',
    name: 'Arcane Vestments',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['MAGE', 'CLERIC', 'BARD', 'NECROMANCER'],
    statBonus: { mag: 28, def: 8, spd: 4, maxHp: 24, crit: 5 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    grantedSkill: 'ARCANE_SURGE',
    desc: 'Vestments threaded with arcane sigils.'
  },
  SANCTIFIED_VESTMENTS: {
    id: 'SANCTIFIED_VESTMENTS',
    name: 'Sanctified Vestments',
    slot: 'armor',
    tier: 4,
    rarity: 'epic',
    classReq: ['CLERIC'],
    statBonus: { mag: 26, def: 10, maxHp: 35, crit: 6, dodge: 2 },
    sellPrice: 255,
    buyPrice: 630,
    shopMinRank: 'C',
    grantedSkill: 'DIVINE_WARD',
    desc: 'Holy vestments sanctified by divine power.'
  },
  CELESTIAL_ROBES: {
    id: 'CELESTIAL_ROBES',
    name: 'Celestial Robes',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MAGE', 'CLERIC', 'BARD', 'NECROMANCER'],
    statBonus: { mag: 44, def: 14, spd: 8, maxHp: 40, crit: 10 },
    sellPrice: 895,
    buyPrice: 2240,
    shopMinRank: 'B',
    grantedSkill: 'ETERNAL_WARD',
    desc: 'Robes woven from starlight, humming with cosmic power.'
  },
  ROBES_OF_ETERNITY: {
    id: 'ROBES_OF_ETERNITY',
    name: 'Robes of Eternity',
    slot: 'armor',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MAGE'],
    statBonus: { mag: 50, def: 12, spd: 10, maxHp: 38, crit: 17, dodge: 3 },
    sellPrice: 910,
    buyPrice: 2280,
    shopMinRank: 'B',
    grantedSkill: 'TEMPORAL_FLUX',
    desc: 'Robes that have existed since time itself.'
  },

  // === ACCESSORIES ===
  LEATHER_BAND: {
    id: 'LEATHER_BAND',
    name: 'Leather Band',
    slot: 'accessory',
    tier: 1,
    rarity: 'common',
    classReq: null,
    statBonus: { crit: 3, def: 1 },
    sellPrice: 6,
    buyPrice: 20,
    shopMinRank: 'F',
    desc: 'A simple leather band for basic luck.'
  },
  WOODEN_CHARM: {
    id: 'WOODEN_CHARM',
    name: 'Wooden Charm',
    slot: 'accessory',
    tier: 1,
    rarity: 'common',
    classReq: null,
    statBonus: { crit: 3 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'A wooden charm believed to bring luck.'
  },
  CRYSTAL_SHARD: {
    id: 'CRYSTAL_SHARD',
    name: 'Crystal Shard',
    slot: 'accessory',
    tier: 1,
    rarity: 'common',
    classReq: null,
    statBonus: { mag: 2, crit: 2 },
    sellPrice: 6,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'A shard of crystal that glimmers with magic.'
  },
  BLESSED_TOKEN: {
    id: 'BLESSED_TOKEN',
    name: 'Blessed Token',
    slot: 'accessory',
    tier: 1,
    rarity: 'common',
    classReq: null,
    statBonus: { crit: 1, dodge: 1, def: 2 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'A token blessed by the church.'
  },
  LUCKY_CHARM: {
    id: 'LUCKY_CHARM',
    name: 'Lucky Charm',
    slot: 'accessory',
    tier: 2,
    rarity: 'magic',
    classReq: null,
    statBonus: { crit: 8, spd: 2 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: "A rabbit's foot. Questionably lucky."
  },
  SWIFT_RING: {
    id: 'SWIFT_RING',
    name: 'Swift Ring',
    slot: 'accessory',
    tier: 2,
    rarity: 'magic',
    classReq: null,
    statBonus: { spd: 8, crit: 1 },
    sellPrice: 30,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: 'An enchanted band that quickens the wearer.'
  },
  VITALITY_PENDANT: {
    id: 'VITALITY_PENDANT',
    name: 'Vitality Pendant',
    slot: 'accessory',
    tier: 2,
    rarity: 'magic',
    classReq: null,
    statBonus: { maxHp: 25, def: 1 },
    sellPrice: 32,
    buyPrice: 82,
    shopMinRank: 'E',
    desc: 'A pendant pulsing with life energy.'
  },
  POWER_RING: {
    id: 'POWER_RING',
    name: 'Power Ring',
    slot: 'accessory',
    tier: 2,
    rarity: 'magic',
    classReq: null,
    statBonus: { atk: 5, mag: 1 },
    sellPrice: 30,
    buyPrice: 78,
    shopMinRank: 'E',
    desc: 'A ring that channels raw power.'
  },
  VITALITY_AMULET: {
    id: 'VITALITY_AMULET',
    name: 'Vitality Amulet',
    slot: 'accessory',
    tier: 3,
    rarity: 'rare',
    classReq: null,
    statBonus: { maxHp: 40, def: 3, crit: 2 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'A warm gem pulsing with life energy.'
  },
  MANA_RING: {
    id: 'MANA_RING',
    name: 'Mana Ring',
    slot: 'accessory',
    tier: 2,
    rarity: 'magic',
    classReq: null,
    statBonus: { mag: 8, crit: 2 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: 'A ring that channels mana.'
  },
  WARD_RING: {
    id: 'WARD_RING',
    name: 'Ward Ring',
    slot: 'accessory',
    tier: 2,
    rarity: 'magic',
    classReq: null,
    statBonus: { def: 6, maxHp: 15 },
    sellPrice: 30,
    buyPrice: 78,
    shopMinRank: 'E',
    desc: 'A ring that protects the wearer.'
  },
  POWER_STONE: {
    id: 'POWER_STONE',
    name: 'Power Stone',
    slot: 'accessory',
    tier: 3,
    rarity: 'rare',
    classReq: null,
    statBonus: { atk: 10, mag: 10, crit: 2 },
    sellPrice: 105,
    buyPrice: 260,
    shopMinRank: 'D',
    grantedSkill: 'POWER_SURGE',
    desc: 'A crackling stone of raw magical power.'
  },
  WARRIOR_PENDANT: {
    id: 'WARRIOR_PENDANT',
    name: 'Warrior Pendant',
    slot: 'accessory',
    tier: 3,
    rarity: 'rare',
    classReq: null,
    statBonus: { atk: 12, maxHp: 20, crit: 3 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'A pendant that strengthens warriors.'
  },
  ARCANE_PENDANT: {
    id: 'ARCANE_PENDANT',
    name: 'Arcane Pendant',
    slot: 'accessory',
    tier: 3,
    rarity: 'rare',
    classReq: null,
    statBonus: { mag: 14, crit: 7 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'A pendant channeling arcane power.'
  },
  HOLY_PENDANT: {
    id: 'HOLY_PENDANT',
    name: 'Holy Pendant',
    slot: 'accessory',
    tier: 3,
    rarity: 'rare',
    classReq: null,
    statBonus: { mag: 10, def: 4, maxHp: 18, crit: 1, dodge: 1 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'A pendant blessed with holy power.'
  },
  AMULET_OF_FURY: {
    id: 'AMULET_OF_FURY',
    name: 'Amulet of Fury',
    slot: 'accessory',
    tier: 5,
    rarity: 'legendary',
    classReq: null,
    statBonus: { atk: 35, crit: 15, atkBonus: 0.20 },
    sellPrice: 875,
    buyPrice: 2190,
    shopMinRank: 'B',
    grantedSkill: 'BATTLE_FURY',
    desc: 'An amulet that channels unbridled fury.'
  },
  AMULET_OF_AGES: {
    id: 'AMULET_OF_AGES',
    name: 'Amulet of Ages',
    slot: 'accessory',
    tier: 5,
    rarity: 'legendary',
    classReq: null,
    statBonus: { maxHp: 60, def: 15, crit: 8 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    grantedSkill: 'AEGIS_AURA',
    desc: 'An amulet that carries the wisdom of ages.'
  },
  AMULET_OF_ARCANA: {
    id: 'AMULET_OF_ARCANA',
    name: 'Amulet of Arcana',
    slot: 'accessory',
    tier: 5,
    rarity: 'legendary',
    classReq: null,
    statBonus: { mag: 40, crit: 18 },
    sellPrice: 885,
    buyPrice: 2210,
    shopMinRank: 'B',
    grantedSkill: 'ARCANE_OVERFLOW',
    desc: 'An amulet of pure magical power.'
  },
  AMULET_OF_GRACE: {
    id: 'AMULET_OF_GRACE',
    name: 'Amulet of Grace',
    slot: 'accessory',
    tier: 5,
    rarity: 'legendary',
    classReq: null,
    statBonus: { def: 18, mag: 20, healBonus: 0.20, maxHp: 30 },
    sellPrice: 895,
    buyPrice: 2240,
    shopMinRank: 'B',
    grantedSkill: 'GRACE_ETERNAL',
    desc: 'An amulet blessed with divine grace.'
  },
  IRON_AMULET: {
    id: 'IRON_AMULET',
    name: 'Iron Amulet',
    slot: 'accessory',
    tier: 2,
    rarity: 'magic',
    classReq: null,
    statBonus: { def: 6, maxHp: 15, atk: 2 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: 'An iron amulet that strengthens defense.'
  },

  // === SHIELDS ===
  WOODEN_BUCKLER: {
    id: 'WOODEN_BUCKLER',
    name: 'Wooden Buckler',
    slot: 'offhand',
    tier: 1,
    rarity: 'common',
    classReq: ['HERO', 'KNIGHT', 'CLERIC'],
    statBonus: { def: 3, maxHp: 6 },
    sellPrice: 4,
    buyPrice: 14,
    shopMinRank: 'F',
    desc: 'A small wooden shield for basic protection.'
  },
  WOODEN_SHIELD: {
    id: 'WOODEN_SHIELD',
    name: 'Wooden Shield',
    slot: 'offhand',
    tier: 2,
    rarity: 'magic',
    classReq: ['HERO', 'KNIGHT', 'CLERIC'],
    statBonus: { def: 8, maxHp: 14 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'A simple round shield bound with iron.'
  },
  IRON_BUCKLER: {
    id: 'IRON_BUCKLER',
    name: 'Iron Buckler',
    slot: 'offhand',
    tier: 2,
    rarity: 'magic',
    classReq: ['HERO', 'KNIGHT', 'CLERIC'],
    statBonus: { def: 9, maxHp: 16, spd: 1 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: 'A sturdy iron buckler for solid defense.'
  },
  IRON_SHIELD: {
    id: 'IRON_SHIELD',
    name: 'Iron Shield',
    slot: 'offhand',
    tier: 3,
    rarity: 'rare',
    classReq: ['HERO', 'KNIGHT', 'CLERIC'],
    statBonus: { def: 16, maxHp: 26 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    desc: 'A heavy iron shield bearing a guild crest.'
  },
  TOWER_SHIELD: {
    id: 'TOWER_SHIELD',
    name: 'Tower Shield',
    slot: 'offhand',
    tier: 4,
    rarity: 'epic',
    classReq: ['KNIGHT'],
    statBonus: { def: 28, maxHp: 42, crit: 3 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    desc: 'A massive shield that can cover the entire body.'
  },
  SPIKED_SHIELD: {
    id: 'SPIKED_SHIELD',
    name: 'Spiked Shield',
    slot: 'offhand',
    tier: 4,
    rarity: 'epic',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 26, maxHp: 38, atk: 5, crit: 5 },
    sellPrice: 255,
    buyPrice: 630,
    shopMinRank: 'C',
    grantedSkill: 'SHIELD_BASH',
    desc: 'A shield studded with spikes for counterattack.'
  },
  MYTHRIL_SHIELD: {
    id: 'MYTHRIL_SHIELD',
    name: 'Mythril Shield',
    slot: 'offhand',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 42, maxHp: 50, spd: 4, crit: 8 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    grantedSkill: 'AEGIS_COUNTER',
    desc: 'A mythril shield, impossibly light and indestructible.'
  },
  AEGIS: {
    id: 'AEGIS',
    name: 'Aegis',
    slot: 'offhand',
    tier: 5,
    rarity: 'legendary',
    classReq: ['HERO', 'KNIGHT'],
    statBonus: { def: 45, maxHp: 55, spd: 3, crit: 10, mag: 8 },
    sellPrice: 900,
    buyPrice: 2250,
    shopMinRank: 'B',
    grantedSkill: 'ETERNAL_GUARD',
    desc: 'The legendary shield, imbued with ancient protective magic.'
  },
  WALL_OF_AGES: {
    id: 'WALL_OF_AGES',
    name: 'Wall of Ages',
    slot: 'offhand',
    tier: 5,
    rarity: 'legendary',
    classReq: ['KNIGHT'],
    statBonus: { def: 60, maxHp: 70, crit: 4, dodge: 4 },
    sellPrice: 910,
    buyPrice: 2280,
    shopMinRank: 'B',
    grantedSkill: 'ETERNAL_GUARD',
    desc: 'A shield that has guarded for ages untold.'
  },

  // === ORBS ===
  GLASS_ORB: {
    id: 'GLASS_ORB',
    name: 'Glass Orb',
    slot: 'offhand',
    tier: 1,
    rarity: 'common',
    classReq: ['MAGE', 'CLERIC', 'BARD'],
    statBonus: { mag: 2, crit: 1 },
    sellPrice: 4,
    buyPrice: 14,
    shopMinRank: 'F',
    desc: 'A simple glass orb for focusing magic.'
  },
  WOODEN_ORB: {
    id: 'WOODEN_ORB',
    name: 'Wooden Orb',
    slot: 'offhand',
    tier: 1,
    rarity: 'common',
    classReq: ['MAGE', 'CLERIC', 'BARD'],
    statBonus: { mag: 3, def: 1 },
    sellPrice: 5,
    buyPrice: 16,
    shopMinRank: 'F',
    desc: 'A wooden orb carved for spellcasting.'
  },
  FOCUS_ORB: {
    id: 'FOCUS_ORB',
    name: 'Focus Orb',
    slot: 'offhand',
    tier: 2,
    rarity: 'magic',
    classReq: ['MAGE', 'CLERIC', 'BARD'],
    statBonus: { mag: 9, crit: 2, spd: 1 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'A simple crystal orb that aids concentration.'
  },
  BLESSED_ORB: {
    id: 'BLESSED_ORB',
    name: 'Blessed Orb',
    slot: 'offhand',
    tier: 2,
    rarity: 'magic',
    classReq: ['CLERIC'],
    statBonus: { mag: 10, def: 3, maxHp: 12 },
    sellPrice: 32,
    buyPrice: 80,
    shopMinRank: 'E',
    desc: 'An orb blessed with holy magic.'
  },
  CRYSTAL_ORB: {
    id: 'CRYSTAL_ORB',
    name: 'Crystal Orb',
    slot: 'offhand',
    tier: 3,
    rarity: 'rare',
    classReq: ['MAGE', 'CLERIC', 'BARD'],
    statBonus: { mag: 16, crit: 6, spd: 2 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    grantedSkill: 'ARCANE_RESONANCE',
    desc: 'A polished orb swirling with inner light.'
  },
  HOLY_ORB: {
    id: 'HOLY_ORB',
    name: 'Holy Orb',
    slot: 'offhand',
    tier: 3,
    rarity: 'rare',
    classReq: ['CLERIC'],
    statBonus: { mag: 14, def: 5, maxHp: 22, crit: 1, dodge: 1 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    grantedSkill: 'SANCTUARY',
    desc: 'An orb radiating divine warmth.'
  },
  VOID_ORB: {
    id: 'VOID_ORB',
    name: 'Void Orb',
    slot: 'offhand',
    tier: 4,
    rarity: 'epic',
    classReq: ['MAGE'],
    statBonus: { mag: 26, crit: 8, spd: 3, dodge: 3, atkBonus: 0.05 },
    sellPrice: 255,
    buyPrice: 630,
    shopMinRank: 'C',
    grantedSkill: 'VOID_BURST',
    desc: 'An orb of pure darkness that amplifies destructive magic.'
  },
  ORB_OF_ETERNITY: {
    id: 'ORB_OF_ETERNITY',
    name: 'Orb of Eternity',
    slot: 'offhand',
    tier: 5,
    rarity: 'legendary',
    classReq: ['MAGE', 'CLERIC'],
    statBonus: { mag: 42, crit: 15, spd: 6, dodge: 5, maxHp: 20 },
    sellPrice: 895,
    buyPrice: 2240,
    shopMinRank: 'B',
    grantedSkill: 'GENESIS_WARD',
    desc: 'An ancient orb pulsing with infinite magical potential.'
  },
  ORB_OF_CREATION: {
    id: 'ORB_OF_CREATION',
    name: 'Orb of Creation',
    slot: 'offhand',
    tier: 5,
    rarity: 'legendary',
    classReq: ['CLERIC'],
    statBonus: { mag: 38, def: 10, healBonus: 0.20, maxHp: 35 },
    sellPrice: 885,
    buyPrice: 2210,
    shopMinRank: 'B',
    grantedSkill: 'GENESIS_WARD',
    desc: 'An orb that channels the power of creation.'
  },

  // ── Ranger Quivers (Offhand) ─────────────────────────────────────────────
  LEATHER_QUIVER: {
    id: 'LEATHER_QUIVER',
    name: 'Leather Quiver',
    slot: 'offhand',
    tier: 1,
    rarity: 'common',
    classReq: ['RANGER'],
    statBonus: { atk: 2, spd: 1 },
    sellPrice: 4,
    buyPrice: 14,
    shopMinRank: 'F',
    desc: 'A simple leather quiver. Holds arrows and not much else.'
  },
  HUNTERS_QUIVER: {
    id: 'HUNTERS_QUIVER',
    name: "Hunter's Quiver",
    slot: 'offhand',
    tier: 2,
    rarity: 'magic',
    classReq: ['RANGER'],
    statBonus: { atk: 6, spd: 3, crit: 2 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'Reinforced with boarhide and enchanted to keep arrows dry in any weather.'
  },
  WINDRUNNER_QUIVER: {
    id: 'WINDRUNNER_QUIVER',
    name: 'Windrunner Quiver',
    slot: 'offhand',
    tier: 3,
    rarity: 'rare',
    classReq: ['RANGER'],
    statBonus: { atk: 12, spd: 6, crit: 5, dodge: 2 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    grantedSkill: 'QUICK_DRAW',
    desc: 'Wind-enchanted leather lets arrows practically leap to the bow on their own.'
  },
  SHADOWSTRIKE_QUIVER: {
    id: 'SHADOWSTRIKE_QUIVER',
    name: 'Shadowstrike Quiver',
    slot: 'offhand',
    tier: 4,
    rarity: 'epic',
    classReq: ['RANGER'],
    statBonus: { atk: 18, spd: 10, crit: 8, dodge: 4 },
    sellPrice: 250,
    buyPrice: 620,
    shopMinRank: 'C',
    grantedSkill: 'SHADOW_SHOT',
    desc: 'Woven from shadow silk. Arrows drawn from it strike before the enemy hears the bowstring.'
  },
  GALE_QUIVER: {
    id: 'GALE_QUIVER',
    name: 'Gale Quiver',
    slot: 'offhand',
    tier: 5,
    rarity: 'legendary',
    classReq: ['RANGER'],
    statBonus: { atk: 30, spd: 16, crit: 18, dodge: 6 },
    sellPrice: 880,
    buyPrice: 2200,
    shopMinRank: 'B',
    grantedSkill: 'GALE_BARRAGE',
    desc: 'Forged from a captured storm. Every arrow loosed carries the force of a gale behind it.'
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ██ CELESTIAL EQUIPMENT — God-tier class-locked sets (S-rank drop only) ██
  // ══════════════════════════════════════════════════════════════════════════

  // ── HERO: "Ascendant" Set ───────────────────────────────────────────────
  CEL_DAWNBREAKER: {
    id: 'CEL_DAWNBREAKER', name: 'Dawnbreaker', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['HERO'],
    statBonus: { atk: 62, spd: 22, crit: 24, dodge: 9 },
    grantedSkill: 'CEL_ASCENDANT_WRATH',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The blade that ended the Long Night. It burns with the light of the first dawn, and its edge has never dulled.'
  },
  CEL_ASCENDANT_PLATE: {
    id: 'CEL_ASCENDANT_PLATE', name: 'Ascendant Plate', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['HERO'],
    statBonus: { def: 55, maxHp: 180, spd: 10, atk: 12 },
    grantedSkill: 'CEL_ASCENDANT_AEGIS',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Forged from the heart of a dying star. Each plate is a solidified prayer, each rivet a hymn of protection.'
  },
  CEL_ASCENDANT_WARD: {
    id: 'CEL_ASCENDANT_WARD', name: 'Ascendant Ward', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['HERO'],
    statBonus: { def: 38, maxHp: 80, atk: 15, crit: 6, dodge: 4 },
    grantedSkill: 'CEL_ASCENDANT_RALLY',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A shield that protects not just the wielder but everyone who fights beside them. It hums with the voice of a thousand heroes past.'
  },
  CEL_CROWN_OF_THE_CHOSEN: {
    id: 'CEL_CROWN_OF_THE_CHOSEN', name: 'Crown of the Chosen', slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['HERO'],
    statBonus: { atk: 25, def: 20, spd: 20, mag: 15, crit: 15, dodge: 5, maxHp: 60 },
    grantedSkill: 'CEL_DESTINY_AURA',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The crown appears only for those chosen by fate. It weighs nothing, yet carries the hopes of the world.'
  },
  CEL_GODSLAYER: {
    id: 'CEL_GODSLAYER', name: 'Godslayer', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['HERO'],
    statBonus: { atk: 95, spd: 28, crit: 35, dodge: 12, def: 20, maxHp: 60 },
    grantedSkills: ['CEL_WORLDSPLITTER', 'CEL_SLAYERS_FERVOR'],
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    twoHanded: true,
    desc: "A colossal greatsword that hums with the death-echoes of fallen gods. Champions who forsake their shield to wield it gain power beyond mortal limits — at the cost of everything else."
  },

  // ── KNIGHT: "Eternal Bastion" Set ───────────────────────────────────────
  CEL_OATHSWORN: {
    id: 'CEL_OATHSWORN', name: 'Oathsworn', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['KNIGHT'],
    statBonus: { atk: 48, def: 30, maxHp: 60 },
    grantedSkill: 'CEL_BASTION_SMITE',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A blade bound by an oath older than nations. It cannot be broken because it was forged from an unbreakable vow.'
  },
  CEL_ETERNAL_BASTION: {
    id: 'CEL_ETERNAL_BASTION', name: 'Eternal Bastion', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['KNIGHT'],
    statBonus: { def: 72, maxHp: 250 },
    grantedSkill: 'CEL_BASTION_FORTRESS',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'This armor has survived the end of three civilizations. Its wearer has never fallen in battle. Not once. Not ever.'
  },
  CEL_INFINITUM_SHIELD: {
    id: 'CEL_INFINITUM_SHIELD', name: 'Infinitum Shield', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['KNIGHT'],
    statBonus: { def: 50, maxHp: 120, mag: 10 },
    grantedSkill: 'CEL_BASTION_WARD',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The shield expands to cover all allies in divine protection. Its surface shows the reflection of a world without suffering.'
  },
  CEL_SENTINELS_ETERNITY: {
    id: 'CEL_SENTINELS_ETERNITY', name: "Sentinel's Eternity", slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['KNIGHT'],
    statBonus: { def: 35, maxHp: 150, atk: 10, crit: 4, dodge: 4 },
    grantedSkill: 'CEL_IMMOVABLE_AURA',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A ring forged in the heart of a mountain that has never moved. The wearer becomes equally immovable.'
  },

  // ── MAGE: "Arcanum Infinitum" Set ──────────────────────────────────────
  CEL_INFINITY_STAFF: {
    id: 'CEL_INFINITY_STAFF', name: 'Infinity Staff', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['MAGE'],
    statBonus: { mag: 68, spd: 15, crit: 17, dodge: 5 },
    grantedSkill: 'CEL_ARCANUM_CATACLYSM',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The staff channels magic from every plane simultaneously. Reality bends like paper in its presence.'
  },
  CEL_ROBES_OF_THE_VOID: {
    id: 'CEL_ROBES_OF_THE_VOID', name: 'Robes of the Void', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['MAGE'],
    statBonus: { mag: 25, def: 40, maxHp: 100, spd: 12 },
    grantedSkill: 'CEL_VOID_BARRIER',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Woven from the fabric between dimensions. Attacks pass through the wearer and into the void itself.'
  },
  CEL_SINGULARITY_ORB: {
    id: 'CEL_SINGULARITY_ORB', name: 'Singularity Orb', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['MAGE'],
    statBonus: { mag: 45, spd: 10, crit: 10, maxHp: 40 },
    grantedSkill: 'CEL_ARCANUM_RESONANCE',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A point of infinite density suspended in crystal. All magical energy within a league bends toward it.'
  },
  CEL_DIADEM_OF_OMNISCIENCE: {
    id: 'CEL_DIADEM_OF_OMNISCIENCE', name: 'Diadem of Omniscience', slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['MAGE'],
    statBonus: { mag: 35, spd: 20, crit: 24, dodge: 9 },
    grantedSkill: 'CEL_OMNISCIENCE_AURA',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The wearer sees every possible future simultaneously. Spells land before they are cast.'
  },

  // ── ROGUE: "Voidwalker" Set ────────────────────────────────────────────
  CEL_VOIDFANG: {
    id: 'CEL_VOIDFANG', name: 'Voidfang', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['ROGUE'],
    dagger: true,
    statBonus: { atk: 55, spd: 28, crit: 31, dodge: 19 },
    grantedSkill: 'CEL_VOIDWALKER_STRIKE',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A dagger forged in the space between heartbeats. Its blade exists only at the moment of the kill.'
  },
  CEL_WRAITHWEAVE: {
    id: 'CEL_WRAITHWEAVE', name: 'Wraithweave', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['ROGUE'],
    statBonus: { spd: 40, def: 35, crit: 24, dodge: 20, maxHp: 60 },
    grantedSkill: 'CEL_PHASE_SHIFT',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Armor stitched from captured shadows. The wearer flickers between this world and the next.'
  },
  CEL_NULLBLADE: {
    id: 'CEL_NULLBLADE', name: 'Nullblade', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['ROGUE'],
    dagger: true,
    statBonus: { atk: 40, spd: 25, crit: 25, dodge: 15 },
    grantedSkill: 'CEL_VOID_ECHO',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The twin of Voidfang. Where one cuts flesh, the other cuts fate. Together, they sever destiny itself.'
  },
  CEL_ECLIPSE_PENDANT: {
    id: 'CEL_ECLIPSE_PENDANT', name: 'Eclipse Pendant', slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['ROGUE'],
    statBonus: { spd: 30, crit: 37, dodge: 28, atk: 15 },
    grantedSkill: 'CEL_SHADOW_DIMENSION',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Contains a perpetual eclipse. The wearer exists in twilight — visible only when they choose to be.'
  },

  // ── CLERIC: "Divine Radiance" Set ──────────────────────────────────────
  CEL_SCEPTER_OF_DAWN: {
    id: 'CEL_SCEPTER_OF_DAWN', name: 'Scepter of Dawn', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['CLERIC'],
    statBonus: { mag: 52, atk: 20, def: 10, crit: 8, dodge: 4 },
    grantedSkill: 'CEL_DIVINE_JUDGEMENT',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The first light that ever shone is trapped within this scepter. Its radiance purges all darkness.'
  },
  CEL_VESTMENTS_OF_GRACE: {
    id: 'CEL_VESTMENTS_OF_GRACE', name: 'Vestments of Grace', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['CLERIC'],
    statBonus: { def: 45, maxHp: 160, mag: 18, crit: 8, dodge: 4 },
    grantedSkill: 'CEL_DIVINE_SHIELD',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Woven by angels who wept with joy. Every thread is a prayer answered, every fold a miracle preserved.'
  },
  CEL_TOME_OF_MIRACLES: {
    id: 'CEL_TOME_OF_MIRACLES', name: 'Tome of Miracles', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['CLERIC'],
    statBonus: { mag: 38, def: 20, maxHp: 60, crit: 10, dodge: 5 },
    grantedSkill: 'CEL_MIRACULOUS_BLESSING',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Every miracle ever performed is recorded within. The pages write themselves as new miracles occur.'
  },
  CEL_HALO_OF_THE_BLESSED: {
    id: 'CEL_HALO_OF_THE_BLESSED', name: 'Halo of the Blessed', slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['CLERIC'],
    statBonus: { mag: 30, def: 22, maxHp: 80, crit: 11, dodge: 7 },
    grantedSkill: 'CEL_RESURRECTION_AURA',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A visible halo crowns the wearer. The merely wounded are healed by proximity. The fallen stir again.'
  },

  // ── RANGER: "Starfall" Set ─────────────────────────────────────────────
  CEL_STARFALL_BOW: {
    id: 'CEL_STARFALL_BOW', name: 'Starfall Bow', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['RANGER'],
    statBonus: { atk: 58, spd: 25, crit: 33 },
    grantedSkill: 'CEL_CELESTIAL_BARRAGE',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Strung with a strand of starlight. Each arrow is a falling star — beautiful, brief, and absolutely devastating.'
  },
  CEL_STARHIDE_MANTLE: {
    id: 'CEL_STARHIDE_MANTLE', name: 'Starhide Mantle', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['RANGER'],
    statBonus: { def: 42, spd: 30, maxHp: 80, crit: 15 },
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    grantedSkill: 'CEL_STELLAR_CLOAK',
    desc: 'Cured from the hide of a celestial beast. It shimmers with the light of distant constellations.'
  },
  CEL_CONSTELLATION_QUIVER: {
    id: 'CEL_CONSTELLATION_QUIVER', name: 'Constellation Quiver', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['RANGER'],
    statBonus: { atk: 30, spd: 20, crit: 30 },
    grantedSkill: 'CEL_STARFIRE_VOLLEY',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The quiver holds twelve arrows — one for each constellation. They regenerate at midnight, and each carries the power of its star sign.'
  },
  CEL_POLARIS_PENDANT: {
    id: 'CEL_POLARIS_PENDANT', name: 'Polaris Pendant', slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['RANGER'],
    statBonus: { atk: 28, spd: 25, crit: 37 },
    grantedSkill: 'CEL_NORTH_STAR_AURA',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The North Star itself, compressed into a gem. The wearer never misses, never gets lost, and never hesitates.'
  },

  // ── BARD: "Harmony of Spheres" Set ─────────────────────────────────────
  CEL_LYRE_OF_CREATION: {
    id: 'CEL_LYRE_OF_CREATION', name: 'Lyre of Creation', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['BARD'],
    statBonus: { mag: 90, spd: 38, crit: 32, dodge: 46, def: 16, maxHp: 38 },
    grantedSkills: ['CEL_SONG_OF_CREATION', 'CEL_MUSES_INSPIRATION'],
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    twoHanded: true,
    desc: 'The instrument that played the melody of creation. Each note reshapes reality. Each chord rewrites the laws of physics.'
  },
  CEL_VESTMENTS_OF_COSMOS: {
    id: 'CEL_VESTMENTS_OF_COSMOS', name: 'Vestments of the Cosmos', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['BARD'],
    statBonus: { def: 38, mag: 28, maxHp: 90, crit: 16, dodge: 24 },
    grantedSkill: 'CEL_COSMIC_HARMONY',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The fabric shows a living star map. Constellations dance across it, harmonizing with the wearer\'s music.'
  },
  CEL_DRUM_OF_ETERNITY: {
    id: 'CEL_DRUM_OF_ETERNITY', name: 'Drum of Eternity', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['BARD'],
    statBonus: { mag: 82, def: 30, spd: 32, crit: 24, dodge: 28, maxHp: 52 },
    grantedSkills: ['CEL_RHYTHM_OF_WORLDS', 'CEL_ETERNAL_CADENCE'],
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    twoHanded: true,
    desc: 'The drum beats with the heartbeat of the universe. Each strike synchronizes the rhythm of every living thing nearby.'
  },
  CEL_MAESTROS_SIGNET: {
    id: 'CEL_MAESTROS_SIGNET', name: "Maestro's Signet", slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['BARD'],
    statBonus: { crit: 26, dodge: 39, mag: 25, spd: 20, atk: 12, def: 12 },
    grantedSkill: 'CEL_SYMPHONY_AURA',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The ring of the Grand Maestro who conducted the symphony of creation. Music flows from the wearer like breathing.'
  },

  // ── MONK: "Transcendence" Set ──────────────────────────────────────────
  CEL_FISTS_OF_NIRVANA: {
    id: 'CEL_FISTS_OF_NIRVANA', name: 'Fists of Nirvana', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['MONK'],
    claw: true,
    statBonus: { atk: 55, spd: 30, def: 15, crit: 15 },
    grantedSkill: 'CEL_TRANSCENDENT_STRIKE',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'Gauntlets forged from condensed enlightenment. Each strike carries the weight of ten thousand years of meditation.'
  },
  CEL_GI_OF_THE_ABSOLUTE: {
    id: 'CEL_GI_OF_THE_ABSOLUTE', name: 'Gi of the Absolute', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['MONK'],
    statBonus: { def: 45, spd: 35, maxHp: 100, atk: 15 },
    grantedSkill: 'CEL_ABSOLUTE_FLOW',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The robes of the monk who achieved perfect balance. The wearer flows like water and strikes like lightning.'
  },
  CEL_PALM_OF_THE_INFINITE: {
    id: 'CEL_PALM_OF_THE_INFINITE', name: 'Palm of the Infinite', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['MONK'],
    claw: true,
    statBonus: { atk: 42, spd: 28, def: 12, dodge: 12 },
    grantedSkill: 'CEL_INFINITE_PALM',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The open palm that caught a god\'s fist. Its chi resonance strengthens everyone within a hundred paces.'
  },
  CEL_CHAKRA_OF_ENLIGHTENMENT: {
    id: 'CEL_CHAKRA_OF_ENLIGHTENMENT', name: 'Chakra of Enlightenment', slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['MONK'],
    statBonus: { atk: 22, def: 22, spd: 22, maxHp: 80, dodge: 15 },
    grantedSkill: 'CEL_NIRVANA_AURA',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A meditation bead containing the secret of nirvana. True balance achieved — body, mind, and spirit in absolute harmony.'
  },

  // === DARK STAVES (Necromancer 1H) ===
  BLIGHTED_WAND: {
    id: 'BLIGHTED_WAND',
    name: 'Blighted Wand',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 4, spd: 1 },
    sellPrice: 5,
    buyPrice: 18,
    shopMinRank: 'F',
    desc: 'A wand of blackened wood that hums with faint necrotic energy.'
  },
  BONE_STAFF: {
    id: 'BONE_STAFF',
    name: 'Bone Staff',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 10, spd: 2, def: 1 },
    sellPrice: 30,
    buyPrice: 75,
    shopMinRank: 'E',
    desc: 'A staff carved from the femur of some great beast, cold to the touch.'
  },
  HEXWOOD_STAFF: {
    id: 'HEXWOOD_STAFF',
    name: 'Hexwood Staff',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 18, spd: 4, def: 2, crit: 1, dodge: 1 },
    sellPrice: 98,
    buyPrice: 245,
    shopMinRank: 'D',
    desc: 'Hewn from a tree that grew in cursed soil. Its bark weeps black sap.'
  },
  STAFF_OF_WHISPERS: {
    id: 'STAFF_OF_WHISPERS',
    name: 'Staff of Whispers',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 32, spd: 8, crit: 8, dodge: 3, maxHp: 15 },
    sellPrice: 260,
    buyPrice: 650,
    shopMinRank: 'C',
    grantedSkill: 'WHISPER_DRAIN',
    desc: 'The staff murmurs secrets of the dead to those who listen. Their pain becomes your power.'
  },
  DEATHRATTLE_STAFF: {
    id: 'DEATHRATTLE_STAFF',
    name: 'Deathrattle Staff',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 50, spd: 14, crit: 15, dodge: 5, maxHp: 25 },
    sellPrice: 895,
    buyPrice: 2240,
    shopMinRank: 'B',
    grantedSkill: 'DEATHRATTLE',
    desc: 'When its wielder falls, the staff screams — and the scream kills.'
  },

  // === SCYTHES (Necromancer 2H) ===
  RUSTY_SCYTHE: {
    id: 'RUSTY_SCYTHE',
    name: 'Rusty Scythe',
    slot: 'weapon',
    tier: 1,
    rarity: 'common',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 5, atk: 3, spd: 1, def: 2, maxHp: 3 },
    sellPrice: 6,
    buyPrice: 20,
    shopMinRank: 'F',
    twoHanded: true,
    desc: 'A farmer\'s scythe repurposed for darker work. The rust might be blood.'
  },
  BONE_SCYTHE: {
    id: 'BONE_SCYTHE',
    name: 'Bone Scythe',
    slot: 'weapon',
    tier: 2,
    rarity: 'magic',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 16, atk: 5, spd: 4, crit: 3, def: 4, maxHp: 8 },
    sellPrice: 34,
    buyPrice: 88,
    shopMinRank: 'E',
    twoHanded: true,
    desc: 'Forged from the ribcage of a fallen giant. It hums with residual life force.'
  },
  GRAVE_REAPER: {
    id: 'GRAVE_REAPER',
    name: 'Grave Reaper',
    slot: 'weapon',
    tier: 3,
    rarity: 'rare',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 30, atk: 8, spd: 7, crit: 8, def: 6, maxHp: 15 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    twoHanded: true,
    desc: 'The blade glows faintly in the presence of the dying. It knows its purpose.'
  },
  SOUL_HARVESTER: {
    id: 'SOUL_HARVESTER',
    name: 'Soul Harvester',
    slot: 'weapon',
    tier: 4,
    rarity: 'epic',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 50, atk: 14, spd: 12, crit: 18, def: 12, maxHp: 36 },
    sellPrice: 265,
    buyPrice: 660,
    shopMinRank: 'C',
    twoHanded: true,
    grantedSkill: 'SOUL_REAP',
    desc: 'Every swing harvests a sliver of the target\'s soul. The wielder grows stronger with each kill.'
  },
  ABYSSAL_SCYTHE: {
    id: 'ABYSSAL_SCYTHE',
    name: 'Abyssal Scythe',
    slot: 'weapon',
    tier: 5,
    rarity: 'legendary',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 78, atk: 22, spd: 20, crit: 30, def: 18, maxHp: 57 },
    sellPrice: 910,
    buyPrice: 2280,
    shopMinRank: 'B',
    twoHanded: true,
    grantedSkill: 'ABYSSAL_HARVEST',
    desc: 'A scythe forged in the abyss between life and death. Reality bends around its edge.'
  },

  // === SKULLS & GRIMOIRES (Necromancer offhand) ===
  CRACKED_SKULL: {
    id: 'CRACKED_SKULL',
    name: 'Cracked Skull',
    slot: 'offhand',
    tier: 1,
    rarity: 'common',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 2, crit: 1 },
    sellPrice: 4,
    buyPrice: 14,
    shopMinRank: 'F',
    desc: 'A cracked humanoid skull that faintly pulses with residual energy.'
  },
  TOME_OF_SHADOWS: {
    id: 'TOME_OF_SHADOWS',
    name: 'Tome of Shadows',
    slot: 'offhand',
    tier: 2,
    rarity: 'magic',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 9, crit: 2, spd: 1 },
    sellPrice: 28,
    buyPrice: 72,
    shopMinRank: 'E',
    desc: 'A leather-bound grimoire filled with rituals of shadow and silence.'
  },
  WHISPERING_SKULL: {
    id: 'WHISPERING_SKULL',
    name: 'Whispering Skull',
    slot: 'offhand',
    tier: 3,
    rarity: 'rare',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 16, crit: 6, spd: 2 },
    sellPrice: 100,
    buyPrice: 250,
    shopMinRank: 'D',
    grantedSkill: 'SKULL_WHISPER',
    desc: 'The skull chatters constantly in a dead language. Those who listen too long begin to understand.'
  },
  GRIMOIRE_OF_SOULS: {
    id: 'GRIMOIRE_OF_SOULS',
    name: 'Grimoire of Souls',
    slot: 'offhand',
    tier: 4,
    rarity: 'epic',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 26, crit: 8, spd: 3, dodge: 3 },
    sellPrice: 240,
    buyPrice: 600,
    shopMinRank: 'C',
    grantedSkill: 'SOUL_SIPHON',
    desc: 'Each page is written in the blood of a willing soul. Their sacrifice fuels terrible magic.'
  },
  SKULL_OF_THE_DAMNED: {
    id: 'SKULL_OF_THE_DAMNED',
    name: 'Skull of the Damned',
    slot: 'offhand',
    tier: 5,
    rarity: 'legendary',
    classReq: ['NECROMANCER'],
    statBonus: { mag: 42, crit: 15, spd: 6, dodge: 5, maxHp: 20 },
    sellPrice: 895,
    buyPrice: 2240,
    shopMinRank: 'B',
    grantedSkill: 'DAMNED_CHORUS',
    desc: 'The skull of an ancient lich. A chorus of the damned screams from within.'
  },

  // === CELESTIAL SET: Dominion of the Dead (Necromancer) ===
  CEL_SOULWEAVER: {
    id: 'CEL_SOULWEAVER', name: 'Soulweaver', slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['NECROMANCER'],
    statBonus: { mag: 58, spd: 14, crit: 18, dodge: 6, def: 8, maxHp: 12 },
    grantedSkill: 'CEL_SIPHON_OF_SOULS',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A staff woven from threads of stolen life force. Each strike drains the essence of the living and feeds it back to the wielder.'
  },
  CEL_MORTALITYS_END: {
    id: 'CEL_MORTALITYS_END', name: "Mortality's End", slot: 'weapon', tier: 6,
    rarity: 'celestial', classReq: ['NECROMANCER'],
    statBonus: { mag: 88, atk: 18, spd: 26, crit: 34, def: 16, maxHp: 55 },
    grantedSkills: ['CEL_DEATHS_DOMINION', 'CEL_REAPERS_PRESENCE'],
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    twoHanded: true,
    desc: "The final scythe. Its blade exists in both the living world and the realm of the dead simultaneously. What it cuts in one world, dies in both."
  },
  CEL_SHROUD_OF_THE_LICH: {
    id: 'CEL_SHROUD_OF_THE_LICH', name: 'Shroud of the Lich', slot: 'armor', tier: 6,
    rarity: 'celestial', classReq: ['NECROMANCER'],
    statBonus: { mag: 42, def: 28, maxHp: 120, spd: 8, crit: 8 },
    grantedSkill: 'CEL_LICHBORNE',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'The burial shroud of the first lich. It remembers the secret of undeath and shares it freely with the wearer.'
  },
  CEL_SKULL_OF_ETERNAL_WHISPERS: {
    id: 'CEL_SKULL_OF_ETERNAL_WHISPERS', name: 'Skull of Eternal Whispers', slot: 'offhand', tier: 6,
    rarity: 'celestial', classReq: ['NECROMANCER'],
    statBonus: { mag: 52, crit: 18, spd: 10, dodge: 8, maxHp: 30 },
    grantedSkill: 'CEL_ETERNAL_WHISPER',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'This skull belonged to an oracle who foresaw their own death — and chose it anyway. Their whispers reveal the moment of every creature\'s demise.'
  },
  CEL_PHYLACTERY_OF_SOULS: {
    id: 'CEL_PHYLACTERY_OF_SOULS', name: 'Phylactery of Souls', slot: 'accessory', tier: 6,
    rarity: 'celestial', classReq: ['NECROMANCER'],
    statBonus: { mag: 30, crit: 15, spd: 15, maxHp: 60, def: 12, dodge: 6 },
    grantedSkill: 'CEL_SOUL_ANCHOR',
    sellPrice: 80000, buyPrice: 0, shopMinRank: null,
    desc: 'A phylactery that binds the Necromancer\'s soul to the mortal plane. As long as it endures, true death is merely an inconvenience.'
  },
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

  // ── Gem Mining Rewards (jackpot loot — one per rank) ──────────────────
  GEM_ROUGH_QUARTZ:    { id:'GEM_ROUGH_QUARTZ',    name:'Bag of Rough Quartz',     sellPrice:10000,   desc:'A heavy sack of raw quartz crystals pulled from a shallow vein. Worth a small fortune to the right buyer.' },
  GEM_AMETHYST:        { id:'GEM_AMETHYST',        name:'Pouch of Amethysts',      sellPrice:18000,   desc:'Deep-violet amethyst clusters, still warm from the earth. Jewelers will pay handsomely for these.' },
  GEM_SAPPHIRE:        { id:'GEM_SAPPHIRE',        name:'Sapphire Cache',          sellPrice:30000,   desc:'A velvet-lined case of brilliant blue sapphires. Each one could buy a house.' },
  GEM_EMERALD:         { id:'GEM_EMERALD',         name:'Emerald Trove',           sellPrice:50000,   desc:'Flawless emeralds the color of deep forest canopy. Nobility would kill for these.' },
  GEM_RUBY:            { id:'GEM_RUBY',            name:'Ruby Hoard',              sellPrice:75000,   desc:'Blood-red rubies that seem to pulse with inner fire. A dragon\'s ransom.' },
  GEM_STAR_DIAMOND:    { id:'GEM_STAR_DIAMOND',    name:'Pouch of Star Diamonds',  sellPrice:120000,  desc:'Diamonds that refract light into tiny stars. Said to be crystallized starlight from a fallen celestial.' },
  GEM_CELESTIAL_OPAL:  { id:'GEM_CELESTIAL_OPAL',  name:'Celestial Opals',         sellPrice:250000,  desc:'Opals that shift through impossible colors — hues that don\'t exist in nature. Worth more than most kingdoms.' },

  // ── Tower Climb Rewards ──────────────────────────────────────────────────
  TOWER_GEM_BAG_MINOR:    { id:'TOWER_GEM_BAG_MINOR',    name:'Tower Gem Satchel',         sellPrice:200000,  desc:'A reinforced satchel of mixed gems collected during the tower ascent. Contains crystals from every tier of the tower.' },
  TOWER_GEM_BAG_MAJOR:    { id:'TOWER_GEM_BAG_MAJOR',    name:'Tower Gem Chest',           sellPrice:500000,  desc:'A heavy chest overflowing with rare gems extracted from the tower\'s deepest vaults. Worth a king\'s ransom.' },
  TOWER_GEM_BAG_SUPREME:  { id:'TOWER_GEM_BAG_SUPREME',  name:'Tower Gem Hoard',           sellPrice:1000000, desc:'The legendary gem hoard from the tower\'s highest reaches. Contains gems that shouldn\'t exist — each one a national treasure.' },
};

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

export function randomName(classId, existingMembers = []) {
  // Build set of first names already in use
  const usedFirsts = new Set(existingMembers.map(m => m.name.split(' ')[0]));

  // Pick a first name not already in the party
  const available = NAMES.first.filter(n => !usedFirsts.has(n));
  const pool = available.length > 0 ? available : NAMES.first; // fallback if all 84 used
  const first = pool[Math.floor(Math.random() * pool.length)];

  // Pick a class-themed surname (fallback to HERO pool if classId missing)
  const surnames = NAMES.last[classId] || NAMES.last.HERO;
  const last = surnames[Math.floor(Math.random() * surnames.length)];

  return `${first} ${last}`;
}

export function getAvailableClasses(_guildRank) {
  // All classes are available from the start — cost scales with party size
  return Object.values(CLASSES).filter(c => c.recruitCost);
}

// ── Incremental recruit cost based on how many members you already have ──
// First 4 recruits (building the base party): 50, 75, 100, 150
// Next 3 unlockable slots: 500, 1000, 1500
const RECRUIT_COSTS = [50, 75, 100, 150, 500, 1000, 1500];
export function getRecruitCost(currentPartySize) {
  // currentPartySize includes the free Hero, so recruit index = partySize - 1
  // (Hero is slot 0, first recruit is slot 1 → index 0 in RECRUIT_COSTS)
  const idx = Math.max(0, currentPartySize - 1);
  if (idx >= RECRUIT_COSTS.length) return RECRUIT_COSTS[RECRUIT_COSTS.length - 1]; // cap at last tier
  return RECRUIT_COSTS[idx];
}

export function rankIndex(rank) {
  return RANK_ORDER.indexOf(rank);
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
