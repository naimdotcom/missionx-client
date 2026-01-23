// Global sidebar with dual-pane architecture

import { cn } from "~/lib/utils";
import { useUIStore } from "~/stores/ui-store";
import { NavLinks } from "./nav-links";

export const GlobalSidebar = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div
      className={cn(
        "flex h-screen border-r bg-background transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-72",
      )}
    >
      {/* Level 2: Navigation */}
      {!sidebarCollapsed && (
        <div className="flex-1 flex flex-col">
          <NavLinks />
        </div>
      )}
    </div>
  );
};
