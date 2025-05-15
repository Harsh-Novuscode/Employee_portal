
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerCog, Activity, AreaChart, LogOut, UserCircle2, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleLogout = () => {
    // Here you might also want to clear any session/token
    router.push("/");
  };

  const dashboardCards = [
    {
      title: "System Status",
      icon: <ServerCog className="h-8 w-8 text-primary" />,
      description: "All systems operational. Neural network integrity: 99.98%.",
      bgColor: "bg-card",
      dataAiHint: "server status"
    },
    {
      title: "Active Processes",
      icon: <Activity className="h-8 w-8 text-accent" />,
      description: "Data analysis stream active. Threat detection module online.",
      bgColor: "bg-card",
      dataAiHint: "cpu activity"
    },
    {
      title: "Data Analytics Feed",
      icon: <AreaChart className="h-8 w-8 text-primary" />,
      description: "Real-time insights & anomaly detection. Last scan: 2 mins ago.",
      bgColor: "bg-card",
      dataAiHint: "data chart"
    },
    {
      title: "Cognitive Core Load",
      icon: <BrainCircuit className="h-8 w-8 text-accent" />,
      description: "Current processing load: 67%. Predictive models recalibrating.",
      bgColor: "bg-card",
      dataAiHint: "brain circuit"
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-900/40 text-foreground">
      <div className="w-full max-w-6xl">
        <header className="my-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <UserCircle2 className="h-12 w-12 text-primary animate-pulse" data-ai-hint="user profile"/>
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
              AI Command Center
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary group"
          >
            <LogOut className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {dashboardCards.map((card, index) => (
            <Card
              key={index}
              className="shadow-xl rounded-md border border-border/60 bg-card transition-all duration-300 hover:shadow-2xl hover:border-primary/70 hover:-translate-y-1 animate-fade-in-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold text-primary">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
                 <div className="mt-4 h-32 rounded-md bg-input/50 flex items-center justify-center">
                  <img 
                    src={`https://placehold.co/300x150.png?text=${card.title.replace(/\s/g, '+')}`} 
                    alt={card.title} 
                    className="opacity-30 object-cover rounded-md"
                    data-ai-hint={card.dataAiHint}
                  />
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        &copy; {currentYear} AI Corp Systems. Dashboard Interface v2.1.
      </footer>
    </main>
  );
}

