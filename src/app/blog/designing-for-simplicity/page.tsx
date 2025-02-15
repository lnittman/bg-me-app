import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function BlogPost() {
  return (
    <div className="w-full max-w-[var(--content-width)] mx-auto px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>february 28, 2024</span>
            <span>•</span>
            <span>4 min read</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight lowercase">
            designing for simplicity
          </h1>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            when we started designing bg.me, we had one core principle: simplicity. we believe that the best 
            digital experiences are the ones that get out of your way and let you focus on what you're there to do.
          </p>

          <p>
            many online board games suffer from cluttered interfaces, distracting animations, and unnecessary 
            features that detract from the core experience. we wanted to do something different.
          </p>

          <p>
            our design process started with the board itself. we spent weeks refining the look and feel of the 
            pieces, the movement animations, and the way moves are highlighted. everything needed to feel natural 
            and intuitive, whether you're using a mouse, touchpad, or touchscreen.
          </p>

          <p>
            we also paid special attention to the game room experience. joining a game is as simple as clicking 
            a link. the chat interface is unobtrusive but always accessible. and the game controls are right 
            where you'd expect them to be.
          </p>

          <p>
            another important aspect was accessibility. we wanted bg.me to work well for everyone, regardless of 
            their device or preferences. that's why we included features like a dark mode, keyboard controls, 
            and responsive design that adapts to any screen size.
          </p>

          <p>
            but perhaps what we're most proud of is what we left out. no ads, no pop-ups, no unnecessary 
            animations or effects. just pure, focused gameplay that lets you enjoy the timeless strategy 
            of backgammon.
          </p>

          <p>
            as we continue to develop bg.me, we'll stay true to this philosophy of simplicity. we believe 
            that the best features are often the ones you don't notice – they just work exactly as you'd expect.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 