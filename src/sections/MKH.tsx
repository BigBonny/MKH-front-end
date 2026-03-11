import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Award, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const MKH = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal animation
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
        {
          clipPath: 'circle(100% at 50% 50%)',
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content stagger animation
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.animate-item');
        gsap.fromTo(
          elements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Quote animation
      gsap.fromTo(
        quoteRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: Target,
      title: t('mkh.mission.title'),
      description: t('mkh.mission.desc'),
    },
    {
      icon: Eye,
      title: t('mkh.vision.title'),
      description: t('mkh.vision.desc'),
    },
    {
      icon: Award,
      title: t('mkh.values.title'),
      description: t('mkh.values.desc'),
    },
  ];

  return (
    <section
      id="mkh"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#F5F0E6]"
    >
      <div className="section-padding">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">
            MKH
          </span>
          <h2
            className="heading-lg text-[#1A1A1A]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('mkh.title')}
          </h2>
        </div>

        {/* Mission & Portrait Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Image */}
          <div
            ref={imageRef}
            className="relative overflow-hidden rounded-lg shadow-2xl"
            style={{ willChange: 'clip-path, opacity' }}
          >
            <img
              src="/mission-image.jpg"
              alt="Mission MKH"
              className="w-full h-[500px] md:h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 to-transparent" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="animate-item">
              <h3
                className="heading-md text-[#1A1A1A] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('mkh.ourMission')}
              </h3>
              <p className="body-lg text-[#1A1A1A]/70 leading-relaxed">
                {t('mkh.missionText')}
              </p>
            </div>

            <div className="animate-item">
              <p className="body-lg text-[#1A1A1A]/70 leading-relaxed">
                {t('mkh.missionText2')}
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="animate-item text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <value.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">{value.title}</h4>
                  <p className="text-sm text-[#1A1A1A]/60">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portrait Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Portrait Content */}
          <div className="order-2 lg:order-1 space-y-6">
            <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase">
              {t('mkh.portrait.title')}
            </span>
            <h3
              className="heading-md text-[#1A1A1A]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('mkh.portrait.name')}
            </h3>
            <p className="body-lg text-[#1A1A1A]/70 leading-relaxed">
              {t('mkh.portrait.bio')}
            </p>
            <p className="body-lg text-[#1A1A1A]/70 leading-relaxed">
              {t('mkh.portrait.bio2')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <span
                  className="text-4xl md:text-5xl font-bold text-[#D4AF37] block"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  25+
                </span>
                <span className="text-sm text-[#1A1A1A]/60">{t('mkh.stats.years')}</span>
              </div>
              <div className="text-center">
                <span
                  className="text-4xl md:text-5xl font-bold text-[#D4AF37] block"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  50+
                </span>
                <span className="text-sm text-[#1A1A1A]/60">{t('mkh.stats.projects')}</span>
              </div>
              <div className="text-center">
                <span
                  className="text-4xl md:text-5xl font-bold text-[#D4AF37] block"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  10K+
                </span>
                <span className="text-sm text-[#1A1A1A]/60">{t('mkh.stats.lives')}</span>
              </div>
            </div>
          </div>

          {/* Portrait Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src="/portrait-mk.jpg"
                alt="Portrait de Mbouma Kohomm"
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/30 to-transparent" />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-[#D4AF37] rounded-lg -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#D4AF37]/10 rounded-lg -z-10" />
          </div>
        </div>

        {/* Quote */}
        <div
          ref={quoteRef}
          className="mt-24 text-center max-w-4xl mx-auto"
        >
          <Quote className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-6" />
          <blockquote
            className="text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A] italic leading-relaxed"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            "{t('mkh.quote')}"
          </blockquote>
          <cite className="mt-6 block text-[#D4AF37] font-semibold not-italic">
            — Mbouma Kohomm
          </cite>
        </div>
      </div>
    </section>
  );
};

export default MKH;
