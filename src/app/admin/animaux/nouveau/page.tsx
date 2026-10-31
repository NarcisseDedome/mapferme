import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnimalForm from '@/components/AnimalForm';

export const revalidate = 0;

export default async function NewAnimalPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const categories = await prisma.animalCategory.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true },
  });

  return <AnimalForm categories={categories} />;
}
