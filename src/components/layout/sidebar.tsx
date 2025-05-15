
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  LogOut,
  UserCircle2,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/attendance",
    label: "Attendance",
    icon: Users,
  },
  {
    href: "/dashboard/leave",
    label: "Leave Management",
    icon: CalendarDays,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, open, setOpen } = useSidebar();

  const handleLogout = () => {
    // Here you might also want to clear any session/token
    router.push("/");
  };

  return (
    <ShadSidebar
      className={cn(
        "border-r border-sidebar-border",
        state === "collapsed" && "items-center"
      )}
    >
      <SidebarHeader className="flex items-center gap-3 p-4">
        <UserCircle2 className="h-10 w-10 text-sidebar-primary animate-pulse" data-ai-hint="user profile" />
        {state === "expanded" && (
          <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sidebar-primary via-sidebar-accent-foreground to-sidebar-primary">
            AI Command
          </h1>
        )}
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  variant="default"
                  className={cn(
                    "w-full justify-start",
                     pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" : "hover:bg-sidebar-accent/80"
                  )}
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    side: "right",
                    align: "center",
                    className: "bg-card text-card-foreground border-border shadow-md"
                  }}
                >
                  <item.icon className="h-5 w-5 mr-3 shrink-0" />
                  {state === "expanded" && <span>{item.label}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-sidebar-primary text-sidebar-primary hover:bg-sidebar-primary/10 hover:text-sidebar-primary group"
        >
          <LogOut className={cn("h-5 w-5", state === "expanded" && "mr-2")} />
          {state === "expanded" && "Logout"}
        </Button>
      </SidebarFooter>
    </ShadSidebar>
  );
}
