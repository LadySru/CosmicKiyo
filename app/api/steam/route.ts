import { NextResponse } from 'next/server';
import type { SteamGame } from '@/lib/types';

const STEAM_ID = '76561198199646829';

const MOCK_GAMES: SteamGame[] = [
  {
    appid: 1,
    name: 'Genshin Impact',
    playtime_forever: 3200,
    playtime_2weeks: 420,
    img_icon_url: '',
  },
  {
    appid: 2,
    name: 'Stardew Valley',
    playtime_forever: 1850,
    playtime_2weeks: 180,
    img_icon_url: '',
  },
  {
    appid: 3,
    name: 'Hollow Knight',
    playtime_forever: 720,
    playtime_2weeks: 60,
    img_icon_url: '',
  },
];

export async function GET() {
  const apiKey = process.env.STEAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ recentGames: MOCK_GAMES, screenshots: [], mock: true });
  }

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${STEAM_ID}&count=6`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await fetch(url, { next: { revalidate: 300 } } as any);

    if (!res.ok) {
      return NextResponse.json({ recentGames: MOCK_GAMES, screenshots: [], mock: true });
    }

    const data = await res.json();
    const games: SteamGame[] = (data?.response?.games ?? []).map((g: Record<string, unknown>) => ({
      appid: g.appid as number,
      name: g.name as string,
      playtime_forever: g.playtime_forever as number,
      playtime_2weeks: g.playtime_2weeks as number | undefined,
      img_icon_url: g.img_icon_url as string,
    }));

    if (games.length === 0) {
      return NextResponse.json({ recentGames: MOCK_GAMES, screenshots: [], mock: true });
    }

    return NextResponse.json({ recentGames: games, screenshots: [] });
  } catch (e) {
    console.error('[steam route]', e);
    return NextResponse.json({ recentGames: MOCK_GAMES, screenshots: [], mock: true });
  }
}
