import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminMessagesClient from './AdminMessagesClient';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  let messages: any[] = [];
  try {
    messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('AdminMessagesPage fetch error:', err);
  }

  return <AdminMessagesClient initialMessages={messages as any} />;
}
