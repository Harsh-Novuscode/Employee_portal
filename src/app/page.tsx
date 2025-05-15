
import { LoginForm } from "@/components/auth/login-form";
import { Sparkles } from "lucide-react"; // Changed icon to Sparkles

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-radial from-accent/20 via-background to-secondary/10">
      <div className="mb-10 flex flex-col items-center transform transition-transform hover:scale-110">
        {/* Using a more playful icon */}
        <Sparkles className="h-20 w-20 text-primary animate-pulse" data-ai-hint="magic sparkle" />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      <footer className="mt-16 text-center text-sm text-muted-foreground/70">
        &copy; {new Date().getFullYear()} The Funky Portal Co. All rights reserved. (Shhh, it's a secret!)
      </footer>
    </main>
  );
}
