import { NextResponse } from 'next/server';
import { logCanary } from '@/lib/db';

export async function POST(request) {
  try {
    const rawXml = await request.text();

    if (!rawXml) {
      return NextResponse.json({ status: 'error', error: 'Empty XML body' }, { status: 400 });
    }

    logCanary('XXE_PROBE_RECEIVED', { length: rawXml.length });

    // ASVS V1.3.4: XML External Entity (XXE) parsing flaw
    if (rawXml.includes('<!ENTITY') || rawXml.includes('SYSTEM')) {
      const entityMatch = rawXml.match(/SYSTEM\s+["']([^"']+)["']/i);
      const targetEntity = entityMatch ? entityMatch[1] : 'file:///etc/passwd';

      return NextResponse.json({
        status: 'success',
        message: 'XML parsed with external entity resolution enabled',
        canary: 'CANARY_XXE_ENTITY_EXPANSION_VERIFIED',
        resolvedEntity: targetEntity,
        simulatedOutput: `CANARY_XXE_SECRET_DATA: root:$6$rounds=5000$salt$kZ9...:19240:0:99999:7::: (expanded from ${targetEntity})`,
      });
    }

    // Normal mock XML parsing
    return NextResponse.json({
      status: 'success',
      message: 'XML parsed successfully',
      nodeCount: (rawXml.match(/<[^/][^>]*>/g) || []).length,
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Send POST with XML payload to test XXE parsing capabilities',
  });
}
