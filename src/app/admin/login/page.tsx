'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la connexion.');
      }

      if (data.token) {
        try {
          localStorage.setItem('map_admin_token', data.token);
        } catch (_) {}
      }

      // Redirection complète pour garantir l'envoi du cookie de session
      window.location.href = '/admin';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-warm-200/90 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            Espace Propriétaire
          </h1>
          <p className="text-xs text-stone-500">
            Connexion réservée à l'administrateur de l'élevage.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m.aik@hotmail.fr"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warm-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <span>Se connecter au tableau de bord</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-400 border-t border-warm-100">
          Sécurité renforcée par jeton d'authentification crypté.
        </div>
      </div>
    </div>
  );
}
