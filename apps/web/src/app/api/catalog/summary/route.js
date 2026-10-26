import { NextResponse } from 'next/server';
import { getStateManager } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stateManager = getStateManager();
    const summary = stateManager.getCatalogSummary();
    return NextResponse.json(summary, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
