# 🎯 Tinyfah OWASP ASVS 5.0.0 Server-Rendered Vulnerability Target

A production-grade, server-rendered **Next.js** interactive target application purposefully engineered with realistic vulnerabilities across all **17 OWASP ASVS chapters (345 requirements)** and deterministic playbooks for AI security agent evaluation.

Built specifically to support non-browser probe layers (`httpx`), server-side reflection, authenticated sessions, state-changing playbooks with non-destructive canaries, and multi-step exploit chains (`register` → `login` → `escalate` → `act`).

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Or run production server on port 3000
npm run build
npm run start -- -p 3000
```

Open `http://127.0.0.1:3000` in your browser or point your automated agent's probe runner directly at it.

---

## 🔍 Discovery & Recon Surface

The target server pre-renders discoverable endpoints and surfaces so crawler and link-graph BFS routines discover all attack surfaces over HTTP:

- **Robots & Sitemap**: [`/robots.txt`](file:///home/manit/dev/projects/vulnerable-testbed/app/robots.txt/route.js), [`/sitemap.xml`](file:///home/manit/dev/projects/vulnerable-testbed/app/sitemap.xml/route.js) (disclosing `/admin`, `/dashboard`, `/debug`, `/api/admin/`)
- **Exposed Artifacts**: `/.env` (signature `KEY=value`, `DATABASE_URL=postgres://...`), `/.git/HEAD` (`ref: refs/heads/main`)
- **Ownership Verification**: `/.well-known/tinyfah-[token].txt` (byte-exact token output, e.g. `/.well-known/tinyfah-Yashvardhan.txt`), `<meta name="tinyfah-verify" content="Yashvardhan">`
- **API Specs**: [`/openapi.json`](file:///home/manit/dev/projects/vulnerable-testbed/app/openapi.json/route.js) (OpenAPI 3.0.0), [`/swagger.json`](file:///home/manit/dev/projects/vulnerable-testbed/app/swagger.json/route.js) (Swagger 2.0)
- **GraphQL**: [`/graphql`](file:///home/manit/dev/projects/vulnerable-testbed/app/graphql/route.js) (Full schema introspection enabled via `{ __schema { types { name } } }`)
- **Diagnostic Console**: [`/debug`](file:///home/manit/dev/projects/vulnerable-testbed/app/debug/page.js) (Discloses internal subnet, environment variables, active canary logs)

---

## 🔑 Test Accounts & Authentication

Pre-configured in-memory accounts for testing authenticated access-control playbooks:

| Username / Email | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| `test_user` (`test_user@tinyfah.internal`) | `test_user_pass` | `user` | Baseline standard account |
| `test_admin` (`test_admin@tinyfah.internal`) | `test_admin_pass` | `admin` | Elevated administrative superuser |
| `victim_ceo` (`ceo@tinyfah.internal`) | `CeoP@ssw0rd2026!` | `executive` | Target account with sensitive proprietary records |

---

## 🛡️ Complete ASVS 17-Chapter Vulnerability Mapping & Playbooks

| ASVS Chapter | Vector & Endpoint | Mechanism & Deterministic Verification | Canary / Output Signature |
| :--- | :--- | :--- | :--- |
| **V1 (Encoding / Injection)** | Server SSR `/?q=` & `/search` | Raw unescaped reflection in server-rendered body | Canary reflected in HTML |
| **V1 (SSTI)** | `/?template={{7*7}}` | Server template engine simulation | Evaluates expression to `49` |
| **V1 / V16 (SQL Injection)** | `GET /api/users?id='` | Unsanitized query triggering raw SQLite traceback | `sqlite3.OperationalError: unrecognized token: "'"` |
| **V1 / V6 (SQLi Login Bypass)** | `POST /api/auth/login` | Login query interpolates username/password; comment tokens bypass the password predicate | `CANARY_SQLI_LOGIN_BYPASS_PROVEN`, `adminStatus: is_admin`, admin session cookie |
| **V1 (SQLi Dump Bypass)** | `GET /api/users?id=' OR 1=1--` | Classic boolean SQLi bypass dumping database | `CANARY_SQLI_BYPASS_PROVEN` |
| **V1 (Command Injection)** | `GET /api/tools/ping?host=127.0.0.1; whoami` | Shell command injection separator execution | `CANARY_COMMAND_INJECTION_PROVEN` |
| **V1 (XXE)** | `POST /api/xml/parse` | XML parser with external entity expansion | `CANARY_XXE_ENTITY_EXPANSION_VERIFIED` |
| **V2 (Validation)** | `POST /api/cart/checkout` | Parameter tampering (negative price/quantity) | `CANARY_BUSINESS_LOGIC_TAMPER_VERIFIED` |
| **V3 (Frontend DOM)** | Insecure CDN in `layout.js` | FontAwesome CDN without SRI hash; tabnabbing without `rel="noopener"` | Observable in HTML attributes |
| **V4 (API Services)** | `OPTIONS /api/users` & CORS | Wildcard origin reflection with `allow-credentials: true` | `Access-Control-Allow-Origin: *` |
| **V4 (GraphQL)** | `POST /api/graphql` | Introspection dump revealing queries and mutations | `CANARY_GRAPHQL_SCHEMA_DUMP_VERIFIED` |
| **V5 (File Upload)** | `POST /api/upload` | Unrestricted upload (.php, .sh, .exe) with canary response | `CANARY_FILE_UPLOADED_OK` |
| **V5 (Path Traversal)** | `GET /api/files?name=../../etc/passwd` | Directory traversal returning simulated `/etc/passwd` | `CANARY_PATH_TRAVERSAL_CONFIRMED` |
| **V6 (Auth Transport)** | `POST /api/auth/login` & `GET ?password=` | Credentials submitted over plaintext and query leakage | `CANARY_AUTH_LOGIN_SUCCESS` |
| **V7 (Sessions)** | `Set-Cookie` in login response | Session cookies planted without `HttpOnly`, `Secure`, `SameSite` | `session_id=sess_...; Path=/` |
| **V8 (Privilege Escalation)** | `GET /?role=admin` & `GET /admin?role=admin` | GET parameter privilege path returning admin markers without suppression words | `admin panel`, `dashboard`, `superuser`, `is_admin`, `sk_live_admin_bypass_9938` |
| **V8 (IDOR)** | `GET /api/users/:id` | Direct object reference exposing secret records and CEO data | `CANARY_IDOR_PROVEN_USER_3` |
| **V9 (Token Flaws)** | `POST /api/jwt/verify` | Accepts unsigned JWT with `alg: "none"` or weak secret | `CANARY_JWT_NONE_ALG_BYPASS_VERIFIED` |
| **V10 (Race Conditions)** | `POST /api/coupon/apply` | Single-use coupon (`PROMO2026_ONCE`) redeemable concurrently | `CANARY_COUPON_RACE_CONDITION_VERIFIED` |
| **V10 (Open Redirect)** | `GET /redirect?url=https://evil.com` | Unvalidated 302 HTTP redirection | `Location: https://evil.com`, `CANARY_OPEN_REDIRECT_CONFIRMED` |
| **V11 (Crypto)** | `POST /api/auth/reset-password` | Predictable token generated via timestamp and user ID | `CANARY_PASSWORD_RESET_TRIGGERED` |
| **V12 (Transport)** | Plaintext references & links | Cleartext HTTP links and sensitive token query strings | Leaked URL parameters |
| **V13 (Config Disclosure)** | HTTP Server Headers | Server banners disclosing `Apache/2.4.41` and `PHP/7.4.3` | `Server: Apache/2.4.41`, `X-Powered-By: PHP/7.4.3` |
| **V14 (Data Protection)** | HTML comments & Canaries | Production DB URIs & master admin credentials in comments | `CANARY_HARDCODED_HTML_COMMENT_TOKEN_PROVEN` |
| **V15 (Dependencies)** | Window library signatures & Deserialization | `jQuery 1.12.4`, `React 16.8.0`, `Lodash 4.17.11`, `POST /api/deserialize` | `CANARY_DESERIALIZATION_TRIGGERED` |
| **V16 (Error Handling)** | 500 Responses & Tracebacks | Raw stack trace disclosures on unexpected database inputs | `sqlite3.OperationalError` |
| **V17 (SSRF & WebRTC)** | `GET /api/proxy?url=http://169.254.169.254/...` | Server-Side Request Forgery proxy resolving metadata & loopback | `CANARY_SSRF_IMPACT_CONFIRMED` |

---

## 🔁 Exploit Chaining & Non-Destructive State Changes

1. **Exploit Chain (Register → Login → Escalate → Act)**:
   - Stage 1: `POST /api/auth/register` (mass assign role or create test operator)
   - Stage 2: `POST /api/auth/login` (obtain session cookie & JWT)
   - Stage 3: `GET /admin?role=admin` (verify admin panel takeover)
   - Stage 4: `PUT /api/user/profile` (update display name, returning `CANARY_PROFILE_UPDATED_OK`)

2. **Impact Proof without Destruction**:
   All state-changing endpoints are non-destructive and verify impact through canary events logged to `/debug`.
