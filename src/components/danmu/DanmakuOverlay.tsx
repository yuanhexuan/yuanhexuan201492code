import { useEffect, useState, useRef, useCallback } from 'react';
import type { Danmaku } from '../../types';
import { api } from '../../utils/api';

interface DanmakuOverlayProps {
  videoId: number;
  currentTime: number;
  enabled: boolean;
  opacity: number;
}

interface DisplayDanmaku extends Danmaku {
  left: number;
  top: number;
}

export function DanmakuOverlay({ videoId, currentTime, enabled, opacity }: DanmakuOverlayProps) {
  const [danmakus, setDanmakus] = useState<Danmaku[]>([]);
  const [displayDanmakus, setDisplayDanmakus] = useState<DisplayDanmaku[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    api.getDanmaku(videoId).then(setDanmakus).catch(console.error);
  }, [videoId]);

  const showDanmaku = useCallback((dm: Danmaku) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerHeight = container.offsetHeight;
    const lineHeight = 30;
    const maxLines = Math.floor(containerHeight / lineHeight);

    const top = Math.floor(Math.random() * maxLines) * lineHeight;
    const left = container.offsetWidth;

    setDisplayDanmakus((prev) => [
      ...prev,
      { ...dm, left, top },
    ]);
  }, []);

  useEffect(() => {
    if (!enabled || danmakus.length === 0) {
      setDisplayDanmakus([]);
      return;
    }

    const visibleDanmakus = danmakus.filter(
      (dm) => Math.abs(dm.time - currentTime) < 0.5
    );

    visibleDanmakus.forEach((dm) => {
      const exists = displayDanmakus.some((dd) => dd.id === dm.id);
      if (!exists) {
        showDanmaku(dm);
      }
    });
  }, [currentTime, danmakus, enabled, showDanmaku]);

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      setDisplayDanmakus((prev) =>
        prev
          .map((dm) => ({
            ...dm,
            left: dm.left - 2,
          }))
          .filter((dm) => dm.left > -200)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className="danmaku-container"
      style={{ opacity }}
    >
      {displayDanmakus.map((dm) => (
        <span
          key={dm.id}
          className="danmaku-text"
          style={{
            left: dm.left,
            top: dm.top,
            color: dm.color,
          }}
        >
          {dm.content}
        </span>
      ))}
    </div>
  );
}
