// app/layout.js

import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './provider';
import Header from '../components/Header';
import PostHogProvider from './posthog-provider'; // ✅

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'CaptionSpark',
  description: 'Generate Viral Captions in Seconds',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <PostHogProvider /> {/* ✅ Safe Client-only tracking */}
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}