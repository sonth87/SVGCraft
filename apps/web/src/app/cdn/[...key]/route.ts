/**
 * Same-origin mirror of the content-addressed R2 objects, used while the bucket has no public domain:
 *
 *   /cdn/svg/{hash}.svg       → R2 `svg/{hash}.svg`
 *   /cdn/lottie/{hash}.json   → R2 `lottie/{hash}.json`
 *
 * The URL changes whenever the content changes, so responses are cached forever by the browser and by
 * Vercel's CDN: each object costs one function call + one R2 read per region, ever. `/cdn/*` is kept
 * out of the middleware matcher so cached hits never run any code. Once R2_PUBLIC_URL is set the
 * catalog points browsers at the bucket directly and this route is only a fallback.
 */
import { NextResponse } from 'next/server';
import { getR2Client } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const OBJECTS: Record<string, { pattern: RegExp; contentType: string }> = {
  svg: { pattern: /^[0-9a-f]{16}\.svg$/, contentType: 'image/svg+xml; charset=utf-8' },
  lottie: { pattern: /^[0-9a-f]{16}\.json$/, contentType: 'application/json; charset=utf-8' },
};

const IMMUTABLE = 'public, max-age=31536000, immutable';

export async function GET(_request: Request, { params }: { params: { key: string[] } }) {
  const [kind = '', file = '', ...rest] = params.key;
  const spec = OBJECTS[kind];
  if (!spec || rest.length || !spec.pattern.test(file)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const body = await getR2Client().getObjectText(`${kind}/${file}`);
    if (body === null) {
      // Short cache only: the object may simply not be uploaded yet
      return new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'public, s-maxage=60' } });
    }
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': spec.contentType,
        'Cache-Control': IMMUTABLE,
        'CDN-Cache-Control': IMMUTABLE,
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (err) {
    return new NextResponse((err as Error).message, { status: 502 });
  }
}
