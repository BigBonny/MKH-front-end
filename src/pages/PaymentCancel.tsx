import { XCircle, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PaymentCancel = () => {
  const { language } = useLanguage();

  const t = {
    fr: {
      title: 'Paiement annulé',
      subtitle: 'Votre paiement a été annulé',
      description: 'Aucun montant n\'a été débité. Vous pouvez réessayer ou continuer vos achats.',
      retry: 'Réessayer le paiement',
      continue: 'Continuer mes achats',
      help: 'Besoin d\'aide ? Contactez-nous',
    },
    en: {
      title: 'Payment cancelled',
      subtitle: 'Your payment was cancelled',
      description: 'No amount was charged. You can try again or continue shopping.',
      retry: 'Retry payment',
      continue: 'Continue shopping',
      help: 'Need help? Contact us',
    },
  }[language];

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-12 h-12 text-orange-600" />
        </div>
        
        <h1
          className="text-3xl md:text-4xl text-[#1A1A1A] font-bold mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {t.title}
        </h1>
        
        <p className="text-[#1A1A1A]/60 text-lg mb-4">
          {t.subtitle}
        </p>
        
        <p className="text-[#1A1A1A]/60 mb-8">
          {t.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            <span>{t.retry}</span>
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.continue}</span>
          </a>
        </div>
        
        <a
          href="/#contact"
          className="inline-flex items-center justify-center gap-2 text-[#1A1A1A]/60 hover:text-[#D4AF37] transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.help}</span>
        </a>
      </div>
    </div>
  );
};

export default PaymentCancel;
