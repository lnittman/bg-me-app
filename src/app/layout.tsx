import './globals.css';
import { Header } from '@/components/ui/header';
import { type Metadata, type Viewport } from 'next';
import { Providers } from '@/components/providers';
import { ThemeEffect } from '@/components/theme-effect';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'bg.me',
  description: 'play backgammon with anyone, anywhere',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'bg.me'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="bg-background font-['IosevkaTerm'] antialiased overscroll-none">
        <Providers>
          <ThemeEffect />
          <div className="h-[100dvh] flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
