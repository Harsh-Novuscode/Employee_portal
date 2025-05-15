
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypingAnimationCardProps {
  isTyping: boolean;
}

export function TypingAnimationCard({ isTyping }: TypingAnimationCardProps) {
  return (
    <Card className="w-full h-full flex flex-col items-center justify-center shadow-xl rounded-lg border border-border/60 bg-card p-6">
      <div className="relative w-full aspect-[3/4] max-w-[300px] mb-6 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="https://placehold.co/384x512.png"
          alt="Analyst working on a laptop"
          layout="fill"
          objectFit="cover"
          data-ai-hint="professional coding"
          className={cn(
            "transition-opacity duration-500",
            isTyping ? "opacity-80" : "opacity-100"
          )}
        />
         {isTyping && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <MessageSquareText className="h-16 w-16 text-white/80 animate-ping" />
          </div>
        )}
      </div>
      <div className="text-center h-10 flex items-center justify-center">
        {isTyping ? (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Analyst is typing...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Awaiting your credentials...</p>
        )}
      </div>
       <p className="mt-4 text-xs text-center text-muted-foreground/70 px-4">
        This interactive element showcases our system's responsiveness. As you type, our &quot;digital analyst&quot; mirrors the activity.
      </p>
    </Card>
  );
}
