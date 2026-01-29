"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { useGetMyProfileQuery } from "@/store/api/authApi";
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
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
import { Separator } from "@/components/ui/separator";
import {
  User,
  Shield,
  Home,
  BotMessageSquare,
  ChevronsUpDown,
  Plus,
  Workflow,
  Users,
} from "lucide-react";
import { RootState } from "@/store/store";
import { setSelectedApp } from "@/store/appSlice";
import { CreateAppDialog } from "@/components/create-app-dialog";
import { NavUser } from "@/components/nav-user";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { apps, selectedApp } = useSelector((state: RootState) => state.app);
  const [isCreateAppOpen, setIsCreateAppOpen] = useState(false);

  // Get profile data
  const { data: profileData } = useGetMyProfileQuery(undefined);

  const isActive = (href: string) => pathname === href;

  const handleAppChange = (app: (typeof apps)[0]) => {
    dispatch(setSelectedApp(app));
    localStorage.setItem("selectedApp", JSON.stringify(app));
  };

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/dashboard/team",
      label: "Team",
      icon: Users,
    },
    {
      href: "/dashboard/flow",
      label: "Flow",
      icon: Workflow,
    },

    {
      href: "/dashboard/sessions",
      label: "Sessions",
      icon: Shield,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-neutral-200 dark:border-neutral-800">
        <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-800 px-2 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-neutral-100 dark:data-[state=open]:bg-neutral-800"
                  >
                    <div className="bg-neutral-900 dark:bg-neutral-50 text-white dark:text-black flex aspect-square h-8 w-8 items-center justify-center rounded-lg">
                      <BotMessageSquare className="h-4 w-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-neutral-900 dark:text-neutral-50">
                        {selectedApp?.name || "Dashboard"}
                      </span>
                      <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {selectedApp?.user_role?.toLowerCase() || "Account"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-neutral-500 dark:text-neutral-400">
                    Apps
                  </DropdownMenuLabel>
                  {apps.map((app) => (
                    <DropdownMenuItem
                      key={app.id}
                      onClick={() => handleAppChange(app)}
                      className="gap-2 p-2"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-sm border border-neutral-200 dark:border-neutral-800">
                        <BotMessageSquare className="h-4 w-4 shrink-0" />
                      </div>
                      {app.name}
                      <DropdownMenuShortcut className="text-[10px] text-neutral-500">
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
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                          <Plus className="h-4 w-4" />
                        </div>
                        <div className="font-medium text-neutral-600 dark:text-neutral-400">
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
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-50 dark:hover:bg-neutral-900",
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Profile Section Footer */}
        <SidebarFooter className="">
          <NavUser
            user={{
              name: profileData?.profile?.first_name || "...",
              email: profileData?.user?.email || "...",
              avatar: profileData?.profile?.avatar_url || "",
            }}
          />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <SidebarTrigger className="-ml-2" />
          <DashboardBreadcrumb />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-6xl mx-auto">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
