import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { getPreparationFee, getPreparationLabel } from '@/lib/preparation';

// POST /api/orders (Public order creation)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      animalId,
      quantity,
      customerName,
      customerPhone,
      customerLocation,
      deliveryAddress,
      notes,
      preparationOption,
    } = body;

    if (!animalId || !customerName || !customerPhone || !customerLocation) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (animal, nom, téléphone, localisation).' },
        { status: 400 }
      );
    }

    const orderQty = parseInt(quantity, 10);
    if (isNaN(orderQty) || orderQty <= 0) {
      return NextResponse.json(
        { error: 'La quantité demandée est invalide.' },
        { status: 400 }
      );
    }

    // Check animal availability
    const animal = await prisma.animal.findUnique({
      where: { id: animalId },
      include: { category: true },
    });

    if (!animal) {
      return NextResponse.json(
        { error: 'Cet animal est introuvable.' },
        { status: 404 }
      );
    }

    if (!animal.isPublished || animal.status !== 'DISPONIBLE') {
      return NextResponse.json(
        { error: "Cet animal n'est actuellement plus disponible à la commande." },
        { status: 400 }
      );
    }

    if (animal.stock < orderQty) {
      return NextResponse.json(
        {
          error: `Stock insuffisant : seulement ${animal.stock} exemplaire(s) disponible(s).`,
        },
        { status: 400 }
      );
    }

    const unitPrice = animal.price;
    const prepOption = preparationOption || 'VIVANT';
    const singlePrepFee = getPreparationFee(prepOption, animal.category?.slug);
    const totalPrepFee = singlePrepFee * orderQty;
    const subtotal = unitPrice * orderQty;
    const totalAmount = subtotal + totalPrepFee;
    const orderNumber = generateOrderNumber();

    // Execute atomic transaction for order creation and stock adjustment
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerLocation: customerLocation.trim(),
          deliveryAddress: deliveryAddress?.trim() || null,
          preparationOption: prepOption,
          preparationFee: totalPrepFee,
          notes: notes?.trim() || null,
          totalAmount,
          status: 'NOUVELLE',
          items: {
            create: [
              {
                animalId: animal.id,
                animalName: animal.title,
                unitPrice,
                preparationOption: prepOption,
                preparationFee: totalPrepFee,
                quantity: orderQty,
                subtotal: subtotal + totalPrepFee,
              },
            ],
          },
        },
        include: {
          items: true,
        },
      });

      // Update animal stock safely
      const newStock = animal.stock - orderQty;
      await tx.animal.update({
        where: { id: animal.id },
        data: {
          stock: newStock,
          status: newStock <= 0 ? 'EPUISE' : animal.status,
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        success: true,
        order: createdOrder,
        message: 'Votre commande a été enregistrée avec succès.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement de votre commande." },
      { status: 500 }
    );
  }
}

// GET /api/orders (Admin only - list orders)
export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: Record<string, unknown> = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            animal: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: unknown) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes.' },
      { status: 500 }
    );
  }
}
