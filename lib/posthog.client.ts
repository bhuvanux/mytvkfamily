// /lib/posthog.client.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init('phc_WrDGtInxanGSWIHvIJ1HzVQ2WhTkn8rOz9wywWH8Jyq', {
    api_host: 'https://us.posthog.com',
    loaded: (ph) => {
      console.log('✅ PostHog loaded');
    },
  });
}

export default posthog;