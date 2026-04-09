// ── Tower Climb UI ─────────────────────────────────────────────────────
// Renders the Tower tab: status, floor progress, rest rooms, and records.

import Game from '../game.js';
import { getItem, getItemRarity, getClass } from '../data.js';
import { esc, rankCss } from '../util.js';
import { isRestFloor, isBossFloor, TOWER_CONFIG } from '../tower.js';

let _setTab = null; // reference to the setTab function from ui.js

export function initTower(setTab) {
  _setTab = setTab;
}

export function renderTower() {
  const container = document.getElementById('tab-tower');
  if (!container) return;

  const s = Game.state;
  if (!s) return;

  const unlocked = Game.isTowerUnlocked();
  const tower = Game.getTowerState();
  const active = tower.active;

  if (!unlocked) {
    container.innerHTML = `
      <div class="tower-locked">
        <div class="tower-icon">🗼</div>
        <h2>The Endless Tower</h2>
        <p class="tower-flavor">A structure that pierces the heavens. Only guilds of <span class="rank-badge rank-S" style="font-size:0.8rem;padding:2px 8px">S</span> rank and above may enter.</p>
        <p class="tower-requirement">Reach S Rank to unlock the Tower Climb.</p>
      </div>
    `;
    return;
  }

  if (active && active.atRest) {
    renderRestRoom(container, tower, active);
    return;
  }

  if (active && !active.atRest) {
    renderActiveClimb(container, tower, active, s);
    return;
  }

  renderTowerLobby(container, tower, s);
}

function renderTowerLobby(container, tower, s) {
  const bestFloor = tower.bestFloor || 0;
  const totalRuns = tower.totalRuns || 0;

  let bestPartyHtml = '';
  if (tower.bestParty && tower.bestParty.length > 0) {
    const members = tower.bestParty.map(m => {
      const cls = getClass(m.class);
      return `<span class="tower-party-member"><span class="tower-member-sigil">${cls.sigil}</span> ${esc(m.name)} Lv${m.level}</span>`;
    }).join('');
    bestPartyHtml = `
      <div class="tower-best-party">
        <div class="tower-stat-label">Best Party Composition</div>
        <div class="tower-party-list">${members}</div>
      </div>
    `;
  }

  const canEnter = Game.towerCanEnter();

  container.innerHTML = `
    <div class="tower-lobby">
      <div class="tower-header">
        <div class="tower-icon-large">🗼</div>
        <h2>The Endless Tower</h2>
        <p class="tower-flavor">An infinite spire of escalating danger. Climb as high as you dare. Every 10 floors, a rest room offers a chance to retreat with your spoils — or press onward for greater glory.</p>
      </div>

      <div class="tower-stats">
        <div class="tower-stat">
          <div class="tower-stat-value">${bestFloor}</div>
          <div class="tower-stat-label">Best Floor</div>
        </div>
        <div class="tower-stat">
          <div class="tower-stat-value">${totalRuns}</div>
          <div class="tower-stat-label">Total Runs</div>
        </div>
      </div>

      ${bestPartyHtml}

      <div class="tower-rewards-info">
        <h3>Tower Rewards</h3>
        <p>Loot is awarded when you exit the tower (by choice or defeat). The higher you climb, the better the rewards:</p>
        <ul class="tower-reward-list">
          <li><strong>Every floor:</strong> Gold and experience</li>
          <li><strong>Every 10 floors:</strong> Chance at Celestial equipment (increases per tier)</li>
          <li><strong>Floor milestones:</strong> Tower Gem Bags (rare collectible gems)</li>
          <li><strong>Boss floors (10, 20, 30, 50, 75, 100):</strong> Enhanced rewards</li>
        </ul>
      </div>

      <button class="btn btn-primary btn-lg tower-enter-btn" id="btn-tower-enter" ${!canEnter.ok ? 'disabled' : ''}>
        ${canEnter.ok ? 'Enter the Tower' : canEnter.reason}
      </button>
    </div>
  `;

  const enterBtn = document.getElementById('btn-tower-enter');
  if (enterBtn && canEnter.ok) {
    enterBtn.addEventListener('click', () => {
      const result = Game.towerEnter();
      if (result.ok) renderTower();
    });
  }
}

function renderActiveClimb(container, tower, active, s) {
  const floor = active.floor;
  const floorsCleared = active.floorsCleared;
  const hasActiveQuest = !!s.guild.activeQuest;

  // Show current floor info
  const nextRest = Math.ceil(floor / TOWER_CONFIG.REST_INTERVAL) * TOWER_CONFIG.REST_INTERVAL;
  const floorsToRest = nextRest - floor;

  container.innerHTML = `
    <div class="tower-active">
      <div class="tower-floor-display">
        <div class="tower-icon-small">🗼</div>
        <div class="tower-floor-number">Floor ${floor}</div>
        <div class="tower-floor-subtitle">${isBossFloor(floor) ? '⚠ BOSS FLOOR' : `${floorsToRest} floor${floorsToRest !== 1 ? 's' : ''} to next rest room`}</div>
      </div>

      <div class="tower-progress-bar">
        <div class="tower-progress-fill" style="width:${Math.min(100, (floorsCleared / Math.max(1, nextRest)) * 100)}%"></div>
        <span class="tower-progress-text">${floorsCleared} cleared → Rest at ${nextRest}</span>
      </div>

      <div class="tower-combat-status">
        ${hasActiveQuest ? '<p class="tower-fighting">Combat in progress... check the Quest Board for details.</p>' : '<p class="tower-waiting">Preparing next floor...</p>'}
      </div>

      ${hasActiveQuest ? '' : `<button class="btn btn-ghost tower-exit-btn" id="btn-tower-exit-early">Retreat from Tower</button>`}
    </div>
  `;

  // If there's a quest board button, wire it
  const viewQuestBtn = container.querySelector('.tower-fighting');
  if (viewQuestBtn && _setTab) {
    viewQuestBtn.style.cursor = 'pointer';
    viewQuestBtn.addEventListener('click', () => _setTab('quests'));
  }

  const exitBtn = document.getElementById('btn-tower-exit-early');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      Game.towerExit(true);
      renderTower();
    });
  }
}

function renderRestRoom(container, tower, active) {
  const floor = active.floorsCleared;

  // Calculate what they'd get if they leave now
  const previewRewards = calculatePreviewRewards(floor);

  container.innerHTML = `
    <div class="tower-rest">
      <div class="tower-rest-header">
        <div class="tower-icon-large">🏕</div>
        <h2>Rest Room — Floor ${floor}</h2>
        <p class="tower-flavor">A moment of calm in the endless ascent. Your party catches their breath. A warm fire crackles. The stairs continue upward into darkness.</p>
      </div>

      <div class="tower-rest-info">
        <p>Your party will be partially healed (50% of missing HP).</p>
        <p>Floors cleared: <strong>${floor}</strong> | Best: <strong>${tower.bestFloor || 0}</strong></p>
      </div>

      <div class="tower-reward-preview">
        <h3>Current Rewards (if you leave now)</h3>
        <div class="tower-preview-stats">
          <span>◈ ${previewRewards.gold.toLocaleString()}g</span>
          <span>⭐ ${previewRewards.exp.toLocaleString()} EXP</span>
          <span>🏅 ${previewRewards.rankPoints.toLocaleString()} RP</span>
        </div>
        <div class="tower-preview-note">+ Tower Gem Bags and Celestial equipment chances</div>
      </div>

      <div class="tower-rest-actions">
        <button class="btn btn-primary btn-lg" id="btn-tower-continue">
          Continue Climbing ⬆
        </button>
        <button class="btn btn-ghost btn-lg" id="btn-tower-leave">
          Return to Guild (Collect Rewards)
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-tower-continue').addEventListener('click', () => {
    Game.towerContinueFromRest();
    renderTower();
  });

  document.getElementById('btn-tower-leave').addEventListener('click', () => {
    Game.towerExit(true);
    renderTower();
  });
}

function calculatePreviewRewards(floorsCleared) {
  let totalGold = 0;
  let totalExp = 0;
  for (let f = 1; f <= floorsCleared; f++) {
    totalGold += TOWER_CONFIG.GOLD_PER_FLOOR.base + (f * TOWER_CONFIG.GOLD_PER_FLOOR.scale);
    totalExp += TOWER_CONFIG.EXP_PER_FLOOR.base + (f * TOWER_CONFIG.EXP_PER_FLOOR.scale);
  }
  const rankPoints = Math.floor(floorsCleared * 500 + Math.pow(floorsCleared, 1.5) * 100);
  return { gold: totalGold, exp: totalExp, rankPoints };
}

export function tickUpdateTower() {
  // Lightweight tick for tower UI updates (progress bar etc.)
  const tower = Game.getTowerState();
  if (!tower || !tower.active) return;

  // Re-render if state changed (floor advanced, rest room reached, etc.)
  const container = document.getElementById('tab-tower');
  if (!container) return;

  // Check if tower active state changed since last render
  const currentFloorEl = container.querySelector('.tower-floor-number');
  if (currentFloorEl) {
    const displayedFloor = currentFloorEl.textContent;
    const actualFloor = `Floor ${tower.active.floor}`;
    if (displayedFloor !== actualFloor || tower.active.atRest) {
      renderTower();
    }
  }
}
