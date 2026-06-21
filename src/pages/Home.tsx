import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../utils/api';
import { VideoCard } from '../components/video/VideoCard';
import { Carousel } from '../components/common/Carousel';
import type { Video, Category, Banner } from '../types';

export function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { categories } = useOutletContext<{ categories: Category[] }>();

  useEffect(() => {
    Promise.all([
      api.getVideos(1, 12),
      api.getBanners(),
    ])
      .then(([videoData, bannerData]) => {
        setVideos(videoData.videos || []);
        setBanners(bannerData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <section className="mb-8">
          <Carousel banners={banners} />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> 热门推荐
          </h2>
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </section>

        {categories.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📂</span> 分区
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex flex-col items-center gap-2 p-4 bg-[#252540] rounded-xl hover:bg-[#303050] transition-colors group"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <span className="text-sm text-[#99A2B8] group-hover:text-white transition-colors">
                    {category.name}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🕐</span> 最新投稿
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-[#252540] rounded-xl" />
                  <div className="mt-3 h-4 bg-[#252540] rounded w-3/4" />
                  <div className="mt-2 h-3 bg-[#252540] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.slice(0, 4).map((video) => (
                <VideoCard key={video.id} video={video} size="large" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
