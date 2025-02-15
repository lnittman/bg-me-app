import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { ThemeEmoji } from "@/components/ui/theme-emoji"

export default function Home() {
  const text = "anyone, anywhere".split("")

  return (
    <div className="w-full max-w-[var(--content-width)] mx-auto px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-6">
          <ThemeEmoji size="lg" />
          <div className="text-muted-foreground lowercase text-lg flex flex-col">
            <span>play backgammon with</span>
            <span className="animate-flow-text">
              {text.map((char, i) => (
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
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full lowercase"
            asChild
          >
            <Link href="/room/create">create room</Link>
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full lowercase"
            asChild
          >
            <Link href="/instructions">read instructions</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
