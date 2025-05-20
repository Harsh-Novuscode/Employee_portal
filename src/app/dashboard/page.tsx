
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerCog, Activity, AreaChart, BrainCircuit, Lightbulb } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { QuizCard } from "@/components/dashboard/quiz-card";
import { Progress } from "@/components/ui/progress"; // Import Progress component

interface DashboardCardData {
  title: string;
  icon: JSX.Element;
  description: string | React.ReactNode;
  altText: string;
  dataAiHint: string;
  id: string;
}

const staticInsights = [
  "AI can compose music, write poetry, and even generate art!",
  "Deep learning models can have billions of parameters, learning complex patterns from data.",
  "The Turing Test, proposed by Alan Turing in 1950, is a test of a machine's ability to exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human.",
  "AI is helping to accelerate scientific discovery in fields like medicine and climate change.",
  "Reinforcement learning allows AI agents to learn by trial and error, much like humans do."
];

export default function DashboardPage() {
  const [cognitiveLoad, setCognitiveLoad] = React.useState(67); // Default value
  const [currentInsight, setCurrentInsight] = React.useState("");

  React.useEffect(() => {
    // Client-side only updates to avoid hydration mismatch
    setCognitiveLoad(Math.floor(Math.random() * (85 - 50 + 1)) + 50); // Random between 50 and 85
    setCurrentInsight(staticInsights[Math.floor(Math.random() * staticInsights.length)]);
  }, []);

  const dashboardCards: DashboardCardData[] = [
    {
      id: "system-status",
      title: "System Status",
      icon: <ServerCog className="h-8 w-8 text-primary" />,
      description: "All systems operational. Neural network integrity: 99.98%.",
      altText: "Funny server room GIF",
      dataAiHint: "funny server gif"
    },
    {
      id: "active-processes",
      title: "Active Processes",
      icon: <Activity className="h-8 w-8 text-accent" />,
      description: "Data analysis stream active. Threat detection module online.",
      altText: "Funny multitasking GIF",
      dataAiHint: "funny coding gif"
    },
    {
      id: "data-analytics",
      title: "Data Analytics Feed",
      icon: <AreaChart className="h-8 w-8 text-primary" />,
      description: "Real-time insights & anomaly detection. Last scan: 2 mins ago.",
      altText: "Data chart with a twist",
      dataAiHint: "data chart"
    },
    {
      id: "cognitive-core",
      title: "Cognitive Core Load",
      icon: <BrainCircuit className="h-8 w-8 text-accent" />,
      description: (
        <>
          Current processing load: {cognitiveLoad}%. Models recalibrating.
          <div className="mt-2">
            <Progress value={cognitiveLoad} className="h-2 bg-primary/20" />
          </div>
        </>
      ),
      altText: "Brain working hard GIF",
      dataAiHint: "funny thinking gif"
    },
    {
      id: "ai-insight",
      title: "AI Insight of the Day",
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      description: currentInsight || "Loading insight...",
      altText: "AI brainwave",
      dataAiHint: "artificial intelligence concept"
    }
  ];

  return (
    <MainLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            AI Command Center
          </h1>
           <p className="text-muted-foreground">Welcome to the AI System Interface.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card, index) => (
            <Card
              key={card.id}
              className="shadow-xl rounded-md border border-border/60 bg-card transition-all duration-300 hover:shadow-2xl hover:border-primary/70 hover:-translate-y-1 animate-fade-in-slide-up flex flex-col" // Added flex flex-col
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold text-primary">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="flex-grow"> {/* Added flex-grow */}
                <div className="text-sm text-muted-foreground"> {/* Wrapped description in a div for consistent styling */}
                  {card.description}
                </div>
                 <div className="mt-4 h-32 rounded-md bg-input/50 flex items-center justify-center">
                  <img
                    src={`https://placehold.co/300x150.png`}
                    alt={card.altText}
                    className="opacity-30 object-cover rounded-md"
                    data-ai-hint={card.dataAiHint}
                  />
                 </div>
              </CardContent>
            </Card>
          ))}
           <div className="lg:col-span-1">
            <QuizCard
              className="shadow-xl rounded-md border border-border/60 bg-card transition-all duration-300 hover:shadow-2xl hover:border-primary/70 hover:-translate-y-1 animate-fade-in-slide-up h-full" // Added h-full
              style={{ animationDelay: `${dashboardCards.length * 100}ms` }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
