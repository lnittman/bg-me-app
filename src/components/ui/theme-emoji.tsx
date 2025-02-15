"use client"

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

interface ThemeEmojiProps {
  size?: "sm" | "lg"
}

export function ThemeEmoji({ size = "sm" }: ThemeEmojiProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const sizes = {
    sm: "text-lg",
    lg: "text-6xl",
  }

  return (
    <div className={`relative flex items-center justify-center cursor-pointer ${size === "lg" ? "h-16" : "h-6"}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={isDark ? "light" : "dark"}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={sizes[size]}
          role="img"
          aria-label={isDark ? "white piece" : "black piece"}
        >
          {isDark ? "⚪️" : "⚫️"}
        </motion.span>
      </AnimatePresence>
    </div>
  )
} 