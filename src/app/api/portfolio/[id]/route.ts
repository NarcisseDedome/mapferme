import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { title, category, description, imageUrl, eventDate, isPublished } = body;

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(category ? { category: category.trim() } : {}),
        ...(description ? { description: description.trim() } : {}),
        ...(imageUrl ? { imageUrl: imageUrl.trim() } : {}),
        ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error: unknown) {
    console.error('Update portfolio error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réalisation.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const { id } = params;
    await prisma.portfolioProject.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Réalisation supprimée.' });
  } catch (error: unknown) {
    console.error('Delete portfolio error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression.' },
      { status: 500 }
    );
  }
}
