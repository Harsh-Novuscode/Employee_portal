
import { LoginForm } from "@/components/auth/login-form";
import { Network } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="mb-10 flex flex-col items-center group">
        <Network className="h-20 w-20 text-primary animate-gentle-pulse" data-ai-hint="technology network" />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} YourCompanyName LLC. All rights reserved.
      </footer>
    </main>
  );
}
