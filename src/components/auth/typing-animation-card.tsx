
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypingAnimationCardProps {
  isTyping: boolean;
}

export function TypingAnimationCard({ isTyping }: TypingAnimationCardProps) {
  return (
    <Card className="w-full h-full flex flex-col items-center justify-center shadow-xl rounded-md border border-border/60 bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:border-accent/70 hover:-translate-y-1 hover:animate-subtle-glow animate-subtle-glow">
      <div className="relative w-full aspect-[3/4] max-w-[300px] mb-6 rounded-sm overflow-hidden shadow-lg border border-primary/20">
        <Image
          src="https://placehold.co/384x512.png"
          alt="Abstract AI Neural Network Visualization"
          layout="fill"
          objectFit="cover"
          data-ai-hint="neural network abstract"
          className={cn(
            "transition-all duration-500 filter grayscale-[50%] hover:grayscale-0",
            isTyping ? "opacity-70 blur-[2px] grayscale-0" : "opacity-90"
          )}
        />
         {isTyping && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <Bot className="h-16 w-16 text-primary animate-ping opacity-70" />
          </div>
        )}
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
