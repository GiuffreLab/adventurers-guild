// ── Compendium — In-game encyclopedia ─────────────────────────────────────
import Game from '../game.js';
import { CLASSES, RANK_ORDER, EQUIPMENT, LOOT_ITEMS, ITEM_RARITIES, getItemRarity } from '../data.js';
import { RANK_SCALES, SUB_TIER_MULTIPLIERS, RANK_POWER_TARGETS, RANK_ENEMY_COUNT, BOSS_ROLE_MULTS, BOSS_COMPOSITIONS, RAID_COMPOSITIONS, BRUTAL_PROMOTION, BOSS_POWER_MULT, RAID_POWER_MULT } from '../data/rankScales.js';
import { SKILLS, getClassSkills, getClassMasteries, HERO_SPECS, getSpecSkills } from '../skills.js';
import { rankCss } from '../util.js';

let _currentSection = 'overview';

// ── Section registry ──────────────────────────────────────────────────────
// Class pages generated dynamically from CLASSES data
const CLASS_ORDER = ['HERO', 'BARD', 'CLERIC', 'KNIGHT', 'MAGE', 'MONK', 'NECROMANCER', 'RANGER', 'ROGUE'];
const CLASS_ICONS = {
  HERO: '⚔', BARD: '🎵', CLERIC: '✨', KNIGHT: '🛡', MAGE: '🔮',
  MONK: '☯', NECROMANCER: '💀', RANGER: '🏹', ROGUE: '🗡',
};

const SECTIONS = [
  { id: 'overview',   label: 'Overview',          icon: '📖' },
  { id: 'stats',      label: 'Stats Guide',       icon: '📊' },
  { id: 'divider-classes', label: '── Classes ──', icon: '', divider: true },
  ...CLASS_ORDER.map(cid => ({
    id: `class_${cid}`, label: CLASSES[cid]?.label || cid, icon: CLASS_ICONS[cid] || '•',
  })),
  { id: 'divider-game', label: '── Game Systems ──', icon: '', divider: true },
  { id: 'equipment',  label: 'Equipment & Procs',  icon: '🛡' },
  { id: 'combat',     label: 'Combat Mechanics',   icon: '💥' },
  { id: 'combatlog',  label: 'Combat Log Guide',   icon: '📋' },
  { id: 'tower',      label: 'Tower Climb',        icon: '🗼' },
  { id: 'synergy',    label: 'Party Synergy',      icon: '🔗' },
  { id: 'legacy',     label: 'Guild Legacy',       icon: '🏆' },
  { id: 'ranks',      label: 'Ranking System',     icon: '⭐' },
  { id: 'difficulty', label: 'Difficulty & Scaling', icon: '📈' },
  { id: 'saves',      label: 'Save & Backup',      icon: '💾' },
];

// ── Main Render ───────────────────────────────────────────────────────────
export function renderCompendium() {
  const el = document.getElementById('tab-compendium');
  if (!el) { console.warn('Compendium: #tab-compendium not found'); return; }

  try {
    const nav = SECTIONS.map(s => {
      if (s.divider) return `<div class="comp-nav-divider">${s.label}</div>`;
      return `<button class="comp-nav-btn${_currentSection === s.id ? ' active' : ''}" data-section="${s.id}">${s.icon} ${s.label}</button>`;
    }).join('');

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
    if (_currentSection.startsWith('class_')) {
      body.innerHTML = renderClassPage(_currentSection.replace('class_', ''));
    } else {
      switch (_currentSection) {
        case 'overview':  body.innerHTML = renderOverview(); break;
        case 'stats':     body.innerHTML = renderStats(); break;
        case 'equipment': body.innerHTML = renderEquipment(); break;
        case 'combat':    body.innerHTML = renderCombat(); break;
        case 'combatlog': body.innerHTML = renderCombatLogGuide(); break;
        case 'tower':     body.innerHTML = renderTowerGuide(); break;
        case 'synergy':   body.innerHTML = renderSynergy(); break;
        case 'legacy':    body.innerHTML = renderLegacyGuide(); break;
        case 'ranks':     body.innerHTML = renderRanks(); break;
        case 'difficulty': body.innerHTML = renderDifficulty(); break;
        case 'saves':     body.innerHTML = renderSavesGuide(); break;
      }
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

// ── Per-Class Page ───────────────────────────────────────────────────────
const CLASS_ROLES = {
  HERO: { role: 'All-Rounder / Party Leader', desc: 'The Hero is the backbone of every guild. A versatile fighter who can fill any role through specializations, and whose base kit provides party-wide ATK, DEF, and SPD buffs. The Hero isn\'t the best tank, healer, or DPS — but they\'re the best <em>second choice</em> for any of those roles, and their leadership makes the whole party stronger.' },
  KNIGHT: { role: 'Tank / Party Protector', desc: 'The Knight is the definitive wall. Massive HP and DEF scaling, with skills that absorb hits meant for allies and reduce incoming damage for the whole party. Bring a Knight when the content hits hard enough that raw DPS can\'t outrace it.' },
  MAGE: { role: 'Magic DPS / Elemental Destruction', desc: 'The Mage deals the highest sustained magic damage in the game. Glass cannon with devastating power multipliers and MAG stacking. You bring a Mage because they kill things — their party aura now also gives some ATK and CRIT to physical allies.' },
  ROGUE: { role: 'Physical DPS / Crit Specialist', desc: 'The Rogue is the burst damage king. Highest crit chance, evasion, and single-target damage. Mark for Death lets the whole party pile onto a target, and Shadow Network gives universal SPD, CRIT, and DODGE to allies.' },
  CLERIC: { role: 'Healer / Sustain Anchor', desc: 'The Cleric keeps the party alive with sustained healing, revives, and defensive auras. Their Sanctuary now provides universal stats (HP, DEF, SPD, CRIT) so every party member benefits, not just other casters.' },
  RANGER: { role: 'Ranged DPS / Utility', desc: 'The Ranger combines strong physical damage with party utility. Precision Shot marks enemies for +10% damage from all sources, Nature Bond gives party-wide dodge and bonus gold/exp. The best class for farming and a strong DPS pick for any composition.' },
  BARD: { role: 'Buffer / Party Force Multiplier', desc: 'The Bard is the supreme party buffer. Their songs boost ATK, SPD, and CRIT for the whole team, Discord debuffs enemies, and Crescendo grants guaranteed devastating crits. Bards make everyone better — they\'re the strongest "always include" after the Hero.' },
  MONK: { role: 'Hybrid Melee / Reactive Bruiser', desc: 'The Monk is a flurry-of-fists bruiser with strong reactive defense. Hundred Fists pummels the entire enemy line, Flowing Strike counters on dodge, and Pressure Point disables dangerous foes. Ki Resonance gives the party an equal spread of ATK, DEF, SPD, and CRIT — never the wrong pick, never a wasted slot.' },
  NECROMANCER: { role: 'Summoner / Party Sustain Specialist', desc: 'The Necromancer commands the dead and siphons the living. Raise Dead produces tanky thralls, Shadow Bolt blasts a single target while healing every ally for 6% of their own max HP, and Blight ticks AoE damage over time. With the Grave Hunger talent, Shroud of Decay grows stronger with every kill.' },
};

function renderClassPage(cid) {
  const cls = CLASSES[cid];
  if (!cls) return '<div class="comp-section"><p class="comp-text">Class not found.</p></div>';
  const bs = cls.baseStats;
  const gr = cls.growthRates;
  const info = CLASS_ROLES[cid] || { role: '', desc: '' };

  // Skills & masteries
  const skills = getClassSkills(cid);
  const masteries = getClassMasteries(cid);

  const buildSkillRow = (s, isMastery) => {
    const isPassive = s.type === 'passive' || s.procChance >= 1.0;
    const badge = s.reactive
      ? '<span class="comp-skill-badge reactive">Reactive</span>'
      : isPassive
        ? '<span class="comp-skill-badge passive">Passive</span>'
        : '<span class="comp-skill-badge active">Active</span>';
    const lvl = s.unlockLevel ? ` <em class="comp-skill-lvl">Lv.${s.unlockLevel}</em>` : '';
    return `<div class="comp-skill-row${isMastery ? ' comp-mastery' : ''}">
      <span class="comp-skill-icon">${s.icon || '•'}</span>
      <span class="comp-skill-name">${s.name}${lvl}</span>
      ${badge}
      <span class="comp-skill-desc">${s.description || ''}</span>
    </div>`;
  };

  const skillList = skills.map(s => buildSkillRow(s, false)).join('');
  const masteryList = masteries.map(s => buildSkillRow(s, true)).join('');

  // Talents for this class
  const talents = Game.LEGACY_TALENTS;
  let talentSection = '';
  if (talents) {
    const classTalents = Object.values(talents).filter(t => t.classId === cid).sort((a, b) => a.tier - b.tier);
    if (classTalents.length > 0) {
      const talentRows = classTalents.map(t => `<div class="comp-legacy-talent">
        <span class="comp-legacy-icon">${t.icon}</span>
        <div class="comp-legacy-info">
          <span class="comp-legacy-name">${t.label} <span class="comp-legacy-tier">Tier ${t.tier} &middot; ${t.cost} pt${t.cost > 1 ? 's' : ''} &middot; Req Lv.${t.reqLevel}</span></span>
          <span class="comp-legacy-desc">${t.desc}</span>
        </div>
      </div>`).join('');
      talentSection = `
        <div class="comp-skill-section" style="margin-top:16px">
          <div class="comp-skill-header">Legacy Talents</div>
          <p class="comp-text" style="margin:4px 0 8px;opacity:0.7">Unlocked via the Guild Legacy system at S++ rank. Each talent tier costs more points and requires a higher Legacy Level.</p>
          ${talentRows}
        </div>`;
    }
  }

  // Hero-only: Specializations + design philosophy
  let heroSpecSection = '';
  if (cid === 'HERO') {
    const specCards = Object.entries(HERO_SPECS).map(([trackId, track]) => {
      const specSkills = getSpecSkills(trackId);
      const specRows = specSkills.map(s => buildSkillRow(s, false)).join('');
      return `
        <div class="comp-class-card" style="border-left:3px solid var(--cyan);margin-top:12px">
          <div class="comp-class-header">
            <span class="comp-class-sigil">${track.icon}</span>
            <div>
              <div class="comp-class-name">${track.label}</div>
              <div class="comp-class-role">${track.description}</div>
            </div>
          </div>
          <div class="comp-skill-section"><div class="comp-skill-header">Specialization Skills</div>${specRows}</div>
        </div>`;
    }).join('');

    heroSpecSection = `
      <h3 class="comp-subtitle" style="margin-top:20px">Hero Specializations</h3>
      <p class="comp-text">At Level 10, the Hero chooses a specialization track that replaces their baseline L10/L14/L18 skills with three new spec-defining abilities. Each track defines a distinct combat role — and respec is free, so experiment freely.</p>
      ${specCards}

      <div class="comp-class-card" style="border-left:3px solid var(--gold);margin-top:16px">
        <div class="comp-class-header">
          <span class="comp-class-sigil">💡</span>
          <div>
            <div class="comp-class-name">Specialization Design Philosophy</div>
            <div class="comp-class-role">Understanding what each spec brings to a party</div>
          </div>
        </div>
        <div style="padding:8px 12px">
          <p class="comp-text" style="margin-bottom:10px">The Hero is the ultimate flex pick — not the best at any single role, but the best <em>second choice</em> for any role. Each spec is roughly 70–80% as effective as the dedicated class at their primary job, but brings secondary party bonuses that the specialist never provides.</p>
          <p class="comp-text" style="margin-bottom:6px"><strong style="color:var(--cyan)">🛡 Vanguard — The off-tank who inspires.</strong> Not as tanky as a Knight, but the Vanguard's Iron Bastion also boosts party ATK and SPD — something a Knight never touches. Pair with a Monk instead of a Knight and you trade raw defense for offensive party stats that benefit everyone.</p>
          <p class="comp-text" style="margin-bottom:6px"><strong style="color:var(--red)">🩸 Champion — The DPS who marks prey for the pack.</strong> Not as bursty as a Rogue, but Executioner's Mark lets the whole team focus-fire weakened enemies, and Bloodlust gives party-wide CRIT and ATK. Pair with a Mage or Necromancer and the whole team hits harder, not just one assassin.</p>
          <p class="comp-text" style="margin-bottom:6px"><strong style="color:var(--green)">🚩 Warden — The off-healer who holds the line.</strong> Not as much sustained healing as a Cleric, but War Banner touches five different stats at once — breadth over depth. Guardian Spirit and Second Dawn provide emergency safety nets. Pair with a Bard and you get enough sustain plus offensive buffs that a Cleric comp would lack.</p>
          <p class="comp-text" style="margin-top:10px;opacity:0.7">In short: bring a dedicated class for a specialized role, or bring the Hero spec and fill the gap with broader party value. Both paths are viable — that's the Hero's true strength.</p>
        </div>
      </div>`;
  }

  return `
    <div class="comp-section">
      <div class="comp-class-card">
        <div class="comp-class-header">
          <span class="comp-class-sigil" style="font-size:1.8rem">${cls.sigil}</span>
          <div>
            <div class="comp-class-name" style="font-size:1.3rem">${cls.label}</div>
            <div class="comp-class-role">${info.role}</div>
          </div>
        </div>
        <p class="comp-text" style="margin:8px 0">${info.desc}</p>
        <div class="comp-class-stats">
          <span>HP ${bs.maxHp} <em>(+${gr.maxHp})</em></span>
          <span>ATK ${bs.atk} <em>(+${gr.atk})</em></span>
          <span>DEF ${bs.def} <em>(+${gr.def})</em></span>
          <span>SPD ${bs.spd} <em>(+${gr.spd})</em></span>
          <span>MAG ${bs.mag} <em>(+${gr.mag})</em></span>
          <span>CRT ${bs.crit} <em>(+${gr.crit})</em></span>
          <span>DDG ${bs.dodge} <em>(+${gr.dodge})</em></span>
        </div>
      </div>

      ${skills.length > 0 ? `<div class="comp-skill-section" style="margin-top:12px"><div class="comp-skill-header">Class Skills</div>${skillList}</div>` : ''}
      ${masteries.length > 0 ? `<div class="comp-skill-section" style="margin-top:12px"><div class="comp-skill-header">Masteries</div>${masteryList}</div>` : ''}
      ${heroSpecSection}
      ${talentSection}
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
      <p class="comp-text"><strong>Rally Cry (Hero):</strong> When any ally drops below 30% HP, a Hero with this skill automatically heals them for 15% of their max HP. 4-round cooldown.</p>
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

// ── Combat Log Guide ──────────────────────────────────────────────────────
function renderCombatLogGuide() {
  /* ── Chip-legend helper ── */
  const chip = (color, label, border) => {
    const bdr = border ? `border-left:3px solid ${border};` : '';
    return `<div class="clg-chip"><div class="clg-swatch" style="background:${color};${bdr}"></div>${label}</div>`;
  };

  return `
    <div class="comp-section">
      <h2 class="comp-title">📋 Combat Log Guide</h2>
      <p class="comp-text">The combat log displays a detailed play-by-play of every quest battle. Each entry is color-coded — background tint, inline skill names, and damage numbers all follow a consistent system so you can read the flow of battle at a glance.</p>

      <!-- ═══ ROW BACKGROUNDS ═══ -->
      <h3 class="comp-subtitle">Row Backgrounds (by event type)</h3>
      <p class="comp-text">Every log row has a subtle background tint and a colored left-border accent that tells you the event type instantly.</p>
      <div class="clg-legend">
        ${chip('rgba(200,210,230,0.15)', 'Attack',     'rgba(200,210,230,0.4)')}
        ${chip('rgba(240,192,96,0.18)',  'Skill',      '#f0c060')}
        ${chip('rgba(255,216,102,0.22)', 'Crit',       '#ffd866')}
        ${chip('rgba(155,89,182,0.18)',  'Magic',      '#9b59b6')}
        ${chip('rgba(168,100,255,0.18)', 'Equip Proc', '#a864ff')}
        ${chip('rgba(0,229,200,0.18)',   'Celestial',  '#00e5c8')}
        ${chip('rgba(46,204,113,0.16)',  'Heal',       '#2ecc71')}
        ${chip('rgba(100,181,246,0.16)', 'Buff',       '#64b5f6')}
        ${chip('rgba(243,156,18,0.16)',  'Debuff',     '#e67e22')}
        ${chip('rgba(231,76,60,0.18)',   'Enemy',      '#e74c3c')}
        ${chip('rgba(255,68,68,0.20)',   'KO',         '#ff4444')}
        ${chip('rgba(46,204,113,0.18)',  'Defeat',     '#2ecc71')}
        ${chip('rgba(255,216,102,0.18)', 'Divine',     '#ffd866')}
        ${chip('rgba(100,181,246,0.16)', 'Cover',      '#90caf9')}
        ${chip('rgba(243,156,18,0.18)',  'Reinforce',  '#f39c12')}
        ${chip('rgba(243,156,18,0.18)', 'Encounter',   '#e67e22')}
        ${chip('rgba(78,205,196,0.08)',  'Travel',     false)}
        ${chip('rgba(255,255,255,0.05)', 'Dodge',      false)}
        ${chip('rgba(78,205,196,0.14)',  'Resolve',    '#4ecdc4')}
        ${chip('rgba(52,152,219,0.14)',  'Defend',     '#3498db')}
      </div>

      <!-- ═══ INLINE TEXT COLORS ═══ -->
      <h3 class="comp-subtitle">Inline Text Colors (skill names)</h3>
      <p class="comp-text">Skill and ability names are highlighted inline so they pop from the neutral body text. Each skill category has one consistent color.</p>
      <div class="clg-legend">
        ${chip('#e0e0e0',  'Basic ATK')}
        ${chip('#f0c060',  'Skill')}
        ${chip('#f5a623',  'AoE')}
        ${chip('#c882ff',  'Magic')}
        ${chip('#5dde8e',  'Heal')}
        ${chip('#64b5f6',  'Buff')}
        ${chip('#f39c12',  'Debuff')}
        ${chip('#e67e22',  'DoT')}
        ${chip('#80deea',  'Reactive')}
        ${chip('#ffd866',  'Divine / Crit')}
        ${chip('#00e5c8',  'Celestial')}
        ${chip('#ff7675',  'Enemy ability')}
      </div>

      <!-- ═══ NUMBER CHIPS ═══ -->
      <h3 class="comp-subtitle">Damage &amp; Healing Numbers</h3>
      <p class="comp-text">Damage and healing values appear as compact number chips. The color always matches the damage source, regardless of context.</p>
      <div class="clg-legend">
        <div class="clg-chip"><span class="dmg-num dmg-phys" style="padding:1px 6px;">142</span> Physical</div>
        <div class="clg-chip"><span class="dmg-num dmg-magic" style="padding:1px 6px;">98</span> Magic</div>
        <div class="clg-chip"><span class="dmg-num dmg-heal" style="padding:1px 6px;">+65</span> Healing</div>
        <div class="clg-chip"><span class="dmg-num dmg-crit" style="padding:1px 6px;">213!</span> Critical</div>
        <div class="clg-chip"><span class="dmg-num dmg-aoe" style="padding:1px 6px;">77</span> AoE</div>
        <div class="clg-chip"><span class="dmg-num dmg-dot" style="padding:1px 6px;">34</span> DoT</div>
      </div>

      <!-- ═══ SAMPLE COMBAT SEQUENCE ═══ -->
      <h3 class="comp-subtitle">Sample Combat Sequence</h3>
      <p class="comp-text">Here's how actual log entries look in context — showing how backgrounds, skill highlights, and number chips work together:</p>
      <div class="clg-sample">
        <div class="combat-log-entry log-travel"><span class="log-icon">🗺</span><span class="log-text">The air grows tense near Crystal Cavern. Kira grips her weapon.</span></div>
        <div class="combat-log-entry log-encounter"><span class="log-icon">👁</span><span class="log-text">A wild <span class="sk-enemy">Ember Dragon</span> appears from the shadows!</span></div>
        <div class="combat-log-entry log-attack"><span class="log-icon">⚔</span><span class="log-text">Binx lunges forward, cutting Volcanic Worm for <span class="dmg-num dmg-phys">202</span>!</span></div>
        <div class="combat-log-entry log-crit"><span class="log-icon">💥</span><span class="log-text">Lyra flicks a dagger into Lava Elemental's weak spot — <span class="dmg-num dmg-crit">235 CRIT</span>!</span></div>
        <div class="combat-log-entry log-skill"><span class="log-icon">👊</span><span class="log-text">Tomas activates <span class="sk-aoe">Hundred Fists</span> — <span class="sk-aoe">5</span> enemies battered for <span class="dmg-num dmg-aoe">61</span> each!</span></div>
        <div class="combat-log-entry log-magic"><span class="log-icon">🌑</span><span class="log-text">Rowan's <span class="sk-magic">Shadow Bolt</span> strikes Lava Elemental for <span class="dmg-num dmg-magic">664</span>!</span></div>
        <div class="combat-log-entry log-heal"><span class="log-icon">🩸</span><span class="log-text">Dark energy floods back — <span class="sk-heal">4</span> allies drink <span class="dmg-num dmg-heal">+138</span> HP from the shadow!</span></div>
        <div class="combat-log-entry log-enemy"><span class="log-icon">🔥</span><span class="log-text">Ember Dragon casts <span class="sk-enemy">Cursed Touch</span> — Rowan takes <span class="dmg-num dmg-enemy">238</span>!</span></div>
        <div class="combat-log-entry log-cover"><span class="log-icon">🛡</span><span class="log-text">Binx intercepts the blow — <span class="sk-react">Vanguard's Oath</span> absorbs <span class="dmg-num dmg-phys">41</span> damage!</span></div>
        <div class="combat-log-entry log-divine"><span class="log-icon">🕊</span><span class="log-text">A holy light erupts! <span class="sk-divine">Divine Intervention</span> shields Rowan from the killing blow!</span></div>
        <div class="combat-log-entry log-buff"><span class="log-icon">✨</span><span class="log-text">Tomas activates <span class="sk-buff">Swift Palm</span> — +25% ATK, +15% SPD for 2 rounds!</span></div>
        <div class="combat-log-entry log-debuff"><span class="log-icon">🎸</span><span class="log-text">A dissonant chord — <span class="sk-debuff">Discord</span>: -20% ATK, fumble &amp; sonic DoT (3rd)!</span></div>
        <div class="combat-log-entry log-defeat"><span class="log-icon">💥</span><span class="log-text">With a mighty strike, Tomas defeats <span style="color:#2ecc71;font-weight:600;">Volcanic Worm</span>!</span></div>
        <div class="combat-log-entry log-ko"><span class="log-icon">💀</span><span class="log-text">Rowan staggers and drops — knocked out of the fight!</span></div>
        <div class="combat-log-entry log-dodge"><span class="log-icon">💨</span><span class="log-text">Lyra deftly sidesteps — the attack misses!</span></div>
        <div class="combat-log-entry log-reinforce"><span class="log-icon">⚠</span><span class="log-text">The ground trembles — <span class="sk-enemy">Lava Elemental</span> joins the fray!</span></div>
        <div class="combat-log-entry log-resolve"><span class="log-icon">✦</span><span class="log-text">Binx sheathes their weapon as the dust settles.</span></div>
      </div>

      <!-- ═══ DESIGN PRINCIPLES ═══ -->
      <h3 class="comp-subtitle">Design Principles</h3>
      <div class="clg-principles">
        <p><strong>One background per event type.</strong> Every row immediately tells you what's happening through its subtle background tint and left-border accent.</p>
        <p><strong>Uniform body text.</strong> All descriptive text is the same warm off-white. The background and highlights do the work — body text stays neutral and readable.</p>
        <p><strong>Skill names pop.</strong> Each skill category gets one consistent highlight color — gold for class skills, amber for AoE, purple for magic, blue for buffs, teal for reactives. The skill name is the only colored word in the sentence.</p>
        <p><strong>Numbers match their source.</strong> Physical = white, skill = gold, magic = purple, heals = green, enemy = red, crits = bright gold glow, DoTs = orange. Always consistent.</p>
        <p><strong>Weight = importance.</strong> Crits, defeats, KOs, and divine saves get bold text. Travel and dodges are italic and muted — low priority info stays quiet.</p>
      </div>

      <!-- ═══ READING TIPS ═══ -->
      <h3 class="comp-subtitle">Reading Tips</h3>
      <p class="comp-text"><strong>Round markers</strong> appear as centered dividers showing the round number. Events within each round are listed sequentially for readability.</p>
      <p class="comp-text"><strong>Reactive abilities</strong> (Ki Barrier, Bulwark, Divine Intervention, Riposte) trigger automatically and appear as separate entries from the triggering attack.</p>
      <p class="comp-text"><strong>Equipment procs</strong> fire after their triggering attack. Look for purple-highlighted proc names like Lifesteal or Spell Echo.</p>
      <p class="comp-text"><strong>KO and Revival</strong> — a red KO entry may be followed by a golden divine entry if a Cleric has Resurrection ready.</p>
      <p class="comp-text"><strong>Target counts</strong> in multi-hit attacks are colored to match the damage type — e.g. an amber "5" in "5 enemies battered" matches the amber AoE damage chip.</p>
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

  // Only show party-wide talents here — per-class talents are on each class page
  const partyTalents = Object.values(talents).filter(t => !t.classId).sort((a, b) => a.tier - b.tier);
  let partySection = '';
  if (partyTalents.length > 0) {
    const rows = partyTalents.map(t => `<div class="comp-legacy-talent">
      <span class="comp-legacy-icon">${t.icon}</span>
      <div class="comp-legacy-info">
        <span class="comp-legacy-name">${t.label} <span class="comp-legacy-tier">Tier ${t.tier} &middot; ${t.cost} pt${t.cost > 1 ? 's' : ''} &middot; Req Lv.${t.reqLevel}</span></span>
        <span class="comp-legacy-desc">${t.desc}</span>
      </div>
    </div>`).join('');
    partySection = `
      <h3 class="comp-subtitle">Party-Wide Talents</h3>
      <p class="comp-text">These talents benefit your entire guild regardless of class composition.</p>
      <div class="comp-legacy-tree">
        <div class="comp-legacy-group">${rows}</div>
      </div>`;
  }

  // Count class talents for the summary
  const classTalentCount = Object.values(talents).filter(t => t.classId).length;
  const classCount = new Set(Object.values(talents).filter(t => t.classId).map(t => t.classId)).size;

  return `
    <div class="comp-section">
      <h2 class="comp-title">Guild Legacy</h2>
      <p class="comp-text">Upon reaching S++ (maximum rank), excess rank points overflow into the Guild Legacy system. Every ${(Game.LEGACY_RP_PER_LEVEL || 50000).toLocaleString()} overflow RP earns one Legacy Level, which provides passive bonuses and one talent point.</p>

      <h3 class="comp-subtitle">Passive Bonuses (per level)</h3>
      <p class="comp-text">Each Legacy Level grants: +2% gold, +1% item find, +1% EXP, +0.5% celestial drop rate. These stack indefinitely.</p>

      <h3 class="comp-subtitle">How Talents Work</h3>
      <p class="comp-text">Each Legacy Level grants one talent point. Talents augment class abilities — addressing weaknesses and amplifying strengths. There are 3 tiers of talents per class (costing 1, 2, and 3 points respectively), plus party-wide talents that benefit the entire guild.</p>
      <p class="comp-text"><strong>Tier requirements:</strong> Tier 1 talents unlock at Legacy Lv.1+, Tier 2 at Lv.3+, and Tier 3 at Lv.6+. You can reset all talents for free from the Guild Hall at any time.</p>
      <p class="comp-text"><strong>Earning points:</strong> You'll need many Legacy Levels to unlock everything. With ${classTalentCount} class talents across ${classCount} classes (costing 6 points each to max a single class) plus the party-wide talents below, prioritize talents for your core party members first.</p>
      <p class="comp-text" style="opacity:0.7">Class-specific talents are listed on each class's compendium page — check the class tabs in the sidebar.</p>

      ${partySection}
    </div>
  `;
}

// ── Difficulty & Scaling Guide ────────────────────────────────────────────
function renderDifficulty() {
  const chip = (color, label, border) => {
    const bdr = border ? `border-left:3px solid ${border};` : '';
    return `<div class="clg-chip"><div class="clg-swatch" style="background:${color};${bdr}"></div>${label}</div>`;
  };

  // Sub-tier data table
  const tiers = ['easy', 'standard', 'hard', 'brutal'];
  const tierLabels = { easy: 'Easy', standard: 'Standard', hard: 'Hard', brutal: 'Brutal' };
  const tierColors = { easy: '#2ecc71', standard: '#3498db', hard: '#f39c12', brutal: '#e74c3c' };
  const subTierRows = tiers.map(t => {
    const m = SUB_TIER_MULTIPLIERS[t];
    return `<tr>
      <td style="color:${tierColors[t]};font-weight:600;">${tierLabels[t]}</td>
      <td>${(m.hpMult * 100).toFixed(0)}%</td>
      <td>${(m.atkMult * 100).toFixed(0)}%</td>
      <td>${(m.rewardMult * 100).toFixed(0)}%</td>
    </tr>`;
  }).join('');

  // Rank scaling table
  const rankRows = RANK_ORDER.map(r => {
    const s = RANK_SCALES[r];
    const ec = RANK_ENEMY_COUNT[r];
    const pt = RANK_POWER_TARGETS[r];
    return `<tr>
      <td style="font-weight:600;color:var(--gold);">${r}</td>
      <td>${s.baseHp.toLocaleString()}</td>
      <td>${s.baseAtk.toLocaleString()}</td>
      <td>${ec}</td>
      <td>${pt.toLocaleString()}</td>
    </tr>`;
  }).join('');

  // Boss composition table
  const bossRows = RANK_ORDER.map(r => {
    const c = BOSS_COMPOSITIONS[r];
    if (!c) return '';
    const adds = [];
    if (c.generals > 0) adds.push(`${c.generals} General${c.generals > 1 ? 's' : ''}`);
    if (c.lts > 0) adds.push(`${c.lts} Lt${c.lts > 1 ? 's' : ''}`);
    if (c.captains > 0) adds.push(`${c.captains} Captain${c.captains > 1 ? 's' : ''}`);
    if (c.minions > 0) adds.push(`${c.minions} Minion${c.minions > 1 ? 's' : ''}`);
    const total = 1 + (c.generals || 0) + (c.lts || 0) + (c.captains || 0) + (c.minions || 0);
    return `<tr>
      <td style="font-weight:600;color:var(--gold);">${r}</td>
      <td>${total}</td>
      <td>Boss + ${adds.join(', ')}</td>
    </tr>`;
  }).join('');

  // Boss role multipliers
  const roleData = [
    { role: 'Minion',    hp: BOSS_ROLE_MULTS.minion.hpMult,   atk: BOSS_ROLE_MULTS.minion.atkMult,   note: 'F-E boss adds' },
    { role: 'Captain',   hp: BOSS_ROLE_MULTS.captain.hpMult,  atk: BOSS_ROLE_MULTS.captain.atkMult,  note: 'D-C boss adds' },
    { role: 'Lieutenant',hp: BOSS_ROLE_MULTS.lt.hpMult,       atk: BOSS_ROLE_MULTS.lt.atkMult,       note: 'B-A boss adds' },
    { role: 'General',   hp: BOSS_ROLE_MULTS.general.hpMult,  atk: BOSS_ROLE_MULTS.general.atkMult,  note: 'S+ boss adds' },
    { role: 'Boss',      hp: BOSS_ROLE_MULTS.boss.hpMult,     atk: BOSS_ROLE_MULTS.boss.atkMult,     note: 'Main boss' },
    { role: 'Raid Boss', hp: BOSS_ROLE_MULTS.raidBoss.hpMult, atk: BOSS_ROLE_MULTS.raidBoss.atkMult, note: 'S++ raids' },
  ];
  const roleRows = roleData.map(r => `<tr>
    <td style="font-weight:600;">${r.role}</td>
    <td>${r.hp.toFixed(2)}×</td>
    <td>${r.atk.toFixed(2)}×</td>
    <td style="color:var(--text-dim);font-size:0.8rem;">${r.note}</td>
  </tr>`).join('');

  // Brutal promotion table
  const promoData = [
    { ranks: 'F-E', role: 'Captain', color: '#2ecc71' },
    { ranks: 'D-C', role: 'Lieutenant', color: '#3498db' },
    { ranks: 'B+',  role: 'General', color: '#f39c12' },
  ];
  const promoChips = promoData.map(p =>
    `<div class="clg-chip"><div class="clg-swatch" style="background:${p.color};"></div><strong>${p.ranks}</strong> → ${p.role}</div>`
  ).join('');

  return `
    <div class="comp-section">
      <h2 class="comp-title">📈 Difficulty & Scaling</h2>
      <p class="comp-text">Every quest in the game has its difficulty determined by three factors: the rank tier, the sub-tier (Easy through Brutal), and whether it's a boss or raid encounter. This guide explains how all of these systems work together.</p>

      <!-- ═══ SUB-TIER SYSTEM ═══ -->
      <h3 class="comp-subtitle">Sub-Tier System</h3>
      <p class="comp-text">Every quest slot on the board has a sub-tier that scales enemy stats and rewards. Your quest board always offers a guaranteed mix of all four tiers so you can choose your challenge level.</p>
      <div class="clg-legend" style="margin-bottom:12px;">
        ${chip(tierColors.easy, 'Easy — Lower risk, lower reward')}
        ${chip(tierColors.standard, 'Standard — Baseline difficulty')}
        ${chip(tierColors.hard, 'Hard — Tougher enemies, better loot')}
        ${chip(tierColors.brutal, 'Brutal — Wipe risk, max rewards')}
      </div>
      <table class="comp-scale-table">
        <thead><tr><th>Tier</th><th>Enemy HP</th><th>Enemy ATK</th><th>Rewards</th></tr></thead>
        <tbody>${subTierRows}</tbody>
      </table>
      <p class="comp-text">Brutal encounters also feature a <strong>mini-boss promotion</strong> — the last enemy gets upgraded to the next rank bracket's add quality, previewing future difficulty:</p>
      <div class="clg-legend">${promoChips}</div>

      <!-- ═══ RANK SCALING ═══ -->
      <h3 class="comp-subtitle">Enemy Stats by Rank</h3>
      <p class="comp-text">Enemy base HP and ATK grow roughly 1.88× and 1.65× per rank step respectively. These are the Standard-tier baselines — sub-tier multipliers are applied on top.</p>
      <table class="comp-scale-table">
        <thead><tr><th>Rank</th><th>Base HP</th><th>Base ATK</th><th>Enemies</th><th>Power Target</th></tr></thead>
        <tbody>${rankRows}</tbody>
      </table>
      <p class="comp-text">The <strong>Power Target</strong> column is the party strength at which a Standard fight sits at a 1.0 difficulty ratio. Your quest card shows how your party compares to this target.</p>

      <!-- ═══ DIFFICULTY BADGES ═══ -->
      <h3 class="comp-subtitle">Difficulty Badges</h3>
      <p class="comp-text">Each quest card shows a difficulty badge based on the ratio of quest power to your party strength:</p>
      <div class="clg-legend">
        ${chip('rgba(255,255,255,0.1)', '○ Trivial — under 25%')}
        ${chip('rgba(46,204,113,0.3)', '◐ Easy — 25-50%')}
        ${chip('rgba(52,152,219,0.3)', '● Moderate — 50-80%')}
        ${chip('rgba(243,156,18,0.3)', '◆ Hard — 80-115%')}
        ${chip('rgba(231,76,60,0.3)', '★ Epic — 115-160%')}
        ${chip('rgba(155,89,182,0.3)', '✦ Legendary — over 160%')}
      </div>

      <!-- ═══ BOSS ENCOUNTERS ═══ -->
      <h3 class="comp-subtitle">Boss Encounters</h3>
      <p class="comp-text">Boss quests feature a powerful boss enemy plus role-typed adds. The total enemy count matches standard encounters — the boss replaces one regular enemy, and the rest are upgraded adds whose quality progresses through ranks.</p>
      <table class="comp-scale-table">
        <thead><tr><th>Role</th><th>HP Mult</th><th>ATK Mult</th><th>Appears In</th></tr></thead>
        <tbody>${roleRows}</tbody>
      </table>

      <h3 class="comp-subtitle">Boss Compositions by Rank</h3>
      <p class="comp-text">As you progress through ranks, boss adds get tougher. Early bosses bring minions; late-game bosses are surrounded by generals.</p>
      <table class="comp-scale-table">
        <thead><tr><th>Rank</th><th>Total</th><th>Composition</th></tr></thead>
        <tbody>${bossRows}</tbody>
      </table>

      <!-- ═══ RAID BOSSES ═══ -->
      <h3 class="comp-subtitle">Raid Bosses</h3>
      <p class="comp-text">Raid Bosses are the ultimate challenge, available at S-rank and above. They appear as a wildcard quest on the board (15% chance at high ranks).</p>
      <div class="clg-principles">
        <p><strong>Massively stronger.</strong> Raid bosses have ${BOSS_ROLE_MULTS.raidBoss.hpMult}× HP and ${BOSS_ROLE_MULTS.raidBoss.atkMult}× ATK — far beyond normal bosses (${BOSS_ROLE_MULTS.boss.hpMult}×/${BOSS_ROLE_MULTS.boss.atkMult}×).</p>
        <p><strong>Double RP.</strong> Raid bosses grant 2.0× the normal Rank Points, stacking with sub-tier rewards. A Brutal raid pays 4.0× base RP.</p>
        <p><strong>Celestial-only loot.</strong> Every drop from a raid boss is guaranteed celestial rarity. Drop rates are massively amplified (up to 45% cap at S++ vs 25% for normal bosses).</p>
        <p><strong>More guaranteed drops.</strong> Normal bosses drop 4-8 items. Raid bosses guarantee 8-12 drops — the fastest path to completing celestial sets.</p>
      </div>

      <!-- ═══ TOWER ═══ -->
      <h3 class="comp-subtitle">Tower Climb Scaling</h3>
      <p class="comp-text">The Tower is an endless gauntlet unlocked at S-rank. Enemy stats scale +6% per floor above Floor 1, compounding into extreme difficulty at high floors.</p>
      <table class="comp-scale-table">
        <thead><tr><th>Floor</th><th>Stat Mult</th><th>Effective HP (S-rank base)</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>1.00×</td><td>${RANK_SCALES.S.baseHp.toLocaleString()}</td><td>S-rank baseline</td></tr>
          <tr><td>10</td><td>1.54×</td><td>${Math.floor(RANK_SCALES.S.baseHp * 1.54).toLocaleString()}</td><td style="color:var(--gold);">Boss: The Gatekeeper</td></tr>
          <tr><td>20</td><td>2.14×</td><td>${Math.floor(RANK_SCALES.S.baseHp * 2.14).toLocaleString()}</td><td style="color:var(--gold);">Boss floor</td></tr>
          <tr><td>30</td><td>2.74×</td><td>${Math.floor(RANK_SCALES.S.baseHp * 2.74).toLocaleString()}</td><td style="color:var(--gold);">Boss floor</td></tr>
          <tr><td>50</td><td>3.94×</td><td>${Math.floor(RANK_SCALES.S.baseHp * 3.94).toLocaleString()}</td><td style="color:var(--gold);">Boss floor</td></tr>
          <tr><td>75</td><td>5.44×</td><td>${Math.floor(RANK_SCALES.S.baseHp * 5.44).toLocaleString()}</td><td style="color:var(--gold);">Boss floor</td></tr>
          <tr><td>100</td><td>6.94×</td><td>${Math.floor(RANK_SCALES.S.baseHp * 6.94).toLocaleString()}</td><td style="color:#e74c3c;font-weight:600;">Final Boss</td></tr>
        </tbody>
      </table>

      <h3 class="comp-subtitle">Tower Loot</h3>
      <p class="comp-text">Tower runs reward gold and XP per floor cleared, plus gem bags at milestone floors. Celestial drops start at Floor 10 (3% chance) and scale +4% per 10 floors, capping at 50%.</p>
      <table class="comp-scale-table">
        <thead><tr><th>Floor</th><th>Gem Bag</th><th>Drop Chance</th><th>Celestial %</th></tr></thead>
        <tbody>
          <tr><td>10</td><td>Minor Gem Bag</td><td>80%</td><td>3%</td></tr>
          <tr><td>20</td><td>Minor Gem Bag</td><td>100%</td><td>7%</td></tr>
          <tr><td>30</td><td>Major Gem Bag</td><td>70%</td><td>11%</td></tr>
          <tr><td>40</td><td>Major Gem Bag</td><td>100%</td><td>15%</td></tr>
          <tr><td>50</td><td>Supreme Gem Bag</td><td>60%</td><td>19%</td></tr>
          <tr><td>75</td><td>Supreme Gem Bag</td><td>100%</td><td>29%</td></tr>
          <tr><td>100</td><td>Supreme Gem Bag</td><td>100%</td><td>39%</td></tr>
        </tbody>
      </table>

      <!-- ═══ QUEST BOARD ═══ -->
      <h3 class="comp-subtitle">Quest Board Generation</h3>
      <p class="comp-text">Your quest board has 5 slots. The first four are a guaranteed mix of Easy, Standard, Hard, and Brutal. The 5th slot is a wildcard that can roll a special quest type:</p>
      <div class="clg-principles">
        <p><strong>Standard quest</strong> — 50% chance (low rank) / 40% (S+). A normal quest at a random sub-tier.</p>
        <p><strong>Mine expedition</strong> — 35% / 25%. A resource-gathering quest with gem bag payouts.</p>
        <p><strong>Boss encounter</strong> — 15% / 20%. A challenging boss fight with better loot and 1.5× RP.</p>
        <p><strong>Raid boss</strong> — 0% / 15%. S-rank and above only. The ultimate challenge with celestial-only drops and 2.0× RP.</p>
      </div>
      <p class="comp-text">When viewing a quest board below your current rank, all slots lock to a lower sub-tier: 1 rank below = all Brutal, 2 below = all Hard, 3 below = all Standard, 4+ below = all Easy. This prevents trivializing lower-rank content.</p>

      <!-- ═══ DESIGN PRINCIPLES ═══ -->
      <h3 class="comp-subtitle">Design Principles</h3>
      <div class="clg-principles">
        <p><strong>Predictable difficulty curve.</strong> Enemy stats come from fixed per-rank tables, not from your party's power. You always know what a rank feels like.</p>
        <p><strong>Brutal(N) ≈ Easy(N+1).</strong> The hardest fights of one rank overlap with the easiest fights of the next. This smooths the rank-up transition.</p>
        <p><strong>Boss add quality scales with rank.</strong> F-rank bosses bring weak minions. S++ bosses are surrounded by generals. The boss itself is always the same relative threat — it's the entourage that gets dangerous.</p>
        <p><strong>Tower is the endgame stress test.</strong> The +6% compounding floor scaling means Floor 50 enemies have nearly 4× the stats of Floor 1. Floor 100 is designed to be a wall that only fully optimized parties can clear.</p>
      </div>
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
