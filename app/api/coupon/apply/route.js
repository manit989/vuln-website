import { NextResponse } from 'next/server';
import { getCoupons, logCanary } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { code = '' } = body;
    const coupons = getCoupons();

    if (!code) {
      return NextResponse.json({ status: 'error', error: 'Coupon code required' }, { status: 400 });
    }

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      return NextResponse.json({ status: 'error', error: 'Invalid coupon code' }, { status: 404 });
    }

    // ASVS V10.2.1: Race condition / multiple redemption flaw (missing atomic lock)
    coupon.timesUsed = (coupon.timesUsed || 0) + 1;

    logCanary('COUPON_APPLIED', { code, timesUsed: coupon.timesUsed });

    const isExceeded = coupon.timesUsed > coupon.maxUses;

    return NextResponse.json({
      status: 'success',
      code: code.toUpperCase(),
      discount: coupon.discount,
      timesUsed: coupon.timesUsed,
      message: isExceeded
        ? 'Race condition exploited: Single-use coupon redeemed multiple times!'
        : 'Coupon applied successfully',
      canary: isExceeded
        ? 'CANARY_COUPON_RACE_CONDITION_VERIFIED'
        : 'CANARY_COUPON_FIRST_USE_APPLIED',
      raceConditionProven: isExceeded,
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    couponsAvailable: [{ code: 'PROMO2026_ONCE', discount: 50, singleUseOnly: true }],
    hint: 'Send multiple concurrent POST requests with {"code": "PROMO2026_ONCE"} to exploit race condition',
  });
}
