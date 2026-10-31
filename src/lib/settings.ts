import { prisma } from './prisma';

export const DEFAULT_SITE_SETTINGS = {
  id: 'default',
  farmName: 'Ferme MAP',
  tagline: 'Élevage sain, naturel et sélectionné — Lapins, Volailles & Cabris',
  aboutText:
    "Éleveur professionnel indépendant depuis plus de 6 ans, nous sélectionnons des sujets vigoureux, nourris sainement avec des produits naturels de nos terroirs et suivis selon un protocole sanitaire strict. Nous pratiquons la vente directe sans intermédiaire afin de garantir aux acquéreurs des animaux au meilleur de leur forme.",
  experienceYears: 6,
  phone: '+229 01 66 01 77 83 / +229 01 95 20 43 97',
  whatsappNumber: 'https://wa.me/qr/YSO2RHQ4CPOWM1?s=v',
  email: 'm.aik@hotmail.fr',
  address: '',
  hours: 'Lundi au Samedi : 07h30 - 18h30 | Dimanche sur commande',
  currency: 'FCFA',
  heroTitle: 'Commandez vos grillards si vous désirez gagner du temps dans vos préparations, rapide et bien fait !',
  heroSubtitle:
    'Vente directe de lapins de race, poulets fermiers vigoureux et cabris Djallonké élevés avec soin et respect de la nature. Ferme MAP — Élevage · Qualité · Confiance',
  heroImage: '/uploads/grillades-barbecue-ferme.webp',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: '',
  instagramUrl: '',
  updatedAt: new Date(),
};

export async function getSiteSettings() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          farmName: DEFAULT_SITE_SETTINGS.farmName,
          tagline: DEFAULT_SITE_SETTINGS.tagline,
          aboutText: DEFAULT_SITE_SETTINGS.aboutText,
          experienceYears: DEFAULT_SITE_SETTINGS.experienceYears,
          phone: DEFAULT_SITE_SETTINGS.phone,
          whatsappNumber: DEFAULT_SITE_SETTINGS.whatsappNumber,
          email: DEFAULT_SITE_SETTINGS.email,
          address: DEFAULT_SITE_SETTINGS.address,
          hours: DEFAULT_SITE_SETTINGS.hours,
          currency: DEFAULT_SITE_SETTINGS.currency,
          heroTitle: DEFAULT_SITE_SETTINGS.heroTitle,
          heroSubtitle: DEFAULT_SITE_SETTINGS.heroSubtitle,
          heroImage: DEFAULT_SITE_SETTINGS.heroImage,
          facebookUrl: DEFAULT_SITE_SETTINGS.facebookUrl,
          youtubeUrl: '',
          instagramUrl: '',
        },
      });
    }

    // Si les champs clés sont vides ou contiennent l'ancienne image Unsplash
    if (
      !settings.heroImage ||
      settings.heroImage.includes('unsplash.com') ||
      !settings.heroTitle ||
      settings.heroTitle.includes('Pastorale')
    ) {
      settings = {
        ...settings,
        heroImage: DEFAULT_SITE_SETTINGS.heroImage,
        heroTitle: DEFAULT_SITE_SETTINGS.heroTitle,
        heroSubtitle: DEFAULT_SITE_SETTINGS.heroSubtitle,
        farmName: DEFAULT_SITE_SETTINGS.farmName,
      };
    }

    return settings;
  } catch (err) {
    console.error('Error fetching site settings, using default Ferme MAP:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}
