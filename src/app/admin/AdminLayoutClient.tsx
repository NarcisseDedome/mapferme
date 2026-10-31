'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PawPrint,
  FolderTree,
  ShoppingBag,
  Image as ImageIcon,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
} from 'lucide-react';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  farmName: string;
}

export default function AdminLayoutClient({
  children,
  user,
  farmName,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuItems = [
    { label: 'Vue d’ensemble', href: '/admin', icon: LayoutDashboard },
    { label: 'Animaux & Annonces', href: '/admin/animaux', icon: PawPrint },
    { label: 'Catégories', href: '/admin/categories', icon: FolderTree },
    { label: 'Commandes', href: '/admin/commandes', icon: ShoppingBag },
    { label: 'Réalisations (Portfolio)', href: '/admin/realisations', icon: ImageIcon },
    { label: 'Conseils & Actualités', href: '/admin/actualites', icon: BookOpen },
    { label: 'Messages reçus', href: '/admin/messages', icon: MessageSquare },
    { label: 'Paramètres du site', href: '/admin/parametres', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-forest-950 text-white px-4 py-3.5 flex items-center justify-between border-b border-forest-900 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-400 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/responsable.jpg"
              alt="Responsable"
              className="w-full h-full object-cover object-top scale-110"
            />
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight">Administration</span>
            <span className="text-[10px] text-forest-300 block">{farmName}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-forest-200 hover:text-white hover:bg-forest-900"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile slideout) */}
      <aside
        className={`fixed lg:sticky top-0 z-30 h-screen w-72 bg-forest-950 text-warm-100 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 flex-1 overflow-y-auto">
          {/* Logo & Farm Name avec photo du responsable */}
          <div className="pb-6 mb-6 border-b border-forest-900">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 shadow ring-2 ring-emerald-500/20 bg-forest-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/responsable.jpg"
                    alt="Responsable d'exploitation"
                    className="w-full h-full object-cover object-top scale-110"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-forest-950 rounded-full" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm text-white truncate leading-tight">
                  {farmName}
                </h2>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Espace Propriétaire
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
                    active
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-forest-200 hover:bg-forest-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout footer */}
        <div className="p-4 border-t border-forest-900 bg-forest-950/80 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-forest-300 truncate">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-forest-200 hover:text-white transition"
              title="Ouvrir le site public"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Voir le site</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{loggingOut ? '...' : 'Quitter'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full">
        {children}
      </main>
    </div>
  );
}
