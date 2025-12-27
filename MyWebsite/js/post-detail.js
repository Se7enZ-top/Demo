/**
 * 文章详情页 Vue 应用
 */
const { createApp, ref, onMounted, computed, nextTick } = Vue;

createApp({
    setup() {
        const post = ref(null);
        const markdownRaw = ref("");
        const loading = ref(true);

        onMounted(async () => {
            try {
                // 1. 获取 URL 中的 ID 参数
                const params = new URLSearchParams(window.location.search);
                const idFromUrl = params.get('id');
                
                if (!idFromUrl) {
                    loading.value = false;
                    return;
                }

                // 2. 加载文章索引
                const resIndex = await fetch('data/posts.json');
                if (!resIndex.ok) throw new Error("无法加载文章索引");
                
                const posts = await resIndex.json();
                
                // 3. 查找文章 (强制将 idFromUrl 转为数字进行对比)
                const foundPost = posts.find(p => p.id === Number(idFromUrl));

                if (foundPost) {
                    post.value = foundPost;
                    
                    // 4. 加载 Markdown 文件
                    const resContent = await fetch(foundPost.path);
                    if (resContent.ok) {
                        markdownRaw.value = await resContent.text();
                    } else {
                        markdownRaw.value = "# 😅 内容加载失败\n抱歉，该文章的 Markdown 文件路径（" + foundPost.path + "）无法访问。";
                    }
                }
            } catch (err) {
                console.error('详情页初始化错误:', err);
            } finally {
                loading.value = false;
                
                // 5. 等待内容渲染后执行代码高亮
                await nextTick();
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        });

        // 使用计算属性将 Markdown 转为 HTML
        const renderedContent = computed(() => {
            if (!markdownRaw.value) return "";
            // 配置 marked（可选）
            marked.setOptions({
                breaks: true, // 支持换行符
                gfm: true     // 启用 GitHub 风格的 Markdown
            });
            return marked.parse(markdownRaw.value);
        });

        return { post, loading, renderedContent };
    }
}).mount('#app');
