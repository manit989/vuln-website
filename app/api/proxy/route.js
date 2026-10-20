import { NextResponse } from 'next/server';
import { logCanary } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url') || searchParams.get('target') || '';

  if (!targetUrl) {
    return NextResponse.json({
      status: 'ready',
      message: 'HTTP Proxy / Webhook Verification Service (ASVS V17.2.1 / V4.2.1)',
      hint: 'Test internal SSRF with ?url=http://169.254.169.254/latest/meta-data or ?url=http://127.0.0.1:8000/internal',
    });
  }

  logCanary('SSRF_REQUEST_RECEIVED', { targetUrl });

  const lower = targetUrl.toLowerCase();

  // Cloud metadata simulation (AWS / GCP)
  if (
    lower.includes('169.254.169.254') ||
    lower.includes('metadata.google.internal') ||
    lower.includes('latest/meta-data')
  ) {
    return NextResponse.json({
      status: 'success',
      service: 'Simulated Cloud Instance Metadata Service',
      'ami-id': 'ami-0123456789abcdef0',
      'instance-id': 'i-0987654321fedcba0',
      'instance-type': 't3.xlarge',
      iam: {
        role: 'tinyfah-production-worker-role',
        accessKeyId: 'ASIAIOSFODNN7EXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        token: 'CANARY_SSRF_AWS_CREDENTIAL_EXTRACTED',
      },
      canary: 'CANARY_SSRF_IMPACT_CONFIRMED',
      ssrfProven: true,
    });
  }

  // Internal loopback or intranet service simulation
  if (
    lower.includes('127.0.0.1') ||
    lower.includes('localhost') ||
    lower.includes('10.0.') ||
    lower.includes('192.168.') ||
    lower.includes('internal')
  ) {
    return NextResponse.json({
      status: 'success',
      service: 'Internal Administrative Gateway (Loopback)',
      listeningServices: ['Postgres:5432', 'Redis:6379', 'DebugDashboard:9000'],
      masterToken: 'sec_master_intranet_bearer_99482',
      canary: 'CANARY_SSRF_IMPACT_CONFIRMED',
      ssrfProven: true,
    });
  }

  // External canary host
  return NextResponse.json({
    status: 'success',
    proxyTarget: targetUrl,
    message: `Proxied request to ${targetUrl}`,
    canary: 'CANARY_SSRF_OUTBOUND_CONFIRMED',
  });
}

export async function POST(request) {
  return GET(request);
}
