# Lighthouse 自检清单（发布前）

适用页面：
- /
- /pages/shop.html
- /pages/product.html
- /pages/contact.html

目标：
- Performance >= 95
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

## 1. 性能（Performance）

- [ ] 首屏关键文案和按钮无需 JS 即可看到
- [ ] 图片设置了明确 width/height，避免 CLS
- [ ] 装饰图为低优先级加载（loading=lazy, fetchpriority=low）
- [ ] 商品卡片图片使用 lazy loading
- [ ] 无明显阻塞脚本（仅保留必要模块脚本）
- [ ] CSS/JS 无未使用的大型第三方依赖
- [ ] LCP < 2.0s
- [ ] CLS < 0.05

## 2. 可访问性（Accessibility）

- [ ] 所有页面有可见主标题 h1
- [ ] 存在跳过链接（Skip Link）
- [ ] 键盘可访问导航、筛选、表单
- [ ] :focus-visible 可见且对比度足够
- [ ] 表单字段存在 label 与 required 约束
- [ ] 动态商品区域带 aria-live 和 aria-busy
- [ ] 装饰图片使用空 alt 并标记 aria-hidden
- [ ] reduced-motion 用户可获得低动效体验

## 3. SEO

- [ ] title 与 description 覆盖核心页面
- [ ] Open Graph 标签完整
- [ ] Organization JSON-LD 可用
- [ ] robots.txt 可访问
- [ ] 页面链接无 404

## 4. 最佳实践与安全

- [ ] 外链携带 rel="noopener noreferrer"
- [ ] CSP meta 存在且与第三方域名匹配
- [ ] 表单 action 使用正式 Formspree 地址
- [ ] 控制台无报错

## 5. 建议检测命令

1. 本地启动：
   - `python3 -m http.server 8080`
2. Chrome DevTools:
   - 打开 Lighthouse
   - 选择 Mobile + Desktop 各跑 1 次
   - 勾选 Performance/Accessibility/Best Practices/SEO
3. 修复后重复跑分，直到四项都 >= 95
