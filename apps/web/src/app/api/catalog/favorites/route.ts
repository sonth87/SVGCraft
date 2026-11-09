import { NextResponse } from 'next/server';
import { getCatalog } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

const MAX_KEYS = 500;

/** Resolve favorite keys (`collection:id` or `site:collection:id`) to icon cards, in the order given. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { keys?: unknown };
    const keys = Array.isArray(body.keys) ? body.keys.filter((k): k is string => typeof k === 'string') : [];
    const index = getCatalog();
    const seen = new Set<string>();
    const items = [];
    for (const key of keys.slice(0, MAX_KEYS)) {
      const parts = key.split(':');
      const [collection, id] = parts.length >= 3 ? [parts[1]!, parts[2]!] : [parts[0]!, parts[1]!];
      if (!collection || !id) continue;
      const ord = index.findIcon('any', collection, id);
      if (ord < 0) continue;
      const item = index.item(ord);
      const unique = `${item.collectionSlug}:${item.id}`;
      if (seen.has(unique)) continue;
      seen.add(unique);
      items.push(item);
    }
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
