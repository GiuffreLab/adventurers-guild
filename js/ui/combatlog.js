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

// ── Class-specific attack templates ────────────────────────────────────
// Each class gets its own flavor. Fallback T_ATTACK used for unknown classes.
const T_ATTACK_HERO = [
  (m, e, dmg) => `${m} slashes ${e} with a swift blade — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} charges ${e} with a mighty strike — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} lunges forward, cutting ${e} for <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} follows up with a swift combo on ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
];
const T_ATTACK_KNIGHT = [
  (m, e, dmg) => `${m} delivers a crushing overhead blow to ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} shield-bashes ${e} and follows with a heavy slash — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} drives their sword through ${e}'s guard — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} charges ${e} in full plate — <span class="dmg-num dmg-phys">${dmg}</span>!`,
];
const T_ATTACK_MAGE = [
  (m, e, dmg) => `${m} hurls a bolt of arcane fire at ${e} — <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} conjures a shard of ice that pierces ${e} — <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `Arcane energy crackles from ${m}'s staff, striking ${e} for <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} channels a lightning bolt at ${e} — <span class="dmg-num dmg-mag">${dmg}</span>!`,
];
const T_ATTACK_ROGUE = [
  (m, e, dmg) => `${m} darts behind ${e} and stabs deep — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} flicks a dagger into ${e}'s weak spot — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} slips through ${e}'s defenses with a quick stab — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} strikes from the shadows, piercing ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
];
const T_ATTACK_CLERIC = [
  (m, e, dmg) => `${m} smites ${e} with divine light — <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} calls down holy wrath upon ${e} — <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} channels sacred energy, searing ${e} for <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} swings their mace with divine fury — ${e} takes <span class="dmg-num dmg-mag">${dmg}</span>!`,
];
const T_ATTACK_RANGER = [
  (m, e, dmg) => `${m} looses an arrow that pierces ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} lines up a precise shot and hits ${e} for <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `An arrow whistles from ${m}'s bow, striking ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} fires a rapid volley at ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
];
const T_ATTACK_BARD = [
  (m, e, dmg) => `${m} strikes a dissonant chord that rattles ${e} — <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} sings a piercing note — sonic energy blasts ${e} for <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `${m} strums a war melody, sending a shockwave into ${e} — <span class="dmg-num dmg-mag">${dmg}</span>!`,
  (m, e, dmg) => `A cutting verse from ${m} strikes ${e} for <span class="dmg-num dmg-mag">${dmg}</span>!`,
];
const T_ATTACK_MONK = [
  (m, e, dmg) => `${m} delivers a flurry of fists to ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} lands a devastating palm strike on ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} sweeps ${e}'s legs and follows with an elbow strike — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} channels ki into a crushing blow against ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
];

// Fallback for unknown classes
const T_ATTACK = [
  (m, e, dmg) => `${m} strikes ${e} for <span class="dmg-num dmg-phys">${dmg}</span> damage!`,
  (m, e, dmg) => `${m} lands a clean hit on ${e} — <span class="dmg-num dmg-phys">${dmg}</span>!`,
  (m, e, dmg) => `${m} attacks ${e}, dealing <span class="dmg-num dmg-phys">${dmg}</span> damage!`,
];

// Map class IDs to their template sets
const CLASS_ATTACK_TEMPLATES = {
  HERO: T_ATTACK_HERO, KNIGHT: T_ATTACK_KNIGHT, MAGE: T_ATTACK_MAGE,
  ROGUE: T_ATTACK_ROGUE, CLERIC: T_ATTACK_CLERIC, RANGER: T_ATTACK_RANGER,
  BARD: T_ATTACK_BARD, MONK: T_ATTACK_MONK,
};
// Magic-style classes (use ✨ icon instead of ⚔)
const MAGIC_CLASSES = new Set(['MAGE', 'CLERIC', 'BARD']);

function getAttackTemplate(classId, seed) {
  const templates = CLASS_ATTACK_TEMPLATES[classId] || T_ATTACK;
  return sPick(templates, seed);
}
function isMagicClass(classId) { return MAGIC_CLASSES.has(classId); }

const T_SKILL = [
  (m, sk, e, dmg) => `${m} activates <strong>${sk}</strong> on ${e} — <span class="dmg-num dmg-skill">${dmg}</span>!`,
  (m, sk, e, dmg) => `${m} unleashes <strong>${sk}</strong> — ${e} takes <span class="dmg-num dmg-skill">${dmg}</span>!`,
  (m, sk, e, dmg) => `The power of <strong>${sk}</strong> surges through ${m} — <span class="dmg-num dmg-skill">${dmg}</span> to ${e}!`,
];

// ── Non-celestial equipment proc templates (purple styling) ─────────
const T_EQUIP_SKILL = [
  (m, sk, e, dmg) => `${m}'s gear surges — <strong>${sk}</strong> strikes ${e} for <span class="dmg-num dmg-equip">${dmg}</span>!`,
  (m, sk, e, dmg) => `<strong>${sk}</strong> activates! ${m}'s weapon flares, hitting ${e} for <span class="dmg-num dmg-equip">${dmg}</span>!`,
  (m, sk, e, dmg) => `${m} triggers <strong>${sk}</strong> — enchanted energy slams ${e} for <span class="dmg-num dmg-equip">${dmg}</span>!`,
];

// ── Celestial equipment proc templates (teal glow styling) ──────────
const T_CELESTIAL_SKILL = [
  (m, sk, e, dmg) => `${m} channels <strong>${sk}</strong> — celestial energy engulfs ${e} for <span class="dmg-num dmg-celestial">${dmg}</span>!`,
  (m, sk, e, dmg) => `The heavens answer ${m}! <strong>${sk}</strong> strikes ${e} — <span class="dmg-num dmg-celestial">${dmg}</span>!`,
  (m, sk, e, dmg) => `Divine radiance erupts from ${m}'s gear — <strong>${sk}</strong> obliterates ${e} for <span class="dmg-num dmg-celestial">${dmg}</span>!`,
];

// ── Cleric heal templates (direct group heal) ────────────────────────
const T_HEAL_CLERIC = [
  (m, hp) => `${m} invokes a prayer of restoration — party recovers <span class="dmg-num dmg-heal">+${hp}</span> HP!`,
  (m, hp) => `Divine light radiates from ${m}, healing the party for <span class="dmg-num dmg-heal">+${hp}</span> HP!`,
  (m, hp) => `${m} lays hands on the wounded — <span class="dmg-num dmg-heal">+${hp}</span> HP restored!`,
];
function getHealTemplate(seed) { return sPick(T_HEAL_CLERIC, seed); }

// ── Bard regen templates (weaker but persistent) ─────────────────────
const T_BARD_REGEN = [
  (m, hp) => `${m} plays an invigorating melody — the party gains <span class="dmg-num dmg-heal">+${hp}</span> HP regen per round!`,
  (m, hp) => `${m} strums a restorative chord — party regenerates <span class="dmg-num dmg-heal">+${hp}</span> HP each round!`,
  (m, hp) => `A soothing song from ${m} washes over the party — <span class="dmg-num dmg-heal">+${hp}</span> HP regen!`,
];
const T_REGEN_TICK = [
  (hp) => `The party recovers <span class="dmg-num dmg-heal">+${hp}</span> HP from the bard's melody.`,
  (hp) => `The lingering song restores <span class="dmg-num dmg-heal">+${hp}</span> HP to the party.`,
];

// ── Knight Bulwark templates ──────────────────────────────────────────
const T_BULWARK = [
  (knight, ally, dmg) => `${knight} leaps in front of ${ally}, absorbing <span class="dmg-num dmg-block">${dmg}</span> damage!`,
  (knight, ally, dmg) => `${knight} throws themselves between ${ally} and the blow — <span class="dmg-num dmg-block">${dmg}</span> taken!`,
  (knight, ally, dmg) => `"Not on my watch!" ${knight} shields ${ally}, taking <span class="dmg-num dmg-block">${dmg}</span> damage!`,
];
// ── Hero Rally Cry templates ─────────────────────────────────────────
const T_RALLY_CRY = [
  (hero, ally, hp) => `${hero} shouts a Rally Cry! ${ally} is reinvigorated — <span class="dmg-num dmg-heal">+${hp}</span> HP!`,
  (hero, ally, hp) => `"Fight on!" ${hero} rallies ${ally} back from the brink — <span class="dmg-num dmg-heal">+${hp}</span> HP!`,
  (hero, ally, hp) => `${hero}'s inspiring cry reaches ${ally} — <span class="dmg-num dmg-heal">+${hp}</span> HP restored!`,
];
// ── Rogue Mark for Death templates ──────────────────────────────────
const T_MARK_FOR_DEATH = [
  (rogue, target) => `${rogue} exposes a weakness — ${target} is <span class="dmg-num" style="color:#f44">Marked for Death</span>!`,
  (rogue, target) => `${rogue}'s critical strike reveals a vulnerability — ${target} is <span class="dmg-num" style="color:#f44">Marked</span>!`,
  (rogue, target) => `"There!" ${rogue} marks ${target}'s weak point — <span class="dmg-num" style="color:#f44">+20% damage taken</span>!`,
];
// ── Ranger Volley templates ─────────────────────────────────────────
const T_VOLLEY = [
  (ranger, count, dmg) => `${ranger} launches a Volley — arrows rain on <span class="dmg-num">${count}</span> enemies for <span class="dmg-num dmg-ally">${dmg}</span> each!`,
  (ranger, count, dmg) => `${ranger} darkens the sky! Volley hits <span class="dmg-num">${count}</span> foes for <span class="dmg-num dmg-ally">${dmg}</span> each!`,
  (ranger, count, dmg) => `A rain of arrows from ${ranger} strikes <span class="dmg-num">${count}</span> enemies — <span class="dmg-num dmg-ally">${dmg}</span> damage each!`,
];
// ── Monk Ki Barrier templates ───────────────────────────────────────
const T_KI_BARRIER = [
  (monk, hp) => `${monk}'s Ki Barrier pulses — <span class="dmg-num dmg-heal">+${hp}</span> HP drained from the enemy!`,
  (monk, hp) => `${monk} absorbs life energy through their Ki Barrier — <span class="dmg-num dmg-heal">+${hp}</span> HP!`,
];

// ── Mage Spell Echo templates ──────────────────────────────────────
const T_SPELL_ECHO = [
  (mage) => `Arcane energy swirls around ${mage} — <span class="dmg-num" style="color:#a0f">Spell Echo</span> activated!`,
  (mage) => `${mage}'s magic reverberates — <span class="dmg-num" style="color:#a0f">Spell Echo</span>: next spells amplified!`,
  (mage) => `The air crackles as ${mage} channels <span class="dmg-num" style="color:#a0f">Spell Echo</span>!`,
];
// ── Ranger Camouflage templates ────────────────────────────────────
const T_CAMOUFLAGE = [
  (ranger) => `${ranger} fades into the shadows — <span class="dmg-num" style="color:#4a4">Camouflage</span> active!`,
  (ranger) => `${ranger} blends with the terrain — <span class="dmg-num" style="color:#4a4">Camouflage</span>: harder to hit!`,
  (ranger) => `${ranger} vanishes from sight — <span class="dmg-num" style="color:#4a4">Camouflaged</span>!`,
];
// ── Cleric Divine Shield templates ─────────────────────────────────
const T_DIVINE_SHIELD = [
  (cleric) => `${cleric} invokes a <span class="dmg-num" style="color:#ff0">Divine Shield</span> — the party is protected!`,
  (cleric) => `Holy light surrounds the party! ${cleric}'s <span class="dmg-num" style="color:#ff0">Divine Shield</span> reduces incoming damage!`,
  (cleric) => `${cleric} channels sacred energy — <span class="dmg-num" style="color:#ff0">Divine Shield</span> guards the party!`,
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
      // Combat stats — used for damage calc, action weight, crit/dodge
      atk: eff.atk || m.stats.atk || 10,
      mag: eff.mag || m.stats.mag || 1,
      def: eff.def || m.stats.def || 5,
      spd: eff.spd || m.stats.spd || 10,
      crit: eff.crit || m.stats.crit || 0,
      dodge: eff.dodge || m.stats.dodge || 0,
    };
  });

  // ── SPD-weighted random pick helper ──
  // Higher SPD → more likely to be chosen to act
  function sPickWeighted(arr, seed) {
    if (arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    // Weight = spd + 5 (floor so even 0 SPD gets a chance)
    const weights = arr.map(m => (m.spd || 10) + 5);
    const total = weights.reduce((s, w) => s + w, 0);
    let roll = sRand(seed) * total;
    for (let i = 0; i < arr.length; i++) {
      roll -= weights[i];
      if (roll <= 0) return arr[i];
    }
    return arr[arr.length - 1];
  }

  // ── Stat-based damage helper ──
  // Physical classes scale off ATK, magic classes scale off MAG
  function calcPartyDmg(attacker, seed, bonus) {
    const isMagic = isMagicClass(attacker.class);
    const stat = isMagic ? (attacker.mag || 1) : (attacker.atk || 10);
    // Base damage: stat * (1.8 to 2.8 random multiplier), scaled by synergy bonus
    const multiplier = 1.8 + sRand(seed) * 1.0;
    return Math.max(2, Math.floor(stat * multiplier * bonus));
  }

  // ── DEF-based damage reduction ──
  // Reduces incoming damage: reduction = def / (def + 60)  →  ~14% at 10 DEF, ~33% at 30 DEF
  function applyDef(rawDmg, defender) {
    const def = defender.def || 0;
    const reduction = def / (def + 60);
    return Math.max(1, Math.floor(rawDmg * (1 - reduction)));
  }

  // ── CRIT chance from stat ──
  // crit / (crit + 100)  →  ~9% at 10, ~17% at 20, ~33% at 50
  function critChance(attacker) {
    const c = attacker.crit || 0;
    return c / (c + 100);
  }

  // ── DODGE chance from stat ──
  // dodge / (dodge + 80)  →  ~11% at 10, ~20% at 20, ~33% at 40
  function dodgeChance(defender) {
    const d = defender.dodge || 0;
    return d / (d + 80);
  }

  // Scale enemy count with party size — larger parties face more foes
  // Base 3 enemies for 4 members, +1 per extra member (up to 6 for a party of 7)
  const partyCount = partyHp.length;
  const extraEnemies = Math.max(0, partyCount - 4);
  const targetEnemyCount = enemyNames.length + extraEnemies;

  // Build the full enemy name list, cycling through template names for extras
  const fullEnemyNames = [];
  for (let i = 0; i < targetEnemyCount; i++) {
    fullEnemyNames.push(enemyNames[i % enemyNames.length]);
  }

  // Initialize enemies with HP proportional to party HP
  const totalPartyHp = partyHp.reduce((s, p) => s + p.maxHp, 0);
  const avgMemberHp = totalPartyHp / Math.max(1, partyHp.length);
  const totalEnemyHpPool = Math.max(60, Math.floor(totalPartyHp * 1.2));
  const perEnemyBaseHp = Math.floor(totalEnemyHpPool / Math.max(1, fullEnemyNames.length));

  let enemies = fullEnemyNames.map((name, i) => ({
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

  // ── Per-member combat stats tracking ──
  const combatStats = {};
  for (const m of partyHp) {
    combatStats[m.id] = { id: m.id, name: m.name, class: m.class, dmgDealt: 0, healingDone: 0, healingReceived: 0, dmgTaken: 0 };
  }

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

  // ── Phase 3: Battle (loop until one side dies) ──
  // Scale battle length and reinforcement cap with party size
  const MAX_BATTLE_EVENTS = 40 + extraEnemies * 5; // +5 events per extra enemy
  let reinforceCount = 0;
  const maxReinforcements = Math.min(3 + extraEnemies, fullEnemyNames.length);
  let regenPerTick = 0; // Bard regen — HP per member per round
  let regenSource = null; // Name of the bard who cast regen
  let regenSourceId = null; // ID of the bard for stat tracking

  // Knight Bulwark — track cooldown per knight (keyed by party member id)
  const coverCooldowns = {}; // { memberId: roundsRemaining }
  // Build set of knights that have the Bulwark skill
  const knightsWithCover = new Set();

  // Hero Rally Cry — track cooldown per hero
  const rallyCooldowns = {}; // { memberId: roundsRemaining }
  const heroesWithRally = new Set();

  // Rogue Mark for Death — track which enemies are marked
  const markedEnemies = {}; // { enemyId: roundsRemaining }
  const roguesWithMark = new Set();

  // Ranger Volley — track which rangers have the skill
  const rangersWithVolley = new Set();

  // Monk Ki Barrier — track monks with lifesteal
  const monksWithKiBarrier = new Set();

  // Mage Spell Echo — damage amp after skill cast
  const magesWithSpellEcho = new Set();
  const spellEchoRounds = {}; // { memberId: roundsRemaining }

  // Ranger Camouflage — dodge/damage reduction after Volley
  const camoRounds = {}; // { memberId: roundsRemaining }

  // Cleric Divine Shield — party damage reduction after heal
  const clericsWithDivineShield = new Set();
  let divineShieldRounds = 0; // party-wide counter
  let divineShieldSource = null; // name of cleric who cast it

  for (const m of members) {
    const memberData = Game.getMember(m.id);
    const memberSkills = memberData && memberData.skills ? memberData.skills : [];
    if (m.class === 'KNIGHT' && memberSkills.includes('BULWARK')) {
      knightsWithCover.add(m.id);
      coverCooldowns[m.id] = 0;
    }
    if (m.class === 'HERO' && memberSkills.includes('RALLY_CRY')) {
      heroesWithRally.add(m.id);
      rallyCooldowns[m.id] = 0;
    }
    if (m.class === 'ROGUE' && memberSkills.includes('MARK_FOR_DEATH')) {
      roguesWithMark.add(m.id);
    }
    if (m.class === 'RANGER' && memberSkills.includes('VOLLEY')) {
      rangersWithVolley.add(m.id);
    }
    if (m.class === 'MONK' && memberSkills.includes('KI_BARRIER')) {
      monksWithKiBarrier.add(m.id);
    }
    if (m.class === 'MAGE' && (memberSkills.includes('SPELL_ECHO') || memberSkills.includes('MANA_SURGE'))) {
      magesWithSpellEcho.add(m.id);
      spellEchoRounds[m.id] = 0;
    }
    if (m.class === 'CLERIC' && memberSkills.includes('DIVINE_SHIELD')) {
      clericsWithDivineShield.add(m.id);
    }
  }

  // Live buff state — passed to snapshots so UI can render indicators
  const _bufState = {
    regenPerTick: 0, coverCooldowns, knightsWithCover,
    rallyCooldowns, heroesWithRally, markedEnemies,
    roguesWithMark, monksWithKiBarrier,
    magesWithSpellEcho, spellEchoRounds,
    camoRounds, rangersWithVolley,
    divineShieldRounds: 0, clericsWithDivineShield, divineShieldSource: null,
  };

  for (let i = 0; i < MAX_BATTLE_EVENTS; i++) {
    _bufState.regenPerTick = regenPerTick;  // keep in sync
    _bufState.divineShieldRounds = divineShieldRounds;
    _bufState.divineShieldSource = divineShieldRounds > 0 ? divineShieldSource : null;
    const livingEnemies = enemies.filter(e => e.alive);
    const livingParty = partyHp.filter(p => p.hp > 0);

    // Check end conditions
    if (livingEnemies.length === 0) { battleOutcome = 'victory'; break; }
    if (livingParty.length === 0) { battleOutcome = 'defeat'; break; }

    // Apply bard regen tick (if active)
    if (regenPerTick > 0 && livingParty.length > 0) {
      let anyHealed = false;
      livingParty.forEach(p => {
        const before = p.hp;
        p.hp = Math.min(p.maxHp, p.hp + regenPerTick);
        const actual = p.hp - before;
        if (actual > 0) {
          anyHealed = true;
          if (regenSourceId && combatStats[regenSourceId]) combatStats[regenSourceId].healingDone += actual;
          if (combatStats[p.id]) combatStats[p.id].healingReceived += actual;
        }
      });
      if (anyHealed) {
        const regenText = sPick(T_REGEN_TICK, seed + i * 1111)(regenPerTick);
        events.push({ text: regenText, type: 'heal', icon: '🎵', phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
      }
      // Re-check after regen in case everyone died (shouldn't happen, but safety)
      if (partyHp.filter(p => p.hp > 0).length === 0) { battleOutcome = 'defeat'; break; }
    }

    // Tick down Bulwark cooldowns
    for (const id of Object.keys(coverCooldowns)) {
      if (coverCooldowns[id] > 0) coverCooldowns[id]--;
    }
    // Tick down Rally Cry cooldowns
    for (const id of Object.keys(rallyCooldowns)) {
      if (rallyCooldowns[id] > 0) rallyCooldowns[id]--;
    }
    // Tick down Mark for Death durations
    for (const id of Object.keys(markedEnemies)) {
      if (markedEnemies[id] > 0) markedEnemies[id]--;
      if (markedEnemies[id] <= 0) delete markedEnemies[id];
    }
    // Tick down Spell Echo durations
    for (const id of Object.keys(spellEchoRounds)) {
      if (spellEchoRounds[id] > 0) spellEchoRounds[id]--;
    }
    // Tick down Camouflage durations
    for (const id of Object.keys(camoRounds)) {
      if (camoRounds[id] > 0) camoRounds[id]--;
      if (camoRounds[id] <= 0) delete camoRounds[id];
    }
    // Tick down Divine Shield
    if (divineShieldRounds > 0) {
      divineShieldRounds--;
      _bufState.divineShieldRounds = divineShieldRounds;
      _bufState.divineShieldSource = divineShieldRounds > 0 ? divineShieldSource : null;
    }

    const es = seed + (i + 10) * 7919;
    const roll = sRand(es + 3);
    let text = '';
    let type = 'attack';
    let icon = '⚔';

    if (roll < 0.35) {
      // ── Party member attacks enemy ──
      const attacker = sPickWeighted(livingParty, es + 10);
      const target = sPick(livingEnemies, es + 11);
      let baseDmg = calcPartyDmg(attacker, es + 12, dmgBonus);
      // Mage Spell Echo amplification
      if (spellEchoRounds[attacker.id] > 0) baseDmg = Math.floor(baseDmg * 1.50);
      // Mark for Death amplification
      if (markedEnemies[target.id]) baseDmg = Math.floor(baseDmg * 1.20);
      const isCrit = sRand(es + 13) < critChance(attacker);
      const dmg = isCrit ? Math.floor(baseDmg * 1.5) : baseDmg;
      target.hp = Math.max(0, target.hp - dmg);
      if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += dmg;

      const classId = attacker.class || 'HERO';
      if (isCrit) {
        const dmgStr = `${dmg} CRIT`;
        // Override template to use crit class for the damage number
        const baseText = getAttackTemplate(classId, es)(attacker.name, target.name, dmgStr);
        text = baseText.replace(/dmg-(phys|mag)/, 'dmg-crit');
        icon = '💥'; type = 'crit';
      } else {
        text = getAttackTemplate(classId, es)(attacker.name, target.name, `${dmg}`);
        if (isMagicClass(classId)) { icon = '✨'; type = 'magic'; }
        else { icon = '⚔'; type = 'attack'; }
      }

      // Monk Ki Barrier — lifesteal on hit
      if (monksWithKiBarrier.has(attacker.id) && attacker.hp > 0) {
        const lifeSteal = Math.max(1, Math.floor(dmg * 0.25));
        const before = attacker.hp;
        attacker.hp = Math.min(attacker.maxHp, attacker.hp + lifeSteal);
        const actual = attacker.hp - before;
        if (actual > 0) {
          if (combatStats[attacker.id]) combatStats[attacker.id].healingDone += actual;
          if (combatStats[attacker.id]) combatStats[attacker.id].healingReceived += actual;
          events.push({ text, type, icon, phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
          text = sPick(T_KI_BARRIER, es + 90)(attacker.name, actual);
          icon = '🔮'; type = 'heal';
        }
      }

      // Rogue Mark for Death — on crit, mark the target
      if (isCrit && roguesWithMark.has(attacker.id) && target.alive) {
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        markedEnemies[target.id] = 2;
        text = sPick(T_MARK_FOR_DEATH, es + 91)(attacker.name, target.name);
        icon = '🎯'; type = 'debuff';
      }

      if (target.hp <= 0) {
        target.alive = false;
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        text = sPick(T_ENEMY_DEFEAT, es + 50)(target.name, attacker.name);
        icon = '💥'; type = 'defeat';
      }

    } else if (roll < 0.50) {
      // ── Party skill usage ──
      const attacker = sPickWeighted(livingParty, es + 20);
      const target = sPick(livingEnemies, es + 21);
      const memberData = Game.getMember(attacker.id);
      const skills = memberData ? memberData.skills : [];
      if (skills.length > 0) {
        const skillId = sPick(skills, es + 22);
        const skill = getSkill(skillId);
        if (skill) {
          // ── Ranger Volley: AoE all enemies ──
          if (skillId === 'VOLLEY' && rangersWithVolley.has(attacker.id)) {
            // Volley: AoE at 60% of normal attack damage per target
            const perTargetDmg = Math.max(2, Math.floor(calcPartyDmg(attacker, es + 23, dmgBonus) * 0.60));
            const currentLiving = enemies.filter(e => e.alive);
            let volleyTotalDmg = 0;
            currentLiving.forEach(e => {
              const ampDmg = markedEnemies[e.id] ? Math.floor(perTargetDmg * 1.20) : perTargetDmg;
              e.hp = Math.max(0, e.hp - ampDmg);
              volleyTotalDmg += ampDmg;
              if (e.hp <= 0) e.alive = false;
            });
            if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += volleyTotalDmg;
            text = sPick(T_VOLLEY, es)(attacker.name, currentLiving.length, perTargetDmg);
            icon = '🏹'; type = 'skill';
            // Ranger Camouflage — activate after Volley
            if (rangersWithVolley.has(attacker.id)) {
              camoRounds[attacker.id] = 2;
              events.push({ text, type, icon, phase: 'battle' });
              snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
              text = sPick(T_CAMOUFLAGE, es + 96)(attacker.name);
              icon = '🍃'; type = 'buff';
            }
            // Check for kills
            const killed = currentLiving.filter(e => !e.alive);
            if (killed.length > 0) {
              events.push({ text, type, icon, phase: 'battle' });
              snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
              text = killed.map(e => `${e.name} falls!`).join(' ');
              icon = '💥'; type = 'defeat';
            }
          } else {
            // Standard skill attack — 25% stronger than basic attack
            let baseDmg = Math.max(3, Math.floor(calcPartyDmg(attacker, es + 23, dmgBonus) * 1.25));
            // Mage Spell Echo amplification on skill damage
            if (spellEchoRounds[attacker.id] > 0) baseDmg = Math.floor(baseDmg * 1.50);
            if (markedEnemies[target.id]) baseDmg = Math.floor(baseDmg * 1.20);
            target.hp = Math.max(0, target.hp - baseDmg);
            if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += baseDmg;

            // 3-tier skill styling: celestial > equipment > class
            const isCelestial = skillId.startsWith('CEL_');
            const isEquipProc = !isCelestial && skill.source === 'equipment';
            if (isCelestial) {
              text = sPick(T_CELESTIAL_SKILL, es)(attacker.name, skill.name, target.name, baseDmg);
              icon = '✦'; type = 'celestial';
            } else if (isEquipProc) {
              text = sPick(T_EQUIP_SKILL, es)(attacker.name, skill.name, target.name, baseDmg);
              icon = skill.icon || '⚡'; type = 'equip';
            } else {
              text = sPick(T_SKILL, es)(attacker.name, skill.name, target.name, baseDmg);
              icon = skill.icon || '⚡'; type = 'skill';
            }

            // Monk Ki Barrier lifesteal on skill use
            if (monksWithKiBarrier.has(attacker.id) && attacker.hp > 0) {
              const lifeSteal = Math.max(1, Math.floor(baseDmg * 0.25));
              const before = attacker.hp;
              attacker.hp = Math.min(attacker.maxHp, attacker.hp + lifeSteal);
              const actual = attacker.hp - before;
              if (actual > 0) {
                if (combatStats[attacker.id]) combatStats[attacker.id].healingDone += actual;
                if (combatStats[attacker.id]) combatStats[attacker.id].healingReceived += actual;
                events.push({ text, type, icon, phase: 'battle' });
                snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
                text = sPick(T_KI_BARRIER, es + 90)(attacker.name, actual);
                icon = '🔮'; type = 'heal';
              }
            }

            // Mage Spell Echo — activate damage amp after casting a skill
            if (magesWithSpellEcho.has(attacker.id) && spellEchoRounds[attacker.id] === 0) {
              spellEchoRounds[attacker.id] = 2;
              events.push({ text, type, icon, phase: 'battle' });
              snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
              text = sPick(T_SPELL_ECHO, es + 95)(attacker.name);
              icon = '🌀'; type = 'buff';
            }

            if (target.hp <= 0) {
              target.alive = false;
              events.push({ text, type, icon, phase: 'battle' });
              snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
              text = sPick(T_ENEMY_DEFEAT, es + 51)(target.name, attacker.name);
              icon = '💥'; type = 'defeat';
            }
          }
        } else {
          const baseDmg = calcPartyDmg(attacker, es + 24, dmgBonus);
          target.hp = Math.max(0, target.hp - baseDmg);
          if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += baseDmg;
          text = sPick(T_ATTACK, es)(attacker.name, target.name, baseDmg);
          icon = '⚔'; type = 'attack';
        }
      } else {
        const baseDmg = calcPartyDmg(attacker, es + 25, dmgBonus);
        target.hp = Math.max(0, target.hp - baseDmg);
        if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += baseDmg;
        text = sPick(T_ATTACK, es)(attacker.name, target.name, baseDmg);
        icon = '⚔'; type = 'attack';
      }

    } else if (roll < 0.72) {
      // ── Enemy attacks party member ──
      const attacker = sPick(livingEnemies, es + 30);
      const target = sPick(livingParty, es + 31);
      // DODGE check — stat-based chance to avoid the attack entirely
      const totalDodge = dodgeChance(target) + (camoRounds[target.id] > 0 ? 0.40 : 0);
      if (sRand(es + 97) < totalDodge) {
        const dodgeReason = camoRounds[target.id] > 0 ? 'is camouflaged' : 'deftly sidesteps';
        text = `${target.name} ${dodgeReason} — the attack misses!`;
        icon = camoRounds[target.id] > 0 ? '🍃' : '💨'; type = 'dodge';
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        continue;
      }
      const rawDmg = Math.max(1, Math.floor(attacker.atk * (0.5 + sRand(es + 32) * 0.7)));
      // Apply DEF reduction, synergy reduction, and Divine Shield
      const shieldReduction = divineShieldRounds > 0 ? 0.15 : 0;
      const afterDef = applyDef(rawDmg, target);
      const baseDmg = Math.max(1, Math.floor(afterDef * (1 - dmgReduction) * (1 - shieldReduction)));
      const isSkill = sRand(es + 33) < 0.30;

      if (isSkill) {
        const skillName = sPick(MONSTER_SKILLS, es + 34);
        const dmg = Math.floor(baseDmg * 1.3);
        target.hp = Math.max(0, target.hp - dmg);
        if (combatStats[target.id]) combatStats[target.id].dmgTaken += dmg;
        text = sPick(T_ENEMY_SKILL, es)(attacker.name, skillName, target.name, dmg);
        icon = '🔥'; type = 'enemy';
      } else {
        target.hp = Math.max(0, target.hp - baseDmg);
        if (combatStats[target.id]) combatStats[target.id].dmgTaken += baseDmg;
        text = sPick(T_ENEMY_ATK, es)(attacker.name, target.name, baseDmg);
        icon = '💀'; type = 'enemy';
      }

      // Knight Bulwark — intercept ANY hit on an ally every 3 rounds
      const dmgTaken = isSkill ? Math.floor(baseDmg * 1.3) : baseDmg;
      const availableBulwark = partyHp.filter(p =>
        p.hp > 0 && p.id !== target.id && knightsWithCover.has(p.id) && coverCooldowns[p.id] === 0
      );
      if (availableBulwark.length > 0) {
        const knight = sPick(availableBulwark, es + 80);
        // Undo damage to target, redirect to knight — fix stat tracking
        if (combatStats[target.id]) combatStats[target.id].dmgTaken -= dmgTaken;
        target.hp = Math.min(target.hp + dmgTaken, target.maxHp); // restore target
        knight.hp = Math.max(0, knight.hp - dmgTaken); // knight absorbs it
        if (combatStats[knight.id]) combatStats[knight.id].dmgTaken += dmgTaken;
        coverCooldowns[knight.id] = 3; // 3-round cooldown

        // Push the original attack event first
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));

        // Then the Bulwark intercept event
        text = sPick(T_BULWARK, es + 81)(knight.name, target.name, dmgTaken);
        icon = '🛡'; type = 'cover';

        // Check if the knight was KO'd from absorbing the hit
        if (knight.hp <= 0) {
          events.push({ text, type, icon, phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
          text = sPick(T_PARTY_KO, es + 82)(knight.name, attacker.name);
          icon = '💀'; type = 'ko';
        }
      } else if (target.hp <= 0) {
        // No Bulwark available — normal KO
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        text = sPick(T_PARTY_KO, es + 70)(target.name, attacker.name);
        icon = '💀'; type = 'ko';
      }

      // Hero Rally Cry — triggers when any ally drops below 30% HP
      const woundedAlly = partyHp.find(p => p.hp > 0 && p.hp < p.maxHp * 0.30);
      if (woundedAlly) {
        const availableHero = partyHp.find(p =>
          p.hp > 0 && heroesWithRally.has(p.id) && rallyCooldowns[p.id] === 0
        );
        if (availableHero) {
          const heroMag = availableHero.mag || 5;
          const rallyHeal = Math.max(1, Math.floor(woundedAlly.maxHp * 0.10 + heroMag * 0.8));
          const before = woundedAlly.hp;
          woundedAlly.hp = Math.min(woundedAlly.maxHp, woundedAlly.hp + rallyHeal);
          const actual = woundedAlly.hp - before;
          rallyCooldowns[availableHero.id] = 4;

          if (actual > 0) {
            if (combatStats[availableHero.id]) combatStats[availableHero.id].healingDone += actual;
            if (combatStats[woundedAlly.id]) combatStats[woundedAlly.id].healingReceived += actual;
            events.push({ text, type, icon, phase: 'battle' });
            snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
            text = sPick(T_RALLY_CRY, es + 85)(availableHero.name, woundedAlly.name, actual);
            icon = '📣'; type = 'buff';
          }
        }
      }

    } else if (roll < 0.82) {
      // ── Party defend / block — DEF stat reduces damage further ──
      const defender = sPick(livingParty, es + 40);
      const attacker = sPick(livingEnemies, es + 41);
      const rawDmg = Math.max(1, Math.floor(attacker.atk * 0.3 * sRand(es + 42)));
      // Blocking already reduces, then DEF reduces further, then synergy
      const afterDef = applyDef(rawDmg, defender);
      const reducedDmg = Math.max(1, Math.floor(afterDef * (1 - dmgReduction)));
      defender.hp = Math.max(0, defender.hp - reducedDmg);
      if (combatStats[defender.id]) combatStats[defender.id].dmgTaken += reducedDmg;
      text = sPick(T_DEFEND, es)(defender.name, attacker.name, reducedDmg);
      icon = '🛡'; type = 'defend';

    } else if (roll < 0.90) {
      // ── Healing / Regen — only Clerics and Bards ──
      const clerics = livingParty.filter(p => p.class === 'CLERIC');
      const bards = livingParty.filter(p => p.class === 'BARD');

      if (clerics.length === 0 && bards.length === 0) {
        // No healer alive — fall back to a party attack
        const attacker = sPickWeighted(livingParty, es + 60);
        const target = sPick(livingEnemies, es + 61);
        const fallbackDmg = calcPartyDmg(attacker, es + 62, dmgBonus);
        target.hp = Math.max(0, target.hp - fallbackDmg);
        if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += fallbackDmg;
        const classId = attacker.class || 'HERO';
        text = getAttackTemplate(classId, es)(attacker.name, target.name, fallbackDmg);
        if (isMagicClass(classId)) { icon = '✨'; type = 'magic'; }
        else { icon = '⚔'; type = 'attack'; }
        if (target.hp <= 0) { target.alive = false; }
      } else if (clerics.length > 0 && (bards.length === 0 || sRand(es + 44) < 0.6)) {
        // ── Cleric: direct group heal — scales off MAG ──
        const healer = sPick(clerics, es + 45);
        const magStat = healer.mag || 10;
        const baseHeal = Math.max(3, Math.floor(magStat * (1.5 + sRand(es + 46) * 1.0)));
        const healAmt = Math.floor(baseHeal * healBonus);
        const perMemberHeal = Math.floor(healAmt * 0.5);

        const healed = [];
        livingParty.forEach(p => {
          const before = p.hp;
          p.hp = Math.min(p.maxHp, p.hp + perMemberHeal);
          const actual = p.hp - before;
          if (actual > 0) {
            if (combatStats[healer.id]) combatStats[healer.id].healingDone += actual;
            if (combatStats[p.id]) combatStats[p.id].healingReceived += actual;
            if (p.id !== healer.id) healed.push({ name: p.name, amt: actual });
          }
        });

        text = getHealTemplate(es)(healer.name, healAmt);
        icon = '💚'; type = 'heal';
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));

        if (healed.length > 0) {
          const names = healed.map(h => `${h.name} (<span class="dmg-num dmg-heal">+${h.amt}</span>)`).join(', ');
          text = `${names} received healing from ${healer.name}.`;
          icon = '💚'; type = 'heal';
          events.push({ text, type, icon, phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        }
        // Cleric Divine Shield — activate after group heal
        if (clericsWithDivineShield.has(healer.id)) {
          divineShieldRounds = 3;
          divineShieldSource = healer.name;
          _bufState.divineShieldRounds = divineShieldRounds;
          _bufState.divineShieldSource = divineShieldSource;
          const shieldText = sPick(T_DIVINE_SHIELD, es + 98)(healer.name);
          events.push({ text: shieldText, type: 'buff', icon: '⛨', phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        }
        continue;
      } else {
        // ── Bard: regen buff — scales off MAG ──
        const bard = sPick(bards, es + 45);
        const bardMag = bard.mag || 5;
        const baseRegen = Math.max(1, Math.floor(bardMag * (0.4 + sRand(es + 47) * 0.3)));
        const regenAmt = Math.max(1, Math.floor(baseRegen * healBonus));
        regenPerTick = regenAmt; // refreshes the regen value each time bard casts
        regenSource = bard.name;
        regenSourceId = bard.id;

        text = sPick(T_BARD_REGEN, es)(bard.name, regenAmt);
        icon = '🎵'; type = 'buff';
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        continue;
      }

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
        const attacker = sPickWeighted(livingParty, es + 60);
        const target = sPick(livingEnemies, es + 61);
        const baseDmg = calcPartyDmg(attacker, es + 62, dmgBonus);
        target.hp = Math.max(0, target.hp - baseDmg);
        if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += baseDmg;
        text = sPick(T_ATTACK, es)(attacker.name, target.name, baseDmg);
        icon = '⚔'; type = 'attack';
        if (target.hp <= 0) { target.alive = false; }
      }
    }

    events.push({ text, type, icon, phase: 'battle' });
    snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
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
    snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
  }

  const totalEvents = events.length;
  return { events, snapshots, partyHp, enemies, totalEvents, battleOutcome, effectiveInterval, combatStats };
}

function makeSnapshot(party, enemies, buffs) {
  const b = buffs || {};
  return {
    party: party.map(p => {
      const pBuffs = [];
      // Bard regen
      if (b.regenPerTick > 0) pBuffs.push({ id: 'regen', icon: '🎵', label: 'Regen', desc: `+${b.regenPerTick} HP/rd` });
      // Knight Bulwark cooldown
      if (b.coverCooldowns && b.coverCooldowns[p.id] !== undefined) {
        const cd = b.coverCooldowns[p.id];
        if (b.knightsWithCover && b.knightsWithCover.has(p.id)) {
          pBuffs.push(cd > 0
            ? { id: 'bulwark_cd', icon: '🛡', label: 'Bulwark', desc: `CD: ${cd}`, cooldown: true }
            : { id: 'bulwark', icon: '🛡', label: 'Bulwark', desc: 'Ready' });
        }
      }
      // Hero Rally Cry cooldown
      if (b.rallyCooldowns && b.rallyCooldowns[p.id] !== undefined) {
        const cd = b.rallyCooldowns[p.id];
        if (b.heroesWithRally && b.heroesWithRally.has(p.id)) {
          pBuffs.push(cd > 0
            ? { id: 'rally_cd', icon: '📣', label: 'Rally', desc: `CD: ${cd}`, cooldown: true }
            : { id: 'rally', icon: '📣', label: 'Rally', desc: 'Ready' });
        }
      }
      // Monk Ki Barrier
      if (b.monksWithKiBarrier && b.monksWithKiBarrier.has(p.id)) {
        pBuffs.push({ id: 'ki_barrier', icon: '🔮', label: 'Ki Barrier', desc: 'Lifesteal' });
      }
      // Rogue Mark available
      if (b.roguesWithMark && b.roguesWithMark.has(p.id)) {
        pBuffs.push({ id: 'mark', icon: '🎯', label: 'Mark', desc: 'On crit' });
      }
      // Mage Spell Echo
      if (b.spellEchoRounds && b.spellEchoRounds[p.id] > 0) {
        pBuffs.push({ id: 'spell_echo', icon: '🌀', label: 'Spell Echo', desc: `${b.spellEchoRounds[p.id]}rd — 1.5× dmg` });
      } else if (b.magesWithSpellEcho && b.magesWithSpellEcho.has(p.id) && b.spellEchoRounds && b.spellEchoRounds[p.id] === 0) {
        pBuffs.push({ id: 'spell_echo_ready', icon: '🌀', label: 'Echo', desc: 'Ready', cooldown: true });
      }
      // Ranger Camouflage
      if (b.camoRounds && b.camoRounds[p.id] > 0) {
        pBuffs.push({ id: 'camo', icon: '🍃', label: 'Camo', desc: `${b.camoRounds[p.id]}rd — 40% dodge` });
      }
      // Cleric Divine Shield (party-wide)
      if (b.divineShieldRounds > 0) {
        pBuffs.push({ id: 'divine_shield', icon: '⛨', label: 'D.Shield', desc: `${b.divineShieldRounds}rd — -15% dmg` });
      }
      return { id: p.id, name: p.name, hp: p.hp, maxHp: p.maxHp, class: p.class, buffs: pBuffs };
    }),
    enemies: enemies.map(e => {
      const eDebuffs = [];
      if (b.markedEnemies && b.markedEnemies[e.id] > 0) {
        eDebuffs.push({ id: 'marked', icon: '🎯', label: 'Marked', desc: `${b.markedEnemies[e.id]}rd`, rounds: b.markedEnemies[e.id] });
      }
      return {
        id: e.id, name: e.name, hp: Math.max(0, e.hp), maxHp: e.maxHp,
        alive: e.alive, isReinforcement: e.isReinforcement || false,
        debuffs: eDebuffs,
      };
    }),
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

// Get per-member combat stats from the simulation
export function getCombatStats() {
  const sim = ensureSim();
  if (!sim || !sim.combatStats) return null;
  return Object.values(sim.combatStats);
}

// Get all simulation events (call before resetCombatLog to capture for export)
export function getSimEvents() {
  if (!_sim) return [];
  return _sim.events.map(e => ({
    text: e.text.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' '),
    type: e.type,
    icon: e.icon,
    phase: e.phase,
  }));
}

export function resetCombatLog() {
  _sim = null;
  _simQuestId = null;
}
