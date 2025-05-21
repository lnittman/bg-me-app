"use client";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RulesSection from "@/components/instructions/RulesSection";
import UsingSection from "@/components/instructions/UsingSection";

export default function Instructions() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-9 pt-[calc(var(--header-height)+2rem)]">
        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold lowercase">instructions</h1>
          </div>

          <RulesSection />

          <UsingSection />

          <div className="flex justify-center py-12">
            <Button variant="outline" size="lg" asChild className="w-full max-w-xs gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                back to home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
