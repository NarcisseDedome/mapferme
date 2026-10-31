import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import AnimalCard from '@/components/AnimalCard';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ExternalLink,
  Award,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import { formatDate, buildWhatsAppLink } from '@/lib/utils';

export const revalidate = 0; // Données fraîches en direct depuis Supabase

export default async function HomePage() {
  const settings = await getSiteSettings();

  // 1. Récupération des catégories avec le décompte réel des animaux disponibles
  const categories = await prisma.animalCategory.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: {
          animals: {
            where: { isPublished: true, status: 'DISPONIBLE' },
          },
        },
      },
    },
  });

  // 2. Récupération exacte de 4 annonces d'animaux récents disponibles
  const animals = await prisma.animal.findMany({
    where: {
      isPublished: true,
      status: { not: 'VENDU' },
    },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 4,
  });

  // 3. Récupération des réalisations de l'exploitation (portfolio)
  const projects = await prisma.portfolioProject.findMany({
    where: { isPublished: true },
    orderBy: { eventDate: 'desc' },
    take: 3,
  });

  // 4. Récupération des actualités et conseils d'élevage
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  // 5. Lien WhatsApp dynamique configuré
  const whatsappHeroUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    `Bonjour ${settings.farmName}, je visite votre site web et souhaite me renseigner sur vos animaux disponibles.`
  );

  // Photos authentiques de l'exploitation pour les cartes de catégories
  const categoryMedia: Record<string, { image: string; subtitle: string }> = {
    lapins: {
      image: '/uploads/lapin-blanc-adulte.jpg',
      subtitle: 'Lapins Blancs Néo-Zélandais, Fauves de Bourgogne et lapereaux sevrés',
    },
    'poulets-et-volailles': {
      image: '/uploads/poulets-plein-air-ferme.jpg',
      subtitle: 'Poulets bicyclettes fermiers plein air, coqs reproducteurs et prêt-à-cuire',
    },
    poulets: {
      image: '/uploads/poulets-plein-air-ferme.jpg',
      subtitle: 'Poulets bicyclettes fermiers plein air, coqs reproducteurs et prêt-à-cuire',
    },
    'cabris-et-chevres': {
      image: '/uploads/cabri-djallonke-pie-noir.jpg',
      subtitle: 'Cabris et chèvres Djallonké rustiques tachetés noir et blanc',
    },
    cabris: {
      image: '/uploads/cabri-djallonke-pie-noir.jpg',
      subtitle: 'Cabris et chèvres Djallonké rustiques tachetés noir et blanc',
    },
    poussins: {
      image: '/uploads/poussiniere-mangeoire-abreuvoir.jpg',
      subtitle: 'Poussins et jeunes poulettes démarrés en poussinière',
    },
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-20 bg-[#F6F2E9]">
      {/* Données structurées SEO Google (Schema.org) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: settings.farmName,
            description: settings.tagline,
            telephone: settings.phone,
            email: settings.email,
            ...(settings.address
              ? {
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: settings.address,
                    addressCountry: 'BJ',
                  },
                }
              : {}),
            priceRange: 'FCFA',
            openingHours: settings.hours,
            url: 'https://elevage-map.com',
          }),
        }}
      />

      {/* ========================================================
          3. SECTION HERO : IMMERSION & DIRECTION ARTISTIQUE VERT FORÊT
      ======================================================== */}
      <section className="relative overflow-hidden bg-[#234B35] text-[#FCFBF7] pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#1b3c2a]">
        {/* Motif d'arrière-plan discret */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A3C9A8_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Colonne gauche : Titre, présentation et boutons */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              {/* Badge d'authenticité */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b3c2a] border border-[#3d6e50] text-[#A3C9A8] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#A3C9A8]" />
                <span>Vendeur unique & Vente directe exclusive</span>
              </div>

              {/* Titre exact demandé */}
              <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-serif font-black tracking-tight leading-[1.15] text-white">
                {settings.heroTitle || 'Commandez vos grillards si vous désirez gagner du temps dans vos préparations, rapide et bien fait !'}
              </h1>

              {/* Courte description */}
              <p className="text-sm sm:text-base text-[#FCFBF7]/90 leading-relaxed max-w-2xl font-normal">
                {settings.heroSubtitle ||
                  'Gagnez un temps précieux pour vos repas, cérémonies et réceptions avec nos grillards et volailles fermières préparés avec soin, hygiène et assaisonnements savoureux.'}
              </p>

              {/* Deux boutons conformes : Découvrir nos animaux et Nous contacter */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-[#557A46] hover:bg-[#456338] text-white font-bold text-xs uppercase tracking-wider shadow-md transition transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E9F3EB]" />
                  <span>Découvrir nos animaux</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#1b3c2a] hover:bg-[#152e20] text-[#FCFBF7] border border-[#3d6e50] font-bold text-xs uppercase tracking-wider transition"
                >
                  <span>Nous contacter</span>
                </Link>
              </div>

              {/* Garanties clés de l'élevage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-[#315d43] text-xs text-[#FCFBF7]/85">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A3C9A8] shrink-0" />
                  <span>Suivi sanitaire rigoureux</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A3C9A8] shrink-0" />
                  <span>Alimentation naturelle</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A3C9A8] shrink-0" />
                  <span>Prix directs producteur</span>
                </div>
              </div>
            </div>

            {/* Colonne droite : Grande photographie d'élevage immersive */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-[#315d43] aspect-[4/3] sm:aspect-square bg-[#1b3c2a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    settings.heroImage ||
                    '/uploads/grillades-barbecue-ferme.webp'
                  }
                  alt="Commandez vos grillards si vous désirez gagner du temps dans vos préparations, rapide et bien fait !"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Badge sur la photo */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#FCFBF7]/95 backdrop-blur-md p-4 rounded-2xl text-[#292D29] border border-[#ECE6D9] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A6246] tracking-wider block">
                        Viandes & Grillades Fermières
                      </span>
                      <p className="font-serif font-extrabold text-[#234B35] text-sm">
                        Grillards prêts à cuire — Rapide & bien fait
                      </p>
                    </div>
                    <span className="text-2xl">🔥</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. SECTION CATÉGORIES : TROIS GRANDES CARTES ILLUSTRÉES
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A6246]">
            Nos spécialités d'élevage
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#234B35] mt-1.5">
            Explorez notre cheptel par catégorie
          </h2>
          <p className="text-xs sm:text-sm text-[#292D29]/75 mt-2.5 font-normal">
            Sélectionnées avec soin pour leur vitalité, leur rusticité et leur excellent potentiel de reproduction ou d'engraissement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const meta = categoryMedia[cat.slug] || {
              image: '/uploads/poulets-plein-air-ferme.jpg',
              subtitle: 'Animaux sains et vigoureux élevés dans le respect des normes.',
            };

            return (
              <Link
                key={cat.id}
                href={`/boutique?category=${cat.slug}`}
                className="group bg-[#FCFBF7] rounded-3xl overflow-hidden border border-[#ECE6D9] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photographie immersive de la catégorie */}
                  <div className="aspect-[16/10] bg-[#ECE6D9] overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={meta.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <span className="absolute bottom-3 left-4 text-white font-serif font-bold text-lg drop-shadow-sm">
                      {cat.name}
                    </span>
                  </div>

                  <div className="p-6 space-y-2">
                    <p className="text-xs text-[#292D29]/75 leading-relaxed">
                      {cat.description || meta.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-[#ECE6D9] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#234B35] bg-[#E9F3EB] px-3 py-1 rounded-full border border-[#bedfc9]">
                      {cat._count.animals} sujet(s) disponible(s)
                    </span>
                    <span className="text-[#8A6246] group-hover:text-[#234B35] group-hover:translate-x-1 transition font-bold flex items-center gap-1">
                      <span>Voir le cheptel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          5. ANIMAUX DISPONIBLES : GRILLE DE QUATRE ANNONCES
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6246]">
              Disponibilités immédiates
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#234B35] mt-1">
              Animaux prêts pour votre élevage
            </h2>
          </div>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#234B35] hover:text-[#557A46] transition"
          >
            <span>Consulter tout le catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {animals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                whatsappNumber={settings.whatsappNumber}
                currency={settings.currency}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FCFBF7] rounded-3xl border border-[#ECE6D9] p-8">
            <span className="text-4xl block mb-2">🌿</span>
            <h3 className="font-serif font-bold text-[#292D29] text-lg">
              Aucun animal n'est actuellement disponible
            </h3>
            <p className="text-xs text-[#292D29]/60 mt-1">
              De nouveaux sujets seront bientôt enregistrés par l'éleveur.
            </p>
          </div>
        )}
      </section>

      {/* ========================================================
          6. PRÉSENTATION DE L'ÉLEVEUR
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FCFBF7] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#ECE6D9] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Photographie officielle du responsable et de l'exploitation */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] shadow-xl border-4 border-[#557A46]/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/responsable.jpg"
                  alt="Responsable d'exploitation - Ferme MAP"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#FCFBF7]/95 backdrop-blur-sm p-4 rounded-2xl text-xs text-[#292D29] border border-[#ECE6D9] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif font-black text-sm text-[#234B35]">
                        Responsable d'exploitation
                      </p>
                      <p className="text-[11px] text-[#8A6246] font-semibold">
                        Fondateur & Sélectionneur {settings.farmName}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E9F3EB] text-[#234B35] text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-[#557A46]" />
                      Certifié
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Texte de présentation et bouton En savoir plus */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A6246]">
                À propos de l'éleveur
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#234B35] leading-tight">
                Un engagement quotidien pour la santé et la vigueur de chaque sujet
              </h2>
              <p className="text-xs sm:text-sm text-[#292D29]/80 leading-relaxed font-normal">
                {settings.aboutText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#F6F2E9] p-4 rounded-2xl border border-[#ECE6D9]">
                  <h4 className="font-bold text-xs text-[#234B35] mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#557A46]" />
                    <span>Sélection et suivi</span>
                  </h4>
                  <p className="text-[11px] text-[#292D29]/75">
                    Races adaptées au climat local avec un protocole de prophylaxie et d'hygiène rigoureux.
                  </p>
                </div>

                <div className="bg-[#F6F2E9] p-4 rounded-2xl border border-[#ECE6D9]">
                  <h4 className="font-bold text-xs text-[#234B35] mb-1 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-[#557A46]" />
                    <span>Conseils personnalisés</span>
                  </h4>
                  <p className="text-[11px] text-[#292D29]/75">
                    Accompagnement de l'acquéreur pour la transition alimentaire et la conduite d'élevage.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/a-propos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#234B35] hover:bg-[#1b3c2a] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition"
                >
                  <span>En savoir plus sur notre histoire</span>
                  <ArrowRight className="w-4 h-4 text-[#A3C9A8]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. RÉALISATIONS : GALERIE DE PHOTOGRAPHIES DE L'EXPLOITATION
      ======================================================== */}
      {projects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A6246]">
                Transparence & Installations
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#234B35] mt-1">
                Nos réalisations en images
              </h2>
            </div>
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#234B35] hover:text-[#557A46] transition"
            >
              <span>Voir tout le portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#FCFBF7] rounded-3xl overflow-hidden border border-[#ECE6D9] shadow-xs hover:shadow-md transition flex flex-col group"
              >
                <div className="aspect-[16/10] bg-[#ECE6D9] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {proj.category && (
                    <span className="absolute top-3.5 left-3.5 bg-[#234B35]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {proj.category}
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {proj.eventDate && (
                      <span className="text-[11px] text-[#8A6246] font-semibold block mb-1">
                        {formatDate(proj.eventDate)}
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-base text-[#292D29] group-hover:text-[#234B35] transition">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[#292D29]/75 mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          8. ACTUALITÉS ET CONSEILS
      ======================================================== */}
      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A6246]">
                Partage d'expérience
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-[#234B35] mt-1">
                Actualités et conseils d'élevage
              </h2>
            </div>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#234B35] hover:text-[#557A46] transition"
            >
              <span>Lire tous les articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/actualites/${art.slug}`}
                className="bg-[#FCFBF7] rounded-3xl overflow-hidden border border-[#ECE6D9] shadow-xs hover:shadow-md transition flex flex-col group"
              >
                {art.coverImage && (
                  <div className="aspect-[16/9] bg-[#ECE6D9] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8A6246] font-semibold mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(art.createdAt)}</span>
                      {art.category && (
                        <span className="text-[#234B35] font-bold">• {art.category}</span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#292D29] group-hover:text-[#234B35] transition line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-[#292D29]/75 mt-2 line-clamp-3 leading-relaxed">
                      {art.excerpt || art.content.slice(0, 140)}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#ECE6D9] text-xs text-[#234B35] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                    <span>Lire le guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          9. TÉMOIGNAGES : MASQUÉ SI AUCUN AVIS RÉEL N'EST DISPONIBLE
          (Conformément à la consigne stricte : ne rien inventer)
      ======================================================== */}

      {/* ========================================================
          10. APPEL À L'ACTION : « UN ANIMAL VOUS INTÉRESSE ? »
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#234B35] text-[#FCFBF7] rounded-3xl p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-xl text-center space-y-6 border border-[#1b3c2a]">
          {/* Motif subtil d'arrière-plan */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#A3C9A8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="max-w-2xl mx-auto relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A3C9A8]">
              Contact direct & Commandes
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white leading-tight">
              Un animal vous intéresse ?
            </h2>
            <p className="text-xs sm:text-sm text-[#FCFBF7]/90 leading-relaxed font-normal">
              Que ce soit pour enrichir votre cheptel, acquérir des reproducteurs sélectionnés ou commander des volailles fermières, nous répondons directement à vos besoins avec transparence et disponibilité.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#557A46] hover:bg-[#436335] text-white font-bold text-xs uppercase tracking-wider shadow-md transition transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4 text-[#E9F3EB]" />
                <span>Accéder au catalogue</span>
              </Link>

              <a
                href={whatsappHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#1b3c2a] hover:bg-[#152e20] text-white border border-[#3d6e50] font-bold text-xs uppercase tracking-wider transition"
              >
                <MessageCircle className="w-4 h-4 text-[#A3C9A8]" />
                <span>Discuter sur WhatsApp</span>
              </a>
            </div>

            {settings.phone && (
              <p className="text-xs text-[#FCFBF7]/70 pt-2">
                Ou contactez-nous directement par téléphone au{' '}
                <a
                  href={`tel:${settings.phone}`}
                  className="font-bold text-white hover:underline"
                >
                  {settings.phone}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
