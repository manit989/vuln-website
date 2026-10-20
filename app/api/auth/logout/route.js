import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/db';

export async function POST(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/session_id=([^;]+)/);
  if (match) {
    deleteSession(match[1]);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
  response.headers.set('Set-Cookie', 'session_id=; Path=/; Max-Age=0');
  return response;
}

export async function GET(request) {
  return POST(request);
}
