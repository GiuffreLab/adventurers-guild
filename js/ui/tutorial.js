// ── Tutorial System ─────────────────────────────────────────────────────────
// Guides new players through: hero created → recruit first member → first quest
// Renders as a floating tooltip with a spotlight overlay on the target element.
// Tutorial state lives on Game.state.tutorial = { step, dismissed }

import Game from '../game.js';

// ── Step Definitions ─────────────────────────────────────────────────────────
// Each step: id, text, target (CSS selector to spotlight), tab (which tab to be on),
//            arrow (top|bottom|left|right — tooltip relative to target),
//            condition (fn → true when step is complete and we should advance)

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to the Guild!',
    text: 'Your hero has been registered. This is the <strong>Guild Hall</strong> — your home base. Let\'s get you started by recruiting your first party member.',
    target: null,
    tab: 'hall',
    arrow: null,
    // No condition — "Next" always enabled
  },
  {
    id: 'go-to-party',
    title: 'Open the Party Tab',
    text: 'Click the <strong>⚔ Party</strong> tab to manage your roster and recruit new members.',
    target: '.tab-btn[data-tab="party"]',
    tab: null,
    arrow: 'bottom',
    waitFor: () => document.querySelector('.tab-btn[data-tab="party"]')?.classList.contains('active'),
    doneText: 'Great! You\'re on the Party page.',
  },
  {
    id: 'click-recruit',
    title: 'Recruit a Party Member',
    text: 'Click <strong>+ Recruit</strong> to see the available classes. Your first recruit costs just 50g — you start with 200g.',
    target: '#btn-recruit',
    tab: 'party',
    arrow: 'bottom',
    waitFor: () => document.querySelector('.recruit-grid') !== null,
    doneText: 'The class list is open — pick one!',
  },
  {
    id: 'pick-class',
    title: 'Choose a Class',
    text: 'Pick any class that interests you. Each one plays differently — check their stats and descriptions. Click a class row to recruit them.',
    target: '.recruit-grid',
    tab: 'party',
    arrow: 'top',
    waitFor: () => Game.state.party.length >= 1,
    doneText: 'Welcome aboard! Your first recruit is in.',
  },
  {
    id: 'recruit-more',
    title: 'Build Your Party',
    text: 'Great hire! You can send a party of up to <strong>4 members</strong> on quests (your Hero + 3 recruits). Recruit a couple more, or head to the Quest Board whenever you\'re ready.',
    target: null,
    tab: 'party',
    arrow: null,
    // No condition — "Next" always enabled
  },
  {
    id: 'go-to-quests',
    title: 'Open the Quest Board',
    text: 'Click the <strong>📜 Quest Board</strong> tab to see available quests for your guild rank.',
    target: '.tab-btn[data-tab="quests"]',
    tab: null,
    arrow: 'bottom',
    waitFor: () => document.querySelector('.tab-btn[data-tab="quests"]')?.classList.contains('active'),
    doneText: 'You\'re on the Quest Board!',
  },
  {
    id: 'pick-quest',
    title: 'Choose a Quest',
    text: 'Each quest shows enemies, difficulty, rewards, and recommended power. Pick one and click <strong>⚔ Send Party</strong> to begin!',
    target: '.quest-list',
    tab: 'quests',
    arrow: 'top',
    waitFor: () => !!Game.state.guild.activeQuest,
    doneText: 'Your party is on their way!',
  },
  {
    id: 'watch-combat',
    title: 'Battle in Progress!',
    text: 'Watch the combat log — your party is fighting! Events play out in real time. When the quest finishes, you\'ll see a results screen with loot, XP, and gold earned.',
    target: null,
    tab: 'quests',
    arrow: null,
    // No condition — "Next" always enabled
  },
  {
    id: 'done',
    title: 'You\'re All Set!',
    text: 'That\'s the basics — quest, earn loot, equip gear, rank up, and recruit more members as you grow. Check the <strong>📖 Compendium</strong> anytime for detailed guides on every system. Good luck, Guild Master!',
    target: null,
    tab: null,
    arrow: null,
    // No condition — "Finish" always enabled
  },
];

// ── Module State ─────────────────────────────────────────────────────────────

let _overlayEl = null;
let _checkInterval = null;
let _conditionMet = false; // tracks whether current step's waitFor has been satisfied

// ── Public API ───────────────────────────────────────────────────────────────

export function initTutorial() {
  if (!Game.state) return;
  // Initialize tutorial state if missing
  if (!Game.state.tutorial) {
    Game.state.tutorial = { step: 0, dismissed: false };
  }
  // If tutorial was already completed or dismissed, bail
  if (Game.state.tutorial.dismissed || Game.state.tutorial.step >= STEPS.length) return;

  _startChecking();
  renderTutorial();
}

export function isTutorialActive() {
  if (!Game.state || !Game.state.tutorial) return false;
  return !Game.state.tutorial.dismissed && Game.state.tutorial.step < STEPS.length;
}

export function renderTutorial() {
  if (!isTutorialActive()) {
    _removeOverlay();
    return;
  }

  const step = STEPS[Game.state.tutorial.step];
  if (!step) return;

  // Remove previous target highlight
  document.querySelectorAll('.tutorial-target').forEach(el => el.classList.remove('tutorial-target'));

  _ensureOverlay();
  const targetEl = step.target ? document.querySelector(step.target) : null;

  // Build spotlight + elevate target element above backdrop
  if (targetEl) {
    targetEl.classList.add('tutorial-target');
    const rect = targetEl.getBoundingClientRect();
    const pad = 6;
    _overlayEl.querySelector('.tutorial-spotlight').style.cssText = `
      position: fixed;
      top: ${rect.top - pad}px;
      left: ${rect.left - pad}px;
      width: ${rect.width + pad * 2}px;
      height: ${rect.height + pad * 2}px;
      display: block;
    `;
  } else {
    _overlayEl.querySelector('.tutorial-spotlight').style.display = 'none';
  }

  // Position tooltip
  const tooltip = _overlayEl.querySelector('.tutorial-tooltip');
  const stepNum = Game.state.tutorial.step + 1;
  const totalSteps = STEPS.length;
  const isLast = Game.state.tutorial.step === STEPS.length - 1;
  const hasWait = !!step.waitFor;
  const condDone = !hasWait || _conditionMet;
  const nextLabel = isLast ? 'Finish' : condDone ? 'Continue →' : 'Next';
  const bodyText = condDone && step.doneText ? `${step.text}<div class="tutorial-done-msg">✓ ${step.doneText}</div>` : step.text;

  tooltip.innerHTML = `
    <div class="tutorial-header">
      <span class="tutorial-step-count">Step ${stepNum} of ${totalSteps}</span>
      <button class="tutorial-skip" id="tutorial-skip">Skip Tutorial</button>
    </div>
    <div class="tutorial-title">${step.title}</div>
    <div class="tutorial-body">${bodyText}</div>
    <div class="tutorial-footer">
      <button class="btn btn-sm tutorial-next${hasWait && !condDone ? ' tutorial-next-waiting' : ''}" id="tutorial-next" ${hasWait && !condDone ? 'disabled' : ''}>${hasWait && !condDone ? 'Waiting...' : nextLabel}</button>
    </div>
  `;

  // Position: centered if no target, or relative to target
  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    tooltip.classList.remove('tutorial-centered');
    tooltip.removeAttribute('style');

    // Calculate position based on arrow direction
    const tooltipWidth = 320;
    if (step.arrow === 'bottom') {
      // Tooltip above the target
      tooltip.style.position = 'fixed';
      tooltip.style.top = (rect.bottom + 12) + 'px';
      tooltip.style.left = Math.max(12, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 12)) + 'px';
    } else if (step.arrow === 'top') {
      // Tooltip below the target
      tooltip.style.position = 'fixed';
      tooltip.style.bottom = (window.innerHeight - rect.top + 12) + 'px';
      tooltip.style.left = Math.max(12, Math.min(rect.left + rect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - 12)) + 'px';
    } else {
      tooltip.classList.add('tutorial-centered');
    }
  } else {
    tooltip.classList.add('tutorial-centered');
    tooltip.removeAttribute('style');
  }

  // Wire buttons
  tooltip.querySelector('#tutorial-next').addEventListener('click', (e) => {
    e.stopPropagation();
    _advanceStep();
  });
  tooltip.querySelector('#tutorial-skip').addEventListener('click', (e) => {
    e.stopPropagation();
    _dismissTutorial();
  });
}

// ── Internals ────────────────────────────────────────────────────────────────

function _ensureOverlay() {
  if (_overlayEl) return;
  _overlayEl = document.createElement('div');
  _overlayEl.className = 'tutorial-overlay';
  _overlayEl.innerHTML = `
    <div class="tutorial-backdrop"></div>
    <div class="tutorial-spotlight"></div>
    <div class="tutorial-tooltip"></div>
  `;
  // Allow clicks through to spotlighted elements
  _overlayEl.querySelector('.tutorial-backdrop').addEventListener('click', (e) => {
    e.stopPropagation();
  });
  document.body.appendChild(_overlayEl);
}

function _removeOverlay() {
  // Clean up any spotlight-elevated elements
  document.querySelectorAll('.tutorial-target').forEach(el => el.classList.remove('tutorial-target'));
  if (_overlayEl) {
    _overlayEl.remove();
    _overlayEl = null;
  }
  _stopChecking();
}

function _advanceStep() {
  if (!Game.state.tutorial) return;
  Game.state.tutorial.step++;
  _conditionMet = false; // reset for next step
  if (Game.state.tutorial.step >= STEPS.length) {
    _dismissTutorial();
    return;
  }
  Game.save();
  renderTutorial();
}

function _dismissTutorial() {
  if (Game.state.tutorial) {
    Game.state.tutorial.dismissed = true;
    Game.save();
  }
  _removeOverlay();
}

// Periodically check if the current step's waitFor condition is met.
// When it is, enable the "Continue" button — player still has to click it.
function _startChecking() {
  _stopChecking();
  _checkInterval = setInterval(() => {
    if (!isTutorialActive()) { _stopChecking(); return; }
    const step = STEPS[Game.state.tutorial.step];
    if (!step) return;

    // Check waitFor condition — when first satisfied, re-render to enable button
    if (step.waitFor && !_conditionMet && step.waitFor()) {
      _conditionMet = true;
      renderTutorial(); // re-render with enabled button + done message
    }

    // Re-position spotlight if target moved (e.g., after render)
    if (step.target) {
      const targetEl = document.querySelector(step.target);
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const pad = 6;
        const spotlight = _overlayEl?.querySelector('.tutorial-spotlight');
        if (spotlight) {
          spotlight.style.position = 'fixed';
          spotlight.style.top = (rect.top - pad) + 'px';
          spotlight.style.left = (rect.left - pad) + 'px';
          spotlight.style.width = (rect.width + pad * 2) + 'px';
          spotlight.style.height = (rect.height + pad * 2) + 'px';
        }
      }
    }
  }, 300);
}

function _stopChecking() {
  if (_checkInterval) {
    clearInterval(_checkInterval);
    _checkInterval = null;
  }
}
