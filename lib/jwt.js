import crypto from 'crypto';

/**
 * Custom JWT Helper for testing ASVS V9 (Token Security)
 * Purposefully supports insecure algorithm 'none' and weak secret verification.
 */

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function createJwt(payload, options = {}) {
  const algorithm = options.algorithm || 'HS256';
  const secret = options.secret || 'secret';

  const header = {
    alg: algorithm,
    typ: 'JWT',
  };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));

  if (algorithm.toLowerCase() === 'none') {
    // Unsigned JWT (Vulnerable to alg:none attack)
    return `${headerB64}.${payloadB64}.`;
  }

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${headerB64}.${payloadB64}.${signature}`;
}

export function verifyJwt(token, secret = 'secret') {
  if (!token) {
    return { valid: false, error: 'Token missing' };
  }

  const parts = token.trim().split('.');
  if (parts.length < 2) {
    return { valid: false, error: 'Malformed token' };
  }

  try {
    const headerStr = base64UrlDecode(parts[0]);
    const payloadStr = base64UrlDecode(parts[1]);
    const header = JSON.parse(headerStr);
    const payload = JSON.parse(payloadStr);

    // ASVS V9.1.2 Vulnerability: Intentionally accept alg=none without signature check!
    if (header.alg && header.alg.toLowerCase() === 'none') {
      return {
        valid: true,
        header,
        payload,
        isNoneAlg: true,
        canary: 'CANARY_JWT_NONE_ALG_BYPASS_VERIFIED',
      };
    }

    // Verify signature using provided secret
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${parts[0]}.${parts[1]}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (parts[2] === expectedSig) {
      return {
        valid: true,
        header,
        payload,
        isWeakSecret: true,
        canary: 'CANARY_JWT_WEAK_SECRET_VERIFIED',
      };
    }

    return { valid: false, error: 'Signature mismatch' };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}
