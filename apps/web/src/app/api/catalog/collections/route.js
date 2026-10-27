import { NextResponse } from 'next/server';
import { getStateManager } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateManager = getStateManager();

    const rawLimit = Number(searchParams.get('limit')) || 24;
    const rawOffset = Number(searchParams.get('offset')) || 0;
    const safeLimit = Math.min(Math.max(1, rawLimit), 48);
    const safeOffset = Math.min(Math.max(0, rawOffset), 5000);
    const safeQ = String(searchParams.get('q') || '').slice(0, 80);

    const result = stateManager.queryCollections({
      q: safeQ,
      category: searchParams.get('category') || '',
      styleType: searchParams.get('styleType') || '',
      iconType: searchParams.get('iconType') || '',
      letter: searchParams.get('letter') || '',
      sort: searchParams.get('sort') || 'popular',
      offset: safeOffset,
      limit: safeLimit,
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
