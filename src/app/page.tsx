import { Suspense } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeEmoji } from '@/components/ThemeEmoji';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-6">
          <ThemeEmoji size="lg" />
          <div className="text-muted-foreground lowercase text-lg flex flex-col">
            <span>play backgammon with</span>
            <span className="animate-flow-text">
              {[..."anyone, anywhere"].map((char, i) => (
                <span
                  key={i}
                  style={{
                    '--flow-delay': `${i * 0.05}s`
                  } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Suspense fallback={<div>Loading...</div>}>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full lowercase"
              asChild
            >
              <Link href="/room/create">create room</Link>
            </Button>
          </Suspense>
          
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full lowercase"
            asChild
          >
            <Link href="/instructions">learn</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
