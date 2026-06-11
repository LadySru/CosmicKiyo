'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { SteamGame, SteamResponse } from '@/lib/types';
import SetupCard from './SetupCard';

function formatHours(minutes: number) {
  const hours = Math.round(minutes / 60);
  if (hours < 1) return `${minutes} min`;
  return `${hours.toLocaleString()} hrs`;
}

function GameIcon({ game }: { game: SteamGame }) {
  if (!game.img_icon_url || game.appid <= 3) {
    const emojis: Record<number, string> = { 1: '⚔️', 2: '🌾', 3: '🗡️' };
    return (
      <div className="g-icon">
        <span>{emojis[game.appid] ?? '🎮'}</span>
      </div>
    );
  }
  return (
    <div className="g-icon">
      <Image
        src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
        alt={game.name}
        width={56}
        height={56}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    </div>
  );
}

function SkeletonGameCard() {
  return (
    <div
      className="g-card"
      style={{ gap: 14 }}
    >
      <div
        className="skeleton"
        style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 11, width: '55%', borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function GamesSection() {
  const [data, setData] = useState<SteamResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/steam')
      .then((r) => r.json())
      .then((d: SteamResponse) => setData(d))
      .catch(() => setData({ recentGames: [], screenshots: [], error: 'fetch_error' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="section">
        <div className="sec-header">
          <span className="sec-icon">🎮</span>
          <h2>Gaming Corner</h2>
        </div>
        <div className="game-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonGameCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const isMock = (data as (SteamResponse & { mock?: boolean }))?.mock;

  return (
    <div className="section">
      <div className="sec-header">
        <span className="sec-icon">🎮</span>
        <h2>Gaming Corner</h2>
      </div>

      {isMock && (
        <div style={{ marginBottom: 20 }}>
          <SetupCard
            icon="🎮"
            platform="Steam Setup"
            subtitle="Connect your Steam account to show real recently played games"
            steps={[
              {
                text: (
                  <>
                    Get a free API key at{' '}
                    <a
                      href="https://steamcommunity.com/dev/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--purple-400)', textDecoration: 'underline' }}
                    >
                      steamcommunity.com/dev/apikey
                    </a>
                  </>
                ),
              },
              {
                text: (
                  <>
                    Add to <code>.env.local</code>: <code>STEAM_API_KEY=your_key</code>
                  </>
                ),
              },
              {
                text: (
                  <>
                    Make sure your Steam profile is public — Steam ID{' '}
                    <code>76561198199646829</code> is already configured.
                  </>
                ),
              },
              { text: 'Restart the dev server to see your real recently played games!' },
            ]}
          />
          <div className="divider" style={{ marginTop: 28 }}>sample games</div>
        </div>
      )}

      {!isMock && (
        <p className="sec-desc">˚₊· recently played on Steam ·˚</p>
      )}

      <div className="game-grid">
        {(data?.recentGames ?? []).map((game: SteamGame) => (
          <a
            key={game.appid}
            href={game.appid > 3 ? `https://store.steampowered.com/app/${game.appid}` : '#'}
            target={game.appid > 3 ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="g-card"
            style={{ textDecoration: 'none' }}
          >
            <GameIcon game={game} />
            <div className="g-info">
              <div className="g-title">{game.name}</div>
              <div className="g-genre">Steam</div>
              <div className="g-hrs">
                {formatHours(game.playtime_forever)} total
                {game.playtime_2weeks ? ` · ${formatHours(game.playtime_2weeks)} recent` : ''}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
