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
  Settings,
} from "lucide-react";
import * as React from "react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-users";
import { TeamSwitcher } from "./team-switcher";

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
    {
      title: "Channels",
      url: "#",
      icon: Activity,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userQuery = useUserProfileFull();

  const sidebarData = React.useMemo(() => {
    if (userQuery.isSuccess) {
      return {
        ...data,
        user: {
          name: undefined,
          avatar: undefined,
          email: userQuery.data.user.email,
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
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {sidebarData.user && <NavUser user={sidebarData.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
