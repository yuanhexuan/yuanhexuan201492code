export type Category =
  | 'animation'
  | 'anime'
  | 'music'
  | 'game'
  | 'tech'
  | 'life'
  | 'entertainment'
  | 'film';

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  level: number;
  sign: string;
  followCount: number;
  fanCount: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  coinCount: number;
  favoriteCount: number;
  danmakuCount: number;
  uploadTime: string;
  category: Category;
  author: User;
}

export interface Danmaku {
  id: string;
  text: string;
  color: string;
  time: number;
  type: 'scroll' | 'top' | 'bottom';
}

export interface Comment {
  id: string;
  userId: string;
  nickname: string;
  avatar: string;
  content: string;
  time: string;
  likeCount: number;
  replies?: Comment[];
}

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  description: string;
}
