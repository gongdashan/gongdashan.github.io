/**
 * 首页模块
 * - 加载 stats.json 渲染数字成就
 * - 数字滚动动画（IntersectionObserver 触发）
 * @module home
 */

export async function initHome() {
  await renderStats();
}

/**
 * 渲染数字成就
 */
async function renderStats() {
  const container = document.querySelector('[data-stats-grid]');
  if (!container) return;

  try {
    const res = await fetch('data/stats.json');
    if (!res.ok) throw new Error('stats.json 加载失败');
    const data = await res.json();

    container.innerHTML = data.items.map(item => `
      <div class="stats__item">
        <div class="stats__icon" aria-hidden="true">${item.icon}</div>
        <div class="stats__value"
             data-target="${item.value}"
             data-prefix="${item.prefix || ''}"
             data-suffix="${item.suffix || ''}">
          ${item.prefix || ''}0${item.suffix || ''}
        </div>
        <div class="stats__label">${item.label}</div>
      </div>
    `).join('');

    // 进入视口后启动数字滚动
    observeAndAnimate();
  } catch (err) {
    console.error('[home] 渲染数字成就失败：', err);
    container.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; opacity:0.8;">
        数据加载中…
      </p>`;
  }
}

/**
 * 数字滚动动画（首次进入视口时触发）
 */
function observeAndAnimate() {
  const targets = document.querySelectorAll('[data-target]');
  if (!targets.length) return;

  // 尊重动画偏好
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

/**
 * 数字滚动效果（约 1.6s）
 */
function animateCount(el) {
  const target = Number(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  // easeOutCubic
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

/**
 * 千分位格式化
 */
function formatNumber(num) {
  return num.toLocaleString('zh-CN');
}
/**
 * 小山设计社 · 全局入口
 * @module main
 */

import { initNavigation } from './modules/navigation.js';
import { initHome }       from './modules/home.js';

// —— 字体加载完成后添加类 ——
if ('fonts' in document) {
  Promise.all([
    document.fonts.load('1em "LXGW WenKai"'),
    document.fonts.load('1em "Manrope"')
  ]).then(() => {
    document.documentElement.classList.add('fonts-loaded');
  }).catch(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}

const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(() => {
  initNavigation();

  // 仅首页执行
  if (document.body.dataset.page === 'home') {
    initHome();
  }

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  console.log('🏔️ 小山设计社 · 网站启动');
});