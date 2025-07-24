// app/layout.js

import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Providers from './provider';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'CaptionSpark',
  description: 'Generate viral captions in seconds',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <head>
          <title>CaptionSpark</title>
        </head>
        <body className={inter.className}>
          <Providers>
            <Header />
            {children}
          </Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}