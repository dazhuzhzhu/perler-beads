# Vercel 部署指南

## 方法一：通过 Vercel 网站部署（推荐，最简单）

### 1. 准备 GitHub 仓库

首先确保你的代码已经推送到 GitHub：

```bash
# 如果还没有初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "准备部署到 Vercel"

# 创建 GitHub 仓库后，关联并推送
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 2. 部署到 Vercel

1. **访问 Vercel 官网**
   - 打开 https://vercel.com
   - 点击右上角 "Sign Up" 或 "Log In"

2. **使用 GitHub 登录**
   - 选择 "Continue with GitHub"
   - 授权 Vercel 访问你的 GitHub

3. **导入项目**
   - 登录后，点击 "Add New..." → "Project"
   - 在列表中找到你的仓库（perler-beads）
   - 点击 "Import"

4. **配置项目**
   - Project Name: 可以保持默认或修改
   - Framework Preset: 自动检测为 "Next.js"
   - Root Directory: 保持默认 "./"
   - Build Command: 保持默认 "npm run build"
   - Output Directory: 保持默认 ".next"

5. **添加环境变量（重要！）**
   - 展开 "Environment Variables" 部分
   - 添加变量：
     - Name: `NEXT_PUBLIC_GA_ID`
     - Value: 你的 Google Analytics ID（格式：G-XXXXXXXXXX）
   - 点击 "Add"

6. **开始部署**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟，Vercel 会自动构建和部署

7. **完成！**
   - 部署成功后，会显示你的网站地址
   - 格式类似：`https://your-project-name.vercel.app`
   - 点击链接即可访问你的网站

### 3. 自动部署

以后每次你推送代码到 GitHub，Vercel 会自动重新部署：

```bash
git add .
git commit -m "更新内容"
git push
```

等待 1-2 分钟，网站就会自动更新！

---

## 方法二：通过命令行部署

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

会打开浏览器，选择用 GitHub 登录并授权。

### 3. 部署项目

在项目根目录运行：

```bash
vercel
```

按照提示操作：
- Set up and deploy? → Yes
- Which scope? → 选择你的账号
- Link to existing project? → No
- What's your project's name? → 回车（使用默认名称）
- In which directory is your code located? → 回车（使用当前目录）
- Want to override the settings? → No

等待部署完成，会显示你的网站地址。

### 4. 添加环境变量

```bash
vercel env add NEXT_PUBLIC_GA_ID
```

输入你的 Google Analytics ID，选择 Production、Preview、Development 环境。

### 5. 重新部署（应用环境变量）

```bash
vercel --prod
```

---

## 绑定自定义域名（可选）

### 1. 在 Vercel 控制台

1. 进入你的项目
2. 点击 "Settings" → "Domains"
3. 输入你的域名（如：perlerbeads.com）
4. 点击 "Add"

### 2. 配置 DNS

在你的域名服务商（如阿里云、腾讯云）添加记录：

**方式一：使用 CNAME（推荐）**
```
类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com
```

**方式二：使用 A 记录**
```
类型: A
主机记录: @
记录值: 76.76.21.21
```

等待 DNS 生效（通常 5-30 分钟），你的域名就可以访问了！

---

## 常见问题

### Q: 部署失败怎么办？

A: 查看构建日志，常见原因：
- 依赖安装失败 → 删除 `node_modules` 和 `package-lock.json`，重新 `npm install`
- TypeScript 错误 → 运行 `npm run build` 本地测试
- 环境变量缺失 → 检查是否添加了 `NEXT_PUBLIC_GA_ID`

### Q: 如何查看部署日志？

A: 在 Vercel 控制台，点击项目 → "Deployments" → 点击某次部署 → 查看 "Building" 日志

### Q: 如何回滚到之前的版本？

A: 在 "Deployments" 页面，找到之前的部署，点击 "..." → "Promote to Production"

### Q: 免费版有什么限制？

A: 个人项目完全够用：
- 100GB 带宽/月
- 无限部署次数
- 自动 HTTPS
- 全球 CDN

### Q: 如何更新网站？

A: 
- 方法一（GitHub）：推送代码到 GitHub，自动部署
- 方法二（CLI）：运行 `vercel --prod`

---

## 部署检查清单

部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] `.env.local` 已添加到 `.gitignore`（不要上传到 GitHub）
- [ ] 在 Vercel 添加了环境变量 `NEXT_PUBLIC_GA_ID`
- [ ] 本地运行 `npm run build` 测试构建成功
- [ ] 检查 `package.json` 中的依赖版本

部署后检查：

- [ ] 网站可以正常访问
- [ ] 图片上传功能正常
- [ ] 下载功能正常
- [ ] Google Analytics 正常追踪（在 GA 控制台查看实时数据）
- [ ] 手机端显示正常

---

## 技术支持

- Vercel 文档：https://vercel.com/docs
- Next.js 文档：https://nextjs.org/docs
- 遇到问题可以查看 Vercel 社区：https://github.com/vercel/vercel/discussions

---

## 性能优化建议

部署后可以做的优化：

1. **启用 Analytics**
   - 在 Vercel 项目设置中启用 "Analytics"
   - 查看网站性能指标

2. **配置缓存**
   - Vercel 自动配置了最佳缓存策略
   - 静态资源自动 CDN 加速

3. **图片优化**
   - Next.js 自动优化图片
   - 使用 WebP 格式

4. **监控**
   - 在 Google Analytics 查看访问数据
   - 在 Vercel Analytics 查看性能数据

祝部署顺利！🎉
