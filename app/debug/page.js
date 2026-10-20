import { getCanaryLogs, getUsers } from '@/lib/db';

export default async function DebugPage() {
  const canaryLogs = getCanaryLogs();
  const users = getUsers();

  return (
    <div>
      <header className="hero" style={{ marginBottom: '2rem' }}>
        <div className="badge-pill" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <span className="badge-dot" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></span>
          Internal Diagnostics &bull; ASVS V13 / V16 Debug Surface
        </div>
        <h1>
          Server <span>Debug &amp; Telemetry</span>
        </h1>
        <p>
          Internal diagnostics endpoint disclosing runtime configuration, environment parameters, and active canary logs.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {/* Environment Disclosure Card */}
        <section className="card" style={{ '--card-accent': '#f59e0b' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#fbbf24' }}><i className="fa-solid fa-code-branch"></i></div>
              <h2 className="card-title">Runtime Environment Variables</h2>
            </div>
            <span className="asvs-tag">V13.2.1</span>
          </div>

          <div className="terminal-box" style={{ marginTop: 0 }}>
            <div>NODE_ENV: <span style={{ color: '#38bdf8' }}>development</span></div>
            <div>DEBUG_MODE: <span style={{ color: '#fb7185' }}>true</span></div>
            <div>DATABASE_URL: <span className="vulnerable-output">postgres://dbadmin:SuperSecretK3y@10.0.1.45:5432/core_prod</span></div>
            <div>INTERNAL_SUBNET: <span style={{ color: '#fff' }}>10.0.1.0/24</span></div>
            <div>JWT_ALGORITHM_FALLBACK: <span style={{ color: '#fca5a5' }}>none (Enabled for legacy clients)</span></div>
            <div>CANARY_TRACKER: <span style={{ color: '#34d399' }}>CANARY_DEBUG_ENDPOINT_DISCLOSURE_PROVEN</span></div>
          </div>
        </section>

        {/* Live Canary Logs Card */}
        <section className="card" style={{ '--card-accent': '#10b981' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#34d399' }}><i className="fa-solid fa-clock-rotate-left"></i></div>
              <h2 className="card-title">Live Canary Audit Log ({canaryLogs.length})</h2>
            </div>
            <span className="canary-pill">Impact Tracker</span>
          </div>

          <div className="terminal-box" style={{ marginTop: 0, maxHeight: '280px', overflowY: 'auto' }}>
            {canaryLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>
                No canary events triggered yet. Interact with /api/auth/login, /api/user/profile, or /api/upload to record events.
              </div>
            ) : (
              canaryLogs.slice(-10).reverse().map((log, idx) => (
                <div key={idx} style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
                  <div style={{ color: '#38bdf8', fontSize: '0.75rem' }}>[{log.timestamp}] {log.type}</div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>{JSON.stringify(log.details)}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
