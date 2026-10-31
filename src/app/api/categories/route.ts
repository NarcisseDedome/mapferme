import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.animalCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: {
            animals: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: unknown) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories.' },
      { status: 500 }
    );
  }
}

// POST /api/categories (Admin only)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const { name, description, displayOrder } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est requis.' },
        { status: 400 }
      );
    }

    const slug = slugify(name.trim());

    const category = await prisma.animalCategory.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie.' },
      { status: 500 }
    );
  }
}
