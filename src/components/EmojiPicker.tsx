'use client';

import { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <span className="text-2xl mr-2">{selected}</span>
          <span className="text-muted-foreground">
            Click to change
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Picker
          data={data}
          onEmojiSelect={(emoji: { native: string }) => {
            onSelect(emoji.native);
            setOpen(false);
          }}
          theme="dark"
          set="native"
        />
      </PopoverContent>
    </Popover>
  );
}
