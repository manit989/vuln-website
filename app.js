/**
 * Tinyfah OWASP ASVS Interactive Vulnerability Testbed Script
 * Simulates real-world application security flaws across all 17 ASVS chapters.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("⚡ Tinyfah Vulnerability Testbed Initialized");

  // 1. Expose Outdated Third-Party Library Signatures (ASVS V3.1.1, V15.2.1)
  window.jQuery = { fn: { jquery: "1.12.4" } };
  window.$ = window.jQuery;
  window.React = { version: "16.8.0" };
  window.Vue = { version: "2.5.17" };
  window._ = { VERSION: "4.17.11" };

  // 2. Plant Insecure Session Cookies (ASVS V7.1.1, V14.1.1)
  // Missing Secure flag, HttpOnly (client-accessible), and SameSite=None
  try {
    document.cookie = "session_id=sess_9938472918471928; path=/; Max-Age=86400";
    document.cookie = "user_auth=john_doe_authenticated; path=/; Max-Age=86400";
    document.cookie = "remember_token=raw_hash_771928374; path=/; Max-Age=86400";
  } catch (e) {
    console.warn("Cookie planting failed:", e);
  }

  // 3. Store Plaintext Authentication Tokens in Web Storage (ASVS V7.2.2, V9.1.2)
  try {
    const dummyJwt = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiQWRtaW4gVXNlciIsImFkbWluIjp0cnVlLCJpYXQiOjE2NzAwMDAwMDB9.";
    localStorage.setItem("auth_token", dummyJwt);
    localStorage.setItem("api_secret_key", "sec_live_9948291038472910");
    sessionStorage.setItem("user_session_token", "sess_jwt_token_unencrypted_991823");
  } catch (e) {
    console.warn("WebStorage planting failed:", e);
  }

  // 4. Chapter V1: URL Query Reflection & SSTI Evaluation (ASVS V1.2.1, V1.3.7)
  const urlParams = new URLSearchParams(window.location.search);
  const rawQ = urlParams.get("q") || urlParams.get("search") || urlParams.get("name") || "";
  const rawTemplate = urlParams.get("template") || "";

  const reflectionSink = document.getElementById("reflection-output");
  const templateSink = document.getElementById("template-output");

  if (reflectionSink) {
    if (rawQ) {
      // Intentionally vulnerable: raw innerHTML unescaped reflection
      reflectionSink.innerHTML = `<strong>Reflection Result:</strong> ${rawQ}`;
      reflectionSink.classList.add("vulnerable-active");
    } else {
      reflectionSink.innerHTML = `<span style="color: #64748b;">(No query parameter detected. Pass <code>?q=&lt;tinyfah-canary-test&gt;</code> to test reflection).</span>`;
    }
  }

  if (templateSink) {
    if (rawTemplate) {
      // Intentionally simulate template evaluation for expressions like {{7*7}}
      let evaluatedOutput = rawTemplate;
      if (rawTemplate.includes("{{7*7}}")) {
        evaluatedOutput = rawTemplate.replace("{{7*7}}", "49");
      }
      templateSink.innerHTML = `<strong>Template Engine Output:</strong> ${evaluatedOutput}`;
    } else {
      templateSink.innerHTML = `<span style="color: #64748b;">(Pass <code>?template={{7*7}}</code> to test template injection).</span>`;
    }
  }

  // 5. Chapter V10 & V3: Dangerous Wildcard postMessage Listener (ASVS V3.5.1, V10.3.1)
  window.addEventListener("message", (event) => {
    // VULNERABLE: Lacks event.origin check!
    console.warn("⚠️ [INSECURE] Received postMessage from any origin without validation:", event.origin, event.data);
    try {
      if (typeof event.data === "string" && event.data.startsWith("exec:")) {
        // Highly dangerous eval sink
        eval(event.data.substring(5));
      }
    } catch (err) {}
  });

  // 6. Chapter V16: Simulate Verbose Console Stack Trace (ASVS V16.1.1, V16.2.1)
  setTimeout(() => {
    console.error(
      "Traceback (most recent call last):\n" +
      "  File \"/srv/app/controllers/user_controller.py\", line 104, in get_account\n" +
      "    cursor.execute(\"SELECT * FROM users WHERE id = %s\" % user_id)\n" +
      "sqlite3.OperationalError: no such table: users -- exposed debug stack trace"
    );
  }, 1000);

  // 7. Chapter V17: Unconstrained WebRTC Local IP Leakage (ASVS V17.1.1)
  try {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.createDataChannel("tinyfah_leak_probe");
    pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(() => {});
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("📡 [WebRTC Candidate Generated]:", e.candidate.candidate);
      }
    };
  } catch (err) {
    // Browser may restrict WebRTC
  }

  // 8. Interactive Form Handlers for File Upload & Login
  const uploadForm = document.getElementById("file-upload-form");
  const uploadStatus = document.getElementById("upload-status");
  if (uploadForm && uploadStatus) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fileInput = document.getElementById("file-input");
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        uploadStatus.innerHTML = `⚠️ <strong style="color: #fb7185;">Uploaded:</strong> ${file.name} (${file.size} bytes, type: ${file.type || 'unknown'}). <em>No file extension filtering or magic byte inspection was applied!</em>`;
      } else {
        uploadStatus.innerHTML = `<span style="color: #fb7185;">Please choose a file to test unconstrained upload.</span>`;
      }
    });
  }

  // 9. Interactive Authorization / IDOR Switcher (ASVS V8.1.1)
  const roleDisplay = document.getElementById("role-display");
  const currentRole = urlParams.get("role") || "guest";
  if (roleDisplay) {
    if (currentRole.toLowerCase() === "admin") {
      roleDisplay.innerHTML = `<span style="color: #10b981; font-weight: bold;">🔓 ADMIN ACCESS GRANTED</span> via client-controlled URL parameter: <code>?role=admin</code>! Secret API Key: <code>sk_live_admin_bypass_9938</code>.`;
    } else {
      roleDisplay.innerHTML = `Current role: <code>${currentRole}</code>. <a href="?role=admin" class="test-link" style="margin-left: 0.5rem;">[Switch to Admin Role via IDOR parameter]</a>`;
    }
  }
});
