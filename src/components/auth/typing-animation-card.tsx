
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Cpu } from "lucide-react"; // Changed from Bot
import { cn } from "@/lib/utils";

interface TypingAnimationCardProps {
  isTyping: boolean;
}

export function TypingAnimationCard({ isTyping }: TypingAnimationCardProps) {
  return (
    <Card className="w-full h-full flex flex-col items-center justify-center shadow-xl rounded-md border border-border/60 bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:border-accent/70 hover:-translate-y-1 hover:animate-subtle-glow animate-subtle-glow">
      <div className="relative w-full flex items-center justify-center h-48 mb-6">
        {/* Replaced Image with Cpu icon */}
        <Cpu
          className={cn(
            "h-32 w-32 text-primary animate-gentle-pulse transition-all duration-500",
            isTyping ? "opacity-70" : "opacity-90"
          )}
          data-ai-hint="processor core"
        />
      </div>
      <div className="text-center h-10 flex items-center justify-center">
        {isTyping ? (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>AI Core processing...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Awaiting System Input...</p>
        )}
      </div>
       <p className="mt-4 text-xs text-center text-muted-foreground/70 px-4">
        Interface synchronization active. The AI companion mirrors user input rhythm.
      </p>
    </Card>
  );
}
