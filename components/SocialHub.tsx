const PLATFORMS = [
  {
    emoji: '📸',
    name: 'Instagram',
    handle: '@cosplayer.kiyo',
    url: 'https://www.instagram.com/cosplayer.kiyo/',
    accent: '#E1306C',
  },
  {
    emoji: '🎵',
    name: 'TikTok',
    handle: '@kiyodreams',
    url: 'https://www.tiktok.com/@kiyodreams',
    accent: '#010101',
  },
  {
    emoji: '💬',
    name: 'Discord',
    handle: 'Join the server',
    url: 'https://discord.gg/Hxh6H5UF4W',
    accent: '#5865F2',
  },
  {
    emoji: '🎮',
    name: 'Steam',
    handle: 'KiyoDreams',
    url: 'https://steamcommunity.com/profiles/76561198199646829/',
    accent: '#1b2838',
  },
  {
    emoji: '🌸',
    name: 'MyAnimeList',
    handle: 'KiyoDreams',
    url: 'https://myanimelist.net/profile/KiyoDreams',
    accent: '#2e51a2',
  },
];

export default function SocialHub() {
  return (
    <div className="sh-section">
      <h3 className="sh-heading">✦ Find me everywhere ✦</h3>
      <div className="sh-row">
        {PLATFORMS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sh-card"
          >
            <span className="sh-emoji">{p.emoji}</span>
            <span className="sh-name">{p.name}</span>
            <span className="sh-handle">{p.handle}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
