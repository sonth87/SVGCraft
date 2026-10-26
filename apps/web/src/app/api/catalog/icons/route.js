import { NextResponse } from 'next/server';
import { getStateManager } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateManager = getStateManager();

    const rawLimit = Number(searchParams.get('limit')) || 72;
    const rawOffset = Number(searchParams.get('offset')) || 0;
    const safeLimit = Math.min(Math.max(1, rawLimit), 96);
    const safeOffset = Math.min(Math.max(0, rawOffset), 12000);
    const safeQ = String(searchParams.get('q') || '').slice(0, 80);

    const result = stateManager.queryIcons({
      q: safeQ,
      category: searchParams.get('category') || '',
      styleType: searchParams.get('styleType') || '',
      iconType: searchParams.get('iconType') || '',
      site: searchParams.get('site') || '',
      collection: searchParams.get('collection') || '',
      gridSize: searchParams.get('gridSize') || '',
      letter: searchParams.get('letter') || '',
      sort: searchParams.get('sort') || 'recent',
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
