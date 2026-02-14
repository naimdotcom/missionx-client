import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "@tanstack/react-router";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: { title: string; url: string }[];
  }[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (itemUrl: string) => {
    const pathname = location.pathname;
    return pathname === `/${itemUrl}` || pathname.includes(`/${itemUrl}`);
  };

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarMenu className="gap-1">
        {items.map((item) => {
          // If no items, render as a simple link
          if (!item.items || item.items.length === 0) {
            const active = isActive(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={active}
                  className={cn("px-3 transition-all duration-200")}
                >
                  <div
                    onClick={() => navigate({ href: item.url })}
                    className="cursor-pointer flex items-center gap-3 w-full"
                  >
                    <div>
                      {item.icon && (
                        <item.icon
                          className={cn("size-[17px] transition-colors")}
                        />
                      )}
                    </div>
                    <span className="text-[15.5px] transition-colors">
                      {item.title}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
