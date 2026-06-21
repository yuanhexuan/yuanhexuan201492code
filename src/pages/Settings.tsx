import { useState, useEffect } from 'react';
import { Save, Server, Users, Cpu, HardDrive } from 'lucide-react';
import { api } from '../utils/api';
import type { ServerStatus } from '../types';

export function SettingsPage() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [serverName, setServerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [port, setPort] = useState(25565);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getServerStatus().then((data) => {
      setStatus(data);
      setServerName(data.name);
      setMaxPlayers(data.max_players);
      setPort(data.port);
    });
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <div className="flex items-center gap-3">
          <Server className="w-6 h-6 text-[#557C55]" />
          <h1 className="text-xl font-bold text-white">服务器设置</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-[#557C55] hover:bg-[#4A6E4A] text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? '已保存' : '保存设置'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#252540] rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-[#8BAA5D]" />
            基本设置
          </h3>
          
          <div>
            <label className="block text-sm text-[#99A2B8] mb-1">服务器名称</label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              className="w-full px-4 py-2 bg-[#1A1A2E] border border-[#444466] rounded-lg text-white focus:outline-none focus:border-[#557C55]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#99A2B8] mb-1">服务器端口</label>
            <input
              type="number"
              value={port}
              onChange={(e) => setPort(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-[#1A1A2E] border border-[#444466] rounded-lg text-white focus:outline-none focus:border-[#557C55]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#99A2B8] mb-1">最大玩家数</label>
            <input
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-[#1A1A2E] border border-[#444466] rounded-lg text-white focus:outline-none focus:border-[#557C55]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#99A2B8] mb-1">游戏版本</label>
            <input
              type="text"
              value={status.version}
              disabled
              className="w-full px-4 py-2 bg-[#1A1A2E] border border-[#444466] rounded-lg text-white disabled:opacity-50"
            />
          </div>
        </div>

        <div className="bg-[#252540] rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#8BAA5D]" />
            系统信息
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1A1A2E] rounded-lg">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-[#557C55]" />
                <span className="text-[#99A2B8]">TPS</span>
              </div>
              <span className="text-white font-medium">{status.tps}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1A1A2E] rounded-lg">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-[#557C55]" />
                <span className="text-[#99A2B8]">内存使用</span>
              </div>
              <span className="text-white font-medium">
                {(status.memory_usage / 1024).toFixed(1)} / {(status.max_memory / 1024).toFixed(1)} GB
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1A1A2E] rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#557C55]" />
                <span className="text-[#99A2B8]">在线玩家</span>
              </div>
              <span className="text-white font-medium">
                {status.online_players} / {status.max_players}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1A1A2E] rounded-lg">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-[#557C55]" />
                <span className="text-[#99A2B8]">服务器状态</span>
              </div>
              <span className={`font-medium ${status.running ? 'text-[#4CAF50]' : 'text-[#666666]'}`}>
                {status.running ? '运行中' : '已停止'}
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-[#1A1A2E] rounded-lg border border-[#557C55]/20">
            <h4 className="text-sm font-medium text-[#8BAA5D] mb-2">连接信息</h4>
            <div className="text-sm text-[#99A2B8] space-y-1">
              <p>服务器地址: <span className="text-white">{status.host}:{status.port}</span></p>
              <p>版本: <span className="text-white">{status.version}</span></p>
              <p>游戏模式: <span className="text-white">生存模式</span></p>
              <p>难度: <span className="text-white">普通</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
