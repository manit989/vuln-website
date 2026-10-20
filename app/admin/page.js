import { cookies } from 'next/headers';
import { getSession } from '@/lib/db';

export default async function AdminPage({ searchParams }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  let sessionUser = null;
  if (sessionId) {
    sessionUser = getSession(sessionId);
  }

  // Privilege path check: either ?role=admin or authenticated admin session
  const isPrivileged =
    (params.role || '').toLowerCase() === 'admin' ||
    sessionUser?.role === 'admin';

  if (isPrivileged) {
    // CRITICAL: MUST contain 'admin panel', 'dashboard', 'superuser', 'is_admin'
    // CRITICAL: MUST NOT contain words: 'login', 'password', 'unauthorized', 'forbidden', 'access denied'
    return (
      <div>
        <div className="admin-banner" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))' }}>
          <div className="admin-banner-title">
            <i className="fa-solid fa-crown"></i>
            ADMIN PRIVILEGE ACCESS GRANTED
          </div>
          <p style={{ color: '#d1fae5', fontSize: '1.05rem', margin: '0.5rem 0' }}>
            Elevated administrative control active. System operator recognized as <strong>superuser</strong>.
            Verified status marker: <strong>is_admin</strong> (true).
          </p>
        </div>

        <section className="card" style={{ '--card-accent': '#10b981', marginBottom: '2rem' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#34d399' }}><i className="fa-solid fa-sliders"></i></div>
              <h2 className="card-title">Superuser Administrative Console &amp; Admin Panel</h2>
            </div>
            <span className="canary-pill">Privilege Verified</span>
          </div>

          <p className="card-desc">
            Primary administrative control interface for core infrastructure management and secret orchestration.
          </p>

          <div className="terminal-box" style={{ borderColor: 'rgba(16, 185, 129, 0.4)', background: '#021810' }}>
            <div className="terminal-header" style={{ color: '#34d399' }}>
              <span>ACTIVE ADMIN PANEL SESSION ATTRIBUTES</span>
            </div>
            <div>Access State: <span style={{ color: '#34d399', fontWeight: 'bold' }}>SUPERUSER ELEVATED</span></div>
            <div>Context: <strong>admin panel</strong> unlocked</div>
            <div>Telemetry: <strong>dashboard</strong> feed initialized</div>
            <div>Role Flag: <strong>is_admin</strong></div>
            <div>Master Bypass API Key: <span style={{ color: '#6ee7b7' }}>sk_live_admin_bypass_9938</span></div>
            <div>Canary Token: <span style={{ color: '#a7f3d0' }}>CANARY_ADMIN_TAKEOVER_PROVEN</span></div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DATABASE STATUS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#34d399' }}>Online &bull; 3 Records</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ELEVATION VECTOR</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>GET Query Parameter</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>IMPACT VERIFICATION</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ec4899' }}>Canary Confirmed</div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Unprivileged view without admin parameter
  return (
    <div>
      <section className="card" style={{ '--card-accent': '#6366f1', maxWidth: '720px', margin: '2rem auto' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ color: '#818cf8' }}><i className="fa-solid fa-lock"></i></div>
            <h2 className="card-title">Restricted Management Portal</h2>
          </div>
          <span className="asvs-tag">ASVS V8.1.1</span>
        </div>

        <p className="card-desc">
          This endpoint requires elevated role context. The authorization verification can be satisfied via parameter hint:
        </p>

        <div style={{ margin: '1.5rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="/admin?role=admin" className="btn btn-primary" id="btn-switch-admin">
            Switch to Admin
          </a>
          <a href="/?role=admin" className="test-link">
            [Elevate on Home Index]
          </a>
        </div>

        <div className="terminal-box">
          <div className="terminal-header">
            <span>PARAMETER ELEVATION HINT</span>
          </div>
          <div>Target parameter: <code>?role=admin</code></div>
          <div>Expected markers: <code>admin panel</code>, <code>dashboard</code>, <code>superuser</code>, <code>is_admin</code></div>
        </div>
      </section>
    </div>
  );
}
