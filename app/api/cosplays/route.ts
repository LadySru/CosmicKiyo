import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'cosplays.json');
    const raw = readFileSync(filePath, 'utf-8');
    const cosplays = JSON.parse(raw);
    return NextResponse.json(cosplays);
  } catch (e) {
    console.error('[cosplays route]', e);
    return NextResponse.json([], { status: 200 });
  }
}
