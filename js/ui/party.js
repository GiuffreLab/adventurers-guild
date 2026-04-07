import Game from '../game.js';
import { getClass, getItem, getAvailableClasses, EQUIPMENT, canClassEquip, getItemRarity, CLASSES } from '../data.js';
import {
  getSkill, getClassSkills, getUnlockedClassSkills, getNextClassSkill,
  getNextMasterySkill, getAllMasterySkills, getEquipmentSkill
} from '../skills.js';
import { hpClass, fmtTime, showToast } from './helpers.js';

let partyView = 'roster';   // 'roster' | 'sheet' | 'recruit'
let selectedMemberId = null;
let pickingSlot = null;      // which equipment slot is open for picking

export function resetPartyState() {
  partyView = 'roster';
  selectedMemberId = null;
  pickingSlot = null;
}

// ── Lightweight tick update for HP bars (no full re-render) ──────────────
export function tickUpdateParty() {
  const s = Game.state;
  const el = document.getElementById('tab-party');
  if (!el) return;

  // Update slot card HP bars
  el.querySelectorAll('.slot-card.filled').forEach(card => {
    const mid = card.dataset.memberId;
    const m = mid === 'player' ? s.player : s.party.find(p => p.id === mid);
    if (!m) return;
    const eff = Game.effectiveStats(m);
    const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
    const fill = card.querySelector('.progress-fill');
    if (fill) {
      fill.style.width = hpPct + '%';
      fill.className = 'progress-fill ' + hpClass(eff.hp, eff.maxHp);
    }
    const hpSpan = card.querySelector('span[style*="font-size:0.72rem"]');
    if (hpSpan) hpSpan.textContent = `${eff.hp}/${eff.maxHp} HP`;
  });

  // Update roster row HP bars
  el.querySelectorAll('.roster-row').forEach(row => {
    const mid = row.dataset.memberId;
    const m = mid === 'player' ? s.player : s.party.find(p => p.id === mid);
    if (!m) return;
    const eff = Game.effectiveStats(m);
    const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
    const fill = row.querySelector('.roster-hp .progress-fill');
    if (fill) {
      fill.style.width = hpPct + '%';
      fill.className = 'progress-fill ' + hpClass(eff.hp, eff.maxHp);
    }
  });

  // Update character sheet HP bar if open
  const charHpFill = el.querySelector('.char-bar-row .progress-fill');
  if (charHpFill && selectedMemberId) {
    const m = selectedMemberId === 'player' ? s.player : s.party.find(p => p.id === selectedMemberId);
    if (m) {
      const eff = Game.effectiveStats(m);
      const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
      charHpFill.style.width = hpPct + '%';
      charHpFill.className = 'progress-fill ' + hpClass(eff.hp, eff.maxHp);
      const valSpan = charHpFill.closest('.char-bar-row')?.querySelector('.char-bar-value');
      if (valSpan) valSpan.textContent = `${eff.hp} / ${eff.maxHp}`;
    }
  }
}

export function renderParty() {
  const s = Game.state;
  const el = document.getElementById('tab-party');

  if (partyView === 'recruit') { renderRecruit(el, s); return; }
  if (partyView === 'sheet' && selectedMemberId) { renderCharSheet(el, s); return; }

  // ── Roster View ──────────────────────────────────────────────────────────
  const maxParty = Game.getMaxPartySize();
  const slotCards = Array.from({ length: maxParty }, (_, i) => i).map(i => {
    const id = s.activeSlots[i];
    const m = id ? s.party.find(p => p.id === id) : null;
    if (m) {
      const eff = Game.effectiveStats(m);
      const cls = getClass(m.class);
      const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
      return `
        <div class="slot-card filled" data-member-id="${m.id}">
          <span class="slot-name">${m.name}</span>
          <span class="slot-cls">${cls.label} · Lv.${m.level}</span>
          <div class="slot-hp progress-bar">
            <div class="progress-fill ${hpClass(eff.hp, eff.maxHp)}" style="width:${hpPct}%"></div>
          </div>
          <span style="font-size:0.72rem;color:var(--text-dim)">${eff.hp}/${eff.maxHp} HP</span>
        </div>`;
    }
    return `<div class="slot-card" data-slot="${i}"><span class="slot-empty-text">Empty slot</span></div>`;
  }).join('');

  const allMembers = [
    { id: 'player', data: s.player, type: 'player' },
    ...s.party.map(m => ({ id: m.id, data: m, type: 'member' }))
  ];
  const rosterRows = allMembers.map(({ id, data: m, type }) => {
    const eff = Game.effectiveStats(m);
    const cls = getClass(m.class);
    const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
    const isActive = s.activeSlots.includes(m.id);
    const statusClass = isActive ? 'status-active' : (eff.hp < eff.maxHp * 0.5 ? 'status-injured' : 'status-reserve');
    const statusLabel = type === 'player' ? 'Leader' : (isActive ? 'Active' : 'Reserve');
    return `
      <div class="roster-row${isActive ? ' in-active' : ''}" data-member-id="${m.id}">
        <div class="roster-info">
          <div class="roster-name">${m.name} <span class="member-sigil">${cls.sigil}</span></div>
          <div class="roster-sub">Lv.${m.level} ${cls.label} · Power: ${Math.round(Game.memberPower(m))}</div>
        </div>
        <div class="roster-hp progress-bar">
          <div class="progress-fill ${hpClass(eff.hp, eff.maxHp)}" style="width:${hpPct}%"></div>
        </div>
        <span class="roster-status ${statusClass}">${statusLabel}</span>
      </div>
    `;
  }).join('');

  // Guild hall expansion panel
  const expansionCost = Game.getPartyExpansionCost();
  const expansionMaxed = expansionCost === null;
  const canAffordExpansion = !expansionMaxed && s.gold >= expansionCost;
  const expansionPips = Array.from({ length: 3 }, (_, i) =>
    `<div class="party-expand-pip${i < (s.partyExpansions || 0) ? ' filled' : ''}"></div>`
  ).join('');
  const expansionPanel = maxParty < 7 ? `
    <div class="party-expand-panel">
      <div class="party-expand-header">
        <span class="party-expand-title">Guild Hall Capacity ${maxParty}/7</span>
        ${expansionMaxed
          ? '<span class="party-expand-maxed">MAX</span>'
          : `<button class="btn btn-sm${canAffordExpansion ? ' btn-expand' : ''}" id="btn-expand-party" ${canAffordExpansion ? '' : 'disabled'}>
              Expand — ${expansionCost.toLocaleString()}g
            </button>`
        }
      </div>
      <div class="party-expand-pips">${expansionPips}</div>
    </div>
  ` : `
    <div class="party-expand-panel">
      <div class="party-expand-header">
        <span class="party-expand-title">Guild Hall Capacity 7/7</span>
        <span class="party-expand-maxed">MAX</span>
      </div>
      <div class="party-expand-pips">${expansionPips}</div>
    </div>
  `;

  el.innerHTML = `
    <div class="card">
      <div class="section-header">
        <div class="card-title" style="margin:0">Active Party <span style="font-weight:400;color:var(--text-muted)">(${s.activeSlots.length}/${maxParty})</span></div>
      </div>
      <div class="active-slots">${slotCards}</div>
      ${expansionPanel}
    </div>
    <div class="card">
      <div class="section-header">
        <div class="card-title" style="margin:0">Roster <span style="font-weight:400;color:var(--text-muted)">(${s.party.length}/12)</span></div>
        <button class="btn btn-sm btn-success" id="btn-recruit">+ Recruit</button>
      </div>
      <div class="roster-grid">${rosterRows}</div>
    </div>
  `;

  // Clicking a roster row or slot card opens the character sheet
  el.querySelectorAll('.roster-row[data-member-id]').forEach(row => {
    row.addEventListener('click', () => {
      selectedMemberId = row.dataset.memberId;
      partyView = 'sheet';
      pickingSlot = null;
      renderParty();
    });
  });
  el.querySelectorAll('.slot-card.filled[data-member-id]').forEach(card => {
    card.addEventListener('click', () => {
      selectedMemberId = card.dataset.memberId;
      partyView = 'sheet';
      pickingSlot = null;
      renderParty();
    });
  });
  el.querySelector('#btn-recruit')?.addEventListener('click', () => {
    partyView = 'recruit';
    renderParty();
  });

  // Guild hall expansion
  const expandBtn = el.querySelector('#btn-expand-party');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      const result = Game.expandParty();
      if (result.ok) {
        showToast(`Guild hall expanded! Party size now ${result.newMax}.`, 'success');
        Game.save();
      } else {
        showToast(result.reason, 'error');
      }
      renderParty();
      document.getElementById('header-gold').textContent = Game.state.gold.toLocaleString();
    });
  }
}


// ═══════════════════════════════════════════════════════════════════════════
// CHARACTER SHEET
// ═══════════════════════════════════════════════════════════════════════════

function renderCharSheet(el, s) {
  const m = selectedMemberId === 'player' ? s.player : s.party.find(p => p.id === selectedMemberId);
  if (!m) { partyView = 'roster'; renderParty(); return; }

  const cls = getClass(m.class);
  const baseStats = m.stats;
  const eff = Game.effectiveStats(m);
  const isPlayer = selectedMemberId === 'player';
  const isActive = s.activeSlots.includes(m.id);
  const hpPct = Math.round((eff.hp / eff.maxHp) * 100);
  const expNeeded = Math.floor(100 * Math.pow(m.level, 1.5));
  const expPct = Math.round((m.exp / Math.max(1, expNeeded)) * 100);
  const power = Math.round(Game.memberPower(m));

  // Equipment section
  const equipHtml = renderEquipmentPanel(m, s);

  // Stats section
  const statsHtml = renderStatsPanel(baseStats, eff);

  // Skills section
  const skillsHtml = renderSkillsPanel(m);

  // Action buttons
  const toggleLabel = isActive ? 'Remove from Party' : 'Add to Party';
  const toggleClass = isActive ? 'btn-danger' : 'btn-success';

  el.innerHTML = `
    <div class="char-sheet">
      <div class="char-sheet-topbar">
        <button class="btn btn-sm btn-ghost" id="btn-back-roster">← Roster</button>
        <div class="char-sheet-actions">
          ${!isPlayer ? `<button class="btn btn-sm ${toggleClass}" id="btn-toggle-active">${toggleLabel}</button>` : ''}
          ${!isPlayer ? `<button class="btn btn-sm btn-danger" id="btn-dismiss-member">Dismiss</button>` : ''}
        </div>
      </div>

      <div class="char-header">
        <div class="char-portrait">
          <span class="char-portrait-sigil">${cls.sigil}</span>
        </div>
        <div class="char-header-info">
          <div class="char-name">${m.name}</div>
          <div class="char-class">${cls.label} · Level ${m.level}</div>
          <div class="char-power">Power: <strong>${power}</strong></div>
          <div class="char-bars">
            <div class="char-bar-row">
              <span class="char-bar-label">HP</span>
              <div class="progress-bar" style="flex:1"><div class="progress-fill ${hpClass(eff.hp, eff.maxHp)}" style="width:${hpPct}%"></div></div>
              <span class="char-bar-value">${eff.hp} / ${eff.maxHp}</span>
            </div>
            <div class="char-bar-row">
              <span class="char-bar-label">EXP</span>
              <div class="progress-bar" style="flex:1"><div class="progress-fill exp-bar" style="width:${expPct}%"></div></div>
              <span class="char-bar-value">${m.exp} / ${expNeeded}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="char-body">
        <div class="char-col-left">
          <div class="char-section">
            <div class="char-section-title">Equipment</div>
            ${equipHtml}
          </div>
          <div class="char-section">
            <div class="char-section-title">Stats</div>
            ${statsHtml}
          </div>
        </div>
        <div class="char-col-right">
          <div class="char-section">
            <div class="char-section-title">Skills & Abilities</div>
            ${skillsHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  bindCharSheetEvents(el, s, m);
}


// ── Equipment Panel ──────────────────────────────────────────────────────

function renderEquipmentPanel(m, s) {
  const isRogue = m.class === 'ROGUE';
  const isMonk = m.class === 'MONK';
  const isRanger = m.class === 'RANGER';
  const canDualWieldClass = isRogue || isMonk || isRanger;

  // Check if weapon is 2h — if so, offhand is locked
  const wpnItem = m.equipment && m.equipment.weapon ? getItem(m.equipment.weapon) : null;
  const hasTwoHanded = wpnItem && wpnItem.twoHanded;

  const slots = ['weapon', 'armor', 'accessory', 'offhand'];
  const slotIcons = { weapon: '⚔', armor: '🛡', accessory: '💍', offhand: '🔮' };
  const offhandLabel = isRogue ? 'off hand 🗡' : isMonk ? 'off hand 🐾' : isRanger ? 'off hand ⚔' : 'offhand';
  const slotLabels = {
    weapon: 'weapon',
    armor: 'armor',
    accessory: 'accessory',
    offhand: hasTwoHanded ? 'offhand 🔒' : offhandLabel,
  };

  const slotRows = slots.map(slot => {
    const itemId = m.equipment ? m.equipment[slot] : null;
    const item = itemId ? getItem(itemId) : null;
    const isOpen = pickingSlot === slot;
    const bonusStr = item ? formatBonuses(item.statBonus) : '';
    const grantedSkill = item && item.grantedSkill ? getSkill(item.grantedSkill) : null;
    const rarity = item ? getItemRarity(item) : null;

    let slotHtml = `
      <div class="equip-slot-card${isOpen ? ' open' : ''}${item ? ' has-item' : ''}" data-slot="${slot}">
        <div class="equip-slot-header" data-slot-click="${slot}">
          <span class="equip-slot-icon">${slotIcons[slot]}</span>
          <div class="equip-slot-info">
            <span class="equip-slot-type">${slotLabels[slot]}</span>
            ${item
              ? `<span class="equip-slot-item-name" style="color:${rarity.color}">${item.name} <span class="item-rarity-badge" style="color:${rarity.color};border-color:${rarity.color}30">${rarity.label}</span></span>`
              : `<span class="equip-slot-empty">Empty — click to equip</span>`}
          </div>
          ${item ? `<div class="equip-slot-bonus">${bonusStr}</div>` : ''}
          ${item ? `<button class="btn btn-sm btn-ghost equip-unequip-btn" data-unequip="${slot}" title="Unequip">✕</button>` : ''}
        </div>
        ${item ? `<div class="equip-slot-class-req">${item.classReq ? item.classReq.map(cid => CLASSES[cid]?.label || cid).join(', ') : 'Any class'}</div>` : ''}
        ${grantedSkill ? `<div class="equip-skill-grant">${grantedSkill.icon} Grants: ${grantedSkill.name}</div>` : ''}
    `;

    // Inline item picker when this slot is open
    if (isOpen) {
      // If offhand is locked by 2h weapon, show message
      if (slot === 'offhand' && hasTwoHanded) {
        slotHtml += `<div class="equip-picker"><div class="equip-picker-empty">Offhand locked — two-handed weapon equipped</div></div>`;
        slotHtml += `</div>`;
        return slotHtml;
      }
      // For offhand slot: show dual-wield items + normal offhand items
      const slotItems = s.inventory.filter(e => {
        const it = getItem(e.itemId);
        if (!it || e.quantity <= 0) return false;
        if (it.slot === slot) return true;
        // Dual-wield: daggers for Rogue, claws for Monk, swords for Ranger
        if (slot === 'offhand' && it.slot === 'weapon' && !it.twoHanded) {
          if (isRogue && it.dagger) return true;
          if (isMonk && it.claw) return true;
          if (isRanger && !it.dagger && !it.claw && it.classReq && it.classReq.includes('RANGER') && !it.twoHanded) return true;
        }
        return false;
      });
      if (slotItems.length === 0) {
        slotHtml += `<div class="equip-picker"><div class="equip-picker-empty">No ${slotLabels[slot]} items in inventory</div></div>`;
      } else {
        const items = slotItems.map(e => {
          const it = getItem(e.itemId);
          const bStr = formatBonuses(it.statBonus);
          const gs = it.grantedSkill ? getSkill(it.grantedSkill) : null;
          const qtyTag = e.quantity > 1 ? ` <span class="equip-picker-qty">x${e.quantity}</span>` : '';
          const iRarity = getItemRarity(it);
          const classOk = canClassEquip(m.class, it);
          const classReqStr = it.classReq
            ? it.classReq.map(cid => CLASSES[cid]?.label || cid).join(', ')
            : null;
          // Dual-wield tag for offhand weapons
          const isDualWield = slot === 'offhand' && it.slot === 'weapon';
          const dwLabel = it.dagger ? '🗡 Dual Wield (off hand)' : it.claw ? '🐾 Dual Wield (off hand)' : '⚔ Dual Wield (off hand)';
          // 2h weapon tag
          const is2h = it.twoHanded;
          return `
            <div class="equip-picker-item${classOk ? '' : ' class-locked'}" ${classOk ? `data-equip-item="${it.id}" data-equip-slot="${slot}"` : ''}>
              <div class="equip-picker-item-main">
                <span class="equip-picker-item-name" style="color:${iRarity.color}">${it.name}${qtyTag} <span class="item-rarity-badge" style="color:${iRarity.color};border-color:${iRarity.color}30">${iRarity.label}</span></span>
                <span class="equip-picker-item-bonus">${bStr}</span>
              </div>
              ${isDualWield ? `<div class="equip-picker-dual-wield">${dwLabel}</div>` : ''}
              ${is2h ? `<div class="equip-picker-two-handed">🔒 Two-Handed (blocks offhand)</div>` : ''}
              ${!classOk ? `<div class="equip-picker-class-warn">Requires: ${classReqStr}</div>` : ''}
              ${gs ? `<div class="equip-picker-item-skill">${gs.icon} ${gs.name}</div>` : ''}
              ${it.desc ? `<div class="equip-picker-item-desc">${it.desc}</div>` : ''}
            </div>`;
        }).join('');
        slotHtml += `<div class="equip-picker">${items}</div>`;
      }
    }

    slotHtml += `</div>`;
    return slotHtml;
  }).join('');

  return `<div class="equip-panel">${slotRows}</div>`;
}


// ── Stats Panel ──────────────────────────────────────────────────────────

function renderStatsPanel(base, eff) {
  const statDefs = [
    { key: 'maxHp', label: 'MAX HP' },
    { key: 'atk',   label: 'ATK' },
    { key: 'def',   label: 'DEF' },
    { key: 'spd',   label: 'SPD' },
    { key: 'mag',   label: 'MAG' },
    { key: 'lck',   label: 'LCK' },
  ];

  const rows = statDefs.map(({ key, label }) => {
    const baseVal = base[key] || 0;
    const effVal = eff[key] || 0;
    const diff = effVal - baseVal;
    const diffStr = diff > 0 ? `<span class="stat-bonus">+${diff}</span>` : (diff < 0 ? `<span class="stat-penalty">${diff}</span>` : '');
    return `
      <div class="stat-row">
        <span class="stat-row-label">${label}</span>
        <span class="stat-row-base">${baseVal}</span>
        <span class="stat-row-arrow">→</span>
        <span class="stat-row-final">${effVal}</span>
        ${diffStr}
      </div>`;
  }).join('');

  return `<div class="stats-panel">${rows}</div>`;
}


// ── Skills Panel ─────────────────────────────────────────────────────────

function renderSkillsPanel(m) {
  const allClassSkills = getClassSkills(m.class);
  const unlockedClass = getUnlockedClassSkills(m.class, m.level);
  const unlockedIds = new Set(unlockedClass.map(s => s.id));

  // Equipment-granted skills
  const eqSkills = [];
  for (const slot of Object.values(m.equipment || {})) {
    if (!slot) continue;
    const item = getItem(slot);
    if (item && item.grantedSkill) {
      const sk = getSkill(item.grantedSkill);
      if (sk) eqSkills.push({ skill: sk, source: item.name });
    }
  }

  // Mastery skills
  const allMastery = getAllMasterySkills();
  const questsDone = m.questsCompleted || 0;

  let html = '';

  // Class skills
  html += `<div class="skills-category-label">Class Skills</div>`;
  if (allClassSkills.length === 0) {
    html += `<div class="skill-empty-note">No class skills available.</div>`;
  }
  for (const sk of allClassSkills) {
    const unlocked = unlockedIds.has(sk.id);
    html += renderSkillRow(sk, unlocked, unlocked ? null : `Unlocks at Lv.${sk.unlockLevel}`);
  }

  // Equipment skills
  if (eqSkills.length > 0) {
    html += `<div class="skills-category-label" style="margin-top:12px">Equipment Skills</div>`;
    for (const { skill, source } of eqSkills) {
      html += renderSkillRow(skill, true, null, source);
    }
  }

  // Mastery skills
  html += `<div class="skills-category-label" style="margin-top:12px">Mastery <span class="skills-category-sub">(${questsDone} quests done)</span></div>`;
  for (const sk of allMastery) {
    const unlocked = questsDone >= sk.questsRequired;
    const lockMsg = unlocked ? null : `${sk.questsRequired - questsDone} more quests needed`;
    html += renderSkillRow(sk, unlocked, lockMsg);
  }

  return `<div class="skills-panel">${html}</div>`;
}

function renderSkillRow(skill, unlocked, lockMsg, itemSource) {
  const icon = skill.icon || '•';
  const badge = skill.type === 'active'
    ? '<span class="skill-badge skill-active">Active</span>'
    : '<span class="skill-badge skill-passive">Passive</span>';
  const effectStr = formatSkillEffects(skill);

  if (!unlocked) {
    return `
      <div class="skill-row locked">
        <span class="skill-row-icon">${icon}</span>
        <div class="skill-row-info">
          <div class="skill-row-top"><span class="skill-row-name">${skill.name}</span>${badge}</div>
          <div class="skill-row-lock">${lockMsg || 'Locked'}</div>
        </div>
      </div>`;
  }

  return `
    <div class="skill-row">
      <span class="skill-row-icon">${icon}</span>
      <div class="skill-row-info">
        <div class="skill-row-top">
          <span class="skill-row-name">${skill.name}</span>
          ${badge}
          ${itemSource ? `<span class="skill-row-source">from ${itemSource}</span>` : ''}
        </div>
        <div class="skill-row-desc">${skill.description}</div>
        ${effectStr ? `<div class="skill-row-effects">${effectStr}</div>` : ''}
      </div>
    </div>`;
}


// ── Event Binding ────────────────────────────────────────────────────────

function bindCharSheetEvents(el, s, m) {
  el.querySelector('#btn-back-roster')?.addEventListener('click', () => {
    partyView = 'roster';
    selectedMemberId = null;
    pickingSlot = null;
    renderParty();
  });

  el.querySelector('#btn-toggle-active')?.addEventListener('click', () => {
    const isActive = s.activeSlots.includes(m.id);
    const result = Game.setActive(m.id, !isActive);
    if (!result.ok) showToast(result.reason, 'error');
    Game.save();
    renderParty();
  });

  el.querySelector('#btn-dismiss-member')?.addEventListener('click', () => {
    if (!confirm('Dismiss this member? They cannot be recovered.')) return;
    const result = Game.dismissMember(selectedMemberId);
    if (!result.ok) { showToast(result.reason, 'error'); return; }
    selectedMemberId = null;
    partyView = 'roster';
    Game.save();
    renderParty();
  });

  // Equipment slot click → toggle picker
  el.querySelectorAll('[data-slot-click]').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.equip-unequip-btn')) return;
      const slot = header.dataset.slotClick;
      pickingSlot = pickingSlot === slot ? null : slot;
      renderParty();
    });
  });

  // Unequip button
  el.querySelectorAll('[data-unequip]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      Game.unequipItem(selectedMemberId, btn.dataset.unequip);
      Game.save();
      pickingSlot = null;
      renderParty();
    });
  });

  // Equip item from picker
  el.querySelectorAll('[data-equip-item]').forEach(row => {
    row.addEventListener('click', () => {
      const targetSlot = row.dataset.equipSlot || undefined;
      const result = Game.equipItem(selectedMemberId, row.dataset.equipItem, targetSlot);
      if (result.ok) {
        showToast('Equipped!', 'success');
        Game.save();
        pickingSlot = null;
      } else {
        showToast(result.reason, 'error');
      }
      renderParty();
    });
  });
}


// ── Recruit View ─────────────────────────────────────────────────────────

function renderRecruit(el, s) {
  const available = getAvailableClasses(s.guild.rank);
  const rows = available.map(cls => {
    const canAfford = s.gold >= cls.recruitCost;
    const full = s.party.length >= 12;
    const disabled = !canAfford || full;
    return `
      <div class="recruit-row${disabled ? ' cant-afford' : ''}" data-class-id="${cls.id}">
        <div class="recruit-info">
          <div class="recruit-name">${cls.label} <span class="member-sigil">${cls.sigil}</span></div>
          <div class="recruit-desc">${cls.description}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">
            HP ${cls.baseStats.maxHp} · ATK ${cls.baseStats.atk} · DEF ${cls.baseStats.def} · SPD ${cls.baseStats.spd} · MAG ${cls.baseStats.mag}
          </div>
        </div>
        <span class="recruit-cost${!canAfford ? ' too-pricey' : ''}">${cls.recruitCost}g</span>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div class="card">
      <div class="section-header">
        <div class="card-title" style="margin:0">Recruit Adventurer</div>
        <button class="btn btn-sm btn-ghost" id="btn-back-roster">← Back</button>
      </div>
      <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:12px">Gold: <strong style="color:var(--gold)">${s.gold}g</strong> · Roster: ${s.party.length}/8</div>
      <div class="recruit-list">${rows || '<div class="empty-state">No classes available yet.</div>'}</div>
    </div>
  `;

  el.querySelector('#btn-back-roster').addEventListener('click', () => {
    partyView = 'roster';
    renderParty();
  });

  el.querySelectorAll('.recruit-row:not(.cant-afford)').forEach(row => {
    row.addEventListener('click', () => {
      const result = Game.recruitMember(row.dataset.classId);
      if (result.ok) {
        showToast(`${result.member.name} joined the party!`, 'success');
        selectedMemberId = result.member.id;
        partyView = 'sheet';
        Game.save();
        renderParty();
      } else {
        showToast(result.reason, 'error');
      }
    });
  });
}


// ── Formatting helpers ───────────────────────────────────────────────────

function formatBonuses(statBonus) {
  if (!statBonus) return '';
  return Object.entries(statBonus).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join('  ');
}

function formatSkillEffects(skill) {
  if (!skill.effects) return '';
  const parts = [];
  for (const [key, val] of Object.entries(skill.effects)) {
    if (key === 'atkBonus') parts.push(`+${Math.round(val * 100)}% ATK`);
    else if (key === 'defBonus') parts.push(`+${Math.round(val * 100)}% DEF`);
    else if (key === 'spdBonus') parts.push(`+${Math.round(val * 100)}% SPD`);
    else if (key === 'magBonus') parts.push(`+${Math.round(val * 100)}% MAG`);
    else if (key === 'lckBonus') parts.push(`+${Math.round(val * 100)}% LCK`);
    else if (key === 'hpBonus') parts.push(`+${Math.round(val * 100)}% HP`);
    else if (key === 'healRate') parts.push(`+${Math.round(val * 100)}% heal rate`);
    else if (key === 'partyAtkBonus') parts.push(`+${Math.round(val * 100)}% party ATK`);
    else if (key === 'partyDefBonus') parts.push(`+${Math.round(val * 100)}% party DEF`);
    else if (key === 'goldBonus') parts.push(`+${Math.round(val * 100)}% gold`);
    else if (key === 'expBonus') parts.push(`+${Math.round(val * 100)}% EXP`);
    else if (key === 'critChance') parts.push(`${Math.round(val * 100)}% crit`);
    else if (key === 'dodgeChance') parts.push(`${Math.round(val * 100)}% dodge`);
    else if (key === 'powerMultiplier') parts.push(`${val}x power`);
  }
  if (skill.procChance && skill.procChance < 1 && skill.type === 'active') {
    parts.push(`${Math.round(skill.procChance * 100)}% proc`);
  }
  return parts.join(' · ');
}
