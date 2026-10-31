'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Phone, MessageCircle, Mail, MapPin, Clock, Lock, KeyRound } from 'lucide-react';

interface SiteSettingsData {
  farmName: string;
  tagline: string;
  aboutText: string;
  experienceYears: number;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  hours: string;
  currency: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
}

interface AdminSettingsClientProps {
  initialSettings: SiteSettingsData;
}

export default function AdminSettingsClient({
  initialSettings,
}: AdminSettingsClientProps) {
  const [formData, setFormData] = useState<SiteSettingsData>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Changement de mot de passe administrateur
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (newPassword !== confirmPassword) {
      setPwdError('Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (newPassword.length < 8) {
      setPwdError('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    try {
      setPwdLoading(true);
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du changement.');
      }
      setPwdSuccess('✓ Votre mot de passe administrateur a été modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPwdError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experienceYears' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
          Paramètres Généraux de l'Élevage
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Modifiez le nom de l'élevage, votre numéro WhatsApp pour les commandes, vos coordonnées et textes de présentation.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>Paramètres mis à jour avec succès et appliqués immédiatement sur le site !</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-xs text-stone-700">
        {/* Identité de l'élevage */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Identité et présentation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Nom de l'entreprise / Élevage</label>
              <input
                type="text"
                required
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Slogan ou sous-titre court</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Années d'expérience du propriétaire</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Symbole monétaire (Devise)</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="FCFA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Texte de présentation générale (Page d'accueil & À propos)
            </label>
            <textarea
              rows={4}
              name="aboutText"
              value={formData.aboutText}
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
            />
          </div>
        </div>

        {/* Configuration WhatsApp & Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Configuration WhatsApp et Coordonnées
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">
                Numéro WhatsApp officiel (chiffres sans espace avec indicatif)
              </label>
              <input
                type="text"
                required
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="Ex : 22997001234"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
              <span className="text-[10px] text-stone-400 block mt-1">
                Tous les boutons WhatsApp du catalogue et des commandes redirigent vers ce numéro.
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1">Téléphone d'appel direct</label>
              <input
                type="text"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+229 97 00 12 34"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Adresse e-mail de contact</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Horaires d'ouverture / d'accueil</label>
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                placeholder="Lundi - Samedi : 07h30 - 18h30"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Localisation physique de l'élevage</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ex : Ville, Département, Bénin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
            />
          </div>
        </div>

        {/* Section Principale (Hero) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Section d'accueil principale (Bannière Hero)
          </h2>

          <div>
            <label className="block font-semibold mb-1">Grand titre d'accroche</label>
            <input
              type="text"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Sous-titre descriptif</label>
            <textarea
              rows={2}
              name="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">URL de la photo principale d'accueil</label>
            <input
              type="url"
              name="heroImage"
              value={formData.heroImage || ''}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
            />
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-warm-200/90 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-stone-900 border-b border-warm-100 pb-2">
            Liens réseaux sociaux (optionnels)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Lien Facebook</label>
              <input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Lien YouTube</label>
              <input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl || ''}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Lien Instagram</label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>{loading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
          </button>
        </div>
      </form>

      {/* SECTION SÉCURITÉ : CHANGEMENT DE MOT DE PASSE */}
      <div className="bg-white rounded-3xl border border-warm-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-warm-200 pb-4 flex items-center gap-2.5">
          <KeyRound className="w-5 h-5 text-forest-800" />
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Sécurité & Changement de mot de passe administrateur
            </h2>
            <p className="text-xs text-stone-500">
              Modifiez votre clé d'accès au panneau d'administration.
            </p>
          </div>
        </div>

        {pwdError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pwdError}</span>
          </div>
        )}

        {pwdSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Mot de passe actuel <span className="text-rose-600">*</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Nouveau mot de passe <span className="text-rose-600">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Au moins 8 caractères"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Confirmer le nouveau mot de passe <span className="text-rose-600">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez à l'identique"
                className="w-full px-3.5 py-2.5 rounded-xl border border-warm-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={pwdLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs transition disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{pwdLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
