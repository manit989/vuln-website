import { NextResponse } from 'next/server';

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3000/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://localhost:3000/admin</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>http://localhost:3000/dashboard</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>http://localhost:3000/debug</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>http://localhost:3000/graphql</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>http://localhost:3000/openapi.json</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>http://localhost:3000/swagger.json</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>http://localhost:3000/redirect</loc>
    <priority>0.5</priority>
  </url>
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
