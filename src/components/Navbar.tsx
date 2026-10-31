'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Menu,
  X,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';
import { LogoIcon } from '@/components/Logo';

interface NavbarProps {
  settings: {
    farmName: string;
    phone: string;
    whatsappNumber: string;
    hours: string;
    email?: string;
    address?: string;
    facebookUrl?: string | null;
    youtubeUrl?: string | null;
    instagramUrl?: string | null;
  };
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'Nos animaux', href: '/boutique' },
    { label: 'Nos réalisations', href: '/realisations' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    `Bonjour ${settings.farmName}, je visite votre site web et souhaite me renseigner.`
  );

  return (
    <header className="sticky top-0 z-50 bg-[#FCFBF7]/95 backdrop-blur-md border-b border-[#ECE6D9] shadow-xs transition-all">
      {/* 1. BARRE SUPÉRIEURE : BANDE VERT FORÊT (#234B35) */}
      <div className="bg-[#234B35] text-[#FCFBF7] text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          {/* Gauche : Téléphone, Email, Localisation */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] sm:text-xs">
            {settings.phone && (
              <div className="flex items-center gap-1.5 text-[#FCFBF7]/90">
                <Phone className="w-3.5 h-3.5 text-[#A3C9A8] shrink-0" />
                {settings.phone.split('/').map((num, idx, arr) => {
                  const cleanNum = num.trim();
                  const telLink = cleanNum.replace(/[\s-]/g, '');
                  return (
                    <span key={cleanNum} className="inline-flex items-center gap-1.5">
                      <a
                        href={`tel:${telLink}`}
                        className="hover:text-white transition font-medium"
                        title={`Appeler le ${cleanNum}`}
                      >
                        {cleanNum}
                      </a>
                      {idx < arr.length - 1 && <span className="text-[#A3C9A8]/60">/</span>}
                    </span>
                  );
                })}
              </div>
            )}

            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="hidden md:flex items-center gap-1.5 text-[#FCFBF7]/90 hover:text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-[#A3C9A8]" />
                <span>{settings.email}</span>
              </a>
            )}

            {settings.address && (
              <span className="hidden lg:flex items-center gap-1.5 text-[#FCFBF7]/80">
                <MapPin className="w-3.5 h-3.5 text-[#A3C9A8]" />
                <span className="truncate max-w-xs">{settings.address}</span>
              </span>
            )}
          </div>

          {/* Droite : Réseaux sociaux & Accès */}
          <div className="flex items-center gap-4 ml-auto text-[11px] sm:text-xs">
            {/* Réseaux sociaux configurés */}
            <div className="flex items-center gap-2.5">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FCFBF7]/80 hover:text-white transition text-xs font-bold"
                  title="Facebook"
                >
                  FB
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FCFBF7]/80 hover:text-white transition text-xs font-bold"
                  title="Instagram"
                >
                  IG
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FCFBF7]/80 hover:text-white transition text-xs font-bold"
                  title="YouTube"
                >
                  YT
                </a>
              )}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#557A46] hover:bg-[#436335] text-white px-2.5 py-1 rounded-full text-[11px] font-semibold transition"
            >
              <MessageCircle className="w-3 h-3 text-[#E9F3EB]" />
              <span>WhatsApp</span>
            </a>

            <Link
              href="/admin"
              className="flex items-center gap-1 text-[#FCFBF7]/70 hover:text-white transition pl-3 border-l border-[#2e5b41]"
              title="Accès administration"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION PRINCIPALE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Nom de la marque avec photo du responsable juste avant */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" title="Responsable d'exploitation - Ferme MAP">
            {/* Photo officielle du responsable */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#557A46] shadow-sm ring-2 ring-[#234B35]/20 group-hover:ring-[#557A46] group-hover:scale-105 transition-all duration-300 bg-[#234B35]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/responsable.jpg"
                  alt="Responsable d'exploitation - Ferme MAP"
                  className="w-full h-full object-cover object-top scale-110"
                />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
                title="Exploitation active & Éleveur joignable"
              />
            </div>

            {/* Logo vectoriel officiel */}
            <LogoIcon className="w-10 h-10 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-105 shrink-0" />

            {/* Nom & Sous-titre */}
            <div className="leading-tight">
              <span className="block font-serif font-black text-lg sm:text-2xl text-[#234B35] tracking-tight">
                {settings.farmName}
              </span>
              <span className="block text-[10px] sm:text-[11px] text-[#8A6246] font-bold tracking-wider uppercase">
                Élevage & Vente directe
              </span>
            </div>
          </Link>

          {/* Menu bureau : Accueil, Nos animaux, Nos réalisations, Actualités, À propos, Contact */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold transition ${
                    active
                      ? 'bg-[#E9F3EB] text-[#234B35] font-bold shadow-2xs'
                      : 'text-[#292D29] hover:text-[#234B35] hover:bg-[#F6F2E9]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Bouton COMMANDER */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/commander"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#234B35] hover:bg-[#1b3c2a] text-white text-xs font-bold shadow-xs transition transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#A3C9A8]" />
              <span>Commander</span>
            </Link>
          </div>

          {/* Bouton Hamburger Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/commander"
              className="p-2 rounded-xl bg-[#234B35] text-white"
              title="Commander"
            >
              <ShoppingBag className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#292D29] hover:text-[#234B35] hover:bg-[#F6F2E9] focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#ECE6D9] bg-[#FCFBF7] px-4 pt-3 pb-6 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-[#E9F3EB] text-[#234B35] font-bold'
                      : 'text-[#292D29] hover:bg-[#F6F2E9] hover:text-[#234B35]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-[#ECE6D9] flex flex-col gap-2.5">
              <Link
                href="/commander"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-[#234B35] text-white font-bold text-xs shadow flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#A3C9A8]" />
                Commander un animal
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 rounded-xl border border-[#557A46] text-[#234B35] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#E9F3EB]"
              >
                <MessageCircle className="w-4 h-4 text-[#557A46]" />
                Contacter sur WhatsApp
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs text-[#8A6246] hover:text-[#292D29] flex items-center justify-center gap-1 mt-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Accès réservé au propriétaire
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
