import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ slug: params.slug }, { id: params.slug }],
      },
    });

    if (!article) return { title: 'Article introuvable' };

    return {
      title: article.title,
      description: article.excerpt || article.content.slice(0, 160),
      openGraph: {
        title: article.title,
        description: article.excerpt || article.content.slice(0, 160),
        images: article.coverImage ? [{ url: article.coverImage }] : [],
      },
    };
  } catch (err) {
    return { title: 'Article' };
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = params;

  let article = null;
  let otherArticles: any[] = [];

  try {
    article = await prisma.article.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isPublished: true,
      },
    });

    if (article) {
      // Incrémenter le nombre de vues de l'article
      await prisma.article.update({
        where: { id: article.id },
        data: { viewsCount: { increment: 1 } },
      }).catch((err) => console.error('Erreur incrémentation vues article:', err));

      // Fetch 2 other articles
      otherArticles = await prisma.article.findMany({
        where: {
          id: { not: article.id },
          isPublished: true,
        },
        take: 2,
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (err) {
    console.error('ArticleDetailPage fetch error:', err);
  }

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        href="/actualites"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:text-forest-950 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux conseils & actualités</span>
      </Link>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-xs text-stone-500">
          {article.category && (
            <span className="bg-forest-100 text-forest-900 font-bold px-3 py-1 rounded-full">
              {article.category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(article.createdAt)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-base sm:text-lg text-stone-600 font-medium leading-relaxed italic border-l-4 border-forest-600 pl-4 py-1">
            {article.excerpt}
          </p>
        )}
      </header>

      {/* Cover image */}
      {article.coverImage && (
        <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-stone-100 shadow-sm border border-warm-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line py-4">
        {article.content}
      </div>

      {/* Breeder Signature */}
      <div className="bg-warm-100/80 p-6 rounded-3xl border border-warm-200 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center text-xl shrink-0">
          🌾
        </div>
        <div>
          <h4 className="font-bold text-stone-900 text-sm">Conseil rédigé par l'éleveur</h4>
          <p className="text-xs text-stone-600">
            Éleveur passionné, disponible pour répondre à vos questions et vous orienter lors de l'acquisition de vos sujets.
          </p>
        </div>
      </div>

      {/* Other articles */}
      {otherArticles.length > 0 && (
        <div className="pt-10 border-t border-warm-200 space-y-4">
          <h3 className="text-base font-bold text-stone-900">À lire également</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherArticles.map((item) => (
              <Link
                key={item.id}
                href={`/actualites/${item.slug}`}
                className="p-4 rounded-2xl bg-white border border-warm-200 hover:border-forest-400 transition flex flex-col justify-between"
              >
                <h4 className="font-bold text-sm text-stone-900 hover:text-forest-800 transition">
                  {item.title}
                </h4>
                <span className="text-[11px] text-stone-400 mt-2 block">
                  {formatDate(item.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
