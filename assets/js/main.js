/**
 * 小山设计社 · 全局入口
 * @module main
 */

import { initNavigation } from './modules/navigation.js';
import { initHome }       from './modules/home.js';
import { initShop }       from './modules/shop.js';
import { applySavedTheme, initThemeToggle } from './modules/theme-toggle.js';
import { initProductDetail } from './modules/product-detail.js';

applySavedTheme();

const ready = (fn) => {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
};

ready(() => {
  initNavigation();
  initThemeToggle();

  const page = document.body.dataset.page;

  if (page === 'home') initHome();
  if (page === 'shop') initShop();
  if (page === 'product-detail') initProductDetail();

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});