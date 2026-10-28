export function normalizeLoginIdentifier(value: string): string {
  const identifier = value.trim().toLowerCase();
  if (!/^[+0-9 ()-]+$/.test(identifier)) return identifier;
  const digits = identifier.replace(/[+ ()-]/g, '');
  if (/^0[0-9]{9}$/.test(digits)) return `+256${digits.slice(1)}`;
  if (/^[73][0-9]{8}$/.test(digits)) return `+256${digits}`;
  if (/^256[0-9]{9}$/.test(digits)) return `+${digits}`;
  return digits;
}

export async function loginFingerprint(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return `auth:${Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, '0')).join('')}`;
}
