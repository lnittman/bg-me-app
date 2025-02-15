import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">How to Play Backgammon</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Basic Rules</h2>
            <p>Backgammon is a two-player board game where each player has 15 pieces that move between 24 triangles (points) according to the roll of two dice.</p>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Objective</h2>
            <p>The objective is to move all your pieces into your home board and then bear them off.</p>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Movement</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Roll two dice on your turn</li>
              <li>Move pieces clockwise around the board</li>
              <li>Use each die number separately</li>
              <li>Land on empty points or points with your pieces</li>
              <li>Hit single opponent pieces (send them to the bar)</li>
            </ul>
          </section>
          
          <Button variant="secondary" className="w-full" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
