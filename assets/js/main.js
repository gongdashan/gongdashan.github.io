/**
 * 小山设计社 · 全局入口
 * @module main
 */

import { initNavigation } from './modules/navigation.js';
import { initHome }       from './modules/home.js';
import { initShop }       from './modules/shop.js';

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
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

ready(() => {
  initNavigation();

  const page = document.body.dataset.page;

  if (page === 'home') initHome();
  if (page === 'shop') initShop();

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  console.log('🏔️ 小山设计社 · 网站启动 · 页面：', page);
});