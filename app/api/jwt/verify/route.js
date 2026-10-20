import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { logCanary } from '@/lib/db';

async function handleJwtVerification(token) {
  if (!token) {
    return NextResponse.json(
      {
        valid: false,
        error: 'No token provided in Authorization header or query parameter',
        hint: 'Test with unsigned JWT (alg: "none") or secret: "secret"',
      },
      { status: 400 }
    );
  }

  const result = verifyJwt(token, 'secret');

  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.error }, { status: 401 });
  }

  const payload = result.payload || {};
  const isAdmin = payload.admin === true || payload.role === 'admin';

  logCanary('JWT_VERIFICATION', {
    isNoneAlg: result.isNoneAlg,
    isWeakSecret: result.isWeakSecret,
    isAdmin,
  });

  return NextResponse.json({
    valid: true,
    message: result.isNoneAlg
      ? 'JWT verified successfully using insecure alg:none bypass'
      : 'JWT verified successfully using weak HMAC secret ("secret")',
    isNoneAlg: !!result.isNoneAlg,
    isWeakSecret: !!result.isWeakSecret,
    canary: result.canary,
    isAdmin,
    adminStatus: isAdmin ? 'superuser' : 'standard',
    privilegeElevated: isAdmin,
    payload,
  });
}

export async function POST(request) {
  try {
    let token = '';
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const body = await request.json();
        token = body.token || '';
      } else {
        const formData = await request.formData();
        token = formData.get('token') || '';
      }
    }
    return handleJwtVerification(token);
  } catch (err) {
    return NextResponse.json({ valid: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const authHeader = request.headers.get('authorization') || '';
  const finalToken = token || (authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);
  return handleJwtVerification(finalToken);
}
