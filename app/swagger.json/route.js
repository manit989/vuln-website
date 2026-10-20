import { NextResponse } from 'next/server';

export async function GET() {
  const swaggerSpec = {
    swagger: "2.0",
    info: {
      title: "Tinyfah Swagger API Spec",
      version: "2.0.0",
      description: "Swagger 2.0 endpoint demonstrating exposed specification artifacts (ASVS V4.1.3 / V13.2.1)."
    },
    paths: {
      "/api/users": {
        get: {
          summary: "List users",
          responses: { "200": { description: "User list" } }
        }
      },
      "/api/auth/login": {
        post: {
          summary: "Authenticate",
          responses: { "200": { description: "Session cookie" } }
        }
      },
      "/api/admin": {
        get: {
          summary: "Superuser admin console",
          responses: { "200": { description: "Admin panel" } }
        }
      }
    }
  };

  return NextResponse.json(swaggerSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
