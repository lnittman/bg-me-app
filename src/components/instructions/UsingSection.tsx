"use client";
import { useAtom } from "jotai";
import { instructionsOpenAtom } from "@/store/ui";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AnimatedContent from "./AnimatedContent";

export default function UsingSection() {
  const [openSections, setOpenSections] = useAtom(instructionsOpenAtom);

  const handleSectionChange = (
    section: keyof typeof openSections,
    value: boolean
  ) => {
    setOpenSections((s) => ({ ...s, [section]: value }));
  };

  return (
    <Collapsible
      defaultOpen
      open={openSections.using}
      onOpenChange={(open) => handleSectionChange("using", open)}
    >
      <CollapsibleTrigger className="w-full text-left">
        <h2
          className={cn(
            "text-xl font-semibold lowercase hover:text-primary transition-colors",
            openSections.using && "text-primary"
          )}
        >
          using bg.me
        </h2>
      </CollapsibleTrigger>
      <AnimatedContent open={openSections.using}>
        <div className="space-y-6 pt-6">
          <div className="prose prose-sm dark:prose-invert space-y-6">
            <Collapsible
              defaultOpen
              open={openSections.getting}
              onOpenChange={(open) => handleSectionChange("getting", open)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <h3
                  className={cn(
                    "text-lg font-medium lowercase italic hover:text-primary transition-colors",
                    openSections.getting && "text-primary"
                  )}
                >
                  getting started
                </h3>
              </CollapsibleTrigger>
              <AnimatedContent open={openSections.getting}>
                <div className="pt-3">
                  <div className="lowercase space-y-6">
                    <p>click &quot;create room&quot; on the home page</p>

                    <p>choose your player name and emoji</p>

                    <p>share the room link with a friend</p>

                    <p>both players click &quot;join as player&quot;</p>

                    <p>the creator can start the match when ready</p>
                  </div>
                </div>
              </AnimatedContent>
            </Collapsible>

            <Collapsible
              defaultOpen
              open={openSections.playing}
              onOpenChange={(open) => handleSectionChange("playing", open)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <h3
                  className={cn(
                    "text-lg font-medium lowercase italic hover:text-primary transition-colors",
                    openSections.playing && "text-primary"
                  )}
                >
                  playing a match
                </h3>
              </CollapsibleTrigger>
              <AnimatedContent open={openSections.playing}>
                <div className="pt-3">
                  <div className="lowercase space-y-6">
                    <p>click your pieces to select them</p>

                    <p>click a valid point to move the selected piece</p>

                    <p>use the chat to communicate with other players</p>

                    <p>watch the game as a spectator if the room is full</p>
                  </div>
                </div>
              </AnimatedContent>
            </Collapsible>
          </div>
        </div>
      </AnimatedContent>
    </Collapsible>
  );
}
