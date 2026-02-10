"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MAIN_NAV_ITEMS } from "./const";
import { NavMain } from "./nav-main";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigation = useNavigate();
  const { userProfile } = useAuthStore();

  const fullName = `${userProfile?.profile?.first_name || ""} ${
    userProfile?.profile?.last_name || ""
  }`.trim();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b py-1.5 p-[5px]">
        <SidebarMenuItem className="flex gap-2">
          <div className="border-2 rounded-full flex items-center justify-center">
            <Avatar className="size-7">
              <AvatarImage
                src={userProfile?.profile?.avatar_url}
                alt={fullName}
              />
              <AvatarFallback>
                {userProfile?.profile?.first_name?.charAt(0).toUpperCase() ||
                  "U"}
                {userProfile?.profile?.last_name?.charAt(0).toUpperCase() ||
                  "N"}
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
