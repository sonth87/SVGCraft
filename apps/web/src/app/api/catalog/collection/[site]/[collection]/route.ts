import { NextResponse, type NextRequest } from 'next/server';
import { cacheHeaders, getCatalog, readPaging, readText } from '@/lib/catalog';
import { loadCollectionPage } from '@/lib/collectionPage';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest, { params }: { params: { site: string; collection: string } }) {
  try {
    const search = request.nextUrl.searchParams;
    const index = getCatalog();
    const data = loadCollectionPage(index, params.site, params.collection, {
      ...readPaging(search, { defaultLimit: 72, maxLimit: 96 }),
      q: readText(search, 'q'),
      styleType: readText(search, 'styleType'),
      category: readText(search, 'category'),
      sort: readText(search, 'sort') || 'az',
    });
    if (!data) return NextResponse.json({ error: 'Không tìm thấy bộ sưu tập.' }, { status: 404 });
    return NextResponse.json(data, { headers: cacheHeaders(index, 1800, 86400) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
