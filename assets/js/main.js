// assets/js/main.js
import { renderProductCardWithBase } from './modules/product-card.js';

// ============ 工具函数 ============
async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
    return await res.json();
  } catch (err) {
    console.error('❌ 加载失败:', path, err);
    return null;
  }
}

// ============ 渲染 Mission ============
async function renderMission() {
  const data = await fetchJSON('data/site.json');
  const el = document.getElementById('mission-text');
  if (!el) return;
  
  if (data && data.mission) {
    el.textContent = data.mission;
  } else {
    el.textContent = '小山设计社致力于将企业文创的部分收益捐赠到公益组织,让每一次拥有更有意义。';
  }
}

// ============ 渲染精选商品 ============
async function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) {
    console.warn('⚠️ 找不到 #featured-products 容器');
    return;
  }

  const data = await fetchJSON('data/products.json');
  
  if (!data || !data.products) {
    container.innerHTML = '<p class="error">商品数据加载失败,请刷新重试</p>';
    return;
  }

  // 筛选 featured = true 的商品
  const featured = data.products.filter(p => p.featured === true);
  
  console.log('✅ 加载到', data.products.length, '个商品,精选', featured.length, '个');

  if (featured.length === 0) {
    container.innerHTML = '<p class="empty">暂无精选商品</p>';
    return;
  }

  // 渲染卡片
  container.innerHTML = featured
    .map(product => renderProductCardWithBase(product, ''))
    .join('');
}

// ============ 渲染近期活动 ============
async function renderRecentEvents() {
  const container = document.getElementById('recent-events');
  if (!container) return;

  const data = await fetchJSON('data/events.json');
  
  if (!data || !data.events || data.events.length === 0) {
    container.innerHTML = '<p class="empty">敬请期待更多活动</p>';
    return;
  }

  const recent = data.events.slice(0, 3);
  container.innerHTML = recent.map(event => `
    <article class="event-card">
      <img src="${event.cover}" alt="${event.title}" loading="lazy" />
      <div class="event-card__body">
        <time>${event.date}</time>
        <h3>${event.title}</h3>
        <p>${event.summary}</p>
      </div>
    </article>
  `).join('');
}

// ============ 导航汉堡菜单 ============
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('is-open');
  });
}

// ============ 启动 ============
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 小山设计社网站启动');
  initNav();
  renderMission();
  renderFeaturedProducts();
  renderRecentEvents();
});