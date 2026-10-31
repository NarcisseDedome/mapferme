import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import AnimalDetailClient from './AnimalDetailClient';
import type { Metadata } from 'next';

export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const animal = await prisma.animal.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: { images: true },
  });

  if (!animal) {
    return { title: 'Animal introuvable' };
  }

  const primaryImg = animal.images.find((img) => img.isPrimary)?.url || animal.images[0]?.url;

  return {
    title: `${animal.title} - Vente directe`,
    description: animal.description.slice(0, 160),
    openGraph: {
      title: animal.title,
      description: animal.description.slice(0, 160),
      images: primaryImg ? [{ url: primaryImg }] : [],
    },
  };
}

export default async function AnimalDetailPage({ params }: PageProps) {
  const { slug } = params;
  const settings = await getSiteSettings();

  const animal = await prisma.animal.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isPublished: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!animal) {
    notFound();
  }

  // Incrémenter le nombre de vues de manière asynchrone
  await prisma.animal.update({
    where: { id: animal.id },
    data: { viewsCount: { increment: 1 } },
  }).catch((err) => console.error('Erreur incrémentation vues animal:', err));

  // Fetch related animals from same category
  const relatedAnimals = await prisma.animal.findMany({
    where: {
      categoryId: animal.categoryId,
      id: { not: animal.id },
      isPublished: true,
      status: 'DISPONIBLE',
    },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
    },
    take: 3,
  });

  return (
    <AnimalDetailClient
      animal={animal as any}
      whatsappNumber={settings.whatsappNumber}
      currency={settings.currency}
      relatedAnimals={relatedAnimals as any}
    />
  );
}
