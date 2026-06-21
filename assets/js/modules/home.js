/**
 * 首页模块
 * - 渲染 Hero 信任条
 * - 渲染精选商品（featured: true 的前 4 件）
 * @module home
 */

import { renderProductCardWithBase, initProductCardCarousels } from './product-card.js';

export async function initHome() {
  await Promise.all([
    renderTrustBar(),
    renderFeaturedProducts()
  ]);
}

/* ============ 信任条 ============ */
async function renderTrustBar() {
  const container = document.querySelector('[data-trust-bar]');
  if (!container) return;

  try {
    const res = await fetch('data/stats.json');
    if (!res.ok) throw new Error('stats.json 加载失败');
    const data = await res.json();

    container.innerHTML = data.items.map(item => `
      <div class="hero__trust-item">
        <span class="hero__trust-icon" aria-hidden="true">${item.icon}</span>
        <div>
          <div class="hero__trust-value"
               data-target="${item.value}"
               data-prefix="${item.prefix || ''}"
               data-suffix="${item.suffix || ''}">
            ${item.prefix || ''}0${item.suffix || ''}
          </div>
          <div class="hero__trust-label">${item.label}</div>
        </div>
      </div>
    `).join('');

    observeAndAnimate();
  } catch (err) {
    console.error('[home] 渲染信任条失败：', err);
    container.style.display = 'none';
  }
}

/* ============ 精选商品 ============ */
async function renderFeaturedProducts() {
  const container = document.querySelector('[data-featured-grid]');
  if (!container) return;

  container.setAttribute('aria-busy', 'true');

  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('products.json 加载失败');
    const data = await res.json();

    const list = data.items || data.products || [];
    const featured = list.filter(p => p.featured);
    if (featured.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);">暂无精选商品</p>';
      container.setAttribute('aria-busy', 'false');
      return;
    }

    // 首页：fromSubpage = false
    container.innerHTML = featured.map(p => renderProductCardWithBase(p, false)).join('');
    initProductCardCarousels(container);
    container.setAttribute('aria-busy', 'false');
  } catch (err) {
    console.error('[home] 渲染精选商品失败：', err);
    container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);">商品加载失败</p>';
    container.setAttribute('aria-busy', 'false');
  }
}

/* ============ 数字滚动 ============ */
function observeAndAnimate() {
  const targets = document.querySelectorAll('[data-target]');
  if (!targets.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    targets.forEach(el => {
      const target = Number(el.dataset.target);
      el.textContent = `${el.dataset.prefix}${formatNumber(target)}${el.dataset.suffix}`;
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  targets.forEach(el => io.observe(el));
}

function animateCount(el) {
  const target = Number(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(target * ease(progress));
    el.textContent = `${prefix}${formatNumber(value)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function formatNumber(num) {
  return num.toLocaleString('zh-CN');
}