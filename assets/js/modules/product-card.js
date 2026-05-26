/**
 * 商品卡片渲染（首页精选 + 商品列表共用）
 * @module product-card
 */

const STOCK_LABELS = {
  'in-stock':     { text: '现货充足', class: 'badge--success' },
  'low-stock':    { text: '库存紧张', class: 'badge--warning' },
  'out-of-stock': { text: '已售罄',   class: 'badge--muted' }
};

const CATEGORY_LABELS = {
  toy:      '玩具类',
  clothing: '服装类',
  bag:      '包',
  cup:      '杯子',
  other:    '其它'
};

/**
 * 生成单张商品卡片 HTML
 * @param {Object} product - 商品数据
 * @returns {string} HTML 字符串
 */
export function renderProductCard(product) {
  const stock = STOCK_LABELS[product.stock] || STOCK_LABELS['in-stock'];
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const isSoldOut = product.stock === 'out-of-stock';

  return `
    <article class="product-card ${isSoldOut ? 'is-sold-out' : ''}"
             data-category="${product.category}"
             data-id="${product.id}">
      <a href="pages/product.html?id=${product.id}"
         class="product-card__link"
         aria-label="查看 ${product.name} 详情">

        <div class="product-card__media">
          <img src="${product.images[0]}"
               alt="${product.name}"
               width="400" height="400"
               loading="lazy"
               decoding="async"
               class="product-card__image">

          <span class="product-card__category">${categoryLabel}</span>

          ${product.featured ? '<span class="product-card__featured" aria-label="精选商品">⭐ 精选</span>' : ''}

          ${isSoldOut ? '<div class="product-card__sold-out-mask"><span>已售罄</span></div>' : ''}
        </div>

        <div class="product-card__body">
          <h3 class="product-card__name">${product.name}</h3>

          ${product.story ? `<p class="product-card__story">${product.story}</p>` : ''}

          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="product-card__price-symbol">¥</span>
              <span class="product-card__price-value">${product.price}</span>
            </div>
            <span class="badge ${stock.class}">${stock.text}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

/**
 * 路径前缀辅助（处理子页面相对路径）
 * 子页面（pages/shop.html）需要 ../ 前缀
 * @param {string} path
 * @param {boolean} fromSubpage
 */
export function resolvePath(path, fromSubpage = false) {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return fromSubpage ? `../${path}` : path;
}

/**
 * 渲染商品卡片（带路径前缀处理）
 */
export function renderProductCardWithBase(product, fromSubpage = false) {
  const adjusted = {
    ...product,
    images: product.images.map(p => resolvePath(p, fromSubpage))
  };

  const stock = STOCK_LABELS[product.stock] || STOCK_LABELS['in-stock'];
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const isSoldOut = product.stock === 'out-of-stock';

  // 子页面跳转到详情页用相对路径
  const detailLink = fromSubpage
    ? `product.html?id=${product.id}`
    : `pages/product.html?id=${product.id}`;

  return `
    <article class="product-card ${isSoldOut ? 'is-sold-out' : ''}"
             data-category="${adjusted.category}"
             data-id="${adjusted.id}">
      <a href="${detailLink}"
         class="product-card__link"
         aria-label="查看 ${adjusted.name} 详情">

        <div class="product-card__media">
          <img src="${adjusted.images[0]}"
               alt="${adjusted.name}"
               width="400" height="400"
               loading="lazy"
               decoding="async"
               class="product-card__image">

          <span class="product-card__category">${categoryLabel}</span>

          ${adjusted.featured ? '<span class="product-card__featured" aria-label="精选商品">⭐ 精选</span>' : ''}

          ${isSoldOut ? '<div class="product-card__sold-out-mask"><span>已售罄</span></div>' : ''}
        </div>

        <div class="product-card__body">
          <h3 class="product-card__name">${adjusted.name}</h3>

          ${adjusted.story ? `<p class="product-card__story">${adjusted.story}</p>` : ''}

          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="product-card__price-symbol">¥</span>
              <span class="product-card__price-value">${adjusted.price}</span>
            </div>
            <span class="badge ${stock.class}">${stock.text}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}