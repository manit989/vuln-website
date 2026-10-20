import { NextResponse } from 'next/server';

export async function GET(request, context) {
  const params = await context.params;
  const pathParts = params.path || [];
  const filename = pathParts.join('/');

  // Match tinyfah-<token>.txt
  const match = filename.match(/tinyfah-([^/]+)\.txt$/);
  if (match) {
    const token = match[1];
    return new NextResponse(token, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  // Fallback for default token
  if (filename.includes('tinyfah')) {
    return new NextResponse('Yashvardhan', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  return new NextResponse('Not Found', { status: 404 });
}
