import type { CustomerResponse } from "@/api/services/crm/crm.types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";

export const crmColumns: ColumnDef<CustomerResponse>[] = [
  {
    id: "customer",
    header: "Customer",
    enableHiding: false,
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
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "—",
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "—",
  },
  {
    id: "platform",
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => {
      const platform = row.original.platform;
      if (!platform) return "—";
      return (
        <Badge variant="secondary" className="capitalize">
          {platform}
        </Badge>
      );
    },
  },
  {
    id: "tags",
    accessorKey: "tags",
    header: "Tags",
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
  },
  {
    id: "is_active",
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <StatusBadge
          variant="secondary"
          status={isActive ? "active" : "inactive"}
        />
      );
    },
  },
  {
    id: "source",
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.original.source;
      if (!source) return "—";
      return <span className="capitalize">{source}</span>;
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.created_at;
      if (!date) return "—";
      return new Date(date).toLocaleDateString();
    },
  },
];
