import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Package, Handshake, Check, ChevronRight, BookOpen, Users, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClerk } from '@clerk/clerk-react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const Inscription = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, user } = useClerk();

  const [activeTab, setActiveTab] = useState<'actionnariat' | 'abonnement' | 'partenariat'>('actionnariat');
  const [showForm, setShowForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showActionnariatTable, setShowActionnariatTable] = useState(false);
  const [actionnariatRequests, setActionnariatRequests] = useState<Array<{
    id?: number; 
    name: string; 
    email: string; 
    phone: string; 
    status: string; 
    created_at: string
  }>>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const { t } = useLanguage();

  const tabs = [
    {
      id: 'actionnariat' as const,
      label: t('inscription.actionnariat.title'),
      icon: TrendingUp,
    },
    {
      id: 'abonnement' as const,
      label: t('inscription.abonnement.title'),
      icon: Package,
    },
    {
      id: 'partenariat' as const,
      label: t('inscription.partenariat.title'),
      icon: Handshake,
    },
  ];

  const abonnementPlans = [
    {
      name: 'Essentiel',
      price: '29€',
      period: t('inscription.abonnement.month'),
      features: [
        'Access to basic content',
        'Email support',
        'Monthly updates',
      ],
    },
    {
      name: 'Premium',
      price: '59€',
      period: t('inscription.abonnement.month'),
      features: [
        'All Essential features',
        'Priority support',
        'Exclusive content',
        'Advanced analytics',
      ],
      popular: true,
    },
    {
      name: 'VIP',
      price: '99€',
      period: t('inscription.abonnement.month'),
      features: [
        'All Premium features',
        'Personal mentorship',
        'VIP events access',
        'Custom solutions',
        'Direct CEO contact',
      ],
    },
  ];

  const partenariatTypes = [
    {
      icon: BookOpen,
      title: t('inscription.partenariat.type1.title'),
      description: t('inscription.partenariat.type1.desc'),
    },
    {
      icon: Package,
      title: t('inscription.partenariat.type2.title'),
      description: t('inscription.partenariat.type2.desc'),
    },
    {
      icon: Handshake,
      title: t('inscription.partenariat.type3.title'),
      description: t('inscription.partenariat.type3.desc'),
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tab-content',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeTab]);

  // Load actionnariat requests from Supabase
  useEffect(() => {
    const loadActionnariatRequests = async () => {
      const { data, error } = await supabase
        .from('actionnariat_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading requests:', error);
        return;
      }

      setActionnariatRequests(data || []);
    };

    loadActionnariatRequests();
  }, [activeTab]);

  const handleSubscription = async (plan: { 
    name: string; 
    price: string; 
    period: string; 
    features: string[]; 
    popular?: boolean 
  }) => {
    try {
      console.log('Starting subscription for plan:', plan.name);
      
      // Check if user is authenticated
      if (!isSignedIn) {
        console.log('User not authenticated, showing sign up');
        setShowSignUp(true);
        return;
      }
      
      // Show loading state
      console.log(`Preparing payment for ${plan.name}...`);
      
      // Create checkout session via API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.name,
          price: parseInt(plan.price.replace('€', '')) * 100,
          currency: 'eur',
          userId: user?.id, // Include Clerk user ID
          userEmail: user?.primaryEmailAddress?.emailAddress, // Include user email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url;
      } else {
        // Fallback: Use Stripe redirect
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
        if (stripe) {
          const { error } = await (stripe as any).redirectToCheckout({ 
            sessionId: session.id 
          });
          
          if (error) {
            throw new Error(error.message);
          }
        }
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Clerk sign-up page for proper account creation
    window.location.href = '/sign-up';
  };

  const handleActionnariatSubmit = async () => {
    if (!formData.name || !formData.email) {
      console.log('Please fill in all required fields');
      return;
    }

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('actionnariat_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error submitting request. Please try again.');
        return;
      }

      console.log('Your actionnariat request has been submitted successfully!');
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '' });
    } catch {
      console.error('Error submitting request. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'abonnement') {
      await handleSubscription(abonnementPlans[0]);
    } else if (activeTab === 'actionnariat') {
      await handleActionnariatSubmit();
    } else {
      // Show sign-up dialog for partenariat
      setShowSignUp(true);
    }
  };

  const openActionnariatForm = () => {
    if (!formData.name || !formData.email) {
      console.log('Please fill in name and email first');
      return;
    }
    setShowForm(true);
  };

  return (
    <section
      id="inscription"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#F5F0E6]"
    >
      <div className="section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">
            INSCRIPTION
          </span>
          <h2
            className="heading-lg text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('inscription.title')}
          </h2>
          <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto body-lg">
            {t('inscription.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-white text-[#1A1A1A] hover:bg-[#D4AF37]/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content max-w-6xl mx-auto">
          {/* Actionnariat */}
          {activeTab === 'actionnariat' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3
                  className="text-3xl md:text-4xl text-[#1A1A1A] font-semibold"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('inscription.actionnariat.heading')}
                </h3>
                <button
                  onClick={() => setShowActionnariatTable(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Requests</span>
                </button>
              </div>

              {isSignedIn ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <p className="text-green-800 font-semibold">You are already signed in</p>
                  <p className="text-green-600">Actionnariat requests are managed through your dashboard</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <p className="body-lg text-[#1A1A1A]/70">
                      {t('inscription.actionnariat.desc')}
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Label htmlFor="action-name">{t('inscription.form.name')}</Label>
                        <Input
                          id="action-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t('inscription.form.namePlaceholder')}
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="action-email">{t('inscription.form.email')}</Label>
                        <Input
                          id="action-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t('inscription.form.emailPlaceholder')}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="action-phone">{t('inscription.form.phone')}</Label>
                      <Input
                        id="action-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t('inscription.form.phonePlaceholder')}
                      />
                    </div>
                    <button
                      onClick={openActionnariatForm}
                      className="btn-primary flex items-center gap-3"
                    >
                      <span>{t('inscription.actionnariat.cta')}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-2xl p-8 text-white">
                      <TrendingUp className="w-16 h-16 mb-6" />
                      <h4
                        className="text-2xl font-semibold mb-4"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {t('inscription.actionnariat.card.title')}
                      </h4>
                      <p className="text-white/80 mb-8">
                        {t('inscription.actionnariat.card.desc')}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">2.5%</span>
                        <span className="text-white/70">{t('inscription.actionnariat.card.return')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Abonnement */}
          {activeTab === 'abonnement' && (
            <div>
              <div className="text-center mb-12">
                <h3
                  className="text-3xl md:text-4xl text-[#1A1A1A] font-semibold mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('inscription.abonnement.heading')}
                </h3>
                <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto">
                  {t('inscription.abonnement.desc')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {abonnementPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                      plan.popular ? 'ring-2 ring-[#D4AF37]' : ''
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-white text-sm font-semibold rounded-full">
                        POPULAR
                      </span>
                    )}

                    <h4
                      className="text-xl text-[#1A1A1A] font-semibold mb-2"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {plan.name}
                    </h4>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold text-[#1A1A1A]">{plan.price}</span>
                      <span className="text-[#1A1A1A]/50">/{plan.period}</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span className="text-[#1A1A1A]/70 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscription(plan)}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-[#D4AF37] text-white hover:bg-[#B8941F]'
                          : 'bg-[#1A1A1A]/5 text-[#1A1A1A] hover:bg-[#1A1A1A]/10'
                      }`}
                    >
                      {t('inscription.abonnement.subscribe')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partenariat */}
          {activeTab === 'partenariat' && (
            <div>
              <div className="text-center mb-12">
                <h3
                  className="text-3xl md:text-4xl text-[#1A1A1A] font-semibold mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('inscription.partenariat.heading')}
                </h3>
                <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto">
                  {t('inscription.partenariat.desc')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {partenariatTypes.map((type, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                  >
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <type.icon className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h4
                      className="text-xl text-[#1A1A1A] font-semibold mb-4"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {type.title}
                    </h4>
                    <p className="text-[#1A1A1A]/60 mb-6">{type.description}</p>
                    <button
                      onClick={() => setShowSignUp(true)}
                      className="text-[#D4AF37] font-semibold flex items-center gap-2 mx-auto group"
                    >
                      <span>{t('inscription.partenariat.learnMore')}</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registration Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle
              className="text-2xl text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('inscription.form.title')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-name">{t('inscription.form.name')}</Label>
              <Input
                id="dialog-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('inscription.form.namePlaceholder')}
                required
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-email">{t('inscription.form.email')}</Label>
              <Input
                id="dialog-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('inscription.form.emailPlaceholder')}
                required
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-phone">{t('inscription.form.phone')}</Label>
              <Input
                id="dialog-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('inscription.form.phonePlaceholder')}
                readOnly
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Please confirm your information above before submitting your actionnariat request.
              </p>
            </div>
            <button type="submit" className="btn-primary w-full">
              Confirm & Submit Request
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle
              className="text-2xl text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Create Account for Partnership
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <p className="text-gray-600">
              To proceed with partnership opportunities, you need to create an account. This will allow us to review your application and contact you.
            </p>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t('inscription.form.name')}</Label>
                <Input
                  id="signup-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('inscription.form.namePlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">{t('inscription.form.email')}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('inscription.form.emailPlaceholder')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">{t('inscription.form.phone')}</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('inscription.form.phonePlaceholder')}
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Create Account
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Actionnariat Management Table */}
      <Dialog open={showActionnariatTable} onOpenChange={setShowActionnariatTable}>
        <DialogContent className="max-w-4xl bg-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle
              className="text-2xl text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Actionnariat Requests Management
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {actionnariatRequests.map((request, index) => (
                    <tr key={request.id || index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                        {request.name}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                        {request.email}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                        {request.phone || '-'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {actionnariatRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No actionnariat requests yet
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Inscription;