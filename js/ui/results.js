import Game from '../game.js';
import { getItem, getItemRarity, CLASSES, EQUIPMENT } from '../data.js';
import { getSkill, SKILLS } from '../skills.js';
import { esc } from '../util.js';

function formatLootEntry(d) {
  const item = getItem(d.itemId);
  if (!item) return `<span>${d.itemId}</span>`;
  const rarity = getItemRarity(item);
  const classReqStr = item.classReq
    ? item.classReq.map(cid => CLASSES[cid]?.label || cid).join(', ')
    : 'Any class';
  const qty = d.quantity > 1 ? ` \u00d7${d.quantity}` : '';
  return `<span style="color:${rarity.color}">${item.name}</span>${qty} <span class="item-rarity-badge" style="color:${rarity.color};border-color:${rarity.color}30">${rarity.label}</span> <span class="result-loot-class-req">${classReqStr}</span>`;
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
    lines.push(`${cls?.sigil || '?'} ${m.name} — ${cls?.label || m.class} Lv.${m.level}  (Power: ${Game.memberPower(m)})`);
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
    lines.push('── COMBAT PERFORMANCE ────────────────────');
    const totalDmg = combatStats.reduce((s, c) => s + c.dmgDealt, 0);
    for (const c of combatStats) {
      const cls = CLASSES[c.class];
      const dmgPct = totalDmg > 0 ? Math.round((c.dmgDealt / totalDmg) * 100) : 0;
      lines.push(`${cls?.sigil || '?'} ${c.name} (${cls?.label || c.class})`);
      lines.push(`  Dmg Dealt: ${c.dmgDealt} (${dmgPct}% of total)  |  Dmg Taken: ${c.dmgTaken}`);
      lines.push(`  Healing Done: ${c.healingDone}  |  Healing Received: ${c.healingReceived}`);
    }
    lines.push(`  TOTAL DAMAGE: ${totalDmg}`);
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
      const healDone = c.healingDone > 0 ? `<span class="cs-heal" title="Healing done">⚕${c.healingDone}</span>` : '';
      const healRcvd = c.healingReceived > 0 ? `<span class="cs-heal-rcvd" title="Healing received">💚${c.healingReceived}</span>` : '';
      const taken = c.dmgTaken > 0 ? `<span class="cs-taken" title="Damage taken">💔${c.dmgTaken}</span>` : '';
      return `<div class="cs-row">
        <div class="cs-name">${sigil} ${esc(c.name.split(' ')[0])}</div>
        <div class="cs-bar-wrap">
          <div class="cs-bar" style="width:${dmgPct}%"></div>
          <span class="cs-dmg-val">${c.dmgDealt}</span>
        </div>
        <div class="cs-extras">${healDone}${healRcvd}${taken}</div>
      </div>`;
    }).join('');
    return `<div class="result-section">
      <div class="result-section-title">Combat Performance</div>
      <div class="cs-header"><span>Member</span><span>Damage Dealt</span><span>⚕ Done · 💚 Rcvd · 💔 Taken</span></div>
      ${rows}
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
        <span class="rank-badge rank-${rankUp.from}" style="font-size:1.1rem;padding:6px 16px">${rankUp.from}</span>
        <span class="rank-up-arrow">→</span>
        <span class="rank-badge rank-${rankUp.to}" style="font-size:1.1rem;padding:6px 16px">${rankUp.to}</span>
      </div>
      <div class="rank-up-subtitle">New quests, equipment, and classes may now be available!</div>
    </div>
  ` : '';

  const powerPct = Math.round(result.ratio * 100);
  const powerColor = result.ratio >= 1.2 ? 'var(--green)' : result.ratio >= 0.8 ? 'var(--orange)' : 'var(--red)';

  document.getElementById('results-content').innerHTML = `
    ${rankUpHtml}
    <div class="result-outcome ${result.success ? 'success' : 'failure'}">${result.success ? '✓ Quest Complete' : '✗ Quest Failed'}</div>
    <div class="result-quest-name">${quest.title} <span class="rank-badge rank-${quest.rank}" style="font-size:0.7rem">${quest.rank}</span></div>
    <div class="result-narrative">"${result.narrative}"</div>
    <div style="font-size:0.78rem;color:var(--text-dim);text-align:center">
      Party Power: <strong style="color:${powerColor}">${result.partyPower}</strong> vs Quest: ${result.questPower} (${powerPct}%)
    </div>
    ${secretBossHtml}
    ${highlightsHtml}
    ${combatStatsHtml}
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
  }
}
