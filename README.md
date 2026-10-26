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
- `npm run build:index` — Generate compressed catalog index (`data/catalog-index.json.gz`) from local `output/`
- `npm run r2:sync` — Upload local SVG files in `output/` to Cloudflare R2

## License

MIT
