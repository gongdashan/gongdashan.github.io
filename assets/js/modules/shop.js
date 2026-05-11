/**
 * 商品列表页模块
 * - 加载 products.json
 * - 渲染商品卡片网格
 * - 分类筛选（按 category）
 * - 筛选状态写入 URL hash（便于分享/刷新保持）
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
    // 子页面 fetch 路径需指向上一级
    const res = await fetch('../data/products.json');
    if (!res.ok) throw new Error('products.json 加载失败');
    const data = await res.json();
    allProducts = data.items;
    categories  = data.categories;

    renderFilters();
    applyFilterFromHash();
    renderGrid();

    // hash 变化时同步筛选（浏览器前进/后退）
    window.addEventListener('hashchange', () => {
      applyFilterFromHash();
      renderGrid();
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

/**
 * 从 URL hash 读取当前筛选
 */
function applyFilterFromHash() {
  const hash = window.location.hash.replace('#', '');
  const validKeys = categories.map(c => c.key);
  currentFilter = validKeys.includes(hash) ? hash : 'all';
  syncFilterButtons();
}

/**
 * 渲染分类筛选按钮
 */
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

  // 绑定点击事件
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    const key = btn.dataset.filter;
    if (key === currentFilter) return;

    currentFilter = key;
    // 写入 hash（不触发跳转，但浏览器可前进/后退）
    history.replaceState(null, '', key === 'all' ? location.pathname : `#${key}`);
    syncFilterButtons();
    renderGrid();
  });
}

/**
 * 同步按钮高亮状态
 */
function syncFilterButtons() {
  document.querySelectorAll('.filter-chip').forEach(btn => {
    const isActive = btn.dataset.filter === currentFilter;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

/**
 * 渲染商品网格
 */
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