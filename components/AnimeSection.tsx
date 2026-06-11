'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { AnimeEntry, MalResponse } from '@/lib/types';
import { SkeletonRow } from './SkeletonCard';

export default function AnimeSection() {
  const [data, setData] = useState<MalResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mal')
      .then((r) => r.json())
      .then((d: MalResponse) => setData(d))
      .catch(() =>
        setData({ watching: [], favorites: [], error: 'fetch_error', message: 'Could not load anime list' })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="section">
        <div className="sec-header">
          <span className="sec-icon">🌸</span>
          <h2>Anime World</h2>
        </div>
        <div className="media-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
        <div className="divider">all-time faves</div>
        <div className="media-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (data?.error && data.error !== 'no_data') {
    return (
      <div className="section">
        <div className="sec-header">
          <span className="sec-icon">🌸</span>
          <h2>Anime World</h2>
        </div>
        <div className="error-state">
          <span className="error-state-icon">🌸</span>
          <p className="error-state-text">
            {data.message ?? 'Could not load anime list right now.'}
          </p>
        </div>
      </div>
    );
  }

  const watching: AnimeEntry[] = data?.watching ?? [];
  const favorites: AnimeEntry[] = data?.favorites ?? [];

  return (
    <div className="section">
      <div className="sec-header">
        <span className="sec-icon">🌸</span>
        <h2>Anime World</h2>
      </div>

      {/* Currently Watching */}
      <div className="divider">currently watching</div>

      {watching.length === 0 ? (
        <div className="error-state">
          <span className="error-state-icon">💤</span>
          <p className="error-state-text">Nothing on the watchlist right now!</p>
        </div>
      ) : (
        <div className="media-list">
          {watching.map((anime) => (
            <AnimeRow key={anime.mal_id} anime={anime} badge="b-now" badgeLabel="▶ watching" />
          ))}
        </div>
      )}

      {/* All-time Faves */}
      <div className="divider">all-time faves</div>

      {favorites.length === 0 ? (
        <div className="error-state">
          <span className="error-state-icon">⭐</span>
          <p className="error-state-text">No favorites listed yet!</p>
        </div>
      ) : (
        <div className="media-list">
          {favorites.map((anime) => (
            <AnimeRow key={anime.mal_id} anime={anime} badge="b-love" badgeLabel="♡ love" />
          ))}
        </div>
      )}
    </div>
  );
}

function AnimeRow({
  anime,
  badge,
  badgeLabel,
}: {
  anime: AnimeEntry;
  badge: string;
  badgeLabel: string;
}) {
  return (
    <a
      href={`https://myanimelist.net/anime/${anime.mal_id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="m-item"
    >
      <div className="m-icon">
        {anime.image_url ? (
          <Image
            src={anime.image_url}
            alt={anime.title}
            width={52}
            height={72}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
            }}
          >
            🌸
          </div>
        )}
      </div>
      <div className="m-text">
        <div className="m-title">{anime.title}</div>
        <div className="m-sub">
          {anime.episodes
            ? `ep ${anime.watched_episodes} of ${anime.episodes}`
            : `${anime.watched_episodes} eps watched`}
          {anime.score ? ` · ★ ${anime.score}` : ''}
        </div>
      </div>
      <span className={`badge ${badge}`}>{badgeLabel}</span>
    </a>
  );
}
