import React from 'react';
import { type Article } from './data/particleData';

interface LinearStripProps {
  articles: Article[];
  visible: boolean;
  phase?: 'reveal' | 'strip';
  revealFrom?: { x: number; y: number; size: number }[];
}

export default function LinearStrip({ articles, visible, phase = 'strip', revealFrom }: LinearStripProps) {
  if (!visible) return null;
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const thumbW = 100;
  const gap = 24;
  const pad = 32;
  return (
    <div className="fixed inset-0 z-20 overflow-x-auto overflow-y-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="h-full flex items-center" style={{ padding: `0 ${pad}px` }}>
        <div className="relative" style={{ height: 120, width: articles.length * (thumbW + gap) - gap }}>
          {articles.map((a, i) => {
            const targetLeft = i * (thumbW + gap);
            const from = revealFrom?.[i];
            let transform: string;
            let opacity: number;
            if (phase === 'reveal') {
              if (from) {
                const dx = (viewportWidth / 2) - (targetLeft + thumbW / 2 + pad);
                // Start near center with small scale to mimic particle-to-image growth
                transform = `translateX(${dx}px) scale(${Math.max(0.1, from.size / thumbW)})`;
              } else {
                const dx = viewportWidth / 2 - (targetLeft + thumbW / 2 + pad);
                transform = `translateX(${dx}px) scale(0.1)`;
              }
              opacity = 0;
            } else {
              transform = 'translateX(0px) scale(1)';
              opacity = 1;
            }
            return (
              <div
                key={a.id}
                className="absolute top-0 rounded-xl overflow-hidden bg-black/10"
                style={{
                  left: targetLeft,
                  width: thumbW,
                  height: 100,
                  transform,
                  opacity,
                  transition: 'transform 800ms ease, opacity 800ms ease',
                }}
              >
                <img src={a.image} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

