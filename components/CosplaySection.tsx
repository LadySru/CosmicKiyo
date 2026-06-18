'use client';

import { useEffect, useState } from 'react';
import type { CosplayEntry } from '@/lib/types';
import SkeletonCard from './SkeletonCard';

const IG_USERNAME = process.env.NEXT_PUBLIC_IG_USERNAME ?? 'cosplayer.kiyo';
const IG_PROFILE_URL = `https://www.instagram.com/${IG_USERNAME}/`;

export default function CosplaySection() {
  const [cosplays, setCosplays] = useState<CosplayEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cosplays')
      .then((r) => r.json())
      .then((d) => { setCosplays(d); setLoading(false); })
      .catch(() => { setCosplays([]); setLoading(false); });
  }, []);

  return (
    <section className="section">
      <h2 className="sec-header">✦ Cosplay Gallery</h2>
      <p className="sec-sub">magical transformations & character love</p>

      <a
        href={IG_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="ig-cta"
      >
        ✨ View my Instagram @{IG_USERNAME}
      </a>

      {loading && (
        <div className="cosplay-grid">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && cosplays && cosplays.length > 0 && (
        <div className="cosplay-grid">
          {cosplays.map((c) => (
            <a
              key={c.id}
              href={c.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="c-card"
            >
              <div className="c-img" style={{ background: c.bgColor }}>
                {c.emoji}
                {c.isFave && <span className="ribbon">fave ♡</span>}
              </div>
              <div className="c-info">
                <div className="c-name">{c.character}</div>
                <div className="c-from">{c.series}</div>
              </div>
            </a>
          ))}
          <a
            href={IG_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="add-card"
          >
            <div className="plus">+</div>
            <span>see more on Instagram</span>
          </a>
        </div>
      )}

      {!loading && cosplays && cosplays.length === 0 && (
        <div className="error-state">
          <div className="error-icon">🌸</div>
          <p className="error-msg">
            No cosplays added yet. Edit <code>public/cosplays.json</code> to add your shoots.
          </p>
        </div>
      )}
    </section>
  );
}
