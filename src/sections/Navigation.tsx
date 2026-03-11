import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Globe, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface NavigationProps {
  onCartClick: () => void;
}

const Navigation = ({ onCartClick }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { items } = useCart();

  const navLinks = [
    { href: '#mkh', label: 'MKH' },
    { href: '#impact', label: 'IMPACT' },
    { href: '#store', label: 'STORE' },
    { href: '#news', label: 'NEWS' },
    { href: '#inscription', label: 'INSCRIPTION' },
    { href: '#account', label: 'MON COMPTE' },
    { href: '#contact', label: 'CONTACT' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative z-10"
            >
              <span
                className={`text-2xl md:text-3xl font-bold tracking-wider transition-colors duration-300 ${
                  isScrolled ? 'text-[#D4AF37]' : 'text-white'
                }`}
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                MKH
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-xs font-medium tracking-widest uppercase transition-all duration-300 underline-gold ${
                    isScrolled
                      ? 'text-white/80 hover:text-[#D4AF37]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                className={`p-2 transition-colors duration-300 ${
                  isScrolled ? 'text-white/80 hover:text-[#D4AF37]' : 'text-white/80 hover:text-white'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className={`flex items-center gap-1 p-2 transition-colors duration-300 ${
                  isScrolled ? 'text-white/80 hover:text-[#D4AF37]' : 'text-white/80 hover:text-white'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-medium uppercase">{language}</span>
              </button>

              {/* Cart */}
              <button
                onClick={onCartClick}
                className={`relative p-2 transition-colors duration-300 ${
                  isScrolled ? 'text-white/80 hover:text-[#D4AF37]' : 'text-white/80 hover:text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 transition-colors duration-300 ${
                  isScrolled ? 'text-white' : 'text-white'
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#1A1A1A] transition-all duration-500 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-2xl font-medium text-white hover:text-[#D4AF37] transition-colors duration-300"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: isMobileMenuOpen ? 'slideUp 0.5s ease forwards' : 'none',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
