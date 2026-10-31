import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elevage-map.com';

  // Pages statiques principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/boutique`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/commander`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/realisations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/actualites`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    // Annonces d'animaux publiées
    const animals = await prisma.animal.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    const animalRoutes: MetadataRoute.Sitemap = animals.map((a) => ({
      url: `${baseUrl}/animaux/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    // Articles et conseils publiés
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
      url: `${baseUrl}/actualites/${art.slug}`,
      lastModified: art.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

    return [...staticRoutes, ...animalRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
