import type { ServerStatus, Player, ConsoleLog, BanEntry, ApiResponse } from '../types';

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
  getServerStatus(): Promise<ServerStatus> {
    return fetchApi<ServerStatus>(`${API_BASE}/server/status`);
  },

  startServer(): Promise<ApiResponse<null>> {
    return fetchApi<ApiResponse<null>>(`${API_BASE}/server/start`, { method: 'POST' });
  },

  stopServer(): Promise<ApiResponse<null>> {
    return fetchApi<ApiResponse<null>>(`${API_BASE}/server/stop`, { method: 'POST' });
  },

  restartServer(): Promise<ApiResponse<null>> {
    return fetchApi<ApiResponse<null>>(`${API_BASE}/server/restart`, { method: 'POST' });
  },

  getLogs(limit = 50): Promise<ConsoleLog[]> {
    return fetchApi<ConsoleLog[]>(`${API_BASE}/server/logs?limit=${limit}`);
  },

  sendCommand(command: string): Promise<ApiResponse<string>> {
    return fetchApi<ApiResponse<string>>(`${API_BASE}/server/command`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  },

  getPlayers(): Promise<Player[]> {
    return fetchApi<Player[]>(`${API_BASE}/players`);
  },

  kickPlayer(playerName: string): Promise<ApiResponse<string>> {
    return fetchApi<ApiResponse<string>>(`${API_BASE}/players/kick`, {
      method: 'POST',
      body: JSON.stringify({ playerName }),
    });
  },

  banPlayer(playerName: string, reason?: string): Promise<ApiResponse<string>> {
    return fetchApi<ApiResponse<string>>(`${API_BASE}/players/ban`, {
      method: 'POST',
      body: JSON.stringify({ playerName, reason }),
    });
  },

  getBans(): Promise<BanEntry[]> {
    return fetchApi<BanEntry[]>(`${API_BASE}/bans`);
  },
};
