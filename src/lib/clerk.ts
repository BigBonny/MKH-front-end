// Clerk Configuration
// Documentation: https://clerk.com/docs/quickstarts/react

export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  domain: 'aware-bengal-40.clerk.accounts.dev',
  
  // Configuration de l'apparence
  appearance: {
    variables: {
      colorPrimary: '#D4AF37',
      colorBackground: '#F5F0E6',
      colorText: '#1A1A1A',
      colorTextSecondary: '#666666',
      colorInputBackground: '#FFFFFF',
      colorInputText: '#1A1A1A',
      colorDanger: '#8B2E2E',
      borderRadius: '0.5rem',
      fontFamily: 'Montserrat, sans-serif',
    },
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
      socialButtonsBlockButton: {
        borderColor: '#E5E7EB',
        '&:hover': {
          backgroundColor: '#F9FAFB',
        },
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
  },
  
  // Localisation
  localization: {
    locale: 'fr',
  },
  
  // Routes personnalisées
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/account',
  afterSignUpUrl: '/account',
};
