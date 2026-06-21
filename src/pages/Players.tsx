import { useState, useEffect } from 'react';
import { Users, Ban, UserMinus, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import type { Player, BanEntry } from '../types';

export function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [bans, setBans] = useState<BanEntry[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [banReason, setBanReason] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [playerList, banList] = await Promise.all([
        api.getPlayers(),
        api.getBans(),
      ]);
      setPlayers(playerList);
      setBans(banList);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleKick = async (playerName: string) => {
    try {
      await api.kickPlayer(playerName);
      await loadData();
    } catch (err) {
      console.error('Failed to kick player:', err);
    }
  };

  const handleBan = async () => {
    if (!selectedPlayer) return;
    try {
      await api.banPlayer(selectedPlayer, banReason);
      await loadData();
      setShowBanModal(false);
      setSelectedPlayer(null);
      setBanReason('');
    } catch (err) {
      console.error('Failed to ban player:', err);
    }
  };

  const openBanModal = (playerName: string) => {
    setSelectedPlayer(playerName);
    setShowBanModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#557C55]" />
          <h1 className="text-xl font-bold text-white">玩家管理</h1>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-[#252540] hover:bg-[#303050] text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          刷新
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#252540] rounded-xl p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            在线玩家 ({players.length})
          </h3>
          {players.length > 0 ? (
            <div className="space-y-3">
              {players.map((player) => (
                <div key={player.uuid} className="flex items-center justify-between p-3 bg-[#1A1A2E] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#557C55] to-[#8BAA5D] flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{player.name}</div>
                      <div className="text-xs text-[#99A2B8]">{player.ip}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openBanModal(player.name)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#F44336]/20 hover:bg-[#F44336]/30 text-[#F44336] text-sm rounded-lg transition-colors"
                    >
                      <Ban className="w-3 h-3" />
                      封禁
                    </button>
                    <button
                      onClick={() => handleKick(player.name)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#FF9800]/20 hover:bg-[#FF9800]/30 text-[#FF9800] text-sm rounded-lg transition-colors"
                    >
                      <UserMinus className="w-3 h-3" />
                      踢出
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#99A2B8]">暂无在线玩家</div>
          )}
        </div>

        <div className="bg-[#252540] rounded-xl p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Ban className="w-5 h-5 text-[#F44336]" />
            封禁列表 ({bans.length})
          </h3>
          {bans.length > 0 ? (
            <div className="space-y-3">
              {bans.map((ban) => (
                <div key={ban.id} className="p-3 bg-[#1A1A2E] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{ban.player_name}</div>
                      <div className="text-xs text-[#99A2B8]">由 {ban.banned_by} 封禁</div>
                    </div>
                    <div className="text-xs text-[#FF9800]">
                      {new Date(ban.banned_at).toLocaleDateString()}
                    </div>
                  </div>
                  {ban.reason && (
                    <div className="mt-2 text-sm text-[#F44336]">原因: {ban.reason}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#99A2B8]">暂无封禁玩家</div>
          )}
        </div>
      </div>

      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#252540] rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">封禁玩家</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#99A2B8] mb-1">玩家</label>
                <input
                  type="text"
                  value={selectedPlayer || ''}
                  disabled
                  className="w-full px-4 py-2 bg-[#1A1A2E] border border-[#444466] rounded-lg text-white disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#99A2B8] mb-1">原因（可选）</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="输入封禁原因..."
                  className="w-full px-4 py-2 bg-[#1A1A2E] border border-[#444466] rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#557C55]"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowBanModal(false); setSelectedPlayer(null); setBanReason(''); }}
                  className="flex-1 px-4 py-2 bg-[#444466] hover:bg-[#555577] text-white rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBan}
                  className="flex-1 px-4 py-2 bg-[#F44336] hover:bg-[#D32F2F] text-white rounded-lg transition-colors"
                >
                  确认封禁
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
