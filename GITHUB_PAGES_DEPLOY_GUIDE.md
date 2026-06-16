# GitHub Pages 部署指引（截图式步骤）

适用仓库：`gongdashan/gongdashan.github.io`

---

## 1. 推送代码到 main 分支

1. 打开终端进入项目根目录。
2. 执行：
   - `git add .`
   - `git commit -m "chore: configure github pages deployment"`
   - `git push origin main`

你会看到：GitHub 仓库出现一次新的提交。

---

## 2. 在仓库开启 Pages（一次性设置）

1. 打开 GitHub 仓库页面：`https://github.com/gongdashan/gongdashan.github.io`
2. 点击顶部 `Settings`。
3. 左侧点击 `Pages`。
4. 在 `Build and deployment` 区域：
   - `Source` 选择 `GitHub Actions`。

你会看到：页面提示由 Actions workflow 部署。

---

## 3. 查看工作流执行情况

1. 回到仓库顶部，点击 `Actions`。
2. 找到工作流：`Deploy GitHub Pages`。
3. 点击最新一次运行记录。
4. 确认两个 Job 均为绿色：
   - `build`
   - `deploy`

你会看到：`deploy` 任务里出现站点地址（page_url）。

---

## 4. 访问站点

1. 打开：`https://gongdashan.github.io/`
2. 强制刷新浏览器（macOS：`Command + Shift + R`）。
3. 检查关键页面：
   - `/`
   - `/pages/shop.html`
   - `/pages/product.html?id=p01`
   - `/pages/contact.html`

---

## 5. 常见问题

### 5.1 Actions 失败：权限不足

检查仓库 `Settings -> Actions -> General`：
- `Workflow permissions` 选择 `Read and write permissions`。

### 5.2 页面 404

检查：
1. 仓库名是否为 `gongdashan.github.io`（你当前已满足）。
2. `Pages` 的 `Source` 是否为 `GitHub Actions`。
3. `Actions` 最近一次是否成功。

### 5.3 更新后页面没变化

1. 清浏览器缓存，强制刷新。
2. 确认最新 commit 在 `main`。
3. 确认最新 workflow 运行成功。

---

## 6. 后续发布方式（最简单）

每次更新后，只需重复：
1. `git add .`
2. `git commit -m "feat: 更新内容"`
3. `git push origin main`

GitHub 会自动触发部署。
