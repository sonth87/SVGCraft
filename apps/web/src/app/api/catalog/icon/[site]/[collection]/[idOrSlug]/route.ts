import { NextResponse } from 'next/server';
import { cacheHeaders, getCatalog } from '@/lib/catalog';
import { loadIconDetail } from '@/lib/iconDetail';

export const dynamic = 'force-dynamic';

type Params = { site: string; collection: string; idOrSlug: string };

export async function GET(_request: Request, { params }: { params: Params }) {
  try {
    const index = getCatalog();
    const ord = index.findIcon(params.site, params.collection, params.idOrSlug);
    if (ord < 0) return NextResponse.json({ error: 'Không tìm thấy icon.' }, { status: 404 });
    return NextResponse.json(await loadIconDetail(index, ord), { headers: cacheHeaders(index, 86400, 604800) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
