import { NextResponse } from 'next/server';
import { logCanary } from '@/lib/db';

export async function POST(request) {
  try {
    let payload = '';
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      payload = body.data || body.payload || '';
    } else {
      payload = await request.text();
    }

    logCanary('DESERIALIZE_REQUEST', { length: payload.length });

    // ASVS V1.3.6 / V15.3.1: Insecure Deserialization
    const decoded = Buffer.from(payload, 'base64').toString('utf8');

    if (
      decoded.includes('_$$ND_FUNC$$_') ||
      decoded.includes('cos\nsystem') ||
      decoded.includes('pickle') ||
      payload.includes('cos\nsystem')
    ) {
      return NextResponse.json({
        status: 'success',
        message: 'Deserialization payload processed and simulated execution triggered',
        canary: 'CANARY_DESERIALIZATION_TRIGGERED',
        deserializationProven: true,
        executionProof: 'uid=0(root) gid=0(root) (simulated shell output)',
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Payload received',
      rawLength: payload.length,
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Send POST with base64 serialized payload to test deserialization verifiers',
  });
}
