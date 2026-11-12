import { getCatalog } from '@/lib/catalog';

// Sitemap protocol allows 50,000 URLs per file; id 0 is the collections, ids 1..N are icon chunks
const CHUNK = 45000;

export const SITE_URL = (process.env.SITE_URL || 'https://svgcraft.vercel.app').replace(/\/$/, '');

// Built once per deploy, then served from the CDN
export const revalidate = 86400;

export function generateSitemaps() {
  const total = getCatalog().summary().totalIcons;
  const chunks = Math.ceil(total / CHUNK);
  return Array.from({ length: chunks + 1 }, (_, id) => ({ id }));
}

export default function sitemap({ id }) {
  const index = getCatalog();
  const n = Number(id);

  if (n === 0) {
    return [
      { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
      ...index.summary().collections.map((c) => ({
        url: `${SITE_URL}/collection/${encodeURIComponent(c.slug)}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      })),
    ];
  }

  const total = index.summary().totalIcons;
  const start = (n - 1) * CHUNK;
  const end = Math.min(total, start + CHUNK);
  const out = [];
  for (let ord = start; ord < end; ord++) {
    const it = index.item(ord);
    out.push({
      url: `${SITE_URL}/icon/${encodeURIComponent(it.collectionSlug)}/${encodeURIComponent(it.id)}`,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }
  return out;
}
