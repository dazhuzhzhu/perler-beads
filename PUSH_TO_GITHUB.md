# 🚀 推送代码到 GitHub

你的 GitHub 仓库：https://github.com/dazhuzhzhu/-.git

## 方法一：使用 GitHub Desktop（最简单）

### 1. 下载并安装 GitHub Desktop
- 访问：https://desktop.github.com/
- 下载并安装

### 2. 登录 GitHub
- 打开 GitHub Desktop
- 点击 "Sign in to GitHub.com"
- 登录你的账号

### 3. 添加本地仓库
- 点击 "File" → "Add local repository"
- 选择你的项目文件夹：`D:\Play\PinDou\PinDou\perler-beads-master`
- 点击 "Add repository"

### 4. 推送代码
- 点击 "Publish repository"
- 取消勾选 "Keep this code private"（如果想公开）
- 点击 "Publish repository"

完成！代码已上传到 GitHub。

---

## 方法二：使用命令行（需要解决网络问题）

### 问题诊断

你遇到的错误是网络连接问题。可能的原因：
1. 防火墙阻止
2. 代理设置
3. 网络不稳定

### 解决方案 A：配置代理（如果你使用代理）

```bash
# 如果你使用 HTTP 代理
git config --global http.proxy http://127.0.0.1:端口号
git config --global https.proxy http://127.0.0.1:端口号

# 例如，如果代理端口是 7890
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

然后重试：
```bash
git push -u origin main
```

### 解决方案 B：使用 SSH 方式

1. **生成 SSH 密钥**（如果还没有）：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```
一路回车即可。

2. **复制公钥**：
```bash
cat ~/.ssh/id_ed25519.pub
```
复制输出的内容。

3. **添加到 GitHub**：
- 访问：https://github.com/settings/keys
- 点击 "New SSH key"
- 粘贴公钥
- 点击 "Add SSH key"

4. **修改远程仓库地址**：
```bash
git remote set-url origin git@github.com:dazhuzhzhu/-.git
```

5. **推送**：
```bash
git push -u origin main
```

### 解决方案 C：重置 HTTP 版本

```bash
# 恢复默认设置
git config --global --unset http.version

# 重试推送
git push -u origin main
```

### 解决方案 D：使用 Personal Access Token

1. **生成 Token**：
- 访问：https://github.com/settings/tokens
- 点击 "Generate new token (classic)"
- 勾选 `repo` 权限
- 生成并复制 token

2. **推送时使用 token**：
```bash
git push -u origin main
```
- 用户名：你的 GitHub 用户名
- 密码：粘贴刚才的 token

---

## 方法三：手动上传（临时方案）

如果以上方法都不行，可以手动上传：

1. **打包项目**：
   - 压缩整个项目文件夹（除了 `node_modules` 和 `.next`）

2. **在 GitHub 上传**：
   - 访问：https://github.com/dazhuzhzhu/-
   - 点击 "Add file" → "Upload files"
   - 拖拽文件上传
   - 点击 "Commit changes"

**注意**：这种方式不推荐，因为会丢失 Git 历史记录。

---

## 验证上传成功

访问：https://github.com/dazhuzhzhu/-

应该能看到：
- src/ 文件夹
- public/ 文件夹
- package.json
- README.md
- 等等...

---

## 推送成功后的下一步

代码上传到 GitHub 后，就可以部署到 Vercel 了！

### 快速部署到 Vercel：

1. 访问：https://vercel.com
2. 用 GitHub 登录
3. 点击 "Add New..." → "Project"
4. 选择你的仓库：`dazhuzhzhu/-`
5. 添加环境变量：`NEXT_PUBLIC_GA_ID`
6. 点击 "Deploy"
7. 等待 2-3 分钟
8. 完成！

详细步骤查看：`README_DEPLOY.md`

---

## 需要帮助？

如果遇到问题：
1. 先尝试 GitHub Desktop（最简单）
2. 检查网络连接
3. 尝试不同的解决方案
4. 或者问我！

加油！🚀
