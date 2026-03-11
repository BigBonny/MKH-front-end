import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, Wine, Coffee, Cigarette, Shirt, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  type: 'fashion' | 'atrium';
}

const Store = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'fashion' | 'atrium'>('fashion');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t } = useLanguage();
  const { addItem } = useCart();

  const fashionProducts: Product[] = [
    {
      id: 1,
      name: t('store.fashion.men.suit1.name'),
      category: 'Men',
      price: 1250,
      image: '/fashion-men.png',
      description: t('store.fashion.men.suit1.desc'),
      type: 'fashion',
    },
    {
      id: 2,
      name: t('store.fashion.women.dress1.name'),
      category: 'Women',
      price: 890,
      image: '/fashion-women.png',
      description: t('store.fashion.women.dress1.desc'),
      type: 'fashion',
    },
    {
      id: 3,
      name: t('store.fashion.men.suit2.name'),
      category: 'Men',
      price: 1450,
      image: '/fashion-men.png',
      description: t('store.fashion.men.suit2.desc'),
      type: 'fashion',
    },
    {
      id: 4,
      name: t('store.fashion.women.dress2.name'),
      category: 'Women',
      price: 1100,
      image: '/fashion-women.png',
      description: t('store.fashion.women.dress2.desc'),
      type: 'fashion',
    },
  ];

  const atriumProducts: Product[] = [
    {
      id: 5,
      name: t('store.atrium.wine1.name'),
      category: 'Wine',
      price: 350,
      image: '/atrium-wine.jpg',
      description: t('store.atrium.wine1.desc'),
      type: 'atrium',
    },
    {
      id: 6,
      name: t('store.atrium.cigars1.name'),
      category: 'Cigars',
      price: 280,
      image: '/atrium-cigars.jpg',
      description: t('store.atrium.cigars1.desc'),
      type: 'atrium',
    },
    {
      id: 7,
      name: t('store.atrium.coffee1.name'),
      category: 'Coffee',
      price: 85,
      image: '/atrium-coffee.jpg',
      description: t('store.atrium.coffee1.desc'),
      type: 'atrium',
    },
    {
      id: 8,
      name: t('store.atrium.spirits1.name'),
      category: 'Spirits',
      price: 420,
      image: '/atrium-wine.jpg',
      description: t('store.atrium.spirits1.desc'),
      type: 'atrium',
    },
  ];

  const products = activeTab === 'fashion' ? fashionProducts : atriumProducts;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
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

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    setSelectedProduct(null);
  };

  return (
    <section
      id="store"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#F5F0E6]"
    >
      <div className="section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">
            STORE
          </span>
          <h2
            className="heading-lg text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('store.title')}
          </h2>
          <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto body-lg">
            {t('store.subtitle')}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('fashion')}
            className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'fashion'
                ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                : 'bg-white text-[#1A1A1A] hover:bg-[#D4AF37]/10'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>{t('store.fashion.title')}</span>
          </button>
          <button
            onClick={() => setActiveTab('atrium')}
            className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'atrium'
                ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30'
                : 'bg-white text-[#1A1A1A] hover:bg-[#D4AF37]/10'
            }`}
          >
            <Wine className="w-5 h-5" />
            <span>{t('store.atrium.title')}</span>
          </button>
        </div>

        {/* Sub-categories */}
        <div className="flex justify-center gap-6 mb-12">
          {activeTab === 'fashion' ? (
            <>
              <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                <Shirt className="w-4 h-4" />
                <span className="text-sm">{t('store.fashion.men.title')}</span>
              </div>
              <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">{t('store.fashion.women.title')}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                <Wine className="w-4 h-4" />
                <span className="text-sm">{t('store.atrium.wine')}</span>
              </div>
              <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                <Cigarette className="w-4 h-4" />
                <span className="text-sm">{t('store.atrium.cigars')}</span>
              </div>
              <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                <Coffee className="w-4 h-4" />
                <span className="text-sm">{t('store.atrium.coffee')}</span>
              </div>
            </>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div
                className="relative overflow-hidden aspect-[3/4] cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick Add Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="absolute bottom-4 left-4 right-4 py-3 bg-[#D4AF37] text-white font-semibold rounded-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t('store.addToCart')}</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                  {product.category}
                </span>
                <h3
                  className="text-lg text-[#1A1A1A] font-semibold mt-2 mb-2 group-hover:text-[#D4AF37] transition-colors"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-[#1A1A1A]">
                  {product.price.toLocaleString()} €
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl bg-white">
          {selectedProduct && (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-[3/4] overflow-hidden rounded-lg">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-sm text-[#D4AF37] font-semibold uppercase tracking-wider">
                    {selectedProduct.category}
                  </span>
                  <DialogHeader>
                    <DialogTitle
                      className="text-3xl text-[#1A1A1A] mt-2"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {selectedProduct.name}
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-[#1A1A1A]/60 mt-4 mb-6">
                    {selectedProduct.description}
                  </p>
                  <p className="text-3xl font-bold text-[#1A1A1A] mb-8">
                    {selectedProduct.price.toLocaleString()} €
                  </p>
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="btn-primary w-full flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{t('store.addToCart')}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Store;
