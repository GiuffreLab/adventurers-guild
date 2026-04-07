import Game from '../game.js';
import { getItem, getItemRarity, CLASSES, ITEM_RARITIES } from '../data.js';
import { showToast } from './helpers.js';

let shopMode = 'buy';

function buildUpgradePanel() {
  const s = Game.state;
  const level = s.shop.level || 0;
  const maxed = level >= 10;
  const cost = Game.getShopUpgradeCost();
  const canAfford = !maxed && s.gold >= cost;
  const weights = Game.getShopRarityWeights();

  // Build the rarity distribution bar
  const rarities = ['common', 'magic', 'rare', 'epic', 'legendary'];
  const rarityColors = { common: '#9a9a9a', magic: '#2ecc71', rare: '#3498db', epic: '#9b59b6', legendary: '#e67e22' };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const barSegments = rarities
    .filter(r => weights[r] > 0)
    .map(r => {
      const pct = totalWeight > 0 ? (weights[r] / totalWeight * 100).toFixed(0) : 0;
      return `<div class="shop-rarity-bar-seg" style="width:${pct}%;background:${rarityColors[r]}" title="${r}: ${pct}%"></div>`;
    }).join('');

  const barLabels = rarities
    .filter(r => weights[r] > 0)
    .map(r => {
      const pct = totalWeight > 0 ? (weights[r] / totalWeight * 100).toFixed(0) : 0;
      return `<span class="shop-rarity-label" style="color:${rarityColors[r]}">${r.charAt(0).toUpperCase() + r.slice(1)} ${pct}%</span>`;
    }).join('');

  // Progress pips
  const pips = Array.from({ length: 10 }, (_, i) =>
    `<div class="shop-upgrade-pip${i < level ? ' filled' : ''}"></div>`
  ).join('');

  return `
    <div class="shop-upgrade-panel">
      <div class="shop-upgrade-header">
        <span class="shop-upgrade-title">Shop Level ${level}/10</span>
        ${maxed
          ? '<span class="shop-upgrade-maxed">MAX</span>'
          : `<button class="btn btn-sm${canAfford ? ' btn-upgrade' : ''}" id="btn-shop-upgrade" ${canAfford ? '' : 'disabled'}>
              Upgrade — ${cost.toLocaleString()}g
            </button>`
        }
      </div>
      <div class="shop-upgrade-pips">${pips}</div>
      <div class="shop-rarity-bar">${barSegments}</div>
      <div class="shop-rarity-labels">${barLabels}</div>
    </div>
  `;
}

export function renderShop() {
  const s = Game.state;
  const el = document.getElementById('tab-shop');
  const refreshMs = Game.shopRefreshMs();
  const h = Math.floor(refreshMs / 3600000);
  const min = Math.floor((refreshMs % 3600000) / 60000);
  const refreshStr = refreshMs > 0 ? `${h}h ${min}m` : 'Now';

  let content;
  if (shopMode === 'buy') {
    const stock = s.shop.stock.filter(e => e.quantity > 0);
    content = stock.length === 0
      ? '<div class="empty-state">Shop is out of stock. Check back later!</div>'
      : stock.map(entry => {
          const item = getItem(entry.itemId);
          if (!item) return '';
          const canAfford = s.gold >= entry.price;
          const bonusStr = Object.entries(item.statBonus || {}).map(([k,v]) => `<span class="${v < 0 ? 'stat-penalty' : 'stat-bonus'}">${v >= 0 ? '+' : ''}${v} ${k.toUpperCase()}</span>`).join(' · ');
          const rarity = getItemRarity(item);
          const classReqStr = item.classReq
            ? item.classReq.map(cid => CLASSES[cid]?.label || cid).join(', ')
            : 'Any class';
          return `
            <div class="shop-item">
              <div class="shop-item-info">
                <div class="shop-item-name" style="color:${rarity.color}">${item.name} <span class="item-rarity-badge" style="color:${rarity.color};border-color:${rarity.color}30">${rarity.label}</span></div>
                <div class="shop-item-meta"><span class="shop-item-slot">${item.slot}</span><span class="shop-item-class-req">${classReqStr}</span></div>
                <div class="shop-item-bonus">${bonusStr}</div>
                <div class="shop-item-desc">${item.desc}</div>
              </div>
              <div class="shop-item-right">
                <span class="shop-price${!canAfford ? ' cant-afford' : ''}">${entry.price}g</span>
                <span class="shop-stock">${entry.quantity} in stock</span>
                <button class="btn btn-sm${canAfford ? ' btn-success' : ''} btn-buy" data-item-id="${item.id}" ${canAfford?'':'disabled'}>Buy</button>
              </div>
            </div>
          `;
        }).join('');
  } else {
    const sellable = s.inventory.filter(e => {
      const item = getItem(e.itemId);
      return item && (item.sellPrice || item.buyPrice) && e.quantity > 0;
    });
    content = sellable.length === 0
      ? '<div class="empty-state">No items to sell.</div>'
      : sellable.map(e => {
          const item = getItem(e.itemId);
          if (!item) return '';
          const sellPrice = item.sellPrice || Math.floor(item.buyPrice * 0.4);
          const bonusStr = item.statBonus ? Object.entries(item.statBonus).map(([k,v]) => `<span class="${v < 0 ? 'stat-penalty' : 'stat-bonus'}">${v >= 0 ? '+' : ''}${v} ${k.toUpperCase()}</span>`).join(' · ') : '';
          const rarity = getItemRarity(item);
          return `
            <div class="shop-item">
              <div class="shop-item-info">
                <div class="shop-item-name" style="color:${rarity.color}">${item.name}${rarity.id !== 'common' ? ` <span class="item-rarity-badge" style="color:${rarity.color};border-color:${rarity.color}30">${rarity.label}</span>` : ''} ${e.quantity > 1 ? `<span style="color:var(--text-muted)">×${e.quantity}</span>` : ''}</div>
                <div class="shop-item-meta">${item.slot ? `<span class="shop-item-slot">${item.slot}</span>` : ''}<span class="shop-item-class-req">${item.classReq ? item.classReq.map(cid => CLASSES[cid]?.label || cid).join(', ') : 'Any class'}</span></div>
                ${bonusStr ? `<div class="shop-item-bonus">${bonusStr}</div>` : ''}
                <div class="shop-item-desc">${item.desc}</div>
              </div>
              <div class="shop-item-right">
                <span class="shop-price">${sellPrice}g each</span>
                <button class="btn btn-sm btn-sell" data-item-id="${item.id}">Sell 1</button>
                ${e.quantity > 1 ? `<button class="btn btn-sm btn-sell-all" data-item-id="${item.id}" data-qty="${e.quantity}">Sell All</button>` : ''}
              </div>
            </div>
          `;
        }).join('');
  }

  el.innerHTML = `
    ${buildUpgradePanel()}
    <div class="shop-refresh">Shop refreshes in: <strong>${refreshStr}</strong></div>
    <div class="shop-toggle">
      <button class="btn${shopMode === 'buy' ? ' active' : ''}" id="btn-shop-buy">Buy</button>
      <button class="btn${shopMode === 'sell' ? ' active' : ''}" id="btn-shop-sell">Sell</button>
    </div>
    <div class="shop-grid">${content}</div>
  `;

  // Upgrade button
  const upgradeBtn = el.querySelector('#btn-shop-upgrade');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      const result = Game.upgradeShop();
      if (result.ok) {
        showToast(`Shop upgraded to level ${result.newLevel}!`, 'success');
        Game.save();
      } else {
        showToast(result.reason, 'error');
      }
      renderShop();
      updateHeader();
    });
  }

  el.querySelector('#btn-shop-buy').addEventListener('click', () => { shopMode = 'buy'; renderShop(); });
  el.querySelector('#btn-shop-sell').addEventListener('click', () => { shopMode = 'sell'; renderShop(); });

  el.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = Game.buyItem(btn.dataset.itemId);
      if (result.ok) { showToast('Purchased!', 'success'); Game.save(); }
      else showToast(result.reason, 'error');
      renderShop();
      updateHeader();
    });
  });

  el.querySelectorAll('.btn-sell').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = Game.sellItem(btn.dataset.itemId, 1);
      if (result.ok) { showToast(`Sold for ${result.earned}g`, 'success'); Game.save(); }
      else showToast(result.reason, 'error');
      renderShop();
      updateHeader();
    });
  });

  el.querySelectorAll('.btn-sell-all').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = Game.sellItem(btn.dataset.itemId, parseInt(btn.dataset.qty));
      if (result.ok) { showToast(`Sold all for ${result.earned}g`, 'success'); Game.save(); }
      else showToast(result.reason, 'error');
      renderShop();
      updateHeader();
    });
  });
}

function updateHeader() {
  const s = Game.state;
  document.getElementById('header-gold').textContent = s.gold.toLocaleString();
}
