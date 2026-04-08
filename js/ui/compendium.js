// ── Compendium — In-game encyclopedia ─────────────────────────────────────
import Game from '../game.js';
import { CLASSES, RANK_ORDER, EQUIPMENT, ITEM_RARITIES, getItemRarity } from '../data.js';
import { SKILLS, getClassSkills, getClassMasteries } from '../skills.js';

let _currentSection = 'overview';

// ── Section registry ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'overview',   label: 'Overview',          icon: '📖' },
  { id: 'stats',      label: 'Stats Guide',       icon: '📊' },
  { id: 'classes',    label: 'Classes & Skills',   icon: '⚔' },
  { id: 'equipment',  label: 'Equipment & Procs',  icon: '🛡' },
  { id: 'combat',     label: 'Combat Mechanics',   icon: '💥' },
  { id: 'synergy',    label: 'Party Synergy',      icon: '🔗' },
  { id: 'ranks',      label: 'Ranking System',     icon: '⭐' },
];

// ── Main Render ───────────────────────────────────────────────────────────
export function renderCompendium() {
  const el = document.getElementById('tab-compendium');
  if (!el) { console.warn('Compendium: #tab-compendium not found'); return; }

  try {
    const nav = SECTIONS.map(s =>
      `<button class="comp-nav-btn${_currentSection === s.id ? ' active' : ''}" data-section="${s.id}">${s.icon} ${s.label}</button>`
    ).join('');

    el.innerHTML = `
      <div class="compendium-layout">
        <nav class="comp-sidebar">
          <div class="comp-sidebar-title">📜 Compendium</div>
          ${nav}
        </nav>
        <div class="comp-body" id="comp-body"></div>
      </div>
    `;

    // Wire nav buttons
    el.querySelectorAll('.comp-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _currentSection = btn.dataset.section;
        renderCompendium();
      });
    });

    // Render active section
    const body = document.getElementById('comp-body');
    switch (_currentSection) {
      case 'overview':  body.innerHTML = renderOverview(); break;
      case 'stats':     body.innerHTML = renderStats(); break;
      case 'classes':   body.innerHTML = renderClasses(); break;
      case 'equipment': body.innerHTML = renderEquipment(); break;
      case 'combat':    body.innerHTML = renderCombat(); break;
      case 'synergy':   body.innerHTML = renderSynergy(); break;
      case 'ranks':     body.innerHTML = renderRanks(); break;
    }
  } catch (err) {
    console.error('Compendium render error:', err);
    el.innerHTML = `<div style="padding:20px;color:#e74c3c;">Compendium failed to render: ${err.message}</div>`;
  }
}

// ── Overview ──────────────────────────────────────────────────────────────
function renderOverview() {
  return `
    <div class="comp-section">
      <h2 class="comp-title">Welcome to the Adventurers Guild</h2>
      <p class="comp-text">You are the leader of a fledgling guild of adventurers. Recruit heroes, equip them with powerful gear, send them on dangerous quests, and climb the ranks from F to S.</p>

      <h3 class="comp-subtitle">Getting Started</h3>
      <p class="comp-text">You begin with a <strong>Hero</strong> and <strong>200 gold</strong>. Head to the <strong>Party</strong> tab to recruit your first companions — all 8 classes are available from the start. Your first few recruits cost 50–150g, so you can assemble a party of 3 quickly.</p>
      <p class="comp-text">Once you have a party, visit the <strong>Quest Board</strong> to pick a quest. Combat plays out automatically — watch the battle log to see your team in action. Completing quests earns gold, experience, rank points, and loot.</p>

      <h3 class="comp-subtitle">Key Tips</h3>
      <p class="comp-text"><strong>Balance your party.</strong> You need damage dealers (Rogue, Mage, Ranger), a tank (Knight), healing (Cleric), and support (Bard). The Monk and Hero are versatile flex picks.</p>
      <p class="comp-text"><strong>Equip your team.</strong> Visit the Shop regularly. Every legendary item grants a unique combat skill — gear matters as much as levels.</p>
      <p class="comp-text"><strong>Build synergy.</strong> The more quests your party completes together, the stronger your synergy bonuses become — damage, healing, gold, and eventually auto-battle.</p>
      <p class="comp-text"><strong>Check the Fight Log.</strong> After each quest, use the "Copy Fight Log" button to analyze combat performance and identify weak links in your party.</p>
    </div>
  `;
}

// ── Stats Guide ───────────────────────────────────────────────────────────
function renderStats() {
  const stats = [
    { name: 'MAX HP', icon: '❤', desc: 'Maximum hit points. When a character reaches 0 HP in combat, they are knocked out for the rest of the fight. Knights have the highest base HP, Mages the lowest.' },
    { name: 'ATK', icon: '⚔', desc: 'Attack power. Scales physical damage for melee and ranged classes — Heroes, Knights, Rogues, Rangers, and Monks. Higher ATK means bigger hits. Damage formula: ATK × (1.8–2.8 random multiplier).' },
    { name: 'MAG', icon: '✨', desc: 'Magic power. Scales magic damage for caster classes — Mages, Clerics, and Bards. Also scales healing strength for Clerics and Bard regen. The primary stat for any spellcaster.' },
    { name: 'DEF', icon: '🛡', desc: 'Defense. Reduces incoming damage with diminishing returns: DEF / (DEF + 60). At 10 DEF you block ~14%, at 30 DEF ~33%, at 200+ DEF over 75%. Knights stack this massively.' },
    { name: 'SPD', icon: '💨', desc: 'Speed. Determines how often a character is selected to act in combat. Higher SPD means more attacks, more skill uses, more everything. Rogues and Rangers dominate here. Heavy armor naturally lacks SPD — tanks act less often but their reactive abilities (Bulwark) trigger independently.' },
    { name: 'CRIT', icon: '⚡', desc: 'Critical hit chance. Chance to deal 1.5× damage on any attack. Formula: CRIT / (CRIT + 100). At 10 CRIT that is ~9%, at 20 it is ~17%, at 50 it is ~33%. Rogues and Mages are the crit-focused classes.' },
    { name: 'DODGE', icon: '💨', desc: 'Dodge chance. Chance to completely avoid an incoming enemy attack. Formula: DODGE / (DODGE + 80). At 10 DODGE that is ~11%, at 20 it is ~20%, at 40 it is ~33%. Bards and Monks have the highest dodge rates. Stacks with Ranger Camouflage.' },
  ];

  const rows = stats.map(s => `
    <div class="comp-stat-row">
      <div class="comp-stat-name">${s.icon} ${s.name}</div>
      <div class="comp-stat-desc">${s.desc}</div>
    </div>
  `).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Stats Guide</h2>
      <p class="comp-text">Every character has 7 core stats that determine their combat performance. Stats come from three sources: base class stats, level-up growth, and equipment bonuses.</p>
      ${rows}
      <h3 class="comp-subtitle">Power Rating</h3>
      <p class="comp-text">Each character's power is calculated as: (ATK × 2) + DEF + SPD + (MAX HP / 10) + (MAG × 1.5) + CRIT + (DODGE × 0.5). This gives a rough measure of overall combat contribution, but the real value depends on party composition and role.</p>
    </div>
  `;
}

// ── Classes & Skills ──────────────────────────────────────────────────────
function renderClasses() {
  const classOrder = ['HERO', 'KNIGHT', 'MAGE', 'ROGUE', 'CLERIC', 'RANGER', 'BARD', 'MONK'];
  const roleMap = {
    HERO: 'Balanced DPS / Support',
    KNIGHT: 'Tank / Protector',
    MAGE: 'Magic DPS / Crit',
    ROGUE: 'Physical DPS / Crit',
    CLERIC: 'Healer / Support',
    RANGER: 'Ranged DPS / AoE',
    BARD: 'Support / Regen',
    MONK: 'Hybrid / Self-Sustain',
  };

  const cards = classOrder.map(cid => {
    const cls = CLASSES[cid];
    if (!cls) return '';
    const bs = cls.baseStats;
    const gr = cls.growthRates;

    // Get class skills and masteries
    const skills = getClassSkills(cid);
    const masteries = getClassMasteries(cid);

    const skillList = skills.map(s => {
      const isPassive = s.type === 'passive' || s.procChance >= 1.0;
      const pct = isPassive ? 'passive' : `${Math.round(s.procChance * 100)}%`;
      return `<div class="comp-skill-row">
        <span class="comp-skill-icon">${s.icon || '•'}</span>
        <span class="comp-skill-name">${s.name}</span>
        <span class="comp-skill-type">${pct}</span>
        <span class="comp-skill-desc">${s.description || ''}</span>
      </div>`;
    }).join('');

    const masteryList = masteries.map(s => {
      const isPassive = s.type === 'passive' || s.procChance >= 1.0;
      const pct = isPassive ? 'passive' : `${Math.round(s.procChance * 100)}%`;
      return `<div class="comp-skill-row comp-mastery">
        <span class="comp-skill-icon">${s.icon || '•'}</span>
        <span class="comp-skill-name">${s.name}</span>
        <span class="comp-skill-type">${pct}</span>
        <span class="comp-skill-desc">${s.description || ''}</span>
      </div>`;
    }).join('');

    return `
      <div class="comp-class-card">
        <div class="comp-class-header">
          <span class="comp-class-sigil">${cls.sigil}</span>
          <div>
            <div class="comp-class-name">${cls.label}</div>
            <div class="comp-class-role">${roleMap[cid] || ''}</div>
          </div>
        </div>
        <div class="comp-class-desc">${cls.description}</div>
        <div class="comp-class-stats">
          <span>HP ${bs.maxHp} <em>(+${gr.maxHp})</em></span>
          <span>ATK ${bs.atk} <em>(+${gr.atk})</em></span>
          <span>DEF ${bs.def} <em>(+${gr.def})</em></span>
          <span>SPD ${bs.spd} <em>(+${gr.spd})</em></span>
          <span>MAG ${bs.mag} <em>(+${gr.mag})</em></span>
          <span>CRT ${bs.crit} <em>(+${gr.crit})</em></span>
          <span>DDG ${bs.dodge} <em>(+${gr.dodge})</em></span>
        </div>
        ${skills.length > 0 ? `<div class="comp-skill-section"><div class="comp-skill-header">Class Skills</div>${skillList}</div>` : ''}
        ${masteries.length > 0 ? `<div class="comp-skill-section"><div class="comp-skill-header">Masteries</div>${masteryList}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Classes & Skills</h2>
      <p class="comp-text">All 8 classes are available from the start. Base stats show Level 1 values, with per-level growth in parentheses. Active skills show their proc chance; passives are always active.</p>
      ${cards}
    </div>
  `;
}

// ── Equipment & Procs ─────────────────────────────────────────────────────
function renderEquipment() {
  const rarityOrder = ['common', 'magic', 'rare', 'epic', 'legendary', 'celestial'];
  const rarityDescs = {
    common:    'Basic starter gear. Stats only, no special effects.',
    magic:     'Modest upgrades over common gear. Available in shops early on.',
    rare:      'Solid mid-game gear with broader stat coverage. Some rare items grant skill procs.',
    epic:      'Strong endgame equipment. Many pieces grant active skill procs.',
    legendary: 'Best-in-slot below celestial. Every legendary grants a unique active skill proc.',
    celestial: 'God-tier S-Rank drops. Each class has a full 4-piece set with massive stats and celestial-tier skill procs with special visual effects.',
  };
  const rarityInfo = rarityOrder.map(id => ({
    id,
    label: ITEM_RARITIES[id].label,
    color: ITEM_RARITIES[id].color,
    desc: rarityDescs[id],
  }));

  const rarityRows = rarityInfo.map(r => `
    <div class="comp-rarity-row">
      <span class="comp-rarity-badge" style="color:${r.color};border-color:${r.color}40">${r.label}</span>
      <span class="comp-rarity-desc">${r.desc}</span>
    </div>
  `).join('');

  // Collect all items with procs (epic, legendary, celestial)
  const items = Object.values(EQUIPMENT);
  const procItems = items
    .filter(it => it.grantedSkill)
    .sort((a, b) => {
      const ri = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
      if (ri !== 0) return ri;
      return (a.classReq?.[0] || 'ZZZ').localeCompare(b.classReq?.[0] || 'ZZZ');
    });

  const effectLabels = {
    atkBonus: 'ATK', defBonus: 'DEF', magBonus: 'MAG', spdBonus: 'SPD',
    critChance: 'Crit', critBonus: 'Crit', dodgeChance: 'Dodge', dodgeBonus: 'Dodge',
    defPierce: 'Armor Pierce', powerMultiplier: 'Power', healBonus: 'Heal',
    maxHpBonus: 'Max HP',
  };

  function formatEffects(effects) {
    if (!effects) return '—';
    return Object.entries(effects).map(([key, val]) => {
      const label = effectLabels[key] || key;
      if (key === 'powerMultiplier') return `${val}× ${label}`;
      return `+${Math.round(val * 100)}% ${label}`;
    }).join(', ');
  }

  const procRows = procItems.map(it => {
    const skill = SKILLS[it.grantedSkill];
    if (!skill) return '';
    const rarity = getItemRarity(it);
    const classStr = it.classReq ? it.classReq.map(c => CLASSES[c]?.sigil || c).join('/') : 'Any';
    const isPassive = skill.type === 'passive' || skill.procChance >= 1.0;
    const procStr = isPassive
      ? '<span class="comp-proc-passive">Passive</span>'
      : `<span class="comp-proc-chance">${Math.round(skill.procChance * 100)}%</span>`;
    const durationStr = isPassive ? 'Always active' : '1 round (2-round CD)';
    const effectStr = formatEffects(skill.effects);
    return `
      <div class="comp-item-row">
        <span class="comp-item-name" style="color:${rarity.color}">${it.name}</span>
        <span class="comp-item-slot">${it.slot}</span>
        <span class="comp-item-class">${classStr}</span>
        <span class="comp-item-skill">${skill.icon || '•'} ${skill.name}</span>
        <span class="comp-item-proc">${procStr}</span>
        <span class="comp-item-effects">${effectStr}</span>
        <span class="comp-item-duration">${durationStr}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Equipment & Procs</h2>
      <p class="comp-text">Gear comes in four slots — Weapon, Armor, Offhand, and Accessory — across six rarity tiers. Two-handed weapons (Bard instruments, some greatswords/staves) carry ~1.5× stats to compensate for the lost offhand slot.</p>

      <h3 class="comp-subtitle">Rarity Tiers</h3>
      ${rarityRows}

      <h3 class="comp-subtitle">Equipment Skill Procs</h3>
      <p class="comp-text">Some rare, epic, legendary, and celestial items grant unique skills when equipped. Active procs trigger each round based on their proc chance, last for 1 round, then enter a 2-round cooldown. Passive procs are always active. These appear in combat alongside class skills and rotate via the round-robin cooldown system.</p>
      <div class="comp-item-table">
        <div class="comp-item-header">
          <span>Item</span><span>Slot</span><span>Class</span><span>Skill</span><span>Proc</span><span>Effects</span><span>Duration</span>
        </div>
        ${procRows}
      </div>
    </div>
  `;
}

// ── Combat Mechanics ──────────────────────────────────────────────────────
function renderCombat() {
  return `
    <div class="comp-section">
      <h2 class="comp-title">Combat Mechanics</h2>
      <p class="comp-text">Combat is a fully deterministic simulation. Each quest has a seeded random number generator — replaying the same quest seed produces identical results.</p>

      <h3 class="comp-subtitle">Battle Phases</h3>
      <p class="comp-text"><strong>Travel</strong> — 2 flavor events as the party approaches the quest location.</p>
      <p class="comp-text"><strong>Encounter</strong> — The party spots the enemies. Combat begins.</p>
      <p class="comp-text"><strong>Battle</strong> — The main loop. Each round, a random event type is rolled: party attack (35%), party skill (15%), enemy attack (22%), party defend (10%), heal/regen (8%), or reinforcement (10%). Combat continues until all enemies or all party members are eliminated.</p>
      <p class="comp-text"><strong>Resolution</strong> — Victory or defeat is declared. If the fight hits the event cap without a clear winner, the side with more survivors wins.</p>

      <h3 class="comp-subtitle">Damage Formulas</h3>
      <p class="comp-text"><strong>Party attack damage:</strong> ATK (or MAG for casters) × random multiplier (1.8–2.8) × synergy bonus. Skills deal 1.25× this amount. Volley hits all enemies at 0.60× per target.</p>
      <p class="comp-text"><strong>Critical hits:</strong> 1.5× damage. Chance based on CRIT stat: CRIT / (CRIT + 100).</p>
      <p class="comp-text"><strong>Enemy damage:</strong> Enemy ATK × random multiplier (0.5–1.2), then reduced by defender's DEF: DEF / (DEF + 60), then further reduced by synergy damage reduction and any active Divine Shield (−15%).</p>
      <p class="comp-text"><strong>Dodge:</strong> Before taking damage, the defender rolls to dodge: DODGE / (DODGE + 80). Ranger Camouflage adds a flat +40% on top of this. A dodge negates all damage from that attack.</p>

      <h3 class="comp-subtitle">SPD & Action Selection</h3>
      <p class="comp-text">When the sim picks which party member acts, it uses weighted random selection based on SPD. Each member's weight is (SPD + 5). A Rogue with 140 SPD is roughly 6× more likely to be selected than a Knight with 25 SPD. This affects offensive actions only — healing, Bulwark intercepts, and bard regen are on separate tracks and trigger independently of SPD.</p>

      <h3 class="comp-subtitle">Skill Round-Robin</h3>
      <p class="comp-text">When a party member gets a "skill use" turn, the sim picks from their active skills only (passives are always-on and never consume a turn). After using a skill, it goes on a 2-round cooldown. This forces variety — every active skill will see play across a longer fight. If all skills are on cooldown, any active becomes available again.</p>

      <h3 class="comp-subtitle">Special Mechanics</h3>
      <p class="comp-text"><strong>Bulwark (Knight):</strong> Reactively intercepts hits aimed at allies every 3 rounds. Independent of SPD — always triggers when ready.</p>
      <p class="comp-text"><strong>Rally Cry (Hero):</strong> When any ally drops below 30% HP, a Hero with this skill automatically heals them. 4-round cooldown.</p>
      <p class="comp-text"><strong>Mark for Death (Rogue):</strong> On a critical hit, marks the target. All party members deal +20% damage to marked enemies for 2 rounds.</p>
      <p class="comp-text"><strong>Ki Barrier (Monk):</strong> 25% of all damage dealt is returned as HP. Self-sustain without a healer.</p>
      <p class="comp-text"><strong>Spell Echo (Mage):</strong> After casting a skill, the Mage gains 1.5× damage for 2 rounds.</p>
      <p class="comp-text"><strong>Divine Intervention (Cleric):</strong> When an ally would be killed, the Cleric intercepts the killing blow and saves them at 1 HP. 4-round cooldown.</p>
      <p class="comp-text"><strong>Resurrection (Cleric):</strong> After a group heal, if any party members are KO'd, the Cleric revives one at 40% HP. 3-round cooldown.</p>
      <p class="comp-text"><strong>Divine Shield (Cleric):</strong> After a group heal, the entire party takes 15% less damage for 3 rounds.</p>
      <p class="comp-text"><strong>Divine Presence (Cleric):</strong> Epic passive aura — party gains +15% MAG, +12% DEF, +10% MAX HP, and +8% healing.</p>
      <p class="comp-text"><strong>Discord (Bard):</strong> A devastating debuff on all enemies for 3 rounds: -20% ATK, 25% chance to fumble attacks entirely, and sonic damage each round (scales off MAG). 4-round cooldown. Casts automatically after regen.</p>
      <p class="comp-text"><strong>Crescendo (Bard):</strong> Buffs the next party attack to be a guaranteed devastating critical hit at 2.5× damage (instead of the normal 1.5× crit). 3-round cooldown.</p>
      <p class="comp-text"><strong>Symphony of War (Bard):</strong> Epic passive aura — party gains +15% ATK, +12% SPD, +8% CRIT.</p>
      <p class="comp-text"><strong>Camouflage (Ranger):</strong> After using Volley, gains +40% dodge chance for 2 rounds.</p>
    </div>
  `;
}

// ── Party Synergy ─────────────────────────────────────────────────────────
function renderSynergy() {
  const thresholds = Game.SYNERGY_THRESHOLDS || [];
  const unlocked = Game.state?.partySynergy?.bonusesUnlocked || [];
  const totalQuests = Game.state?.partySynergy?.totalQuestsAsTeam || 0;

  const rows = thresholds.map(t => {
    const isUnlocked = unlocked.includes(t.id);
    return `
      <div class="comp-synergy-row${isUnlocked ? ' unlocked' : ''}">
        <span class="comp-synergy-quests">${t.quests} quests</span>
        <span class="comp-synergy-label">${t.label}</span>
        <span class="comp-synergy-desc">${t.desc}</span>
        <span class="comp-synergy-status">${isUnlocked ? '✓' : '—'}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Party Synergy</h2>
      <p class="comp-text">The more quests your party completes together, the stronger your bonuses become. Synergy persists even through party composition changes. Your current team has completed <strong>${totalQuests}</strong> quests together.</p>
      <p class="comp-text">Synergy bonuses stack across tiers — unlocking Tier II replaces Tier I. Auto-battle unlocks at specific milestones, allowing repeated quest runs.</p>

      <div class="comp-synergy-table">
        <div class="comp-synergy-header">
          <span>Quests</span><span>Bonus</span><span>Effect</span><span>Status</span>
        </div>
        ${rows}
      </div>
    </div>
  `;
}

// ── Ranking System ────────────────────────────────────────────────────────
function renderRanks() {
  const rankDescriptions = {
    F: 'Starting rank. Basic quests with low rewards. Build your first party here.',
    E: 'Stronger quests become available. Better shop inventory unlocks.',
    D: 'Mid-tier questing. Rare gear starts appearing in shops.',
    C: 'Challenging content. Epic gear and more dangerous enemies.',
    B: 'High-tier quests with legendary loot possibilities.',
    A: 'Elite content. The strongest non-S quests live here.',
    S: 'The pinnacle. Celestial equipment drops, the hardest bosses, and the biggest rewards.',
  };

  const rows = RANK_ORDER.map(r => {
    const current = Game.state?.guild?.rank === r;
    return `
      <div class="comp-rank-row${current ? ' current' : ''}">
        <span class="rank-badge rank-${r}" style="font-size:1rem;padding:4px 12px">${r}</span>
        <span class="comp-rank-desc">${rankDescriptions[r] || ''}</span>
        ${current ? '<span class="comp-rank-current">← You are here</span>' : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Ranking System</h2>
      <p class="comp-text">Completing quests earns rank points. Accumulate enough and your guild promotes to the next rank. Higher ranks unlock harder quests, better shop inventory, and more powerful loot drops.</p>
      <p class="comp-text">Rank points scale with quest difficulty — S-Rank quests award far more rank points than F-Rank ones. The "War Stories" synergy bonus further amplifies rank point gains.</p>
      ${rows}
    </div>
  `;
}
