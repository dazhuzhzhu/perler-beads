# Google Analytics 集成说明

## 1. 获取 Google Analytics ID

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 登录你的 Google 账号
3. 创建新的媒体资源（如果还没有）
   - 点击"管理"（左下角齿轮图标）
   - 点击"创建媒体资源"
   - 填写网站名称、时区等信息
4. 创建数据流
   - 选择"网站"
   - 输入网站URL和名称
5. 获取衡量ID
   - 在数据流详情页面，找到"衡量ID"
   - 格式类似：`G-XXXXXXXXXX`

## 2. 配置项目

创建 `.env.local` 文件（不要提交到Git）：

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

将 `G-XXXXXXXXXX` 替换为你的实际衡量ID。

## 3. 部署到生产环境

在部署平台（如Vercel）添加环境变量：
- 变量名：`NEXT_PUBLIC_GA_ID`
- 变量值：你的Google Analytics衡量ID

## 4. 已集成的追踪事件

项目已经集成了以下事件追踪：

### 自动追踪
- 页面浏览量
- 用户会话
- 地理位置
- 设备类型

### 自定义事件（需要在代码中调用）
- `trackImageUpload(fileSize)` - 图片上传
- `trackPixelation(gridSize)` - 生成像素画
- `trackDownload(type)` - 下载图纸（简洁版/完整版）
- `trackExportMaterialList(colorSystem)` - 导出物料清单
- `trackColorSystemChange(colorSystem)` - 切换色号系统

## 5. 在代码中使用

```typescript
import { trackImageUpload, trackDownload } from '@/lib/analytics';

// 追踪图片上传
trackImageUpload(file.size);

// 追踪下载
trackDownload('simple'); // 或 'full'
```

## 6. 查看数据

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 选择你的媒体资源
3. 查看实时报告、用户报告、事件报告等

### 主要指标
- **实时用户**：当前在线用户数
- **用户总数**：总访问用户数
- **会话数**：访问次数
- **事件数**：各种操作次数
- **转化率**：可以设置目标转化

## 7. 注意事项

- `.env.local` 文件不要提交到Git（已在.gitignore中）
- 生产环境必须配置环境变量才能启用追踪
- 开发环境可以不配置，不影响功能
- 数据通常有24-48小时延迟（实时报告除外）
