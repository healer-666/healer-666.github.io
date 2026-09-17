# W 的个人主页

网站：<https://healer-666.github.io/>

源码：<https://github.com/healer-666/healer-666.github.io>

Hugo + PaperMod，使用 Markdown 管理内容。`main` 保存源码，GitHub Actions 构建后通过 Pages 发布；无需提交 `public/`。

## 本地预览

Hugo 版本固定在 `.hugo-version`（0.157.0），PaperMod 通过 Git 子模块固定提交。此组合经过构建验证；更新 Hugo 时需检查主题兼容性。

```sh
git clone --recurse-submodules https://github.com/healer-666/healer-666.github.io.git
cd healer-666.github.io
hugo server -D
```

浏览器打开 <http://localhost:1313/>。`-D` 包含草稿，正式构建不发布草稿。

当前 Windows 工作区已准备便携版 Hugo，可以直接运行：

```powershell
cd E:\GitHub\healer-666.github.io
.\scripts\hugo.ps1 server -D
```

其他电脑请从 [Hugo 官方安装说明](https://gohugo.io/installation/) 安装 `.hugo-version` 指定版本；此站不依赖 Node.js、Go 或 Dart Sass。

如果克隆时遗漏主题：

```sh
git submodule update --init --recursive
```

## 发布文章

```sh
hugo new content posts/my-first-note.md
```

Windows 便携版对应命令：`.\scripts\hugo.ps1 new content posts/my-first-note.md`。

编辑新建的 Markdown 文件：

```toml
+++
title = '文章标题'
date = 2026-09-15T12:00:00+08:00
draft = false
description = '搜索结果中的简短描述'
summary = '文章列表中显示的摘要'
tags = ['AI Agents', '论文阅读']
categories = ['论文阅读笔记']
+++
```

下面直接写 Markdown 正文。新文章默认 `draft = true`，准备公开时改成 `false`；日期不要晚于实际发布时间。博客默认按日期倒序排列，每页 10 篇，首页显示最新 3 篇。

```sh
git add content/
git commit -m "Add a new note"
git push origin main
```

推送后在仓库 [Actions](https://github.com/healer-666/healer-666.github.io/actions) 查看构建和部署结果。草稿在公开仓库的源码中仍可见，勿在草稿中存放私密信息。

## 修改个人资料

| 内容 | 文件 |
| --- | --- |
| 首页姓名、个人简介、联系方式 | `content/_index.md` |
| 关于我（隐藏草稿） | `content/about.md` |
| 链接（隐藏草稿） | `content/links.md` |
| 站点名、作者、简介和导航 | `hugo.toml` |
| 第一篇博客 | `content/posts/baoyan-experience.md` |

当前导航仅保留首页和博客，主体内容使用中文。个人简介使用站点所有者提供的原文，关于我和链接页保留为草稿，不在正式网站发布。修改姓名或邮箱时同步更新上表对应页面。

## 目录与扩展

```text
content/
  _index.md             # 首页
  about.md              # 隐藏草稿
  links.md              # 隐藏草稿
  posts/                # 博客与文章
  research/_index.md    # 预留草稿
  projects/_index.md    # 预留草稿
  publications/_index.md
  cv.md                 # 预留草稿
archetypes/             # 新内容模板
assets/css/extended/    # 主题样式扩展
layouts/home.html      # Hugo 首页 override
static/                # 图标、图片、未来的简历 PDF
themes/PaperMod/       # Git 子模块，不直接修改
scripts/               # 构建检查与 Windows 便捷命令
.github/workflows/     # Actions 自动部署
```

发布 Research、Projects、Publications 或 CV：

1. 补充对应 Markdown 页面，将该页的 `draft` 改为 `false`。
2. 子页面也各自设置 `draft`；父级草稿状态不会自动使所有子页面成为草稿。
3. 在 `hugo.toml` 添加导航，例如：

```toml
[[menus.main]]
  identifier = 'research'
  name = 'Research'
  pageRef = '/research'
  weight = 25
```

论文和项目在相应目录内新增 Markdown 文件即可。简历 PDF 可放在 `static/files/cv.pdf`，并从 `content/cv.md` 链接到 `/files/cv.pdf`。

## 构建与部署检查

```sh
hugo --gc --minify --panicOnWarning
python scripts/check_site.py
```

检查页面、站内链接、静态资源、锚点、RSS 和 sitemap。Pull Request 只执行构建检查；推送 `main` 或手动运行工作流才部署。发布产物、截图和缓存均不提交 Git。

GitHub 仓库 Settings → Pages → Source 应设为 **GitHub Actions**。部署使用内置 `GITHUB_TOKEN` 与 Pages OIDC 权限，无需保存个人访问令牌。

## 升级依赖

升级 Hugo 时修改 `.hugo-version`，同时更新本地 Hugo 后执行构建检查。

升级 PaperMod 时执行：

```sh
git submodule update --remote themes/PaperMod
hugo --gc --minify --panicOnWarning
python scripts/check_site.py
git add themes/PaperMod
git commit -m "Update PaperMod"
```

检查通过后再推送。样式在 `assets/css/extended/academic.css`，首页模板在 `layouts/home.html`，无需改动主题源码。

参考：[Hugo GitHub Pages 官方指南](https://gohugo.io/host-and-deploy/host-on-github-pages/) · [PaperMod 安装说明](https://github.com/adityatelange/hugo-PaperMod/wiki/Installation)。
