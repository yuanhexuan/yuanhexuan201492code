import { Link } from 'react-router-dom';
import type { Category } from '../../types';

interface SidebarProps {
  categories: Category[];
  currentCategory?: string;
}

export function Sidebar({ categories, currentCategory }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-48 bg-[#252540] border-r border-white/10 overflow-y-auto hidden lg:block">
      <nav className="p-3">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
            !currentCategory ? 'bg-[#00A1D6]/20 text-[#00A1D6]' : 'text-[#99A2B8] hover:bg-white/5 hover:text-white'
          }`}
        >
          <span className="text-lg">🏠</span>
          <span className="text-sm">首页</span>
        </Link>

        <div className="mt-4 mb-2 px-3">
          <span className="text-xs text-[#99A2B8] uppercase tracking-wider">分区</span>
        </div>

        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
              currentCategory === category.id
                ? 'bg-[#00A1D6]/20 text-[#00A1D6]'
                : 'text-[#99A2B8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="text-sm">{category.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
