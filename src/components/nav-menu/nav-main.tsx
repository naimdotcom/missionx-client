"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
    // Check if the URL matches or is a prefix match
    return pathname.includes(itemUrl) || pathname.endsWith(itemUrl);
  };

  return (
    <SidebarGroup className="flex flex-col gap-1">
      {items.map((item) => {
        // If no items, render as a simple link
        if (!item.items || item.items.length === 0) {
          const active = isActive(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                <a
                  onClick={() => navigate({ href: item.url })}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {item.icon && <item.icon />}
                  <span className="text-[14.5px]">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
      })}
    </SidebarGroup>
  );
}
