import { NextResponse } from 'next/server';
import { logCanary } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url') || searchParams.get('target') || searchParams.get('redirect') || '/';

  logCanary('OPEN_REDIRECT_ACCESSED', { target });

  // ASVS V1.4.1 / V10.2.1: Open Redirect vulnerability
  const response = NextResponse.redirect(target, 302);
  response.headers.set('X-Canary', 'CANARY_OPEN_REDIRECT_CONFIRMED');
  return response;
}
