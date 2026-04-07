import Game from './game.js';
import { renderHall, markHallDirty } from './ui/hall.js';
import { renderQuests, resetQuestsState, tickUpdateQuests, getQuestRankFilter } from './ui/quests.js';
import { renderParty, resetPartyState, tickUpdateParty } from './ui/party.js';
import { renderShop } from './ui/shop.js';
import { showResultsModal } from './ui/results.js';
import { shouldRefreshBoard } from './questgen.js';

let currentTab = 'hall';
function currentQuestRankFilter() { return getQuestRankFilter(); }

// ── Boot / New Game ────────────────────────────────────────────────────────

export function initNewGameModal() {
  document.getElementById('input-name').addEventListener('input', (e) => {
    document.getElementById('btn-start-game').disabled = !e.target.value.trim();
  });

  document.getElementById('btn-start-game').addEventListener('click', () => {
    const name = document.getElementById('input-name').value.trim();
    if (!name) return;
    Game.newGame(name, 'HERO');
    document.getElementById('modal-new-game').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    setTab('hall');
    startGame();
  });
}

export function showNewGameModal() {
  document.getElementById('modal-new-game').classList.remove('hidden');
  document.getElementById('game').classList.add('hidden');
  document.getElementById('input-name').value = '';
  document.getElementById('btn-start-game').disabled = true;
}

// ── Tab System ─────────────────────────────────────────────────────────────

export function setTab(tab) {
  if (currentTab === tab) return;
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.toggle('active', el.id === `tab-${tab}`);
    el.classList.toggle('hidden', el.id !== `tab-${tab}`);
  });
  render();
}

// ── Full Rendering (only on user actions or structural changes) ───────────

export function render() {
  updateHeader();
  if (currentTab === 'hall')   renderHall();
  if (currentTab === 'quests') renderQuests(setTab);
  if (currentTab === 'party')  renderParty();
  if (currentTab === 'shop')   renderShop();

  if (Game.state.pendingResults) {
    showResultsModal();
  }
}

// ── Tick Update (called every second — lightweight, no innerHTML rebuild) ──

export function tickUpdate() {
  updateHeader();

  // The hall tab uses its own smart update (patches DOM, no flicker)
  if (currentTab === 'hall') renderHall();

  // Quest tab gets lightweight updates for combat log + timers
  if (currentTab === 'quests') {
    // Check if the quest board needs a full refresh (timer expired)
    const rank = currentQuestRankFilter();
    const lastRefreshed = Game.state.questBoard && Game.state.questBoard.lastRefreshed ? Game.state.questBoard.lastRefreshed[rank] : null;
    if (!Game.state.guild.activeQuest && shouldRefreshBoard(lastRefreshed)) {
      Game.refreshQuestBoard(rank);
      renderQuests(setTab);
    } else {
      tickUpdateQuests();
    }
  }

  // Party tab gets lightweight HP bar updates (no full re-render)
  if (currentTab === 'party') tickUpdateParty();

  // Check if a quest just finished (structural change → full render)
  if (Game.state.pendingResults) {
    markHallDirty();
    render();
  }
}

function updateHeader() {
  const s = Game.state;
  document.getElementById('header-gold').textContent = s.gold.toLocaleString();
  const rb = document.getElementById('header-rank');
  rb.textContent = `${s.guild.rank} Rank`;
  rb.className = `rank-badge rank-${s.guild.rank}`;
}

// ── Live timer update (called every 250ms) ─────────────────────────────────

export function updateQuestTimer() {
  if (!Game.state.guild.activeQuest) return;
  const aq = Game.state.guild.activeQuest;
  const revealed = Game.questEventsRevealed();
  const total = aq.eventCount || 1;
  const timerEl = document.getElementById('quest-timer');
  const fillEl  = document.getElementById('quest-progress-fill');
  if (timerEl) timerEl.textContent = `${Math.min(revealed, total)} / ${total}`;
  if (fillEl)  fillEl.style.width = (Game.questProgress() * 100).toFixed(1) + '%';
}

// ── Public ─────────────────────────────────────────────────────────────────

let _started = false;
export function startGame() {
  if (_started) return;
  _started = true;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab));
  });
  document.getElementById('btn-dismiss-results').addEventListener('click', () => {
    const autoRun = Game.state.autoRun;
    Game.state.pendingResults = null;
    document.getElementById('modal-results').classList.add('hidden');
    markHallDirty();

    // Handle auto-run: pick next quest by strategy and start it
    if (autoRun && autoRun.remaining > 0) {
      const nextQuest = Game.pickQuestByStrategy(autoRun.rank, autoRun.strategy);
      if (nextQuest) {
        const result = Game.startQuest(nextQuest.id);
        if (!result.ok) {
          Game.state.autoRun = null;
        } else {
          Game.state.autoRun.remaining--;
        }
      } else {
        Game.state.autoRun = null;
      }
    } else if (autoRun) {
      Game.state.autoRun = null;
    }

    render();
  });
  document.getElementById('btn-new-game-header').addEventListener('click', () => {
    if (!confirm('Start a new game? All progress will be lost.')) return;
    Game.stopTick();
    Game.deleteSave();
    _started = false;
    currentTab = 'hall';
    resetPartyState();
    resetQuestsState();
    markHallDirty();
    showNewGameModal();
  });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') Game.save();
  });
  render();
}
