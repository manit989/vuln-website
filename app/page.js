export default async function HomePage({ searchParams }) {
  const params = await searchParams;

  // Unescaped parameter reflection into server-rendered HTML (ASVS V1.2.1)
  const rawQ =
    params.q ||
    params.search ||
    params.query ||
    params.name ||
    params.message ||
    '';

  // Template engine simulation (ASVS V1.3.7)
  const rawTemplate = params.template || '';
  let evaluatedTemplate = rawTemplate;
  if (rawTemplate.includes('{{7*7}}')) {
    evaluatedTemplate = rawTemplate.replace('{{7*7}}', '49');
  }

  // Access Control & IDOR check (ASVS V8.1.1)
  const isPrivilegedAdmin = (params.role || '').toLowerCase() === 'admin';

  return (
    <div>
      {/* Privilege Escalation Banner: Rendered when ?role=admin is provided */}
      {isPrivilegedAdmin && (
        <div className="admin-banner" id="admin-panel-alert">
          <div className="admin-banner-title">
            <i className="fa-solid fa-unlock-keyhole"></i>
            ADMIN PRIVILEGE ACCESS GRANTED
          </div>
          <p style={{ color: '#d1fae5', marginBottom: '0.75rem' }}>
            Elevated administrative session verified via parameter override: <code>?role=admin</code>.
            Marker confirmation: <strong>admin panel</strong> active, <strong>dashboard</strong> unlocked, role assigned: <strong>superuser</strong> (<strong>is_admin</strong>: true).
          </p>
          <div className="terminal-box" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: '#021810' }}>
            <div>Active Superuser Token: <span style={{ color: '#34d399', fontWeight: 'bold' }}>sk_live_admin_bypass_9938</span></div>
            <div>Privilege State: superuser control enabled across internal endpoints.</div>
            <div>Audit Status: bypass verified non-destructively.</div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <header className="hero">
        <div className="badge-pill">
          <span className="badge-dot"></span>
          Next.js Server-Rendered Target &bull; OWASP ASVS 5.0.0
        </div>
        <h1>
          Interactive Security <span>Vulnerability Testbed</span>
        </h1>
        <p>
          Engineered target application with deliberate vulnerabilities across all 17 ASVS chapters,
          authenticated playbooks, and server-rendered endpoints for deterministic AI pentesting verification.
        </p>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">17</span>
            <span className="stat-label">ASVS Chapters</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">345</span>
            <span className="stat-label">Requirements</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">P0 - P3</span>
            <span className="stat-label">Playbook Levels</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">HTTP + SSR</span>
            <span className="stat-label">Probe Compatible</span>
          </div>
        </div>
      </header>

      {/* Discovery Surface Panel (for crawlers, sitemap BFS, and recon tools) */}
      <section className="discovery-bar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fa-solid fa-radar" style={{ color: '#818cf8' }}></i> Recon &amp; Discovery Surface
          </h3>
          <span className="canary-pill">Server-Rendered HTTP Layer</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Endpoints exposed for link crawlers, parameter hints, and artifact verification:
        </p>
        <div className="discovery-links">
          <a href="/robots.txt" className="discovery-badge"><i className="fa-solid fa-robot"></i> /robots.txt</a>
          <a href="/sitemap.xml" className="discovery-badge"><i className="fa-solid fa-sitemap"></i> /sitemap.xml</a>
          <a href="/openapi.json" className="discovery-badge"><i className="fa-solid fa-file-code"></i> /openapi.json</a>
          <a href="/swagger.json" className="discovery-badge"><i className="fa-solid fa-file-code"></i> /swagger.json</a>
          <a href="/graphql" className="discovery-badge"><i className="fa-solid fa-diagram-project"></i> /graphql (Introspection)</a>
          <a href="/.env" className="discovery-badge" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#fca5a5' }}><i className="fa-solid fa-file-shield"></i> /.env</a>
          <a href="/.git/HEAD" className="discovery-badge"><i className="fa-brands fa-git-alt"></i> /.git/HEAD</a>
          <a href="/.well-known/tinyfah-Yashvardhan.txt" className="discovery-badge"><i className="fa-solid fa-fingerprint"></i> /.well-known/tinyfah-token</a>
          <a href="/admin" className="discovery-badge"><i className="fa-solid fa-lock"></i> /admin</a>
          <a href="/dashboard" className="discovery-badge"><i className="fa-solid fa-gauge"></i> /dashboard</a>
          <a href="/debug" className="discovery-badge"><i className="fa-solid fa-bug"></i> /debug</a>
          <a href="/redirect?url=https://example.com" className="discovery-badge"><i className="fa-solid fa-arrow-up-right-from-square"></i> /redirect (Open Redirect)</a>
        </div>
      </section>

      {/* Main Vulnerability Grid Covering All 17 ASVS Chapters */}
      <main className="grid">

        {/* ==================================================================
             1. CHAPTER V1: Output Encoding & Canary Reflection (Reflected XSS / SSTI)
             ================================================================== */}
        <section className="card" id="card-v1" style={{ '--card-accent': '#f43f5e' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#fb7185' }}><i className="fa-solid fa-code"></i></div>
              <h2 className="card-title">V1: Output Encoding &amp; Canary Reflection</h2>
            </div>
            <span className="asvs-tag">V1.2.1 / V1.3.7</span>
          </div>
          <p className="card-desc">
            Raw unencoded parameter reflection in server-rendered HTML (GET q/search/query/name/message) and template expression evaluation.
          </p>

          <form method="GET" action="/" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              name="q"
              className="input-field"
              placeholder="Test <tinyfah-canary-test> or {{7*7}}"
              defaultValue={rawQ}
            />
            <button type="submit" className="btn btn-primary" id="btn-submit-q">Probe</button>
          </form>

          <div className="form-label">Server-Rendered Reflection Sink (Unescaped):</div>
          <div
            id="reflection-output"
            className="reflection-sink"
            dangerouslySetInnerHTML={{
              __html: rawQ
                ? `<strong>Reflection Result:</strong> ${rawQ}`
                : `<span style="color: #64748b;">(No parameter detected. Pass <code>?q=&lt;tinyfah-canary-test&gt;</code> to verify reflection).</span>`,
            }}
          />

          <div className="form-label" style={{ marginTop: '0.75rem' }}>Template Injection Sink (?template=):</div>
          <div
            id="template-output"
            className="reflection-sink"
            style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#c7d2fe' }}
            dangerouslySetInnerHTML={{
              __html: rawTemplate
                ? `<strong>Evaluated Template Result:</strong> ${evaluatedTemplate}`
                : `<span style="color: #64748b;">(Pass <code>?template={{7*7}}</code> to evaluate expressions to 49).</span>`,
            }}
          />

          <div style={{ marginTop: '1rem' }}>
            <a href="javascript:alert('Tinyfah XSS Demonstration')" className="test-link" id="link-javascript-scheme">
              <i className="fa-solid fa-triangle-exclamation"></i> Insecure <code>javascript:</code> Pseudo-Protocol Link
            </a>
          </div>
          <div className="vuln-badge">V1 Flaw: Unescaped SSR reflection &amp; template execution</div>
        </section>

        {/* ==================================================================
             2. CHAPTER V8: Authorization & Privilege Escalation (Gain Control)
             ================================================================== */}
        <section className="card" id="card-v8" style={{ '--card-accent': '#10b981' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#34d399' }}><i className="fa-solid fa-shield-halved"></i></div>
              <h2 className="card-title">V8: Access Control &amp; Privilege Escalation</h2>
            </div>
            <span className="asvs-tag">V8.1.1 / V8.3.2</span>
          </div>
          <p className="card-desc">
            Privilege path reachable via GET parameter override and unauthenticated IDOR endpoints.
          </p>

          <div style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.35)', borderRadius: '8px', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {isPrivilegedAdmin ? (
              <span style={{ color: '#34d399', fontWeight: 'bold' }}>
                🔓 ADMIN ACCESS GRANTED via <code>?role=admin</code>! Token: <code>sk_live_admin_bypass_9938</code>
              </span>
            ) : (
              <div>
                Current Status: <code>Standard Guest</code>.
                <div style={{ marginTop: '0.5rem' }}>
                  {/* Parameter hints and anchor text containing 'Switch to Admin' for admin_surface verifier */}
                  <a href="/?role=admin" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                    Switch to Admin
                  </a>
                  <a href="/admin?role=admin" className="test-link" style={{ marginLeft: '1rem' }}>
                    [Direct /admin?role=admin Link]
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">IDOR User Record Inspection Links (?id= / ?user_id=):</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="/api/users/1?user_id=1" className="test-link" id="link-idor-user-1">
                <i className="fa-solid fa-user"></i> User 1 (Standard)
              </a>
              <a href="/api/users/2?user_id=2" className="test-link" id="link-idor-user-2">
                <i className="fa-solid fa-user-shield"></i> User 2 (Admin)
              </a>
              <a href="/api/users/3?user_id=3" className="test-link" id="link-idor-user-3">
                <i className="fa-solid fa-vault"></i> User 3 (CEO Vault)
              </a>
            </div>
          </div>
          <div className="vuln-badge">V8 Flaw: Parameter role override &amp; unconstrained IDOR</div>
        </section>

        {/* ==================================================================
             3. CHAPTER V6 & V12: Authentication & Insecure Transport
             ================================================================== */}
        <section className="card" id="card-v6" style={{ '--card-accent': '#f59e0b' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#fbbf24' }}><i className="fa-solid fa-lock"></i></div>
              <h2 className="card-title">V6 &amp; V12: Authentication &amp; Transport</h2>
            </div>
            <span className="asvs-tag">V6.1.1 / V12.2.1</span>
          </div>
          <p className="card-desc">
            Insecure login transport posting over plaintext HTTP, credential leaks in URL query strings, and pre-configured test accounts.
          </p>

          <form action="/api/auth/login" method="POST" id="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="username-input">Account Username or Email</label>
              <input
                type="text"
                id="username-input"
                name="username"
                className="input-field"
                defaultValue="test_user"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="password-input">Account Password</label>
              <input
                type="password"
                id="password-input"
                name="password"
                className="input-field"
                defaultValue="test_user_pass"
              />
            </div>
            <button type="submit" className="btn btn-primary" id="btn-submit-login">
              Authenticate (Issues Insecure Cookie + JWT)
            </button>
          </form>

          <div className="terminal-box">
            <div className="terminal-header">
              <span>SQL INJECTION LOGIN BYPASS (ASVS V1.2.1 / V6.2.1)</span>
            </div>
            <div>Vulnerable query: <code>SELECT * FROM users WHERE username = &apos;USERNAME&apos; AND password = &apos;PASSWORD&apos;</code></div>
            <div>Try username: <code>admin&apos; -- </code></div>
            <div>Or username: <code>&apos; OR &apos;1&apos;=&apos;1&apos; -- </code></div>
            <div>On success the session cookie is issued with the selected role. Admin sessions can open <a href="/admin" className="test-link">/admin</a>.</div>
          </div>

          {/* Insecure HTTP link and Sensitive query key leak (ASVS V6.3.1, V12.2.1) */}
          <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <a href="http://insecure-auth-gateway.internal/api/login" className="test-link" id="link-cleartext-http">
              <i className="fa-solid fa-unlock"></i> Plaintext http:// Insecure Action Link
            </a>
            <a href="/?token=eyJhbGciOiJub25lIn0&password=SuperSecretPassword2026!&key=sk_live_9948291038472910&session=sess_9938472918471928" className="test-link" id="link-leak-credentials">
              <i className="fa-solid fa-key"></i> Link Leaking Credentials in Query (?token=...&amp;password=...)
            </a>
          </div>
          <div className="vuln-badge">V6/V12 Flaw: Plaintext submission &amp; credential query string leakage</div>
        </section>

        {/* ==================================================================
             4. CHAPTER V7 & V9: Session Management & Insecure JWT (alg: none)
             ================================================================== */}
        <section className="card" id="card-v7" style={{ '--card-accent': '#8b5cf6' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#a78bfa' }}><i className="fa-solid fa-cookie-bite"></i></div>
              <h2 className="card-title">V7 &amp; V9: Sessions &amp; JWT Verification</h2>
            </div>
            <span className="asvs-tag">V7.1.1 / V9.1.2</span>
          </div>
          <p className="card-desc">
            Insecure cookie flags (missing HttpOnly/Secure/SameSite) and JWT verification supporting <code>alg: "none"</code> and weak secrets.
          </p>

          <div className="terminal-box">
            <div className="terminal-header">
              <span>COOKIE FLAGS &amp; JWT ENDPOINT</span>
              <div className="terminal-dots">
                <span className="t-dot t-red"></span>
                <span className="t-dot t-yellow"></span>
                <span className="t-dot t-green"></span>
              </div>
            </div>
            <div>Set-Cookie: <span className="vulnerable-output">session_id=sess_...; Path=/ (HttpOnly/Secure MISSING)</span></div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>// Accessible via client JavaScript</div>
            <br />
            <div>JWT Verify Endpoint: <code>POST /api/jwt/verify</code></div>
            <div>Accepts: <span className="vulnerable-output">alg: "none" (Unsigned) &amp; weak secret ("secret")</span></div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <a href="/api/jwt/verify?token=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOjIsImFkbWluIjp0cnVlLCJyb2xlIjoiYWRtaW4ifQ." className="test-link" id="link-jwt-verify-test">
              <i className="fa-solid fa-key"></i> Test alg:none JWT Bypass (?token=eyJhbGciOiJub25l...)
            </a>
          </div>
          <div className="vuln-badge">V7/V9 Flaw: Insecure cookies &amp; unsigned alg:none JWT bypass</div>
        </section>

        {/* ==================================================================
             5. CHAPTER V5: Unrestricted File Upload & Path Traversal
             ================================================================== */}
        <section className="card" id="card-v5" style={{ '--card-accent': '#ec4899' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#f472b6' }}><i className="fa-solid fa-cloud-arrow-up"></i></div>
              <h2 className="card-title">V5: File Handling &amp; Path Traversal</h2>
            </div>
            <span className="asvs-tag">V5.1.1 / V5.5.1</span>
          </div>
          <p className="card-desc">
            State-changing file upload accepting arbitrary extensions (.php, .sh, .exe) and path traversal LFI endpoint.
          </p>

          <form action="/api/upload" method="POST" encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <input type="file" name="file" className="input-field" style={{ padding: '0.45rem' }} />
            <button type="submit" className="btn btn-primary" id="btn-upload">
              <i className="fa-solid fa-upload"></i> Upload Arbitrary File (Non-Destructive Canary)
            </button>
          </form>

          <div style={{ marginTop: '0.85rem' }}>
            <div className="form-label">Path Traversal / LFI Probes:</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              <a href="/api/files?name=../../../../etc/passwd" className="test-link" id="link-traversal-passwd">
                <i className="fa-solid fa-file-lines"></i> Traversal: /etc/passwd
              </a>
              <a href="/api/files?name=../../.env" className="test-link" id="link-traversal-env">
                <i className="fa-solid fa-file-code"></i> Traversal: /.env
              </a>
            </div>
          </div>
          <div className="vuln-badge">V5 Flaw: Unconstrained upload &amp; directory traversal read</div>
        </section>

        {/* ==================================================================
             6. CHAPTER V2 & V16: SQL Injection & Stack Trace Disclosure
             ================================================================== */}
        <section className="card" id="card-v16" style={{ '--card-accent': '#ef4444' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#f87171' }}><i className="fa-solid fa-database"></i></div>
              <h2 className="card-title">V2 &amp; V16: SQLi Error Signatures &amp; Stack Traces</h2>
            </div>
            <span className="asvs-tag">V2.1.1 / V16.1.1</span>
          </div>
          <p className="card-desc">
            Deterministic error-signature SQL injection in <code>/api/users</code> and verbose Python/SQLite OperationalError traces.
          </p>

          <div className="terminal-box" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
            <div className="terminal-header" style={{ color: '#fca5a5' }}>
              <span>SQL ERROR-SIGNATURE PROBE</span>
            </div>
            <div className="vulnerable-output">
              sqlite3.OperationalError: unrecognized token: "'" -- syntax error at or near quote
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.35rem' }}>
              Triggers on: &apos; or &apos; OR 1=1-- or union select
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/api/users?id='" className="test-link" id="link-sqli-error">
              <i className="fa-solid fa-bug"></i> Trigger SQL Syntax Error (?id=&apos;)
            </a>
            <a href="/api/users?id=' OR 1=1--" className="test-link" id="link-sqli-dump">
              <i className="fa-solid fa-database"></i> SQLi Bypass Dump (?id=&apos; OR 1=1--)
            </a>
          </div>
          <div className="vuln-badge">V2/V16 Flaw: Raw SQL syntax error &amp; dump bypass</div>
        </section>

        {/* ==================================================================
             7. CHAPTER V4 & V13: API Architecture, CORS & Exposed Docs
             ================================================================== */}
        <section className="card" id="card-v4" style={{ '--card-accent': '#06b6d4' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#22d3ee' }}><i className="fa-solid fa-server"></i></div>
              <h2 className="card-title">V4 &amp; V13: API Services, CORS &amp; Banners</h2>
            </div>
            <span className="asvs-tag">V4.3.1 / V13.1.1</span>
          </div>
          <p className="card-desc">
            Permissive CORS reflection with credentials, server header leakage (Apache/PHP), and GraphQL introspection.
          </p>

          <div className="terminal-box">
            <div className="terminal-header">
              <span>SERVER RESPONSE HEADERS DISCLOSED</span>
            </div>
            <div>Server: <span className="vulnerable-output">Apache/2.4.41 (Ubuntu) OpenSSL/1.1.1f</span></div>
            <div>X-Powered-By: <span className="vulnerable-output">PHP/7.4.3</span></div>
            <div>Access-Control-Allow-Origin: <span className="vulnerable-output">* (Reflected Origin)</span></div>
            <div>Access-Control-Allow-Credentials: <span className="vulnerable-output">true</span></div>
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/openapi.json" className="test-link"><i className="fa-solid fa-file-code"></i> /openapi.json</a>
            <a href="/swagger.json" className="test-link"><i className="fa-solid fa-file-code"></i> /swagger.json</a>
            <a href="/graphql?query={__schema{types{name}}}" className="test-link"><i className="fa-solid fa-diagram-project"></i> GraphQL Dump</a>
          </div>
          <div className="vuln-badge">V4/V13 Flaw: Wildcard CORS credentials &amp; server version disclosure</div>
        </section>

        {/* ==================================================================
             8. CHAPTER V17: SSRF & WebRTC Internal Discovery
             ================================================================== */}
        <section className="card" id="card-v17" style={{ '--card-accent': '#ec4899' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#f472b6' }}><i className="fa-solid fa-satellite-dish"></i></div>
              <h2 className="card-title">V17: SSRF Canary &amp; WebRTC Network</h2>
            </div>
            <span className="asvs-tag">V17.1.1 / V17.2.1</span>
          </div>
          <p className="card-desc">
            Server-side request forgery proxy resolving internal cloud metadata / loopback services and WebRTC IP discovery.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/api/proxy?url=http://169.254.169.254/latest/meta-data" className="test-link" id="link-ssrf-aws">
              <i className="fa-brands fa-aws"></i> SSRF: Cloud Metadata (169.254.169.254)
            </a>
            <a href="/api/proxy?url=http://127.0.0.1:8000/internal" className="test-link" id="link-ssrf-loopback">
              <i className="fa-solid fa-network-wired"></i> SSRF: Internal Loopback Gateway (127.0.0.1)
            </a>
          </div>
          <div className="vuln-badge">V17 Flaw: Unvalidated outbound requests to internal services</div>
        </section>

        {/* ==================================================================
             9. CHAPTER V3 & V15: Outdated Dependencies & Reverse Tabnabbing
             ================================================================== */}
        <section className="card" id="card-v3" style={{ '--card-accent': '#6366f1' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#818cf8' }}><i className="fa-solid fa-window-restore"></i></div>
              <h2 className="card-title">V3 &amp; V15: DOM Integrity &amp; Legacy Libraries</h2>
            </div>
            <span className="asvs-tag">V3.1.1 / V15.2.1</span>
          </div>
          <p className="card-desc">
            Reverse tabnabbing external links, CDN links missing Subresource Integrity (SRI), and outdated library signatures.
          </p>

          <div style={{ marginBottom: '0.75rem' }}>
            <a href="https://example.com" target="_blank" className="test-link" id="link-tabnabbing">
              External Link (target=&quot;_blank&quot; missing rel=&quot;noopener&quot;) <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>

          <div className="terminal-box">
            <div className="terminal-header">
              <span>DETECTED CLIENT SIGNATURES</span>
            </div>
            <div>window.jQuery.fn.jquery: <span className="vulnerable-output">&quot;1.12.4&quot;</span></div>
            <div>window.React.version: <span className="vulnerable-output">&quot;16.8.0&quot;</span></div>
            <div>window._.VERSION: <span className="vulnerable-output">&quot;4.17.11&quot;</span></div>
          </div>
          <div className="vuln-badge">V3/V15 Flaw: Missing SRI, tabnabbing &amp; vulnerable library signatures</div>
        </section>

        {/* ==================================================================
             10. CHAPTER V10 & V11: Business Logic & Cryptography
             ================================================================== */}
        <section className="card" id="card-v10" style={{ '--card-accent': '#f59e0b' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#fbbf24' }}><i className="fa-solid fa-coins"></i></div>
              <h2 className="card-title">V10 &amp; V11: Business Logic &amp; Weak Crypto</h2>
            </div>
            <span className="asvs-tag">V10.2.1 / V11.1.1</span>
          </div>
          <p className="card-desc">
            Race condition coupon redemption, negative price parameter tampering, and weak pseudo-random token generation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/api/coupon/apply" className="test-link"><i className="fa-solid fa-ticket"></i> Coupon Race Condition (PROMO2026_ONCE)</a>
            <a href="/api/cart/checkout" className="test-link"><i className="fa-solid fa-cart-shopping"></i> Checkout Price Tampering (Negative Price)</a>
            <a href="/api/auth/reset-password" className="test-link"><i className="fa-solid fa-key"></i> Predictable Password Reset Tokens</a>
          </div>
          <div className="vuln-badge">V10/V11 Flaw: Race conditions, price tampering &amp; weak entropy</div>
        </section>

        {/* ==================================================================
             11. CHAPTER V1 & V15: Command Injection & Deserialization
             ================================================================== */}
        <section className="card" id="card-v11" style={{ '--card-accent': '#e11d48' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#fb7185' }}><i className="fa-solid fa-terminal"></i></div>
              <h2 className="card-title">V1 &amp; V15: Command Injection &amp; Deserialization</h2>
            </div>
            <span className="asvs-tag">V1.3.3 / V15.3.1</span>
          </div>
          <p className="card-desc">
            Operating system command injection simulator and insecure object deserialization endpoint.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/api/tools/ping?host=127.0.0.1; whoami" className="test-link" id="link-cmd-injection">
              <i className="fa-solid fa-terminal"></i> Command Injection: ?host=127.0.0.1; whoami
            </a>
            <a href="/api/xml/parse" className="test-link"><i className="fa-solid fa-file-code"></i> XXE External Entity Parser</a>
            <a href="/api/deserialize" className="test-link"><i className="fa-solid fa-cube"></i> Insecure Deserialization Simulator</a>
          </div>
          <div className="vuln-badge">V1/V15 Flaw: Command chaining &amp; deserialization execution</div>
        </section>

        {/* ==================================================================
             12. CHAPTER V14: Sensitive Data Protection & Canary Secrets
             ================================================================== */}
        <section className="card" id="card-v14" style={{ '--card-accent': '#10b981' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#34d399' }}><i className="fa-solid fa-user-secret"></i></div>
              <h2 className="card-title">V14: Sensitive Data Protection &amp; Secrets</h2>
            </div>
            <span className="asvs-tag">V14.1.1 / V14.3.1</span>
          </div>
          <p className="card-desc">
            Production secrets, internal connection strings in HTML comments, and canary tokens for automated verification.
          </p>

          <div className="terminal-box">
            <div className="terminal-header">
              <span>HARDCODED COMMENT SECRETS</span>
            </div>
            <div>Admin: <span className="vulnerable-output">admin@tinyfah-corp.internal / P@ssw0rd2026!</span></div>
            <div>Database: <span className="vulnerable-output">postgres://dbadmin:SuperSecretK3y@10.0.1.45:5432/core_prod</span></div>
            <div>Canary Token: <span style={{ color: '#34d399' }}>CANARY_HARDCODED_HTML_COMMENT_TOKEN_PROVEN</span></div>
          </div>
          <div className="vuln-badge">V14 Flaw: Plaintext credentials &amp; internal topology disclosure</div>
        </section>

      </main>
    </div>
  );
}
