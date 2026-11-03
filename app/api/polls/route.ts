import { NextRequest, NextResponse } from 'next/server';

interface PollOption {
  id: string;
  character: string;
  series: string;
  emoji: string;
  votes: number;
}

async function readPolls(): Promise<PollOption[]> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('polls');
    const raw = await store.get('options', { type: 'text' });
    if (!raw) return await readLocalPolls();
    return JSON.parse(raw) as PollOption[];
  } catch {
    return readLocalPolls();
  }
}

async function readLocalPolls(): Promise<PollOption[]> {
  try {
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    return JSON.parse(readFileSync(join(process.cwd(), 'public', 'polls.json'), 'utf-8'));
  } catch {
    return [];
  }
}

async function writePolls(options: PollOption[]): Promise<void> {
  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('polls');
    await store.set('options', JSON.stringify(options));
  } catch {
    try {
      const { writeFileSync } = await import('fs');
      const { join } = await import('path');
      writeFileSync(join(process.cwd(), 'public', 'polls.json'), JSON.stringify(options, null, 2));
    } catch {
      // silently fail
    }
  }
}

export async function GET() {
  const options = await readPolls();
  return NextResponse.json(options);
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const options = await readPolls();
    const idx = options.findIndex((o) => o.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Option not found' }, { status: 404 });

    options[idx].votes += 1;
    await writePolls(options);
    return NextResponse.json(options[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}
