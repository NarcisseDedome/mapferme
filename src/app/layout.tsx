import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSiteSettings } from '@/lib/settings';

export const viewport: Viewport = {
  themeColor: '#234B35',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: `${settings.farmName} | Élevage Professionnel & Vente Directe`,
      template: `%s | ${settings.farmName}`,
    },
    description: settings.tagline || settings.aboutText.slice(0, 160),
    manifest: '/manifest.json',
    icons: {
      icon: '/logo.svg',
      apple: '/logo.svg',
    },
    openGraph: {
      title: `${settings.farmName} - Élevage et vente d'animaux`,
      description: settings.tagline,
      images: settings.heroImage ? [{ url: settings.heroImage }] : ['/logo.svg'],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#1c281e] antialiased">
        <Navbar settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
