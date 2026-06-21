import type { Video, Category, Danmaku, Comment, Banner, PaginatedResponse, User } from '../types';

const API_BASE = 'http://localhost:3001/api';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

export const api = {
  getVideos(page = 1, limit = 20) {
    return fetchApi<PaginatedResponse<Video>>(`${API_BASE}/videos?page=${page}&limit=${limit}`);
  },

  getVideoById(id: number) {
    return fetchApi<Video>(`${API_BASE}/videos/${id}`);
  },

  getVideosByCategory(categoryId: string, page = 1, limit = 20) {
    return fetchApi<PaginatedResponse<Video>>(`${API_BASE}/videos/category/${categoryId}?page=${page}&limit=${limit}`);
  },

  getRelatedVideos(id: number) {
    return fetchApi<Video[]>(`${API_BASE}/videos/${id}/related`);
  },

  getCategories() {
    return fetchApi<Category[]>(`${API_BASE}/categories`);
  },

  getBanners() {
    return fetchApi<Banner[]>(`${API_BASE}/banners`);
  },

  searchVideos(keyword: string, page = 1, limit = 20) {
    return fetchApi<PaginatedResponse<Video>>(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`);
  },

  getDanmaku(videoId: number) {
    return fetchApi<Danmaku[]>(`${API_BASE}/danmaku/${videoId}`);
  },

  sendDanmaku(videoId: number, content: string, time: number, color = '#FFFFFF', type = 0) {
    return fetchApi<Danmaku>(`${API_BASE}/danmaku`, {
      method: 'POST',
      body: JSON.stringify({ videoId, content, time, color, type }),
    });
  },

  getComments(videoId: number, page = 1, limit = 20) {
    return fetchApi<PaginatedResponse<Comment>>(`${API_BASE}/comments/${videoId}?page=${page}&limit=${limit}`);
  },

  sendComment(videoId: number, userId: number, content: string) {
    return fetchApi<Comment>(`${API_BASE}/comments`, {
      method: 'POST',
      body: JSON.stringify({ videoId, userId, content }),
    });
  },

  getUser(userId: number) {
    return fetchApi<User>(`${API_BASE}/users/${userId}`);
  },

  getUserVideos(userId: number) {
    return fetchApi<Video[]>(`${API_BASE}/users/${userId}/videos`);
  },
};
