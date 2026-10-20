import { NextResponse } from 'next/server';
import { getUserByUsername, logCanary } from '@/lib/db';

export async function POST(request) {
  try {
    let email = '';
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email || body.username || '';
    } else {
      const formData = await request.formData();
      email = formData.get('email') || formData.get('username') || '';
    }

    const user = getUserByUsername(email);

    // Predictable token based on weak entropy (Math.random() & timestamp) (ASVS V11.1.1)
    const resetToken = `reset_${user ? user.id : 'unknown'}_${Date.now()}`;

    logCanary('PASSWORD_RESET_TRIGGERED', { email, resetToken });

    return NextResponse.json({
      status: 'success',
      message: 'Password reset link generated',
      canary: 'CANARY_PASSWORD_RESET_TRIGGERED',
      resetToken,
      resetUrl: `http://localhost:3000/api/auth/reset-password?token=${resetToken}&user_id=${user ? user.id : 1}`,
      vulnerabilityNote: 'Token generated using timestamp and sequential user ID without cryptographic salt',
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const userId = searchParams.get('user_id');

  if (!token) {
    return NextResponse.json({
      message: 'Password reset endpoint. Send POST with email or GET with ?token=...&new_password=...',
    });
  }

  return NextResponse.json({
    status: 'success',
    canary: 'CANARY_PASSWORD_RESET_VERIFIED',
    message: `Password reset flow confirmed for user ID ${userId || 1}`,
  });
}
