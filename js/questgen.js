// ── Quest Generation System ─────────────────────────────────────────────
// Generates randomized quests from templates, handles difficulty tiers,
// quest board rotation, and party strength calculation.

import { RANK_ORDER, EQUIPMENT, LOOT_ITEMS, getItem, getClass, rankIndex, randInt } from './data.js';
import { getSkill } from './skills.js';

// ── Difficulty Tiers ────────────────────────────────────────────────────

export const DIFFICULTY_TIERS = [
  { id: 'trivial',    label: 'Trivial',    color: '#7a7a8a', icon: '○', multiplier: 0.4 },
  { id: 'easy',       label: 'Easy',       color: '#2ecc71', icon: '◐', multiplier: 0.7 },
  { id: 'moderate',   label: 'Moderate',   color: '#f0c060', icon: '●', multiplier: 1.0 },
  { id: 'hard',       label: 'Hard',       color: '#e67e22', icon: '◆', multiplier: 1.4 },
  { id: 'epic',       label: 'Epic',       color: '#9b59b6', icon: '★', multiplier: 2.0 },
  { id: 'legendary',  label: 'Legendary',  color: '#e74c3c', icon: '✦', multiplier: 3.0 },
];

export function getDifficultyTier(tierId) {
  return DIFFICULTY_TIERS.find(t => t.id === tierId) || DIFFICULTY_TIERS[2];
}

// ── Party Strength Calculation ──────────────────────────────────────────
// Comprehensive strength score considering stats, skills, equipment, level

export function calculateMemberStrength(member, effectiveStatsFn) {
  if (!member) return 0;
  const stats = effectiveStatsFn ? effectiveStatsFn(member) : member.stats;

  // Base stat contribution
  const statScore = (stats.atk || 0) * 2.0
    + (stats.def || 0) * 1.5
    + (stats.spd || 0) * 1.2
    + (stats.mag || 0) * 1.8
    + Math.floor((stats.maxHp || 50) / 8)
    + (stats.lck || 0) * 0.8;

  // Level bonus (exponential scaling)
  const levelBonus = Math.pow(member.level, 1.3) * 2;

  // Skill bonus (each skill adds strength)
  const skillBonus = (member.skills || []).reduce((sum, skillId) => {
    const skill = getSkill(skillId);
    if (!skill) return sum;
    if (skill.type === 'active') return sum + 8;
    if (skill.type === 'passive') return sum + 5;
    return sum;
  }, 0);

  // Equipment bonus (count equipped slots)
  const equipBonus = Object.values(member.equipment || {}).filter(Boolean).length * 6;

  // Quest experience bonus
  const questExpBonus = Math.min(50, (member.questsCompleted || 0) * 0.5);

  return Math.floor(statScore + levelBonus + skillBonus + equipBonus + questExpBonus);
}

export function calculatePartyStrength(playerMember, activeMembers, effectiveStatsFn) {
  let total = calculateMemberStrength(playerMember, effectiveStatsFn);
  for (const m of activeMembers) {
    total += calculateMemberStrength(m, effectiveStatsFn);
  }
  // Synergy bonus for larger parties
  const partySize = 1 + activeMembers.length;
  if (partySize >= 3) total = Math.floor(total * 1.05);
  if (partySize >= 4) total = Math.floor(total * 1.03);
  if (partySize >= 5) total = Math.floor(total * 1.03);
  if (partySize >= 6) total = Math.floor(total * 1.02);
  if (partySize >= 7) total = Math.floor(total * 1.02);
  return total;
}

// Determine what difficulty tier a quest is relative to party strength
export function getQuestDifficultyTier(questPower, partyStrength) {
  if (partyStrength <= 0) return DIFFICULTY_TIERS[5]; // legendary if no party
  const ratio = questPower / partyStrength;

  if (ratio <= 0.3)  return DIFFICULTY_TIERS[0]; // trivial
  if (ratio <= 0.6)  return DIFFICULTY_TIERS[1]; // easy
  if (ratio <= 0.9)  return DIFFICULTY_TIERS[2]; // moderate
  if (ratio <= 1.3)  return DIFFICULTY_TIERS[3]; // hard
  if (ratio <= 1.8)  return DIFFICULTY_TIERS[4]; // epic
  return DIFFICULTY_TIERS[5];                     // legendary
}

// ── Quest Templates ────────────────────────────────────────────────────
// Each rank has 20 quest templates. The board picks 5 at random.

const ENVIRONMENTS = {
  pastoral:   ['Farmer\'s Fields', 'Rolling Meadow', 'Sunlit Orchard', 'Hillside Pasture', 'River Crossing'],
  dungeon:    ['Ancient Catacombs', 'Forgotten Mine', 'Cursed Cellar', 'Shadow Crypt', 'Sealed Vault'],
  wilderness: ['Dense Thicket', 'Moonlit Marsh', 'Stormbreak Ridge', 'Windswept Plateau', 'Hollow Canyon'],
  haunted:    ['Ruined Chapel', 'Spectral Graveyard', 'Wailing Tower', 'Phantom Glade', 'Forsaken Mausoleum'],
  fortress:   ['Iron Stockade', 'Stone Watchtower', 'Crumbling Citadel', 'War-torn Keep', 'Siege Ruins'],
  mountain:   ['Frozen Peak', 'Volcanic Vent', 'Crystal Cavern', 'Sky Bridge Pass', 'Dragon\'s Roost'],
  demonic:    ['Hellfire Rift', 'Abyssal Gate', 'Corruption Nexus', 'Obsidian Throne', 'Void Breach'],
};

const ENV_ICONS = {
  pastoral: '🌾', dungeon: '🕳', wilderness: '🌲', haunted: '👻',
  fortress: '🏰', mountain: '⛰', demonic: '🌀',
};

// Quest template structure — each produces a unique quest when instantiated
function tmpl(title, desc, mood, enemies, opts = {}) {
  return { title, desc, mood, enemies, ...opts };
}

const QUEST_TEMPLATES = {
  F: [
    tmpl('Slime Extermination', 'Clear the slimes infesting {env}.', 'pastoral', ['Slime', 'Green Slime', 'Slime King']),
    tmpl('Rat Catcher', 'Giant rats have taken over {env}. Exterminate them.', 'dungeon', ['Giant Rat', 'Plague Rat', 'Rat Swarm']),
    tmpl('Escort Duty', 'Escort a merchant safely through {env}.', 'wilderness', ['Goblin Scout', 'Goblin Archer', 'Highway Bandit']),
    tmpl('Herb Gathering', 'Collect rare herbs from {env} — watch for monsters.', 'pastoral', ['Wild Boar', 'Thorn Sprite', 'Poison Toad']),
    tmpl('Lost Kitten Rescue', 'A child\'s pet wandered into {env}. Find it before the monsters do.', 'wilderness', ['Wolf Cub', 'Feral Cat', 'Shadow Bat']),
    tmpl('Fence Repair', 'Repair monster-damaged fences at {env} while fending off pests.', 'pastoral', ['Slime', 'Goblin Runt', 'Field Crawler']),
    tmpl('Cellar Cleanse', 'Something foul lurks beneath {env}. Clear it out.', 'dungeon', ['Cave Spider', 'Giant Centipede', 'Mold Beast']),
    tmpl('Message Runner', 'Deliver an urgent message through {env}. Speed is key.', 'wilderness', ['Bandit Lookout', 'Wild Wolf', 'Goblin Runner']),
    tmpl('Well Purification', 'Something has tainted the water at {env}. Investigate.', 'pastoral', ['Sludge Slime', 'Water Imp', 'Toxic Frog']),
    tmpl('Mushroom Hunt', 'Gather magical mushrooms from {env}. Don\'t eat the wrong ones.', 'dungeon', ['Spore Walker', 'Myconid', 'Cave Bat']),
    tmpl('Scarecrow Vigil', 'Guard the harvest at {env} through the night.', 'pastoral', ['Night Crow', 'Shadow Rat', 'Field Imp']),
    tmpl('Bridge Repair', 'Fix the bridge at {env} while dealing with territorial creatures.', 'wilderness', ['River Troll Runt', 'Mud Crab', 'Swamp Lizard']),
    tmpl('Fetch Quest', 'Retrieve a lost heirloom from somewhere in {env}.', 'dungeon', ['Tomb Rat', 'Cobweb Spider', 'Dust Phantom']),
    tmpl('Stray Dog Roundup', 'Wild dogs are scaring villagers near {env}. Herd them away.', 'pastoral', ['Feral Dog', 'Pack Leader', 'Rabid Hound']),
    tmpl('Campsite Defense', 'Travelers need protection at {env} overnight.', 'wilderness', ['Night Goblin', 'Shadow Stalker', 'Dire Bat']),
    tmpl('Cart Recovery', 'A merchant\'s cart broke down in {env}. Guard it during repairs.', 'wilderness', ['Bandit Thief', 'Road Goblin', 'Hungry Wolf']),
    tmpl('Mine Inspection', 'Check on the old mine at {env}. Report what you find.', 'dungeon', ['Cave Beetle', 'Rock Golem Shard', 'Mine Bat']),
    tmpl('Pest Control', 'Strange insects are swarming at {env}. Deal with the source.', 'pastoral', ['Giant Ant', 'Wasp Queen', 'Beetle Swarm']),
    tmpl('Graveyard Watch', 'Something is disturbing graves near {env}. Stand guard.', 'haunted', ['Zombie', 'Skeletal Hand', 'Grave Imp']),
    tmpl('Firewood Run', 'Gather firewood from {env} — but the forest fights back.', 'wilderness', ['Thorn Vine', 'Angry Stump', 'Forest Sprite']),
  ],
  E: [
    tmpl('Goblin Cave Clearance', 'A goblin tribe has claimed {env}. Clear them out.', 'dungeon', ['Goblin Warrior', 'Goblin Shaman', 'Goblin Chieftain']),
    tmpl('Wolf Pack Terror', 'Dire wolves are hunting near {env}. End the threat.', 'wilderness', ['Dire Wolf', 'Shadow Wolf', 'Alpha Wolf']),
    tmpl('Haunted Farmhouse', 'Undead have risen at {env}. Cleanse them.', 'haunted', ['Skeleton', 'Restless Spirit', 'Ghostly Knight']),
    tmpl('Bandit Ambush', 'Bandits are waylaying travelers near {env}. Set a trap.', 'wilderness', ['Bandit Scout', 'Bandit Brute', 'Bandit Captain']),
    tmpl('Cave Bear Hunt', 'A massive cave bear has made {env} its den.', 'dungeon', ['Cave Bear Cub', 'Cave Bear', 'Great Cave Bear']),
    tmpl('Poison Swamp', 'Toxic creatures breed in {env}. Purge them.', 'wilderness', ['Poison Frog', 'Bog Lurker', 'Swamp Hydra']),
    tmpl('Smuggler\'s Tunnel', 'Shut down the smuggler operation hidden in {env}.', 'dungeon', ['Smuggler', 'Smuggler Guard', 'Tunnel Boss']),
    tmpl('Spirit Binding', 'A restless spirit haunts {env}. Put it to rest.', 'haunted', ['Wisp', 'Poltergeist', 'Wrathful Spirit']),
    tmpl('Orc Raiding Party', 'Orcs from {env} are raiding nearby farms.', 'fortress', ['Orc Scout', 'Orc Berserker', 'Orc Warleader']),
    tmpl('Merchant Rescue', 'A merchant caravan was attacked near {env}. Find survivors.', 'wilderness', ['Highway Bandit', 'Bandit Archer', 'Warg Rider']),
    tmpl('Undead Patrol', 'Skeletons are wandering out of {env} at night.', 'haunted', ['Skeleton Archer', 'Skeleton Warrior', 'Bone Knight']),
    tmpl('Mine Collapse Rescue', 'Miners are trapped in {env}. Clear the debris and monsters.', 'dungeon', ['Rock Elemental', 'Cave-in Slime', 'Underground Worm']),
    tmpl('Cursed Idol', 'A cursed artifact was found in {env}. Destroy it safely.', 'haunted', ['Cursed Guardian', 'Shadow Wisp', 'Idol Golem']),
    tmpl('River Monster', 'Something large lurks in the water near {env}.', 'wilderness', ['River Serpent', 'Giant Crayfish', 'Water Elemental']),
    tmpl('Watchtower Defense', 'Hold the watchtower at {env} against a monster wave.', 'fortress', ['Goblin Siege', 'Orc Raider', 'Battering Troll']),
    tmpl('Treasure Map', 'Follow a treasure map leading to {env}. Beware guardians.', 'dungeon', ['Trap Golem', 'Chest Mimic', 'Treasure Guardian']),
    tmpl('Dark Ritual', 'Cultists are performing a ritual in {env}. Stop them.', 'haunted', ['Cultist', 'Dark Acolyte', 'Summoned Imp']),
    tmpl('Wyvern Nest Raid', 'Raid the wyvern nesting ground at {env} for eggs.', 'mountain', ['Wyvern Hatchling', 'Wyvern Nestguard', 'Cliff Raptor']),
    tmpl('Arena Challenge', 'Prove your worth in the combat arena at {env}.', 'fortress', ['Arena Gladiator', 'Arena Champion', 'Beast Master']),
    tmpl('Blight Cleansing', 'A dark blight is spreading from {env}. Burn it out.', 'wilderness', ['Blighted Wolf', 'Corrupted Treant', 'Blight Core']),
  ],
  D: [
    tmpl('Iron Tomb Dungeon', 'Explore and clear the dungeon at {env}.', 'dungeon', ['Skeleton Knight', 'Iron Golem', 'Ancient Lich']),
    tmpl('Bandit King\'s Stronghold', 'A bandit lord has fortified {env}. Rout him.', 'fortress', ['Bandit Thug', 'Bandit Lieutenant', 'The Bandit King']),
    tmpl('Dragon Wyrmling', 'A young dragon has been spotted near {env}. Drive it off.', 'mountain', ['Fire Wyrmling', 'Ash Elemental', 'Drake Scout']),
    tmpl('Necromancer\'s Tower', 'A necromancer raises the dead from {env}.', 'haunted', ['Zombie Horde', 'Death Knight', 'Necromancer']),
    tmpl('Orc Fortress', 'The orc warlord at {env} must be defeated.', 'fortress', ['Orc Elite', 'Orc Mage', 'Orc Warlord']),
    tmpl('Crystal Caves', 'Magical crystals at {env} have awakened dangerous guardians.', 'dungeon', ['Crystal Golem', 'Gem Elemental', 'Crystal Dragon']),
    tmpl('Sea Monster Hunt', 'A sea creature terrorizes the coast near {env}.', 'wilderness', ['Sea Serpent', 'Kraken Tentacle', 'Leviathan Scout']),
    tmpl('Plague Crypt', 'A plague originates from {env}. Find and destroy the source.', 'haunted', ['Plague Zombie', 'Pestilence Wraith', 'Plague Bearer']),
    tmpl('Dwarven Ruins', 'Ancient dwarven constructs have reactivated in {env}.', 'dungeon', ['Steam Golem', 'Clockwork Sentinel', 'Forge Guardian']),
    tmpl('Chimera Sighting', 'A chimera lurks at {env}. Slay the beast.', 'mountain', ['Chimera Spawn', 'Chimera', 'Greater Chimera']),
    tmpl('Slavers\' Den', 'Free the captives from the slavers at {env}.', 'fortress', ['Slaver Guard', 'Slaver Captain', 'Pit Fighter']),
    tmpl('Elemental Nexus', 'Elemental forces clash at {env}. Restore balance.', 'wilderness', ['Fire Elemental', 'Ice Elemental', 'Storm Elemental']),
    tmpl('Undead Siege', 'An army of undead marches on {env}. Hold the line.', 'haunted', ['Skeleton Legion', 'Death Knight', 'Lich Commander']),
    tmpl('Mountain Pass', 'Clear the monster-infested pass at {env}.', 'mountain', ['Mountain Troll', 'Rock Drake', 'Snow Harpy']),
    tmpl('Pirate Cove', 'Pirates operate from {env}. Shut them down.', 'fortress', ['Pirate Swabber', 'Pirate Gunner', 'Pirate Captain']),
    tmpl('Fungal Labyrinth', 'A massive fungal growth at {env} harbors dark things.', 'dungeon', ['Spore Giant', 'Fungal Hydra', 'Myconid Lord']),
    tmpl('Shadow Rift', 'A shadow rift has opened at {env}. Seal it.', 'haunted', ['Shadow Beast', 'Void Stalker', 'Shadow Lord']),
    tmpl('Gladiator Tournament', 'Win the grand tournament at {env}.', 'fortress', ['Champion Fighter', 'Battle Mage', 'Grand Champion']),
    tmpl('Golem Workshop', 'Runaway golems from {env} threaten the region.', 'dungeon', ['Clay Golem', 'Stone Golem', 'Mithril Golem']),
    tmpl('Harpy\'s Roost', 'Harpies nesting at {env} are abducting travelers.', 'mountain', ['Harpy Scout', 'Harpy Matriarch', 'Storm Harpy']),
  ],
  C: [
    tmpl('Troll Bridge Menace', 'Stone trolls blockade {env}. Remove them.', 'wilderness', ['Stone Troll', 'Elder Stone Troll']),
    tmpl('Cursed Forest', 'A dark curse has twisted {env}. Purge it.', 'haunted', ['Corrupted Treant', 'Shadow Stalker', 'Corrupted Dryad']),
    tmpl('Vampire\'s Castle', 'A vampire lord holds court at {env}.', 'haunted', ['Vampire Spawn', 'Blood Knight', 'Vampire Lord']),
    tmpl('Giant\'s Causeway', 'Giants have claimed {env} and demand tribute.', 'mountain', ['Hill Giant', 'Frost Giant', 'Giant Chieftain']),
    tmpl('Dragon\'s Hoard', 'A dragon guards a legendary treasure at {env}.', 'mountain', ['Young Dragon', 'Drake Guardian', 'Fire Drake']),
    tmpl('Dark Elf Raid', 'Dark elves strike from {env} under moonlight.', 'dungeon', ['Dark Elf Assassin', 'Dark Elf Mage', 'Dark Elf Matron']),
    tmpl('Kraken Bay', 'A kraken terrorizes the harbor near {env}.', 'wilderness', ['Kraken Arm', 'Sea Drake', 'The Kraken']),
    tmpl('Golem Army', 'An army of golems marches from {env}.', 'dungeon', ['Iron Golem', 'Adamantine Golem', 'Golem Commander']),
    tmpl('Lich\'s Phylactery', 'Destroy the lich\'s phylactery hidden in {env}.', 'haunted', ['Undead Dragon', 'Death Priest', 'Ancient Lich']),
    tmpl('Wyvern Nest', 'Multiple wyverns nest at {env}. Thin their numbers.', 'mountain', ['Wyvern Pack', 'Elder Wyvern', 'Wyvern Queen']),
    tmpl('Siege Breaker', 'Break the enemy siege at {env}.', 'fortress', ['Siege Golem', 'War Elephant', 'Enemy General']),
    tmpl('Ancient Temple', 'Explore the sealed temple at {env}.', 'dungeon', ['Temple Guardian', 'Ancient Construct', 'Divine Sentinel']),
    tmpl('Beastmaster\'s Arena', 'Face captured monsters in the arena at {env}.', 'fortress', ['War Bear', 'Manticore', 'Behemoth']),
    tmpl('Corrupted Lake', 'Purify the corrupted waters of {env}.', 'wilderness', ['Water Hydra', 'Corrupted Elemental', 'Lake Serpent']),
    tmpl('Demon Outpost', 'Demons have established a foothold at {env}.', 'demonic', ['Imp Swarm', 'Demon Soldier', 'Demon Lieutenant']),
    tmpl('Thunderspire', 'A tower crackling with lightning at {env} threatens the land.', 'mountain', ['Lightning Elemental', 'Storm Golem', 'Thunder Lord']),
    tmpl('Phantom Ship', 'A ghost ship haunts the waters near {env}.', 'haunted', ['Ghost Pirate', 'Spectral Captain', 'The Flying Dutchman']),
    tmpl('War Hydra', 'A massive hydra lairs at {env}. Cut it down.', 'wilderness', ['Hydra Head', 'Swamp Hydra', 'King Hydra']),
    tmpl('Underdark Breach', 'Creatures from the Underdark pour from {env}.', 'dungeon', ['Drider', 'Mind Flayer', 'Underdark Abomination']),
    tmpl('Frost Wyrm', 'A frost wyrm has frozen {env} solid.', 'mountain', ['Ice Elemental', 'Frost Drake', 'Frost Wyrm']),
  ],
  B: [
    tmpl('Dragon\'s Foothold', 'A young wyvern claims {env}. Slay it.', 'mountain', ['Mountain Drake', 'Wyvern Hatchling', 'Young Wyvern']),
    tmpl('Demon General', 'A demon general commands forces at {env}.', 'demonic', ['Demon Elite', 'Hellfire Mage', 'Demon General']),
    tmpl('Elder Dragon', 'An elder dragon nests at {env}.', 'mountain', ['Dragon Wyrmling', 'Adult Dragon', 'Elder Dragon']),
    tmpl('Abyssal Portal', 'Seal the abyssal portal at {env} before more demons arrive.', 'demonic', ['Abyssal Fiend', 'Void Walker', 'Portal Guardian']),
    tmpl('Ancient War Machine', 'A war machine from a forgotten age activates at {env}.', 'fortress', ['War Drone', 'Siege Engine', 'The Colossus']),
    tmpl('Titan\'s Prison', 'A titan stirs in its prison at {env}.', 'dungeon', ['Titan Shard', 'Titan Guardian', 'Chained Titan']),
    tmpl('Shadow Realm Incursion', 'The shadow realm bleeds into {env}.', 'haunted', ['Shadow Dragon', 'Void Knight', 'Shadow Overlord']),
    tmpl('Elemental Rift', 'Four elemental lords wage war at {env}.', 'wilderness', ['Fire Lord', 'Ice Queen', 'Storm King']),
    tmpl('Vampire Lord\'s Domain', 'The ancient vampire lord of {env} must fall.', 'haunted', ['Vampire Noble', 'Blood Dragon', 'Ancient Vampire']),
    tmpl('Phoenix Nest', 'A rampaging phoenix burns everything near {env}.', 'mountain', ['Fire Bird', 'Ash Phoenix', 'Eternal Phoenix']),
    tmpl('Giant King', 'The king of giants rallies his army at {env}.', 'mountain', ['Storm Giant', 'Fire Giant', 'Giant King']),
    tmpl('Mind Flayer Hive', 'A mind flayer colony festers at {env}.', 'dungeon', ['Mind Flayer', 'Elder Brain Spawn', 'Hive Mind']),
    tmpl('Chaos Knight', 'A chaos knight and their warband terrorize {env}.', 'fortress', ['Chaos Warrior', 'Chaos Mage', 'Chaos Knight']),
    tmpl('Medusa\'s Lair', 'A medusa has turned {env} to stone.', 'dungeon', ['Stone Basilisk', 'Petrified Knight', 'Medusa']),
    tmpl('Demon Forge', 'Demons forge weapons of war at {env}.', 'demonic', ['Forge Demon', 'Infernal Smith', 'Forge Master']),
    tmpl('World Tree Blight', 'A blight threatens the world tree near {env}.', 'wilderness', ['Blight Dragon', 'Corrupted Ent', 'Blight Mother']),
    tmpl('Lich King\'s Army', 'The lich king marshals undead at {env}.', 'haunted', ['Death Knight Champion', 'Spectral Army', 'Lich King General']),
    tmpl('Celestial Gate', 'Fallen celestials guard {env}.', 'mountain', ['Fallen Angel', 'Corrupted Seraph', 'Dark Celestial']),
    tmpl('Leviathan\'s Wake', 'A leviathan surfaces near {env}.', 'wilderness', ['Leviathan Spawn', 'Sea Titan', 'The Leviathan']),
    tmpl('Doom Fortress', 'Storm the fortress of doom at {env}.', 'fortress', ['Doom Knight', 'Infernal War Engine', 'Lord of Doom']),
  ],
  A: [
    tmpl('Demon Gate Incursion', 'A dimensional rift has opened at {env}. Seal it.', 'demonic', ['Lesser Demon', 'Hellfire Imp', 'Demon Commander']),
    tmpl('Celestial War', 'Warring celestials threaten to destroy {env}.', 'mountain', ['War Angel', 'Divine Beast', 'Celestial Warlord']),
    tmpl('World Serpent', 'The world serpent stirs beneath {env}.', 'wilderness', ['Serpent Cult', 'World Serpent Fragment', 'The World Serpent']),
    tmpl('Archmage\'s Sanctum', 'A mad archmage threatens reality from {env}.', 'dungeon', ['Arcane Construct', 'Reality Warper', 'The Mad Archmage']),
    tmpl('Titan Awakening', 'An ancient titan rises from {env}.', 'mountain', ['Titan Fragment', 'Titan\'s Herald', 'The Awakened Titan']),
    tmpl('Demon Prince', 'A demon prince claims {env} as their domain.', 'demonic', ['Demon Honor Guard', 'Abyssal Champion', 'Demon Prince']),
    tmpl('Dragon Council', 'Three ancient dragons convene at {env}.', 'mountain', ['Ancient Red Dragon', 'Ancient Blue Dragon', 'Dragon Council']),
    tmpl('Void Breach', 'The void itself tears open at {env}.', 'demonic', ['Void Spawn', 'Reality Rift', 'Void Entity']),
    tmpl('Undying Emperor', 'An undying emperor commands legions from {env}.', 'haunted', ['Imperial Death Guard', 'Spectral Legion', 'The Undying Emperor']),
    tmpl('Elemental Catastrophe', 'Elemental chaos erupts at {env}.', 'wilderness', ['Primordial Fire', 'Primordial Ice', 'Elemental Catastrophe']),
    tmpl('World Eater', 'A creature that devours worlds awakens at {env}.', 'demonic', ['World Eater Spawn', 'Devourer Fragment', 'The World Eater']),
    tmpl('Time Rift', 'A time rift at {env} brings ancient horrors forward.', 'dungeon', ['Temporal Beast', 'Time Wraith', 'Chrono Dragon']),
    tmpl('Corrupted God', 'A minor deity has been corrupted at {env}.', 'haunted', ['Divine Corruption', 'Fallen Herald', 'The Corrupted One']),
    tmpl('Siege of Worlds', 'An army from another realm invades {env}.', 'fortress', ['Otherworld Soldier', 'Realm Knight', 'Invasion Commander']),
    tmpl('Behemoth Hunt', 'A world-class behemoth ravages {env}.', 'wilderness', ['Behemoth Calf', 'Adult Behemoth', 'Ancient Behemoth']),
    tmpl('Infernal Tower', 'A tower of hellfire rises at {env}.', 'demonic', ['Infernal Golem', 'Hellfire Lord', 'Tower Overlord']),
    tmpl('Ancient Weapon', 'An ancient superweapon activates at {env}.', 'fortress', ['Weapon Drone', 'Arsenal Guardian', 'The Final Weapon']),
    tmpl('Plague of Ages', 'An ancient plague deity stirs at {env}.', 'haunted', ['Plague Herald', 'Pestilence Lord', 'Plague God Avatar']),
    tmpl('Storm Titan', 'A storm titan rages across {env}.', 'mountain', ['Thunder Elemental', 'Storm Herald', 'Storm Titan']),
    tmpl('Blood Moon', 'The blood moon empowers dark forces at {env}.', 'haunted', ['Blood Golem', 'Crimson Knight', 'Blood Moon Avatar']),
  ],
  S: [
    tmpl('The Demon King', 'The Demon King stirs at {env}. Legends are made here.', 'demonic', ['Demon Elite Guard', 'Arch-Demon', 'The Demon King']),
    tmpl('End of All Things', 'Reality collapses at {env}. Save everything.', 'demonic', ['Entropy Spawn', 'Void Emperor', 'The End']),
    tmpl('God Slayer', 'A corrupted god descends upon {env}.', 'mountain', ['Divine Avatar', 'God\'s Wrath', 'The Fallen God']),
    tmpl('Ragnarok', 'The final battle begins at {env}.', 'demonic', ['World Serpent', 'Fire Giant King', 'Ragnarok Incarnate']),
    tmpl('Primordial Dragon', 'The first dragon, born before time, awakens at {env}.', 'mountain', ['Dragon God Fragment', 'Primordial Wing', 'The First Dragon']),
    tmpl('Abyss Walker', 'Walk the Abyss at {env} and survive.', 'demonic', ['Abyss Horror', 'Void Leviathan', 'The Abyss Itself']),
    tmpl('Cosmic Entity', 'A cosmic entity turns its gaze to {env}.', 'demonic', ['Star Fragment', 'Cosmic Horror', 'The Entity']),
    tmpl('Fate\'s Challenge', 'Challenge fate itself at {env}.', 'haunted', ['Thread of Fate', 'Fate Weaver', 'Fate Incarnate']),
    tmpl('Heaven\'s Fall', 'The celestial realm crashes into {env}.', 'mountain', ['Fallen Seraph Army', 'Archangel', 'God of War']),
    tmpl('Infinite Dungeon', 'The Infinite Dungeon at {env} has no end. Go as deep as you dare.', 'dungeon', ['Dungeon Core', 'Floor Boss', 'The Infinite']),
    tmpl('Shadow King', 'The Shadow King emerges from {env} to consume the light.', 'haunted', ['Shadow Army', 'Eclipse Knight', 'The Shadow King']),
    tmpl('Time Lord', 'A lord of time rewrites history from {env}.', 'dungeon', ['Temporal Knight', 'Chrono Lord', 'The Time Weaver']),
    tmpl('World Forge', 'Reforge the world at {env} or watch it crumble.', 'demonic', ['Forge Titan', 'Anvil God', 'World Forge Guardian']),
    tmpl('Phoenix Emperor', 'The immortal Phoenix Emperor rises at {env}.', 'mountain', ['Phoenix Legion', 'Eternal Phoenix', 'Phoenix Emperor']),
    tmpl('Void Mother', 'The mother of all void creatures awakens at {env}.', 'demonic', ['Void Brood', 'Null Dragon', 'The Void Mother']),
    tmpl('Dream Eater', 'A Dream Eater devours minds from {env}.', 'haunted', ['Nightmare Beast', 'Dream Wraith', 'The Dream Eater']),
    tmpl('Chaos Incarnate', 'Pure chaos manifests at {env}.', 'demonic', ['Chaos Spawn', 'Chaos Lord', 'Chaos Incarnate']),
    tmpl('The Last Quest', 'There is only one quest left. It awaits at {env}.', 'demonic', ['Memory of Heroes Past', 'The Final Guardian', 'Destiny Itself']),
    tmpl('Elemental Apocalypse', 'All elements converge at {env} in catastrophe.', 'wilderness', ['Primal Fire', 'Primal Storm', 'Elemental Apocalypse']),
    tmpl('The Final Trial', 'The world demands a final trial at {env}.', 'demonic', ['Trial Champion', 'World Spirit', 'The Summoner']),
  ],
};

// ── Rank-based reward scaling ───────────────────────────────────────────

// Base scales — these define the FLOOR for each rank.
// Quest power is dynamically scaled up based on actual party strength.
const RANK_SCALES = {
  F: { gold:[10,50],    exp:[12,35],  rp:[25,60],      dur:[15,20],   diff:[0.4,1.0],  recPow:[12,30] },
  E: { gold:[50,180],   exp:[35,80],  rp:[75,175],     dur:[20,30],   diff:[1.0,2.0],  recPow:[40,75] },
  D: { gold:[180,500],  exp:[80,200], rp:[225,450],    dur:[25,35],   diff:[2.0,3.5],  recPow:[100,180] },
  C: { gold:[400,1200], exp:[180,420],rp:[400,1000],   dur:[30,40],   diff:[3.0,5.0],  recPow:[200,400] },
  B: { gold:[1200,3000],exp:[400,900],rp:[1000,2250],  dur:[35,50],   diff:[5.0,8.0],  recPow:[400,700] },
  A: { gold:[3000,10000],exp:[800,2500],rp:[2000,5000],dur:[40,55],  diff:[8.0,14.0], recPow:[700,1200] },
  S: { gold:[15000,35000],exp:[3000,8000],rp:[7500,15000],dur:[50,60],diff:[14.0,22.0],recPow:[1400,2200] },
};

// Loot table definitions per rank
const RANK_LOOT_POOLS = {
  F: ['SLIME_JELLY', 'WOLF_PELT', 'GOBLIN_EAR', 'WORN_SWORD', 'RUSTY_BROADSWORD', 'BLUNT_SHIV', 'RUSTY_FLAIL', 'WOODEN_MACE', 'RUSTY_DAGGER', 'WRAPPED_FIST', 'BAMBOO_STAFF', 'SHORT_BOW', 'WILLOW_WAND', 'WORN_LUTE', 'CRACKED_DRUM', 'RUSTY_MAIL', 'LIGHT_CHAIN', 'THIN_VEST', 'ROUGH_TUNIC', 'TATTERED_ROBES', 'WOOL_ROBES', 'WOODEN_BUCKLER', 'GLASS_ORB', 'WOODEN_ORB', 'LEATHER_BAND', 'WOODEN_CHARM', 'CRYSTAL_SHARD', 'BLESSED_TOKEN'],
  E: ['GOBLIN_EAR', 'WOLF_PELT', 'SKELETON_BONE', 'IRON_SWORD', 'IRON_BROADSWORD', 'IRON_GREATSWORD', 'IRON_FLAIL', 'IRON_MACE', 'STEEL_DAGGER', 'IRON_CLAW', 'OAK_STAFF', 'HUNTING_BOW', 'APPRENTICE_STAFF', 'BLESSED_STAFF', 'SILVER_LUTE', 'IRON_DRUM', 'HEAVY_MAIL', 'PADDED_CHAIN', 'LEATHER_VEST', 'CLOTH_ROBES', 'BLESSED_ROBES', 'MONKS_ROBE', 'WOODEN_SHIELD', 'IRON_BUCKLER', 'FOCUS_ORB', 'BLESSED_ORB', 'LUCKY_CHARM', 'SWIFT_RING', 'POWER_RING', 'MANA_RING', 'WARD_RING', 'IRON_AMULET', 'VITALITY_PENDANT'],
  D: ['SKELETON_BONE', 'BANDIT_MASK', 'MANA_CRYSTAL', 'STEEL_SWORD', 'STEEL_BROADSWORD', 'STEEL_GREATSWORD', 'STEEL_FLAIL', 'STEEL_MACE', 'VENOM_FANG', 'STEEL_CLAW', 'HARDWOOD_BO', 'COMPOSITE_BOW', 'MAGE_STAFF', 'CRYSTAL_STAFF', 'ENCHANTED_LUTE', 'WAR_DRUM', 'IRON_PLATE', 'FORTRESS_PLATE', 'CHAINMAIL', 'REINFORCED_CHAIN', 'HARDENED_LEATHER', 'MAGE_ROBES', 'WARD_ROBES', 'IRON_SHIELD', 'TOWER_SHIELD', 'CRYSTAL_ORB', 'HOLY_ORB', 'VITALITY_AMULET', 'POWER_STONE', 'WARRIOR_PENDANT', 'ARCANE_PENDANT', 'HOLY_PENDANT'],
  C: ['OGRE_TOOTH', 'MANA_CRYSTAL', 'MYTHRIL_BLADE', 'GUARDIAN_BLADE', 'FLAMBERGE', 'TEMPLARS_FLAIL', 'BLESSED_MACE', 'SHADOW_EDGE', 'DRAGON_CLAW', 'CELESTIAL_BO', 'STORMREND_BOW', 'ARCHMAGE_STAFF', 'DIVINE_STAFF', 'SIREN_HARP', 'THUNDERDRUM', 'TEMPLAR_PLATE', 'STEEL_PLATE', 'SHADOW_CHAIN', 'STEEL_CHAIN', 'ADAMANT_CHAIN', 'TIGER_HIDE', 'STONE_SKIN_VEST', 'ARCANE_VESTMENTS', 'SANCTIFIED_VESTMENTS', 'TOWER_SHIELD', 'SPIKED_SHIELD', 'VOID_ORB'],
  B: ['DRAGON_SCALE', 'MANA_CRYSTAL', 'EXCALIBUR', 'OATHKEEPER', 'RAGNAROK', 'JUDGEMENT', 'SANCTUM_HAMMER', 'DEATHS_WHISPER', 'ASURA_CLAW', 'RUYI_JINGU', 'ARTEMIS_BOW', 'STAFF_OF_AGES', 'STAFF_OF_DAWN', 'ORPHEUS_LYRE', 'DRUMS_OF_ETERNITY', 'MYTHRIL_PLATE', 'ADAMANTINE_PLATE', 'DRAGON_PLATE', 'PHANTOM_CHAIN', 'CELESTIAL_CHAIN', 'MYTHRIL_CHAIN', 'DRAGON_GI', 'NIRVANA_SHROUD', 'CELESTIAL_ROBES', 'ROBES_OF_ETERNITY', 'MYTHRIL_SHIELD', 'AEGIS', 'WALL_OF_AGES', 'ORB_OF_ETERNITY', 'ORB_OF_CREATION', 'AMULET_OF_FURY', 'AMULET_OF_AGES', 'AMULET_OF_ARCANA', 'AMULET_OF_GRACE'],
  A: ['DRAGON_SCALE', 'MANA_CRYSTAL', 'EXCALIBUR', 'OATHKEEPER', 'DEATHS_WHISPER', 'RAGNAROK', 'ARTEMIS_BOW', 'STAFF_OF_AGES', 'ORPHEUS_LYRE', 'DRAGON_PLATE', 'ADAMANTINE_PLATE', 'PHANTOM_CHAIN', 'DRAGON_GI', 'CELESTIAL_ROBES', 'AEGIS', 'ORB_OF_ETERNITY', 'AMULET_OF_FURY', 'AMULET_OF_ARCANA'],
  S: ['DRAGON_SCALE', 'MANA_CRYSTAL'],
};

const SUCCESS_NARRATIVES = [
  "The party emerged victorious, battered but triumphant.",
  "A hard-fought victory. The tales of this battle will echo in the guild halls.",
  "The enemy fell before the party's combined might.",
  "Against all odds, the party prevailed. A worthy conquest.",
  "The battlefield fell silent. Only the party remained standing.",
];
const FAILURE_NARRATIVES = [
  "The enemy proved too powerful. A tactical retreat was necessary.",
  "Overwhelmed and outmatched, the party withdrew to fight another day.",
  "The party underestimated their foe. They retreated with wounds and wisdom.",
];

// ── Quest Instance Generation ──────────────────────────────────────────

let _questSeed = Date.now();
function nextSeed() { return _questSeed++; }

function seededRand(seed) {
  let x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function seededRandInt(min, max, seed) {
  return Math.floor(seededRand(seed) * (max - min + 1)) + min;
}

function seededPick(arr, seed) {
  return arr[Math.floor(seededRand(seed) * arr.length)];
}

// Scale quest power based on how strong the party is relative to base quest range.
// Returns a multiplier >= 1.0 that brings quests in line with party progression.
function partyScalingMultiplier(partyStrength, rank) {
  if (!partyStrength || partyStrength <= 0) return 1.0;
  const scale = RANK_SCALES[rank];
  if (!scale) return 1.0;
  const baseMax = scale.recPow[1]; // top end of the rank's base power
  if (partyStrength <= baseMax * 1.5) return 1.0; // party is within expected range
  // Scale up so base quests sit around 55-80% of party power.
  // Standard quests land Easy→Moderate, harder slots push into Hard→Epic.
  const target = partyStrength * 0.85; // aim for ~85% of party strength as midpoint
  return Math.min(10.0, target / baseMax); // cap at 10x
}

export function generateQuestInstance(rank, templateIndex, seed, partyStrength) {
  const templates = QUEST_TEMPLATES[rank];
  if (!templates || templateIndex >= templates.length) return null;

  const t = templates[templateIndex];
  const scale = RANK_SCALES[rank];
  const envPool = ENVIRONMENTS[t.mood] || ENVIRONMENTS.dungeon;
  const envName = seededPick(envPool, seed);
  const envIcon = ENV_ICONS[t.mood] || '?';

  // Party-adaptive scaling — scales quest power up when party outgrows base range
  const pScale = partyScalingMultiplier(partyStrength || 0, rank);

  // Randomize rewards within rank range (rewards also scale with difficulty)
  const rewardScale = 1.0 + (pScale - 1.0) * 0.5; // rewards scale at half the rate of difficulty
  const goldMin = Math.floor(seededRandInt(scale.gold[0], Math.floor(scale.gold[1] * 0.6), seed + 1) * rewardScale);
  const goldMax = Math.floor(seededRandInt(Math.floor(scale.gold[1] * 0.6), scale.gold[1], seed + 2) * rewardScale);
  const expMin = Math.floor(seededRandInt(scale.exp[0], Math.floor(scale.exp[1] * 0.6), seed + 3) * rewardScale);
  const expMax = Math.floor(seededRandInt(Math.floor(scale.exp[1] * 0.6), scale.exp[1], seed + 4) * rewardScale);
  const rp = Math.floor(seededRandInt(scale.rp[0], scale.rp[1], seed + 5) * rewardScale);
  const dur = seededRandInt(scale.dur[0], scale.dur[1], seed + 6);
  const baseDiff = scale.diff[0] + seededRand(seed + 7) * (scale.diff[1] - scale.diff[0]);
  const diff = baseDiff * pScale;
  const baseRecPow = seededRandInt(scale.recPow[0], scale.recPow[1], seed + 8);
  const recPow = Math.floor(baseRecPow * pScale);

  // Determine rarity — stronger parties see more rare/legendary quests
  // Base: ~40% common, ~30% uncommon, ~20% rare, ~10% legendary
  // Scaled: common shrinks, rare/legendary grow as pScale increases
  const rarityRoll = seededRand(seed + 50);
  const rarityShift = Math.min(0.3, (pScale - 1.0) * 0.08); // up to +30% shift towards rarer
  let rarity = 'common';
  if (rarityRoll > 0.9 - rarityShift * 2)  { rarity = 'legendary'; }
  else if (rarityRoll > 0.7 - rarityShift)  { rarity = 'rare'; }
  else if (rarityRoll > 0.4)                { rarity = 'uncommon'; }

  // Rarity multiplier for rewards and difficulty
  const rarityMult = rarity === 'legendary' ? 1.5 : rarity === 'rare' ? 1.25 : rarity === 'uncommon' ? 1.1 : 1.0;

  // Build loot table — rarer quests get more entries and better base drop chances
  const lootPool = RANK_LOOT_POOLS[rank] || [];
  const rarityLootBonus = rarity === 'legendary' ? 3 : rarity === 'rare' ? 2 : rarity === 'uncommon' ? 1 : 0;
  const lootCountMin = 2 + Math.floor(rarityLootBonus / 2);
  const lootCountMax = Math.min(4 + rarityLootBonus, lootPool.length);
  const lootCount = seededRandInt(lootCountMin, Math.max(lootCountMin, lootCountMax), seed + 9);
  const shuffled = [...lootPool].sort((a, b) => seededRand(seed + 10 + lootPool.indexOf(a)) - seededRand(seed + 10 + lootPool.indexOf(b)));
  const lootTable = shuffled.slice(0, lootCount).map((itemId, i) => {
    const isEquip = !!EQUIPMENT[itemId];
    // Rarer quests boost equipment drop chances significantly
    const rarityDropMult = rarity === 'legendary' ? 2.0 : rarity === 'rare' ? 1.5 : rarity === 'uncommon' ? 1.2 : 1.0;
    const baseChance = isEquip
      ? (0.08 + seededRand(seed + 20 + i) * 0.15) * rarityDropMult
      : 0.30 + seededRand(seed + 30 + i) * 0.50;
    return {
      itemId,
      chance: Math.min(0.90, baseChance),
      quantity: isEquip ? [1, 1] : [1, seededRandInt(1, 4, seed + 40 + i)],
    };
  });

  const id = `${rank}_GEN_${templateIndex}_${seed}`;
  const description = t.desc.replace('{env}', envName);

  return {
    id,
    rank,
    title: t.title,
    description,
    environment: { name: envName, icon: envIcon, mood: t.mood },
    enemies: t.enemies,
    duration: dur,
    difficulty: Math.round(diff * rarityMult * 100) / 100,
    recommendedPower: Math.floor(recPow * rarityMult),
    goldReward: { min: Math.floor(goldMin * rarityMult), max: Math.floor(goldMax * rarityMult) },
    expReward: { min: Math.floor(expMin * rarityMult), max: Math.floor(expMax * rarityMult) },
    rankPointReward: Math.floor(rp * rarityMult),
    lootTable,
    requiredGuildRank: rank,
    isRepeatable: true,
    rarity,
    templateIndex,
    narratives: {
      success: SUCCESS_NARRATIVES,
      failure: FAILURE_NARRATIVES,
    },
  };
}

// ── Quest Board Management ─────────────────────────────────────────────
// Generates and manages the rotating set of available quests

const BOARD_SIZE = 5; // quests available per rank
const BOARD_REFRESH_MS = 15 * 60 * 1000; // 15 minutes

export function generateQuestBoard(rank, partyStrength, seed) {
  const templates = QUEST_TEMPLATES[rank];
  if (!templates) return [];

  // Pick BOARD_SIZE templates: 3 at-level, 1-2 harder
  const indices = [];
  const used = new Set();

  // First, pick 3 quests that should be at-level (moderate difficulty)
  let attempts = 0;
  while (indices.length < 3 && attempts < 50) {
    const idx = Math.floor(seededRand(seed + attempts) * templates.length);
    if (!used.has(idx)) {
      used.add(idx);
      indices.push({ idx, harder: false });
    }
    attempts++;
  }

  // Then pick 2 quests that can be harder
  attempts = 0;
  while (indices.length < BOARD_SIZE && attempts < 50) {
    const idx = Math.floor(seededRand(seed + 100 + attempts) * templates.length);
    if (!used.has(idx)) {
      used.add(idx);
      indices.push({ idx, harder: true });
    }
    attempts++;
  }

  // Generate quest instances — pass partyStrength so quests scale with the party
  return indices.map(({ idx, harder }, i) => {
    const quest = generateQuestInstance(rank, idx, seed + i * 1000, partyStrength);
    if (harder && quest) {
      // Boost difficulty by 30-80% for the harder slots (wider range for stronger parties)
      const baseBoost = 1.3 + seededRand(seed + 200 + i) * 0.5;
      const boost = baseBoost;
      quest.difficulty = Math.round(quest.difficulty * boost * 100) / 100;
      quest.recommendedPower = Math.floor(quest.recommendedPower * boost);
      quest.goldReward.min = Math.floor(quest.goldReward.min * boost);
      quest.goldReward.max = Math.floor(quest.goldReward.max * boost);
      quest.expReward.min = Math.floor(quest.expReward.min * boost);
      quest.expReward.max = Math.floor(quest.expReward.max * boost);
      quest.rankPointReward = Math.floor(quest.rankPointReward * boost);
    }
    return quest;
  }).filter(Boolean);
}

export function shouldRefreshBoard(lastRefreshed) {
  if (!lastRefreshed) return true;
  return Date.now() - lastRefreshed >= BOARD_REFRESH_MS;
}

export { BOARD_REFRESH_MS };
