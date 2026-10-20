import { NextResponse } from 'next/server';
import { getSession, getUserById, updateUserProfile, logCanary } from '@/lib/db';
import { verifyJwt } from '@/lib/jwt';

async function handleProfileUpdate(request) {
  try {
    let body = {};
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || '';
    const { searchParams } = new URL(request.url);

    let targetUserId = body.userId || body.user_id || searchParams.get('user_id');

    // Resolve user from session or JWT if not explicitly provided
    if (!targetUserId) {
      const match = cookieHeader.match(/session_id=([^;]+)/);
      if (match) {
        const session = getSession(match[1]);
        if (session) targetUserId = session.userId;
      }
    }

    if (!targetUserId && authHeader.startsWith('Bearer ')) {
      const v = verifyJwt(authHeader.substring(7));
      if (v.valid && v.payload.sub) targetUserId = v.payload.sub;
    }

    // Default to test_user (ID: 1) if no auth provided, allowing testing playbooks
    targetUserId = targetUserId || 1;

    const newDisplayName = body.displayName || body.name || searchParams.get('displayName') || 'Tinyfah Tester';
    const newBio = body.bio || searchParams.get('bio') || 'Deterministic canary profile update verification.';

    const updatedUser = updateUserProfile(targetUserId, {
      displayName: newDisplayName,
      bio: newBio,
    });

    if (!updatedUser) {
      return NextResponse.json({ status: 'error', error: 'User not found' }, { status: 404 });
    }

    logCanary('STATE_CHANGE_PROFILE_UPDATE', {
      userId: updatedUser.id,
      displayName: newDisplayName,
      canary: 'CANARY_PROFILE_UPDATED_OK',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Profile updated non-destructively. Impact verified with canary.',
      canary: 'CANARY_PROFILE_UPDATED_OK',
      impactProven: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
      },
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return handleProfileUpdate(request);
}

export async function POST(request) {
  return handleProfileUpdate(request);
}

export async function PATCH(request) {
  return handleProfileUpdate(request);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id') || 1;
  const user = getUserById(userId);
  return NextResponse.json({
    status: 'success',
    user,
    hint: 'Use PUT or POST to update profile display name with non-destructive canary verification',
  });
}
