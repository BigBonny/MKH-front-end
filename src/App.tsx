import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import MKH from './sections/MKH';
import Impact from './sections/Impact';
import Store from './sections/Store';
import News from './sections/News';
import Inscription from './sections/Inscription';
import Account from './sections/Account';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import CartModal from './components/CartModal';
import { clerkConfig } from './lib/clerk';

gsap.registerPlugin(ScrollTrigger);

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Main content component
function MainContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll('.animate-on-scroll'),
        { 
          opacity: 0, 
          y: 50 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#F5F0E6]">
      <Navigation onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />
        <MKH />
        <Impact />
        <Store />
        <News />
        <Inscription />
        <Account />
        <Contact />
      </main>
      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <ClerkProvider {...clerkConfig} publishableKey={clerkKey || ''}>
      <LanguageProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<MainContent />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
              
              {/* Protected routes */}
              <Route
                path="/account/*"
                element={
                  <>
                    <SignedIn>
                      <MainContent />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </ClerkProvider>
  );
}

export default App;
