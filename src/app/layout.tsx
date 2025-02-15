import './globals.css';
import { Header } from '@/components/ui/header';
import { type Metadata, type Viewport } from 'next';
import { Providers } from '@/components/providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' }
  ],
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
      <head />
      <body className="bg-background font-['IosevkaTerm'] antialiased overscroll-none">
        <Providers>
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
