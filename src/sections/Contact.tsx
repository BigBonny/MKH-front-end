import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Mail, Send, Facebook, Twitter, Instagram, Linkedin, CheckCircle } from 'lucide-react';
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
  const { t, language } = useLanguage();

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

  const [sending, setSending] = useState(false);
  const [successSent, setSuccessSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const result = await emailjs.sendForm(
        'service_akwkjcn',
        'template_9n1v92s',
        formRef.current!,
        'Gfj5leeUAz7bDlt5V'
      );

      console.log('EmailJS result:', result);
      setSuccessSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccessSent(false), 5000);
    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error(t('contact.form.error') || 'Échec de l\'envoi. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Cameroun',
      content: '22 rue 9765, B.P. 13241\nYaoundé, Cameroun\nTél : +237 22 64 76 70\nMob : +237 693 73 97 73',
    },
    {
      icon: MapPin,
      title: 'France',
      content: '58 rue de Monceau\n75008 Paris\nTél : +33 (0)9 86 54 99 93\nMob : +33 (0)6 62 05 02 37',
    },
    {
      icon: MapPin,
      title: 'Royaume-Uni',
      content: 'The South Quay Building\n189 Marsh Wall E14\nLondon, UK',
    },
    {
      icon: Mail,
      title: t('contact.info.email.title'),
      content: 'contact@mbouma-kohomm-holding.com\ninfo@mbouma-kohomm-holding.com',
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

            {/* Service Annonces */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-lg p-8 shadow-sm border border-[#D4AF37]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#1A1A1A]">{t('contact.service.title')}</h4>
                  <span className="text-xs text-[#D4AF37] uppercase tracking-wider">{t('contact.service.subtitle')}</span>
                </div>
              </div>
              <p className="text-[#1A1A1A]/70 text-sm mb-6 leading-relaxed">
                {t('contact.service.desc')}
              </p>
              <button className="w-full py-3 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#D4AF37]/90 transition-colors flex items-center justify-center gap-2">
                <span>{t('contact.service.cta')}</span>
                <Send className="w-4 h-4" />
              </button>
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
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
              {/* Success Overlay */}
              {successSent && (
                <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3
                    className="text-2xl md:text-3xl text-[#1A1A1A] font-semibold mb-3 text-center"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {language === 'fr' ? 'Message envoyé !' : 'Message sent!'}
                  </h3>
                  <p className="text-[#1A1A1A]/60 text-center max-w-sm">
                    {language === 'fr'
                      ? 'Merci pour votre message. Nous vous répondrons dans les plus brefs délais.'
                      : 'Thank you for your message. We will get back to you shortly.'}
                  </p>
                  <div className="w-12 h-0.5 bg-[#D4AF37] mt-6" />
                </div>
              )}

              <h3
                className="text-2xl md:text-3xl text-[#1A1A1A] font-semibold mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('contact.form.title')}
              </h3>
              <p className="text-[#1A1A1A]/60 mb-8">{t('contact.form.subtitle')}</p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.name')}</Label>
                    <Input
                      id="name"
                      name="from_name"
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
                      name="from_email"
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
                    name="subject"
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
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={6}
                    required
                  />
                </div>

                <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed">
                  <Send className="w-5 h-5" />
                  <span>{sending ? '...' : t('contact.form.submit')}</span>
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
