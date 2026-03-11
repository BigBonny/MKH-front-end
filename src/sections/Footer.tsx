import { Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    mkh: [
      { label: t('footer.mkh.mission'), href: '#mkh' },
      { label: t('footer.mkh.portrait'), href: '#mkh' },
      { label: t('footer.mkh.history'), href: '#mkh' },
    ],
    impact: [
      { label: t('footer.impact.works'), href: '#impact' },
      { label: t('footer.impact.publications'), href: '#impact' },
      { label: t('footer.impact.partners'), href: '#impact' },
    ],
    store: [
      { label: t('footer.store.fashion'), href: '#store' },
      { label: t('footer.store.atrium'), href: '#store' },
      { label: t('footer.store.new'), href: '#store' },
    ],
    legal: [
      { label: t('footer.legal.privacy'), href: '#' },
      { label: t('footer.legal.terms'), href: '#' },
      { label: t('footer.legal.cookies'), href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <a href="#" className="inline-block mb-6">
                <span
                  className="text-4xl font-bold text-[#D4AF37]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  MKH
                </span>
              </a>
              <p className="text-white/60 mb-6 max-w-sm">
                {t('footer.description')}
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-white/60 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-[#D4AF37] font-semibold mb-6 uppercase tracking-wider text-sm">
                MKH
              </h4>
              <ul className="space-y-3">
                {footerLinks.mkh.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-[#D4AF37] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#D4AF37] font-semibold mb-6 uppercase tracking-wider text-sm">
                IMPACT
              </h4>
              <ul className="space-y-3">
                {footerLinks.impact.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-[#D4AF37] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#D4AF37] font-semibold mb-6 uppercase tracking-wider text-sm">
                STORE
              </h4>
              <ul className="space-y-3">
                {footerLinks.store.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-[#D4AF37] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-[#D4AF37] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-sm text-white/40 flex items-center gap-1">
              © {new Date().getFullYear()} MKH. {t('footer.rights')}
            </p>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center hover:bg-[#B8941F] transition-colors duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
