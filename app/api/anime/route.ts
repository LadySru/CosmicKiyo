import { NextResponse } from 'next/server';
import type { AnimeEntry, MalResponse } from '@/lib/types';

const ANILIST_URL = 'https://graphql.anilist.co';
const ANILIST_USERNAME = 'CosmicKiyo';

const ANILIST_QUERY = `
query ($username: String, $status: MediaListStatus) {
  MediaListCollection(userName: $username, type: ANIME, status: $status) {
    lists {
      entries {
        media {
          id
          title { romaji english }
          coverImage { medium large }
          episodes
          genres
        }
        score
        progress
        status
      }
    }
  }
}
`;

interface AniListEntry {
  media: {
    id: number;
    title: { romaji: string; english?: string };
    coverImage: { medium?: string; large?: string };
    episodes?: number;
    genres?: string[];
  };
  score: number;
  progress: number;
  status: string;
}

function mapAniListEntry(entry: AniListEntry): AnimeEntry {
  return {
    mal_id: entry.media.id,
    title: entry.media.title.english || entry.media.title.romaji,
    image_url: entry.media.coverImage.large || entry.media.coverImage.medium || '',
    episodes: entry.media.episodes ?? null,
    watched_episodes: entry.progress,
    score: entry.score > 0 ? entry.score : null,
    genres: entry.media.genres ?? [],
    status: 'watching',
  };
}

async function fetchAniList(status: 'CURRENT' | 'COMPLETED'): Promise<AnimeEntry[]> {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: { username: ANILIST_USERNAME, status },
    }),
    next: { revalidate: 600 },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const lists: { entries: AniListEntry[] }[] =
    json?.data?.MediaListCollection?.lists ?? [];
  const entries = lists.flatMap((l) => l.entries);
  return entries.map(mapAniListEntry);
}

// Hardcoded favorites as fallback if AniList user not found
const HARDCODED_FAVORITES: AnimeEntry[] = [
  { mal_id: 530,   title: 'Bishoujo Senshi Sailor Moon',            image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx530-K8Pf9PXF6IUe.jpg',  episodes: 46,  watched_episodes: 46, score: 10, genres: ['Magical Girl', 'Romance'], status: 'completed' },
  { mal_id: 232,   title: 'Cardcaptor Sakura',                      image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx232-c2DqI4b7RMHM.jpg',  episodes: 70,  watched_episodes: 70, score: 10, genres: ['Magical Girl', 'Adventure'], status: 'completed' },
  { mal_id: 30,    title: 'Neon Genesis Evangelion',                image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx30-GlmjYoFgheO3.jpg',   episodes: 26,  watched_episodes: 26, score: 10, genres: ['Mecha', 'Psychological'], status: 'completed' },
  { mal_id: 9756,  title: 'Puella Magi Madoka Magica',              image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9756-MEgGiGXHDFbZ.jpg', episodes: 12,  watched_episodes: 12, score: 10, genres: ['Magical Girl', 'Psychological'], status: 'completed' },
  { mal_id: 20665, title: 'Shigatsu wa Kimi no Uso',                image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20665-OVFIgkDq5Jgm.jpg',episodes: 22,  watched_episodes: 22, score: 10, genres: ['Romance', 'Drama', 'Music'], status: 'completed' },
  { mal_id: 16498, title: 'Shingeki no Kyojin',                     image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-8jpFCOcDmneX.jpg', episodes: 25,  watched_episodes: 25, score: 9,  genres: ['Action', 'Drama'], status: 'completed' },
  { mal_id: 85470, title: 'Fruits Basket (2019)',                   image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx85470-vOFRFfBqHuAE.jpg', episodes: 25,  watched_episodes: 25, score: 10, genres: ['Romance', 'Drama'], status: 'completed' },
  { mal_id: 101922,title: 'Violet Evergarden',                      image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-HideMS7bFoQx.jpg',episodes: 13,  watched_episodes: 13, score: 10, genres: ['Drama', 'Fantasy'], status: 'completed' },
];

export async function GET(): Promise<NextResponse<MalResponse>> {
  try {
    const [watching, completed] = await Promise.allSettled([
      fetchAniList('CURRENT'),
      fetchAniList('COMPLETED'),
    ]);

    const watchingList = watching.status === 'fulfilled' ? watching.value : [];
    let favoritesList = completed.status === 'fulfilled' ? completed.value.slice(0, 10) : [];

    if (favoritesList.length === 0) {
      favoritesList = HARDCODED_FAVORITES;
    }

    if (watchingList.length === 0 && favoritesList === HARDCODED_FAVORITES) {
      return NextResponse.json({
        watching: [],
        favorites: HARDCODED_FAVORITES,
        error: 'no_data',
        message: 'AniList user not found — showing curated favorites.',
      });
    }

    return NextResponse.json({ watching: watchingList, favorites: favoritesList });
  } catch (e) {
    console.error('[anime route]', e);
    return NextResponse.json({
      watching: [],
      favorites: HARDCODED_FAVORITES,
      error: 'fetch_error',
      message: 'Could not reach AniList — showing curated favorites.',
    });
  }
}
