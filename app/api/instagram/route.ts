import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      error: 'not_configured',
      message: 'Instagram access token not set. Add INSTAGRAM_ACCESS_TOKEN to .env.local.',
    });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'api_error', message: (err as any)?.error?.message || 'Instagram API error' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ posts: data.data || [] });
  } catch (e) {
    return NextResponse.json({ error: 'fetch_error', message: String(e) }, { status: 500 });
  }
}
