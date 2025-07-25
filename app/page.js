'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components (to avoid hydration issues)
const HeroSection = dynamic(() => import('../components/HeroSection'), { ssr: false });
const FeaturesSection = dynamic(() => import('../components/FeaturesSection'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_path: window.location.pathname,
        page_location: window.location.href,
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