
"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, UserCheck, CheckCircle, Clock } from "lucide-react";

export default function AttendancePage() {
  const [lastCheckIn, setLastCheckIn] = React.useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = React.useState<"Checked Out" | "Checked In">("Checked Out");

  const handleMarkAttendance = () => {
    const now = new Date();
    if (currentStatus === "Checked Out") {
      setLastCheckIn(now.toLocaleTimeString());
      setCurrentStatus("Checked In");
      // Here you would typically make an API call
    } else {
      // Optionally handle check-out logic or prevent multiple check-ins without check-out
      // For simplicity, this example just updates the time.
      setLastCheckIn(now.toLocaleTimeString()); 
      // setCurrentStatus("Checked Out"); // If you want to toggle
    }
  };

  return (
    <MainLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Employee Attendance
          </h1>
          <p className="text-muted-foreground">Track and manage employee attendance records.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Daily Check-ins</CardTitle>
                    <UserCheck className="h-8 w-8 text-accent" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground mb-4">
                        View today's attendance and overall presence.
                    </CardDescription>
                    <div className="mt-4 p-4 h-40 rounded-md bg-input/50 flex flex-col items-center justify-center border border-border/40">
                        {/* Placeholder for list of check-ins */}
                        <CheckCircle className="h-10 w-10 text-primary/70 mb-2" />
                        <p className="text-muted-foreground text-sm">Today's check-in data will appear here.</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">(e.g., List of employees checked in)</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up" style={{animationDelay: "100ms"}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Attendance Reports</CardTitle>
                    <CalendarCheck className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground mb-4">
                        Generate and view historical attendance reports.
                    </CardDescription>
                     <div className="mt-4 p-4 h-40 rounded-md bg-input/50 flex flex-col items-center justify-center border border-border/40">
                        {/* Placeholder for report generation tools */}
                        <CalendarCheck className="h-10 w-10 text-accent/70 mb-2" />
                        <p className="text-muted-foreground text-sm">Report generation tools will be here.</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">(e.g., Date pickers, filters)</p>
                    </div>
                </CardContent>
            </Card>
        </div>
         <div className="mt-8 p-6 bg-card border border-border/60 rounded-md shadow-xl animate-fade-in-slide-up" style={{animationDelay: "200ms"}}>
            <h2 className="text-2xl font-semibold text-primary mb-4">Mark Your Attendance</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Button 
                    onClick={handleMarkAttendance}
                    className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 px-6 text-lg rounded-sm shadow-md hover:shadow-primary/40 transition-all duration-300 ease-out group hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/50"
                    disabled={currentStatus === "Checked In"}
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {currentStatus === "Checked Out" ? "Mark My Check-in" : "Already Checked In"}
                </Button>
                <div className="text-sm">
                    {lastCheckIn && (
                        <p className="text-muted-foreground flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-accent" />
                            Last Check-in: <span className="font-semibold text-foreground ml-1">{lastCheckIn}</span>
                        </p>
                    )}
                    <p className="text-muted-foreground flex items-center mt-1">
                        <UserCheck className="h-4 w-4 mr-2 text-primary" />
                        Current Status: <span className="font-semibold text-foreground ml-1">{currentStatus}</span>
                    </p>
                </div>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-4">
                Click the button to record your presence. Your check-in time and status will be updated.
            </p>
        </div>
      </div>
    </MainLayout>
  );
}
