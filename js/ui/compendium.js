// ── Compendium — In-game encyclopedia ─────────────────────────────────────
import Game from '../game.js';
import { CLASSES, RANK_ORDER, EQUIPMENT, LOOT_ITEMS, ITEM_RARITIES, getItemRarity } from '../data.js';
import { SKILLS, getClassSkills, getClassMasteries, HERO_SPECS, HERO_RESPEC_COSTS, getSpecSkills } from '../skills.js';
import { rankCss } from '../util.js';

let _currentSection = 'overview';

// ── Section registry ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'overview',   label: 'Overview',          icon: '📖' },
  { id: 'stats',      label: 'Stats Guide',       icon: '📊' },
  { id: 'classes',    label: 'Classes & Skills',   icon: '⚔' },
  { id: 'equipment',  label: 'Equipment & Procs',  icon: '🛡' },
  { id: 'combat',     label: 'Combat Mechanics',   icon: '💥' },
  { id: 'tower',      label: 'Tower Climb',        icon: '🗼' },
  { id: 'synergy',    label: 'Party Synergy',      icon: '🔗' },
  { id: 'legacy',     label: 'Guild Legacy',       icon: '🏆' },
  { id: 'ranks',      label: 'Ranking System',     icon: '⭐' },
  { id: 'saves',      label: 'Save & Backup',      icon: '💾' },
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
      case 'tower':     body.innerHTML = renderTowerGuide(); break;
      case 'synergy':   body.innerHTML = renderSynergy(); break;
      case 'legacy':    body.innerHTML = renderLegacyGuide(); break;
      case 'ranks':     body.innerHTML = renderRanks(); break;
      case 'saves':     body.innerHTML = renderSavesGuide(); break;
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
      <p class="comp-text">You are the leader of a fledgling guild of adventurers. Recruit heroes, equip them with powerful gear, send them on dangerous quests, and climb the ranks from F all the way to S++. Reach S-Rank to unlock the Endless Tower, and push into S++ to face Raid Bosses — the ultimate challenge.</p>

      <h3 class="comp-subtitle">Getting Started</h3>
      <p class="comp-text">You begin with a <strong>Hero</strong> and <strong>200 gold</strong>. Head to the <strong>Party</strong> tab to recruit your first companions — all 9 classes are available from the start. Your first few recruits cost 50–150g, so you can assemble a party of 3 quickly.</p>
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
  const classOrder = ['HERO', 'KNIGHT', 'MAGE', 'ROGUE', 'CLERIC', 'RANGER', 'BARD', 'MONK', 'NECROMANCER'];
  const roleMap = {
    HERO: 'Balanced DPS / Support',
    KNIGHT: 'Tank / Protector',
    MAGE: 'Magic DPS / Crit',
    ROGUE: 'Physical DPS / Crit',
    CLERIC: 'Healer / Support',
    RANGER: 'Ranged DPS / AoE',
    BARD: 'Support / Regen',
    MONK: 'Hybrid / Self-Sustain',
    NECROMANCER: 'Summoner / Drain Caster',
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
      const badge = isPassive
        ? '<span class="comp-skill-badge passive">Passive</span>'
        : `<span class="comp-skill-badge active">Active ${Math.round(s.procChance * 100)}%</span>`;
      const lvl = s.unlockLevel ? ` <em class="comp-skill-lvl">Lv.${s.unlockLevel}</em>` : '';
      return `<div class="comp-skill-row">
        <span class="comp-skill-icon">${s.icon || '•'}</span>
        <span class="comp-skill-name">${s.name}${lvl}</span>
        ${badge}
        <span class="comp-skill-desc">${s.description || ''}</span>
      </div>`;
    }).join('');

    const masteryList = masteries.map(s => {
      const isPassive = s.type === 'passive' || s.procChance >= 1.0;
      const badge = isPassive
        ? '<span class="comp-skill-badge passive">Passive</span>'
        : `<span class="comp-skill-badge active">Active ${Math.round(s.procChance * 100)}%</span>`;
      const lvl = s.unlockLevel ? ` <em class="comp-skill-lvl">Lv.${s.unlockLevel}</em>` : '';
      return `<div class="comp-skill-row comp-mastery">
        <span class="comp-skill-icon">${s.icon || '•'}</span>
        <span class="comp-skill-name">${s.name}${lvl}</span>
        ${badge}
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

  // Hero Specialization section
  const specCards = Object.entries(HERO_SPECS).map(([trackId, track]) => {
    const specSkills = getSpecSkills(trackId);
    const skillRows = specSkills.map(s => {
      const isPassive = s.type === 'passive' || s.procChance >= 1.0;
      const badge = s.reactive
        ? '<span class="comp-skill-badge reactive">Reactive</span>'
        : isPassive
          ? '<span class="comp-skill-badge passive">Passive</span>'
          : `<span class="comp-skill-badge active">Active ${Math.round(s.procChance * 100)}%</span>`;
      return `<div class="comp-skill-row">
        <span class="comp-skill-icon">${s.icon || '•'}</span>
        <span class="comp-skill-name">${s.name} <em class="comp-skill-lvl">Lv.${s.unlockLevel}</em></span>
        ${badge}
        <span class="comp-skill-desc">${s.description || ''}</span>
      </div>`;
    }).join('');

    return `
      <div class="comp-class-card" style="border-left:3px solid var(--cyan)">
        <div class="comp-class-header">
          <span class="comp-class-sigil">${track.icon}</span>
          <div>
            <div class="comp-class-name">${track.label}</div>
            <div class="comp-class-role">${track.description}</div>
          </div>
        </div>
        <div class="comp-skill-section"><div class="comp-skill-header">Specialization Skills</div>${skillRows}</div>
      </div>
    `;
  }).join('');

  const respecCosts = Object.entries(HERO_RESPEC_COSTS)
    .map(([rank, cost]) => `${rank}: ${cost.toLocaleString()}g`)
    .join(' · ');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Classes & Skills</h2>
      <p class="comp-text">All 9 classes are available from the start. Base stats show Level 1 values, with per-level growth in parentheses. Active skills show their proc chance; passives are always active.</p>
      ${cards}

      <h2 class="comp-title" style="margin-top:24px">Hero Specializations</h2>
      <p class="comp-text">At Level 10, the Hero chooses a specialization track that adds 3 new skills on top of existing abilities (at Lv.10, 14, and 18). Each track defines a distinct combat role. You can respec to a different track for gold — the cost scales with guild rank.</p>
      <p class="comp-text" style="opacity:0.7">Respec costs: ${respecCosts}</p>
      ${specCards}
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
    celestial: 'God-tier S/S+/S++ drops. Each class has a full 4-piece set with massive stats and celestial-tier skill procs with special visual effects. Drop rates increase at S+ and S++, and Raid Bosses guarantee celestial-only loot.',
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
    .filter(it => it.grantedSkill || (it.grantedSkills && it.grantedSkills.length))
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

  const procRows = procItems.flatMap(it => {
    const skillIds = [].concat(it.grantedSkill || [], it.grantedSkills || []);
    const rarity = getItemRarity(it);
    const classStr = it.classReq ? it.classReq.map(c => CLASSES[c]?.sigil || c).join('/') : 'Any';
    return skillIds.map(skId => {
      const skill = SKILLS[skId];
      if (!skill) return '';
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
    });
  }).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Equipment & Procs</h2>
      <p class="comp-text">Gear comes in four slots — Weapon, Armor, Offhand, and Accessory — across six rarity tiers. Two-handed weapons (Bard instruments, some greatswords/staves) carry ~1.5× stats to compensate for the lost offhand slot. The Hero's celestial set offers a unique choice: Dawnbreaker (1H sword) + Ascendant Ward (shield) for balanced builds, or the Godslayer (2H greatsword) for Champions who trade defense for devastating offensive power — it grants both an active proc and a passive aura to compensate for the lost shield slot.</p>

      <h3 class="comp-subtitle">Rarity Tiers</h3>
      ${rarityRows}

      <h3 class="comp-subtitle">Loot Drops by Rank</h3>
      <p class="comp-text">Each guild rank drops equipment from specific rarity tiers. Normal quests draw from the rank's pool. Boss quests skip the current tier entirely and drop gear from the next tier up, with a chance at two tiers up, plus a small chance at celestial drops regardless of rank.</p>
      <div class="comp-loot-table">
        <div class="comp-loot-header"><span>Rank</span><span>Normal Drops</span><span>Boss Drops</span></div>
        <div class="comp-loot-row"><span class="rank-F">F</span><span>Common</span><span>Magic, Magic+Rare, Celestial</span></div>
        <div class="comp-loot-row"><span class="rank-E">E</span><span>Magic</span><span>Magic+Rare, Rare, Celestial</span></div>
        <div class="comp-loot-row"><span class="rank-D">D</span><span>Magic, Rare</span><span>Rare, Rare+Epic, Celestial</span></div>
        <div class="comp-loot-row"><span class="rank-C">C</span><span>Rare</span><span>Rare+Epic, Epic+Legendary, Celestial</span></div>
        <div class="comp-loot-row"><span class="rank-B">B</span><span>Rare, Epic</span><span>Epic+Legendary, Legendary+Celestial</span></div>
        <div class="comp-loot-row"><span class="rank-A">A</span><span>Epic, Legendary</span><span>Legendary+Celestial</span></div>
        <div class="comp-loot-row"><span class="rank-S">S</span><span>Legendary, Celestial</span><span>Legendary, Celestial (increased)</span></div>
        <div class="comp-loot-row"><span class="rank-S">S+</span><span>Legendary, Celestial+</span><span>Legendary, Celestial (highest)</span></div>
        <div class="comp-loot-row"><span class="rank-S">S++</span><span>Legendary, Celestial++</span><span>Legendary, Celestial (highest)</span></div>
      </div>
      <p class="comp-text" style="margin-top:8px; font-size:0.78rem; color:var(--text-muted)">Celestial drop rates from bosses are very low at early ranks but scale significantly at S and above. Boss fights are designed to be meaningful progression milestones — beating one rewards you with gear from the next tier of content.</p>

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

      <h3 class="comp-subtitle">Hero Specialization Mechanics</h3>
      <p class="comp-text"><strong>Vanguard's Oath:</strong> Reactive intercept (like Bulwark) with 40% damage reduction. Absorbs hits meant for allies. 3-round cooldown. Checked when no Knight Bulwark is available.</p>
      <p class="comp-text"><strong>Unbreakable Will:</strong> When the Vanguard Hero would be killed, survives at 1 HP with 80% damage reduction for 2 rounds. 5-round cooldown. Checked before Divine Intervention.</p>
      <p class="comp-text"><strong>Executioner's Mark:</strong> When any enemy drops below 30% HP, the Champion Hero delivers a bonus 2.0× ATK finishing strike. 3-round cooldown.</p>
      <p class="comp-text"><strong>Bloodlust:</strong> After any enemy kill, the Champion's next attack deals 1.5× damage. Passive stat bonuses always active: +20% ATK, +15% CRIT chance, +12% SPD.</p>
      <p class="comp-text"><strong>Hero's Wrath:</strong> Active skill (45% proc). Deals a guaranteed 3.0× critical hit. Devastating when combined with Bloodlust.</p>
      <p class="comp-text"><strong>Guardian Spirit:</strong> When any ally drops below 25% HP, the Warden Hero heals them for 30% of their max HP. 3-round cooldown.</p>
      <p class="comp-text"><strong>War Banner:</strong> Passive party aura — ATK +12%, DEF +10%, SPD +8%, CRIT +5%. Always active.</p>
      <p class="comp-text"><strong>Second Dawn:</strong> When 2+ allies are KO'd, the Warden revives ALL fallen allies at 25% HP. Once per fight.</p>

      <h3 class="comp-subtitle">Raid Bosses (S++ Only)</h3>
      <p class="comp-text">Raid Bosses are the ultimate combat encounters, exclusive to S++ rank. They are significantly more powerful than standard bosses and use the same combat simulation, but with dramatically higher difficulty scaling.</p>
      <p class="comp-text"><strong>Celestial-only loot:</strong> Raid Bosses suppress all non-celestial equipment drops. Every piece of gear that drops from a raid is guaranteed celestial rarity.</p>
      <p class="comp-text"><strong>Guaranteed drops:</strong> Normal bosses guarantee 4–8 loot drops. Raid Bosses guarantee 8–12 drops, making them the most rewarding encounters in the game.</p>
      <p class="comp-text"><strong>Drop rate boost:</strong> Celestial drop chance is massively amplified on raids (up to 45% cap vs 25% for normal S++ quests). This makes raid bosses the fastest path to completing celestial sets.</p>
    </div>
  `;
}

// ── Tower Climb Guide ─────────────────────────────────────────────────────
function renderTowerGuide() {
  const bestFloor = Game.state?.tower?.bestFloor || 0;
  const totalRuns = Game.state?.tower?.totalRuns || 0;

  // Tower gem bag items
  const towerItems = ['TOWER_GEM_BAG_MINOR', 'TOWER_GEM_BAG_MAJOR', 'TOWER_GEM_BAG_SUPREME']
    .map(id => LOOT_ITEMS[id])
    .filter(Boolean);

  const towerItemRows = towerItems.map(it => {
    const rarity = getItemRarity(it);
    return `
      <div class="comp-tower-item-row">
        <span style="color:${rarity?.color || '#ccc'}">${it.name}</span>
        <span class="comp-tower-item-sell">Sell: ${it.sellPrice?.toLocaleString() || '?'}g</span>
      </div>
    `;
  }).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">The Endless Tower</h2>
      <p class="comp-text">The Tower Climb is an endgame game mode that unlocks at S-Rank. Send your party into the Endless Tower — an ever-escalating gauntlet of increasingly difficult floors with unique rewards.</p>

      ${bestFloor > 0 || totalRuns > 0 ? `
        <div class="comp-tower-stats">
          <span><strong>Best Floor:</strong> ${bestFloor}</span>
          <span><strong>Total Runs:</strong> ${totalRuns}</span>
        </div>
      ` : ''}

      <h3 class="comp-subtitle">How It Works</h3>
      <p class="comp-text"><strong>Entering the Tower:</strong> From the Tower tab, send your current active party into the tower. Each floor is a combat encounter that gets progressively harder. Your party's HP carries over between floors.</p>
      <p class="comp-text"><strong>Rest Rooms:</strong> Every 10 floors you reach a rest room. Here you can choose to continue climbing (your party is partially healed) or teleport back to the guild with your rewards. Pushing further means bigger rewards — but risk losing everything if your party falls.</p>
      <p class="comp-text"><strong>Party Defeat:</strong> If your party is defeated, the run ends immediately. You still receive rewards for all the floors you cleared before the defeat, but you won't benefit from continuing further.</p>

      <h3 class="comp-subtitle">Difficulty Scaling</h3>
      <p class="comp-text">The tower starts at roughly S-Rank difficulty and scales upward with each floor. Boss floors appear at floors 10, 20, 30, 50, 75, and 100, featuring named bosses with significantly higher power.</p>
      <p class="comp-text">Enemy tiers increase as you climb: basic tower guardians on early floors give way to elite constructs, shadow entities, and eventually celestial-tier threats on the highest floors.</p>

      <h3 class="comp-subtitle">Tower Rewards</h3>
      <p class="comp-text"><strong>Gold & Experience:</strong> Each floor cleared awards gold and experience. These scale with floor number — higher floors are worth substantially more.</p>
      <p class="comp-text"><strong>Rank Points:</strong> Tower runs award rank points based on total floors cleared, helping push toward S+ and S++ promotions.</p>
      <p class="comp-text"><strong>Celestial Drops:</strong> Starting from floor 10, you gain an increasing chance at celestial equipment drops. The chance grows by roughly 4% every 10 floors, up to a 50% maximum, with up to 5 celestial items possible per run.</p>

      <h3 class="comp-subtitle">Tower Gem Bags</h3>
      <p class="comp-text">The tower drops exclusive gem bags that can't be found anywhere else. These valuable items can be sold for large sums of gold.</p>
      <div class="comp-tower-items">
        ${towerItemRows}
      </div>
      <p class="comp-text">Minor gem bags start dropping early, but the Supreme variant only appears on very high floors.</p>

      <h3 class="comp-subtitle">Best Floor Tracker</h3>
      <p class="comp-text">The tower tracks your highest floor reached and the party composition that achieved it. Try different team combinations to push for a new personal record.</p>
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
    S: 'The endgame begins. Celestial equipment starts dropping. The Tower Climb unlocks.',
    'S+': 'Higher celestial drop rates and denser legendary loot pools. The challenge escalates.',
    'S++': 'The true pinnacle. Raid Boss encounters appear — the hardest fights in the game with guaranteed celestial drops.',
  };

  const rows = RANK_ORDER.map(r => {
    const current = Game.state?.guild?.rank === r;
    return `
      <div class="comp-rank-row${current ? ' current' : ''}">
        <span class="rank-badge rank-${rankCss(r)}" style="font-size:1rem;padding:4px 12px">${r}</span>
        <span class="comp-rank-desc">${rankDescriptions[r] || ''}</span>
        ${current ? '<span class="comp-rank-current">← You are here</span>' : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">Ranking System</h2>
      <p class="comp-text">Completing quests earns rank points. Accumulate enough and your guild promotes to the next rank. Higher ranks unlock harder quests, better shop inventory, and more powerful loot drops.</p>
      <p class="comp-text">Rank points scale with quest difficulty — higher rank quests award far more rank points. S-Rank is split into three sub-tiers: S, S+, and S++. Reaching S+ requires 500,000 rank points, and S++ is the final tier with no upper limit. The "War Stories" synergy bonus further amplifies rank point gains.</p>
      ${rows}
    </div>
  `;
}

// ── Guild Legacy Guide ────────────────────────────────────────────────────
function renderLegacyGuide() {
  const talents = Game.LEGACY_TALENTS;
  if (!talents) {
    return `<div class="comp-section"><h2 class="comp-title">Guild Legacy</h2><p class="comp-text">Guild Legacy unlocks at S++ rank.</p></div>`;
  }

  // Group talents by class/party
  const groups = {};
  for (const [id, t] of Object.entries(talents)) {
    const key = t.classId || 'PARTY';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  const classOrder = Object.keys(CLASSES);
  let talentRows = '';

  for (const cid of classOrder) {
    if (!groups[cid]) continue;
    const cls = CLASSES[cid];
    const sorted = groups[cid].sort((a, b) => a.tier - b.tier);
    talentRows += `<div class="comp-legacy-group">
      <div class="comp-legacy-class">${cls?.label || cid}</div>
      ${sorted.map(t => `<div class="comp-legacy-talent">
        <span class="comp-legacy-icon">${t.icon}</span>
        <div class="comp-legacy-info">
          <span class="comp-legacy-name">${t.label} <span class="comp-legacy-tier">Tier ${t.tier} &middot; ${t.cost} pt${t.cost > 1 ? 's' : ''} &middot; Req Lv.${t.reqLevel}</span></span>
          <span class="comp-legacy-desc">${t.desc}</span>
        </div>
      </div>`).join('')}
    </div>`;
  }

  // Party-wide
  if (groups.PARTY) {
    const sorted = groups.PARTY.sort((a, b) => a.tier - b.tier);
    talentRows += `<div class="comp-legacy-group">
      <div class="comp-legacy-class">Party-Wide</div>
      ${sorted.map(t => `<div class="comp-legacy-talent">
        <span class="comp-legacy-icon">${t.icon}</span>
        <div class="comp-legacy-info">
          <span class="comp-legacy-name">${t.label} <span class="comp-legacy-tier">Tier ${t.tier} &middot; ${t.cost} pt${t.cost > 1 ? 's' : ''} &middot; Req Lv.${t.reqLevel}</span></span>
          <span class="comp-legacy-desc">${t.desc}</span>
        </div>
      </div>`).join('')}
    </div>`;
  }

  return `
    <div class="comp-section">
      <h2 class="comp-title">Guild Legacy</h2>
      <p class="comp-text">Upon reaching S++ (maximum rank), excess rank points overflow into the Guild Legacy system. Every ${(Game.LEGACY_RP_PER_LEVEL || 50000).toLocaleString()} overflow RP earns one Legacy Level, which provides passive bonuses and one talent point.</p>

      <h3 class="comp-subtitle">Passive Bonuses (per level)</h3>
      <p class="comp-text">Each Legacy Level grants: +2% gold, +1% item find, +1% EXP, +0.5% celestial drop rate. These stack indefinitely.</p>

      <h3 class="comp-subtitle">Talent System</h3>
      <p class="comp-text">Each Legacy Level also grants one talent point. Talents augment class abilities — addressing weaknesses and amplifying strengths. There are 3 tiers of talents per class (costing 1, 2, and 3 points respectively), plus 5 party-wide talents that benefit the entire guild.</p>
      <p class="comp-text">Tier requirements: Tier 1 talents need Legacy Lv.1+, Tier 2 needs Lv.3+, and Tier 3 needs Lv.6+. Talents can be reset for free from the Guild Hall.</p>

      <div class="comp-legacy-tree">${talentRows}</div>
    </div>
  `;
}

// ── Save & Backup Guide ──────────────────────────────────────────────────
function renderSavesGuide() {
  return `
    <div class="comp-section">
      <h2 class="comp-title">Save & Backup</h2>
      <p class="comp-text">Your game saves automatically to your browser's local storage as you play. This means your progress is tied to the specific browser on the specific device you're playing on. If you clear your browser data, switch browsers, or move to a different device, your save won't carry over unless you export it first.</p>

      <h3 class="comp-subtitle">How to Export Your Save</h3>
      <p class="comp-text">Exporting creates a backup file you can store anywhere — your desktop, a USB drive, cloud storage, etc.</p>
      <div class="comp-steps">
        <div class="comp-step">
          <span class="comp-step-num">1</span>
          <div class="comp-step-text">Open the <strong>Guild Hall</strong> tab (your home screen).</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">2</span>
          <div class="comp-step-text">Scroll down to the <strong>Save Management</strong> card at the bottom.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">3</span>
          <div class="comp-step-text">Click <strong>Export Save</strong>. A <code>.json</code> file will download to your device — this is your save file.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">4</span>
          <div class="comp-step-text">Store the file somewhere safe. The filename includes your guild name and the date, so you can keep multiple backups.</div>
        </div>
      </div>

      <h3 class="comp-subtitle">How to Import a Save</h3>
      <p class="comp-text">Importing loads a previously exported save file. This will replace your current progress, so export your current save first if you want to keep it.</p>
      <div class="comp-steps">
        <div class="comp-step">
          <span class="comp-step-num">1</span>
          <div class="comp-step-text">Open the <strong>Guild Hall</strong> tab.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">2</span>
          <div class="comp-step-text">Scroll down to the <strong>Save Management</strong> card.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">3</span>
          <div class="comp-step-text">Click <strong>Import Save</strong> and select your <code>.json</code> save file.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">4</span>
          <div class="comp-step-text">If the file is valid, your game will reload with the imported progress. You'll see a confirmation message with your guild name and rank.</div>
        </div>
      </div>

      <h3 class="comp-subtitle">Moving to Another Device</h3>
      <div class="comp-steps">
        <div class="comp-step">
          <span class="comp-step-num">1</span>
          <div class="comp-step-text"><strong>Export</strong> your save on the device you're currently playing on.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">2</span>
          <div class="comp-step-text">Transfer the <code>.json</code> file to your other device (email it to yourself, use cloud storage, airdrop, etc.).</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">3</span>
          <div class="comp-step-text">Open the game on the new device and <strong>Import</strong> the save file.</div>
        </div>
      </div>

      <h3 class="comp-subtitle">Good to Know</h3>
      <div class="comp-steps">
        <div class="comp-step">
          <span class="comp-step-num">!</span>
          <div class="comp-step-text">If an import fails (corrupted or incompatible file), your current save is automatically restored — nothing is lost.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">!</span>
          <div class="comp-step-text">Save files from older game versions will be automatically updated when imported. Save files from newer versions cannot be loaded on older versions of the game.</div>
        </div>
        <div class="comp-step">
          <span class="comp-step-num">!</span>
          <div class="comp-step-text">It's a good habit to export a backup before major gameplay milestones — like attempting a tough boss or resetting talents.</div>
        </div>
      </div>
    </div>
  `;
}
