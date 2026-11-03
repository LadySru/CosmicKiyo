import { NextRequest, NextResponse } from 'next/server';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

async function readEntries(): Promise<GuestbookEntry[]> {
  // Try Netlify Blobs in production, fall back to public/guestbook.json in dev
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('guestbook');
    const raw = await store.get('entries', { type: 'text' });
    if (!raw) return [];
    return JSON.parse(raw) as GuestbookEntry[];
  } catch {
    // Local dev: read from public/guestbook.json
    try {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      const filePath = join(process.cwd(), 'public', 'guestbook.json');
      return JSON.parse(readFileSync(filePath, 'utf-8')) as GuestbookEntry[];
    } catch {
      return [];
    }
  }
}

async function writeEntries(entries: GuestbookEntry[]): Promise<void> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('guestbook');
    await store.set('entries', JSON.stringify(entries));
  } catch {
    // Local dev: write to public/guestbook.json
    try {
      const { writeFileSync } = await import('fs');
      const { join } = await import('path');
      const filePath = join(process.cwd(), 'public', 'guestbook.json');
      writeFileSync(filePath, JSON.stringify(entries, null, 2));
    } catch {
      // silently fail
    }
  }
}

export async function GET() {
  const entries = await readEntries();
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = sanitize(String(body.name ?? '')).slice(0, 40);
    const message = sanitize(String(body.message ?? '')).slice(0, 200);

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 });
    }

    const entry: GuestbookEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      message,
      timestamp: new Date().toISOString(),
    };

    const entries = await readEntries();
    const updated = [entry, ...entries].slice(0, 50);
    await writeEntries(updated);

    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save message.' }, { status: 500 });
  }
}
