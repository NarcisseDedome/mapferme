import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSiteSettings } from '@/lib/settings';
import AdminSettingsClient from './AdminSettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) redirect('/admin/login');

  const settings = await getSiteSettings();

  return <AdminSettingsClient initialSettings={settings as any} />;
}
