"use client";
import { useAtom } from "jotai";
import { instructionsOpenAtom } from "@/store/ui";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AnimatedContent from "./AnimatedContent";

export default function RulesSection() {
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
      open={openSections.rules}
      onOpenChange={(open) => handleSectionChange("rules", open)}
    >
      <CollapsibleTrigger className="w-full text-left">
        <h2
          className={cn(
            "text-xl font-semibold lowercase hover:text-primary transition-colors",
            openSections.rules && "text-primary"
          )}
        >
          backgammon rules
        </h2>
      </CollapsibleTrigger>
      <AnimatedContent open={openSections.rules}>
        <div className="space-y-6 pt-6">
          <div className="prose prose-sm dark:prose-invert space-y-6">
            <Collapsible
              defaultOpen
              open={openSections.objective}
              onOpenChange={(open) => handleSectionChange("objective", open)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <h3
                  className={cn(
                    "text-lg font-medium lowercase italic hover:text-primary transition-colors",
                    openSections.objective && "text-primary"
                  )}
                >
                  objective
                </h3>
              </CollapsibleTrigger>
              <AnimatedContent open={openSections.objective}>
                <div className="pt-3 space-y-3">
                  <p className="lowercase">
                    the goal is to move all your pieces to your home board and then
                    bear them off.
                  </p>
                  <p className="lowercase">
                    the first player to remove all their pieces wins the game.
                  </p>
                </div>
              </AnimatedContent>
            </Collapsible>

            <Collapsible
              defaultOpen
              open={openSections.basicRules}
              onOpenChange={(open) => handleSectionChange("basicRules", open)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <h3
                  className={cn(
                    "text-lg font-medium lowercase italic hover:text-primary transition-colors",
                    openSections.basicRules && "text-primary"
                  )}
                >
                  basic rules
                </h3>
              </CollapsibleTrigger>
              <AnimatedContent open={openSections.basicRules}>
                <div className="pt-3">
                  <div className="lowercase space-y-6">
                    <p>players take turns rolling two dice and moving their pieces</p>

                    <p>pieces move counterclockwise around the board</p>

                    <p>each die can be used to move one piece</p>

                    <p>you can move one piece twice using both dice</p>

                    <p>pieces land on points (triangles) of the same color</p>

                    <p>multiple pieces can occupy the same point</p>
                  </div>
                </div>
              </AnimatedContent>
            </Collapsible>

            <Collapsible
              defaultOpen
              open={openSections.hitting}
              onOpenChange={(open) => handleSectionChange("hitting", open)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <h3
                  className={cn(
                    "text-lg font-medium lowercase italic hover:text-primary transition-colors",
                    openSections.hitting && "text-primary"
                  )}
                >
                  hitting and entering
                </h3>
              </CollapsibleTrigger>
              <AnimatedContent open={openSections.hitting}>
                <div className="pt-3">
                  <div className="lowercase space-y-6">
                    <p>a single piece on a point is vulnerable to being &quot;hit&quot;</p>

                    <p>when hit, the piece moves to the bar</p>

                    <p>you must bring pieces back from the bar before making other moves</p>
                  </div>
                </div>
              </AnimatedContent>
            </Collapsible>

            <Collapsible
              defaultOpen
              open={openSections.bearing}
              onOpenChange={(open) => handleSectionChange("bearing", open)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <h3
                  className={cn(
                    "text-lg font-medium lowercase italic hover:text-primary transition-colors",
                    openSections.bearing && "text-primary"
                  )}
                >
                  bearing off
                </h3>
              </CollapsibleTrigger>
              <AnimatedContent open={openSections.bearing}>
                <div className="pt-3">
                  <p className="lowercase">
                    once all your pieces are in your home board (last 6 points), you can
                    start bearing them off (removing them from the board).
                  </p>
                </div>
              </AnimatedContent>
            </Collapsible>

            <Collapsible
              defaultOpen
              open={openSections.tips}
              onOpenChange={(open) => handleSectionChange("tips", open)}
            >
              <CollapsibleTrigger className="w-full text-left">
                <h3
                  className={cn(
                    "text-lg font-medium lowercase italic hover:text-primary transition-colors",
                    openSections.tips && "text-primary"
                  )}
                >
                  tips
                </h3>
              </CollapsibleTrigger>
              <AnimatedContent open={openSections.tips}>
                <div className="pt-3">
                  <div className="lowercase space-y-6">
                    <p>try to make points in sequence - this creates a "prime" that blocks your opponent</p>

                    <p>don&apos;t leave single pieces exposed - they can be hit and sent back!</p>

                    <p>early in the game, focus on moving pieces from your 24-point</p>

                    <p>the 5 and 7 points are key positions to control</p>

                    <p>when ahead, try to close out points to trap opponent&apos;s pieces</p>

                    <p>don&apos;t rush to bear off if you have vulnerable pieces</p>
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
