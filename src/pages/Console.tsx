import { useState, useEffect, useRef } from 'react';
import { Terminal, Send } from 'lucide-react';
import { api } from '../utils/api';
import type { ConsoleLog } from '../types';

export function ConsolePage() {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [command, setCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const loadLogs = async () => {
    try {
      const newLogs = await api.getLogs(100);
      setLogs(newLogs);
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  const handleSendCommand = async () => {
    if (!command.trim()) return;
    setIsLoading(true);
    try {
      await api.sendCommand(command.trim());
      setCommand('');
      await loadLogs();
    } catch (err) {
      console.error('Failed to send command:', err);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendCommand();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-[#557C55]" />
          <h1 className="text-xl font-bold text-white">Server Console</h1>
        </div>
      </div>

      <div className="flex-1 bg-[#1A1A2E] rounded-xl p-4 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-1 console-log pr-4">
          {logs.map((log) => (
            <div key={log.id} className={`text-sm ${
              log.level === 'WARN' ? 'console-log-warn' :
              log.level === 'ERROR' ? 'console-log-error' :
              log.level === 'COMMAND' ? 'console-log-command' : 'console-log-info'
            }`}>
              <span className="text-[#666666] text-xs mr-2">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              {log.message}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter command (e.g., help, list, say Hello)"
              className="w-full px-4 py-3 bg-[#252540] border border-[#444466] rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#557C55]"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendCommand}
            disabled={isLoading || !command.trim()}
            className="px-6 py-3 bg-[#557C55] hover:bg-[#4A6E4A] disabled:bg-[#444444] disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-[#666666]">
          Available commands: help, list, say, players, stop
        </div>
      </div>
    </div>
  );
}
