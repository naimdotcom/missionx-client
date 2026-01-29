"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbConfig: Record<string, string> = {
  dashboard: "Dashboard",
  team: "Team",
  flow: "Flow",
  profile: "Profile",
  sessions: "Sessions",
  settings: "Settings",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  // Parse pathname into breadcrumb items
  const segments = pathname
    .split("/")
    .filter((segment) => segment && segment !== "dashboard");

  // Build breadcrumb items
  const breadcrumbs = [
    { href: "/dashboard", label: "Dashboard" },
    ...segments.map((segment, index) => {
      const href = "/dashboard/" + segments.slice(0, index + 1).join("/");
      const label = breadcrumbConfig[segment] || segment;
      return { href, label };
    }),
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            {index !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
