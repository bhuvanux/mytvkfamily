// app/layout.js

import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './provider';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'CaptionSpark',
  description: 'Generate viral captions in seconds',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CaptionSpark</title>

        {/* ✅ GA4 Tracking Script */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1C3QJGTH02XX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){ dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', 'G-1C3QJGTH02XX', { debug_mode: true });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}