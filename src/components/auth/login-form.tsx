
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, KeyRound, User, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
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

      // Simulate network delay and AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const securityResult = await enhanceSecurity(securityInput);

      if (securityResult.isSuspicious) {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" /> Login Alert
            </div>
          ),
          description: securityResult.reason || "Suspicious activity detected. Please contact support.",
          duration: 6000,
        });
      } else {
        toast({
          title: "Access Granted!",
          description: "Welcome to the AccessHub portal.",
          duration: 5000,
        });
        // Consider navigation or form reset here
        // router.push('/dashboard');
        // form.reset();
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
    <Card className="w-full max-w-md shadow-xl rounded-lg border border-border/60 bg-card transition-all duration-300 hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 animate-fade-in-slide-up">
      <CardHeader className="text-center pt-10 pb-6">
        <CardTitle className="text-4xl font-bold tracking-tight text-foreground">
          AccessHub Portal
        </CardTitle>
        <CardDescription className="pt-2 text-md text-muted-foreground">
          Securely sign in to your corporate account.
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
                  <FormLabel className="text-sm font-medium text-foreground">Username</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 h-5 w-5 text-muted-foreground peer-focus:text-primary transition-colors" />
                      <Input
                        placeholder="your.username@company.com"
                        {...field}
                        className="py-3 pl-10 text-base rounded-md peer focus:border-primary transition-colors duration-300"
                        aria-label="Username or Email"
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
                  <FormLabel className="text-sm font-medium text-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                       <KeyRound className="absolute left-3 h-5 w-5 text-muted-foreground peer-focus:text-primary transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="py-3 pl-10 pr-12 text-base rounded-md peer focus:border-primary transition-colors duration-300"
                        aria-label="Password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg rounded-md shadow-md hover:shadow-lg transition-all duration-300 ease-out group hover:scale-[1.03] hover:-translate-y-0.5"
              disabled={isLoading}
              aria-label="Sign In button"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                "Sign In"
              )}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:rotate-[10deg]" />}
            </Button>
          </form>
        </Form>
        <div className="mt-8 text-center">
          <Link 
            href="#" 
            className="text-sm text-muted-foreground hover:text-primary hover:underline font-medium transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Forgot Password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
