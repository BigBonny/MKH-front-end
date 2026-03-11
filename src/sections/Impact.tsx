import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Building2, Heart, GraduationCap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Impact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const works = [
    {
      id: 1,
      image: '/impact-1.jpg',
      title: t('impact.works.education.title'),
      category: t('impact.works.education.category'),
      description: t('impact.works.education.desc'),
      icon: GraduationCap,
    },
    {
      id: 2,
      image: '/impact-2.jpg',
      title: t('impact.works.health.title'),
      category: t('impact.works.health.category'),
      description: t('impact.works.health.desc'),
      icon: Heart,
    },
    {
      id: 3,
      image: '/impact-3.jpg',
      title: t('impact.works.entrepreneurship.title'),
      category: t('impact.works.entrepreneurship.category'),
      description: t('impact.works.entrepreneurship.desc'),
      icon: Building2,
    },
  ];

  const publications = [
    {
      title: t('impact.publications.book1.title'),
      author: 'Mbouma Kohomm',
      year: '2023',
      type: t('impact.publications.book1.type'),
    },
    {
      title: t('impact.publications.book2.title'),
      author: 'Mbouma Kohomm',
      year: '2021',
      type: t('impact.publications.book2.type'),
    },
    {
      title: t('impact.publications.book3.title'),
      author: 'Mbouma Kohomm',
      year: '2019',
      type: t('impact.publications.book3.type'),
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll for works
      const cards = containerRef.current?.querySelectorAll('.work-card');
      if (cards && cards.length > 0) {
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${cards.length * 100}%`,
            pin: true,
            scrub: 1,
            snap: 1 / (cards.length - 1),
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative bg-[#1A1A1A] min-h-screen"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B2E2E]/20 via-transparent to-[#2E5C4F]/20 pointer-events-none" />

      {/* Section Header */}
      <div className="section-padding pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">
              IMPACT
            </span>
            <h2
              className="heading-lg text-white"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('impact.title')}
            </h2>
          </div>
          <p className="text-white/60 max-w-md body-lg">
            {t('impact.subtitle')}
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Works */}
      <div ref={containerRef} className="overflow-hidden">
        <div className="flex">
          {works.map((work, index) => (
            <div
              key={work.id}
              className="work-card min-w-[100vw] section-padding flex items-center"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg group">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-[#D4AF37] text-white text-sm font-semibold rounded-full">
                      {work.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <work.icon className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    <span className="text-white/40 text-sm font-medium">
                      0{index + 1} / 0{works.length}
                    </span>
                  </div>

                  <h3
                    className="text-3xl md:text-4xl text-white font-semibold"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {work.title}
                  </h3>

                  <p className="text-white/60 body-lg leading-relaxed">
                    {work.description}
                  </p>

                  <button className="flex items-center gap-3 text-[#D4AF37] font-semibold group">
                    <span>{t('impact.learnMore')}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications Section */}
      <div className="section-padding py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <BookOpen className="w-8 h-8 text-[#D4AF37]" />
            <h3
              className="text-2xl md:text-3xl text-white font-semibold"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('impact.publications.title')}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-2"
              >
                <span className="text-[#D4AF37] text-sm font-medium">{pub.type}</span>
                <h4
                  className="text-xl text-white font-semibold mt-3 mb-4 group-hover:text-[#D4AF37] transition-colors"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {pub.title}
                </h4>
                <div className="flex items-center justify-between text-white/40 text-sm">
                  <span>{pub.author}</span>
                  <span>{pub.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
