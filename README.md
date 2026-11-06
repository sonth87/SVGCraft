# SVGCraft

Web application for browsing, inspecting, and exporting SVG icons and brand logos. Built with Next.js (App Router) and backed by Cloudflare R2 for SVG storage.

## Structure

```text
├── apps/
│   ├── web/         # Next.js 14 web app (UI, search, SVG inspector, API routes)
│   └── crawler/     # Local crawler service for collecting SVG datasets
├── packages/
│   └── shared/      # Shared catalog indexer, taxonomy, and R2 S3 client
└── scripts/         # Utility scripts for building catalog index & syncing to R2
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Fill in your Cloudflare R2 credentials in `.env` if you are syncing or serving remote assets:

```env
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_BUCKET=svg-icon
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_URL=
```

3. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` — Start the Next.js web app in development mode (`localhost:3000`)
- `npm run build` — Build the Next.js production bundle
- `npm run start` — Run the production server
- `npm run start:crawler` — Start the local crawler dashboard (`localhost:3456`)
- `npm run publish` — After a crawl: upload new/changed SVGs from `output/` to R2 as `svg/{hash}.svg` (Lordicon animations as `lottie/{hash}.json`) and write the catalog JSON to `data/catalog/` (commit it). `-- --no-upload` writes the JSON only
- `npm run lordicon:lottie` — Download missing Lordicon animation data into `output/lordicon/*/lottie/` (the crawler does this for new icons)
- `npm run r2:delete-legacy` — Count (or with `-- --yes`, delete) the pre-hash R2 keys `{site}/{collection}/icons/*`
- `npm run build:index` — Build the search index (`apps/web/data/index.bin`, `details.bin`) from `data/catalog/`. Runs automatically before `dev` and `build`
- `npm run check` — Format check, lint, typecheck and tests (same as CI)

## Data flow

```
crawl → output/ (local only) → npm run publish ─┬─ SVG, Lottie → Cloudflare R2 (svg/{hash}.svg, lottie/{hash}.json)
                                               └─ data/catalog/*.json → git → Vercel build → index.bin
```

Set `R2_PUBLIC_URL` to the bucket's public custom domain so browsers load SVGs straight from the CDN; without it they go through the same-origin `/cdn/*` mirror (cached forever by Vercel's CDN). The web app never calls the source sites at runtime. See `docs/web-refactor-plan.md`.

## License

MIT
