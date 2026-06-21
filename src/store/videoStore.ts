import { create } from 'zustand';
import type { Video, Danmaku } from '../types';

interface VideoState {
  currentVideo: Video | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  danmakuEnabled: boolean;
  danmakuOpacity: number;
  danmakuList: Danmaku[];
  setCurrentVideo: (video: Video | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setDanmakuEnabled: (enabled: boolean) => void;
  setDanmakuOpacity: (opacity: number) => void;
  setDanmakuList: (list: Danmaku[]) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  danmakuEnabled: true,
  danmakuOpacity: 1,
  danmakuList: [],
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setDanmakuEnabled: (enabled) => set({ danmakuEnabled: enabled }),
  setDanmakuOpacity: (opacity) => set({ danmakuOpacity: opacity }),
  setDanmakuList: (list) => set({ danmakuList: list }),
}));
