import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  PawPrint,
  ShoppingBag,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { getSiteSettings } from '@/lib/settings';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect('/admin/login');
  }

  const settings = await getSiteSettings();

  let totalAnimals = 0;
  let availableAnimals = 0;
  let totalOrders = 0;
  let pendingOrders = 0;
  let completedOrders = 0;
  let unreadMessages = 0;
  let totalViews = 0;
  let recentOrders: any[] = [];
  let recentAnimals: any[] = [];

  try {
    totalAnimals = await prisma.animal.count();
    availableAnimals = await prisma.animal.count({
      where: { status: 'DISPONIBLE', isPublished: true, stock: { gt: 0 } },
    });
    totalOrders = await prisma.order.count();
    pendingOrders = await prisma.order.count({
      where: { status: { in: ['NOUVELLE', 'CONFIRMEE', 'EN_PREPARATION'] } },
    });
    completedOrders = await prisma.order.count({
      where: { status: 'LIVREE' },
    });
    unreadMessages = await prisma.contactMessage.count({
      where: { isRead: false },
    });

    const totalViewsResult = await prisma.animal.aggregate({
      _sum: { viewsCount: true },
    });
    totalViews = totalViewsResult._sum.viewsCount || 0;

    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    recentAnimals = await prisma.animal.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
      },
    });
  } catch (err) {
    console.error('AdminDashboard fetch error:', err);
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Tableau de Bord
          </span>
          <h1 className="text-2xl font-extrabold text-stone-900 mt-0.5">
            Bonjour, {session.name} 👋
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Gérez vos annonces d'animaux, vos commandes clients et la configuration de votre élevage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/animaux/nouveau"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Ajouter un animal</span>
          </Link>
          <Link
            href="/admin/commandes"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-warm-300 hover:bg-warm-50 text-stone-700 font-semibold text-xs transition"
          >
            <ShoppingBag className="w-4 h-4 text-stone-500" />
            <span>Commandes ({pendingOrders})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Ads */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold">Total Annonces</span>
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center">
              <PawPrint className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{totalAnimals}</span>
            <span className="text-[11px] text-emerald-700 font-medium">
              ({availableAnimals} dispo)
            </span>
          </div>
        </div>

        {/* Total Views / Audience */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 bg-emerald-50/20 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-emerald-900">Consultations</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-950">{totalViews}</span>
            <span className="text-[11px] text-emerald-700 font-medium">vues au total</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold">Commandes reçues</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-stone-900">{totalOrders}</span>
            <span className="text-[11px] text-stone-400">enregistrées</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold">En attente / En cours</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-900">{pendingOrders}</span>
            <span className="text-[11px] text-amber-700 font-medium">À traiter</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-2xl border border-warm-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold">Commandes livrées</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-950">{completedOrders}</span>
            <span className="text-[11px] text-emerald-700 font-medium">Finalisées</span>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Orders & Recent Animal Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-warm-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-800" />
              <h2 className="font-bold text-base text-stone-900">Dernières commandes</h2>
            </div>
            <Link
              href="/admin/commandes"
              className="text-xs font-bold text-forest-800 hover:text-forest-950 transition flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y divide-warm-100">
              {recentOrders.map((ord) => {
                const item = ord.items[0];
                const statusStyles: Record<string, string> = {
                  NOUVELLE: 'bg-blue-100 text-blue-800 border-blue-200',
                  CONFIRMEE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  EN_PREPARATION: 'bg-amber-100 text-amber-800 border-amber-200',
                  LIVREE: 'bg-stone-200 text-stone-800 border-stone-300',
                  ANNULEE: 'bg-rose-100 text-rose-800 border-rose-200',
                };
                return (
                  <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-stone-900">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            statusStyles[ord.status] || 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 font-semibold truncate mt-0.5">
                        {ord.customerName} ({ord.customerPhone}) • {ord.customerLocation}
                      </p>
                      {item && (
                        <p className="text-[11px] text-stone-500 truncate">
                          {item.quantity}x {item.animalName}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-xs text-forest-900 block">
                        {formatPrice(ord.totalAmount, settings.currency)}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatDate(ord.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">
              Aucune commande enregistrée pour le moment.
            </p>
          )}
        </div>

        {/* Right Column: Recent Animal Listings */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-warm-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-warm-100">
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-forest-800" />
              <h2 className="font-bold text-base text-stone-900">Derniers animaux publiés</h2>
            </div>
            <Link
              href="/admin/animaux"
              className="text-xs font-bold text-forest-800 hover:text-forest-950 transition flex items-center gap-1"
            >
              <span>Gérer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAnimals.length > 0 ? (
            <div className="divide-y divide-warm-100">
              {recentAnimals.map((animal) => (
                <div key={animal.id} className="py-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={animal.images[0]?.url || 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=200&q=80'}
                    alt={animal.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-stone-900 truncate">
                      {animal.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate flex items-center gap-1.5">
                      <span>{animal.category?.name} • Stock : {animal.stock}</span>
                      <span className="inline-flex items-center gap-0.5 text-stone-400">
                        <Eye className="w-3 h-3" />
                        {animal.viewsCount || 0}
                      </span>
                    </p>
                    <span className="text-xs font-bold text-forest-800">
                      {formatPrice(animal.price, settings.currency)}
                    </span>
                  </div>
                  <Link
                    href={`/admin/animaux/${animal.id}/modifier`}
                    className="text-xs text-forest-800 hover:underline font-semibold"
                  >
                    Modifier
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-6 text-center">
              Aucun animal enregistré.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
