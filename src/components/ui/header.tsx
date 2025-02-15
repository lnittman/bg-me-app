"use client"

import Link from "next/link"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { ThemeEmoji } from "@/components/ui/theme-emoji"

export function Header() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="w-[calc(100vw-2rem)] max-w-[calc(var(--content-width)+2rem)] mx-auto">
        <div className="h-[var(--header-height)] flex items-center justify-between rounded-lg border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex items-center gap-2">
            <ThemeEmoji size="sm" />
            <Link 
              href="/" 
              className="text-lg font-medium lowercase tracking-tight hover:text-primary/90 transition-colors"
            >
              bg.me
            </Link>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
} 