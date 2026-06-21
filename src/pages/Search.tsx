import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { api } from '../utils/api';
import { VideoCard } from '../components/video/VideoCard';
import type { Video } from '../types';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    if (!keyword) {
      setVideos([]);
      return;
    }

    setLoading(true);
    api.searchVideos(keyword)
      .then((data) => {
        setVideos(data.videos || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [keyword]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="搜索视频..."
                className="w-full h-12 pl-12 pr-4 rounded-full bg-[#252540] border border-white/10 text-white placeholder:text-[#99A2B8] focus:outline-none focus:border-[#00A1D6] transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#99A2B8]" />
            </div>
          </form>
        </div>

        {keyword && (
          <div className="mb-6">
            <h2 className="text-lg text-[#99A2B8]">
              搜索: <span className="text-white font-medium">"{keyword}"</span>
              <span className="ml-2">找到 {videos.length} 个结果</span>
            </h2>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-[#252540] rounded-xl" />
                <div className="mt-3 h-4 bg-[#252540] rounded w-3/4" />
                <div className="mt-2 h-3 bg-[#252540] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : keyword ? (
          <div className="text-center py-16">
            <p className="text-[#99A2B8] text-lg mb-4">没有找到相关视频</p>
            <Link to="/" className="text-[#00A1D6] hover:underline">
              返回首页
            </Link>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#99A2B8] text-lg">输入关键词搜索视频</p>
          </div>
        )}
      </div>
    </div>
  );
}
