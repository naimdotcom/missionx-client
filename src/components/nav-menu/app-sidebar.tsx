"use client";

import { useUserProfileFull } from "@/api/services/users/users.hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import * as React from "react";
import { MAIN_NAV_ITEMS } from "./const";
import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";
import { UserMenu } from "./user-menu";

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userQuery = useUserProfileFull();

  const sidebarData = React.useMemo(() => {
    if (userQuery.isSuccess) {
      return {
        ...MAIN_NAV_ITEMS,
        user: {
          email: userQuery.data.user.email,
          avatar: userQuery.data.profile?.avatar_url,
          lastName: userQuery.data.profile?.last_name,
          firstName: userQuery.data.profile?.first_name,
        },
      };
    }
    return MAIN_NAV_ITEMS;
  }, [userQuery.data]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {sidebarData.user && <UserMenu user={sidebarData.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
