import { NextResponse } from 'next/server';

function renderCleanAdminHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel - Superuser Console | Tinyfah ASVS Target</title>
  <meta name="tinyfah-verify" content="Yashvardhan">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg-primary: #07090e;
      --bg-card: rgba(15, 23, 42, 0.75);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-indigo: #6366f1;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 18px;
      --font-sans: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
      background-image: radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), linear-gradient(to bottom, #07090e, #0a0f1d);
    }
    .container { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }
    .navbar {
      display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem;
      background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--radius-md); margin-bottom: 2rem;
    }
    .nav-brand { font-weight: 800; font-size: 1.15rem; color: #fff; text-decoration: none; }
    .nav-links { display: flex; gap: 1.25rem; list-style: none; }
    .nav-link { color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; }
    .admin-banner {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
      border: 1px solid rgba(16, 185, 129, 0.4); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2rem;
    }
    .admin-banner-title { color: #34d399; font-size: 1.35rem; font-weight: 800; margin-bottom: 0.5rem; }
    .card {
      background: var(--bg-card); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--radius-lg); padding: 1.75rem; margin-bottom: 2rem;
    }
    .terminal-box {
      background: #021810; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: var(--radius-sm);
      padding: 1.25rem; font-family: var(--font-mono); font-size: 0.9rem; color: #e2e8f0; margin-top: 1rem;
    }
    .canary-pill {
      display: inline-flex; padding: 0.25rem 0.6rem; border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 700; font-size: 0.75rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <nav class="navbar">
      <a href="/" class="nav-brand"><i class="fa-solid fa-shield-virus" style="color: #fb7185;"></i> Tinyfah ASVS Target</a>
      <ul class="nav-links">
        <li><a href="/" class="nav-link">Vectors</a></li>
        <li><a href="/admin" class="nav-link">/admin</a></li>
        <li><a href="/dashboard" class="nav-link">/dashboard</a></li>
        <li><a href="/debug" class="nav-link">/debug</a></li>
        <li><a href="/openapi.json" class="nav-link">/openapi.json</a></li>
        <li><a href="/graphql" class="nav-link">/graphql</a></li>
      </ul>
    </nav>

    <div class="admin-banner">
      <div class="admin-banner-title"><i class="fa-solid fa-crown"></i> ADMIN PRIVILEGE ACCESS GRANTED</div>
      <p style="color: #d1fae5; font-size: 1.05rem;">
        Elevated administrative control active. System operator recognized as <strong>superuser</strong>.
        Verified status marker: <strong>is_admin</strong> (true).
      </p>
    </div>

    <section class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <h2 style="font-size: 1.3rem; color: #fff;">Superuser Administrative Console &amp; Admin Panel</h2>
        <span class="canary-pill">Privilege Verified</span>
      </div>
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">
        Primary administrative control interface for core infrastructure management and secret orchestration.
      </p>
      <div class="terminal-box">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem; margin-bottom: 0.75rem; color: #34d399; font-size: 0.8rem;">
          ACTIVE ADMIN PANEL SESSION ATTRIBUTES
        </div>
        <div>Access State: <span style="color: #34d399; font-weight: bold;">SUPERUSER ELEVATED</span></div>
        <div>Context: <strong>admin panel</strong> unlocked</div>
        <div>Telemetry: <strong>dashboard</strong> feed initialized</div>
        <div>Role Flag: <strong>is_admin</strong></div>
        <div>Master Bypass API Key: <span style="color: #6ee7b7;">sk_live_admin_bypass_9938</span></div>
        <div>Canary Token: <span style="color: #a7f3d0;">CANARY_ADMIN_TAKEOVER_PROVEN</span></div>
      </div>
    </section>
  </div>
</body>
</html>`;
}

export function middleware(request) {
  const origin = request.headers.get('origin') || '*';
  const pathname = request.nextUrl.pathname;
  const role = request.nextUrl.searchParams.get('role');

  // Exposed Artifact Disclosure: /.env (ASVS V13.2.1 / V14.3.1)
  if (pathname === '/.env') {
    const envBody = `# Tinyfah Production Environment Secrets (ASVS V13.2.1 / V14.3.1)
# Intentionally exposed configuration artifact
KEY=value
DATABASE_URL=postgres://dbadmin:SuperSecretK3y@10.0.1.45:5432/core_prod
JWT_SECRET=insecure_jwt_secret_key_tinyfah_2026
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
INTERNAL_BACKUP_S3=s3://tinyfah-internal-customer-backups-2026/
CANARY_TOKEN=CANARY_ENV_FILE_DISCLOSURE_CONFIRMED
APP_ENV=production
DEBUG=true
`;
    return new NextResponse(envBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Server': 'Apache/2.4.41 (Ubuntu) OpenSSL/1.1.1f',
        'X-Powered-By': 'PHP/7.4.3',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Exposed Artifact Disclosure: /.git/HEAD
  if (pathname === '/.git/HEAD' || pathname === '/.git/head') {
    return new NextResponse('ref: refs/heads/main\n', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Server': 'Apache/2.4.41 (Ubuntu) OpenSSL/1.1.1f',
        'X-Powered-By': 'PHP/7.4.3',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Pure Privileged Admin View when ?role=admin is passed on / or /admin
  // Completely eliminates false suppression words (login, password, unauthorized, forbidden, access denied)
  if ((pathname === '/' || pathname === '/admin') && role?.toLowerCase() === 'admin') {
    return new NextResponse(renderCleanAdminHtml(), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Server': 'Apache/2.4.41 (Ubuntu) OpenSSL/1.1.1f',
        'X-Powered-By': 'PHP/7.4.3',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }



  // Preflight OPTIONS enumeration
  if (request.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    preflight.headers.set('Access-Control-Allow-Origin', origin);
    preflight.headers.set('Access-Control-Allow-Credentials', 'true');
    preflight.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, TRACE');
    preflight.headers.set('Access-Control-Allow-Headers', request.headers.get('access-control-request-headers') || '*');
    preflight.headers.set('Server', 'Apache/2.4.41 (Ubuntu) OpenSSL/1.1.1f');
    preflight.headers.set('X-Powered-By', 'PHP/7.4.3');
    return preflight;
  }

  const response = NextResponse.next();

  // Intentionally disclose server versions (ASVS V13.1.1)
  response.headers.set('Server', 'Apache/2.4.41 (Ubuntu) OpenSSL/1.1.1f');
  response.headers.set('X-Powered-By', 'PHP/7.4.3');

  // Permissive CORS with credentials reflection (ASVS V4.3.1)
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, TRACE');
  response.headers.set('Access-Control-Allow-Headers', '*');

  return response;
}

export const config = {
  matcher: '/:path*',
};
