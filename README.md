# 魔兽智商杯 - 数据聚合站

> 夏一可组织的欢乐团本开荒节目，全员自带智商值，犯错扣智商，智商最低三人接受"开庭"惩罚。

## 🚀 在线访问

部署在 GitHub Pages：

**主站**: [https://your-username.github.io/wowzsb/](https://your-username.github.io/wowzsb/)  
**数据管理**: [https://your-username.github.io/wowzsb/admin.html](https://your-username.github.io/wowzsb/admin.html)

> 将 `your-username` 替换为你的 GitHub 用户名。

---

## 📁 项目结构

```
wowzsb/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自动部署
├── css/
│   ├── style.css               # 主站样式
│   └── admin.css               # 管理后台样式
├── js/
│   ├── data-loader.js          # 数据异步加载器
│   ├── utils.js                # 工具函数
│   ├── main.js                 # 主站逻辑
│   └── admin.js                # 管理后台逻辑
├── data/
│   ├── news.json               # 最新战报
│   ├── streamers.json          # 主播阵容
│   ├── schedule.json           # 直播预告
│   ├── clips.json              # 切片集锦
│   └── rankings.json          # 智商排行榜
├── index.html                  # 主站
├── admin.html                  # 数据管理后台
├── README.md                   # 本文件
└── .gitignore                  # Git 忽略规则
```

---

## ✨ 功能特性

### 主站 (index.html)
- **单页应用**: 5个页面无缝切换（首页、主播阵容、直播预告、切片集锦、智商榜）
- **全局搜索**: 支持搜索所有数据类型（Ctrl + 点击 🔍 或导航栏搜索按钮）
- **暗/亮模式**: 支持切换主题，自动跟随系统偏好
- **倒计时**: 实时显示距离下期直播的时间
- **响应式**: 完美适配手机、平板、桌面端

### 数据管理后台 (admin.html)
- **数据管理**: 对新闻、主播、赛程、切片、排行榜进行增删改查
- **localStorage 持久化**: 编辑的数据自动保存到浏览器
- **导出 JSON**: 一键下载所有数据文件，替换到 `data/` 目录即可
- **导入 JSON**: 上传 JSON 文件批量更新数据
- **重置默认**: 一键恢复初始数据

---

## 🛠️ 数据管理流程

### 方式一：通过网页后台管理（推荐）
1. 打开 `admin.html` 管理后台
2. 在各个标签页中编辑、添加、删除数据
3. 点击「导出 JSON」下载数据文件
4. 将下载的 JSON 文件替换到 `data/` 目录
5. 提交并推送 GitHub，自动部署更新

### 方式二：直接编辑 JSON 文件
1. 编辑 `data/` 目录下的 JSON 文件
2. 提交并推送 GitHub
3. GitHub Actions 自动部署

---

## 🚀 部署到 GitHub Pages

### 1. 创建 GitHub 仓库
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/wowzsb.git
git push -u origin main
```

### 2. 启用 GitHub Pages
1. 打开 GitHub 仓库 → Settings → Pages
2. Source 选择 "GitHub Actions"
3. 已自动配置 `.github/workflows/deploy.yml`，无需额外操作

### 3. 自动部署
每次 push 到 `main` 分支时，GitHub Actions 会自动部署到 GitHub Pages。

---

## 📝 技术栈

- **前端**: 原生 HTML5 + CSS3 + JavaScript (ES6+)
- **数据存储**: 静态 JSON + localStorage（演示持久化）
- **部署**: GitHub Actions → GitHub Pages
- **无框架依赖**: 纯原生实现，零构建步骤

---

## 🎨 设计

- 深色主题为主，支持亮色模式切换
- 橙色 (#FF6B35) + 青色 (#4ECDC4) 为主色调
- 毛玻璃导航栏、卡片悬浮动效
- 全面响应式适配

---

## 📄 License

本项目为粉丝聚合站，数据仅供参考。所有内容版权归原作者。
