import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

// GET /api/portfolio
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

    const projects = await prisma.portfolioProject.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error: unknown) {
    console.error('Fetch portfolio error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réalisations.' },
      { status: 500 }
    );
  }
}

// POST /api/portfolio (Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, description, imageUrl, eventDate, isPublished } = body;

    if (!title || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Titre, description et image sont obligatoires.' },
        { status: 400 }
      );
    }

    const project = await prisma.portfolioProject.create({
      data: {
        title: title.trim(),
        category: category?.trim() || 'Général',
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create portfolio error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réalisation.' },
      { status: 500 }
    );
  }
}
