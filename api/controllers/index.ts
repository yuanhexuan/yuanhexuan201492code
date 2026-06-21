import db from '../db/init.js';

interface Video {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  video_url: string;
  duration: number;
  view_count: number;
  like_count: number;
  coin_count: number;
  favorite_count: number;
  danmaku_count: number;
  category_id: string;
  author_id: number;
  upload_time: string;
  author_nickname?: string;
  author_avatar?: string;
  category_name?: string;
}

interface Category {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  description: string;
}

export const videoController = {
  getAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const videos = db.prepare(`
      SELECT v.*, u.nickname as author_nickname, u.avatar as author_avatar, c.name as category_name
      FROM videos v
      LEFT JOIN users u ON v.author_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      ORDER BY v.upload_time DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset) as Video[];
    
    const total = db.prepare('SELECT COUNT(*) as count FROM videos').get() as { count: number };
    
    return { videos, total: total.count, page, limit };
  },

  getById(id: number) {
    const video = db.prepare(`
      SELECT v.*, u.nickname as author_nickname, u.avatar as author_avatar, u.level as author_level, c.name as category_name
      FROM videos v
      LEFT JOIN users u ON v.author_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.id = ?
    `).get(id) as Video | undefined;
    
    if (video) {
      db.prepare('UPDATE videos SET view_count = view_count + 1 WHERE id = ?').run(id);
      video.view_count += 1;
    }
    
    return video;
  },

  getByCategory(categoryId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const videos = db.prepare(`
      SELECT v.*, u.nickname as author_nickname, u.avatar as author_avatar, c.name as category_name
      FROM videos v
      LEFT JOIN users u ON v.author_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.category_id = ?
      ORDER BY v.upload_time DESC
      LIMIT ? OFFSET ?
    `).all(categoryId, limit, offset) as Video[];
    
    const total = db.prepare('SELECT COUNT(*) as count FROM videos WHERE category_id = ?').get(categoryId) as { count: number };
    
    return { videos, total: total.count, page, limit };
  },

  search(keyword: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const searchPattern = `%${keyword}%`;
    const videos = db.prepare(`
      SELECT v.*, u.nickname as author_nickname, u.avatar as author_avatar, c.name as category_name
      FROM videos v
      LEFT JOIN users u ON v.author_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.title LIKE ? OR v.description LIKE ?
      ORDER BY v.view_count DESC
      LIMIT ? OFFSET ?
    `).all(searchPattern, searchPattern, limit, offset) as Video[];
    
    const total = db.prepare('SELECT COUNT(*) as count FROM videos WHERE title LIKE ? OR description LIKE ?').get(searchPattern, searchPattern) as { count: number };
    
    return { videos, total: total.count, page, limit };
  },

  getRelated(videoId: number, categoryId: string, limit = 10) {
    return db.prepare(`
      SELECT v.*, u.nickname as author_nickname, u.avatar as author_avatar
      FROM videos v
      LEFT JOIN users u ON v.author_id = u.id
      WHERE v.category_id = ? AND v.id != ?
      ORDER BY v.view_count DESC
      LIMIT ?
    `).all(categoryId, videoId, limit) as Video[];
  }
};

export const categoryController = {
  getAll() {
    return db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];
  },

  getById(id: string) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
  }
};

export const danmakuController = {
  getByVideo(videoId: number) {
    return db.prepare(`
      SELECT * FROM danmaku WHERE video_id = ? ORDER BY time
    `).all(videoId);
  },

  create(videoId: number, content: string, time: number, color: string = '#FFFFFF', type: number = 0) {
    const result = db.prepare(`
      INSERT INTO danmaku (video_id, content, time, color, type) VALUES (?, ?, ?, ?, ?)
    `).run(videoId, content, time, color, type);
    
    db.prepare('UPDATE videos SET danmaku_count = danmaku_count + 1 WHERE id = ?').run(videoId);
    
    return { id: result.lastInsertRowid, videoId, content, time, color, type };
  }
};

export const commentController = {
  getByVideo(videoId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const comments = db.prepare(`
      SELECT c.*, u.nickname as user_nickname, u.avatar as user_avatar, u.level as user_level
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.video_id = ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(videoId, limit, offset);
    
    const total = db.prepare('SELECT COUNT(*) as count FROM comments WHERE video_id = ?').get(videoId) as { count: number };
    
    return { comments, total: total.count, page, limit };
  },

  create(videoId: number, userId: number, content: string) {
    const result = db.prepare(`
      INSERT INTO comments (video_id, user_id, content) VALUES (?, ?, ?)
    `).run(videoId, userId, content);
    
    return { id: result.lastInsertRowid, videoId, userId, content };
  }
};

export const userController = {
  getById(id: number) {
    return db.prepare('SELECT id, nickname, avatar, level, sign, follow_count, fan_count FROM users WHERE id = ?').get(id);
  },

  getVideos(userId: number) {
    return db.prepare(`
      SELECT v.*, u.nickname as author_nickname, u.avatar as author_avatar, c.name as category_name
      FROM videos v
      LEFT JOIN users u ON v.author_id = u.id
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.author_id = ?
      ORDER BY v.upload_time DESC
    `).all(userId);
  }
};
