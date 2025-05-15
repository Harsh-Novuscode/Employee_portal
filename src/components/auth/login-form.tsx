"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";
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

const formSchema = z.object({
  username: z.string().min(1, { message: "Username or Email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [clientUserAgent, setClientUserAgent] = React.useState("");

  React.useEffect(() => {
    // Ensure this only runs on the client after hydration
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
        ipAddress: "127.0.0.1", // Placeholder, in a real app, get this server-side
        loginTimestamp: new Date().toISOString(),
        userAgent: clientUserAgent, // Use state variable to avoid hydration mismatch
        loginFailuresInLastHour: 0, // Placeholder, in a real app, this would be tracked
      };

      const securityResult = await enhanceSecurity(securityInput);

      if (securityResult.isSuspicious) {
        toast({
          variant: "destructive",
          title: "Security Alert",
          description: `Suspicious login attempt detected. Reason: ${securityResult.reason || 'Unspecified reasons.'}`,
        });
      } else {
        // Simulate successful login. In a real app, you'd handle authentication.
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        // Potentially redirect user or set auth state here
        // form.reset(); // Optionally reset form on success
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-lg border border-border/30">
      <CardHeader className="text-center pt-8 pb-4">
        <CardTitle className="text-5xl font-bold tracking-tight text-primary">AccessHub</CardTitle>
        <CardDescription className="pt-2 text-base">Sign in to your company portal</CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="your.email@company.com"
                        {...field}
                        className="pl-10 transition-shadow duration-200 ease-in-out focus:shadow-md focus:border-primary"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="pl-10 pr-10 transition-shadow duration-200 ease-in-out focus:shadow-md focus:border-primary"
                        aria-label="Password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-lg rounded-md"
              disabled={isLoading}
              aria-label="Login"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-8 text-center">
          <Link href="#" className="text-sm text-primary/80 hover:text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
