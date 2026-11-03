import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { DramaEntry } from '@/lib/types';

const MDL_USERNAME = 'ChinguKiyo';
const MDL_URL = `https://mydramalist.com/dramalist/${MDL_USERNAME}`;

function loadFallback(): { watching: DramaEntry[]; completed: DramaEntry[] } {
  try {
    const filePath = join(process.cwd(), 'public', 'dramas.json');
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return { watching: [], completed: [] };
  }
}

function parseNextData(html: string): { watching: DramaEntry[]; completed: DramaEntry[] } | null {
  try {
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return null;
    const json = JSON.parse(match[1]);

    // Navigate into the Next.js page props to find list data
    const pageProps =
      json?.props?.pageProps ?? json?.props?.initialProps ?? {};

    // MDL may store the list under various keys; try common ones
    const lists: Record<string, unknown>[] =
      pageProps?.list ?? pageProps?.dramalist ?? pageProps?.data ?? [];

    if (!Array.isArray(lists) || lists.length === 0) return null;

    const watching: DramaEntry[] = [];
    const completed: DramaEntry[] = [];

    for (const item of lists) {
      const entry: DramaEntry = {
        id: (item.id as number) ?? 0,
        title: (item.title as string) ?? (item.name as string) ?? 'Unknown',
        image_url: (item.image as string) ?? (item.poster as string) ?? '',
        episodes: (item.episodes as number) ?? null,
        watched_episodes: (item.episodes_seen as number) ?? (item.watched_episodes as number) ?? 0,
        score: (item.user_rating as number) ?? (item.score as number) ?? null,
        status: (item.watch_status as string) === 'Currently Watching' ? 'watching' : 'completed',
        country: (item.country as string) ?? '',
      };

      if (entry.status === 'watching') {
        watching.push(entry);
      } else {
        completed.push(entry);
      }
    }

    return { watching: watching.slice(0, 10), completed: completed.slice(0, 10) };
  } catch {
    return null;
  }
}

function parseHtml(html: string): { watching: DramaEntry[]; completed: DramaEntry[] } {
  const watching: DramaEntry[] = [];
  const completed: DramaEntry[] = [];

  // Each drama list row: <tr class="..."> contains title, status, etc.
  // MDL uses table rows with class "list-item" or similar
  const rowRegex = /<tr[^>]*class="[^"]*list-item[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1];

    const titleMatch = row.match(/class="[^"]*title[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i);
    const title = titleMatch?.[1]?.trim() ?? 'Unknown';

    const statusMatch = row.match(/class="[^"]*status[^"]*"[^>]*>([^<]+)<\/[^>]+>/i);
    const statusText = statusMatch?.[1]?.trim() ?? '';

    const imgMatch = row.match(/<img[^>]*src="([^"]+)"/i);
    const image_url = imgMatch?.[1] ?? '';

    const epMatch = row.match(/(\d+)\s*\/\s*(\d+)/);
    const watched_episodes = epMatch ? parseInt(epMatch[1], 10) : 0;
    const episodes = epMatch ? parseInt(epMatch[2], 10) : null;

    const scoreMatch = row.match(/class="[^"]*score[^"]*"[^>]*>([0-9.]+)</i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    const entry: DramaEntry = {
      id: 0,
      title,
      image_url,
      episodes,
      watched_episodes,
      score,
      status: statusText.toLowerCase().includes('watching') ? 'watching' : 'completed',
      country: '',
    };

    if (entry.status === 'watching') {
      watching.push(entry);
    } else {
      completed.push(entry);
    }
  }

  return { watching: watching.slice(0, 10), completed: completed.slice(0, 10) };
}

export async function GET() {
  try {
    const res = await fetch(MDL_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({
        ...loadFallback(),
        error: 'scrape_error',
        message: `MDL returned ${res.status} — showing sample data. Edit public/dramas.json to customize.`,
      });
    }

    const html = await res.text();

    // Try __NEXT_DATA__ first
    const nextDataResult = parseNextData(html);
    if (nextDataResult && (nextDataResult.watching.length || nextDataResult.completed.length)) {
      return NextResponse.json(nextDataResult);
    }

    // Fallback: parse HTML
    const htmlResult = parseHtml(html);
    if (htmlResult.watching.length || htmlResult.completed.length) {
      return NextResponse.json(htmlResult);
    }

    return NextResponse.json({
      ...loadFallback(),
      error: 'no_data',
      message: 'Could not parse MDL list — showing sample data. Edit public/dramas.json to customize.',
    });
  } catch (e) {
    console.error('[dramalist route]', e);
    return NextResponse.json({
      ...loadFallback(),
      error: 'fetch_error',
      message: 'Failed to reach DramaList — showing sample data. Edit public/dramas.json to customize.',
    });
  }
}
