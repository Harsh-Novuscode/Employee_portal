
"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, ShieldCheck } from "lucide-react";

export default function PolicyPage() {
  return (
    <MainLayout>
      <div className="w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
            Company Policies
          </h1>
          <p className="text-muted-foreground">Access and review company guidelines and policy documents.</p>
        </header>

        <Card className="shadow-xl rounded-md border border-border/60 bg-card hover:border-primary/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold text-primary">Policy Documents</CardTitle>
            <ShieldCheck className="h-8 w-8 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-muted-foreground mb-4">
              This section will provide access to various company policy documents.
              Please check back later for updates.
            </CardDescription>
            <div className="mt-6 p-6 rounded-md bg-input/50 border border-dashed border-border/50 flex flex-col items-center justify-center h-60 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Policy documents are currently being organized.
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                You'll find links to HR policies, code of conduct, IT security guidelines, and more here soon.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future sections like "Policy Updates" or "Search Policy" */}
        <div className="mt-8">
          {/* <Card>
            <CardHeader><CardTitle>Recent Policy Updates</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">No recent updates.</p></CardContent>
          </Card> */}
        </div>
      </div>
    </MainLayout>
  );
}
