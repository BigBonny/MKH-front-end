import { useState, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { User, Briefcase, TrendingUp, ShoppingBag, Package, CreditCard, LogOut, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

type UserType = 'client' | 'partenaire' | 'actionnaire';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: {
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    unit_price: number;
  }[];
}

interface UserData {
  user_type: UserType;
  full_name: string;
  email: string;
}

const Account = () => {
  const { user, isLoaded } = useUser();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<UserType>('client');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'client' as UserType, label: language === 'fr' ? 'Client' : 'Customer', icon: User },
    { id: 'partenaire' as UserType, label: language === 'fr' ? 'Partenaire' : 'Partner', icon: Briefcase },
    { id: 'actionnaire' as UserType, label: language === 'fr' ? 'Actionnaire' : 'Shareholder', icon: TrendingUp },
  ];

  // Charger les données utilisateur depuis Supabase
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Vérifier si l'utilisateur existe dans Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user:', fetchError);
        }

        if (!existingUser) {
          // Créer l'utilisateur dans Supabase
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              clerk_id: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              full_name: user.fullName || '',
              avatar_url: user.imageUrl,
              user_type: 'client',
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating user:', createError);
          } else {
            setUserData(newUser);
          }
        } else {
          setUserData(existingUser);
          setActiveTab(existingUser.user_type);
        }

        // Charger les commandes
        const { data: userRecord } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', user.id)
          .single();

        if (userRecord) {
          const { data: ordersData } = await supabase
            .from('orders')
            .select(`
              *,
              items:order_items(
                quantity,
                unit_price,
                product:products(name, image)
              )
            `)
            .eq('user_id', userRecord.id)
            .order('created_at', { ascending: false });

          if (ordersData) {
            setOrders(ordersData as Order[]);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleUpdateUserType = async (newType: UserType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ user_type: newType })
        .eq('clerk_id', user.id);

      if (error) throw error;

      setUserData((prev) => (prev ? { ...prev, user_type: newType } : null));
      setActiveTab(newType);
      toast.success(language === 'fr' ? 'Profil mis à jour' : 'Profile updated');
    } catch (error) {
      console.error('Error updating user type:', error);
      toast.error(language === 'fr' ? 'Erreur lors de la mise à jour' : 'Update error');
    }
  };

  const t = {
    fr: {
      title: 'Mon Compte',
      subtitle: 'Gérez vos informations et préférences',
      welcome: 'Bienvenue',
      loading: 'Chargement...',
      orders: 'Commandes',
      favorites: 'Favoris',
      points: 'Points fidélité',
      recentOrders: 'Commandes récentes',
      noOrders: 'Aucune commande pour le moment',
      orderNumber: 'Commande',
      total: 'Total',
      status: 'Statut',
      date: 'Date',
      logout: 'Déconnexion',
      collaborations: 'Collaborations',
      revenue: 'Revenus',
      products: 'Produits',
      performance: 'Performance',
      shares: 'Actions',
      value: 'Valeur',
      dividend: 'Dividende',
      growth: 'Croissance',
    },
    en: {
      title: 'My Account',
      subtitle: 'Manage your information and preferences',
      welcome: 'Welcome',
      loading: 'Loading...',
      orders: 'Orders',
      favorites: 'Favorites',
      points: 'Loyalty points',
      recentOrders: 'Recent orders',
      noOrders: 'No orders yet',
      orderNumber: 'Order',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      logout: 'Logout',
      collaborations: 'Collaborations',
      revenue: 'Revenue',
      products: 'Products',
      performance: 'Performance',
      shares: 'Shares',
      value: 'Value',
      dividend: 'Dividend',
      growth: 'Growth',
    },
  }[language];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      delivered: language === 'fr' ? 'Livré' : 'Delivered',
      shipped: language === 'fr' ? 'Expédié' : 'Shipped',
      processing: language === 'fr' ? 'En traitement' : 'Processing',
      pending: language === 'fr' ? 'En attente' : 'Pending',
      cancelled: language === 'fr' ? 'Annulé' : 'Cancelled',
    };
    return labels[status] || status;
  };

  if (!isLoaded || isLoading) {
    return (
      <section id="account" className="py-24 md:py-32 bg-[#1A1A1A]">
        <div className="section-padding flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section id="account" className="py-24 md:py-32 bg-[#1A1A1A]">
      <div className="section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">
            MON COMPTE
          </span>
          <h2
            className="heading-lg text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t.title}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto body-lg">{t.subtitle}</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || ''}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37]"
            />
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl text-white font-semibold">
                {t.welcome}, {user?.fullName}
              </h3>
              <p className="text-white/60">{user?.primaryEmailAddress?.emailAddress}</p>
              <span className="inline-block mt-2 px-4 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm">
                {tabs.find((t) => t.id === userData?.user_type)?.label}
              </span>
            </div>
            <SignOutButton>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>{t.logout}</span>
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* Account Type Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleUpdateUserType(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="max-w-6xl mx-auto">
          {/* Client Dashboard */}
          {activeTab === 'client' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <span className="text-3xl font-bold text-white block">{orders.length}</span>
                  <span className="text-white/60 text-sm">{t.orders}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <Package className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <span className="text-3xl font-bold text-white block">0</span>
                  <span className="text-white/60 text-sm">{t.favorites}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <CreditCard className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <span className="text-3xl font-bold text-white block">0</span>
                  <span className="text-white/60 text-sm">{t.points}</span>
                </div>
              </div>

              {/* Orders */}
              <div className="bg-white/5 rounded-xl p-8">
                <h4 className="text-white font-semibold mb-6 text-xl">{t.recentOrders}</h4>
                {orders.length === 0 ? (
                  <p className="text-white/60 text-center py-8">{t.noOrders}</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium">
                            {t.orderNumber} #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/60">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-[#D4AF37] font-semibold">
                            {(order.total_amount / 100).toFixed(2)} €
                          </span>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-white/60 text-sm">
                              {order.items.length} article{order.items.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Partenaire Dashboard */}
          {activeTab === 'partenaire' && (
            <div className="grid sm:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <Briefcase className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <span className="text-3xl font-bold text-white block">0</span>
                <span className="text-white/60 text-sm">{t.collaborations}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <span className="text-3xl font-bold text-white block">0€</span>
                <span className="text-white/60 text-sm">{t.revenue}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <Package className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <span className="text-3xl font-bold text-white block">0</span>
                <span className="text-white/60 text-sm">{t.products}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <CreditCard className="w-8 h-8 text-[#2E5C4F] mx-auto mb-3" />
                <span className="text-3xl font-bold text-[#2E5C4F] block">0%</span>
                <span className="text-white/60 text-sm">{t.performance}</span>
              </div>
            </div>
          )}

          {/* Actionnaire Dashboard */}
          {activeTab === 'actionnaire' && (
            <div className="grid sm:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <span className="text-3xl font-bold text-white block">0</span>
                <span className="text-white/60 text-sm">{t.shares}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <CreditCard className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <span className="text-3xl font-bold text-white block">0€</span>
                <span className="text-white/60 text-sm">{t.value}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <Package className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <span className="text-3xl font-bold text-white block">0€</span>
                <span className="text-white/60 text-sm">{t.dividend}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-[#2E5C4F] mx-auto mb-3" />
                <span className="text-3xl font-bold text-[#2E5C4F] block">0%</span>
                <span className="text-white/60 text-sm">{t.growth}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Account;
