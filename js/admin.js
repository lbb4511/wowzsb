// ========== 管理后台逻辑 ==========
// 依赖: data-loader.js, utils.js

const adminApp = {
    data: {},
    currentType: 'news',
    editingItem: null,
    isNew: false,
    pageSize: 10,
    currentPage: 1,

    // 数据类型配置
    typeConfig: {
        news: {
            label: '最新战报',
            icon: '📰',
            fields: [
                { key: 'id', label: 'ID', type: 'number', readonly: true, hidden: true },
                { key: 'title', label: '标题', type: 'text', required: true },
                { key: 'desc', label: '描述', type: 'textarea' },
                { key: 'tag', label: '标签', type: 'text' },
                { key: 'tagType', label: '标签类型', type: 'select', options: ['live', 'upcoming'] },
                { key: 'date', label: '日期', type: 'date' },
                { key: 'icon', label: '图标', type: 'text' }
            ],
            listColumns: ['id', 'title', 'tag', 'date']
        },
        streamers: {
            label: '主播阵容',
            icon: '🎭',
            fields: [
                { key: 'id', label: 'ID', type: 'text', required: true },
                { key: 'name', label: '名称', type: 'text', required: true },
                { key: 'role', label: '角色', type: 'text' },
                { key: 'avatar', label: '头像字', type: 'text' },
                { key: 'tags', label: '标签', type: 'array' },
                { key: 'platforms', label: '平台', type: 'platforms' },
                { key: 'isLive', label: '直播中', type: 'checkbox' }
            ],
            listColumns: ['id', 'name', 'role', 'tags']
        },
        schedule: {
            label: '直播预告',
            icon: '📅',
            fields: [
                { key: 'id', label: 'ID', type: 'number', readonly: true, hidden: true },
                { key: 'title', label: '标题', type: 'text', required: true },
                { key: 'desc', label: '描述', type: 'textarea' },
                { key: 'date', label: '日期', type: 'date' },
                { key: 'time', label: '时间', type: 'text' },
                { key: 'day', label: '星期', type: 'text' },
                { key: 'boss', label: 'Boss', type: 'text' },
                { key: 'status', label: '状态', type: 'select', options: ['upcoming', 'live', 'done'] },
                { key: 'platforms', label: '平台', type: 'array' }
            ],
            listColumns: ['id', 'title', 'date', 'time', 'boss']
        },
        clips: {
            label: '切片集锦',
            icon: '🎬',
            fields: [
                { key: 'id', label: 'ID', type: 'number', readonly: true, hidden: true },
                { key: 'title', label: '标题', type: 'text', required: true },
                { key: 'platform', label: '平台', type: 'text' },
                { key: 'platformIcon', label: '平台图标', type: 'text' },
                { key: 'duration', label: '时长', type: 'text' },
                { key: 'date', label: '日期', type: 'date' },
                { key: 'author', label: '作者', type: 'text' },
                { key: 'url', label: '链接', type: 'text' },
                { key: 'img', label: '图片', type: 'text' },
                { key: 'thumb', label: '缩略图', type: 'text' }
            ],
            listColumns: ['id', 'title', 'platform', 'date', 'author']
        },
        rankings: {
            label: '智商排行榜',
            icon: '🏆',
            isObject: true, // 排行榜是对象，不是数组
            fields: [
                { key: '_stage', label: '阶段名称', type: 'text', required: true },
                { key: 'rank', label: '排名', type: 'number', required: true },
                { key: 'name', label: '名称', type: 'text', required: true },
                { key: 'score', label: '分数', type: 'number', required: true },
                { key: 'change', label: '变化', type: 'number' },
                { key: 'detail', label: '详情', type: 'textarea' }
            ],
            listColumns: ['rank', 'name', 'score', 'detail']
        }
    },

    // 初始化
    async init() {
        try {
            this.data = await DATA_LOADER.loadAll();
            this.renderTabs();
            this.renderTable();
            document.getElementById('adminLoading').style.display = 'none';
        } catch (err) {
            console.error('后台初始化失败:', err);
            this.toast('数据加载失败', 'error');
        }
    },

    // 渲染标签
    renderTabs() {
        const container = document.getElementById('adminTabs');
        container.innerHTML = Object.entries(this.typeConfig).map(([key, cfg]) => `
            <button class="admin-tab ${key === this.currentType ? 'active' : ''}" onclick="adminApp.switchType('${key}')">
                ${cfg.icon} ${cfg.label}
            </button>
        `).join('');
    },

    // 切换类型
    switchType(type) {
        this.currentType = type;
        this.currentPage = 1;
        this.renderTabs();
        this.renderTable();
    },

    // 获取当前数据列表
    getCurrentData() {
        const cfg = this.typeConfig[this.currentType];
        if (cfg.isObject) {
            // 排行榜特殊处理：展平为带 stage 字段的数组
            const result = [];
            Object.entries(this.data.rankings || {}).forEach(([stage, list]) => {
                list.forEach(item => {
                    result.push({ ...item, _stage: stage });
                });
            });
            return result;
        }
        return this.data[this.currentType] || [];
    },

    // 保存数据（更新到 localStorage）
    saveData(type) {
        DATA_LOADER.save(type, this.data[type]);
    },

    // 渲染表格
    renderTable() {
        const container = document.getElementById('adminTableContainer');
        const cfg = this.typeConfig[this.currentType];
        const allData = this.getCurrentData();

        // 搜索过滤
        const searchInput = document.querySelector('.admin-search');
        const keyword = searchInput?.value?.toLowerCase() || '';
        let data = allData;
        if (keyword) {
            data = allData.filter(item => {
                const str = JSON.stringify(item).toLowerCase();
                return str.includes(keyword);
            });
        }

        // 分页
        const total = data.length;
        const totalPages = Math.ceil(total / this.pageSize) || 1;
        const start = (this.currentPage - 1) * this.pageSize;
        const pageData = data.slice(start, start + this.pageSize);

        if (pageData.length === 0) {
            container.innerHTML = `
                <div class="admin-empty">
                    <div class="admin-empty-icon">📭</div>
                    <p>暂无数据</p>
                </div>
            `;
            return;
        }

        // 列名
        const columns = cfg.listColumns;

        let html = `
            <input type="text" class="admin-search" placeholder="搜索 ${cfg.label}..." value="${UTILS.escapeHtml(keyword)}" oninput="adminApp.handleSearch(this.value)">
            <table class="admin-table">
                <thead>
                    <tr>
                        ${columns.map(c => `<th>${this.getColumnLabel(c)}</th>`).join('')}
                        <th style="text-align:right">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${pageData.map((item, idx) => `
                        <tr>
                            ${columns.map(c => `<td>${this.renderCell(item, c)}</td>`).join('')}
                            <td style="text-align:right">
                                <div class="admin-table-actions">
                                    <button class="admin-btn-icon" onclick="adminApp.editItem(${JSON.stringify(item.id || item.rank || item.name).replace(/"/g, '&quot;')}, '${UTILS.escapeJsString(item._stage || '')}')">✏️</button>
                                    <button class="admin-btn-icon danger" onclick="adminApp.deleteItem(${JSON.stringify(item.id || item.rank || item.name).replace(/"/g, '&quot;')}, '${UTILS.escapeJsString(item._stage || '')}')">🗑️</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // 分页
        if (totalPages > 1) {
            html += '<div class="admin-pagination">';
            html += `<button class="admin-page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="adminApp.goPage(${this.currentPage - 1})">←</button>`;
            for (let i = 1; i <= totalPages; i++) {
                html += `<button class="admin-page-btn ${i === this.currentPage ? 'active' : ''}" onclick="adminApp.goPage(${i})">${i}</button>`;
            }
            html += `<button class="admin-page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="adminApp.goPage(${this.currentPage + 1})">→</button>`;
            html += '</div>';
        }

        container.innerHTML = html;
    },

    handleSearch(keyword) {
        this.currentPage = 1;
        this.renderTable();
    },

    goPage(page) {
        this.currentPage = page;
        this.renderTable();
    },

    getColumnLabel(key) {
        const cfg = this.typeConfig[this.currentType];
        const field = cfg.fields.find(f => f.key === key);
        return field ? field.label : key;
    },

    renderCell(item, key) {
        const val = item[key];
        if (val === undefined || val === null) return '<span style="color:var(--text-muted)">-</span>';
        if (Array.isArray(val)) {
            const str = val.join(', ');
            return `<span class="truncated" title="${UTILS.escapeHtml(str)}">${UTILS.escapeHtml(str)}</span>`;
        }
        if (typeof val === 'boolean') return val ? '✅' : '❌';
        if (typeof val === 'object') return '<span style="color:var(--text-muted)">对象</span>';
        const str = String(val);
        return `<span class="truncated" title="${UTILS.escapeHtml(str)}">${UTILS.escapeHtml(str)}</span>`;
    },

    // 新增数据
    addItem() {
        this.isNew = true;
        this.editingItem = {};
        const cfg = this.typeConfig[this.currentType];

        if (cfg.isObject) {
            this.editingItem = { _stage: '', rank: 1, name: '', score: 0, change: 0, detail: '' };
        } else {
            this.editingItem = { id: DATA_LOADER.nextId(this.currentType) };
            cfg.fields.forEach(f => {
                if (!f.readonly && !f.hidden) {
                    this.editingItem[f.key] = f.type === 'checkbox' ? false : f.type === 'array' ? [] : f.type === 'platforms' ? [] : '';
                }
            });
        }

        this.openModal('新增 ' + cfg.label);
    },

    // 编辑数据
    editItem(idOrRank, stage) {
        this.isNew = false;
        const cfg = this.typeConfig[this.currentType];

        if (cfg.isObject) {
            const list = this.data.rankings[stage] || [];
            this.editingItem = list.find(item => item.rank === idOrRank && item.name === stage) || { ...list.find(item => item.rank === idOrRank), _stage: stage };
        } else {
            const list = this.data[this.currentType] || [];
            this.editingItem = list.find(item => item.id === idOrRank) || {};
        }

        this.openModal('编辑 ' + cfg.label);
    },

    // 删除数据
    deleteItem(idOrRank, stage) {
        if (!confirm('确定要删除这条数据吗？')) return;

        const cfg = this.typeConfig[this.currentType];
        if (cfg.isObject) {
            const list = this.data.rankings[stage] || [];
            this.data.rankings[stage] = list.filter(item => item.rank !== idOrRank);
        } else {
            const list = this.data[this.currentType] || [];
            this.data[this.currentType] = list.filter(item => item.id !== idOrRank);
        }

        this.saveData(this.currentType);
        this.renderTable();
        this.toast('删除成功');
    },

    // 打开弹窗
    openModal(title) {
        const modal = document.getElementById('editModal');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = this.renderForm();
        modal.classList.add('open');
    },

    // 关闭弹窗
    closeModal() {
        document.getElementById('editModal').classList.remove('open');
        this.editingItem = null;
    },

    // 渲染表单
    renderForm() {
        const cfg = this.typeConfig[this.currentType];
        const item = this.editingItem;

        return cfg.fields.map(f => {
            if (f.hidden) return '';
            const val = item[f.key] !== undefined ? item[f.key] : '';

            let input = '';
            switch (f.type) {
                case 'textarea':
                    input = `<textarea id="field_${f.key}" rows="3" ${f.required ? 'required' : ''} ${f.readonly ? 'readonly' : ''}>${UTILS.escapeHtml(val)}</textarea>`;
                    break;
                case 'select':
                    input = `<select id="field_${f.key}" ${f.required ? 'required' : ''} ${f.readonly ? 'disabled' : ''}>
                        ${f.options.map(o => `<option value="${UTILS.escapeHtml(o)}" ${val === o ? 'selected' : ''}>${UTILS.escapeHtml(o)}</option>`).join('')}
                    </select>`;
                    break;
                case 'checkbox':
                    input = `<input type="checkbox" id="field_${f.key}" ${val ? 'checked' : ''} ${f.readonly ? 'disabled' : ''}>`;
                    break;
                case 'array':
                    input = this.renderArrayField(f.key, val);
                    break;
                case 'platforms':
                    input = this.renderPlatformsField(f.key, val);
                    break;
                default:
                    input = `<input type="${f.type}" id="field_${f.key}" value="${UTILS.escapeHtml(val)}" ${f.required ? 'required' : ''} ${f.readonly ? 'readonly' : ''}>`;
            }

            return `
                <div class="admin-form-group">
                    <label>${f.label}${f.required ? ' <span style="color:var(--danger)">*</span>' : ''}</label>
                    ${input}
                    ${f.readonly ? '<div class="admin-form-help">只读字段</div>' : ''}
                </div>
            `;
        }).join('');
    },

    renderArrayField(key, values) {
        const arr = Array.isArray(values) ? values : [];
        return `
            <div id="array_${key}">
                ${arr.map((v, i) => `
                    <div class="admin-array-item">
                        <input type="text" value="${UTILS.escapeHtml(v)}" data-array="${key}" data-index="${i}">
                        <button type="button" class="admin-array-btn" onclick="adminApp.removeArrayItem('${key}', ${i})">✕</button>
                    </div>
                `).join('')}
            </div>
            <button type="button" class="admin-array-btn" onclick="adminApp.addArrayItem('${key}')" style="margin-top:4px">+ 添加</button>
        `;
    },

    renderPlatformsField(key, values) {
        const arr = Array.isArray(values) ? values : [];
        return `
            <div id="platforms_${key}">
                ${arr.map((v, i) => `
                    <div class="admin-form-row" style="margin-bottom:8px">
                        <div>
                            <label style="font-size:0.75rem;color:var(--text-muted)">平台名</label>
                            <input type="text" value="${UTILS.escapeHtml(v.name || '')}" data-platform-name="${key}" data-index="${i}">
                        </div>
                        <div>
                            <label style="font-size:0.75rem;color:var(--text-muted)">链接</label>
                            <div style="display:flex;gap:6px">
                                <input type="text" value="${UTILS.escapeHtml(v.url || '')}" data-platform-url="${key}" data-index="${i}">
                                <button type="button" class="admin-array-btn" onclick="adminApp.removeArrayItem('${key}', ${i})">✕</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button type="button" class="admin-array-btn" onclick="adminApp.addPlatformItem('${key}')" style="margin-top:4px">+ 添加平台</button>
        `;
    },

    addArrayItem(key) {
        const container = document.getElementById(`array_${key}`);
        const idx = container.querySelectorAll('.admin-array-item').length;
        const div = document.createElement('div');
        div.className = 'admin-array-item';
        div.innerHTML = `
            <input type="text" value="" data-array="${key}" data-index="${idx}">
            <button type="button" class="admin-array-btn" onclick="this.parentElement.remove()">✕</button>
        `;
        container.appendChild(div);
    },

    addPlatformItem(key) {
        const container = document.getElementById(`platforms_${key}`);
        const idx = container.querySelectorAll('.admin-form-row').length;
        const div = document.createElement('div');
        div.className = 'admin-form-row';
        div.style.marginBottom = '8px';
        div.innerHTML = `
            <div>
                <label style="font-size:0.75rem;color:var(--text-muted)">平台名</label>
                <input type="text" value="" data-platform-name="${key}" data-index="${idx}">
            </div>
            <div>
                <label style="font-size:0.75rem;color:var(--text-muted)">链接</label>
                <div style="display:flex;gap:6px">
                    <input type="text" value="" data-platform-url="${key}" data-index="${idx}">
                    <button type="button" class="admin-array-btn" onclick="this.closest('.admin-form-row').remove()">✕</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    },

    removeArrayItem(key, index) {
        // 由 onclick 直接操作 DOM，不需要额外逻辑
    },

    // 保存数据
    saveItem() {
        const cfg = this.typeConfig[this.currentType];
        const item = {};

        for (const f of cfg.fields) {
            if (f.readonly) {
                item[f.key] = this.editingItem[f.key];
                continue;
            }

            if (f.type === 'array') {
                const inputs = document.querySelectorAll(`[data-array="${f.key}"]`);
                item[f.key] = Array.from(inputs).map(i => i.value).filter(v => v !== '');
            } else if (f.type === 'platforms') {
                const names = document.querySelectorAll(`[data-platform-name="${f.key}"]`);
                const urls = document.querySelectorAll(`[data-platform-url="${f.key}"]`);
                item[f.key] = [];
                for (let i = 0; i < names.length; i++) {
                    if (names[i].value) {
                        item[f.key].push({ name: names[i].value, url: urls[i]?.value || '' });
                    }
                }
            } else if (f.type === 'checkbox') {
                item[f.key] = document.getElementById(`field_${f.key}`).checked;
            } else if (f.type === 'number') {
                const v = document.getElementById(`field_${f.key}`).value;
                item[f.key] = v === '' ? '' : Number(v);
            } else {
                item[f.key] = document.getElementById(`field_${f.key}`).value;
            }
        }

        if (cfg.isObject) {
            // 排行榜处理
            const stage = item._stage;
            if (!stage) {
                this.toast('阶段名称不能为空', 'error');
                return;
            }
            delete item._stage;
            if (!this.data.rankings[stage]) this.data.rankings[stage] = [];
            const list = this.data.rankings[stage];
            const idx = list.findIndex(i => i.rank === item.rank && i.name === this.editingItem.name);
            if (idx >= 0) {
                list[idx] = item;
            } else {
                list.push(item);
            }
            // 按 rank 排序
            list.sort((a, b) => a.rank - b.rank);
            this.saveData('rankings');
        } else {
            const list = this.data[this.currentType] || [];
            if (this.isNew) {
                list.push(item);
            } else {
                const idx = list.findIndex(i => i.id === this.editingItem.id);
                if (idx >= 0) list[idx] = item;
            }
            this.data[this.currentType] = list;
            this.saveData(this.currentType);
        }

        this.closeModal();
        this.renderTable();
        this.toast('保存成功');
    },

    // 导出数据
    async exportData() {
        try {
            const data = await DATA_LOADER.exportAll();
            // 分别导出为多个文件
            UTILS.downloadJson(data.news, 'news.json');
            UTILS.downloadJson(data.streamers, 'streamers.json');
            UTILS.downloadJson(data.schedule, 'schedule.json');
            UTILS.downloadJson(data.clips, 'clips.json');
            UTILS.downloadJson(data.rankings, 'rankings.json');
            this.toast('JSON 文件已导出，请下载后替换到 data/ 目录');
        } catch (err) {
            console.error(err);
            this.toast('导出失败', 'error');
        }
    },

    // 导入数据
    importData(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                DATA_LOADER.importAll(data);
                this.data = { ...this.data, ...data };
                this.renderTable();
                this.toast('导入成功，数据已保存到 localStorage');
            } catch (err) {
                console.error(err);
                this.toast('导入失败，JSON 格式错误', 'error');
            }
        };
        reader.readAsText(file);
        input.value = ''; // 重置
    },

    // 重置所有数据
    resetAll() {
        if (!confirm('确定要清除所有编辑数据，恢复默认？此操作不可撤销。')) return;
        DATA_LOADER.clearCache();
        location.reload();
    },

    // Toast 提示
    toast(message, type = 'success') {
        const el = document.getElementById('adminToast');
        el.textContent = message;
        el.className = 'admin-toast ' + type + ' show';
        setTimeout(() => el.classList.remove('show'), 3000);
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    adminApp.init();
});
