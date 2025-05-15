
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, KeyRound, User, Loader2, Laugh, Wand2, ArrowRight } from "lucide-react"; // Added Laugh, Wand2, ArrowRight
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
  username: z.string().min(1, { message: "Psst! Your secret name?" }),
  password: z.string().min(1, { message: "The magic word, please!" }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [clientUserAgent, setClientUserAgent] = React.useState("");

  const [isUsernameFieldVisible, setIsUsernameFieldVisible] = React.useState(false);
  const [isPasswordFieldVisible, setIsPasswordFieldVisible] = React.useState(false);
  const [loginButtonText, setLoginButtonText] = React.useState("Let's Go!");


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

  const { watch } = form;
  const usernameValue = watch("username");
  const passwordValue = watch("password");

  React.useEffect(() => {
    if (usernameValue && passwordValue) {
      setLoginButtonText("Unlock the Portal!");
    } else if (usernameValue || passwordValue) {
      setLoginButtonText("Almost there...");
    } else {
      setLoginButtonText("Begin Quest!");
    }
  }, [usernameValue, passwordValue]);


  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const securityInput: EnhanceSecurityInput = {
        username: data.username,
        ipAddress: "127.0.0.1",
        loginTimestamp: new Date().toISOString(),
        userAgent: clientUserAgent,
        loginFailuresInLastHour: 0,
      };

      // Simulate a small delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      const securityResult = await enhanceSecurity(securityInput);

      if (securityResult.isSuspicious) {
        toast({
          variant: "destructive",
          title: "Uh oh, Trouble!",
          description: (
            <div className="flex items-center gap-2">
              <Laugh className="h-5 w-5 text-destructive-foreground" />
              <span>Hmm, that's a bit fishy! {securityResult.reason || 'Try a different spell?'}</span>
            </div>
          ),
          duration: 5000,
        });
      } else {
        toast({
          title: "Woohoo! You're In!",
          description: (
             <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary-foreground" />
              <span>The portal welcomes you, Master Hacker!</span>
            </div>
          ),
          duration: 5000,
        });
        // form.reset(); // Optionally reset form
        // setIsUsernameFieldVisible(false); // Hide fields again
        // setIsPasswordFieldVisible(false);
      }
    } catch (error) {
      console.error("Login spell misfired:", error);
      toast({
        variant: "destructive",
        title: "Fizzle! Pop!",
        description: "The login magic sputtered. Try again?",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputPlaceholderClasses = "cursor-pointer hover:bg-secondary/30 transition-all duration-300 p-6 rounded-lg border-2 border-dashed border-primary/50 flex flex-col items-center justify-center space-y-2 text-muted-foreground hover:text-primary hover:border-primary";

  return (
    <Card className="w-full max-w-md shadow-xl rounded-3xl border-2 border-primary/30 bg-card/80 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300 ease-out -rotate-1 hover:rotate-0">
      <CardHeader className="text-center pt-10 pb-6">
        <CardTitle className="text-5xl font-bold tracking-tight text-primary drop-shadow-md" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
          Access<span className="text-accent">Quest</span>
        </CardTitle>
        <CardDescription className="pt-3 text-lg text-foreground/80">
          Only the worthy may enter... (or those with passwords)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {!isUsernameFieldVisible ? (
              <div
                className={inputPlaceholderClasses}
                onClick={() => setIsUsernameFieldVisible(true)}
                role="button"
                tabIndex={0}
                aria-label="Reveal username field"
              >
                <User className="h-10 w-10 text-primary/70" />
                <span className="font-semibold text-lg">Who Goes There?</span>
                <span className="text-sm">(Click to reveal your name)</span>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-primary flex items-center gap-2">
                      <User className="h-5 w-5" /> Your Alias
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="e.g., ShadowWalker_27"
                          {...field}
                          className="pl-4 pr-4 py-6 text-lg transition-shadow duration-200 ease-in-out focus:shadow-accent/50 focus:shadow-lg focus:border-accent rounded-xl"
                          aria-label="Username or Email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isPasswordFieldVisible ? (
              <div
                className={cn(inputPlaceholderClasses, !isUsernameFieldVisible && "opacity-50 cursor-not-allowed")}
                onClick={() => isUsernameFieldVisible && setIsPasswordFieldVisible(true)}
                role="button"
                tabIndex={isUsernameFieldVisible ? 0 : -1}
                aria-label="Reveal password field"
                aria-disabled={!isUsernameFieldVisible}
              >
                <KeyRound className="h-10 w-10 text-primary/70" />
                 <span className="font-semibold text-lg">Secret Word?</span>
                <span className="text-sm">(Click if you dare...)</span>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-primary flex items-center gap-2">
                      <KeyRound className="h-5 w-5" /> Magic Phrase
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          {...field}
                          className="pl-4 pr-12 py-6 text-lg transition-shadow duration-200 ease-in-out focus:shadow-accent/50 focus:shadow-lg focus:border-accent rounded-xl"
                          aria-label="Password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-primary/80 hover:text-primary"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-6 w-6" />
                          ) : (
                            <Eye className="h-6 w-6" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 text-xl rounded-xl shadow-lg hover:shadow-primary/40 transform hover:scale-105 transition-all duration-200 ease-out group"
              disabled={isLoading || !isUsernameFieldVisible || !isPasswordFieldVisible}
              aria-label="Login button"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <>
                  {loginButtonText}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-10 text-center">
          <Link href="#" className="text-sm text-primary/80 hover:text-primary hover:underline font-medium">
            Forgot your magic spell? (Reset Password)
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
