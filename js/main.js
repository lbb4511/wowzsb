// ========== 主应用逻辑 ==========
// 依赖: data-loader.js, utils.js

let DATA = {}; // 当前运行时数据引用

// ========== 页面切换 ==========
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const page = document.getElementById('page-' + pageId);
    if (page) {
        page.classList.add('active', 'fade-in');
        setTimeout(() => page.classList.remove('fade-in'), 500);
    }

    document.querySelectorAll('.nav-link[data-page="' + pageId + '"]').forEach(l => l.classList.add('active'));

    window.scrollTo(0, 0);

    // 加载对应页面数据
    switch (pageId) {
        case 'home': renderNews(); break;
        case 'streamers': renderStreamers(); break;
        case 'schedule': renderSchedule(); break;
        case 'clips': renderClips(); break;
        case 'ranking': renderRanking(); break;
    }
}

function toggleMobileMenu(forceClose) {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    if (typeof forceClose === 'boolean') {
        menu.classList.toggle('open', !forceClose);
    } else {
        menu.classList.toggle('open');
    }
}

function navigateTo(pageId) {
    showPage(pageId);
    toggleMobileMenu(true);
}

// ========== 渲染函数 ==========
function renderNews() {
    const grid = document.getElementById('newsGrid');
    if (!grid || !DATA.news) return;
    grid.innerHTML = DATA.news.map(item => `
        <div class="news-card">
            <div class="news-card-thumb">
                <span style="font-size: 4rem;">${UTILS.escapeHtml(item.icon)}</span>
                <span class="tag ${item.tagType === 'live' ? 'tag-live' : 'tag-upcoming'}">${UTILS.escapeHtml(item.tag)}</span>
            </div>
            <div class="news-card-body">
                <div class="news-card-title">${UTILS.escapeHtml(item.title)}</div>
                <div class="news-card-meta">
                    <span>📅 ${UTILS.escapeHtml(item.date)}</span>
                    <span>👁️ 热门</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStreamers() {
    const grid = document.getElementById('streamersGrid');
    if (!grid || !DATA.streamers) return;
    grid.innerHTML = DATA.streamers.map(s => `
        <div class="streamer-card">
            <div class="streamer-avatar">
                ${UTILS.escapeHtml(s.avatar)}
                ${s.isLive ? '<span class="live-dot"></span>' : ''}
            </div>
            <div class="streamer-name">${UTILS.escapeHtml(s.name)}</div>
            <div class="streamer-role">${UTILS.escapeHtml(s.role)}</div>
            <div class="streamer-tags">
                ${s.tags.map(t => `<span class="tag tag-platform">${UTILS.escapeHtml(t)}</span>`).join('')}
            </div>
            <div class="streamer-links">
                ${s.platforms.map(p => `<a href="${UTILS.escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="streamer-link">${UTILS.escapeHtml(p.name)}</a>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderSchedule() {
    const list = document.getElementById('scheduleList');
    if (!list || !DATA.schedule) return;
    list.innerHTML = DATA.schedule.map(s => {
        const d = UTILS.parseLocalDate(s.date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        return `
        <div class="schedule-item">
            <div class="schedule-date">
                <div class="day">${day}</div>
                <div class="month">${month}月</div>
            </div>
            <div class="schedule-info">
                <h4>${UTILS.escapeHtml(s.title)}</h4>
                <p>${UTILS.escapeHtml(s.desc)}</p>
                <div class="schedule-meta">
                    <span class="tag tag-upcoming">⏰ ${UTILS.escapeHtml(s.time)}</span>
                    <span class="tag tag-platform">${UTILS.escapeHtml(s.day)}</span>
                    <span class="tag tag-platform">${UTILS.escapeHtml(s.boss)}</span>
                </div>
            </div>
            <div class="schedule-actions">
                <button class="btn btn-sm btn-primary" onclick="alert('订阅功能即将上线，敬请期待！')">订阅提醒</button>
            </div>
        </div>
    `}).join('');
}

function renderClips() {
    const grid = document.getElementById('clipsGrid');
    if (!grid || !DATA.clips) return;
    grid.innerHTML = DATA.clips.map(function(c) {
        const thumbContent = c.img
            ? '<img src="' + UTILS.escapeHtml(c.img) + '" alt="' + UTILS.escapeHtml(c.title) + '" loading="lazy" referrerpolicy="no-referrer">'
            : '<span style="font-size: 5rem; opacity: 0.3;">' + UTILS.escapeHtml(c.thumb) + '</span>';
        return '' +
            '<div class="clip-card" onclick="window.open(\'' + UTILS.escapeJsString(c.url) + '\', \'_blank\', \'noopener,noreferrer\')">' +
                '<div class="clip-thumb">' +
                    thumbContent +
                    '<div class="play-btn">▶</div>' +
                    '<span class="duration">' + UTILS.escapeHtml(c.duration) + '</span>' +
                '</div>' +
                '<div class="clip-body">' +
                    '<div class="clip-title">' + UTILS.escapeHtml(c.title) + '</div>' +
                    '<div class="clip-meta">' +
                        '<div class="clip-platform">' +
                            '<span class="clip-platform-icon">' + UTILS.escapeHtml(c.platformIcon) + '</span>' +
                            '<span>' + UTILS.escapeHtml(c.platform) + '</span>' +
                        '</div>' +
                        '<span>' + UTILS.escapeHtml(c.author) + ' · ' + UTILS.escapeHtml(c.date) + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }).join('');
}

// ========== 智商排行榜 ==========
let currentStage = null;

function updateRanking(stage) {
    const tabs = document.getElementById('rankingTabs');
    const list = document.getElementById('rankingList');
    if (!tabs || !list || !DATA.rankings) return;

    const stages = Object.keys(DATA.rankings);
    currentStage = stage;
    const data = DATA.rankings[stage];
    const maxScore = Math.max(...data.map(d => d.score));
    const minScore = Math.min(...data.map(d => d.score));
    const range = maxScore - minScore || 1;

    tabs.innerHTML = stages.map(s => `
        <button class="ranking-tab ${s === stage ? 'active' : ''}" onclick="updateRanking('${UTILS.escapeJsString(s)}')">${UTILS.escapeHtml(s)}</button>
    `).join('');

    list.innerHTML = data.map((item, i) => {
        const isTop3 = i < 3;
        const percentage = item.score >= 0
            ? ((item.score - minScore) / range * 100)
            : 0;
        const badgeClass = i === 0 ? 'badge-gold' : i === 1 ? 'badge-silver' : 'badge-bronze';

        return `
        <div class="ranking-item ${isTop3 ? 'top3' : ''}">
            <div class="ranking-rank">
                ${i < 3 ? `<span class="badge ${badgeClass}">${i + 1}</span>` : `<span style="font-weight:900;color:var(--text-muted);">${i + 1}</span>`}
            </div>
            <div class="ranking-avatar">${UTILS.escapeHtml(item.name[0])}</div>
            <div class="ranking-info">
                <div class="ranking-name">${UTILS.escapeHtml(item.name)}</div>
                <div class="ranking-detail">${UTILS.escapeHtml(item.detail)}</div>
            </div>
            <div class="ranking-score">
                <div class="ranking-score-num" style="color: ${item.score < 0 ? 'var(--danger)' : 'var(--primary)'}">${item.score}</div>
                <div class="ranking-score-label">智商</div>
                <div class="ranking-bar">
                    <div class="ranking-bar-fill ${item.score < 0 ? 'negative' : ''}" style="width: ${Math.max(0, Math.min(100, percentage))}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderRanking() {
    const stages = Object.keys(DATA.rankings || {});
    if (stages.length === 0) return;
    updateRanking(currentStage || stages[0]);
}

// ========== 搜索功能 ==========
let searchOverlay = null;

function initSearch() {
    // 创建搜索按钮（导航栏右侧）
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    const searchBtn = document.createElement('button');
    searchBtn.className = 'nav-link';
    searchBtn.innerHTML = '🔍';
    searchBtn.title = '搜索';
    searchBtn.style.cssText = 'font-size:1.2rem;padding:8px 12px;';
    searchBtn.onclick = openSearch;

    const mobileToggle = navContainer.querySelector('.nav-mobile-toggle');
    if (mobileToggle) {
        navContainer.insertBefore(searchBtn, mobileToggle);
    } else {
        navContainer.appendChild(searchBtn);
    }

    // 搜索遮罩层
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="搜索新闻、主播、赛程、切片..." autocomplete="off">
            <button class="search-close" onclick="closeSearch()">✕</button>
        </div>
        <div class="search-results" id="searchResults"></div>
    `;
    document.body.appendChild(searchOverlay);

    // 搜索输入监听
    const input = searchOverlay.querySelector('#searchInput');
    input.addEventListener('input', UTILS.debounce(async (e) => {
        const results = await UTILS.search(e.target.value);
        renderSearchResults(results, e.target.value);
    }, 200));

    // ESC 关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
            closeSearch();
        }
    });
}

function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    const input = searchOverlay.querySelector('#searchInput');
    input.value = '';
    input.focus();
    document.getElementById('searchResults').innerHTML = '';
}

function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
}

function renderSearchResults(results, keyword) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (!keyword.trim()) {
        container.innerHTML = '<div class="search-hint">输入关键词开始搜索</div>';
        return;
    }

    if (results.length === 0) {
        container.innerHTML = '<div class="search-hint">未找到相关内容</div>';
        return;
    }

    const typeLabels = {
        news: '最新战报',
        streamers: '主播阵容',
        schedule: '直播预告',
        clips: '切片集锦',
        rankings: '智商榜'
    };

    const typeIcons = {
        news: '📰',
        streamers: '🎭',
        schedule: '📅',
        clips: '🎬',
        rankings: '🏆'
    };

    container.innerHTML = results.map(r => {
        const item = r.item;
        let title = item.title || item.name || '';
        let desc = item.desc || item.detail || item.role || '';

        // 高亮关键词
        const hl = (str) => {
            if (!str) return '';
            const re = new RegExp('(' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            return str.replace(re, '<mark>$1</mark>');
        };

        return `
            <div class="search-result-item" onclick="handleSearchClick('${r.type}', ${item.id || item.rank || '\'' + item.name + '\''})">
                <div class="search-result-icon">${typeIcons[r.type]}</div>
                <div class="search-result-body">
                    <div class="search-result-title">${hl(UTILS.escapeHtml(title))}</div>
                    <div class="search-result-desc">${hl(UTILS.escapeHtml(desc))}</div>
                    <div class="search-result-type">${typeLabels[r.type]} ${r.stage ? '· ' + UTILS.escapeHtml(r.stage) : ''}</div>
                </div>
            </div>
        `;
    }).join('');
}

function handleSearchClick(type, identifier) {
    closeSearch();
    switch (type) {
        case 'news':
        case 'streamers':
        case 'schedule':
        case 'clips':
            showPage(type === 'news' ? 'home' : type);
            break;
        case 'rankings':
            showPage('ranking');
            break;
    }
}

// ========== 暗/亮模式切换 ==========
function initThemeToggle() {
    const savedTheme = localStorage.getItem('wowzsb_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    if (!isDark) {
        document.documentElement.classList.add('light-mode');
    }

    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    const themeBtn = document.createElement('button');
    themeBtn.className = 'nav-link';
    themeBtn.innerHTML = isDark ? '☀️' : '🌙';
    themeBtn.title = '切换主题';
    themeBtn.style.cssText = 'font-size:1.2rem;padding:8px 12px;';
    themeBtn.onclick = toggleTheme;

    const mobileToggle = navContainer.querySelector('.nav-mobile-toggle');
    if (mobileToggle) {
        navContainer.insertBefore(themeBtn, mobileToggle);
    } else {
        navContainer.appendChild(themeBtn);
    }
}

function toggleTheme() {
    const isDark = !document.documentElement.classList.contains('light-mode');
    if (isDark) {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('wowzsb_theme', 'light');
    } else {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('wowzsb_theme', 'dark');
    }
    // 更新按钮图标
    const btn = document.querySelector('.nav-link[title="切换主题"]');
    if (btn) btn.innerHTML = isDark ? '🌙' : '☀️';
}

// ========== 倒计时 ==========
function updateCountdown() {
    const now = new Date();
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
    nextSunday.setHours(20, 0, 0, 0);
    if (nextSunday <= now) {
        nextSunday.setDate(nextSunday.getDate() + 7);
    }

    const diff = nextSunday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 加载数据
        DATA = await DATA_LOADER.loadAll();

        // 初始化功能
        renderNews();
        updateCountdown();
        setInterval(updateCountdown, 1000);
        initSearch();
        initThemeToggle();

        // 阻止导航中占位链接的默认跳转
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', e => e.preventDefault());
        });
    } catch (err) {
        console.error('初始化失败:', err);
        document.body.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text)"><h2>⚠️ 数据加载失败</h2><p>请刷新页面重试，或检查网络连接。</p><button onclick="location.reload()" class="btn btn-primary">刷新</button></div>';
    }
});
