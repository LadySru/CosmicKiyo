'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { AnimeEntry, MALResponse } from '@/lib/types';
import { SkeletonRow } from './SkeletonCard';

export default function AnimeSection() {
  const [data, setData] = useState<MALResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/mal')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  function renderAnimeItem(anime: AnimeEntry) {
    const isWatching = anime.status === 'watching';
    const epText = anime.episodes
      ? `ep ${anime.watched_episodes} of ${anime.episodes}`
      : `ep ${anime.watched_episodes}`;

    return (
      <div key={anime.mal_id} className="m-item">
        <div className="m-icon">
          {anime.image_url ? (
            <Image
              src={anime.image_url}
              alt={anime.title}
              fill
              sizes="52px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🌸</div>
          )}
        </div>
        <div className="m-text">
          <div className="m-title">{anime.title}</div>
          <div className="m-sub">
            {epText}
            {anime.score ? ` · ★ ${anime.score}` : ''}
            {anime.genres && anime.genres.length > 0 ? ` · ${anime.genres.slice(0, 2).join(', ')}` : ''}
          </div>
        </div>
        {isWatching
          ? <span className="badge b-now">▶ watching</span>
          : anime.score && anime.score >= 9
            ? <span className="badge b-love">♡ love</span>
            : <span className="badge b-done">✓ done</span>
        }
      </div>
    );
  }

  return (
    <section className="section">
      <h2 className="sec-header">✦ Anime World</h2>
      <p className="sec-sub">currently watching & all-time faves from MAL</p>

      {loading && (
        <div className="media-list">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {error && (
        <div className="error-state">
          <div className="error-icon">🌸</div>
          <p className="error-msg">Couldn&apos;t load anime list. Please try again later.</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {data.watching.length > 0 && (
            <>
              <h3 style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text2)', marginBottom: 12 }}>
                Currently Watching
              </h3>
              <div className="media-list">
                {data.watching.map(renderAnimeItem)}
              </div>
            </>
          )}

          {data.watching.length === 0 && data.favorites.length === 0 && (
            <div className="error-state">
              <div className="error-icon">🌸</div>
              <p className="error-msg">No anime found. The list might be private or empty.</p>
            </div>
          )}

          {data.favorites.length > 0 && (
            <>
              <div className="divider">✦ all-time faves ✦</div>
              <div className="media-list">
                {data.favorites.map(renderAnimeItem)}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
