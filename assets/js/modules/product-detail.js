/**
 * 商品详情页
 * - 读取 URL 查询参数中的商品 id
 * - 从 products.json 加载商品信息
 * - 渲染商品图集并自动轮播
 */

const CATEGORY_LABELS = {
  toy: '玩具类',
  clothing: '服饰帽子',
  bag: '包袋',
  cup: '杯子',
  stationery: '文具',
  other: '其它'
};

export async function initProductDetail() {
  const layout = document.querySelector('.detail-layout');
  if (!layout) return;

  try {
    const res = await fetch('../data/products.json');
    if (!res.ok) throw new Error('products.json 加载失败');

    const data = await res.json();
    const products = data.items || data.products || [];
    const id = new URLSearchParams(window.location.search).get('id');
    const product = products.find((item) => item.id === id) || products[0];

    if (!product) {
      layout.innerHTML = '<p class="detail-desc">暂无可展示的商品信息。</p>';
      return;
    }

    document.title = `${product.name} · 小山设计社`;
    layout.innerHTML = renderDetail(product);

    const idSlot = layout.querySelector('[data-product-id]');
    const noteSlot = layout.querySelector('[data-product-note]');
    if (idSlot) idSlot.textContent = product.id;
    if (noteSlot) {
      noteSlot.textContent = `当前查看商品编号：${product.id}。如需批量采购，可在联系时备注该编号。`;
    }

    initCarousel(layout);
  } catch (err) {
    console.error('[product-detail] 渲染失败：', err);
    layout.innerHTML = '<p class="detail-desc">商品详情暂时无法加载，请稍后再试。</p>';
  }
}

function renderDetail(product) {
  const images = normalizeImages(product);
  const specs = Object.entries(product.specs || {});
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;

  return `
    <article class="detail-media detail-carousel" aria-label="商品图片区" data-carousel>
      <div class="detail-carousel__viewport">
        ${images.map((src, index) => `
          <figure class="detail-carousel__slide ${index === 0 ? 'is-active' : ''}"
                  data-carousel-slide
                  aria-hidden="${index === 0 ? 'false' : 'true'}">
            <img src="${resolveAssetPath(src)}"
                 alt="${escapeHtml(product.name)} 图 ${index + 1}"
                 width="960"
                 height="960"
                 loading="${index === 0 ? 'eager' : 'lazy'}"
                 decoding="async">
          </figure>
        `).join('')}
      </div>

      ${images.length > 1 ? `
        <button type="button" class="detail-carousel__control detail-carousel__control--prev" data-carousel-prev aria-label="上一张图片">
          <span aria-hidden="true">‹</span>
        </button>
        <button type="button" class="detail-carousel__control detail-carousel__control--next" data-carousel-next aria-label="下一张图片">
          <span aria-hidden="true">›</span>
        </button>
        <div class="detail-carousel__dots" role="tablist" aria-label="商品图片切换">
          ${images.map((_, index) => `
            <button type="button"
                    class="detail-carousel__dot ${index === 0 ? 'is-active' : ''}"
                    data-carousel-dot="${index}"
                    aria-label="切换到第 ${index + 1} 张图片"
                    aria-pressed="${index === 0 ? 'true' : 'false'}"></button>
          `).join('')}
        </div>
      ` : ''}
    </article>

    <article class="detail-info">
      <p class="detail-kicker">商品详情</p>
      <h1 id="detail-title">${escapeHtml(product.name)}</h1>
      <p class="detail-price">¥${escapeHtml(String(product.price))}</p>

      <p class="detail-desc">${escapeHtml(product.description || product.story || '暂无商品描述。')}</p>

      <ul class="detail-specs" role="list" aria-label="商品规格">
        <li><span>商品编号</span><strong data-product-id>${escapeHtml(product.id)}</strong></li>
        <li><span>分类</span><strong>${escapeHtml(categoryLabel)}</strong></li>
        ${specs.map(([key, value]) => `
          <li><span>${escapeHtml(key)}</span><strong>${escapeHtml(String(value))}</strong></li>
        `).join('')}
      </ul>

      <p class="detail-note" data-product-note>
        当前查看商品编号：${escapeHtml(product.id)}。如需批量采购，可在联系时备注该编号。
      </p>

      <div class="detail-actions">
        <a class="btn btn--primary" href="contact.html">提交采购咨询</a>
        <a class="btn btn--secondary" href="shop.html">返回商品列表</a>
      </div>
    </article>
  `;
}

function initCarousel(root) {
  const carousel = root.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));

  if (slides.length <= 1) return;

  let index = 0;
  let timer = null;

  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    if (slides.length <= 1) return;
    stop();
    timer = window.setInterval(() => show(index + 1), 3500);
  };

  prev?.addEventListener('click', () => {
    show(index - 1);
    start();
  });

  next?.addEventListener('click', () => {
    show(index + 1);
    start();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const nextIndex = Number(dot.dataset.carouselDot);
      if (Number.isNaN(nextIndex)) return;
      show(nextIndex);
      start();
    });
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  show(0);
  start();
}

function normalizeImages(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    const values = product.images
      .map((item) => (typeof item === 'string' ? item : item?.src))
      .filter(Boolean);

    if (values.length > 0) return values;
  }

  if (product.thumbnail) return [product.thumbnail];
  return ['assets/images/products/placeholder.svg'];
}

function resolveAssetPath(path) {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('/') || path.startsWith('../')) return path;
  return `../${path}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
