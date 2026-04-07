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
    + (stats.crit || 0) * 0.8
    + (stats.dodge || 0) * 0.5;

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
    // ── Additional normal quests ──
    tmpl('Chicken Wrangler', 'Enchanted chickens escaped from {env}. Round them up before they multiply.', 'pastoral', ['Enchanted Hen', 'Rooster Fiend', 'Chicken Swarm']),
    tmpl('Ditch Digger', 'The village near {env} needs irrigation ditches — and something keeps filling them back in.', 'pastoral', ['Mud Golem', 'Burrow Worm', 'Dirt Sprite']),
    tmpl('Beehive Retrieval', 'A prized beehive was knocked into {env}. Retrieve it without getting stung to death.', 'wilderness', ['Giant Bee', 'Bee Swarm', 'Queen Hornet']),
    tmpl('Broken Signposts', 'Something keeps destroying road signs near {env}. Investigate.', 'wilderness', ['Prankster Imp', 'Wild Goat', 'Road Gremlin']),
    tmpl('Laundry Day', 'A gust carried the guild laundry into {env}. Yes, this is a real quest.', 'pastoral', ['Clothesline Bat', 'Wind Sprite', 'Sock Mimic']),
    // ── Gem Mining quests (F-rank: Rough Quartz) ──
    tmpl('Shallow Quartz Dig', 'A vein of rough quartz has been spotted at {env}. Mine it before monsters overrun the site. Bring back every crystal you can carry — quartz fetches good coin!', 'dungeon', ['Cave Beetle', 'Rock Mite', 'Crystal Slime'], { gemMining: true, gemItemId: 'GEM_ROUGH_QUARTZ' }),
    tmpl('Quartz Rush', 'Prospectors found raw quartz at {env} but fled when monsters appeared. Secure the quartz vein and haul out the gems!', 'dungeon', ['Mine Bat', 'Rubble Golem', 'Tunnel Rat'], { gemMining: true, gemItemId: 'GEM_ROUGH_QUARTZ' }),
    tmpl('Crystal Cavern Sweep', 'A cavern at {env} glitters with rough quartz formations. Clear the creatures and fill your bags with crystals!', 'dungeon', ['Quartz Crab', 'Glow Worm', 'Stalactite Lurker'], { gemMining: true, gemItemId: 'GEM_ROUGH_QUARTZ' }),
    tmpl('Quartz Escort', 'A mining crew at {env} struck quartz but needs protection while they extract it. Guard them and earn a share of the haul!', 'pastoral', ['Goblin Scavenger', 'Rock Snake', 'Dig Beetle'], { gemMining: true, gemItemId: 'GEM_ROUGH_QUARTZ' }),
    tmpl('Riverside Quartz Panning', 'Raw quartz washes downstream from {env}. Pan the riverbed — but watch for river creatures guarding the deposit!', 'wilderness', ['River Crab', 'Water Rat', 'Brook Troll'], { gemMining: true, gemItemId: 'GEM_ROUGH_QUARTZ' }),
    // ── BOSS encounters (F-rank) ──
    tmpl('BOSS: Grimjaw the Unyielding', 'A massive cave troll called Grimjaw has claimed {env} as his territory. He\'s crushed every party sent against him. This is no ordinary troll — he\'s smart, relentless, and very, very angry.', 'dungeon', ['Troll Brute', 'Cave Troll Guard', 'Grimjaw the Unyielding'], {
      boss: true, bossName: 'Grimjaw the Unyielding',
      narratives: {
        success: ["Grimjaw's roar shook the cavern as Dawnbreaker found his heart. The Unyielding finally yielded.", "It took everything the party had. Grimjaw fought like ten trolls, but in the end, even he couldn't stand against united steel."],
        failure: ["Grimjaw laughed — actually laughed — as the party retreated. His territory remains unchallenged.", "The troll's regeneration was beyond anything the party had seen. Every wound closed before the next blow could land."],
      }
    }),
    tmpl('BOSS: The Rat King', 'Something unholy lurks beneath {env}. Dozens of giant rats have fused into a single writhing abomination — the Rat King. Its many eyes see everything. Its many mouths never stop screaming.', 'dungeon', ['Rat Swarm', 'Plague Carrier', 'The Rat King'], {
      boss: true, bossName: 'The Rat King',
      narratives: {
        success: ["The Rat King burst apart when its core was pierced, showering the party in... best not to think about it. The nightmare is over.", "A hundred rats in one body. It took fire, steel, and sheer determination to end the abomination."],
        failure: ["Every rat killed just made the mass angrier. The party retreated, covered in bites, as the Rat King's screaming echoed behind them.", "The Rat King absorbed the party's attacks like a sponge. They'll need a better strategy — or a lot more fire."],
      }
    }),
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
    // ── Additional normal quests ──
    tmpl('Haunted Mill', 'The old windmill at {env} grinds flour on its own at midnight. Something isn\'t right.', 'haunted', ['Phantom Miller', 'Grain Golem', 'Flour Wraith']),
    tmpl('Tax Collector Escort', 'The crown\'s tax collector needs safe passage through {env}. Nobody likes him, including the monsters.', 'wilderness', ['Highway Thug', 'Bandit Sniper', 'Toll Troll']),
    tmpl('Ant Hill Assault', 'Giant ant colonies at {env} are eating crops and livestock. Destroy the queen.', 'wilderness', ['Giant Soldier Ant', 'Acid Spitter Ant', 'Ant Queen']),
    tmpl('Flooded Basement', 'Something dammed the river and flooded {env}. Fix it and clear the aquatic pests.', 'dungeon', ['Water Slime', 'Dam Beaver', 'Flood Elemental']),
    tmpl('Library Return', 'Overdue library books were last seen in {env}. The librarian is scarier than the monsters.', 'dungeon', ['Book Mimic', 'Ink Shade', 'Paper Golem']),
    // ── Gem Mining quests (E-rank: Amethysts) ──
    tmpl('Amethyst Mine Reclamation', 'An amethyst mine at {env} was overrun by monsters. Reclaim the mine and extract the precious purple crystals — each one worth a fortune!', 'dungeon', ['Cave Troll', 'Crystal Bat', 'Mine Golem'], { gemMining: true, gemItemId: 'GEM_AMETHYST' }),
    tmpl('Deep Amethyst Vein', 'Miners struck a deep amethyst vein at {env} but something guards it fiercely. Defeat the guardians and bring back the amethysts!', 'dungeon', ['Gem Guardian', 'Tunnel Crawler', 'Amethyst Elemental'], { gemMining: true, gemItemId: 'GEM_AMETHYST' }),
    tmpl('Amethyst Geode Hunt', 'Giant amethyst geodes have been spotted in {env}. Crack them open and collect the gems — but watch for creatures drawn to the crystals\' energy!', 'dungeon', ['Geode Crab', 'Crystal Spider', 'Stone Lurker'], { gemMining: true, gemItemId: 'GEM_AMETHYST' }),
    tmpl('Purple Vein Expedition', 'An expedition to {env} needs muscle. The amethyst veins there are legendary — and so are the monsters. Bring back the gems!', 'dungeon', ['Deep Worm', 'Ore Golem', 'Tunnel Serpent'], { gemMining: true, gemItemId: 'GEM_AMETHYST' }),
    tmpl('Amethyst Smuggler Raid', 'Smugglers are extracting amethysts from {env} illegally. Shut them down and confiscate the gems for the guild!', 'fortress', ['Smuggler Miner', 'Gem Guard', 'Smuggler Boss'], { gemMining: true, gemItemId: 'GEM_AMETHYST' }),
    // ── BOSS encounters (E-rank) ──
    tmpl('BOSS: Vexara the Hex Weaver', 'A goblin witch of terrifying power has taken over {env}. Vexara the Hex Weaver commands dark magic that no goblin should possess. Her hexes have turned entire squads against each other.', 'haunted', ['Hexed Goblin', 'Curse Totem', 'Vexara the Hex Weaver'], {
      boss: true, bossName: 'Vexara the Hex Weaver',
      narratives: {
        success: ["Vexara's final hex backfired spectacularly when the party shattered her focus crystal. She shrieked as her own curses consumed her.", "The witch threw everything she had — mind control, pain curses, shadow bindings. The party broke through every single one."],
        failure: ["The party turned on each other under Vexara's hex. By the time they broke free, she had vanished into the shadows, cackling.", "Every spell the party cast was twisted back at them. Vexara's mastery of hexcraft was beyond anything they'd prepared for."],
      }
    }),
    tmpl('BOSS: Bloodfang, Alpha of the Ironwood', 'The largest dire wolf ever recorded stalks {env}. Bloodfang has killed three adventuring parties. His pack obeys with fanatical loyalty, and his fangs can shear through plate armor.', 'wilderness', ['Shadow Wolf Elite', 'Ironwood Pack Leader', 'Bloodfang'], {
      boss: true, bossName: 'Bloodfang',
      narratives: {
        success: ["Bloodfang fought to the last breath, never retreating, never faltering. In death, the great wolf looked almost peaceful. The Ironwood is safe.", "The alpha's howl shook the trees as the party closed in. When silence finally fell, so did the king of wolves."],
        failure: ["Bloodfang's pack attacked from every direction while the alpha circled, picking off stragglers. A masterful predator.", "The party couldn't even get close. Bloodfang's speed was supernatural — there one moment, gone the next, always striking from behind."],
      }
    }),
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
    // ── Additional normal quests ──
    tmpl('Lighthouse Keeper', 'The lighthouse at {env} went dark. Relight it and deal with whatever snuffed it out.', 'wilderness', ['Storm Imp', 'Sea Wraith', 'Fog Beast']),
    tmpl('Arena Warmup', 'Compete in the preliminary bouts at {env}. Nothing too deadly... probably.', 'fortress', ['Arena Novice', 'Pit Fighter', 'Arena Beast']),
    tmpl('Cursed Well', 'Villagers near {env} are getting sick from the well. Something foul lurks below.', 'haunted', ['Well Spirit', 'Plague Leech', 'Cursed Water Elemental']),
    tmpl('Caravan Guard', 'A luxury caravan needs escort through {env}. Highwaymen and worse are expected.', 'wilderness', ['Road Agent', 'Highway Mage', 'Caravan Raider']),
    tmpl('Sewer Expedition', 'The city sewers beneath {env} are breeding something horrible. Flush it out.', 'dungeon', ['Sewer Rat King', 'Toxic Ooze', 'Sewer Gator']),
    // ── Gem Mining quests (D-rank: Sapphires) ──
    tmpl('Sapphire Deep Mine', 'The deep mines at {env} hold sapphire deposits of extraordinary quality. Fight through the guardians and extract the brilliant blue gems!', 'dungeon', ['Iron Golem', 'Crystal Wyrm', 'Mine Shade'], { gemMining: true, gemItemId: 'GEM_SAPPHIRE' }),
    tmpl('Sapphire Grotto', 'An underground grotto at {env} sparkles with raw sapphires embedded in the walls. Harvest them — if the cave creatures let you!', 'dungeon', ['Grotto Guardian', 'Blue Slime', 'Sapphire Construct'], { gemMining: true, gemItemId: 'GEM_SAPPHIRE' }),
    tmpl('Blue Vein Strike', 'A massive sapphire vein was discovered in {env}. The guild wants a cut — literally. Mine the gems and bring them home!', 'dungeon', ['Vein Parasite', 'Rock Titan', 'Crystal Sentinel'], { gemMining: true, gemItemId: 'GEM_SAPPHIRE' }),
    tmpl('Sapphire Cavern Defense', 'Hold {env} while miners extract a sapphire deposit. Monsters want the gems as badly as you do!', 'dungeon', ['Cave Drake', 'Gem Thief', 'Cavern Beast'], { gemMining: true, gemItemId: 'GEM_SAPPHIRE' }),
    tmpl('Sunken Sapphire Reef', 'Sapphires grow naturally on the reef near {env}. Dive in and collect them before the sea creatures swarm!', 'wilderness', ['Reef Serpent', 'Coral Golem', 'Deep Sea Horror'], { gemMining: true, gemItemId: 'GEM_SAPPHIRE' }),
    // ── BOSS encounters (D-rank) ──
    tmpl('BOSS: The Iron Revenant', 'An ancient knight has risen from the depths of {env}. The Iron Revenant is no mere undead — it remembers every sword technique from its centuries of service, and its enchanted armor repairs itself.', 'haunted', ['Revenant Squire', 'Spectral Knight', 'The Iron Revenant'], {
      boss: true, bossName: 'The Iron Revenant',
      narratives: {
        success: ["The Revenant's armor finally shattered, and the spirit within whispered 'thank you' before dissolving into light. Centuries of torment, ended.", "Every technique the ancient knight knew was countered, one by one. When the last was defeated, the Iron Revenant knelt and crumbled to rust."],
        failure: ["The Revenant's sword moved with the precision of a thousand battles. The party couldn't find a single opening.", "Every wound the party inflicted sealed shut as the enchanted armor rebuilt itself. They need to find the source of its power first."],
      }
    }),
    tmpl('BOSS: Kargoth the Bandit Emperor', 'The bandit known as Kargoth has united every outlaw, cutthroat, and mercenary in the region under one banner at {env}. He fights with the cunning of a general and the brutality of a berserker.', 'fortress', ['Bandit Elite Guard', 'Kargoth\'s Lieutenant', 'Kargoth the Bandit Emperor'], {
      boss: true, bossName: 'Kargoth the Bandit Emperor',
      narratives: {
        success: ["Kargoth fought like a cornered lion, but even an emperor falls when his army crumbles. The bandit empire is no more.", "The Emperor's crown was just a dented helmet, but the man who wore it was genuinely terrifying. The party earned every coin of this bounty."],
        failure: ["Kargoth had planned for this. Traps, ambushes, and his elite guard turned what should have been a siege into a massacre. The party barely escaped.", "The Bandit Emperor's fortress was a labyrinth of kill zones. The party fought bravely but was outmaneuvered at every turn."],
      }
    }),
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
    // ── Additional normal quests ──
    tmpl('Prison Break', 'Dangerous prisoners escaped from {env}. Recapture them before they reach the dark lands.', 'fortress', ['Escaped Berserker', 'Rogue Mage', 'Prison Lord']),
    tmpl('Corrupted Shrine', 'A holy shrine at {env} has been corrupted. Cleanse it and defeat the source.', 'haunted', ['Corrupted Priest', 'Shadow Acolyte', 'Defiled Guardian']),
    tmpl('Airship Escort', 'Escort the trade airship through the skies above {env}. Sky pirates are expected.', 'mountain', ['Sky Pirate', 'Wind Raider', 'Pirate Captain']),
    tmpl('Colosseum Championship', 'Fight your way through the colosseum bracket at {env}. Glory awaits the victor.', 'fortress', ['Gladiator Champion', 'Beast Tamer', 'Arena Legend']),
    tmpl('Moonlit Hunt', 'A rare beast stalks {env} under the full moon. Track and subdue it.', 'wilderness', ['Moonbeast', 'Lunar Wolf', 'Night Stalker']),
    // ── Gem Mining quests (C-rank: Emeralds) ──
    tmpl('Emerald Jungle Mine', 'Deep in the jungle at {env} lies a rich emerald deposit. Cut through the overgrowth and the guardians to claim the precious green gems!', 'wilderness', ['Jungle Golem', 'Vine Strangler', 'Emerald Serpent'], { gemMining: true, gemItemId: 'GEM_EMERALD' }),
    tmpl('Emerald Fault Line', 'Tectonic activity at {env} exposed a massive emerald vein. Extract the gems before the fault collapses!', 'dungeon', ['Earth Elemental', 'Fault Crawler', 'Magma Wyrm'], { gemMining: true, gemItemId: 'GEM_EMERALD' }),
    tmpl('Ancient Emerald Vault', 'A sealed vault at {env} holds emeralds from a lost civilization. Break the seals, defeat the guardians, and claim the trove!', 'dungeon', ['Vault Sentinel', 'Ancient Construct', 'Emerald Golem'], { gemMining: true, gemItemId: 'GEM_EMERALD' }),
    tmpl('Emerald Dragon\'s Stash', 'A young dragon hoards emeralds at {env}. Defeat it and loot the gem stash!', 'mountain', ['Drake Scout', 'Emerald Drake', 'Young Green Dragon'], { gemMining: true, gemItemId: 'GEM_EMERALD' }),
    tmpl('Emerald River Dredge', 'The river at {env} carries raw emeralds downstream from an unknown source. Dredge the riverbed and fight off anything that surfaces!', 'wilderness', ['River Leviathan', 'Water Elemental', 'Gem Crab'], { gemMining: true, gemItemId: 'GEM_EMERALD' }),
    // ── BOSS encounters (C-rank) ──
    tmpl("BOSS: Zul'Thara, the Emerald Wyrm", "A young dragon of terrifying intelligence has made {env} her lair. Zul'Thara doesn't just breathe fire — she speaks, schemes, and has been manipulating local politics for decades. She considers adventurers amusing.", 'mountain', ['Dragonsworn Cultist', 'Emerald Drake', "Zul'Thara, the Emerald Wyrm"], {
      boss: true, bossName: "Zul'Thara",
      narratives: {
        success: ["Zul'Thara's laughter turned to shock as the party pierced her scales. 'Impressive,' she gasped. 'Perhaps mortals are not so amusing after all.' The wyrm fell.", "The dragon fought with intelligence and fury in equal measure, but the party was prepared. Zul'Thara's reign of manipulation is over."],
        failure: ["'How delightful,' Zul'Thara purred as the party fled her emerald flames. 'Do come again. I so enjoy visitors.' The dragon didn't even bother to chase.", "Zul'Thara had anticipated every strategy. She'd been watching the party for weeks, she admitted cheerfully, before nearly killing them all."],
      }
    }),
    tmpl('BOSS: The Lich of Ashenmoor', 'The lich that haunts {env} has had centuries to perfect its craft. It commands legions of undead, weaves death magic that can stop hearts at a distance, and its phylactery has never been found.', 'haunted', ['Death Knight Champion', 'Spectral Archmage', 'The Lich of Ashenmoor'], {
      boss: true, bossName: 'The Lich of Ashenmoor',
      narratives: {
        success: ["The phylactery was hidden inside one of its own death knights. When the party destroyed it, the lich's scream could be heard for miles as it crumbled to dust.", "Centuries of dark magic, undone in a single battle. The Lich of Ashenmoor underestimated the living for the last time."],
        failure: ["The lich raised the party's own fallen against them. Fighting your allies' corpses while dodging death magic is as terrible as it sounds.", "Even with the lich seemingly destroyed, it reformed minutes later. Without finding the phylactery, this fight is unwinnable."],
      }
    }),
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
    // ── Additional normal quests ──
    tmpl('Arcane Library', 'A forbidden library at {env} has unleashed sentient spells. Contain them.', 'dungeon', ['Living Spell', 'Arcane Phantom', 'Tome Guardian']),
    tmpl('Dragon Egg Heist', 'A dragon egg at {env} needs relocating before it hatches. The mother is furious.', 'mountain', ['Fire Drake', 'Dragon Hatchling', 'Enraged Mother Dragon']),
    tmpl('Astral Incursion', 'Astral beings pour through a rift at {env}. Seal it from this side.', 'demonic', ['Astral Stalker', 'Phase Beast', 'Astral Titan']),
    tmpl('Floating Fortress', 'A fortress floating above {env} is raining monsters below. Board it.', 'fortress', ['Sky Golem', 'Cloud Giant', 'Fortress Commander']),
    tmpl('The Colossus Stirs', 'An ancient colossus at {env} is reactivating. Disable it before it reaches the cities.', 'mountain', ['Colossus Shard', 'Mech Drone', 'The Awakening Colossus']),
    // ── Gem Mining quests (B-rank: Rubies) ──
    tmpl('Ruby Caldera Mine', 'A volcanic caldera at {env} holds rubies forged in magma. Brave the heat and fight the fire guardians — those blood-red rubies are worth a dragon\'s ransom!', 'mountain', ['Magma Golem', 'Fire Elemental', 'Volcanic Drake'], { gemMining: true, gemItemId: 'GEM_RUBY' }),
    tmpl('Ruby Rift Extraction', 'A dimensional rift at {env} has exposed a seam of rubies from another plane. Mine the otherworldly gems before the rift closes!', 'demonic', ['Rift Guardian', 'Phase Spider', 'Ruby Sentinel'], { gemMining: true, gemItemId: 'GEM_RUBY' }),
    tmpl('Crimson Caverns', 'The Crimson Caverns at {env} glow red with embedded rubies. Fight through the crystalline beasts and fill your bags with the fiery gems!', 'dungeon', ['Crystal Beast', 'Ruby Golem', 'Crimson Wyrm'], { gemMining: true, gemItemId: 'GEM_RUBY' }),
    tmpl('Ruby Titan\'s Hoard', 'A defeated titan\'s hoard at {env} contains rubies the size of fists. But the titan\'s guardians still stand watch!', 'fortress', ['Titan Sentinel', 'Stone Guardian', 'Ruby Titan Fragment'], { gemMining: true, gemItemId: 'GEM_RUBY' }),
    tmpl('Volcanic Ruby Rush', 'Mount {env} is erupting — and the lava reveals ruby deposits. Mine fast, fight faster, and get out before the mountain blows!', 'mountain', ['Lava Elemental', 'Volcanic Worm', 'Ember Dragon'], { gemMining: true, gemItemId: 'GEM_RUBY' }),
    // ── BOSS encounters (B-rank) ──
    tmpl('BOSS: Infernus, Lord of Cinders', 'A rift to the fire plane has stabilized at {env}, and through it walked Infernus — a greater fire demon of immense power. The ground melts where he stands. The air ignites where he breathes. He must be stopped.', 'demonic', ['Infernal Vanguard', 'Hellfire Archon', 'Infernus, Lord of Cinders'], {
      boss: true, bossName: 'Infernus',
      narratives: {
        success: ["Infernus roared as the dimensional anchor shattered, dragging him back through the rift. The Lord of Cinders clawed at reality itself, but the seal held.", "Fire hot enough to melt stone. A demon strong enough to crack mountains. And a party stubborn enough to beat both. Infernus falls."],
        failure: ["The temperature reached levels that made steel soft. The party couldn't get close enough to strike before their equipment began to warp.", "Infernus didn't fight — he simply existed, and his existence was enough to defeat them. The heat alone nearly killed the entire party."],
      }
    }),
    tmpl('BOSS: The Colossus of Ruin', 'An ancient war machine the size of a castle has activated at {env}. The Colossus of Ruin was built to end civilizations, and after ten thousand years of slumber, it has resumed its mission.', 'fortress', ['Colossus Drone', 'Siege Automaton', 'The Colossus of Ruin'], {
      boss: true, bossName: 'The Colossus of Ruin',
      narratives: {
        success: ["The party found the control core deep within the Colossus and destroyed it. The ancient machine groaned, sparked, and finally went dark after ten millennia.", "It took climbing the Colossus itself, fighting through its internal defenses, and destroying its heart. An engineering nightmare turned into a victory."],
        failure: ["The Colossus doesn't feel pain, doesn't tire, and doesn't stop. The party's weapons barely scratched its ancient alloy hull.", "Every weapon system, every defense protocol, every countermeasure — the Colossus was designed to defeat armies. A single party wasn't enough."],
      }
    }),
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
    // ── Additional normal quests ──
    tmpl('Reality Fracture', 'Reality itself cracks at {env}. Fragments of other worlds bleed through.', 'demonic', ['Reality Shard', 'Dimensional Wraith', 'Fracture Entity']),
    tmpl('Fallen Star', 'A celestial body crashed at {env}. Secure the impact site from opportunistic horrors.', 'mountain', ['Cosmic Parasite', 'Star Golem', 'Celestial Predator']),
    tmpl('War of the Gods', 'Two minor deities wage war at {env}. Survive the crossfire and broker peace — or end them.', 'mountain', ['Divine Champion', 'Holy Berserker', 'War God\'s Avatar']),
    tmpl('Planar Convergence', 'Multiple planes converge at {env}. The resulting chaos breeds nightmares.', 'demonic', ['Planar Aberration', 'Convergence Horror', 'Reality Eater']),
    tmpl('The Sealed One', 'The ancient seal at {env} is failing. Reinforce it before the entity beneath breaks free.', 'haunted', ['Seal Breaker', 'Ancient Horror', 'The Unbinding']),
    // ── Gem Mining quests (A-rank: Star Diamonds) ──
    tmpl('Star Diamond Excavation', 'Crystallized starlight — star diamonds — lie deep beneath {env}. Battle through the astral guardians and extract these priceless gems!', 'dungeon', ['Astral Golem', 'Star Construct', 'Diamond Sentinel'], { gemMining: true, gemItemId: 'GEM_STAR_DIAMOND' }),
    tmpl('Celestial Mine Shaft', 'A mine shaft at {env} has broken into a celestial gem pocket. Star diamonds glitter in the walls — but celestial guardians defend them fiercely!', 'mountain', ['Celestial Warden', 'Starlight Golem', 'Astral Dragon'], { gemMining: true, gemItemId: 'GEM_STAR_DIAMOND' }),
    tmpl('Fallen Star Harvest', 'A fallen star embedded in {env} has crystallized into pure star diamonds. Harvest the gems from the impact crater while fighting off cosmic predators!', 'mountain', ['Cosmic Worm', 'Star Fragment', 'Meteor Beast'], { gemMining: true, gemItemId: 'GEM_STAR_DIAMOND' }),
    tmpl('Diamond Dimension Breach', 'A breach to the diamond plane has opened at {env}. Star diamonds spill through — along with their guardians. Grab what you can!', 'demonic', ['Diamond Elemental', 'Prismatic Guardian', 'Plane Warden'], { gemMining: true, gemItemId: 'GEM_STAR_DIAMOND' }),
    tmpl('Star Diamond Dragon\'s Lair', 'An ancient dragon at {env} hoards star diamonds by the hundreds. Defeat it and claim the most valuable gem haul of a lifetime!', 'mountain', ['Diamond Drake', 'Star Dragon', 'Ancient Diamond Dragon'], { gemMining: true, gemItemId: 'GEM_STAR_DIAMOND' }),
    // ── BOSS encounters (A-rank) ──
    tmpl('BOSS: Nethara, the Void Empress', 'Beyond the dimensional veil at {env} lurks Nethara — an empress of the void who has consumed entire realities. She is reaching through the barrier, and if she crosses fully, this world ends.', 'demonic', ['Void Herald', 'Reality Shredder', 'Nethara, the Void Empress'], {
      boss: true, bossName: 'Nethara',
      narratives: {
        success: ["Nethara's hand was reaching through when the party severed it. The Void Empress shrieked across dimensions as the rift sealed, taking her grasping fingers with it.", "They fought a being that eats realities for breakfast. And won. The Void Empress retreated to her domain, diminished, furious, and afraid for the first time."],
        failure: ["Reality itself bent around Nethara. The party's attacks curved away, their magic fizzled, and the laws of physics became suggestions. They fled before their minds broke.", "The Void Empress didn't fight physically — she simply unmade the space around the party. Weapons ceased to exist. Armor forgot it was solid. Retreat was the only option."],
      }
    }),
    tmpl('BOSS: Chronos, the Time Devourer', 'Something is eating time itself at {env}. Chronos exists in every moment simultaneously, feeding on the past and future alike. Yesterday is disappearing. Tomorrow may never come.', 'dungeon', ['Temporal Echo', 'Paradox Knight', 'Chronos, the Time Devourer'], {
      boss: true, bossName: 'Chronos',
      narratives: {
        success: ["The party struck Chronos in the one moment it was vulnerable — the present. Past and future collapsed into now, and the Time Devourer starved.", "Fighting something that exists in all times simultaneously required attacking in perfect synchronization. One perfect moment. One perfect strike. Time resumes."],
        failure: ["Chronos rewound every fatal blow. The party killed it six times, but it simply ate those moments and started the fight over — from before they'd arrived.", "Time became a weapon. The party aged decades, then reverted to children, then experienced their own deaths in reverse. They retreated, unsure what year it was."],
      }
    }),
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
    // ── Additional normal quests ──
    tmpl('Multiverse Collapse', 'Every version of {env} across infinite realities is collapsing into one. Survive the convergence.', 'demonic', ['Mirror Self', 'Reality Doppelganger', 'The Convergence']),
    tmpl('Creator\'s Workshop', 'The workshop where the world was forged exists at {env}. Its tools have become weapons.', 'dungeon', ['Forge Eternal', 'Hammer of Creation', 'The Worldsmith']),
    tmpl('Memory of the World', 'The world itself remembers every death at {env}. Those memories have taken form.', 'haunted', ['Memory of Heroes', 'Echo of Despair', 'World Memory']),
    tmpl('Singularity', 'All magic, all power, all existence converges at {env}. Stand at the center of everything.', 'demonic', ['Pure Magic', 'Essence of Power', 'The Singularity']),
    tmpl('Beyond the Stars', 'Something beyond comprehension beckons from {env}. Answer the call — if you dare.', 'demonic', ['Star Horror', 'Outer God Fragment', 'The Beyond']),
    // ── Gem Mining quests (S-rank: Celestial Opals) ──
    tmpl('Celestial Opal Genesis', 'At the heart of {env}, where reality meets the divine, celestial opals are born from pure creation energy. Mine these impossible gems — each one worth more than a kingdom!', 'demonic', ['Genesis Guardian', 'Creation Elemental', 'Primordial Sentinel'], { gemMining: true, gemItemId: 'GEM_CELESTIAL_OPAL' }),
    tmpl('Opal of the Gods', 'The gods themselves coveted the celestial opals at {env}. Defeat their divine guardians and claim gems that shift through colors that shouldn\'t exist!', 'mountain', ['Divine Warden', 'God\'s Hand', 'Celestial Dragon'], { gemMining: true, gemItemId: 'GEM_CELESTIAL_OPAL' }),
    tmpl('The Opal Dimension', 'An entire dimension of celestial opals exists beyond {env}. Enter, mine, and escape before the dimension seals forever!', 'demonic', ['Opal Titan', 'Prismatic Wyrm', 'Dimension Core'], { gemMining: true, gemItemId: 'GEM_CELESTIAL_OPAL' }),
    tmpl('Primordial Opal Vein', 'The primordial opal vein at {env} predates the world itself. The gems here are the most valuable objects in existence — if you can survive the extraction!', 'dungeon', ['Primordial Golem', 'Time Wyrm', 'Ancient Opal Guardian'], { gemMining: true, gemItemId: 'GEM_CELESTIAL_OPAL' }),
    tmpl('World\'s End Mine', 'At the edge of existence, {env} holds the last celestial opal deposit. Mine it all — there won\'t be another chance. These opals are worth more than kingdoms!', 'demonic', ['End Walker', 'Void Miner', 'The Final Guardian'], { gemMining: true, gemItemId: 'GEM_CELESTIAL_OPAL' }),
    // ── BOSS encounters (S-rank) ──
    tmpl('BOSS: Aethon, the World Ender', 'A primordial god of destruction has manifested at {env}. Aethon existed before creation and will exist after it ends. It does not hate the world — it simply does not believe the world should exist. This is the fight that defines an era.', 'demonic', ['Apocalypse Herald', 'End Times Incarnate', 'Aethon, the World Ender'], {
      boss: true, bossName: 'Aethon',
      narratives: {
        success: ["Aethon fell — not destroyed, for a primordial cannot be destroyed — but banished, sealed, pushed back into the void between worlds. The party didn't just save the world. They saved the concept of worlds.", "For one eternal moment, the World Ender and the party existed in perfect opposition: annihilation versus defiance. Defiance won. This time."],
        failure: ["Aethon unmade the battlefield. Not destroyed — unmade. The ground simply stopped being ground. The party fled through a world that was forgetting how to exist.", "A primordial god doesn't fight. It simply asserts that you don't exist. The party's conviction that they DID exist wavered, and that was enough to lose."],
      }
    }),
    tmpl('BOSS: The Architect of Oblivion', 'At the edge of {env}, where reality ends, stands the Architect — the entity that will one day unmake all of creation. It is not evil. It is inevitability. And it has decided that \'one day\' is today.', 'demonic', ['Oblivion Construct', 'Entropy Incarnate', 'The Architect of Oblivion'], {
      boss: true, bossName: 'The Architect of Oblivion',
      narratives: {
        success: ["The Architect paused. 'Interesting,' it said, in a voice like the death of stars. 'You have earned more time. Use it wisely.' The entity dissolved — delayed, not defeated.", "The party fought the end of all things and forced it to postpone its schedule. No one in history has ever achieved this. The world endures because of them."],
        failure: ["The Architect didn't fight. It simply began erasing, starting with the party's memories of why they were fighting. They fled before they forgot who they were.", "'You cannot stop entropy,' the Architect explained patiently as reality dissolved around the party. 'You can only delay it.' Today, they couldn't even do that."],
      }
    }),
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
  F: ['WORN_SWORD', 'RUSTY_BROADSWORD', 'BLUNT_SHIV', 'RUSTY_FLAIL', 'WOODEN_MACE', 'RUSTY_DAGGER', 'WRAPPED_FIST', 'BAMBOO_STAFF', 'SHORT_BOW', 'WILLOW_WAND', 'WORN_LUTE', 'CRACKED_DRUM', 'RUSTY_MAIL', 'LIGHT_CHAIN', 'THIN_VEST', 'ROUGH_TUNIC', 'TATTERED_ROBES', 'WOOL_ROBES', 'WOODEN_BUCKLER', 'GLASS_ORB', 'WOODEN_ORB', 'LEATHER_BAND', 'WOODEN_CHARM', 'CRYSTAL_SHARD', 'BLESSED_TOKEN'],
  E: ['IRON_SWORD', 'IRON_BROADSWORD', 'IRON_GREATSWORD', 'IRON_FLAIL', 'IRON_MACE', 'STEEL_DAGGER', 'IRON_CLAW', 'OAK_STAFF', 'HUNTING_BOW', 'APPRENTICE_STAFF', 'BLESSED_STAFF', 'SILVER_LUTE', 'IRON_DRUM', 'HEAVY_MAIL', 'PADDED_CHAIN', 'LEATHER_VEST', 'CLOTH_ROBES', 'BLESSED_ROBES', 'MONKS_ROBE', 'WOODEN_SHIELD', 'IRON_BUCKLER', 'FOCUS_ORB', 'BLESSED_ORB', 'LUCKY_CHARM', 'SWIFT_RING', 'POWER_RING', 'MANA_RING', 'WARD_RING', 'IRON_AMULET', 'VITALITY_PENDANT'],
  D: ['STEEL_SWORD', 'STEEL_BROADSWORD', 'STEEL_GREATSWORD', 'STEEL_FLAIL', 'STEEL_MACE', 'VENOM_FANG', 'STEEL_CLAW', 'HARDWOOD_BO', 'COMPOSITE_BOW', 'MAGE_STAFF', 'CRYSTAL_STAFF', 'ENCHANTED_LUTE', 'WAR_DRUM', 'IRON_PLATE', 'FORTRESS_PLATE', 'CHAINMAIL', 'REINFORCED_CHAIN', 'HARDENED_LEATHER', 'MAGE_ROBES', 'WARD_ROBES', 'IRON_SHIELD', 'TOWER_SHIELD', 'CRYSTAL_ORB', 'HOLY_ORB', 'VITALITY_AMULET', 'POWER_STONE', 'WARRIOR_PENDANT', 'ARCANE_PENDANT', 'HOLY_PENDANT'],
  C: ['MYTHRIL_BLADE', 'GUARDIAN_BLADE', 'FLAMBERGE', 'TEMPLARS_FLAIL', 'BLESSED_MACE', 'SHADOW_EDGE', 'DRAGON_CLAW', 'CELESTIAL_BO', 'STORMREND_BOW', 'ARCHMAGE_STAFF', 'DIVINE_STAFF', 'SIREN_HARP', 'THUNDERDRUM', 'TEMPLAR_PLATE', 'STEEL_PLATE', 'SHADOW_CHAIN', 'STEEL_CHAIN', 'ADAMANT_CHAIN', 'TIGER_HIDE', 'STONE_SKIN_VEST', 'ARCANE_VESTMENTS', 'SANCTIFIED_VESTMENTS', 'TOWER_SHIELD', 'SPIKED_SHIELD', 'VOID_ORB'],
  B: ['EXCALIBUR', 'OATHKEEPER', 'RAGNAROK', 'JUDGEMENT', 'SANCTUM_HAMMER', 'DEATHS_WHISPER', 'ASURA_CLAW', 'RUYI_JINGU', 'ARTEMIS_BOW', 'STAFF_OF_AGES', 'STAFF_OF_DAWN', 'ORPHEUS_LYRE', 'DRUMS_OF_ETERNITY', 'MYTHRIL_PLATE', 'ADAMANTINE_PLATE', 'DRAGON_PLATE', 'PHANTOM_CHAIN', 'CELESTIAL_CHAIN', 'MYTHRIL_CHAIN', 'DRAGON_GI', 'NIRVANA_SHROUD', 'CELESTIAL_ROBES', 'ROBES_OF_ETERNITY', 'MYTHRIL_SHIELD', 'AEGIS', 'WALL_OF_AGES', 'ORB_OF_ETERNITY', 'ORB_OF_CREATION', 'AMULET_OF_FURY', 'AMULET_OF_AGES', 'AMULET_OF_ARCANA', 'AMULET_OF_GRACE'],
  A: ['EXCALIBUR', 'OATHKEEPER', 'DEATHS_WHISPER', 'RAGNAROK', 'ARTEMIS_BOW', 'STAFF_OF_AGES', 'ORPHEUS_LYRE', 'DRAGON_PLATE', 'ADAMANTINE_PLATE', 'PHANTOM_CHAIN', 'DRAGON_GI', 'CELESTIAL_ROBES', 'AEGIS', 'ORB_OF_ETERNITY', 'AMULET_OF_FURY', 'AMULET_OF_ARCANA'],
  S: [
    // High-tier legendary equipment
    'EXCALIBUR', 'OATHKEEPER', 'DEATHS_WHISPER', 'RAGNAROK', 'ARTEMIS_BOW', 'STAFF_OF_AGES',
    'ORPHEUS_LYRE', 'DRAGON_PLATE', 'ADAMANTINE_PLATE', 'PHANTOM_CHAIN', 'DRAGON_GI',
    'CELESTIAL_ROBES', 'AEGIS', 'ORB_OF_ETERNITY', 'AMULET_OF_FURY', 'AMULET_OF_ARCANA',
    'STAFF_OF_DAWN', 'DRUMS_OF_ETERNITY', 'ROBES_OF_ETERNITY', 'WALL_OF_AGES',
    'ORB_OF_CREATION', 'AMULET_OF_AGES', 'AMULET_OF_GRACE', 'MYTHRIL_SHIELD',
    'CELESTIAL_CHAIN', 'MYTHRIL_CHAIN', 'NIRVANA_SHROUD', 'MYTHRIL_PLATE',
    // Celestial equipment (ultra-rare drops)
    'CEL_DAWNBREAKER', 'CEL_ASCENDANT_PLATE', 'CEL_ASCENDANT_WARD', 'CEL_CROWN_OF_THE_CHOSEN',
    'CEL_OATHSWORN', 'CEL_ETERNAL_BASTION', 'CEL_INFINITUM_SHIELD', 'CEL_SENTINELS_ETERNITY',
    'CEL_INFINITY_STAFF', 'CEL_ROBES_OF_THE_VOID', 'CEL_SINGULARITY_ORB', 'CEL_DIADEM_OF_OMNISCIENCE',
    'CEL_VOIDFANG', 'CEL_WRAITHWEAVE', 'CEL_NULLBLADE', 'CEL_ECLIPSE_PENDANT',
    'CEL_SCEPTER_OF_DAWN', 'CEL_VESTMENTS_OF_GRACE', 'CEL_TOME_OF_MIRACLES', 'CEL_HALO_OF_THE_BLESSED',
    'CEL_STARFALL_BOW', 'CEL_STARHIDE_MANTLE', 'CEL_CONSTELLATION_QUIVER', 'CEL_POLARIS_PENDANT',
    'CEL_LYRE_OF_CREATION', 'CEL_VESTMENTS_OF_COSMOS', 'CEL_DRUM_OF_ETERNITY', 'CEL_MAESTROS_SIGNET',
    'CEL_FISTS_OF_NIRVANA', 'CEL_GI_OF_THE_ABSOLUTE', 'CEL_PALM_OF_THE_INFINITE', 'CEL_CHAKRA_OF_ENLIGHTENMENT',
  ],
};

// All celestial item IDs (used by boss loot injection)
const CELESTIAL_ITEM_IDS = [
  'CEL_DAWNBREAKER', 'CEL_ASCENDANT_PLATE', 'CEL_ASCENDANT_WARD', 'CEL_CROWN_OF_THE_CHOSEN',
  'CEL_OATHSWORN', 'CEL_ETERNAL_BASTION', 'CEL_INFINITUM_SHIELD', 'CEL_SENTINELS_ETERNITY',
  'CEL_INFINITY_STAFF', 'CEL_ROBES_OF_THE_VOID', 'CEL_SINGULARITY_ORB', 'CEL_DIADEM_OF_OMNISCIENCE',
  'CEL_VOIDFANG', 'CEL_WRAITHWEAVE', 'CEL_NULLBLADE', 'CEL_ECLIPSE_PENDANT',
  'CEL_SCEPTER_OF_DAWN', 'CEL_VESTMENTS_OF_GRACE', 'CEL_TOME_OF_MIRACLES', 'CEL_HALO_OF_THE_BLESSED',
  'CEL_STARFALL_BOW', 'CEL_STARHIDE_MANTLE', 'CEL_CONSTELLATION_QUIVER', 'CEL_POLARIS_PENDANT',
  'CEL_LYRE_OF_CREATION', 'CEL_VESTMENTS_OF_COSMOS', 'CEL_DRUM_OF_ETERNITY', 'CEL_MAESTROS_SIGNET',
  'CEL_FISTS_OF_NIRVANA', 'CEL_GI_OF_THE_ABSOLUTE', 'CEL_PALM_OF_THE_INFINITE', 'CEL_CHAKRA_OF_ENLIGHTENMENT',
];

// Next-rank lookup for boss higher-tier loot
const NEXT_RANK = { F: 'E', E: 'D', D: 'C', C: 'B', B: 'A', A: 'S', S: 'S' };

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

  // Build loot table — gem mining quests get guaranteed gem drop + junk only (no equipment)
  // Normal quests get the standard loot pool with rarity scaling
  const isGemMining = !!t.gemMining;
  let lootTable;

  if (isGemMining) {
    // Gem mining quests: guaranteed gem drop + a few junk loot items (NO equipment)
    const gemEntry = { itemId: t.gemItemId, chance: 1.0, quantity: [1, 1] };
    const junkPool = (RANK_LOOT_POOLS[rank] || []).filter(id => !EQUIPMENT[id] && !!LOOT_ITEMS[id]);
    const junkShuffled = [...junkPool].sort((a, b) => seededRand(seed + 10 + junkPool.indexOf(a)) - seededRand(seed + 10 + junkPool.indexOf(b)));
    const junkCount = seededRandInt(1, Math.min(3, junkShuffled.length), seed + 9);
    const junkEntries = junkShuffled.slice(0, junkCount).map((itemId, i) => ({
      itemId,
      chance: 0.30 + seededRand(seed + 30 + i) * 0.40,
      quantity: [1, seededRandInt(1, 3, seed + 40 + i)],
    }));
    lootTable = [gemEntry, ...junkEntries];
  } else {
    const isBoss = !!t.boss;

    // Boss quests: merge current rank pool + next-rank items + celestial items
    // Normal quests: use standard rank pool
    let lootPool = [...(RANK_LOOT_POOLS[rank] || [])];
    if (isBoss) {
      // Add items from one tier above
      const nextRank = NEXT_RANK[rank];
      if (nextRank && nextRank !== rank) {
        const nextPool = RANK_LOOT_POOLS[nextRank] || [];
        for (const id of nextPool) { if (!lootPool.includes(id)) lootPool.push(id); }
      }
      // Inject celestial items into boss loot pools
      for (const id of CELESTIAL_ITEM_IDS) { if (!lootPool.includes(id)) lootPool.push(id); }
    }

    const rarityLootBonus = rarity === 'legendary' ? 3 : rarity === 'rare' ? 2 : rarity === 'uncommon' ? 1 : 0;
    // Bosses get more loot entries (larger table = more chances)
    const bossLootBonus = isBoss ? 2 : 0;
    const lootCountMin = 2 + Math.floor(rarityLootBonus / 2) + bossLootBonus;
    const lootCountMax = Math.min(4 + rarityLootBonus + bossLootBonus, lootPool.length);
    const lootCount = seededRandInt(lootCountMin, Math.max(lootCountMin, lootCountMax), seed + 9);
    const shuffled = [...lootPool].sort((a, b) => seededRand(seed + 10 + lootPool.indexOf(a)) - seededRand(seed + 10 + lootPool.indexOf(b)));
    lootTable = shuffled.slice(0, lootCount).map((itemId, i) => {
      const isEquip = !!EQUIPMENT[itemId];
      const isCelestial = isEquip && EQUIPMENT[itemId].rarity === 'celestial';
      // Rarer quests boost equipment drop chances significantly
      const rarityDropMult = rarity === 'legendary' ? 2.0 : rarity === 'rare' ? 1.5 : rarity === 'uncommon' ? 1.2 : 1.0;

      // S-rank bosses get 3x celestial drop rate; non-S bosses get standard S-rank rates
      const bossCelestialMult = isBoss ? (rank === 'S' ? 3.0 : 1.0) : 1.0;

      let baseChance;
      if (isCelestial) {
        // Celestial items: ultra-rare base chance (~1-3%), boosted for S-rank bosses (~3-9%)
        baseChance = (0.008 + seededRand(seed + 20 + i) * 0.012) * Math.min(rarityDropMult, 1.5) * bossCelestialMult;
      } else if (isEquip) {
        // Boss quests give a slight boost to all equipment drop rates
        const bossEquipMult = isBoss ? 1.3 : 1.0;
        baseChance = (0.08 + seededRand(seed + 20 + i) * 0.15) * rarityDropMult * bossEquipMult;
      } else {
        baseChance = 0.30 + seededRand(seed + 30 + i) * 0.50;
      }
      return {
        itemId,
        chance: Math.min(isCelestial ? (isBoss && rank === 'S' ? 0.12 : 0.05) : 0.90, baseChance),
        quantity: isEquip ? [1, 1] : [1, seededRandInt(1, 4, seed + 40 + i)],
      };
    });
  }

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
    gemMining: isGemMining || false,
    gemItemId: isGemMining ? t.gemItemId : null,
    boss: !!t.boss,
    bossName: t.bossName || null,
    templateIndex,
    narratives: t.narratives || {
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

  // Separate boss templates from normal templates
  const bossIndices = templates.map((t, i) => t.boss ? i : -1).filter(i => i >= 0);
  const normalIndices = templates.map((t, i) => !t.boss ? i : -1).filter(i => i >= 0);

  const indices = [];
  const used = new Set();

  // ~25% chance per board refresh to include a boss quest (replaces one harder slot)
  const bossRoll = seededRand(seed + 500);
  const hasBoss = bossRoll < 0.25 && bossIndices.length > 0;

  // First, pick 3 quests that should be at-level (moderate difficulty) — never bosses
  let attempts = 0;
  while (indices.length < 3 && attempts < 50) {
    const poolIdx = Math.floor(seededRand(seed + attempts) * normalIndices.length);
    const idx = normalIndices[poolIdx];
    if (!used.has(idx)) {
      used.add(idx);
      indices.push({ idx, harder: false, boss: false });
    }
    attempts++;
  }

  // If boss spawns, add one boss quest as a "harder" slot
  if (hasBoss) {
    const bossPoolIdx = Math.floor(seededRand(seed + 600) * bossIndices.length);
    const bossIdx = bossIndices[bossPoolIdx];
    used.add(bossIdx);
    indices.push({ idx: bossIdx, harder: true, boss: true });
  }

  // Fill remaining slots with harder normal quests
  attempts = 0;
  while (indices.length < BOARD_SIZE && attempts < 50) {
    const poolIdx = Math.floor(seededRand(seed + 100 + attempts) * normalIndices.length);
    const idx = normalIndices[poolIdx];
    if (!used.has(idx)) {
      used.add(idx);
      indices.push({ idx, harder: true, boss: false });
    }
    attempts++;
  }

  // Generate quest instances — pass partyStrength so quests scale with the party
  return indices.map(({ idx, harder, boss }, i) => {
    const quest = generateQuestInstance(rank, idx, seed + i * 1000, partyStrength);
    if (!quest) return null;

    if (boss) {
      // Boss quests: significantly harder (1.8-2.5x) with boosted rewards
      const bossBoost = 1.8 + seededRand(seed + 300 + i) * 0.7;
      quest.difficulty = Math.round(quest.difficulty * bossBoost * 100) / 100;
      quest.recommendedPower = Math.floor(quest.recommendedPower * bossBoost);
      quest.goldReward.min = Math.floor(quest.goldReward.min * bossBoost * 1.5);
      quest.goldReward.max = Math.floor(quest.goldReward.max * bossBoost * 1.5);
      quest.expReward.min = Math.floor(quest.expReward.min * bossBoost * 1.3);
      quest.expReward.max = Math.floor(quest.expReward.max * bossBoost * 1.3);
      quest.rankPointReward = Math.floor(quest.rankPointReward * bossBoost * 1.2);
    } else if (harder) {
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
