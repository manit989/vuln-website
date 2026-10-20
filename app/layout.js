import './globals.css';

export const metadata = {
  title: 'Tinyfah Vulnerability Testbed | OWASP ASVS 5.0.0 Target Server',
  description:
    'Comprehensive server-rendered target web application engineered with realistic vulnerabilities across all 17 OWASP ASVS chapters and deterministic playbooks for AI security agents.',
  other: {
    'tinyfah-verify': 'Yashvardhan',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="tinyfah-verify" content="Yashvardhan" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* External CDN Asset without Subresource Integrity (ASVS V3.1.1) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* Intentionally omit strict Content-Security-Policy & HSTS headers (ASVS V3.4.1, V3.4.2) */}
      </head>
      <body>
        {/*
          DEVELOPER COMMENT WITH HARDCODED SENSITIVE SECRETS (ASVS V14.3.1, V15.3.1)
          TODO: Remove before pushing to production!
          Master Admin: admin@tinyfah-corp.internal / P@ssw0rd2026!
          Production Database URI: postgres://dbadmin:SuperSecretK3y@10.0.1.45:5432/core_prod
          AWS S3 Bucket: s3://tinyfah-internal-customer-backups-2026/
          Canary Secret: CANARY_HARDCODED_HTML_COMMENT_TOKEN_PROVEN
        */}

        <div className="container">
          {/* Universal Navbar */}
          <nav className="navbar">
            <a href="/" className="nav-brand">
              <i className="fa-solid fa-shield-virus" style={{ color: '#fb7185' }}></i>
              <span>Tinyfah</span> ASVS Testbed
            </a>
            <ul className="nav-links">
              <li>
                <a href="/" className="nav-link">
                  <i className="fa-solid fa-grid-2"></i> Vectors
                </a>
              </li>
              <li>
                <a href="/admin" className="nav-link">
                  <i className="fa-solid fa-lock"></i> /admin
                </a>
              </li>
              <li>
                <a href="/dashboard" className="nav-link">
                  <i className="fa-solid fa-gauge"></i> /dashboard
                </a>
              </li>
              <li>
                <a href="/debug" className="nav-link">
                  <i className="fa-solid fa-bug"></i> /debug
                </a>
              </li>
              <li>
                <a href="/openapi.json" className="nav-link">
                  <i className="fa-solid fa-file-code"></i> /openapi.json
                </a>
              </li>
              <li>
                <a href="/graphql" className="nav-link">
                  <i className="fa-solid fa-diagram-project"></i> /graphql
                </a>
              </li>
            </ul>
          </nav>

          {children}

          <footer>
            <p>
              <strong>Tinyfah Security Testbed</strong> &bull; Server-Rendered Next.js Target Application for OWASP ASVS 5.0.0 Evaluation.
            </p>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
              Engineered with deterministic verification paths, canaries, and authenticated playbooks.
            </p>
          </footer>
        </div>

        {/* Client-side bootstrap simulation script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Expose Outdated Third-Party Library Signatures (ASVS V3.1.1, V15.2.1)
              window.jQuery = { fn: { jquery: "1.12.4" } };
              window.$ = window.jQuery;
              window.React = { version: "16.8.0" };
              window.Vue = { version: "2.5.17" };
              window._ = { VERSION: "4.17.11" };

              // Plant Insecure Session Cookies (ASVS V7.1.1, V14.1.1)
              try {
                document.cookie = "session_id=sess_9938472918471928; path=/; Max-Age=86400";
                document.cookie = "user_auth=john_doe_authenticated; path=/; Max-Age=86400";
              } catch(e) {}

              // Store Plaintext Authentication Tokens in Web Storage (ASVS V7.2.2, V9.1.2)
              try {
                const dummyJwt = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiQWRtaW4gVXNlciIsImFkbWluIjp0cnVlLCJpYXQiOjE2NzAwMDAwMDB9.";
                localStorage.setItem("auth_token", dummyJwt);
                localStorage.setItem("api_secret_key", "sec_live_9948291038472910");
                sessionStorage.setItem("user_session_token", "sess_jwt_token_unencrypted_991823");
              } catch(e) {}

              // Dangerous Wildcard postMessage Listener (ASVS V3.5.1)
              window.addEventListener("message", (event) => {
                try {
                  if (typeof event.data === "string" && event.data.startsWith("exec:")) {
                    eval(event.data.substring(5));
                  }
                } catch(e) {}
              });

              // WebRTC Local IP Leak Probe (ASVS V17.1.1)
              try {
                const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
                pc.createDataChannel("tinyfah_leak_probe");
                pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {});
              } catch(e) {}
            `,
          }}
        />
      </body>
    </html>
  );
}
