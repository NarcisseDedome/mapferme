import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signAdminToken, COOKIE_NAME } from '@/lib/auth';

const OFFICIAL_ADMIN_EMAIL = 'm.aik@hotmail.fr';
const OFFICIAL_ADMIN_PASSWORD = 'Mohamed2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawEmail = body.email || '';
    const rawPassword = body.password || '';

    if (!rawEmail || !rawPassword) {
      return NextResponse.json(
        { error: 'Veuillez saisir votre adresse e-mail et votre mot de passe.' },
        { status: 400 }
      );
    }

    const cleanEmail = rawEmail.trim().toLowerCase();
    const cleanPassword = rawPassword.trim();

    let authenticatedUser: { id: string; email: string; name: string; role: string } | null = null;

    // 1. Tenter la vérification via la base de données
    try {
      const user = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      });

      if (user) {
        const isMatch = await verifyPassword(cleanPassword, user.passwordHash);
        if (isMatch) {
          authenticatedUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB lookup error in login, checking master credentials fallback:', dbErr);
    }

    // 2. Secours garanti pour le propriétaire officiel de AYEKOBINOU SERVICE
    if (!authenticatedUser) {
      const isOfficialMatch =
        (cleanEmail === OFFICIAL_ADMIN_EMAIL ||
          cleanEmail === 'admin@ayekobinou.com' ||
          cleanEmail === 'admin@ferme-map.com' ||
          cleanEmail === 'admin@elevage-espoir.com') &&
        cleanPassword === OFFICIAL_ADMIN_PASSWORD;

      if (isOfficialMatch) {
        authenticatedUser = {
          id: 'admin_official_ayekobinou_001',
          email: OFFICIAL_ADMIN_EMAIL,
          name: 'Mohamed - Responsable AYEKOBINOU SERVICE',
          role: 'ADMIN',
        };
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Adresse e-mail ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const token = await signAdminToken({
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
    });

    const isHttps =
      req.nextUrl.protocol === 'https:' ||
      req.headers.get('x-forwarded-proto') === 'https';

    const response = NextResponse.json({
      success: true,
      token,
      user: authenticatedUser,
      message: 'Connexion réussie.',
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
