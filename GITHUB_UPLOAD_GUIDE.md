# 📤 上传项目到 GitHub 指南

## ✅ 第一步已完成

你的代码已经在本地 Git 仓库中了！现在需要上传到 GitHub。

---

## 🌐 第二步：在 GitHub 创建仓库

### 1. 打开 GitHub

访问：**https://github.com/new**

（如果没登录，先登录你的 GitHub 账号）

### 2. 填写仓库信息

- **Repository name**（仓库名）：`perler-beads`（或其他你喜欢的名字）
- **Description**（描述）：`拼豆图纸生成器 - 在线生成拼豆图案`
- **Public/Private**（公开/私有）：
  - 选择 **Public**（公开）- 免费，任何人可见
  - 或 **Private**（私有）- 只有你能看到
- **不要勾选**：
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license

### 3. 点击 "Create repository"

创建完成后，GitHub 会显示一个页面，上面有推送代码的命令。

---

## 📤 第三步：推送代码到 GitHub

### 复制你的仓库地址

在 GitHub 创建仓库后，你会看到类似这样的地址：

```
https://github.com/你的用户名/perler-beads.git
```

### 在项目文件夹运行以下命令

**方式一：使用 HTTPS（推荐）**

```bash
# 1. 关联远程仓库（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/perler-beads.git

# 2. 重命名分支为 main
git branch -M main

# 3. 推送代码
git push -u origin main
```

**方式二：使用 SSH（需要配置 SSH 密钥）**

```bash
git remote add origin git@github.com:你的用户名/perler-beads.git
git branch -M main
git push -u origin main
```

### 如果推送时要求输入账号密码

- **用户名**：你的 GitHub 用户名
- **密码**：需要使用 Personal Access Token（不是登录密码）

#### 如何获取 Personal Access Token：

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写：
   - Note: `perler-beads-deploy`
   - Expiration: 选择有效期
   - 勾选：`repo`（所有权限）
4. 点击 "Generate token"
5. **复制生成的 token**（只显示一次，保存好）
6. 在推送时，密码处粘贴这个 token

---

## ✅ 第四步：验证上传成功

1. 刷新你的 GitHub 仓库页面
2. 应该能看到所有文件已经上传
3. 看到类似这样的文件列表：
   - src/
   - public/
   - package.json
   - README.md
   - 等等...

---

## 🎉 完成！现在可以部署到 Vercel 了

代码已经在 GitHub 上了，现在可以：

1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 导入你的仓库
4. 部署！

详细步骤查看：`README_DEPLOY.md`

---

## 🔄 以后如何更新代码？

每次修改代码后：

```bash
# 1. 查看修改了哪些文件
git status

# 2. 添加所有修改
git add .

# 3. 提交修改
git commit -m "描述你的修改"

# 4. 推送到 GitHub
git push
```

Vercel 会自动检测到更新并重新部署！

---

## ❓ 常见问题

### Q: 推送时提示 "Permission denied"

A: 需要配置 Personal Access Token，参考上面的步骤。

### Q: 推送时提示 "remote origin already exists"

A: 说明已经关联过了，直接运行：
```bash
git push -u origin main
```

### Q: 推送时提示 "failed to push some refs"

A: 先拉取远程代码：
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Q: 如何查看远程仓库地址？

A: 运行：
```bash
git remote -v
```

### Q: 如何修改远程仓库地址？

A: 运行：
```bash
git remote set-url origin https://github.com/新用户名/新仓库名.git
```

---

## 📝 下一步

代码上传到 GitHub 后：

1. ✅ 代码已备份到云端
2. ✅ 可以在任何地方访问
3. ✅ 可以部署到 Vercel
4. ✅ 可以与他人协作

现在去部署吧！查看 `README_DEPLOY.md` 开始部署到 Vercel。

---

## 🆘 需要帮助？

如果遇到问题：
1. 检查 GitHub 仓库是否创建成功
2. 确认 Git 命令是否正确执行
3. 查看错误信息，搜索解决方案
4. 或者问我！

祝你上传顺利！🚀
