import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, Coins, Star, Share2, MessageCircle } from 'lucide-react';
import { api } from '../utils/api';
import { VideoPlayer } from '../components/video/VideoPlayer';
import { VideoCard } from '../components/video/VideoCard';
import { formatNumber, formatTimeAgo } from '../utils/format';
import type { Video, Comment } from '../types';

export function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!id) return;

    const videoId = parseInt(id);
    
    Promise.all([
      api.getVideoById(videoId),
      api.getRelatedVideos(videoId),
      api.getComments(videoId),
    ])
      .then(([videoData, related, commentData]) => {
        setVideo(videoData);
        setRelatedVideos(related);
        setComments(commentData.comments || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="aspect-video bg-[#252540] rounded-xl" />
            <div className="mt-4 h-8 bg-[#252540] rounded w-3/4" />
            <div className="mt-2 h-4 bg-[#252540] rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl text-white">视频不存在</h1>
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
        <div className="lg:flex gap-8">
          <div className="flex-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#99A2B8] hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </Link>

            <VideoPlayer video={video} />

            <div className="mt-4">
              <h1 className="text-xl font-bold text-white">{video.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#99A2B8]">
                <span>{formatNumber(video.view_count)}播放</span>
                <span>·</span>
                <span>{formatTimeAgo(video.upload_time)}</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    liked ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' : 'bg-[#252540] text-[#99A2B8] hover:bg-[#303050]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked && 'fill-current'}`} />
                  <span>{formatNumber(video.like_count + (liked ? 1 : 0))}</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#252540] text-[#99A2B8] hover:bg-[#303050] transition-colors">
                  <Coins className="w-4 h-4" />
                  <span>{formatNumber(video.coin_count)}</span>
                </button>

                <button
                  onClick={() => setFavorited(!favorited)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    favorited ? 'bg-[#FF6B9D]/20 text-[#FF6B9D]' : 'bg-[#252540] text-[#99A2B8] hover:bg-[#303050]'
                  }`}
                >
                  <Star className={`w-4 h-4 ${favorited && 'fill-current'}`} />
                  <span>{formatNumber(video.favorite_count + (favorited ? 1 : 0))}</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#252540] text-[#99A2B8] hover:bg-[#303050] transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>分享</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-[#252540] rounded-xl">
                <Link to={`/user/${video.author_id}`} className="flex items-center gap-4">
                  <img
                    src={video.author_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={video.author_nickname}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{video.author_nickname}</span>
                      <span className="px-1.5 py-0.5 bg-[#00A1D6]/20 text-[#00A1D6] text-xs rounded">
                        Lv.{video.author_level || 1}
                      </span>
                    </div>
                    <p className="text-sm text-[#99A2B8] mt-1">
                      {video.category_name} · {formatNumber(video.danmaku_count)} 弹幕
                    </p>
                  </div>
                </Link>
              </div>

              <div className="mt-4 p-4 bg-[#252540] rounded-xl">
                <p className="text-white/90 whitespace-pre-wrap">{video.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  评论 ({comments.length})
                </h3>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-[#252540] rounded-xl">
                      <div className="flex items-start gap-3">
                        <img
                          src={comment.user_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                          alt={comment.user_nickname}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{comment.user_nickname}</span>
                            <span className="px-1 py-0.5 bg-[#FB7299]/20 text-[#FB7299] text-xs rounded">
                              Lv.{comment.user_level || 1}
                            </span>
                          </div>
                          <p className="text-white/90 mt-2">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-[#99A2B8]">
                            <span>{formatTimeAgo(comment.created_at)}</span>
                            <button className="flex items-center gap-1 hover:text-[#00A1D6] transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                              {comment.like_count}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="text-center text-[#99A2B8] py-8">还没有评论，快来抢沙发吧！</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-80 shrink-0 mt-6 lg:mt-0">
              <h3 className="text-lg font-bold text-white mb-4">相关推荐</h3>
              <div className="space-y-4">
                {relatedVideos.map((rv) => (
                  <VideoCard key={rv.id} video={rv} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
