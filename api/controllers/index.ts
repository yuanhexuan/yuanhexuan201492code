import db from '../db/init.js';

let serverStatus = {
  running: false,
  players: [] as Array<{ name: string; uuid: string; ip: string }>,
  tps: 20,
  uptime: 0,
  memoryUsage: 0,
  maxMemory: 2048
};

let uptimeInterval: ReturnType<typeof setInterval> | null = null;

export const serverController = {
  getStatus() {
    const server = db.prepare('SELECT * FROM servers WHERE id = 1').get() as {
      id: number;
      name: string;
      host: string;
      port: number;
      max_players: number;
      version: string;
      status: string;
    };
    
    const onlinePlayers = serverStatus.players.length;
    
    return {
      ...server,
      running: serverStatus.running,
      online_players: onlinePlayers,
      tps: serverStatus.tps,
      uptime: serverStatus.uptime,
      memory_usage: serverStatus.memoryUsage,
      max_memory: serverStatus.maxMemory
    };
  },

  start() {
    if (serverStatus.running) {
      return { success: false, message: 'Server is already running' };
    }

    serverStatus.running = true;
    serverStatus.uptime = 0;
    serverStatus.memoryUsage = 512;
    serverStatus.tps = 20;
    
    db.prepare('UPDATE servers SET status = "running" WHERE id = 1').run();
    
    const insertLog = db.prepare('INSERT INTO console_logs (server_id, message, level) VALUES (?, ?, ?)');
    insertLog.run(1, '[Server] Starting Minecraft server...', 'INFO');
    insertLog.run(1, '[Server] Loading properties', 'INFO');
    insertLog.run(1, '[Server] Starting Minecraft server on *:25565', 'INFO');
    insertLog.run(1, '[Server] Done! For help, type "help"', 'INFO');

    uptimeInterval = setInterval(() => {
      serverStatus.uptime += 1;
      serverStatus.memoryUsage = Math.min(1800, 512 + Math.floor(Math.random() * 50));
      serverStatus.tps = Math.floor(18 + Math.random() * 4);
      
      if (Math.random() < 0.1) {
        const players = ['Steve', 'Alex', 'Notch', 'Herobrine', 'Player123', 'GamerPro'];
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        
        if (serverStatus.players.length < 5 && Math.random() < 0.5) {
          serverStatus.players.push({
            name: randomPlayer,
            uuid: 'uuid-' + Math.random().toString(36).substr(2, 9),
            ip: '192.168.1.' + Math.floor(Math.random() * 255)
          });
          insertLog.run(1, `[Server] ${randomPlayer} joined the game`, 'INFO');
        } else if (serverStatus.players.length > 0 && Math.random() < 0.3) {
          const leavingPlayer = serverStatus.players.shift();
          if (leavingPlayer) {
            insertLog.run(1, `[Server] ${leavingPlayer.name} left the game`, 'INFO');
          }
        }
      }
    }, 1000);

    return { success: true, message: 'Server started successfully' };
  },

  stop() {
    if (!serverStatus.running) {
      return { success: false, message: 'Server is not running' };
    }

    const insertLog = db.prepare('INSERT INTO console_logs (server_id, message, level) VALUES (?, ?, ?)');
    insertLog.run(1, '[Server] Stopping server...', 'INFO');
    insertLog.run(1, '[Server] Saving players', 'INFO');
    insertLog.run(1, '[Server] Saving worlds', 'INFO');
    insertLog.run(1, '[Server] Server stopped', 'INFO');

    if (uptimeInterval) {
      clearInterval(uptimeInterval);
      uptimeInterval = null;
    }

    serverStatus.running = false;
    serverStatus.players = [];
    serverStatus.uptime = 0;
    serverStatus.memoryUsage = 0;

    db.prepare('UPDATE servers SET status = "stopped" WHERE id = 1').run();

    return { success: true, message: 'Server stopped successfully' };
  },

  restart() {
    this.stop();
    setTimeout(() => this.start(), 1000);
    return { success: true, message: 'Server restarting...' };
  },

  getLogs(limit = 50) {
    return db.prepare(`
      SELECT * FROM console_logs 
      WHERE server_id = 1 
      ORDER BY timestamp DESC 
      LIMIT ?
    `).all(limit) as Array<{
      id: number;
      server_id: number;
      message: string;
      level: string;
      timestamp: string;
    }>;
  },

  sendCommand(command: string) {
    if (!serverStatus.running) {
      return { success: false, message: 'Server is not running' };
    }

    const insertLog = db.prepare('INSERT INTO console_logs (server_id, message, level) VALUES (?, ?, ?)');
    insertLog.run(1, `> ${command}`, 'COMMAND');

    const responses: Record<string, string> = {
      'help': '[Server] Available commands: help, list, stop, say, tp, kick, ban',
      'list': `[Server] There are ${serverStatus.players.length} of a max 20 players online: ${serverStatus.players.map(p => p.name).join(', ')}`,
      'stop': '[Server] Server is stopping...',
      'say': '[Server] Message sent to all players',
      'players': `[Server] Online players: ${serverStatus.players.map(p => p.name).join(', ')}`
    };

    const response = responses[command.toLowerCase()] || `[Server] Command executed: ${command}`;
    insertLog.run(1, response, 'INFO');

    return { success: true, message: response };
  }
};

export const playerController = {
  getAll() {
    return serverStatus.players.map(p => ({
      ...p,
      joined_at: new Date().toISOString(),
      left_at: null
    }));
  },

  getOnline() {
    return serverStatus.players;
  },

  kick(playerName: string) {
    const index = serverStatus.players.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (index === -1) {
      return { success: false, message: 'Player not found' };
    }

    const removed = serverStatus.players.splice(index, 1)[0];
    
    const insertLog = db.prepare('INSERT INTO console_logs (server_id, message, level) VALUES (?, ?, ?)');
    insertLog.run(1, `[Server] ${removed.name} was kicked`, 'INFO');

    return { success: true, message: `Kicked ${removed.name}` };
  },

  ban(playerName: string, reason: string = 'No reason provided') {
    const insertLog = db.prepare('INSERT INTO console_logs (server_id, message, level) VALUES (?, ?, ?)');
    
    const index = serverStatus.players.findIndex(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (index !== -1) {
      serverStatus.players.splice(index, 1);
      insertLog.run(1, `[Server] ${playerName} was banned: ${reason}`, 'WARN');
    }

    db.prepare(`
      INSERT INTO bans (player_name, reason, banned_by) VALUES (?, ?, ?)
    `).run(playerName, reason, 'Admin');

    return { success: true, message: `Banned ${playerName}` };
  },

  getBans() {
    return db.prepare('SELECT * FROM bans ORDER BY banned_at DESC').all() as Array<{
      id: number;
      player_name: string;
      player_uuid: string;
      reason: string;
      banned_by: string;
      banned_at: string;
      expires_at: string;
    }>;
  }
};
