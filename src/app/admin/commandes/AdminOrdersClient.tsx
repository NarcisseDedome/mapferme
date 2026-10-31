'use client';

import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  Download,
} from 'lucide-react';
import { formatPrice, formatDateTime, buildWhatsAppLink } from '@/lib/utils';

export interface AdminOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  deliveryAddress?: string | null;
  notes?: string | null;
  totalAmount: number;
  status: string; // NOUVELLE, CONFIRMEE, EN_PREPARATION, LIVREE, ANNULEE
  createdAt: string | Date;
  items: Array<{
    id: string;
    animalName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }>;
}

interface AdminOrdersClientProps {
  initialOrders: AdminOrderItem[];
  currency?: string;
  whatsappNumber: string;
}

export default function AdminOrdersClient({
  initialOrders,
  currency = 'FCFA',
  whatsappNumber,
}: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<AdminOrderItem[]>(initialOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchClient = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      const matchLoc = o.customerLocation.toLowerCase().includes(q);
      return matchNum || matchClient || matchPhone || matchLoc;
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('Aucune commande à exporter.');
      return;
    }

    const headers = [
      'N° Commande',
      'Date',
      'Client',
      'Telephone',
      'Localite',
      'Modalite / Adresse',
      'Articles',
      'Quantite',
      `Montant Total (${currency})`,
      'Statut',
      'Notes'
    ];

    const rows = orders.map((o) => {
      const item = o.items[0];
      const itemsText = o.items.map((it) => `${it.quantity}x ${it.animalName}`).join(' ; ');
      const totalQty = o.items.reduce((acc, it) => acc + it.quantity, 0);

      return [
        `"${o.orderNumber}"`,
        `"${new Date(o.createdAt).toLocaleDateString('fr-FR')}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${(o.customerPhone || '').replace(/"/g, '""')}"`,
        `"${(o.customerLocation || '').replace(/"/g, '""')}"`,
        `"${(o.deliveryAddress || '').replace(/"/g, '""')}"`,
        `"${itemsText.replace(/"/g, '""')}"`,
        totalQty,
        o.totalAmount,
        `"${o.status}"`,
        `"${(o.notes || '').replace(/"/g, '""')}"`,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commandes-ferme-map-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NOUVELLE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMEE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'EN_PREPARATION':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LIVREE':
        return 'bg-stone-200 text-stone-800 border-stone-300';
      case 'ANNULEE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Gestion des Commandes
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Suivi des réservations clients, ajustement des statuts et contact direct.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs transition"
            title="Exporter la liste au format Excel CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exporter Excel (CSV)</span>
          </button>
          <div className="text-xs text-stone-500 bg-warm-50 px-3 py-2 rounded-xl border border-warm-200">
            <span className="font-bold text-forest-900">{orders.length}</span> commande(s)
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-warm-200/90 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher par n° de commande, nom client, téléphone, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-warm-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-warm-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="NOUVELLE">Nouvelle (à traiter)</option>
          <option value="CONFIRMEE">Confirmée</option>
          <option value="EN_PREPARATION">En préparation</option>
          <option value="LIVREE">Livrée / Retirée</option>
          <option value="ANNULEE">Annulée</option>
        </select>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const clientWhatsAppUrl = buildWhatsAppLink(
              order.customerPhone,
              `Bonjour ${order.customerName}, ici l'éleveur au sujet de votre commande *${order.orderNumber}*. Tout est prêt de notre côté.`
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-warm-200/90 shadow-xs p-5 sm:p-6 space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-warm-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm sm:text-base text-forest-900 bg-warm-50 px-3 py-1 rounded-xl border border-warm-200">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-400">
                    Reçue le {formatDateTime(order.createdAt)}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                  {/* Customer Info */}
                  <div className="md:col-span-5 space-y-2">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-forest-800">
                      Coordonnées Client
                    </h4>
                    <div className="space-y-1 text-stone-700">
                      <p className="font-semibold text-sm text-stone-900">{order.customerName}</p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <a href={`tel:${order.customerPhone}`} className="hover:underline">
                          {order.customerPhone}
                        </a>
                      </p>
                      <p className="text-stone-600">Ville : {order.customerLocation}</p>
                      {order.deliveryAddress && (
                        <p className="text-stone-500 italic">
                          Adresse / Point de retrait : {order.deliveryAddress}
                        </p>
                      )}
                      {order.notes && (
                        <p className="text-stone-500 bg-warm-50 p-2 rounded-lg mt-1 border border-warm-200">
                          Note client : {order.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={clientWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Échanger sur WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="md:col-span-4 space-y-2">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-forest-800">
                      Animaux commandés
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-2.5 rounded-xl bg-warm-50 border border-warm-200 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-stone-900">{item.animalName}</p>
                            <p className="text-[11px] text-stone-500">
                              {item.quantity} × {formatPrice(item.unitPrice, currency)}
                            </p>
                          </div>
                          <span className="font-extrabold text-stone-900">
                            {formatPrice(item.subtotal, currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 font-bold text-sm text-forest-950">
                      <span>Total commande :</span>
                      <span>{formatPrice(order.totalAmount, currency)}</span>
                    </div>
                  </div>

                  {/* Status update selector */}
                  <div className="md:col-span-3 space-y-2">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-forest-800">
                      Modifier le statut
                    </h4>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="w-full p-2.5 rounded-xl border border-warm-300 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                    >
                      <option value="NOUVELLE">Nouvelle (à traiter)</option>
                      <option value="CONFIRMEE">Confirmée</option>
                      <option value="EN_PREPARATION">En préparation</option>
                      <option value="LIVREE">Livrée / Retirée</option>
                      <option value="ANNULEE">Annulée (restaure stock)</option>
                    </select>

                    <p className="text-[10px] text-stone-400 leading-tight">
                      En passant le statut à "Annulée", la quantité réservée est automatiquement recréditée au stock de l'animal.
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-xs text-stone-500 bg-white rounded-3xl border border-warm-200">
            Aucune commande trouvée avec ces filtres.
          </div>
        )}
      </div>
    </div>
  );
}
