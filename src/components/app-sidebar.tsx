"use client";

import * as React from "react";
import { BotMessageSquare, ChevronsUpDown, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedApp } from "@/store/appSlice";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateAppDialog } from "./create-app-dialog";
import { useState } from "react";

// Keep the sample data for navMain for now, but replace the header part
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    // ... (rest of the data is fine to keep static for this task unless asked otherwise)
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const { apps, selectedApp } = useSelector((state: RootState) => state.app);
  const [isCreateAppOpen, setIsCreateAppOpen] = useState(false);

  const handleAppChange = (app: (typeof apps)[0]) => {
    dispatch(setSelectedApp(app));
    localStorage.setItem("selectedApp", JSON.stringify(app));
    // Cookie management removed as per request
  };

  return (
    <>
      <Sidebar variant="floating" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      {/* dynamic icon could go here */}
                      <BotMessageSquare className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {selectedApp?.name || "Select App"}
                      </span>
                      <span className="truncate text-xs">
                        {selectedApp?.user_role?.toLowerCase() || "Role"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Apps
                  </DropdownMenuLabel>
                  {apps.map((app) => (
                    <DropdownMenuItem
                      key={app.id}
                      onClick={() => handleAppChange(app)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <BotMessageSquare className="size-4 shrink-0" />
                      </div>
                      {app.name}
                      <DropdownMenuShortcut className="text-[10px]">
                        {app?.short_id}
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 p-2"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <CreateAppDialog
                      open={isCreateAppOpen}
                      onOpenChange={setIsCreateAppOpen}
                    >
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                          <Plus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">
                          Add App
                        </div>
                      </div>
                    </CreateAppDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={item.url}>{item.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
