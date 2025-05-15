import { LoginForm } from "@/components/auth/login-form";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="mb-8 flex flex-col items-center">
        <ShieldCheck className="h-16 w-16 text-primary" data-ai-hint="security shield" />
      </div>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} AccessHub. All rights reserved.
      </footer>
    </main>
  );
}
