'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { CosplayEntry } from '@/lib/types';
import SkeletonCard from './SkeletonCard';

const IG_USERNAME = process.env.NEXT_PUBLIC_IG_USERNAME ?? 'cosplayer.kiyo';
const IG_PROFILE_URL = `https://www.instagram.com/${IG_USERNAME}/`;

function ShareButton({ entry }: { entry: CosplayEntry }) {
  const [supported, setSupported] = useState(false);
  useEffect(() => { setSupported(!!navigator.share); }, []);
  if (!supported) return null;
  return (
    <button
      className="c-share"
      aria-label="Share"
      onClick={(e) => {
        e.preventDefault();
        navigator.share({ title: `${entry.character} cosplay by Kiyo Dreams`, url: entry.instagramUrl }).catch(() => {});
      }}
    >📤</button>
  );
}

function PhotoCard({ entry }: { entry: CosplayEntry }) {
  const [activeImg, setActiveImg] = useState(0);
  const photos = entry.images ?? (entry.imageUrl ? [entry.imageUrl] : []);
  const hasPhotos = photos.length > 0;

  return (
    <a href={entry.instagramUrl} target="_blank" rel="noopener noreferrer" className="c-card">
      <div className="c-img" style={hasPhotos ? undefined : { background: entry.bgColor }}>
        {hasPhotos ? (
          <Image
            src={photos[activeImg]}
            alt={`${entry.character} cosplay`}
            fill
            sizes="(max-width: 600px) 100vw, 280px"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <span style={{ fontSize: '2.5rem' }}>{entry.emoji}</span>
        )}
        {entry.isFave && <span className="ribbon">fave ♡</span>}
        <ShareButton entry={entry} />
      </div>

      {photos.length > 1 && (
        <div className="c-thumbs" onClick={(e) => e.preventDefault()}>
          {photos.map((src, i) => (
            <button
              key={i}
              className={`c-thumb${i === activeImg ? ' active' : ''}`}
              onMouseEnter={() => setActiveImg(i)}
              onClick={(e) => { e.preventDefault(); setActiveImg(i); }}
              aria-label={`Photo ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="44px" style={{ objectFit: 'cover', objectPosition: 'top' }} />
            </button>
          ))}
        </div>
      )}

      <div className="c-info">
        <div className="c-name">{entry.character}</div>
        <div className="c-from">{entry.series}</div>
      </div>
    </a>
  );
}

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

      <a href={IG_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="ig-cta">
        ✨ View my Instagram @{IG_USERNAME}
      </a>

      {loading && (
        <div className="cosplay-grid">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && cosplays && cosplays.length > 0 && (
        <div className="cosplay-grid">
          {cosplays.map((c) => <PhotoCard key={c.id} entry={c} />)}
          <a href={IG_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="add-card">
            <div className="plus">+</div>
            <span>see more on Instagram</span>
          </a>
        </div>
      )}

      {!loading && cosplays?.length === 0 && (
        <div className="error-state">
          <div className="error-icon">🌸</div>
          <p className="error-msg">No cosplays yet. Edit <code>public/cosplays.json</code> to add your shoots.</p>
        </div>
      )}
    </section>
  );
}
