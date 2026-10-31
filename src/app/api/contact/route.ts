import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';

// POST /api/contact (Public form)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phoneOrEmail, subject, message } = body;

    if (!name || !phoneOrEmail || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir votre nom, contact (téléphone ou email) et votre message.' },
        { status: 400 }
      );
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phoneOrEmail: phoneOrEmail.trim(),
        subject: subject?.trim() || 'Demande de renseignement',
        message: message.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Votre message a bien été envoyé. Nous vous répondrons très rapidement.',
        contactId: contact.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Contact submit error:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}

// GET /api/contact (Admin only)
export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    console.error('Fetch contact messages error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages.' },
      { status: 500 }
    );
  }
}

// PATCH /api/contact (Admin only - mark as read)
export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const { id, isRead } = await req.json();

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: Boolean(isRead) },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error: unknown) {
    console.error('Update contact message error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour.' },
      { status: 500 }
    );
  }
}
