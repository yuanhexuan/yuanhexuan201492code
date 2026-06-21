import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Video, Star, Eye } from 'lucide-react';
import { api } from '../utils/api';
import { VideoCard } from '../components/video/VideoCard';
import { formatNumber } from '../utils/format';
import type { User as UserType, Video as VideoType } from '../types';

export function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserType | null>(null);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const userId = parseInt(id);
    
    Promise.all([
      api.getUser(userId),
      api.getUserVideos(userId),
    ])
      .then(([userData, videoData]) => {
        setUser(userData);
        setVideos(videoData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-24 h-24 bg-[#252540] rounded-full" />
              <div>
                <div className="h-6 bg-[#252540] rounded w-32 mb-2" />
                <div className="h-4 bg-[#252540] rounded w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl text-white">用户不存在</h1>
          <Link to="/" className="text-[#00A1D6] hover:underline mt-4 inline-block">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#99A2B8] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="bg-[#252540] rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user.avatar}
              alt={user.nickname}
              className="w-24 h-24 rounded-full border-4 border-[#00A1D6]/30"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <h1 className="text-2xl font-bold text-white">{user.nickname}</h1>
                <span className="px-2 py-1 bg-gradient-to-r from-[#00A1D6] to-[#FB7299] text-white text-xs rounded-full font-medium">
                  Lv.{user.level}
                </span>
              </div>
              <p className="text-[#99A2B8] mt-2">{user.sign}</p>
              <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start text-sm">
                <div className="text-center">
                  <div className="text-white font-bold">{formatNumber(user.follow_count)}</div>
                  <div className="text-[#99A2B8]">关注</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-bold">{formatNumber(user.fan_count)}</div>
                  <div className="text-[#99A2B8]">粉丝</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Video className="w-5 h-5" />
            投稿视频 ({videos.length})
          </h2>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#252540] rounded-xl">
              <Video className="w-12 h-12 text-[#99A2B8] mx-auto mb-4" />
              <p className="text-[#99A2B8]">该用户还没有投稿视频</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
