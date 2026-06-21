import { LayoutDashboard, Terminal, Users, Settings, Server } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/console', icon: Terminal, label: '控制台' },
  { to: '/players', icon: Users, label: '玩家管理' },
  { to: '/settings', icon: Settings, label: '服务器设置' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[#252540] border-r border-white/5 flex flex-col z-40">
      <div className="p-4 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#557C55] to-[#8BAA5D] flex items-center justify-center">
          <Server className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="font-bold text-white text-sm">MC Server</div>
          <div className="text-xs text-[#99A2B8]">管理面板</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#557C55]/20 text-[#8BAA5D]'
                  : 'text-[#99A2B8] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="text-xs text-[#666666]">Minecraft Server Manager</div>
        <div className="text-xs text-[#666666]">v1.0.0</div>
      </div>
    </aside>
  );
}
