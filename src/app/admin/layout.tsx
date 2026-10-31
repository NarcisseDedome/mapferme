import { getAdminSessionFromCookies } from '@/lib/auth';
import { getSiteSettings } from '@/lib/settings';
import AdminLayoutClient from './AdminLayoutClient';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';

  const user = await getAdminSessionFromCookies();

  // If on login route, render children directly without admin shell
  // We can also let the client component or page handle login form
  if (!user) {
    // If user is not authenticated, let them visit login page, otherwise redirect to login
    return <div className="min-h-screen bg-warm-50">{children}</div>;
  }

  const settings = await getSiteSettings();

  return (
    <AdminLayoutClient user={user} farmName={settings.farmName}>
      {children}
    </AdminLayoutClient>
  );
}
