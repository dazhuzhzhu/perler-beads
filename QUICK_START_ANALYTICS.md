# Google Analytics 快速开始

## 5分钟快速配置

### 第一步：获取 Google Analytics ID

1. 访问 https://analytics.google.com/
2. 登录 Google 账号
3. 点击左下角"管理"（齿轮图标）
4. 点击"创建媒体资源"
5. 填写网站信息后，选择"网站"数据流
6. 复制"衡量ID"（格式：G-XXXXXXXXXX）

### 第二步：本地测试（可选）

创建 `.env.local` 文件：
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

重启开发服务器：
```bash
npm run dev
```

### 第三步：部署到生产环境

在 Vercel 部署设置中：
1. 进入项目设置 → Environment Variables
2. 添加变量：
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX`
3. 重新部署项目

### 完成！

现在你可以在 Google Analytics 中查看：
- 实时访问用户
- 页面浏览量
- 用户地理位置
- 设备类型
- 自定义事件（上传、下载、导出等）

## 查看数据

访问 https://analytics.google.com/
- 实时报告：查看当前在线用户
- 事件报告：查看各种操作次数
- 用户报告：查看总访问量和用户数

## 已追踪的事件

✅ 图片上传
✅ 生成像素画
✅ 下载图纸（简洁版/完整版）
✅ 导出物料清单
✅ 切换色号系统

数据通常有 24-48 小时延迟（实时报告除外）
