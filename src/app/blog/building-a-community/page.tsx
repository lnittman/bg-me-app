import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function BlogPost() {
  return (
    <div className="w-full max-w-[var(--content-width)] mx-auto px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>february 10, 2024</span>
            <span>•</span>
            <span>3 min read</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight lowercase">
            building a community
          </h1>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            backgammon has always been more than just a game – it's a social experience. throughout history, 
            it's been played in homes, cafes, and parks, bringing people together and fostering connections.
          </p>

          <p>
            with bg.me, we wanted to capture that same social spirit in the digital world. we believe that 
            playing games online shouldn't mean losing the human connection that makes backgammon special.
          </p>

          <p>
            that's why we've focused on creating a welcoming environment for players of all skill levels. 
            whether you're a complete beginner or a seasoned expert, you'll find a place here. there's no 
            pressure, no rankings, and no competitive ladder to climb – unless that's what you're looking for.
          </p>

          <p>
            we've made it easy to play with friends by providing simple share links for game rooms. invite 
            someone to play, chat while you're waiting for their move, and use emojis to react to particularly 
            clever plays. it's these little interactions that help build connections between players.
          </p>

          <p>
            looking ahead, we're excited about adding more community features. we're exploring ideas like 
            custom game rooms where you can set your own rules, spectator mode for watching and learning 
            from other players, and even a teaching mode where experienced players can help newcomers 
            learn the game.
          </p>

          <p>
            but most importantly, we want to hear from you. what would make bg.me a better place to play? 
            what features would help you connect with other players? our community will shape the future 
            of bg.me, and we're excited to build it together.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 