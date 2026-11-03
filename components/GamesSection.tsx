'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { SteamResponse, SteamGame } from '@/lib/types';
import SkeletonCard from './SkeletonCard';
import SetupCard from './SetupCard';

function formatHours(minutes: number): string {
  const hours = Math.round(minutes / 60);
  if (hours < 1) return `${minutes}m`;
  return `${hours.toLocaleString()}h`;
}

function getGameIconUrl(game: SteamGame): string {
  if (game.img_icon_url) {
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
  }
  return '';
}

export default function GamesSection() {
  const [data, setData] = useState<(SteamResponse & { isMock?: boolean }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/steam')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <section className="section">
      <h2 className="sec-header">✦ Gaming Corner</h2>
      <p className="sec-sub">recently played games from Steam</p>

      {loading && (
        <div className="game-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {error && (
        <div className="error-state">
          <div className="error-icon">🎮</div>
          <p className="error-msg">Couldn&apos;t load games. Please try again later.</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {data.isMock && (
            <SetupCard
              icon="🎮"
              title="Connect Steam"
              description="Show your recently played games by connecting your Steam account."
              steps={[
                { text: 'Go to steamcommunity.com/dev/apikey and generate an API key' },
                { text: 'Make sure your Steam profile is set to Public' },
                { text: 'Add STEAM_API_KEY to your .env.local file and restart' },
              ]}
            />
          )}

          <div className="game-grid" style={{ marginTop: data.isMock ? 24 : 0 }}>
            {data.recentGames.map((game) => {
              const iconUrl = getGameIconUrl(game);
              const recentHours = game.playtime_2weeks ? formatHours(game.playtime_2weeks) : null;
              const totalHours = formatHours(game.playtime_forever);

              return (
                <a
                  key={game.appid}
                  href={game.appid > 3 ? `https://store.steampowered.com/app/${game.appid}` : '#'}
                  target={game.appid > 3 ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="g-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="g-icon">
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={game.name}
                        fill
                        sizes="64px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.8rem' }}>🎮</div>
                    )}
                  </div>
                  <div className="g-title">{game.name}</div>
                  {recentHours && <div className="g-genre">▶ {recentHours} recently</div>}
                  <div className="g-hrs">{totalHours} total</div>
                </a>
              );
            })}
          </div>

          {data.screenshots && data.screenshots.length > 0 && (
            <>
              <div className="divider">✦ screenshots ✦</div>
              <div className="screenshot-grid">
                {data.screenshots.slice(0, 12).map((ss) => (
                  <div key={ss.publishedfileid} className="ss-item">
                    {ss.preview_url && (
                      <Image
                        src={ss.preview_url}
                        alt={ss.title || 'Screenshot'}
                        fill
                        sizes="160px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
