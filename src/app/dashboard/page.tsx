
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerCog, Activity, AreaChart, BrainCircuit } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";


export default function DashboardPage() {
  const dashboardCards = [
    {
      title: "System Status",
      icon: <ServerCog className="h-8 w-8 text-primary" />,
      description: "All systems operational. Neural network integrity: 99.98%.",
      dataAiHint: "server status"
    },
    {
      title: "Active Processes",
      icon: <Activity className="h-8 w-8 text-accent" />,
      description: "Data analysis stream active. Threat detection module online.",
      dataAiHint: "cpu activity"
    },
    {
      title: "Data Analytics Feed",
      icon: <AreaChart className="h-8 w-8 text-primary" />,
      description: "Real-time insights & anomaly detection. Last scan: 2 mins ago.",
      dataAiHint: "data chart"
    },
    {
      title: "Cognitive Core Load",
      icon: <BrainCircuit className="h-8 w-8 text-accent" />,
      description: "Current processing load: 67%. Predictive models recalibrating.",
      dataAiHint: "brain circuit"
    },
  ];

  return (
    <MainLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Main Dashboard Overview
          </h1>
           <p className="text-muted-foreground">Welcome to the AI Command Center.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
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
                    src={`https://placehold.co/300x150.png`}
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
    </MainLayout>
  );
}
