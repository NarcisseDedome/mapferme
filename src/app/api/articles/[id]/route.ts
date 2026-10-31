import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error: unknown) {
    console.error('Fetch article error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'article." },
      { status: 500 }
    );
  }
}

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
    const { title, category, excerpt, content, coverImage, isPublished } = body;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(category ? { category: category.trim() } : {}),
        ...(excerpt !== undefined ? { excerpt: excerpt?.trim() || null } : {}),
        ...(content ? { content: content.trim() } : {}),
        ...(coverImage !== undefined ? { coverImage: coverImage?.trim() || null } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
      },
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (error: unknown) {
    console.error('Update article error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'article." },
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
    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Article supprimé.' });
  } catch (error: unknown) {
    console.error('Delete article error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article." },
      { status: 500 }
    );
  }
}
