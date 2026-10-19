# 🎯 Tinyfah OWASP ASVS 5.0.0 Interactive Vulnerability Testbed

An interactive, multi-vector target web application engineered with deliberate, realistic security vulnerabilities across all **17 OWASP ASVS chapters (345 requirements)**. Designed for benchmarking automated AI security agents, deterministic test harnesses, and penetration testing tools.

---

## 🚀 Quick Deployment to Vercel

### Option 1: Vercel CLI (Instant)
Inside this directory:
```bash
npx vercel
```
Follow the interactive prompts (Accept defaults). Vercel will deploy this static site in under 30 seconds and provide a public HTTPS URL (e.g., `https://tinyfah-testbed.vercel.app`).

### Option 2: Vercel Web Dashboard
1. Push this directory or repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and select the repository.
3. Set the **Root Directory** to `vulnerable-testbed`.
4. Click **Deploy**.

---

## 💻 Local Testing

You can run this testbed locally with any static web server:

```bash
# Using Python
python3 -m http.server 3000 --directory .

# Or using Node
npx serve .
```

Open `http://127.0.0.1:3000` in your browser.

---

## 🛡️ ASVS Chapter Vulnerability Mapping

| ASVS Chapter | Vulnerability Vector Implemented | Observable Mechanism |
| :--- | :--- | :--- |
| **V1 (Encoding)** | Reflected XSS & SSTI | Unescaped `?q=` DOM reflection and `?template={{7*7}}` evaluation to `49`. Dangerous `javascript:` links. |
| **V2 (Validation)** | Missing input constraints | Client-side only bypassable input fields without length or regex validation. |
| **V3 (Frontend)** | Missing SRI & Tabnabbing | External FontAwesome CDN link without `integrity` hash; `target="_blank"` missing `rel="noopener"`. |
| **V4 (API)** | Wildcard CORS & Specs | `Access-Control-Allow-Origin: *` with credentials; public `/openapi.json` and `/swagger.json`. |
| **V5 (Files)** | Unchecked File Upload | Interactive upload form accepting `.php`, `.exe`, `.sh` without extension or magic-byte checks. |
| **V6 (Auth)** | Insecure Login Transport | Form posting to `http://insecure-auth-gateway.internal/api/login`; credentials leaked in URL query parameters. |
| **V7 (Sessions)** | Insecure Cookie Flags | Active session cookies planted without `Secure`, `HttpOnly`, or `SameSite` flags. |
| **V8 (Authorization)** | Client-side IDOR | Privilege escalation via URL parameter: `?role=admin`. |
| **V9 (Tokens)** | Exposed JWT | Plaintext token with `alg: "none"` stored in `localStorage` and query string. |
| **V10 (OAuth)** | Insecure OAuth Flow | OAuth 2.0 authorization link omitting `state` CSRF token and PKCE code verifier. |
| **V11 (Crypto)** | Weak Entropy | Token generation using pseudo-random `Math.random()`. |
| **V12 (Transport)** | Insecure HTTP references | Plaintext form action endpoints and mixed content indicators. |
| **V13 (Config)** | Server Version Leakage | Server headers disclosing `Apache/2.4.41 (Ubuntu)` and `PHP/7.4.3`; missing `nosniff`. |
| **V14 (Data Protection)**| Exposed Comments | Hardcoded admin credentials and internal database URIs in HTML comments. |
| **V15 (Coding/Architecture)**| Outdated Libraries | Exposed global window signatures for outdated `jQuery 1.12.4`, `React 16.8`, `Lodash 4.17.11`. |
| **V16 (Error Handling)**| Verbose Stack Traces | Active console error and page element exposing raw Python/SQLite operational error tracebacks. |
| **V17 (WebRTC)** | Local IP Discovery | Unconstrained `RTCPeerConnection` probing STUN candidate generation without user interaction. |

---

## 🤖 Testing with Tinyfah LangGraph Agent

Once deployed to Vercel (or running locally), test the agent against your deployment:

```bash
# Standalone CLI scan
cd backend
uv run python verify_langgraph.py https://your-testbed.vercel.app

# Or trigger via API
curl -X POST http://127.0.0.1:8000/api/scans \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-testbed.vercel.app", "suite": "all_standards"}'
```
