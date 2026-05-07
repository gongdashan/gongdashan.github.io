/**
 * 小山设计社 · 全局入口
 * @module main
 */

// —— 字体加载完成后添加类（避免 FOIT 闪烁）——
if ('fonts' in document) {
  Promise.all([
    document.fonts.load('1em "LXGW WenKai"'),
    document.fonts.load('1em "Manrope"')
  ]).then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}

// —— 当前年份注入页脚 ——
const yearEl = document.querySelector('[data-current-year]');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// —— 占位：后续 Step 会扩展这里 ——
console.log('🏔️ 小山设计社 · 网站启动');
/**
 * 小山设计社 · 全局入口
 * @module main
 */

import { initNavigation } from './modules/navigation.js';

// —— 字体加载完成后添加类 ——
if ('fonts' in document) {
  Promise.all([
    document.fonts.load('1em "LXGW WenKai"'),
    document.fonts.load('1em "Manrope"')
  ]).then(() => {
    document.documentElement.classList.add('fonts-loaded');
  }).catch(() => {
    // 字体加载失败也不阻塞页面
    document.documentElement.classList.add('fonts-loaded');
  });
}

// —— DOM 就绪后初始化 ——
const ready = (fn) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(() => {
  // 初始化导航
  initNavigation();

  // 注入当前年份到页脚
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  console.log('🏔️ 小山设计社 · 网站启动');
});