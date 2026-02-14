import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import * as React from "react";
import { MAIN_NAV_ITEMS } from "./const";
import NavHeader from "./nav-header";
import { NavMain } from "./nav-main";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigation = useNavigate();

  return (
    <Sidebar
      {...props}
      collapsible="icon"
      className="border-r border-border/50 bg-sidebar"
    >
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>

      <SidebarContent className="px-0 gap-0">
        <NavMain items={MAIN_NAV_ITEMS.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={location.pathname === "/settings"}
            onClick={() => navigation({ to: "/settings" })}
          >
            <Settings className="size-4" /> Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
