// Combat Log Generator — v3 (outcome-driven)
// Simulates a full battle that runs until one side is eliminated.
// Events are revealed one at a time; the quest finishes when the last event plays.
// All deterministic via seeded random so re-renders produce identical results.

import Game from '../game.js';
import { getQuest, getClass, randInt } from '../data.js';
import { getSkill } from '../skills.js';

// ── Phases are now structural markers, not progress-based ──────────────
const PHASES = [
  { id: 'travel',    label: 'Traveling',    icon: '🗺' },
  { id: 'encounter', label: 'Encounter',    icon: '👁' },
  { id: 'battle',    label: 'Battle',       icon: '⚔' },
  { id: 'resolve',   label: 'Resolution',   icon: '✦' },
];

export function getPhases() { return PHASES; }

export function getQuestPhase(progress) {
  // Map progress [0..1] to a phase for the phase tracker dots
  if (progress < 0.10) return PHASES[0];
  if (progress < 0.20) return PHASES[1];
  if (progress < 0.90) return PHASES[2];
  return PHASES[3];
}

// ── Event interval (seconds between revealed events) ────────────────────
export const EVENT_INTERVAL = 1.5;

// ── Seeded random ───────────────────────────────────────────────────────
function sRand(seed) {
  let x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
function sPick(arr, seed) { return arr[Math.floor(sRand(seed) * arr.length)]; }
function sInt(min, max, seed) { return Math.floor(sRand(seed) * (max - min + 1)) + min; }

// ── Event text templates ────────────────────────────────────────────────
const T_TRAVEL = [
  (m, env) => `${m} leads the party through ${env}.`,
  (m, env) => `The path to ${env} is quiet... for now.`,
  (m, env) => `${m} scouts ahead as the party enters ${env}.`,
  (m, env) => `Footsteps echo as the party nears ${env}.`,
  (m, env) => `The air grows tense near ${env}. ${m} grips their weapon.`,
  (m, env) => `${m} notices tracks on the ground — something has been here recently.`,
  (m, env) => `The party moves in formation through ${env}.`,
];
const T_ENCOUNTER = [
  (m, e) => `${m} spots ${e} lurking ahead!`,
  (m, e) => `A wild ${e} appears from the shadows!`,
  (m, e) => `${m} raises an alarm — ${e} blocks the path!`,
  (m, e) => `The ground trembles. ${e} emerges!`,
  (m, e) => `${m} draws their weapon as ${e} charges!`,
  (m, e) => `Ambush! ${e} leaps from cover toward ${m}!`,
];
const T_RESOLVE_WIN = [
  (m) => `${m} surveys the battlefield — victory is theirs!`,
  (m) => `The last enemies fall. ${m} signals the all-clear.`,
  () => `The battle is won. The party gathers their spoils.`,
  (m) => `${m} sheathes their weapon as the dust settles.`,
];
const T_RESOLVE_LOSE = [
  (m) => `${m} falls to their knees... the party is overwhelmed.`,
  () => `The party retreats, battered and broken.`,
  (m) => `${m} drags the wounded to safety as hope fades.`,
];

// Party attack flavor (with damage placeholder {dmg})
const T_ATTACK = [
  (m, e, dmg) => `${m} strikes ${e} for <span class="dmg-num dmg-phys">${dmg}</span> damage!`,
  (m, e, dmg) => `${m} lands a clean hit on ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} slashes at ${e}, dealing <span class="dmg-num dmg-phys">${dmg}</span> damage!`,
  (m, e, dmg) => `${m} charges ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} follows up with a combo on ${e} for <span class="dmg-num dmg-phys">${dmg}</span>!`,
];
const T_MAGIC = [
  (m, e, dmg) => `${m} unleashes arcane energy at ${e} for <span class="dmg-num dmg-mag">${dmg}</span> damage!`,
  (m, e, dmg) => `A blast of magic from ${m} engulfs ${e} — <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} chants an incantation — ${e} takes <span class="dmg-num dmg-mag">${dmg}</span>!`,
];
const T_SKILL = [
  (m, sk, e, dmg) => `${m} activates <strong>${sk}</strong> on ${e} — <span class="dmg-num dmg-skill">${dmg}</span>!`,
  (m, sk, e, dmg) => `${m} unleashes <strong>${sk}</strong> — ${e} takes <span class="dmg-num dmg-skill">${dmg}</span>!`,
  (m, sk, e, dmg) => `The power of <strong>${sk}</strong> surges through ${m} — <span class="dmg-num dmg-skill">${dmg}</span> to ${e}!`,
];
const T_HEAL = [
  (m, hp) => `${m} channels healing magic — party recovers <span class="dmg-num dmg-heal">+${hp}</span> HP!`,
  (m, hp) => `A warm glow from ${m} heals <span class="dmg-num dmg-heal">+${hp}</span> HP!`,
];
const T_DEFEND = [
  (m, e, dmg) => `${m} blocks ${e}'s attack — only <span class="dmg-num dmg-block">${dmg}</span> damage taken!`,
  (m, e, dmg) => `${m} parries ${e} — <span class="dmg-num dmg-block">${dmg}</span> damage absorbed!`,
];

// Enemy attacks
const T_ENEMY_ATK = [
  (e, m, dmg) => `${e} strikes ${m} for <span class="dmg-num dmg-enemy">${dmg}</span> damage!`,
  (e, m, dmg) => `${e} slams into ${m} — <span class="dmg-num dmg-enemy">${dmg}</span>!`,
  (e, m, dmg) => `${e} claws at ${m}, dealing <span class="dmg-num dmg-enemy">${dmg}</span>!`,
  (e, m, dmg) => `${e} unleashes a vicious attack on ${m} — <span class="dmg-num dmg-enemy">${dmg}</span>!`,
  (e, m, dmg) => `${e} charges ${m} with a fierce blow — <span class="dmg-num dmg-enemy">${dmg}</span>!`,
];
const T_ENEMY_SKILL = [
  (e, sk, m, dmg) => `${e} uses <strong>${sk}</strong> on ${m} — <span class="dmg-num dmg-enemy">${dmg}</span>!`,
  (e, sk, m, dmg) => `${e} casts <strong>${sk}</strong> — ${m} takes <span class="dmg-num dmg-enemy">${dmg}</span>!`,
];
const T_ENEMY_DEFEAT = [
  (e, m) => `${m} delivers the final blow — ${e} falls!`,
  (e, m) => `${e} crumbles to dust! The party presses on.`,
  (e, m) => `With a mighty strike, ${m} defeats ${e}!`,
];
const T_PARTY_KO = [
  (m, e) => `${e}'s blow is too much — ${m} collapses!`,
  (m, e) => `${m} can't take any more damage and falls unconscious!`,
  (m, e) => `${m} staggers and drops — knocked out of the fight!`,
];
const T_REINFORCEMENT = [
  (e) => `${e} calls for reinforcements!`,
  (e) => `A new ${e} joins the fray!`,
  (e) => `Reinforcements arrive — ${e} charges in!`,
];

// Monster skill names by flavor
const MONSTER_SKILLS = [
  'Frenzy', 'Poison Spit', 'Dark Slash', 'Tail Whip', 'Shadow Bolt',
  'Bone Crush', 'Howl', 'Venomous Bite', 'Fire Breath', 'Rock Throw',
  'Ice Spike', 'Thunder Claw', 'Cursed Touch', 'War Cry', 'Berserker Rage',
];

// ── Battle simulation state ────────────────────────────────────────────
// Built once per quest (deterministic from seed), then sliced by progress.

let _sim = null;       // cached simulation
let _simQuestId = null;

function buildSimulation(aq, quest) {
  const seed = aq.startedAt;
  const members = aq.partySnapshot || [];
  const enemyNames = quest.enemies || ['Monster'];
  const envName = quest.environment ? quest.environment.name : 'the unknown';

  // Synergy bonuses for repeated quests
  const dmgBonus = 1 + (Game.getDmgBonus ? Game.getDmgBonus(aq.questId) : 0);
  const dmgReduction = Game.getDmgReduction ? Game.getDmgReduction(aq.questId) : 0;
  const atkSpeedBonus = Game.getAtkSpeedBonus ? Game.getAtkSpeedBonus(aq.questId) : 0;
  const healBonus = 1 + (Game.getHealBonus ? Game.getHealBonus(aq.questId) : 0);
  // Compute effective event interval (faster with ATK speed synergy)
  const effectiveInterval = EVENT_INTERVAL * (1 - atkSpeedBonus);

  // Initialize party HP using effective stats (includes equipment bonuses)
  const partyHp = members.map(m => {
    const member = Game.getMember(m.id);
    const eff = member ? Game.effectiveStats(member) : m.stats;
    return {
      id: m.id, name: m.name, class: m.class,
      maxHp: eff.maxHp || m.stats.maxHp || 100,
      hp: eff.hp || eff.maxHp || m.stats.hp || 100,
      level: m.level, power: m.power || 20,
    };
  });

  // Initialize enemies with HP proportional to party HP
  const totalPartyHp = partyHp.reduce((s, p) => s + p.maxHp, 0);
  const avgMemberHp = totalPartyHp / Math.max(1, partyHp.length);
  const totalEnemyHpPool = Math.max(60, Math.floor(totalPartyHp * 1.2));
  const perEnemyBaseHp = Math.floor(totalEnemyHpPool / Math.max(1, enemyNames.length));

  let enemies = enemyNames.map((name, i) => ({
    id: `enemy_${i}`, name,
    maxHp: Math.max(10, Math.floor(perEnemyBaseHp * (0.7 + sRand(seed + 500 + i) * 0.6))),
    hp: 0,
    atk: Math.max(3, Math.floor(avgMemberHp * (0.06 + sRand(seed + 600 + i) * 0.10))),
    alive: true, isReinforcement: false,
  }));
  enemies.forEach(e => e.hp = e.maxHp);

  const events = [];
  const snapshots = [];
  let nextEnemyId = enemies.length;
  let battleOutcome = null; // 'victory' or 'defeat'

  // ── Phase 1: Travel (2 events) ──
  for (let t = 0; t < 2; t++) {
    const es = seed + t * 3571;
    const m = sPick(members, es + 1);
    const text = sPick(T_TRAVEL, es)(m ? m.name : 'The party', envName);
    events.push({ text, type: 'travel', icon: '🗺', phase: 'travel' });
    snapshots.push(makeSnapshot(partyHp, enemies));
  }

  // ── Phase 2: Encounter (1 event) ──
  {
    const es = seed + 9001;
    const m = sPick(members, es + 1);
    const e = sPick(enemies, es + 2);
    const text = sPick(T_ENCOUNTER, es)(m ? m.name : 'The party', e.name);
    events.push({ text, type: 'encounter', icon: '👁', phase: 'encounter' });
    snapshots.push(makeSnapshot(partyHp, enemies));
  }

  // ── Phase 3: Battle (loop until one side dies, capped at 40 rounds) ──
  const MAX_BATTLE_EVENTS = 40;
  let reinforceCount = 0;
  const maxReinforcements = Math.min(3, enemyNames.length);

  for (let i = 0; i < MAX_BATTLE_EVENTS; i++) {
    const livingEnemies = enemies.filter(e => e.alive);
    const livingParty = partyHp.filter(p => p.hp > 0);

    // Check end conditions
    if (livingEnemies.length === 0) { battleOutcome = 'victory'; break; }
    if (livingParty.length === 0) { battleOutcome = 'defeat'; break; }

    const es = seed + (i + 10) * 7919;
    const roll = sRand(es + 3);
    let text = '';
    let type = 'attack';
    let icon = '⚔';

    if (roll < 0.35) {
      // ── Party member attacks enemy ──
      const attacker = sPick(livingParty, es + 10);
      const target = sPick(livingEnemies, es + 11);
      const cls = getClass(attacker.class);
      const avgEnemyHp = enemies.reduce((s, e) => s + e.maxHp, 0) / Math.max(1, enemies.length);
      const baseDmg = Math.max(2, Math.floor(avgEnemyHp * (0.15 + sRand(es + 12) * 0.20) * dmgBonus));
      const isCrit = sRand(es + 13) < 0.15;
      const dmg = isCrit ? Math.floor(baseDmg * 1.5) : baseDmg;
      target.hp = Math.max(0, target.hp - dmg);

      const dmgStr = isCrit ? `${dmg} CRIT` : `${dmg}`;
      if (cls && cls.baseStats.mag > 10) {
        text = sPick(T_MAGIC, es)(attacker.name, target.name, dmgStr);
        icon = '✨'; type = 'magic';
      } else {
        text = sPick(T_ATTACK, es)(attacker.name, target.name, dmgStr);
        icon = '⚔'; type = 'attack';
      }

      if (target.hp <= 0) {
        target.alive = false;
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies));
        text = sPick(T_ENEMY_DEFEAT, es + 50)(target.name, attacker.name);
        icon = '💥'; type = 'defeat';
      }

    } else if (roll < 0.50) {
      // ── Party skill usage ──
      const attacker = sPick(livingParty, es + 20);
      const target = sPick(livingEnemies, es + 21);
      const memberData = Game.getMember(attacker.id);
      const skills = memberData ? memberData.skills : [];
      if (skills.length > 0) {
        const skillId = sPick(skills, es + 22);
        const skill = getSkill(skillId);
        if (skill) {
          const avgEHp = enemies.reduce((s, e) => s + e.maxHp, 0) / Math.max(1, enemies.length);
          const baseDmg = Math.max(3, Math.floor(avgEHp * (0.20 + sRand(es + 23) * 0.25) * dmgBonus));
          target.hp = Math.max(0, target.hp - baseDmg);
          text = sPick(T_SKILL, es)(attacker.name, skill.name, target.name, baseDmg);
          icon = skill.icon || '⚡'; type = 'skill';
          if (target.hp <= 0) {
            target.alive = false;
            events.push({ text, type, icon, phase: 'battle' });
            snapshots.push(makeSnapshot(partyHp, enemies));
            text = sPick(T_ENEMY_DEFEAT, es + 51)(target.name, attacker.name);
            icon = '💥'; type = 'defeat';
          }
        } else {
          const avgEHp2 = enemies.reduce((s, e) => s + e.maxHp, 0) / Math.max(1, enemies.length);
          const baseDmg = Math.max(2, Math.floor(avgEHp2 * (0.15 + sRand(es + 24) * 0.20) * dmgBonus));
          target.hp = Math.max(0, target.hp - baseDmg);
          text = sPick(T_ATTACK, es)(attacker.name, target.name, baseDmg);
          icon = '⚔'; type = 'attack';
        }
      } else {
        const avgEHp3 = enemies.reduce((s, e) => s + e.maxHp, 0) / Math.max(1, enemies.length);
        const baseDmg = Math.max(2, Math.floor(avgEHp3 * (0.15 + sRand(es + 25) * 0.20) * dmgBonus));
        target.hp = Math.max(0, target.hp - baseDmg);
        text = sPick(T_ATTACK, es)(attacker.name, target.name, baseDmg);
        icon = '⚔'; type = 'attack';
      }

    } else if (roll < 0.72) {
      // ── Enemy attacks party member ──
      const attacker = sPick(livingEnemies, es + 30);
      const target = sPick(livingParty, es + 31);
      const rawDmg = Math.max(1, Math.floor(attacker.atk * (0.5 + sRand(es + 32) * 0.7)));
      const baseDmg = Math.max(1, Math.floor(rawDmg * (1 - dmgReduction)));
      const isSkill = sRand(es + 33) < 0.30;

      if (isSkill) {
        const skillName = sPick(MONSTER_SKILLS, es + 34);
        const dmg = Math.floor(baseDmg * 1.3);
        target.hp = Math.max(0, target.hp - dmg);
        text = sPick(T_ENEMY_SKILL, es)(attacker.name, skillName, target.name, dmg);
        icon = '🔥'; type = 'enemy';
      } else {
        target.hp = Math.max(0, target.hp - baseDmg);
        text = sPick(T_ENEMY_ATK, es)(attacker.name, target.name, baseDmg);
        icon = '💀'; type = 'enemy';
      }

      // Check if party member was KO'd
      if (target.hp <= 0) {
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies));
        text = sPick(T_PARTY_KO, es + 70)(target.name, attacker.name);
        icon = '💀'; type = 'ko';
      }

    } else if (roll < 0.82) {
      // ── Party defend / block ──
      const defender = sPick(livingParty, es + 40);
      const attacker = sPick(livingEnemies, es + 41);
      const reducedDmg = Math.max(1, Math.floor(attacker.atk * 0.3 * sRand(es + 42) * (1 - dmgReduction)));
      defender.hp = Math.max(0, defender.hp - reducedDmg);
      text = sPick(T_DEFEND, es)(defender.name, attacker.name, reducedDmg);
      icon = '🛡'; type = 'defend';

    } else if (roll < 0.90) {
      // ── Healing ──
      const healer = sPick(livingParty, es + 45);
      const baseHeal = Math.max(3, Math.floor(healer.maxHp * (0.08 + sRand(es + 46) * 0.12)));
      const healAmt = Math.floor(baseHeal * healBonus);
      livingParty.forEach(p => { p.hp = Math.min(p.maxHp, p.hp + Math.floor(healAmt * 0.5)); });
      text = sPick(T_HEAL, es)(healer.name, healAmt);
      icon = '💚'; type = 'heal';

    } else {
      // ── Reinforcement spawn (limited) ──
      if (reinforceCount < maxReinforcements && livingEnemies.length < 5 && sRand(es + 55) < 0.40) {
        const template = sPick(enemyNames, es + 56);
        const reinforceHp = Math.max(10, Math.floor(perEnemyBaseHp * (0.4 + sRand(es + 57) * 0.4)));
        const newEnemy = {
          id: `enemy_${nextEnemyId++}`, name: template,
          maxHp: reinforceHp, hp: 0,
          atk: Math.max(2, Math.floor(avgMemberHp * (0.04 + sRand(es + 58) * 0.08))),
          alive: true, isReinforcement: true,
        };
        newEnemy.hp = newEnemy.maxHp;
        enemies.push(newEnemy);
        reinforceCount++;
        text = sPick(T_REINFORCEMENT, es)(template);
        icon = '📢'; type = 'reinforce';
      } else {
        // fallback — party attack
        const attacker = sPick(livingParty, es + 60);
        const target = sPick(livingEnemies, es + 61);
        const avgEHp4 = enemies.reduce((s, e) => s + e.maxHp, 0) / Math.max(1, enemies.length);
        const baseDmg = Math.max(2, Math.floor(avgEHp4 * (0.15 + sRand(es + 62) * 0.20) * dmgBonus));
        target.hp = Math.max(0, target.hp - baseDmg);
        text = sPick(T_ATTACK, es)(attacker.name, target.name, baseDmg);
        icon = '⚔'; type = 'attack';
        if (target.hp <= 0) { target.alive = false; }
      }
    }

    events.push({ text, type, icon, phase: 'battle' });
    snapshots.push(makeSnapshot(partyHp, enemies));
  }

  // If we hit the cap without resolution, determine outcome by HP remaining
  if (!battleOutcome) {
    const livingEnemies = enemies.filter(e => e.alive);
    const livingParty = partyHp.filter(p => p.hp > 0);
    battleOutcome = livingParty.length >= livingEnemies.length ? 'victory' : 'defeat';
  }

  // ── Phase 4: Resolution (1 event) ──
  {
    const es = seed + 99999;
    const m = sPick(members, es + 1);
    const templates = battleOutcome === 'victory' ? T_RESOLVE_WIN : T_RESOLVE_LOSE;
    const text = sPick(templates, es)(m ? m.name : 'The party');
    events.push({ text, type: 'resolve', icon: '✦', phase: 'resolve' });
    snapshots.push(makeSnapshot(partyHp, enemies));
  }

  const totalEvents = events.length;
  return { events, snapshots, partyHp, enemies, totalEvents, battleOutcome, effectiveInterval };
}

function makeSnapshot(party, enemies) {
  return {
    party: party.map(p => ({ id: p.id, name: p.name, hp: p.hp, maxHp: p.maxHp })),
    enemies: enemies.map(e => ({
      id: e.id, name: e.name, hp: Math.max(0, e.hp), maxHp: e.maxHp,
      alive: e.alive, isReinforcement: e.isReinforcement || false,
    })),
  };
}

// ── Ensure sim is built ────────────────────────────────────────────────
function ensureSim() {
  const aq = Game.state.guild.activeQuest;
  if (!aq) { _sim = null; _simQuestId = null; return null; }

  const quest = aq.questData || Game.getGeneratedQuest(aq.questId) || getQuest(aq.questId);
  if (!quest) return null;

  if (_simQuestId !== aq.questId) {
    _sim = buildSimulation(aq, quest);
    _simQuestId = aq.questId;
  }
  return _sim;
}

// ── Public API ──────────────────────────────────────────────────────────

// Helper: get the effective event interval (in seconds) for the current sim
function _getInterval() {
  return _sim ? _sim.effectiveInterval : EVENT_INTERVAL;
}

export function generateCombatLog() {
  const aq = Game.state.guild.activeQuest;
  if (!aq) { _sim = null; _simQuestId = null; return []; }

  const sim = ensureSim();
  if (!sim) return [];

  const interval = _getInterval();
  const elapsed = Date.now() - aq.startedAt;
  const visibleCount = Math.min(sim.totalEvents, Math.max(1, Math.floor(elapsed / (interval * 1000)) + 1));

  return sim.events.slice(0, visibleCount);
}

// Get the HP snapshot at the current point in the battle
export function getCombatSnapshot() {
  const aq = Game.state.guild.activeQuest;
  if (!aq || !_sim) return null;

  const interval = _getInterval();
  const elapsed = Date.now() - aq.startedAt;
  const visibleCount = Math.min(_sim.totalEvents, Math.max(1, Math.floor(elapsed / (interval * 1000)) + 1));
  return _sim.snapshots[visibleCount - 1] || null;
}

// Get sim info for game.js: { eventCount, intervalMs }
export function getSimInfo() {
  const sim = ensureSim();
  if (!sim) return null;
  return { eventCount: sim.totalEvents, intervalMs: sim.effectiveInterval * 1000 };
}

export function resetCombatLog() {
  _sim = null;
  _simQuestId = null;
}
