'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { DramaEntry } from '@/lib/types';
import { SkeletonRow } from './SkeletonCard';

interface DramaApiResponse {
  watching: DramaEntry[];
  completed?: DramaEntry[];
  favorites?: DramaEntry[];
  error?: string;
  message?: string;
}

export default function ShowsSection() {
  const [data, setData] = useState<DramaApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dramalist')
      .then((r) => r.json())
      .then((d: DramaApiResponse) => setData(d))
      .catch(() =>
        setData({
          watching: [],
          error: 'fetch_error',
          message: 'Could not load drama list',
        })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="section">
        <div className="sec-header">
          <span className="sec-icon">🎬</span>
          <h2>Drama &amp; Shows</h2>
        </div>
        <div className="media-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="section">
        <div className="sec-header">
          <span className="sec-icon">🎬</span>
          <h2>Drama &amp; Shows</h2>
        </div>
        <div className="error-state">
          <span className="error-state-icon">🎬</span>
          <p className="error-state-text">
            {data.message ?? 'Could not load drama list right now.'}
          </p>
        </div>
      </div>
    );
  }

  const watching: DramaEntry[] = data?.watching ?? [];
  const completed: DramaEntry[] = data?.completed ?? data?.favorites ?? [];

  return (
    <div className="section">
      <div className="sec-header">
        <span className="sec-icon">🎬</span>
        <h2>Drama &amp; Shows</h2>
      </div>

      <div className="divider">currently watching</div>

      {watching.length === 0 ? (
        <div className="error-state">
          <span className="error-state-icon">💤</span>
          <p className="error-state-text">Nothing on the watch queue right now!</p>
        </div>
      ) : (
        <div className="media-list">
          {watching.map((drama, i) => (
            <DramaRow key={drama.id || i} drama={drama} badge="b-now" badgeLabel="▶ watching" />
          ))}
        </div>
      )}

      <div className="divider">completed</div>

      {completed.length === 0 ? (
        <div className="error-state">
          <span className="error-state-icon">⭐</span>
          <p className="error-state-text">No completed shows listed yet!</p>
        </div>
      ) : (
        <div className="media-list">
          {completed.map((drama, i) => (
            <DramaRow key={drama.id || i} drama={drama} badge="b-done" badgeLabel="✓ done" />
          ))}
        </div>
      )}
    </div>
  );
}

function DramaRow({
  drama,
  badge,
  badgeLabel,
}: {
  drama: DramaEntry;
  badge: string;
  badgeLabel: string;
}) {
  return (
    <div className="m-item">
      <div className="m-icon">
        {drama.image_url ? (
          <Image
            src={drama.image_url}
            alt={drama.title}
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
            🎬
          </div>
        )}
      </div>
      <div className="m-text">
        <div className="m-title">{drama.title}</div>
        <div className="m-sub">
          {drama.episodes
            ? `ep ${drama.watched_episodes} of ${drama.episodes}`
            : `${drama.watched_episodes} eps watched`}
          {drama.score ? ` · ★ ${drama.score}` : ''}
          {drama.country ? ` · ${drama.country}` : ''}
        </div>
      </div>
      <span className={`badge ${badge}`}>{badgeLabel}</span>
    </div>
  );
}
