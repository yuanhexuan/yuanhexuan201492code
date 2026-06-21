import { FastifyInstance } from 'fastify';
import { videoController, categoryController, danmakuController, commentController, userController } from '../controllers/index.js';

export async function registerRoutes(fastify: FastInstance) {
  fastify.get('/api/categories', async () => {
    return categoryController.getAll();
  });

  fastify.get('/api/videos', async (request) => {
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    return videoController.getAll(parseInt(page), parseInt(limit));
  });

  fastify.get('/api/videos/:id', async (request) => {
    const { id } = request.params as { id: string };
    return videoController.getById(parseInt(id));
  });

  fastify.get('/api/videos/category/:categoryId', async (request) => {
    const { categoryId } = request.params as { categoryId: string };
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    return videoController.getByCategory(categoryId, parseInt(page), parseInt(limit));
  });

  fastify.get('/api/videos/:id/related', async (request) => {
    const { id } = request.params as { id: string };
    const video = videoController.getById(parseInt(id));
    if (!video) {
      return { error: 'Video not found' };
    }
    return videoController.getRelated(parseInt(id), video.category_id);
  });

  fastify.get('/api/search', async (request) => {
    const { keyword, page = '1', limit = '20' } = request.query as { keyword: string; page?: string; limit?: string };
    if (!keyword) {
      return { videos: [], total: 0, page: 1, limit: 20 };
    }
    return videoController.search(keyword, parseInt(page), parseInt(limit));
  });

  fastify.get('/api/danmaku/:videoId', async (request) => {
    const { videoId } = request.params as { videoId: string };
    return danmakuController.getByVideo(parseInt(videoId));
  });

  fastify.post('/api/danmaku', async (request) => {
    const { videoId, content, time, color, type } = request.body as {
      videoId: number;
      content: string;
      time: number;
      color?: string;
      type?: number;
    };
    return danmakuController.create(videoId, content, time, color, type);
  });

  fastify.get('/api/comments/:videoId', async (request) => {
    const { videoId } = request.params as { videoId: string };
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };
    return commentController.getByVideo(parseInt(videoId), parseInt(page), parseInt(limit));
  });

  fastify.post('/api/comments', async (request) => {
    const { videoId, userId, content } = request.body as {
      videoId: number;
      userId: number;
      content: string;
    };
    return commentController.create(videoId, userId, content);
  });

  fastify.get('/api/users/:id', async (request) => {
    const { id } = request.params as { id: string };
    return userController.getById(parseInt(id));
  });

  fastify.get('/api/users/:id/videos', async (request) => {
    const { id } = request.params as { id: string };
    return userController.getVideos(parseInt(id));
  });

  fastify.get('/api/banners', async () => {
    return [
      { id: 1, image: 'https://picsum.photos/seed/banner1/1200/400', title: '热门推荐', link: '/watch/1' },
      { id: 2, image: 'https://picsum.photos/seed/banner2/1200/400', title: '新番上线', link: '/category/anime' },
      { id: 3, image: 'https://picsum.photos/seed/banner3/1200/400', title: '游戏专区', link: '/category/game' }
    ];
  });
}
