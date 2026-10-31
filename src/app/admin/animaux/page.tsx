import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSiteSettings } from '@/lib/settings';
import AdminAnimalsClient from './AdminAnimalsClient';

export const revalidate = 0;

export default async function AdminAnimalsPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const settings = await getSiteSettings();

  let animals: any[] = [];
  try {
    animals = await prisma.animal.findMany({
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('AdminAnimalsPage fetch error:', err);
  }

  return (
    <AdminAnimalsClient
      initialAnimals={animals as any}
      currency={settings.currency}
    />
  );
}
