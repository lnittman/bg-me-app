import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LayoutWithTransitions from "./layout-with-transitions"

export default function Home() {
  const text = "anyone, anywhere".split("")

  return (
    <LayoutWithTransitions>
      <div className="w-full max-w-[var(--content-width)] mx-auto px-4 space-y-8">
        {/* Video Card */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative aspect-video">
            <Card className="absolute inset-0 overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/hero-loop.mp4" type="video/mp4" />
              </video>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="text-center">
            <div className="text-muted-foreground lowercase text-lg flex items-center justify-center gap-2">
              <span>play backgammon with</span>
              <span className="inline-flex">
                {text.map((char, i) => (
                  <span
                    key={i}
                    className="animate-char-flow"
                    style={{
                      '--flow-delay': `${i * 0.05}s`,
                      '--ripple-delay': `${(i * 0.05) + 1}s`
                    } as React.CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full lowercase"
              asChild
            >
              <Link href="/auth/signin">sign in to play</Link>
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full lowercase"
              asChild
            >
              <Link href="/instructions">read instructions</Link>
            </Button>
          </div>
        </div>
      </div>
    </LayoutWithTransitions>
  )
}
