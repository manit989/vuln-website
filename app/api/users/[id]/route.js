import { NextResponse } from 'next/server';
import { getUserById, logCanary } from '@/lib/db';

export async function GET(request, context) {
  const params = await context.params;
  const id = params.id;
  const user = getUserById(id);

  if (!user) {
    return NextResponse.json({ status: 'error', error: 'User not found' }, { status: 404 });
  }

  logCanary('IDOR_ACCESS_VERIFIED', {
    requestedId: id,
    targetUsername: user.username,
    targetRole: user.role,
  });

  // ASVS V8.1.1 IDOR Vulnerability: Direct object exposure without permission check
  return NextResponse.json({
    status: 'success',
    idorProven: true,
    canary: `CANARY_IDOR_PROVEN_USER_${user.id}`,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      bio: user.bio,
      balance: user.balance,
      secretData: user.secretData,
      canaryToken: user.canaryToken,
    },
  });
}
