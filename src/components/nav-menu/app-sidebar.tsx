"use client";

import { useUserProfileFull } from "@/api/services/users/users.hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Activity,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Inbox,
  Users2,
} from "lucide-react";
import * as React from "react";
import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";
import { UserMenu } from "./user-menu";

// This is sample data.
const data = {
  user: undefined,
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inbox",
      url: "inbox",
      icon: Inbox,
      isActive: true,
    },
    { title: "Channels", url: "channels", icon: Activity },
    { title: "Users", url: "users", icon: Users2 },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userQuery = useUserProfileFull();

  const sidebarData = React.useMemo(() => {
    if (userQuery.isSuccess) {
      return {
        ...data,
        user: {
          email: userQuery.data.user.email,
          avatar: userQuery.data.profile?.avatar_url,
          lastName: userQuery.data.profile?.last_name,
          firstName: userQuery.data.profile?.first_name,
        },
      };
    }
    return data;
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
