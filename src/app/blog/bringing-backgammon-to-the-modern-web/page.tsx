import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"

export default function BlogPost() {
  return (
    <>
      {/* Fixed control row */}
      <div className="fixed top-[calc(var(--header-height)+1rem)] left-0 right-0 z-10 px-4">
        <div className="w-[calc(100vw-2rem)] max-w-[calc(var(--content-width)+2rem)] mx-auto flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="gap-2 w-[140px]"
          >
            <Link href="/blog">
              <Icon name="ArrowLeft" className="h-4 w-4" />
              <span className="lowercase">back to blog</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>march 15, 2024</span>
            <span>•</span>
            <span>3 min read</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <article className="pt-[calc(var(--header-height)+4rem)] space-y-12 px-4">
        <header className="space-y-8">
          <h1 className="text-3xl font-semibold tracking-tight lowercase text-center max-w-2xl mx-auto">
            bringing backgammon to the modern web
          </h1>
        </header>

        <div className="space-y-6 text-muted-foreground max-w-2xl mx-auto">
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
        </div>

        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="gap-2 w-[140px]"
          >
            <Link href="/blog">
              <Icon name="ArrowLeft" className="h-4 w-4" />
              <span className="lowercase">back to blog</span>
            </Link>
          </Button>
        </div>
      </article>
    </>
  )
} 