'use client';

import { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Clerk) {
      const signInButtons = document.querySelectorAll('[data-clerk-signin]');
      const signUpButtons = document.querySelectorAll('[data-clerk-signup]');

      signInButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          window.Clerk.openSignIn({ redirectUrl: '/dashboard' });
        });
      });

      signUpButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          window.Clerk.openSignUp({ redirectUrl: '/dashboard' });
        });
      });
    }
  }, []);

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
