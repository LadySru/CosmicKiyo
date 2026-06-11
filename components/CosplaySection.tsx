'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { InstagramPost } from '@/lib/types';
import SkeletonCard from './SkeletonCard';
import SetupCard from './SetupCard';

interface IGResponse {
  posts?: InstagramPost[];
  error?: string;
  message?: string;
}

function formatCaption(caption?: string): string {
  if (!caption) return 'Cosplay post';
  return caption.replace(/#\w+/g, '').replace(/\n+/g, ' ').trim().slice(0, 60) || 'Cosplay post';
}

export default function CosplaySection() {
  const [data, setData] = useState<IGResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setData({ error: 'fetch_error' }); setLoading(false); });
  }, []);

  return (
    <section className="section">
      <h2 className="sec-header">✦ Cosplay Gallery</h2>
      <p className="sec-sub">magical transformations & character love</p>

      {loading && (
        <div className="cosplay-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && data?.error === 'not_configured' && (
        <SetupCard
          icon="📸"
          title="Connect Instagram"
          description="Show your cosplay posts directly on your portfolio by connecting your Instagram account."
          steps={[
            { text: 'Create a Facebook Developer App at developers.facebook.com' },
            { text: 'Add the Instagram Basic Display product to your app' },
            { text: 'Generate a Long-Lived Access Token for your Instagram account' },
            { text: 'Add INSTAGRAM_ACCESS_TOKEN to your .env.local file and restart' },
          ]}
        />
      )}

      {!loading && data?.posts && data.posts.length > 0 && (
        <div className="cosplay-grid">
          {data.posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="c-card"
            >
              <div className="c-img">
                {(post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') && post.media_url ? (
                  <Image
                    src={post.media_url}
                    alt={formatCaption(post.caption)}
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem' }}>
                    🎬
                  </div>
                )}
                {post.media_type === 'CAROUSEL_ALBUM' && <span className="ribbon">album</span>}
                {post.media_type === 'VIDEO' && <span className="ribbon">video</span>}
              </div>
              <div className="c-info">
                <div className="c-name">{formatCaption(post.caption)}</div>
                <div className="c-from">
                  {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && data?.posts && data.posts.length === 0 && (
        <div className="error-state">
          <div className="error-icon">🌸</div>
          <p className="error-msg">No posts found yet. Time to go cosplay something magical!</p>
        </div>
      )}

      {!loading && data?.error && data.error !== 'not_configured' && (
        <div className="error-state">
          <div className="error-icon">✦</div>
          <p className="error-msg">Couldn&apos;t load Instagram posts. Check your access token.</p>
        </div>
      )}
    </section>
  );
}
