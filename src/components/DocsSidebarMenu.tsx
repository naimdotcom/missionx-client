"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Code2,
  Workflow,
  MessageSquare,
  Settings2,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
} from "lucide-react";

export const documentationMenu = [
  {
    title: "Introduction",
    items: [{ title: "System Overview", href: "/docs", icon: BookOpen }],
  },
  {
    title: "Management API (8500)",
    items: [
      { title: "Apps Management", href: "/docs/management/apps", icon: Layers },
      {
        title: "Flows & Nodes",
        href: "/docs/management/flows",
        icon: Workflow,
      },
      {
        title: "Message Templates",
        href: "/docs/management/templates",
        icon: Database,
      },
    ],
  },
  {
    title: "Messaging API (8006)",
    items: [
      {
        title: "Channel Config",
        href: "/docs/messaging/channels",
        icon: Settings2,
      },
      {
        title: "Direct Messaging",
        href: "/docs/messaging/direct",
        icon: MessageSquare,
      },
      { title: "Webhook Flow", href: "/docs/webhooks", icon: ShieldCheck },
    ],
  },
  {
    title: "Technical Spec",
    items: [
      { title: "JSON Payload Spec", href: "/docs/payload", icon: Code2 },
      { title: "App Service Logic", href: "/docs/app-service", icon: Cpu },
      { title: "Environment Setup", href: "/docs/setup", icon: Settings2 },
    ],
  },
];

export function DocsSidebarMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
      {documentationMenu.map((section) => (
        <div key={section.title} className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 px-2">
            {section.title}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all group",
                      isActive
                        ? "bg-black text-white"
                        : "hover:bg-black/5 text-black/70 hover:text-black"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 stroke-[2.5px]",
                        isActive
                          ? "text-white"
                          : "text-black/40 group-hover:text-black"
                      )}
                    />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
