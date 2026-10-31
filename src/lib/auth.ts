import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'elevage_secret_jwt_key_development_32chars_random_unique'
);

const COOKIE_NAME = 'elevage_admin_token';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies(): Promise<AdminPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(req: NextRequest): Promise<AdminPayload | null> {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      // Also check Authorization header Bearer token
      const authHeader = req.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const bearerToken = authHeader.substring(7);
        return await verifyAdminToken(bearerToken);
      }
      return null;
    }
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
