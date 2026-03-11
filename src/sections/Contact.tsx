import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Send, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-content',
        { y: 40, opacity: 0 },
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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('contact.form.success'));
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.info.address.title'),
      content: '123 Avenue de l\'Indépendance\nLibreville, Gabon',
    },
    {
      icon: Phone,
      title: t('contact.info.phone.title'),
      content: '+241 77 12 34 56\n+241 66 78 90 12',
    },
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      content: 'contact@mbouma-kohomm.com\ninfo@mkh-group.com',
    },
    {
      icon: Clock,
      title: t('contact.info.hours.title'),
      content: t('contact.info.hours.content'),
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#F5F0E6]"
    >
      <div className="section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-4 block">
            CONTACT
          </span>
          <h2
            className="heading-lg text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('contact.title')}
          </h2>
          <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto body-lg">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div className="contact-content space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">{info.title}</h4>
                  <p className="text-[#1A1A1A]/60 text-sm whitespace-pre-line">{info.content}</p>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h4 className="font-semibold text-[#1A1A1A] mb-6">{t('contact.social.title')}</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 bg-[#1A1A1A]/5 rounded-full flex items-center justify-center hover:bg-[#D4AF37] hover:text-white transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-[#1A1A1A] group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-[#1A1A1A] rounded-lg p-8 text-center">
              <MapPin className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <p className="text-white/60">
                {t('contact.map.text')}
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#D4AF37] mt-4 hover:underline"
              >
                <span>{t('contact.map.link')}</span>
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-content">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <h3
                className="text-2xl md:text-3xl text-[#1A1A1A] font-semibold mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('contact.form.title')}
              </h3>
              <p className="text-[#1A1A1A]/60 mb-8">{t('contact.form.subtitle')}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('contact.form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('contact.form.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={t('contact.form.subjectPlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.form.message')}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={6}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3">
                  <Send className="w-5 h-5" />
                  <span>{t('contact.form.submit')}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
