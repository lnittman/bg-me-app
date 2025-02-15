"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeEffect() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Get the current theme (either user selected or system default)
    const currentTheme = theme === "system" ? systemTheme : theme;
    
    // Get all theme-color meta tags
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    // Set the theme color based on current theme
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        currentTheme === "dark" ? "#09090b" : "#ffffff"
      );
    }
  }, [theme, systemTheme]);

  return null;
} 