import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

// GET /api/orders/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Search by ID or orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: unknown) {
    console.error('Fetch order error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande.' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] (Admin only)
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
    const { status, notes } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Commande introuvable.' }, { status: 404 });
    }

    // Check if transitioning to or from ANNULEE to handle stock restore
    const isNowCancelled = status === 'ANNULEE' && existingOrder.status !== 'ANNULEE';
    const wasCancelledNowReactivated =
      existingOrder.status === 'ANNULEE' && status && status !== 'ANNULEE';

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // If newly cancelled, restore stock
      if (isNowCancelled) {
        for (const item of existingOrder.items) {
          if (item.animalId) {
            const currentAnimal = await tx.animal.findUnique({
              where: { id: item.animalId },
            });
            if (currentAnimal) {
              const restoredStock = currentAnimal.stock + item.quantity;
              await tx.animal.update({
                where: { id: item.animalId },
                data: {
                  stock: restoredStock,
                  status:
                    currentAnimal.status === 'EPUISE' && restoredStock > 0
                      ? 'DISPONIBLE'
                      : currentAnimal.status,
                },
              });
            }
          }
        }
      }

      // If was cancelled and is now being reactivated, check and decrement stock
      if (wasCancelledNowReactivated) {
        for (const item of existingOrder.items) {
          if (item.animalId) {
            const currentAnimal = await tx.animal.findUnique({
              where: { id: item.animalId },
            });
            if (currentAnimal) {
              const newStock = Math.max(0, currentAnimal.stock - item.quantity);
              await tx.animal.update({
                where: { id: item.animalId },
                data: {
                  stock: newStock,
                  status: newStock <= 0 ? 'EPUISE' : currentAnimal.status,
                },
              });
            }
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
        },
        include: { items: true },
      });
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Statut de la commande mis à jour.',
    });
  } catch (error: unknown) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la commande.' },
      { status: 500 }
    );
  }
}
