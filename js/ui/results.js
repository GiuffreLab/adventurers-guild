import Game from '../game.js';
import { getItem, getItemRarity, CLASSES, EQUIPMENT } from '../data.js';
import { getSkill, SKILLS } from '../skills.js';
import { esc, rankCss } from '../util.js';
import { floatText, confettiBurst, screenFlash, particleBurst } from './effects.js';

function formatLootEntry(d) {
  const item = getItem(d.itemId);
  if (!item) return `<span>${d.itemId}</span>`;
  const rarity = getItemRarity(item);
  const classReqStr = item.classReq
    ? item.classReq.map(cid => CLASSES[cid]?.label || cid).join(', ')
    : 'Any class';
  const qty = d.quantity > 1 ? ` \u00d7${d.quantity}` : '';
  const dropAnim = rarity.id !== 'common' ? ` loot-drop-${rarity.id}` : '';
  const nameGlow = rarity.id === 'celestial' ? ' item-name-celestial' : rarity.id === 'legendary' ? ' item-name-legendary' : rarity.id === 'epic' ? ' item-name-epic' : '';
  return `<span class="result-loot-entry${dropAnim}"><span class="${nameGlow}" style="color:${rarity.color}">${item.name}</span>${qty} <span class="item-rarity-badge" style="color:${rarity.color};border-color:${rarity.color}30">${rarity.label}</span> <span class="result-loot-class-req">${classReqStr}</span></span>`;
}

// ── Fight Log Export ──────────────────────────────────────────────────
function formatFightLog() {
  const pr = Game.state.pendingResults;
  if (!pr) return '(No pending results)';
  const { quest, result, levelUps, combatStats } = pr;
  const s = Game.state;
  const lines = [];

  // Header
  lines.push('═══════════════════════════════════════════');
  lines.push('           ADVENTURERS GUILD — FIGHT LOG');
  lines.push('═══════════════════════════════════════════');
  lines.push(`Quest: ${quest.title} [${quest.rank}-Rank]`);
  lines.push(`Outcome: ${result.success ? 'VICTORY' : 'DEFEAT'}`);
  lines.push(`Narrative: "${result.narrative}"`);
  lines.push(`Party Power: ${result.partyPower} vs Quest Power: ${result.questPower} (${Math.round(result.ratio * 100)}%)`);
  if (quest.environment) lines.push(`Environment: ${quest.environment.name} ${quest.environment.icon || ''}`);
  if (quest.enemies) lines.push(`Enemies: ${quest.enemies.join(', ')}`);
  if (quest.boss) lines.push(`** BOSS QUEST — ${quest.bossName || 'Unknown Boss'} **`);
  if (quest.gemMining) lines.push(`** GEM MINING QUEST **`);
  lines.push('');

  // Party composition with gear
  lines.push('── PARTY COMPOSITION ──────────────────────');
  const activeMembers = [s.player, ...s.activeSlots.map(id => s.party.find(p => p.id === id)).filter(Boolean)];
  const resultAuras = Game.getPartyAuras();
  for (const m of activeMembers) {
    const cls = CLASSES[m.class];
    const eff = Game.effectiveStats(m, resultAuras);
    const specLabel = m.heroSpec ? ` [${m.heroSpec.charAt(0).toUpperCase() + m.heroSpec.slice(1)}]` : '';
    lines.push(`${cls?.sigil || '?'} ${m.name} — ${cls?.label || m.class}${specLabel} Lv.${m.level}  (Power: ${Game.memberPower(m)})`);
    lines.push(`  HP: ${eff.maxHp}  ATK: ${eff.atk}  DEF: ${eff.def}  MAG: ${eff.mag}  SPD: ${eff.spd}  CRT: ${eff.crit}  DDG: ${eff.dodge}`);
    // Special percentage bonuses
    const specials = [];
    if (eff.dodgeChance > 0) specials.push(`DDG%+${Math.round(eff.dodgeChance * 100)}%`);
    if (eff.critChance > 0) specials.push(`CRT%+${Math.round(eff.critChance * 100)}%`);
    if (eff.healBonus > 0) specials.push(`HEAL+${Math.round(eff.healBonus * 100)}%`);
    if (specials.length > 0) lines.push(`  Bonuses: ${specials.join(', ')}`);

    // Equipment
    const slots = ['weapon', 'armor', 'offhand', 'accessory'];
    const gearParts = [];
    for (const slot of slots) {
      const itemId = m.equipment?.[slot];
      if (itemId) {
        const item = EQUIPMENT[itemId] || getItem(itemId);
        if (item) {
          const rarity = getItemRarity(item);
          gearParts.push(`[${slot}] ${item.name} (${rarity?.label || item.rarity})`);
        }
      }
    }
    if (gearParts.length > 0) lines.push(`  Gear: ${gearParts.join(' | ')}`);

    // Skills
    const memberData = Game.getMember(m.id);
    if (memberData?.skills?.length > 0) {
      const skillNames = memberData.skills.map(sid => {
        const sk = getSkill(sid);
        return sk ? `${sk.name} [${sk.source}${sk.procChance < 1 ? ` ${Math.round(sk.procChance*100)}%` : ' passive'}]` : sid;
      });
      lines.push(`  Skills: ${skillNames.join(', ')}`);
    }
    lines.push('');
  }

  // Combat debug info (bonuses, auras, effective stats at sim start)
  const debugData = pr.combatDebug;
  if (debugData) {
    lines.push('── COMBAT DEBUG ──────────────────────────');
    const hb = debugData.healBonus;
    const healParts = [];
    if (hb.synergy > 0) healParts.push(`synergy=${(hb.synergy * 100).toFixed(0)}%`);
    if (hb.partyAura > 0) healParts.push(`aura=${(hb.partyAura * 100).toFixed(0)}%`);
    if (hb.memberItem > 0) healParts.push(`item/skill=${(hb.memberItem * 100).toFixed(0)}%`);
    lines.push(`  Heal Multiplier: ${hb.total.toFixed(2)}× ${healParts.length ? '(' + healParts.join(' + ') + ')' : ''}`);
    if (debugData.dmgBonus > 1) lines.push(`  Damage Multiplier: ${debugData.dmgBonus.toFixed(2)}×`);
    if (debugData.dmgReduction > 0) lines.push(`  Damage Reduction: -${Math.round(debugData.dmgReduction * 100)}%`);
    if (debugData.atkSpeedBonus > 0) lines.push(`  Attack Speed: +${Math.round(debugData.atkSpeedBonus * 100)}%`);

    const auras = debugData.partyAuras;
    if (auras) {
      const auraParts = [];
      if (auras.atk > 0) auraParts.push(`ATK+${Math.round(auras.atk * 100)}%`);
      if (auras.def > 0) auraParts.push(`DEF+${Math.round(auras.def * 100)}%`);
      if (auras.mag > 0) auraParts.push(`MAG+${Math.round(auras.mag * 100)}%`);
      if (auras.spd > 0) auraParts.push(`SPD+${Math.round(auras.spd * 100)}%`);
      if (auras.crit > 0) auraParts.push(`CRT+${Math.round(auras.crit * 100)}%`);
      if (auras.dodge > 0) auraParts.push(`DDG+${Math.round(auras.dodge * 100)}%`);
      if (auras.maxHp > 0) auraParts.push(`HP+${Math.round(auras.maxHp * 100)}%`);
      if (auras.heal > 0) auraParts.push(`HEAL+${Math.round(auras.heal * 100)}%`);
      if (auraParts.length > 0) lines.push(`  Party Auras: ${auraParts.join(', ')}`);
    }

    lines.push('  ── Effective Combat Stats (at sim start) ──');
    for (const m of debugData.members) {
      const cls = CLASSES[m.class];
      const extras = [];
      if (m.dodgeChance > 0) extras.push(`DDG%+${Math.round(m.dodgeChance * 100)}%`);
      if (m.critChance > 0) extras.push(`CRT%+${Math.round(m.critChance * 100)}%`);
      if (m.healBonus > 0) extras.push(`HEAL+${Math.round(m.healBonus * 100)}%`);
      lines.push(`  ${cls?.sigil || '?'} ${m.name} (${cls?.label || m.class} Lv.${m.level}) — ATK:${m.atk} DEF:${m.def} MAG:${m.mag} SPD:${m.spd} CRT:${m.crit} DDG:${m.dodge} HP:${m.maxHp}${extras.length ? ' | ' + extras.join(', ') : ''}`);
    }
    lines.push('');
  }

  // Combat stats
  if (combatStats && combatStats.length > 0) {
    lines.push('── DAMAGE DEALT ──────────────────────────');
    const totalDmg = combatStats.reduce((s, c) => s + c.dmgDealt, 0);
    for (const c of combatStats) {
      const cls = CLASSES[c.class];
      const dmgPct = totalDmg > 0 ? Math.round((c.dmgDealt / totalDmg) * 100) : 0;
      lines.push(`  ${cls?.sigil || '?'} ${c.name} (${cls?.label || c.class}) — ${c.dmgDealt} dmg (${dmgPct}%)`);
    }
    lines.push(`  TOTAL DAMAGE: ${totalDmg}`);

    // Defense & Support table
    const defTotal = c => (c.dmgMitigated||0) + (c.dmgAbsorbed||0) + (c.dmgReflected||0) + (c.dmgDodged||0);
    const hasDefStats = combatStats.some(c => defTotal(c) > 0);
    if (hasDefStats) {
      lines.push('');
      lines.push('── DEFENSE & SUPPORT ─────────────────────');
      lines.push('  Member              Mitigated  Absorbed  Reflected  Dodged   Total');
      lines.push('  ──────────────────  ─────────  ────────  ─────────  ──────   ─────');
      const sorted = [...combatStats].filter(c => defTotal(c) > 0).sort((a, b) => defTotal(b) - defTotal(a));
      for (const c of sorted) {
        const cls = CLASSES[c.class];
        const label = `${cls?.sigil || '?'} ${c.name}`.padEnd(20);
        const mit = (c.dmgMitigated || 0).toString().padStart(9);
        const abs = (c.dmgAbsorbed || 0).toString().padStart(8);
        const ref = (c.dmgReflected || 0).toString().padStart(9);
        const dodge = (c.dmgDodged || 0).toString().padStart(6);
        const tot = defTotal(c).toString().padStart(7);
        lines.push(`  ${label}${mit}${abs}${ref}${dodge}${tot}`);
      }
    }

    // Healing & Damage Taken table
    const hasHealStats = combatStats.some(c => (c.healingDone||0) > 0 || (c.healingReceived||0) > 0 || (c.dmgTaken||0) > 0);
    if (hasHealStats) {
      lines.push('');
      lines.push('── HEALING & DAMAGE TAKEN ────────────────');
      lines.push('  Member              Healed  Received   Taken');
      lines.push('  ──────────────────  ──────  ────────   ─────');
      const sorted = [...combatStats]
        .filter(c => (c.healingDone||0) > 0 || (c.healingReceived||0) > 0 || (c.dmgTaken||0) > 0)
        .sort((a, b) => ((b.healingDone||0) + (b.healingReceived||0)) - ((a.healingDone||0) + (a.healingReceived||0)));
      for (const c of sorted) {
        const cls = CLASSES[c.class];
        const label = `${cls?.sigil || '?'} ${c.name}`.padEnd(20);
        const heal = (c.healingDone || 0).toString().padStart(6);
        const rcvd = (c.healingReceived || 0).toString().padStart(8);
        const taken = (c.dmgTaken || 0).toString().padStart(7);
        lines.push(`  ${label}${heal}${rcvd}${taken}`);
      }
    }
    lines.push('');
  }

  // Skill activations from the game engine (power roll procs)
  if (result.activatedSkills?.length > 0) {
    lines.push('── SKILL ACTIVATIONS (Power Roll) ────────');
    for (const act of result.activatedSkills) {
      const sk = act.skill;
      const effectParts = [];
      if (sk.effects) {
        for (const [key, val] of Object.entries(sk.effects)) {
          if (key === 'powerMultiplier') effectParts.push(`×${val} power`);
          else if (typeof val === 'number') effectParts.push(`${key}: ${val >= 1 ? val : (val > 0 ? '+' + Math.round(val * 100) + '%' : val)}`);
        }
      }
      const effectStr = effectParts.length > 0 ? effectParts.join(', ') : 'passive';
      const sourceSkill = getSkill(sk.id);
      const src = sourceSkill?.source || '?';
      lines.push(`  ${sk.icon || '•'} ${act.memberName}: ${sk.name} [${src}] — ${effectStr}`);
    }
    lines.push('');
  }

  // Full combat event log (cached from sim before quest resolved)
  const events = pr.combatEvents || [];
  if (events.length > 0) {
    lines.push('── FULL COMBAT LOG ───────────────────────');
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      lines.push(`  [${String(i+1).padStart(3)}] ${e.icon} (${e.type.padEnd(10)}) ${e.text}`);
    }
    lines.push('');
  }

  // Rewards
  lines.push('── REWARDS ───────────────────────────────');
  if (result.success) {
    lines.push(`  Gold: +${result.goldEarned}g`);
    lines.push(`  Exp: +${result.expEarned} per member`);
    if (result.rankPoints) lines.push(`  Rank Points: +${result.rankPoints}`);
    if (result.loot?.length > 0) {
      lines.push('  Loot:');
      for (const d of result.loot) {
        const item = getItem(d.itemId);
        if (item) {
          const rarity = getItemRarity(item);
          const qty = d.quantity > 1 ? ` ×${d.quantity}` : '';
          const classReq = item.classReq ? ` (${item.classReq.map(c => CLASSES[c]?.label || c).join('/')})` : '';
          lines.push(`    - ${item.name}${qty} [${rarity?.label || '?'}]${classReq}`);
        }
      }
    }
  } else {
    lines.push(`  Exp (reduced): +${result.expEarned}`);
    lines.push('  Gold / Rank Points: None');
  }

  // Level ups (consolidated per character)
  if (levelUps?.length > 0) {
    lines.push('');
    lines.push('── LEVEL UPS ─────────────────────────────');
    const byName = {};
    for (const lu of levelUps) {
      if (!byName[lu.name]) byName[lu.name] = [];
      byName[lu.name].push(lu.level);
    }
    for (const [name, levels] of Object.entries(byName)) {
      const from = Math.min(...levels) - 1;
      const to = Math.max(...levels);
      lines.push(`  ⭐ ${name} ${from} → ${to}`);
    }
  }

  // Secret boss
  if (result.secretBoss) {
    lines.push('');
    lines.push('── SECRET BOSS ───────────────────────────');
    lines.push(`  ${result.secretBoss.boss.icon} ${result.secretBoss.boss.name}: ${result.secretBoss.success ? 'DEFEATED' : 'ESCAPED'}`);
    if (result.secretBoss.success) {
      if (result.secretBoss.goldBonus) lines.push(`  Bonus Gold: +${result.secretBoss.goldBonus}g`);
      if (result.secretBoss.expBonus) lines.push(`  Bonus Exp: +${result.secretBoss.expBonus}`);
    }
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════');
  lines.push(`Exported at: ${new Date().toLocaleString()}`);
  lines.push(`Guild Rank: ${s.guild.rank}  |  Gold: ${s.gold}g`);
  lines.push('═══════════════════════════════════════════');

  return lines.join('\n');
}

export function showResultsModal() {
  const pr = Game.state.pendingResults;
  if (!pr) return;

  // Tower run recap uses a specialized layout
  if (pr.quest.towerRun) {
    showTowerResultsModal(pr);
    return;
  }

  const { quest, result, levelUps, rankUp, synergyUnlocks, skillGains, combatStats } = pr;
  const s = Game.state;

  let rewardsHtml = '';
  if (result.success) {
    const lootItems = result.loot.map(d => `<div class="result-loot-entry">${formatLootEntry(d)}</div>`).join('');
    rewardsHtml = `
      <div class="result-section">
        <div class="result-section-title">Rewards</div>
        <div class="result-row"><span class="result-row-label">Gold earned</span><span class="result-row-value result-gold">+${result.goldEarned}g</span></div>
        <div class="result-row"><span class="result-row-label">Exp per member</span><span class="result-row-value result-exp">+${result.expEarned}</span></div>
        ${result.rankPoints ? `<div class="result-row"><span class="result-row-label">Rank points</span><span class="result-row-value result-rank">+${result.rankPoints}</span></div>` : ''}
        ${result.loot.length > 0 ? `<div class="result-loot-section"><div class="result-row-label">Loot</div>${lootItems}</div>` : ''}
      </div>
    `;
  } else {
    rewardsHtml = `
      <div class="result-section">
        <div class="result-section-title">Consolation</div>
        ${result.expEarned > 0 ? `<div class="result-row"><span class="result-row-label">Exp (reduced)</span><span class="result-row-value result-exp">+${result.expEarned}</span></div>` : ''}
        <div class="result-row"><span class="result-row-label">Gold / Rank Points</span><span class="result-row-value" style="color:var(--red)">None</span></div>
      </div>
    `;
  }

  // Consolidate level-ups: one row per character showing startLevel → endLevel
  let levelUpHtml = '';
  if (levelUps.length > 0) {
    const byName = {};
    for (const lu of levelUps) {
      if (!byName[lu.name]) byName[lu.name] = { name: lu.name, levels: [] };
      byName[lu.name].levels.push(lu.level);
    }
    const entries = Object.values(byName).map(entry => {
      const startLvl = Math.min(...entry.levels) - 1;
      const endLvl = Math.max(...entry.levels);
      return `<div class="result-levelup-entry"><span class="levelup-name">⭐ ${esc(entry.name)}</span><span class="levelup-levels">${startLvl} → ${endLvl}</span></div>`;
    }).join('');
    levelUpHtml = `
      <div class="result-levelup-section">
        <div class="levelup-title">Level Up!</div>
        ${entries}
      </div>
    `;
  }

  const skillGainHtml = skillGains && skillGains.length > 0 ? skillGains.map(sg => {
    const verb = sg.type === 'mastery' ? 'gained mastery' : 'learned skill';
    return `<div class="result-skill-gain">${sg.skillIcon} ${esc(sg.memberName)} ${verb}: <strong>${esc(sg.skillName)}</strong>!</div>`;
  }).join('') : '';

  const synergyHtml = synergyUnlocks && synergyUnlocks.length > 0 ? `
    <div class="result-synergy-unlocks">
      <div class="synergy-unlock-title">🔗 Party Synergy</div>
      ${synergyUnlocks.map(su =>
        `<div class="synergy-unlock-entry"><span class="synergy-unlock-label">${su.label}</span><span class="synergy-unlock-desc">${su.desc}</span></div>`
      ).join('')}
    </div>
  ` : '';

  // ── Battle Highlights — extracted from combat events ──
  const highlightsHtml = (() => {
    const events = pr.combatEvents || [];
    if (events.length === 0) return '';

    // Parse damage numbers from event text (matches <span class="dmg-num ...">123</span> or plain numbers)
    function extractDmg(text) {
      // Try HTML span first
      const m = text.match(/class="dmg-num[^"]*">\s*(\d[\d,]*)/);
      if (m) return parseInt(m[1].replace(/,/g, ''), 10);
      // Fallback: last number in text after a dash or "for"
      const nums = text.match(/(?:—|for)\s*(\d[\d,]*)/g);
      if (nums) {
        const last = nums[nums.length - 1].match(/(\d[\d,]*)/);
        if (last) return parseInt(last[1].replace(/,/g, ''), 10);
      }
      return 0;
    }

    // Extract name from start of event text (before "attacks", "activates", etc.)
    function extractName(text) {
      // Strip HTML tags, decode common entities, remove stray angle brackets
      const clean = text.replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/[<>]/g, '');
      const m = clean.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/);
      return m ? m[1] : null;
    }

    let biggestHit = { name: null, dmg: 0, type: '', text: '' };
    let biggestHeal = { name: null, amt: 0, text: '' };
    let biggestBlock = { name: null, dmg: 0, text: '' };
    const kills = {};   // memberName → count
    const dodges = {};   // memberName → count
    const crits = {};    // memberName → count
    let totalDodges = 0;
    let totalCrits = 0;

    for (const e of events) {
      const dmg = extractDmg(e.text);
      const name = extractName(e.text);

      // Biggest single hit (party attacks/skills/crits)
      if (['attack', 'magic', 'crit', 'skill', 'celestial', 'equip'].includes(e.type) && dmg > biggestHit.dmg) {
        biggestHit = { name, dmg, type: e.type, text: e.text };
      }

      // Biggest heal
      if (e.type === 'heal' && dmg > biggestHeal.amt) {
        biggestHeal = { name, amt: dmg, text: e.text };
      }

      // Biggest block (Bulwark intercept)
      if (e.type === 'cover' && dmg > biggestBlock.dmg) {
        biggestBlock = { name, dmg, text: e.text };
      }

      // Kill tracking
      if (e.type === 'defeat' && name) {
        // "X delivers the final blow" or "X defeats Y"
        const clean = e.text.replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[<>]/g, '');
        const killer = clean.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(?:delivers|defeats|strikes)/);
        if (killer) kills[killer[1]] = (kills[killer[1]] || 0) + 1;
      }

      // Dodge tracking
      if (e.type === 'dodge') {
        totalDodges++;
        if (name) dodges[name] = (dodges[name] || 0) + 1;
      }

      // Crit tracking
      if (e.type === 'crit') {
        totalCrits++;
        if (name) crits[name] = (crits[name] || 0) + 1;
      }
    }

    const highlights = [];

    if (biggestHit.dmg > 0) {
      const critTag = biggestHit.type === 'crit' ? ' CRIT' : '';
      highlights.push(`<div class="highlight-row"><span class="highlight-icon">💥</span><span class="highlight-label">Biggest Hit</span><span class="highlight-value">${esc(biggestHit.name)} — <strong>${biggestHit.dmg}${critTag}</strong></span></div>`);
    }

    if (biggestHeal.amt > 0) {
      highlights.push(`<div class="highlight-row"><span class="highlight-icon">💚</span><span class="highlight-label">Biggest Heal</span><span class="highlight-value">${esc(biggestHeal.name)} — <strong>+${biggestHeal.amt} HP</strong></span></div>`);
    }

    if (biggestBlock.dmg > 0) {
      highlights.push(`<div class="highlight-row"><span class="highlight-icon">🛡</span><span class="highlight-label">Biggest Block</span><span class="highlight-value">${esc(biggestBlock.name)} — <strong>${biggestBlock.dmg} absorbed</strong></span></div>`);
    }

    // Top killer
    const topKiller = Object.entries(kills).sort((a, b) => b[1] - a[1])[0];
    if (topKiller && topKiller[1] > 0) {
      highlights.push(`<div class="highlight-row"><span class="highlight-icon">☠</span><span class="highlight-label">Most Kills</span><span class="highlight-value">${esc(topKiller[0])} — <strong>${topKiller[1]} kills</strong></span></div>`);
    }

    // Top critter
    if (totalCrits > 0) {
      const topCrit = Object.entries(crits).sort((a, b) => b[1] - a[1])[0];
      if (topCrit) {
        highlights.push(`<div class="highlight-row"><span class="highlight-icon">⚡</span><span class="highlight-label">Crit Machine</span><span class="highlight-value">${esc(topCrit[0])} — <strong>${topCrit[1]} crits</strong></span></div>`);
      }
    }

    // Dodges
    if (totalDodges > 0) {
      const topDodge = Object.entries(dodges).sort((a, b) => b[1] - a[1])[0];
      if (topDodge) {
        highlights.push(`<div class="highlight-row"><span class="highlight-icon">💨</span><span class="highlight-label">Untouchable</span><span class="highlight-value">${esc(topDodge[0])} — <strong>${topDodge[1]} dodge${topDodge[1] > 1 ? 's' : ''}</strong></span></div>`);
      }
    }

    if (highlights.length === 0) return '';

    return `<div class="result-section">
      <div class="result-section-title">Battle Highlights</div>
      ${highlights.join('')}
    </div>`;
  })();

  // Combat stats section
  const combatStatsHtml = combatStats && combatStats.length > 0 ? (() => {
    const maxDmg = Math.max(1, ...combatStats.map(c => c.dmgDealt));
    const rows = combatStats.map(c => {
      const cls = CLASSES[c.class];
      const sigil = cls ? cls.sigil : '?';
      const dmgPct = Math.round((c.dmgDealt / maxDmg) * 100);
      return `<div class="cs-row">
        <div class="cs-name">${sigil} ${esc(c.name.split(' ')[0])}</div>
        <div class="cs-bar-wrap">
          <div class="cs-bar" style="width:${dmgPct}%"></div>
          <span class="cs-dmg-val">${c.dmgDealt}</span>
        </div>
      </div>`;
    }).join('');
    return `<div class="result-section">
      <div class="result-section-title">Damage Dealt</div>
      <div class="cs-header"><span>Member</span><span>Damage</span></div>
      ${rows}
    </div>`;
  })() : '';

  // Defense & Support table (mitigation, absorption, reflect, dodge)
  const defStatsHtml = combatStats && combatStats.length > 0 ? (() => {
    const defTotal = c => (c.dmgMitigated||0) + (c.dmgAbsorbed||0) + (c.dmgReflected||0) + (c.dmgDodged||0);
    const hasAny = combatStats.some(c => defTotal(c) > 0);
    if (!hasAny) return '';
    const sorted = [...combatStats].filter(c => defTotal(c) > 0).sort((a, b) => defTotal(b) - defTotal(a));
    const maxMit = Math.max(...sorted.map(c => c.dmgMitigated || 0));
    const maxAbs = Math.max(...sorted.map(c => c.dmgAbsorbed || 0));
    const maxRef = Math.max(...sorted.map(c => c.dmgReflected || 0));
    const maxDodge = Math.max(...sorted.map(c => c.dmgDodged || 0));
    const tableRows = sorted.map(c => {
      const cls = CLASSES[c.class];
      const sigil = cls ? cls.sigil : '?';
      const total = defTotal(c);
      const hi = (val, max) => val > 0 && val === max ? ' class="ds-best"' : '';
      const cell = (val, max) => `<td${hi(val, max)}>${val > 0 ? val.toLocaleString() : '—'}</td>`;
      return `<tr>
        <td class="ds-name">${sigil} ${esc(c.name.split(' ')[0])}</td>
        ${cell(c.dmgMitigated||0, maxMit)}
        ${cell(c.dmgAbsorbed||0, maxAbs)}
        ${cell(c.dmgReflected||0, maxRef)}
        ${cell(c.dmgDodged||0, maxDodge)}
        <td class="ds-total">${total.toLocaleString()}</td>
      </tr>`;
    }).join('');
    return `<div class="result-section">
      <div class="result-section-title">Defense & Support</div>
      <table class="ds-table">
        <thead><tr>
          <th>Member</th><th>🛡 Mitigated</th><th>🏰 Absorbed</th><th>💜 Reflected</th><th>💨 Dodged</th><th>Total</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>`;
  })() : '';

  // Healing & Damage Taken table
  const healStatsHtml = combatStats && combatStats.length > 0 ? (() => {
    const hasAny = combatStats.some(c => (c.healingDone||0) > 0 || (c.healingReceived||0) > 0 || (c.dmgTaken||0) > 0);
    if (!hasAny) return '';
    const sorted = [...combatStats]
      .filter(c => (c.healingDone||0) > 0 || (c.healingReceived||0) > 0 || (c.dmgTaken||0) > 0)
      .sort((a, b) => ((b.healingDone||0) + (b.healingReceived||0)) - ((a.healingDone||0) + (a.healingReceived||0)));
    const maxHealD = Math.max(...sorted.map(c => c.healingDone || 0));
    const maxHealR = Math.max(...sorted.map(c => c.healingReceived || 0));
    const maxTaken = Math.max(...sorted.map(c => c.dmgTaken || 0));
    const tableRows = sorted.map(c => {
      const cls = CLASSES[c.class];
      const sigil = cls ? cls.sigil : '?';
      const hi = (val, max) => val > 0 && val === max ? ' class="ds-best"' : '';
      const cell = (val, max) => `<td${hi(val, max)}>${val > 0 ? val.toLocaleString() : '—'}</td>`;
      return `<tr>
        <td class="ds-name">${sigil} ${esc(c.name.split(' ')[0])}</td>
        ${cell(c.healingDone||0, maxHealD)}
        ${cell(c.healingReceived||0, maxHealR)}
        <td class="ds-taken${(c.dmgTaken||0) > 0 && (c.dmgTaken||0) === maxTaken ? ' ds-best' : ''}">${(c.dmgTaken||0) > 0 ? (c.dmgTaken||0).toLocaleString() : '—'}</td>
      </tr>`;
    }).join('');
    return `<div class="result-section">
      <div class="result-section-title">Healing & Damage Taken</div>
      <table class="ds-table">
        <thead><tr>
          <th>Member</th><th>⚕ Healed</th><th>💚 Received</th><th>💔 Taken</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>`;
  })() : '';

  // Secret boss section
  const secretBossHtml = result.secretBoss ? `
    <div class="result-section">
      <div class="result-section-title" style="color:var(--gold)">Secret Boss Encounter!</div>
      <div class="result-row">
        <span class="result-row-label">${result.secretBoss.boss.icon} ${result.secretBoss.boss.name}</span>
        <span class="result-row-value" style="color:${result.secretBoss.success ? 'var(--green)' : 'var(--red)'}">
          ${result.secretBoss.success ? 'Defeated!' : 'Escaped!'}
        </span>
      </div>
      ${result.secretBoss.success && result.secretBoss.goldBonus > 0 ? `<div class="result-row"><span class="result-row-label">Bonus Gold</span><span class="result-row-value result-gold">+${result.secretBoss.goldBonus}g</span></div>` : ''}
      ${result.secretBoss.success && result.secretBoss.expBonus > 0 ? `<div class="result-row"><span class="result-row-label">Bonus Exp</span><span class="result-row-value result-exp">+${result.secretBoss.expBonus}</span></div>` : ''}
      ${result.secretBoss.success && result.secretBoss.classReward ? `<div class="result-row"><span class="result-row-label">${result.secretBoss.recipientName}</span><span class="result-row-value" style="color:var(--gold)">Gained ${result.secretBoss.classReward.name}!</span></div>` : ''}
    </div>
  ` : '';

  const rankUpHtml = rankUp ? `
    <div class="result-rank-up">
      <div class="rank-up-stars">★ ★ ★</div>
      <div class="rank-up-title">Guild Rank Up!</div>
      <div class="rank-up-badges">
        <span class="rank-badge rank-${rankCss(rankUp.from)}" style="font-size:1.1rem;padding:6px 16px">${rankUp.from}</span>
        <span class="rank-up-arrow">→</span>
        <span class="rank-badge rank-${rankCss(rankUp.to)}" style="font-size:1.1rem;padding:6px 16px">${rankUp.to}</span>
      </div>
      <div class="rank-up-subtitle">New quests, equipment, and classes may now be available!</div>
    </div>
  ` : '';

  const powerPct = Math.round(result.ratio * 100);
  const powerColor = result.ratio >= 1.2 ? 'var(--green)' : result.ratio >= 0.8 ? 'var(--orange)' : 'var(--red)';

  document.getElementById('results-content').innerHTML = `
    ${rankUpHtml}
    <div class="result-outcome ${result.success ? 'success' : 'failure'}">${result.success ? '✓ Quest Complete' : '✗ Quest Failed'}</div>
    <div class="result-quest-name">${quest.title} <span class="rank-badge rank-${rankCss(quest.rank)}" style="font-size:0.7rem">${quest.rank}</span></div>
    <div class="result-narrative">"${result.narrative}"</div>
    <div style="font-size:0.78rem;color:var(--text-dim);text-align:center">
      Party Power: <strong style="color:${powerColor}">${result.partyPower}</strong> vs Quest: ${result.questPower} (${powerPct}%)
    </div>
    ${secretBossHtml}
    ${highlightsHtml}
    ${combatStatsHtml}
    ${defStatsHtml}
    ${healStatsHtml}
    ${rewardsHtml}
    ${levelUpHtml}
    ${skillGainHtml}
    ${synergyHtml}
    <div class="result-copy-log">
      <button id="btn-copy-fight-log" class="btn-copy-fight-log" title="Copy full fight log to clipboard for debugging">📋 Copy Fight Log</button>
    </div>
  `;

  document.getElementById('modal-results').classList.remove('hidden');

  // Wire up the copy button
  const copyBtn = document.getElementById('btn-copy-fight-log');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const logText = formatFightLog();
      navigator.clipboard.writeText(logText).then(() => {
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy Fight Log';
          copyBtn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback: select a temporary textarea
        const ta = document.createElement('textarea');
        ta.value = logText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        copyBtn.textContent = '✓ Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy Fight Log';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // Trigger rank-up flash overlay
  if (rankUp) {
    const flash = document.createElement('div');
    flash.className = 'rank-up-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1500);
    // Celebratory effects for rank-up
    setTimeout(() => confettiBurst(), 200);
    setTimeout(() => screenFlash('rgba(240,192,96,0.25)', 800), 100);
  }

  // Floating reward numbers
  if (result.success) {
    setTimeout(() => floatText(`+${result.goldEarned}g`, '#f0c060'), 300);
    setTimeout(() => floatText(`+${result.expEarned} XP`, '#4ecdc4'), 500);
    // Particle burst for celestial/legendary loot
    if (result.loot && result.loot.length > 0) {
      const hasCelestial = result.loot.some(d => { const it = getItem(d.itemId); return it && it.rarity === 'celestial'; });
      const hasLegendary = result.loot.some(d => { const it = getItem(d.itemId); return it && it.rarity === 'legendary'; });
      if (hasCelestial) {
        setTimeout(() => {
          screenFlash('rgba(0,229,200,0.2)', 600);
          confettiBurst();
        }, 600);
      } else if (hasLegendary) {
        setTimeout(() => {
          const lootSection = document.querySelector('.result-loot-section');
          if (lootSection) {
            const rect = lootSection.getBoundingClientRect();
            particleBurst(rect.left + rect.width / 2, rect.top, {
              count: 10, colors: ['#e74c3c', '#ff6b6b', '#f0c060'], spread: 60, duration: 700
            });
          }
        }, 600);
      }
    }
  }

  // Level-up particles
  if (levelUps.length > 0) {
    setTimeout(() => {
      const section = document.querySelector('.result-levelup-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        particleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
          count: 14, colors: ['#f0c060', '#ffe066', '#ffcc33'], spread: 50, duration: 800
        });
      }
    }, 400);
  }
}

// ── Tower Run Recap Modal ─────────────────────────────────────────────
function showTowerResultsModal(pr) {
  const { quest, result, levelUps, rankUp, synergyUnlocks, skillGains } = pr;
  const floorsCleared = result.towerFloor || quest.towerFloor || 0;
  const bestFloor = result.bestFloor || 0;
  const isNewRecord = floorsCleared >= bestFloor && floorsCleared > 0;
  const voluntary = result.success;

  const outcomeLabel = voluntary ? 'Tower Run Complete' : 'Party Defeated';
  const outcomeClass = voluntary ? 'success' : 'failure';

  // Loot items
  const lootItems = (result.loot || []).map(d => `<div class="result-loot-entry">${formatLootEntry(d)}</div>`).join('');

  // Rewards section
  const rewardsHtml = `
    <div class="result-section">
      <div class="result-section-title">Tower Rewards</div>
      <div class="result-row"><span class="result-row-label">Gold earned</span><span class="result-row-value result-gold">+${result.goldEarned.toLocaleString()}g</span></div>
      <div class="result-row"><span class="result-row-label">Exp per member</span><span class="result-row-value result-exp">+${result.expEarned.toLocaleString()}</span></div>
      ${result.rankPoints ? `<div class="result-row"><span class="result-row-label">Rank points</span><span class="result-row-value result-rank">+${result.rankPoints.toLocaleString()}</span></div>` : ''}
      ${result.loot && result.loot.length > 0 ? `<div class="result-loot-section"><div class="result-row-label">Loot</div>${lootItems}</div>` : ''}
    </div>
  `;

  // Level ups
  let levelUpHtml = '';
  if (levelUps && levelUps.length > 0) {
    const byName = {};
    for (const lu of levelUps) {
      if (!byName[lu.name]) byName[lu.name] = { name: lu.name, levels: [] };
      byName[lu.name].levels.push(lu.level);
    }
    const entries = Object.values(byName).map(entry => {
      const startLvl = Math.min(...entry.levels) - 1;
      const endLvl = Math.max(...entry.levels);
      return `<div class="result-levelup-entry"><span class="levelup-name">⭐ ${esc(entry.name)}</span><span class="levelup-levels">${startLvl} → ${endLvl}</span></div>`;
    }).join('');
    levelUpHtml = `<div class="result-levelup-section"><div class="levelup-title">Level Up!</div>${entries}</div>`;
  }

  const skillGainHtml = skillGains && skillGains.length > 0 ? skillGains.map(sg => {
    const verb = sg.type === 'mastery' ? 'gained mastery' : 'learned skill';
    return `<div class="result-skill-gain">${sg.skillIcon} ${esc(sg.memberName)} ${verb}: <strong>${esc(sg.skillName)}</strong>!</div>`;
  }).join('') : '';

  const rankUpHtml = rankUp ? `
    <div class="result-rank-up">
      <div class="rank-up-stars">★ ★ ★</div>
      <div class="rank-up-title">Guild Rank Up!</div>
      <div class="rank-up-badges">
        <span class="rank-badge rank-${rankCss(rankUp.from)}" style="font-size:1.1rem;padding:6px 16px">${rankUp.from}</span>
        <span class="rank-up-arrow">→</span>
        <span class="rank-badge rank-${rankCss(rankUp.to)}" style="font-size:1.1rem;padding:6px 16px">${rankUp.to}</span>
      </div>
      <div class="rank-up-subtitle">New quests, equipment, and classes may now be available!</div>
    </div>
  ` : '';

  document.getElementById('results-content').innerHTML = `
    ${rankUpHtml}
    <div class="tower-recap-header">
      <div class="tower-icon-large">🗼</div>
      <div class="tower-recap-title">The Endless Tower</div>
    </div>
    <div class="result-outcome ${outcomeClass}">${voluntary ? '✓' : '✗'} ${outcomeLabel}</div>
    <div class="result-narrative">"${result.narrative}"</div>
    <div class="tower-recap-floor-label">Floors Cleared</div>
    <div class="tower-recap-floor">${floorsCleared}</div>
    ${isNewRecord ? '<div class="tower-recap-record">New Personal Record!</div>' : `<div class="tower-recap-floor-label">Best: ${bestFloor}</div>`}
    ${rewardsHtml}
    ${levelUpHtml}
    ${skillGainHtml}
  `;

  document.getElementById('modal-results').classList.remove('hidden');

  if (rankUp) {
    const flash = document.createElement('div');
    flash.className = 'rank-up-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1500);
  }
}
