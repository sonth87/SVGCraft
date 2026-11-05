import { NextResponse, type NextRequest } from 'next/server';
import { cacheHeaders, getCatalog, readPaging, readText } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const index = getCatalog();
    const result = index.queryIcons({
      ...readPaging(params, { defaultLimit: 72, maxLimit: 96 }),
      q: readText(params, 'q'),
      category: readText(params, 'category'),
      styleType: readText(params, 'styleType'),
      iconType: readText(params, 'iconType'),
      site: readText(params, 'site'),
      collection: readText(params, 'collection', 160),
      gridSize: readText(params, 'gridSize'),
      letter: readText(params, 'letter', 1),
      sort: readText(params, 'sort') || 'recent',
    });
    return NextResponse.json(result, { headers: cacheHeaders(index, 1800, 86400) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
