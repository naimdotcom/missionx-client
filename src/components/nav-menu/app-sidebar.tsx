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
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={MAIN_NAV_ITEMS.navMain} />
      </SidebarContent>

      <SidebarFooter className="px-2 py-3">
        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer"
            isActive={location.pathname.includes("/settings")}
            onClick={() => navigation({ to: "/settings" })}
          >
            <Settings className="size-4.25 transition-colors" />
            <span className="text-[15.5px] transition-colors">Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
