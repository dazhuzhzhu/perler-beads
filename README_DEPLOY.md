# 🎯 现在开始部署！

## 你需要做的事情（按顺序）

### ✅ 第一步：确保代码在 GitHub 上

**如果还没有推送到 GitHub：**

1. 打开 https://github.com/new
2. 创建新仓库（名字随意，如：`perler-beads`）
3. 在项目文件夹运行：

```bash
git init
git add .
git commit -m "准备部署"
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

**如果已经在 GitHub 上：**
- 跳过这一步 ✓

---

### ✅ 第二步：部署到 Vercel

#### 方式 A：网页部署（推荐，超简单）

1. **打开** https://vercel.com
2. **登录** - 点击 "Continue with GitHub"
3. **导入项目**：
   - 点击 "Add New..." → "Project"
   - 找到你的仓库，点击 "Import"
4. **添加环境变量**：
   - 展开 "Environment Variables"
   - 添加：`NEXT_PUBLIC_GA_ID` = 你的GA ID
5. **点击 "Deploy"**
6. **等待 2-3 分钟** ☕
7. **完成！** 🎉

你会得到一个网址，类似：`https://your-project.vercel.app`

#### 方式 B：命令行部署

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 添加环境变量
vercel env add NEXT_PUBLIC_GA_ID

# 5. 生产部署
vercel --prod
```

---

### ✅ 第三步：测试网站

打开你的 Vercel 网址，测试：

- [ ] 网站能打开
- [ ] 上传图片功能正常
- [ ] 生成拼豆图纸正常
- [ ] 下载功能正常
- [ ] 手机访问正常

---

## 🎊 恭喜！你的网站已经上线了！

### 以后如何更新？

每次修改代码后：

```bash
git add .
git commit -m "更新内容"
git push
```

Vercel 会自动重新部署，1-2 分钟后网站就更新了！

---

## 📱 分享你的网站

你可以把网址分享给朋友：
- Vercel 提供的网址：`https://your-project.vercel.app`
- 或者绑定你自己的域名（在 Vercel 设置中）

---

## 🆘 遇到问题？

### 部署失败
- 查看 Vercel 的构建日志
- 确保 `package.json` 中的依赖都正确

### 网站打不开
- 等待几分钟，DNS 需要时间
- 清除浏览器缓存

### Google Analytics 不工作
- 确认添加了环境变量 `NEXT_PUBLIC_GA_ID`
- 检查 GA ID 格式（G-XXXXXXXXXX）
- 重新部署一次

---

## 📚 更多帮助

- 快速指南：`QUICK_DEPLOY.md`
- 详细指南：`DEPLOY_GUIDE.md`
- Vercel 文档：https://vercel.com/docs

---

## 💡 小贴士

1. **免费额度**：Vercel 个人项目完全免费，100GB 带宽/月
2. **自动部署**：推送到 GitHub 就自动部署，超方便
3. **全球加速**：Vercel 有全球 CDN，访问速度很快
4. **HTTPS**：自动配置 SSL 证书，安全可靠

开始部署吧！有问题随时问我 😊
