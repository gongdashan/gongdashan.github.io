/**
 * 商品详情页（静态模板增强）
 * - 读取 URL 查询参数中的商品 id
 * - 在页面中展示商品编号，便于采购沟通
 */

export function initProductDetail() {
  const idSlot = document.querySelector('[data-product-id]');
  const noteSlot = document.querySelector('[data-product-note]');
  if (!idSlot || !noteSlot) return;

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return;

  idSlot.textContent = id;
  noteSlot.textContent = `当前查看商品编号：${id}。如需批量采购，可在联系时备注该编号。`;
}
