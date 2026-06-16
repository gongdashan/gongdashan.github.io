/**
 * 主题切换模块
 * - 默认跟随系统主题
 * - 用户点击后在 localStorage 持久化
 */

const STORAGE_KEY = 'xsds-theme';

export function applySavedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch {
    // 忽略不可用存储环境
  }
}

export function initThemeToggle() {
  const headerInner = document.querySelector('.site-header__inner');
  if (!headerInner) return;

  const existing = headerInner.querySelector('[data-theme-toggle]');
  if (existing) {
    updateToggleLabel(existing);
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.setAttribute('data-theme-toggle', '');
  button.setAttribute('aria-live', 'polite');

  button.addEventListener('click', () => {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateToggleLabel(button);
  });

  const toggleHost = document.createElement('div');
  toggleHost.className = 'site-header__theme';
  toggleHost.appendChild(button);

  const nav = headerInner.querySelector('.site-nav');
  if (nav && nav.nextSibling) {
    headerInner.insertBefore(toggleHost, nav.nextSibling);
  } else {
    headerInner.appendChild(toggleHost);
  }

  updateToggleLabel(button);
}

function getCurrentTheme() {
  const forced = document.documentElement.getAttribute('data-theme');
  if (forced === 'light' || forced === 'dark') return forced;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 忽略不可用存储环境
  }
}

function updateToggleLabel(button) {
  const current = getCurrentTheme();
  const isDark = current === 'dark';

  button.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
  button.setAttribute('title', isDark ? '切换到浅色模式' : '切换到深色模式');
  button.innerHTML = isDark
    ? '<span aria-hidden="true">☀️</span><span>浅色</span>'
    : '<span aria-hidden="true">🌙</span><span>深色</span>';
}
