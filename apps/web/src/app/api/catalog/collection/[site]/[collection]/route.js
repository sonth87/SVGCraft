import { NextResponse } from 'next/server';
import { getStateManager } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { site, collection } = params;
    const { searchParams } = new URL(request.url);
    const stateManager = getStateManager();

    const rawLimit = Number(searchParams.get('limit')) || 72;
    const rawOffset = Number(searchParams.get('offset')) || 0;
    const safeLimit = Math.min(Math.max(1, rawLimit), 96);
    const safeOffset = Math.min(Math.max(0, rawOffset), 12000);
    const safeQ = String(searchParams.get('q') || '').slice(0, 80);

    const data = stateManager.getCollectionDetails(site, collection, {
      q: safeQ,
      styleType: searchParams.get('styleType') || '',
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'az',
      offset: safeOffset,
      limit: safeLimit,
    });

    if (!data) {
      return NextResponse.json({ error: 'Không tìm thấy bộ sưu tập.' }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
