'use client';

import cosplays from '@/public/cosplays.json';

interface CosplayEntry {
  id: string;
  character: string;
  series: string;
  emoji: string;
  bgColor: string;
  instagramUrl: string;
  isFave: boolean;
}

const data: CosplayEntry[] = cosplays as CosplayEntry[];

export default function CosplaySection() {
  return (
    <div className="section">
      <div className="sec-header">
        <span className="sec-icon">📸</span>
        <h2>Cosplay Gallery</h2>
      </div>

      <a
        href="https://www.instagram.com/cosplayer.kiyo/"
        target="_blank"
        rel="noopener noreferrer"
        className="ig-banner"
      >
        <span className="ig-banner-icon">✨</span>
        <span>View my Instagram <strong>@cosplayer.kiyo</strong></span>
        <span className="ig-banner-arrow">→</span>
      </a>

      <div className="cosplay-grid" style={{ marginTop: '24px' }}>
        {data.map((entry) => (
          <a
            key={entry.id}
            href={entry.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="c-card"
          >
            <div
              className="c-img"
              style={{ background: entry.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontSize: '4rem' }}>{entry.emoji}</span>
              {entry.isFave && <span className="ribbon">❤ fave</span>}
            </div>
            <div className="c-info">
              <div className="c-name">{entry.character}</div>
              <div className="c-from">{entry.series}</div>
            </div>
          </a>
        ))}
        <a
          href="https://www.instagram.com/cosplayer.kiyo/"
          target="_blank"
          rel="noopener noreferrer"
          className="add-card"
        >
          <span className="add-card-icon">📷</span>
          <span>See all on Instagram</span>
        </a>
      </div>
    </div>
  );
}
