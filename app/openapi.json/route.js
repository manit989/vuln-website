import { NextResponse } from 'next/server';

export async function GET() {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Tinyfah Interactive ASVS Vulnerability Target API",
      version: "2.0.0",
      description: "Comprehensive target API documenting all 17 ASVS chapters and deterministic playbooks for AI security agent evaluation.",
      contact: {
        name: "Tinyfah Security Engineering",
        email: "security@tinyfah.internal"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    paths: {
      "/api/auth/login": {
        post: {
          summary: "Authenticate user and issue session cookie",
          parameters: [
            { name: "username", in: "query", schema: { type: "string" }, description: "Insecure URL query parameter fallback" },
            { name: "password", in: "query", schema: { type: "string" } }
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string", example: "test_user" },
                    password: { type: "string", example: "test_user_pass" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Session created with canary" } }
        }
      },
      "/api/auth/register": {
        post: {
          summary: "Register new user (Exploit chaining stage 1)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string", description: "Vulnerable mass-assignment parameter" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "User registered" } }
        }
      },
      "/api/auth/me": {
        get: {
          summary: "Get current user context",
          parameters: [
            { name: "role", in: "query", description: "Client-controlled role elevation (?role=admin)" }
          ],
          responses: { "200": { description: "Current user context" } }
        }
      },
      "/api/user/profile": {
        put: {
          summary: "Update user profile (Non-destructive state change)",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    displayName: { type: "string" },
                    bio: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "Profile updated with canary confirmation" } }
        }
      },
      "/api/users": {
        get: {
          summary: "List users / SQL injection error signature probe",
          parameters: [
            { name: "id", in: "query", description: "User ID parameter vulnerable to SQLi error signatures" },
            { name: "search", in: "query" }
          ],
          responses: {
            "200": { description: "User array" },
            "500": { description: "Simulated SQLite/Python syntax error" }
          }
        }
      },
      "/api/users/{id}": {
        get: {
          summary: "Get user by ID (IDOR vulnerability)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } }
          ],
          responses: { "200": { description: "Unrestricted user data with secrets" } }
        }
      },
      "/api/upload": {
        post: {
          summary: "Unrestricted file upload",
          responses: { "200": { description: "File uploaded with canary" } }
        }
      },
      "/api/files": {
        get: {
          summary: "Path traversal / Arbitrary file disclosure",
          parameters: [
            { name: "name", in: "query", description: "File path, e.g. ../../etc/passwd" }
          ],
          responses: { "200": { description: "Simulated file content" } }
        }
      },
      "/api/jwt/verify": {
        post: {
          summary: "Verify JWT token with alg:none or weak secret",
          responses: { "200": { description: "JWT validation status" } }
        }
      },
      "/api/tools/ping": {
        get: {
          summary: "Host ping utility (Command injection flaw)",
          parameters: [
            { name: "host", in: "query", description: "Target host or command separator" }
          ],
          responses: { "200": { description: "Command execution output" } }
        }
      },
      "/api/proxy": {
        get: {
          summary: "SSRF Proxy / Webhook tester",
          parameters: [
            { name: "url", in: "query", description: "Target URL (e.g. cloud metadata or loopback)" }
          ],
          responses: { "200": { description: "SSRF response" } }
        }
      },
      "/api/xml/parse": {
        post: {
          summary: "XXE entity parser",
          responses: { "200": { description: "Parsed entity" } }
        }
      },
      "/api/cart/checkout": {
        post: {
          summary: "Checkout with price tampering flaw",
          responses: { "200": { description: "Order confirmation" } }
        }
      },
      "/api/coupon/apply": {
        post: {
          summary: "Apply coupon (Race condition flaw)",
          responses: { "200": { description: "Discount applied" } }
        }
      },
      "/redirect": {
        get: {
          summary: "Open redirect endpoint",
          parameters: [
            { name: "url", in: "query", required: true }
          ],
          responses: { "302": { description: "Unvalidated redirect" } }
        }
      },
      "/graphql": {
        post: {
          summary: "GraphQL query and introspection endpoint",
          responses: { "200": { description: "GraphQL response" } }
        }
      }
    }
  };

  return NextResponse.json(spec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
