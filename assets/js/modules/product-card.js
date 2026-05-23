// assets/js/modules/product-card.js

/**
 * 渲染单个商品卡片
 * @param {Object} product - 商品对象
 * @param {String} basePath - 路径前缀('' 用于首页, '../' 用于子页)
 */
export function renderProductCardWithBase(product, basePath = '') {
  const {
    id,
    name,
    subtitle,
    series,
    price,
    originalPrice,
    stock,
    stockLabel,
    isNew,
    thumbnail
  } = product;

  // 处理图片路径
  const imgSrc = `${basePath}${thumbnail}`;
  
  // 折扣百分比
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount 
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  return `
    <a href="${basePath}pages/product.html?id=${id}" class="product-card">
      <div class="product-card__media">
        <img src="${imgSrc}" alt="${name}" loading="lazy" 
             onerror="this.src='${basePath}assets/images/placeholder.jpg'" />
        ${series ? `<span class="badge badge--series">${series}</span>` : ''}
        ${isNew ? `<span class="badge badge--new">新品</span>` : ''}
        ${hasDiscount ? `<span class="badge badge--discount">-${discount}%</span>` : ''}
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${name}</h3>
        ${subtitle ? `<p class="product-card__subtitle">${subtitle}</p>` : ''}
        <div class="product-card__price">
          <span class="price-now">¥${price}</span>
          ${hasDiscount ? `<span class="price-original">¥${originalPrice}</span>` : ''}
        </div>
        <span class="product-card__stock stock--${stock}">${stockLabel}</span>
      </div>
    </a>
  `;
}