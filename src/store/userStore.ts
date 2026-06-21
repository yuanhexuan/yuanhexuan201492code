import { create } from 'zustand';
import type { User } from '../types';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  setCurrentUser: (user: User | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    id: 1,
    nickname: '游客用户',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    level: 1,
    sign: '欢迎来到 VidHub',
    follow_count: 0,
    fan_count: 0,
  },
  isLoggedIn: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
}));
