// ========== 数据配置（可在此修改） ==========
const DATA = {
    // 最新战报
    news: [
        {
            id: 1,
            title: "H4双龙开荒：林熊猫智商跌破0，反向登顶！",
            desc: "林熊猫输出不如坦克且每次都倒地，被扣170分，智商跌至-70。",
            tag: "最新",
            tagType: "live",
            date: "2026-03-30",
            icon: "🐉"
        },
        {
            id: 2,
            title: "牢A故事会：减肥人群的福报",
            desc: "牢A一旦躺尸就开始讲「古神低语」般的奇闻异事，团员需回SAN。",
            tag: "热门",
            tagType: "upcoming",
            date: "2026-03-29",
            icon: "📖"
        },
        {
            id: 3,
            title: "社交的手腕：福乐喊夏一可「妈妈」",
            desc: "福乐为求灌注喊夏一可「妈妈」，牢A自称从小看夏一可节目长大。",
            tag: "搞笑",
            tagType: "upcoming",
            date: "2026-03-28",
            icon: "🤝"
        },
        {
            id: 4,
            title: "阿落喷大团导致团灭，扣60分",
            desc: "阿落和牢A因犯错喷大团导致团灭，各扣60分，智商40并列倒数。",
            tag: "战报",
            tagType: "upcoming",
            date: "2026-03-27",
            icon: "💥"
        }
    ],

    // 主播阵容
    streamers: [
        {
            id: "xiayike",
            name: "夏一可",
            role: "组织者 / 解说",
            avatar: "夏",
            tags: ["组织者", "毒舌解说"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" },
                { name: "斗鱼", url: "https://www.douyu.com/" }
            ],
            isLive: false
        },
        {
            id: "linxiongmao",
            name: "林熊猫",
            role: "DPS / 内鬼候选人",
            avatar: "林",
            tags: ["-70智商", "输出不如T"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" },
                { name: "虎牙", url: "https://www.huya.com/" }
            ],
            isLive: false
        },
        {
            id: "laoa",
            name: "牢A",
            role: "故事会主讲人",
            avatar: "A",
            tags: ["古神低语", "40智商"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" }
            ],
            isLive: false
        },
        {
            id: "aluo",
            name: "阿落",
            role: "DPS",
            avatar: "落",
            tags: ["喷大团", "40智商"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" }
            ],
            isLive: false
        },
        {
            id: "fule",
            name: "福乐",
            role: "社交达人",
            avatar: "福",
            tags: ["喊妈妈", "求灌注"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" }
            ],
            isLive: false
        },
        {
            id: "cangtiange",
            name: "苍天哥",
            role: "资深玩家",
            avatar: "苍",
            tags: ["魔兽老资历", "稳健"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" }
            ],
            isLive: false
        },
        {
            id: "anleier",
            name: "安蕾尔",
            role: "治疗",
            avatar: "安",
            tags: ["治疗担当", "魔兽老资历"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" }
            ],
            isLive: false
        },
        {
            id: "shenyi",
            name: "沈逸",
            role: "跨界嘉宾",
            avatar: "沈",
            tags: ["社会学教授", "跨界"],
            platforms: [
                { name: "B站", url: "https://live.bilibili.com/" }
            ],
            isLive: false
        }
    ],

    // 直播预告
    schedule: [
        {
            id: 1,
            title: "虚影尖塔 H5 开荒",
            desc: "继续推进英雄难度，目标拿下H5！",
            date: "2026-03-30",
            time: "20:00",
            day: "周日",
            boss: "H5",
            status: "upcoming",
            platforms: ["B站", "斗鱼", "虎牙"]
        },
        {
            id: 2,
            title: "虚影尖塔 H6 开荒",
            desc: "如果H5顺利，直接挑战H6！",
            date: "2026-04-06",
            time: "20:00",
            day: "周日",
            boss: "H6",
            status: "upcoming",
            platforms: ["B站", "斗鱼", "虎牙"]
        },
        {
            id: 3,
            title: "虚影尖塔 H7 开荒",
            desc: "中期Boss，预计难度大幅提升。",
            date: "2026-04-13",
            time: "20:00",
            day: "周日",
            boss: "H7",
            status: "upcoming",
            platforms: ["B站", "斗鱼", "虎牙"]
        },
        {
            id: 4,
            title: "虚影尖塔 H8 开荒",
            desc: "尾王前倒数第二个Boss，考验团队配合。",
            date: "2026-04-20",
            time: "20:00",
            day: "周日",
            boss: "H8",
            status: "upcoming",
            platforms: ["B站", "斗鱼", "虎牙"]
        }
    ],

    // 切片集锦
    clips: [
        {
            id: 1,
            title: "林熊猫智商-70名场面：输出不如坦克",
            platform: "B站",
            platformIcon: "B",
            duration: "05:32",
            date: "2026-03-30",
            author: "王添奕",
            url: "https://www.bilibili.com/",
            img: "https://picsum.photos/seed/wowzsb01/600/400",
            thumb: "🎪"
        },
        {
            id: 2,
            title: "牢A故事会：古神低语与回SAN",
            platform: "B站",
            platformIcon: "B",
            duration: "08:15",
            date: "2026-03-29",
            author: "智商杯切片组",
            url: "https://www.bilibili.com/",
            img: "https://picsum.photos/seed/wowzsb02/600/400",
            thumb: "👻"
        },
        {
            id: 3,
            title: "福乐喊夏一可「妈妈」求灌注",
            platform: "抖音",
            platformIcon: "D",
            duration: "02:48",
            date: "2026-03-28",
            author: "魔兽欢乐时刻",
            url: "https://www.douyin.com/",
            img: "https://picsum.photos/seed/wowzsb03/600/400",
            thumb: "🍼"
        },
        {
            id: 4,
            title: "阿落喷大团导致团灭，扣60分",
            platform: "B站",
            platformIcon: "B",
            duration: "04:20",
            date: "2026-03-27",
            author: "王添奕",
            url: "https://www.bilibili.com/",
            img: "https://picsum.photos/seed/wowzsb04/600/400",
            thumb: "💀"
        },
        {
            id: 5,
            title: "智商杯开庭惩罚：三人接受审判",
            platform: "B站",
            platformIcon: "B",
            duration: "12:30",
            date: "2026-03-26",
            author: "智商杯官方",
            url: "https://www.bilibili.com/",
            img: "https://picsum.photos/seed/wowzsb05/600/400",
            thumb: "⚖️"
        },
        {
            id: 6,
            title: "沈逸教授与魔兽时光服：一场赛博空间的中外文化共振",
            platform: "B站",
            platformIcon: "B",
            duration: "15:00",
            date: "2026-03-25",
            author: "跨界精选",
            url: "https://www.bilibili.com/video/BV1VtXPBNEyY",
            img: "https://i1.hdslb.com/bfs/archive/da7a8d75655bba8f2ce393847d41edba7fbec51f.jpg@672w_378h_1c_!web-search-common-cover",
            thumb: "🎓"
        }
    ],

    // 智商排行榜（按Boss分阶段）
    rankings: {
        "H4-双龙": [
            { rank: 1, name: "夏一可", score: 200, change: 0, detail: "组织者，稳定发挥" },
            { rank: 2, name: "苍天哥", score: 180, change: -10, detail: "老资历，稳健" },
            { rank: 3, name: "安蕾尔", score: 170, change: -20, detail: "治疗压力大" },
            { rank: 4, name: "福乐", score: 120, change: -30, detail: "社交达人，偶尔犯错" },
            { rank: 5, name: "沈逸", score: 100, change: -40, detail: "跨界嘉宾，还在学习" },
            { rank: 6, name: "阿落", score: 40, change: -60, detail: "喷大团导致团灭" },
            { rank: 7, name: "牢A", score: 40, change: -60, detail: "喷大团+故事会" },
            { rank: 8, name: "林熊猫", score: -70, change: -170, detail: "输出不如T，每次都躺" }
        ],
        "H3-虚影": [
            { rank: 1, name: "夏一可", score: 200, change: 0, detail: "组织者" },
            { rank: 2, name: "苍天哥", score: 190, change: -5, detail: "稳定" },
            { rank: 3, name: "安蕾尔", score: 190, change: -10, detail: "治疗MVP" },
            { rank: 4, name: "福乐", score: 150, change: -20, detail: "偶尔犯错" },
            { rank: 5, name: "沈逸", score: 140, change: -30, detail: "进步明显" },
            { rank: 6, name: "阿落", score: 100, change: -40, detail: "DPS一般" },
            { rank: 7, name: "牢A", score: 100, change: -50, detail: "故事会开始" },
            { rank: 8, name: "林熊猫", score: 100, change: -60, detail: "开始下滑" }
        ],
        "H2-尖塔": [
            { rank: 1, name: "夏一可", score: 200, change: 0, detail: "组织者" },
            { rank: 2, name: "苍天哥", score: 195, change: -5, detail: "稳定" },
            { rank: 3, name: "安蕾尔", score: 200, change: 0, detail: "满分治疗" },
            { rank: 4, name: "福乐", score: 170, change: -10, detail: "表现不错" },
            { rank: 5, name: "沈逸", score: 170, change: -20, detail: "新手保护期" },
            { rank: 6, name: "阿落", score: 140, change: -20, detail: "中规中矩" },
            { rank: 7, name: "牢A", score: 150, change: -30, detail: "开始讲故事" },
            { rank: 8, name: "林熊猫", score: 160, change: -40, detail: "初期还行" }
        ]
    }
};

// 确保在模块化环境中也能访问（如果未来使用模块）
if (typeof window !== 'undefined') {
    window.DATA = DATA;
}
