import Game from '../game.js';
import { getItem, getItemRarity, CLASSES, EQUIPMENT } from '../data.js';
import { getSkill, SKILLS } from '../skills.js';

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
  for (const m of activeMembers) {
    const cls = CLASSES[m.class];
    const eff = Game.effectiveStats(m);
    lines.push(`${cls?.sigil || '?'} ${m.name} — ${cls?.label || m.class} Lv.${m.level}  (Power: ${Game.memberPower(m)})`);
    lines.push(`  HP: ${eff.maxHp}  ATK: ${eff.atk}  DEF: ${eff.def}  MAG: ${eff.mag}  SPD: ${eff.spd}`);

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

  // Level ups
  if (levelUps?.length > 0) {
    lines.push('');
    lines.push('── LEVEL UPS ─────────────────────────────');
    for (const lu of levelUps) {
      lines.push(`  ⭐ ${lu.name} → Level ${lu.level}`);
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

  const levelUpHtml = levelUps.length > 0 ? levelUps.map(lu =>
    `<div class="result-levelup">⭐ ${lu.name} reached Level ${lu.level}!</div>`
  ).join('') : '';

  const skillGainHtml = skillGains && skillGains.length > 0 ? skillGains.map(sg => {
    const verb = sg.type === 'mastery' ? 'gained mastery' : 'learned skill';
    return `<div class="result-skill-gain">${sg.skillIcon} ${sg.memberName} ${verb}: <strong>${sg.skillName}</strong>!</div>`;
  }).join('') : '';

  const synergyHtml = synergyUnlocks && synergyUnlocks.length > 0 ? `
    <div class="result-synergy-unlocks">
      <div class="synergy-unlock-title">🔗 Party Synergy</div>
      ${synergyUnlocks.map(su =>
        `<div class="synergy-unlock-entry"><span class="synergy-unlock-label">${su.label}</span><span class="synergy-unlock-desc">${su.desc}</span></div>`
      ).join('')}
    </div>
  ` : '';

  const skillActivationHtml = result.activatedSkills && result.activatedSkills.length > 0
    ? `<div class="result-section">
        <div class="result-section-title">Skills Activated</div>
        ${result.activatedSkills.map(act => {
          const skill = getSkill(act.skill.id);
          const narrative = skill && skill.narrative ? skill.narrative : 'used their skill!';
          return `<div class="result-skill-activation">${act.skill.icon || '•'} ${act.memberName} ${narrative}</div>`;
        }).join('')}
      </div>`
    : '';

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
        <div class="cs-name">${sigil} ${c.name.split(' ')[0]}</div>
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
    ${skillActivationHtml}
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
