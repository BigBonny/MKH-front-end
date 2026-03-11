import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image zoom out animation
      gsap.fromTo(
        imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      );

      // Title staggered animation
      if (titleRef.current) {
        const letters = titleRef.current.querySelectorAll('.letter');
        gsap.fromTo(
          letters,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.05,
            delay: 0.3,
          }
        );
      }

      // Subtitle blur reveal
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, filter: 'blur(10px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 0.8, delay: 0.8, ease: 'power2.out' }
      );

      // CTA fade in
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1, ease: 'power3.out' }
      );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const titleText = 'MBOUMA KOHOMM';

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      >
        <img
          src="/hero-portrait.jpg"
          alt="Mbouma Kohomm"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/80 via-[#1A1A1A]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-[#1A1A1A]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center section-padding">
        <div className="max-w-4xl">
          {/* Title with letter animation */}
          <h1
            ref={titleRef}
            className="heading-xl text-white mb-6 overflow-hidden"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {titleText.split('').map((letter, index) => (
              <span
                key={index}
                className="letter inline-block"
                style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light tracking-wide mb-10"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <button
              onClick={() => document.querySelector('#mkh')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              {t('hero.cta.discover')}
            </button>
            <button
              onClick={() => document.querySelector('#store')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline border-white text-white hover:bg-white hover:text-[#1A1A1A]"
            >
              {t('hero.cta.store')}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <button
          onClick={() => document.querySelector('#mkh')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-white/70 hover:text-[#D4AF37] transition-colors duration-300"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
