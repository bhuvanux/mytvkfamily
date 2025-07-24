'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Providers({ children }) {
  const router = useRouter();

  return (
    <ClerkProvider navigate={(to) => router.push(to)}>
      {children}
    </ClerkProvider>
  );
}