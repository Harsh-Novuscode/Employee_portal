
"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarCheck, UserCheck } from "lucide-react";

export default function AttendancePage() {
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
            <Card className="shadow-lg rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Daily Check-ins</CardTitle>
                    <UserCheck className="h-8 w-8 text-accent" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground">
                        View today's attendance and overall presence.
                    </CardDescription>
                    <div className="mt-4 h-40 rounded-md bg-input/50 flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Attendance data will appear here.</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-lg rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Attendance Reports</CardTitle>
                    <CalendarCheck className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground">
                        Generate and view historical attendance reports.
                    </CardDescription>
                     <div className="mt-4 h-40 rounded-md bg-input/50 flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Report generation tools will be here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
         <div className="mt-8 p-6 bg-card border border-border/60 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-primary mb-3">Mark Attendance</h2>
            <p className="text-muted-foreground">Employee attendance marking functionality will be implemented here.</p>
            {/* Placeholder for attendance marking form or tools */}
        </div>
      </div>
    </MainLayout>
  );
}
