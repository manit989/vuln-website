import { NextResponse } from 'next/server';
import { logCanary } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { items = [], price, quantity = 1, couponCode } = body;

    logCanary('CHECKOUT_PROCESSED', { body });

    // ASVS V10.3.1: Parameter tampering / negative pricing business logic flaw
    const numPrice = Number(price);
    const numQty = Number(quantity);

    if (numPrice < 0 || numQty < 0) {
      return NextResponse.json({
        status: 'success',
        orderId: `ORD_${Date.now()}`,
        totalCharged: numPrice * numQty,
        message: 'Order processed with negative price parameter tampering!',
        canary: 'CANARY_BUSINESS_LOGIC_TAMPER_VERIFIED',
        businessLogicFlawProven: true,
      });
    }

    const calculatedTotal = (price !== undefined ? numPrice : 150.0) * numQty;

    return NextResponse.json({
      status: 'success',
      orderId: `ORD_${Date.now()}`,
      totalCharged: calculatedTotal,
      message: 'Standard checkout completed',
      itemsCount: items.length || 1,
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    endpoint: 'POST /api/cart/checkout',
    parameters: { price: 'number', quantity: 'number', items: 'array' },
    hint: 'Test negative price or quantity tampering for ASVS V10 business logic testing',
  });
}
