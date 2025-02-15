import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function About() {
  return (
    <div className="w-full max-w-[var(--content-width)] mx-auto px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight lowercase">about bg.me</h1>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            bg.me is a modern take on the classic game of backgammon, designed for casual play with friends or strangers online.
          </p>
          <p>
            built with modern web technologies and designed to be fast, responsive, and accessible from any device.
          </p>
          <p>
            the game features a clean, minimalist interface that puts the focus on the gameplay, while still providing all the features you need for a great backgammon experience.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 