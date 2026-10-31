import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET /api/animals (Public catalog & Admin filter)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort'); // 'price_asc', 'price_desc', 'newest'
    const status = searchParams.get('status');
    const featuredOnly = searchParams.get('featured') === 'true';
    const includeUnpublished = searchParams.get('all') === 'true';

    // If requesting unpublished, verify admin session
    if (includeUnpublished) {
      const admin = await getAdminSessionFromRequest(req);
      if (!admin) {
        return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
      }
    }

    const whereClause: Record<string, unknown> = {};

    if (!includeUnpublished) {
      whereClause.isPublished = true;
    }

    if (featuredOnly) {
      whereClause.isFeatured = true;
    }

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (category && category !== 'ALL') {
      whereClause.category = {
        slug: category,
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { race: { contains: search } },
      ];
    }

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const animals = await prisma.animal.findMany({
      where: whereClause,
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy,
    });

    return NextResponse.json({ animals });
  } catch (error: unknown) {
    console.error('Fetch animals error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des animaux.' },
      { status: 500 }
    );
  }
}

// POST /api/animals (Admin only - create animal)
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      categoryId,
      description,
      price,
      stock,
      status,
      isPublished,
      age,
      race,
      sex,
      weight,
      location,
      isFeatured,
      images, // array of urls
    } = body;

    if (!title || !categoryId || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Titre, catégorie, description et prix sont obligatoires.' },
        { status: 400 }
      );
    }

    let baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.animal.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock ?? 1, 10);

    const newAnimal = await prisma.animal.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        categoryId,
        description: description.trim(),
        price: isNaN(numericPrice) ? 0 : numericPrice,
        stock: isNaN(numericStock) ? 1 : numericStock,
        status: status || (numericStock > 0 ? 'DISPONIBLE' : 'EPUISE'),
        isPublished: isPublished !== undefined ? isPublished : true,
        age: age?.trim() || null,
        race: race?.trim() || null,
        sex: sex?.trim() || null,
        weight: weight?.trim() || null,
        location: location?.trim() || null,
        isFeatured: Boolean(isFeatured),
        images: {
          create: Array.isArray(images)
            ? images.map((url: string, index: number) => ({
                url,
                isPrimary: index === 0,
                order: index,
              }))
            : [],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ success: true, animal: newAnimal }, { status: 201 });
  } catch (error: unknown) {
    console.error('Create animal error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'animal." },
      { status: 500 }
    );
  }
}
