# 小山设计社静态网站

面向企业礼品采购与活动方批量采购的静态网站。

站点地址：
- https://gongdashan.github.io/

---

## 1. 项目简介

本项目用于展示义卖商品、活动占位信息、采购咨询入口，特点是：

- 纯静态、零构建工具，维护成本低。
- 商品列表由 `data/products.json` 驱动，便于非技术人员更新。
- 支持筛选（价格 / 类别 / 热门）。
- 支持深浅色主题切换与可访问性基础优化。

---

## 2. 目录结构

```text
.
├── index.html
├── pages/
│   ├── shop.html
│   ├── product.html
│   ├── events.html
│   ├── about.html
│   ├── contact.html
│   └── volunteer.html
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   ├── utilities.css
│   │   └── theme.css
│   └── js/
│       ├── main.js
│       └── modules/
├── data/
│   ├── products.json
│   ├── site.json
│   └── stats.json
├── .github/workflows/deploy.yml
├── GITHUB_PAGES_DEPLOY_GUIDE.md
├── LIGHTHOUSE_CHECKLIST.md
└── README.md
```

---

## 3. 本地预览

由于页面使用 ES Modules 和 fetch JSON，不能直接双击 HTML 预览。

### 方式 A：VS Code Live Server（推荐）
1. 安装扩展：Live Server。
2. 右键 `index.html`，选择 Open with Live Server。

### 方式 B：Python 本地服务

```bash
python3 -m http.server 8080
```

然后访问：
- http://localhost:8080/

---

## 4. 日常维护（小白版）

最常维护的只有两类内容：

1. 商品数据：`data/products.json`
2. 页面文案：`index.html` 和 `pages/*.html`

不需要安装 Node.js，不需要打包。

---

## 5. 如何新增商品（最重要）

在 `data/products.json` 的 `products` 数组中新增一条对象。

示例：

```json
{
	"id": "p03",
	"name": "示例商品",
	"category": "cup",
	"price": 168,
	"stock": "in_stock",
	"featured": false,
	"thumbnail": "assets/images/products/p03.jpg",
	"images": [
		{ "src": "assets/images/products/p03.jpg", "alt": "示例商品图" }
	],
	"story": "一句简短的商品卖点",
	"description": "详情描述"
}
```

字段说明：
- `id`：唯一编号，不能重复（如 `p03`）。
- `name`：商品名。
- `category`：类别（如 `cup`、`bag`、`toy`、`stationery`、`other`）。
- `price`：数字价格，不要加货币符号。
- `stock`：库存状态，建议使用 `in_stock` / `low_stock` / `out_of_stock`。
- `featured`：是否热门（`true`/`false`）。
- `thumbnail`：缩略图路径。
- `images`：图片数组，支持对象格式（推荐）。

新增后检查：
1. 打开商品页是否正常显示。
2. 分类、价格、热门筛选是否正确。
3. 点击卡片可进入详情页模板。

---

## 6. 联系表单（无后端）

联系页使用 Formspree。

你需要替换：
- `pages/contact.html` 中表单的 `action` 地址
- 从 `https://formspree.io/f/your-form-id` 改成你自己的 Formspree endpoint

替换后提交一次表单测试即可。

---

## 7. GitHub Pages 发布

项目已配置自动部署工作流：
- `.github/workflows/deploy.yml`

每次发布只需：

```bash
git add .
git commit -m "feat: 更新商品与文案"
git push origin main
```

详细截图式步骤见：
- `GITHUB_PAGES_DEPLOY_GUIDE.md`

---

## 8. 发布前质量自检

请对照：
- `LIGHTHOUSE_CHECKLIST.md`

目标建议：
- Performance >= 95
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

---

## 9. 常见问题

### Q1：页面是空白或样式错乱
通常是直接双击 HTML 打开的。请使用本地服务器（Live Server 或 Python）。

### Q2：商品不显示
先检查 `data/products.json` 是否为合法 JSON（逗号、引号最容易出错）。

### Q3：线上没更新
1. 确认代码已 push 到 `main`。
2. 去 GitHub Actions 看 `Deploy GitHub Pages` 是否成功。
3. 浏览器强制刷新（Command + Shift + R）。

---

## 10. 维护建议

- 图片尽量压缩后再上传（推荐 WebP）。
- 商品描述保持简短，便于采购决策。
- 每次更新后都本地预览一次再 push。
