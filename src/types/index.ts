export interface User {
  id: number;
  nickname: string;
  avatar: string;
  level: number;
  sign: string;
  follow_count: number;
  fan_count: number;
}

export interface Category {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  description: string;
}

export interface Video {
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
  author_level?: number;
  category_name?: string;
}

export interface Danmaku {
  id: number;
  video_id: number;
  content: string;
  time: number;
  color: string;
  type: number;
}

export interface Comment {
  id: number;
  video_id: number;
  user_id: number;
  content: string;
  like_count: number;
  created_at: string;
  user_nickname?: string;
  user_avatar?: string;
  user_level?: number;
}

export interface Banner {
  id: number;
  image: string;
  title: string;
  link: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  videos?: T[];
  comments?: T[];
  total: number;
  page: number;
  limit: number;
}
