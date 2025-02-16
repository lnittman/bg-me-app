"use client"

import Link from "next/link"
import { ThemeEmoji } from "@/components/ui/theme-emoji"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

export function Header() {
  const { data: session } = useSession()
  const { setTheme } = useTheme()

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
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-9 w-9 rounded-lg"
                >
                  <div className="h-full w-full rounded-lg bg-muted/50 flex items-center justify-center text-lg transition-colors hover:bg-muted">
                    {session ? (
                      session.user.emoji || "👤"
                    ) : (
                      <Icon name="List" className="h-5 w-5" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                alignOffset={0} 
                sideOffset={8}
                className="w-[180px]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/about" className="flex items-center justify-between gap-2">
                    <span>about</span>
                    <Icon name="Info" className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="flex items-center justify-between gap-2">
                    <span>blog</span>
                    <Icon name="Article" className="h-4 w-4" />
                  </Link>
                </DropdownMenuItem>

                {session && (
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${session.user.id}`} className="flex items-center justify-between gap-2">
                      <span>profile</span>
                      <Icon name="UserCircle" className="h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>
                )}

                {session && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onSelect={() => signOut()}
                    >
                      <div className="flex items-center justify-between w-full text-red-500 dark:text-red-400">
                        <span>sign out</span>
                        <Icon 
                          name="SignOut" 
                          className="h-4 w-4"
                          color="currentColor"
                        />
                      </div>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                
                <div className="p-1">
                  <div className="grid grid-cols-3 gap-1 bg-muted/50 p-1 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme("light")}
                      className={cn(
                        "h-8 w-full rounded-lg transition-all duration-200",
                        "hover:bg-background/60 hover:shadow-sm active:bg-background"
                      )}
                    >
                      <Icon name="Sun" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "h-8 w-full rounded-lg transition-all duration-200",
                        "hover:bg-background/60 hover:shadow-sm active:bg-background"
                      )}
                    >
                      <Icon name="Moon" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme("system")}
                      className={cn(
                        "h-8 w-full rounded-lg transition-all duration-200",
                        "hover:bg-background/60 hover:shadow-sm active:bg-background"
                      )}
                    >
                      <Icon name="Desktop" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 