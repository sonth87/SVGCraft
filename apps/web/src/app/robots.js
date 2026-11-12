import { getCatalog } from '@/lib/catalog';

const SITE_URL = (process.env.SITE_URL || 'https://svgcraft.vercel.app').replace(/\/$/, '');

export default function robots() {
  const files = Math.ceil(getCatalog().summary().totalIcons / 45000) + 1;
  return {
    sitemap: Array.from({ length: files }, (_, i) => `${SITE_URL}/sitemap/${i}.xml`),
    rules: [
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-Web',
          'CCBot',
          'Bytespider',
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'PetalBot',
          'DataForSeoBot',
          'BLEXBot',
        ],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/svg/', '/cdn/'],
      },
    ],
  };
}
