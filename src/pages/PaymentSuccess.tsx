import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    // Vider le panier après un paiement réussi
    clearCart();
    
    // Ici vous pourriez récupérer les détails de la commande depuis votre backend
    if (sessionId) {
      setOrderDetails({
        orderId: sessionId.slice(0, 8).toUpperCase(),
        amount: 0, // Récupérer depuis l'API
      });
    }
  }, [searchParams, clearCart]);

  const t = {
    fr: {
      title: 'Paiement réussi !',
      subtitle: 'Merci pour votre commande',
      orderNumber: 'Numéro de commande',
      confirmation: 'Un email de confirmation a été envoyé à votre adresse.',
      continue: 'Continuer mes achats',
      account: 'Voir mon compte',
    },
    en: {
      title: 'Payment successful!',
      subtitle: 'Thank you for your order',
      orderNumber: 'Order number',
      confirmation: 'A confirmation email has been sent to your address.',
      continue: 'Continue shopping',
      account: 'View my account',
    },
  }[language];

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1
          className="text-3xl md:text-4xl text-[#1A1A1A] font-bold mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {t.title}
        </h1>
        
        <p className="text-[#1A1A1A]/60 text-lg mb-8">
          {t.subtitle}
        </p>
        
        {orderDetails && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-[#D4AF37] mb-2">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-semibold">{t.orderNumber}</span>
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              #{orderDetails.orderId}
            </p>
          </div>
        )}
        
        <p className="text-[#1A1A1A]/60 mb-8">
          {t.confirmation}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#B8941F] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t.continue}</span>
          </a>
          <a
            href="/account"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-white transition-colors"
          >
            <span>{t.account}</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
