import Game from '../game.js';
import { getItem } from '../data.js';
import { getSkill } from '../skills.js';

function formatLootEntry(d) {
  const item = getItem(d.itemId);
  const name = item ? item.name : d.itemId;
  return d.quantity > 1 ? name + ' \u00d7' + d.quantity : name;
}

export function showResultsModal() {
  const pr = Game.state.pendingResults;
  if (!pr) return;
  const { quest, result, levelUps, rankUp } = pr;
  const s = Game.state;

  let rewardsHtml = '';
  if (result.success) {
    const lootStr = result.loot.map(formatLootEntry).join(', ');
    rewardsHtml = `
      <div class="result-section">
        <div class="result-section-title">Rewards</div>
        <div class="result-row"><span class="result-row-label">Gold earned</span><span class="result-row-value result-gold">+${result.goldEarned}g</span></div>
        <div class="result-row"><span class="result-row-label">Exp per member</span><span class="result-row-value result-exp">+${result.expEarned}</span></div>
        ${result.rankPoints ? `<div class="result-row"><span class="result-row-label">Rank points</span><span class="result-row-value result-rank">+${result.rankPoints}</span></div>` : ''}
        ${result.loot.length > 0 ? `<div class="result-row"><span class="result-row-label">Loot</span><span class="result-row-value result-loot">${lootStr}</span></div>` : ''}
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

  const injuriesHtml = result.injuries.length > 0 ? `
    <div class="result-section">
      <div class="result-section-title">Injuries</div>
      ${result.injuries.map(inj => {
        const m = Game.getMember(inj.memberId);
        return `<div class="result-row"><span class="result-row-label">${m ? m.name : inj.memberId}</span><span class="result-row-value result-injury">−${inj.hpLost} HP</span></div>`;
      }).join('')}
    </div>
  ` : '';

  const levelUpHtml = levelUps.length > 0 ? levelUps.map(lu =>
    `<div class="result-levelup">⭐ ${lu.name} reached Level ${lu.level}!</div>`
  ).join('') : '';

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
    ${rewardsHtml}
    ${injuriesHtml}
    ${levelUpHtml}
  `;

  document.getElementById('modal-results').classList.remove('hidden');

  // Trigger rank-up flash overlay
  if (rankUp) {
    const flash = document.createElement('div');
    flash.className = 'rank-up-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1500);
  }
}
