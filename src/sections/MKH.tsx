import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Award, Quote, Heart, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const MKH = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const eternalLoveRef = useRef<HTMLDivElement>(null);
  const [activeValue, setActiveValue] = useState<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero image reveal with cinematic clip-path
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

      // Content stagger with enhanced easing
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

      // Quote animation with scale and rotation
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

      // Portrait section parallax
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

      // Eternal love cards stagger
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

      // Values cards hover animation setup
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
        {/* Enhanced Section Header */}
        <div className="text-center mb-24 relative">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <Sparkles className="w-5 h-5 text-[#D4AF37] animate-spin-slow" />
            <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.4em] uppercase">
              MKH
            </span>
            <Sparkles className="w-5 h-5 text-[#D4AF37] animate-spin-slow" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* Mission Section with Asymmetric Layout */}
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
            {/* Image with Enhanced Frame */}
            <div className="lg:col-span-5 relative group">
              <div
                ref={imageRef}
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                style={{ willChange: 'clip-path, opacity' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <img
                  src="/mission-image.jpg"
                  alt="photo 1"
                  className="w-full h-[500px] md:h-[700px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 5%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-[#1A1A1A]/20 to-transparent" />
                
                {/* Floating Badge */}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#D4AF37]/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#D4AF37]/20 rounded-full -z-10" />
            </div>

            {/* Content with Glassmorphism */}
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

              {/* Quick Stats */}
              {/* <div className="grid grid-cols-3 gap-4 animate-item">
                {[
                  { label: 'Years', value: '25+' },
                  { label: 'Projects', value: '100+' },
                  { label: 'Lives', value: '∞' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-white/60 rounded-xl border border-[#D4AF37]/10">
                    <p className="text-2xl md:text-3xl font-light text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div> */}
            </div>
          </div>

          {/* Enhanced Values Grid */}
          <div className="mt-24">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`value-card group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${activeValue === index ? 'scale-105' : ''}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 mb-6 group-hover:bg-[#D4AF37] transition-colors duration-500">
                      <value.icon className="w-8 h-8 text-[#D4AF37] group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-[#1A1A1A] mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portrait Section with Magazine Layout */}
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

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Portrait Content with Elegant Typography */}
            <div className="order-2 lg:order-1 space-y-6">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#D4AF37]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-1 h-16 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full" />
                    <div>
                      <p className="text-base md:text-lg text-[#1A1A1A]/80 leading-relaxed">
                        {t('mkh.portrait.bio')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-[#1A1A1A]/20 to-transparent rounded-full" />
                    <div>
                      <p className="text-base md:text-lg text-[#1A1A1A]/80 leading-relaxed">
                        {t('mkh.portrait.bio2')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signature Element */}
                <div className="mt-8 pt-6 border-t border-[#D4AF37]/20">
                  <p className="text-[#D4AF37] italic text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                    "Building tomorrow, today"
                  </p>
                </div>
              </div>
            </div>

            {/* Portrait Image with Advanced Framing */}
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
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent">
                    <p className="text-white/90 text-sm uppercase tracking-widest mb-2">Founder & Visionary</p>
                    <p className="text-white text-2xl font-light" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Mbouma Kohomm
                    </p>
                  </div>
                </div>
                
                {/* Decorative Frame */}
                <div className="absolute -bottom-6 -left-6 w-48 h-48 border-2 border-[#D4AF37] rounded-3xl -z-10" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#D4AF37]/20 rounded-3xl -z-10 backdrop-blur-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Extended Biography with Timeline Style */}
        <div className="mb-32 relative">
          <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-md rounded-3xl p-8 md:p-16 border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
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

        {/* Eternal Love Section with Card Design */}
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
                    src="/5.jpg"
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

        {/* Philosophy & Works with Glassmorphism */}
        <div className="mb-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl border-2 border-[#D4AF37] flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors duration-300">
                    <Sparkles className="w-6 h-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#1A1A1A] mb-4">Philosophy</h4>
                  <p className="text-base text-[#1A1A1A]/70 leading-relaxed">
                    {t('mkh.philosophy.text')}
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl border-2 border-[#D4AF37] flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors duration-300">
                    <BookOpen className="w-6 h-6 text-[#D4AF37] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#1A1A1A] mb-4">{t('mkh.works.title')}</h4>
                  <p className="text-base text-[#1A1A1A]/70 leading-relaxed">
                    {t('mkh.works.list')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Quote with Premium Styling */}
        <div
          ref={quoteRef}
          className="relative max-w-4xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 via-transparent to-[#D4AF37]/20 rounded-3xl transform rotate-1 scale-105 blur-xl" />
          
          <div className="relative bg-[#F5F0E6] border-2 border-[#D4AF37] rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden">
            {/* Corner Decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50" />
            
            <Quote className="w-12 h-12 text-[#D4AF37] mx-auto mb-8 opacity-50" />
            
            <blockquote
              className="text-2xl md:text-3xl lg:text-4xl text-[#1A1A1A] italic leading-relaxed mb-8 text-center"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              "{t('mkh.spirit.text')}"
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

      {/* CSS for custom animations */}
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