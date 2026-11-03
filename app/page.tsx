'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import CosplaySection from '@/components/CosplaySection';
import AnimeSection from '@/components/AnimeSection';
import GamesSection from '@/components/GamesSection';
import ShowsSection from '@/components/ShowsSection';
import SocialHub from '@/components/SocialHub';
import Guestbook from '@/components/Guestbook';

type Tab = 'cosplay' | 'anime' | 'games' | 'shows' | 'community';

const tabs: { id: Tab; label: string }[] = [
  { id: 'cosplay', label: '🎀 Cosplays' },
  { id: 'anime', label: '🌸 Anime' },
  { id: 'games', label: '🎮 Games' },
  { id: 'shows', label: '🎬 Shows' },
  { id: 'community', label: '💌 Community' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('cosplay');

  return (
    <>
      <Hero />
      <nav className="nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main>
        {activeTab === 'cosplay' && <CosplaySection />}
        {activeTab === 'anime' && <AnimeSection />}
        {activeTab === 'games' && <GamesSection />}
        {activeTab === 'shows' && <ShowsSection />}
        {activeTab === 'community' && (
          <section className="section">
            <SocialHub />
            <div className="divider" style={{ margin: '2rem 0' }} />
            <Guestbook />
          </section>
        )}
      </main>
      <footer className="footer">
        <div className="footer-name">Kiyo Dreams ✦</div>
        <div>cosplayer · gamer · dreamer</div>
        <div className="footer-links">
          <a className="footer-link" href="https://www.instagram.com/cosplayer.kiyo/" target="_blank" rel="noopener noreferrer">✦ Instagram</a>
          <a className="footer-link" href="https://www.tiktok.com/@kiyodreams" target="_blank" rel="noopener noreferrer">✦ TikTok</a>
          <a className="footer-link" href="https://discord.gg/Hxh6H5UF4W" target="_blank" rel="noopener noreferrer">✦ Discord</a>
          <a className="footer-link" href="https://myanimelist.net/profile/KiyoDreams" target="_blank" rel="noopener noreferrer">✦ MAL</a>
          <a className="footer-link" href="https://steamcommunity.com/profiles/76561198199646829" target="_blank" rel="noopener noreferrer">✦ Steam</a>
        </div>
      </footer>
    </>
  );
}
