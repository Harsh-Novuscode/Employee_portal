
"use client";

import * :as React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";


export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-900/40 text-foreground">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/60 bg-card/80 px-6 backdrop-blur-sm md:hidden">
             <SidebarTrigger className="text-primary hover:text-primary/80">
                <PanelLeft className="h-6 w-6" />
                <span className="sr-only">Toggle Sidebar</span>
             </SidebarTrigger>
             <h1 className="text-lg font-semibold text-primary">AI Command</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
          <footer className="mt-auto p-4 text-center text-xs text-muted-foreground/70 border-t border-border/30">
            &copy; {new Date().getFullYear()} AI Corp Systems. Secure Interface v3.0.
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
