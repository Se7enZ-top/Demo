/**
 * ==========================================================================
 * 主题管理模块
 * ==========================================================================
 */

// Highlight.js 主题配置
const HLJS_THEMES = {
    light: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css',
    dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
};

/**
 * 初始化主题
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeLink = document.getElementById('hljs-theme');

    if (savedTheme === 'dark') {
        // 同时给 html 和 body 添加 dark-mode 类以确保样式正确应用
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        // 如果在详情页，确保初始化时加载深色代码样式
        if (themeLink) {
            themeLink.href = HLJS_THEMES.dark;
        }
    }
}

/**
 * 切换主题
 */
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    // 同时切换 html 元素的类
    document.documentElement.classList.toggle('dark-mode', isDark);
    
    // 保存用户偏好
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // 动态切换 Highlight.js 主题
    const themeLink = document.getElementById('hljs-theme');
    if (themeLink) {
        themeLink.href = isDark ? HLJS_THEMES.dark : HLJS_THEMES.light;
    }
}

/**
 * ==========================================================================
 * 组件加载模块
 * ==========================================================================
 */

/**
 * 通过 Fetch API 加载外部 HTML 片段并注入到指定 ID 的容器中
 * @param {string} elementId - 容器的 ID
 * @param {string} filePath - HTML 文件的路径
 * @returns {Promise<void>}
 */
function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`组件容器不存在: ${elementId}`);
        return Promise.resolve();
    }

    return fetch(filePath)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.text();
        })
        .then(data => {
            container.innerHTML = data;
        })
        .catch(err => {
            console.error(`加载组件失败 [${elementId}]:`, err);
        });
}

/**
 * ==========================================================================
 * 页面初始化
 * ==========================================================================
 */

/**
 * 页面加载完成后的初始化操作
 */
document.addEventListener("DOMContentLoaded", function() {
    // 异步加载公共组件
    loadComponent("header", "components/header.html");
    loadComponent("footer", "components/footer.html");

    // 初始化主题
    initTheme();

    // 检查当前页面是否存在侧边栏容器，有则加载
    const sidebar = document.getElementById("sidebar-container");
    if (sidebar && sidebar.innerHTML.trim() === "") {
        loadComponent("sidebar-container", "components/sidebar.html");
    }
});
