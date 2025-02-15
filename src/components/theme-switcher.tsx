import * as React from "react"
import { SunIcon, MoonIcon, DesktopIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="grid grid-cols-3 gap-2 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("light")}
            className={cn(
              "h-12 w-12",
              theme === "light" && "bg-accent"
            )}
          >
            <SunIcon className="h-4 w-4" />
            <span className="sr-only">Light</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("dark")}
            className={cn(
              "h-12 w-12",
              theme === "dark" && "bg-accent"
            )}
          >
            <MoonIcon className="h-4 w-4" />
            <span className="sr-only">Dark</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme("system")}
            className={cn(
              "h-12 w-12",
              theme === "system" && "bg-accent"
            )}
          >
            <DesktopIcon className="h-4 w-4" />
            <span className="sr-only">System</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 