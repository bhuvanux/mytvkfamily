// app/layout.js

import './globals.css';
import { Inter, Noto_Sans_Tamil } from 'next/font/google';
import Providers from './provider';
import Header from '../components/Header';
import PostHogProvider from './posthog-provider'; // ✅

// Keep Inter for Latin text
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Add Tamil font
const notoTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '700'],
  variable: '--font-tamil',
});

export const metadata = {
  title: 'TVK Families',
  description: 'நம்ம TVK குடும்பம் – மதுரை மாநாடு 2025',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ta" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoTamil.variable}`}>
        <Providers>
          <PostHogProvider /> {/* ✅ Safe Client-only tracking */}
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
