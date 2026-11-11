'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/utils';

interface ContactClientProps {
  settings: {
    farmName: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    address: string;
    hours: string;
  };
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phoneOrEmail.trim() || !message.trim()) {
      setError('Veuillez renseigner votre nom, vos coordonnées et votre message.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phoneOrEmail: phoneOrEmail.trim(),
          subject: subject.trim() || 'Demande de renseignement',
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’envoi de votre message.');
      }

      setSuccess(true);
      setName('');
      setPhoneOrEmail('');
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = buildWhatsAppLink(
    settings.whatsappNumber,
    `Bonjour ${settings.farmName}, je vous contacte depuis la page Contact de votre site.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct info cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Coordonnées directes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Restons en contact
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Pour une demande de renseignements, une visite de nos installations ou une réservation, n'hésitez pas à nous contacter.
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-200/90 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-stone-400 block font-medium">Lignes directes</span>
                <div className="flex flex-col gap-1 mt-0.5">
                  {settings.phone.split('/').map((num) => {
                    const cleanNum = num.trim();
                    const telLink = cleanNum.replace(/[\s-]/g, '');
                    return (
                      <a
                        key={cleanNum}
                        href={`tel:${telLink}`}
                        className="text-sm font-bold text-stone-900 hover:text-forest-800 transition"
                        title={`Appeler le ${cleanNum}`}
                      >
                        {cleanNum}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-200/90 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-xs text-stone-400 block font-medium">WhatsApp direct</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>Discuter directement sur WhatsApp (Lien direct & QR) →</span>
                </a>
                <a
                  href={buildWhatsAppLink('2290195204397', 'Bonjour AYEKOBINOU SERVICE, je souhaite me renseigner.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Ligne WhatsApp 2 (+229 01 95 20 43 97) →</span>
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-200/90 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-stone-400 block font-medium">Adresse email</span>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm font-bold text-stone-900 hover:text-forest-800 transition"
                >
                  {settings.email}
                </a>
              </div>
            </div>

            {/* Location */}
            {settings.address && (
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-200/90 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block font-medium">Localisation du domaine</span>
                  <p className="text-sm font-semibold text-stone-800">{settings.address}</p>
                </div>
              </div>
            )}

            {/* Hours */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-200/90 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-stone-400 block font-medium">Horaires d'accueil</span>
                <p className="text-sm font-semibold text-stone-800">{settings.hours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-warm-200/90 shadow-sm space-y-6">
          <div className="border-b border-warm-200 pb-4">
            <h3 className="text-xl font-bold text-stone-900">Envoyez-nous un message</h3>
            <p className="text-xs text-stone-500 mt-1">
              Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
            </p>
          </div>

          {success && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Votre message a été transmis avec succès !</p>
                <p className="mt-0.5">L'éleveur vous recontactera rapidement par téléphone ou email.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3.5 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Votre nom et prénom <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Paul Dossou"
                className="w-full px-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Numéro de téléphone ou Email <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="Ex : +229 97 00 00 00 ou email@domaine.com"
                className="w-full px-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Objet de votre demande
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex : Renseignement sur les lapins reproducteurs"
                className="w-full px-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Votre message <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Précisez votre demande, les quantités souhaitées ou vos questions..."
                className="w-full px-4 py-3 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span>Envoi en cours...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer mon message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
