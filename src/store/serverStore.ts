import { create } from 'zustand';
import type { ServerStatus, Player, ConsoleLog } from '../types';

interface ServerState {
  status: ServerStatus | null;
  players: Player[];
  logs: ConsoleLog[];
  isLoading: boolean;
  setStatus: (status: ServerStatus) => void;
  setPlayers: (players: Player[]) => void;
  setLogs: (logs: ConsoleLog[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useServerStore = create<ServerState>((set) => ({
  status: null,
  players: [],
  logs: [],
  isLoading: false,
  setStatus: (status) => set({ status }),
  setPlayers: (players) => set({ players }),
  setLogs: (logs) => set({ logs }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
