import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      return;
    }

    if (!isSignedIn) {
      window.location.href = '/sign-in';
      return;
    }

    setIsLoading(true);

    try {
      const cartItemsForServer = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      
      // Call local API to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'Store Purchase',
          price: totalPrice * 100,
          currency: 'eur',
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          cartItems: JSON.stringify(cartItemsForServer)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = {
    fr: {
      title: 'Votre Panier',
      empty: 'Votre panier est vide',
      emptyDesc: 'Découvrez nos produits et ajoutez-les à votre panier',
      continue: 'Continuer les achats',
      subtotal: 'Sous-total',
      shipping: 'Frais de livraison calculés à l\'étape suivante',
      clear: 'Vider le panier',
      checkout: 'Commander',
      item: 'article',
      items: 'articles',
    },
    en: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      emptyDesc: 'Discover our products and add them to your cart',
      continue: 'Continue shopping',
      subtotal: 'Subtotal',
      shipping: 'Shipping calculated at next step',
      clear: 'Clear cart',
      checkout: 'Checkout',
      item: 'item',
      items: 'items',
    },
  }[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
            <h2
              className="text-2xl font-semibold text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t.title}
            </h2>
            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium rounded-full">
              {totalItems} {totalItems > 1 ? t.items : t.item}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t.empty}</p>
              <p className="text-gray-400 text-sm mt-2">{t.emptyDesc}</p>
              <button onClick={onClose} className="btn-primary mt-6">
                {t.continue}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  {/* Image */}
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1A1A1A] truncate">{item.name}</h3>
                    <p className="text-[#D4AF37] font-bold mt-1">{item.price.toLocaleString()} €</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-[#D4AF37] transition-colors"
                        disabled={isLoading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-[#D4AF37] transition-colors"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors self-start"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">{t.subtotal}</span>
              <span className="text-xl font-bold text-[#1A1A1A]">{totalPrice.toLocaleString()} €</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">{t.shipping}</p>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                {t.clear}
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-3 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#B8941F] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>{t.checkout}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
