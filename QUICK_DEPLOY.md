# 🚀 快速部署到 Vercel（5分钟搞定）

## 最简单的方法（推荐）

### 步骤 1：访问 Vercel 网站

打开浏览器，访问：**https://vercel.com**

### 步骤 2：登录

1. 点击右上角 **"Sign Up"**（如果已有账号点 "Log In"）
2. 选择 **"Continue with GitHub"**
3. 授权 Vercel 访问你的 GitHub

### 步骤 3：导入项目

1. 点击 **"Add New..."** → **"Project"**
2. 找到你的仓库（如果看不到，点击 "Import Git Repository"）
3. 点击仓库旁边的 **"Import"** 按钮

### 步骤 4：配置环境变量

在部署页面：

1. 找到 **"Environment Variables"** 部分
2. 点击展开
3. 添加变量：
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: 你的 Google Analytics ID（如：`G-XXXXXXXXXX`）
4. 点击 **"Add"**

### 步骤 5：部署

点击 **"Deploy"** 按钮，等待 2-3 分钟

### 步骤 6：完成！

部署成功后，你会看到：
- ✅ 一个网址（如：`https://your-project.vercel.app`）
- 点击访问你的网站

---

## 如果你还没有 GitHub 仓库

### 1. 初始化 Git

在项目文件夹打开终端，运行：

```bash
git init
git add .
git commit -m "首次提交"
```

### 2. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库名称（如：`perler-beads`）
3. 选择 **Public** 或 **Private**
4. 点击 **"Create repository"**

### 3. 推送代码

复制 GitHub 显示的命令，类似：

```bash
git remote add origin https://github.com/你的用户名/perler-beads.git
git branch -M main
git push -u origin main
```

然后回到上面的"步骤 3"继续。

---

## 以后如何更新网站？

每次修改代码后：

```bash
git add .
git commit -m "更新说明"
git push
```

Vercel 会自动重新部署，1-2 分钟后网站就更新了！

---

## 需要帮助？

- 查看详细指南：`DEPLOY_GUIDE.md`
- Vercel 文档：https://vercel.com/docs
- 遇到问题可以问我

---

## 常见问题速查

**Q: 部署失败？**
- 检查构建日志，看具体错误
- 确保本地 `npm run build` 能成功

**Q: 网站打不开？**
- 等待几分钟，DNS 需要时间生效
- 清除浏览器缓存

**Q: Google Analytics 不工作？**
- 确认在 Vercel 添加了环境变量
- 检查 GA ID 格式是否正确（G-XXXXXXXXXX）

**Q: 如何绑定自己的域名？**
- 在 Vercel 项目设置 → Domains → 添加域名
- 在域名服务商添加 CNAME 记录指向 `cname.vercel-dns.com`

祝你部署顺利！🎉
