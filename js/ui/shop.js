import Game from '../game.js';
import { getItem, getItemRarity, CLASSES, ITEM_RARITIES } from '../data.js';
import { showToast } from './helpers.js';

let shopMode = 'buy';

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
          const bonusStr = Object.entries(item.statBonus || {}).map(([k,v]) => `+${v} ${k.toUpperCase()}`).join(' · ');
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
          const bonusStr = item.statBonus ? Object.entries(item.statBonus).map(([k,v]) => `+${v} ${k.toUpperCase()}`).join(' · ') : '';
          const rarity = getItemRarity(item);
          return `
            <div class="shop-item">
              <div class="shop-item-info">
                <div class="shop-item-name" style="color:${rarity.color}">${item.name}${rarity.id !== 'common' ? ` <span class="item-rarity-badge" style="color:${rarity.color};border-color:${rarity.color}30">${rarity.label}</span>` : ''} ${e.quantity > 1 ? `<span style="color:var(--text-muted)">×${e.quantity}</span>` : ''}</div>
                ${item.slot ? `<div class="shop-item-slot">${item.slot}</div>` : ''}
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
    <div class="shop-refresh">Shop refreshes in: <strong>${refreshStr}</strong></div>
    <div class="shop-toggle">
      <button class="btn${shopMode === 'buy' ? ' active' : ''}" id="btn-shop-buy">Buy</button>
      <button class="btn${shopMode === 'sell' ? ' active' : ''}" id="btn-shop-sell">Sell</button>
    </div>
    <div class="shop-grid">${content}</div>
  `;

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
