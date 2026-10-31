import { getSiteSettings } from '@/lib/settings';
import ContactClient from './ContactClient';

export const revalidate = 0;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pb-20 space-y-10">
      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Échange direct sans intermédiaire
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Contactez l'Éleveur
          </h1>
          <p className="text-forest-100 text-sm sm:text-base max-w-xl mx-auto">
            Une question sur un animal, une disponibilité ou une commande personnalisée ? Contactez-nous par téléphone, WhatsApp ou formulaire.
          </p>
        </div>
      </section>

      {/* Interactive Contact Body */}
      <ContactClient settings={settings} />
    </div>
  );
}
