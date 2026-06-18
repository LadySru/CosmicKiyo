import { NextResponse } from 'next/server';

const STEAM_ID = '76561198199646829';

const MOCK_GAMES = [
  { appid: 1, name: 'Final Fantasy XIV Online', playtime_forever: 12400, playtime_2weeks: 360, img_icon_url: '' },
  { appid: 2, name: 'Stardew Valley', playtime_forever: 8200, playtime_2weeks: 120, img_icon_url: '' },
  { appid: 3, name: 'Genshin Impact', playtime_forever: 5600, playtime_2weeks: 240, img_icon_url: '' },
];

export async function GET() {
  const key = process.env.STEAM_API_KEY;

  if (!key) {
    return NextResponse.json({ recentGames: MOCK_GAMES, screenshots: [], isMock: true });
  }

  try {
    const [gamesRes, ssRes] = await Promise.allSettled([
      fetch(
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${STEAM_ID}&count=6`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.steampowered.com/ISteamRemoteStorage/GetUserFiles/v1/?steamid=${STEAM_ID}&type=screenshot&numperpage=12&key=${key}`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    let recentGames = MOCK_GAMES;
    let screenshots: unknown[] = [];

    if (gamesRes.status === 'fulfilled' && gamesRes.value.ok) {
      const gd = await gamesRes.value.json();
      recentGames = gd?.response?.games || MOCK_GAMES;
    }

    if (ssRes.status === 'fulfilled' && ssRes.value.ok) {
      const sd = await ssRes.value.json();
      screenshots = sd?.response?.publishedfiledetails || [];
    }

    return NextResponse.json({ recentGames, screenshots });
  } catch (e) {
    return NextResponse.json({ recentGames: MOCK_GAMES, screenshots: [], error: String(e) });
  }
}
