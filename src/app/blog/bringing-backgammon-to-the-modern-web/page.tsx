import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function BlogPost() {
  return (
    <div className="w-full max-w-[var(--content-width)] mx-auto px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>march 15, 2024</span>
            <span>•</span>
            <span>3 min read</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight lowercase">
            bringing backgammon to the modern web
          </h1>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            backgammon has been bringing people together for over 5,000 years, making it one of the oldest known board games. 
            despite its rich history and enduring appeal, finding a good place to play online hasn't always been easy.
          </p>

          <p>
            that's why we created bg.me – a modern take on this classic game. our goal was simple: make backgammon accessible 
            to everyone, whether you're a seasoned player or just learning the rules.
          </p>

          <p>
            we wanted to create something that felt natural and intuitive. no clunky interfaces, no complicated setups. 
            just clean, simple design that lets you focus on what matters – the game itself.
          </p>

          <p>
            one of our favorite features is the ability to play with anyone, anywhere. invite a friend with a simple link, 
            or join a game with someone new. we've made sure the experience is smooth and responsive, whether you're on 
            your phone, tablet, or computer.
          </p>

          <p>
            we've also put a lot of thought into the social aspects of the game. chat with your opponent, use emojis to 
            react to moves, and enjoy the friendly competition that backgammon is known for.
          </p>

          <p>
            this is just the beginning for bg.me. we're excited to keep improving and adding features that make playing 
            backgammon online even more enjoyable. we hope you'll join us on this journey and help shape the future of 
            online backgammon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 