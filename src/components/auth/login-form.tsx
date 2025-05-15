
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Cpu, Shield, Loader2, ArrowRight, Wand2 } from "lucide-react"; // Changed ShieldLock to Shield
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
  username: z.string().min(1, { message: "System ID is required." }), // Changed message
  password: z.string().min(1, { message: "Auth Key is required." }), // Changed message
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  setIsTyping: (isTyping: boolean) => void;
}

export function LoginForm({ setIsTyping }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [clientUserAgent, setClientUserAgent] = React.useState("");
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      const securityInput: EnhanceSecurityInput = {
        username: data.username,
        ipAddress: "::1", // Updated placeholder
        loginTimestamp: new Date().toISOString(),
        userAgent: clientUserAgent,
        loginFailuresInLastHour: 0,
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const securityResult = await enhanceSecurity(securityInput);

      if (securityResult.isSuspicious) {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Authorization Anomaly {/* Changed ShieldLock to Shield */}
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
    <Card className="w-full h-full flex flex-col justify-center shadow-xl rounded-md border border-border/60 bg-card transition-all duration-300 hover:shadow-2xl hover:border-accent/70 hover:-translate-y-1 hover:animate-subtle-glow">
      <CardHeader className="text-center pt-10 pb-6">
        <CardTitle className="text-4xl font-bold tracking-tight text-primary">
          AI System Interface {/* Changed Title */}
        </CardTitle>
        <CardDescription className="pt-2 text-md text-muted-foreground">
          Authenticate to access neural network.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground/80">System ID</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Cpu className="absolute left-3 h-5 w-5 text-muted-foreground peer-focus:text-primary transition-colors" /> {/* Changed Icon */}
                      <Input
                        placeholder="node.identifier@network.ai"
                        {...field}
                        onKeyDown={handleKeyDown}
                        className="py-3 pl-10 text-base rounded-sm peer focus:border-primary/70 transition-colors duration-300 bg-input focus:bg-input/70"
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
                  <FormControl>
                    <div className="relative flex items-center">
                       <Shield className="absolute left-3 h-5 w-5 text-muted-foreground peer-focus:text-primary transition-colors" /> {/* Changed ShieldLock to Shield */}
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...field}
                        onKeyDown={handleKeyDown}
                        className="py-3 pl-10 pr-12 text-base rounded-sm peer focus:border-primary/70 transition-colors duration-300 bg-input focus:bg-input/70"
                        aria-label="Authentication Key"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide Auth Key" : "Show Auth Key"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 text-lg rounded-sm shadow-md hover:shadow-primary/40 transition-all duration-300 ease-out group hover:scale-[1.02] hover:-translate-y-0.5"
              disabled={isLoading}
              aria-label="Initiate Connection button"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                "Initiate Connection" // Changed Button Text
              )}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-[5deg]" />}
            </Button>
          </form>
        </Form>
        <div className="mt-8 text-center">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-accent hover:underline font-medium transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Auth Key Recovery?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
