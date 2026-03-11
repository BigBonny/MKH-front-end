import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Package, Handshake, Check, ChevronRight, Users, BookOpen, Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const Inscription = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'actionnariat' | 'abonnement' | 'partenariat'>('actionnariat');
  const [showForm, setShowForm] = useState(false);
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

  const actionnariatBenefits = [
    { icon: TrendingUp, text: t('inscription.actionnariat.benefit1') },
    { icon: Users, text: t('inscription.actionnariat.benefit2') },
    { icon: Gift, text: t('inscription.actionnariat.benefit3') },
    { icon: Check, text: t('inscription.actionnariat.benefit4') },
  ];

  const abonnementPlans = [
    {
      name: t('inscription.abonnement.basic.name'),
      price: '49€',
      period: t('inscription.abonnement.month'),
      features: [
        t('inscription.abonnement.basic.feature1'),
        t('inscription.abonnement.basic.feature2'),
        t('inscription.abonnement.basic.feature3'),
      ],
    },
    {
      name: t('inscription.abonnement.premium.name'),
      price: '99€',
      period: t('inscription.abonnement.month'),
      features: [
        t('inscription.abonnement.premium.feature1'),
        t('inscription.abonnement.premium.feature2'),
        t('inscription.abonnement.premium.feature3'),
        t('inscription.abonnement.premium.feature4'),
      ],
      popular: true,
    },
    {
      name: t('inscription.abonnement.vip.name'),
      price: '199€',
      period: t('inscription.abonnement.month'),
      features: [
        t('inscription.abonnement.vip.feature1'),
        t('inscription.abonnement.vip.feature2'),
        t('inscription.abonnement.vip.feature3'),
        t('inscription.abonnement.vip.feature4'),
        t('inscription.abonnement.vip.feature5'),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('inscription.form.success'));
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '' });
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h3
                  className="text-3xl md:text-4xl text-[#1A1A1A] font-semibold"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('inscription.actionnariat.heading')}
                </h3>
                <p className="body-lg text-[#1A1A1A]/70">
                  {t('inscription.actionnariat.desc')}
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {actionnariatBenefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm"
                    >
                      <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <span className="text-[#1A1A1A]/80">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowForm(true)}
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
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-[#D4AF37] rounded-2xl -z-10" />
              </div>
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
                        {t('inscription.abonnement.popular')}
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
                      onClick={() => setShowForm(true)}
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
                      onClick={() => setShowForm(true)}
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
              <Label htmlFor="name">{t('inscription.form.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('inscription.form.namePlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('inscription.form.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('inscription.form.emailPlaceholder')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('inscription.form.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('inscription.form.phonePlaceholder')}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              {t('inscription.form.submit')}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Inscription;
