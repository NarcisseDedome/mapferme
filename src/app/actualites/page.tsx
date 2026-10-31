import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function ActualitesPage() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('ActualitesPage fetch error:', err);
  }

  return (
    <div className="pb-20 space-y-10">
      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Conseils pratiques & Actualités
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Conseils d'Élevage
          </h1>
          <p className="text-forest-100 text-sm sm:text-base max-w-xl mx-auto">
            Retrouvez les conseils du propriétaire sur l'alimentation, la santé des animaux, les soins quotidiens et les nouvelles de l'élevage.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Link
                key={art.id}
                href={`/actualites/${art.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-warm-200/90 shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {art.coverImage && (
                  <div className="aspect-[16/9] bg-stone-100 overflow-hidden">
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
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(art.createdAt)}</span>
                      {art.category && (
                        <span className="text-forest-700 font-semibold">• {art.category}</span>
                      )}
                    </div>
                    <h2 className="font-bold text-lg text-stone-900 group-hover:text-forest-800 transition line-clamp-2 leading-snug">
                      {art.title}
                    </h2>
                    <p className="text-xs text-stone-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {art.excerpt || art.content.slice(0, 150)}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-warm-100 text-xs font-bold text-forest-800 flex items-center gap-1 group-hover:translate-x-1 transition">
                    <span>Lire le guide complet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-warm-200 p-8">
            <p className="text-stone-500 text-sm">Aucun article publié pour le moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
