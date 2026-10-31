import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminCategoriesClient from './AdminCategoriesClient';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const categories = await prisma.animalCategory.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: { animals: true },
      },
    },
  });

  return <AdminCategoriesClient initialCategories={categories as any} />;
}
