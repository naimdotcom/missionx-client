import type { CustomerResponse } from "@/api/services/crm/crm.types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";

export const crmColumns: ColumnDef<CustomerResponse>[] = [
  {
    id: "customer",
    header: "Customer",
    enableHiding: false,
    enableResizing: true,
    cell: ({ row }) => {
      const customer = row.original;
      const customMetadata = (customer.custom_metadata as any) || {};

      // Try to get name and pic from top level first, then custom_metadata
      const firstName = customer.first_name || customMetadata.first_name || "";
      const lastName = customer.last_name || customMetadata.last_name || "";
      const fullName =
        `${firstName} ${lastName}`.trim() || customer.username || "Unknown";

      const profilePic =
        customer.profile_pic_url || customMetadata.profile_pic_url;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profilePic} alt={fullName} />
            <AvatarFallback className="text-[10px]">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground line-clamp-1">
              {fullName}
            </span>
            {customer.username && customer.username !== fullName && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                @{customer.username}
              </span>
            )}
          </div>
        </div>
      );
    },
    size: 200,
    meta: {
      skeleton: (
        <div className="flex gap-4 items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ),
    },
  },
  {
    id: "email",
    header: "Email",
    enableResizing: true,
    accessorKey: "email",
    cell: ({ row }) => row.original.email || "—",
    meta: { skeleton: <Skeleton className="h-10 w-30" /> },
  },
  {
    id: "phone",
    header: "Phone",
    enableResizing: true,
    accessorKey: "phone",
    cell: ({ row }) => row.original.phone || "—",
    meta: { skeleton: <Skeleton className="h-10 w-30" /> },
  },
  {
    id: "platform",
    header: "Platform",
    enableResizing: true,
    accessorKey: "platform",
    cell: ({ row }) => {
      const platform = row.original.platform;
      if (!platform) return "—";
      return (
        <Badge variant="secondary" className="capitalize">
          {platform}
        </Badge>
      );
    },
    meta: { skeleton: <Skeleton className="h-10 w-30" /> },
  },
  {
    id: "tags",
    header: "Tags",
    accessorKey: "tags",
    enableResizing: true,
    cell: ({ row }) => {
      const tags = row.original.tags;
      if (!tags || tags.length === 0) return "—";
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <StatusBadge key={tag} variant="outline" className="text-xs">
              {tag}
            </StatusBadge>
          ))}
        </div>
      );
    },
    meta: { skeleton: <Skeleton className="h-10 w-30" /> },
  },
  {
    id: "is_active",
    header: "Status",
    enableResizing: true,
    accessorKey: "is_active",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <StatusBadge
          variant="secondary"
          status={isActive ? "active" : "inactive"}
        />
      );
    },
    meta: { skeleton: <Skeleton className="h-10 w-30" /> },
  },
  {
    id: "source",
    header: "Source",
    enableResizing: true,
    accessorKey: "source",
    cell: ({ row }) => {
      const source = row.original.source;
      if (!source) return "—";
      return <span className="capitalize">{source}</span>;
    },
    meta: { skeleton: <Skeleton className="h-10 w-30" /> },
  },
  {
    id: "created_at",
    header: "Created",
    enableResizing: true,
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = row.original.created_at;
      if (!date) return "—";
      return new Date(date).toLocaleDateString();
    },
    meta: { skeleton: <Skeleton className="h-10 w-30" /> },
  },
];
