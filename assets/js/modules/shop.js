/**
 * 商品列表页模块
 * - 加载 products.json
 * - 渲染分类筛选 + 小诗 + 商品卡片网格
 * @module shop
 */

import { renderProductCardWithBase } from './product-card.js';

let allProducts = [];
let categories  = [];
let currentFilter = 'all';

export async function initShop() {
  const grid = document.querySelector('[data-products-grid]');
  if (!grid) return;

  try {
    const res = await fetch('../data/products.json');
    if (!res.ok) throw new Error('products.json 加载失败');
    const data = await res.json();
    allProducts = data.items;
    categories  = data.categories;

    renderFilters();
    applyFilterFromHash();
    renderGrid();
    renderPoem();

    window.addEventListener('hashchange', () => {
      applyFilterFromHash();
      renderGrid();
      renderPoem();
    });
  } catch (err) {
    console.error('[shop] 加载失败：', err);
    grid.innerHTML = `
      <div class="empty-state">
        <p>😢 商品数据暂时无法加载，请稍后再试。</p>
      </div>
    `;
  }
}

function applyFilterFromHash() {
  const hash = window.location.hash.replace('#', '');
  const validKeys = categories.map(c => c.key);
  currentFilter = validKeys.includes(hash) ? hash : 'all';
  syncFilterButtons();
}

function renderFilters() {
  const filterBar = document.querySelector('[data-filter-bar]');
  if (!filterBar) return;

  filterBar.innerHTML = categories.map(cat => {
    const count = cat.key === 'all'
      ? allProducts.length
      : allProducts.filter(p => p.category === cat.key).length;

    return `
      <button type="button"
              class="filter-chip ${cat.key === currentFilter ? 'is-active' : ''}"
              data-filter="${cat.key}"
              aria-pressed="${cat.key === currentFilter}">
        ${cat.label}
        <span class="filter-chip__count">${count}</span>
      </button>
    `;
  }).join('');

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    const key = btn.dataset.filter;
    if (key === currentFilter) return;

    currentFilter = key;
    history.replaceState(null, '', key === 'all' ? location.pathname : `#${key}`);
    syncFilterButtons();
    renderGrid();
    renderPoem();
  });
}

function syncFilterButtons() {
  document.querySelectorAll('.filter-chip').forEach(btn => {
    const isActive = btn.dataset.filter === currentFilter;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

/**
 * 渲染当前分类下的小诗
 */
function renderPoem() {
  const poemEl = document.querySelector('[data-filter-poem]');
  if (!poemEl) return;

  const cat = categories.find(c => c.key === currentFilter);
  const poem = cat?.poem || '';

  // 重新触发动画：先清空 class，再添加
  poemEl.textContent = poem;
  poemEl.style.animation = 'none';
  // eslint-disable-next-line no-unused-expressions
  poemEl.offsetHeight; // 触发重排
  poemEl.style.animation = '';
}

function renderGrid() {
  const grid = document.querySelector('[data-products-grid]');
  const empty = document.querySelector('[data-empty-state]');
  if (!grid) return;

  const list = currentFilter === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === currentFilter);

  if (list.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }

  if (empty) empty.hidden = true;
  grid.innerHTML = list.map(p => renderProductCardWithBase(p, true)).join('');
}