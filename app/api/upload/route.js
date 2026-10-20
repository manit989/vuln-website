import { NextResponse } from 'next/server';
import { addUploadedFile, logCanary } from '@/lib/db';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { status: 'error', error: 'No file uploaded in form field "file"' },
        { status: 400 }
      );
    }

    const filename = file.name || 'uploaded_payload.php';
    const size = file.size || 0;
    const type = file.type || 'application/octet-stream';

    // ASVS V5.1.1 / V5.2.1: Missing file extension allowlist or magic byte inspection
    const fileRecord = addUploadedFile({
      filename,
      size,
      type,
      uploadedAt: new Date().toISOString(),
      url: `/uploads/${encodeURIComponent(filename)}`,
    });

    logCanary('FILE_UPLOAD_SUCCESS', { filename, size, type });

    return NextResponse.json({
      status: 'success',
      message: 'File uploaded successfully without validation or extension constraints.',
      canary: 'CANARY_FILE_UPLOADED_OK',
      impactProven: true,
      file: fileRecord,
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Send POST multipart/form-data with "file" to test unrestricted upload playbooks',
    supportedExtensions: ['all (including .php, .sh, .exe, .jsp, .html)'],
  });
}
