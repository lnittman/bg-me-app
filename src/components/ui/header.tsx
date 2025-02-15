"use client"

import Link from "next/link"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { ThemeEmoji } from "@/components/ui/theme-emoji"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { FriendRequests } from "@/components/FriendRequests"
import { NotificationBell } from "@/components/NotificationBell"
import { Icon } from "@/components/ui/icon"

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
            {!session ? (
              <Button variant="outline" size="sm" className="lowercase" asChild>
                <Link href="/auth/signin">sign in</Link>
              </Button>
            ) : (
              <>
                <FriendRequests />
                <Button variant="outline" size="sm" className="lowercase" asChild>
                  <Link href="/room" className="flex items-center gap-2">
                    <Icon name="GameController" className="h-4 w-4" />
                    <span>my games</span>
                  </Link>
                </Button>
                <NotificationBell />
              </>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
} 