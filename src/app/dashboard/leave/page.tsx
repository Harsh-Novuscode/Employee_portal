
"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlaneTakeoff, CalendarX2 } from "lucide-react";

export default function LeavePage() {
  return (
    <MainLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Leave Management
          </h1>
          <p className="text-muted-foreground">Apply for leave and view your leave status.</p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="shadow-lg rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">Apply for Leave</CardTitle>
                    <PlaneTakeoff className="h-8 w-8 text-accent" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground">
                        Submit new leave requests here.
                    </CardDescription>
                    <div className="mt-4 h-40 rounded-md bg-input/50 flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Leave application form will appear here.</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-lg rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold text-primary">My Leave Status</CardTitle>
                    <CalendarX2 className="h-8 w-8 text-primary" />
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-sm text-muted-foreground">
                        Check the status of your submitted leave requests and history.
                    </CardDescription>
                     <div className="mt-4 h-40 rounded-md bg-input/50 flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Leave status details will be here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
         <div className="mt-8 p-6 bg-card border border-border/60 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold text-primary mb-3">Leave Balance</h2>
            <p className="text-muted-foreground">Information about remaining leave days will be displayed here.</p>
            {/* Placeholder for leave balance display */}
        </div>
      </div>
    </MainLayout>
  );
}
