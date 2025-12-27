/**
 * 博客列表页 Vue 应用
 */
const { createApp, ref, onMounted, computed, watch } = Vue;

createApp({
    setup() {
        const posts = ref([]);
        const loading = ref(true);
        const selectedCategory = ref("");
        
        // 搜索逻辑相关
        const searchQuery = ref("");
        const debouncedQuery = ref("");
        let timeoutId = null;

        // 分页相关
        const currentPage = ref(1);
        const pageSize = 5; // 每页显示 5 篇

        // 监听搜索输入实施防抖
        watch(searchQuery, (newVal) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                debouncedQuery.value = newVal;
                currentPage.value = 1; // 搜索时重置页码
            }, 300);
        });

        // 监听分类切换重置页码
        watch(selectedCategory, () => {
            currentPage.value = 1;
        });

        onMounted(async () => {
            try {
                const res = await fetch('data/posts.json');
                if (!res.ok) throw new Error('加载文章列表失败');
                posts.value = await res.json();
            } catch (err) {
                console.error("加载文章列表失败", err);
            } finally {
                loading.value = false;
            }
        });

        const categories = computed(() => {
            const allCats = posts.value.map(p => p.category);
            return [...new Set(allCats)];
        });

        const getCount = (cat) => {
            return posts.value.filter(p => p.category === cat).length;
        };

        // 核心过滤逻辑：基于分类和防抖后的搜索词
        const filteredPosts = computed(() => {
            return posts.value.filter(post => {
                const matchesCat = selectedCategory.value === "" || post.category === selectedCategory.value;
                const query = debouncedQuery.value.toLowerCase();
                const matchesSearch = post.title.toLowerCase().includes(query) || 
                                    (post.excerpt && post.excerpt.toLowerCase().includes(query));
                return matchesCat && matchesSearch;
            });
        });

        // 分页切片逻辑
        const paginatedPosts = computed(() => {
            const start = (currentPage.value - 1) * pageSize;
            const end = start + pageSize;
            return filteredPosts.value.slice(start, end);
        });

        // 总页数计算
        const totalPages = computed(() => {
            return Math.ceil(filteredPosts.value.length / pageSize) || 1;
        });

        return { 
            posts, 
            loading, 
            searchQuery, 
            selectedCategory, 
            categories, 
            getCount, 
            filteredPosts, 
            paginatedPosts, 
            currentPage, 
            totalPages 
        };
    }
}).mount('#app');
