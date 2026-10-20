import { NextResponse } from 'next/server';

export async function GET() {
  const envContent = `# Tinyfah Production Environment Secrets (ASVS V13.2.1 / V14.3.1)
# Intentionally exposed configuration artifact
KEY=value
DATABASE_URL=postgres://dbadmin:SuperSecretK3y@10.0.1.45:5432/core_prod
JWT_SECRET=insecure_jwt_secret_key_tinyfah_2026
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
INTERNAL_BACKUP_S3=s3://tinyfah-internal-customer-backups-2026/
CANARY_TOKEN=CANARY_ENV_FILE_DISCLOSURE_CONFIRMED
APP_ENV=production
DEBUG=true
`;

  return new NextResponse(envContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Artifact-Type': 'environment-secrets',
    },
  });
}
