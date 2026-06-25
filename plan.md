# 魔兽智商杯 网站升级计划

## 一、现有网站分析

### 1.1 架构概述
- **类型**: 纯静态单页应用（SPA），无后端
- **数据存储**: 单一 `js/data.js` 文件，包含所有数据（新闻、主播、赛程、切片、排行榜）
- **技术栈**: 原生 HTML + CSS + JavaScript，无框架依赖
- **部署状态**: 本地仓库，未配置 GitHub Pages 部署

### 1.2 现有问题
| 问题 | 影响 | 优先级 |
|------|------|--------|
| 数据集中在单文件 | 维护困难、数据不可独立管理 | 高 |
| 无数据编辑界面 | 需手动改代码才能更新数据 | 高 |
| 无 GitHub Pages 部署 | 无法在线访问 | 高 |
| 无数据持久化 | 刷新页面丢失通过UI添加的数据 | 中 |
| 缺少搜索/过滤 | 数据量大时难以查找 | 中 |
| 无暗/亮模式切换 | 用户体验单一 | 低 |
| 图片使用 picsum 占位 | 缺少真实内容 | 低 |

---

## 二、升级计划

### 阶段 1: 基础设施重构
- [x] 拆分 `data.js` → 5个独立 JSON 文件
- [x] 创建 `data/` 目录存放数据
- [x] 创建 JSON Schema 验证
- [x] 更新 `main.js` 为异步加载 JSON

### 阶段 2: 数据管理后台
- [x] 新增 `admin.html` 管理页面
- [x] 支持 CRUD 操作（增删改查）
- [x] localStorage 持久化（演示模式）
- [x] 数据导出为 JSON 功能
- [x] 导入 JSON 功能

### 阶段 3: GitHub Pages 部署集成
- [x] 创建 `.github/workflows/deploy.yml`
- [x] 配置自动构建与部署
- [x] 创建 `README.md` 部署说明

### 阶段 4: 功能增强
- [x] 全局搜索功能
- [x] 数据过滤/排序
- [x] 暗/亮模式切换
- [x] 加载动画优化
- [x] 响应式进一步优化

### 阶段 5: 文档与测试
- [x] 创建 `README.md`
- [x] 验证所有功能正常
- [x] 提交并推送 GitHub

---

## 三、文件结构升级

```
wowzsb/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自动部署
├── css/
│   ├── style.css               # 现有样式（保留+增强）
│   └── admin.css               # 管理后台样式
├── js/
│   ├── main.js                 # 主应用逻辑（改异步加载）
│   ├── admin.js                # 管理后台逻辑
│   ├── data-loader.js          # 数据加载器
│   └── utils.js                # 工具函数
├── data/
│   ├── news.json               # 最新战报
│   ├── streamers.json          # 主播阵容
│   ├── schedule.json           # 直播预告
│   ├── clips.json              # 切片集锦
│   └── rankings.json          # 智商排行榜
├── index.html                  # 主站（增强版）
├── admin.html                  # 数据管理后台
├── README.md                   # 项目文档
└── .gitignore                  # Git 忽略文件
```

---

## 四、技术方案

### 4.1 数据加载策略
```javascript
// 异步加载所有数据
async function loadAllData() {
    const [news, streamers, schedule, clips, rankings] = await Promise.all([
        fetch('data/news.json').then(r => r.json()),
        fetch('data/streamers.json').then(r => r.json()),
        fetch('data/schedule.json').then(r => r.json()),
        fetch('data/clips.json').then(r => r.json()),
        fetch('data/rankings.json').then(r => r.json())
    ]);
    return { news, streamers, schedule, clips, rankings };
}
```

### 4.2 数据持久化策略（无后端方案）
- 使用 `localStorage` 存储用户编辑的数据
- 管理后台提供导出/导入 JSON 功能
- 导出后可替换 `data/` 目录中的 JSON 文件并提交 GitHub
- 这种方式适合静态站点部署，无需服务器

### 4.3 GitHub Pages 部署
- 触发条件: push 到 main 分支
- 部署目标: `gh-pages` 分支
- 无需构建步骤（纯静态站点）
- 自定义域名支持（可选）

---

## 五、实现顺序

1. 先创建数据目录并拆分 JSON
2. 创建数据加载器模块
3. 改造 main.js 为异步加载
4. 创建 admin 管理后台
5. 配置 GitHub Actions 部署
6. 测试验证
7. 提交推送
