import Game from './game.js';
import { initNewGameModal, startGame, render, tickUpdate, updateQuestTimer } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {

  initNewGameModal();

  if (Game.load()) {
    // Existing save: resolve any quest that completed while away
    Game.resolveIdle();
    document.getElementById('modal-new-game').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    startGame();
  } else {
    // No save: show new game setup
    document.getElementById('modal-new-game').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
  }

  // Main game loop — tick every second, lightweight DOM patches only
  Game.startTick(() => {
    if (document.getElementById('game').classList.contains('hidden')) return;
    tickUpdate();
  });

  // Smooth quest timer (updates every 250ms without full re-render)
  setInterval(() => {
    updateQuestTimer();
  }, 250);

});
