import { useState, useEffect } from 'react';
import { Server, Users, Terminal, Settings, Play, Square, RotateCcw } from 'lucide-react';
import { useServerStore } from '../store/serverStore';
import { api } from '../utils/api';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-[#252540] rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-[#99A2B8]">{title}</div>
        <div className="text-xl font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { status, players, logs, setStatus, setPlayers, setLogs } = useServerStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const [statusData, playerList, logList] = await Promise.all([
        api.getServerStatus(),
        api.getPlayers(),
        api.getLogs(30),
      ]);
      setStatus(statusData);
      setPlayers(playerList);
      setLogs(logList);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    setIsRefreshing(false);
  };

  const handleStart = async () => {
    await api.startServer();
    await loadData();
  };

  const handleStop = async () => {
    await api.stopServer();
    await loadData();
  };

  const handleRestart = async () => {
    await api.restartServer();
    await loadData();
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatMemory = (mb: number) => {
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  if (!status) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#557C55]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Server Dashboard</h1>
          <p className="text-[#99A2B8] mt-1">Monitor and manage your Minecraft server</p>
        </div>

        <div className="flex gap-2">
          {!status.running ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Server
            </button>
          ) : (
            <>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Restart
              </button>
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2 bg-[#F44336] hover:bg-[#D32F2F] text-white rounded-lg transition-colors"
              >
                <Square className="w-5 h-5" />
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-3 p-4 bg-[#252540] rounded-xl ${
        status.running ? 'border-l-4 border-[#4CAF50]' : 'border-l-4 border-[#666666]'
      }`}>
        <div className={`w-3 h-3 rounded-full ${
          status.running ? 'bg-[#4CAF50] server-status-online' : 'bg-[#666666] server-status-offline'
        }`}></div>
        <div>
          <div className="font-semibold text-white">{status.name}</div>
          <div className="text-sm text-[#99A2B8]">
            {status.running ? 'Server is running' : 'Server is stopped'}
          </div>
        </div>
        <div className="ml-auto text-sm text-[#99A2B8]">
          v{status.version} | {status.host}:{status.port}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Players Online"
          value={`${status.online_players}/${status.max_players}`}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-[#557C55]"
        />
        <StatsCard
          title="TPS"
          value={status.tps}
          icon={<Server className="w-6 h-6 text-white" />}
          color="bg-[#8BAA5D]"
        />
        <StatsCard
          title="Uptime"
          value={formatUptime(status.uptime)}
          icon={<Terminal className="w-6 h-6 text-white" />}
          color="bg-[#D4A373]"
        />
        <StatsCard
          title="Memory Usage"
          value={`${formatMemory(status.memory_usage)} / ${formatMemory(status.max_memory)}`}
          icon={<Settings className="w-6 h-6 text-white" />}
          color="bg-[#6B7280]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#252540] rounded-xl p-4">
          <h3 className="font-semibold text-white mb-4">Online Players</h3>
          {players.length > 0 ? (
            <div className="space-y-2">
              {players.map((player) => (
                <div key={player.uuid} className="flex items-center justify-between p-3 bg-[#1A1A2E] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#557C55] flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{player.name}</div>
                      <div className="text-xs text-[#99A2B8]">{player.ip}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#99A2B8]">
              No players online
            </div>
          )}
        </div>

        <div className="bg-[#252540] rounded-xl p-4">
          <h3 className="font-semibold text-white mb-4">Recent Logs</h3>
          <div className="h-48 overflow-y-auto space-y-1 console-log">
            {logs.map((log) => (
              <div key={log.id} className={`text-sm ${
                log.level === 'WARN' ? 'console-log-warn' :
                log.level === 'ERROR' ? 'console-log-error' :
                log.level === 'COMMAND' ? 'console-log-command' : 'console-log-info'
              }`}>
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
