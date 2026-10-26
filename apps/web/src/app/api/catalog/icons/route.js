import { NextResponse } from 'next/server';
import { getStateManager } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateManager = getStateManager();

    const result = stateManager.queryIcons({
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      styleType: searchParams.get('styleType') || '',
      iconType: searchParams.get('iconType') || '',
      site: searchParams.get('site') || '',
      collection: searchParams.get('collection') || '',
      gridSize: searchParams.get('gridSize') || '',
      letter: searchParams.get('letter') || '',
      sort: searchParams.get('sort') || 'recent',
      offset: Number(searchParams.get('offset')) || 0,
      limit: Number(searchParams.get('limit')) || 120,
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
