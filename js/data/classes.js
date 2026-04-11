// Classes, class-themed names, and class helper functions.

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

export function getClass(classId) {
  return CLASSES[classId] || CLASSES.HERO;
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
  const usedFirsts = new Set(existingMembers.map(m => m.name.split(' ')[0]));
  const available = NAMES.first.filter(n => !usedFirsts.has(n));
  const pool = available.length > 0 ? available : NAMES.first;
  const first = pool[Math.floor(Math.random() * pool.length)];
  const surnames = NAMES.last[classId] || NAMES.last.HERO;
  const last = surnames[Math.floor(Math.random() * surnames.length)];
  return `${first} ${last}`;
}

export function getAvailableClasses(_guildRank) {
  return Object.values(CLASSES).filter(c => c.recruitCost);
}

// ── Incremental recruit cost based on how many members you already have ──
// First 4 recruits (building the base party): 50, 75, 100, 150
// Next 3 unlockable slots: 500, 1000, 1500
const RECRUIT_COSTS = [50, 75, 100, 150, 500, 1000, 1500];
export function getRecruitCost(currentPartySize) {
  const idx = Math.max(0, currentPartySize - 1);
  if (idx >= RECRUIT_COSTS.length) return RECRUIT_COSTS[RECRUIT_COSTS.length - 1];
  return RECRUIT_COSTS[idx];
}
