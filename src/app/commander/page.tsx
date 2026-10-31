import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import CommanderClient from './CommanderClient';

export const revalidate = 0;

interface PageProps {
  searchParams: {
    animalId?: string;
  };
}

export default async function CommanderPage({ searchParams }: PageProps) {
  const settings = await getSiteSettings();

  let animals: any[] = [];
  try {
    animals = await prisma.animal.findMany({
      where: {
        isPublished: true,
        status: 'DISPONIBLE',
        stock: { gt: 0 },
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Database connection error in CommanderPage:', err);
  }

  return (
    <CommanderClient
      animals={animals as any}
      initialAnimalId={searchParams.animalId}
      currency={settings.currency}
    />
  );
}
