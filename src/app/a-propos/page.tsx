import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';
import { ShieldCheck, HeartHandshake, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Notre Histoire & Nos Engagements
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            À propos de {settings.farmName}
          </h1>
          <p className="text-forest-100 text-base max-w-2xl mx-auto">
            Découvrez la vision, le savoir-faire et l'exigence d'un éleveur passionné par la qualité et le bien-être animal.
          </p>
        </div>
      </section>

      {/* Main Presentation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              L'Éleveur et son parcours
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              Un cheptel rigoureusement suivi pour une production saine
            </h2>
            <div className="prose prose-stone text-sm text-stone-700 space-y-4 leading-relaxed">
              <p>
                {settings.aboutText}
              </p>
              <p>
                Depuis plus de <strong>{settings.experienceYears} ans</strong>, notre exploitation s'efforce d'allier méthodes agropastorales traditionnelles respectueuses et techniques modernes de prophylaxie vétérinaire.
              </p>
              <p>
                Contrairement aux intermédiaires et revendeurs occasionnels, nous élevons nous-mêmes nos sujets dans des parcs aérés, entretenus quotidiennement et surveillés avec la plus grande assiduité.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition"
              >
                <span>Découvrir nos animaux disponibles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/responsable.jpg"
                  alt="Responsable d'exploitation Ferme MAP"
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
              </div>
              <div className="bg-forest-50 p-4 rounded-2xl border border-forest-100 text-center">
                <span className="block text-2xl font-extrabold text-forest-900">{settings.experienceYears}+</span>
                <span className="text-xs text-forest-700 font-medium">Années d'expérience</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="bg-warm-100 p-4 rounded-2xl border border-warm-200 text-center">
                <span className="block text-2xl font-extrabold text-forest-900">100%</span>
                <span className="text-xs text-stone-600 font-medium">Alimentation saine</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[3/4] bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/uploads/poulets-plein-air-ferme.jpg"
                  alt="Poulets bicyclettes fermiers en plein air"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installations and Methods */}
      <section className="bg-warm-100/70 py-16 border-y border-warm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Nos Méthodes de Travail
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Des installations adaptées au bien-être des animaux
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-warm-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900">Hygiène & Prophylaxie</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nettoyage et désinfection réguliers des clapiers, poulaillers et enclos. Déparasitage et calendrier de vaccination scrupuleusement respecté.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-warm-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900">Alimentation Équilibrée</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Régime nutritif naturel adapté à chaque étape de croissance : fourrages verts sélectionnés, céréales de qualité et compléments vitaminés naturels.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-warm-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900">Sélection Génétique</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Reproducteurs choisis pour leur rusticité, leur fertilité et leur taux de croissance, afin de garantir aux acquéreurs des sujets performants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
          Vous souhaitez visiter nos installations ?
        </h3>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Nous accueillons les acheteurs et porteurs de projet sur rendez-vous pour choisir leurs sujets en toute transparence.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition"
          >
            <span>Prendre rendez-vous ou nous écrire</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
