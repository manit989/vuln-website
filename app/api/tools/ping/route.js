import { NextResponse } from 'next/server';
import { logCanary } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get('host') || '127.0.0.1';

  // ASVS V1.3.3 / V15.1.1: Command Injection flaw
  if (
    host.includes(';') ||
    host.includes('|') ||
    host.includes('&') ||
    host.includes('`') ||
    host.includes('$(')
  ) {
    logCanary('COMMAND_INJECTION_TRIGGERED', { host });

    const injectedOutput = `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.024 ms

--- 127.0.0.1 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.024/0.024/0.024/0.000 ms

[INJECTED PROCESS EXECUTION]
root
uid=0(root) gid=0(root) groups=0(root)
CANARY_COMMAND_INJECTION_PROVEN
Linux tinyfah-sandbox 6.5.0-generic #42-Ubuntu SMP x86_64 GNU/Linux
`;

    return new NextResponse(injectedOutput, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Canary': 'CANARY_COMMAND_INJECTION_PROVEN',
      },
    });
  }

  const normalOutput = `PING ${host} (${host}) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.035 ms

--- ${host} ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.035/0.035/0.035/0.000 ms
`;

  return new NextResponse(normalOutput, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export async function POST(request) {
  return GET(request);
}
