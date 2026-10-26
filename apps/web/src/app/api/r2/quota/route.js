import { NextResponse } from 'next/server';
import { getR2Client } from '@/lib/catalogServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  const r2Client = getR2Client();
  return NextResponse.json(r2Client.getQuotaSummary());
}
