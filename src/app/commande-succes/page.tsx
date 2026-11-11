import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/lib/settings';
import { CheckCircle2, MessageCircle, ShoppingBag, Phone, MapPin, Calendar, ShieldCheck } from 'lucide-react';
import { formatPrice, formatDate, buildWhatsAppLink } from '@/lib/utils';
import { getPreparationLabel } from '@/lib/preparation';
import PrintReceiptButton from '@/components/PrintReceiptButton';
import { LogoIcon } from '@/components/Logo';

export const revalidate = 0;

interface PageProps {
  searchParams: {
    orderNumber?: string;
  };
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { orderNumber } = searchParams;
  const settings = await getSiteSettings();

  let order = null;
  if (orderNumber) {
    try {
      order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });
    } catch (err) {
      console.error('OrderSuccessPage fetch error:', err);
    }
  }

  const orderItem = order?.items?.[0];
  const formattedTotal = order ? formatPrice(order.totalAmount, settings.currency) : '';

  const prepLabel = getPreparationLabel(order?.preparationOption);
  const prepFeeText = order?.preparationFee && order.preparationFee > 0
    ? ` (+${formatPrice(order.preparationFee, settings.currency)})`
    : ' (0 FCFA)';

  const whatsappMessage = order
    ? `Bonjour ${settings.farmName}, je viens de passer la commande n° *${order.orderNumber}* sur votre site :
- Client : ${order.customerName}
- Contact : ${order.customerPhone}
- Localité : ${order.customerLocation}
- Sujet : ${orderItem?.quantity}x ${orderItem?.animalName}
- Préparation : ${prepLabel}${prepFeeText}
- Total à régler : ${formattedTotal}
Pouvez-vous me confirmer sa prise en charge et le créneau de livraison/retrait ?`
    : `Bonjour ${settings.farmName}, je viens de valider une commande sur votre site web.`;

  const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, whatsappMessage);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Zone imprimable du reçu officiel */}
      <div className="bg-[#FCFBF7] rounded-3xl border border-[#ECE6D9] shadow-lg p-6 sm:p-10 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Entête du reçu avec Logo AYEKOBINOU SERVICE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#ECE6D9]">
          <div className="flex items-center gap-3">
            <LogoIcon className="w-12 h-12 shrink-0" />
            <div>
              <span className="font-serif font-black text-xl text-[#234B35] tracking-tight block">
                {settings.farmName}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#8A6246] tracking-wider block">
                Bon de commande & Réservation officielle
              </span>
            </div>
          </div>

          <div className="text-right text-[11px] text-[#292D29]/70 hidden sm:block">
            <p className="font-semibold text-[#292D29]">{settings.phone}</p>
            {settings.address && <p>{settings.address}</p>}
          </div>
        </div>

        {/* Statut de confirmation */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#E9F3EB] text-[#234B35] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#557A46] block">
            Commande validée avec succès
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#234B35]">
            Merci pour votre confiance !
          </h1>
          <p className="text-xs text-[#292D29]/75 max-w-md mx-auto">
            Votre commande a été enregistrée dans notre carnet de réservation. Les sujets sont mis de côté pour vous.
          </p>
        </div>

        {/* Détails complets du bon de commande */}
        {order && (
          <div className="bg-[#F6F2E9] rounded-2xl p-5 border border-[#ECE6D9] text-left space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6D9]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8A6246] block tracking-wider">
                  Référence unique
                </span>
                <span className="font-mono font-black text-base text-[#234B35]">
                  {order.orderNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#292D29]/60 block">Date</span>
                <span className="text-xs font-semibold text-[#292D29]">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            <div className="text-xs space-y-2 text-[#292D29]">
              <div className="flex justify-between">
                <span className="text-[#292D29]/60">Nom du client :</span>
                <span className="font-bold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#292D29]/60">Numéro de téléphone :</span>
                <span className="font-semibold">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#292D29]/60">Localisation / Ville :</span>
                <span className="font-semibold">{order.customerLocation}</span>
              </div>
              {order.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-[#292D29]/60">Modalité de livraison :</span>
                  <span className="font-semibold text-[#234B35]">{order.deliveryAddress}</span>
                </div>
              )}

              {/* Ligne article */}
              {orderItem && (
                <div className="pt-3 border-t border-[#ECE6D9] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#234B35]">
                      {orderItem.quantity} × {orderItem.animalName}
                    </span>
                    <span className="font-bold text-[#234B35]">
                      {formatPrice(orderItem.unitPrice * orderItem.quantity, settings.currency)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#292D29]/60">
                    Prix unitaire : {formatPrice(orderItem.unitPrice, settings.currency)}
                  </p>

                  {/* Option de préparation */}
                  <div className="flex justify-between items-center text-xs pt-1.5 border-t border-[#ECE6D9]/70">
                    <span className="text-[#292D29]/75 font-medium">
                      Préparation : <strong className="text-[#234B35]">{prepLabel}</strong>
                    </span>
                    <span className="font-bold text-[#234B35]">
                      {order.preparationFee > 0
                        ? `+${formatPrice(order.preparationFee, settings.currency)}`
                        : 'Inclus (0 FCFA)'}
                    </span>
                  </div>
                </div>
              )}

              {/* Total final */}
              <div className="flex justify-between pt-3 border-t-2 border-[#234B35] font-extrabold text-base text-[#234B35]">
                <span>Montant total à régler :</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            {/* Cachet officiel de l'élevage */}
            <div className="pt-3 border-t border-[#ECE6D9] flex items-center justify-between text-[10px] text-[#292D29]/70">
              <span className="flex items-center gap-1 font-semibold text-[#557A46]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Réservation garantie AYEKOBINOU SERVICE
              </span>
              <span>Règlement à la livraison ou au retrait</span>
            </div>
          </div>
        )}

        {/* Consigne de présentation du reçu */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block mb-0.5">Consigne obligatoire pour le retrait :</strong>
            <span>
              Téléchargez votre reçu officiel en PDF ci-dessous. Vous devrez le présenter (sur votre smartphone ou imprimé) lors de la remise de vos animaux.
            </span>
          </div>
        </div>

        {/* Bouton d'impression / téléchargement PDF */}
        <div className="flex justify-center print:hidden">
          <PrintReceiptButton
            orderData={
              order
                ? {
                    orderNumber: order.orderNumber,
                    createdAt: order.createdAt,
                    customerName: order.customerName,
                    customerPhone: order.customerPhone,
                    customerLocation: order.customerLocation,
                    deliveryAddress: order.deliveryAddress,
                    preparationOption: order.preparationOption,
                    preparationFee: order.preparationFee,
                    totalAmount: order.totalAmount,
                    items: order.items.map((i: any) => ({
                      animalName: i.animalName,
                      quantity: i.quantity,
                      unitPrice: i.unitPrice,
                    })),
                    farmName: settings.farmName,
                    phone: settings.phone,
                    email: settings.email,
                    currency: settings.currency,
                  }
                : undefined
            }
          />
        </div>

        {/* Étape WhatsApp recommandée */}
        <div className="bg-[#E9F3EB] rounded-2xl p-5 border border-[#bedfc9] text-left space-y-3 print:hidden">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-[#234B35] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[#234B35] uppercase tracking-wide">
                Confirmation instantanée sur WhatsApp
              </h4>
              <p className="text-xs text-[#292D29]/80 leading-relaxed">
                Transmettez votre numéro de commande en 1 clic au propriétaire sur WhatsApp afin de convenir du jour et de l'heure de retrait ou de livraison.
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-[#557A46] hover:bg-[#436335] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 text-center"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Transmettre ma commande sur WhatsApp</span>
          </a>
        </div>

        {/* Liens secondaires */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs print:hidden">
          <Link
            href="/boutique"
            className="px-5 py-2.5 rounded-xl border border-[#ECE6D9] text-[#292D29] hover:bg-[#F6F2E9] font-bold transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-[#8A6246]" />
            <span>Retourner à la boutique</span>
          </Link>
          <a
            href={`tel:${settings.phone}`}
            className="px-5 py-2.5 rounded-xl text-[#292D29]/80 hover:text-[#234B35] font-semibold transition flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-[#557A46]" />
            <span>Appeler le vendeur ({settings.phone})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
