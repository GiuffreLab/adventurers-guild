// ── Visual Effects & Juice ──────────────────────────────────────────────
// Floating numbers, particles, and screen effects for game events.

/**
 * Show a floating number that rises and fades (for gold, XP, damage, etc).
 * @param {string} text - Text to show (e.g. "+50g", "+120 XP")
 * @param {string} color - CSS color
 * @param {HTMLElement|null} anchorEl - Element to anchor near (or null for header)
 */
export function floatText(text, color = '#f0c060', anchorEl = null) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.color = color;

  if (anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    el.style.left = (rect.left + rect.width / 2) + 'px';
    el.style.top = rect.top + 'px';
  } else {
    // Default: near the gold display in the header
    const goldEl = document.getElementById('header-gold');
    if (goldEl) {
      const rect = goldEl.getBoundingClientRect();
      el.style.left = (rect.left + rect.width / 2) + 'px';
      el.style.top = (rect.bottom + 4) + 'px';
    } else {
      el.style.left = '50%';
      el.style.top = '60px';
    }
  }

  document.body.appendChild(el);
  // Remove after animation completes
  setTimeout(() => el.remove(), 1200);
}

/**
 * Spawn a burst of CSS particles (confetti/sparkle) at a position.
 * @param {number} x - Viewport X
 * @param {number} y - Viewport Y
 * @param {object} opts - { count, colors, spread, duration }
 */
export function particleBurst(x, y, opts = {}) {
  const count = opts.count || 12;
  const colors = opts.colors || ['#f0c060', '#4ecdc4', '#e74c3c', '#9b59b6', '#2ecc71'];
  const spread = opts.spread || 80;
  const duration = opts.duration || 800;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'fx-particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const dist = spread * (0.5 + Math.random() * 0.5);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 20; // bias upward
    const size = 3 + Math.random() * 4;

    particle.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      background: ${color};
      --dx: ${dx}px; --dy: ${dy}px;
      animation-duration: ${duration + Math.random() * 300}ms;
    `;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration + 400);
  }
}

/**
 * Flash the screen with a color overlay (for rank-ups, boss kills, etc).
 * @param {string} color - CSS color with alpha
 * @param {number} duration - ms
 */
export function screenFlash(color = 'rgba(240,192,96,0.2)', duration = 600) {
  const flash = document.createElement('div');
  flash.className = 'fx-screen-flash';
  flash.style.background = `radial-gradient(ellipse at center, ${color}, transparent 70%)`;
  flash.style.animationDuration = duration + 'ms';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), duration + 100);
}

/**
 * Shake an element briefly (for crit hits, errors, etc).
 * @param {HTMLElement} el
 * @param {number} intensity - pixels of shake
 */
export function shake(el, intensity = 3) {
  if (!el) return;
  el.classList.add('fx-shake');
  el.style.setProperty('--shake-px', intensity + 'px');
  setTimeout(() => { el.classList.remove('fx-shake'); }, 400);
}

/**
 * Level-up celebration burst at an element.
 */
export function levelUpBurst(el) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  particleBurst(x, y, {
    count: 16,
    colors: ['#f0c060', '#ffe066', '#ffcc33', '#ffffff'],
    spread: 60,
    duration: 900
  });
}

/**
 * Confetti burst for major events (rank-up, celestial drop, etc).
 */
export function confettiBurst() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 3;
  particleBurst(x, y, {
    count: 30,
    colors: ['#f0c060', '#4ecdc4', '#e74c3c', '#9b59b6', '#2ecc71', '#3498db', '#ff6b35'],
    spread: 150,
    duration: 1200
  });
}
