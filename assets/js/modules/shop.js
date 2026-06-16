/**
 * 商品列表页模块
 * - 加载 products.json
 * - 渲染商品卡片网格
 * - 三维筛选（价格 / 类别 / 热门）
 * - 兼容不同数据结构（items/products）
 * @module shop
 */

import { renderProductCardWithBase } from './product-card.js';

let allProducts = [];
let categories  = [];
let filterState = {
  price: 'all',
  category: 'all',
  hot: 'all'
};

const PRICE_OPTIONS = [
  { key: 'all', label: '全部价格' },
  { key: 'lt100', label: '100元以下' },
  { key: '100-200', label: '100-200元' },
  { key: 'gte200', label: '200元以上' }
];

const HOT_OPTIONS = [
  { key: 'all', label: '全部商品' },
  { key: 'hot', label: '仅看热门' }
];

export async function initShop() {
  const grid = document.querySelector('[data-products-grid]');
  if (!grid) return;

  grid.setAttribute('aria-busy', 'true');

  try {
    // 子页面 fetch 路径需指向上一级
    const res = await fetch('../data/products.json');
    if (!res.ok) throw new Error('products.json 加载失败');
    const data = await res.json();

    allProducts = normalizeProducts(data);
    categories = normalizeCategories(data);

    renderFilters();
    applyFilterFromHashOrQuery();
    renderGrid();

    // hash 变化时同步筛选（浏览器前进/后退）
    window.addEventListener('hashchange', () => {
      applyFilterFromHashOrQuery();
      renderGrid();
    });
  } catch (err) {
    console.error('[shop] 加载失败：', err);
    grid.innerHTML = `
      <div class="empty-state">
        <p>😢 商品数据暂时无法加载，请稍后再试。</p>
      </div>
    `;
    grid.setAttribute('aria-busy', 'false');
  }
}

/**
 * 兼容 data.items 与 data.products 两种结构
 */
function normalizeProducts(data) {
  const list = data.items || data.products || [];
  return list.map((item) => ({
    ...item,
    stock: normalizeStock(item.stock),
    images: normalizeImages(item)
  }));
}

/**
 * 兼容 categories: [{id,name}] 与 [{key,label}]
 */
function normalizeCategories(data) {
  const raw = data.categories || [];
  const normalized = raw.map((item) => ({
    key: item.key || item.id,
    label: item.label || item.name
  })).filter((item) => item.key && item.label);

  return [{ key: 'all', label: '全部类别' }, ...normalized];
}

function normalizeImages(item) {
  if (Array.isArray(item.images) && item.images.length > 0) {
    const values = item.images.map((img) => {
      if (typeof img === 'string') return img;
      return img?.src;
    }).filter(Boolean);

    if (values.length > 0) return values;
  }

  if (item.thumbnail) return [item.thumbnail];
  return ['assets/images/products/placeholder.jpg'];
}

function normalizeStock(value) {
  const mapping = {
    in_stock: 'in-stock',
    low_stock: 'low-stock',
    out_of_stock: 'out-of-stock'
  };

  if (!value) return 'in-stock';
  return mapping[value] || value;
}

/**
 * 读取 URL 中筛选状态：
 * - query 参数：price/category/hot
 * - hash 快捷入口：#price/#category/#popular
 */
function applyFilterFromHashOrQuery() {
  const params = new URLSearchParams(window.location.search);
  const next = {
    price: params.get('price') || 'all',
    category: params.get('category') || 'all',
    hot: params.get('hot') || 'all'
  };

  const hash = window.location.hash.replace('#', '');
  if (hash === 'popular') {
    next.hot = 'hot';
  }

  filterState = sanitizeState(next);
  syncFilterButtons();

  if (hash === 'price' || hash === 'category' || hash === 'popular') {
    const el = document.querySelector(`[data-filter-group="${hash === 'popular' ? 'hot' : hash}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function sanitizeState(state) {
  const categoryKeys = categories.map((c) => c.key);
  const priceKeys = PRICE_OPTIONS.map((o) => o.key);
  const hotKeys = HOT_OPTIONS.map((o) => o.key);

  return {
    price: priceKeys.includes(state.price) ? state.price : 'all',
    category: categoryKeys.includes(state.category) ? state.category : 'all',
    hot: hotKeys.includes(state.hot) ? state.hot : 'all'
  };
}

/**
 * 渲染筛选按钮
 */
function renderFilters() {
  const filterBar = document.querySelector('[data-filter-bar]');
  if (!filterBar) return;

  filterBar.innerHTML = `
    ${renderFilterGroup('price', '价格区间', PRICE_OPTIONS)}
    ${renderFilterGroup('category', '商品类别', categories)}
    ${renderFilterGroup('hot', '热门筛选', HOT_OPTIONS)}
  `;

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;

    const group = btn.dataset.group;
    const key = btn.dataset.filter;
    if (!group || !key) return;

    if (filterState[group] === key) return;

    filterState = { ...filterState, [group]: key };
    syncFilterButtons();
    syncUrlQuery();
    renderGrid();
  });
}

function renderFilterGroup(group, title, options) {
  const chips = options.map((option) => {
    const count = getCountBy(group, option.key);
    const active = filterState[group] === option.key;

    return `
      <button type="button"
              class="filter-chip ${active ? 'is-active' : ''}"
              data-group="${group}"
              data-filter="${option.key}"
              aria-pressed="${active}">
        ${option.label}
        <span class="filter-chip__count">${count}</span>
      </button>
    `;
  }).join('');

  const anchorId = group === 'hot' ? 'popular' : group;

  return `
    <section class="filter-group" id="${anchorId}" data-filter-group="${group}" aria-label="${title}">
      <h3 class="filter-group__title">${title}</h3>
      <div class="filter-group__chips">${chips}</div>
    </section>
  `;
}

/**
 * 同步按钮高亮状态
 */
function syncFilterButtons() {
  document.querySelectorAll('.filter-chip').forEach(btn => {
    const group = btn.dataset.group;
    const key = btn.dataset.filter;
    const isActive = filterState[group] === key;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
}

function syncUrlQuery() {
  const params = new URLSearchParams();
  if (filterState.price !== 'all') params.set('price', filterState.price);
  if (filterState.category !== 'all') params.set('category', filterState.category);
  if (filterState.hot !== 'all') params.set('hot', filterState.hot);

  const query = params.toString();
  const target = `${window.location.pathname}${query ? `?${query}` : ''}`;
  history.replaceState(null, '', target);
}

function getCountBy(group, key) {
  if (key === 'all') return allProducts.length;

  if (group === 'price') {
    return allProducts.filter((p) => inPriceRange(Number(p.price || 0), key)).length;
  }

  if (group === 'category') {
    return allProducts.filter((p) => p.category === key).length;
  }

  if (group === 'hot') {
    return allProducts.filter((p) => Boolean(p.featured)).length;
  }

  return allProducts.length;
}

function inPriceRange(price, key) {
  if (key === 'all') return true;
  if (key === 'lt100') return price < 100;
  if (key === '100-200') return price >= 100 && price <= 200;
  if (key === 'gte200') return price > 200;
  return true;
}

/**
 * 渲染商品网格
 */
function renderGrid() {
  const grid = document.querySelector('[data-products-grid]');
  const empty = document.querySelector('[data-empty-state]');
  if (!grid) return;

  grid.setAttribute('aria-busy', 'true');

  const list = allProducts.filter((p) => {
    if (!inPriceRange(Number(p.price || 0), filterState.price)) return false;
    if (filterState.category !== 'all' && p.category !== filterState.category) return false;
    if (filterState.hot === 'hot' && !p.featured) return false;
    return true;
  });

  if (list.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    grid.setAttribute('aria-busy', 'false');
    return;
  }

  if (empty) empty.hidden = true;
  grid.innerHTML = list.map(p => renderProductCardWithBase(p, true)).join('');
  grid.setAttribute('aria-busy', 'false');
}