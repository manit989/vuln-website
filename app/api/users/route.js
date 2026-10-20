import { NextResponse } from 'next/server';
import { getUsers, logCanary } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get('id') || searchParams.get('user_id') || '';
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const query = idParam || searchParam;

  // Error-signature SQL Injection Verifier trigger (ASVS V1.3.1 / V16.1.1)
  if (query.includes("'") || query.includes('"') || query.includes(';') || query.includes('--')) {
    logCanary('SQLI_PROBE_DETECTED', { query });

    // If classic bypass payload, return dumped sensitive records + canary
    if (
      query.toLowerCase().includes('or 1=1') ||
      query.toLowerCase().includes("or '1'='1") ||
      query.toLowerCase().includes('union select')
    ) {
      return NextResponse.json({
        status: 'success',
        simulatedQuery: `SELECT id, username, email, password, role, secretData FROM users WHERE id = '${query}'`,
        canary: 'CANARY_SQLI_BYPASS_PROVEN',
        impactProven: true,
        users: getUsers(),
      });
    }

    // Return realistic raw SQLite / Python OperationalError traceback for error-signature detection
    const errorTraceback = `Traceback (most recent call last):
  File "/srv/app/controllers/user_controller.py", line 104, in get_account
    cursor.execute("SELECT * FROM users WHERE id = '%s'" % user_id)
sqlite3.OperationalError: unrecognized token: "${query.replace(/"/g, '')}" -- syntax error at or near quote`;

    return new NextResponse(errorTraceback, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Database-Error': 'sqlite3.OperationalError',
      },
    });
  }

  // Normal query filtering
  let results = getUsers();
  if (query) {
    results = results.filter(
      (u) =>
        u.id.toString() === query ||
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  return NextResponse.json({
    status: 'success',
    count: results.length,
    users: results,
  });
}
