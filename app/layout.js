// layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs'; // ✅ Add this
import Providers from './provider';
import Header from '../components/Header';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'CaptionSpark',
  description: 'Generate viral captions in seconds',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider> {/* ✅ Wrap your app */}
      <html lang="en" className={inter.variable}>
        <head>
        
        </head>
        <body className={inter.className}>
          <Providers>
            <Header />
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
