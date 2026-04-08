// Combat Log Generator — v3 (outcome-driven)
// Simulates a full battle that runs until one side is eliminated.
// Events are revealed one at a time; the quest finishes when the last event plays.
// All deterministic via seeded random so re-renders produce identical results.

import Game from '../game.js';
import { getQuest, getClass, randInt } from '../data.js';
import { getSkill } from '../skills.js';
import { esc } from '../util.js';

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
export const EVENT_INTERVAL = 1.0;

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
  (name, count, dmg) => `${name} launches a Volley — arrows rain on <span class="dmg-num">${count}</span> enemies for <span class="dmg-num dmg-ally">${dmg}</span> each!`,
  (name, count, dmg) => `${name} darkens the sky! Volley hits <span class="dmg-num">${count}</span> foes for <span class="dmg-num dmg-ally">${dmg}</span> each!`,
  (name, count, dmg) => `A rain of arrows from ${name} strikes <span class="dmg-num">${count}</span> enemies — <span class="dmg-num dmg-ally">${dmg}</span> damage each!`,
];
const T_MAGE_AOE = [
  (name, skill, count, dmg) => `${name} unleashes ${skill} — arcane devastation hits <span class="dmg-num">${count}</span> enemies for <span class="dmg-num dmg-mag">${dmg}</span> each!`,
  (name, skill, count, dmg) => `${name} casts ${skill}! Magical destruction rains on <span class="dmg-num">${count}</span> foes — <span class="dmg-num dmg-mag">${dmg}</span> each!`,
  (name, skill, count, dmg) => `The air shatters as ${name} channels ${skill} — <span class="dmg-num">${count}</span> enemies take <span class="dmg-num dmg-mag">${dmg}</span> each!`,
];
const T_RANGER_AOE = [
  (name, skill, count, dmg) => `${name} fires ${skill} — a storm of arrows hits <span class="dmg-num">${count}</span> enemies for <span class="dmg-num dmg-ally">${dmg}</span> each!`,
  (name, skill, count, dmg) => `${name} unleashes ${skill}! <span class="dmg-num">${count}</span> foes are struck for <span class="dmg-num dmg-ally">${dmg}</span> each!`,
  (name, skill, count, dmg) => `Arrows fly as ${name} activates ${skill} — <span class="dmg-num">${count}</span> targets take <span class="dmg-num dmg-ally">${dmg}</span> each!`,
];

// ── AoE skill registry ──
// Skills that hit ALL living enemies instead of a single target.
// dmgScale: fraction of normal attack damage applied per target (lower since it hits everyone)
const AOE_SKILLS = {
  // Ranger AoE
  VOLLEY:               { dmgScale: 0.60, templates: T_VOLLEY,     icon: '🏹', type: 'skill',     triggerCamo: true },
  ARROW_STORM:          { dmgScale: 0.75, templates: T_RANGER_AOE, icon: '🌧', type: 'skill',     triggerCamo: true },
  STORM_VOLLEY:         { dmgScale: 0.65, templates: T_RANGER_AOE, icon: '⚡', type: 'equip',     triggerCamo: true },
  CELESTIAL_VOLLEY:     { dmgScale: 0.70, templates: T_RANGER_AOE, icon: '🌠', type: 'equip',     triggerCamo: true },
  CEL_STARFIRE_VOLLEY:  { dmgScale: 0.80, templates: T_RANGER_AOE, icon: '🎆', type: 'celestial', triggerCamo: true },
  // Mage AoE
  ARCANE_CATACLYSM:     { dmgScale: 0.55, templates: T_MAGE_AOE, icon: '💥', type: 'skill',     triggerCamo: false },
  METEOR_STORM:         { dmgScale: 0.70, templates: T_MAGE_AOE, icon: '☄',  type: 'skill',     triggerCamo: false },
  ARCANE_CATACLYSM_EQ:  { dmgScale: 0.60, templates: T_MAGE_AOE, icon: '💥', type: 'equip',     triggerCamo: false },
  CEL_ARCANUM_CATACLYSM:{ dmgScale: 0.75, templates: T_MAGE_AOE, icon: '💥', type: 'celestial', triggerCamo: false },
};
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

// ── Cleric Divine Intervention templates (killing-blow intercept) ──
const T_DIVINE_INTERVENTION = [
  (cleric, ally) => `${cleric} calls upon <span class="dmg-num" style="color:#ffe066">Divine Intervention</span> — ${ally} is saved from death at 1 HP!`,
  (cleric, ally) => `A holy light erupts from ${cleric}! <span class="dmg-num" style="color:#ffe066">Divine Intervention</span> shields ${ally} from the killing blow!`,
  (cleric, ally) => `"Not yet!" ${cleric}'s <span class="dmg-num" style="color:#ffe066">Divine Intervention</span> pulls ${ally} back from the brink — 1 HP!`,
];
// ── Cleric Resurrection templates ─────────────────────────────────
const T_RESURRECTION = [
  (cleric, ally) => `${cleric} channels holy power — <span class="dmg-num" style="color:#ffd700">Resurrection</span>! ${ally} rises from the fallen!`,
  (cleric, ally) => `Divine light engulfs ${ally}'s body! ${cleric}'s <span class="dmg-num" style="color:#ffd700">Resurrection</span> restores them to life!`,
  (cleric, ally) => `${cleric} calls upon the divine — ${ally} is <span class="dmg-num" style="color:#ffd700">Resurrected</span> and returns to the fight!`,
];

// ── Bard Discord templates (enemy debuff) ─────────────────────────
const T_DISCORD = [
  (bard) => `${bard} strikes a jarring <span class="dmg-num" style="color:#c4a">Discord</span> — enemies stagger, their attacks weakened!`,
  (bard) => `A dissonant chord from ${bard} rattles the enemy ranks — <span class="dmg-num" style="color:#c4a">Discord</span>: -20% ATK & SPD!`,
  (bard) => `${bard}'s <span class="dmg-num" style="color:#c4a">Discord</span> shrieks across the battlefield — enemies flinch and slow!`,
];
// ── Bard Crescendo templates (devastating crit buff) ──────────────
const T_CRESCENDO = [
  (bard) => `${bard} builds to a thundering <span class="dmg-num" style="color:#fa0">Crescendo</span> — the next strike will be devastating!`,
  (bard) => `The air trembles as ${bard} channels a <span class="dmg-num" style="color:#fa0">Crescendo</span> — an ally is pushed to their limit!`,
  (bard) => `${bard}'s music swells to a <span class="dmg-num" style="color:#fa0">Crescendo</span> — raw power surges into the party!`,
];
const T_CRESCENDO_STRIKE = [
  (attacker, target, dmg) => `Empowered by the Crescendo, ${attacker} unleashes a <span class="dmg-num" style="color:#fa0">DEVASTATING</span> blow on ${target} for <span class="dmg-num dmg-crit">${dmg}</span> damage!`,
  (attacker, target, dmg) => `${attacker} channels the Crescendo into a <span class="dmg-num" style="color:#fa0">DEVASTATING STRIKE</span> — ${target} takes <span class="dmg-num dmg-crit">${dmg}</span>!`,
  (attacker, target, dmg) => `The Crescendo peaks! ${attacker} delivers a <span class="dmg-num" style="color:#fa0">DEVASTATING CRITICAL</span> to ${target} — <span class="dmg-num dmg-crit">${dmg}</span> damage!`,
];

// ── Bard Discord DoT templates ────────────────────────────────────
const T_DISCORD_DOT = [
  (dmg, count) => `The dissonant echoes rattle <span class="dmg-num">${count}</span> enemies for <span class="dmg-num" style="color:#c4a">${dmg}</span> sonic damage each!`,
  (dmg, count) => `Discord reverberates — <span class="dmg-num">${count}</span> foes take <span class="dmg-num" style="color:#c4a">${dmg}</span> damage from the jarring sound!`,
  (dmg, count) => `The lingering Discord tears at <span class="dmg-num">${count}</span> enemies — <span class="dmg-num" style="color:#c4a">${dmg}</span> sonic damage each!`,
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
  const envName = quest.environment ? esc(quest.environment.name) : 'the unknown';

  // Synergy bonuses for repeated quests
  const dmgBonus = 1 + (Game.getDmgBonus ? Game.getDmgBonus(aq.questId) : 0);
  const dmgReduction = Game.getDmgReduction ? Game.getDmgReduction(aq.questId) : 0;
  const atkSpeedBonus = Game.getAtkSpeedBonus ? Game.getAtkSpeedBonus(aq.questId) : 0;
  // Initialize party auras early so healBonus can include partyHealBonus
  const simAuras = Game.getPartyAuras ? Game.getPartyAuras() : null;
  const partyHealAura = simAuras ? simAuras.heal : 0;
  // healBonus computed after partyHp is built (needs per-member item/skill healBonus)
  let healBonus = 1 + (Game.getHealBonus ? Game.getHealBonus(aq.questId) : 0) + partyHealAura;
  // Compute effective event interval (faster with ATK speed synergy)
  const effectiveInterval = EVENT_INTERVAL * (1 - atkSpeedBonus);
  const partyHp = members.map(m => {
    const member = Game.getMember(m.id);
    const eff = member ? Game.effectiveStats(member, simAuras) : m.stats;
    return {
      id: m.id, name: esc(m.name), class: m.class,
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
      // Special percentage bonuses from items/passives — consumed by combat calculations
      dodgeChance: eff.dodgeChance || 0,   // flat additional dodge % (e.g. 0.15 = +15%)
      critChance: eff.critChance || 0,     // flat additional crit % from skills
      healBonus: eff.healBonus || 0,        // healing output multiplier from items/skills
    };
  });

  // Aggregate per-member item/skill healBonus into the global healBonus
  // (highest individual healBonus from a healer class applies, to avoid stacking from non-healers)
  const memberHealBonuses = partyHp
    .filter(p => p.class === 'CLERIC' || p.class === 'BARD')
    .map(p => p.healBonus || 0);
  if (memberHealBonuses.length > 0) {
    healBonus += Math.max(...memberHealBonuses);
  }

  // ── Capture initial combat stats for debug display ──
  const _combatDebug = {
    healBonus: { synergy: Game.getHealBonus ? Game.getHealBonus(aq.questId) : 0, partyAura: partyHealAura, memberItem: memberHealBonuses.length ? Math.max(...memberHealBonuses) : 0, total: healBonus },
    dmgBonus, dmgReduction, atkSpeedBonus,
    partyAuras: simAuras,
    members: partyHp.map(p => ({
      name: p.name, class: p.class, level: p.level,
      atk: p.atk, def: p.def, mag: p.mag, spd: p.spd, crit: p.crit, dodge: p.dodge,
      maxHp: p.maxHp, dodgeChance: p.dodgeChance || 0, critChance: p.critChance || 0, healBonus: p.healBonus || 0,
    })),
  };

  // ── SPD-weighted random pick helper ──
  // Higher SPD → more likely to be chosen to act, but using sqrt curve
  // so slow classes (Knights, Clerics) still participate meaningfully.
  // Linear (old): Knight 43 vs Rogue 202 = 4.7:1 ratio → Knight gets ~5% of actions
  // Sqrt (new):   Knight 41 vs Rogue 80  = 2.0:1 ratio → Knight gets ~8% of actions
  function sPickWeighted(arr, seed) {
    if (arr.length === 0) return null;
    if (arr.length === 1) return arr[0];
    const weights = arr.map(m => Math.sqrt((m.spd || 10) + 5) * 6 + 8);
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
  // Plus flat critChance bonus from passive skills
  function critChance(attacker) {
    const c = attacker.crit || 0;
    const flatBonus = attacker.critChance || 0;
    return Math.min(0.75, c / (c + 100) + flatBonus);
  }

  // ── DODGE chance from stat ──
  // dodge / (dodge + 80)  →  ~11% at 10, ~20% at 20, ~33% at 40
  // Plus flat dodgeChance bonus from items (e.g. +0.15 from Rogue daggers)
  function dodgeChance(defender) {
    const d = defender.dodge || 0;
    const flatBonus = defender.dodgeChance || 0;
    return Math.min(0.75, d / (d + 80) + flatBonus);
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

  // Initialize enemies with HP proportional to party HP, scaled by quest difficulty
  const totalPartyHp = partyHp.reduce((s, p) => s + p.maxHp, 0);
  const avgMemberHp = totalPartyHp / Math.max(1, partyHp.length);

  // Factor in quest difficulty: questPower vs partyPower
  // When quest is harder (ratio < 1), enemies are beefier; when easier (ratio > 1), enemies are weaker
  const partyPower = members.reduce((s, m) => s + (m.power || 20), 0);
  const questPower = (quest.difficulty || 1) * 25;
  const difficultyRatio = partyPower / Math.max(1, questPower);
  // Clamp the scaling factor: 0.6x (very overleveled) to 2.0x (very underleveled)
  const difficultyScale = Math.min(2.0, Math.max(0.6, 1.0 / Math.max(0.5, difficultyRatio)));
  // Boss fights: enemies are tougher — 40% more HP pool, 30% more ATK
  const isBoss = !!quest.boss;
  const bossHpMult = isBoss ? 1.4 : 1.0;
  const bossAtkMult = isBoss ? 1.3 : 1.0;

  const totalEnemyHpPool = Math.max(80, Math.floor(totalPartyHp * 1.6 * difficultyScale * bossHpMult));
  const perEnemyBaseHp = Math.floor(totalEnemyHpPool / Math.max(1, fullEnemyNames.length));
  const baseAtkScale = 0.09 * difficultyScale * bossAtkMult;
  const atkRange = 0.12 * difficultyScale * bossAtkMult;

  let enemies = fullEnemyNames.map((name, i) => ({
    id: `enemy_${i}`, name: esc(name),
    maxHp: Math.max(15, Math.floor(perEnemyBaseHp * (0.7 + sRand(seed + 500 + i) * 0.6))),
    hp: 0,
    atk: Math.max(4, Math.floor(avgMemberHp * (baseAtkScale + sRand(seed + 600 + i) * atkRange))),
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
    combatStats[m.id] = { id: m.id, name: esc(m.name), class: m.class, dmgDealt: 0, healingDone: 0, healingReceived: 0, dmgTaken: 0 };
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
  // High cap as safety net — battle should always end naturally via HP depletion
  const MAX_BATTLE_EVENTS = 80 + extraEnemies * 8;
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

  // Bard Discord — enemy ATK/SPD debuff
  const bardsWithDiscord = new Set();
  const discordCooldowns = {}; // { memberId: roundsRemaining }
  let discordRounds = 0; // party-wide: how many rounds the debuff lasts
  let discordSource = null; // name of bard who cast it

  // Bard Crescendo — devastating crit buff for next attacker
  const bardsWithCrescendo = new Set();
  const crescendoCooldowns = {}; // { memberId: roundsRemaining }
  let crescendoActive = false; // is the next-attack buff waiting to be consumed?
  let crescendoSourceId = null; // bard who cast it (for stat tracking)

  // Cleric Divine Shield — party damage reduction after heal
  const clericsWithDivineShield = new Set();
  let divineShieldRounds = 0; // party-wide counter
  let divineShieldSource = null; // name of cleric who cast it

  // Cleric Divine Intervention — intercepts killing blow, saves ally at 1 HP
  const clericsWithIntervention = new Set();
  const interventionCooldowns = {}; // { memberId: roundsRemaining }

  // Cleric Resurrection — revives a KO'd party member at 40% HP
  const clericsWithResurrection = new Set();
  const resurrectionCooldowns = {}; // { memberId: roundsRemaining }

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
    if (m.class === 'BARD' && memberSkills.includes('DISCORD')) {
      bardsWithDiscord.add(m.id);
      discordCooldowns[m.id] = 0;
    }
    if (m.class === 'BARD' && memberSkills.includes('CRESCENDO')) {
      bardsWithCrescendo.add(m.id);
      crescendoCooldowns[m.id] = 0;
    }
    if (m.class === 'CLERIC' && memberSkills.includes('DIVINE_SHIELD')) {
      clericsWithDivineShield.add(m.id);
    }
    if (m.class === 'CLERIC' && memberSkills.includes('DIVINE_INTERVENTION')) {
      clericsWithIntervention.add(m.id);
      interventionCooldowns[m.id] = 0;
    }
    if (m.class === 'CLERIC' && memberSkills.includes('RESURRECTION')) {
      clericsWithResurrection.add(m.id);
      resurrectionCooldowns[m.id] = 0;
    }
  }

  // ── Per-member active skill pools & cooldowns (round-robin) ──
  // Filter out passives so only real combat actions get picked.
  // After a skill fires, it goes on a short cooldown to force variety.
  const SKILL_COOLDOWN = 2; // rounds before a skill can be used again
  const memberActiveSkills = {}; // { memberId: [skillId, ...] }  — only active (non-passive) skills
  const skillCooldowns = {};     // { memberId: { skillId: roundsRemaining } }
  for (const m of members) {
    const memberData = Game.getMember(m.id);
    const allSkills = memberData && memberData.skills ? memberData.skills : [];
    // Only include skills that are actual active abilities (have procChance < 1 or are not passive)
    const actives = allSkills.filter(sid => {
      const sk = getSkill(sid);
      if (!sk) return false;
      // Passive skills (procChance 1.0 and no damage-like effects) are always-on buffs
      if (sk.type === 'passive' || sk.procChance >= 1.0) return false;
      return true;
    });
    memberActiveSkills[m.id] = actives.length > 0 ? actives : allSkills.slice(0, 3); // fallback to first few if no actives
    skillCooldowns[m.id] = {};
  }

  // Live buff state — passed to snapshots so UI can render indicators
  const _bufState = {
    regenPerTick: 0, coverCooldowns, knightsWithCover,
    rallyCooldowns, heroesWithRally, markedEnemies,
    roguesWithMark, monksWithKiBarrier,
    magesWithSpellEcho, spellEchoRounds,
    camoRounds, rangersWithVolley,
    divineShieldRounds: 0, clericsWithDivineShield, divineShieldSource: null,
    clericsWithIntervention, interventionCooldowns,
    clericsWithResurrection, resurrectionCooldowns,
    bardsWithDiscord, discordCooldowns, discordRounds: 0, discordSource: null,
    bardsWithCrescendo, crescendoCooldowns, crescendoActive: false,
  };

  for (let i = 0; i < MAX_BATTLE_EVENTS; i++) {
    _bufState.regenPerTick = regenPerTick;  // keep in sync
    _bufState.divineShieldRounds = divineShieldRounds;
    _bufState.divineShieldSource = divineShieldRounds > 0 ? divineShieldSource : null;
    _bufState.discordRounds = discordRounds;
    _bufState.discordSource = discordRounds > 0 ? discordSource : null;
    _bufState.crescendoActive = crescendoActive;
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

    // Discord DoT — sonic damage to all living enemies each round while active
    if (discordRounds > 0) {
      const discordBardObj = partyHp.find(p => p.name === discordSource);
      const discordMag = discordBardObj ? (discordBardObj.mag || 5) : 5;
      const dotDmg = Math.max(1, Math.floor(discordMag * (0.3 + sRand(seed + i * 2222) * 0.2)));
      const dotTargets = enemies.filter(e => e.alive);
      if (dotTargets.length > 0) {
        let anyKilled = false;
        dotTargets.forEach(e => {
          e.hp = Math.max(0, e.hp - dotDmg);
          if (discordBardObj && combatStats[discordBardObj.id]) combatStats[discordBardObj.id].dmgDealt += dotDmg;
          if (e.hp <= 0) { e.alive = false; anyKilled = true; }
        });
        const dotText = sPick(T_DISCORD_DOT, seed + i * 3333)(dotDmg, dotTargets.length);
        events.push({ text: dotText, type: 'debuff', icon: '🎸', phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        if (anyKilled) {
          const killed = dotTargets.filter(e => !e.alive);
          if (killed.length > 0) {
            const killText = killed.map(e => `${e.name} succumbs to the Discord!`).join(' ');
            events.push({ text: killText, type: 'defeat', icon: '💥', phase: 'battle' });
            snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
          }
        }
        // Check if all enemies dead
        if (enemies.filter(e => e.alive).length === 0) { battleOutcome = 'victory'; break; }
      }
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
    // Tick down skill cooldowns (round-robin)
    for (const mid of Object.keys(skillCooldowns)) {
      const cds = skillCooldowns[mid];
      for (const sid of Object.keys(cds)) {
        if (cds[sid] > 0) cds[sid]--;
        if (cds[sid] <= 0) delete cds[sid];
      }
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
    // Tick down Divine Intervention cooldowns
    for (const id of Object.keys(interventionCooldowns)) {
      if (interventionCooldowns[id] > 0) interventionCooldowns[id]--;
    }
    // Tick down Resurrection cooldowns
    for (const id of Object.keys(resurrectionCooldowns)) {
      if (resurrectionCooldowns[id] > 0) resurrectionCooldowns[id]--;
    }
    // Tick down Bard Discord cooldowns & duration
    for (const id of Object.keys(discordCooldowns)) {
      if (discordCooldowns[id] > 0) discordCooldowns[id]--;
    }
    if (discordRounds > 0) {
      discordRounds--;
      _bufState.discordRounds = discordRounds;
      _bufState.discordSource = discordRounds > 0 ? discordSource : null;
    }
    // Tick down Bard Crescendo cooldowns
    for (const id of Object.keys(crescendoCooldowns)) {
      if (crescendoCooldowns[id] > 0) crescendoCooldowns[id]--;
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

    if (roll < 0.30) {
      // ── Party member attacks enemy ──
      const attacker = sPickWeighted(livingParty, es + 10);
      const target = sPick(livingEnemies, es + 11);
      let baseDmg = calcPartyDmg(attacker, es + 12, dmgBonus);
      // Mage Spell Echo amplification
      if (spellEchoRounds[attacker.id] > 0) baseDmg = Math.floor(baseDmg * 1.50);
      // Mark for Death amplification
      if (markedEnemies[target.id]) baseDmg = Math.floor(baseDmg * 1.20);

      // Bard Crescendo — guaranteed devastating crit (2.5×), consumes the buff
      const isCrescendo = crescendoActive;
      const isCrit = isCrescendo || sRand(es + 13) < critChance(attacker);
      const critMult = isCrescendo ? 2.5 : 1.5;
      const dmg = isCrit ? Math.floor(baseDmg * critMult) : baseDmg;
      if (isCrescendo) {
        crescendoActive = false;
        _bufState.crescendoActive = false;
        // Track healing-done equivalent on the bard for stat purposes
        if (crescendoSourceId && combatStats[crescendoSourceId]) {
          combatStats[crescendoSourceId].dmgDealt += Math.floor(baseDmg * (critMult - 1));
        }
      }
      target.hp = Math.max(0, target.hp - dmg);
      if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += dmg;

      const classId = attacker.class || 'HERO';
      if (isCrescendo) {
        // Devastating Crescendo strike — special template
        text = sPick(T_CRESCENDO_STRIKE, es + 14)(attacker.name, target.name, dmg);
        icon = '🎶'; type = 'crit';
      } else if (isCrit) {
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

    } else if (roll < 0.44) {
      // ── Party skill usage (round-robin with cooldowns) ──
      const attacker = sPickWeighted(livingParty, es + 20);
      const target = sPick(livingEnemies, es + 21);
      // Get active skills not on cooldown for this member
      const allActives = memberActiveSkills[attacker.id] || [];
      const cds = skillCooldowns[attacker.id] || {};
      const readySkills = allActives.filter(sid => !cds[sid]);
      // If all on cooldown, allow any active (reset effective cooldowns)
      const skillPool = readySkills.length > 0 ? readySkills : allActives;
      if (skillPool.length > 0) {
        // AoE preference: when 3+ enemies alive, weight AoE skills 3× higher in selection
        // This simulates tactical awareness — use AoE against groups, single-target vs lone foes
        let skillId;
        const enemyCount = livingEnemies.length;
        if (enemyCount >= 3) {
          const aoeSkills = skillPool.filter(sid => AOE_SKILLS[sid]);
          const stSkills = skillPool.filter(sid => !AOE_SKILLS[sid]);
          // Build weighted pool: each AoE skill gets 3 entries, single-target gets 1
          const weightedPool = [];
          for (const sid of aoeSkills) { weightedPool.push(sid, sid, sid); }
          for (const sid of stSkills) { weightedPool.push(sid); }
          skillId = sPick(weightedPool.length > 0 ? weightedPool : skillPool, es + 22);
        } else {
          skillId = sPick(skillPool, es + 22);
        }
        const skill = getSkill(skillId);
        // Put the used skill on cooldown
        if (!skillCooldowns[attacker.id]) skillCooldowns[attacker.id] = {};
        skillCooldowns[attacker.id][skillId] = SKILL_COOLDOWN;
        if (skill) {
          // ── AoE skills: hit ALL living enemies ──
          const aoeInfo = AOE_SKILLS[skillId];
          if (aoeInfo) {
            const perTargetDmg = Math.max(2, Math.floor(calcPartyDmg(attacker, es + 23, dmgBonus) * aoeInfo.dmgScale));
            // Mage Spell Echo amplification on AoE
            const echoDmg = spellEchoRounds[attacker.id] > 0 ? Math.floor(perTargetDmg * 1.50) : perTargetDmg;
            const currentLiving = enemies.filter(e => e.alive);
            let aoeTotalDmg = 0;
            currentLiving.forEach(e => {
              const ampDmg = markedEnemies[e.id] ? Math.floor(echoDmg * 1.20) : echoDmg;
              e.hp = Math.max(0, e.hp - ampDmg);
              aoeTotalDmg += ampDmg;
              if (e.hp <= 0) e.alive = false;
            });
            if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += aoeTotalDmg;

            // Use skill-specific templates (Volley uses 3-arg, others use 4-arg with skill name)
            if (aoeInfo.templates === T_VOLLEY) {
              text = sPick(T_VOLLEY, es)(attacker.name, currentLiving.length, echoDmg);
            } else {
              text = sPick(aoeInfo.templates, es)(attacker.name, skill.name, currentLiving.length, echoDmg);
            }
            icon = aoeInfo.icon; type = aoeInfo.type;

            // Ranger Camouflage — activate after any Ranger AoE
            if (aoeInfo.triggerCamo && rangersWithVolley.has(attacker.id)) {
              camoRounds[attacker.id] = 2;
              events.push({ text, type, icon, phase: 'battle' });
              snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
              text = sPick(T_CAMOUFLAGE, es + 96)(attacker.name);
              icon = '🍃'; type = 'buff';
            }

            // Mage Spell Echo — activate after AoE skill cast
            if (magesWithSpellEcho.has(attacker.id) && spellEchoRounds[attacker.id] === 0) {
              spellEchoRounds[attacker.id] = 2;
              events.push({ text, type, icon, phase: 'battle' });
              snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
              text = sPick(T_SPELL_ECHO, es + 95)(attacker.name);
              icon = '🌀'; type = 'buff';
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

    } else if (roll < 0.74) {
      // ── Enemy attacks party member ──
      const attacker = sPick(livingEnemies, es + 30);
      const target = sPick(livingParty, es + 31);
      // Discord FUMBLE check — 25% chance enemies miss entirely while debuffed
      if (discordRounds > 0 && sRand(es + 96) < 0.25) {
        text = `${attacker.name} staggers from the Discord — the attack goes wide!`;
        icon = '🎸'; type = 'dodge';
        events.push({ text, type, icon, phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        continue;
      }
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
      const discordAtkMult = discordRounds > 0 ? 0.80 : 1.0; // Discord: -20% ATK
      const rawDmg = Math.max(1, Math.floor(attacker.atk * discordAtkMult * (0.5 + sRand(es + 32) * 0.7)));
      // Apply DEF reduction, synergy reduction, and Divine Shield
      const shieldReduction = divineShieldRounds > 0 ? 0.15 : 0;
      const afterDef = applyDef(rawDmg, target);
      const baseDmg = Math.max(1, Math.floor(afterDef * (1 - dmgReduction) * (1 - shieldReduction)));
      const isSkill = sRand(es + 33) < 0.35;

      if (isSkill) {
        const skillName = sPick(MONSTER_SKILLS, es + 34);
        const dmg = Math.floor(baseDmg * 1.5);
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
          // Try Divine Intervention to save the knight
          const diSaveKnight = partyHp.find(p =>
            p.hp > 0 && p.id !== knight.id && clericsWithIntervention.has(p.id) && interventionCooldowns[p.id] === 0
          );
          if (diSaveKnight) {
            knight.hp = 1; // saved at 1 HP
            interventionCooldowns[diSaveKnight.id] = 4;
            if (combatStats[diSaveKnight.id]) combatStats[diSaveKnight.id].healingDone += 1;
            events.push({ text, type, icon, phase: 'battle' });
            snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
            text = sPick(T_DIVINE_INTERVENTION, es + 83)(diSaveKnight.name, knight.name);
            icon = '🕊'; type = 'divine';
          } else {
            events.push({ text, type, icon, phase: 'battle' });
            snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
            text = sPick(T_PARTY_KO, es + 82)(knight.name, attacker.name);
            icon = '💀'; type = 'ko';
          }
        }
      } else if (target.hp <= 0) {
        // Try Divine Intervention before KO
        const diSave = partyHp.find(p =>
          p.hp > 0 && p.id !== target.id && clericsWithIntervention.has(p.id) && interventionCooldowns[p.id] === 0
        );
        if (diSave) {
          target.hp = 1; // saved at 1 HP
          interventionCooldowns[diSave.id] = 4;
          if (combatStats[diSave.id]) combatStats[diSave.id].healingDone += 1;
          events.push({ text, type, icon, phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
          text = sPick(T_DIVINE_INTERVENTION, es + 71)(diSave.name, target.name);
          icon = '🕊'; type = 'divine';
        } else {
          // No Divine Intervention available — normal KO
          events.push({ text, type, icon, phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
          text = sPick(T_PARTY_KO, es + 70)(target.name, attacker.name);
          icon = '💀'; type = 'ko';
        }
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
      // ── Party defend / block ──
      const defender = sPick(livingParty, es + 40);
      const attacker = sPick(livingEnemies, es + 41);
      const discordBlockMult = discordRounds > 0 ? 0.80 : 1.0;
      const rawDmg = Math.max(1, Math.floor(attacker.atk * discordBlockMult * 0.3 * sRand(es + 42)));
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
        // Cleric Resurrection — revive a fallen party member after healing
        const deadParty = partyHp.filter(p => p.hp <= 0);
        if (deadParty.length > 0) {
          const availableRezzer = partyHp.find(p =>
            p.hp > 0 && clericsWithResurrection.has(p.id) && resurrectionCooldowns[p.id] === 0
          );
          if (availableRezzer) {
            const reviveTarget = sPick(deadParty, es + 99);
            const reviveHp = Math.max(1, Math.floor(reviveTarget.maxHp * 0.40 * healBonus));
            reviveTarget.hp = reviveHp;
            resurrectionCooldowns[availableRezzer.id] = 3;
            if (combatStats[availableRezzer.id]) combatStats[availableRezzer.id].healingDone += reviveHp;
            const rezText = sPick(T_RESURRECTION, es + 100)(availableRezzer.name, reviveTarget.name);
            events.push({ text: rezText, type: 'divine', icon: '🌟', phase: 'battle' });
            snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
          }
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

        // Bard Discord — cast enemy debuff after regen if off cooldown
        const discordBard = livingParty.find(p =>
          p.hp > 0 && bardsWithDiscord.has(p.id) && discordCooldowns[p.id] === 0 && discordRounds === 0
        );
        if (discordBard) {
          discordRounds = 3; // 3 DoT ticks; fumble/ATK reduction active while rounds > 0 after decrement
          discordSource = discordBard.name;
          discordCooldowns[discordBard.id] = 4;
          _bufState.discordRounds = discordRounds;
          _bufState.discordSource = discordSource;
          const discordText = sPick(T_DISCORD, es + 110)(discordBard.name);
          events.push({ text: discordText, type: 'debuff', icon: '🎸', phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        }

        // Bard Crescendo — buff next party attack if off cooldown
        const crescBard = livingParty.find(p =>
          p.hp > 0 && bardsWithCrescendo.has(p.id) && crescendoCooldowns[p.id] === 0 && !crescendoActive
        );
        if (crescBard) {
          crescendoActive = true;
          crescendoSourceId = crescBard.id;
          crescendoCooldowns[crescBard.id] = 3;
          _bufState.crescendoActive = true;
          const crescText = sPick(T_CRESCENDO, es + 115)(crescBard.name);
          events.push({ text: crescText, type: 'buff', icon: '🎶', phase: 'battle' });
          snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        }

        continue;
      }

    } else {
      // ── Reinforcement spawn (limited) ──
      if (reinforceCount < maxReinforcements && livingEnemies.length < 5 && sRand(es + 55) < 0.45) {
        const template = sPick(enemyNames, es + 56);
        const reinforceHp = Math.max(12, Math.floor(perEnemyBaseHp * (0.5 + sRand(es + 57) * 0.5)));
        const newEnemy = {
          id: `enemy_${nextEnemyId++}`, name: esc(template),
          maxHp: reinforceHp, hp: 0,
          atk: Math.max(3, Math.floor(avgMemberHp * (0.07 * difficultyScale + sRand(es + 58) * 0.10 * difficultyScale))),
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

  // If we hit the event cap without natural resolution, force the fight to finish
  // by generating rapid finishing blows so one side is fully eliminated.
  if (!battleOutcome) {
    const livingEnemies = enemies.filter(e => e.alive);
    const livingParty = partyHp.filter(p => p.hp > 0);
    // Decide winner based on remaining HP ratio
    const partyHpLeft = livingParty.reduce((s, p) => s + p.hp, 0);
    const enemyHpLeft = livingEnemies.reduce((s, e) => s + e.hp, 0);
    const partyWins = partyHpLeft >= enemyHpLeft;

    if (partyWins) {
      // Party finishes off remaining enemies
      let finishSeed = seed + 200000;
      for (const enemy of livingEnemies) {
        const attacker = sPickWeighted(livingParty.filter(p => p.hp > 0), finishSeed++);
        if (!attacker) break;
        const dmg = enemy.hp;
        enemy.hp = 0;
        enemy.alive = false;
        if (combatStats[attacker.id]) combatStats[attacker.id].dmgDealt += dmg;
        const classId = attacker.class || 'HERO';
        const atkText = getAttackTemplate(classId, finishSeed)(attacker.name, enemy.name, `${dmg}`);
        events.push({ text: atkText, type: 'attack', icon: '⚔', phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        const defeatText = sPick(T_ENEMY_DEFEAT, finishSeed + 1)(enemy.name, attacker.name);
        events.push({ text: defeatText, type: 'defeat', icon: '💥', phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        finishSeed += 100;
      }
      battleOutcome = 'victory';
    } else {
      // Enemies overwhelm the remaining party
      let finishSeed = seed + 300000;
      for (const member of livingParty) {
        const attacker = sPick(enemies.filter(e => e.alive), finishSeed++);
        if (!attacker) break;
        const dmg = member.hp;
        member.hp = 0;
        if (combatStats[member.id]) combatStats[member.id].dmgTaken += dmg;
        const atkText = sPick(T_ENEMY_ATK, finishSeed)(attacker.name, member.name, dmg);
        events.push({ text: atkText, type: 'enemy', icon: '💀', phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        const koText = sPick(T_PARTY_KO, finishSeed + 1)(member.name, attacker.name);
        events.push({ text: koText, type: 'ko', icon: '💀', phase: 'battle' });
        snapshots.push(makeSnapshot(partyHp, enemies, _bufState));
        finishSeed += 100;
      }
      battleOutcome = 'defeat';
    }
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
  return { events, snapshots, partyHp, enemies, totalEvents, battleOutcome, effectiveInterval, combatStats, combatDebug: _combatDebug };
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
      // Cleric Divine Intervention cooldown
      if (b.interventionCooldowns && b.interventionCooldowns[p.id] !== undefined) {
        const cd = b.interventionCooldowns[p.id];
        if (b.clericsWithIntervention && b.clericsWithIntervention.has(p.id)) {
          pBuffs.push(cd > 0
            ? { id: 'intervention_cd', icon: '🕊', label: 'D.Interv', desc: `CD: ${cd}`, cooldown: true }
            : { id: 'intervention', icon: '🕊', label: 'D.Interv', desc: 'Ready' });
        }
      }
      // Cleric Resurrection cooldown
      if (b.resurrectionCooldowns && b.resurrectionCooldowns[p.id] !== undefined) {
        const cd = b.resurrectionCooldowns[p.id];
        if (b.clericsWithResurrection && b.clericsWithResurrection.has(p.id)) {
          pBuffs.push(cd > 0
            ? { id: 'rez_cd', icon: '🌟', label: 'Resurrect', desc: `CD: ${cd}`, cooldown: true }
            : { id: 'rez', icon: '🌟', label: 'Resurrect', desc: 'Ready' });
        }
      }
      // Bard Discord cooldown
      if (b.discordCooldowns && b.discordCooldowns[p.id] !== undefined) {
        const cd = b.discordCooldowns[p.id];
        if (b.bardsWithDiscord && b.bardsWithDiscord.has(p.id)) {
          pBuffs.push(cd > 0
            ? { id: 'discord_cd', icon: '🎸', label: 'Discord', desc: `CD: ${cd}`, cooldown: true }
            : { id: 'discord', icon: '🎸', label: 'Discord', desc: 'Ready' });
        }
      }
      // Bard Crescendo cooldown
      if (b.crescendoCooldowns && b.crescendoCooldowns[p.id] !== undefined) {
        const cd = b.crescendoCooldowns[p.id];
        if (b.bardsWithCrescendo && b.bardsWithCrescendo.has(p.id)) {
          pBuffs.push(cd > 0
            ? { id: 'cresc_cd', icon: '🎶', label: 'Crescendo', desc: `CD: ${cd}`, cooldown: true }
            : { id: 'cresc', icon: '🎶', label: 'Crescendo', desc: 'Ready' });
        }
      }
      // Crescendo active (party-wide indicator)
      if (b.crescendoActive) {
        pBuffs.push({ id: 'cresc_active', icon: '🎶', label: 'Crescendo', desc: 'Next atk: 2.5× CRIT' });
      }
      // Passive bonus indicators (from items, passive skills, auras)
      if (p.dodgeChance > 0) {
        pBuffs.push({ id: 'dodge_bonus', icon: '💨', label: 'Dodge+', desc: `+${Math.round(p.dodgeChance * 100)}% dodge` });
      }
      if (p.critChance > 0) {
        pBuffs.push({ id: 'crit_bonus', icon: '⚡', label: 'Crit+', desc: `+${Math.round(p.critChance * 100)}% crit` });
      }
      if (p.healBonus > 0 && (p.class === 'CLERIC' || p.class === 'BARD')) {
        pBuffs.push({ id: 'heal_bonus', icon: '💚', label: 'Heal+', desc: `+${Math.round(p.healBonus * 100)}% heal` });
      }
      return { id: p.id, name: p.name, hp: p.hp, maxHp: p.maxHp, class: p.class, buffs: pBuffs };
    }),
    enemies: enemies.map(e => {
      const eDebuffs = [];
      if (b.markedEnemies && b.markedEnemies[e.id] > 0) {
        eDebuffs.push({ id: 'marked', icon: '🎯', label: 'Marked', desc: `${b.markedEnemies[e.id]}rd`, rounds: b.markedEnemies[e.id] });
      }
      // Discord debuff on enemies
      if (b.discordRounds > 0) {
        eDebuffs.push({ id: 'discord', icon: '🎸', label: 'Discord', desc: `${b.discordRounds}rd — -20% ATK, fumble, DoT` });
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

// Get the battle outcome from the current simulation ('victory' or 'defeat' or null)
export function getBattleOutcome() {
  return _sim ? _sim.battleOutcome : null;
}

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

// Get the combat debug info (effective stats, bonuses, aura breakdown)
export function getCombatDebug() {
  const sim = ensureSim();
  return sim ? sim.combatDebug : null;
}

// Get all simulation events (call before resetCombatLog to capture for export)
export function getSimEvents() {
  if (!_sim) return [];
  return _sim.events.map(e => ({
    text: e.text.replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
    type: e.type,
    icon: e.icon,
    phase: e.phase,
  }));
}

export function resetCombatLog() {
  _sim = null;
  _simQuestId = null;
}
