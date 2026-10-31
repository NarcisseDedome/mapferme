import { prisma } from '@/lib/prisma';
import RealisationClient from './RealisationClient';

export const revalidate = 0;

export default async function RealisationsPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { isPublished: true },
    orderBy: { eventDate: 'desc' },
  });

  return (
    <div className="pb-20 space-y-10">
      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Portfolio & Activités de l'élevage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Nos Réalisations
          </h1>
          <p className="text-forest-100 text-sm sm:text-base max-w-xl mx-auto">
            Découvrez nos installations, le suivi sanitaire de nos troupeaux, nos nouveaux aménagements et les événements de notre exploitation.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RealisationClient items={projects as any} />
      </section>
    </div>
  );
}
