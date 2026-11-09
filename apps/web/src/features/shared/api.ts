/** Client-side JSON fetch for the catalog API: required header, small in-memory cache, rate-limit toast. */
import { readLang, showToast, translate } from './bridge';

const MAX_ENTRIES = 60;
const cache = new Map<string, unknown>();

export function clearApiCache(): void {
  cache.clear();
}

export async function apiJson<T>(
  url: string,
  { signal, bypassCache = false }: { signal?: AbortSignal; bypassCache?: boolean } = {}
): Promise<T> {
  if (!bypassCache && cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url, { signal, headers: { 'X-SVGCraft-Client': 'web-v2', Accept: 'application/json' } });
  if (res.status === 429) {
    showToast(translate(readLang(), 'toastRateLimit'));
    throw new Error('Rate limited (429)');
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as T;
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
  cache.set(url, data);
  return data;
}
