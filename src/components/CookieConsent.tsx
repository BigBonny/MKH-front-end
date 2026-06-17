import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const COOKIE_KEY = 'mkh_cookie_consent';

const CookieConsent = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      setTimeout(() => setVisible(true), 1200);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'all');
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_KEY, 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  const text = language === 'fr' ? {
    title: 'Nous respectons votre vie privée',
    desc: 'Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et personnaliser le contenu. Vous pouvez choisir les cookies que vous acceptez.',
    acceptAll: 'Tout accepter',
    essential: 'Essentiels uniquement',
    details: 'Personnaliser',
    hide: 'Masquer',
    essentialTitle: 'Cookies essentiels',
    essentialDesc: 'Nécessaires au fonctionnement du site. Toujours actifs.',
    analyticsTitle: 'Cookies analytiques',
    analyticsDesc: 'Nous aident à comprendre comment vous utilisez le site.',
    marketingTitle: 'Cookies marketing',
    marketingDesc: 'Utilisés pour vous proposer des contenus personnalisés.',
    policy: 'Politique de confidentialité',
  } : {
    title: 'We respect your privacy',
    desc: 'We use cookies to improve your experience, analyze traffic and personalize content. You can choose which cookies you accept.',
    acceptAll: 'Accept all',
    essential: 'Essential only',
    details: 'Customize',
    hide: 'Hide',
    essentialTitle: 'Essential cookies',
    essentialDesc: 'Required for the site to function. Always active.',
    analyticsTitle: 'Analytics cookies',
    analyticsDesc: 'Help us understand how you use the site.',
    marketingTitle: 'Marketing cookies',
    marketingDesc: 'Used to offer you personalized content.',
    policy: 'Privacy policy',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#1A1A1A] text-white rounded-2xl shadow-2xl border border-[#D4AF37]/20 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-lg">🍪</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-[#D4AF37] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {text.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {text.desc}
              </p>

              {showDetails && (
                <div className="mb-4 space-y-3">
                  {[
                    { title: text.essentialTitle, desc: text.essentialDesc, always: true },
                    { title: text.analyticsTitle, desc: text.analyticsDesc, always: false },
                    { title: text.marketingTitle, desc: text.marketingDesc, always: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-white/50 mt-0.5">{item.desc}</p>
                      </div>
                      <div className={`shrink-0 w-10 h-5 rounded-full flex items-center ${item.always ? 'bg-[#D4AF37]' : 'bg-white/20'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${item.always ? 'translate-x-5' : ''}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={accept}
                  className="px-5 py-2.5 bg-[#D4AF37] text-[#1A1A1A] font-semibold text-sm rounded-lg hover:bg-[#D4AF37]/90 transition-colors"
                >
                  {text.acceptAll}
                </button>
                <button
                  onClick={acceptEssential}
                  className="px-5 py-2.5 bg-white/10 text-white font-semibold text-sm rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                >
                  {text.essential}
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2.5 text-white/50 text-sm hover:text-white transition-colors underline underline-offset-2"
                >
                  {showDetails ? text.hide : text.details}
                </button>
                <a href="#" className="text-xs text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors ml-auto underline underline-offset-2">
                  {text.policy}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
