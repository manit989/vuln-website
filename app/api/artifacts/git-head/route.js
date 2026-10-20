import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('ref: refs/heads/main\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Artifact-Type': 'git-repository-head',
    },
  });
}
