'use client';

import dynamic from 'next/dynamic';

// Dynamically import components (to avoid hydration issues)
const HeroSection = dynamic(() => import('../components/HeroSection'), { ssr: false });
const FeaturesSection = dynamic(() => import('../components/FeaturesSection'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}