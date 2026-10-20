import { NextResponse } from 'next/server';
import { logCanary } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('name') || searchParams.get('file') || searchParams.get('path') || '';

  if (!filename) {
    return NextResponse.json({
      status: 'ready',
      message: 'File retrieval service. Try ?name=../../../../etc/passwd or ?name=../../.env',
    });
  }

  // ASVS V5.5.1 / V13.2.1: Path Traversal / Arbitrary File Read flaw
  if (filename.includes('..') || filename.includes('etc/passwd') || filename.includes('win.ini')) {
    logCanary('PATH_TRAVERSAL_DETECTED', { filename });

    if (filename.includes('etc/passwd')) {
      const simulatedPasswd = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
tinyfah-admin:x:1000:1000:Tinyfah Evaluator,,,:/home/tinyfah-admin:/bin/bash
CANARY_PATH_TRAVERSAL_CONFIRMED
`;
      return new NextResponse(simulatedPasswd, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Canary': 'CANARY_PATH_TRAVERSAL_CONFIRMED',
        },
      });
    }

    if (filename.includes('win.ini')) {
      const simulatedWinIni = `[fonts]
[extensions]
[mci extensions]
[files]
CANARY_PATH_TRAVERSAL_CONFIRMED
`;
      return new NextResponse(simulatedWinIni, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Canary': 'CANARY_PATH_TRAVERSAL_CONFIRMED',
        },
      });
    }

    return new NextResponse(`Simulated traversal file content for ${filename}\nCANARY_PATH_TRAVERSAL_CONFIRMED\n`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return NextResponse.json({
    status: 'error',
    error: `File ${filename} not found in public assets directory.`,
  }, { status: 404 });
}
