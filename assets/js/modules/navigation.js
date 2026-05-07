/**
 * 导航栏交互模块
 * - 移动端汉堡菜单开关
 * - ESC 关闭、点击外部关闭
 * - 滚动检测
 * - 焦点陷阱（a11y）
 * @module navigation
 */

export function initNavigation() {
  const header   = document.querySelector('.site-header');
  const toggle   = document.querySelector('.site-header__toggle');
  const nav      = document.querySelector('.site-nav');
  const backdrop = document.querySelector('.nav-backdrop');

  if (!header || !toggle || !nav) {
    console.warn('[navigation] 缺少必要元素，跳过初始化');
    return;
  }

  // —— 1. 汉堡菜单开关 ——
  const openNav = () => {
    nav.classList.add('is-open');
    backdrop?.classList.add('is-open');
    document.body.classList.add('has-nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', '关闭菜单');
    // 焦点移到第一个链接
    nav.querySelector('a')?.focus();
  };

  const closeNav = () => {
    nav.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    document.body.classList.remove('has-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  // 点击遮罩关闭
  backdrop?.addEventListener('click', closeNav);

  // 点击导航链接后关闭（移动端体验）
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('is-open')) closeNav();
    });
  });

  // —— 2. ESC 键关闭 ——
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      toggle.focus(); // 焦点回到触发按钮
    }
  });

  // —— 3. 窗口尺寸变化时自动关闭（避免桌面端残留打开状态）——
  const mediaQuery = window.matchMedia('(min-width: 901px)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches) closeNav();
  });

  // —— 4. 滚动时为头部添加阴影 ——
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // —— 5. 自动高亮当前页面 ——
  highlightCurrentPage();
}

/**
 * 根据当前 URL 高亮对应的导航链接
 */
function highlightCurrentPage() {
  const links = document.querySelectorAll('.site-nav__link');
  // 当前路径（去掉尾部斜杠和文件名差异）
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // 创建一个 URL 用于比较 pathname
    const linkPath = new URL(href, window.location.origin).pathname.replace(/\/$/, '') || '/';

    if (linkPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}