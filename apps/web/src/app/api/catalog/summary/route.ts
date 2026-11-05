import { NextResponse } from 'next/server';
import { cacheHeaders, getCatalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export function GET() {
  try {
    const index = getCatalog();
    return NextResponse.json(index.summary(), { headers: cacheHeaders(index, 3600, 86400) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
