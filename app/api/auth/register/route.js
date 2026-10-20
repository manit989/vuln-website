import { NextResponse } from 'next/server';
import { createUser, createSession, logCanary } from '@/lib/db';
import { createJwt } from '@/lib/jwt';

export async function POST(request) {
  try {
    let body = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    }

    const { username, email, password, role = 'user', displayName } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'username and password are required' },
        { status: 400 }
      );
    }

    // Notice: mass assignment vulnerability allowing role override (ASVS V2.2.1 / V8.1.1)
    const newUser = createUser({
      username,
      email,
      password,
      role: role || 'user',
      displayName: displayName || username,
    });

    const sessionId = createSession(newUser.id, newUser.role, newUser.username);
    const token = createJwt({
      sub: newUser.id,
      username: newUser.username,
      role: newUser.role,
      admin: newUser.role === 'admin',
    });

    logCanary('AUTH_REGISTER_SUCCESS', {
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'User registered successfully. Exploit chaining stage 1 complete.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.displayName,
      },
      token,
      sessionId,
      canary: 'CANARY_CHAIN_REGISTER_SUCCESS',
      chainStage: 'register -> login -> escalate -> act',
    });

    response.headers.set('Set-Cookie', `session_id=${sessionId}; Path=/; Max-Age=86400`);
    return response;
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
