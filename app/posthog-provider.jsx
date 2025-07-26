'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export default function PostHogProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      });
    }
  }, []);

  return null; // no UI needed
}