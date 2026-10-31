import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminPortfolioClient from './AdminPortfolioClient';

export const revalidate = 0;

export default async function AdminPortfolioPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  let projects: any[] = [];
  try {
    projects = await prisma.portfolioProject.findMany({
      orderBy: { eventDate: 'desc' },
    });
  } catch (err) {
    console.error('AdminPortfolioPage fetch error:', err);
  }

  return <AdminPortfolioClient initialProjects={projects as any} />;
}
