import { SignUp } from '@clerk/clerk-react';
import { useLanguage } from '../context/LanguageContext';

const SignUpPage = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span
              className="text-4xl font-bold text-[#D4AF37]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              MKH
            </span>
          </a>
          <p className="text-[#1A1A1A]/60 mt-2">
            {language === 'fr' ? 'Créez votre compte' : 'Create your account'}
          </p>
        </div>
        
        <SignUp
          routing="path"
          path="/sign-up"
          redirectUrl="/account"
          appearance={{
            elements: {
              card: {
                backgroundColor: '#FFFFFF',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              headerTitle: {
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.5rem',
                fontWeight: '600',
              },
              formButtonPrimary: {
                backgroundColor: '#D4AF37',
                '&:hover': {
                  backgroundColor: '#B8941F',
                },
              },
              footerActionLink: {
                color: '#D4AF37',
                '&:hover': {
                  color: '#B8941F',
                },
              },
            },
          }}
        />
        
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-[#1A1A1A]/60 hover:text-[#D4AF37] transition-colors text-sm"
          >
            ← {language === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
