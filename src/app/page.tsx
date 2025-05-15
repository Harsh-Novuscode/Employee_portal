
"use client";
import * as React from "react";
import { LoginForm } from "@/components/auth/login-form";
import { TypingAnimationCard } from "@/components/auth/typing-animation-card";
import { Brain } from "lucide-react"; // Changed from Network

export default function LoginPage() {
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-900/40"> {/* AI Theme Gradient */}
      <div className="mb-10 flex flex-col items-center group">
        <Brain className="h-20 w-20 text-primary animate-gentle-pulse group-hover:scale-110 transition-transform duration-300" data-ai-hint="artificial intelligence brain" /> {/* Changed Icon */}
      </div>
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 w-full max-w-4xl animate-fade-in-slide-up">
        <div className="w-full md:w-1/2">
          <TypingAnimationCard isTyping={isTyping} />
        </div>
        <div className="w-full md:w-1/2">
          <LoginForm setIsTyping={setIsTyping} />
        </div>
      </div>
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        &copy; {currentYear} AI Corp Systems. All rights reserved. {/* Thematic Footer */}
      </footer>
    </main>
  );
}
