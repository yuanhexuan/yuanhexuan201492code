export interface ServerStatus {
  id: number;
  name: string;
  host: string;
  port: number;
  max_players: number;
  version: string;
  status: string;
  running: boolean;
  online_players: number;
  tps: number;
  uptime: number;
  memory_usage: number;
  max_memory: number;
}

export interface Player {
  name: string;
  uuid: string;
  ip: string;
  joined_at?: string;
  left_at?: string;
}

export interface ConsoleLog {
  id: number;
  server_id: number;
  message: string;
  level: string;
  timestamp: string;
}

export interface BanEntry {
  id: number;
  player_name: string;
  player_uuid: string;
  reason: string;
  banned_by: string;
  banned_at: string;
  expires_at: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}
