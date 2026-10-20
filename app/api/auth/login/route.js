import { NextResponse } from 'next/server';
import { getUserByUsername, createSession, logCanary } from '@/lib/db';
import { createJwt } from '@/lib/jwt';

export async function POST(request) {
  try {
    let username = '';
    let password = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      username = body.username || body.email || '';
      password = body.password || '';
    } else {
      const formData = await request.formData();
      username = formData.get('username') || formData.get('email') || '';
      password = formData.get('password') || '';
    }

    const user = getUserByUsername(username);

    if (!user || user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials provided',
          hint: 'Try test_user / test_user_pass or test_admin / test_admin_pass',
        },
        { status: 401 }
      );
    }

    // Create session in state store
    const sessionId = createSession(user.id, user.role, user.username);
    const token = createJwt({
      sub: user.id,
      username: user.username,
      role: user.role,
      admin: user.role === 'admin',
      iat: Math.floor(Date.now() / 1000),
    });

    logCanary('AUTH_LOGIN_SUCCESS', {
      userId: user.id,
      username: user.username,
      role: user.role,
      sessionId,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
      token,
      sessionId,
      role: user.role,
      canary: 'CANARY_AUTH_LOGIN_SUCCESS',
      adminStatus: user.role === 'admin' ? 'is_admin' : 'standard_user',
    });

    // Insecure Cookie Flags (ASVS V7.1.1): Lacks HttpOnly, Secure, SameSite
    response.headers.set(
      'Set-Cookie',
      `session_id=${sessionId}; Path=/; Max-Age=86400`
    );

    return response;
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Insecure GET Login for credential transport leakage (ASVS V6.3.1 / V12.2.1)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || searchParams.get('email') || '';
  const password = searchParams.get('password') || '';

  if (!username) {
    return NextResponse.json({
      endpoints: ['POST /api/auth/login', 'GET /api/auth/login?username=...&password=...'],
      testAccounts: [
        { username: 'test_user', password: 'test_user_pass', role: 'user' },
        { username: 'test_admin', password: 'test_admin_pass', role: 'admin' },
      ],
    });
  }

  const user = getUserByUsername(username);
  if (!user || user.password !== password) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const sessionId = createSession(user.id, user.role, user.username);
  const token = createJwt({
    sub: user.id,
    username: user.username,
    role: user.role,
    admin: user.role === 'admin',
  });

  const response = NextResponse.json({
    success: true,
    message: 'Authentication successful via GET query string (Insecure Transport Leak)',
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      displayName: user.displayName,
    },
    token,
    sessionId,
    canary: 'CANARY_AUTH_LOGIN_GET_SUCCESS',
  });

  response.headers.set('Set-Cookie', `session_id=${sessionId}; Path=/; Max-Age=86400`);
  return response;
}
