import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSiteSettings } from '@/lib/settings';
import AdminOrdersClient from './AdminOrdersClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const settings = await getSiteSettings();

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminOrdersClient
      initialOrders={orders as any}
      currency={settings.currency}
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
