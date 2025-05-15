
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Cpu, Shield, Loader2, ArrowRight, Wand2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { enhanceSecurity, EnhanceSecurityInput } from "@/ai/flows/enhance-security";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  username: z.string().min(1, { message: "System ID is required." }),
  password: z.string().min(1, { message: "Auth Key is required." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  setIsTyping: (isTyping: boolean) => void;
}

const MAX_PASSWORD_SEGMENTS = 12;

export function LoginForm({ setIsTyping }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [clientUserAgent, setClientUserAgent] = React.useState("");
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [passwordProgress, setPasswordProgress] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setClientUserAgent(navigator.userAgent);
    }
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleKeyDown = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    const value = e.target.value;
    fieldChange(value);
    setPasswordProgress(value.length);
    handleKeyDown(); // Also trigger typing animation for password
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      const securityInput: EnhanceSecurityInput = {
        username: data.username,
        ipAddress: "::1",
        loginTimestamp: new Date().toISOString(),
        userAgent: clientUserAgent,
        loginFailuresInLastHour: 0,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      const securityResult = await enhanceSecurity(securityInput);

      if (securityResult.isSuspicious) {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Authorization Anomaly
            </div>
          ),
          description: securityResult.reason || "Suspicious activity detected. System integrity protocols engaged.",
          duration: 6000,
        });
      } else {
        toast({
          title: (
            <div className="flex items-center gap-2">
               <Wand2 className="h-5 w-5 text-primary" /> Connection Established!
            </div>
          ),
          description: "Welcome to the AI System Interface.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "An unexpected system error occurred. Please retry.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col justify-center shadow-xl rounded-md border border-border/60 bg-card transition-all duration-300 hover:shadow-2xl hover:border-primary/70 hover:-translate-y-1 animate-fade-in-slide-up">
      <CardHeader className="text-center pt-10 pb-6">
        <CardTitle className="text-4xl font-bold tracking-tight text-primary">
          AI System Interface
        </CardTitle>
        <CardDescription className="pt-2 text-md text-muted-foreground">
          Authenticate to access neural network.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground/80">System ID</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center group">
                      <Cpu className="absolute left-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="node.identifier@network.ai"
                        {...field}
                        onKeyDown={handleKeyDown}
                        className="py-3 pl-10 text-base rounded-sm peer focus:border-primary/70 transition-colors duration-300 bg-input focus:bg-input/70 focus:ring-1 focus:ring-primary/70"
                        aria-label="System ID or Username"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground/80">Auth Key</FormLabel>
                  <div className="relative flex items-center group">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter sequence..." // Placeholder isn't really visible due to transparent text
                        {...field}
                        onChange={(e) => handlePasswordChange(e, field.onChange)}
                        onKeyDown={handleKeyDown} // Re-add handleKeyDown if you want typing animation for password too
                        className="py-3 pl-10 pr-4 text-base rounded-sm peer focus:border-primary/70 transition-colors duration-300 bg-input focus:bg-input/70 focus:ring-1 focus:ring-primary/70 text-transparent caret-primary select-none"
                        aria-label="Authentication Key"
                        autoComplete="new-password"
                      />
                    </FormControl>
                  </div>
                  <div className="flex space-x-1.5 mt-2 pl-1 h-6 items-center" aria-hidden="true">
                    {Array.from({ length: MAX_PASSWORD_SEGMENTS }).map((_, index) => (
                      <span
                        key={index}
                        className={cn(
                          "h-3 w-full flex-1 rounded-sm transition-all duration-150 ease-in-out",
                          index < passwordProgress ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]" : "bg-muted/30"
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 text-lg rounded-sm shadow-md hover:shadow-primary/40 transition-all duration-300 ease-out group hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/50"
              disabled={isLoading}
              aria-label="Initiate Connection button"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                "Initiate Connection"
              )}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:rotate-[10deg]" />}
            </Button>
          </form>
        </Form>
        <div className="mt-10 text-center">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-accent hover:underline font-medium transition-all duration-300 transform hover:scale-105 inline-block hover:drop-shadow-[0_0_5px_hsl(var(--accent))]"
          >
            Auth Key Recovery?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
