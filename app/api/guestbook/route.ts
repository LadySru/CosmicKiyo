import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const FILE = join(process.cwd(), 'public', 'guestbook.json');

interface GuestEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

function read(): GuestEntry[] {
  try { return JSON.parse(readFileSync(FILE, 'utf-8')); } catch { return []; }
}

function strip(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = strip(String(body.name ?? ''));
    const message = strip(String(body.message ?? ''));

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 });
    }
    if (name.length > 40) {
      return NextResponse.json({ error: 'Name too long.' }, { status: 400 });
    }
    if (message.length > 200) {
      return NextResponse.json({ error: 'Message too long.' }, { status: 400 });
    }

    const entry: GuestEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      message,
      timestamp: new Date().toISOString(),
    };

    const entries = [entry, ...read()].slice(0, 50);
    writeFileSync(FILE, JSON.stringify(entries, null, 2));

    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
