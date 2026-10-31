import Link from 'next/link';
import { ShoppingBag, MessageCircle, ArrowRight, Eye } from 'lucide-react';
import { formatPrice, buildWhatsAppLink } from '@/lib/utils';

export interface AnimalCardData {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  status: string; // DISPONIBLE, RESERVE, VENDU, EPUISE
  viewsCount?: number;
  age?: string | null;
  race?: string | null;
  sex?: string | null;
  weight?: string | null;
  location?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

interface AnimalCardProps {
  animal: AnimalCardData;
  whatsappNumber: string;
  currency?: string;
  onOrderClick?: (animal: AnimalCardData) => void;
}

export default function AnimalCard({
  animal,
  whatsappNumber,
  currency = 'FCFA',
  onOrderClick,
}: AnimalCardProps) {
  const isAvailable = animal.status === 'DISPONIBLE' && animal.stock > 0;
  const isReserved = animal.status === 'RESERVE';
  const isSold = animal.status === 'VENDU';
  const isOutOfStock = animal.status === 'EPUISE' || (animal.stock <= 0 && !isSold);

  const primaryImg =
    animal.images?.find((img) => img.isPrimary)?.url ||
    animal.images?.[0]?.url ||
    '/uploads/poulets-plein-air-ferme.jpg';

  const formattedPrice = formatPrice(animal.price, currency);

  const whatsappMessage = `Bonjour, je suis intéressé(e) par votre annonce :
- Animal : ${animal.title}
- Réf : ${animal.id.substring(0, 8).toUpperCase()}
- Prix : ${formattedPrice}
- Race : ${animal.race || 'Non spécifiée'}
Pouvez-vous me confirmer sa disponibilité et les modalités de livraison/retrait ?`;

  const whatsappUrl = buildWhatsAppLink(whatsappNumber, whatsappMessage);

  return (
    <div className="bg-[#FCFBF7] rounded-3xl overflow-hidden border border-[#ECE6D9] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Photographie de l'animal avec badges */}
      <div className="relative aspect-[4/3] bg-[#F6F2E9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryImg}
          alt={animal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge Catégorie */}
        {animal.category && (
          <span className="absolute top-3.5 left-3.5 bg-[#FCFBF7]/95 backdrop-blur-xs text-[#234B35] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs border border-[#ECE6D9]">
            {animal.category.name}
          </span>
        )}

        {/* Badge Disponibilité */}
        <div className="absolute top-3.5 right-3.5">
          {isAvailable && (
            <span className="bg-[#E9F3EB] text-[#234B35] border border-[#bedfc9] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              Disponible ({animal.stock})
            </span>
          )}
          {isReserved && (
            <span className="bg-[#FEF6E9] text-[#8A6246] border border-[#dcc1b0] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              Réservé
            </span>
          )}
          {isSold && (
            <span className="bg-[#FDEEE9] text-[#A63C2E] border border-[#f3c8bf] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              Vendu
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#EFECE6] text-[#696C68] border border-[#D5D2CA] text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              Épuisé
            </span>
          )}
        </div>
      </div>

      {/* Contenu de l'annonce */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            href={`/animaux/${animal.slug}`}
            className="block text-base sm:text-lg font-serif font-bold text-[#292D29] hover:text-[#234B35] transition leading-snug mb-1.5"
          >
            {animal.title}
          </Link>

          {/* Caractéristiques rapides */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#292D29]/80 mb-3">
            {animal.race && (
              <span className="bg-[#F6F2E9] px-2.5 py-0.5 rounded-lg font-medium text-[#292D29] border border-[#ECE6D9]">
                {animal.race}
              </span>
            )}
            {animal.age && (
              <span className="bg-[#F6F2E9] px-2.5 py-0.5 rounded-lg text-[#292D29]/80 border border-[#ECE6D9]">
                {animal.age}
              </span>
            )}
            {animal.weight && (
              <span className="bg-[#F6F2E9] px-2.5 py-0.5 rounded-lg text-[#292D29]/80 border border-[#ECE6D9]">
                {animal.weight}
              </span>
            )}
            {animal.viewsCount !== undefined && animal.viewsCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#8A6246] font-semibold ml-auto">
                <Eye className="w-3 h-3 text-[#8A6246]" />
                {animal.viewsCount}
              </span>
            )}
          </div>

          {/* Description complète et soignée de l'animal en vente */}
          {animal.description && (
            <div className="mt-2.5 p-3 rounded-2xl bg-[#F6F2E9]/80 border border-[#ECE6D9] text-xs text-[#292D29]/90">
              <span className="text-[10px] uppercase font-bold text-[#8A6246] tracking-wider block mb-1">
                Description de l'animal :
              </span>
              <p className="line-clamp-3 leading-relaxed text-[#292D29]/85">
                {animal.description}
              </p>
            </div>
          )}
        </div>

        {/* Bloc Prix & Actions */}
        <div className="pt-3 border-t border-[#ECE6D9] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8A6246] block tracking-wider">
                Prix unitaire
              </span>
              <span className="text-xl font-extrabold text-[#234B35] tracking-tight">
                {formattedPrice}
              </span>
            </div>
            {animal.stock > 0 && isAvailable && (
              <span className="text-[11px] text-[#557A46] font-semibold">
                ✓ En stock ({animal.stock} u.)
              </span>
            )}
          </div>

          {/* Deux boutons d'action conformes : Voir détails et Commander */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/animaux/${animal.slug}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#234B35]/30 hover:border-[#234B35] text-[#234B35] hover:bg-[#F6F2E9] text-xs font-bold transition text-center"
            >
              <span>Voir détails</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isAvailable ? (
              <>
                {onOrderClick ? (
                  <button
                    onClick={() => onOrderClick(animal)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#234B35] hover:bg-[#1b3c2a] text-white text-xs font-bold shadow-2xs transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#A3C9A8]" />
                    <span>Commander</span>
                  </button>
                ) : (
                  <Link
                    href={`/commander?animalId=${animal.id}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#234B35] hover:bg-[#1b3c2a] text-white text-xs font-bold shadow-2xs transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#A3C9A8]" />
                    <span>Commander</span>
                  </Link>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-[#EFECE6] text-[#696C68] text-xs font-semibold cursor-not-allowed">
                Indisponible
              </div>
            )}
          </div>

          {/* Contact WhatsApp rapide */}
          <div className="text-center pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#557A46] hover:text-[#234B35] transition"
            >
              <MessageCircle className="w-3 h-3 text-[#557A46]" />
              <span>Contacter le vendeur sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
