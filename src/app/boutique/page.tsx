import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import BoutiqueClient from './BoutiqueClient';

export const revalidate = 0;

interface PageProps {
  searchParams: {
    category?: string;
  };
}

export default async function BoutiquePage({ searchParams }: PageProps) {
  const settings = await getSiteSettings();

  const categories = await prisma.animalCategory.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, slug: true },
  });

  const animals = await prisma.animal.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const defaultCategory = searchParams.category || 'ALL';

  return (
    <div className="pb-20 space-y-10">
      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Catalogue & Vente Directe
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Nos Animaux Disponibles
          </h1>
          <p className="text-forest-100 text-sm sm:text-base max-w-xl mx-auto">
            Consultez nos lapins, volailles et cabris élevés naturellement. Commandez en ligne ou contactez-nous directement sur WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Catalog with Interactive Client Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BoutiqueClient
          initialAnimals={animals as any}
          categories={categories}
          whatsappNumber={settings.whatsappNumber}
          defaultCategory={defaultCategory}
          currency={settings.currency}
        />
      </section>
    </div>
  );
}
