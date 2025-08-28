import { Toaster } from '@/components/ui/sonner';
import { SocketProvider } from '@/context/socket.context';
import { QueryProvider } from '@/providers/query-provider';
import 'country-flag-icons/react/3x2';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Outfit, Inter } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Chatboq',
  description: 'Chatboq',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${inter.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <QueryProvider>
          <SocketProvider>
            {children}
            <Toaster richColors position="top-right" />
            {/* <SoundEnabler /> */}
            {/* <Toaster /> */}
          </SocketProvider>
        </QueryProvider>
        {/* Audio Elements */}
      </body>
    </html>
  );
}
