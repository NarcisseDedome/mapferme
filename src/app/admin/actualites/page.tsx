import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminArticlesClient from './AdminArticlesClient';

export const revalidate = 0;

export default async function AdminArticlesPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <AdminArticlesClient initialArticles={articles as any} />;
}
