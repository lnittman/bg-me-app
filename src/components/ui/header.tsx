"use client"

import Link from "next/link"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { ThemeEmoji } from "@/components/ui/theme-emoji"
import { useSession } from "next-auth/react"
import { NotificationBell } from "@/components/NotificationBell"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="w-[calc(100vw-2rem)] max-w-[calc(var(--content-width)+2rem)] mx-auto">
        <div className="h-[var(--header-height)] flex items-center justify-between rounded-lg border bg-card px-4">
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80"
            >
              <ThemeEmoji size="sm" />
              <span className="text-lg font-medium lowercase tracking-tight">
                bg.me
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {session && <NotificationBell />}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
} 