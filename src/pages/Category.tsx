import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';
import { VideoCard } from '../components/video/VideoCard';
import type { Video, Category } from '../types';

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      api.getCategories(),
      api.getVideosByCategory(id),
    ])
      .then(([categories, videoData]) => {
        const cat = categories.find((c) => c.id === id);
        setCategory(cat || null);
        setVideos(videoData.videos || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#99A2B8] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-[#252540] rounded w-32 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-video bg-[#252540] rounded-xl" />
                  <div className="mt-3 h-4 bg-[#252540] rounded w-3/4" />
                  <div className="mt-2 h-3 bg-[#252540] rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {category && (
              <div className="mb-6 flex items-center gap-4">
                <span className="text-5xl">{category.icon}</span>
                <div>
                  <h1 className="text-2xl font-bold text-white">{category.name}</h1>
                  <p className="text-[#99A2B8] mt-1">{category.description}</p>
                </div>
              </div>
            )}

            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[#99A2B8] text-lg">该分区暂无视频</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
