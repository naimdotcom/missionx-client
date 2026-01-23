// Navigation links for the sidebar

import { Link, useRouterState } from "@tanstack/react-router";
import { Inbox, LogOut, Settings, UserCog, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import { useAuthStore } from "~/stores/auth-store";

const navItems = [
  {
    label: "Inbox",
    icon: Inbox,
    to: "/inbox",
  },
  {
    label: "Customers",
    icon: Users,
    to: "/customers",
  },
  {
    label: "Agents",
    icon: UserCog,
    to: "/agents",
  },
  {
    label: "Settings",
    icon: Settings,
    to: "/settings",
  },
];

export const NavLinks = () => {
  const { logout } = useAuthStore();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md",
                    "transition-colors duration-150",
                    "text-sm font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t p-3">
        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md w-full",
            "transition-colors duration-150",
            "text-sm font-medium",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
          )}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
