import {
  RANK_ORDER, CLASSES, NAMES, EQUIPMENT, LOOT_ITEMS, QUESTS,
  getItem, getClass, getQuest, computeBaseStats, randomName, getAvailableClasses,
  rankIndex, randInt, canClassEquip
} from './data.js';
import {
  getSkill, getUnlockedClassSkills, getUnlockedClassMasteries,
  getEquipmentSkill, getMemberActiveSkills, applyPassiveSkills, rollActiveSkills
} from './skills.js';
import {
  calculatePartyStrength, generateQuestBoard, shouldRefreshBoard,
  getQuestDifficultyTier, BOARD_REFRESH_MS
} from './questgen.js';
import { getCombatStats } from './ui/combatlog.js';

const Game = (() => {

  const SAVE_KEY = 'adventurersGuild_v1';
  const RANK_THRESHOLDS = { F:1000, E:3000, D:7000, C:15000, B:35000, A:80000, S:null };
  const SHOP_REFRESH_MS = 10 * 60 * 1000;  // 10 minutes

  // ── Party Expansion ───────────────────────────────────────────────────────
  const BASE_PARTY_SIZE = 4;      // default max active party (including player)
  const MAX_PARTY_SIZE = 7;       // ultimate max after all expansions
  const PARTY_EXPANSION_COSTS = [50000, 100000, 150000]; // cost for slots 5, 6, 7

  function getMaxPartySize() {
    const expansions = state.partyExpansions || 0;
    return Math.min(BASE_PARTY_SIZE + expansions, MAX_PARTY_SIZE);
  }

  function getPartyExpansionCost() {
    const expansions = state.partyExpansions || 0;
    if (expansions >= PARTY_EXPANSION_COSTS.length) return null; // maxed
    return PARTY_EXPANSION_COSTS[expansions];
  }

  function expandParty() {
    const expansions = state.partyExpansions || 0;
    if (expansions >= PARTY_EXPANSION_COSTS.length) return { ok: false, reason: 'Guild hall is already at maximum capacity!' };
    const cost = PARTY_EXPANSION_COSTS[expansions];
    if (state.gold < cost) return { ok: false, reason: `Need ${cost.toLocaleString()}g (have ${state.gold.toLocaleString()}g)` };
    state.gold -= cost;
    state.partyExpansions = expansions + 1;
    const newMax = getMaxPartySize();
    logEvent(`Guild hall expanded! Active party size increased to ${newMax}.`);
    return { ok: true, newMax };
  }

  // ── Default State ──────────────────────────────────────────────────────────

  function newGameState(playerName, playerClass) {
    return {
      version: 1,
      lastSaved: null,
      lastTick: Date.now(),
      gold: 200,
      guild: {
        rank: 'F',
        rankPoints: 0,
        completedQuests: [],   // quest IDs (repeats for repeat completions)
        activeQuest: null,     // { questId, startedAt, eventCount, partySnapshot, questData }
        eventLog: [],          // [{ text, time }]
      },
      player: {
        id: 'player',
        name: playerName,
        class: playerClass,
        level: 1, exp: 0,
        stats: computeStats(playerClass, 1),
        equipment: { weapon:null, armor:null, accessory:null, offhand:null },
        skills: [],
        questsCompleted: 0,
      },
      party: [],          // recruited members
      activeSlots: [],    // member IDs currently "in party" (max determined by partyExpansions)
      inventory: [],      // [{ itemId, quantity }]
      shop: { stock: [], lastRefreshed: null, level: 0 },
      questBoard: { quests: {}, lastRefreshed: {}, seeds: {} }, // rank → generated quests
      questHistory: [],   // [{ quest, result, levelUps, timestamp }] — last 50
      partySynergy: {
        totalQuestsAsTeam: 0,   // quests completed with same active party
        lastPartyHash: null,    // hash of active party IDs to track changes
        bonusesUnlocked: [],    // synergy bonus IDs
        secretBossesFound: 0,
      },
      partyExpansions: 0,  // 0-3 purchased expansions (party size 4→7)
      autoRun: null,      // { strategy:'safe'|'balanced'|'push', remaining, total, rank } or null
      nextMemberId: 1,
      pendingResults: null,
    };
  }

  // ── Stat helpers ───────────────────────────────────────────────────────────

  function computeStats(classId, level) {
    return computeBaseStats(classId, level);
  }

  function effectiveStats(member) {
    const stats = { ...member.stats };
    if (member.equipment) {
      for (const itemId of Object.values(member.equipment)) {
        if (!itemId) continue;
        const item = getItem(itemId);
        if (!item || !item.statBonus) continue;
        for (const [k, v] of Object.entries(item.statBonus)) {
          stats[k] = (stats[k] || 0) + v;
        }
      }
    }
    return stats;
  }

  function memberPower(member) {
    const s = effectiveStats(member);
    return (s.atk * 2) + s.def + s.spd + Math.floor((s.maxHp || 50) / 10) + (s.mag * 1.5) + Math.floor((s.lck || 0) * 0.5);
  }

  function expToNext(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  // ── Save / Load ────────────────────────────────────────────────────────────

  function save() {
    if (!state) return;
    state.lastSaved = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch(e) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1) return false;
      state = parsed;
      return true;
    } catch(e) { return false; }
  }

  function hasSave() {
    return !!localStorage.getItem(SAVE_KEY);
  }

  function deleteSave() {
    localStorage.removeItem(SAVE_KEY);
    state = null;
  }

  // ── Mutations ──────────────────────────────────────────────────────────────

  function logEvent(text) {
    state.guild.eventLog.unshift({ text, time: Date.now() });
    if (state.guild.eventLog.length > 20) state.guild.eventLog.pop();
  }

  function addRankPoints(points) {
    if (!points) return null;
    state.guild.rankPoints += points;
    let oldRank = null;
    let newRank = null;
    let ri = rankIndex(state.guild.rank);
    while (ri < RANK_ORDER.length - 1) {
      const threshold = RANK_THRESHOLDS[state.guild.rank];
      if (threshold && state.guild.rankPoints >= threshold) {
        if (!oldRank) oldRank = state.guild.rank;
        state.guild.rankPoints -= threshold;
        ri++;
        state.guild.rank = RANK_ORDER[ri];
        newRank = state.guild.rank;
        logEvent(`Guild rank advanced to ${state.guild.rank} Rank!`);
      } else break;
    }
    return oldRank && newRank ? { from: oldRank, to: newRank } : null;
  }

  function addExp(memberId, amount) {
    const member = memberId === 'player' ? state.player : state.party.find(m => m.id === memberId);
    if (!member) return { levelUps: [], skillGains: [] };
    member.exp += amount;
    const levelUps = [];
    const skillGains = [];
    while (member.exp >= expToNext(member.level)) {
      member.exp -= expToNext(member.level);
      member.level++;
      const newStats = computeStats(member.class, member.level);
      const hpGain = newStats.maxHp - member.stats.maxHp;
      for (const [k, v] of Object.entries(newStats)) {
        if (k !== 'hp') member.stats[k] = v;
      }
      member.stats.hp = Math.min(member.stats.maxHp, member.stats.hp + Math.max(0, hpGain));
      // Check for new class skill unlocks
      const newSkill = getUnlockedClassSkills(member.class, member.level).find(s => !member.skills.includes(s.id));
      if (newSkill && !member.skills.includes(newSkill.id)) {
        member.skills.push(newSkill.id);
        logEvent(`${member.name} learned skill: ${newSkill.name}!`);
        skillGains.push({ memberName: member.name, skillName: newSkill.name, skillIcon: newSkill.icon || '⚡', type: 'skill' });
      }
      // Check for new mastery unlocks
      const newMastery = getUnlockedClassMasteries(member.class, member.level).find(s => !member.skills.includes(s.id));
      if (newMastery && !member.skills.includes(newMastery.id)) {
        member.skills.push(newMastery.id);
        logEvent(`${member.name} gained mastery: ${newMastery.name}!`);
        skillGains.push({ memberName: member.name, skillName: newMastery.name, skillIcon: newMastery.icon || '🔶', type: 'mastery' });
      }
      levelUps.push({ name: member.name, level: member.level });
    }
    return { levelUps, skillGains };
  }

  function addToInventory(itemId, qty = 1) {
    const entry = state.inventory.find(e => e.itemId === itemId);
    if (entry) entry.quantity += qty;
    else state.inventory.push({ itemId, quantity: qty });
  }

  function removeFromInventory(itemId, qty = 1) {
    const idx = state.inventory.findIndex(e => e.itemId === itemId);
    if (idx === -1) return false;
    if (state.inventory[idx].quantity < qty) return false;
    state.inventory[idx].quantity -= qty;
    if (state.inventory[idx].quantity === 0) state.inventory.splice(idx, 1);
    return true;
  }

  function healTick(secondsElapsed) {
    // Don't heal while the results modal is showing
    if (state.pendingResults) return;

    const onQuestIds = new Set();
    if (state.guild.activeQuest) {
      for (const snap of state.guild.activeQuest.partySnapshot) onQuestIds.add(snap.id);
    }
    // Recover fully in ~45-60 seconds (120%/min). Always heal at least 1 HP, round up.
    // Use effectiveStats so equipment maxHp bonuses (e.g. shields) are included.
    const healPct = (120 / 60) * secondsElapsed / 100;
    const heal = (m) => {
      if (onQuestIds.has(m.id)) return;
      const eff = effectiveStats(m);
      if (m.stats.hp < eff.maxHp) {
        const amount = Math.max(1, Math.ceil(eff.maxHp * healPct));
        m.stats.hp = Math.min(eff.maxHp, m.stats.hp + amount);
      }
    };
    heal(state.player);
    state.party.forEach(heal);
  }

  // ── Party ──────────────────────────────────────────────────────────────────

  function recruitMember(classId) {
    const cls = getClass(classId);
    if (!cls.recruitCost) return { ok:false, reason:'Cannot recruit this class' };
    const available = getAvailableClasses(state.guild.rank);
    if (!available.find(c => c.id === classId)) return { ok:false, reason:`${cls.label} not yet unlocked` };
    if (state.gold < cls.recruitCost) return { ok:false, reason:`Need ${cls.recruitCost}g (have ${state.gold}g)` };
    if (state.party.length >= 12) return { ok:false, reason:'Roster full (max 12 members)' };

    state.gold -= cls.recruitCost;
    const stats = computeStats(classId, 1);
    // +/- 10% variance on stats
    for (const k of Object.keys(stats)) {
      if (k === 'hp') continue;
      stats[k] = Math.max(1, Math.round(stats[k] * (1 + (Math.random() * 0.2 - 0.1))));
    }
    stats.hp = stats.maxHp;

    const member = {
      id: `m${state.nextMemberId++}`,
      name: randomName(),
      class: classId,
      level: 1, exp: 0,
      stats,
      equipment: { weapon:null, armor:null, accessory:null, offhand:null },
      skills: [],
      questsCompleted: 0,
    };
    state.party.push(member);
    logEvent(`${member.name} the ${cls.label} has joined!`);
    return { ok:true, member };
  }

  function dismissMember(memberId) {
    const idx = state.party.findIndex(m => m.id === memberId);
    if (idx === -1) return { ok:false, reason:'Member not found' };
    if (state.guild.activeQuest) return { ok:false, reason:'Cannot dismiss while party is on a quest' };
    state.activeSlots = state.activeSlots.filter(id => id !== memberId);
    state.party.splice(idx, 1);
    return { ok:true };
  }

  function setActive(memberId, active) {
    if (active) {
      if (state.activeSlots.includes(memberId)) return { ok:false, reason:'Already active' };
      const maxSize = getMaxPartySize();
      if (state.activeSlots.length >= maxSize) return { ok:false, reason:`Active party full (max ${maxSize})` };
      if (!state.party.find(m => m.id === memberId)) return { ok:false, reason:'Member not found' };
      state.activeSlots.push(memberId);
    } else {
      state.activeSlots = state.activeSlots.filter(id => id !== memberId);
    }
    return { ok:true };
  }

  function equipItem(memberId, itemId, targetSlot) {
    const member = memberId === 'player' ? state.player : state.party.find(m => m.id === memberId);
    if (!member) return { ok:false, reason:'Member not found' };
    const item = getItem(itemId);
    if (!item || !item.slot) return { ok:false, reason:'Not equippable' };
    if (!canClassEquip(member.class, item)) {
      const cls = getClass(member.class);
      return { ok:false, reason:`${cls.label} cannot equip ${item.name}` };
    }

    // Determine which slot to equip into.
    // Dual-wield: Rogues=daggers, Monks=claws, Rangers=swords — can go in weapon OR offhand.
    const canDualWield =
      (item.dagger && member.class === 'ROGUE') ||
      (item.claw && member.class === 'MONK') ||
      (item.slot === 'weapon' && !item.twoHanded && !item.dagger && !item.claw &&
       member.class === 'RANGER' && item.classReq && item.classReq.includes('RANGER'));

    let slot = item.slot;
    if (targetSlot === 'offhand' && canDualWield) {
      slot = 'offhand';
    } else if (targetSlot && targetSlot !== item.slot) {
      if (!(canDualWield && targetSlot === 'offhand')) {
        return { ok:false, reason:'Cannot equip that item in this slot' };
      }
    }

    // 2h weapon check: if equipping a 2h weapon, auto-unequip offhand
    if (slot === 'weapon' && item.twoHanded && member.equipment.offhand) {
      unequipItem(memberId, 'offhand');
    }
    // If equipping offhand but weapon is 2h, block it
    if (slot === 'offhand' && member.equipment.weapon) {
      const wpn = getItem(member.equipment.weapon);
      if (wpn && wpn.twoHanded) {
        return { ok:false, reason:'Cannot use offhand with a two-handed weapon' };
      }
    }

    const inv = state.inventory.find(e => e.itemId === itemId);
    if (!inv || inv.quantity < 1) return { ok:false, reason:'Not in inventory' };

    const oldItemId = member.equipment[slot];
    if (oldItemId) {
      addToInventory(oldItemId, 1);
      const oldItem = getItem(oldItemId);
      if (oldItem && oldItem.grantedSkill) {
        // Only remove skill if the item isn't also equipped in the other slot
        const otherSlot = slot === 'weapon' ? 'offhand' : 'weapon';
        const otherItemId = member.equipment[otherSlot];
        const otherItem = otherItemId ? getItem(otherItemId) : null;
        if (!otherItem || otherItem.grantedSkill !== oldItem.grantedSkill) {
          member.skills = member.skills.filter(id => id !== oldItem.grantedSkill);
        }
      }
    }

    inv.quantity--;
    if (inv.quantity === 0) state.inventory.splice(state.inventory.indexOf(inv), 1);
    member.equipment[slot] = itemId;
    if (item.grantedSkill && !member.skills.includes(item.grantedSkill)) {
      member.skills.push(item.grantedSkill);
    }
    return { ok:true };
  }

  function unequipItem(memberId, slot) {
    const member = memberId === 'player' ? state.player : state.party.find(m => m.id === memberId);
    if (!member || !member.equipment[slot]) return { ok:false, reason:'Nothing to unequip' };
    const itemId = member.equipment[slot];
    const item = getItem(itemId);
    if (item && item.grantedSkill) {
      member.skills = member.skills.filter(id => id !== item.grantedSkill);
    }
    addToInventory(itemId, 1);
    member.equipment[slot] = null;
    return { ok:true };
  }

  function buildPartySnapshot() {
    const members = [{ id:'player', name:state.player.name, class:state.player.class, level:state.player.level, stats:effectiveStats(state.player), power:memberPower(state.player) }];
    for (const id of state.activeSlots) {
      const m = state.party.find(p => p.id === id);
      if (m) members.push({ id:m.id, name:m.name, class:m.class, level:m.level, stats:effectiveStats(m), power:memberPower(m) });
    }
    return members;
  }

  function totalPartyPower() {
    return buildPartySnapshot().reduce((s, m) => s + m.power, 0);
  }

  function getMember(id) {
    if (id === 'player') return state.player;
    return state.party.find(m => m.id === id) || null;
  }

  function getActiveMembers() {
    return state.activeSlots.map(id => state.party.find(m => m.id === id)).filter(Boolean);
  }

  function getActiveMemberSkills(memberId) {
    const member = getMember(memberId);
    if (!member) return [];
    const skills = [];
    // Class skills (proc-based, unlock every 2 levels starting at 2)
    const classSkills = getUnlockedClassSkills(member.class, member.level);
    skills.push(...classSkills.map(s => s.id));
    // Class masteries (passive, unlock every 2 levels starting at 4)
    const classMasteries = getUnlockedClassMasteries(member.class, member.level);
    skills.push(...classMasteries.map(s => s.id));
    // Equipment-granted skills (item procs, separate from class skills)
    for (const slot of Object.values(member.equipment || {})) {
      if (slot) {
        const eqSkill = getEquipmentSkill(slot);
        if (eqSkill) skills.push(eqSkill.id);
      }
    }
    return skills;
  }

  // ── Guild ──────────────────────────────────────────────────────────────────

  function canTakeQuest(questId) {
    const quest = getGeneratedQuest(questId) || getQuest(questId);
    if (!quest) return { ok:false, reason:'Quest not found' };
    if (state.guild.activeQuest) return { ok:false, reason:'Party is already on a quest' };
    if (rankIndex(state.guild.rank) < rankIndex(quest.requiredGuildRank)) {
      return { ok:false, reason:`Requires ${quest.requiredGuildRank} Rank` };
    }
    const completions = state.guild.completedQuests.filter(id => id === questId).length;
    if (!quest.isRepeatable && completions > 0) return { ok:false, reason:'Already completed' };
    return { ok:true };
  }

  function completionCount(questId) {
    return state.guild.completedQuests.filter(id => id === questId).length;
  }

  // ── Combat / Loot ──────────────────────────────────────────────────────────

  function resolveQuest(questDef, snapshot) {
    const activatedSkills = [];
    let adjustedPartyPower = snapshot.reduce((s, m) => s + m.power, 0);
    for (const memberSnap of snapshot) {
      const member = getMember(memberSnap.id);
      if (!member) continue;
      const triggered = rollActiveSkills(member, snapshot);
      for (const skill of triggered) {
        activatedSkills.push({ memberId: member.id, memberName: member.name, skill });
        if (skill.effects && skill.effects.powerMultiplier) {
          adjustedPartyPower += memberSnap.power * (skill.effects.powerMultiplier - 1);
        }
      }
    }

    const partyPower = adjustedPartyPower;
    const questPower = questDef.difficulty * 20;
    const ratio = partyPower / Math.max(1, questPower);
    const successChance = Math.min(0.97, Math.max(0.05, ratio * 0.45 + 0.45));
    const success = Math.random() < successChance;
    const avgLck = snapshot.reduce((s, m) => s + (m.stats.lck || 0), 0) / Math.max(1, snapshot.length);
    const luckBonus = avgLck / 100;

    const baseGold = randInt(questDef.goldReward.min, questDef.goldReward.max);
    const baseExp  = randInt(questDef.expReward.min, questDef.expReward.max);
    // Cap the ratio multiplier to prevent runaway rewards on overleveled quests
    const cappedRatio = Math.min(ratio, 3.0);
    // Synergy bonuses for repeated quests
    const goldXpMult = 1 + getGoldXpBonus(questDef.id);
    const rpMult = 1 + getRpBonus(questDef.id);
    const itemFindBonus = getItemFind(questDef.id);
    const goldEarned = success ? Math.floor(baseGold * (0.8 + cappedRatio * 0.4) * goldXpMult) : 0;
    const expEarned  = Math.floor(baseExp * (success ? 1 : 0.2) * goldXpMult);

    // Quest rarity boosts loot drop chance at resolution time
    const questRarityMult = questDef.rarity === 'legendary' ? 1.4
      : questDef.rarity === 'rare' ? 1.2
      : questDef.rarity === 'uncommon' ? 1.1 : 1.0;

    const loot = [];
    if (success) {
      for (const entry of questDef.lootTable) {
        // Guaranteed drops (chance === 1.0) always drop — skip RNG entirely
        if (entry.chance >= 1.0) {
          loot.push({ itemId: entry.itemId, quantity: randInt(entry.quantity[0], entry.quantity[1]) });
          continue;
        }
        const lootRatio = Math.min(ratio, 3.0);
        const baseChance = entry.chance * (0.7 + lootRatio * 0.3) + luckBonus * 0.02;
        const chance = Math.min(0.95, baseChance * (1 + itemFindBonus) * questRarityMult);
        if (Math.random() < chance) {
          loot.push({ itemId: entry.itemId, quantity: randInt(entry.quantity[0], entry.quantity[1]) });
        }
      }
    }

    const baseRp = success ? questDef.rankPointReward : 0;
    const rankPoints = Math.floor(baseRp * rpMult);
    const pool = success ? questDef.narratives.success : questDef.narratives.failure;
    const narrative = pool[Math.floor(Math.random() * pool.length)];

    return { success, partyPower, questPower, ratio, goldEarned, expEarned, rankPoints, loot, narrative, activatedSkills };
  }

  // ── Economy ────────────────────────────────────────────────────────────────

  function refreshShopIfNeeded() {
    const now = Date.now();
    if (!state.shop.lastRefreshed || now - state.shop.lastRefreshed >= SHOP_REFRESH_MS) {
      refreshShop();
    }
  }

  // ── Shop Upgrade System ─────────────────────────────────────────────────
  // 10 levels of shop upgrades. Each level shifts rarity weights toward
  // higher-quality items. At max level the shop is dominated by epic/legendary.

  const SHOP_UPGRADE_COSTS = [
    500, 1500, 4000, 8000, 15000, 25000, 40000, 60000, 80000, 100000
  ];

  // Base weights at level 0, and weights at level 10
  // Intermediate levels interpolate linearly between these
  const RARITY_WEIGHT_BASE = { common: 40, magic: 30, rare: 18, epic: 8, legendary: 4 };
  const RARITY_WEIGHT_MAX  = { common: 0,  magic: 0,  rare: 10, epic: 45, legendary: 45 };

  function getShopRarityWeights() {
    const level = state.shop.level || 0;
    const t = level / 10; // 0.0 → 1.0
    const weights = {};
    for (const r of Object.keys(RARITY_WEIGHT_BASE)) {
      weights[r] = Math.round(RARITY_WEIGHT_BASE[r] * (1 - t) + RARITY_WEIGHT_MAX[r] * t);
    }
    return weights;
  }

  function getShopUpgradeCost() {
    const level = state.shop.level || 0;
    if (level >= 10) return null; // maxed
    return SHOP_UPGRADE_COSTS[level];
  }

  function upgradeShop() {
    const level = state.shop.level || 0;
    if (level >= 10) return { ok: false, reason: 'Shop is already max level!' };
    const cost = SHOP_UPGRADE_COSTS[level];
    if (state.gold < cost) return { ok: false, reason: `Need ${cost.toLocaleString()}g (have ${state.gold.toLocaleString()}g)` };
    state.gold -= cost;
    state.shop.level = level + 1;
    logEvent(`Shop upgraded to level ${state.shop.level}!`);
    refreshShop(); // restock with new weights immediately
    return { ok: true, newLevel: state.shop.level };
  }

  function refreshShop() {
    const ri = rankIndex(state.guild.rank);
    const available = Object.values(EQUIPMENT).filter(item => rankIndex(item.shopMinRank) <= ri);
    if (available.length === 0) { state.shop.stock = []; state.shop.lastRefreshed = Date.now(); return; }

    // Weighted random selection — pick 10 items, preferring common/magic
    const selected = [];
    const used = new Set();

    // First: guarantee one item from each slot type that has items available
    const slots = ['weapon', 'armor', 'accessory', 'offhand'];
    for (const slot of slots) {
      const slotItems = available.filter(it => it.slot === slot && !used.has(it.id));
      if (slotItems.length > 0) {
        const pick = weightedPick(slotItems);
        selected.push(pick);
        used.add(pick.id);
      }
    }

    // Fill remaining slots with weighted random picks (up to 10 total)
    const remaining = available.filter(it => !used.has(it.id));
    while (selected.length < 10 && remaining.length > 0) {
      const pick = weightedPick(remaining);
      selected.push(pick);
      used.add(pick.id);
      remaining.splice(remaining.indexOf(pick), 1);
    }

    // Rarity affects quantity and can add a price premium for rare+ items
    state.shop.stock = selected.map(item => {
      const rarity = item.rarity || 'common';
      const qty = rarity === 'legendary' ? 1 : rarity === 'epic' ? randInt(1, 1) : randInt(1, 3);
      return { itemId: item.id, price: item.buyPrice, quantity: qty };
    });
    state.shop.lastRefreshed = Date.now();
  }

  function weightedPick(items) {
    const weights = getShopRarityWeights();
    const totalWeight = items.reduce((sum, it) => sum + (weights[it.rarity || 'common'] || 20), 0);
    let roll = Math.random() * totalWeight;
    for (const item of items) {
      roll -= weights[item.rarity || 'common'] || 20;
      if (roll <= 0) return item;
    }
    return items[items.length - 1];
  }

  function buyItem(itemId) {
    const entry = state.shop.stock.find(s => s.itemId === itemId && s.quantity > 0);
    if (!entry) return { ok:false, reason:'Out of stock' };
    if (state.gold < entry.price) return { ok:false, reason:`Need ${entry.price}g (have ${state.gold}g)` };
    state.gold -= entry.price;
    entry.quantity--;
    addToInventory(itemId, 1);
    return { ok:true };
  }

  function sellItem(itemId, qty = 1) {
    const item = getItem(itemId);
    if (!item) return { ok:false, reason:'Unknown item' };
    if (!removeFromInventory(itemId, qty)) return { ok:false, reason:'Not enough items' };
    const earned = Math.floor((item.sellPrice || Math.floor(item.buyPrice * 0.4)) * qty);
    state.gold += earned;
    return { ok:true, earned };
  }

  function shopRefreshMs() {
    if (!state.shop.lastRefreshed) return 0;
    return Math.max(0, SHOP_REFRESH_MS - (Date.now() - state.shop.lastRefreshed));
  }

  // ── Quest Board ────────────────────────────────────────────────────────────

  function getPartyStrength() {
    const activeMembers = getActiveMembers();
    return calculatePartyStrength(state.player, activeMembers, effectiveStats);
  }

  function refreshQuestBoard(rank, force = false) {
    if (!state.questBoard) {
      state.questBoard = { quests: {}, lastRefreshed: {}, seeds: {} };
    }
    if (!force && !shouldRefreshBoard(state.questBoard.lastRefreshed[rank])) {
      return state.questBoard.quests[rank] || [];
    }
    const seed = Date.now() + rankIndex(rank) * 10000;
    const strength = getPartyStrength();
    const quests = generateQuestBoard(rank, strength, seed);
    state.questBoard.quests[rank] = quests;
    state.questBoard.lastRefreshed[rank] = Date.now();
    state.questBoard.seeds[rank] = seed;
    return quests;
  }

  function getQuestBoardQuests(rank) {
    if (!state.questBoard) {
      state.questBoard = { quests: {}, lastRefreshed: {}, seeds: {} };
    }
    // Auto-refresh if needed
    if (shouldRefreshBoard(state.questBoard.lastRefreshed[rank])) {
      return refreshQuestBoard(rank);
    }
    return state.questBoard.quests[rank] || [];
  }

  function questBoardRefreshMs(rank) {
    if (!state.questBoard || !state.questBoard.lastRefreshed[rank]) return 0;
    return Math.max(0, BOARD_REFRESH_MS - (Date.now() - state.questBoard.lastRefreshed[rank]));
  }

  // Pick the best quest from the current board based on auto-run strategy.
  // 'safe'     → lowest difficulty (easiest quest)
  // 'balanced' → closest to "moderate" tier (ratio ~0.7-0.9)
  // 'push'     → highest difficulty (hardest quest)
  function pickQuestByStrategy(rank, strategy) {
    const quests = getQuestBoardQuests(rank);
    if (!quests || quests.length === 0) return null;
    const partyStr = getPartyStrength();
    if (partyStr <= 0) return quests[0];

    // Score each quest: ratio = questPower / partyStrength
    const scored = quests.map(q => ({
      quest: q,
      ratio: (q.difficulty * 20) / partyStr,
    }));

    if (strategy === 'safe') {
      // Lowest ratio = easiest
      scored.sort((a, b) => a.ratio - b.ratio);
    } else if (strategy === 'push') {
      // Highest ratio = hardest
      scored.sort((a, b) => b.ratio - a.ratio);
    } else {
      // 'balanced' — closest to 0.8 ratio (moderate sweet spot)
      scored.sort((a, b) => Math.abs(a.ratio - 0.8) - Math.abs(b.ratio - 0.8));
    }
    return scored[0].quest;
  }

  // Look up a generated quest by ID (check all ranks)
  function getGeneratedQuest(questId) {
    if (!state.questBoard || !state.questBoard.quests) return null;
    for (const rank of RANK_ORDER) {
      const quests = state.questBoard.quests[rank];
      if (quests) {
        const q = quests.find(q => q.id === questId);
        if (q) return q;
      }
    }
    return null;
  }

  // ── Party Synergy ─────────────────────────────────────────────────────────

  const SYNERGY_THRESHOLDS = [
    // Early unlocks (every 2-3 quests) — introduce each bonus type
    { id: 'GOLD_XP_1',     quests: 3,   label: 'Shrewd Negotiators I',  desc: '+10% gold & XP',           goldXpBonus: 0.10 },
    { id: 'DMG_1',         quests: 5,   label: 'Precise Strikes I',     desc: '+5% damage (all types)',    dmgBonus: 0.05 },
    { id: 'DMG_TAKEN_1',   quests: 7,   label: 'Iron Resolve I',        desc: '−5% damage taken',          dmgReduction: 0.05 },
    { id: 'AUTO_RUN_2',    quests: 8,   label: 'Battle Fervor I',       desc: 'Unlock auto-battle ×2',     autoRunMax: 2 },
    { id: 'ATK_SPD_1',     quests: 10,  label: 'Combat Momentum I',     desc: '+10% attack speed',         atkSpeedBonus: 0.10 },
    { id: 'HEAL_1',        quests: 13,  label: 'Field Medic I',         desc: '+15% healing efficiency',    healBonus: 0.15 },
    { id: 'ITEM_FIND_1',   quests: 16,  label: 'Treasure Hunter I',     desc: '+10% item find chance',      itemFind: 0.10 },
    { id: 'BOSS_1',        quests: 19,  label: 'Keen Eye I',            desc: '5% boss encounter chance',   secretBossChance: 0.05 },
    { id: 'RP_1',          quests: 22,  label: 'War Stories I',         desc: '+15% rank points',           rpBonus: 0.15 },
    { id: 'AUTO_RUN_5',    quests: 25,  label: 'Battle Fervor II',      desc: 'Unlock auto-battle ×5',     autoRunMax: 5 },

    // Mid unlocks (every 4-5 quests) — tier 2
    { id: 'GOLD_XP_2',     quests: 30,  label: 'Shrewd Negotiators II', desc: '+20% gold & XP',            goldXpBonus: 0.20 },
    { id: 'DMG_2',         quests: 34,  label: 'Precise Strikes II',    desc: '+10% damage (all types)',    dmgBonus: 0.10 },
    { id: 'DMG_TAKEN_2',   quests: 38,  label: 'Iron Resolve II',       desc: '−10% damage taken',          dmgReduction: 0.10 },
    { id: 'ATK_SPD_2',     quests: 42,  label: 'Combat Momentum II',    desc: '+20% attack speed',          atkSpeedBonus: 0.20 },
    { id: 'HEAL_2',        quests: 46,  label: 'Field Medic II',        desc: '+30% healing efficiency',     healBonus: 0.30 },
    { id: 'ITEM_FIND_2',   quests: 50,  label: 'Treasure Hunter II',    desc: '+20% item find chance',       itemFind: 0.20 },
    { id: 'BOSS_2',        quests: 54,  label: 'Keen Eye II',           desc: '10% boss encounter chance',   secretBossChance: 0.10 },
    { id: 'RP_2',          quests: 58,  label: 'War Stories II',        desc: '+30% rank points',            rpBonus: 0.30 },
    { id: 'AUTO_RUN_10',   quests: 50,  label: 'Battle Fervor III',     desc: 'Unlock auto-battle ×10',     autoRunMax: 10 },

    // Late unlocks (every 6-8 quests) — tier 3
    { id: 'GOLD_XP_3',     quests: 68,  label: 'Shrewd Negotiators III',desc: '+35% gold & XP',             goldXpBonus: 0.35 },
    { id: 'DMG_3',         quests: 76,  label: 'Precise Strikes III',   desc: '+18% damage (all types)',     dmgBonus: 0.18 },
    { id: 'DMG_TAKEN_3',   quests: 84,  label: 'Iron Resolve III',      desc: '−18% damage taken',           dmgReduction: 0.18 },
    { id: 'ATK_SPD_3',     quests: 92,  label: 'Combat Momentum III',   desc: '+30% attack speed',           atkSpeedBonus: 0.30 },
    { id: 'AUTO_RUN_20',   quests: 75,  label: 'Battle Fervor IV',      desc: 'Unlock auto-battle ×20',     autoRunMax: 20 },
    { id: 'HEAL_3',        quests: 108, label: 'Field Medic III',       desc: '+50% healing efficiency',      healBonus: 0.50 },
    { id: 'ITEM_FIND_3',   quests: 116, label: 'Treasure Hunter III',   desc: '+35% item find chance',        itemFind: 0.35 },
    { id: 'BOSS_3',        quests: 124, label: 'Keen Eye III',          desc: '15% boss encounter chance',    secretBossChance: 0.15 },
    { id: 'RP_3',          quests: 130, label: 'War Stories III',       desc: '+50% rank points',             rpBonus: 0.50 },
  ];

  function getPartyHash() {
    return ['player', ...state.activeSlots].sort().join(',');
  }

  function updatePartySynergy() {
    if (!state.partySynergy) {
      state.partySynergy = { totalQuestsAsTeam: 0, lastPartyHash: null, bonusesUnlocked: [], secretBossesFound: 0 };
    }
    const currentHash = getPartyHash();
    // If party composition changed, reset streak but keep total
    if (state.partySynergy.lastPartyHash && state.partySynergy.lastPartyHash !== currentHash) {
      // Don't reset total — synergy persists even through party changes
    }
    state.partySynergy.lastPartyHash = currentHash;
    state.partySynergy.totalQuestsAsTeam++;

    // Check for new unlocks — return list of newly unlocked thresholds
    const newUnlocks = [];
    for (const thresh of SYNERGY_THRESHOLDS) {
      if (state.partySynergy.totalQuestsAsTeam >= thresh.quests &&
          !state.partySynergy.bonusesUnlocked.includes(thresh.id)) {
        state.partySynergy.bonusesUnlocked.push(thresh.id);
        newUnlocks.push(thresh);
        logEvent(`Party Synergy: ${thresh.label} unlocked! ${thresh.desc}`);
      }
    }
    return newUnlocks;
  }

  function getMaxAutoRun() {
    if (!state.partySynergy) return 0;
    let max = 0;
    for (const thresh of SYNERGY_THRESHOLDS) {
      if (state.partySynergy.bonusesUnlocked.includes(thresh.id) && thresh.autoRunMax) {
        max = Math.max(max, thresh.autoRunMax);
      }
    }
    return max;
  }

  // Returns a multiplier (0 if not repeated or no bonus) for the given synergy key
  function _getSynergyBonus(questId, key) {
    if (!state.partySynergy) return 0;
    const completions = completionCount(questId);
    if (completions === 0) return 0;
    // Scale with completions: ×1=40%, ×5=70%, ×10+=100% of the bonus
    const compMult = completions >= 10 ? 1.0 : completions >= 5 ? 0.7 : 0.4;
    let bonus = 0;
    for (const thresh of SYNERGY_THRESHOLDS) {
      if (state.partySynergy.bonusesUnlocked.includes(thresh.id) && thresh[key]) {
        bonus = Math.max(bonus, thresh[key]);
      }
    }
    return bonus * compMult;
  }

  function getGoldXpBonus(questId)     { return _getSynergyBonus(questId, 'goldXpBonus'); }
  function getDmgBonus(questId)        { return _getSynergyBonus(questId, 'dmgBonus'); }
  function getDmgReduction(questId)    { return _getSynergyBonus(questId, 'dmgReduction'); }
  function getAtkSpeedBonus(questId)   { return _getSynergyBonus(questId, 'atkSpeedBonus'); }
  function getHealBonus(questId)       { return _getSynergyBonus(questId, 'healBonus'); }
  function getItemFind(questId)        { return _getSynergyBonus(questId, 'itemFind'); }
  function getRpBonus(questId)         { return _getSynergyBonus(questId, 'rpBonus'); }

  function getSecretBossChance() {
    if (!state.partySynergy) return 0;
    let chance = 0;
    for (const thresh of SYNERGY_THRESHOLDS) {
      if (state.partySynergy.bonusesUnlocked.includes(thresh.id) && thresh.secretBossChance) {
        chance = Math.max(chance, thresh.secretBossChance);
      }
    }
    return chance;
  }

  // ── Secret Boss Encounters ────────────────────────────────────────────────

  const SECRET_BOSSES = [
    { name: 'Mimic Treasure King', icon: '📦', powerMult: 1.5, goldMult: 3.0, expMult: 2.0 },
    { name: 'Wandering Lich',      icon: '💀', powerMult: 1.8, goldMult: 2.5, expMult: 2.5 },
    { name: 'Shadow Doppelganger', icon: '👤', powerMult: 2.0, goldMult: 2.0, expMult: 3.0 },
    { name: 'Golden Dragon Hatchling', icon: '🐉', powerMult: 1.3, goldMult: 5.0, expMult: 1.5 },
    { name: 'Chaos Knight',        icon: '⚔', powerMult: 2.2, goldMult: 2.0, expMult: 2.0 },
    { name: 'The Collector',       icon: '🎭', powerMult: 1.6, goldMult: 2.0, expMult: 2.0 },
  ];

  // Class-specific unique rewards from secret bosses
  const CLASS_UNIQUE_REWARDS = {
    HERO:   { skillId: null, statBoost: { atk: 3, def: 2 }, name: 'Hero\'s Resolve' },
    KNIGHT: { skillId: null, statBoost: { def: 5, maxHp: 15 }, name: 'Iron Will' },
    MAGE:   { skillId: null, statBoost: { mag: 5, spd: 1 }, name: 'Arcane Insight' },
    ROGUE:  { skillId: null, statBoost: { spd: 4, lck: 3 }, name: 'Shadow\'s Favor' },
    CLERIC: { skillId: null, statBoost: { mag: 3, def: 2, maxHp: 10 }, name: 'Divine Grace' },
    RANGER: { skillId: null, statBoost: { atk: 3, spd: 2, lck: 2 }, name: 'Predator\'s Mark' },
    BARD:   { skillId: null, statBoost: { lck: 5, spd: 2 }, name: 'Muse\'s Kiss' },
    MONK:   { skillId: null, statBoost: { atk: 2, def: 2, spd: 2, mag: 1 }, name: 'Inner Peace' },
  };

  function rollSecretBoss(questDef, snapshot) {
    let chance = getSecretBossChance();

    // Dynamic boss scaling: stronger parties attract more boss encounters.
    // If party power is 2x+ the quest power, add bonus boss chance (up to +40%).
    const partyPow = snapshot.reduce((s, m) => s + m.power, 0);
    const questPow = questDef.difficulty * 20;
    if (questPow > 0) {
      const overPowerRatio = partyPow / questPow;
      if (overPowerRatio > 2.0) {
        const bonusChance = Math.min(0.40, (overPowerRatio - 2.0) * 0.08);
        chance = Math.max(chance, bonusChance);
      }
    }

    if (chance <= 0 || Math.random() >= chance) return null;

    const boss = SECRET_BOSSES[Math.floor(Math.random() * SECRET_BOSSES.length)];
    const bossPartyPower = snapshot.reduce((s, m) => s + m.power, 0);
    const bossQuestPower = questDef.difficulty * 20 * boss.powerMult;
    const bossRatio = bossPartyPower / Math.max(1, bossQuestPower);
    const bossSuccess = Math.random() < Math.min(0.90, Math.max(0.10, bossRatio * 0.4 + 0.3));

    // Pick one random party member to receive the unique reward
    const recipient = snapshot[Math.floor(Math.random() * snapshot.length)];
    const recipientMember = getMember(recipient.id);
    const classReward = recipientMember ? CLASS_UNIQUE_REWARDS[recipientMember.class] : null;

    return {
      boss,
      success: bossSuccess,
      goldBonus: bossSuccess ? Math.floor(questDef.goldReward.max * boss.goldMult) : 0,
      expBonus: bossSuccess ? Math.floor(questDef.expReward.max * boss.expMult) : 0,
      recipientId: recipient.id,
      recipientName: recipient.name,
      classReward: bossSuccess ? classReward : null,
    };
  }

  // ── Quest History ─────────────────────────────────────────────────────────

  function addToHistory(questDef, result, levelUps, partySnapshot, combatStatsData) {
    if (!state.questHistory) state.questHistory = [];

    // Build compact party summary with before/after HP
    const partySummary = (partySnapshot || []).map(snap => {
      return {
        id: snap.id,
        name: snap.name,
        class: snap.class,
        level: snap.level,
        maxHp: snap.stats.maxHp || 100,
      };
    });

    state.questHistory.unshift({
      questTitle: questDef.title,
      questRank: questDef.rank,
      questId: questDef.id,
      environment: questDef.environment || null,
      enemies: questDef.enemies || [],
      difficulty: questDef.difficulty || 0,
      recommendedPower: questDef.recommendedPower || 0,
      rarity: questDef.rarity || 'common',
      success: result.success,
      partyPower: result.partyPower || 0,
      questPower: result.questPower || 0,
      goldEarned: result.goldEarned,
      expEarned: result.expEarned,
      rankPoints: result.rankPoints,
      loot: result.loot,
      activatedSkills: result.activatedSkills,
      secretBoss: result.secretBoss || null,
      levelUps,
      narrative: result.narrative,
      partySummary,
      combatStats: combatStatsData || [],
      timestamp: Date.now(),
    });
    // Keep last 50
    if (state.questHistory.length > 50) state.questHistory.pop();
  }

  // ── Engine ─────────────────────────────────────────────────────────────────

  // Event-based quest system: quests run until combat resolves (all enemies or party die).
  // EVENT_INTERVAL_MS is the time between revealing each combat event.
  const EVENT_INTERVAL_MS = 1500; // 1.5 seconds per event

  function startQuest(questId) {
    // Try generated quest first, then fall back to static
    const quest = getGeneratedQuest(questId) || getQuest(questId);
    if (!quest) return { ok:false, reason:'Quest not found' };
    const check = canTakeQuest(questId);
    if (!check.ok) return check;
    const snapshot = buildPartySnapshot();

    state.guild.activeQuest = {
      questId, startedAt: Date.now(),
      eventCount: 0, // set by UI when combat sim is built
      partySnapshot: snapshot,
      questData: quest,
    };

    logEvent(`Party departed for: ${quest.title}`);
    save();
    return { ok:true };
  }

  // Called by the UI after the combat simulation is built
  function setQuestEventCount(count, intervalMs) {
    if (state.guild.activeQuest) {
      state.guild.activeQuest.eventCount = count;
      state.guild.activeQuest.eventIntervalMs = intervalMs || EVENT_INTERVAL_MS;
    }
  }

  function startAutoRun(strategy, count, rank) {
    state.autoRun = { strategy, remaining: count, total: count, rank };
    // Pick first quest and start it
    const quest = pickQuestByStrategy(rank, strategy);
    if (!quest) {
      state.autoRun = null;
      return { ok: false, reason: 'No quests available for this rank.' };
    }
    const result = startQuest(quest.id);
    if (!result.ok) {
      state.autoRun = null;
      return result;
    }
    // Decrement since we just started one
    state.autoRun.remaining--;
    return { ok: true };
  }

  function stopAutoRun() {
    if (state.autoRun) {
      logEvent('Auto-run stopped.');
      state.autoRun = null;
      save();
    }
  }

  function _getEventInterval() {
    const aq = state.guild.activeQuest;
    return (aq && aq.eventIntervalMs) || EVENT_INTERVAL_MS;
  }

  function questEventsRevealed() {
    if (!state.guild.activeQuest) return 0;
    const aq = state.guild.activeQuest;
    const elapsed = Date.now() - aq.startedAt;
    return Math.max(1, Math.floor(elapsed / _getEventInterval()) + 1);
  }

  function questTimeRemaining() {
    if (!state.guild.activeQuest) return 0;
    const aq = state.guild.activeQuest;
    if (!aq.eventCount) return 99;
    const totalMs = aq.eventCount * _getEventInterval();
    return Math.max(0, Math.ceil((aq.startedAt + totalMs - Date.now()) / 1000));
  }

  function questProgress() {
    if (!state.guild.activeQuest) return 0;
    const aq = state.guild.activeQuest;
    if (!aq.eventCount) return 0;
    const revealed = questEventsRevealed();
    return Math.min(1, revealed / aq.eventCount);
  }

  function isQuestComplete() {
    if (!state.guild.activeQuest) return false;
    const aq = state.guild.activeQuest;
    if (!aq.eventCount) return false;
    return questEventsRevealed() >= aq.eventCount;
  }

  function finishQuest() {
    if (!state.guild.activeQuest) return;
    const aq = state.guild.activeQuest;
    const quest = aq.questData || getGeneratedQuest(aq.questId) || getQuest(aq.questId);
    if (!quest) { state.guild.activeQuest = null; return; }

    const result = resolveQuest(quest, aq.partySnapshot);

    // Roll for secret boss encounter
    const secretBoss = rollSecretBoss(quest, aq.partySnapshot);
    if (secretBoss) {
      result.secretBoss = secretBoss;
      result.goldEarned += secretBoss.goldBonus;
      logEvent(`Secret boss found: ${secretBoss.boss.icon} ${secretBoss.boss.name}!`);
      if (secretBoss.success && secretBoss.classReward) {
        const recipient = getMember(secretBoss.recipientId);
        if (recipient) {
          // Apply permanent stat boost
          for (const [stat, val] of Object.entries(secretBoss.classReward.statBoost)) {
            recipient.stats[stat] = (recipient.stats[stat] || 0) + val;
          }
          if (recipient.stats.maxHp && recipient.stats.hp) {
            recipient.stats.hp = Math.min(recipient.stats.hp, recipient.stats.maxHp);
          }
          logEvent(`${secretBoss.recipientName} gained ${secretBoss.classReward.name}!`);
        }
        if (!state.partySynergy) state.partySynergy = { totalQuestsAsTeam: 0, lastPartyHash: null, bonusesUnlocked: [], secretBossesFound: 0 };
        state.partySynergy.secretBossesFound++;
      }
    }

    state.gold += result.goldEarned;
    const rankUp = addRankPoints(result.rankPoints);

    const levelUps = [];
    const skillGains = [];
    for (const snap of aq.partySnapshot) {
      const gained = addExp(snap.id, result.expEarned + (secretBoss ? secretBoss.expBonus : 0));
      levelUps.push(...gained.levelUps);
      skillGains.push(...gained.skillGains);
    }

    for (const drop of result.loot) addToInventory(drop.itemId, drop.quantity);

    let synergyUnlocks = [];
    if (result.success) {
      state.guild.completedQuests.push(aq.questId);
      for (const snap of aq.partySnapshot) {
        const m = getMember(snap.id);
        if (m) {
          m.questsCompleted = (m.questsCompleted || 0) + 1;
        }
      }
      // Update party synergy
      synergyUnlocks = updatePartySynergy();
    }

    logEvent(result.success ? `Quest complete: ${quest.title} (+${result.goldEarned}g)` : `Quest failed: ${quest.title}`);

    // Grab combat stats from the simulation before it resets
    const combatStatsData = getCombatStats() || [];

    // Add to quest history
    addToHistory(quest, result, levelUps, aq.partySnapshot, combatStatsData);

    state.pendingResults = { quest, result, levelUps, rankUp, synergyUnlocks, skillGains, combatStats: combatStatsData, resolvedAt: Date.now() };
    state.guild.activeQuest = null;

    // Refresh quest board for this rank on completion
    refreshQuestBoard(quest.rank, true);

    // Handle auto-run (strategy-based)
    if (state.autoRun && state.autoRun.remaining > 0 && result.success) {
      // Check if party can still quest (not too injured)
      const allAlive = [state.player, ...getActiveMembers()].every(m =>
        m.stats.hp > effectiveStats(m).maxHp * 0.15
      );
      if (allAlive) {
        // Decrement — actual auto-start happens after results modal dismiss
        state.autoRun.remaining--;
      } else {
        logEvent('Auto-run cancelled: party too injured.');
        state.autoRun = null;
      }
    } else if (state.autoRun && (!result.success || state.autoRun.remaining <= 0)) {
      if (!result.success) logEvent('Auto-run cancelled: quest failed.');
      state.autoRun = null;
    }

    save();
  }

  function resolveIdle() {
    if (!state.guild.activeQuest) return;
    if (isQuestComplete()) finishQuest();
  }

  let tickInterval = null;
  let saveInterval = null;

  function startTick(onTick) {
    tickInterval = setInterval(() => {
      const now = Date.now();
      const rawElapsed = (now - state.lastTick) / 1000;
      state.lastTick = now;
      // Cap elapsed to 2s so idle-time doesn't instantly full-heal the party.
      // This makes HP recovery visible tick-by-tick after returning from a quest.
      const elapsed = Math.min(rawElapsed, 2);
      healTick(elapsed);
      if (state.guild.activeQuest && isQuestComplete()) {
        finishQuest();
      }
      refreshShopIfNeeded();
      if (onTick) onTick();
    }, 1000);

    saveInterval = setInterval(save, 60000);
  }

  function stopTick() {
    clearInterval(tickInterval);
    clearInterval(saveInterval);
  }

  // ── Public surface ─────────────────────────────────────────────────────────

  let state = null;

  return {
    get state() { return state; },
    set state(s) { state = s; },

    newGame(name, cls) { state = newGameState(name, cls); refreshShop(); save(); },
    save, load, hasSave, deleteSave,

    // Queries
    questTimeRemaining, questProgress, questEventsRevealed, isQuestComplete,
    setQuestEventCount, completionCount, canTakeQuest,
    totalPartyPower, buildPartySnapshot, getMember, getActiveMembers, getActiveMemberSkills,
    effectiveStats, memberPower, shopRefreshMs,
    getInventoryItem: (itemId) => state.inventory.find(e => e.itemId === itemId),

    // Quest Board
    getQuestBoardQuests, refreshQuestBoard, questBoardRefreshMs, getGeneratedQuest,
    getPartyStrength,

    // Party Synergy
    getMaxAutoRun, getSecretBossChance,
    getGoldXpBonus, getDmgBonus, getDmgReduction, getAtkSpeedBonus, getHealBonus, getItemFind, getRpBonus,
    SYNERGY_THRESHOLDS,

    // Auto-run
    pickQuestByStrategy, startAutoRun, stopAutoRun,

    // Mutations
    logEvent, addRankPoints, addExp, addToInventory, removeFromInventory,
    healTick, recruitMember, dismissMember, setActive, equipItem, unequipItem,
    refreshShop, buyItem, sellItem, upgradeShop, getShopUpgradeCost, getShopRarityWeights,
    expandParty, getPartyExpansionCost, getMaxPartySize,

    // Engine
    startQuest, finishQuest, resolveIdle, startTick, stopTick,
  };
})();

export default Game;
