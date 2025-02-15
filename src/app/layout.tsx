import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/ui/header';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'bg.me',
  description: 'play backgammon with anyone, anywhere',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-background font-['IosevkaTerm'] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-[var(--content-width)] mx-auto px-4">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
