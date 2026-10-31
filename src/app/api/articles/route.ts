import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET /api/articles
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const all = searchParams.get('all') === 'true';

    const whereClause: Record<string, unknown> = {};
    if (!all) {
      whereClause.isPublished = true;
    }
    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ articles });
  } catch (error: unknown) {
    console.error('Fetch articles error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles.' },
      { status: 500 }
    );
  }
}

// POST /api/articles (Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, excerpt, content, coverImage, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Le titre et le contenu de l’article sont requis.' },
        { status: 400 }
      );
    }

    let baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        category: category?.trim() || 'Conseils',
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        coverImage: coverImage?.trim() || null,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create article error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'article." },
      { status: 500 }
    );
  }
}
