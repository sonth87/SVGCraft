import path from 'path';
import { NextResponse } from 'next/server';
import { getR2Client, OUTPUT_DIR } from '@/lib/catalogServer';

function getFallbackFileNames(safeFile) {
  const candidates = [safeFile];
  // If requested as "xai.svg" or "grok.dark.svg", also try "xai-xai.svg" / "grok-grok.dark.svg"
  const m = safeFile.match(/^([a-zA-Z0-9-_]+?)(\.[a-zA-Z0-9-_]+)?\.svg$/);
  if (m) {
    const [, baseSlug, variantSuffix = ''] = m;
    const doubled = `${baseSlug}-${baseSlug}${variantSuffix}.svg`;
    if (!candidates.includes(doubled)) {
      candidates.push(doubled);
    }
  }
  return candidates;
}

export async function GET(request, { params }) {
  try {
    const { site, collection, fileName } = params;
    const safeSite = String(site).replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeCol = String(collection).replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeFile = path.basename(String(fileName));
    const candidateFiles = getFallbackFileNames(safeFile);

    // 1. Serve from local disk if present (Local Dev Mode — opaque to @vercel/nft static tracer)
    const runtimeFs = eval('require')('fs');
    for (const candidate of candidateFiles) {
      const localFilePath = path.join(OUTPUT_DIR, safeSite, safeCol, 'icons', candidate);
      if (runtimeFs.existsSync(localFilePath)) {
        const svgContent = runtimeFs.readFileSync(localFilePath, 'utf8');
        return new NextResponse(svgContent, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=31536000, max-age=31536000, immutable',
          },
        });
      }
    }

    // 2. Serve from Cloudflare R2 (Vercel Production Mode)
    const r2Client = getR2Client();

    if (r2Client.publicUrl) {
      const primaryKey = `${safeSite}/${safeCol}/icons/${candidateFiles[0]}`;
      return NextResponse.redirect(`${r2Client.publicUrl}/${primaryKey}`, {
        status: 302,
        headers: {
          'Cache-Control': 'public, s-maxage=31536000, max-age=31536000, immutable',
        },
      });
    }

    for (const candidate of candidateFiles) {
      const objectKey = `${safeSite}/${safeCol}/icons/${candidate}`;
      const r2Svg = await r2Client.getSvgObject(objectKey);
      if (r2Svg) {
        return new NextResponse(r2Svg, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=31536000, max-age=31536000, immutable',
          },
        });
      }
    }

    return new NextResponse('SVG not found', { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
