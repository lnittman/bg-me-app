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
    const metaTransition = document.querySelector('meta[name="theme-color-transition"]');
    
    // Set the theme color based on current theme
    if (metaThemeColor) {
      // Remove any existing transition
      if (metaTransition) {
        metaTransition.remove();
      }
      
      // Add meta tag to force instant transition
      const transition = document.createElement('meta');
      transition.name = 'theme-color-transition';
      transition.content = 'color 0s ease';
      document.head.appendChild(transition);
      
      // Update the theme color
      metaThemeColor.setAttribute(
        "content",
        currentTheme === "dark" ? "#09090b" : "#ffffff"
      );
    }
  }, [theme, systemTheme]);

  return null;
} 