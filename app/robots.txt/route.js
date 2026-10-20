import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Disallow: /admin
Disallow: /dashboard
Disallow: /debug
Disallow: /api/internal/
Disallow: /api/admin/
Disallow: /.env
Disallow: /.git/

Sitemap: http://localhost:3000/sitemap.xml
`;

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
