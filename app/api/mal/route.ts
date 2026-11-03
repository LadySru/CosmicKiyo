import { NextResponse } from 'next/server';
import type { AnimeEntry } from '@/lib/types';

const MAL_USERNAME = 'KiyoDreams';


type JikanV4Item = {
  node?: {
    mal_id?: number;
    title?: string;
    images?: { jpg?: { image_url?: string }; webp?: { image_url?: string } };
    num_episodes?: number;
  };
  list_status?: {
    status?: string;
    score?: number;
    num_episodes_watched?: number;
  };
};

function mapJikanV4Entry(item: JikanV4Item): AnimeEntry {
  const node = item.node ?? {};
  const status = item.list_status ?? {};
  return {
    mal_id: node.mal_id ?? 0,
    title: node.title ?? 'Unknown',
    image_url: node.images?.jpg?.image_url ?? node.images?.webp?.image_url ?? '',
    episodes: node.num_episodes ?? null,
    watched_episodes: status.num_episodes_watched ?? 0,
    score: (status.score && status.score > 0) ? status.score : null,
    status: (status.status ?? 'watching') as AnimeEntry['status'],
  };
}

export async function GET() {
  try {
    const [watchRes, completedRes] = await Promise.allSettled([
      fetch(
        `https://api.jikan.moe/v4/users/${MAL_USERNAME}/animelist?status=watching&limit=10`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { next: { revalidate: 600 } } as any
      ),
      fetch(
        `https://api.jikan.moe/v4/users/${MAL_USERNAME}/animelist?status=completed&order_by=score&sort=desc&limit=10`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { next: { revalidate: 600 } } as any
      ),
    ]);

    let watching: AnimeEntry[] = [];
    let favorites: AnimeEntry[] = [];

    if (watchRes.status === 'fulfilled' && watchRes.value.ok) {
      const data = await watchRes.value.json();
      watching = (data?.data ?? []).map(mapJikanV4Entry);
    }

    if (completedRes.status === 'fulfilled' && completedRes.value.ok) {
      const data = await completedRes.value.json();
      favorites = (data?.data ?? []).map(mapJikanV4Entry);
    }

    // Fallback to MAL v2-compat format if Jikan returns empty
    if (watching.length === 0 && favorites.length === 0) {
      return NextResponse.json({
        watching: [],
        favorites: [],
        error: 'no_data',
        message: 'No anime list data found for this user.',
      });
    }

    return NextResponse.json({ watching, favorites });
  } catch (e) {
    console.error('[mal route]', e);
    return NextResponse.json(
      { watching: [], favorites: [], error: 'fetch_error', message: 'Failed to fetch anime list' },
      { status: 200 }
    );
  }
}
