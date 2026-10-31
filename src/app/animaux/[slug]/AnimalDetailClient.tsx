'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  ArrowLeft,
  Share2,
  Eye,
} from 'lucide-react';
import { formatPrice, formatDate, buildWhatsAppLink } from '@/lib/utils';
import OrderModal from '@/components/OrderModal';
import { AnimalCardData } from '@/components/AnimalCard';

interface AnimalDetailClientProps {
  animal: AnimalCardData & {
    createdAt: string | Date;
    category: { id: string; name: string; slug: string };
    images: Array<{ id: string; url: string; isPrimary: boolean }>;
  };
  whatsappNumber: string;
  currency?: string;
  relatedAnimals?: AnimalCardData[];
}

export default function AnimalDetailClient({
  animal,
  whatsappNumber,
  currency = 'FCFA',
  relatedAnimals = [],
}: AnimalDetailClientProps) {
  const images = animal.images && animal.images.length > 0
    ? animal.images
    : [{ id: 'fallback', url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=1000&q=80', isPrimary: true }];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAvailable = animal.status === 'DISPONIBLE' && animal.stock > 0;
  const isReserved = animal.status === 'RESERVE';
  const isSold = animal.status === 'VENDU';
  const isOutOfStock = animal.status === 'EPUISE' || (animal.stock <= 0 && !isSold);

  const formattedPrice = formatPrice(animal.price, currency);

  const whatsappMessage = `Bonjour, je suis intéressé(e) par l'annonce suivante :
- Animal : ${animal.title}
- Réf : ${animal.id.substring(0, 8).toUpperCase()}
- Prix : ${formattedPrice}
- Race : ${animal.race || 'Non spécifiée'}
Pouvez-vous me confirmer sa disponibilité et les modalités de livraison/retrait ?`;

  const whatsappUrl = buildWhatsAppLink(whatsappNumber, whatsappMessage);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        if (navigator.share) {
          await navigator.share({
            title: animal.title,
            text: `Découvrez ${animal.title} sur notre élevage`,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 3000);
        }
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-1.5 font-semibold text-forest-800 hover:text-forest-950 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-stone-600 hover:text-forest-800 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Lien copié !' : 'Partager'}</span>
        </button>
      </div>

      {/* Main product view: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-warm-200/90 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeImageIndex]?.url || images[0].url}
              alt={animal.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {animal.category && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-forest-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                {animal.category.name}
              </span>
            )}
            <div className="absolute top-4 right-4">
              {isAvailable && (
                <span className="badge-available text-sm px-3 py-1 shadow-sm">
                  Disponible ({animal.stock} en stock)
                </span>
              )}
              {isReserved && <span className="badge-reserved text-sm px-3 py-1 shadow-sm">Réservé</span>}
              {isSold && <span className="badge-sold text-sm px-3 py-1 shadow-sm">Vendu</span>}
              {isOutOfStock && <span className="badge-out-of-stock text-sm px-3 py-1 shadow-sm">Épuisé</span>}
            </div>
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-forest-700 shadow-md scale-105'
                      : 'border-warm-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Animal Details & Purchase Panel */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-warm-200/90 shadow-sm space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-500 mb-2">
              <span className="inline-flex items-center gap-1 text-stone-400">
                <Calendar className="w-3.5 h-3.5" />
                Publié le {formatDate(animal.createdAt)}
              </span>
              <span>• Réf : {animal.id.substring(0, 8).toUpperCase()}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-100/80">
                <Eye className="w-3.5 h-3.5 text-forest-600" />
                {animal.viewsCount || 0} consultations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              {animal.title}
            </h1>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-stone-500 block font-medium">Prix unitaire</span>
              <span className="text-2xl sm:text-3xl font-black text-forest-900 tracking-tight">
                {formattedPrice}
              </span>
            </div>
            {isAvailable && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ✓ Prêt pour livraison / retrait
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            {isAvailable ? (
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <span>Commander maintenant</span>
              </button>
            ) : (
              <div className="w-full py-3 px-6 rounded-2xl bg-stone-100 text-stone-400 font-semibold text-sm text-center">
                Actuellement indisponible à la vente
              </div>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-2xl border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>Contacter le vendeur sur WhatsApp</span>
            </a>
          </div>

          {/* Specifications table */}
          <div className="pt-4 border-t border-warm-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Caractéristiques du sujet
            </h3>
            <div className="divide-y divide-warm-100 text-xs">
              {animal.race && (
                <div className="py-2 flex justify-between">
                  <span className="text-stone-500 font-medium">Race</span>
                  <span className="font-semibold text-stone-800">{animal.race}</span>
                </div>
              )}
              {animal.age && (
                <div className="py-2 flex justify-between">
                  <span className="text-stone-500 font-medium">Âge</span>
                  <span className="font-semibold text-stone-800">{animal.age}</span>
                </div>
              )}
              {animal.sex && (
                <div className="py-2 flex justify-between">
                  <span className="text-stone-500 font-medium">Sexe</span>
                  <span className="font-semibold text-stone-800">{animal.sex}</span>
                </div>
              )}
              {animal.weight && (
                <div className="py-2 flex justify-between">
                  <span className="text-stone-500 font-medium">Poids</span>
                  <span className="font-semibold text-stone-800">{animal.weight}</span>
                </div>
              )}
              <div className="py-2 flex justify-between">
                <span className="text-stone-500 font-medium">Quantité en stock</span>
                <span className="font-semibold text-stone-800">{animal.stock} unité(s)</span>
              </div>
              {animal.location && (
                <div className="py-2 flex justify-between">
                  <span className="text-stone-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    Localisation
                  </span>
                  <span className="font-semibold text-stone-800">{animal.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="bg-[#E9F3EB] p-4 rounded-2xl border border-[#bedfc9] space-y-2.5 text-xs text-[#234B35]">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
              <ShieldCheck className="w-4 h-4 text-[#557A46] shrink-0" />
              <span>Garanties & Suivi Zootechnique Ferme MAP</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#234B35]/90 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#557A46]" />
                Vermifugation à jour
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#557A46]" />
                Suivi vétérinaire
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#557A46]" />
                Alimentation saine
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#557A46]" />
                Conseils après-vente
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-warm-200/90 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Description détaillée</h2>
        <div className="prose prose-stone text-sm text-stone-700 leading-relaxed whitespace-pre-line">
          {animal.description}
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        animal={animal}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        currency={currency}
      />
    </div>
  );
}
