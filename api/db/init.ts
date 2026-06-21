import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'mcserver.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    host TEXT DEFAULT '0.0.0.0',
    port INTEGER DEFAULT 25565,
    max_players INTEGER DEFAULT 20,
    version TEXT DEFAULT '1.21.1',
    status TEXT DEFAULT 'stopped',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    uuid TEXT UNIQUE,
    ip TEXT,
    joined_at DATETIME,
    left_at DATETIME,
    is_online INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS console_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER DEFAULT 1,
    message TEXT NOT NULL,
    level TEXT DEFAULT 'INFO',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    player_uuid TEXT,
    reason TEXT,
    banned_by TEXT,
    banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
  );
`);

const serverCount = db.prepare('SELECT COUNT(*) as count FROM servers').get() as { count: number };
if (serverCount.count === 0) {
  db.prepare(`
    INSERT INTO servers (name, host, port, max_players, version)
    VALUES (?, ?, ?, ?, ?)
  `).run('Main Server', '0.0.0.0', 25565, 20, '1.21.1');
}

const logCount = db.prepare('SELECT COUNT(*) as count FROM console_logs').get() as { count: number };
if (logCount.count === 0) {
  const insertLog = db.prepare(`
    INSERT INTO console_logs (server_id, message, level) VALUES (?, ?, ?)
  `);
  
  const logs = [
    [1, 'Starting Minecraft server...', 'INFO'],
    [1, 'Loading properties', 'INFO'],
    [1, 'Default game type: SURVIVAL', 'INFO'],
    [1, 'Generating keypair', 'INFO'],
    [1, 'Starting Minecraft server on *:25565', 'INFO'],
    [1, 'Using default channel type', 'INFO'],
    [1, 'Preparing level "world"', 'INFO'],
    [1, 'Preparing start region for dimension minecraft:overworld', 'INFO'],
    [1, 'Time elapsed: 2345 ms', 'INFO'],
    [1, 'Done (2.566s)! For help, type "help"', 'INFO']
  ];
  
  logs.forEach(log => insertLog.run(...log));
}

console.log('Database initialized successfully!');
export default db;
