import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminPortfolioClient from './AdminPortfolioClient';

export const revalidate = 0;

export default async function AdminPortfolioPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const projects = await prisma.portfolioProject.findMany({
    orderBy: { eventDate: 'desc' },
  });

  return <AdminPortfolioClient initialProjects={projects as any} />;
}
