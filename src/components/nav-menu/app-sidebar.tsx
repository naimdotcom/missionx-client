"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { Settings } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MAIN_NAV_ITEMS } from "./const";
import { NavMain } from "./nav-main";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userProfile } = useAuthStore();

  const fullName = `${userProfile?.profile?.first_name || ""} ${
    userProfile?.profile?.last_name || ""
  }`.trim();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuItem className="flex gap-2 border-b-2 pb-2 ">
          <div className="border-2 rounded-full p-1.5">
            <Avatar className="size-6">
              <AvatarImage src={userProfile?.profile?.avatar_url} />
              <AvatarFallback>
                {userProfile?.profile?.first_name?.charAt(0).toUpperCase()}
                {userProfile?.profile?.last_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{fullName}</span>
              <span className="truncate text-xs">
                {userProfile?.user.email}
              </span>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={MAIN_NAV_ITEMS.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Settings className="size-4" /> Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
