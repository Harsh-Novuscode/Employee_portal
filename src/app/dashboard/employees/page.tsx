
"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UsersRound } from "lucide-react";

export default function EmployeesPage() {
  return (
    <MainLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Employee Management
          </h1>
          <p className="text-muted-foreground">View and manage employee details.</p>
        </header>

        <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold text-primary">Employee List</CardTitle>
            <UsersRound className="h-8 w-8 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-muted-foreground mb-4">
              A list of all employees will be displayed here.
            </CardDescription>
            <div className="mt-4 h-60 rounded-md bg-input/50 flex items-center justify-center border border-dashed border-border">
              <p className="text-muted-foreground text-sm">Employee data table coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
