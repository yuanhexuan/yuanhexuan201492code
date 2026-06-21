import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'vidhub.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL UNIQUE,
    avatar TEXT DEFAULT '',
    level INTEGER DEFAULT 1,
    sign TEXT DEFAULT '',
    follow_count INTEGER DEFAULT 0,
    fan_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    icon TEXT DEFAULT '',
    description TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    cover_url TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
    duration INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    coin_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    danmaku_count INTEGER DEFAULT 0,
    category_id TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    upload_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS danmaku (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    time FLOAT NOT NULL,
    color TEXT DEFAULT '#FFFFFF',
    type INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    video_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, video_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (video_id) REFERENCES videos(id)
  );

  CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
  CREATE INDEX IF NOT EXISTS idx_videos_author ON videos(author_id);
  CREATE INDEX IF NOT EXISTS idx_danmaku_video ON danmaku(video_id);
  CREATE INDEX IF NOT EXISTS idx_comments_video ON comments(video_id);
`);

const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, name_en, icon, description) VALUES (?, ?, ?, ?, ?)
  `);
  
  const categories = [
    ['animation', '动画', 'Animation', '🎬', '二次元动画创作'],
    ['anime', '番剧', 'Anime', '📺', '日本动画番剧'],
    ['music', '音乐', 'Music', '🎵', '音乐演奏与创作'],
    ['game', '游戏', 'Game', '🎮', '电子游戏相关内容'],
    ['tech', '科技', 'Technology', '💻', '科技数码评测'],
    ['life', '生活', 'Life', '🏠', '日常生活分享'],
    ['entertainment', '娱乐', 'Entertainment', '😄', '娱乐综艺内容'],
    ['film', '影视', 'Film', '🎥', '影视剪辑与解说']
  ];
  
  categories.forEach(cat => insertCategory.run(...cat));
}

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (nickname, avatar, level, sign, follow_count, fan_count) VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const users = [
    ['技术菌', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech', 5, '分享技术与生活', 120, 3500],
    ['音乐大师', 'https://api.dicebear.com/7.x/avataaars/svg?seed=music', 4, '音乐是我的灵魂', 89, 2100],
    ['游戏玩家', 'https://api.dicebear.com/7.x/avataaars/svg?seed=game', 3, '游戏爱好者', 56, 890],
    ['科技控', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech2', 4, '数码科技发烧友', 234, 5600],
    ['生活家', 'https://api.dicebear.com/7.x/avataaars/svg?seed=life', 2, '记录美好生活', 45, 320]
  ];
  
  users.forEach(user => insertUser.run(...user));
}

const videoCount = db.prepare('SELECT COUNT(*) as count FROM videos').get() as { count: number };
if (videoCount.count === 0) {
  const insertVideo = db.prepare(`
    INSERT INTO videos (title, description, cover_url, video_url, duration, view_count, like_count, coin_count, favorite_count, danmaku_count, category_id, author_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const videos = [
    ['React 18 新特性深度解析', '深入讲解 React 18 的并发特性、Suspense 和 Server Components', 'https://picsum.photos/seed/react/640/360', '', 1845, 125600, 8920, 3420, 5620, 2340, 'tech', 1],
    ['如何从零学习钢琴', '零基础钢琴入门教程，从认识键盘开始', 'https://picsum.photos/seed/piano/640/360', '', 2560, 89400, 6720, 2890, 4560, 1890, 'music', 2],
    ['塞尔达传说：王国之泪 通关攻略', '全神庙解谜与剧情攻略', 'https://picsum.photos/seed/zelda/640/360', '', 3240, 256000, 18900, 9200, 15800, 8920, 'game', 3],
    ['iPhone 15 Pro Max 深度体验', '一个月使用感受，值不值得买？', 'https://picsum.photos/seed/iphone/640/360', '', 1560, 189000, 12300, 5600, 9800, 4560, 'tech', 4],
    ['我的极简生活', '分享我的极简生活方式与心得', 'https://picsum.photos/seed/minimal/640/360', '', 980, 45600, 3450, 1230, 2890, 890, 'life', 5],
    [' Blender 3D建模入门教程', '从零开始学习 Blender 3D 建模', 'https://picsum.photos/seed/blender/640/360', '', 2890, 67800, 5670, 2340, 4560, 2100, 'animation', 1],
    ['原神4.0 新版本深度评测', '枫丹地区探索与新角色分析', 'https://picsum.photos/seed/genshin/640/360', '', 2180, 345000, 25600, 18900, 32100, 18200, 'game', 3],
    ['TypeScript 高级技巧', '提升 TypeScript 水平的10个技巧', 'https://picsum.photos/seed/ts/640/360', '', 1650, 78900, 6780, 2890, 5670, 2340, 'tech', 1],
    ['吉他弹唱《晴天》', '周杰伦经典曲目吉他弹唱演示', 'https://picsum.photos/seed/guitar/640/360', '', 245, 156000, 12300, 8900, 15600, 6780, 'music', 2],
    ['露营生活VLOG', '周末露营的美好时光', 'https://picsum.photos/seed/camping/640/360', '', 1560, 34500, 2340, 890, 1780, 560, 'life', 5]
  ];
  
  videos.forEach(video => insertVideo.run(...video));
}

const danmakuCount = db.prepare('SELECT COUNT(*) as count FROM danmaku').get() as { count: number };
if (danmakuCount.count === 0) {
  const insertDanmaku = db.prepare(`
    INSERT INTO danmaku (video_id, content, time, color, type) VALUES (?, ?, ?, ?, ?)
  `);
  
  const danmakus = [
    [1, '太详细了！', 10, '#FFFFFF', 0],
    [1, '老师讲得太好了', 25, '#00A1D6', 0],
    [1, '终于懂了', 45, '#FB7299', 0],
    [1, '666666', 60, '#FFD700', 0],
    [1, '收藏了！', 90, '#FFFFFF', 0],
    [1, '这个特性很实用', 120, '#00FF00', 0],
    [1, '学习到了', 180, '#FFFFFF', 0],
    [2, '好想学钢琴', 15, '#FFFFFF', 0],
    [2, '老师好温柔', 45, '#FB7299', 0],
    [2, '手势好标准', 120, '#00A1D6', 0],
    [3, '攻略太全了', 30, '#FFFFFF', 0],
    [3, '感谢UP主', 60, '#FFD700', 0],
    [3, '终于过了', 150, '#00FF00', 0],
    [4, '等我攒钱买', 20, '#FFFFFF', 0],
    [4, '测评很客观', 80, '#00A1D6', 0],
    [5, '向往的生活', 10, '#FB7299', 0],
    [5, '简洁大方', 50, '#FFFFFF', 0]
  ];
  
  danmakus.forEach(dm => insertDanmaku.run(...dm));
}

console.log('Database initialized successfully!');
export default db;
