import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, ShieldCheck } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';
import { LogoIcon } from '@/components/Logo';

interface FooterProps {
  settings: {
    farmName: string;
    tagline: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    address: string;
    hours: string;
    facebookUrl?: string | null;
    youtubeUrl?: string | null;
    instagramUrl?: string | null;
  };
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    `Bonjour ${settings.farmName}, je vous contacte depuis votre site web.`
  );

  return (
    <footer className="bg-[#1b3c2a] text-[#FCFBF7] border-t border-[#234B35] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 : Logo & Description de l'élevage */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#557A46] shadow-sm ring-2 ring-white/10 bg-[#234B35]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/responsable.jpg"
                    alt="Responsable - Ferme MAP"
                    className="w-full h-full object-cover object-top scale-110"
                  />
                </div>
              </div>
              <LogoIcon className="w-11 h-11 shrink-0" />
              <div>
                <span className="font-serif font-black text-xl text-white tracking-tight block">
                  {settings.farmName}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#A3C9A8] tracking-wider block">
                  Élevage Agropastoral
                </span>
              </div>
            </div>
            <p className="text-xs text-[#FCFBF7]/80 leading-relaxed font-normal">
              {settings.tagline}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] text-[#A3C9A8] bg-[#234B35]/70 px-3 py-1.5 rounded-xl border border-[#2e5b41]">
                ✓ Élevage professionnel en vente directe exclusive par le propriétaire
              </span>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3 pt-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#234B35] hover:bg-[#557A46] text-white flex items-center justify-center text-xs font-bold transition border border-[#2e5b41]"
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
                  className="w-8 h-8 rounded-lg bg-[#234B35] hover:bg-[#557A46] text-white flex items-center justify-center text-xs font-bold transition border border-[#2e5b41]"
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
                  className="w-8 h-8 rounded-lg bg-[#234B35] hover:bg-[#557A46] text-white flex items-center justify-center text-xs font-bold transition border border-[#2e5b41]"
                  title="YouTube"
                >
                  YT
                </a>
              )}
            </div>
          </div>

          {/* Col 2 : Navigation rapide */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3C9A8] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FCFBF7]/80">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="hover:text-white transition">
                  Nos animaux (Catalogue)
                </Link>
              </li>
              <li>
                <Link href="/realisations" className="hover:text-white transition">
                  Nos réalisations
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-white transition">
                  Actualités & conseils
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-white transition">
                  À propos de l'éleveur
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/commander" className="hover:text-white transition font-semibold text-[#A3C9A8]">
                  → Commander un animal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Notre Cheptel */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3C9A8] mb-4">
              Notre Cheptel
            </h3>
            <ul className="space-y-2.5 text-xs text-[#FCFBF7]/80">
              <li>
                <Link href="/boutique?category=lapins" className="hover:text-white transition flex items-center gap-2">
                  <span>🐇</span> Lapins de race et de chair
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=poulets" className="hover:text-white transition flex items-center gap-2">
                  <span>🐔</span> Poulets & volailles fermières
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=cabris" className="hover:text-white transition flex items-center gap-2">
                  <span>🐐</span> Cabris, boucs et chèvres sahéliens
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/boutique" className="text-[11px] text-[#A3C9A8] font-bold hover:underline inline-block">
                  → Consulter toutes les disponibilités
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 : Coordonnées */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A3C9A8] mb-4">
              Coordonnées
            </h3>
            {settings.address && (
              <div className="flex items-start gap-2.5 text-xs text-[#FCFBF7]/80">
                <MapPin className="w-3.5 h-3.5 text-[#A3C9A8] mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </div>
            )}
            <div className="flex items-start gap-2.5 text-xs text-[#FCFBF7]/80">
              <Phone className="w-3.5 h-3.5 text-[#A3C9A8] mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                {settings.phone.split('/').map((num) => {
                  const cleanNum = num.trim();
                  const telLink = cleanNum.replace(/[\s-]/g, '');
                  return (
                    <a
                      key={cleanNum}
                      href={`tel:${telLink}`}
                      className="hover:text-white font-medium"
                      title={`Appeler le ${cleanNum}`}
                    >
                      {cleanNum}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#FCFBF7]/80">
              <Mail className="w-3.5 h-3.5 text-[#A3C9A8] shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#FCFBF7]/80">
              <Clock className="w-3.5 h-3.5 text-[#A3C9A8] mt-0.5 shrink-0" />
              <span>{settings.hours}</span>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#557A46] hover:bg-[#436335] text-white text-xs font-bold transition shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barre inférieure légale */}
        <div className="border-t border-[#234B35] pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FCFBF7]/60">
          <p>© {currentYear} {settings.farmName}. Vente exclusive par le propriétaire. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <Link href="/a-propos" className="hover:text-white transition">
              Mentions légales & déontologie
            </Link>
            <Link href="/admin" className="flex items-center gap-1 hover:text-white transition text-[#A3C9A8]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Espace Propriétaire</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
