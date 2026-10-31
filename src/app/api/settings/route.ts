import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getSiteSettings } from '@/lib/settings';

// GET /api/settings
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error: unknown) {
    console.error('Fetch settings error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres.' },
      { status: 500 }
    );
  }
}

// PUT /api/settings (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminSessionFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      farmName,
      tagline,
      aboutText,
      experienceYears,
      phone,
      whatsappNumber,
      email,
      address,
      hours,
      currency,
      heroTitle,
      heroSubtitle,
      heroImage,
      facebookUrl,
      youtubeUrl,
      instagramUrl,
    } = body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        ...(farmName ? { farmName: farmName.trim() } : {}),
        ...(tagline ? { tagline: tagline.trim() } : {}),
        ...(aboutText ? { aboutText: aboutText.trim() } : {}),
        ...(experienceYears !== undefined
          ? { experienceYears: parseInt(experienceYears, 10) || 1 }
          : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(whatsappNumber ? { whatsappNumber: whatsappNumber.trim() } : {}),
        ...(email ? { email: email.trim() } : {}),
        ...(address !== undefined ? { address: address.trim() } : {}),
        ...(hours ? { hours: hours.trim() } : {}),
        ...(currency ? { currency: currency.trim() } : {}),
        ...(heroTitle ? { heroTitle: heroTitle.trim() } : {}),
        ...(heroSubtitle ? { heroSubtitle: heroSubtitle.trim() } : {}),
        ...(heroImage !== undefined ? { heroImage: heroImage?.trim() || null } : {}),
        ...(facebookUrl !== undefined ? { facebookUrl: facebookUrl?.trim() || null } : {}),
        ...(youtubeUrl !== undefined ? { youtubeUrl: youtubeUrl?.trim() || null } : {}),
        ...(instagramUrl !== undefined ? { instagramUrl: instagramUrl?.trim() || null } : {}),
      },
      create: {
        id: 'default',
        farmName: farmName?.trim() || "Ferme Pastorale de l'Espoir",
        tagline: tagline?.trim() || 'Élevage naturel & vente directe',
        aboutText: aboutText?.trim() || 'Élevage professionnel agréé',
        experienceYears: parseInt(experienceYears, 10) || 5,
        phone: phone?.trim() || '+229 97 00 12 34',
        whatsappNumber: whatsappNumber?.trim() || '22997001234',
        email: email?.trim() || 'contact@elevage-espoir.com',
        address: address?.trim() || '',
        hours: hours?.trim() || 'Lundi au Samedi : 07h30 - 18h30',
        currency: currency?.trim() || 'FCFA',
        heroTitle: heroTitle?.trim() || "Animaux d'élevage de race et de qualité supérieure",
        heroSubtitle: heroSubtitle?.trim() || 'Lapins, volailles et cabris élevés naturellement',
        heroImage: heroImage?.trim() || null,
        facebookUrl: facebookUrl?.trim() || null,
        youtubeUrl: youtubeUrl?.trim() || null,
        instagramUrl: instagramUrl?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      settings: updated,
      message: 'Paramètres mis à jour avec succès.',
    });
  } catch (error: unknown) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres.' },
      { status: 500 }
    );
  }
}
