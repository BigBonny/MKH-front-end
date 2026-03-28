import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, ArrowRight, Newspaper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const News = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const news = [
    {
      id: 1,
      type: 'action',
      title: t('news.actions.action1.title'),
      date: '15 Mars 2025',
      location: 'Dakar, Sénégal',
      description: t('news.actions.action1.desc'),
      image: '/impact-1.jpg',
    },
    {
      id: 2,
      type: 'event',
      title: t('news.events.event1.title'),
      date: '22 Avril 2025',
      location: 'Abidjan, Côte d\'Ivoire',
      description: t('news.events.event1.desc'),
      image: '/impact-2.jpg',
    },
    {
      id: 3,
      type: 'action',
      title: t('news.actions.action2.title'),
      date: '10 Mai 2025',
      location: 'Libreville, Gabon',
      description: t('news.actions.action2.desc'),
      image: '/impact-3.jpg',
    },
    {
      id: 4,
      type: 'event',
      title: t('news.events.event2.title'),
      date: '15 Juin 2025',
      location: 'Paris, France',
      description: t('news.events.event2.desc'),
      image: '/impact-3.jpg',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline line draw animation
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // News items flip animation
      gsap.fromTo(
        '.news-item',
        { rotateX: 90, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="news"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#1A1A1A]"
    >
      <div className="section-padding">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">
            NEWS
          </span>
          <h2
            className="heading-lg text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('news.title')}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto body-lg">
            {t('news.subtitle')}
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/30 hidden lg:block">
            <div
              className="timeline-line absolute inset-x-0 top-0 bg-[#D4AF37] origin-top"
              style={{ height: '100%' }}
            />
          </div>

          {/* News Items */}
          <div className="space-y-16">
            {news.map((item, index) => (
              <div
                key={item.id}
                className={`news-item relative grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? '' : 'lg:direction-rtl'
                }`}
                style={{ perspective: '1000px' }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#1A1A1A] hidden lg:block z-10" />

                {/* Content Side */}
                <div
                  className={`${
                    index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:order-2'
                  }`}
                >
                  <div
                    className={`inline-flex items-center gap-2 mb-4 ${
                      index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <span
                      className={`px-4 py-1 text-xs font-semibold rounded-full ${
                        item.type === 'action'
                          ? 'bg-[#2E5C4F] text-white'
                          : 'bg-[#8B2E2E] text-white'
                      }`}
                    >
                      {item.type === 'action' ? t('news.actions.title') : t('news.events.title')}
                    </span>
                    <Newspaper className="w-4 h-4 text-[#D4AF37]" />
                  </div>

                  <h3
                    className="text-2xl md:text-3xl text-white font-semibold mb-4"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {item.title}
                  </h3>

                  <div
                    className={`flex items-center gap-4 text-white/50 text-sm mb-4 ${
                      index % 2 === 0 ? 'lg:justify-end' : ''
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </span>
                  </div>

                  <p className="text-white/60 mb-6">{item.description}</p>

                  <button
                    className={`inline-flex items-center gap-2 text-[#D4AF37] font-semibold group ${
                      index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <span>{t('news.readMore')}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        index % 2 === 0 ? 'lg:rotate-180 lg:group-hover:-translate-x-1' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Image Side */}
                <div
                  className={`${
                    index % 2 === 0 ? 'lg:order-2 lg:pl-16' : 'lg:pr-16'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-lg group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
