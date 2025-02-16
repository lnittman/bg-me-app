"use client"

import { useTheme } from "next-themes"
import * as PhosphorIcons from "@phosphor-icons/react"
import { type Icon as PhosphorIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

type IconName = keyof typeof PhosphorIcons
type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"

interface IconProps extends React.ComponentProps<PhosphorIcon> {
  name: IconName
  weight?: IconWeight
  "data-dark-color"?: string
}

export function Icon({ name, weight = "regular", color, "data-dark-color": darkColor, ...props }: IconProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const IconComponent = PhosphorIcons[name] as PhosphorIcon

  useEffect(() => {
    setMounted(true)
  }, [])

  // During server-side rendering or before mounting, render with a transparent color
  // to avoid hydration mismatch
  if (!mounted) {
    return <IconComponent weight={weight} color="transparent" {...props} />
  }

  const isDark = resolvedTheme === "dark"
  const iconColor = color 
    ? (isDark && darkColor ? darkColor : color)
    : (isDark ? "hsl(0 0% 95%)" : "hsl(0 0% 15%)")

  return (
    <IconComponent
      weight={weight}
      className="transition-colors duration-200"
      color={iconColor}
      {...props}
    />
  )
} 