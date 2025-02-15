import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Link from "next/link"

const blogPosts = [
  {
    slug: "bringing-backgammon-to-the-modern-web",
    title: "bringing backgammon to the modern web",
    description: "why we built bg.me and how we're making one of the world's oldest board games accessible to everyone",
    date: "march 15, 2024",
    readingTime: "3 min read"
  },
  {
    slug: "designing-for-simplicity",
    title: "designing for simplicity",
    description: "how we approached creating a minimal, focused interface that puts the game first",
    date: "february 28, 2024",
    readingTime: "4 min read"
  },
  {
    slug: "building-a-community",
    title: "building a community",
    description: "our vision for creating a welcoming space for backgammon players of all skill levels",
    date: "february 10, 2024",
    readingTime: "3 min read"
  }
]

export default function Blog() {
  return (
    <div className="w-full max-w-[var(--content-width)] mx-auto px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight lowercase">blog</h1>
          <p className="text-sm text-muted-foreground mt-2">
            thoughts and updates from the bg.me team
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="block space-y-2 p-4 -mx-4 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{post.date}</span>
                <span>{post.readingTime}</span>
              </div>
              <h2 className="text-lg font-medium lowercase">{post.title}</h2>
              <p className="text-sm text-muted-foreground lowercase">
                {post.description}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 