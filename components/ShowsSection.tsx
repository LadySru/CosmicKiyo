'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { DramaResponse, DraamaShow } from '@/lib/types';
import { SkeletonRow } from './SkeletonCard';

export default function ShowsSection() {
  const [data, setData] = useState<DramaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dramalist')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setData({ error: 'fetch_error', watching: [], completed: [] }); setLoading(false); });
  }, []);

  function renderShowItem(show: DraamaShow) {
    const isWatching = show.status === 'watching';
    const epText = show.episodes
      ? `ep ${show.watched_episodes} of ${show.episodes}`
      : `${show.watched_episodes} eps`;

    return (
      <div key={show.id} className="m-item">
        <div className="m-icon">
          {show.image_url ? (
            <Image
              src={show.image_url}
              alt={show.title}
              fill
              sizes="52px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🎬</div>
          )}
        </div>
        <div className="m-text">
          <div className="m-title">{show.title}</div>
          <div className="m-sub">
            {epText}
            {show.score ? ` · ★ ${show.score}` : ''}
            {show.country ? ` · ${show.country}` : ''}
            {show.year ? ` · ${show.year}` : ''}
          </div>
        </div>
        {isWatching
          ? <span className="badge b-now">▶ watching</span>
          : show.score && show.score >= 9
            ? <span className="badge b-love">♡ love</span>
            : <span className="badge b-done">✓ done</span>
        }
      </div>
    );
  }

  return (
    <section className="section">
      <h2 className="sec-header">✦ Drama World</h2>
      <p className="sec-sub">currently watching & completed shows from DramaList</p>

      {loading && (
        <div className="media-list">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {!loading && data?.error && (
        <p className="fallback-note">✦ {data.message ?? 'Showing sample data.'}</p>
      )}

      {!loading && data && (
        <>
          {data.watching.length > 0 && (
            <>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text2)', marginBottom: 12 }}>
                Currently Watching
              </h3>
              <div className="media-list">
                {data.watching.map(renderShowItem)}
              </div>
            </>
          )}

          {data.completed && data.completed.length > 0 && (
            <>
              <div className="divider">✦ completed ✦</div>
              <div className="media-list">
                {data.completed.map(renderShowItem)}
              </div>
            </>
          )}

          {data.watching.length === 0 && (!data.completed || data.completed.length === 0) && (
            <div className="error-state">
              <div className="error-icon">🎬</div>
              <p className="error-msg">No shows found. The list might be private or empty.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
