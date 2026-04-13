// ─────────────────────────────────────────────────────────────────────
// rankScales.js — Intrinsic per-rank enemy curves & sub-tier model
// ─────────────────────────────────────────────────────────────────────
// Source of truth for the committed scaling model (see combat-tuning-design.md §9).
// Enemy HP and ATK no longer derive from party totals; they come from the
// RANK_SCALES lookup below, multiplied by a sub-tier modifier.
//
// Growth curve targets (validated in rank-scaling-reference.xlsx → Enemy Curve):
//   • HP grows ~1.88× per rank step
//   • ATK grows ~1.65× per rank step
//   • Brutal(N) lands within ~5–10% of Easy(N+1) — preserves the sub-tier
//     overlap promise from §9.2
//
// Any balance-level retune of enemy toughness should happen HERE, not in
// the combat engine. combatlog.js reads these tables once per fight to
// build the encounter.
// ─────────────────────────────────────────────────────────────────────

// TUNING PASS 4: Brian's call — old Brutal feel (1 heal, ~80 dmg, 10 rds)
// is what EASY should feel like. That means Easy's effective stats
// (base × 0.80/0.85) must land at ~120 HP / ~16 ATK, so the base (which
// Standard uses at 1.00×) needs to be ~150/19. This pushes Brutal into
// genuine wipe-risk territory (~225 HP / ~25 ATK at F) which is the goal.
// Growth ratios preserved ~1.88× HP / ~1.65× ATK per rank step.
export const RANK_SCALES = {
  F:    { baseHp: 150,   baseAtk: 19  },
  E:    { baseHp: 282,   baseAtk: 31  },
  D:    { baseHp: 530,   baseAtk: 51  },
  C:    { baseHp: 996,   baseAtk: 84  },
  B:    { baseHp: 1873,  baseAtk: 139 },
  A:    { baseHp: 3521,  baseAtk: 229 },
  S:    { baseHp: 6619,  baseAtk: 378 },
  'S+': { baseHp: 12444, baseAtk: 624 },
  'S++':{ baseHp: 23394, baseAtk: 1030},
};

// Sub-tier multipliers — applied to RANK_SCALES baseHp/baseAtk per fight.
// Reward multiplier scales goldReward/expReward at quest resolution time.
// Rank points stay flat per §9.8 (current lean).
// powerMult is applied to RANK_POWER_TARGETS when computing recommendedPower;
// it is derived from hpMult × atkMult so the recommended-power display tracks
// the actual combat toughness of a sub-tier.
// rewardMult widened in pass 4 — Easy→Brutal spread was 1.56× (0.80/1.25),
// now 3.33× (0.60/2.00) so Brutal payouts feel earned after a near-wipe.
export const SUB_TIER_MULTIPLIERS = {
  easy:     { hpMult: 0.80, atkMult: 0.85, rewardMult: 0.60, powerMult: 0.68 },
  standard: { hpMult: 1.00, atkMult: 1.00, rewardMult: 1.00, powerMult: 1.00 },
  hard:     { hpMult: 1.22, atkMult: 1.15, rewardMult: 1.40, powerMult: 1.40 },
  brutal:   { hpMult: 1.50, atkMult: 1.30, rewardMult: 2.00, powerMult: 1.95 },
};

// Rank power targets — the `partyPower` value at which a rank-matched Standard
// fight should sit at ratio ≈ 1.0. These are the anchors that drive the
// quest card's recommended-power display and the game.js success formula.
// Growth ratio ~1.88× per rank matches the intrinsic HP curve so that an
// on-rank party stays in the same ratio envelope as they progress.
// First pass values — tune after initial TTK validation.
// Scaled proportionally with the RANK_SCALES base HP bump (pass 4).
export const RANK_POWER_TARGETS = {
  F:    150,
  E:    280,
  D:    530,
  C:    1000,
  B:    1875,
  A:    3520,
  S:    6620,
  'S+': 12440,
  'S++':23400,
};

// Additional multipliers layered on top of the rank × sub-tier base when
// computing recommendedPower. Boss/raid bosses are substantially tougher
// than their sub-tier implies, so we mark them here.
export const BOSS_POWER_MULT = 1.82;  // matches boss role HP mult for recPow display
export const RAID_POWER_MULT = 2.50;  // raid bosses extend past normal boss

// ── RP Multipliers for Boss/Raid ───────────────────────────────────────
// Stacks WITH sub-tier rewardMult (hard 1.4×, brutal 2.0×) for RP.
export const BOSS_RP_MULT = 1.50;    // bosses grant 50% more RP
export const RAID_RP_MULT = 2.00;    // raids grant double RP

// ── Weapon Proc Damage Scaling ─────────────────────────────────────────
// Global damage scalar applied to ALL weapon proc damage by equipment rarity.
// Non-celestial procs are a nice bonus, never the primary damage source.
// Celestial procs can match L6-L10 class skills but stay below L18 epics.
// Celestial procs also use 3-round cooldown (vs 2-round for others).
export const WEAPON_PROC_SCALAR = {
  common:    0.40,   // well below L1 basics
  magic:     0.40,   // well below L1 basics
  rare:      0.45,   // below L1 basics, noticeable bonus
  epic:      0.45,   // around L2 skill range
  legendary: 0.40,   // around L2 skill range (high stat budgets need more reduction)
  celestial: 0.60,   // between L10 and L18 epic class skills
};
export const CELESTIAL_PROC_COOLDOWN = 3;  // celestials: 3-round CD (vs 2 for others)

// ── Boss Encounter System ───────────────────────────────────────────────
// Boss encounters always include a full complement of adds so attacks-per-
// round pressure matches standard encounters. The ADD QUALITY progresses
// through a hierarchy as rank tiers increase:
//
//   F-E:      Boss + standard minions (1.0× — party is learning)
//   D-C:      Boss + Captains (1.20×/1.10× — first upgraded adds)
//   B-A:      Boss + Lieutenants + Captains (mixed)
//   S/S+/S++: Boss + Generals + Lieutenants (increasingly general-heavy)
//
// Total enemy count matches RANK_ENEMY_COUNT so boss encounters have the
// same number of bodies as standard encounters. The boss replaces one
// standard enemy; the rest are role-typed adds. Party-size bonus (+1 per
// member above 4) adds extra standard minions on top.
//
// All add roles are ABOVE 1.0× so they're always tougher than standard
// enemies. The hierarchy is:
//   Standard:   1.00× HP / 1.00× ATK — baseline (F-E boss adds)
//   Captain:    1.20× HP / 1.10× ATK — D-C boss adds, F-E Brutal promo
//   Lieutenant: 1.40× HP / 1.25× ATK — B-A boss adds, D-C Brutal promo
//   General:    1.65× HP / 1.45× ATK — S+ boss adds, B+ Brutal promo

export const BOSS_ROLE_MULTS = {
  boss:     { hpMult: 1.82, atkMult: 1.65 },
  captain:  { hpMult: 1.20, atkMult: 1.10 },
  lt:       { hpMult: 1.40, atkMult: 1.25 },
  general:  { hpMult: 1.65, atkMult: 1.45 },
  minion:   { hpMult: 1.00, atkMult: 1.00 },  // standard-strength, F-E boss adds
  raidBoss: { hpMult: 2.50, atkMult: 2.20 },
  raidLt:   { hpMult: 1.40, atkMult: 1.25 },  // raid LTs = regular LT tier
};

// Boss encounter composition by rank. Every entry assumes exactly 1 boss.
// Add counts fill remaining slots to match RANK_ENEMY_COUNT[rank].
// Party-size overflow adds extra minions (standard-strength).
export const BOSS_COMPOSITIONS = {
  F:    { generals: 0, lts: 0, captains: 0, minions: 2 },  // 3 total
  E:    { generals: 0, lts: 0, captains: 0, minions: 2 },  // 3 total
  D:    { generals: 0, lts: 0, captains: 3, minions: 0 },  // 4 total
  C:    { generals: 0, lts: 0, captains: 3, minions: 0 },  // 4 total
  B:    { generals: 0, lts: 2, captains: 2, minions: 0 },  // 5 total
  A:    { generals: 0, lts: 2, captains: 2, minions: 0 },  // 5 total
  S:    { generals: 3, lts: 2, captains: 0, minions: 0 },  // 6 total
  'S+': { generals: 4, lts: 2, captains: 0, minions: 0 },  // 7 total
  'S++':{ generals: 5, lts: 2, captains: 0, minions: 0 },  // 8 total
};

// Raid boss compositions (S-rank and above only). Uses raidBoss mult for
// the boss and raidLt mult for LT-role adds. Generals use their normal mult.
export const RAID_COMPOSITIONS = {
  S:    { generals: 3, lts: 2 },   // 6 total
  'S+': { generals: 4, lts: 2 },   // 7 total
  'S++':{ generals: 5, lts: 2 },   // 8 total
};

// Brutal mini-boss promotion — in standard Brutal encounters, one enemy
// gets promoted to the NEXT tier's boss-add role. This introduces the
// next bracket's add quality one tier early as a preview:
//   F-E:  promote 1 → Captain     (1.20×/1.10× — D-C boss add tier)
//   D-C:  promote 1 → Lieutenant  (1.40×/1.25× — B-A boss add tier)
//   B+:   promote 1 → General     (1.65×/1.45× — S+ boss add tier)
export const BRUTAL_PROMOTION = {
  F: 'captain',  E: 'captain',
  D: 'lt',       C: 'lt',
  B: 'general',  A: 'general',
  S: 'general', 'S+': 'general', 'S++': 'general',
};

// Rank order — used for rank-gap calculations and progression lookups.
export const RANK_ORDER = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'S+', 'S++'];

// Base enemy count per rank — the minimum number of enemies in a standard
// encounter at this rank. Party-size scaling (+1 per member above 4) is
// layered on top. Boss and raid encounters may override this.
export const RANK_ENEMY_COUNT = {
  F:    3,
  E:    3,
  D:    4,
  C:    4,
  B:    5,
  A:    5,
  S:    6,
  'S+': 7,
  'S++':8,
};

// Over-ranked trickle — when the player views a board below their current
// rank, lock all slots to a lower sub-tier based on the rank gap. See §9.1
// of combat-tuning-design.md for the worked example.
//   gap 0 → guaranteed-mix (normal on-rank board)
//   gap 1 → all Brutal
//   gap 2 → all Hard
//   gap 3 → all Standard
//   gap 4+ → all Easy (floor)
export function subTierForRankGap(gap) {
  if (gap <= 0) return null;            // on-rank → use guaranteed-mix
  if (gap === 1) return 'brutal';
  if (gap === 2) return 'hard';
  if (gap === 3) return 'standard';
  return 'easy';
}

// Guaranteed-mix board slots (§9.3). Slot 5 is a wildcard; the other four
// are deterministic so no player ever sees "5 Easies in a row".
export const BOARD_MIX_SLOTS = ['easy', 'standard', 'hard', 'brutal'];

// Wildcard slot (slot 5) weights — bracket-dependent. Lower ranks do NOT
// roll raid bosses; S-and-above unlocks the raid path. See §9.3.
export const WILDCARD_WEIGHTS = {
  lowRank: {  // F, E, D, C, B, A
    standard: 0.50,
    mine:     0.35,
    boss:     0.15,
    raidBoss: 0.00,
  },
  highRank: { // S, S+, S++
    standard: 0.40,
    mine:     0.25,
    boss:     0.20,
    raidBoss: 0.15,
  },
};

// Sub-tier roll for wildcard "mine" slot — mines always reroll their own
// sub-tier for the gem bag payout flavor.
export const MINE_SUB_TIER_WEIGHTS = {
  easy:     0.25,
  standard: 0.35,
  hard:     0.25,
  brutal:   0.15,
};

// Heal throughput targets — abstract design variable used by §9.4 sim
// validation. Not read by combat code directly; exported so the balance
// tools can aggregate heal output per class against these targets.
export const HEAL_THROUGHPUT_TARGETS = {
  F:    { incomingPct: 0.04, targetPct: 0.06 },
  E:    { incomingPct: 0.05, targetPct: 0.07 },
  D:    { incomingPct: 0.06, targetPct: 0.08 },
  C:    { incomingPct: 0.07, targetPct: 0.09 },
  B:    { incomingPct: 0.08, targetPct: 0.10 },
  A:    { incomingPct: 0.09, targetPct: 0.11 },
  S:    { incomingPct: 0.10, targetPct: 0.12 },
  'S+': { incomingPct: 0.11, targetPct: 0.13 },
  'S++':{ incomingPct: 0.12, targetPct: 0.14 },
};

// Helper — rank gap between two rank letters. Positive = viewedRank is
// below partyRank; negative = above; 0 = on-rank.
export function rankGap(partyRank, viewedRank) {
  const pi = RANK_ORDER.indexOf(partyRank);
  const vi = RANK_ORDER.indexOf(viewedRank);
  if (pi < 0 || vi < 0) return 0;
  return pi - vi;
}

// Helper — bracket lookup for wildcard weights.
export function wildcardBracket(rank) {
  return (rank === 'S' || rank === 'S+' || rank === 'S++') ? 'highRank' : 'lowRank';
}
