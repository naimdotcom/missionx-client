"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  const navigate = useNavigate();
  return (
    <SidebarGroup className="flex flex-col gap-1">
      {items.map((item) => {
        // If no items, render as a simple link
        if (!item.items || item.items.length === 0) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
              >
                <a
                  onClick={() => navigate({ href: item.url })}
                  className="flex items-center gap-2"
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
