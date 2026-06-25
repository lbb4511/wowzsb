// ========== 数据加载器 ==========
// 从 data/ 目录异步加载 JSON 数据，支持 localStorage 覆盖

const DATA_LOADER = {
    // 数据缓存
    _cache: null,

    // 各数据类型的 localStorage 键名
    _keys: {
        news: 'wowzsb_news',
        streamers: 'wowzsb_streamers',
        schedule: 'wowzsb_schedule',
        clips: 'wowzsb_clips',
        rankings: 'wowzsb_rankings'
    },

    // 原始 JSON 路径
    _paths: {
        news: 'data/news.json',
        streamers: 'data/streamers.json',
        schedule: 'data/schedule.json',
        clips: 'data/clips.json',
        rankings: 'data/rankings.json'
    },

    // 加载所有数据
    async loadAll() {
        if (this._cache) return this._cache;

        try {
            const [news, streamers, schedule, clips, rankings] = await Promise.all([
                this._loadOne('news'),
                this._loadOne('streamers'),
                this._loadOne('schedule'),
                this._loadOne('clips'),
                this._loadOne('rankings')
            ]);

            this._cache = { news, streamers, schedule, clips, rankings };
            return this._cache;
        } catch (err) {
            console.error('数据加载失败:', err);
            throw err;
        }
    },

    // 加载单个数据类型（优先 localStorage，回退 JSON 文件）
    async _loadOne(type) {
        // 先尝试 localStorage
        const ls = localStorage.getItem(this._keys[type]);
        if (ls) {
            try {
                return JSON.parse(ls);
            } catch (e) {
                console.warn(`localStorage ${type} 解析失败，回退到 JSON 文件`);
            }
        }

        // 回退到 JSON 文件
        const res = await fetch(this._paths[type] + '?v=' + Date.now());
        if (!res.ok) throw new Error(`加载 ${type} 失败: ${res.status}`);
        return await res.json();
    },

    // 获取当前数据（已加载时直接返回）
    async get() {
        return this._cache || await this.loadAll();
    },

    // 保存数据到 localStorage（管理后台用）
    save(type, data) {
        localStorage.setItem(this._keys[type], JSON.stringify(data));
        if (this._cache) this._cache[type] = data;
    },

    // 导出所有数据为 JSON 对象（用于下载）
    async exportAll() {
        const data = await this.get();
        return {
            news: [...data.news],
            streamers: [...data.streamers],
            schedule: [...data.schedule],
            clips: [...data.clips],
            rankings: JSON.parse(JSON.stringify(data.rankings))
        };
    },

    // 导入数据（覆盖 localStorage）
    importAll(data) {
        for (const type of Object.keys(this._keys)) {
            if (data[type] !== undefined) {
                this.save(type, data[type]);
            }
        }
    },

    // 清除 localStorage 缓存（恢复默认）
    clearCache() {
        for (const key of Object.values(this._keys)) {
            localStorage.removeItem(key);
        }
        this._cache = null;
    },

    // 获取下一条可用 ID（用于新增数据）
    nextId(type) {
        const data = this._cache?.[type];
        if (!data || !Array.isArray(data)) return 1;
        const maxId = data.reduce((m, item) => Math.max(m, item.id || 0), 0);
        return maxId + 1;
    }
};

// 兼容全局访问
if (typeof window !== 'undefined') {
    window.DATA_LOADER = DATA_LOADER;
}
