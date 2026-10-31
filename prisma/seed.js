const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initialisation et amorçage de la base de données ---');

  // 1. Initialisation du compte propriétaire / administrateur
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@elevage-espoir.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminElevage2026!';
  const adminName = process.env.ADMIN_NAME || 'Propriétaire Éleveur';

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: adminName,
        role: 'ADMIN',
      },
    });
    console.log(`✓ Compte administrateur initial créé : ${adminEmail}`);
  } else {
    console.log(`✓ Compte administrateur déjà existant : ${adminEmail}`);
  }

  // 2. Paramètres généraux du site
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      farmName: "Ferme Agro-Pastorale de l'Espoir",
      tagline: 'Élevage naturel & vente directe de lapins, volailles et cabris de race',
      aboutText:
        "Éleveur professionnel indépendant depuis plus de 6 ans, nous sélectionnons des sujets vigoureux, nourris sainement avec des produits naturels de nos terroirs et suivis selon un protocole sanitaire strict. Nous pratiquons la vente directe sans intermédiaire afin de garantir aux acquéreurs des animaux au meilleur de leur forme.",
      experienceYears: 6,
      phone: '+229 97 00 12 34',
      whatsappNumber: '22997001234',
      email: 'contact@elevage-espoir.com',
      address: 'Route Nationale Inter-États, Zone Agro-Écologique, Bénin',
      hours: 'Lundi au Samedi : 07h30 - 18h30 | Dimanche sur commande',
      currency: 'FCFA',
      heroTitle: "Animaux d'élevage de race et de qualité supérieure",
      heroSubtitle:
        'Lapins reproducteurs et de chair, poulets fermiers rustiques, cabris sahéliens et chèvres de race élevés dans le respect de la nature.',
      heroImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1600&q=80',
      facebookUrl: 'https://facebook.com',
      youtubeUrl: '',
      instagramUrl: '',
    },
  });
  console.log('✓ Paramètres généraux configurés.');

  // 3. Catégories d'animaux
  const catRabbits = await prisma.animalCategory.upsert({
    where: { slug: 'lapins' },
    update: {},
    create: {
      name: 'Lapins',
      slug: 'lapins',
      description: 'Lapins de chair et reproducteurs vigoureux (Fauve de Bourgogne, Géant, Néo-Zélandais).',
      displayOrder: 1,
    },
  });

  const catPoultry = await prisma.animalCategory.upsert({
    where: { slug: 'poulets-et-volailles' },
    update: {},
    create: {
      name: 'Poulets et Volailles',
      slug: 'poulets-et-volailles',
      description: 'Poulets bicyclettes fermiers, Goliath, canards et dindes élevés en plein air.',
      displayOrder: 2,
    },
  });

  const catGoats = await prisma.animalCategory.upsert({
    where: { slug: 'cabris-et-chevres' },
    update: {},
    create: {
      name: 'Cabris et Chèvres',
      slug: 'cabris-et-chevres',
      description: 'Cabris sahéliens vigoureux, boucs reproducteurs et chèvres laitières rustiques.',
      displayOrder: 3,
    },
  });

  console.log('✓ Catégories créées.');

  // 4. Animaux de démonstration (clairement identifiés)
  const demoAnimals = [
    {
      title: 'Couple de Lapins Reproducteurs Fauve de Bourgogne [DÉMO]',
      slug: 'couple-lapins-fauve-bourgogne-demo',
      categoryId: catRabbits.id,
      description:
        'Sujets de 5 mois sélectionnés pour leur fertilité et leur excellente conformation bouchère. Vaccinés contre la VHD et vermifugés. Idéal pour démarrer ou renouveler votre élevage cunicole.',
      price: 25000,
      stock: 4,
      status: 'DISPONIBLE',
      isPublished: true,
      age: '5 mois',
      race: 'Fauve de Bourgogne',
      sex: 'Couple (1 Mâle + 1 Femelle)',
      weight: '3.2 kg par sujet',
      location: "À la ferme (Livraison possible)",
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      title: 'Lot de 5 Lapereaux Sevrés Rustiques [DÉMO]',
      slug: 'lot-5-lapereaux-sevres-demo',
      categoryId: catRabbits.id,
      description:
        'Lapereaux sevrés âgés de 7 semaines, habitués aux fourrages verts et granulés fermiers. Croissance rapide et grande résistance aux maladies courantes.',
      price: 18000,
      stock: 6,
      status: 'DISPONIBLE',
      isPublished: true,
      age: '7 semaines',
      race: 'Hybride Métis chair',
      sex: 'Mixte (3 Femelles, 2 Mâles)',
      weight: '1.1 kg / unité',
      location: "À la ferme",
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1559214369-a6b1d7919865?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      title: 'Coqs Goliath Reproducteurs de race pure [DÉMO]',
      slug: 'coqs-goliath-reproducteurs-demo',
      categoryId: catPoultry.id,
      description:
        'Coqs géants Goliath âgés de 7 mois, charpentés et très actifs. Idéal pour le croisement et l’amélioration génétique de cheptel local.',
      price: 15000,
      stock: 8,
      status: 'DISPONIBLE',
      isPublished: true,
      age: '7 mois',
      race: 'Goliath Pur',
      sex: 'Mâle',
      weight: '3.8 kg à 4.2 kg',
      location: "Ferme principale",
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      title: 'Poulets Bicyclettes Fermiers Prêts à consommer [DÉMO]',
      slug: 'poulets-fermiers-prets-a-consommer-demo',
      categoryId: catPoultry.id,
      description:
        'Poulets élevés en plein air, nourris au maïs, son et verdure sans additifs chimiques. Chair ferme, savoureuse et très parfumée.',
      price: 4500,
      stock: 25,
      status: 'DISPONIBLE',
      isPublished: true,
      age: '5 mois',
      race: 'Poule Locale Fermière',
      sex: 'Mixte',
      weight: '1.8 kg - 2.2 kg',
      location: "Ferme & Livraison urbaine",
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      title: 'Bouc Reproducteur Sahélien Vigoureux [DÉMO]',
      slug: 'bouc-reproducteur-sahelien-demo',
      categoryId: catGoats.id,
      description:
        'Magnifique bouc sahélien de 14 mois, excellent gabarit, calme et docile. Idéal pour booster le rendement en viande de votre troupeau de caprins.',
      price: 75000,
      stock: 2,
      status: 'DISPONIBLE',
      isPublished: true,
      age: '14 mois',
      race: 'Sahélien',
      sex: 'Mâle',
      weight: '35 kg',
      location: "Parc caprin de la ferme",
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      title: 'Chèvre Djallonké Rustique avec son chevreau [DÉMO]',
      slug: 'chevre-djallonke-avec-chevreau-demo',
      categoryId: catGoats.id,
      description:
        'Chèvre naine de race Djallonké, réputée pour sa très haute résistance à la trypanosomiase. Vendu avec son chevreau femelle âgé de 3 semaines.',
      price: 55000,
      stock: 1,
      status: 'DISPONIBLE',
      isPublished: true,
      age: '2 ans',
      race: 'Djallonké',
      sex: 'Femelle + chevreau',
      weight: '22 kg',
      location: "Parc caprin de la ferme",
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
      ],
    },
  ];

  for (const item of demoAnimals) {
    const existing = await prisma.animal.findUnique({
      where: { slug: item.slug },
    });

    if (!existing) {
      const { images, ...data } = item;
      await prisma.animal.create({
        data: {
          ...data,
          images: {
            create: images.map((url, idx) => ({
              url,
              isPrimary: idx === 0,
              order: idx,
            })),
          },
        },
      });
    }
  }
  console.log('✓ Animaux de démonstration créés.');

  // 5. Réalisations (Portfolio)
  const demoPortfolio = [
    {
      title: 'Construction du nouveau bloc de clapiers aérés [DÉMO]',
      category: 'Installations',
      description:
        'Mise en service d’un bâtiment cunicole semi-naturel avec toiture isolante et système d’abreuvement automatique à pipette pour 80 cages mères.',
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
      eventDate: new Date('2026-05-15'),
      isPublished: true,
    },
    {
      title: 'Campagne de déparasitage et vaccination semestrielle [DÉMO]',
      category: 'Santé animale',
      description:
        'Passage du docteur vétérinaire référent pour le contrôle de routine du troupeau caprin et le rappel vaccinal des reproducteurs.',
      imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80',
      eventDate: new Date('2026-07-20'),
      isPublished: true,
    },
    {
      title: 'Sélection des géniteurs volailles Goliath et locaux [DÉMO]',
      category: 'Sélection génétique',
      description:
        'Pesée et sélection des meilleurs mâles et femelles destinés à produire la nouvelle génération de poussins rustiques.',
      imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      eventDate: new Date('2026-09-10'),
      isPublished: true,
    },
  ];

  for (const proj of demoPortfolio) {
    const found = await prisma.portfolioProject.findFirst({
      where: { title: proj.title },
    });
    if (!found) {
      await prisma.portfolioProject.create({ data: proj });
    }
  }
  console.log('✓ Réalisations de démonstration créées.');

  // 6. Articles & Conseils
  const demoArticles = [
    {
      title: "Bien démarrer un élevage de lapins : 5 règles d'or [DÉMO]",
      slug: 'bien-demarrer-elevage-lapins-5-regles-or-demo',
      category: "Conseils d'élevage",
      excerpt: "Découvrez les bases indispensables pour réussir son élevage cunicole : aération, eau propre, foin de qualité et hygiène stricte.",
      content: `L'élevage des lapins (cuniculture) est une activité rentable et passionnante lorsqu'elle est menée avec rigueur. Voici nos 5 conseils essentiels :

1. L'Aération et la température : Le lapin craint beaucoup plus la chaleur et l'humidité que le froid modéré. Vos clapiers doivent être protégés des courants d'air violents mais bénéficier d'une ventilation constante.

2. L'eau propre en permanence : Un lapin consomme deux fois plus d'eau que d'aliment sec. Une pipette ou un abreuvoir automatique propre est indispensable pour éviter les infections bactériennes.

3. La transition alimentaire en douceur : Tout changement de fourrage ou de granulé doit se faire progressivement sur 7 à 10 jours pour ne pas perturber la flore intestinale fragile du lapin.

4. L'hygiène des cages : Nettoyez et désinfectez régulièrement les grillages et tiroirs à déjections.

5. Choisir de bons reproducteurs : Ne commencez jamais avec des sujets consanguins ou affaiblis. Préférez des souches reconnues auprès d'un éleveur certifié.`,
      coverImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
    },
    {
      title: 'Alimentation naturelle du poulet bicyclette : astuces économiques [DÉMO]',
      slug: 'alimentation-naturelle-poulet-bicyclette-demo',
      category: 'Alimentation',
      excerpt: 'Comment composer une ration équilibrée pour ses volailles en utilisant les ressources végétales et céréalières locales.',
      content: `Pour obtenir une chair ferme et savoureuse tout en maintenant des coûts de production raisonnables, nous misons sur une alimentation locale et variée :

- Céréales de base : Le maïs concassé et le son de blé fournissent l'énergie nécessaire.
- Sources de protéines naturelles : Les termites, vers de terre et tourteau de soja permettent un développement musculaire harmonieux sans hormones artificielles.
- Verdure et minéraux : L'apport de feuilles de moringa séchées et broyées renforce le système immunitaire des volailles et apporte des vitamines essentielles.`,
      coverImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
    },
  ];

  for (const art of demoArticles) {
    const existingArt = await prisma.article.findUnique({
      where: { slug: art.slug },
    });
    if (!existingArt) {
      await prisma.article.create({ data: art });
    }
  }
  console.log('✓ Articles de démonstration créés.');

  console.log('\n=============================================');
  console.log('✓ AMORÇAGE TERMINÉ AVEC SUCCÈS !');
  console.log(`Identifiant d'administration : ${adminEmail}`);
  console.log(`Mot de passe initial        : ${adminPassword}`);
  console.log('=============================================\n');
}

main()
  .catch((e) => {
    console.error('Erreur lors de l’amorçage :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
