'use client';

import { useState } from 'react';
import { Mail, Phone, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export interface ContactMessageItem {
  id: string;
  name: string;
  phoneOrEmail: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

interface AdminMessagesClientProps {
  initialMessages: ContactMessageItem[];
}

export default function AdminMessagesClient({
  initialMessages,
}: AdminMessagesClientProps) {
  const [messages, setMessages] = useState<ContactMessageItem[]>(initialMessages);

  const toggleRead = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !current }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: !current } : m))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
          Messages Reçus
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Demandes envoyées depuis le formulaire de contact du site.
        </p>
      </div>

      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-3xl border transition ${
                msg.isRead
                  ? 'bg-white border-warm-200/80 shadow-xs'
                  : 'bg-emerald-50/40 border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-warm-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{msg.name}</span>
                  <span className="text-stone-400">• {msg.phoneOrEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-stone-400">{formatDateTime(msg.createdAt)}</span>
                  <button
                    onClick={() => toggleRead(msg.id, msg.isRead)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                      msg.isRead
                        ? 'bg-stone-100 text-stone-600 border-stone-200'
                        : 'bg-emerald-600 text-white border-emerald-600'
                    }`}
                  >
                    {msg.isRead ? 'Marquer non lu' : 'Nouveau (marquer lu)'}
                  </button>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <h4 className="font-bold text-xs text-forest-900">Objet : {msg.subject}</h4>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-warm-50/60 p-3.5 rounded-2xl border border-warm-200">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-xs text-stone-500 bg-white rounded-3xl border border-warm-200">
            Aucun message reçu pour l'instant.
          </div>
        )}
      </div>
    </div>
  );
}
