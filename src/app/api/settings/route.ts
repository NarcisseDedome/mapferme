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
        farmName: farmName?.trim() || 'Ferme MAP',
        tagline: tagline?.trim() || 'Élevage sain, naturel et sélectionné — Lapins, Volailles & Cabris',
        aboutText: aboutText?.trim() || "Éleveur professionnel indépendant depuis plus de 6 ans, nous sélectionnons des sujets vigoureux, nourris sainement avec des produits naturels de nos terroirs.",
        experienceYears: parseInt(experienceYears, 10) || 6,
        phone: phone?.trim() || '+229 01 66 01 77 83 / +229 01 95 20 43 97',
        whatsappNumber: whatsappNumber?.trim() || 'https://wa.me/qr/YSO2RHQ4CPOWM1?s=v',
        email: email?.trim() || 'm.aik@hotmail.fr',
        address: address?.trim() || '',
        hours: hours?.trim() || 'Lundi au Samedi : 07h30 - 18h30 | Dimanche sur commande',
        currency: currency?.trim() || 'FCFA',
        heroTitle: heroTitle?.trim() || 'Commandez vos grillards si vous désirez gagner du temps dans vos préparations, rapide et bien fait !',
        heroSubtitle: heroSubtitle?.trim() || 'Vente directe de lapins de race, poulets fermiers vigoureux et cabris Djallonké.',
        heroImage: heroImage?.trim() || '/uploads/grillades-barbecue-ferme.webp',
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
