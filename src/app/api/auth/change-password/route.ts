import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Veuillez renseigner le mot de passe actuel et le nouveau mot de passe.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' },
        { status: 400 }
      );
    }

    // Récupération de l'administrateur
    const user = await prisma.adminUser.findUnique({
      where: { id: admin.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
    }

    // Vérification du mot de passe actuel
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel est incorrect.' },
        { status: 400 }
      );
    }

    // Hachage du nouveau mot de passe
    const newHash = await hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Mot de passe administrateur modifié avec succès.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe.' },
      { status: 500 }
    );
  }
}
