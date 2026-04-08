import Game from '../game.js';
import { getQuest, getClass, RANK_ORDER } from '../data.js';
import { rankTag, timeAgo, hpClass } from './helpers.js';
import { esc } from '../util.js';
import { getQuestPhase } from './combatlog.js';

let _rendered = false;

export function renderHall() {
  const el = document.getElementById('tab-hall');
  if (!_rendered || !el.querySelector('.hall-grid')) {
    _fullRenderHall(el);
    _rendered = true;
  } else {
    _updateHall(el);
  }
}

export function markHallDirty() {
  _rendered = false;
}

// ── Full render (first time or after structural change) ───────────────────

function _fullRenderHall(el) {
  const s = Game.state;
  const activeMembers = Game.getActiveMembers();
  const allParty = [s.player, ...activeMembers];

  el.innerHTML = `
    <div class="hall-grid">
      ${renderActiveQuestCard(s)}
      ${renderPartyOverviewCard(s, allParty)}
      ${renderGuildProgressCard(s)}
      ${renderEventLogCard(s)}
    </div>
  `;
}

// ── Lightweight update (called every tick — no innerHTML replacement) ──────

function _updateHall(el) {
  const s = Game.state;

  // Update quest timer + progress (if active quest exists)
  const timerEl = el.querySelector('#quest-timer');
  const fillEl = el.querySelector('#quest-progress-fill');
  if (s.guild.activeQuest) {
    const aq = s.guild.activeQuest;
    const revealed = Game.questEventsRevealed();
    const total = aq.eventCount || 1;
    if (timerEl) timerEl.textContent = `${Math.min(revealed, total)} / ${total}`;
    if (fillEl) fillEl.style.width = (Game.questProgress() * 100).toFixed(1) + '%';
  }

  // Update party HP bars
  const activeMembers = Game.getActiveMembers();
  const allParty = [s.player, ...activeMembers];
  const rows = el.querySelectorAll('.party-member-row');
  rows.forEach((row, i) => {
    const m = allParty[i];
    if (!m) return;
    const hallAuras = Game.getPartyAuras();
    const eff = Game.effectiveStats(m, hallAuras);
    const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
    const fill = row.querySelector('.progress-fill');
    if (fill) {
      fill.style.width = hpPct + '%';
      fill.className = 'progress-fill ' + hpClass(eff.hp, eff.maxHp);
    }
    const hpText = row.querySelector('.member-hp-text');
    if (hpText) hpText.textContent = `${eff.hp}/${eff.maxHp}`;
  });

  // Update event log timestamps
  el.querySelectorAll('.event-time').forEach((span, i) => {
    const ev = s.guild.eventLog[i];
    if (ev) span.textContent = timeAgo(ev.time);
  });
}

// ── Card builders (used by full render) ───────────────────────────────────

function renderActiveQuestCard(s) {
  const aq = s.guild.activeQuest;
  let content;
  if (aq) {
    const quest = aq.questData || Game.getGeneratedQuest(aq.questId) || getQuest(aq.questId);
    if (!quest) { return `<div class="card hall-wide"><div class="card-title">Active Quest</div><div class="active-quest-empty">Quest data not found.</div></div>`; }
    const progress = Game.questProgress();
    const pct = progress * 100;
    const revealed = Game.questEventsRevealed();
    const total = aq.eventCount || 1;
    const phase = getQuestPhase(progress);
    const env = quest.environment || { name: '???', icon: '?', mood: 'dungeon' };
    content = `
      <div class="hall-quest-top">
        <div class="active-quest-name">
          ${rankTag(quest.rank)}
          ${quest.title}
        </div>
        <span class="hall-quest-phase">${phase.icon} ${phase.label}</span>
      </div>
      <div class="active-quest-meta">
        <span>${env.icon} ${env.name}</span> ·
        <span>Party: ${aq.partySnapshot.length} members</span>
      </div>
      <div class="quest-timer" id="quest-timer">${Math.min(revealed, total)} / ${total}</div>
      <div class="progress-bar thick">
        <div class="progress-fill" id="quest-progress-fill" style="width:${pct.toFixed(1)}%; background: var(--cyan)"></div>
      </div>
    `;
  } else {
    content = `
      <div class="active-quest-empty">
        No active quest.<br>
        <span style="font-size:0.8rem">Visit the Quest Board to send your party out.</span>
      </div>
    `;
  }
  return `<div class="card hall-wide"><div class="card-title">Active Quest</div>${content}</div>`;
}

function renderPartyOverviewCard(s, members) {
  if (members.length === 0) {
    return `<div class="card"><div class="card-title">Party Overview</div><div class="empty-state">No party members assigned.</div></div>`;
  }
  const hallOverviewAuras = Game.getPartyAuras();
  const rows = members.map(m => {
    const eff = Game.effectiveStats(m, hallOverviewAuras);
    const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
    const cls = getClass(m.class);
    return `
      <div class="party-member-row">
        <div>
          <div class="member-name-cls">
            ${esc(m.name)}
            <span class="member-sigil">${cls.sigil}</span>
            <span class="member-level">Lv.${m.level}</span>
          </div>
          <div class="progress-bar" style="margin-top:4px">
            <div class="progress-fill ${hpClass(eff.hp, eff.maxHp)}" style="width:${hpPct}%"></div>
          </div>
        </div>
        <div class="member-hp-text">${eff.hp}/${eff.maxHp}</div>
      </div>
    `;
  }).join('');
  return `<div class="card"><div class="card-title">Party Overview</div><div class="party-overview">${rows}</div></div>`;
}

function renderGuildProgressCard(s) {
  const threshold = Game.RANK_THRESHOLDS[s.guild.rank];
  const pct = threshold ? Math.round((s.guild.rankPoints / threshold) * 100) : 100;
  const nextRank = RANK_ORDER[RANK_ORDER.indexOf(s.guild.rank) + 1] || null;
  const progressSection = threshold
    ? `<div class="rank-progress-label"><span>${s.guild.rankPoints} / ${threshold} pts</span><span>→ ${nextRank} Rank</span></div>
       <div class="progress-bar"><div class="progress-fill rank-bar" style="width:${pct}%"></div></div>`
    : `<div class="rank-progress-label"><span style="color:var(--rank-S)">Maximum rank achieved!</span></div>`;

  return `
    <div class="card">
      <div class="card-title">Guild Standing</div>
      <div class="rank-progress-section">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span class="rank-badge rank-${s.guild.rank}" style="font-size:1rem;padding:4px 14px">${s.guild.rank}</span>
          <span style="color:var(--text-dim);font-size:0.875rem">Quests completed: <strong style="color:var(--text)">${s.guild.completedQuests.length}</strong></span>
        </div>
        ${progressSection}
      </div>
    </div>
  `;
}

function renderEventLogCard(s) {
  const rows = s.guild.eventLog.length === 0
    ? `<div class="event-empty">Nothing yet. Send your party on a quest!</div>`
    : s.guild.eventLog.slice(0, 8).map(e => `
        <div class="event-row">
          <span class="event-time">${timeAgo(e.time)}</span>
          <span class="event-text">${e.text}</span>
        </div>`).join('');
  return `<div class="card"><div class="card-title">Recent Events</div><div class="event-log">${rows}</div></div>`;
}
