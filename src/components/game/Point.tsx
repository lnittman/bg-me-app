"use client";
import { cn } from "@/lib/utils";

export interface PointProps {
  index: number;
  count: number;
  isTop: boolean;
  selected: boolean;
  onClick: () => void;
  isMyTurn: boolean;
  isSpectator: boolean;
}

export default function Point({
  index,
  count,
  isTop,
  selected,
  onClick,
  isMyTurn,
  isSpectator,
}: PointProps) {
  const isEven = index % 2 === 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-full transition-colors",
        selected && "ring-1 ring-primary ring-inset",
        isMyTurn && !isSpectator && "cursor-pointer hover:bg-accent/5",
        "group"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0",
          isTop ? "top-0 h-[95%]" : "bottom-0 h-[95%]",
          isEven ? "bg-muted/70" : "bg-muted/30",
          "transition-colors group-hover:brightness-110",
          "rounded-lg before:absolute before:inset-0 before:rounded-lg",
          isTop
            ? "before:origin-top before:[clip-path:polygon(0_0,100%_0,50%_100%)]"
            : "before:origin-bottom before:[clip-path:polygon(50%_0,0_100%,100%_100%)]",
          "overflow-hidden"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-lg",
            isEven ? "bg-muted/70" : "bg-muted/30"
          )}
        />
      </div>

      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2",
          isTop ? "top-[5%]" : "bottom-[5%]",
          "w-[50%] flex flex-col items-center",
          isTop ? "gap-[0.75%]" : "gap-[0.75%] flex-col-reverse"
        )}
      >
        {Array.from({ length: Math.abs(count) }).map((_, j) => (
          <div
            key={j}
            className={cn(
              "w-full aspect-square rounded-full border transition-all",
              count > 0
                ? "bg-background border-foreground shadow-[inset_0_1px_theme(colors.muted.DEFAULT)]"
                : "bg-foreground border-background shadow-[inset_0_1px_rgba(255,255,255,0.1)]",
              selected && "ring-1 ring-primary ring-offset-1"
            )}
          />
        ))}
      </div>
    </div>
  );
}
