
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Cpu, Shield, Loader2, ArrowRight, Wand2 } from "lucide-react"; // Changed Icons
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added for navigation

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
  const router = useRouter(); // Initialized router
  const [clientUserAgent, setClientUserAgent] = React.useState("");
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

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

  const handleTyping = () => {
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
    handleTyping();
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      const securityInput: EnhanceSecurityInput = {
        username: data.username,
        ipAddress: "127.0.0.1", // Placeholder, replace with actual IP if available
        loginTimestamp: new Date().toISOString(),
        userAgent: clientUserAgent,
        loginFailuresInLastHour: 0, // Placeholder, implement actual tracking if needed
      };

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
          description: "Welcome to the AI System Interface. Access protocols initiated.",
          duration: 3000,
        });
        form.reset(); 
        router.push('/dashboard'); 
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
    <Card className="w-full h-full flex flex-col justify-center shadow-2xl rounded-md border border-primary/30 bg-card transition-all duration-300 hover:border-primary/70 hover:-translate-y-1 animate-fade-in-slide-up hover:shadow-primary/20">
      <CardHeader className="text-center pt-10 pb-6">
        <CardTitle className="text-5xl font-bold tracking-tight text-primary">
          AccessHub Portal
        </CardTitle>
        <CardDescription className="pt-2 text-md text-muted-foreground">
          Authenticate to access AI-powered insights.
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
                        onKeyDown={handleTyping}
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter sequence..."
                        {...field}
                        onChange={(e) => handlePasswordChange(e, field.onChange)}
                        onKeyDown={handleTyping}
                        className={cn(
                          "py-3 pl-10 pr-10 text-base rounded-sm peer focus:border-primary/70 transition-colors duration-300 bg-input focus:bg-input/70 focus:ring-1 focus:ring-primary/70",
                          !showPassword && "text-transparent caret-primary select-none"
                        )}
                        aria-label="Authentication Key"
                        autoComplete="new-password"
                      />
                    </FormControl>
                     <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={toggleShowPassword}
                      aria-label={showPassword ? "Show Auth Key" : "Hide Auth Key"}
                    >
                      {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </Button>
                  </div>
                  {!showPassword && (
                    <div className="flex space-x-1 mt-2 h-3 items-center" aria-hidden="true">
                      {Array.from({ length: MAX_PASSWORD_SEGMENTS }).map((_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "h-2 flex-1 rounded-sm transition-all duration-150 ease-in-out",
                            field.value && field.value.length > index ? "bg-primary animate-pulse" : "bg-muted/30"
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        />
                      ))}
                    </div>
                  )}
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
              {isLoading ? "Processing..." : "Initiate Connection"}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:rotate-[10deg]" />}
            </Button>
          </form>
        </Form>
        <div className="mt-10 text-center">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary hover:underline font-medium transition-all duration-300 transform hover:scale-105 inline-block hover:drop-shadow-[0_0_5px_hsl(var(--primary))]"
            onClick={(e) => {
              e.preventDefault();
              toast({ title: "System Protocol", description: "Auth Key recovery sequence initiated. Check secure channel." });
            }}
          >
            Forgot Auth Key?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
