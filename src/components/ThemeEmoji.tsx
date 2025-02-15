'use client';

import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface ThemeEmojiProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeEmoji({ size = 'md', className }: ThemeEmojiProps) {
  const { theme } = useTheme();

  return (
    <div className={cn(
      'animate-bounce-slow',
      {
        'text-4xl': size === 'sm',
        'text-6xl': size === 'md',
        'text-8xl': size === 'lg',
      },
      className
    )}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </div>
  );
}
