import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, User, Home } from 'lucide-react';
import { useState } from 'react';
import { useUserStore } from '../../store/userStore';

export function Navbar() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { currentUser } = useUserStore();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-[#252540] border-b border-white/10 z-50">
      <div className="flex items-center h-full px-4 gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A1D6] to-[#FB7299] flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white hidden sm:block">VidHub</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索视频、UP主..."
              className="w-full h-9 pl-10 pr-4 rounded-full bg-[#1A1A2E] border border-white/10 text-white text-sm placeholder:text-[#99A2B8] focus:outline-none focus:border-[#00A1D6] transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99A2B8]" />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <Link
            to="/user/1"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A2E] border border-white/10 hover:border-[#00A1D6] transition-colors"
          >
            <img
              src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}
              alt="avatar"
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-white hidden sm:block">{currentUser?.nickname}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
