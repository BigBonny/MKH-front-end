import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Award, Quote, Heart, BookOpen, Sparkles, FileText, Truck, Factory, GraduationCap, Plane as PlaneIcon, HandHeart, ChevronDown, ChevronUp, X, Download, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(ScrollTrigger);

type TFunction = (key: string) => string;

const PublicationsSection = ({ t }: { t: TFunction }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const publications = [
    {
      image: '/images site MKH new/Couv Journal Essai Mémoire/Couv livre Mok_page-0001 (1).jpg',
      type: t('impact.publications.book1.type'),
      title: t('impact.publications.book1.title'),
      year: '2026',
      desc: t('impact.publications.book1.desc'),
    },
    {
      image: '/images site MKH new/Logo ALB ok.jpg',
      type: t('impact.publications.book2.type'),
      title: t('impact.publications.book2.title'),
      year: '2025',
      desc: t('impact.publications.book2.desc'),
    },
    {
      image: '/images site MKH new/Couv Journal Essai Mémoire/Couv. Livre Pôm Man.jpg',
      type: t('impact.publications.book3.type'),
      title: t('impact.publications.book3.title'),
      year: '2027',
      desc: t('impact.publications.book3.desc'),
    },
  ];

  return (
    <div className="mb-32">
      <div className="text-center mb-16">
        <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase block mb-4">
          Publications
        </span>
        <h3
          className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Ouvrages
        </h3>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {publications.map((pub, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 cursor-pointer"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            <div className="h-64 overflow-hidden">
              <img
                src={pub.image}
                alt={pub.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6">
              <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-semibold mb-1">{pub.type} &middot; {pub.year}</p>
              <h4 className="text-base font-semibold text-[#1A1A1A] leading-tight mb-3">{pub.title}</h4>
              <div className="flex items-center gap-1 text-xs text-[#D4AF37]/70">
                {expanded === idx
                  ? <><ChevronUp className="w-3 h-3" /><span>Reduire</span></>
                  : <><ChevronDown className="w-3 h-3" /><span>En savoir plus</span></>}
              </div>
              {expanded === idx && (
                <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                  <p className="text-sm text-[#1A1A1A]/70 leading-relaxed whitespace-pre-line">{pub.desc}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PublicationsPresseSection = ({ t }: { t: TFunction }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [requestEmail, setRequestEmail] = useState('');
  const [requestMessage, setRequestMessage] = useState(
    'Bonjour,\n\nJe souhaite recevoir un exemplaire de la revue Pouvoir — Hors-série.\n\nMerci.'
  );
  const [requestSending, setRequestSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handlePdfRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestEmail) return;
    setRequestSending(true);

    try {
      await emailjs.send(
        'service_akwkjcn',
        'template_9n1v92s',
        {
          from_name: requestEmail,
          from_email: requestEmail,
          subject: 'Demande de la revue Pouvoir Hors-Série',
          message: requestMessage,
          to_email: 'info@mbouma-kohomm-holding.com',
        },
        'Gfj5leeUAz7bDlt5V'
      );
      setRequestSent(true);
      setRequestEmail('');
      setRequestMessage(
        'Bonjour,\n\nJe souhaite recevoir un exemplaire de la revue Pouvoir — Hors-série.\n\nMerci.'
      );
      setTimeout(() => setRequestSent(false), 5000);
    } catch (error) {
      console.error('EmailJS request error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setRequestSending(false);
    }
  };

  const presseItems = [
    {
      image: '/images site MKH new/Magazines.jpg',
      type: t('publications-presse.tribune.type'),
      title: t('publications-presse.tribune.title'),
      year: t('publications-presse.tribune.year'),
      desc: t('publications-presse.tribune.desc'),
    },
    {
      image: '/images site MKH new/Couv Journal Essai Mémoire/Couverture Pouvoir hors serie 2 3 (2)_page-0001.jpg',
      type: t('publications-presse.revue.type'),
      title: t('publications-presse.revue.title'),
      year: t('publications-presse.revue.year'),
      desc: t('publications-presse.revue.desc'),
    },
    {
      image: '/images site MKH new/Choose Africa.jpg',
      type: t('publications-presse.choose.type'),
      title: t('publications-presse.choose.title'),
      year: t('publications-presse.choose.year'),
      desc: t('publications-presse.choose.desc'),
    },
  ];

  return (
    <div className="mb-32">
      {/* PDF Request Modal */}
      {showPdfModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPdfModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-4 right-4 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-5">
              <Download className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3
              className="text-xl font-semibold text-[#1A1A1A] mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Obtenir la revue
            </h3>
            <div className="w-8 h-0.5 bg-[#D4AF37] mb-4" />
            <p className="text-[#1A1A1A]/70 text-sm leading-relaxed mb-6">
              Le téléchargement de la revue <strong>Pouvoir — Hors-série</strong> sera bientôt disponible en ligne.
              Envoyez-nous votre demande et nous vous contacterons dès que possible.
            </p>

            {requestSent ? (
              <div className="flex flex-col items-center text-center py-4 animate-in fade-in duration-500">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#1A1A1A] font-medium">Demande envoyée !</p>
                <p className="text-[#1A1A1A]/60 text-sm mt-1">Nous vous répondrons rapidement.</p>
              </div>
            ) : (
              <form onSubmit={handlePdfRequest} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="pdf-email" className="text-[#1A1A1A]">
                    Votre email
                  </Label>
                  <Input
                    id="pdf-email"
                    type="email"
                    value={requestEmail}
                    onChange={(e) => setRequestEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdf-message" className="text-[#1A1A1A]">
                    Votre message
                  </Label>
                  <Textarea
                    id="pdf-message"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={requestSending}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{requestSending ? 'Envoi...' : 'Envoyer la demande'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="text-center mb-16">
        <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase block mb-4">
          {t('publications-presse.subtitle')}
        </span>
        <h3
          className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {t('publications-presse.title')}
        </h3>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {presseItems.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 cursor-pointer"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            <div className="h-64 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-6">
              <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-semibold mb-1">{item.type} &middot; {item.year}</p>
              <h4 className="text-base font-semibold text-[#1A1A1A] leading-tight mb-3">{item.title}</h4>
              <div className="flex items-center gap-1 text-xs text-[#D4AF37]/70">
                {expanded === idx
                  ? <><ChevronUp className="w-3 h-3" /><span>Reduire</span></>
                  : <><ChevronDown className="w-3 h-3" /><span>En savoir plus</span></>}
              </div>
              {expanded === idx && (
                <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                  <p className="text-sm text-[#1A1A1A]/70 leading-relaxed">{item.desc}</p>
                </div>
              )}
              {idx === 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPdfModal(true); }}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white text-xs font-semibold rounded-lg hover:bg-[#D4AF37]/80 transition-colors w-fit"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MKH = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const eternalLoveRef = useRef<HTMLDivElement>(null);
  const [activeValue, setActiveValue] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0, scale: 1.1 },
        {
          clipPath: 'circle(100% at 50% 50%)',
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.animate-item');
        gsap.fromTo(
          elements,
          { y: 60, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      gsap.fromTo(
        quoteRef.current,
        { scale: 0.8, opacity: 0, rotationX: 15 },
        {
          scale: 1,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      if (portraitRef.current) {
        const portraitImg = portraitRef.current.querySelector('img');
        gsap.to(portraitImg, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: portraitRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (eternalLoveRef.current) {
        const cards = eternalLoveRef.current.querySelectorAll('.love-card');
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: eternalLoveRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const valueCards = document.querySelectorAll('.value-card');
      valueCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => setActiveValue(index));
        card.addEventListener('mouseleave', () => setActiveValue(null));
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Target,
      title: t('mkh.mission.title'),
      description: t('mkh.mission.desc'),
      gradient: 'from-amber-500/20 to-orange-500/20',
    },
    {
      icon: Eye,
      title: t('mkh.vision.title'),
      description: t('mkh.vision.desc'),
      gradient: 'from-blue-500/20 to-purple-500/20',
    },
    {
      icon: Award,
      title: t('mkh.values.title'),
      description: t('mkh.values.desc'),
      gradient: 'from-emerald-500/20 to-teal-500/20',
    },
  ];

  return (
    <section
      id="mkh"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#F5F0E6] overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="section-padding relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24 relative">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <img
              src="/images site MKH new/Logo MKH.jpg"
              alt="MKH"
              className="h-28 md:h-36 w-auto rounded-xl"
            />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[#D4AF37]/10 rounded-full text-[#D4AF37] text-xs font-semibold tracking-widest uppercase mb-6 border border-[#D4AF37]/20">
              {t('mkh.subtitle')}
            </span>
            <h3
              className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('mkh.ourMission')}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-5 relative group">
              <div
                ref={imageRef}
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                style={{ willChange: 'clip-path, opacity' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <img
                  src="/images site MKH new/Logo MK.jpg"
                  alt="MKH Mission"
                  className="w-full h-[500px] md:h-[700px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 5%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-[#1A1A1A]/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#D4AF37]/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#D4AF37]/20 rounded-full -z-10" />
            </div>

            <div ref={contentRef} className="lg:col-span-7 space-y-8">
              <div className="prose prose-lg max-w-none bg-white/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
                <p className="text-lg md:text-xl text-[#1A1A1A]/80 leading-relaxed font-light animate-item">
                  {t('mkh.missionText')}
                </p>
                <div className="flex items-center gap-4 my-8 animate-item">
                  <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <div className="h-px flex-1 bg-gradient-to-l from-[#D4AF37]/50 to-transparent" />
                </div>
                <p className="text-lg md:text-xl text-[#1A1A1A]/80 leading-relaxed font-light animate-item">
                  {t('mkh.missionText2')}
                </p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="mt-24">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`value-card group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${activeValue === index ? 'scale-105' : ''}`}
                  onClick={() => setSelectedValue(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 mb-6 group-hover:bg-[#D4AF37] transition-colors duration-500">
                      <value.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-[#1A1A1A] mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-xs text-[#D4AF37]/70 uppercase tracking-wider mt-1">Cliquer pour en savoir plus</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portrait Section */}
        <div className="mb-32" ref={portraitRef}>
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase block mb-4">
              {t('mkh.portrait.title')}
            </span>
            <h3
              className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mt-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('mkh.portrait.name')}
            </h3>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Portrait Content */}
            <div className="order-2 lg:order-1 space-y-6">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#D4AF37]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-1 h-16 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full" />
                    <p className="text-base md:text-lg text-[#1A1A1A]/80 leading-relaxed">
                      {t('mkh.portrait.bio')}
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-[#1A1A1A]/20 to-transparent rounded-full" />
                    <p className="text-base md:text-lg text-[#1A1A1A]/80 leading-relaxed">
                      {t('mkh.portrait.bio2')}
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#D4AF37]/20">
                  <p className="text-[#D4AF37] italic text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                    "Building tomorrow, today"
                  </p>
                </div>
              </div>
            </div>

            {/* Portrait Image + Esprit text */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/30 to-transparent rounded-3xl transform rotate-3 scale-105" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src="/mk2.jpeg"
                    alt="Portrait de Mbouma Kohomm"
                    className="w-full h-[600px] md:h-[700px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent">
                    <p className="text-white/90 text-sm uppercase tracking-widest mb-2">Founder &amp; Visionary</p>
                    <p className="text-white text-2xl font-light" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Mbouma Kohomm
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-48 h-48 border-2 border-[#D4AF37] rounded-3xl -z-10" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#D4AF37]/20 rounded-3xl -z-10 backdrop-blur-sm" />
              </div>

              {/* Esprit libre text below portrait image */}
              <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#D4AF37]/20 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-12 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full flex-shrink-0" />
                  <p className="text-sm md:text-base text-[#1A1A1A]/70 leading-relaxed italic">
                    {t('mkh.spirit.text')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Biography */}
        <div className="mb-32 relative">
          <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-16 border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-12">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <BookOpen className="w-6 h-6 text-[#D4AF37] mx-4" />
                <span className="text-[#D4AF37] text-sm uppercase tracking-widest font-semibold">Parcours</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
              <p className="text-xl md:text-2xl text-[#1A1A1A]/80 leading-relaxed text-center font-light">
                {t('mkh.extendedBio')}
              </p>
              <div className="mt-12 flex justify-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm text-[#1A1A1A]/70">A life dedicated to excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Eternal Love Section */}
        <div className="mb-32" ref={eternalLoveRef}>
          <div className="text-center mb-20">
            <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase block mb-4">
              In Memoriam
            </span>
            <h3
              className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('mkh.eternalLove.title')}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Parents Card */}
            <div className="love-card group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-3xl transform rotate-1 scale-[1.02] opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10">
                <div className="p-6 text-center border-b border-[#D4AF37]/10 bg-gradient-to-b from-[#F5F0E6] to-white">
                  <h4 className="text-lg font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                    {t('mkh.eternalLove.parents')}
                  </h4>
                  <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto" />
                </div>
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src="/2.jpg"
                    alt="Mbouma Podok Nop Pierre - Ngo Banim Ida"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    style={{ objectPosition: 'center 0%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                    <Heart className="w-8 h-8 text-white/80 animate-pulse" />
                  </div>
                </div>
                <div className="p-6 bg-[#F5F0E6]/50">
                  <p className="text-sm text-[#1A1A1A]/70 italic text-center leading-relaxed">
                    {t('mkh.eternalLove.parentsLegend')}
                  </p>
                </div>
              </div>
            </div>

            {/* Soulmate Card */}
            <div className="love-card group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-3xl transform -rotate-1 scale-[1.02] opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10">
                <div className="p-6 text-center border-b border-[#D4AF37]/10 bg-gradient-to-b from-[#F5F0E6] to-white">
                  <h4 className="text-lg font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                    {t('mkh.eternalLove.soulmate')}
                  </h4>
                  <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto" />
                </div>
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src="/Images site MKH/Chantal Marie Christine.jpg"
                    alt={t('mkh.eternalLove.soulmateName')}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    style={{ objectPosition: 'center 0%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                    <Heart className="w-8 h-8 text-white/80 animate-pulse" />
                  </div>
                </div>
                <div className="p-6 bg-[#F5F0E6]/50">
                  <p className="text-sm text-[#1A1A1A]/70 italic text-center leading-relaxed">
                    {t('mkh.eternalLove.soulmateName')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy & Works */}
        <div className="mb-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-10">
                {/* Philosophy */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-3xl p-10 shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl border-2 border-[#D4AF37] flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h4 className="text-xl font-semibold text-[#1A1A1A] mb-4">Philosophie</h4>
                    <p className="text-base text-[#1A1A1A]/70 leading-relaxed">
                      {t('mkh.philosophy.text')}
                    </p>
                  </div>
                </div>

                {/* Works */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 rounded-3xl p-10 shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl border-2 border-[#D4AF37] flex items-center justify-center mb-6">
                      <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h4 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t('mkh.works.title')}</h4>
                    <p className="text-base text-[#1A1A1A]/70 leading-relaxed">
                      {t('mkh.works.list')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-[#D4AF37]/10 rounded-3xl blur-2xl" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border-2 border-[#D4AF37]/20">
                  <img
                    src="/images site MKH new/4.jpg"
                    alt="MKH"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Publications with book covers (clickable) */}
        <PublicationsSection t={t} />

        {/* Publications Presse */}
        <PublicationsPresseSection t={t} />

        {/* Notre Ecosysteme */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase block mb-4">
              Activites
            </span>
            <h3
              className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Notre Ecosysteme
            </h3>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-6" />
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 hover:-translate-y-1">
                <div className="h-40 overflow-hidden">
                  <img src="/images site MKH new/Logo PMG.jpg" alt="Medias" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="font-semibold text-[#1A1A1A]">Medias</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-[#1A1A1A]/60">
                    <li>Magazines</li>
                    <li>Numériques</li>
                    <li>Événements</li>
                  </ul>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 hover:-translate-y-1">
                <div className="h-40 overflow-hidden">
                  <img src="/images site MKH new/Icône agroindustrie.jpg" alt="Agro-industrie" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Factory className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="font-semibold text-[#1A1A1A]">Agro-industrie</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-[#1A1A1A]/60">
                    <li>Agriculture</li>
                    <li>Elevage</li>
                    <li>Transformation</li>
                  </ul>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 hover:-translate-y-1">
                <div className="h-40 overflow-hidden">
                  <img src="/images site MKH new/symbole formation.png" alt="Formation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="font-semibold text-[#1A1A1A]">Formation</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-[#1A1A1A]/60">
                    <li>Ésotérique</li>
                    <li>Philosophique</li>
                    <li>Pouvoirs personnels</li>
                  </ul>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 hover:-translate-y-1">
                <div className="h-40 overflow-hidden">
                  <img src="/images site MKH new/icône tourisme.jpg" alt="Tourisme" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <PlaneIcon className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="font-semibold text-[#1A1A1A]">Tourisme</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-[#1A1A1A]/60">
                    <li>Excursions</li>
                    <li>Voyages</li>
                    <li>Campings</li>
                  </ul>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 hover:-translate-y-1">
                <div className="h-40 overflow-hidden">
                  <img src="/images site MKH new/Symbole transport.jpg" alt="Transports" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="font-semibold text-[#1A1A1A]">Transports</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-[#1A1A1A]/60">
                    <li>Urbains</li>
                    <li>Charters</li>
                  </ul>
                </div>
              </div>

              <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#D4AF37]/10 hover:-translate-y-1">
                <div className="h-40 overflow-hidden">
                  <img src="/images site MKH new/Image association.jpg" alt="Associations" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <HandHeart className="w-5 h-5 text-[#D4AF37]" />
                    <h4 className="font-semibold text-[#1A1A1A]">Associations</h4>
                  </div>
                  <ul className="space-y-1 text-sm text-[#1A1A1A]/60">
                    <li>Économique</li>
                    <li>Humanitaire</li>
                    <li>Réseautique</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Quote */}
        <div
          ref={quoteRef}
          className="relative max-w-4xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 via-transparent to-[#D4AF37]/20 rounded-3xl transform rotate-1 scale-105 blur-xl" />
          <div className="relative bg-[#F5F0E6] border-2 border-[#D4AF37] rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50" />
            <Quote className="w-12 h-12 text-[#D4AF37] mx-auto mb-8 opacity-50" />
            <blockquote
              className="text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A] italic leading-relaxed mb-8 text-center"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              "{t('mkh.quote')}"
            </blockquote>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#D4AF37]" />
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <div className="h-px w-12 bg-[#D4AF37]" />
            </div>
            <p className="text-lg md:text-xl text-[#1A1A1A]/70 leading-relaxed text-center mb-8">
              {t('mkh.maxime.text')}
            </p>
            <cite className="block text-center text-[#D4AF37] font-semibold not-italic text-sm uppercase tracking-[0.3em]">
              — Mbouma Kohomm
            </cite>
          </div>
        </div>
      </div>

      {/* Value Card Modal */}
      {selectedValue !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-sm"
          onClick={() => setSelectedValue(null)}
        >
          <div
            className={`relative bg-gradient-to-br ${values[selectedValue].gradient} bg-white rounded-3xl p-8 md:p-12 max-w-xl w-full shadow-2xl border-2 border-[#D4AF37]/30`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedValue(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-colors duration-300"
            >
              <X className="w-4 h-4 text-[#1A1A1A] hover:text-white" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                {selectedValue !== null && (() => {
                  const Icon = values[selectedValue].icon;
                  return <Icon className="w-7 h-7 text-white" />;
                })()}
              </div>
              <h3
                className="text-2xl font-semibold text-[#1A1A1A]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {values[selectedValue].title}
              </h3>
            </div>

            <div className="w-full h-px bg-[#D4AF37]/30 mb-6" />

            <div className="space-y-3">
              {values[selectedValue].description.split('\n').map((line, i) => (
                line.trim() === '' ? <div key={i} className="h-2" /> :
                <p key={i} className="text-[#1A1A1A]/80 leading-relaxed text-base">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default MKH;
