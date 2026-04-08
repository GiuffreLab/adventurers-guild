// ── Shared Utilities ──────────────────────────────────────────────────────

const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Escape a string for safe insertion into HTML via innerHTML / template literals.
 * Converts &, <, >, ", ' to their HTML entity equivalents.
 */
export function esc(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str.replace(/[&<>"']/g, c => ESC_MAP[c]);
}
