import { NextResponse } from 'next/server';
import { getSession, getUserById, getUsers } from '@/lib/db';
import { verifyJwt } from '@/lib/jwt';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cookieHeader = request.headers.get('cookie') || '';
  const authHeader = request.headers.get('authorization') || '';
  const queryRole = searchParams.get('role');
  const queryToken = searchParams.get('token');

  let currentUser = null;
  let authMethod = 'unauthenticated';

  // 1. Check session cookie
  const match = cookieHeader.match(/session_id=([^;]+)/);
  if (match) {
    const session = getSession(match[1]);
    if (session) {
      currentUser = getUserById(session.userId);
      authMethod = 'cookie_session';
    }
  }

  // 2. Check Authorization Bearer or query token
  const token = queryToken || (authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);
  if (!currentUser && token) {
    const verification = verifyJwt(token);
    if (verification.valid) {
      const payload = verification.payload;
      currentUser = getUserById(payload.sub) || {
        id: payload.sub || 999,
        username: payload.username || 'jwt_user',
        role: payload.role || (payload.admin ? 'admin' : 'user'),
        displayName: payload.name || payload.username || 'JWT Authenticated User',
      };
      authMethod = verification.isNoneAlg ? 'jwt_none_alg' : 'jwt_token';
    }
  }

  // 3. Check client-side parameter elevation: ?role=admin (ASVS V8 IDOR)
  if (queryRole) {
    if (!currentUser) {
      currentUser = {
        id: queryRole === 'admin' ? 2 : 1,
        username: queryRole === 'admin' ? 'param_admin' : 'param_user',
        role: queryRole,
        displayName: queryRole === 'admin' ? 'Elevated URL Admin' : 'Standard User',
      };
    } else {
      currentUser = { ...currentUser, role: queryRole };
    }
    authMethod = 'query_parameter_override';
  }

  if (!currentUser) {
    return NextResponse.json(
      {
        authenticated: false,
        message: 'Unauthenticated guest context',
        hint: 'Provide session_id cookie, Bearer JWT, or ?role=admin',
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    authMethod,
    user: currentUser,
    isAdmin: currentUser.role === 'admin',
    adminMarker: currentUser.role === 'admin' ? 'superuser_confirmed' : 'user',
    canary:
      currentUser.role === 'admin'
        ? 'CANARY_AUTH_ME_ADMIN_PROVEN'
        : 'CANARY_AUTH_ME_USER_PROVEN',
  });
}
