import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: 'not_configured', message: 'Add INSTAGRAM_ACCESS_TOKEN to .env.local' },
      { status: 200 }
    );
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${token}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await fetch(url, { next: { revalidate: 300 } } as any);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'instagram_api_error', message: err?.error?.message ?? 'Instagram API error' },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ posts: data.data ?? [] });
  } catch (e) {
    console.error('[instagram route]', e);
    return NextResponse.json(
      { error: 'fetch_error', message: 'Failed to fetch Instagram data' },
      { status: 200 }
    );
  }
}
