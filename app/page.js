'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import posthog from 'posthog-js';

// Dynamically import components
const HeroSection = dynamic(() => import('../components/HeroSection'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

export default function HomePage() {
  useEffect(() => {
    posthog.capture('$pageview');
  }, []);

  return (
    <main>
      <HeroSection />
    </main>
  );
}