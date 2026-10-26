import { NextResponse } from 'next/server';
import { getStateManager } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { site, collection } = params;
    const { searchParams } = new URL(request.url);
    const stateManager = getStateManager();

    const data = stateManager.getCollectionDetails(site, collection, {
      q: searchParams.get('q') || '',
      styleType: searchParams.get('styleType') || '',
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'az',
      offset: Number(searchParams.get('offset')) || 0,
      limit: Number(searchParams.get('limit')) || 120,
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
