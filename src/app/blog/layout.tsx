import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-[calc(100vw-2rem)] max-w-[calc(var(--content-width)+2rem)] mx-auto">
      {children}
    </div>
  )
} 