import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminCategoriesClient from './AdminCategoriesClient';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  let categories: any[] = [];
  try {
    categories = await prisma.animalCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { animals: true },
        },
      },
    });
  } catch (err) {
    console.error('AdminCategoriesPage fetch error:', err);
  }

  return <AdminCategoriesClient initialCategories={categories as any} />;
}
