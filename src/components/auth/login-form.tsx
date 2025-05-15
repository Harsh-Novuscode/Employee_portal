
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, KeyRound, User, Loader2, ArrowRight } from "lucide-react";
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
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [clientUserAgent, setClientUserAgent] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setClientUserAgent(navigator.userAgent);
    }
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const securityInput: EnhanceSecurityInput = {
        username: data.username,
        ipAddress: "127.0.0.1", // Placeholder, replace with actual IP in a real app
        loginTimestamp: new Date().toISOString(),
        userAgent: clientUserAgent,
        loginFailuresInLastHour: 0, // Placeholder, integrate with actual tracking
      };

      await new Promise(resolve => setTimeout(resolve, 750)); // Simulate network delay

      const securityResult = await enhanceSecurity(securityInput);

      if (securityResult.isSuspicious) {
        toast({
          variant: "destructive",
          title: "Login Attempt Blocked",
          description: securityResult.reason || "Suspicious activity detected. Please contact support.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome to the portal!",
          duration: 5000,
        });
        // form.reset(); // Consider if form reset is desired after successful login
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg rounded-lg border border-border/50 bg-card">
      <CardHeader className="text-center pt-8 pb-6">
        <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
          AccessHub Portal
        </CardTitle>
        <CardDescription className="pt-2 text-md text-muted-foreground">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-7 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" /> Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.username"
                      {...field}
                      className="py-3 text-base focus:border-primary rounded-md"
                      aria-label="Username or Email"
                    />
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
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" /> Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="py-3 text-base pr-10 focus:border-primary rounded-md"
                        aria-label="Password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 text-base rounded-md shadow-sm hover:shadow-md transition-all duration-150 ease-out group"
              disabled={isLoading}
              aria-label="Login button"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-8 text-center">
          <Link href="#" className="text-sm text-primary/90 hover:text-primary hover:underline font-medium">
            Forgot Password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
