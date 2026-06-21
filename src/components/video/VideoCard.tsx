import { Link } from 'react-router-dom';
import type { Video } from '../../types';
import { formatNumber, formatDuration, formatTimeAgo } from '../../utils/format';

interface VideoCardProps {
  video: Video;
  size?: 'normal' | 'large';
}

export function VideoCard({ video, size = 'normal' }: VideoCardProps) {
  const isLarge = size === 'large';

  return (
    <Link to={`/watch/${video.id}`} className="block group">
      <div
        className={`relative rounded-xl overflow-hidden bg-[#252540] transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-black/20 ${
          isLarge ? 'aspect-video' : ''
        }`}
      >
        <img
          src={video.cover_url || `https://picsum.photos/seed/${video.id}/640/360`}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <span className="text-xs text-white/90">
            {formatDuration(video.duration)}
          </span>
        </div>
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
          {formatNumber(video.view_count)}播放
        </div>
      </div>

      <div className="mt-3 px-1">
        <h3
          className={`text-white line-clamp-2 group-hover:text-[#00A1D6] transition-colors ${
            isLarge ? 'text-base' : 'text-sm'
          }`}
        >
          {video.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <img
            src={video.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            alt={video.author_nickname}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-[#99A2B8]">{video.author_nickname}</span>
          <span className="text-xs text-[#99A2B8]">·</span>
          <span className="text-xs text-[#99A2B8]">{formatTimeAgo(video.upload_time)}</span>
        </div>
      </div>
    </Link>
  );
}
