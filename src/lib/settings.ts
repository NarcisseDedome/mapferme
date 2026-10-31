import { prisma } from './prisma';

export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          farmName: 'Ferme Pastorale de l’Espoir',
          tagline: 'Élevage naturel & vente directe de lapins, volailles et cabris de race',
          aboutText:
            "Fondée par un passionné de l'agropastoralisme, notre exploitation s'engage à fournir des animaux sains, robustes et élevés dans le strict respect du bien-être animal et des normes d'hygiène.",
          experienceYears: 6,
          phone: '+229 01 66 01 77 83 / +229 01 95 20 43 97',
          whatsappNumber: 'https://wa.me/qr/YSO2RHQ4CPOWM1?s=v',
          email: 'm.aik@hotmail.fr',
          address: '',
          hours: 'Lundi au Samedi : 07h30 - 18h30 | Dimanche sur commande',
          currency: 'FCFA',
          heroTitle: "Animaux d'élevage de race et de qualité supérieure",
          heroSubtitle:
            'Lapins de chair et reproducteurs, volailles fermières vigoureuses, cabris et chèvres du Sahel sélectionnés avec rigueur.',
          heroImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1600&q=80',
          facebookUrl: 'https://facebook.com',
          youtubeUrl: '',
          instagramUrl: '',
        },
      });
    }

    return settings;
  } catch (err) {
    console.error('Error fetching site settings:', err);
    // Return fallback defaults so page never crashes
    return {
      id: 'default',
      farmName: 'Ferme Pastorale de l’Espoir',
      tagline: 'Élevage naturel & vente directe de lapins, volailles et cabris de race',
      aboutText:
        "Notre exploitation s'engage à fournir des animaux sains, robustes et élevés dans le strict respect du bien-être animal.",
      experienceYears: 6,
      phone: '+229 01 66 01 77 83 / +229 01 95 20 43 97',
      whatsappNumber: 'https://wa.me/qr/YSO2RHQ4CPOWM1?s=v',
      email: 'm.aik@hotmail.fr',
      address: '',
      hours: 'Lundi au Samedi : 07h30 - 18h30',
      currency: 'FCFA',
      heroTitle: "Animaux d'élevage de race et de qualité supérieure",
      heroSubtitle: 'Lapins, volailles fermières et cabris sélectionnés avec rigueur.',
      heroImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1600&q=80',
      facebookUrl: '',
      youtubeUrl: '',
      instagramUrl: '',
      updatedAt: new Date(),
    };
  }
}
