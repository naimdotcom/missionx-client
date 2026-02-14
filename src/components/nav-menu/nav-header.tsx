import { useListApps } from "@/api/services/apps/apps.hook";
import { useAuthStore } from "@/stores/auth-store";
import { ChevronsUpDown, Globe2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

function NavHeader() {
  const { open } = useSidebar();
  const { selectedApp, setSelectedApp } = useAuthStore();
  const myAppsQuery = useListApps({ page: "1", page_size: "10" });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="text-2xl font-bold pb-2 ml-1">
          {open ? "MissionX" : "M"}
        </div>

        {myAppsQuery.isPending && (
          <Skeleton className="w-full h-10 rounded-xl" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full h-10 rounded-lg gap-2 bg-background border"
            >
              <div className="bg-border ml-[3px] flex aspect-square size-6 items-center justify-center rounded-lg">
                <Globe2 className="size-4" />
              </div>
              <span className="flex-1 text-left truncate text-foreground/80">
                {selectedApp?.name || "Select Project"}
              </span>
              <ChevronsUpDown className="size-3 text-muted-foreground/80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Apps
            </DropdownMenuLabel>
            {myAppsQuery.data?.apps?.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setSelectedApp(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Globe2 className="size-3.5 shrink-0" />
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add App</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavHeader;
