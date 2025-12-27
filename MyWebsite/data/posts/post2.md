# Se7enZ 个人网站

一个简洁优雅的个人网站，展示个人简介、博客文章、项目作品和开发工具。采用纯前端技术栈，支持深色/浅色主题切换，响应式设计，数据驱动的内容管理（本项目由Cursor实现）。

## 📋 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [内容管理](#内容管理)
- [部署方法](#部署方法)
- [开发指南](#开发指南)
- [注意事项](#注意事项)

## ✨ 功能特性

- 🎨 **现代化UI设计** - 简洁优雅的界面设计，支持深色/浅色主题切换
- 📱 **响应式布局** - 完美适配桌面端、平板和移动设备
- 📝 **博客系统** - 支持 Markdown 格式文章，分类筛选，搜索功能，分页展示
- 💼 **作品展示** - 动态展示项目作品，支持标签、状态、图片展示
- 🛠️ **工具集合** - 展示开发者工具集合
- ⚡ **性能优化** - 纯前端实现，无后端依赖，加载速度快
- 🎯 **SEO友好** - 完整的 meta 标签和语义化 HTML
- 🌓 **主题持久化** - 自动保存用户主题偏好

## 🛠 技术栈

### 核心框架
- **HTML5** - 语义化标记
- **CSS3** - 现代化样式，CSS变量，Flexbox/Grid布局
- **JavaScript (ES6+)** - 原生 JavaScript，模块化设计

### 前端库
- **Vue.js 3** (CDN) - 用于博客、项目、工具页面的动态渲染
  - Composition API
  - 响应式数据绑定
  - 计算属性与监听器

### 内容处理
- **Marked.js** (CDN) - Markdown 转 HTML
- **Highlight.js** (CDN) - 代码语法高亮

### 数据格式
- **JSON** - 用于存储博客、项目、工具数据

## 📁 项目结构

```
myWebsite/
├── index.html              # 首页
├── blog.html               # 博客列表页
├── post-detail.html        # 博客详情页
├── projects.html           # 项目展示页
├── tools.html              # 工具集合页
├── contact.html            # 联系页面
│
├── components/             # 公共组件
│   ├── header.html        # 导航栏组件
│   ├── footer.html        # 页脚组件
│   └── sidebar.html       # 侧边栏组件（博客详情页使用）
│
├── css/
│   └── style.css          # 主样式文件（包含所有样式）
│
├── js/
│   ├── main.js            # 核心功能（组件加载、主题管理）
│   ├── blog.js            # 博客页面逻辑（可选）
│   └── post-detail.js     # 文章详情页逻辑（可选）
│
├── data/
│   ├── posts.json         # 博客文章索引
│   ├── projects.json      # 项目数据
│   ├── tools.json         # 工具数据
│   └── posts/             # 博客文章 Markdown 文件
│       ├── post1.md
│       └── ...
│
├── images/
│   └── favicon.ico        # 网站图标
│
└── README.md              # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- 现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）
- 本地服务器（用于开发，避免 CORS 问题）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd myWebsite
   ```

2. **启动本地服务器**

   使用 Python（推荐）：
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   或使用 Node.js：
   ```bash
   # 安装 http-server
   npm install -g http-server
   
   # 启动服务
   http-server -p 8000
   ```

   或使用 PHP：
   ```bash
   php -S localhost:8000
   ```

3. **访问网站**
   
   打开浏览器访问：`http://localhost:8000`

## 📝 内容管理

### 博客文章管理

#### 添加新文章

1. **创建 Markdown 文件**
   
   在 `data/posts/` 目录下创建新的 `.md` 文件，例如 `post3.md`：
   ```markdown
   # 文章标题
   
   这里是文章内容...
   ```

2. **更新文章索引**
   
   编辑 `data/posts.json`，添加新文章信息：
   ```json
   {
       "id": 4,
       "title": "新文章标题",
       "date": "2025-12-27",
       "category": "技术",
       "coreWord": "关键词",
       "excerpt": "文章摘要",
       "path": "data/posts/post3.md"
   }
   ```

#### 文章字段说明

- `id` - 唯一标识符（数字）
- `title` - 文章标题
- `date` - 发布日期（格式：YYYY-MM-DD）
- `category` - 文章分类（如：技术、生活）
- `coreWord` - 核心关键词（显示在文章卡片上）
- `excerpt` - 文章摘要（可选）
- `path` - Markdown 文件相对路径

### 项目管理

编辑 `data/projects.json` 添加或修改项目：

```json
{
    "id": 3,
    "title": "项目名称",
    "description": "项目描述",
    "image": "项目图片URL（可选）",
    "tags": ["标签1", "标签2"],
    "date": "2025-12-27",
    "link": "项目链接",
    "status": "已完成" // 或 "进行中"、"计划中"
}
```

### 工具管理

编辑 `data/tools.json` 添加或修改工具：

```json
{
    "id": 4,
    "title": "工具名称",
    "description": "工具描述",
    "icon": "🔧", // Emoji 图标
    "category": "分类",
    "link": "工具链接"
}
```

### 修改个人信息

1. **首页简介**
   
   编辑 `index.html` 中的个人信息部分

2. **导航栏**
   
   编辑 `components/header.html` 修改导航链接

3. **页脚信息**
   
   编辑 `components/footer.html` 修改版权信息

## 🚢 部署方法

### 方法一：GitHub Pages（推荐）

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 `main` 分支，`/ (root)` 目录
   - 点击 Save

3. **访问网站**
   - 访问：`https://yourusername.github.io/your-repo/`

### 方法二：Vercel

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **部署**
   ```bash
   vercel
   ```

3. **或使用 Web 界面**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库
   - 自动部署

### 方法三：Netlify

1. **拖拽部署**
   - 访问 [netlify.com](https://netlify.com)
   - 将项目文件夹拖拽到部署区域

2. **Git 部署**
   - 连接 GitHub 仓库
   - 自动部署和更新

### 方法四：传统服务器部署

1. **上传文件**
   ```bash
   # 使用 FTP/SFTP 上传所有文件到服务器
   scp -r . user@your-server:/var/www/html/
   ```

2. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

3. **配置 Apache**
   
   确保 `.htaccess` 文件存在（如果需要）：
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [L]
   ```

### 方法五：Docker 部署

创建 `Dockerfile`：
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建和运行：
```bash
docker build -t mywebsite .
docker run -d -p 80:80 mywebsite
```

## 💻 开发指南

### 样式修改

所有样式都在 `css/style.css` 中，采用模块化组织：

- CSS 变量定义在 `:root` 中，方便主题定制
- 深色模式变量在 `body.dark-mode` 中
- 各功能模块都有清晰的注释分隔

### 添加新页面

1. 创建新的 HTML 文件
2. 复制基础结构（包含 header 和 footer）
3. 添加防主题闪烁脚本
4. 引入 `css/style.css` 和 `js/main.js`

### 主题定制

修改 `css/style.css` 中的 CSS 变量：

```css
:root {
    --bg-color: #f8f9fa;
    --card-bg: #ffffff;
    --text-primary: #2d3436;
    --accent-color: #0984e3;
    /* ... 更多变量 */
}
```

### 组件化开发

公共组件位于 `components/` 目录：
- 通过 `js/main.js` 中的 `loadComponent()` 函数加载
- 组件会自动注入到指定 ID 的容器中

## ⚠️ 注意事项

### 路径问题

1. **相对路径**：所有文件使用相对路径，确保目录结构正确
2. **JSON 路径**：确保 JSON 文件路径正确，否则会加载失败
3. **Markdown 路径**：`posts.json` 中的 `path` 字段必须是相对路径

### 浏览器兼容性

- 需要支持 ES6+ 的现代浏览器
- CSS Grid 和 Flexbox 支持
- CSS 变量支持

### 性能优化建议

1. **图片优化**：压缩图片，使用 WebP 格式
2. **CDN 加速**：第三方库已使用 CDN，无需本地化
3. **缓存策略**：部署时配置适当的缓存头

### 常见问题

**Q: 主题切换后刷新页面会闪烁？**  
A: 已在 `<head>` 中添加防闪烁脚本，确保主题在渲染前应用。

**Q: Markdown 代码高亮不工作？**  
A: 确保 `post-detail.html` 中正确引入了 Highlight.js 库和主题。

**Q: 组件加载失败？**  
A: 检查文件路径是否正确，确保使用本地服务器而不是直接打开 HTML 文件。

## 📄 许可证

本项目采用 MIT 许可证。

## 👤 作者

Cursor Se7enZ

## 🙏 致谢

- Vue.js - 渐进式 JavaScript 框架
- Marked.js - Markdown 解析器
- Highlight.js - 代码语法高亮
- 所有使用的开源项目和工具

---

**Stay Hungry, Stay Foolish**
