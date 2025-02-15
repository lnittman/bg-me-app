"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react"
import { 
  HamburgerMenuIcon, 
  QuestionMarkIcon,
  Pencil2Icon
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        alignOffset={-12}
        className="min-w-[180px]"
      >
        {session && (
          <>
            <DropdownMenuItem className="flex items-center gap-2">
              <span>{session.user?.name || session.user?.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link href="/about" className="lowercase flex items-center justify-between w-full px-4">
            <span>about</span>
            <QuestionMarkIcon className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/blog" className="lowercase flex items-center justify-between w-full px-4">
            <span>blog</span>
            <Pencil2Icon className="h-4 w-4" />
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <div className="grid grid-cols-3 gap-1 bg-muted/50 p-1 m-1 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("light")}
            className={cn(
              "h-8 w-full rounded-lg transition-all duration-200",
              "hover:bg-background/60 hover:shadow-sm active:bg-background",
              theme === "light" && "bg-background shadow-sm hover:shadow-md"
            )}
          >
            <SunIcon className="size-4 transition-transform duration-200 hover:scale-110" />
            <span className="sr-only">Light theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("dark")}
            className={cn(
              "h-8 w-full rounded-lg transition-all duration-200",
              "hover:bg-background/60 hover:shadow-sm active:bg-background",
              theme === "dark" && "bg-background shadow-sm hover:shadow-md"
            )}
          >
            <MoonIcon className="size-4 transition-transform duration-200 hover:scale-110" />
            <span className="sr-only">Dark theme</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("system")}
            className={cn(
              "h-8 w-full rounded-lg transition-all duration-200",
              "hover:bg-background/60 hover:shadow-sm active:bg-background",
              theme === "system" && "bg-background shadow-sm hover:shadow-md"
            )}
          >
            <MonitorIcon className="size-4 transition-transform duration-200 hover:scale-110" />
            <span className="sr-only">System theme</span>
          </Button>
        </div>
        
        {session && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => signOut()}>
              Sign out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 