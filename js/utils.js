// ========== 工具函数 ==========

const UTILS = {
    // HTML 转义
    escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    // JS 字符串转义
    escapeJsString(str) {
        if (str == null) return '';
        return String(str)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
    },

    // 解析本地日期（避免时区偏差）
    parseLocalDate(dateStr) {
        const parts = dateStr.split('-').map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    },

    // 格式化日期
    formatDate(dateStr) {
        const d = this.parseLocalDate(dateStr);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
    },

    // 全局搜索（在所有数据中搜索关键词）
    async search(keyword) {
        if (!keyword || keyword.trim() === '') return [];
        const kw = keyword.toLowerCase();
        const data = await DATA_LOADER.get();
        const results = [];

        // 搜索新闻
        data.news.forEach(item => {
            if (item.title?.toLowerCase().includes(kw) || item.desc?.toLowerCase().includes(kw)) {
                results.push({ type: 'news', item });
            }
        });

        // 搜索主播
        data.streamers.forEach(item => {
            if (item.name?.toLowerCase().includes(kw) || item.role?.toLowerCase().includes(kw)) {
                results.push({ type: 'streamers', item });
            }
        });

        // 搜索赛程
        data.schedule.forEach(item => {
            if (item.title?.toLowerCase().includes(kw) || item.desc?.toLowerCase().includes(kw)) {
                results.push({ type: 'schedule', item });
            }
        });

        // 搜索切片
        data.clips.forEach(item => {
            if (item.title?.toLowerCase().includes(kw) || item.author?.toLowerCase().includes(kw)) {
                results.push({ type: 'clips', item });
            }
        });

        // 搜索排行榜
        Object.entries(data.rankings).forEach(([stage, list]) => {
            list.forEach(item => {
                if (item.name?.toLowerCase().includes(kw) || item.detail?.toLowerCase().includes(kw)) {
                    results.push({ type: 'rankings', item, stage });
                }
            });
        });

        return results;
    },

    // 防抖函数
    debounce(fn, delay = 300) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    // 下载 JSON 文件
    downloadJson(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

if (typeof window !== 'undefined') {
    window.UTILS = UTILS;
}
