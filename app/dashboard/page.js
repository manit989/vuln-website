import { cookies } from 'next/headers';
import { getSession, getUserById, getUsers } from '@/lib/db';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  let currentUser = getUserById(1); // Default to test_user
  if (sessionId) {
    const session = getSession(sessionId);
    if (session) {
      currentUser = getUserById(session.userId) || currentUser;
    }
  }

  return (
    <div>
      <header className="hero" style={{ marginBottom: '2rem' }}>
        <div className="badge-pill" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
          <span className="badge-dot" style={{ backgroundColor: '#818cf8', boxShadow: '0 0 10px #818cf8' }}></span>
          Authenticated User Console &bull; State-Change Playbooks
        </div>
        <h1>
          Target <span>Dashboard</span>
        </h1>
        <p>
          Execute non-destructive state-changing operations with deterministic canary tokens to prove exploitation impact.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {/* Profile Card */}
        <section className="card" style={{ '--card-accent': '#6366f1' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#818cf8' }}><i className="fa-solid fa-user-circle"></i></div>
              <h2 className="card-title">User Profile Context</h2>
            </div>
            <span className="canary-pill">ID: {currentUser.id}</span>
          </div>

          <div className="terminal-box" style={{ marginTop: 0 }}>
            <div>Username: <span style={{ color: '#38bdf8' }}>{currentUser.username}</span></div>
            <div>Email: <span style={{ color: '#94a3b8' }}>{currentUser.email}</span></div>
            <div>Role: <span style={{ color: currentUser.role === 'admin' ? '#34d399' : '#f59e0b', fontWeight: 'bold' }}>{currentUser.role}</span></div>
            <div>Display Name: <span style={{ color: '#fff' }}>{currentUser.displayName}</span></div>
            <div>Canary Token: <span style={{ color: '#ec4899' }}>{currentUser.canaryToken}</span></div>
          </div>

          {/* Non-destructive State-Change Form: Update Display Name */}
          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>
              Non-Destructive State Change: Update Display Name
            </h3>
            <form action="/api/user/profile" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <input type="hidden" name="userId" value={currentUser.id} />
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="display-name-input">New Display Name</label>
                <input
                  type="text"
                  id="display-name-input"
                  name="displayName"
                  className="input-field"
                  placeholder="e.g. Tinyfah Exploited Canary Name"
                  defaultValue={`${currentUser.displayName} (Verified)`}
                />
              </div>
              <button type="submit" className="btn btn-primary" id="btn-update-profile">
                <i className="fa-solid fa-check-circle"></i> Update Display Name (Returns Canary)
              </button>
            </form>
          </div>
        </section>

        {/* State-Change Upload Card */}
        <section className="card" style={{ '--card-accent': '#ec4899' }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ color: '#f472b6' }}><i className="fa-solid fa-upload"></i></div>
              <h2 className="card-title">Non-Destructive Upload Playbook</h2>
            </div>
            <span className="asvs-tag">P1 Playbook</span>
          </div>

          <p className="card-desc">
            Submit files (.php, .sh, .txt) with canary strings to confirm file handling without causing damage.
          </p>

          <form action="/api/upload" method="POST" encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="file" name="file" className="input-field" style={{ padding: '0.45rem' }} />
            <button type="submit" className="btn btn-primary" id="btn-dashboard-upload">
              <i className="fa-solid fa-cloud-arrow-up"></i> Upload Test File
            </button>
          </form>

          <div className="terminal-box">
            <div className="terminal-header">
              <span>CANARY CONFIRMATION SPEC</span>
            </div>
            <div>Expected Canary: <span style={{ color: '#34d399' }}>CANARY_FILE_UPLOADED_OK</span></div>
            <div>Expected Field: <code>impactProven: true</code></div>
          </div>
        </section>
      </div>
    </div>
  );
}
