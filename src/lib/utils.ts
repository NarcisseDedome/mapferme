import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'FCFA'): string {
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} ${currency}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${year}${month}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function cleanPhoneForWhatsApp(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

export function buildWhatsAppLink(phoneOrUrl: string, message?: string): string {
  if (!phoneOrUrl) {
    return 'https://wa.me/qr/YSO2RHQ4CPOWM1?s=v';
  }

  // Si c'est déjà une URL WhatsApp directe (ex: lien QR officiel ou wa.me)
  if (phoneOrUrl.startsWith('http://') || phoneOrUrl.startsWith('https://')) {
    if (message && !phoneOrUrl.includes('text=')) {
      const sep = phoneOrUrl.includes('?') ? '&' : '?';
      return `${phoneOrUrl}${sep}text=${encodeURIComponent(message)}`;
    }
    return phoneOrUrl;
  }

  const cleanPhone = cleanPhoneForWhatsApp(phoneOrUrl);
  const encoded = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ''}`;
}
