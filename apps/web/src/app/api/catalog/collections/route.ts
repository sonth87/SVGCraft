import { NextResponse, type NextRequest } from 'next/server';
import { cacheHeaders, getCatalog, readPaging, readText } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const index = getCatalog();
    const result = index.queryCollections({
      ...readPaging(params, { defaultLimit: 24, maxLimit: 48 }),
      mode: params.get('mode') === 'brands' ? 'brands' : 'collections',
      q: readText(params, 'q'),
      category: readText(params, 'category'),
      styleType: readText(params, 'styleType'),
      iconType: readText(params, 'iconType'),
      letter: readText(params, 'letter', 1),
      sort: readText(params, 'sort') || 'popular',
    });
    return NextResponse.json(result, { headers: cacheHeaders(index, 1800, 86400) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
