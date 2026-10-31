import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

// GET /api/animals/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const animal = await prisma.animal.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!animal) {
      return NextResponse.json({ error: 'Animal introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ animal });
  } catch (error: unknown) {
    console.error('Fetch animal error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'animal." },
      { status: 500 }
    );
  }
}

// PATCH /api/animals/[id] (Admin only)
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
      images, // string[]
    } = body;

    const existing = await prisma.animal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Animal introuvable.' }, { status: 404 });
    }

    const numericPrice = price !== undefined ? parseFloat(price) : undefined;
    const numericStock = stock !== undefined ? parseInt(stock, 10) : undefined;

    // Transaction to update fields and replace/update images if provided
    const updated = await prisma.$transaction(async (tx) => {
      if (Array.isArray(images)) {
        // Remove existing images and re-add
        await tx.animalImage.deleteMany({ where: { animalId: id } });
        if (images.length > 0) {
          await tx.animalImage.createMany({
            data: images.map((url: string, index: number) => ({
              animalId: id,
              url,
              isPrimary: index === 0,
              order: index,
            })),
          });
        }
      }

      return tx.animal.update({
        where: { id },
        data: {
          ...(title ? { title: title.trim() } : {}),
          ...(categoryId ? { categoryId } : {}),
          ...(description !== undefined ? { description: description.trim() } : {}),
          ...(numericPrice !== undefined ? { price: numericPrice } : {}),
          ...(numericStock !== undefined ? { stock: numericStock } : {}),
          ...(status ? { status } : {}),
          ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
          ...(age !== undefined ? { age: age?.trim() || null } : {}),
          ...(race !== undefined ? { race: race?.trim() || null } : {}),
          ...(sex !== undefined ? { sex: sex?.trim() || null } : {}),
          ...(weight !== undefined ? { weight: weight?.trim() || null } : {}),
          ...(location !== undefined ? { location: location?.trim() || null } : {}),
          ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        },
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
        },
      });
    });

    return NextResponse.json({ success: true, animal: updated });
  } catch (error: unknown) {
    console.error('Update animal error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'animal." },
      { status: 500 }
    );
  }
}

// DELETE /api/animals/[id] (Admin only)
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

    await prisma.animal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Animal supprimé.' });
  } catch (error: unknown) {
    console.error('Delete animal error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'animal." },
      { status: 500 }
    );
  }
}
