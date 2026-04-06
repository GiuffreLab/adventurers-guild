export function rankTag(rank) {
  return `<span class="quest-rank-tag rank-${rank}" style="color:var(--rank-${rank});border-color:var(--rank-${rank})">${rank}</span>`;
}

export function hpClass(hp, maxHp) {
  const pct = hp / maxHp;
  return pct > 0.6 ? 'hp-high' : pct > 0.3 ? 'hp-med' : 'hp-low';
}

export function fmtTime(seconds) {
  if (seconds <= 0) return 'Done!';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  return `${Math.floor(s/3600)}h ago`;
}

let toastTimeout;
export function showToast(msg, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      padding:10px 20px; border-radius:6px; font-size:0.875rem; font-weight:500;
      z-index:999; transition:opacity 0.3s; pointer-events:none;
      border:1px solid; max-width:400px; text-align:center;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  if (type === 'success') { toast.style.background='var(--green-dim)'; toast.style.borderColor='var(--green)'; toast.style.color='var(--green)'; }
  else if (type === 'error') { toast.style.background='var(--red-dim)'; toast.style.borderColor='var(--red)'; toast.style.color='var(--red)'; }
  else { toast.style.background='var(--cyan-dim)'; toast.style.borderColor='var(--cyan)'; toast.style.color='var(--cyan)'; }
  toast.style.opacity = '1';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

export function animatePulse(element) {
  if (!element) return;
  element.classList.add('animate-pulse');
  setTimeout(() => element.classList.remove('animate-pulse'), 600);
}

export function animateSparkle(element) {
  if (!element) return;
  element.classList.add('animate-sparkle');
  setTimeout(() => element.classList.remove('animate-sparkle'), 1000);
}

export function animateLevelUp(element) {
  if (!element) return;
  element.classList.add('animate-levelup');
  setTimeout(() => element.classList.remove('animate-levelup'), 1200);
}

export function animateCountUp(element, startVal, endVal, duration = 800) {
  if (!element) return;
  const startTime = Date.now();
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const current = Math.floor(startVal + (endVal - startVal) * progress);
    element.textContent = current.toLocaleString();
    if (progress >= 1) clearInterval(interval);
  }, 30);
}
